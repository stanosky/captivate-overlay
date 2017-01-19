'use strict';
const ToggleWindow = require('./ToggleWindow');

let Menu = function () {
  let _tw = new ToggleWindow('mnmenu');

  return {
    win: _tw
  }

};

module.exports = Menu;
