import { ApiCall } from "tsrpc";
import { ReqRegist, ResRegist } from "../shared/protocols/PtlRegist";
import { DataMgr } from "../shared/mod/DataMgr";
import { UserObj } from "../shared/dataobj/UserObj";
import { UserMgrIns } from "../mod/UserManager";

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

    obj.modify("id", userId);
    obj.modify("userid", userId);
    obj.modify("password", call.req.password);

    UserMgrIns.addUserId(userId, call.conn.id);

    call.succ({
        result: "success",
    });
}
