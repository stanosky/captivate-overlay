'use strict';

let ToggleWindow = function (id) {
  let element = $(id),
  visible = false,

  _isVisible = function() {
    return visible;
  },

  _showToc = function() {
    visible = true;
    element.slideDown(200);
  },

  _hideToc = function() {
    visible = false;
    element.slideUp(200);
  },

  _toggleVisible = function() {
    visible ? _hideToc() : _showToc();
  };

  element.slideUp(0);

  return {
    isVisible: _isVisible,
    show: _showToc,
    hide: _hideToc,
    toggle: _toggleVisible
  }

};

module.exports = ToggleWindow;
