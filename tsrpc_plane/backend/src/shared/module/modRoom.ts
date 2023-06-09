
//房间状态
export enum RoomState {
    Idle,
    Start,
    Over,
    Error
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
}