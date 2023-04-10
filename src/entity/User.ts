import {
  Entity,
  Column,
  OneToOne, 
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { DbEntity } from "../db-extenders";
import { ClassRoom } from "./Class";

export enum userRole {
  admin = "admin",
  teachrt = "teacher",
  student = "student",
}

export enum isActive {
  "true" = 1,
  "false" = 0,
}

@Entity()
export class User extends DbEntity {
  @Column({
    type: "enum",
    enum: userRole,
    default: userRole.student,
  })
  user_role: userRole;

  @Column({
    default: null,
    nullable: true,
  })
  class_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  profile: string;

  @Column({
    type: "enum",
    enum: isActive,
    default: isActive.true,
  })
  is_active: isActive;

  @Column({
    type: "enum",
    enum: isActive,
    default: isActive.false,
  })
  is_accept: isActive;

  @Column({
    nullable: true,
    default: null,
  })
  auth_token: string;

  @OneToOne(() => ClassRoom, (classRoom: ClassRoom) => classRoom.teacher)
  classRoom: ClassRoom;

  @ManyToOne(
    () => ClassRoom,
    (studentClass: ClassRoom) => studentClass.students
  )
  @JoinColumn({ name: "class_id" })
  studentClass: ClassRoom;
}
