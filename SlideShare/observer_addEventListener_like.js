// Subject:
function Observable(typeList) {
    let callbackLists = {};

    for (type of typeList) {
        callbackLists[type] = [];
    }

    this.addEventListener = function (type, callback) {
        if (type in callbackLists) {
            callbackLists[type].push(callback);
        }
    }

    this.removeEventListener = function (type, callback) {
        if (type in callbackLists && callbackLists[type].indexOf(callback) > -1) {
            callbackList.splice(callbackLists[type].indexOf(callback), 1);
        }
    };

    this.notifyCallback = function (type) {
        for (let callback of callbackLists[type]) {
            callback();
        }
    };
}

let subject = new Observable(['oneshot', 'periodic']);

setTimeout(() => {
    subject.notifyCallback('oneshot');
}, 1000);

setInterval(() => {
    subject.notifyCallback('periodic')
}, 1000)

// Listeners:
// - oneshot listener
let oneshot = () => {
    console.log("[oneshot listener] Hello")
};
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