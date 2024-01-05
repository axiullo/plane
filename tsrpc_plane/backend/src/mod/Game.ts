import { DateTimeHelper } from "../shared/helper/DateTimeHelper";

let Game = {
    curts: 0, //当前时间戳

    start:function(){
        this.curts = DateTimeHelper.now();
        setInterval(this.updateFrame, 100);
    },

    updateFrame: function () {
        //console.debug("update ", DateTimeHelper.now());
    },
}

export { Game };