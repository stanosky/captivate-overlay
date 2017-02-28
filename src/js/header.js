'use strict';
const ToggleWindow = require('./ToggleWindow');
const Utils = require('./Utils');


const Header = function (cpApi,nav){
  const _tw = new ToggleWindow('mnheader');
  const courseName = $('#courseName');
  const slideNumber = $('#slideNumber');
  const slideName = $('#slideName');
  const header = $('#mnheader');
  let timeoutId;
  let currScreen;

  const clearTimeout = function() {
    window.clearTimeout(timeoutId);
  };

  const hideHeader = function () {
    clearTimeout();
    _tw.hide();
  };

  const showHeader = function () {
    clearTimeout();
    _tw.show();
  };

  const blink = function () {
    showHeader();
    timeoutId = window.setTimeout(hideHeader,2000);
  };

  $('#mnheader').slideUp(0);
  $( "#mnrollover" )
    .mouseenter(function(event) {
      showHeader();
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    })
    .mouseleave(function(event) {
      hideHeader();
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    });

  const _update = function() {
    let screenInfo = nav.getScreenInfo();
    if(currScreen !== screenInfo.index) {
      currScreen = screenInfo.index;
      courseName.html(nav.getCourseName());
      slideNumber.html(screenInfo.nr+'.');
      slideName.html(screenInfo.label);
      blink();
    }
  };

  return {
    win: _tw,
    update: _update
  }
};

module.exports = Header
