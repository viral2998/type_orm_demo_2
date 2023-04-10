import { Request, Response, NextFunction } from "express"; 
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
const userRepository = AppDataSource.getRepository(User);

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | NextFunction> => {
  const { email, password } = req.body;
  var barerToken = req.headers["authorization"];
  if (!barerToken)
    return res.status(401).send({ message: "Unauthorized user" });

  const checkToken = await userRepository.findOneBy({
    email: email,
    password: password,
    auth_token: barerToken,
  });

  if (!checkToken) return res.status(498).send({ message: " Invalid Token" });
 
  next();
};

export default auth;
