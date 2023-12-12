abstract class base {
  [key: string]: any;

  init(): any {
    throw new Error("realize init");
  }

  public set(key: string, value: any): void {
    if (!this.hasOwnProperty(key)) {
      throw new Error(`key:${key} not exist`);
    }

    this[key] = value;
  }
}

class A extends base {
  n: number;

  constructor() {
    super();
    this.n = 0;
  }
  init(): A {
    this.n = 10;

    return this;
  }
}

class B extends base {
  private m: number;

  constructor() {
    super();
    this.m = 0;
  }
  init(): base {
    this.m = 10;

    return this;
  }
}

// 定义一个映射类型，键是字符串，值是类型
type TypeMap = {
  'string': String,
  'number': Number,
  // 在这里添加更多的类型
};

// 创建一个与 TypeMap 类型相对应的值
const typeMapValue: { [K in keyof TypeMap]: new () => TypeMap[K] } = {
  'string': String,
  'number': Number,
  // 在这里添加更多的类型
};

// 创建实例的函数
function createInstance<T extends keyof typeof typeMapValue>(type: T): InstanceType<typeof typeMapValue[T]> {
  return new typeMapValuetype;
}

// 使用示例
let instance = createInstance('string');
console.log(instance instanceof String);  // 输出：true

instance = createInstance('number');
console.log(instance instanceof Number);  // 输出：true






var omap = new Map<string, base>();
var t = {
  "A": A,
  "B": B,
}

/**
 * Get data
 * @param name The name of the data object
 * @returns The data object with the given name
 */
function getdata<T extends base>(name: string, constructor: new () => T): T {
  let obj: base | undefined = omap.get(name);

  if (!obj) {
    console.log("create");
    obj = new constructor();
    obj!.init();

    omap.set(name, obj);
  }

  console.log("return");
  return obj as T;
}

// let tmp = getdata<A>("A", A);
// console.log(tmp);

// let tmp2 = getdata<A>("A", A);
// console.log(tmp2);

// tmp["n"] = 20;
// console.log(tmp.n);

// tmp.set("n", 50)
// console.log(tmp.n);

// tmp.set("nn", 50)
// console.log(tmp.nn);



function day0() {
  var offset = new Date().getTimezoneOffset();
  var offsetInHours = offset / -60;
  console.log("offsetInHours", offsetInHours);

  let timestamp = 1702188370 * 1000; //Date.now(); // 你的时间戳
  console.log("now", timestamp);
  let date = new Date(); // 创建一个Date对象
  console.log(date);
  console.log(date.getTime());
  console.log(date.toLocaleString());
  date.setUTCHours(0, 0, 0, 0); // 将时间设置为当日的0点
  console.log("date1", date);
  date.setHours(0, 0, 0);
  console.log("date", date.toLocaleString());
  console.log("date utc", date);
  let zeroTimestamp = Math.floor(date.getTime() / 1000); // 获取0点的时间戳
  console.log("day0", zeroTimestamp);
  return zeroTimestamp;
}

// day0();


