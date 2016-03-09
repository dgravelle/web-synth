var Synth = (function() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var keyboard = document.getElementById('keyboard');
  var master;
  var vca;
  var oscType;
  var LFO;
  var LFOGain;
  var now;

  // Envelope
  var asdrGain;
  var attackSlider;
  var sustainSlider;
  var decaySlider;
  var releaseSlider;
  var attackVal;
  var sustainVal;
  var releaseVal;
  var decayVal;

  var Synth = function(type) {
    waveControls = document.getElementById('oscType');
    asdrControls = document.getElementById('asdr');

    master = audioCtx.createGain();
    master.gain.value = 1;
    master.connect(audioCtx.destination);

    asdrGain = audioCtx.createGain();
    asdrGain.gain.value = 0;
    asdrGain.connect(master);

    vca = audioCtx.createGain();
    vca.connect(asdrGain);

    vco = audioCtx.createOscillator();
    vco.start(0);
    vco.connect(vca);

    LFO = audioCtx.createOscillator();
    LFO.connect(vca.gain);

    LFO.frequency.value = 2;
    LFO.start();

    attackSlider = asdrControls.querySelector('#attack');
    sustainSlider = asdrControls.querySelector('#sustain');
    decaySlider = asdrControls.querySelector('#decay');
    releaseSlider = asdrControls.querySelector('#release');

    attackVal = Number(attack.value) / 50;
    sustainVal = Number(sustain.value) / 50;
    releaseVal = Number(release.value) / 50;
    decayVal = Number(decay.value) / 50;


    Synth.startListening();
  };

  Synth.startListening = function() {
    keyboard.addEventListener('mousedown', Synth.playSound);
    keyboard.addEventListener('mouseup',  Synth.stopSound);
    // keyboard.addEventListener('mouseleave',  Synth.stopSound);

    waveControls.addEventListener('change', Synth.updateWave);

    attack.addEventListener('change', Synth.updateAttack);
    sustain.addEventListener('change', Synth.updateSustain);
    decay.addEventListener('change', Synth.updateDecay);
    release.addEventListener('change', Synth.updateRelease);
  };

  Synth.playSound = function(event) {

    now = audioCtx.currentTime;
    vco.frequency.cancelScheduledValues(now);
    vco.frequency.setValueAtTime(Number(event.target.attributes.value.nodeValue), now);
    console.log('play', asdrGain.gain.value);
    Synth.envelopeOn(now);
  };

  Synth.stopSound = function() {
    console.log(asdrGain.gain.value);
    now = audioCtx.currentTime;
    Synth.envelopeOff(now);
  };

  Synth.updateWave = function(event) {
    vco.type = event.target.id;
  };

  Synth.envelopeOn = function() {
    now = audioCtx.currentTime;
    asdrGain.gain.cancelScheduledValues(now);
    asdrGain.gain.setValueAtTime(0.01, now);
    asdrGain.gain.exponentialRampToValueAtTime(1, now + attackVal);
    asdrGain.gain.exponentialRampToValueAtTime(sustainVal, now + attackVal + decayVal);
    console.log('on ', asdrGain.gain.value);
  };

  Synth.envelopeOff = function() {
    now = audioCtx.currentTime;
    console.log('off ', asdrGain.gain.value);
    asdrGain.gain.cancelScheduledValues(now);
    asdrGain.gain.setValueAtTime(asdrGain.gain.value, now);
    asdrGain.gain.exponentialRampToValueAtTime(0.00000001, now + releaseVal);
  };

  Synth.updateAttack = function() {
    attackVal = Number(event.target.value) / 50;
  };
  Synth.updateSustain = function() {
    sustainVal = Number(event.target.value) / 50;
  };
  Synth.updateDecay = function() {
    decayVal = Number(event.target.value) / 50;
  };
  Synth.updateRelease = function() {
    releaseVal = Number(event.target.value) / 50;
  };

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
};
