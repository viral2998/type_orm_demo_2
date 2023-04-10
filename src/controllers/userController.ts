import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request } from "express";
import * as path from "path";
import * as fs from "fs-extra";
import { CustomResponse } from "../entity/CustomResponse";
import * as jwt from "jsonwebtoken";

const userRespository = AppDataSource.getRepository(User);

const acceptDecline = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  const { student_id, ise_accept } = req.body;

  try {
    const checkStudent: User = await userRespository.findOneBy({
      id: student_id,
    });
    if (!checkStudent) return res.status(404).send();

    if (checkStudent.user_role != "student") {
      return res.status(404).send();
    }

    checkStudent.is_accept = ise_accept;
    await AppDataSource.manager.save(checkStudent);

    if (checkStudent.is_accept == 1) return res.status(200).send();
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({ message: "Somtheing went wrong" });
  }
};

const fileUpload = async (
  image: any,
  StudentProifle: any
): Promise<void | never> => {
  // console.log(images);

  const tempFilePath: any = image.path;

  const fileName: any = path.basename(tempFilePath);

  try {
    StudentProifle.profile = fileName;
    await AppDataSource.manager.save(StudentProifle);

    const projectFilePath = path.join(
      __dirname,
      "../../images/student_images/" + fileName
    );

    fs.move(tempFilePath, projectFilePath, function (err: any) {
      if (err) throw err;
      return true;
    });
  } catch (error) {
    console.error(error);
  }
};

const profileUpload = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  const auth = jwt.verify(req.headers["authorization"], process.env.API_KEY);
  const student_id = auth.id;
  const { image } = req.body;

  try {
    const findStudent: User = await userRespository.findOneBy({
      id: student_id,
    });

    if (!findStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    //check is it student or not
    if (findStudent && findStudent.user_role != "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (findStudent.is_accept == 1) {
      await fileUpload(image, findStudent);
      return res.status(200).json({ message: "Image uploaded" });
    } else {
      return res.status(400).json({ message: "Not able to upload image" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  const auth = jwt.verify(req.headers["authorization"], process.env.API_KEY);
  const user_id = auth.id;

  try {
    const checUser = await userRespository.findOneBy({ id: user_id });

    if (!checUser) return res.status(404).send({ message: "User not found" });

    await userRespository.softDelete({ id: user_id });

    return res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
};

const logOut = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  const auth = jwt.verify(req.headers["authorization"], process.env.API_KEY);

  try {
    const user = await userRespository.findOneBy({ id: auth.id });
    user.auth_token = null;
    await AppDataSource.manager.save(user);
    return res.status(200).send({ message: "Logged out" });
  } catch (error) {
    throw new Error(error);
  }
};

export default { acceptDecline, profileUpload, deleteUser, logOut };
