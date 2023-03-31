import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './MsgChat';
import { MsgUserLogin } from './MsgUserLogin';
import { ReqLogin, ResLogin } from './PtlLogin';
import { ReqSend, ResSend } from './PtlSend';

export interface ServiceType {
    api: {
        "Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "Send": {
            req: ReqSend,
            res: ResSend
        }
    },
    msg: {
        "Chat": MsgChat,
        "UserLogin": MsgUserLogin
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 1,
    "services": [
        {
            "id": 0,
            "name": "Chat",
            "type": "msg"
        },
        {
            "id": 2,
            "name": "UserLogin",
            "type": "msg"
        },
        {
            "id": 3,
            "name": "Login",
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
        "PtlLogin/ReqLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "userId",
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