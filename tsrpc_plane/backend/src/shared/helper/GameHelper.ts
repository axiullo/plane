const mapToObject: { [key: string]: any } = {};

export let GameHelper = {
    /**
     * 将map转换为json串
     * @param mapParam map类型参数
     * @returns string 
     */
    funcMapToObjectStr: function (mapParam: Map<string, any>) {
        Object.getOwnPropertyNames(mapToObject).forEach(key => {
            delete mapToObject[key];
        });

        mapParam.forEach((value, key) => {
            mapToObject[key] = value;
        });

        return JSON.stringify(mapToObject);
    }
}