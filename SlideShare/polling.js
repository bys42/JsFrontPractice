// Device simulation, raise isDataReady in 1s.
function Device() {
    this.isDataReady = false;
    this.getData = () => this.isDataReady ? 'Hello' : null;
}
let sampleDevice = new Device();
setTimeout(() => { sampleDevice.isDataReady = true }, 1000);

// [Observer/Listener Side]
// Event Handler
function dataReadyHandler() {
    console.log(sampleDevice.getData());
};

// Polling device state every 0.1 second, run dataReadyHandler while device ready.
let pollingId = setInterval(() => {
    if (sampleDevice.isDataReady) {
        dataReadyHandler();
        clearInterval(pollingId)
    } else {
        console.log('Wait..' + sampleDevice.getData());
    }
}, 100);