// Subject:
function Observable(typeList) {
    let callbackLists = {};
    for (type of typeList) {
        callbackLists[type] = [];
    }

    this.addEventListener = function (type, callback) {
        let list = callbackLists[type];

        if (list && !list.includes(callback)) {
            list.push(callback);
        }
    }

    this.removeEventListener = function (type, callback) {
        let list = callbackLists[type];

        if (list && list.includes(callback)) {
            list.splice(list.indexOf(callback), 1);
        }
    };

    this.notifyCallback = function (type) {
        for (let callback of callbackLists[type]) {
            callback();
        }
    };
}

let subject = new Observable(['oneshot', 'periodic']);

setTimeout(subject.notifyCallback, 500, 'oneshot');
setInterval(subject.notifyCallback, 1000, 'periodic');

// Listeners:
// - oneshot listener
let oneshot = () => {
    console.log("[oneshot listener] Hello")
};
subject.addEventListener('oneshot', oneshot);
subject.addEventListener('oneshot', oneshot);

// - periodic listener
function countDown(count) {
    let callback = function () {
        if (count === 0) {
            subject.removeEventListener('periodic', callback);
            console.log(`[periodic listener] Happy New Year`);
        } else {
            console.log(`[periodic listener] ${count--}`);
        }
    };
    return callback;
};
subject.addEventListener('periodic', countDown(3));