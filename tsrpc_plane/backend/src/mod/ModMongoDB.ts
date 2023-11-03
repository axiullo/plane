//
import { Db, MongoClient } from "mongodb";

class ModMongoDB {
    private _db!: Db;

    async init(host: string, port: number, dbname: string) {
        let dburl = `mongodb://${host}:${port}`;
        let options = {
            connectTimeoutMS:200, //连接超时时间n毫秒
        }

        try{
            const client = await new MongoClient(dburl, options).connect();
            this._db = client.db(dbname);
        }
        catch(err) {
            console.log(err);           
        }
    }

    async findOne(cltName: string, condition: any) {
        return await this._db.collection(cltName).findOne(condition);
    }

    async insertOne(cltName: string, data: any) {
        let result = await this._db.collection(cltName).insertOne(data);
        return result;
    }
}

//export var DBIns = new ModMongoDB();
var DBIns = new ModMongoDB();
export { DBIns };