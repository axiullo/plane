import { _decorator, Component, EventTouch, Input, input, Node } from 'cc';
import { UIView } from '../view/UIView';
const { ccclass, property } = _decorator;

@ccclass('UIClick')
export class UIClick extends UIView {
    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
    }

    update(deltaTime: number) {
        
    }

    onTouchStart(et:EventTouch) {
        console.log("1111111111111111");
    }
}