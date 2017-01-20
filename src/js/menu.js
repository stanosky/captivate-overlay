'use strict';
const ToggleWindow = require('./ToggleWindow');

let Menu = function (cpApi,winManager) {
  let _tw = new ToggleWindow('mnmenu');
  let _btns = ['menu-toc','menu-materials','menu-glossary','menu-bibliography',
              'menu-help','menu-print','menu-save','menu-exit','menu-sound',
              'menu-volume','menu-animations','menu-header'];
  _btns.map(b => {
    let btn = $('#'+b);
    btn.click(function() {
      if(this.id === 'menu-toc') winManager.show('mntoc');
      if(this.id === 'menu-exit') cpApi.setVariableValue('cpCmndExit',1);
      if(this.id === 'menu-print') {
        //$('#mnoverlay').hide();
        window.print();
        //$('#mnoverlay').show();
      }
    });
  });


  return {
    win: _tw
  };

};

module.exports = Menu;
