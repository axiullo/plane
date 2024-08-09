export default class State {
    public static readonly invalidState = 'invalid'

    protected _owner: any
    public get owner(): any { return this._owner }


    public constructor(owner: any) {
        this._owner = owner
    }


    // 进入状态
    public onEnter(_arg?: any, _lastKey?: string) { }

    // 重新进入状态
    public onReEnter(_arg?: any) { }

    // 每帧调用
    public onUpdate(_dt: number) { }

    // 退出状态
    public onExit(_nextKey: string) { }

    // 获取状态ID
    public getStateKey(): string {
        return State.invalidState
    }
}