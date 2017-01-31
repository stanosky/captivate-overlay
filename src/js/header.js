'use strict';
const ToggleWindow = require('./ToggleWindow');
const Utils = require('./Utils');


let Header = function (cpApi,nav){
  let _tw = new ToggleWindow('mnheader');
  let courseName = $('#courseName');
  let slideNumber = $('#slideNumber');
  let slideName = $('#slideName');
  let header = $('#mnheader');
  let timeoutId;
  let currScreen;

  let clearTimeout = function() {
    window.clearTimeout(timeoutId);
  };
  let hideHeader = function () {
    clearTimeout();
    _tw.hide();
  };

  let showHeader = function () {
    clearTimeout();
    _tw.show();
  };

  let blink = function () {
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

  let _update = function() {
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
