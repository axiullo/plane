import AppConstants from "../AppConstants"
import PanelMgr from "./PanelMgr"
import { UIView } from "./UIView"


export default class PanelBase extends UIView {
    public uiId:number;
    public panelName: string
    public panelShowStyle: number = AppConstants.panelShowStyle.Normal
    public panelMaskStyle: number = AppConstants.panelMaskStyle.NoThrough
    public duration: number = 0.2

    // 关闭面板(有动画)
    public close() {
        PanelMgr.hide(this.uiId)
    }

    // 关闭面板(无动画, 立即关闭)
    public closeImmediate() {
        PanelMgr.destroy(this.uiId)
    }
}