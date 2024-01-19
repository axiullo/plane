import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqGetData, ResGetData } from "../shared/protocols/PtlGetData";
import { DataMgr } from "../mod/DataMgr";
import { DataHelper, tbname2Obj } from "../helper/DataHelper";
import { MsgSyncData, SyncData, SyncDataOpt } from "../shared/protocols/MsgSyncData";

export default async function (call: ApiCall<ReqGetData, ResGetData>) {
    let syncDatas: MsgSyncData = {
        datas: [],
    };

    for (const tbname of DataHelper.syncObj) {
        server.logger.debug("sync data", tbname);
        const factory = tbname2Obj[tbname];

        if (factory) {
            let obj;

            server.logger.debug(tbname," getismulti ", factory.prototype.ismulti);

            if (factory.prototype.getismulti) {
                obj = await DataMgr.instance.getDataList(call.userdata.userId, tbname, factory);

                for (let [_, value] of obj) {
                    let syncdata: SyncData = {
                        tbname: tbname,
                        opt: SyncDataOpt.Set,
                        data: value.stdata,
                    };

                    syncDatas.datas.push(syncdata);
                }
            }
            else {
                obj = await DataMgr.instance.getData(call.userdata.userId, tbname, factory);

                if (obj) {
                    let syncdata: SyncData = {
                        tbname: tbname,
                        opt: SyncDataOpt.Set,
                        data: obj.stdata,
                    };

                    syncDatas.datas.push(syncdata);
                }
            }
        }
    }

    call.conn.sendMsg("SyncData", syncDatas);
    call.succ({});
}