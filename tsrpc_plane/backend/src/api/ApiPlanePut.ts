import { ApiCall } from "tsrpc";
//import { server } from "..";
import { ReqPlanePut, ResPlanePut } from "../shared/protocols/PtlPlanePut";
import { RoomManagerIns } from "../mod/RoomManager";

export default async function (call: ApiCall<ReqPlanePut, ResPlanePut>) {
    let room = RoomManagerIns.getRoom(call.req.roomid);

    if(!room){
        call.error("not find room");
        return;
    }

    let userid = call.userdata.userId;

    if(!room.hasPlayer(userid)){
        call.error("room has no player");
        return;
    }
    
    let isput = room.getGame().putPlane(userid, call.req.dir, call.req.x, call.req.y);

    if(!isput){
        call.error("put failed");
        return;
    }

    call.succ({});
}