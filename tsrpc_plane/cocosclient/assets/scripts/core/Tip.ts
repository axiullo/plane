import { Prefab, Node, instantiate, tween, UIOpacity, Label, UITransform, Tween, Vec3 } from "cc"
import AppUtil from "../AppUtil"
import ResMgr from "../ResMgr"
import AppConstants from "../AppConstants"
import LayerMgr from "../view/LayerMgr"


export default class Tip {
    private static _prefab: Prefab
    private static _view: Node

    public static async init() {
        if (this._prefab) return true

        const [prefab, err] = await AppUtil.asyncWrap<Prefab>(ResMgr.loadRes('core/Tip'))
        if (err) {
            console.error(`Tip.init 找不到资源 [core/Tip] error:${err}`)
            return false
        }

        this._prefab = prefab

        return true
    }

    public static show(content: string) {
        if (!this._view || !this._view.isValid) {
            this._view = instantiate(this._prefab)
            this._view.getComponent(UIOpacity).opacity = 0

            LayerMgr.setLayer(this._view, AppConstants.viewLayer.Top)
        }

        this._view.getChildByName('lblTip').getComponent(Label).string = content
        this._view.setPosition(this._view.position.x, 0)
        //this._view.stopAllActions()
        Tween.stopAllByTarget(this._view)
        Tween.stopAllByTarget(this._view.getComponent(UIOpacity))

        tween(this._view.getComponent(UIOpacity)).
            show().
            to(0.2, { opacity: 255 }).
            delay(2).
            to(0.5, { opacity: 0 }).
            hide().
            start()

        tween(this._view).
            delay(2.2).
            to(0.5, { position: new Vec3(this._view.getPosition().x,100,this._view.getPosition().z) }).
            hide().
            start()
    }
}