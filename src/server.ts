import * as dotenv from "dotenv";
const res = dotenv.config()
if(res.error){
    console.log(`Error loading env vars: ${res.error}`)
    process.exit(1)
}
import * as express from "express"
import { root } from "./routes/root";
import { isInt } from "./utils/utils";
import { logger } from "./utils/logger";


const app = express()

function setupExpress(){
    app.route("/").get(root);
}

function startServer(){

    const portArg = process.argv[2]
    //port from env takes highest priority, then port from command line, then default port
    let port = isInt(process.env.port) ? parseInt(process.env.port): null;
    if(!port){
        port = isInt(portArg)? parseInt(portArg) : 8080; 
    }
    app.listen(port, () => {
       logger.info(`Server started on port ${port}`)
    })
}

setupExpress();
startServer();