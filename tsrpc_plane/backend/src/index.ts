import * as path from "path";
import { WsServer } from "tsrpc";
import { serviceProto } from './shared/protocols/serviceProto';
import { initflow } from "./helper/flowsHelper";
import * as config from "./config/config.json"
import { DBIns } from "./mod/ModMongoDB"
import { Test } from "./test";
import express from "express";
import "./helper/EventsHelper"; //导入监听事件处理
import { Game } from "./mod/Game";

// Create the httpServer
const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
    console.log(req.get('content-type'), req.get('contenttype'), req.ip, req.protocol);
    res.send('Hello, world!');
});

app.get("/server", (_, res: express.Response) => {
    res.send("connection count:" + server.connections.length);
});

// Create the Server
export const server = new WsServer(serviceProto, {
    port: config.port,
    // Remove this to use binary mode (remove from the client too)
    json: true,
    logConnect: true,
    apiTimeout: 200, //api调用超时时间, 毫秒
});

server.wmId2Conn = {};

// Initialize before server start
async function init() {
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)

    await DBIns.init(config.dbhost, config.dbport, config.dbname);

    //初始化操作流
    initflow(server);
};

// Entry function
async function main() {
    await init();
    await server.start();
    Game.start();

    app.listen(config.httpport);

    process.on('uncaughtException', (err) => {
        server.logger.error('!!!There was an uncaught error', err);
    });

    doTest();
}

async function doTest() {
    Test.instance
    //Test.instance.startAction();
}

main();