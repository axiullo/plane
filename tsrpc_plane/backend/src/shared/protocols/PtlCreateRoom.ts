import { RoomData } from "../module/modRoom";

export interface ReqCreateRoom{
}

export interface ResCreateRoom{
    ts: number,
    roomData:RoomData,
}