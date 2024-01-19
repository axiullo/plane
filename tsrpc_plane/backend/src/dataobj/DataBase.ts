import { IdCreatorIns } from "../helper/IdCreaterHelper";
import { DataMgr } from "../mod/DataMgr";
/**
 * 数据基础类
 */
export abstract class DataBase {
    /**
     * 索引签名。 通过字符串获得值，缺点安全性低。
     */
    //[key: string]: any;
    /**
     * 表名
     */
    abstract tbname: string;
    /**
     * 是否是多重结构 iid
     */
    static readonly ismulti: boolean = false;
    /**
     * 更新时间
     */
    updatets: number;
    /**
     * 是否首次创建
     */
    isnew: boolean = false;
    /**
     * 是否插入数据库 
     */
    isinsert: boolean = false;
    /**
     * 是否删除
     */
    isdelete: boolean = false;

    /**
     * db数据结构
     */
    abstract _stdata: any;

    dirtySet: Set<string> = new Set();
    readonly emptyData: any = {};

    constructor() {
        this.updatets = Date.now();
    }

    public get getismulti() {
        return DataBase.ismulti;
    }

    /**
     * 初始化
     */
    public abstract init(iid?:string): void;
    public abstract load(dbdata: any): void;
    public abstract loaded(): any;
    public get stdata() {
        return this._stdata;
    }
    /**
     * 设置属性值
     * @param key 
     * @param value 
     */
    public modify(key: string, value: any): void {
        if (!this.stdata.hasOwnProperty(key)) {
            throw new Error(`key:${key} not exist`);
        }

        if (value == null) {

        }
        else {
            this.stdata[key] = value;
        }

        this.dirtySet.add(key);
        DataMgr.instance.dirty(this);
    }

    public delete() {
        this.isdelete = true;
        DataMgr.instance.dirty(this);
    }

    /**
     * 获得要更新的数据
     * @returns 
     */
    public dirtyData(): any {
        if (this.dirtySet.size <= 0) {
            return this.emptyData;
        }

        let retData: any = {};

        for (let item of this.dirtySet) {
            retData[item] = this.stdata[item];
        }

        this.dirtySet.clear();
        return retData;
    }

    protected iidcreate(){
        return IdCreatorIns.getUid();
    }
}