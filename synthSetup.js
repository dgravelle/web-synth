var Synth = (function() {
  var audioCtx;
  var gainNode;
  var osc;
  var keyboard;
  var oscType;
  var asdrGain;
  var now;

  var Synth = function(type) {
    keyboard = document.getElementById('keyboard');
    waveControls = document.getElementById('oscType');
    asdrControls = document.getElementById('asdr');

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    now = audioCtx.currentTime;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    gainNode.connect(audioCtx.destination);

    asdrGain = audioCtx.createGain();
    asdrGain.gain.value = 0;
    asdrGain.connect(gainNode);

    osc = audioCtx.createOscillator();
    osc.start(0);
    osc.connect(asdrGain);

    Synth.startListening();
  };

  Synth.startListening = function() {
    keyboard.addEventListener('mousedown', Synth.playSound);
    keyboard.addEventListener('mouseup',  Synth.stopSound);
    keyboard.addEventListener('mouseleave',  Synth.stopSound);

    waveControls.addEventListener('change', Synth.updateWave);
    asdrControls.addEventListener('change', Synth.updateASDR);
  };

  Synth.playSound = function(event) {
    osc.frequency.value = Number(event.target.attributes.value.nodeValue);
    var attack = asdrControls.querySelector('#attack');


    console.log(asdrGain.gain.value);
    console.log(now);
    asdrGain.gain.cancelScheduledValues(now)
    asdrGain.gain.setValueAtTime(0, now);
    asdrGain.gain.exponentialRampToValueAtTime(0.5, now + 1);
  };

  Synth.stopSound = function() {

    asdrGain.gain.setValueAtTime(0, now);
    asdrGain.gain.value = 0;
    console.log(asdrGain.gain.value);
  };

  Synth.updateWave = function(event) {
    console.log(event);
    osc.type = event.target.id;
  };

  Synth.updateASDR = function(event) {
    asdrGain.gain.value = Number(event.target.value);
    console.log(event);
  };

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
};
