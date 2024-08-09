import { EventKeyboard, KeyCode, log, Node, SystemEvent, systemEvent, screen, Input, input, UITransform } from "cc"
import State from "./State"
import StateDef from "./StateDef"
import PanelStateMachine from "../PanelStateMachine"

export default class StateLeftRight extends State {
    private _player: Node

    private _speed: number = 400
    private _moveLeft: boolean = false
    private _moveRight: boolean = false


    public onEnter(_arg?: any, _lastKey?: string): void {
        log('StateLeftRight 进入状态 _lastKey:', _lastKey)
        this._player = (this._owner as PanelStateMachine).node.getChildByName('player')

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
    }

    public onReEnter(_arg?: any): void {
        log('StateLeftRight 重新进入状态')
    }

    public onUpdate(dt: number): void {
        let pos = this._player.getPosition();
        const visibleSize = screen.windowSize;

        if (this._moveLeft) {
            this._player.setPosition(pos.x - this._speed * dt, pos.y, pos.z);
            pos = this._player.getPosition();
            const minX = -visibleSize.width / 2 + this._player.getComponent(UITransform).width / 2
            if (pos.x < minX) {
                pos.x = minX
                this._player.setPosition(pos);
            }
        } else if (this._moveRight) {
            this._player.setPosition(pos.x + this._speed * dt, pos.y, pos.z);
            pos = this._player.getPosition();
            const maxX = visibleSize.width / 2 - this._player.getComponent(UITransform).width / 2
            if (pos.x > maxX) {
                pos.x = maxX
                this._player.setPosition(pos);
            }
        }
    }

    public onExit(_nextKey: string): void {
        log('StateLeftRight 退出状态 _nextKey:', _nextKey)
        // systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        // systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    }

    public getStateKey(): string {
        return StateDef.leftRight
    }


    private onKeyDown(et: EventKeyboard) {
        if (et.keyCode == KeyCode.KEY_A) {
            this._moveLeft = true
        } else if (et.keyCode == KeyCode.KEY_D) {
            this._moveRight = true
        }
    }

    private onKeyUp(et: EventKeyboard) {
        if (et.keyCode == KeyCode.KEY_A) {
            this._moveLeft = false
        } else if (et.keyCode == KeyCode.KEY_D) {
            this._moveRight = false
        }
    }
}