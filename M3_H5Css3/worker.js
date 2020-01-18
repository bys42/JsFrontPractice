self.addEventListener(
    'message',
    function (e) {
        let sum = 0;
        for (i = 0; i < 500000000; i++) {
            sum++;
        }
        self.postMessage(sum);
    }
)
