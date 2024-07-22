import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;
import { ModNet } from './mod/modnet';
import { UIManager } from './UIManager';
import { UIConfig, UIID } from './UIConfig';
@ccclass('main')
export class main extends Component {

    onLoad() {
        UIManager.getInstance().initUIConf(UIConfig.UICF);
    }

    start() {
        //ModNet.getInstance().connect();
        UIManager.getInstance().open(UIID.UIClock);

        // setTimeout(() => {
        //     UIManager.getInstance().closeUIByUiId(UIID.UIClock);
        // }, 5000);
    }

    update(deltaTime: number) {

    }
}


