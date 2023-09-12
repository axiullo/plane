import { ObjectId } from "mongodb";

export interface DbUser {
    _id?: ObjectId;
    userid:string; //用户id
    name: string; //用户名
    createtime:number; //创建时间
}