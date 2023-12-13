import { ApiCall, WsConnection } from "tsrpc";
import { ReqJoinRoom, ResJoinRoom } from "../shared/protocols/PtlJoinRoom";
import { RoomManagerIns } from "../mod/RoomManager";
import { PlayerData } from "../mod/Player";
import { DataMgr } from "../shared/mod/DataMgr";
import { UserObj } from "../shared/dataobj/UserObj";

export default async function (call: ApiCall<ReqJoinRoom, ResJoinRoom>) {
    let room;

    if (call.req.id.length == 0) {
        room = RoomManagerIns.createRoom();
    } else {
        room = RoomManagerIns.getRoom(call.req.id);

        if (!room) {
            call.error("room not found", { code: 1 });
            return;
        }
    }

    if (room.isFull()) {
        call.error("room player full", { code: 2 });
        return;
    }

    if (!room.isReady()) {
        call.error("room has start", { code: 3 });
        return;
    }

    if (room.hasPlayer(call.conn.id)) {
        call.succ({
            code: 4
        });
        return;
    }

    let userdata = DataMgr.instance.getData(call.userdata.userId, "user", UserObj);
    room.addPlayer(new PlayerData(call.conn.id, call.conn as WsConnection));

    call.succ({
        code: 0,
        ts: Date.now(),
        roomData: room.getRoomData(),
    });
}