import { Director, director, error, game } from "cc"
import Singleton from "../base/Singleton"

interface ITimer {
    tick: number
    interval: number
    cb: Function
    ctx: any
    repeat: number
    key: string
}


export default class TimerMgr extends Singleton {
    public static get inst() {
        return super.getInstance<TimerMgr>()
    }

    private _timers: ITimer[] = []

    constructor() {
        super()

        director.on(Director.EVENT_BEFORE_UPDATE, this.update, this)
    }

    /**
    添加定时器
    @param interval 定时间隔, 单位毫秒(0 每帧调用)
    @param cb 定时回调函数
    @param ctx 回调函数对象, 可以为空
    @param repeat 重复次数, 默认为 1 次(小于等于 0 一直调用)
    @param key 当循环遍历对象做定时用同一个回调函数时可以添加 key 做区别

    @example 
    `js
    // 3秒 后回调 echo, 共 1 次
    TimerMgr.inst.add(3000, this.echo)
    // 每 0.5秒 回调 echo, 共 5 次
    TimerMgr.inst.add(500, this.echo, this, 5)
    // 每秒回调 echo, 无限次
    TimerMgr.inst.add(500, this.echo, this, 0)
    `
    */
    public add(interval: number, cb: Function, ctx?: any, repeat: number = 1, key?: string) {
        if (cb == null) {
            error('TimerMgr.add 参数错误')
            return
        }

        if (this.exist(cb, ctx, key)) {
            error('TimerMgr.add 定时器已存在')
            return
        }

        this._timers.push({ tick: 0, interval, cb, ctx, repeat, key })
    }

    public del(cb: Function, ctx?: any, key?: string) {
        const index = this._timers.findIndex(timer => cb === timer.cb && timer.ctx === ctx && timer.key === key)
        index >= 0 && this._timers.splice(index, 1)
    }

    public clear(ctx: any) {
        if (!ctx) return

        for (let i = this._timers.length - 1; i >= 0; i--) {
            const timer = this._timers[i]
            if (timer.ctx == ctx) {
                this._timers.splice(i, 1)
            }
        }
    }

    private update() {
        const dt = game.deltaTime

        for (let i = this._timers.length - 1; i >= 0; i--) {
            const timer = this._timers[i]

            timer.tick += dt * 1000
            if (timer.tick < timer.interval) {
                continue
            }

            timer.tick -= timer.interval

            if (timer.repeat <= 0) {
                if (timer.interval == 0) {
                    timer.cb.call(timer.ctx, dt)
                } else {
                    timer.cb.call(timer.ctx, timer.key)
                }
                continue
            }

            timer.repeat--
            if (timer.repeat == 0) {
                this._timers.splice(i, 1)
            }

            timer.cb.call(timer.ctx, timer.key)
        }
    }

    private exist(cb: Function, ctx?: any, key?: string): boolean {
        const index = this._timers.findIndex(timer => cb === timer.cb && timer.ctx === ctx && timer.key === key)
        return index >= 0
    }
}