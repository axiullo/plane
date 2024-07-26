import { _decorator, Button, Label, log, math, Sprite, UITransform } from "cc";
const { ccclass,menu } = _decorator;

@ccclass('WButton')
@menu('#WUIComponent/WButton')
export class WButton extends Button {
    private _label: Label = null;

    constructor() {
        super();
        log(`WButton constructor`);
    }

    protected onLoad(): void {
        log(`WButton onLoad`);

        this.label?.getComponent(UITransform).setContentSize(this.node.getComponent(UITransform).contentSize);
    }

    public get label(): Label | null {
        if (this._label == null) {
            this._label = this.node.getComponentInChildren(Label);
        }

        return this._label;
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
