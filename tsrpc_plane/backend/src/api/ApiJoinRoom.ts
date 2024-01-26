import { ApiCall } from "tsrpc";
import { ReqJoinRoom, ResJoinRoom } from "../shared/protocols/PtlJoinRoom";
import { RoomManagerIns } from "../mod/RoomManager";
import { DataMgr } from "../mod/DataMgr";
import { tbname2Obj } from "../helper/DataHelper";

export default async function (call: ApiCall<ReqJoinRoom, ResJoinRoom>) {
    let reqRoomId = call.req.id;
    let room;
    let appleData = await DataMgr.instance.getData(call.userdata.userId, "apple", tbname2Obj["apple"]);


    if (!reqRoomId|| reqRoomId.length === 0) {
        room = RoomManagerIns.createRoom();
    } else {
        room = RoomManagerIns.getRoom(reqRoomId);

        if (!room) {
            appleData!.stdata.modify("roomid", "");
            call.error("room not found", { code: 1 });
            return;
        }
    }

    let tmpData = {
        id: call.conn.id,
        conn: call.conn,
        userid: call.userdata.userId
    }

    if (room.hasPlayer(tmpData.userid)) {
        room.reconnect(tmpData);

        call.succ({
            roomData: room.getRoomData(),
        });

        return;
    }

    if (room.isFull()) {
        call.error("room player full", { code: 2 });
        return;
    }

    if (!room.isReady()) {
        call.error("room has start", { code: 3 });
        return;
    }

    room.addPlayer(tmpData);
    appleData!.modify("roomid", room.rid);

    let ret = {
        ts: Date.now(),
        roomData: room.getRoomData(),
    };

    call.logger.debug(JSON.stringify(ret.roomData.gamedata));
    call.succ(ret);
}