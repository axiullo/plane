import { BaseConnection } from "tsrpc";

/**
 * 玩家数据
 */
export interface PlayerData {
    id: string;
    conn: BaseConnection;
    userid:string;
}

//玩家类
export class Player {
    private data!: PlayerData;

    constructor(paramData: PlayerData) {
        this.data = { ...paramData };
    }

    getConnId(): string {
        return this.data.id;
    }

    getConn(): BaseConnection {
        return this.data.conn;
    }
}