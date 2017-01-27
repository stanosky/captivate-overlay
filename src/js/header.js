'use strict';
const ToggleWindow = require('./ToggleWindow');
const Utils = require('./Utils');


let Header = function (interfaceObj,nav){
  let _tw = new ToggleWindow('mnheader');
  let courseName = $('#courseName');
  let slideNumber = $('#slideNumber');
  let slideName = $('#slideName');
  let header = $('#mnheader');
  let timeoutId;
  let currScreen = 0;
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

  let eventEmitterObj = interfaceObj.getEventEmitter();
  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',function(e){
    if(nav !== null) {
      let sceneIndex = e.Data.slideNumber-1;
      let screenIndex = Utils.findScreenIndex(nav,sceneIndex);
      let currSlide = nav.screens[screenIndex];
      if(currScreen !== screenIndex) {
        currScreen = screenIndex
        courseName.html(nav.courseName);
        slideNumber.html(currSlide.nr+'.');
        slideName.html(currSlide.label);
        blink();
      }
    }
  });

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
  return {
    win: _tw
  }
};

module.exports = Header
