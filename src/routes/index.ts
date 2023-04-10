import * as express from "express"
import UserRouter from "./user.routes";
import authRouter from "./auth.routes"; 
import classRouter from "./class.routes"  
import auth from '../middleware/authMiddleWare';

const router = express.Router();

router.use("/user",auth, UserRouter);
router.use("/auth", authRouter); 
router.use("/class",auth,classRouter) 

export default router;
