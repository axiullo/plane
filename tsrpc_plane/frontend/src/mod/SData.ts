import { base } from "../shared/db/dbstruct";

class Sdata {
    srvdata: Map<string, base>; //服务器数据
    private static instance: Sdata;

    private constructor() {
        this.srvdata = new Map<string, base>();
    }

    static getInstance() {
        if (!Sdata.instance) {
            Sdata.instance = new Sdata();
        }
        return Sdata.instance;
    }

    /**
     * 设置数据
     * @param tbname
     */
    public setData(tbname: string, data: any) {
        this.srvdata.set(tbname, data);
    }

    //更新数据
    public updateValue(tbname: string, data: any) {
        var oneData = this.srvdata.get(tbname);

        if (!oneData) {
            this.setData(tbname, data);
            return;
        }

        for (var key in data) {
            oneData[key] = data[key];
        }
    }

    /**
     * 获得数据
     * @param tbname 
     * @returns 
     */
    public getData<T>(tbname: string): T | null {
        var oneData = this.srvdata.get(tbname);

        if (!oneData) {
            return null;
        }

        return oneData as T;
    }
};

export { Sdata }