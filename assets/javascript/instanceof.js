const myInstanceof = (object, constructor) => {
    let proto = object.__proto__;
    while(proto !== null) {
        if(proto === constructor.prototype) {
            return true;
        }
        proto = proto.__proto__;
    }
    return false;
}

function C() {};
function D() {};

let o = new C();

console.log(myInstanceof(o, C));
console.log(myInstanceof(o, D));
console.log(myInstanceof(C.prototype, Object));

C.prototype = {};
let o2 = new C();

console.log(myInstanceof(o2, C));
console.log(myInstanceof(o, C));

D.prototype = new C();
let o3 = new D();
console.log(myInstanceof(o3, D));
console.log(myInstanceof(o3, C));