import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqGetData, ResGetData } from "../shared/protocols/PtlGetData";
import { UserMgrIns } from "../mod/UserManager";
import { DataMgr } from "../mod/DataMgr";
import { DataHelper } from "../helper/DataHelper";
import { MsgSyncData, SyncData, SyncDataOpt } from "../shared/protocols/MsgSyncData";

export default async function (call: ApiCall<ReqGetData, ResGetData>) {
    let conn = call.conn;
    server.logger.debug("get data", conn.id);
    let userId = UserMgrIns.getUserId(conn.id);

    // if (!userId) {
    //     call.error("user not found");
    //     return;
    // }

    let syncDatas: MsgSyncData = {
        datas: [],
    };

    await DataHelper.syncObj.forEach(async function (tbname: string) {
        server.logger.debug("sync data", tbname);

        let obj = await DataMgr.instance.getDataObjByName(userId!, tbname);

        if (obj) {
            let syncdata: SyncData = {
                tbname: tbname,
                opt: SyncDataOpt.Set,
                data: obj,
            };

            syncDatas.datas.push(syncdata);
        }
    })

    call.conn.sendMsg("SyncData", syncDatas);
    call.succ({});
}