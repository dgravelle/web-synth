// Goal: produce a sine wave based on user's input

// var C = document.getElementById('C');
// var D = document.getElementById('D');
// var stopBtn = document.getElementById('stopSynth');

var Synth = (function() {
  var audioCtx;
  var gainNode;
  var osc;
  var keyboard;
  var oscType;

  var Synth = function(type) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    osc = audioCtx.createOscillator();
    keyboard = document.getElementById('keyboard');

    gainNode.connect(audioCtx.destination);
    osc.connect(gainNode);
    gainNode.gain.value = 0;
    osc.start(0);

    Synth.startListening();
  };

  Synth.startListening = function() {
    keyboard.addEventListener('mousedown', Synth.playSound);
    keyboard.addEventListener('mouseup',  Synth.stopSound);
  };

  Synth.playSound = function(event) {
    osc.frequency.value = Number(event.target.attributes.value.nodeValue);
    gainNode.gain.value = 1;
  };

  Synth.stopSound = function() {
    gainNode.gain.value = 0;
  };

  return Synth;
})();

window.onload = function() {
  var synth = new Synth();
}

var keyboard = document.getElementById('keyboard');

keyboard.addEventListener('click', function() {


});
