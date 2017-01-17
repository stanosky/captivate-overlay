'use strict';

(function(){
  function hideHeader() {
    $('#mnheader').slideUp(100);
  }

  function showHeader() {
    $('#mnheader').slideDown(100);
  }
  
  window.addEventListener("moduleReadyEvent", function(evt)
  {
    let courseName = $('#courseName');
    let slideNumber = $('#slideNumber');
    let slideName = $('#slideName');


    $.getJSON("../navigation.json", function(json) {
        //console.log('json',json);
        var navigation = json;
        var interfaceObj = evt.Data;
        var eventEmitterObj = interfaceObj.getEventEmitter();
        eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',function(e){
          //console.log('navigation',navigation);
          if(navigation !== null) {
            //console.log(e.Data.slideNumber);
            var index = e.Data.slideNumber-1;
            var currSlide = navigation.slides[index];
            courseName.html(navigation.courseName);
            //slideNumber.html(e.Data.slideNumber+'.');
            slideNumber.html(currSlide.index+'.');
            slideName.html(currSlide.label);

          }
        });
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
  });
})();
