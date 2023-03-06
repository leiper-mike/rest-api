import * as dotenv from "dotenv";
const res = dotenv.config()
if(res.error){
    console.log(`Error loading env vars: ${res.error} \n Exiting.`)
    process.exit(1)
}
import "reflect-metadata"
import { logger } from "../../utils/logger";
import { AppDataSource } from "../dataSource";
import { Course } from "../models/course";
import { Lesson } from "../models/lesson";

async function deleteDb() {
    await AppDataSource.initialize();
    logger.info("DB ready")

    logger.info(`Deleting lessons`)

    await AppDataSource.getRepository(Lesson).delete({})

    logger.info(`Deleting courses`)

    await AppDataSource.getRepository(Course).delete({})
}
deleteDb().then( () => {
    logger.info("Data deleted successfully, exiting")
    process.exit(0);
}).catch(err => logger.error(err)) 