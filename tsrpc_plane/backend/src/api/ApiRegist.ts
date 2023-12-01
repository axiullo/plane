import { ApiCall } from "tsrpc";
import { ReqRegist, ResRegist } from "../shared/protocols/PtlRegist";
import { DBIns } from "../mod/ModMongoDB";
import { user } from "../shared/db/dbstruct";

//用户注册
export async function ApiRegist(call: ApiCall<ReqRegist, ResRegist>) {
    if (call.req.userId.length === 0) {
        call.error('username is empty')
        return;
    }

    let result = await DBIns.findOne("user", { userid: call.req.userId });
    call.logger.debug(`userid = ${call.req.userId}`,result);
    
    if (result) {
        call.error('username exists')
        return;
    }

    var dataUer: user = {
        userid: call.req.userId,
        password:call.req.password,
        createtime: Date.now()
    };

    var insertResult = await DBIns.insertOne("user", { ...dataUer });
    call.logger.debug(insertResult);

    call.succ({
        result: "success",
    });
}
