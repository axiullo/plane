import AppConstants from "../AppConstants"

interface IHandler {
    cb: Function
    ctx: any
}

export default class EventMgr {
    private static _events: Map<string, IHandler[]> = new Map()


    public static on(event: string, cb: Function, ctx?: any) {
        if (this._events.has(event)) {
            this._events.get(event).push({ cb, ctx })
        } else {
            this._events.set(event, [{ cb, ctx }])
        }
    }

    public static off(event: string, cb: Function, ctx?: any) {
        if (!this._events.has(event)) {
            console.error('EventMgr.off event:' + event + ' 未注册')
            return
        }

        const index = this._events.get(event).findIndex(i => cb === i.cb && i.ctx === ctx);
        index >= 0 && this._events.get(event).splice(index, 1)
    }

    public static emit(event: string, ...params: any[]) {
        if (!this._events.has(event)) {
            if (event != AppConstants.event.PanelShow && event != AppConstants.event.PanelHide) {
                console.error('EventMgr.emit event:' + event + ' 未注册')
            }

            return
        }

        this._events.get(event).forEach(({ cb, ctx }) => {
            cb.apply(ctx, params)
        })
    }

    public static clear(ctx: any): void {
        if (!ctx) return

        this._events.forEach((handlers, _event) => {
            for (let i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i].ctx == ctx) {
                    handlers.splice(i, 1)
                }
            }
        })
    }
}