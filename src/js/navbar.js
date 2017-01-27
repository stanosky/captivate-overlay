'use strict';
import Utils from './Utils';

let Navbar = function (cpApi,nav,winManager) {
  let navbar = $('#mnnavbar');

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

  $('#nav-next').click((e) => next());
  $('#nav-prev').click((e) => prev());
  $('#nav-toc').click((e) => winManager.toggle('mntoc'));
  $('#nav-menu').click((e) => winManager.toggle('mnmenu'));

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',function(e){
    cpApi.setVariableValue('highlight',0);

    let slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    let slideNumber = e.Data.slideNumber;
    let slideIndex = slideNumber - 1;
    let screenNumber = Utils.findScreenIndex(nav,slideIndex) + 1;
    let totalSlides = nav.screens.length;
    let currSlideId = nav.sids[slideIndex];
    let isCurrSlideCompleted = cp.D[currSlideId].mnc;

    $('#nav-next')[0].disabled = slideLabel === 'mnInteraction' && !isCurrSlideCompleted;

    tocposition.html(screenNumber+'/'+totalSlides);
  });


  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',function(e) {
    let slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    let currSlideId = nav.sids[slideNumber-1];
    if(e.Data.newVal === 1) {
      cp.D[currSlideId].mnc = true;
      $('#nav-next')[0].disabled = false;
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }
  },'highlight');

  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',function(e) {
    let slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    let currSlideId = nav.sids[slideNumber-1];
    //console.log('should stop',cp.D[currSlideId].to-1,e.Data.newVal);
    if(cp.D[currSlideId].to-1 === e.Data.newVal) {
      cpApi.pause();
      cpApi.setVariableValue('highlight',1);
    }
  },'cpInfoCurrentFrame');

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
