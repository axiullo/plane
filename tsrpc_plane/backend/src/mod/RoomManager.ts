import { Room } from "./Room";
import { IdCreatorIns } from "../helper/IdCreaterHelper";

//房间管理类
class RoomManager {
    private roomMap: Map<string, Room> = new Map<string, Room>();

    constructor() {

    }

    createRoom(): Room {
        let uid = IdCreatorIns.getUid()
        let ins = new Room(uid, 2);
        this.roomMap.set(uid, ins);

        return ins;
    }

    getRoom(uid: string): Room | undefined {
        return this.roomMap.get(uid);
    }

    delRoom(uid: string): void {
        var ins = this.getRoom(uid);

        if (ins) {
            ins.destroy();
        }

        this.roomMap.delete(uid);
    }

    update(): void {
        this.roomMap.forEach((room) => {
            room.update();
        })
    }
}

export var RoomManagerIns = new RoomManager();