import { _decorator, Event } from 'cc';
import { UIView } from '../UIView';
import { WButton } from '../components/WButton';
import { UIMgr } from '../UIMgr';
import { UIID } from '../UIConfig';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends UIView {
    @property(WButton)
    private btnBag: WButton = null;

    protected onLoad(): void {
        this.btnBag.setOnClick(this.node, "UIMain", "btnBagClick");
    }

    start() {

    }

    update(deltaTime: number) {

    }

    protected btnBagClick(event: Event) {
        UIMgr.inst.open(UIID.UIBag);
    }
}


