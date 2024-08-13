import State from "./State"

export default class StateMachine {
    private _owner: any
    private _stateMap: Map<string, State> = new Map()
    private _currentState: State

    public constructor(owner: any) {
        this._owner = owner
    }

    public register(state: State) {
        if (this._owner != state.owner) {
            console.error('StateMachine.register owner 不一致')
            return
        }

        this._stateMap.set(state.getStateKey(), state)
    }

    public enter(key: string, _arg?: any) {
        const state = this._stateMap.get(key)
        if (!state) {
            console.error('StateMachine.enter 不存在 state:' + key)
            return
        }

        if (!this._currentState) {
            state.onEnter(_arg)

            this._currentState = state
        } else {
            if (this._currentState.getStateKey() == key) {
                state.onReEnter(_arg)
            } else {
                this._currentState.onExit(state.getStateKey())

                state.onEnter(_arg, this._currentState.getStateKey())

                this._currentState = state
            }
        }
    }

    public update(dt: number) {
        if (this._currentState) {
            this._currentState.onUpdate(dt)
        }
    }

    public getCurrentStateKey(): string {
        if (this._currentState) {
            return this._currentState.getStateKey()
        }

        return State.invalidState
    }

    public clear() {
        if (this._currentState) {
            this._currentState.onExit(State.invalidState)
        }

        this._owner = null
        this._stateMap.clear()
        this._stateMap = null
        this._currentState = null
    }
}