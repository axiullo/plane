import { user } from '../db/dbstruct';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from '../DataBase';

/**
 * 用户数据
 */
export class UserObj extends DataBase {
    _stdata: user;
    tbname = "user";

    constructor() {
        super();
        this._stdata = {
            id: "",
            userid: "",
            createtime: 0,
            password: "",
            lastlogin: 0,
            name: "",
        }
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
        this._stdata = {...dbdata};
    }

    /**
     * 数据加载完毕时处理
     */
    loaded(): void {

    }
}