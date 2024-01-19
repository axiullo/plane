import { ModDb } from './ModDb';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from '../dataobj/DataBase';
import { MsgSyncData, SyncData, SyncDataOpt } from '../shared/protocols/MsgSyncData';
import { NetHelper } from '../helper/NetHelper';
import { server } from '..';

type ID2DataMap = Map<string, DataBase>;

/**
 * 数据管理类
 */
export class DataMgr {
    private static sinstance: DataMgr;
    //数据map， id，tbname表名，obj数据
    //todo：这里是否应该用DataBase取代any。每次转换对象时根据tbname取对应类型。
    private id2datasMap!: Map<string, ID2DataMap>;
    /**
     * iid数据map
     * <id, <tbname, <id, obj>>> 结构
     */
    private id2datalistMap: Map<string, Map<string, ID2DataMap>>;

    /**
     * 脏数据对象们
     */
    private drityObjs: Map<DataBase, boolean>;

    private constructor() {
        this.id2datasMap = new Map<string, ID2DataMap>();
        this.id2datalistMap = new Map<string, Map<string, ID2DataMap>>();
        this.drityObjs = new Map<DataBase, boolean>();
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
            dataobj = new cfun();

            if (dataobj.getismulti) {

                let errorMsg = `getData failed! ${tbname} is multi!`;
                server.logger.error(errorMsg);
                throw new Error(errorMsg);
            }

            let dbdata = await ModDb.instance.FindOne(tbname, { "id": id });

            if (!dbdata) {
                if (!iscreate) {
                    return null;
                }

                dataobj.init(); //初始化数据
                dataobj.isnew = true;
                dataobj.isinsert = true;//插入标记，如果数据有modify更改，则整个插入数据库，否则不进库
            }
            else {
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
     * 加载双重id数据列表
     * @param id 
     * @param tbname 
     * @param cfun 
     * @param iid 
     * @param iscreate 
     * @returns 
     */
    public async getDataList<T extends DataBase>(id: string, tbname: string, cfun: new () => T): Promise<ID2DataMap> {
        let datalistmap = this.id2datalistMap.get(id);

        if (!datalistmap) {
            datalistmap = new Map<string, ID2DataMap>();
            this.id2datalistMap.set(id, datalistmap);
        }

        let datalist = datalistmap.get(tbname);

        if (!datalist) {
            datalist = new Map<string, DataBase>();
            let dataobj = new cfun(); //为了创建实例取属性

            if (!dataobj.getismulti) {
                let errorMsg = `getData failed! ${tbname} is not multi!`;
                server.logger.error(errorMsg);
                throw new Error(errorMsg);
            }

            let tmplist = await ModDb.instance.FindList(tbname, "id", id);

            if (tmplist.length > 0) {
                for (let i = 0; i < tmplist.length; i++) {
                    dataobj = new cfun();
                    dataobj.load(tmplist[i]); //根据数据库数据创建数据实例
                    dataobj.updatets = DateTimeHelper.now();
                    dataobj.loaded();
                    datalist!.set(dataobj.stdata.iid, dataobj);
                }
            }

            datalistmap.set(tbname, datalist);
        }

        return datalist;
    }

    /**
     * 
     * @param id 
     * @param tbname 
     * @param cfun 
     * @param iid 
     * @param iscreate 
     * @returns 
     */
    public async getDataii<T extends DataBase>(id: string, tbname: string, cfun: new () => T, iid: string = "", iscreate: boolean = true): Promise<T | null> {
        let datalist = await this.getDataList(id, tbname, cfun);

        if (!datalist) {
            return null;
        }

        let dataobj = datalist.get(iid);

        if (!dataobj) {
            if (!iscreate) {
                return null;
            }

            dataobj = new cfun();
            dataobj.init(iid);
            dataobj.isnew = true;
            dataobj.isinsert = true;//插入标记，如果数据有modify更改，则整个插入数据库，否则不进库
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
     * todo:数据整合操作。
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
