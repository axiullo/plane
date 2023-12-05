import { ApiCall } from "tsrpc";
import { ReqRegist, ResRegist } from "../shared/protocols/PtlRegist";
import { DBIns } from "../mod/ModMongoDB";
import { DataMgr } from "../mod/DataMgr";
import { UserObj } from "../shared/dataobj/UserObj";

//用户注册
export async function ApiRegist(call: ApiCall<ReqRegist, ResRegist>) {
    if (call.req.userid.length === 0) {
        call.error('username is empty')
        return;
    }

    let userId = call.req.userid;
    let obj = await DataMgr.instance.getData(userId, "user", UserObj, false);

    if (obj) {
        call.error("user exist");
        return;
    }

    obj = await DataMgr.instance.getData(userId, "user", UserObj);

    if (obj === null) {
        call.error("user exist");
        return;
    }

    obj.set("id", userId);
    obj.set("userid", userId);
    obj.set("password", call.req.password);

    var insertResult = await DBIns.insertOne("user", { ...obj.dirtyData() });
    call.logger.debug(insertResult);

    call.succ({
        result: "success",
    });
}
