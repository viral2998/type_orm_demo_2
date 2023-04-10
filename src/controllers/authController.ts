import { AppDataSource } from "../data-source";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { User } from "../entity/User";
import { CustomResponse } from "../entity/CustomResponse";
import { ClassRoom } from "../entity/Class";

const userRespository = AppDataSource.getRepository(User);
const classRoomRepository = AppDataSource.getRepository(ClassRoom);

const login = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  const { email, password, user_role, type } = req.body;

  try {
    const user:User = await userRespository.findOneBy({
      email: email,
      password: password,
      user_role: user_role,
    });
    // res.message
    if (!user) return res.status(401).send({message:"xys"});

    let token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.API_KEY,
      { expiresIn: "1h" }
    );

    //save auth token
    user.auth_token = token;
    await AppDataSource.manager.save(user);

    return res.status(200).json({ data: user, token, msg: "Logged in!" });
  } catch (error) {
    throw new Error(error);
  }
};

const userSave = async (req: Request, user: any): Promise<any | void> => {
  let { class_id, user_role, name, email, password, user_id } = req.body;
  user.user_role = user_role;
  user.name = name;
  user.email = email;
  user.password = password;
  if (class_id && user_role == "student") user.class_id = class_id;
  await AppDataSource.manager.save(user);
};

const register = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {

  const { user_role, email, user_id, class_id } = req.body;

  if (class_id && user_role == "student") {
    const checkClassRoom: ClassRoom = await classRoomRepository.findOneBy({
      id: class_id,
    });

    if (!checkClassRoom)
      return res.status(404).send({ message: "Class not found" });
  }

  if (user_id) {
    const user: User = await userRespository.findOneBy({
      id: user_id,
    });

    if (!user)
      return res.status(404).send({
        message: "User not  found",
      });
    
      //user save 
    await userSave(req, user);
    return res.status(200).json({ mesasge: "User data updated" });
  } else {
    const checkEmail: User = await userRespository.findOneBy({
      email: email,
      user_role: user_role,
    });

    if (checkEmail)
      return res.status(400).json({ mesasge: "User allready exist" });

    let user: User = new User();
    await userSave(req, user);
    return res
      .status(200)
      .json({ mesasge: "Thnak you for register as " + `${user.user_role}` });
  }
};

 
export default { login, register };
