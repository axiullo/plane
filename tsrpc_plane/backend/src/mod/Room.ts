import { Player, PlayerData } from "./Player";
import { server } from "..";
import { RoomState, RoomData } from "../shared/module/ModRoom";
import { WsConnection } from "tsrpc";
import { PlayerInfo, PlayerState } from "../shared/module/ModPlayerInfo";
import { GamePlane } from "../shared/module/ModPlane";

//房间类
class Room {
    //房间id
    private _id: string;
    //玩家列表
    private _players: Map<string, Player>;
    //房间人数上限
    private _numLimit: number;
    //房间状态
    private _state: RoomState;
    //创建时间戳
    private _createTime: number;
    //
    private _playerConns: WsConnection[];
    //
    private _playerInfos: PlayerInfo[];
    //
    private _game: GamePlane;

    constructor(id: string, num: number = 2) {
        this._id = id;
        this._players = new Map<string, Player>();
        this._playerConns = [];
        this._playerInfos = [];
        this._numLimit = num;
        this._state = RoomState.Ready;
        this._createTime = Date.now();
        this._game = new GamePlane();
    }

    /**
     *  获得房间数据
     * @returns 
     */
    getRoomData(): RoomData {
        return {
            id: this._id,
            num: this._players.size,
            state: this._state,
            numLimit: this._numLimit,
            createTime: this._createTime,
            playerInfos: this._playerInfos,
        }
    }

    //
    isFull(): boolean {
        return this._players.size >= this._numLimit;
    }

    isReady(): boolean {
        return this._state == RoomState.Ready;
    }

    hasPlayer(userId: string): boolean {
        return this._players.get(userId) != undefined;
    }

    addPlayer(data: PlayerData) {
        if (this.isFull()) {
            return false;
        }

        if (this.hasPlayer(data.id)) {
            return false;
        }

        this.doAddPlayer(data);
        this._playerInfos.push({ id: data.id, name: data.name, state: PlayerState.Online });

        if (this._players.size == this._numLimit) {
            this.gameStart();
        }
        else {
            this.notify();
        }

        return true;
    }

    doAddPlayer(data: PlayerData) {
        var player = new Player(data);
        this._players.set(data.id, player);
        this._playerConns.push(player.getConn() as WsConnection);
    }

    notify() {
        // Broadcast
        server.broadcastMsg('RoomData', {
            data: this.getRoomData()
        },
            this._playerConns);
    }

    gameStart() {
        this._state = RoomState.Start;
        this._game.initMap([...this._players.keys()]);
        this.notify();
    }

    gameOver() {
        this._state = RoomState.Over;
        this.notify();
    }

    update() {

    }

    destroy() {

    }

    /**
     * 移除玩家
     * @param id 玩家id 
     * @returns 
     */
    removePlayer(id: string) {
        if (!this.hasPlayer(id)) {
            return;
        }

        let pldata = this._players.get(id)!;
        this._players.delete(id);

        this._playerConns = this._playerConns.filter(item => item !== pldata.getConn());
    }

    /**
     * 玩家掉线
     * @param data 
     * @returns 
     */
    disconnect(id: string) {
        this.removePlayer(id);

        let pldata = this._playerInfos.find(item => item.id === id);

        if (pldata) {
            pldata.state = PlayerState.Offline;
        }
    }

    /**
     * 玩家重连
     * @param data 
     * @returns 
     */
    reconnect(data: PlayerData) {
        if (!this.hasPlayer(data.id)) {
            return false;
        }

        this.doAddPlayer(data)

        let pldata = this._playerInfos.find(item => item.id === data.id);

        if (pldata) {
            pldata.state = PlayerState.Online;
        }

        this.notify();
    }
}

export { Room }