import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqLogin, ResLogin } from "../shared/protocols/PtlLogin";
import { UserMgrIns } from "../mod/UserManager";
import { DataMgr, tbname2Obj } from "../shared/mod/DataMgr";
// import { UserObj } from "../shared/dataobj/UserObj";
import { DateTimeHelper } from "../shared/helper/DateTimeHelper";

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    // Error
    if (call.req.userId.length === 0) {
        call.error('Content is empty')
        return;
    }

    let userId = call.req.userId;
    // let dbdata = await DataMgr.instance.getData(userId, "user", UserObj, false);
    let dbdata = await DataMgr.instance.getData(userId, "user", tbname2Obj["user"], false);

    if (!dbdata) {
        call.error("user not found");
        return;
    }

    if(call.req.password != dbdata.password) {
        call.error("password error");
        return;
    }

    dbdata.modify("lastlogin", DateTimeHelper.now());
    let curConnId = call.conn.id;

    if (UserMgrIns.hasUserId(userId)) {
        //断开之前的链接
        var connId = UserMgrIns.getConnId(userId);

        if (connId != curConnId) {
            call.logger.debug(userId + " has login, do disconnect");
            server.connections.find((conn) => conn.id === connId)?.close();
        }

        //
        UserMgrIns.deleteUserByUid(userId);
    }

    UserMgrIns.addUserId(userId, curConnId);

    // Success
    let time = new Date();
    call.succ({
        time: time
    });

    // Broadcast
    server.broadcastMsg('UserLogin', {
        userId: call.req.userId,
        time: time
    })
}