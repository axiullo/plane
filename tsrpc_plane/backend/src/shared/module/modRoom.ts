import { PlayerInfo } from "./ModPlayerInfo";

//房间状态
export enum RoomState {
    Ready,  //准备中
    Deploy, //部署中
    Start, //游戏开始
    Over, //游戏结束
}

//房间数据 
export interface RoomData {
    //房间id
    id: string;
    //房间状态
    state: RoomState;
    //当前人数
    num: number;
    //房间人数上限
    numLimit: number;
    //创建时间戳
    createTime: number;
    //玩家信息
    playerInfos: PlayerInfo[];
}