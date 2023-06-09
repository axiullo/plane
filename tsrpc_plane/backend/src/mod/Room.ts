import { Player, PlayerData } from "./Player";
import { server } from "..";
import {RoomState, RoomData} from "../shared/module/modRoom";
import { WsConnection } from "tsrpc";

//房间类
export class Room {
    //房间id
    private _id: string;
    //玩家列表
    private _players: Player[];
    //房间人数上限
    private _numLimit: number;
    //房间状态
    private _state: RoomState;
    //创建时间戳1
    private _createTime: number;
    //
    private _playerConns:WsConnection[];

    constructor(id: string, num: number = 2) {
        this._id = id;
        this._players = [];
        this._playerConns = [];
        this._numLimit = num;
        this._state = RoomState.Idle;
        this._createTime = Date.now();
    }

    //获得房间数据
    getRoomData(): RoomData {
        return {
            id: this._id,
            num: this._players.length,
            state: this._state,
            numLimit: this._numLimit,
            createTime: this._createTime
        }
    }

    //
    isFull(): boolean {
        return this._players.length >= this._numLimit;
    }

    isIdel(): boolean {
        return this._state == RoomState.Idle;
    }

    hasPlayer(userId: string): boolean {
        return this.getPlayer(userId) != undefined;
    }

    getPlayer(userId: string): Player | undefined {
        return this._players.find(p => p.getId() == userId);
    }

    addPlayer(data: PlayerData) {
        if (this._players.length >= this._numLimit) {
            return false;
        }

        var player = new Player(data.getId(), data.getConn());
        this._players.push(player);
        this._playerConns.push(player.getConn());   

        if (this._players.length == this._numLimit) {
            this.gameStart();
        }
        else{
            this.notify();
        }

        return true;
    }

    notify() {
        // Broadcast
        server.broadcastMsg('Room', {
            data: this.getRoomData()
        },
        this._playerConns);
    }

    gameStart() {
        this._state = RoomState.Start;
        this.notify();
    }

    gameOver() {
        this._state = RoomState.Over;
        this.notify();
    }

    destroy() {

    }
}

export default {}