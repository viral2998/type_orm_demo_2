import * as express from "express"; 
import userController from "../controllers/userController";

const router = express.Router();
router.post("/accept-decliner", userController.acceptDecline);
router.post("/profile-upload", userController.profileUpload);
router.post("/delete-user", userController.deleteUser);
router.post("/logout" , userController.logOut)

export default router;
