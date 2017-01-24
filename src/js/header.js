'use strict';
const ToggleWindow = require('./ToggleWindow');

let Header = function (interfaceObj,nav){
  let _tw = new ToggleWindow('mnheader');

  let courseName = $('#courseName');
  let slideNumber = $('#slideNumber');
  let slideName = $('#slideName');
  let header = $('#mnheader');
  let timeoutId;
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
      var index = e.Data.slideNumber-1;
      var currSlide = nav.slides[index];
      courseName.html(nav.courseName);
      slideNumber.html(currSlide.index+'.');
      slideName.html(currSlide.label);
      blink();
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
