const btn0 = document.getElementById('btn0');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btns = [btn0, btn1, btn2, btn3];
const def = document.getElementById('default');
const maho = document.getElementById('maho');
let ctx;
let gainNode;
let soundBuffer;
let source0;
let source1;
let source2;
let source3;
let sourceMaho = 0;
const sources =[source0, source1, source2, source3];
let sourceNumber = 0;
const volumeControl = document.getElementById('volume');
const speedControl = document.getElementById('speed');

let init = ()=> {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    ctx = new AudioContext();
    gainNode = ctx.createGain();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

let loadSound = (url)=> {
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = ()=> {
    ctx.decodeAudioData(request.response, (buffer)=> {
      soundBuffer = buffer;
      sourceMaho = ctx.createBufferSource();
      sourceMaho.buffer = soundBuffer;
      sourceMaho.playbackRate.value = speedControl.value;
      sourceMaho.connect(gainNode).connect(ctx.destination);
    });
  }
  request.send();
}


let loopSource = (buffer, number)=> {
  sources[number] = ctx.createBufferSource();
  sources[number].buffer = buffer;
  sources[number].playbackRate.value = speedControl.value;
  sources[number].connect(gainNode).connect(ctx.destination);
  sources[number].loop = true;
  switch (number) {
    case 0:
      sources[number].loopEnd = soundBuffer.duration;
      break;
    case 1:
      sources[number].loopEnd = soundBuffer.duration / 2;
      break;
    case 2:
      sources[number].loopEnd = soundBuffer.duration / 4;
      break;
    case 3:
      sources[number].loopEnd = soundBuffer.duration / 8;
      break;
    default:
      break;
  }
  sources[number].start(0);
  sourceNumber = number;
}

let btnControl = (buffer, number)=> {
  btns.forEach((item, i) => {
    if (i !== number) {
      if (item.dataset.playing == 'true') {
        sources[i].stop();
        item.dataset.playing = 'false';
      } else if (item.dataset.playing == 'false') {
        console.log('none');
      }
    } else if (i === number) {
      if (item.dataset.playing == 'true') {
        sources[i].stop();
        item.dataset.playing = 'false';
      } else if (item.dataset.playing == 'false') {
        item.dataset.playing = 'true';
        loopSource(buffer, number);
      }
    }
  });
}


window.addEventListener('load', ()=> {
  init();
  loadSound('assets/mawacchau.mp3');
}, false);

btn0.addEventListener('click', ()=> {
  btnControl(soundBuffer, 0);
}, false);

btn1.addEventListener('click', ()=> {
  btnControl(soundBuffer, 1);
}, false);

btn2.addEventListener('click', ()=> {
  btnControl(soundBuffer, 2);
}, false);

btn3.addEventListener('click', ()=> {
  btnControl(soundBuffer, 3);
}, false)

maho.addEventListener('click', ()=> {
  if(maho.dataset.playing == 'false') {
    sourceMaho.start();
    maho.dataset.playing = 'true';
  } else {
    sourceMaho = ctx.createBufferSource();
    sourceMaho.buffer = soundBuffer;
    sourceMaho.playbackRate.value = speedControl.value;
    sourceMaho.connect(gainNode).connect(ctx.destination);
    sourceMaho.start();
  }
}, false);

volumeControl.addEventListener('input', ()=> {
  gainNode.gain.value = volumeControl.value;
}, false)

speedControl.addEventListener('input', ()=> {
  sources[sourceNumber].playbackRate.value = speedControl.value;
}, false)

def.addEventListener('click', ()=> {
  volumeControl.value = 1;
  speedControl.value = 1;
}, false)
