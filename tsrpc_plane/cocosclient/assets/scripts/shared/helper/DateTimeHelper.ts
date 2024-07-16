/**
 * 日期时间处理
 */
let DateTimeHelper = {
    now(): number {
        return Date.now();
    },

    /**
     * 获得day0
     * @param timestamp 时间戳
     * @returns 
     */
    day0(timestamp?: number): number {
        if (!timestamp) {
            timestamp = Math.floor(DateTimeHelper.now() / 1000);
        }

        let date = new Date(timestamp * 1000); // 创建一个Date对象
        date.setHours(0, 0, 0, 0); // 将时间设置为当日的0点
        return Math.floor(date.getTime() / 1000); // 获取0点的时间戳
    }
};

export { DateTimeHelper };