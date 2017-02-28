'use strict';

const WindowManager = function() {
  let _windows = [];
  let _current = null;

  const _toggleWindow = function (wid) {
    if(_current !== wid) _hideWindow(_current);
    _windows.map(w => {
      if(w.win.getId() === wid) {
        w.win.toggle();
        _current = w.win.isVisible() ? wid : null;
      }
    });
  };

  const _showWindow = function (wid) {
    if(_current !== null && _current !== wid) _hideWindow(_current);
    _windows.map(w => {
      if(w.win.getId() === wid) {
        _current = wid;
        w.win.show();
      }
    });
  };

  const _hideWindow = function (wid) {
    _windows.map(w => {
      if(w.win.getId() === wid || wid === undefined || wid === null) {
        w.win.hide();
      }
    });
    _current = null;
  };

  const _addWindow = function(winObj) {
    _windows.push(winObj);
  };

  const _getWindow = function(name) {
    let _win = _windows.filter(w => {
      return w.win.getId() === name;
    });
    return _win.length > 0 ? _win[0] : null;
  };

  return {
    toggle: _toggleWindow,
    show: _showWindow,
    hide: _hideWindow,
    addWindow: _addWindow,
    getWindow: _getWindow
  }
}

module.exports = WindowManager;
