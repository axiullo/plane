import { apple } from '../shared/db/dbstruct';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from './DataBase';

/**
 * 杂项数据
 */
export class AppleObj extends DataBase {
    _stdata:apple;
    tbname = "apple";

    public constructor() {
        super();

        this._stdata = {
            id:"",
            day0: 0,
            isqiandao: false,
            roomid: "",
        }
    }

    public init(): void {
        this._stdata.day0 =  DateTimeHelper.day0();
        this._stdata.isqiandao = false;

        // this.day0 =DateTimeHelper.day0();
        // this.isqiandao = false;
    }

    public load(dbdata: any): void {
        this._stdata = {...dbdata};
    }

    public loaded() {
        if (this.stdata.day0 == DateTimeHelper.day0()) {
            return;
        }

        this.modify("day0", DateTimeHelper.day0());
        this.modify("isqiandao", false);
    }
}