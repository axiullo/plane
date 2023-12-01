import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './MsgChat';
import { MsgRoom } from './MsgRoom';
import { MsgUserLogin } from './MsgUserLogin';
import { ReqCreateRoom, ResCreateRoom } from './PtlCreateRoom';
import { ReqJoinRoom, ResJoinRoom } from './PtlJoinRoom';
import { ReqLogin, ResLogin } from './PtlLogin';
import { ReqRegist, ResRegist } from './PtlRegist';
import { ReqSend, ResSend } from './PtlSend';

export interface ServiceType {
    api: {
        "CreateRoom": {
            req: ReqCreateRoom,
            res: ResCreateRoom
        },
        "JoinRoom": {
            req: ReqJoinRoom,
            res: ResJoinRoom
        },
        "Login": {
            req: ReqLogin,
            res: ResLogin
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
        "Room": MsgRoom,
        "UserLogin": MsgUserLogin
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 7,
    "services": [
        {
            "id": 0,
            "name": "Chat",
            "type": "msg"
        },
        {
            "id": 4,
            "name": "Room",
            "type": "msg"
        },
        {
            "id": 2,
            "name": "UserLogin",
            "type": "msg"
        },
        {
            "id": 5,
            "name": "CreateRoom",
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
        "MsgRoom/MsgRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "data",
                    "type": {
                        "type": "Reference",
                        "target": "../module/modRoom/RoomData"
                    }
                }
            ]
        },
        "../module/modRoom/RoomData": {
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
                        "target": "../module/modRoom/RoomState"
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
                }
            ]
        },
        "../module/modRoom/RoomState": {
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
                },
                {
                    "id": 3,
                    "value": 3
                }
            ]
        },
        "MsgUserLogin/MsgUserLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "userId",
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
        "PtlCreateRoom/ReqCreateRoom": {
            "type": "Interface"
        },
        "PtlCreateRoom/ResCreateRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "ts",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "roomData",
                    "type": {
                        "type": "Reference",
                        "target": "../module/modRoom/RoomData"
                    }
                }
            ]
        },
        "PtlJoinRoom/ReqJoinRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlJoinRoom/ResJoinRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "code",
                    "type": {
                        "type": "Number"
                    }
                },
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
                        "target": "../module/modRoom/RoomData"
                    },
                    "optional": true
                }
            ]
        },
        "PtlLogin/ReqLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "userId",
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
        "PtlRegist/ReqRegist": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "userId",
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