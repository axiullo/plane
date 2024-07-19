import { _decorator, Node } from 'cc';
import { UIView } from './UIView';
const { ccclass, property } = _decorator;

@ccclass('UIClock')
export class UIClock extends UIView {
    private minHand:Node = null;
    private secHand:Node = null;
    private hourHand:Node = null;
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


