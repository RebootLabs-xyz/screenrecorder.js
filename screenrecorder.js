function invokeGetDisplayMedia(success, error) {
    var displaymediastreamconstraints = {
        video: {
            displaySurface: 'monitor', // monitor, window, application, browser
            logicalSurface: true,
            cursor: 'always' // never, always, motion
        }
    };

    // above constraints are NOT supported YET
    // that's why overriding them
    displaymediastreamconstraints = {
        video: true
    };

    if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
    else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
}

function addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function () {
        callback();
        callback = function () { };
    }, false);
    stream.addEventListener('inactive', function () {
        callback();
        callback = function () { };
    }, false);
    stream.getTracks().forEach(function (track) {
        track.addEventListener('ended', function () {
            callback();
            callback = function () { };
        }, false);
        track.addEventListener('inactive', function () {
            callback();
            callback = function () { };
        }, false);
    });
}

function captureScreen(callback) {
    invokeGetDisplayMedia(function (screen) {
        addStreamStopListener(screen, function () {
            stopRecord()
        });
        callback(screen);
    }, function (error) {
        console.error(error);
        alert('Unable to capture your screen. Please check console logs.\n' + error);
    });
}

function captureAudio(cb) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(cb);
}

var globdoaudio = false;
var globaudio

function startRecord(doAudio = false) {
    this.disabled = true;
    if (doAudio) {
        globdoaudio = true;
        captureScreen(function (screen) {
            captureAudio(function (audio) {
                globaudio = audio;
                recorder = RecordRTC([screen, audio], {
                    type: 'video/webm;codecs=vp9',
                    mimeType: 'video/webm;codecs=vp9',
                    frameInterval: screen.getVideoTracks()[0].getSettings().frameRate,
                    video: {
                        width: screen.getVideoTracks()[0].getSettings().width,
                        height: screen.getVideoTracks()[0].getSettings().height
                    }
                });

                recorder.startRecording();

                // release screen on stopRecording
                recorder.screen = screen;
            });
        });
    } else {
        captureScreen(function (screen) {
            recorder = RecordRTC(screen, {
                type: 'video/webm;codecs=vp9',
                mimeType: 'video/webm;codecs=vp9'
            });

            recorder.startRecording();

            // release screen on stopRecording
            recorder.screen = screen;
        });
    }
}

function stopRecord() {
    this.disabled = true;
    recorder.stopRecording(function () {
        if (globdoaudio) {
            [globaudio].forEach(function (stream) {
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            });
        }
        let blob = recorder.getBlob();
        invokeSaveAsDialog(blob);
    })
}