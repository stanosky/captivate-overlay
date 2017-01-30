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

  let update = function(screenInfo) {
    if(currScreen !== screenInfo.index) {
      currScreen = screenInfo.index;
      courseName.html(nav.courseName);
      slideNumber.html(screenInfo.nr+'.');
      slideName.html(screenInfo.label);
      blink();
    }
  }

  let updateHandler = function(e){
    let sceneIndex = e.Data.slideNumber-1;
    let screenInfo = Utils.getCurrentScreenInfo(nav,sceneIndex);

    update(screenInfo);
  };

  let eventEmitterObj = cpApi.getEventEmitter();
  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',updateHandler);

  //update(cpApi.getVariableValue('cpInfoCurrentSlide') - 1);
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
