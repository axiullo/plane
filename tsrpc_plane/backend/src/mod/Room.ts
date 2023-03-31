import {Player} from "./Player";

//房间类
export class Room {
    //房间id
    private _id:number;
    private _players:Player[];
    private _num:number;

    constructor(id:number, num:number = 2) {
        this._id = id;
        this._players = [];
        this._num = num;
    }
    
    addPlayer(player:Player) {
        if(this._players.length >= this._num){
            return false;
        }

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


}