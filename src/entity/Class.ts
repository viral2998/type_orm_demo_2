import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";

import { User } from "./User";
import { DbEntity } from "../db-extenders/index";  

@Entity()
export class ClassRoom extends DbEntity {
  @Column()
  teacher_id: Number;

  @Column()
  name: string;

  @OneToOne(() => User, (teacher: User) => teacher.classRoom)
  @JoinColumn({ name: "teacher_id" })
  teacher: User;

  @OneToMany(() => User, (students: User) => students.studentClass) 
  students : User[] ;
 
   
}
