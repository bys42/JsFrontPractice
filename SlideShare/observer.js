class Observable {
    constructor() {
        this.observers = [];
    }

    registerObserver(obs) {
        this.observers.push(obs);
    }

    notifyObserver() {
        for (let obs of this.observers) {  // Event loop
            obs.notify(); // Callback, Event Handler/Listener, Delegate
        }
    }
}

let subject = new Observable();
subject.notifyObserver();
//

let observer1 = { notify: () => { console.log("I'm observer1") } }
subject.registerObserver(observer1);
subject.notifyObserver();
// I'm observer1

subject.registerObserver({ notify: () => { console.log("I'm observer2") } });
subject.notifyObserver();
// I'm observer1
// I'm observer2