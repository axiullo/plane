import { BlockInputEvents, instantiate, Prefab, tween,Node } from "cc"
import AppUtil from "../AppUtil"
import ResMgr from "../ResMgr"
import AppConstants from "../AppConstants"
import LayerMgr from "../view/LayerMgr"


export default class Wait {
    private static _prefab: Prefab
    private static _view: Node

    public static async init() {
        if (this._prefab) return true

        const [prefab, err] = await AppUtil.asyncWrap<Prefab>(ResMgr.loadRes('core/Wait'))
        if (err) {
            console.error(`Wait.init 找不到资源 [core/Wait] error:${err}`)
            return false
        }

        this._prefab = prefab

        return true
    }

    public static show() {
        this.action(true)
    }

    public static hide() {
        this.action(false)
    }


    private static action(flag: boolean) {
        if (!this._view || !this._view.isValid) {
            this._view = instantiate(this._prefab)

            // 挂载 Widget 组件, 保持跟 Canvas 一样大小
            AppUtil.setWidget(this._view)
            // 拦截所有事件
            this._view.addComponent(BlockInputEvents)

            const wait = this._view.getChildByName('wait')
            tween(wait).repeatForever(tween().to(0.75, { angle: -360 }).call(() => wait.angle = 0)).start()
        }

        LayerMgr.setLayer(this._view, AppConstants.viewLayer.Top)

        this._view.active = flag
    }
}