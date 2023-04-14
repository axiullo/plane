import { WsConnection } from "tsrpc";

export class PlayerData {
    private _id: string;
    private _conn: WsConnection;

    constructor(id: string, conn: WsConnection){
        this._id = id;
        this._conn = conn;
    }
    
    getId(): string{
        return this._id;
    }

    getConn(): WsConnection{
        return this._conn;
    }
}

//玩家类
export class Player {
    private _id: string;
    private _conn: WsConnection;

    constructor(id: string, conn: WsConnection) {
        this._id = id;
        this._conn = conn;
    }
}