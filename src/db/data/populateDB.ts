import * as dotenv from "dotenv";
const res = dotenv.config()
if(res.error){
    console.log(`Error loading env vars: ${res.error} \n Exiting.`)
    process.exit(1)
}
import "reflect-metadata"
import {COURSES} from "./db-data"
import { logger } from "../../utils/logger";
import { AppDataSource } from "../dataSource";
import { Course } from "../models/course";
import {DeepPartial} from "typeorm"
import { Lesson } from "../models/lesson";


async function populateDB() {
    await AppDataSource.initialize();
    logger.info("DB ready")

    const courses = Object.values(COURSES) as DeepPartial<Course>[];

    const courseRepository = AppDataSource.getRepository(Course)
    
    const lessonRepository = AppDataSource.getRepository(Lesson)

    for(const courseData of courses){
        logger.info(`Inserting course ${courseData.title}`)
        const course = courseRepository.create(courseData);
        await courseRepository.save(course);

        for(const lessonData of courseData.lessons){
            logger.info(`Inserting lesson ${lessonData.title}`)
            const lesson = lessonRepository.create(lessonData);
            lesson.course = course
            await lessonRepository.save(lesson)
        }
    }
    
    const totalCourses = await courseRepository.createQueryBuilder().getCount();
    const totalLessons = await lessonRepository.createQueryBuilder().getCount();

    logger.info(`Inserted ${totalCourses} courses and ${totalLessons} lessons`)
}
populateDB().then( () => {
    logger.info("Data inserted successfully, exiting")
    process.exit(0);
}).catch(err => logger.error(err))