import { UserMgrIns } from "../mod/UserManager";
import { server } from "..";
import { ServiceType } from "../shared/protocols/serviceProto";

let NetHelper = {
    /**
     * 给客户端发消息
     * @param uid 
     * @param msgName 
     * @param data 
     * @returns 
     */
    tocli: function (uid: string, msgName: keyof ServiceType['msg'], data: any) {
        let connId = UserMgrIns.getConnId(uid);

        if (!connId) {
            return;
        }

        let conn = server.wmId2Conn[connId];

        if (!conn) {
            return;
        }

        conn.sendMsg(msgName, data);
    }
}

export { NetHelper };