import { ModDb } from './ModDb';
/**
 * 数据管理类
 */
export class DataMgr {
    private static _instance: DataMgr;
    //数据map， id，表名，数据
    private id2datasMap: Map<string, Map<string, any>>;

    private constructor() {
        this.id2datasMap = new Map<string, Map<string, any>>();
    };

    public static get instance(): DataMgr {
        if (this._instance == null) {
            this._instance = new DataMgr();
        }

        return this._instance;
    }

    /**
     * 获得数据
     * @param {string} id 主键
     * @returns {any} 数据实例
     */
    public getData(id: string, tbname: string, iscreate: boolean = false): any | null {
        var datasmap = this.id2datasMap.get(id);

        if (!datasmap) {
            datasmap = new Map<string, any>();
            this.id2datasMap.set(id, datasmap);
        }

        var data = datasmap.get(tbname);

        if (!data) {
            data = ModDb.FindOne(tbname, "id", id);

            if (!data) {
                if (!iscreate) {
                    return null;
                }

                data = this.initData(tbname);
            }

            datasmap.set(tbname, data);
        }

        this.onload(data);
    }

    /**
     * 初始化数据
     * @param tbname 表名 
     */
    public initData(tbname: string): any {
        switch (tbname) {
            case "user":
                break;
        }
    }

    public onload(data:any){

    }
}
