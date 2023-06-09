import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqLogin, ResLogin } from "../shared/protocols/PtlLogin";
import { UserManagerIns } from "../mod/UserManager";

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    // Error
    if (call.req.userId.length === 0) {
        call.error('Content is empty')
        return;
    }

    if(UserManagerIns.hasUserId(call.req.userId)){
        //断开之前的链接
        var connId = UserManagerIns.getConnId(call.req.userId);

        if(connId){
            call.logger.debug(call.req.userId + " has login, do disconnect");
            server.connections.find((conn) => conn.id === connId)?.close();           
        }
        //
        UserManagerIns.deleteUserByUid(call.req.userId);
    }

    UserManagerIns.addUserId(call.req.userId, call.conn.id);
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