import { _decorator, Component, Node } from 'cc';
import PanelBase from '../view/PanelBase';
import { WButton } from '../components/WButton';
import PanelMgr from '../view/PanelMgr';
import { UIID } from '../UIConfig';
const { ccclass, property } = _decorator;

@ccclass('PanelYellow')
export class PanelYellow extends PanelBase {
    @property(WButton)
    private btnClose: WButton = null;

    protected onLoad(): void {
        this.btnClose.setOnClick(this.node, "PanelYellow", "onBtnCloseClick");
    }
    start() {

    }

    update(deltaTime: number) {

    }

    private onBtnCloseClick(event: Event, customEventData: string) {
        PanelMgr.hide(UIID.PanelYellow);
    }
}


