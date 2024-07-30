import { _decorator, Button, EventHandler, Label, log, math, Sprite, UITransform, Node } from "cc";
const { ccclass, menu } = _decorator;

@ccclass('WButton')
@menu('#WUIComponent/WButton')
export class WButton extends Button {
    private _label: Label = null;

    constructor() {
        super();
    }

    protected onLoad(): void {
        this.label?.getComponent(UITransform).setContentSize(this.node.getComponent(UITransform).contentSize);
    }

    public get label(): Label | null {
        if (this._label == null) {
            this._label = this.node.getComponentInChildren(Label);
        }

        return this._label;
    }

    setOnClick(node: Node, component: string, handler: string, customEventData: string = ""): void {
        const clickEventHandler = new EventHandler();
        clickEventHandler.target = node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = component;// 这个是脚本类名
        clickEventHandler.handler = handler;
        clickEventHandler.customEventData = customEventData;
        this.clickEvents.push(clickEventHandler);
    }

    setText(str: string): void {
        if (this.label != null)
            this.label!.string = str;
    }

    setFontSize(v: number): void {
        if (this.label == null)
            return;

        this.label!.fontSize = v;
    }

    setColor(v: math.Color): void {
        let btnSprite = this.node.getComponent(Sprite);

        if (btnSprite != null) {
            btnSprite.color = v;
        }
    }

    setDisabled(v: boolean): void {
        this.interactable = !v;
        let btnSprite = this.node.getComponent(Sprite);

        if (btnSprite != null) {
            btnSprite.grayscale = v;
        }
    }
}