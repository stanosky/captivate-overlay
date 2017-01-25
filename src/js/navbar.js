'use strict';

let Navbar = function (cpApi,nav,winManager) {
  let navbar = $('#mnnavbar');

  let hideMenus = function () {
    toc.hide();
    menu.hide();
  };

  let next = function() {
    cpApi.setVariableValue('cpCmndNextSlide',1);
    winManager.hide();
  };

  let prev = function() {
    cpApi.setVariableValue('cpCmndPrevious',1);
    winManager.hide();
  };

  let tocposition = $('#tocposition');
  let eventEmitterObj = cpApi.getEventEmitter();
  let totalSlides = cpApi.getVariableValue('cpInfoSlideCount');

  $('#nav-next').click((e) => next());
  $('#nav-prev').click((e) => prev());
  $('#nav-toc').click((e) => winManager.toggle('mntoc'));
  $('#nav-menu').click((e) => winManager.toggle('mnmenu'));

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',function(e){
    cpApi.setVariableValue('highlight',0);

    let slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    $('#nav-next')[0].disabled = slideLabel === 'mnInteraction';

    if(nav !== null) {
      let index = e.Data.slideNumber-1;
      let currSlide = cpApi.getVariableValue('cpInfoCurrentSlide');
      tocposition.html(currSlide+'/'+totalSlides);
    }
  });


  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',function(e) {
    if(e.Data.newVal === 1) {
      $('#nav-next')[0].disabled = false;
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }
  },'highlight');

  eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function(e) {
    //console.log('CPAPI_MOVIEPAUSE');
    //$('#nav-next').addClass('highlight');
  });

  eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function(e) {
    //console.log('CPAPI_MOVIESTOP');
  });
  eventEmitterObj.addEventListener('CPAPI_INTERACTIVEITEMSUBMIT', function (e) {
    //console.log('CPAPI_INTERACTIVEITEMSUBMIT',e.Data);
  });
};

module.exports = Navbar;
