import { ModDb } from './ModDb';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from '../dataobj/DataBase';
import { UserObj } from '../dataobj/UserObj';
import { AppleObj } from '../dataobj/AppleObj';
import { MsgSyncData, SyncData, SyncDataOpt } from '../shared/protocols/MsgSyncData';
import { NetHelper } from '../helper/NetHelper';



interface ClassFactory<T> {
    new(): T;
}

// 类工厂对象
export let tbname2Obj: { [key: string]: ClassFactory<DataBase> } = {
    "user": UserObj,
    "apple": AppleObj,
};

/**
 * 数据管理类
 */
export class DataMgr {
    private static sinstance: DataMgr;
    //数据map， id，tbname表名，obj数据
    //todo：这里是否应该用DataBase取代any。每次转换对象时根据tbname取对应类型。
    private id2datasMap: Map<string, Map<string, DataBase>>;

    /**
     * 脏数据对象们
     */
    private drityObjs: Map<DataBase, boolean>;

    private constructor() {
        this.id2datasMap = new Map<string, Map<string, DataBase>>();
        this.drityObjs = new Map<DataBase, boolean>()
    };

    /**
     * 实例化单例
     */
    public static get instance(): DataMgr {
        if (this.sinstance == null) {
            this.sinstance = new DataMgr();
        }

        return this.sinstance;
    }

    public async getDataObjByName(id: string, key: string): Promise<DataBase | null> {
        const factory = tbname2Obj[key];

        if (factory) {
            let obj = await this.getData(id, key, factory);
            return obj;
        }
        return null;
    }

    /**
     * 获得数据
     * @param {string} id 主键
     * @returns {any} 数据实例
     * 
     * todo: 根据tbname获得数据结构， 这里不应该再用cfun参数
     */
    public async getData<T extends DataBase>(id: string, tbname: string, cfun: new () => T, iscreate: boolean = true): Promise<T | null> {
        let datasmap = this.id2datasMap.get(id);
        
        if (!datasmap) {
            datasmap = new Map<string, DataBase>();
            this.id2datasMap.set(id, datasmap);
        }

        let dataobj = datasmap.get(tbname);

        if (!dataobj) {
            let dbdata = await ModDb.instance.FindOne(tbname, "id", id);

            if (!dbdata) {
                if (!iscreate) {
                    return null;
                }

                dataobj = new cfun();
                dataobj.init(); //初始化数据
                dataobj.isnew = true;
                dataobj.isinsert = true;//插入标记，如果数据有modify更改，则整个插入数据库，否则不进库
            }
            else {
                dataobj = new cfun();
                dataobj.load(dbdata); //根据数据库数据创建数据实例
            }
            
            datasmap.set(tbname, dataobj);
        }

        dataobj.updatets = DateTimeHelper.now();
        dataobj.loaded();

        if (dataobj.isnew) {
            dataobj.isnew = false;
        }

        return dataobj as T;
    }

    /**
     * 移除缓存
     * @param id 主键
     * @param tbname 表名
     */
    public removeCache(id: string, tbname: string) {
        let datasmap = this.id2datasMap.get(id);
        datasmap?.delete(tbname);
    }

    /**
     * 设置脏数据
     * @param obj 
     */
    public dirty(obj: DataBase): void {
        this.drityObjs.set(obj, true);
    }

    /**
     * 数据提交
     */
    public async commit() {
        if (this.drityObjs.size <= 0)
            return;

        let objs = this.drityObjs.keys();
        let uid2syncData: Map<string, MsgSyncData> = new Map<string, MsgSyncData>();

        for (let obj of objs) {
            let syncdata: SyncData = {
                tbname: obj.tbname,
                opt: SyncDataOpt.Update,
                data: obj.dirtyData(),
            };

            if (obj.isinsert) {
                ModDb.instance.insertOne(obj.tbname, syncdata.data);
            }
            else if (obj.isdelete) {
                syncdata.opt = SyncDataOpt.Delete;
                ModDb.instance.deleteOne(obj.tbname, { id: obj.stdata.id });
            }
            else {
                ModDb.instance.updateOne(obj.tbname, { id: obj.stdata.id }, syncdata.data);
            }

            let syncDatas = uid2syncData.get(obj.stdata.id);

            if (!syncDatas) {
                uid2syncData.set(obj.stdata.id, {
                    datas: [],
                });

                syncDatas = uid2syncData.get(obj.stdata.id)!;
            }

            syncDatas.datas.push(syncdata);
            this.drityObjs.delete(obj);
        }

        //通知客户端数据更新
        for (let [uid, v] of uid2syncData) {
            NetHelper.tocli(uid, "SyncData", v);
        }
    }

    /**
     * 数据回滚
     */
    public rollback() {
        if (this.drityObjs.size <= 0)
            return;

        let objs = this.drityObjs.keys();
        for (let obj of objs) {
            this.removeCache(obj.stdata.id, obj.tbname);
        }

        this.drityObjs.clear();
    }
}
