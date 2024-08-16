import { _decorator, Color, Event, instantiate, log, Node, Sprite } from 'cc';
import { WButton } from '../components/WButton';
import { UIMgr } from '../view/UIMgr';
import { UIID } from '../UIConfig';
import TopBlock from '../view/TopBlock';
import AppUtil from '../AppUtil';
import App from '../App';
import { UIView } from '../view/UIView';
import PanelMgr from '../view/PanelMgr';
import LayerMgr from '../view/LayerMgr';
import Tip from '../core/Tip';
import Wait from '../core/Wait';
import TimerMgr from '../mgr/TimerMgr';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends UIView {
    @property(WButton)
    private btnBag: WButton = null;
    @property(WButton)
    private btnSprite: WButton = null;
    @property(WButton)
    private btnPanelYellow: WButton = null;
    @property(WButton)
    private btnPanelGreen: WButton = null;
    @property(WButton)
    private btnTip: WButton = null;
    @property(WButton)
    private btnWait: WButton = null;
    @property(WButton)
    private btnStateMachine: WButton = null;

    protected onLoad(): void {
        this.btnBag.setOnClick(this.node, "UIMain", "btnBagClick");
        this.btnSprite.setOnClick(this.node, "UIMain", "btnSpriteClick");
        this.btnPanelYellow.setOnClick(this.node, "UIMain", "btnPanelYellowClick");
        this.btnPanelGreen.setOnClick(this.node, "UIMain", "btnPanelGreenClick");

        this.btnTip.setText("Tip");
        this.btnTip.setOnClick(this.node, "UIMain", "btnTipClick");
        this.btnWait.setText("Wait");
        this.btnWait.setOnClick(this.node, "UIMain", "btnWaitClick");

        this.btnStateMachine.setText("State Machine");
        this.btnStateMachine.setOnClick(this.node, "UIMain", "btnStateClick");
    }

    start() {
        // setTimeout(() => {
        //     TopBlock.show()
        //     log('这个时候点击无效')
        //     setTimeout(() => {
        //         TopBlock.hide()
        //         log('现在可以点击了')
        //     }, 10000)
        // }, 100)
    }

    update(deltaTime: number) {

    }

    protected btnBagClick(event: Event) {
        UIMgr.inst.open(UIID.UIBag);
    }

    protected btnSpriteClick(event: Event) {
        TopBlock.show()

        const tmpNode = new Node('tmpNode')
        tmpNode.parent = this.node

        const sprite1 = AppUtil.newSpriteNode()
        sprite1.parent = tmpNode
        sprite1.setPosition(-150, sprite1.getPosition().y);

        const sprite2 = AppUtil.newSpriteNode()
        sprite2.parent = tmpNode
        sprite2.getComponent(Sprite).color = Color.GREEN

        const sprite3 = instantiate(sprite1)
        sprite3.parent = tmpNode
        sprite3.setPosition(150, sprite3.getPosition().y);
        //sprite3.color = Color.RED
        sprite3.getComponent(Sprite).color = Color.RED

        setTimeout(() => {
            TopBlock.hide()
            tmpNode.destroy()
        }, 3000)

        App.showNode(this.node);
    }

    protected btnPanelYellowClick(event: Event) {
        PanelMgr.open(UIID.PanelYellow);
    }
    protected btnPanelGreenClick(event: Event) {
        PanelMgr.open(UIID.PanelGreen);
    }

    protected btnTipClick(event: Event) {
        Tip.show("hahahahahha");
    }
    protected btnWaitClick(event: Event) {
        Wait.show();
        TimerMgr.inst.add(3000, () => Wait.hide())
    }

    protected btnStateClick(event: Event) {
        PanelMgr.open(UIID.PanelStateMachine)
    }   
}