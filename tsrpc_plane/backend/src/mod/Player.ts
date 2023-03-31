import { WsConnection } from "tsrpc";

//玩家类
export class Player {
    private _id: string;
    private _conn: WsConnection;

    constructor(id: string, conn: WsConnection) {
        this._id = id;
        this._conn = conn;
    }
}