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
                this.ending = { start: video.duration - 60, end: video.duration};
                callback();
            });
        }
    }

    let isAdPaused = true;

    this.play = () => {
        if (adsManager.getRemainingTime() < 0) {
            video.play();
        } else {
            playAds();
            isAdPaused = false;
        }
    }

    this.pause = () => {
        if (adsManager.getRemainingTime() < 0) {
            video.pause();
        } else {
            adsManager.pause();
            isAdPaused = true;
        }
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
                if (adsManager.getRemainingTime() < 0) {
                    return video.paused;
                }
                return isAdPaused;
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
    init();
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


var adsManager;
var adsLoader;
var adDisplayContainer;
var intervalTimer;
var playButton;
var videoContent;

function init() {
    videoContent = document.getElementById('video-Content');

    adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('ad-Container'), videoContent);
    adDisplayContainer.initialize();

    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // var contentEndedListener = function () { adsLoader.contentComplete(); };
    // videoContent.onended = contentEndedListener;

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 400;

    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    adsLoader.requestAds(adsRequest);
}

let asStarted = false;
function playAds() {
    if (!asStarted) {
        adsManager.start();
        asStarted = true;
    } else {
        adsManager.resume();
    }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsManager = adsManagerLoadedEvent.getAdsManager(videoContent, adsRenderingSettings);
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
    adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
}

function onAdEvent(adEvent) {
    var ad = adEvent.getAd();
    console.log('adEvent.type', adEvent.type);
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            console.log('google.ima.AdEvent.Type.LOADED')
            if (!ad.isLinear()) {
                videoContent.play();
            }
            break;
        case google.ima.AdEvent.Type.STARTED:
            console.log('google.ima.AdEvent.Type.STARTED')
            if (ad.isLinear()) {
                intervalTimer = setInterval(
                    function () {
                        var remainingTime = adsManager.getRemainingTime();
                        console.log(remainingTime);
                    },
                    300);
            }
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            console.log('google.ima.AdEvent.Type.COMPLETE')
            if (ad.isLinear()) {
                clearInterval(intervalTimer);
            }
            break;
    }
}

function onAdError(adErrorEvent) {
    console.log(adErrorEvent.getError());
    adsManager.destroy();
}

function onContentPauseRequested() {
    console.log('onContentPauseRequeste')
    videoContent.pause();
}

function onContentResumeRequested() {
    console.log('onContentResumeRequested')
    videoContent.play();
}
