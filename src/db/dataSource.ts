import { DataSource } from "typeorm";
import { isInt } from "../utils/utils";
import { config } from "../utils/config";
import { Course } from "./models/course";
import { Lesson } from "./models/lesson";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.DBHost,
    port: isInt(config.DBPort) ? parseInt(config.DBPort): 5432,
    username: config.DBUser,
    password: config.DBPass,
    database: config.DBName,
    ssl: true,
    extra: {
        ssl:{
            rejectUnauthorized: false
        }
    },
    entities: [
        Course,
        Lesson
    ],
    synchronize: true,
    logging:true
})
