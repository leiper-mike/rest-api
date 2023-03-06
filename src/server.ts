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
import { getAllCourses } from "./routes/courses";
import { errorHandler } from "./middleware/errorHandler";


const app = express()

function setupExpress(){
    app.route("/").get(root);
    app.route("/api/courses").get(getAllCourses);
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