import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqGetData, ResGetData } from "../shared/protocols/PtlGetData";
import { UserMgrIns } from "../mod/UserManager";
import { DataMgr } from "../shared/mod/DataMgr";
import { DataHelper } from "../shared/helper/DataHelper";
import { AppleObj } from "../shared/dataobj/AppleObj";
import { MsgGetData } from "../shared/protocols/MsgGetData";

export default async function (call: ApiCall<ReqGetData, ResGetData>) {
    let conn = call.conn;
    server.logger.debug("get data", conn.id);
    let userId = UserMgrIns.getUserId(conn.id);

    if (!userId) {
        call.error("user not found");
        return;
    }

    DataHelper.syncObj.forEach(function (tbname: string) {
        server.logger.debug("sync data", tbname);
        //let cfun =  keyof DataHelper.tbname2Obj[tbname];
        // let data = DataMgr.instance.getData(userId!, tbname,);
    })

    let appledata = await DataMgr.instance.getData(userId!, "apple", AppleObj);

    if (appledata) {
        let msgdata:MsgGetData ={
            name:"apple",
            data:appledata
        } 

        call.conn.sendMsg("getdata", msgdata);
    }

    call.succ({

    });
}