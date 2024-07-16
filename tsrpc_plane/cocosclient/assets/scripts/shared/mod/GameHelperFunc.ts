const mapToObject: { [key: string]: any } = {};

/**
 * 将map转换为json串
 * @param mapParam map类型参数
 * @returns string 
 */
export function funcMapToObjectStr(mapParam: Map<string, any>) {
    Object.getOwnPropertyNames(mapToObject).forEach(key => {
        delete mapToObject[key];
    });

    mapParam.forEach((value, key) => {
        mapToObject[key] = value;
    });

    return JSON.stringify(mapToObject);
}

/**
* Fisher-Yates（也称为 Knuth）洗牌算法
* @param array 
*/
export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // 随机选取小于等于 i 的整数
        [array[i], array[j]] = [array[j], array[i]]; // 交换 array[i] 和 array[j]
    }
}