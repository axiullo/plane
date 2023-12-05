/**
 * 数据基础类
 */
export abstract class DataBase {
    [key: string]: any;
    updatets: number;
    /**
     * 是否首次创建
     */
    isnew: boolean = false;
    dirtySet: Set<string> = new Set();
    readonly emptyData: any = {};

    constructor() {
        this.updatets = Date.now();
    }

    /**
     * 初始化
     */
    public abstract init(): void;
    public abstract load(dbdata: any): void;
    public abstract loaded(): any;

    /**
     * 设置属性值
     * @param key 
     * @param value 
     */
    public set(key: string, value: any): void {
        if (!this.hasOwnProperty(key)) {
            throw new Error(`key:${key} not exist`);
        }

        this[key] = value;
        this.dirtySet.add(key);
    }

    public dirtyData(): any {
        if (this.dirtySet.size <= 0) {
            return this.emptyData;
        }

        let retData:any = {};

        for (let item of this.dirtySet) {
            retData[item] = this[item];
        }

        this.dirtySet.clear();
        return retData;
    }
}