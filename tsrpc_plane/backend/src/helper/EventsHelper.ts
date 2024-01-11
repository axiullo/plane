import { WmEventMgrIns } from "../mod/EventMgr";
import { DataMgr } from "../mod/DataMgr";
import { server } from "..";

/**
 * 数据提交
 */
WmEventMgrIns.on("DataApply", async function(/**args */){
    await DataMgr.instance.commit();
})

/**
 * 数据回滚
 */
WmEventMgrIns.on("DataRollBack", function(){
    DataMgr.instance.rollback();
})

/**
 * 上线
 */
WmEventMgrIns.on("Online", function(){
    server.logger.debug("Online event");
});

/**
 * 下线
 */
WmEventMgrIns.on("Offline", function(){
    server.logger.debug("Offline event");    
});