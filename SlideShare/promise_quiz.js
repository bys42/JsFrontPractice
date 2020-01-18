// init variables
let promises = [];
let createPromiseFunc = function (id) {
    return function () {
        return new Promise(res => {
            console.log('[' + id + '-th constuctor]');
            setTimeout(res, 1000 - id * 100, 'from: ' + id + '-th promise');
        });
    }
}

for (let i = 0; i < 10; i++) {
    promises.push(createPromiseFunc(i));
}

// function 本體
function promiseInOrder(promises, id) {
    if (id >= promises.length) return undefined;

    return () => {
        promises[id]().then(promiseInOrder(promises, id + 1));
    }
}

promiseInOrder(promises, 0)();
