import { ApiCall, WsConnection } from "tsrpc";
import { ReqJoinRoom, ResJoinRoom } from "../shared/protocols/PtlJoinRoom";
import {RoomManagerIns} from "../mod/RoomManager";
import { PlayerData } from "../mod/Player";

export default async function (call: ApiCall<ReqJoinRoom, ResJoinRoom>) {
    var room = RoomManagerIns.getRoom(call.req.id);

    if(!room){
        call.succ({
            code:1
        });
        return;
    }

    if(room.isFull()){
        call.succ({
            code:2
        });
        return;
    }

    if(!room.isIdel()){
        call.succ({
            code:3
        });
        return;
    }

    if(room.hasPlayer(call.conn.id)){
        call.succ({
            code:4
        });
        return;
    }

    room.addPlayer(new PlayerData(call.conn.id, call.conn as WsConnection));

    call.succ({
        code:0,
        ts: Date.now(),
        roomData:room.getRoomData(),
    });
}