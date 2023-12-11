import { WmEventMgrIns } from "../mod/EventMgr";
import { DataMgr } from "../shared/mod/DataMgr";
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