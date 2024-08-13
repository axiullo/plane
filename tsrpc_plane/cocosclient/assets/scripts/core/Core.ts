
import GameConstants from "../GameConstants"
import EventMgr from "../mgr/EventMgr"
import Tip from "./Tip"
import Wait from "./Wait"


export default class Core {
    public static async init() {
        if (!await Tip.init()) return
        if (!await Wait.init()) return

        //EventMgr.emit(GameConstants.event.CoreLoadOk)
    }
}