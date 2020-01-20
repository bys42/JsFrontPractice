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
        "volume": {
            "get": function () { return video.volume },
            "set": function (volume) { video.volume = volume }
        },
        "duration": {
            "get": function () { return video.duration; }
        },
        "paused": {
            "get": function () { return video.paused; }
        }
    })

    this.openning = { start: 60, end: 120 };
    this.ending = { start: video.duration - 120, end: video.duration - 60 };
}

function StateIcon() {
    let icon = document.querySelector('#state-icon');
    
    this.setState = (state) => {
        icon.className = "";
        switch (state) {
            case 'playing':
                icon.classList.add('play-icon');
                break;
            case 'pause':
                icon.classList.add('pause-icon');
                break;
            case 'foward':
                icon.classList.add('forward-icon');
                break;
            case 'back':
                icon.classList.add('back-icon');
                break;
            case 'volume':
                break;
            default:
                break;
        }
    }
}

function TimeBar(duration) {
    let curTimeText = document.getElementById('current-time');
    let totalTimeText = document.getElementById('total-time');
    let progress = document.getElementById('progress');
    let curTime;
    let totalTime;
    let percentage = 0;

    progress.style.width = '0%';
    totalTime = duration;
    totalTimeText.innerHTML = secondsToTime(totalTime);

    this.setTime = function (time) {
        curTime = time;
        curTimeText.innerText = secondsToTime(curTime);
        percentage = curTime / totalTime;
        progress.style.width = (percentage * 100) + '%';
    }
}

function LinearAccelerator(acc, init = 0) {
    let velocity = 0;

    this.move = () => {
        velocity += acc;
        return velocity;
    };

    this.stop = () => {
        velocity = init;
    }
}

function VideoSkipper(video) {
    let isSkipEnabled = false;

    function isInOpenning() {
        return video.currentTime > video.openning.start && video.currentTime < video.openning.end;
    }

    function isInEnding() {
        return video.currentTime > video.ending.start && video.currentTime < video.ending.end;
    }

    function skipHandler() {
        if (isSkipEnabled) {
            if (isInOpenning()) {
                video.currentTime = video.openning.end;
            }
            else if (isInEnding()) {
                video.currentTime = video.ending.end;
            }
        }
    };

    video.onUpdateRegister(skipHandler);

    this.enable = () => {
        if (!isInOpenning() && !isInEnding()) {
            isSkipEnabled = true;
        };
    }

    this.disable = () => {
        isSkipEnabled = false;
    }
}

function ControlPanel(videoInt, isAutoPlay = true) {
    let video = videoInt;
    let controlPanel = document.querySelector('#control-panel');
    let timeBar = new TimeBar(video.duration);
    let stateIcon = new StateIcon();
    let skipper = new VideoSkipper(video);

    let panelTime = 0;
    let isTimeSync = false;
    let delayPlayId = null;
    let delayHideId = null;

    syncTime();
    controlPanel.style.display = "none";

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

    function delayHide(time) {
        cancelDelayHide();
        if (!delayHideId) {
            delayHideId = setTimeout(() => { controlPanel.style.display = "none" }, time);
        }
    }

    function cancelDelayHide() {
        if (delayHideId) {
            clearTimeout(delayHideId);
            delayHideId = null;
        }
    }

    function showBox() {
        controlPanel.style.display = "block";
        cancelDelayPlay();
        cancelDelayHide();
    }

    function onTimeUpdate() {
        skipper.enable();
        panelTime = video.currentTime;
        timeBar.setTime(panelTime);
    }

    function unsyncTime() {
        if (isTimeSync) {
            video.onUpdateUnregister(onTimeUpdate);
            isTimeSync = false;
        }
    }

    function syncTime() {
        if (!isTimeSync) {
            video.onUpdateRegister(onTimeUpdate);
            isTimeSync = true;
        }
    };

    function videoPlay() {
        delayHide(3000);
        stateIcon.setState('playing');
        video.currentTime = panelTime;
        video.play();
        syncTime();
    }

    function videoPause() {
        showBox();
        stateIcon.setState('pause');
        video.pause();
    }

    function moveProgress(offset) {
        unsyncTime();
        panelTime += offset;
        panelTime = Math.max(0, panelTime);
        panelTime = Math.min(video.duration, panelTime);
        timeBar.setTime(panelTime);
    }

    this.playSwitch = () => {
        if (video.paused) {
            videoPlay();
        } else {
            videoPause();
        }
    }

    let ACCELERATION = 3;
    let accFoward = new LinearAccelerator(ACCELERATION);
    let accBack = new LinearAccelerator(ACCELERATION);

    this.foward = () => {
        showBox();
        skipper.disable();
        stateIcon.setState('foward');
        moveProgress(accFoward.move());
    }

    this.back = () => {
        showBox();
        skipper.disable();
        stateIcon.setState('back');
        moveProgress(-accBack.move());
    }

    this.onFowardEnd = () => {
        accFoward.stop();
        delayPlay(500);
    }

    this.onBackEnd = () => {
        accBack.stop();
        delayPlay(500);
    }

    function changeVolume(newVolume) {
        newVolume = Math.min(1, newVolume);
        newVolume = Math.max(0, newVolume);
        stateIcon.setState('volume', Math.round(newVolume * 100));
        video.volume = newVolume;
    }

    this.volumeup = () => {
        showBox();
        changeVolume(video.volume + 0.05)
    }

    this.volumedown = () => {
        showBox();
        changeVolume(video.volume - 0.05)
    }

    this.onVolumeChangeEnd = () => {
        delayHide(2000);
    }
}

let video = new VideoInterface();
let controlPanel = null;

video.onloadedmetadata(() => {
    controlPanel = new ControlPanel(video);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);
})

function onKeydown(event) {
    event.preventDefault();
    switch (event.key) {
        case "ArrowLeft":
            controlPanel.back();
            break;
        case "ArrowRight":
            controlPanel.foward();
            break;
        case "ArrowUp":
            controlPanel.volumeup();
            break;
        case "ArrowDown":
            controlPanel.volumedown();
            break;
        case "Enter":
            controlPanel.playSwitch();
            break;
        default:
            break;
    }
}

function onKeyup(event) {
    event.preventDefault();
    switch (event.key) {
        case "ArrowLeft":
            controlPanel.onBackEnd()
            break;
        case "ArrowRight":
            controlPanel.onFowardEnd()
            break;
        case "ArrowUp":
        case "ArrowDown":
            controlPanel.onVolumeChangeEnd();
            break;
        default:
            break;
    }
}

function changeVideoSize() {
    let height = document.querySelector('#video-size').value;
    let screen = document.querySelector('#screen-Container');

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