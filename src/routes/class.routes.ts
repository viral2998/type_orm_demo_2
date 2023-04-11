import * as express from "express";
import classController from "../controllers/classController";
const router = express();

router.post("/create-class", classController.addClass);
router.post("/class-list", classController.classList);
router.post(
  "/class-list-query-builder",
  classController.classessListQueryBuilder
);
router.post("/delete-class-room", classController.deleteClass);
router.post("/student-list" , classController.studentList)
router.post("/time-frame", classController.timeFrame);

export default router;
