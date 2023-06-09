import { RoomData } from "../module/modRoom";

export interface ReqJoinRoom {
    id:string
}

export interface ResJoinRoom {
    code:number,
    ts?: number,
    roomData?:RoomData,
}