import { config } from "./config";
import * as winston from "winston"

export const logger = winston.createLogger({
    level: config.loggerLevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: "logs/all.log"
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        })
    ]
});

if(config.nodeEnv != "prod"){
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}