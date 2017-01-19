'use strict';

let ToggleWindow = function (id) {
  let _id = id;
  let _element = $('#'+_id),
  _visible = false,

  _getId = function() {
    return _id;
  },

  _isVisible = function() {
    return _visible;
  },

  _showToc = function() {
    _visible = true;
    _element.slideDown(200);
  },

  _hideToc = function() {
    _visible = false;
    _element.slideUp(200);
  },

  _toggleVisible = function() {
    _visible ? _hideToc() : _showToc();
  };

  _element.slideUp(0);

  return {
    getId: _getId,
    isVisible: _isVisible,
    show: _showToc,
    hide: _hideToc,
    toggle: _toggleVisible
  }

};

module.exports = ToggleWindow;
