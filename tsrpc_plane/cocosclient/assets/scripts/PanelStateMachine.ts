import { _decorator, Node } from "cc";
import AppConstants from "./AppConstants"
import TimerMgr from "./mgr/TimerMgr"
import StateDef from "./state/StateDef"
import StateLeftRight from "./state/StateLeftRight"
import StateMachine from "./state/StateMachine"
import StateUpDown from "./state/StateUpDown"
import PanelBase from "./view/PanelBase"
import { WButton } from "./components/WButton";

const { ccclass, property } = _decorator;
@ccclass('PanelStateMachine')
export default class PanelStateMachine extends PanelBase {
    public panelMaskStyle: number = AppConstants.panelMaskStyle.Close | AppConstants.panelMaskStyle.Black //关闭组件(点击面板区域外会关闭面板)加半透明组件
    public panelShowStyle: number = AppConstants.panelShowStyle.Normal

    @property(WButton)
    private btnRL: WButton = null;
    @property(WButton)
    private btnUD: WButton = null;
    @property(WButton)
    private btnClose: WButton = null;

    private _machine: StateMachine

    protected onLoad(): void {
        this._machine = new StateMachine(this)
        this._machine.register(new StateLeftRight(this))
        this._machine.register(new StateUpDown(this))

        this.btnRL.setText("左右");
        this.btnRL.setOnClick(this.node, "PanelStateMachine", "btnRLClick");
        this.btnUD.setText("上下");
        this.btnUD.setOnClick(this.node, "PanelStateMachine", "btnUDClick");
        this.btnClose.setText("关闭");
        this.btnClose.setOnClick(this.node, "PanelStateMachine", "btnCloseClick");
    }

    protected start(): void {
        this._machine.enter(StateDef.leftRight)
        TimerMgr.inst.add(0, this.update, this, 0)
    }

    btnRLClick(): void {
        this._machine.enter(StateDef.leftRight)
    }
    btnUDClick(): void {
        this._machine.enter(StateDef.upDown)
    }
    btnCloseClick(): void {
        this.close()
    }

    onDestroy(): void {
        TimerMgr.inst.clear(this)
    }

    update(dt: number) {
        this._machine.update(dt)
    }
}