const btn1 = document.querySelector('button');
const volumeControl = document.querySelector('#volume');
const pannerControl = document.querySelector('#panner');
const audioCtx = new AudioContext();
const audioElement = document.querySelector('audio');
const track = audioCtx.createMediaElementSource(audioElement);
const gainNode = audioCtx.createGain();
const pannerOptions = {pan: 0};
const panner = new StereoPannerNode(audioCtx, pannerOptions);
track.connect(gainNode).connect(panner).connect(audioCtx.destination);

btn1.addEventListener('click', function() {
    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }

}, false);

volumeControl.addEventListener('input', function() {
  gainNode.gain.value = this.value;
}, false)

pannerControl.addEventListener('input', function() {
  panner.pan.value = this.value;
}, false)

audioElement.addEventListener('ended', ()=> {
  btn1.dataset.playing = 'false';
}, false)

// btn1.onmousedown = event => {
//   console.log('hoge');
//   console.log(event.button);
//   if (event.button === 0) {
//       console.log('hage');
//     let intervalID = setInterval(()=> {
//       console.log('piyo');
//       audioElement.play();
//     }, 727);
//     btn1.onmouseup = event => {
//       if (event.button === 0) {
//         clearInterval(intervalID);
//         audioElement.currentTime = 0;
//       }
//     }
//   }
// }
