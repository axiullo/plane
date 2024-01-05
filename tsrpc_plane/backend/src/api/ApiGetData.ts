import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqGetData, ResGetData } from "../shared/protocols/PtlGetData";
import { UserMgrIns } from "../mod/UserManager";
import { DataMgr } from "../shared/mod/DataMgr";
import { DataHelper } from "../helper/DataHelper";
import { MsgGetData } from "../shared/protocols/MsgGetData";

export default async function (call: ApiCall<ReqGetData, ResGetData>) {
    let conn = call.conn;
    server.logger.debug("get data", conn.id);
    let userId = UserMgrIns.getUserId(conn.id);

    // if (!userId) {
    //     call.error("user not found");
    //     return;
    // }

    await DataHelper.syncObj.forEach(async function (tbname: string) {
        server.logger.debug("sync data", tbname);

        let obj = await DataMgr.instance.getDataObjByName(userId!, tbname);

        if (obj) {
            let msgdata: MsgGetData = {
                name: obj.tbname,
                data: obj
            }

            call.conn.sendMsg("getdata", msgdata);
        }
    })

    call.succ({

    });
}