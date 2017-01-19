'use strict';

let WindowManager = function() {
  let _windows = [];
  let _current = null;

  let _toggleWindow = function (wid) {
    if(_current !== wid) _hideWindow(_current);
    _windows.map(w => {
      if(w.win.getId() === wid) {
        w.win.toggle();
        _current = w.win.isVisible() ? wid : null;
      }
    });
  };

  let _showWindow = function (wid) {
    if(_current !== null && _current !== wid) _hideWindow(_current);
    _windows.map(w => {
      if(w.win.getId() === wid) {
        _current = wid;
        w.win.show();
      }
    });
  };

  let _hideWindow = function (wid) {
    _windows.map(w => {
      if(w.win.getId() === wid || wid === undefined || wid === null) {
        w.win.hide();
      }
    });
    _current = null;
  };

  let _addWindow = function(winObj) {
    _windows.push(winObj);
  }

  return {
    toggle: _toggleWindow,
    show: _showWindow,
    hide: _hideWindow,
    addWindow: _addWindow
  }
}

module.exports = WindowManager;
