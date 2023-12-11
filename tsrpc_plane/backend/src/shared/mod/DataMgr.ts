import { ModDb } from '../../mod/ModDb';
import { DateTimeHelper } from '../helper/DateTimeHelper';
import { DataBase } from '../dataobj/DataBase';

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

    /**
     * 获得数据
     * @param {string} id 主键
     * @returns {any} 数据实例
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
                dataobj.isinsert = true;
            }
            else {
                dataobj = new cfun();
                dataobj.load(dbdata); //根据数据库数据创建数据实例
            }

            datasmap.set(tbname, dataobj);
        }

        dataobj.updatets = DateTimeHelper.Now();
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

        for (let obj of objs) {
            if (obj.isinsert) {
                ModDb.instance.insertOne(obj.tbname, obj.dirtyData());
            }
            else if (obj.isdelete) {
                ModDb.instance.deleteOne(obj.tbname, { id: obj.id });
            }
            else {
                ModDb.instance.updateOne(obj.tbname, { id: obj.id }, obj.dirtyData());
            }

            this.drityObjs.delete(obj);
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
            this.removeCache(obj.id, obj.tbname);
        }

        this.drityObjs.clear();
    }
}
