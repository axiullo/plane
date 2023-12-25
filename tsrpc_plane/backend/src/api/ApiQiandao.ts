import { ApiCall } from "tsrpc";
import { ReqQiandao, ResQiandao } from "../shared/protocols/PtlQiandao";
import { DataMgr } from "../shared/mod/DataMgr";
import { AppleObj } from "../shared/dataobj/AppleObj";

export default async function (call: ApiCall<ReqQiandao, ResQiandao>) {
    let appleData = await DataMgr.instance.getData(call.userdata.userId, "apple", AppleObj);

    if (!appleData) {
        call.error("apple not found");
        return;
    }

    if (appleData.isqiandao) {
        call.error("has qiandao");
        return;
    }

    appleData.modify("isqiandao", true);

    call.succ({});
}