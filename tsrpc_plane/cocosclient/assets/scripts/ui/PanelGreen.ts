import { _decorator, tween, Vec3 } from 'cc';
import PanelBase from '../view/PanelBase';
import { WButton } from '../components/WButton';
import PanelMgr from '../view/PanelMgr';
import { UIID } from '../UIConfig';
import AppConstants from '../AppConstants';
const { ccclass, property } = _decorator;

@ccclass('PanelGreen')
export class PanelGreen extends PanelBase {
    @property(WButton)
    private btnClose: WButton = null;

    public panelMaskStyle: number = AppConstants.panelMaskStyle.Black | AppConstants.panelMaskStyle.NoThrough | AppConstants.panelMaskStyle.Close;
    public panelShowStyle: number = AppConstants.panelShowStyle.Custom;
    // 缓动参数定义   export type TweenEasing = "linear" | "smooth" | "fade" | "constant" | "quadIn" | "quadOut" | "quadInOut" | "quadOutIn" | "cubicIn" | "cubicOut" | "cubicInOut" | "cubicOutIn" | "quartIn" | "quartOut" | "quartInOut" | "quartOutIn" | "quintIn" | "quintOut" | "quintInOut" | "quintOutIn" | "sineIn" | "sineOut" | "sineInOut" | "sineOutIn" | "expoIn" | "expoOut" | "expoInOut" | "expoOutIn" | "circIn" | "circOut" | "circInOut" | "circOutIn" | "elasticIn" | "elasticOut" | "elasticInOut" | "elasticOutIn" | "backIn" | "backOut" | "backInOut" | "backOutIn" | "bounceIn" | "bounceOut" | "bounceInOut" | "bounceOutIn";
    public easingShow: any = { easing: 'backOut' }
    public easingHide: any = { easing: 'backIn' }

    protected onLoad(): void {
        this.cache = true;
        this.btnClose.setOnClick(this.node, "PanelGreen", "onBtnCloseClick");

        this.tweenShow = tween(this.node).to(this.duration, { scale: Vec3.ONE, angle: 360 * 8 })
        this.tweenHide = tween(this.node).to(this.duration, { scale: Vec3.ZERO, angle: 0 })
    }
    
    start() {

    }

    update(deltaTime: number) {

    }

    private onBtnCloseClick(event: Event, customEventData: string) {
        this.close();
        //this.closeImmediate();
    }
}


