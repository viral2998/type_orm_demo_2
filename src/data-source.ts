import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { ClassRoom } from "./entity/Class";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Password@123",
  database: "type_orm",
  synchronize: true,
  logging: false,
  entities: [User, ClassRoom],
  migrations: [],
  subscribers: [],
});
