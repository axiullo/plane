import { ApiCall, WsConnection } from "tsrpc";
import { server } from "..";
import { ReqCreateRoom, ResCreateRoom } from "../shared/protocols/PtlCreateRoom";
import {RoomManagerIns} from "../mod/RoomManager";
import { PlayerData } from "../mod/Player";

export default async function (call: ApiCall<ReqCreateRoom, ResCreateRoom>) {
    var room = RoomManagerIns.createRoom();
    room.addPlayer(new PlayerData(call.conn.id, call.conn as WsConnection));

    call.succ({
        ts: Date.now(),
        roomData:room.getRoomData(),
    });
}