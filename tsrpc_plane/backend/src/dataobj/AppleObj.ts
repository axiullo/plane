import { apple } from '../shared/db/dbstruct';
import { DateTimeHelper } from '../shared/helper/DateTimeHelper';
import { DataBase } from './DataBase';

/**
 * 杂项数据
 */
export class AppleObj extends DataBase implements apple {
    day0: number
    isqiandao: boolean = false;
    tbname = "apple";

    public constructor() {
        super();

        this.day0 = DateTimeHelper.day0();
        this.isqiandao = false;
    }

    public init(): void {
        this.day0 = DateTimeHelper.day0();
        this.isqiandao = false;
    }

    public load(dbdata: any): void {
        this.day0 = dbdata.day0;
        this.isqiandao = dbdata.isqiandao;
    }

    public loaded() {
        if (this.day0 == DateTimeHelper.day0()) {
            return;
        }

        this.modify("day0", DateTimeHelper.day0());
        this.modify("isqiandao", false);
    }
}