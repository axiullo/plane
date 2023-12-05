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

let tmp = getdata<A>("A", A);
console.log(tmp);

let tmp2 = getdata<A>("A", A);
console.log(tmp2);

tmp["n"] = 20;
console.log(tmp.n);

tmp.set("n", 50)
console.log(tmp.n);

tmp.set("nn", 50)
console.log(tmp.nn);

