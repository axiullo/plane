
import { EventKeyboard, input, Input, KeyCode, log, Node, screen, UITransform } from "cc"
import State from "./State"
import StateDef from "./StateDef"
import PanelStateMachine from "../PanelStateMachine"


export default class StateUpDown extends State {
    private _player: Node

    private _speed: number = 400
    private _moveUp: boolean = false
    private _moveDown: boolean = false


    public onEnter(_arg?: any, _lastKey?: string): void {
        log('StateUpDown 进入状态 _lastKey:', _lastKey)
        this._player = (this._owner as PanelStateMachine).node.getChildByName('player')

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
    }

    public onReEnter(_arg?: any): void {
        log('StateUpDown 重新进入状态')
    }

    public onUpdate(dt: number): void {
        let pos = this._player.getPosition();
        const visibleSize = screen.windowSize;

        if (this._moveUp) {
            pos.y += this._speed * dt
            const maxY = visibleSize.height / 2 - this._player.getComponent(UITransform).height / 2
            if (pos.y > maxY) {
                pos.y = maxY
            }
            this._player.setPosition(pos);
        } else if (this._moveDown) {
            pos.y -= this._speed * dt
            const minY = -visibleSize.height / 2 + this._player.getComponent(UITransform).height / 2
            if (pos.y < minY) {
                pos.y = minY
            }
            this._player.setPosition(pos);
        }
    }

    public onExit(_nextKey: string): void {
        log('StateUpDown 退出状态 _nextKey:', _nextKey)
        // systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        // systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    }

    public getStateKey(): string {
        return StateDef.upDown
    }


    private onKeyDown(et: EventKeyboard) {
        if (et.keyCode == KeyCode.KEY_W) {
            this._moveUp = true
        } else if (et.keyCode == KeyCode.KEY_S) {
            this._moveDown = true
        }
    }

    private onKeyUp(et: EventKeyboard) {
        if (et.keyCode == KeyCode.KEY_W) {
            this._moveUp = false
        } else if (et.keyCode == KeyCode.KEY_S) {
            this._moveDown = false
        }
    }
}