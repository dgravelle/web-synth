var Synth = (function() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var keyboard = document.getElementById('keyboard');
  var master;
  var masterVolumeSlider;
  var vca;
  var oscType;
  var lfo;
  var lfoGain;
  var lfoInput;
  var lfoInputVal;
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

    attackSlider = document.querySelector('#attack');
    sustainSlider = document.querySelector('#sustain');
    decaySlider = document.querySelector('#decay');
    releaseSlider = document.querySelector('#release');

    attackVal = Number(attack.value) / 100;
    sustainVal = Number(sustain.value) / 100;
    releaseVal = Number(release.value) / 100;
    decayVal = Number(decay.value) / 100;

    lfoInput = document.querySelector('#lfo');
    lfoInputVal = Number(lfoInput.value);

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

    lfo = audioCtx.createOscillator();
    lfo.connect(vca.gain);

    lfo.frequency.value = lfoInputVal;
    lfo.start(0);

    masterVolumeSlider = document.getElementById('masterVolume');

    Synth.startListening();
  };

  Synth.startListening = function() {
    keyboard.addEventListener('mousedown', Synth.playSound);
    keyboard.addEventListener('mouseup',  Synth.stopSound);
    // wave type selection
    waveControls.addEventListener('change', Synth.updateWave);
    // envelope sliders
    attack.addEventListener('change', Synth.updateAttack);
    sustain.addEventListener('change', Synth.updateSustain);
    decay.addEventListener('change', Synth.updateDecay);
    release.addEventListener('change', Synth.updateRelease);
    // amp mod slider
    lfoInput.addEventListener('change', Synth.updateLfo);
    // master volume slider
    masterVolumeSlider.addEventListener('change', Synth.updateMasterVolume);
  };

  Synth.playSound = function(event) {
    now = audioCtx.currentTime;
    
    vco.frequency.cancelScheduledValues(now);
    vco.frequency.setValueAtTime(Number(event.target.attributes.value.nodeValue), now);

    Synth.envelopeOn();
  };

  Synth.stopSound = function() {
    now = audioCtx.currentTime;
    Synth.envelopeOff();
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

  };

  Synth.envelopeOff = function() {
    now = audioCtx.currentTime;

    asdrGain.gain.cancelScheduledValues(now);
    asdrGain.gain.setValueAtTime(asdrGain.gain.value, now);
    asdrGain.gain.linearRampToValueAtTime(0.00000001, now + releaseVal);
  };

  Synth.updateAttack = function() {
    attackVal = Number(event.target.value) / 100;
  };
  Synth.updateSustain = function() {
    sustainVal = Number(event.target.value) / 100;
  };
  Synth.updateDecay = function() {
    decayVal = Number(event.target.value) / 100;
  };
  Synth.updateRelease = function() {
    releaseVal = Number(event.target.value) / 100;
  };

  Synth.updateLfo = function() {
    lfoInputVal = Number(event.target.value);
    lfo.frequency.value = lfoInputVal;
  };

  Synth.updateMasterVolume = function() {
    master.gain.value = Number(event.target.value) / 100;
  }

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
};
