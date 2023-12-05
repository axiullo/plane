import { DataBase } from "../shared/dataobj/DataBase";

let DataHelper = {
    /**
     * 初始化数据
     * @param tbname 
     */
    init<T extends DataBase>(cfun: { new(): T; }): DataBase {
        let retObj: T = new cfun();
        retObj.init();
        return retObj
    },

    /**
     * 根据数据库数据创建数据实例
     * @param dbdata db数据
     * @returns 
     */
    create<T extends DataBase>(dbdata: any, cfun: new () => T): DataBase {
        let dataObj: T = new cfun();
        dataObj.load(dbdata);

        return dataObj;
    },

    /**
     * 加载数据后的处理
     */
    loaded<T extends DataBase>(dataObj: T): void {
        dataObj.loaded();
    }
}

export { DataHelper };