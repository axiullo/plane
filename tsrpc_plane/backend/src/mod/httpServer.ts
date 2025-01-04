//http 服务器模块
import express from "express";

class HttpServer {
    webapp = express();

    constructor() {
        this.webapp.listen(3080);

        this.webapp.get('/', (req: express.Request, res: express.Response) => {
            console.log(req.get('content-type'), req.get('contenttype'), req.ip, req.protocol);
            res.send('Hello, world!');
        });
        
        this.webapp.get("/server", (_, res: express.Response) => {
            res.send("connection count:" + server.connections.length);
        });
    }

    get(path: string, callback: (req: express.Request, res: express.Response) => void) {
        this.webapp.get(path, callback);
    }
}

var httpServer = new HttpServer();
export { httpServer };
// Create the httpServer


