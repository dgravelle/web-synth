var Synth = (function() {
  var audioCtx;
  var gainNode;
  var osc;
  var keyboard;
  var oscType;

  var Synth = function(type) {
    keyboard = document.getElementById('keyboard');
    waveControls = document.getElementById('oscType');

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(audioCtx.destination);

    osc = audioCtx.createOscillator();
    osc.start(0);
    osc.connect(gainNode);

    Synth.startListening();
  };

  Synth.startListening = function() {
    keyboard.addEventListener('mousedown', Synth.playSound);
    keyboard.addEventListener('mouseup',  Synth.stopSound);

    waveControls.addEventListener('change', Synth.updateWave);
  };

  Synth.playSound = function(event) {
    osc.frequency.value = Number(event.target.attributes.value.nodeValue);
    gainNode.gain.value = 1;
  };

  Synth.stopSound = function() {
    gainNode.gain.value = 0;
  };

  Synth.updateWave = function(event) {
    console.log(event);
    osc.type = event.target.id;
  }

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
}

var keyboard = document.getElementById('keyboard');

keyboard.addEventListener('click', function() {


});
