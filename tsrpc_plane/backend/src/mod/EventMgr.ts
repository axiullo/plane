/// 事件管理器
import EventEmitter from "events";

class WmEventEmitter extends EventEmitter {}

//事件管理实例
var WmEventMgrIns = new WmEventEmitter();

export {WmEventMgrIns};