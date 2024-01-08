import { user } from '../shared/db/dbstruct';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from './DataBase';

/**
 * 用户数据
 */
export class UserObj extends DataBase implements user {
    tbname = "user";
    userid: string = ""; //用户id
    createtime: number = 0; //创建时间
    password: string = ""; //密码
    lastlogin: number = 0; //上次登录时间
    name: string = ""; //昵称

    constructor() {
        super();
    }

    /**
     * 初始化
     * @returns 
     */
    init(): void {
        this.modify("userid", "");
        this.modify("createtime", DateTimeHelper.now());
        this.modify("password", "");
        this.modify("lastlogin", DateTimeHelper.now());
        this.modify("name", "");
    }

    /**
     * 加载数据
     * @param dbdata 数据库数据
     */
    load(dbdata: user): void {
        this.id = dbdata.id;
        this.userid = dbdata.userid;
        this.createtime = dbdata.createtime;
        this.password = dbdata.password;
        this.name = dbdata.name;
    }

    /**
     * 数据加载完毕时处理
     */
    loaded(): void {

    }

}