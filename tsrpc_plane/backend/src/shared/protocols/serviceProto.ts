import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './MsgChat';
import { MsgRoomData } from './MsgRoomData';
import { MsgSyncData } from './MsgSyncData';
import { MsgUserLogin } from './MsgUserLogin';
import { ReqGetData, ResGetData } from './PtlGetData';
import { ReqJoinRoom, ResJoinRoom } from './PtlJoinRoom';
import { ReqLogin, ResLogin } from './PtlLogin';
import { ReqPlanePut, ResPlanePut } from './PtlPlanePut';
import { ReqPlaneTurn, ResPlaneTurn } from './PtlPlaneTurn';
import { ReqPlay, ResPlay } from './PtlPlay';
import { ReqQiandao, ResQiandao } from './PtlQiandao';
import { ReqRegist, ResRegist } from './PtlRegist';
import { ReqSend, ResSend } from './PtlSend';

export interface ServiceType {
    api: {
        "GetData": {
            req: ReqGetData,
            res: ResGetData
        },
        "JoinRoom": {
            req: ReqJoinRoom,
            res: ResJoinRoom
        },
        "Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "PlanePut": {
            req: ReqPlanePut,
            res: ResPlanePut
        },
        "PlaneTurn": {
            req: ReqPlaneTurn,
            res: ResPlaneTurn
        },
        "Play": {
            req: ReqPlay,
            res: ResPlay
        },
        "Qiandao": {
            req: ReqQiandao,
            res: ResQiandao
        },
        "Regist": {
            req: ReqRegist,
            res: ResRegist
        },
        "Send": {
            req: ReqSend,
            res: ResSend
        }
    },
    msg: {
        "Chat": MsgChat,
        "RoomData": MsgRoomData,
        "SyncData": MsgSyncData,
        "UserLogin": MsgUserLogin
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 18,
    "services": [
        {
            "id": 0,
            "name": "Chat",
            "type": "msg"
        },
        {
            "id": 10,
            "name": "RoomData",
            "type": "msg"
        },
        {
            "id": 15,
            "name": "SyncData",
            "type": "msg"
        },
        {
            "id": 2,
            "name": "UserLogin",
            "type": "msg"
        },
        {
            "id": 9,
            "name": "GetData",
            "type": "api"
        },
        {
            "id": 6,
            "name": "JoinRoom",
            "type": "api"
        },
        {
            "id": 3,
            "name": "Login",
            "type": "api"
        },
        {
            "id": 13,
            "name": "PlanePut",
            "type": "api"
        },
        {
            "id": 14,
            "name": "PlaneTurn",
            "type": "api"
        },
        {
            "id": 11,
            "name": "Play",
            "type": "api"
        },
        {
            "id": 12,
            "name": "Qiandao",
            "type": "api"
        },
        {
            "id": 7,
            "name": "Regist",
            "type": "api"
        },
        {
            "id": 1,
            "name": "Send",
            "type": "api"
        }
    ],
    "types": {
        "MsgChat/MsgChat": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "MsgRoomData/MsgRoomData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "data",
                    "type": {
                        "type": "Reference",
                        "target": "../module/ModRoom/RoomData"
                    }
                }
            ]
        },
        "../module/ModRoom/RoomData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "state",
                    "type": {
                        "type": "Reference",
                        "target": "../module/ModRoom/RoomState"
                    }
                },
                {
                    "id": 2,
                    "name": "num",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "numLimit",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "createTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "playerInfos",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../module/ModPlayerInfo/PlayerInfo"
                        }
                    }
                },
                {
                    "id": 6,
                    "name": "gamedata",
                    "type": {
                        "type": "Any"
                    }
                }
            ]
        },
        "../module/ModRoom/RoomState": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                },
                {
                    "id": 1,
                    "value": 1
                },
                {
                    "id": 2,
                    "value": 2
                }
            ]
        },
        "../module/ModPlayerInfo/PlayerInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "avatar",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "state",
                    "type": {
                        "type": "Reference",
                        "target": "../module/ModPlayerInfo/PlayerState"
                    }
                }
            ]
        },
        "../module/ModPlayerInfo/PlayerState": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                },
                {
                    "id": 1,
                    "value": 1
                }
            ]
        },
        "MsgSyncData/MsgSyncData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "datas",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "MsgSyncData/SyncData"
                        }
                    }
                }
            ]
        },
        "MsgSyncData/SyncData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "tbname",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "opt",
                    "type": {
                        "type": "Reference",
                        "target": "MsgSyncData/SyncDataOpt"
                    }
                },
                {
                    "id": 2,
                    "name": "data",
                    "type": {
                        "type": "Any"
                    }
                }
            ]
        },
        "MsgSyncData/SyncDataOpt": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                },
                {
                    "id": 1,
                    "value": 1
                },
                {
                    "id": 2,
                    "value": 2
                }
            ]
        },
        "MsgUserLogin/MsgUserLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "userid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "PtlGetData/ReqGetData": {
            "type": "Interface"
        },
        "PtlGetData/ResGetData": {
            "type": "Interface"
        },
        "PtlJoinRoom/ReqJoinRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlJoinRoom/ResJoinRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "ts",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "roomData",
                    "type": {
                        "type": "Reference",
                        "target": "../module/ModRoom/RoomData"
                    },
                    "optional": true
                }
            ]
        },
        "PtlLogin/ReqLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "userid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlLogin/ResLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "PtlPlanePut/ReqPlanePut": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "roomid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 0,
                    "name": "dir",
                    "type": {
                        "type": "Reference",
                        "target": "../module/GamePlane/PlaneDirection"
                    }
                },
                {
                    "id": 1,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../module/GamePlane/PlaneDirection": {
            "type": "Union",
            "members": [
                {
                    "id": 0,
                    "type": {
                        "type": "Literal",
                        "literal": "up"
                    }
                },
                {
                    "id": 1,
                    "type": {
                        "type": "Literal",
                        "literal": "left"
                    }
                },
                {
                    "id": 2,
                    "type": {
                        "type": "Literal",
                        "literal": "down"
                    }
                },
                {
                    "id": 3,
                    "type": {
                        "type": "Literal",
                        "literal": "right"
                    }
                }
            ]
        },
        "PtlPlanePut/ResPlanePut": {
            "type": "Interface"
        },
        "PtlPlaneTurn/ReqPlaneTurn": {
            "type": "Interface",
            "properties": [
                {
                    "id": 4,
                    "name": "roomid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 0,
                    "name": "enemyUid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlPlaneTurn/ResPlaneTurn": {
            "type": "Interface"
        },
        "PtlPlay/ReqPlay": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "rid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlPlay/ResPlay": {
            "type": "Interface"
        },
        "PtlQiandao/ReqQiandao": {
            "type": "Interface"
        },
        "PtlQiandao/ResQiandao": {
            "type": "Interface"
        },
        "PtlRegist/ReqRegist": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "userid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlRegist/ResRegist": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "result",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlSend/ReqSend": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlSend/ResSend": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        }
    }
};