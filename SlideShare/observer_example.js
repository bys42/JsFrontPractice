// Device simulation, raises isDataReady and calls all notifies in 1s.
function Device() {
    this.isDataReady = false;
    this.getData = () => this.isDataReady ? 'Hello' : null;
    // Event functions
    this.notifies = [];
    this.registerNotify = (notify) => this.notifies.push(notify);
    this.signalNotify = () => {
        for (let notify of this.notifies) {
            notify();
        }
    };
}
let sampleDevice = new Device();

setTimeout(() => {
    sampleDevice.isDataReady = true;
    sampleDevice.signalNotify();
}, 1000);

// [Observer/Listener Side]
// Event Handler
function dataReadyHandler() {
    console.log(sampleDevice.getData());
};
sampleDevice.registerNotify(dataReadyHandler);