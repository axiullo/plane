


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
  m: number;

  constructor() {
    super();
    this.m = 0;
  }
  init(): base {
    this.m = 20;

    return this;
  }
}

class C extends base {
  str:string;

  constructor() {
    super();
    this.str = "";
  }
  init() {
    this.str = "c";
  }
}


let strType = {
  "A": () => new A(),
  "B": ()=> new B(),
  "C": () => new C(),
}

let strType2 = {
  "A": ()=>A,
}

/**
 * Get data
 * @param name The name of the data object
 * @returns The data object with the given name
 */
function getdata<T>(obj: T): T {
  return obj;
}

function getstrdata<T extends base>(name: string, cfun:()=>T): T {
  let o = cfun();
  return o as T;
}

// let k = "A"
// var aaa = getstrdata("A", strType[k]);
// aaa.init();
// console.log("11111111111   " + aaa.n);

// var bbb = getstrdata("B", strType["B"]);
// bbb.init();
// console.log("bbbbbbbbbbbbb", bbb.m );

// var ccc = getstrdata("C", strType["C"]);
// ccc.init();
// console.log(ccc.str)


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