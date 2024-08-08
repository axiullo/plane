import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
import PanelMgr from './view/PanelMgr';
import { UIID } from './UIConfig';
import App from './App';
import LayerMgr from './view/LayerMgr';
const { ccclass, property } = _decorator;

@ccclass('gamemain')
export class gamemain extends Component {
    protected onLoad(): void {
        App.init();

        const btnPanelRed = this.node.getChildByName('btnPanelRed')
        btnPanelRed.on('click', () => PanelMgr.open(UIID.PanelRed));

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    start() {

    }

    update(deltaTime: number) {

    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_P:
                App.showNode(LayerMgr.canvasNode);
                break;
        }
    }
}


