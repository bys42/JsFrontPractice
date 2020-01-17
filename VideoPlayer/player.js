function padZero(val) {
    return val > 9 ? val.toString() : '0' + val;
}

function secondsToTime(val) {
    let sec = Math.floor(val);
    let min = Math.floor(sec / 60);
    let hr = Math.floor(min / 60);
    sec -= min * 60;
    min -= hr * 60;

    return padZero(hr, 2) + ':' + padZero(min, 2) + ':' + padZero(sec, 2);
}

function VideoInterface() {
    let video = document.querySelector('#video');
    let isMetaLoaded = false;

    if (video.readyState >= 1) {
        isMetaLoaded = true;
    }

    this.onloadedmetadata = callback => {
        if (isMetaLoaded) {
            callback();
        } else {
            video.addEventListener('loadedmetadata', callback);
        }
    }

    this.play = () => video.play();

    this.pause = () => video.pause();

    this.onUpdateRegister = callback => video.addEventListener('timeupdate', callback);

    this.onUpdateUnregister = callback => video.removeEventListener('timeupdate', callback);

    Object.defineProperties(this, {
        "currentTime": {
            "get": function () { return video.currentTime },
            "set": function (time) { video.currentTime = time }
        },
        "duration": {
            "get": function () { return video.duration; }
        },
        "paused": {
            "get": function () { return video.paused; }
        }
    })
}

function ControlPannel(videoInt) {
    let video = videoInt;
    let controlBox = document.querySelector('#control-box');
    let totalTimeText = document.querySelector("#total-time");
    let curTimeText = document.querySelector("#current-time");
    let bar = document.querySelector("#progress");
    let isTimeBarLink = false;
    let delayPlayId = null;
    let delayHideId = null;

    bar.style.width = '0%';
    controlBox.style.display = "none";
    totalTimeText.innerHTML = secondsToTime(video.duration);

    function delayPlay(time) {
        cancelDelayPlay();
        delayPlayId = setTimeout(videoPlay, time);
    }

    function cancelDelayPlay() {
        if (delayPlayId) {
            clearTimeout(delayPlayId);
            delayPlayId = null;
        }
    }

    function hideBox() {
        controlBox.style.display = "none";
    }

    function delayHide(time) {
        cancelDelayHide();
        delayHideId = setTimeout(hideBox, time);
    }

    function cancelDelayHide() {
        if (delayHideId) {
            clearTimeout(delayHideId);
            delayHideId = null;
        }
    }

    function showBox() {
        controlBox.style.display = "block";
        cancelDelayPlay();
        cancelDelayHide();
    }

    function setBarByPlayTime() {
        bar.style.width = (video.currentTime / video.duration * 100) + '%';
        curTimeText.innerHTML = secondsToTime(video.currentTime);
    }

    function setPlayTimeByBar() {
        let barWidth = parseFloat(bar.style.width);
        video.currentTime = barWidth * video.duration / 100;
    }

    function unlinkTimeBar() {
        if (isTimeBarLink) {
            video.onUpdateUnregister(setBarByPlayTime);
            isTimeBarLink = false;
        }
    }

    function linkTimeBar() {
        if (!isTimeBarLink) {
            video.onUpdateRegister(setBarByPlayTime);
            isTimeBarLink = true;
        }
    };

    function videoPlay() {
        delayHide(2000);
        setPlayTimeByBar();
        linkTimeBar();
        video.play();
    }

    function videoPause() {
        showBox();
        video.pause();
    }

    this.moveProgress = offset => {
        showBox();
        unlinkTimeBar();
        curPercent = parseFloat(bar.style.width) + offset;
        curPercent = Math.max(0, curPercent);
        curPercent = Math.min(100, curPercent);
        curTimeText.innerHTML = secondsToTime(curPercent * video.duration / 100);
        bar.style.width = curPercent + '%';
    }

    this.playSwitch = () => {
        if (video.paused) {
            setBarByPlayTime();
            videoPlay();
        } else {
            videoPause();
        }
    }

    this.onMoveProgressEnd = () => {
        delayPlay(500);
    }
}

let video = new VideoInterface();
let controlPannel = null;

video.onloadedmetadata(() => {
    controlPannel = new ControlPannel(video);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);
})

function onKeydown(event) {
    event.preventDefault();
    switch (event.key) {
        case "ArrowLeft":
            controlPannel.moveProgress(-1);
            break;
        case "ArrowRight":
            controlPannel.moveProgress(1);
            break;
        case "Enter":
            controlPannel.playSwitch();
            break;
        default:
            break;
    }
}

function onKeyup(event) {
    event.preventDefault();
    switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
            controlPannel.onMoveProgressEnd();
            break;
        default:
            break;
    }
}

function changeScreenSize() {
    let height = document.querySelector('#screen-size').value;
    let screen = document.querySelector('#mainScreen');

    switch (height) {
        case 'full':
            screen.style.height = '100%';
            screen.style.width = '100%';
            break;
        default:
            screen.style.height = height + 'px';
            screen.style.width = height / 9 * 16 + 'px';
            break;
    }
}