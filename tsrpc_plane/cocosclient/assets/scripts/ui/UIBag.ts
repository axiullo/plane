import { _decorator, Component, Node } from 'cc';
import { WButton } from '../components/WButton';
import { UIMgr } from '../UIMgr';
import { UIID } from '../UIConfig';
import { UIView } from '../UIView';
const { ccclass, property } = _decorator;

@ccclass('UIBag')
export class UIBag extends UIView {
    @property(WButton)
    private btnMain:WButton;
    @property(WButton)
    private btnBack:WButton;

    protected onLoad(): void {
        this.btnMain.setOnClick(this.node, "UIBag","onBtnMainClick");
        this.btnBack.setOnClick(this.node, "UIBag","onBtnBackClick");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    private onBtnMainClick(event:Event, customEventData: string){
        UIMgr.inst.open(UIID.UIMain);
    }

    private onBtnBackClick(event:Event, customEventData: string){
        UIMgr.inst.close(this);
    }
}


