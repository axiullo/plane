import { ApiCall } from "tsrpc";
import { ReqJoinRoom, ResJoinRoom } from "../shared/protocols/PtlJoinRoom";
import { RoomManagerIns } from "../mod/RoomManager";
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

    let userdata = await DataMgr.instance.getData(call.userdata.userId, "user", UserObj, false);

    if (!userdata) {
        return call.error("user not found");
    }

    if (room.hasPlayer(call.conn.id)) {
        room.reconnect({
            id: call.conn.id,
            conn: call.conn,
            name: userdata.name
        });

        call.succ({
            roomData: room.getRoomData(),
        });

        return;
    }

    room.addPlayer({
        id: call.conn.id,
        conn: call.conn,
        name: userdata.name
    });



    call.succ({
        ts: Date.now(),
        roomData: room.getRoomData(),
    });
}