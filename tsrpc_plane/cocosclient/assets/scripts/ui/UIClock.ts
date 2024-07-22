import { _decorator, Node } from 'cc';
import { UIView } from './UIView';
const { ccclass, property } = _decorator;

@ccclass('UIClock')
export class UIClock extends UIView {
    @property(Node)
    private minHand:Node = null;
    @property(Node)
    private secHand:Node = null;
    @property(Node)
    private hourHand:Node = null;
    
    start() {

    }

    protected onLoad(): void {
        
    }

    update(deltaTime: number) {
        
    }
}


