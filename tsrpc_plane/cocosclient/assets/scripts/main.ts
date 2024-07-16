import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;
import { ModNet } from './mod/modnet';
@ccclass('main')
export class main extends Component {
    start() {
        ModNet.getInstance().connect();
    }

    update(deltaTime: number) {
        
    }
}


