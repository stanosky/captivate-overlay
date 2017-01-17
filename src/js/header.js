'use strict';

let Header = function (interfaceObj,nav){
  let courseName = $('#courseName');
  let slideNumber = $('#slideNumber');
  let slideName = $('#slideName');

  let hideHeader = function () {
    $('#mnheader').slideUp(100);
  };

  let showHeader = function () {
    $('#mnheader').slideDown(100);
  };
  var eventEmitterObj = interfaceObj.getEventEmitter();
  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',function(e){
    //console.log('nav',nav);
    if(nav !== null) {
      //console.log(e.Data.slideNumber);
      var index = e.Data.slideNumber-1;
      var currSlide = nav.slides[index];
      courseName.html(nav.courseName);
      //slideNumber.html(e.Data.slideNumber+'.');
      slideNumber.html(currSlide.index+'.');
      slideName.html(currSlide.label);

    }
  });

  $('#mnheader').slideUp(0);
  $( "#mnrollover" )
    .mouseenter(function(event) {
      showHeader();
      //var screenNumber = window.cpAPIInterface.getVariableValue('cpCmndGotoSlide');
      //window.cpAPIInterface.setVariableValue('cpCmndGotoSlide',screenNumber+1);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    })
    .mouseleave(function(event) {
      hideHeader();
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    });
  return {
    show: showHeader,
    hide: hideHeader
  }
};

module.exports = Header
