import { Request, Response, response } from "express";
import { AppDataSource } from "../data-source";
import { ClassRoom } from "../entity/Class";
import { User } from "../entity/User";
import { CustomResponse } from "../entity/CustomResponse";
import * as moment from "moment";

const userRepository = AppDataSource.getRepository(User);
const classRoomRepository = AppDataSource.getRepository(ClassRoom);

const addClass = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  const { teacher_id, name, class_id } = req.body;
  if (!teacher_id)
    return res.status(404).json({ message: "Please select teacher" });

  const checkTeacher: User = await userRepository.findOneBy({ id: teacher_id });

  if (!checkTeacher)
    return res.status(404).json({ message: "Teacher not found" });

  if (class_id) {
    const findClass = await AppDataSource.getRepository(ClassRoom)
      .createQueryBuilder("classroom")
      .where("id  =:id", { id: class_id })
      .getOne();
    console.log(findClass);

    if (!findClass)
      return res.status(404).json({ message: "Classroom not found" });

    await AppDataSource.createQueryBuilder()
      .update(ClassRoom)
      .set({ name: name, teacher_id: teacher_id })
      .where("id =:id", { id: findClass.id })
      .execute();
    return res.status(200).json({ message: "Classroom updated" });
  } else {
    // Insert record uising query builder
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(ClassRoom)
      .values({
        name: name,
        teacher_id: teacher_id,
      })
      .execute();

    return res.status(200).json({ message: "Classroom created" });
  }
};

const classList = async (
  req: Request,
  res: CustomResponse
): Promise<CustomResponse> => {
  try {
    let classessList: any = await classRoomRepository.find({
      relations: {
        teacher: true,
        students: true,
      },
      order: {
        id: "DESC",
      },
    });

    // classessList = await Promise.all(
    //   classessList.map(async (val: any) => {
    //     const students: any = await userRepository.findBy({
    //       class_id: val.id,
    //     });

    //     return {
    //       ClassRoom: val.name,
    //       teacher: val.teacher,
    //       students: students,
    //     };
    //   })
    // );

    // let  classessList = await AppDataSource.manager.find(ClassRoom,{
    //     where :{
    //        name : "class1"
    //     }

    // })

    return res.json({ data: classessList });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteClass = async (req: Request, res: CustomResponse) => {
  //Delete class room usnig delete quiry  builder
  const { class_id } = req.body;
  if (class_id) {
    const findClass = await AppDataSource.getRepository(ClassRoom)
      .createQueryBuilder("classroom")
      .where("id  =:id", { id: class_id })
      .getOne();

    if (!findClass)
      return res.status(404).json({ message: "Classroom not found" });

    await AppDataSource.createQueryBuilder()
      .softDelete()
      .from(ClassRoom)
      .where("id =:id", { id: findClass.id })
      .execute();

    return res.status(200).json({ message: "Classroom deleted" });
  }
};

const classessListQueryBuilder = async (
  req: Request,
  res: Response
): Promise<any> => {
  //Using DataSource:
  //const user =await AppDataSource.manager.createQueryBuilder().select("user").from(User,"user").where("user.id = :id", {id : 4}).getOne()

  //using entity manager
  // const user = await AppDataSource.manager.createQueryBuilder(User , "user").where("user.id =:id" , { id : 5}).getOne()

  //Using repository:
  //const clssess = await AppDataSource.getRepository(User).createQueryBuilder("user").where("user.id  =:id " ,{ id:1}).getOne()

  //Query builder using  relation classroom has only one classteacher
  const classes = await AppDataSource.createQueryBuilder(ClassRoom, "classroom")
    .leftJoinAndSelect(
      "classroom.teacher",
      "teacher",
      "teacher.user_role = :user_role",
      { user_role: "teacher" }
    )
    .leftJoinAndSelect("classroom.students", "studnet")
    .where("studnet.is_active =:is_active", { is_active: "1" })
    .getMany();

  // const students = await  AppDataSource.createQueryBuilder(ClassRoom,"classroom")
  // .leftJoinAndSelect(User, "students", "students.class_id = classroom.id")
  // .getMany()

  //has many relation
  const students = await AppDataSource.createQueryBuilder(
    ClassRoom,
    "classroom"
  )
    .leftJoinAndSelect("classroom.students", "studnet")
    .getMany();

  return res.status(200).json(classes);
};

const timeFrame = (req: Request, res: CustomResponse): any => {
  let { start_time, end_time, slot } = req.body;

  //convert date to momnet
  const startDate = moment(start_time);
  const endDate = moment(end_time);

  //Get different from two time
  const minutesDiff = endDate.diff(startDate, "minutes");

  //  console.log("nnn ", nnn);
  //  var minutesDiff : any= moment.utc(moment(endDate, "HH:mm:ss").diff(moment(startDate, "HH:mm:ss"))).format("mm")
  // const hoursDiff: number = endDate.minute() - startDate.minute();

  //get frame
  let frmae: number = minutesDiff / slot;

  //set updated data to
  let result: Array<object> = [];
  let newSatrtDate: any;
  let newEndDate: any;

  //if new start date is not for the first time set it set first start date to newDate
  if (!newSatrtDate) newSatrtDate = moment(start_time);

  for (let index = 1; index <= slot; index++) {
    newEndDate = moment(startDate.add(frmae, "minutes"));
    let object: object = {
      name: "slot" + index,
      startTime: moment(newSatrtDate).format("YY-MM-DD HH:mm:ss"),
      endTime: moment(newEndDate).format("YY-MM-DD HH:mm:ss"),
    };
    //Assign end date to start date
    newSatrtDate = newEndDate;
    result.push(object);
  }

  return res.status(200).json({ data: result });
};

const studentList = async (req: Request, res: CustomResponse) => {
  //Pagination logic
  let { page, per_page } = req.body;
  if (page == 0) page = 1;
  page = page - 1;
  let offset: number = page * per_page;

  const studetns = await AppDataSource.createQueryBuilder(User, "user")
    .limit(per_page)
    .offset(offset)
    .getMany();

  return res.status(200).send({ studetns });
};

export default {
  addClass,
  classList,
  classessListQueryBuilder,
  deleteClass,
  timeFrame,
  studentList,
};
