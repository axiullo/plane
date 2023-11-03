import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqLogin, ResLogin } from "../shared/protocols/PtlLogin";
import {  UserMgrIns } from "../mod/UserManager";
import { DBIns } from "../mod/ModMongoDB";
import {DbUser} from "../db/user";

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    // Error
    if (call.req.userId.length === 0) {
        call.error('Content is empty')
        return;
    }

    let userId = call.req.userId;

    if(UserMgrIns.hasUserId(userId)){
        //断开之前的链接
        var connId = UserMgrIns.getConnId(userId);

        if(connId){
            call.logger.debug(userId + " has login, do disconnect");
            server.connections.find((conn) => conn.id === connId)?.close();           
        }
        //
        UserMgrIns.deleteUserByUid(userId);
    }

    UserMgrIns.addUserId(userId, call.conn.id);
    var dbdata = await DBIns.findOne("user", {userid:userId});

    if(!dbdata){
        var dataUer:DbUser = {
            userid: userId,
            name :"xxx",
            createtime :Date.now()
        };
        await DBIns.insertOne("user", {...dataUer});
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