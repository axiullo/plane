import { RoomData } from "../mod/ModRoom";

export interface ReqJoinRoom {
    id?:string //房间号，如果为空字符串，则创建房间。
}

export interface ResJoinRoom {
    ts?: number,
    roomData?:RoomData,
}