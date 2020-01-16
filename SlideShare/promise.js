// use Promise as a constructor, argument: a function, would be called immediately.
let promise = new Promise(task);

function task(resolve, reject) {
    let someCondition = true;
    if (someCondition) {
        resolve('Ok from task');
    } else {
        reject('Failed')
    }
}

let onResolve = value => console.log('Value: ' + value);
let onReject = reason => console.log('Reason: ' + reason);

promise.then(onResolve, onReject);

// Shortcuts:
// 1. new Promise((resolve, reject) => { resolve('Ok') });
promise = Promise.resolve('Ok from Promise.resolve');
promise.then(onResolve, onReject);

// 2. new Promise((resolve, reject) => { reject('Failed') });
Promise
    .reject('Failed from Promise.reject')
    .then(onResolve, onReject); // warning if reject is not handled


