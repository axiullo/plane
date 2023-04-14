// ts-node .\test.ts
//tsc test.ts  将编译成test.js，然后node test.js执行

var n:number = 97;
var n2s:string = String.fromCharCode(n);
console.log(n2s);

var s2n:number = n2s.charCodeAt(0);
console.log(s2n);