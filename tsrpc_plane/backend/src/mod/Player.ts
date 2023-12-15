import { BaseConnection } from "tsrpc";

/**
 * 玩家数据
 */
export interface PlayerData {
    id: string;
    conn: BaseConnection;
    name: string;
}

//玩家类
export class Player {
    private data!: PlayerData;

    constructor(data: PlayerData) {
        data = { ...data };
    }

    getId(): string {
        return this.data.id;
    }

    getConn(): BaseConnection {
        return this.data.conn;
    }
}