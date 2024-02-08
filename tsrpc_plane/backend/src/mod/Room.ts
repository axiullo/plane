import { Player, PlayerData } from "./Player";
import { server } from "..";
import { RoomState, RoomData } from "../shared/mod/ModRoom";
import { WsConnection } from "tsrpc";
import { PlayerInfo, PlayerStatus } from "../shared/mod/ModPlayerInfo";
import { GamePlane } from "../shared/mod/GamePlane";

//房间类
class Room {
    //房间id
    private _id: string;
    //玩家列表
    private _players: Map<string, Player>;
    //房间人数上限
    private _numLimit: number;
    //房间状态
    private _roomstate: RoomState;
    //创建时间戳
    private _createTime: number;
    //
    private _playerConns: WsConnection[];
    //
    private _playerInfos: PlayerInfo[];
    //玩法对象
    private _game: GamePlane;

    constructor(id: string, num: number = 2) {
        this._id = id;
        this._players = new Map<string, Player>();
        this._playerConns = [];
        this._playerInfos = [];
        this._numLimit = num;
        this._roomstate = RoomState.Ready;
        this._createTime = Date.now();
        this._game = new GamePlane();
    }

    get rid(): string {
        return this._id;
    }

    getGame(): GamePlane {
        return this._game;
    }

    /**
     *  获得房间数据
     * @returns 
     */
    getRoomData(): RoomData {
        return {
            id: this._id,
            num: this._players.size,
            state: this._roomstate,
            numLimit: this._numLimit,
            createTime: this._createTime,
            playerInfos: this._playerInfos,
            gamedata: this._game.getGameData(),
        }
    }

    //
    isFull(): boolean {
        return this._players.size >= this._numLimit;
    }

    isReady(): boolean {
        return this._roomstate == RoomState.Ready;
    }

    hasPlayer(userId: string): boolean {
        let pldata = this._playerInfos.find(item => item.id == userId);
        return pldata != undefined;
    }

    addPlayer(data: PlayerData) {
        if (this.hasPlayer(data.userid)) {
            return false;
        }

        if (this.isFull()) {
            return false;
        }

        this.doAddPlayer(data);
        this._playerInfos.push({
            id: data.userid,
            name: data.userid,
            state: PlayerStatus.Online
        });

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
        this._players.set(data.userid, player);
        this._playerConns.push(player.getConn() as WsConnection);
    }

    notify() {
        if (this._playerConns.length == 0) {
            return;
        }

        // Broadcast
        server.broadcastMsg(
            'RoomData',
            {
                data: this.getRoomData()
            },
            this._playerConns
        );
    }

    gameStart() {
        this._roomstate = RoomState.Start;
        this._game.init([...this._players.keys()]);
        this.notify();
    }

    gameOver() {
        this._roomstate = RoomState.Over;
        this.notify();
    }

    update() {

    }

    destroy() {

    }

    /**
     * 玩家退出房间
     * @param uid 
     */
    exitPlayer(uid: string) {
        this.removePlayer(uid);
        this._playerInfos = this._playerInfos.filter(item => item.id != uid);
        this.notify();
    }

    /**
     * 移除玩家
     * @param uid 玩家id 
     * @returns 
     */
    removePlayer(uid: string) {
        if (!this.hasPlayer(uid)) {
            return;
        }

        let pldata = this._players.get(uid)!;
        this._players.delete(uid);
        this._playerConns = this._playerConns.filter(item => item !== pldata.getConn());
    }

    /**
     * 玩家掉线
     * @param data 
     * @returns 
     */
    disconnect(uid: string) {
        this.removePlayer(uid);

        let pldata = this._playerInfos.find(item => item.id === uid);

        if (pldata) {
            pldata.state = PlayerStatus.Offline;
        }

        this.notify();
    }

    /**
     * 玩家重连
     * @param data 
     * @returns 
     */
    reconnect(data: PlayerData) {
        if (!this.hasPlayer(data.userid)) {
            return false;
        }

        this.doAddPlayer(data)

        let pldata = this._playerInfos.find(item => item.id === data.userid);

        if (pldata) {
            pldata.state = PlayerStatus.Online;
        }

        this.notify();
    }

    /**
     * 游戏操作
     * @param operation 
     * @param arags 
     */
    gameOpetaion(operation: string, arags: Object) {
        if (this._game.doOperation(operation, arags)) {
            this.notify();
            return true;
        }

        return false;
    }
}

export { Room }