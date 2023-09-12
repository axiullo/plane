import * as path from "path";
import {  WsServer } from "tsrpc";
import {  serviceProto } from './shared/protocols/serviceProto';
import { initflow } from "./helper/flows";
import * as config from "./config/config.json"
import  {DBIns} from "./mod/ModMongoDB"

const eventEmitter = require('events').EventEmitter;
const myEmitter = new eventEmitter();
myEmitter.on("xxx", function()
{

});


// Create the Server
export const server = new WsServer(serviceProto, {
    port: config.port,
    // Remove this to use binary mode (remove from the client too)
    json: true
});

// Initialize before server start
async function init() {
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)

    await DBIns.init();
    server.logger.debug("db connected");

    //初始化操作流
    initflow();
};

// Entry function
async function main() {
    await init();
    await server.start();
}

main();