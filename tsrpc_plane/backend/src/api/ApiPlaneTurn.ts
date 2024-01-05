import { ApiCall } from "tsrpc";
import { ReqPlaneTurn, ResPlaneTurn } from "../shared/protocols/PtlPlaneTurn";
import { RoomManagerIns } from "../mod/RoomManager";

export default async function (call: ApiCall<ReqPlaneTurn, ResPlaneTurn>) {
    let room = RoomManagerIns.getRoom(call.req.roomid);

    if (!room) {
        call.error("not find room");
        return;
    }

    let userid = call.userdata.userId;
    let enemyUid = call.req.enemyUid;

    if (!room.hasPlayer(userid) || !room.hasPlayer(enemyUid)) {
        call.error("room has no player");
        return;
    }

    let issucc = room.getGame().turnGrid(userid, enemyUid, call.req.x, call.req.y);

    if (!issucc) {
        call.error("turn failed");
        return;
    }

    call.succ({});
}