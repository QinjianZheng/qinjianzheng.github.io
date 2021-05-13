---
layout: post
title: Front-end programming topics
---

To be a well-rounded front-end programmer, one should have a solid understanding of underlying mechanism of tools she uses. Some might think that knowing how to use the tools is good enough, but the mistakes usually come from the lack of understanding. What's worse, these mistakes are not easy to detect since ones who make them might not realize they are mistakes.

The topics in this post are all about my own understandings, there might be mistakes. So if you find any, do contact me via [Email](mailto:qinjianzheng@student.unsw.edu.au).
<!--more-->

#### Table of Contents

<!-- TOC -->

- [Closure 闭包](#closure-闭包)
  - [Practical use of closure](#practical-use-of-closure)
- [Event loop 事件循环](#event-loop-事件循环)
- [Event capturing and bubbling](#event-capturing-and-bubbling)
- [Microtasks](#microtasks)
  - [Example 1](#example-1)
  - [Example 2](#example-2)
  - [Example 3](#example-3)
  - [Example 4](#example-4)
- [CSS layout](#css-layout)
  - [Fixed left box and responsive right box](#fixed-left-box-and-responsive-right-box)
- [Prototype and prototype chains](#prototype-and-prototype-chains)
- [instanceof](#instanceof)
  - [Code example](#code-example)
- [Equality and strict equality](#equality-and-strict-equality)
- [`new` operator](#new-operator)
- [Promise.all](#promiseall)
- [箭头函数的this指向问题](#箭头函数的this指向问题)
- [CSS Box Model](#css-box-model)
  - [Difference between IE box model and W3C box model](#difference-between-ie-box-model-and-w3c-box-model)
  - [Use of `box-sizing`](#use-of-box-sizing)
- [Reference](#reference)
<!-- /TOC -->


### Closure 闭包
<hr/>

Definition from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures):

> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).

In my own words, a closure is made up of 3 parts, a function, the usage of variables which are not defined by the function, and an outer scope relative to the function. Essentially, the core of closure is to make use of the scope in different level, e.g. inner function has access to the outer function's scope (get the value, change the value). However, the power of closure is in binding the variables in the outer scope to instances created. In other words, function instances with their own outer scope variables won't affect each other when they make changes to the variables, which is not the case if you have a global variable.

#### Practical use of closure

1. Hide the variables and leave the interfaces to the clients
2. Emulate private methods which can only be accessed by other methods in the same class (a function that return an object which contains functions that have access to its outer scope. Outside the function, instances of the function will have their own lexical environment, in effect, create a class with attributes and methods)

### Event loop 事件循环
<hr/>

> The event loop is a single-threaded loop which runs in the browser, and manages all events. When an event is triggered, the event is added to the queue.

Event loop general implementation:

```javascript
while (queue.waitForMessage()) {
  queue.processNextMessage()
}
```

> JavaScript uses a run-to-completion model, meaning it will not handle a new event until the current event has completed.

With a queue to manage the events, and run-to-completion model, the events will be sequentially processed without affecting each other. The function calls as event handler will be maintained in a stack.

When an event occurs, or a user triggers the event via mouse or keyboard, if the event has listener, then this event (message) will be added to the event loop (message queue), while the events without any listener will be lost.

### Event capturing and bubbling

When an event happens, the target binded with the event listener is labelled as `event.target`. Three phases for the event:

1. Capturing phase is the process in which an event moves from document root to `event.target`.
2. Target phase is the process in which `event.target` is triggered and the handler is called.
3. Bubbling phase is the process in which an event moves from the `event.target` to document root.

Relating to method `AddEventListerner` third argument`[Capture: true]`: optional for switching whether the event should be triggered in capturing phase (true for yes, false/default for no), controlling the event handlers are called during the capturing phase or bubbling phase.

`event.stopPropagation()` is used to stop the event handler in the target the method assigned to, effectly stop bubbling, but it is rarely used. `event.stopPropagation()` can only stop the event listener which is binded with this method, `event.stopImmediatePropagation()` can stop all handlers.

### Microtasks
<hr/>

> Promise handlers .then/.catch/.finally are always asynchronous.
> 
> Asynchronous tasks need proper management. For that, the ECMA standard specifies an internal queue PromiseJobs, more often referred to as the “microtask queue” (V8 term).
> 
> As stated in the specification:
> - The queue is first-in-first-out: tasks enqueued first are run first.
> - Execution of a task is initiated only when nothing else is running.

Contrast to microtasks, macrotasks are tasks in the event loop including scripts, event handlers, `setTimeout()`, etc.. Since the event loop is a single-threaded loop, while executing one task, other tasks will have to wait for it to finish, i.e. no rendering will happen and if the task takes too long, the browser will freeze.

Microtasks are tasks relating to promises. `.then/catch/finally` handlers will be put into the microtask queue, and only when current code (marcotask) is finished, or the handlers will be called.

> code example from [this post](https://juejin.cn/post/6844904087163502605) 

#### Example 1

```javascript
const promise1 = new Promise((resolve, reject) => {
    console.log('promise1')
})
promise1.then(() => {
    console.log(3);
});
console.log('1', promise1);

const fn = () => (new Promise((resolve, reject) => {
    console.log(2);
    resolve('success')
}))
fn().then(res => {
    console.log(res)
})
console.log('start')
```

Analysis:

1. From top to bottom to execute the code, the code inside `Promise` constructor is called, log `promise1`.
2. `.then` handler is put into the microtask queue, waiting for current code to finish.
3. `console.log('1', promise1)` is run after `console.log('promise1')` but before `.then`.
4. `console.log(2)` inside `fn` is executed and the promise is resolved.
5. `console.log('start')` is still in the same marcotask as `console.log('promise1')` and `console.log(3);`
6. After all codes are finished, resolved promises will execute `.then` handler, in this case `console.log(res)`, print out `success`
7. Since `promise1` is nevered resolved, `.then` handler is never called.

Result:
```
promise1
1 Promise { <pending> }
2
start
success
```

#### Example 2

```javascript
                                        // macro1 -- Whole script
Promise.resolve().then(() => {          // micro1 -- .then  
    console.log('promise1');            
    const timer2 = setTimeout(() => {   // macro3 -- setTimeout
        console.log('timer2')
    }, 0)
});
const timer1 = setTimeout(() => {       // macro2 -- setTimeout
    console.log('timer1')
    Promise.resolve().then(() => {      // micro2
        console.log('promise2')
    })
}, 0)
console.log('start');                   // macro1 -- execute -- start
```

Analysis:
1. Execute script as macro1, add micro1 to microqueue
2. Add macro2 to the event loop
3. Execute macro1, log `start`
4. Check microqueue, find micro1, execute micro1, log `promise1`, add macro3 to the event loop
5. Execute macro2, log `timer1`, add micro2 to microqueue
6. Check microqueue, find micro2, execute micro2, log `promise2`
7. Execute macro3, log `timer2`

Result:
```
start
promise1
timer1
promise2
timer2
```

#### Example 3

```javascript
                                                        // macro1
const promise1 = new Promise((resolve, reject) => {     
    setTimeout(() => {                                  // macro2
        resolve('success')                              // promise1 resolve
    }, 1000)
})
const promise2 = promise1.then(() => {                  // promise1 pending promise2 pending
    throw new Error('error!!!')                         // micro1
})
console.log('promise1', promise1)                       // macro1
console.log('promise2', promise2)                       // macro1
setTimeout(() => {                                      // macro3
    console.log('promise1', promise1)
    console.log('promise2', promise2)
}, 2000)
```

Result:
```
promise1 promise { <pending> }
promise2 promise { <pending> }
Uncaught in promise Error 
promise1 promise { <resolved> "success" }
promise2 promise { <rejected>: Error: error!!!}
```

#### Example 4

```javascript
const promise1 = new Promise((resolve, reject) => { 
    setTimeout(() => {                        // macro2
        resolve("success");                   // promise1 resolved 
        console.log("timer1");                // macro2
    }, 1000);
    console.log("promise1里的内容");           // macro1
});
const promise2 = promise1.then(() => {        // promise pending
    throw new Error("error!!!");              // micro1 after macro2
});
console.log("promise1", promise1);            // macro1
console.log("promise2", promise2);            // macro1
setTimeout(() => {                            // macro3
    console.log("timer2");                    // macro3
    console.log("promise1", promise1);        // macro3
    console.log("promise2", promise2);        // macro3
}, 2000);
```

Result:
```
promise1里的内容
promise1 promise { <pending> }
promise2 promise { <pending> }
timer1
error
timer2
promise1 promise { <resolved> "success" }
promise2 promise { <rejected>: Error: error!!!}
```

### CSS layout
<hr/>

#### Fixed left box and responsive right box

<div style="display: flex;border: solid 3px black;">
    <div style="color: white; font-size: 3rem;flex: 0 0 200px; height:200px; background: #cb4b16;">Left</div>
    <div style="color: white; font-size: 3rem;flex: 1; height: 200px; background: #859900;">Right</div>
</div>

### Prototype and prototype chains
<hr/>

Key points:
1. Prototype is like class, with inheritance and all.
2. To get an object's prototype object directly via `Object.getPrototypeOf(obj)`.
3. Ones begin with `Object.prototype.` are inherited, ones begin with `Object.` are not.
4. `constructor` property is contained in `prototype` property, and every instance object has this property. Also, `constructor` is a function can be invoked via parentheses, with `new` keyword, to create a new instance: `let person3 = new person1.constructor(...)`.
5. Add new methods and property outside the constructor function, call `YOUR_OBJECT.prototype.NEW_METHOD/NEW_PROPERTY = ...`.
6. ES6 Class Syntax, with `class YOUR_CLASS { constrcutor(...), YOUR_PROPERTIES, YOUR_METHODS(...) ...}`


### instanceof
<hr/>

> The `instanceof` **operator** tests to see if the prototype property of a constructor appears anywhere in the prototype chain of an object. The return value is a boolean value. 

Syntax: object `instanceof` constructor/class

My implementation:

```javascript
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
```

#### Code example

Open console, check the script right below and interact with the `Person` Object.

Code example from [MDN](https://github.com/mdn/learning-area/blob/master/javascript/oojs/introduction/oojs-class-further-exercises.html).


<script>
    // function Person(first, last, age, gender, interests) {
    //     this.name = {
    //         'first': first,
    //         'last' : last
    //     };
    //     this.age = age;
    //     this.gender = gender;
    //     this.interests = interests;
    //     this.bio = function() {
    //     // First define a string, and make it equal to the part of
    //     // the bio that we know will always be the same.
    //         var string = this.name.first + ' ' + this.name.last + ' is ' + this.age + ' years old. ';
    //         // define a variable that will contain the pronoun part of
    //         // the second sentence
    //         var pronoun;

    //         // check what the value of gender is, and set pronoun
    //         // to an appropriate value in each case
    //         if(this.gender === 'male' || this.gender === 'Male' || this.gender === 'm' || this.gender === 'M') {
    //             pronoun = 'He likes ';
    //         } else if(this.gender === 'female' || this.gender === 'Female' || this.gender === 'f' || this.gender === 'F') {
    //             pronoun = 'She likes ';
    //         } else {
    //             pronoun = 'They like ';
    //         }

    //         // add the pronoun string on to the end of the main string
    //         string += pronoun;

    //         // use another conditional to structure the last part of the
    //         // second sentence depending on whether the number of interests
    //         // is 1, 2, or 3
    //         if(this.interests.length === 1) {
    //             string += this.interests[0] + '.';
    //         } else if(this.interests.length === 2) {
    //             string += this.interests[0] + ' and ' + this.interests[1] + '.';
    //         } else {
    //             // if there are more than 2 interests, we loop through them
    //             // all, adding each one to the main string followed by a comma,
    //             // except for the last one, which needs an and & a full stop
    //             for(var i = 0; i < this.interests.length; i++) {
    //                 if(i === this.interests.length - 1) {
    //                     string += 'and ' + this.interests[i] + '.';
    //                 } else {
    //                     string += this.interests[i] + ', ';
    //                 }
    //             }
    //         }

    //         // finally, with the string built, we alert() it
    //         alert(string);
    //     };
    //     this.greeting = function() {
    //         alert('Hi! I\'m ' + this.name.first + '.');
    //     };
    // };



    // convert to ES2015 Classes Syntax
    class Person {
        constructor(first, last, age, gender, interests) {
            this.name = {
                first,
                last
            };
            this.age = age;
            this.gender = gender;
            this.interests = interests;
        }

        greeting() {
            console.log(`Hi! I'm ${this.name.first}`);
        };

        farewell() {
            console.log(`${this.name.first} has left the building. Bye for now!`);
        };
    }
    class Teacher extends Person {
        constructor(first, last, age, gender, interests, subject, grade) {
            super(first, last, age, gender, interests);
            this.subject = subject;
            this.grade = grade;
        }
    }
    let person1 = new Person('Tammi', 'Smith', 32, 'neutral', ['music', 'skiing', 'kickboxing']);
    Person.prototype.farewell = function() {
        alert(this.name.first + ' has left the building. Bye for now!');
    };
    let snape = new Teacher('Severus', 'Snape', 58, 'male', ['Potions'], 'Dark arts', 5);
</script>

### Equality and strict equality
<hr/>

Definition from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality):

> The strict equality operator (===) checks whether its two operands are equal, returning a Boolean result. Unlike the equality operator, the strict equality operator always considers operands of different types to be different.

> The equality operator (==) checks whether its two operands are equal, returning a Boolean result. Unlike the strict equality operator, it attempts to convert and compare operands that are of different types.

Comparison between different types, try to convert them to the same type before comparing, see [The Abstract Equality Comparison Algorithm](https://262.ecma-international.org/5.1/#sec-11.9.3).

Compare a object and a string or a number, convert the object using `ToPrimitive()` function, which 

```javascript
"1" ==  1;            // true
1 == "1";             // true
0 == false;           // true
0 == null;            // false
0 == undefined;       // false
0 == !!null;          // true, look at Logical NOT operator
0 == !!undefined;     // true, look at Logical NOT operator
null == undefined;    // true

const number1 = new Number(3);
const number2 = new Number(3);
number1 == 3;         // true
number1 == number2;   // false, need to refer to same object
```

### `new` operator
<hr/>

Definition from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)

> The `new` **operator** lets developers create an instance of a user-defined object type or of one of the built-in object types that has a constructor function.

`new` operator takes parameters of `constructor` and `arguments` (a list of values that the `constructor` will be called with).

### Promise.all
<hr/>

Code example from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#promise.all_fail-fast_behavior)

Handling possible rejections by add `.catch` handler for each promise in the iterable:

```javascript
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('p1_delayed_resolution'), 1000);
});

var p2 = new Promise((resolve, reject) => {
  reject(new Error('p2_immediate_rejection'));
});

Promise.all([
  p1.catch(error => { return error }),
  p2.catch(error => { return error }),
]).then(values => {
  console.log(values[0]) // "p1_delayed_resolution"
  console.error(values[1]) // "Error: p2_immediate_rejection"
})
```

### 箭头函数的this指向问题

> Arrow functions do not bind their own `this`, instead, they inherit the one from the parent scope, which is called "lexical scoping". 

```javascript
var name = 'x'
var people = {
  name: 'y',
  setName: (name) => {
    this.name = name // this -> window
    return () => {
      return this.name
    }
  }
}
debugger
var getName = people.setName(name) // 'x' -> this.name = 'x' -> window.name = 'x'
console.log(people.name) // y -> people.name
console.log(getName()) // x -> window.name
```

### CSS Box Model
<hr/>

Parts:
- margins
- borders
- padding
- actual content

#### Difference between IE box model and W3C box model

How `width` and `height` is defined:
- IE (\<= IE6): width = actual visible/rendered width of an element's box; height = actual visible/rendered height of an element's box
- W3C (standard): width + padding + border = actual visible/rendered width of an element’s box; height + padding + border = actual visible/rendered height of an element’s box

#### Use of `box-sizing`

`content-box`, `padding-box`, **`border-box`**

When use `border-box`, it changes the box model to be the way where an element’s specified width and height aren’t affected by padding or borders.

[Universal Box Sizing with Inheritance](https://css-tricks.com/box-sizing/) (better practice?)
```css
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
```

### Reference

- [Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Event capturing and bubbling](https://javascript.info/bubbling-and-capturing)
- [Microtasks](https://javascript.info/microtask-queue)
- [左边固定，右边自适应的七种方法](https://blog.csdn.net/qq_43633937/article/details/94064804)
- [Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)
- [Understanding "this" in javascript with arrow functions](https://www.codementor.io/@dariogarciamoya/understanding-this-in-javascript-with-arrow-functions-gcpjwfyuc)

