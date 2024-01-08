import { WsClient } from "tsrpc-browser";
import { serviceProto, ServiceType } from "./shared/protocols/serviceProto";
import config from "./config/config.json"

export function getClient(): WsClient<ServiceType> {
    console.log("$$$ getClient " + config.url);
    
    return new WsClient(serviceProto, {
        server: config.url,
        // Remove this to use binary mode (remove from the server too)
        json: true,
        logger: console,
    })
}