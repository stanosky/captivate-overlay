'use strict';
import Utils from './Utils';

let Navbar = function (cpApi,nav,winManager) {
  let navbar = $('#mnnavbar');
  let tocposition = $('#tocposition');
  let eventEmitterObj = cpApi.getEventEmitter();
  let screenInfo = null;

  let next = function() {
    if(screenInfo !== null) cpApi.setVariableValue('cpCmndGotoSlide',screenInfo.next);
    winManager.hide();
  };

  let prev = function() {
    if(screenInfo !== null) cpApi.setVariableValue('cpCmndGotoSlide',screenInfo.prev);
    winManager.hide();
  };

  let updateNaviButtons = function(mode) {
    let slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    let slideIndex = slideNumber - 1;
    let isQuiz = mode === 'mnQuiz';
    let isInteraction = mode === 'mnInteraction';
    console.log('screenInfo',screenInfo.prev,screenInfo.index,screenInfo.next);
    $('#nav-next')[0].disabled = isQuiz || isInteraction || screenInfo.next === -1;
    $('#nav-prev')[0].disabled = isQuiz || screenInfo.prev === -1;
    $('#nav-toc')[0].disabled = isQuiz;
    $('#menu-toc')[0].disabled = isQuiz;
  }

  let onSlideEnter = function(e){

    let slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    let slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    let slideIndex = slideNumber - 1;
    let totalSlides = nav.screens.length;

    screenInfo = Utils.getCurrentScreenInfo(nav,slideIndex);

    updateNaviButtons(slideLabel);
    tocposition.html((screenInfo.nr) + '/' + totalSlides);
    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',onHighlight,'highlight');
    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',onFrameChange,'cpInfoCurrentFrame');
    cpApi.setVariableValue('highlight',0);
  };

  let onSlideExit = function(e) {
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED',onHighlight,'highlight');
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED',onFrameChange,'cpInfoCurrentFrame');
  };

  let onHighlight = function(e) {
    let slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    let currSlideId = nav.sids[slideNumber-1];
    //console.log('CPAPI_VARIABLEVALUECHANGED','highlight',e.Data.newVal);
    if(e.Data.newVal === 1) {
      cp.D[currSlideId].mnc = true;

      updateNaviButtons('');
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }
  };

  let onFrameChange = function(e) {
    let slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    let slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    let currSlideId = nav.sids[slideNumber-1];
    let isBlocked = slideLabel === 'mnInteraction' || slideLabel === 'mnQuiz';

    if(cp.D[currSlideId].to-1 === e.Data.newVal && !isBlocked) {
      cpApi.pause();
      cpApi.setVariableValue('highlight',1);
    }
  };



  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',onSlideEnter);
  eventEmitterObj.addEventListener('CPAPI_SLIDEEXIT',onSlideExit);


  $('#nav-next').click((e) => next());
  $('#nav-prev').click((e) => prev());
  $('#nav-toc').click((e) => winManager.toggle('mntoc'));
  $('#nav-menu').click((e) => winManager.toggle('mnmenu'));

  //eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',function(e) {
  //  console.log('cpQuizInfoAnswerChoice',e.Data);
  //},'cpQuizInfoAnswerChoice');


  //eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function(e) {
    //console.log('CPAPI_MOVIEPAUSE');
    //$('#nav-next').addClass('highlight');
  //});

  //eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function(e) {
    //console.log('CPAPI_MOVIESTOP');
  //});
  //eventEmitterObj.addEventListener('CPAPI_INTERACTIVEITEMSUBMIT', function (e) {
    //console.log('CPAPI_INTERACTIVEITEMSUBMIT',e.Data);
  //});
};

module.exports = Navbar;
