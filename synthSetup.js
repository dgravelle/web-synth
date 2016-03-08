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
    now = audioCtx.currentTime;

    asdrGain.gain.cancelScheduledValues(now);
    asdrGain.gain.setValueAtTime(0, now);
    asdrGain.gain.linearRampToValueAtTime(0.5, now + (attack.value / 50));
  };

  Synth.stopSound = function() {
    now = audioCtx.currentTime;
    var release = asdrControls.querySelector('#release').value;

    asdrGain.gain.linearRampToValueAtTime(0, now + ( Number(release) / 50 ));

  };

  Synth.updateWave = function(event) {
    console.log(event);
    osc.type = event.target.id;
  };

  Synth.updateASDR = function(event) {

    console.log(event);
  };

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
};
