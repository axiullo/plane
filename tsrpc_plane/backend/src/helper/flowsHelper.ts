import { server } from "..";
import { WmEventMgrIns } from "../mod/EventMgr";
import { UserMgrIns } from "../mod/UserManager";
// import { HttpConnection } from "tsrpc";

// 根据名称前缀，TSRPC 内置的 Flow 分为两类，Pre Flow 和 Post Flow。当它们的 FlowNode 中途返回了 null | undefined 时，都会中断 Flow 后续节点的执行。
//但对于 TSRPC 工作流的影响，有所区别：
//     所有 Pre Flow 的中断，会中断 后续的 TSRPC 工作流
//         例如 Client preCallApiFlow 中断，则会阻止 callApi。
//     所有 Post Flow 的中断，不会中断 后续的 TSRPC 工作流
//         例如 Server postConnectFlow 中断，不会阻止 连接建立和后续的消息接收。

export function initflow() {
    //与客户端链接成功
    server.flows.postConnectFlow.push(conn => {
        server.logger.log(`connect success, ${conn.id}, ${conn.ip}`);
        server.id2Conn[conn.id]= conn;
        return conn;
    });

    //客户端断开连接后 链接断开
    server.flows.postDisconnectFlow.push(info => {
        server.logger.log(`disconnect, ${info.conn.id}, ${info.reason}`);
        delete server.id2Conn[info.conn.id];
        return info;
    });

    //处理收到的数据前
    server.flows.preRecvDataFlow.push(info => {
        return info
    });

    /**
     * 在处理Api之前
     */
    server.flows.preApiCallFlow.push(info => {
        server.logger.log("preApiCallFlow", info.service.name);

        if (info.service.name !== "Regist" && info.service.name !== "Login") {
            let userId = UserMgrIns.getUserId(info.conn.id);

            if (!userId) {
                server.logger.log("preApiCallFlow Fail not find user", info.service.name);
                return null;
            }

            info.userdata = { userId: userId };
        }

        return info
    });

    /*
    * API 接口返回结果（call.succ、call.error）之前
    * 在处理Api之后
    * 返回消息发送之前
    */
    server.flows.preApiReturnFlow.push(info => {
        if (!info.return.isSucc) {
            return info;
        }

        WmEventMgrIns.emit("DataApply", info);
        return info;
    });

    /**
     * 执行 API 接口实现之后
     */
    server.flows.postApiCallFlow.push(info => {
        server.logger.debug("postApiCallFlow " + info.service.name);
        return info;
    });

    /**
     * API 接口返回结果（call.succ、call.error）之后
     * 返回消息已发送
     */
    server.flows.postApiReturnFlow.push(info => {
        server.logger.debug("postApiReturnFlow " + info.call.service.name);
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

/* 
* 扩展模块
*/
declare module 'tsrpc' {
    // 对现有模块添加自定义的新字段
    export interface ApiCall {
        userdata: {
            userId: string,
        }
    }

    export interface WsServer {
        id2Conn:any
    }
}
