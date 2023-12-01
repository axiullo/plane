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
            socketTimeoutMS: 200,
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

    async insertOne(cltName: string, data: any) {
        let result = await this._db.collection(cltName).insertOne(data);
        return result;
    }
}

var DBIns = new ModMongoDB();
export { DBIns };