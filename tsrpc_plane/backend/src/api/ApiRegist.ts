import { ApiCall } from "tsrpc";
import { ReqRegist, ResRegist } from "../shared/protocols/PtlRegist";
import { DataMgr } from "../mod/DataMgr";
import { UserObj } from "../dataobj/UserObj";
import { UserMgrIns } from "../mod/UserManager";
import { WmEventMgrIns } from "../mod/EventMgr";

//用户注册
export default async function (call: ApiCall<ReqRegist, ResRegist>) {
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
    obj.modify("name", call.req.name);

    UserMgrIns.addUserId(userId, call.conn.id);

    call.succ({
        result: "success",
    });

    WmEventMgrIns.emit("Online", { userId: userId, conn: call.conn });
}
