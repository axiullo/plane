import { user } from '../db/dbstruct';
import { DateTimeHelper } from '../helper/DateTimeHelper';
import { DataBase } from './DataBase';

/**
 * 用户类
 */
export class UserObj extends DataBase implements user {
    userid: string = ""; //用户id
    createtime: number = 0; //创建时间
    password: string = ""; //密码
    lastlogin: number = 0; //上次登录时间

    constructor() {
        super();
        this.tbname = "user";
    }

    /**
     * 初始化
     * @returns 
     */
    init(): void {
        this.modify("userid", "");
        this.modify("createtime", DateTimeHelper.Now());
        this.modify("password", "");
        this.modify("lastlogin", DateTimeHelper.Now());
    }

    load(dbdata: user): void {
        this.id = dbdata.id;
        this.userid = dbdata.userid;
        this.createtime = dbdata.createtime;
        this.password = dbdata.password;
    }

    /**
     * 数据加载时处理
     */
    loaded(): void {

    }

}