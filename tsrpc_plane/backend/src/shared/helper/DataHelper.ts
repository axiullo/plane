import { UserObj } from "../dataobj/UserObj"
import { AppleObj } from "../dataobj/AppleObj"

let DataHelper = {
    /**
     * 
     */
    tbname2Obj: {
        "user": UserObj,
        "apple": AppleObj,
    },

    /**
     * 上线需同步的数据
     */
    syncObj: ["apple"],
}

export { DataHelper }