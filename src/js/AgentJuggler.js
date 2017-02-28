'use strict';

const AgentJuggler = function () {
  let _agent;
  let _loop;
  let _stopped = false;
  let _eyesTimeout;

  const _idleLoop = _loop =  function _idleLoop() {};

  const _scanLoop = function _scanLoop() {
    let _iframe = $("#cpDocument").find('iframe')[0] || null;
    _stopped = true;
    if(_iframe === null) return;
    _agent = _iframe.contentWindow.agent;
    if(_agent === undefined) return;
    console.log('_agent',_agent,_agent.body_mc);
    _agent.body_mc.play();
    _agent.body_mc.head_mc.play();
    _agent.body_mc.head_mc.lips_mc.play();
    openEyes();
    _stopped = false;
    _loop = _idleLoop;
  };

  function closeEyes() {
    _agent.body_mc.head_mc.eyes_mc.gotoAndStop(1);
    _eyesTimeout = setTimeout(openEyes, 200);
  }

  function openEyes() {
    _agent.body_mc.head_mc.eyes_mc.gotoAndStop(2);
    _eyesTimeout = setTimeout(closeEyes, 6000);
  }

  function _start() {
    _loop = _scanLoop;
  }

  function _juggle() {
    _loop();
  }

  function _stop() {
    console.log('_stop');
    if(!_stopped) {
      _stopped = true;
      _agent.body_mc.head_mc.lips_mc.gotoAndStop(1);
      _loop = _idleLoop;
    }
  }

  function _clear() {
    clearTimeout(_eyesTimeout);
    _agent = null;
  }

  return {
    start:_start,
    juggle:_juggle,
    stop:_stop,
    clear:_clear,
  };
};

module.exports = AgentJuggler;
