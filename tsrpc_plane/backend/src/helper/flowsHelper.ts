import { server } from "..";
import { WmEventMgrIns } from "../mod/EventMgr";
// import { HttpConnection } from "tsrpc";

// 根据名称前缀，TSRPC 内置的 Flow 分为两类，Pre Flow 和 Post Flow。当它们的 FlowNode 中途返回了 null | undefined 时，都会中断 Flow 后续节点的执行。
//但对于 TSRPC 工作流的影响，有所区别：
//     所有 Pre Flow 的中断，会中断 后续的 TSRPC 工作流
//         例如 Client preCallApiFlow 中断，则会阻止 callApi。
//     所有 Post Flow 的中断，不会中断 后续的 TSRPC 工作流
//         例如 Server postConnectFlow 中断，不会阻止 连接建立和后续的消息接收。

export function initflow() {
    //客户端连接后 链接成功
    server.flows.postConnectFlow.push(conn => {
        conn.connectedTime = Date.now();
        server.logger.log(`connect success, ${conn.id}, ${conn.ip}`);
        return conn;
    });

    //客户端断开连接后 链接断开
    server.flows.postDisconnectFlow.push(info => {
        server.logger.log(`disconnect, ${info.conn.id}, ${info.reason}`);
        return info;
    });

    //处理收到的数据前
    server.flows.preRecvDataFlow.push(info => {
        server.logger.log("preRecvDataFlow", info);
        return info
    });

    /**
     * 在处理Api之前
     */
    server.flows.preApiCallFlow.push(info => {
        server.logger.log("preApiCallFlow", info.service.name);

        return info
    });

    /*
    * 在处理Api之后
    */
    server.flows.preApiReturnFlow.push(info => { 
        if(!info.return.isSucc){
            return info;
        }

        WmEventMgrIns.emit("DataApply", info);
        return info;
    });


    //===================================================================
    // httpserver.flows.preRecvDataFlow.push(v => {
    //     let conn = v.conn as HttpConnection;

    //     if (conn.httpReq.method === 'GET') {
    //         conn.httpRes.end('Hello World');
    //         httpserver.logger.debug("###############$$$$$$$$$$$$$");
    //         return undefined;
    //     }

    //     return v;
    // })
}

// //扩展模块
declare module 'tsrpc' {
    export interface BaseConnection {
        // 自定义的新字段
        connectedTime: number;
    }

    // export interface ApiCall {
    //     currentUser: {
    //         userId: string,
    //     }
    // }
}
