import { RoomData } from "../../mod/Room";

export interface ReqJoinRoom {
    id:string
}

export interface ResJoinRoom {
    code:number,
    ts?: number,
    roomData?:RoomData,
}