'use strict';
const ToggleWindow = require('./ToggleWindow');

let Menu = function () {
  let tw = new ToggleWindow('#mnmenu');

  return {
    isVisible: tw.isVisible,
    show: tw.show,
    hide: tw.hide,
    toggle: tw.toggle
  }

};

module.exports = Menu;
