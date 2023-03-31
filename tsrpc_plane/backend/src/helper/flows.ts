import {server} from "..";
import {UserManagerIns} from "../mod/UserManager";

export function initflow()
{
    //链接成功
    server.flows.postConnectFlow.push(conn => {
        server.logger.log(`connect success, ${conn.id}, ${conn.ip}`);
        return null;
    });

    //链接断开
    server.flows.postDisconnectFlow.push(info => {
        server.logger.log(`disconnect, ${info.conn.id}, ${info.reason}`);
        UserManagerIns.deleteUserByConnId(info.conn.id);
        return null;
    });
}
