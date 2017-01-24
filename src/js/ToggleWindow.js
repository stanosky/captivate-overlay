'use strict';

let ToggleWindow = function (id) {
  let _id = id;
  let _element = $('#'+_id),
  _visible = false,
  _turnedon = true,

  _getId = function() {
    return _id;
  },

  _isVisible = function() {
    return _visible;
  },

  _isTurnedOn = function() {
    return _turnedon;
  },

  _show = function() {
    if(!_turnedon) return;
    _visible = true;
    _element.slideDown(200);
  },

  _hide = function() {
    if(!_turnedon) return;
    _visible = false;
    _element.slideUp(200);
  },

  _setTurnedOn = function(value) {
    value ? _show() : _hide();
    _turnedon = value;
  },

  _toggleVisible = function() {
    _visible ? _hide() : _show();
  };

  _element.slideUp(0);

  return {
    getId: _getId,
    isVisible: _isVisible,
    isTurnedOn: _isTurnedOn,
    show: _show,
    hide: _hide,
    setTurnedOn: _setTurnedOn,
    toggle: _toggleVisible
  }

};

module.exports = ToggleWindow;
