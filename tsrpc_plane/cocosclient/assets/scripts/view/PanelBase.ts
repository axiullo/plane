import { Tween, tween, Vec3 } from "cc";
import AppConstants from "../AppConstants"
import PanelMgr from "./PanelMgr"
import { UIView } from "./UIView"


export default class PanelBase extends UIView {
    public uiId: number;
    public panelName: string
    public panelShowStyle: number = AppConstants.panelShowStyle.Normal
    public panelMaskStyle: number = AppConstants.panelMaskStyle.NoThrough
    public duration: number = 0.2
    public easingShow: any //打开时的缓动效果
    public easingHide: any //关闭时的缓动效果
    public tweenShow: Tween<null> //自定义打开动画
    public tweenHide: Tween<null> //自定义关闭动画
    public from:Vec3;

    // 关闭面板(有动画)
    public close() {
        PanelMgr.hide(this.uiId)
    }

    // 关闭面板(无动画, 立即关闭)
    public closeImmediate() {
        PanelMgr.hide(this.uiId)
    }
}