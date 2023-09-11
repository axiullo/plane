//
import {Db, MongoClient} from "mongodb";

class ModMongoDB{
    private _db!: Db;

    async init()
    {
        var host = "mongodb://127.0.0.1:27018";
        var dbname = "tsrpcplane";
        const client = await new MongoClient(host).connect();
        this._db = client.db(dbname);
    }

    async findOne(cltName:string, condition:any)
    {
        return await this._db.collection(cltName).findOne(condition);
    }

    async insertOne(cltName:string, data:any)
    {
        let result = await this._db.collection(cltName).insertOne(data);
        return result;
    }
}
 
 export var DBIns = new ModMongoDB();