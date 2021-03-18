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
3. `console.log('1', promise1)` is run after ``console.log('promise1')` but before `.then`.
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


### Reference

- [Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Event capturing and bubbling](https://javascript.info/bubbling-and-capturing)
- [Microtasks](https://javascript.info/microtask-queue)