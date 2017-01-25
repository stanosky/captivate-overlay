'use strict';
const ToggleWindow = require('./ToggleWindow');

let Menu = function (cpApi,winManager) {
  let _tw = new ToggleWindow('mnmenu');

  $('#menu-toc').click(e => winManager.show('mntoc'));
  $('#menu-exit').click(e => cpApi.setVariableValue('cpCmndExit',1));
  $('#menu-print').click(e => window.print());

  $('#menu-sound')[0].checked = cpApi.getVariableValue('cpCmndMute') === 0;
  $('#menu-sound')[0].onchange = (e) => {
    cpApi.setVariableValue('cpCmndMute',e.target.checked ? 0 : 1);
  };

  $('#menu-volume')[0].value = cpApi.getVariableValue('cpCmndVolume');
  $('#menu-volume')[0].onchange = (e) => {
    cpApi.setVariableValue('cpCmndVolume',e.target.value);
  };

  $('#menu-header')[0].checked = winManager.getWindow('mnheader').win.isTurnedOn();
  $('#menu-header')[0].onchange = (e) => {
    winManager.getWindow('mnheader').win.setTurnedOn(e.target.checked);
  }

  return {
    win: _tw
  };

};

module.exports = Menu;
