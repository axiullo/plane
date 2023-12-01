class base {

}
interface opt {
  init(): base
}

class A extends base implements opt {
  private n: number;

  constructor() {
    super();
    this.n = 0;
  }
  init(): base {
    this.n = 10;

    return this;
  }
}

class B extends base implements opt {
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
  "A":A,
  "B":B,
}

function getdata<T>(name:string): any{
  var obj = omap.get(name);
  if(!obj){
    obj = new t[name]();
    obj!.init();
  }

}