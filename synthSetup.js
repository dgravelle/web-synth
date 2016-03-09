var Synth = (function() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var keyboard = document.getElementById('keyboard');
  var gainNode;
  var osc;
  var oscType;
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

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    gainNode.connect(audioCtx.destination);

    asdrGain = audioCtx.createGain();
    asdrGain.gain.value = 0;
    asdrGain.connect(gainNode);

    osc = audioCtx.createOscillator();
    osc.start(0);
    osc.connect(asdrGain);

    attackSlider = asdrControls.querySelector('#attack');
    sustainSlider = asdrControls.querySelector('#sustain');
    decaySlider = asdrControls.querySelector('#decay');
    releaseSlider = asdrControls.querySelector('#release');

    attackVal = Number(attack.value) / 100;
    sustainVal = Number(sustain.value) / 100;
    releaseVal = Number(release.value) / 100;
    decayVal = Number(decay.value) / 100;


    Synth.startListening();
  };

  Synth.startListening = function() {
    keyboard.addEventListener('mousedown', Synth.playSound);
    keyboard.addEventListener('mouseup',  Synth.stopSound);
    keyboard.addEventListener('mouseleave',  Synth.stopSound);

    waveControls.addEventListener('change', Synth.updateWave);
    // asdrControls.addEventListener('change', Synth.updateASDR);
    attack.addEventListener('change', Synth.updateAttack);
    sustain.addEventListener('change', Synth.updateSustain);
    decay.addEventListener('change', Synth.updateDecay);
    release.addEventListener('change', Synth.updateRelease);
  };

  Synth.playSound = function(event) {

    now = audioCtx.currentTime;
    osc.frequency.cancelScheduledValues(now);
    osc.frequency.setValueAtTime(Number(event.target.attributes.value.nodeValue), now);

    Synth.envelopeOn(now);
  };

  Synth.stopSound = function() {
    now = audioCtx.currentTime;
    Synth.envelopeOff(now);
  };

  Synth.updateWave = function(event) {
    console.log(event);
    osc.type = event.target.id;
  };

  Synth.envelopeOn = function(now) {
    console.log(attackVal);

    asdrGain.gain.cancelScheduledValues(now);
    asdrGain.gain.setValueAtTime(0, now);
    asdrGain.gain.linearRampToValueAtTime(1, now + attackVal);
    asdrGain.gain.linearRampToValueAtTime(sustainVal, now + attackVal + decayVal);
  };

  Synth.envelopeOff = function(now) {
    asdrGain.gain.linearRampToValueAtTime(0, now + releaseVal);
  };

  // Synth.updateASDR = function(event) {
  //   console.log(event);
  // };

  Synth.updateAttack = function() {
    attackVal = Number(event.target.value) / 100;
    console.log(attackVal);
  };
  Synth.updateSustain = function() {
    sustainVal = Number(event.target.value) / 100;
  };
  Synth.updateDecay = function() {
    decayVal = Number(event.target.value) / 100;
  };
  Synth.updateRelease = function() {
    releaseVal = Number(event.target.value) / 100;
    console.log(releaseVal);
  };

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
};
