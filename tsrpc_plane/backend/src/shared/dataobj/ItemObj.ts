import { item } from '../db/dbstruct';
import { DataBase } from '../DataBase';

/**
 * 道具数据
 */
export class ItemObj extends DataBase {
    _stdata: item;
    tbname = "item";
    ismulti = true;

    public constructor() {
        super();
        this._stdata = {
            id: "",
            iid: "",
            num: 0
        }
    }

    public get getismulti() {
        return true;//ItemObj.ismulti;
    }

    public init(iid?: string): void {
        if (iid && iid.length > 0) {
            this._stdata.iid = iid;
        }
        else {
            this._stdata.iid = this.iidcreate();
        }

        this._stdata.num = 0;
    }

    public load(dbdata: any): void {
        this._stdata = { ...dbdata };
    }

    public loaded() {
    }
}