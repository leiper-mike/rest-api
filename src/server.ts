
import * as express from "express"
import { root } from "./routes/root";
import { isInt } from "./utils";

const app = express()

function setupExpress(){
    app.route("/").get(root);
}

function startServer(){

    const portArg = process.argv[2]
    let port;
    //port from command line input takes highest priority, then port from .env, then default port
    if(isInt(portArg)){
        port = parseInt(portArg)
    }
    else{
        port = process.env.port;
    }
    if(!port){
        port = 8080
    }
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
}

setupExpress();
startServer();