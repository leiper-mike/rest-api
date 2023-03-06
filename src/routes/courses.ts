import { Response, Request, NextFunction } from "express";
import { AppDataSource } from "../db/dataSource";
import { Course } from "../db/models/course";
import { logger } from "../utils/logger";

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