'use strict';
const Utils = require('./Utils');

let Navigation = function(cpApi,winManager,data) {
  let observers = [];
  let eventEmitterObj = cpApi.getEventEmitter();
  let navData = data;

  let cpSlideLabel;
  let cpSlideNumber;
  let cpSlideId;

  let sceneIndex;
  let totalScreens = navData.screens.length;
  let screenInfo;


  let _next = function() {
    cpApi.setVariableValue('cpCmndGotoSlide',screenInfo.next);
    winManager.hide();
  };

  let _prev = function() {
    cpApi.setVariableValue('cpCmndGotoSlide',screenInfo.prev);
    winManager.hide();
  };

  let _addObserver = function(obj) {
    observers.push(obj);
  };

  let _getScreens = function() {
    return navData.screens;
  };

  let _isCompleted = function() {
    return cp.D[cpSlideId].mnc
  };

  let _isInteraction = function() {
    return cpSlideLabel === 'mnInteraction' && !_isCompleted();
  };

  let _isQuiz = function() {
    return cpSlideLabel === 'mnQuiz';
  };

  let _getScreenInfo = function() {
    return screenInfo;
  }

  let _toggleWindow = function(winName) {
    winManager.toggle(winName);
  };

  let _getCourseName = function() {
    return navData.courseName;
  };

  let _getWindow = function(winName) {
    return winManager.getWindow(winName);
  };

  let _showWindow = function(winName) {
    return winManager.show(winName);
  };

  let _hideWindow = function(winName) {
    return winManager.hide(winName);
  };

  let _onSlideEnter = function(e){
    cpSlideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    cpSlideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    cpSlideId = navData.sids[cpSlideNumber-1];

    sceneIndex = cpSlideNumber - 1;
    screenInfo = Utils.getCurrentScreenInfo(navData,sceneIndex);
    _update();

    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',_onHighlight,'highlight');
    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',_onFrameChange,'cpInfoCurrentFrame');

    cpApi.setVariableValue('highlight',0);
    cpApi.play();
  };

  let _onSlideExit = function(e) {
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED',_onHighlight,'highlight');
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED',_onFrameChange,'cpInfoCurrentFrame');
  };

  let _onHighlight = function(e) {
    if(e.Data.newVal === 1) cp.D[cpSlideId].mnc = true;
    _update();
  };

  let _onFrameChange = function(e) {
    let isBlocked = _isQuiz() || _isInteraction();
    //console.log('from',cp.D[cpSlideId].from,"to",cp.D[cpSlideId].to);
    if(cp.D[cpSlideId].to-1 === e.Data.newVal && !isBlocked) {
      cpApi.pause();
      if(!_isInteraction() && !_isQuiz()) cpApi.setVariableValue('highlight',1);
      _update();
    }
  };

  let _update = function() {
    observers.map(o => o.update());
  };

  // Do danych slajdu, dodajemy parametr "mnc" określający,
  // czy ekran został zaliczony (skrót od mncomplete).
  // Domyślnie nadajemy mu tą samą wartośc co parametr "v" (visited)
  // z kolejnego slajdu.
  // Parametr "mnc" będzie później wykorzystywany do stwierdzenia,
  // czy przejście do następnego ekranu należy zablokowac.
  navData.sids = cp.D.project_main.slides.split(',');
  navData.sids.map((sid,index,arr) => {
    let isNextSlide = index + 1 < arr.length;
    cp.D[sid].mnc = isNextSlide ? cp.D[arr[index+1]].v : false;
  });

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',_onSlideEnter);
  eventEmitterObj.addEventListener('CPAPI_SLIDEEXIT',_onSlideExit);

  return {
    next: _next,
    prev: _prev,
    isCompleted: _isCompleted,
    isInteraction: _isInteraction,
    isQuiz: _isQuiz,
    getScreenInfo: _getScreenInfo,
    getCourseName: _getCourseName,
    addObserver: _addObserver,
    toggleWindow: _toggleWindow,
    getWindow: _getWindow,
    showWindow: _showWindow,
    hideWindow: _hideWindow,
    getScreens: _getScreens
  };
};
module.exports = Navigation;


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
