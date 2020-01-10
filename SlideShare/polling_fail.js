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

// Polling device state through while loop...
while(!sampleDevice.isDataReady) {
    console.log('Wait..' + sampleDevice.getData());
};
dataReadyHandler();