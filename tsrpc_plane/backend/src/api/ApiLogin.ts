import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqLogin, ResLogin } from "../shared/protocols/PtlLogin";
import { UserManagerIns } from "../mod/UserManager";
import { DBIns } from "../mod/ModMongoDB";

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    // Error
    if (call.req.userId.length === 0) {
        call.error('Content is empty')
        return;
    }

    let userId = call.req.userId;

    if(UserManagerIns.hasUserId(userId)){
        //断开之前的链接
        var connId = UserManagerIns.getConnId(userId);

        if(connId){
            call.logger.debug(userId + " has login, do disconnect");
            server.connections.find((conn) => conn.id === connId)?.close();           
        }
        //
        UserManagerIns.deleteUserByUid(userId);
    }

    UserManagerIns.addUserId(userId, call.conn.id);
    
    var dbdata = await DBIns.findOne("user", {id:userId});

    if(!dbdata){
        await DBIns.insertOne("user", {id:userId});
    }
    
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