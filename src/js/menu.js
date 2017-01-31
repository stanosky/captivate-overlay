'use strict';
const ToggleWindow = require('./ToggleWindow');

let Menu = function (cpApi,nav) {
  let _tw = new ToggleWindow('mnmenu');

  $('#menu-toc').click(e => nav.showWindow('mntoc'));
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

  $('#menu-header')[0].checked = nav.getWindow('mnheader').win.isTurnedOn();
  $('#menu-header')[0].onchange = (e) => {
    nav.getWindow('mnheader').win.setTurnedOn(e.target.checked);
  }
  let _update = function() {
    //console.log('update menu');
  };
  return {
    win: _tw,
    update: _update
  };

};

module.exports = Menu;
