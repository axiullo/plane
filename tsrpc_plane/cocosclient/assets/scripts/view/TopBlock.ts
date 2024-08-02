import { BlockInputEvents, Node, UIOpacity } from "cc";
import AppConstants from "../AppConstants"
import AppUtil from "../AppUtil"
import LayerMgr from "./LayerMgr"


export default class TopBlock {
    private static _view: Node

    public static show() {
        this.ensure()

        LayerMgr.setLayer(this._view, AppConstants.viewLayer.Top)
        this._view.active = true
    }

    public static hide() {
        if (!this._view || !this._view.isValid)
            return

        this._view.active = false
    }

    private static ensure() {
        if (this._view && this._view.isValid)
            return

        this._view = new Node('TopBlock');
        this._view.addComponent(UIOpacity).opacity = 0;
        AppUtil.setWidget(this._view)
        this._view.addComponent(BlockInputEvents)
    }
}