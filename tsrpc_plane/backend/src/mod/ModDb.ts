import { DataBase } from "../shared/dataobj/DataBase";
import { ModMongoDB, DBIns } from "./ModMongoDB";

/**
 * 数据库
 */
export class ModDb {
    private static instanceObj: ModDb;
    private db: ModMongoDB;

    private constructor() {
        this.db = DBIns;
    }

    public static get instance(): ModDb {
        if (!this.instanceObj) {
            this.instanceObj = new ModDb();

        }
        return this.instanceObj;
    }

    /**
     * 查找
     * @param key 
     */
    public async FindOne(tbname: string, key: string, v: any): Promise<any> {
        let condition: any = {};
        condition[key] = v;
        let data = await this.db.findOne(tbname, condition);

        return data;
    }

    /**
     * 
     * @param drityObjs 
     */
    public async commit(drityObjs: Map<DataBase, boolean>) {
        let objs = drityObjs.keys();

        for (let obj of objs) {
            if(obj.isinsert){

            }
            else if(obj.isdelete){

            }
            else{
                
            }

            drityObjs.delete(obj);
        }
    }

    // /**
    //  * 查找
    //  */
    // public static FindList(tbname: string, key: string, v: any):any{

    // }

    // /**
    //  * 删除
    //  * @param key 
    //  */
    // public static Delete(key: string): any {

    // }
}