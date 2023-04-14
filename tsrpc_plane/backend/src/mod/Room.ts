import {Player, PlayerData} from "./Player";

//房间类
export class Room {
    //房间id
    private _id:string;
    private _players:Player[];
    private _num:number;
    private _state:string; //房间状态

    constructor(id:string, num:number = 2) {
        this._id = id;
        this._players = [];
        this._num = num;
    }
    
    addPlayer(data:PlayerData) {
        if(this._players.length >= this._num){
            return false;
        }

        var player = new Player(data.getId(),data.getConn());
        this._players.push(player);

        if(this._players.length == this._num){
            this.gameStart();
        }

        return true;
    }

    gameStart(){
        
    }

    gameOver(){

    }

    destroy(){

    }
}