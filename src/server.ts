import * as dotenv from "dotenv";
const res = dotenv.config()
if(res.error){
    console.log(`Error loading env vars: ${res.error} \n Exiting.`)
    process.exit(1)
}
import "reflect-metadata"
import { config } from "./utils/config";
import * as express from "express"
import { root } from "./routes/root";
import { isInt } from "./utils/utils";
import { logger } from "./utils/logger";
import { AppDataSource } from "./db/dataSource";
import { Logger } from "winston";
import { createCourse, deleteCourseAndLessons, findCourseById, findCourseByUrl, findCourseLessons, getAllCourses, updateCourse } from "./routes/courses";
import { errorHandler } from "./middleware/errorHandler";

const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()

function setupExpress(){
    app.use(cors({origin:true}))
    app.use(bodyParser.json())
    app.route("/").get(root);
    app.route("/api/courses").get(getAllCourses);
    app.route("/api/courses/:courseUrl").get(findCourseByUrl)
    app.route("/api/courses/id/:courseId").get(findCourseById)
    app.route("/api/courses/:courseId/lessons").get(findCourseLessons)
    app.route("/api/courses/:courseId").patch(updateCourse)
    app.route("/api/courses/:courseId").post(createCourse)
    app.route("/api/courses/:courseId").delete(deleteCourseAndLessons)
    app.use(errorHandler)
}

function startServer(){

    const portArg = process.argv[2]
    //port from env takes highest priority, then port from command line, then default port
    let port = isInt(config.port) ? parseInt(config.port): null;
    if(!port){
        port = isInt(portArg)? parseInt(portArg) : 8080; 
    }
    app.listen(port, () => {
       logger.info(`Server started on port ${port}`)
    })
}


AppDataSource.initialize().then(() => {
    logger.info("Data source successfully initialized.")
    setupExpress();
    startServer();
}).catch( (err) => {
    logger.error(`Error initializing data source: ${err} \n Exiting.`)
    process.exit(1)
})