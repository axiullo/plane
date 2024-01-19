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
    public async FindOne(tbname: string, filter:any): Promise<any> {
        let data = await this.db.findOne(tbname, filter);
        return data;
    }

    /**
     * 插入一条数据
     * @param tbname 表名 
     * @param obj 数据
     * @returns 
     */
    public async insertOne(tbname: string, obj: any): Promise<any> {
        let result = await this.db.insertOne(tbname, obj);
        return result;
    }

    /**
     * 更新一条数据
     * @param tbname 表名 
     * @param filter 条件
     * @param obj 更新数据
     * @returns 
     */
    public async updateOne(tbname: string, filter: any, obj: any): Promise<any> {
        let result = await this.db.updateOne(tbname, filter, obj);
        return result;
    }

    /**
     * 删除一条数据
     * @param tbname 表名
     * @param filter 删除条件
     * @returns 
     */
    public async deleteOne(tbname: string, filter: any) {
        let result = await this.db.deleteOne(tbname, filter);
        return result;
    }

        /**
     * 查找
     * @param key 
     */
        public async FindList(tbname: string, key: string, con: any): Promise<any> {
            let condition: any = {};
            condition[key] = con;
            let data = await this.db.findList(tbname, condition);
            return data;
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