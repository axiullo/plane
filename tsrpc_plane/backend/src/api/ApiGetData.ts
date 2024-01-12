import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqGetData, ResGetData } from "../shared/protocols/PtlGetData";
import { DataMgr } from "../mod/DataMgr";
import { DataHelper } from "../helper/DataHelper";
import { MsgSyncData, SyncData, SyncDataOpt } from "../shared/protocols/MsgSyncData";

export default async function (call: ApiCall<ReqGetData, ResGetData>) {
    let syncDatas: MsgSyncData = {
        datas: [],
    };
    
    for (const tbname of DataHelper.syncObj) {
        server.logger.debug("sync data", tbname);
    
        let obj = await DataMgr.instance.getDataObjByName(call.userdata.userId, tbname);
    
        if (obj) {
            let syncdata: SyncData = {
                tbname: tbname,
                opt: SyncDataOpt.Set,
                data: obj.stdata,
            };
    
            syncDatas.datas.push(syncdata);
        }
    }
    
    call.conn.sendMsg("SyncData", syncDatas);
    call.succ({});
}