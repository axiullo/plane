import { ApiCall } from "tsrpc";
import { ReqPlay, ResPlay } from "../shared/protocols/PtlPlay";
import { RoomManagerIns } from "../mod/RoomManager";

export default async function (call: ApiCall<ReqPlay, ResPlay>) {
    let room = RoomManagerIns.getRoom(call.req.rid);
    
    if (!room) {
        call.error("room not found");
        return;
    }

    if(!room.hasPlayer(call.userdata.userId)){
        call.error("room has no player");
        return;
    }

    
}