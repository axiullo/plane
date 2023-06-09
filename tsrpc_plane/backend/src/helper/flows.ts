import {server} from "..";
import {UserManagerIns} from "../mod/UserManager";

export function initflow()
{
    //链接成功
    server.flows.postConnectFlow.push(conn => {
        conn.connectedTime = Date.now();
        server.logger.log(`connect success, ${conn.id}, ${conn.ip}`);
        return conn;
    });

    //链接断开
    server.flows.postDisconnectFlow.push(info => {
        server.logger.log(`disconnect, ${info.conn.id}, ${info.reason}`);
        UserManagerIns.deleteUserByConnId(info.conn.id);
        return info;
    });

    server.flows.preRecvDataFlow.push(info => {
        return info
    });

    server.flows.preApiCallFlow.push(info => {
        server.logger.log("preApiCallFlow",info.service.name);

        return info
    });
}

//扩展模块
declare module 'tsrpc' {
    export interface BaseConnection {
        // 自定义的新字段
        connectedTime: number;
    }

    export interface ApiCall {
        currentUser: {
            userId: string,
        }
    }
}
