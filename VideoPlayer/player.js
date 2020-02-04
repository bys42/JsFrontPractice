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
    let video = document.querySelector('#video-Content');
    let isMetaLoaded = false;

    if (video.readyState >= 1) {
        isMetaLoaded = true;
    }

    this.onloadedmetadata = callback => {
        if (isMetaLoaded) {
            callback();
        } else {
            video.addEventListener('loadedmetadata', () => {
                this.ending = { start: video.duration - 60, end: video.duration };
                callback();
            });
        }
    }

    this.play = () => {
        video.play();
    }

    this.pause = () => {
        video.pause();
    }

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
            "get": function () {
                return video.paused;
            }
        }
    })

    this.openning = { start: 60, end: 120 };
    this.ending = { start: video.duration - 60, end: video.duration };
}

class View {
    constructor(view) {
        this.view = view;
        this._delayHideId = null;
    }

    _cancelDelayHide() {
        if (this._delayHideId) {
            clearTimeout(this._delayHideId);
            this._delayHideId = null;
        }
    }

    hide(time = 0) {
        this._cancelDelayHide();
        this._delayHideId = setTimeout(() => { this.view.style.display = "none" }, time);
    };

    show() {
        this._cancelDelayHide();
        this.view.style.display = "block";
    };
}

function StateIcon() {
    let icon = document.querySelector('#state-icon');
    let iconView = new View(icon);

    this.hide = (time) => { iconView.hide(time) };
    this.show = () => { iconView.show() };
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

function VolumeIcon() {
    let icon = document.getElementById('volume-icon');
    let iconView = new View(icon);

    this.hide = (time) => { iconView.hide(time) };
    this.show = () => { iconView.show() };
    this.set = function (volume) {
        icon.innerHTML = volume;
    }
}

function MessageBox() {
    let box = document.getElementById('message-box');
    let boxView = new View(box);

    this.show = (time = 3000) => {
        boxView.show();
        boxView.hide(time);
    };
    this.set = function (message) {
        box.innerHTML = message;
    }
}

function TimeBar(duration) {
    let timeBarView = new View(document.getElementById('control-panel'));
    let curTimeText = document.getElementById('current-time');
    let totalTimeText = document.getElementById('total-time');
    let progress = document.getElementById('progress');
    let curTime;
    let totalTime;
    let percentage = 0;

    progress.style.width = '0%';
    totalTime = duration;
    totalTimeText.innerHTML = secondsToTime(totalTime);

    this.hide = (time) => { timeBarView.hide(time) };
    this.show = () => { timeBarView.show() };
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
    let skipMessage = new MessageBox();

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
                skipMessage.set('Openning Skipped');
                skipMessage.show();
            }
            else if (isInEnding()) {
                video.currentTime = video.ending.end;
                skipMessage.set('Ending Skipped');
                skipMessage.show();
            }
        }
    };

    video.onUpdateRegister(skipHandler);

    this.enable = () => {
        if (isSkipEnabled || isInOpenning() || isInEnding()) return;
        isSkipEnabled = true;
    }

    this.disable = () => {
        isSkipEnabled = false;
    }
}

function ControlPanel(videoInt, isAutoPlay = true) {
    let video = videoInt;
    let timeBar = new TimeBar(video.duration);
    let stateIcon = new StateIcon();
    let skipper = new VideoSkipper(video);

    let panelTime = 0;
    let isTimeSync = false;
    let delayPlayId = null;

    syncTime();
    timeBar.hide();
    stateIcon.hide();

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
        timeBar.hide(3000);
        stateIcon.hide(3000);
        stateIcon.setState('playing');
        video.currentTime = panelTime;
        video.play();

        syncTime();
    }

    function videoPause() {
        timeBar.show();
        stateIcon.show();
        stateIcon.setState('pause');
        video.pause();
        cancelDelayPlay();
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
        timeBar.show();
        stateIcon.show();
        stateIcon.setState('foward');
        skipper.disable();
        moveProgress(accFoward.move());
        cancelDelayPlay();
    }

    this.back = () => {
        timeBar.show();
        stateIcon.show();
        stateIcon.setState('back');
        skipper.disable();
        moveProgress(-accBack.move());
        cancelDelayPlay();
    }

    this.onFowardEnd = () => {
        accFoward.stop();
        delayPlay(500);
    }

    this.onBackEnd = () => {
        accBack.stop();
        delayPlay(500);
    }


    let volumeIcon = new VolumeIcon();

    function changeVolume(newVolume) {
        newVolume = Math.min(1, newVolume);
        newVolume = Math.max(0, newVolume);
        video.volume = newVolume;
        volumeIcon.set(Math.round(newVolume * 100));
    }

    this.volumeup = () => {
        volumeIcon.show();
        changeVolume(video.volume + 0.05)
    }

    this.volumedown = () => {
        volumeIcon.show();
        changeVolume(video.volume - 0.05)
    }

    this.onVolumeChangeEnd = () => {
        volumeIcon.hide(3000);
    }
}

let video = new VideoInterface();
let controlPanel = null;

video.onloadedmetadata(() => {
    controlPanel = new ControlPanel(video);
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
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