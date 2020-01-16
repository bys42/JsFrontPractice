let task1 = resolve => {
    console.log('task1');
    resolve();
}
let task2 = () => console.log('task2');
let onReject = () => console.log('reject');
let finalTask = () => console.log('Task End');

new Promise(task1)
    .then(task2)
    .catch(onReject) // then(undefined, onError)
    .finally(finalTask); // similar to then(finalTask, finalTask)
                         // receive no argument, preserve Promise state.

let promise1 = new Promise(task1);
let promise2 = Promise.resolve('test');

// resolve till all resolve, reject if one reject
Promise
    .all([promise1, promise2])
    .then(val => console.log('[All]:', val));

// settled if one settled
Promise
    .race([promise1, promise2])
    .then(val => console.log('[Race]:', val));




