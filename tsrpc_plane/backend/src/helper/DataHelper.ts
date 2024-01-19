import { UserObj } from '../dataobj/UserObj';
import { AppleObj } from '../dataobj/AppleObj';
import { ItemObj } from '../dataobj/ItemObj';
import { DataBase } from '../dataobj/DataBase';

interface ClassFactory<T> {
    new(): T;
}

// 类工厂对象
let tbname2Obj: { [key: string]: ClassFactory<DataBase> } = {
    "user": UserObj,
    "apple": AppleObj,
    "item": ItemObj,
};

let DataHelper = {
    /**
     * 上线需同步的数据
     */
    syncObj: [
        //"user",
        "apple",
        "item",
    ],
}

export { DataHelper, tbname2Obj }