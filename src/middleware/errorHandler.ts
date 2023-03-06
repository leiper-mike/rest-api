import { Response, Request, NextFunction } from "express";
import { AppDataSource } from "../db/dataSource";
import { Course } from "../db/models/course";
import { logger } from "../utils/logger";

export async function errorHandler(err, request: Request, response: Response, next:NextFunction){
    
    logger.error(`Error handler triggered: ${err}`);

    if(response.headersSent){
        logger.error("Response already written, sending error to Express error handler")
        return next(err);
    }

    response.status(500).json({
        status: "error",
        message: "Default error handler was triggered"
    })


    
}