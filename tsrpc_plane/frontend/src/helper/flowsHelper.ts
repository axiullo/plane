import { BaseClient } from 'tsrpc-base-client';
import { ServiceType } from '../shared/protocols/serviceProto';


export function initflow(client: BaseClient<ServiceType>) {
    //连接到服务端之前（仅 WebSocket）
    client.flows.preConnectFlow.push(v => {
        return v;
    });

    //连接到服务端之后（仅 WebSocket）
    client.flows.postConnectFlow.push(v => {
        return v;
    });

    //从服务端断开连接之后（仅 WebSocket）
    client.flows.postDisconnectFlow.push(v => {
        return v;
    });

    //执行 callApi 之前
    client.flows.preCallApiFlow.push(v => {
        client.logger?.debug("preCallApiFlow: ", v.apiName, v.req);
        return v;
    });

    //将 callApi 的结果返回给调用方之前
    client.flows.preApiReturnFlow.push(v => {
        client.logger?.debug("preApiReturnFlow: ", v.apiName, v.req);
        return v;
    });

    //将 callApi 的结果返回给调用方之后
    client.flows.postApiReturnFlow.push(v => {
        client.logger?.debug("postApiReturnFlow: ", v.apiName, v.req);
        return v;
    });

    //执行 sendMsg 之前
    client.flows.preSendMsgFlow.push(v => {
        return v;
    });

    //执行 sendMsg 之后
    client.flows.postSendMsgFlow.push(v => {
        return v;
    });

    //接收服务端发送的 Message 之前
    client.flows.preRecvMsgFlow.push(v => {
        return v;
    });

    //接收服务端发送的 Message 之后
    client.flows.postRecvMsgFlow.push(v => {
        client.logger?.debug("postRecvMsgFlow: ", v.msgName, v.msg);
        return v;
    });

    //向服务端发送任何数据之前
    client.flows.preSendDataFlow.push(v => {
        return v;
    });

    //处理服务端发来的任何数据之前
    client.flows.preRecvDataFlow.push(v => {
        client.logger?.debug("preRecvDataFlow: ", v.data);
        return v;
    });
}