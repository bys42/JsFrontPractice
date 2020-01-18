let promise1 = new Promise(resolve => setTimeout(resolve, 500));
let promise2 = Promise.resolve('From promise2');
let promises = [promise1, promise2];

// all: resolve till all resolve, reject if one reject
Promise
    .all(promises)
    .then(val => console.log('[All]:', val));

// race: settled if one settled
Promise
    .race(promises)
    .then(val => console.log('[Race]:', val));




