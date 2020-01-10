class Observable {
    constructor() {
        this.notifies = [];
    }

    registerNotify(notify) {
        this.notifies.push(notify);
    }

    signalNotify() {
        for (let notify of this.notifies) {
            notify();
        }
    }
}

let subject = new Observable();
subject.signalNotify();
//

let notify1 = () => { console.log("I'm notify1") };
subject.registerNotify(notify1);
subject.signalNotify();
// I'm notify1

subject.registerNotify(() => { console.log("I'm notify2") });
subject.signalNotify();
// I'm notify1
// I'm notify2