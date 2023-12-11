//
import { Db, MongoClient } from "mongodb";
import { server } from "../";

export class ModMongoDB {
    private _db!: Db;

    async init(host: string, port: number, dbname: string) {
        let dburl = `mongodb://${host}:${port}`;
        //貌似连接超时没有什么用。。。
        let options = {
            connectTimeoutMS: 200, //连接超时时间n毫秒
            socketTimeoutMS: 300000, //5分钟
        }

        try {
            const client = await new MongoClient(dburl, options).connect();
            this._db = client.db(dbname);
            server.logger.log("db connect success");
        }
        catch (err: any) {
            server.logger.error(err.message + "\n" + err.stack);
        }
    }

    //通过主键查找
    // async find(cltName: string, id:number){

    // }

    async findOne(cltName: string, condition: any) {
        return await this._db.collection(cltName).findOne(condition);
    }

    /**
     * 插入一条数据
     * @param cltName 
     * @param data 
     * @returns 
     */
    async insertOne(cltName: string, data: any) {
        let result = await this._db.collection(cltName).insertOne(data);
        server.logger.debug("insertOne", result, "insert data:", data);
        return result;
    }

    /**
     * 删除一条数据
     * @param cltName 
     * @param filter 
     * @returns 
     */
    async deleteOne(cltName: string, filter: any) {
        let result = await this._db.collection(cltName).deleteOne(filter);
        return result;
    }

    /**
     * 更新一条数据
     * @param cltName 
     * @param filter 
     * @param data 
     * @returns 
     */
    async updateOne(cltName: string, filter: any, data: any) {
        server.logger.debug("updateOne before", "condition:", filter, "update data:", data);
        let result = await this._db.collection(cltName).updateOne(filter, {$set:data});
        server.logger.debug(result, "condition:", filter, "update data:", data);
        return result;
    }
}

var DBIns = new ModMongoDB();
export { DBIns };