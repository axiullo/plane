import { _decorator } from 'cc';
import PanelBase from '../view/PanelBase';
import AppConstants from '../AppConstants';
const { ccclass } = _decorator;

@ccclass('PanelRed')
export class PanelRed extends PanelBase {
    public bundleName: string = 'null' //Bundle名称设置成 null 就从场景加载

    public panelMaskStyle: number = AppConstants.panelMaskStyle.Black | AppConstants.panelMaskStyle.Close;
    public panelShowStyle: number = AppConstants.panelShowStyle.LeftToCenter;
    // 缓动参数定义   export type TweenEasing = "linear" | "smooth" | "fade" | "constant" | "quadIn" | "quadOut" | "quadInOut" | "quadOutIn" | "cubicIn" | "cubicOut" | "cubicInOut" | "cubicOutIn" | "quartIn" | "quartOut" | "quartInOut" | "quartOutIn" | "quintIn" | "quintOut" | "quintInOut" | "quintOutIn" | "sineIn" | "sineOut" | "sineInOut" | "sineOutIn" | "expoIn" | "expoOut" | "expoInOut" | "expoOutIn" | "circIn" | "circOut" | "circInOut" | "circOutIn" | "elasticIn" | "elasticOut" | "elasticInOut" | "elasticOutIn" | "backIn" | "backOut" | "backInOut" | "backOutIn" | "bounceIn" | "bounceOut" | "bounceInOut" | "bounceOutIn";
    public easingShow: any = { easing: 'backOut' }
    public easingHide: any = { easing: 'backIn' }

    protected onLoad(): void {

    }

    start() {

    }

    update(deltaTime: number) {

    }
}