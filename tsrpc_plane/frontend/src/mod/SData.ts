import { base } from "../shared/db/dbstruct";

type ID2DataMap = Map<string, base>;

/**
 * 内存数据
 */
class Sdata {
    srvdata: ID2DataMap; //服务器数据
    srviidata: Map<string, ID2DataMap>; //服务器数据
    private static instance: Sdata;

    private constructor() {
        this.srvdata = new Map();
        this.srviidata = new Map();
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
        if(data.iid){
           let datas = this.srviidata.get(tbname);

           if(!datas){
            datas = new Map<string, base>();
            this.srviidata.set(tbname, datas);
           }

           datas.set(data.iid, data);
        }
        else{
            this.srvdata.set(tbname, data);
        }
    }

    //更新数据
    public updateValue(tbname: string, data: any) {
        let oneData;

        if(data.iid){
            oneData = this.srviidata.get(tbname);
        }
        else{
            oneData = this.srvdata.get(tbname);
        }

        if (!oneData) {
            this.setData(tbname, data);
            return;
        }

        if(data.iid){
            oneData = oneData.get(data.iid);
            
            if(!oneData){
                this.setData(tbname, data);
                return;
            }
        }

        this.updateData(oneData, data);
    }

    updateData(locdata: any, data: any){
        for (var key in data) {
            locdata[key] = data[key];
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

    public getIIData(tbname: string): ID2DataMap | null {
        var oneData = this.srviidata.get(tbname);

        if (!oneData) {
            return null;
        }

        return oneData;
    }

};

export { Sdata }