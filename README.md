# screenrecorder.js
Script for JavaScript screen recording with microphone support.

Depends on [RecordRTC](https://github.com/muaz-khan/RecordRTC)

## API Usage

### startRecord(doAudio = false: bool)
```javascript
// Start Screen Recording with Microphone Recording
startRecord(true)
// Start Screen Recording without Microphone Recording
startRecord(false)
// OR
startRecord()
```

### stopRecord()
```javascript
// Stop a currently recording Screen Recording and save to disk
stopRecord()
```