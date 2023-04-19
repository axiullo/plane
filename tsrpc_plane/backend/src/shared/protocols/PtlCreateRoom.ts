import { RoomData } from "../../mod/Room";

export interface ReqCreateRoom{
}

export interface ResCreateRoom{
    ts: number,
    roomData:RoomData,
}