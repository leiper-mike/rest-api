import { Response, Request, NextFunction } from "express";
import { COURSES } from "../db/data/db-data";
import { AppDataSource } from "../db/dataSource";
import { Course } from "../db/models/course";
import { Lesson } from "../db/models/lesson";
import { logger } from "../utils/logger";
import {isInt} from "../utils/utils";

export async function getAllCourses(request: Request, response: Response, next:NextFunction){
    logger.info("Getting courses");
    try {
        const courses = await AppDataSource
        .getRepository(Course)
        .createQueryBuilder("courses")
        .leftJoinAndSelect("courses.lessons", "LESSONS")
        .orderBy("courses.seqNo")
        .getMany();

        response.status(200).json({courses: courses})
        
        logger.info("Courses sent")
    } catch (error) {
        logger.error(`Error calling getAllCourses: ${error}`)
        return next(error)
    }
    
}

export async function findCourseByUrl(request: Request, response: Response, next:NextFunction) {

    try {
        logger.info("Running findCourseByUrl")
        const courseUrl = request.params.courseUrl;
        if(!courseUrl){
            throw new Error("Could not extract course URL from request")
        }
        const course = await AppDataSource
        .getRepository(Course)
        .findOneBy({
            url: courseUrl
        });
        if(!course){
            response.status(404).json({message: `Could not find a course with URL: ${courseUrl}`})
            logger.error(`Could not find a course with URL: ${courseUrl}`)
            return;
        }
        const lessonsCount = await AppDataSource
        .getRepository(Lesson)
        .createQueryBuilder("LESSONS")
        .where("LESSONS.courseId = :courseId", {
            courseId: course.id
        })
        .getCount()

        response.status(200).json({
            course,
            lessonsCount
        })
        
    } catch (error) {
        logger.error(`Error calling findCourseByUrl: ${error}`);
        return next(error)
    }
    
}

export async function findCourseLessons(request: Request, response: Response, next:NextFunction) {
    try {
        logger.info("Running findCourseLessons")
        const courseId = request.params.courseId;
        const query = request.query as any,
                        pageNumber = query?.pageNumber ?? "0",
                        pageSize = query?.pageSize ?? "5";
        {
            if(!isInt(courseId)){
                throw new Error(`Could not extract valid course ID from request: ${courseId}`)
            }
            if(!isInt(pageNumber)){
                throw new Error(`Could not extract valid page number from request: ${pageNumber}`)
            }
            if(!isInt(pageSize)){
                throw new Error(`Could not extract valid page size from request: ${pageSize}`)
            }
        }
        const lessons = await AppDataSource
        .getRepository(Lesson)
        .createQueryBuilder("LESSONS")
        .where("LESSONS.courseId = :courseId", {
            courseId
        })
        .orderBy("LESSONS.seqNo")
        .skip(pageNumber * pageSize)
        .take(pageSize)
        .getMany()

        response.status(200).json(lessons)

    } catch (error) {
        logger.error(`Error calling findCourseLessons: ${error}`);
        return next(error)
    }
}
export async function updateCourse(request: Request, response: Response, next:NextFunction) {
    
    try {
        logger.info("Running updateCourse")
        const courseId = request.params.courseId,
            changes = request.body;
        if(!isInt(courseId)){
            throw new Error(`Could not extract valid course ID from request: ${courseId}`)
        }

        await AppDataSource
            .createQueryBuilder()
            .update(Course)
            .set(changes)
            .where("id = :courseId", {courseId})
            .execute()

        response.status(200).json({
            message: `Course ${courseId} was updated successfully`
        })

    } catch (error) {
        logger.error(`Error calling updateCourse: ${error}`);
        return next(error)
    }
}
export async function findCourseById(request: Request, response: Response, next:NextFunction) {

    try {
        logger.info("Running findCourseById")
        const courseId = request.params.courseId;
        if(!isInt(courseId)){
            throw new Error("Could not extract course ID from request")
        }
        const course = await AppDataSource
        .getRepository(Course)
        .findOneBy({
            id: parseInt(courseId)
        });
        if(!course){
            response.status(404).json({message: `Could not find a course with ID: ${courseId}`})
            logger.error(`Could not find a course with ID: ${courseId}`)
            return;
        }
        response.status(200).json({
            course
        })
        
    } catch (error) {
        logger.error(`Error calling findCourseByUrl: ${error}`);
        return next(error)
    }
    
}
export async function createCourse(request: Request, response: Response, next:NextFunction) {
    
    try {
        logger.info("Running updateCourse")
        const data = request.body;
        
        if(!data){
            throw new Error("No data found in request")
        }

        const course = await AppDataSource
        .manager
        .transaction("REPEATABLE READ", async (transactionalEntityManager) => {
            const repo = await transactionalEntityManager.getRepository(Course);
            const result = await repo
                .createQueryBuilder("COURSES")
                .select("MAX(COURSES.seqNo", "max")
                .getRawOne();

                const course = repo
                .create({
                    ...data,
                    seqNo: ((result?.max?? 0) + 1)
                })

                await repo.save(course)

                return course
            })
        response.status(200).json({
            course
        })

    } catch (error) {
        logger.error(`Error calling updateCourse: ${error}`);
        return next(error)
    }
}
export async function deleteCourseAndLessons(request: Request, response: Response, next:NextFunction) {
    
    try {
        logger.info("Running deleteCourse")
        const courseId = request.params.courseId;

        if(!isInt(courseId)){
            throw new Error("Could not extract course ID from request")
        }

        await AppDataSource.manager.transaction( async (transactionalEntityManager) => {
            await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Lesson)
            .where("courseId = :courseId", {courseId})
            .execute();

            await transactionalEntityManager
            .getRepository(Course)
            .createQueryBuilder()
            .delete()
            .from(Course)
            .where("id = :courseId", {courseId})
            .execute()
        })
        

        response.status(200).json({
            message: `Deleted course with ID: ${courseId}`
        })

    } catch (error) {
        logger.error(`Error calling deleteCourse: ${error}`);
        return next(error)
    }
}