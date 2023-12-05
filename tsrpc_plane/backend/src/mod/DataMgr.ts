import { ModDb } from './ModDb';
import { DataHelper } from '../helper/DataHelper';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from '../shared/dataobj/DataBase';

/**
 * 数据管理类
 */
export class DataMgr {
    private static sinstance: DataMgr;
    //数据map， id，tbname表名，obj数据
    //todo：这里是否应该用DataBase取代any。每次转换对象时根据tbname取对应类型。
    private id2datasMap: Map<string, Map<string, DataBase>>;

    private constructor() {
        this.id2datasMap = new Map<string, Map<string, DataBase>>();
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
    public async getData<T extends DataBase>(id: string, tbname: string,cfun:new ()=>T, iscreate: boolean = true): Promise<T | null> {
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

                dataobj = DataHelper.init<T>(cfun);
                dataobj.isnew = true;
            }
            else {
                dataobj = DataHelper.create<T>(dbdata, cfun);
            }

            datasmap.set(tbname, dataobj);
        }

        dataobj.updatets = DateTimeHelper.Now();
        DataHelper.loaded(dataobj);

        if(dataobj.isnew){
            dataobj.isnew = false;
        }

        return dataobj as T;
    }
}
