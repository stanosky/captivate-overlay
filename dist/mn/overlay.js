(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');
var Utils = require('./Utils');

var Header = function Header(cpApi, nav) {
  var _tw = new ToggleWindow('mnheader');
  var courseName = $('#courseName');
  var slideNumber = $('#slideNumber');
  var slideName = $('#slideName');
  var header = $('#mnheader');
  var timeoutId = void 0;
  var currScreen = void 0;

  var clearTimeout = function clearTimeout() {
    window.clearTimeout(timeoutId);
  };

  var hideHeader = function hideHeader() {
    clearTimeout();
    _tw.hide();
  };

  var showHeader = function showHeader() {
    clearTimeout();
    _tw.show();
  };

  var blink = function blink() {
    showHeader();
    timeoutId = window.setTimeout(hideHeader, 2000);
  };

  $('#mnheader').slideUp(0);
  $("#mnrollover").mouseenter(function (event) {
    showHeader();
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  }).mouseleave(function (event) {
    hideHeader();
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  });

  var _update = function _update() {
    var screenInfo = nav.getScreenInfo();
    if (currScreen !== screenInfo.index) {
      currScreen = screenInfo.index;
      courseName.html(nav.getCourseName());
      slideNumber.html(screenInfo.nr + '.');
      slideName.html(screenInfo.label);
      //blink();
    }
  };

  return {
    win: _tw,
    update: _update
  };
};

module.exports = Header;

},{"./ToggleWindow":7,"./Utils":8}],2:[function(require,module,exports){
'use strict';

var InteractionUtils = function InteractionUtils(cpApi) {

  var _vars = [],
      _corr = [];

  var _setVariables = function _setVariables(array) {
    _vars = array;
  };

  var _setCorrect = function _setCorrect(array) {
    _corr = array;
  };

  var _isVarEqual = function _isVarEqual(index) {
    return cpAPIInterface.getVariableValue(_vars[index]) == _corr[index];
  };

  var _areVarsEqual = function _areVarsEqual() {
    var equalVars = _vars.filter(function (v, i) {
      return _isVarEqual(i);
    });
    return equalVars.length === _vars.length;
  };

  return {
    setVariables: _setVariables,
    setCorrect: _setCorrect,
    isVarEqual: _isVarEqual,
    areVarsEqual: _areVarsEqual
  };
};

module.exports = InteractionUtils;

},{}],3:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var Menu = function Menu(cpApi, nav) {
  var _tw = new ToggleWindow('mnmenu');

  $('#menu-toc').click(function (e) {
    return nav.showWindow('mntoc');
  });
  $('#menu-exit').click(function (e) {
    return cpApi.setVariableValue('cpCmndExit', 1);
  });
  $('#menu-print').click(function (e) {
    return window.print();
  });

  $('#menu-sound')[0].checked = cpApi.getVariableValue('cpCmndMute') === 0;
  $('#menu-sound')[0].onchange = function (e) {
    cpApi.setVariableValue('cpCmndMute', e.target.checked ? 0 : 1);
  };

  $('#menu-volume')[0].value = cpApi.getVariableValue('cpCmndVolume');
  $('#menu-volume')[0].onchange = function (e) {
    cpApi.setVariableValue('cpCmndVolume', e.target.value);
  };

  $('#menu-header')[0].checked = nav.getWindow('mnheader').win.isTurnedOn();
  $('#menu-header')[0].onchange = function (e) {
    nav.getWindow('mnheader').win.setTurnedOn(e.target.checked);
  };
  var _update = function _update() {
    //console.log('update menu');
  };
  return {
    win: _tw,
    update: _update
  };
};

module.exports = Menu;

},{"./ToggleWindow":7}],4:[function(require,module,exports){
'use strict';

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Navbar = function Navbar(cpApi, nav) {
  var navbar = $('#mnnavbar');
  var tocposition = $('#tocposition');
  var progress = $('#lesson-progress');
  var progressLabel = $('#lesson-progress-label strong');

  function _update() {
    //console.log('update navbar');
    var screenInfo = nav.getScreenInfo();
    var isQuiz = nav.isQuiz();
    var isInteraction = nav.isInteraction();
    var totalScreens = nav.getScreens().length;

    $('#nav-next')[0].disabled = isQuiz || isInteraction || screenInfo.next === -1;
    $('#nav-prev')[0].disabled = isQuiz || screenInfo.prev === -1;
    $('#nav-toc')[0].disabled = isQuiz;
    $('#menu-toc')[0].disabled = isQuiz;

    if (nav.isCompleted() && screenInfo.next !== -1) {
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }

    tocposition.html(screenInfo.nr + '/' + totalScreens);
    if (isQuiz) {
      progress.val(100);
      //progressLabel.html('Scena 1 z 1');
    } else {
      var currScene = screenInfo.currScene + 1;
      if (screenInfo.currScene > -1) {
        progress.val(currScene / screenInfo.totalScenes * 100);
        //progressLabel.html('Scena ' + currScene + ' z ' + screenInfo.totalScenes);
      } else {
        progress.val(100);
        //progressLabel.html('');
      }
    }
  }

  $('#nav-next').click(function (e) {
    return nav.next();
  });
  $('#nav-prev').click(function (e) {
    return nav.prev();
  });
  $('#nav-toc').click(function (e) {
    return nav.toggleWindow('mntoc');
  });
  $('#nav-menu').click(function (e) {
    return nav.toggleWindow('mnmenu');
  });

  return {
    update: _update
  };
};

module.exports = Navbar;

},{"./Utils":8}],5:[function(require,module,exports){
'use strict';

var Utils = require('./Utils');
//const AgentJuggler = require('./AgentJuggler');

var Navigation = function Navigation(cpApi, winManager, data) {
  //const ag = new AgentJuggler();
  var observers = [];
  var eventEmitterObj = cpApi.getEventEmitter();
  var navData = data;

  var cpSlideLabel = void 0;
  var cpSlideNumber = void 0;
  var cpSlideId = void 0;

  var sceneIndex = void 0;
  var totalScreens = navData.screens.length;
  var screenInfo = void 0;

  var _next = function _next() {
    cpApi.setVariableValue('cpCmndGotoSlide', screenInfo.next);
    winManager.hide();
  };

  var _prev = function _prev() {
    cpApi.setVariableValue('cpCmndGotoSlide', screenInfo.prev);
    winManager.hide();
  };

  var _addObserver = function _addObserver(obj) {
    observers.push(obj);
  };

  var _getScreens = function _getScreens() {
    return navData.screens;
  };

  var _isCompleted = function _isCompleted() {
    return cp.D[cpSlideId].mnc;
  };

  var _isInteraction = function _isInteraction() {
    return cpSlideLabel === 'mnInteraction' && !_isCompleted();
  };

  var _isQuiz = function _isQuiz() {
    return cpSlideLabel === 'mnQuiz';
  };

  var _getScreenInfo = function _getScreenInfo() {
    return screenInfo;
  };

  var _toggleWindow = function _toggleWindow(winName) {
    winManager.toggle(winName);
  };

  var _getCourseName = function _getCourseName() {
    return navData.courseName;
  };

  var _getWindow = function _getWindow(winName) {
    return winManager.getWindow(winName);
  };

  var _showWindow = function _showWindow(winName) {
    return winManager.show(winName);
  };

  var _hideWindow = function _hideWindow(winName) {
    return winManager.hide(winName);
  };

  var _onSlideEnter = function _onSlideEnter(e) {
    cpSlideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    cpSlideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    cpSlideId = navData.sids[cpSlideNumber - 1];

    sceneIndex = cpSlideNumber - 1;
    screenInfo = Utils.getCurrentScreenInfo(navData, sceneIndex);
    _update();

    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', _onHighlight, 'highlight');
    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', _onFrameChange, 'cpInfoCurrentFrame');

    cpApi.setVariableValue('highlight', 0);
    cpApi.play();
    //ag.start();
  };

  var _onSlideExit = function _onSlideExit(e) {
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', _onHighlight, 'highlight');
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', _onFrameChange, 'cpInfoCurrentFrame');
    //ag.clear();
  };

  var _onHighlight = function _onHighlight(e) {
    if (e.Data.newVal === 1) cp.D[cpSlideId].mnc = true;
    _update();
  };

  var _onFrameChange = function _onFrameChange(e) {
    var isBlocked = _isQuiz() || _isInteraction();
    var endFrame = cp.D[cpSlideId].to - 1;
    var currFrame = e.Data.newVal;
    console.log('from', cp.D[cpSlideId].from, "to", cp.D[cpSlideId].to);
    if (currFrame >= endFrame) {
      eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', _onFrameChange, 'cpInfoCurrentFrame');
      if (!_isQuiz()) cpApi.pause();
      _update();
      //ag.stop();
      if (!isBlocked) cpApi.setVariableValue('highlight', 1);
    } else {
      //ag.juggle();
    }
  };

  var _update = function _update() {
    observers.map(function (o) {
      return o.update();
    });
  };

  // Do danych slajdu, dodajemy parametr "mnc" określający,
  // czy ekran został zaliczony (skrót od mncomplete).
  // Domyślnie nadajemy mu tą samą wartośc co parametr "v" (visited)
  // z kolejnego slajdu.
  // Parametr "mnc" będzie później wykorzystywany do stwierdzenia,
  // czy przejście do następnego ekranu należy zablokowac.
  navData.sids = cp.D.project_main.slides.split(',');
  navData.sids.map(function (sid, index, arr) {
    var isNextSlide = index + 1 < arr.length;
    cp.D[sid].mnc = isNextSlide ? cp.D[arr[index + 1]].v : false;
  });

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', _onSlideEnter);
  eventEmitterObj.addEventListener('CPAPI_SLIDEEXIT', _onSlideExit);

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

},{"./Utils":8}],6:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var TabelOfContents = function TabelOfContents(cpApi, nav) {
  var _mntoc = $('#mntoc');
  var _tw = new ToggleWindow('mntoc');

  var output = [];
  var screens = nav.getScreens();
  for (var i = 0; i < screens.length; i++) {
    output.push("<div><input type='button' name='toc-item' id='toc-item-" + i + "'>" + "<label for='toc-item-" + i + "'>" + "<i class='fa fa-map-marker fa-lg' aria-hidden='true'></i>" + "<span>" + screens[i].nr + ".</span>&nbsp;&nbsp;" + screens[i].label + "</label></div>");
  }
  $('#mntoc .slides-group').html(output.join(''));
  $('.slides-group div').click(function (e) {
    //console.log($(this).index());
    var screenIndex = $(this).index();
    var sceneIndex = screens[screenIndex].scenes[0];
    cpApi.setVariableValue('cpCmndGotoSlide', sceneIndex);
    cpApi.setVariableValue('cpCmndGotoFrameAndResume', 0);
    _tw.hide();
  });

  var _update = function _update() {
    //console.log('update toc');
  };

  return {
    win: _tw,
    update: _update
  };
};

module.exports = TabelOfContents;

},{"./ToggleWindow":7}],7:[function(require,module,exports){
'use strict';

var ToggleWindow = function ToggleWindow(id) {
  var _id = id;
  var _element = $('#' + _id),
      _visible = false,
      _turnedon = true,
      _getId = function _getId() {
    return _id;
  },
      _isVisible = function _isVisible() {
    return _visible;
  },
      _isTurnedOn = function _isTurnedOn() {
    return _turnedon;
  },
      _show = function _show() {
    if (!_turnedon) return;
    _visible = true;
    _element.slideDown(200);
  },
      _hide = function _hide() {
    if (!_turnedon) return;
    _visible = false;
    _element.slideUp(200);
  },
      _setTurnedOn = function _setTurnedOn(value) {
    value ? _show() : _hide();
    _turnedon = value;
  },
      _toggleVisible = function _toggleVisible() {
    _visible ? _hide() : _show();
  };

  _element.slideUp(0);

  return {
    getId: _getId,
    isVisible: _isVisible,
    isTurnedOn: _isTurnedOn,
    show: _show,
    hide: _hide,
    setTurnedOn: _setTurnedOn,
    toggle: _toggleVisible
  };
};

module.exports = ToggleWindow;

},{}],8:[function(require,module,exports){
'use strict';

var _findScreenIndex = function _findScreenIndex(arr, sceneIndex) {
  var screensLen = arr.length;
  var output = void 0;
  for (var i = 0; i < screensLen; i++) {
    output = arr[i].scenes !== undefined ? arr[i].scenes.filter(function (scene) {
      return scene === sceneIndex;
    }) : [];
    if (output.length > 0) return i;
  }
  return -1;
};

var _getScreensArray = function _getScreensArray(nav, currScene) {
  var isHidden = _isSceneHidden(nav.hidden, currScene);
  return isHidden ? nav.hidden : nav.screens;
};

var _isSceneHidden = function _isSceneHidden(arr, sceneIndex) {
  return arr.filter(function (scr) {
    return scr.scenes.filter(function (scene) {
      return scene === sceneIndex;
    }).length > 0;
  }).length > 0;
};

var _getPrevSceneIndex = function _getPrevSceneIndex(arr, currScene) {
  var screenIndex = _findScreenIndex(arr, currScene);
  var screen = void 0,
      scenes = void 0,
      sceneIndex = void 0;

  if (screenIndex >= 0) {
    screen = arr[screenIndex];
    scenes = screen.scenes;
    sceneIndex = scenes.indexOf(currScene);
    if (sceneIndex > 0) {
      return scenes[sceneIndex - 1];
    } else if (screen.prev !== undefined) {
      return screen.prev;
    } else if (screenIndex > 0) {
      screen = arr[screenIndex - 1];
      scenes = screen.scenes;
      return scenes[scenes.length - 1];
    }
  }
  return -1;
};

var _getNextSceneIndex = function _getNextSceneIndex(arr, currScene) {
  var screenIndex = _findScreenIndex(arr, currScene);
  var screen = void 0,
      scenes = void 0,
      sceneIndex = void 0;

  if (screenIndex >= 0) {
    screen = arr[screenIndex];
    scenes = screen.scenes;
    sceneIndex = scenes.indexOf(currScene);
    if (sceneIndex < scenes.length - 1) {
      return scenes[sceneIndex + 1];
    } else if (screen.next !== undefined) {
      return screen.next;
    } else if (screenIndex < arr.length - 1) {
      screen = arr[screenIndex + 1];
      scenes = screen.scenes;
      return scenes[0];
    }
  }
  return -1;
};

var getCurrentScreenInfo = function getCurrentScreenInfo(nav, sceneIndex) {
  var screens = _getScreensArray(nav, sceneIndex);
  var index = _findScreenIndex(screens, sceneIndex);
  var screen = index >= 0 ? screens[index] : null;
  //console.log('getCurrentScreenInfo',index,screen,sceneIndex);
  return {
    index: index,
    nr: screen.nr,
    label: screen.label,
    currScene: screen.scenes.indexOf(sceneIndex),
    totalScenes: screen.scenes.length,
    prev: _getPrevSceneIndex(screens, sceneIndex),
    next: _getNextSceneIndex(screens, sceneIndex)
  };
};

module.exports = { getCurrentScreenInfo: getCurrentScreenInfo };

},{}],9:[function(require,module,exports){
'use strict';

var WindowManager = function WindowManager() {
  var _windows = [];
  var _current = null;

  var _toggleWindow = function _toggleWindow(wid) {
    if (_current !== wid) _hideWindow(_current);
    _windows.map(function (w) {
      if (w.win.getId() === wid) {
        w.win.toggle();
        _current = w.win.isVisible() ? wid : null;
      }
    });
  };

  var _showWindow = function _showWindow(wid) {
    if (_current !== null && _current !== wid) _hideWindow(_current);
    _windows.map(function (w) {
      if (w.win.getId() === wid) {
        _current = wid;
        w.win.show();
      }
    });
  };

  var _hideWindow = function _hideWindow(wid) {
    _windows.map(function (w) {
      if (w.win.getId() === wid || wid === undefined || wid === null) {
        w.win.hide();
      }
    });
    _current = null;
  };

  var _addWindow = function _addWindow(winObj) {
    _windows.push(winObj);
  };

  var _getWindow = function _getWindow(name) {
    var _win = _windows.filter(function (w) {
      return w.win.getId() === name;
    });
    return _win.length > 0 ? _win[0] : null;
  };

  return {
    toggle: _toggleWindow,
    show: _showWindow,
    hide: _hideWindow,
    addWindow: _addWindow,
    getWindow: _getWindow
  };
};

module.exports = WindowManager;

},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var WindowManager = require('./WindowManager');
var Header = require('./Header');
var Navbar = require('./Navbar');
var Menu = require('./Menu');
var TableOfContents = require('./TableOfContents');
var Navigation = require('./Navigation');
var InteractionUtils = require('./InteractionUtils');

global.mn = function () {
  var cpInterface = void 0;
  //let myOverlay;
  var winManager = new WindowManager();
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  var myNavigation = void 0;
  var interactionUtils = new InteractionUtils();

  /*function onResize(e) {
    let viewportWidth = $(window).width();
    let viewportHeight = $(window).height();
    let left = 0;
    let scale = 1;
      if(viewportWidth <= 1280) {
      let wscale = viewportWidth / 800;
      let hscale = viewportHeight / 600;
      scale = Math.min(wscale,hscale);
      left = 1;
    } else {
      left = (viewportWidth - (800 * scale)) * .5;
    }
    console.log(viewportWidth, viewportHeight, scale, left);
    $('#main_container').attr('style',`
      top: 0px;
      position: fixed;
      left: ${left}px;
      width: 800px;
      height: 600px;
      transform-origin: left top 0px;
      transform: scale(${scale});
    `);
  }*/

  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;
    //window.cp.SetScaleAndPosition = function(){return false;};
    $.getJSON("navigation.json", function (data) {
      myNavigation = new Navigation(cpInterface, winManager, data);

      myHeader = new Header(cpInterface, myNavigation);
      winManager.addWindow(myHeader);
      myNavigation.addObserver(myHeader);
      myToc = new TableOfContents(cpInterface, myNavigation);
      winManager.addWindow(myToc);
      myNavigation.addObserver(myToc);
      myMenu = new Menu(cpInterface, myNavigation);
      winManager.addWindow(myMenu);
      myNavigation.addObserver(myMenu);
      myNavbar = new Navbar(cpInterface, myNavigation);
      myNavigation.addObserver(myNavbar);
    });
  });

  //onResize();
  //$( window ).resize(onResize);

  return {
    int: interactionUtils
  };
}();

module.exports = mn;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Header":1,"./InteractionUtils":2,"./Menu":3,"./Navbar":4,"./Navigation":5,"./TableOfContents":6,"./WindowManager":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxJbnRlcmFjdGlvblV0aWxzLmpzIiwic3JjXFxqc1xcTWVudS5qcyIsInNyY1xcanNcXE5hdmJhci5qcyIsInNyY1xcanNcXE5hdmlnYXRpb24uanMiLCJzcmNcXGpzXFxUYWJsZU9mQ29udGVudHMuanMiLCJzcmNcXGpzXFxUb2dnbGVXaW5kb3cuanMiLCJzcmNcXGpzXFxVdGlscy5qcyIsInNyY1xcanNcXFdpbmRvd01hbmFnZXIuanMiLCJzcmNcXGpzXFxzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxlQUFlLFFBQXJCLEFBQXFCLEFBQVE7QUFDN0IsSUFBTSxRQUFRLFFBQWQsQUFBYyxBQUFROztBQUd0QixJQUFNLFNBQVMsU0FBVCxBQUFTLE9BQUEsQUFBVSxPQUFWLEFBQWdCLEtBQUksQUFDakM7TUFBTSxNQUFNLElBQUEsQUFBSSxhQUFoQixBQUFZLEFBQWlCLEFBQzdCO01BQU0sYUFBYSxFQUFuQixBQUFtQixBQUFFLEFBQ3JCO01BQU0sY0FBYyxFQUFwQixBQUFvQixBQUFFLEFBQ3RCO01BQU0sWUFBWSxFQUFsQixBQUFrQixBQUFFLEFBQ3BCO01BQU0sU0FBUyxFQUFmLEFBQWUsQUFBRSxBQUNqQjtNQUFJLGlCQUFKLEFBQ0E7TUFBSSxrQkFBSixBQUVBOztNQUFNLGVBQWUsU0FBZixBQUFlLGVBQVcsQUFDOUI7V0FBQSxBQUFPLGFBRFQsQUFDRSxBQUFvQixBQUNyQixBQUVEOzs7TUFBTSxhQUFhLFNBQWIsQUFBYSxhQUFZLEFBQzdCLEFBQ0E7O1FBRkYsQUFFRSxBQUFJLEFBQ0wsQUFFRDs7O01BQU0sYUFBYSxTQUFiLEFBQWEsYUFBWSxBQUM3QixBQUNBOztRQUZGLEFBRUUsQUFBSSxBQUNMLEFBRUQ7OztNQUFNLFFBQVEsU0FBUixBQUFRLFFBQVksQUFDeEIsQUFDQTs7Z0JBQVksT0FBQSxBQUFPLFdBQVAsQUFBa0IsWUFGaEMsQUFFRSxBQUFZLEFBQTZCLEFBQzFDLEFBRUQ7OztJQUFBLEFBQUUsYUFBRixBQUFlLFFBQWYsQUFBdUIsQUFDdkI7SUFBQSxBQUFHLGVBQUgsQUFDRyxXQUFXLFVBQUEsQUFBUyxPQUFPLEFBQzFCLEFBQ0E7O1VBQUEsQUFBTSxpQkFBaUIsTUFBdkIsQUFBdUIsQUFBTSxtQkFBb0IsTUFBQSxBQUFNLGNBSDNELEFBR0ksQUFBcUUsQUFDdEU7S0FKSCxBQUtHLFdBQVcsVUFBQSxBQUFTLE9BQU8sQUFDMUIsQUFDQTs7VUFBQSxBQUFNLGlCQUFpQixNQUF2QixBQUF1QixBQUFNLG1CQUFvQixNQUFBLEFBQU0sY0FQM0QsQUFPSSxBQUFxRSxBQUN0RSxBQUVIOzs7TUFBTSxVQUFVLFNBQVYsQUFBVSxVQUFXLEFBQ3pCO1FBQUksYUFBYSxJQUFqQixBQUFpQixBQUFJLEFBQ3JCO1FBQUcsZUFBZSxXQUFsQixBQUE2QixPQUFPLEFBQ2xDO21CQUFhLFdBQWIsQUFBd0IsQUFDeEI7aUJBQUEsQUFBVyxLQUFLLElBQWhCLEFBQWdCLEFBQUksQUFDcEI7a0JBQUEsQUFBWSxLQUFLLFdBQUEsQUFBVyxLQUE1QixBQUErQixBQUMvQjtnQkFBQSxBQUFVLEtBQUssV0FBZixBQUEwQixBQUMxQixBQUNEO0FBQ0Y7QUFURCxBQVdBOzs7O1NBQU8sQUFDQSxBQUNMO1lBcERKLEFBa0RFLEFBQU8sQUFDTCxBQUNRLEFBRVg7Ozs7QUFFRCxPQUFBLEFBQU8sVUFBUCxBQUFpQjs7O0FDN0RqQjs7QUFFQSxJQUFNLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBUyxLQUFULEVBQWdCOztBQUV2QyxNQUFJLFFBQVEsRUFBWjtBQUFBLE1BQWUsUUFBUSxFQUF2Qjs7QUFFQSxNQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFTLEtBQVQsRUFBZ0I7QUFDcEMsWUFBUSxLQUFSO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLGNBQWMsU0FBZCxXQUFjLENBQVMsS0FBVCxFQUFnQjtBQUNsQyxZQUFRLEtBQVI7QUFDRCxHQUZEOztBQUlBLE1BQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxLQUFULEVBQWdCO0FBQ2xDLFdBQU8sZUFBZSxnQkFBZixDQUFnQyxNQUFNLEtBQU4sQ0FBaEMsS0FBaUQsTUFBTSxLQUFOLENBQXhEO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLGdCQUFnQixTQUFoQixhQUFnQixHQUFXO0FBQy9CLFFBQUksWUFBWSxNQUFNLE1BQU4sQ0FBYSxVQUFDLENBQUQsRUFBRyxDQUFILEVBQVM7QUFDcEMsYUFBTyxZQUFZLENBQVosQ0FBUDtBQUNELEtBRmUsQ0FBaEI7QUFHQSxXQUFPLFVBQVUsTUFBVixLQUFxQixNQUFNLE1BQWxDO0FBQ0QsR0FMRDs7QUFPQSxTQUFRO0FBQ04sa0JBQWMsYUFEUjtBQUVOLGdCQUFZLFdBRk47QUFHTixnQkFBWSxXQUhOO0FBSU4sa0JBQWM7QUFKUixHQUFSO0FBTUQsQ0E3QkQ7O0FBK0JBLE9BQU8sT0FBUCxHQUFpQixnQkFBakI7OztBQ2pDQTs7QUFDQSxJQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQVUsS0FBVixFQUFnQixHQUFoQixFQUFxQjtBQUNoQyxNQUFNLE1BQU0sSUFBSSxZQUFKLENBQWlCLFFBQWpCLENBQVo7O0FBRUEsSUFBRSxXQUFGLEVBQWUsS0FBZixDQUFxQjtBQUFBLFdBQUssSUFBSSxVQUFKLENBQWUsT0FBZixDQUFMO0FBQUEsR0FBckI7QUFDQSxJQUFFLFlBQUYsRUFBZ0IsS0FBaEIsQ0FBc0I7QUFBQSxXQUFLLE1BQU0sZ0JBQU4sQ0FBdUIsWUFBdkIsRUFBb0MsQ0FBcEMsQ0FBTDtBQUFBLEdBQXRCO0FBQ0EsSUFBRSxhQUFGLEVBQWlCLEtBQWpCLENBQXVCO0FBQUEsV0FBSyxPQUFPLEtBQVAsRUFBTDtBQUFBLEdBQXZCOztBQUVBLElBQUUsYUFBRixFQUFpQixDQUFqQixFQUFvQixPQUFwQixHQUE4QixNQUFNLGdCQUFOLENBQXVCLFlBQXZCLE1BQXlDLENBQXZFO0FBQ0EsSUFBRSxhQUFGLEVBQWlCLENBQWpCLEVBQW9CLFFBQXBCLEdBQStCLFVBQUMsQ0FBRCxFQUFPO0FBQ3BDLFVBQU0sZ0JBQU4sQ0FBdUIsWUFBdkIsRUFBb0MsRUFBRSxNQUFGLENBQVMsT0FBVCxHQUFtQixDQUFuQixHQUF1QixDQUEzRDtBQUNELEdBRkQ7O0FBSUEsSUFBRSxjQUFGLEVBQWtCLENBQWxCLEVBQXFCLEtBQXJCLEdBQTZCLE1BQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsQ0FBN0I7QUFDQSxJQUFFLGNBQUYsRUFBa0IsQ0FBbEIsRUFBcUIsUUFBckIsR0FBZ0MsVUFBQyxDQUFELEVBQU87QUFDckMsVUFBTSxnQkFBTixDQUF1QixjQUF2QixFQUFzQyxFQUFFLE1BQUYsQ0FBUyxLQUEvQztBQUNELEdBRkQ7O0FBSUEsSUFBRSxjQUFGLEVBQWtCLENBQWxCLEVBQXFCLE9BQXJCLEdBQStCLElBQUksU0FBSixDQUFjLFVBQWQsRUFBMEIsR0FBMUIsQ0FBOEIsVUFBOUIsRUFBL0I7QUFDQSxJQUFFLGNBQUYsRUFBa0IsQ0FBbEIsRUFBcUIsUUFBckIsR0FBZ0MsVUFBQyxDQUFELEVBQU87QUFDckMsUUFBSSxTQUFKLENBQWMsVUFBZCxFQUEwQixHQUExQixDQUE4QixXQUE5QixDQUEwQyxFQUFFLE1BQUYsQ0FBUyxPQUFuRDtBQUNELEdBRkQ7QUFHQSxNQUFNLFVBQVUsU0FBVixPQUFVLEdBQVc7QUFDekI7QUFDRCxHQUZEO0FBR0EsU0FBTztBQUNMLFNBQUssR0FEQTtBQUVMLFlBQVE7QUFGSCxHQUFQO0FBS0QsQ0E3QkQ7O0FBK0JBLE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FDbENBOztBQUNBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQVUsS0FBVixFQUFnQixHQUFoQixFQUFxQjtBQUNsQyxNQUFNLFNBQVMsRUFBRSxXQUFGLENBQWY7QUFDQSxNQUFNLGNBQWMsRUFBRSxjQUFGLENBQXBCO0FBQ0EsTUFBTSxXQUFXLEVBQUUsa0JBQUYsQ0FBakI7QUFDQSxNQUFNLGdCQUFnQixFQUFFLCtCQUFGLENBQXRCOztBQUVBLFdBQVMsT0FBVCxHQUFtQjtBQUNqQjtBQUNBLFFBQUksYUFBYSxJQUFJLGFBQUosRUFBakI7QUFDQSxRQUFJLFNBQVMsSUFBSSxNQUFKLEVBQWI7QUFDQSxRQUFJLGdCQUFnQixJQUFJLGFBQUosRUFBcEI7QUFDQSxRQUFJLGVBQWUsSUFBSSxVQUFKLEdBQWlCLE1BQXBDOztBQUVBLE1BQUUsV0FBRixFQUFlLENBQWYsRUFBa0IsUUFBbEIsR0FBNkIsVUFBVSxhQUFWLElBQTJCLFdBQVcsSUFBWCxLQUFvQixDQUFDLENBQTdFO0FBQ0EsTUFBRSxXQUFGLEVBQWUsQ0FBZixFQUFrQixRQUFsQixHQUE2QixVQUFVLFdBQVcsSUFBWCxLQUFvQixDQUFDLENBQTVEO0FBQ0EsTUFBRSxVQUFGLEVBQWMsQ0FBZCxFQUFpQixRQUFqQixHQUE0QixNQUE1QjtBQUNBLE1BQUUsV0FBRixFQUFlLENBQWYsRUFBa0IsUUFBbEIsR0FBNkIsTUFBN0I7O0FBRUEsUUFBRyxJQUFJLFdBQUosTUFBcUIsV0FBVyxJQUFYLEtBQW9CLENBQUMsQ0FBN0MsRUFBZ0Q7QUFDOUMsUUFBRSxtQkFBRixFQUF1QixRQUF2QixDQUFnQyxXQUFoQztBQUNELEtBRkQsTUFFTztBQUNMLFFBQUUsbUJBQUYsRUFBdUIsV0FBdkIsQ0FBbUMsV0FBbkM7QUFDRDs7QUFFRCxnQkFBWSxJQUFaLENBQWtCLFdBQVcsRUFBWixHQUFrQixHQUFsQixHQUF3QixZQUF6QztBQUNBLFFBQUcsTUFBSCxFQUFXO0FBQ1QsZUFBUyxHQUFULENBQWEsR0FBYjtBQUNBO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsVUFBSSxZQUFZLFdBQVcsU0FBWCxHQUF1QixDQUF2QztBQUNBLFVBQUcsV0FBVyxTQUFYLEdBQXVCLENBQUMsQ0FBM0IsRUFBOEI7QUFDNUIsaUJBQVMsR0FBVCxDQUFjLFlBQVksV0FBVyxXQUF4QixHQUF1QyxHQUFwRDtBQUNBO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsaUJBQVMsR0FBVCxDQUFhLEdBQWI7QUFDQTtBQUNEO0FBQ0Y7QUFDRjs7QUFHRCxJQUFFLFdBQUYsRUFBZSxLQUFmLENBQXFCLFVBQUMsQ0FBRDtBQUFBLFdBQU8sSUFBSSxJQUFKLEVBQVA7QUFBQSxHQUFyQjtBQUNBLElBQUUsV0FBRixFQUFlLEtBQWYsQ0FBcUIsVUFBQyxDQUFEO0FBQUEsV0FBTyxJQUFJLElBQUosRUFBUDtBQUFBLEdBQXJCO0FBQ0EsSUFBRSxVQUFGLEVBQWMsS0FBZCxDQUFvQixVQUFDLENBQUQ7QUFBQSxXQUFPLElBQUksWUFBSixDQUFpQixPQUFqQixDQUFQO0FBQUEsR0FBcEI7QUFDQSxJQUFFLFdBQUYsRUFBZSxLQUFmLENBQXFCLFVBQUMsQ0FBRDtBQUFBLFdBQU8sSUFBSSxZQUFKLENBQWlCLFFBQWpCLENBQVA7QUFBQSxHQUFyQjs7QUFFQSxTQUFPO0FBQ0wsWUFBUTtBQURILEdBQVA7QUFHRCxDQWpERDs7QUFtREEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCOzs7QUN0REE7O0FBQ0EsSUFBTSxRQUFRLFFBQVEsU0FBUixDQUFkO0FBQ0E7O0FBRUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFTLEtBQVQsRUFBZSxVQUFmLEVBQTBCLElBQTFCLEVBQWdDO0FBQ2pEO0FBQ0EsTUFBSSxZQUFZLEVBQWhCO0FBQ0EsTUFBSSxrQkFBa0IsTUFBTSxlQUFOLEVBQXRCO0FBQ0EsTUFBSSxVQUFVLElBQWQ7O0FBRUEsTUFBSSxxQkFBSjtBQUNBLE1BQUksc0JBQUo7QUFDQSxNQUFJLGtCQUFKOztBQUVBLE1BQUksbUJBQUo7QUFDQSxNQUFJLGVBQWUsUUFBUSxPQUFSLENBQWdCLE1BQW5DO0FBQ0EsTUFBSSxtQkFBSjs7QUFHQSxNQUFNLFFBQVEsU0FBUixLQUFRLEdBQVc7QUFDdkIsVUFBTSxnQkFBTixDQUF1QixpQkFBdkIsRUFBeUMsV0FBVyxJQUFwRDtBQUNBLGVBQVcsSUFBWDtBQUNELEdBSEQ7O0FBS0EsTUFBTSxRQUFRLFNBQVIsS0FBUSxHQUFXO0FBQ3ZCLFVBQU0sZ0JBQU4sQ0FBdUIsaUJBQXZCLEVBQXlDLFdBQVcsSUFBcEQ7QUFDQSxlQUFXLElBQVg7QUFDRCxHQUhEOztBQUtBLE1BQU0sZUFBZSxTQUFmLFlBQWUsQ0FBUyxHQUFULEVBQWM7QUFDakMsY0FBVSxJQUFWLENBQWUsR0FBZjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxjQUFjLFNBQWQsV0FBYyxHQUFXO0FBQzdCLFdBQU8sUUFBUSxPQUFmO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLGVBQWUsU0FBZixZQUFlLEdBQVc7QUFDOUIsV0FBTyxHQUFHLENBQUgsQ0FBSyxTQUFMLEVBQWdCLEdBQXZCO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLGlCQUFpQixTQUFqQixjQUFpQixHQUFXO0FBQ2hDLFdBQU8saUJBQWlCLGVBQWpCLElBQW9DLENBQUMsY0FBNUM7QUFDRCxHQUZEOztBQUlBLE1BQU0sVUFBVSxTQUFWLE9BQVUsR0FBVztBQUN6QixXQUFPLGlCQUFpQixRQUF4QjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsR0FBVztBQUNoQyxXQUFPLFVBQVA7QUFDRCxHQUZEOztBQUlBLE1BQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLENBQVMsT0FBVCxFQUFrQjtBQUN0QyxlQUFXLE1BQVgsQ0FBa0IsT0FBbEI7QUFDRCxHQUZEOztBQUlBLE1BQU0saUJBQWlCLFNBQWpCLGNBQWlCLEdBQVc7QUFDaEMsV0FBTyxRQUFRLFVBQWY7QUFDRCxHQUZEOztBQUlBLE1BQU0sYUFBYSxTQUFiLFVBQWEsQ0FBUyxPQUFULEVBQWtCO0FBQ25DLFdBQU8sV0FBVyxTQUFYLENBQXFCLE9BQXJCLENBQVA7QUFDRCxHQUZEOztBQUlBLE1BQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxPQUFULEVBQWtCO0FBQ3BDLFdBQU8sV0FBVyxJQUFYLENBQWdCLE9BQWhCLENBQVA7QUFDRCxHQUZEOztBQUlBLE1BQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxPQUFULEVBQWtCO0FBQ3BDLFdBQU8sV0FBVyxJQUFYLENBQWdCLE9BQWhCLENBQVA7QUFDRCxHQUZEOztBQUlBLE1BQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLENBQVMsQ0FBVCxFQUFXO0FBQy9CLG1CQUFlLE1BQU0sZ0JBQU4sQ0FBdUIseUJBQXZCLENBQWY7QUFDQSxvQkFBZ0IsTUFBTSxnQkFBTixDQUF1QixvQkFBdkIsQ0FBaEI7QUFDQSxnQkFBWSxRQUFRLElBQVIsQ0FBYSxnQkFBYyxDQUEzQixDQUFaOztBQUVBLGlCQUFhLGdCQUFnQixDQUE3QjtBQUNBLGlCQUFhLE1BQU0sb0JBQU4sQ0FBMkIsT0FBM0IsRUFBbUMsVUFBbkMsQ0FBYjtBQUNBOztBQUVBLG9CQUFnQixnQkFBaEIsQ0FBaUMsNEJBQWpDLEVBQThELFlBQTlELEVBQTJFLFdBQTNFO0FBQ0Esb0JBQWdCLGdCQUFoQixDQUFpQyw0QkFBakMsRUFBOEQsY0FBOUQsRUFBNkUsb0JBQTdFOztBQUVBLFVBQU0sZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBbUMsQ0FBbkM7QUFDQSxVQUFNLElBQU47QUFDQTtBQUNELEdBZkQ7O0FBaUJBLE1BQU0sZUFBZSxTQUFmLFlBQWUsQ0FBUyxDQUFULEVBQVk7QUFDL0Isb0JBQWdCLG1CQUFoQixDQUFvQyw0QkFBcEMsRUFBaUUsWUFBakUsRUFBOEUsV0FBOUU7QUFDQSxvQkFBZ0IsbUJBQWhCLENBQW9DLDRCQUFwQyxFQUFpRSxjQUFqRSxFQUFnRixvQkFBaEY7QUFDQTtBQUNELEdBSkQ7O0FBTUEsTUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFTLENBQVQsRUFBWTtBQUMvQixRQUFHLEVBQUUsSUFBRixDQUFPLE1BQVAsS0FBa0IsQ0FBckIsRUFBd0IsR0FBRyxDQUFILENBQUssU0FBTCxFQUFnQixHQUFoQixHQUFzQixJQUF0QjtBQUN4QjtBQUNELEdBSEQ7O0FBS0EsTUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxDQUFULEVBQVk7QUFDakMsUUFBSSxZQUFZLGFBQWEsZ0JBQTdCO0FBQ0EsUUFBSSxXQUFXLEdBQUcsQ0FBSCxDQUFLLFNBQUwsRUFBZ0IsRUFBaEIsR0FBbUIsQ0FBbEM7QUFDQSxRQUFJLFlBQVksRUFBRSxJQUFGLENBQU8sTUFBdkI7QUFDQSxZQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW1CLEdBQUcsQ0FBSCxDQUFLLFNBQUwsRUFBZ0IsSUFBbkMsRUFBd0MsSUFBeEMsRUFBNkMsR0FBRyxDQUFILENBQUssU0FBTCxFQUFnQixFQUE3RDtBQUNBLFFBQUcsYUFBYSxRQUFoQixFQUEwQjtBQUN4QixzQkFBZ0IsbUJBQWhCLENBQW9DLDRCQUFwQyxFQUFpRSxjQUFqRSxFQUFnRixvQkFBaEY7QUFDQSxVQUFHLENBQUMsU0FBSixFQUFlLE1BQU0sS0FBTjtBQUNmO0FBQ0E7QUFDQSxVQUFHLENBQUMsU0FBSixFQUFlLE1BQU0sZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBbUMsQ0FBbkM7QUFDaEIsS0FORCxNQU1PO0FBQ0w7QUFDRDtBQUNGLEdBZEQ7O0FBZ0JBLE1BQU0sVUFBVSxTQUFWLE9BQVUsR0FBVztBQUN6QixjQUFVLEdBQVYsQ0FBYztBQUFBLGFBQUssRUFBRSxNQUFGLEVBQUw7QUFBQSxLQUFkO0FBQ0QsR0FGRDs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFRLElBQVIsR0FBZSxHQUFHLENBQUgsQ0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLEtBQXpCLENBQStCLEdBQS9CLENBQWY7QUFDQSxVQUFRLElBQVIsQ0FBYSxHQUFiLENBQWlCLFVBQUMsR0FBRCxFQUFLLEtBQUwsRUFBVyxHQUFYLEVBQW1CO0FBQ2xDLFFBQUksY0FBYyxRQUFRLENBQVIsR0FBWSxJQUFJLE1BQWxDO0FBQ0EsT0FBRyxDQUFILENBQUssR0FBTCxFQUFVLEdBQVYsR0FBZ0IsY0FBYyxHQUFHLENBQUgsQ0FBSyxJQUFJLFFBQU0sQ0FBVixDQUFMLEVBQW1CLENBQWpDLEdBQXFDLEtBQXJEO0FBQ0QsR0FIRDs7QUFLQSxrQkFBZ0IsZ0JBQWhCLENBQWlDLGtCQUFqQyxFQUFvRCxhQUFwRDtBQUNBLGtCQUFnQixnQkFBaEIsQ0FBaUMsaUJBQWpDLEVBQW1ELFlBQW5EOztBQUVBLFNBQU87QUFDTCxVQUFNLEtBREQ7QUFFTCxVQUFNLEtBRkQ7QUFHTCxpQkFBYSxZQUhSO0FBSUwsbUJBQWUsY0FKVjtBQUtMLFlBQVEsT0FMSDtBQU1MLG1CQUFlLGNBTlY7QUFPTCxtQkFBZSxjQVBWO0FBUUwsaUJBQWEsWUFSUjtBQVNMLGtCQUFjLGFBVFQ7QUFVTCxlQUFXLFVBVk47QUFXTCxnQkFBWSxXQVhQO0FBWUwsZ0JBQVksV0FaUDtBQWFMLGdCQUFZO0FBYlAsR0FBUDtBQWVELENBbkpEO0FBb0pBLE9BQU8sT0FBUCxHQUFpQixVQUFqQjs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0U7QUFDQTtBQUNGOztBQUVBO0FBQ0U7QUFDRjtBQUNBO0FBQ0U7QUFDRjs7O0FDMUtBOztBQUNBLElBQU0sZUFBZSxRQUFRLGdCQUFSLENBQXJCOztBQUVBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQVUsS0FBVixFQUFnQixHQUFoQixFQUFxQjtBQUMzQyxNQUFNLFNBQVMsRUFBRSxRQUFGLENBQWY7QUFDQSxNQUFNLE1BQU0sSUFBSSxZQUFKLENBQWlCLE9BQWpCLENBQVo7O0FBRUEsTUFBSSxTQUFTLEVBQWI7QUFDQSxNQUFJLFVBQVUsSUFBSSxVQUFKLEVBQWQ7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxXQUFPLElBQVAsQ0FBWSw0REFBMEQsQ0FBMUQsR0FBNEQsSUFBNUQsR0FDQSx1QkFEQSxHQUN3QixDQUR4QixHQUMwQixJQUQxQixHQUVBLDJEQUZBLEdBR0EsUUFIQSxHQUdTLFFBQVEsQ0FBUixFQUFXLEVBSHBCLEdBR3VCLHNCQUh2QixHQUlBLFFBQVEsQ0FBUixFQUFXLEtBSlgsR0FJaUIsZ0JBSjdCO0FBS0Q7QUFDRCxJQUFFLHNCQUFGLEVBQTBCLElBQTFCLENBQStCLE9BQU8sSUFBUCxDQUFZLEVBQVosQ0FBL0I7QUFDQSxJQUFFLG1CQUFGLEVBQXVCLEtBQXZCLENBQTZCLFVBQVMsQ0FBVCxFQUFZO0FBQ3ZDO0FBQ0EsUUFBSSxjQUFjLEVBQUUsSUFBRixFQUFRLEtBQVIsRUFBbEI7QUFDQSxRQUFJLGFBQWEsUUFBUSxXQUFSLEVBQXFCLE1BQXJCLENBQTRCLENBQTVCLENBQWpCO0FBQ0EsVUFBTSxnQkFBTixDQUF1QixpQkFBdkIsRUFBeUMsVUFBekM7QUFDQSxVQUFNLGdCQUFOLENBQXVCLDBCQUF2QixFQUFrRCxDQUFsRDtBQUNBLFFBQUksSUFBSjtBQUNELEdBUEQ7O0FBU0EsTUFBTSxVQUFVLFNBQVYsT0FBVSxHQUFXO0FBQ3pCO0FBQ0QsR0FGRDs7QUFJQSxTQUFPO0FBQ0wsU0FBSyxHQURBO0FBRUwsWUFBUTtBQUZILEdBQVA7QUFLRCxDQWhDRDs7QUFrQ0EsT0FBTyxPQUFQLEdBQWlCLGVBQWpCOzs7QUNyQ0E7O0FBRUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFVLEVBQVYsRUFBYztBQUNqQyxNQUFJLE1BQU0sRUFBVjtBQUNBLE1BQUksV0FBVyxFQUFFLE1BQUksR0FBTixDQUFmO0FBQUEsTUFDQSxXQUFXLEtBRFg7QUFBQSxNQUVBLFlBQVksSUFGWjtBQUFBLE1BSUEsU0FBUyxTQUFULE1BQVMsR0FBVztBQUNsQixXQUFPLEdBQVA7QUFDRCxHQU5EO0FBQUEsTUFRQSxhQUFhLFNBQWIsVUFBYSxHQUFXO0FBQ3RCLFdBQU8sUUFBUDtBQUNELEdBVkQ7QUFBQSxNQVlBLGNBQWMsU0FBZCxXQUFjLEdBQVc7QUFDdkIsV0FBTyxTQUFQO0FBQ0QsR0FkRDtBQUFBLE1BZ0JBLFFBQVEsU0FBUixLQUFRLEdBQVc7QUFDakIsUUFBRyxDQUFDLFNBQUosRUFBZTtBQUNmLGVBQVcsSUFBWDtBQUNBLGFBQVMsU0FBVCxDQUFtQixHQUFuQjtBQUNELEdBcEJEO0FBQUEsTUFzQkEsUUFBUSxTQUFSLEtBQVEsR0FBVztBQUNqQixRQUFHLENBQUMsU0FBSixFQUFlO0FBQ2YsZUFBVyxLQUFYO0FBQ0EsYUFBUyxPQUFULENBQWlCLEdBQWpCO0FBQ0QsR0ExQkQ7QUFBQSxNQTRCQSxlQUFlLFNBQWYsWUFBZSxDQUFTLEtBQVQsRUFBZ0I7QUFDN0IsWUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsZ0JBQVksS0FBWjtBQUNELEdBL0JEO0FBQUEsTUFpQ0EsaUJBQWlCLFNBQWpCLGNBQWlCLEdBQVc7QUFDMUIsZUFBVyxPQUFYLEdBQXFCLE9BQXJCO0FBQ0QsR0FuQ0Q7O0FBcUNBLFdBQVMsT0FBVCxDQUFpQixDQUFqQjs7QUFFQSxTQUFPO0FBQ0wsV0FBTyxNQURGO0FBRUwsZUFBVyxVQUZOO0FBR0wsZ0JBQVksV0FIUDtBQUlMLFVBQU0sS0FKRDtBQUtMLFVBQU0sS0FMRDtBQU1MLGlCQUFhLFlBTlI7QUFPTCxZQUFRO0FBUEgsR0FBUDtBQVVELENBbkREOztBQXFEQSxPQUFPLE9BQVAsR0FBaUIsWUFBakI7OztBQ3ZEQTs7QUFFQSxJQUFNLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBUyxHQUFULEVBQWEsVUFBYixFQUF5QjtBQUNoRCxNQUFJLGFBQWEsSUFBSSxNQUFyQjtBQUNBLE1BQUksZUFBSjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFwQixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxhQUFTLElBQUksQ0FBSixFQUFPLE1BQVAsS0FBa0IsU0FBbEIsR0FBOEIsSUFBSSxDQUFKLEVBQU8sTUFBUCxDQUFjLE1BQWQsQ0FBcUIsaUJBQVM7QUFDakUsYUFBTyxVQUFVLFVBQWpCO0FBQ0gsS0FGc0MsQ0FBOUIsR0FFSixFQUZMO0FBR0EsUUFBRyxPQUFPLE1BQVAsR0FBZ0IsQ0FBbkIsRUFBc0IsT0FBTyxDQUFQO0FBQ3ZCO0FBQ0QsU0FBTyxDQUFDLENBQVI7QUFDRCxDQVZEOztBQVlBLElBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixDQUFTLEdBQVQsRUFBYSxTQUFiLEVBQXdCO0FBQy9DLE1BQUksV0FBVyxlQUFlLElBQUksTUFBbkIsRUFBMEIsU0FBMUIsQ0FBZjtBQUNBLFNBQU8sV0FBVyxJQUFJLE1BQWYsR0FBd0IsSUFBSSxPQUFuQztBQUNELENBSEQ7O0FBS0EsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxHQUFULEVBQWEsVUFBYixFQUF5QjtBQUM5QyxTQUFPLElBQUksTUFBSixDQUFXLGVBQU87QUFDdkIsV0FBTyxJQUFJLE1BQUosQ0FBVyxNQUFYLENBQWtCLGlCQUFTO0FBQ2hDLGFBQU8sVUFBVSxVQUFqQjtBQUNELEtBRk0sRUFFSixNQUZJLEdBRUssQ0FGWjtBQUdELEdBSk0sRUFJSixNQUpJLEdBSUssQ0FKWjtBQUtELENBTkQ7O0FBUUEsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLENBQVMsR0FBVCxFQUFhLFNBQWIsRUFBd0I7QUFDakQsTUFBSSxjQUFjLGlCQUFpQixHQUFqQixFQUFxQixTQUFyQixDQUFsQjtBQUNBLE1BQUksZUFBSjtBQUFBLE1BQVksZUFBWjtBQUFBLE1BQW9CLG1CQUFwQjs7QUFFQSxNQUFHLGVBQWUsQ0FBbEIsRUFBcUI7QUFDbkIsYUFBUyxJQUFJLFdBQUosQ0FBVDtBQUNBLGFBQVMsT0FBTyxNQUFoQjtBQUNBLGlCQUFhLE9BQU8sT0FBUCxDQUFlLFNBQWYsQ0FBYjtBQUNBLFFBQUcsYUFBYSxDQUFoQixFQUFrQjtBQUNoQixhQUFPLE9BQU8sYUFBYSxDQUFwQixDQUFQO0FBQ0QsS0FGRCxNQUVPLElBQUcsT0FBTyxJQUFQLEtBQWdCLFNBQW5CLEVBQTZCO0FBQ2xDLGFBQU8sT0FBTyxJQUFkO0FBQ0QsS0FGTSxNQUVBLElBQUcsY0FBYyxDQUFqQixFQUFtQjtBQUN4QixlQUFTLElBQUksY0FBYyxDQUFsQixDQUFUO0FBQ0EsZUFBUyxPQUFPLE1BQWhCO0FBQ0EsYUFBTyxPQUFPLE9BQU8sTUFBUCxHQUFjLENBQXJCLENBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBTyxDQUFDLENBQVI7QUFDRCxDQW5CRDs7QUFxQkEsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLENBQVMsR0FBVCxFQUFhLFNBQWIsRUFBd0I7QUFDakQsTUFBSSxjQUFjLGlCQUFpQixHQUFqQixFQUFxQixTQUFyQixDQUFsQjtBQUNBLE1BQUksZUFBSjtBQUFBLE1BQVksZUFBWjtBQUFBLE1BQW9CLG1CQUFwQjs7QUFFQSxNQUFHLGVBQWUsQ0FBbEIsRUFBcUI7QUFDbkIsYUFBUyxJQUFJLFdBQUosQ0FBVDtBQUNBLGFBQVMsT0FBTyxNQUFoQjtBQUNBLGlCQUFhLE9BQU8sT0FBUCxDQUFlLFNBQWYsQ0FBYjtBQUNBLFFBQUcsYUFBYSxPQUFPLE1BQVAsR0FBZ0IsQ0FBaEMsRUFBa0M7QUFDaEMsYUFBTyxPQUFPLGFBQWEsQ0FBcEIsQ0FBUDtBQUNELEtBRkQsTUFFTyxJQUFHLE9BQU8sSUFBUCxLQUFnQixTQUFuQixFQUE2QjtBQUNsQyxhQUFPLE9BQU8sSUFBZDtBQUNELEtBRk0sTUFFQSxJQUFHLGNBQWMsSUFBSSxNQUFKLEdBQWEsQ0FBOUIsRUFBZ0M7QUFDckMsZUFBUyxJQUFJLGNBQWMsQ0FBbEIsQ0FBVDtBQUNBLGVBQVMsT0FBTyxNQUFoQjtBQUNBLGFBQU8sT0FBTyxDQUFQLENBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBTyxDQUFDLENBQVI7QUFDRCxDQW5CRDs7QUFxQkEsSUFBTSx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQVMsR0FBVCxFQUFhLFVBQWIsRUFBeUI7QUFDcEQsTUFBSSxVQUFVLGlCQUFpQixHQUFqQixFQUFxQixVQUFyQixDQUFkO0FBQ0EsTUFBSSxRQUFRLGlCQUFpQixPQUFqQixFQUF5QixVQUF6QixDQUFaO0FBQ0EsTUFBSSxTQUFTLFNBQVMsQ0FBVCxHQUFhLFFBQVEsS0FBUixDQUFiLEdBQThCLElBQTNDO0FBQ0E7QUFDQSxTQUFPO0FBQ0wsV0FBTyxLQURGO0FBRUwsUUFBSSxPQUFPLEVBRk47QUFHTCxXQUFPLE9BQU8sS0FIVDtBQUlMLGVBQVcsT0FBTyxNQUFQLENBQWMsT0FBZCxDQUFzQixVQUF0QixDQUpOO0FBS0wsaUJBQWEsT0FBTyxNQUFQLENBQWMsTUFMdEI7QUFNTCxVQUFNLG1CQUFtQixPQUFuQixFQUEyQixVQUEzQixDQU5EO0FBT0wsVUFBTSxtQkFBbUIsT0FBbkIsRUFBMkIsVUFBM0I7QUFQRCxHQUFQO0FBU0QsQ0FkRDs7QUFpQkEsT0FBTyxPQUFQLEdBQWlCLEVBQUMsMENBQUQsRUFBakI7OztBQ3RGQTs7QUFFQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixHQUFXO0FBQy9CLE1BQUksV0FBVyxFQUFmO0FBQ0EsTUFBSSxXQUFXLElBQWY7O0FBRUEsTUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBVSxHQUFWLEVBQWU7QUFDbkMsUUFBRyxhQUFhLEdBQWhCLEVBQXFCLFlBQVksUUFBWjtBQUNyQixhQUFTLEdBQVQsQ0FBYSxhQUFLO0FBQ2hCLFVBQUcsRUFBRSxHQUFGLENBQU0sS0FBTixPQUFrQixHQUFyQixFQUEwQjtBQUN4QixVQUFFLEdBQUYsQ0FBTSxNQUFOO0FBQ0EsbUJBQVcsRUFBRSxHQUFGLENBQU0sU0FBTixLQUFvQixHQUFwQixHQUEwQixJQUFyQztBQUNEO0FBQ0YsS0FMRDtBQU1ELEdBUkQ7O0FBVUEsTUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFVLEdBQVYsRUFBZTtBQUNqQyxRQUFHLGFBQWEsSUFBYixJQUFxQixhQUFhLEdBQXJDLEVBQTBDLFlBQVksUUFBWjtBQUMxQyxhQUFTLEdBQVQsQ0FBYSxhQUFLO0FBQ2hCLFVBQUcsRUFBRSxHQUFGLENBQU0sS0FBTixPQUFrQixHQUFyQixFQUEwQjtBQUN4QixtQkFBVyxHQUFYO0FBQ0EsVUFBRSxHQUFGLENBQU0sSUFBTjtBQUNEO0FBQ0YsS0FMRDtBQU1ELEdBUkQ7O0FBVUEsTUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFVLEdBQVYsRUFBZTtBQUNqQyxhQUFTLEdBQVQsQ0FBYSxhQUFLO0FBQ2hCLFVBQUcsRUFBRSxHQUFGLENBQU0sS0FBTixPQUFrQixHQUFsQixJQUF5QixRQUFRLFNBQWpDLElBQThDLFFBQVEsSUFBekQsRUFBK0Q7QUFDN0QsVUFBRSxHQUFGLENBQU0sSUFBTjtBQUNEO0FBQ0YsS0FKRDtBQUtBLGVBQVcsSUFBWDtBQUNELEdBUEQ7O0FBU0EsTUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFTLE1BQVQsRUFBaUI7QUFDbEMsYUFBUyxJQUFULENBQWMsTUFBZDtBQUNELEdBRkQ7O0FBSUEsTUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFTLElBQVQsRUFBZTtBQUNoQyxRQUFJLE9BQU8sU0FBUyxNQUFULENBQWdCLGFBQUs7QUFDOUIsYUFBTyxFQUFFLEdBQUYsQ0FBTSxLQUFOLE9BQWtCLElBQXpCO0FBQ0QsS0FGVSxDQUFYO0FBR0EsV0FBTyxLQUFLLE1BQUwsR0FBYyxDQUFkLEdBQWtCLEtBQUssQ0FBTCxDQUFsQixHQUE0QixJQUFuQztBQUNELEdBTEQ7O0FBT0EsU0FBTztBQUNMLFlBQVEsYUFESDtBQUVMLFVBQU0sV0FGRDtBQUdMLFVBQU0sV0FIRDtBQUlMLGVBQVcsVUFKTjtBQUtMLGVBQVc7QUFMTixHQUFQO0FBT0QsQ0FuREQ7O0FBcURBLE9BQU8sT0FBUCxHQUFpQixhQUFqQjs7OztBQ3ZEQTs7QUFFQSxJQUFNLGdCQUFnQixRQUFRLGlCQUFSLENBQXRCO0FBQ0EsSUFBTSxTQUFTLFFBQVEsVUFBUixDQUFmO0FBQ0EsSUFBTSxTQUFTLFFBQVEsVUFBUixDQUFmO0FBQ0EsSUFBTSxPQUFPLFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBTSxrQkFBa0IsUUFBUSxtQkFBUixDQUF4QjtBQUNBLElBQU0sYUFBYSxRQUFRLGNBQVIsQ0FBbkI7QUFDQSxJQUFNLG1CQUFtQixRQUFRLG9CQUFSLENBQXpCOztBQUVBLE9BQU8sRUFBUCxHQUFhLFlBQVU7QUFDckIsTUFBSSxvQkFBSjtBQUNBO0FBQ0EsTUFBSSxhQUFhLElBQUksYUFBSixFQUFqQjtBQUNBLE1BQUksaUJBQUo7QUFDQSxNQUFJLGNBQUo7QUFDQSxNQUFJLGVBQUo7QUFDQSxNQUFJLGlCQUFKO0FBQ0EsTUFBSSxxQkFBSjtBQUNBLE1BQUksbUJBQW1CLElBQUksZ0JBQUosRUFBdkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsU0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsVUFBUyxHQUFULEVBQzVDO0FBQ0Usa0JBQWMsSUFBSSxJQUFsQjtBQUNBO0FBQ0EsTUFBRSxPQUFGLENBQVUsaUJBQVYsRUFBNkIsVUFBUyxJQUFULEVBQWU7QUFDeEMscUJBQWUsSUFBSSxVQUFKLENBQWUsV0FBZixFQUEyQixVQUEzQixFQUFzQyxJQUF0QyxDQUFmOztBQUVBLGlCQUFXLElBQUksTUFBSixDQUFXLFdBQVgsRUFBdUIsWUFBdkIsQ0FBWDtBQUNBLGlCQUFXLFNBQVgsQ0FBcUIsUUFBckI7QUFDQSxtQkFBYSxXQUFiLENBQXlCLFFBQXpCO0FBQ0EsY0FBUSxJQUFJLGVBQUosQ0FBb0IsV0FBcEIsRUFBZ0MsWUFBaEMsQ0FBUjtBQUNBLGlCQUFXLFNBQVgsQ0FBcUIsS0FBckI7QUFDQSxtQkFBYSxXQUFiLENBQXlCLEtBQXpCO0FBQ0EsZUFBUyxJQUFJLElBQUosQ0FBUyxXQUFULEVBQXFCLFlBQXJCLENBQVQ7QUFDQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0EsbUJBQWEsV0FBYixDQUF5QixNQUF6QjtBQUNBLGlCQUFXLElBQUksTUFBSixDQUFXLFdBQVgsRUFBdUIsWUFBdkIsQ0FBWDtBQUNBLG1CQUFhLFdBQWIsQ0FBeUIsUUFBekI7QUFDSCxLQWREO0FBZUQsR0FuQkQ7O0FBcUJBO0FBQ0E7O0FBRUEsU0FBTztBQUNMLFNBQUk7QUFEQyxHQUFQO0FBR0QsQ0FoRVcsRUFBWjs7QUFrRUEsT0FBTyxPQUFQLEdBQWlCLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XHJcblxyXG5cclxuY29uc3QgSGVhZGVyID0gZnVuY3Rpb24gKGNwQXBpLG5hdil7XHJcbiAgY29uc3QgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5oZWFkZXInKTtcclxuICBjb25zdCBjb3Vyc2VOYW1lID0gJCgnI2NvdXJzZU5hbWUnKTtcclxuICBjb25zdCBzbGlkZU51bWJlciA9ICQoJyNzbGlkZU51bWJlcicpO1xyXG4gIGNvbnN0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuICBjb25zdCBoZWFkZXIgPSAkKCcjbW5oZWFkZXInKTtcclxuICBsZXQgdGltZW91dElkO1xyXG4gIGxldCBjdXJyU2NyZWVuO1xyXG5cclxuICBjb25zdCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYmxpbmsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBzaG93SGVhZGVyKCk7XHJcbiAgICB0aW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dChoaWRlSGVhZGVyLDIwMDApO1xyXG4gIH07XHJcblxyXG4gICQoJyNtbmhlYWRlcicpLnNsaWRlVXAoMCk7XHJcbiAgJCggXCIjbW5yb2xsb3ZlclwiIClcclxuICAgIC5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHNob3dIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSlcclxuICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGhpZGVIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gIGNvbnN0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBzY3JlZW5JbmZvID0gbmF2LmdldFNjcmVlbkluZm8oKTtcclxuICAgIGlmKGN1cnJTY3JlZW4gIT09IHNjcmVlbkluZm8uaW5kZXgpIHtcclxuICAgICAgY3VyclNjcmVlbiA9IHNjcmVlbkluZm8uaW5kZXg7XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuZ2V0Q291cnNlTmFtZSgpKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChzY3JlZW5JbmZvLm5yKycuJyk7XHJcbiAgICAgIHNsaWRlTmFtZS5odG1sKHNjcmVlbkluZm8ubGFiZWwpO1xyXG4gICAgICAvL2JsaW5rKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3LFxyXG4gICAgdXBkYXRlOiBfdXBkYXRlXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgSW50ZXJhY3Rpb25VdGlscyA9IGZ1bmN0aW9uKGNwQXBpKSB7XHJcblxyXG4gIGxldCBfdmFycyA9IFtdLF9jb3JyID0gW107XHJcblxyXG4gIGNvbnN0IF9zZXRWYXJpYWJsZXMgPSBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgX3ZhcnMgPSBhcnJheTtcclxuICB9XHJcblxyXG4gIGNvbnN0IF9zZXRDb3JyZWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgIF9jb3JyID0gYXJyYXk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2lzVmFyRXF1YWwgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgcmV0dXJuIGNwQVBJSW50ZXJmYWNlLmdldFZhcmlhYmxlVmFsdWUoX3ZhcnNbaW5kZXhdKSA9PSBfY29ycltpbmRleF07XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2FyZVZhcnNFcXVhbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVxdWFsVmFycyA9IF92YXJzLmZpbHRlcigodixpKSA9PiB7XHJcbiAgICAgIHJldHVybiBfaXNWYXJFcXVhbChpKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGVxdWFsVmFycy5sZW5ndGggPT09IF92YXJzLmxlbmd0aDtcclxuICB9O1xyXG5cclxuICByZXR1cm4gIHtcclxuICAgIHNldFZhcmlhYmxlczogX3NldFZhcmlhYmxlcyxcclxuICAgIHNldENvcnJlY3Q6IF9zZXRDb3JyZWN0LFxyXG4gICAgaXNWYXJFcXVhbDogX2lzVmFyRXF1YWwsXHJcbiAgICBhcmVWYXJzRXF1YWw6IF9hcmVWYXJzRXF1YWxcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aW9uVXRpbHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmNvbnN0IE1lbnUgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgY29uc3QgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5tZW51Jyk7XHJcblxyXG4gICQoJyNtZW51LXRvYycpLmNsaWNrKGUgPT4gbmF2LnNob3dXaW5kb3coJ21udG9jJykpO1xyXG4gICQoJyNtZW51LWV4aXQnKS5jbGljayhlID0+IGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEV4aXQnLDEpKTtcclxuICAkKCcjbWVudS1wcmludCcpLmNsaWNrKGUgPT4gd2luZG93LnByaW50KCkpO1xyXG5cclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLmNoZWNrZWQgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJykgPT09IDA7XHJcbiAgJCgnI21lbnUtc291bmQnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJyxlLnRhcmdldC5jaGVja2VkID8gMCA6IDEpO1xyXG4gIH07XHJcblxyXG4gICQoJyNtZW51LXZvbHVtZScpWzBdLnZhbHVlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kVm9sdW1lJyk7XHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kVm9sdW1lJyxlLnRhcmdldC52YWx1ZSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtaGVhZGVyJylbMF0uY2hlY2tlZCA9IG5hdi5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBuYXYuZ2V0V2luZG93KCdtbmhlYWRlcicpLndpbi5zZXRUdXJuZWRPbihlLnRhcmdldC5jaGVja2VkKTtcclxuICB9XHJcbiAgY29uc3QgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIG1lbnUnKTtcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH07XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuXHJcbmNvbnN0IE5hdmJhciA9IGZ1bmN0aW9uIChjcEFwaSxuYXYpIHtcclxuICBjb25zdCBuYXZiYXIgPSAkKCcjbW5uYXZiYXInKTtcclxuICBjb25zdCB0b2Nwb3NpdGlvbiA9ICQoJyN0b2Nwb3NpdGlvbicpO1xyXG4gIGNvbnN0IHByb2dyZXNzID0gJCgnI2xlc3Nvbi1wcm9ncmVzcycpO1xyXG4gIGNvbnN0IHByb2dyZXNzTGFiZWwgPSAkKCcjbGVzc29uLXByb2dyZXNzLWxhYmVsIHN0cm9uZycpO1xyXG5cclxuICBmdW5jdGlvbiBfdXBkYXRlKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIG5hdmJhcicpO1xyXG4gICAgbGV0IHNjcmVlbkluZm8gPSBuYXYuZ2V0U2NyZWVuSW5mbygpO1xyXG4gICAgbGV0IGlzUXVpeiA9IG5hdi5pc1F1aXooKTtcclxuICAgIGxldCBpc0ludGVyYWN0aW9uID0gbmF2LmlzSW50ZXJhY3Rpb24oKTtcclxuICAgIGxldCB0b3RhbFNjcmVlbnMgPSBuYXYuZ2V0U2NyZWVucygpLmxlbmd0aDtcclxuXHJcbiAgICAkKCcjbmF2LW5leHQnKVswXS5kaXNhYmxlZCA9IGlzUXVpeiB8fCBpc0ludGVyYWN0aW9uIHx8IHNjcmVlbkluZm8ubmV4dCA9PT0gLTE7XHJcbiAgICAkKCcjbmF2LXByZXYnKVswXS5kaXNhYmxlZCA9IGlzUXVpeiB8fCBzY3JlZW5JbmZvLnByZXYgPT09IC0xO1xyXG4gICAgJCgnI25hdi10b2MnKVswXS5kaXNhYmxlZCA9IGlzUXVpejtcclxuICAgICQoJyNtZW51LXRvYycpWzBdLmRpc2FibGVkID0gaXNRdWl6O1xyXG5cclxuICAgIGlmKG5hdi5pc0NvbXBsZXRlZCgpICYmIHNjcmVlbkluZm8ubmV4dCAhPT0gLTEpIHtcclxuICAgICAgJCgnI25hdi1uZXh0ICsgbGFiZWwnKS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjbmF2LW5leHQgKyBsYWJlbCcpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2Nwb3NpdGlvbi5odG1sKChzY3JlZW5JbmZvLm5yKSArICcvJyArIHRvdGFsU2NyZWVucyk7XHJcbiAgICBpZihpc1F1aXopIHtcclxuICAgICAgcHJvZ3Jlc3MudmFsKDEwMCk7XHJcbiAgICAgIC8vcHJvZ3Jlc3NMYWJlbC5odG1sKCdTY2VuYSAxIHogMScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGN1cnJTY2VuZSA9IHNjcmVlbkluZm8uY3VyclNjZW5lICsgMTtcclxuICAgICAgaWYoc2NyZWVuSW5mby5jdXJyU2NlbmUgPiAtMSkge1xyXG4gICAgICAgIHByb2dyZXNzLnZhbCgoY3VyclNjZW5lIC8gc2NyZWVuSW5mby50b3RhbFNjZW5lcykgKiAxMDApO1xyXG4gICAgICAgIC8vcHJvZ3Jlc3NMYWJlbC5odG1sKCdTY2VuYSAnICsgY3VyclNjZW5lICsgJyB6ICcgKyBzY3JlZW5JbmZvLnRvdGFsU2NlbmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcm9ncmVzcy52YWwoMTAwKTtcclxuICAgICAgICAvL3Byb2dyZXNzTGFiZWwuaHRtbCgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAkKCcjbmF2LW5leHQnKS5jbGljaygoZSkgPT4gbmF2Lm5leHQoKSk7XHJcbiAgJCgnI25hdi1wcmV2JykuY2xpY2soKGUpID0+IG5hdi5wcmV2KCkpO1xyXG4gICQoJyNuYXYtdG9jJykuY2xpY2soKGUpID0+IG5hdi50b2dnbGVXaW5kb3coJ21udG9jJykpO1xyXG4gICQoJyNuYXYtbWVudScpLmNsaWNrKChlKSA9PiBuYXYudG9nZ2xlV2luZG93KCdtbm1lbnUnKSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB1cGRhdGU6IF91cGRhdGVcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmJhcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcclxuLy9jb25zdCBBZ2VudEp1Z2dsZXIgPSByZXF1aXJlKCcuL0FnZW50SnVnZ2xlcicpO1xyXG5cclxuY29uc3QgTmF2aWdhdGlvbiA9IGZ1bmN0aW9uKGNwQXBpLHdpbk1hbmFnZXIsZGF0YSkge1xyXG4gIC8vY29uc3QgYWcgPSBuZXcgQWdlbnRKdWdnbGVyKCk7XHJcbiAgbGV0IG9ic2VydmVycyA9IFtdO1xyXG4gIGxldCBldmVudEVtaXR0ZXJPYmogPSBjcEFwaS5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICBsZXQgbmF2RGF0YSA9IGRhdGE7XHJcblxyXG4gIGxldCBjcFNsaWRlTGFiZWw7XHJcbiAgbGV0IGNwU2xpZGVOdW1iZXI7XHJcbiAgbGV0IGNwU2xpZGVJZDtcclxuXHJcbiAgbGV0IHNjZW5lSW5kZXg7XHJcbiAgbGV0IHRvdGFsU2NyZWVucyA9IG5hdkRhdGEuc2NyZWVucy5sZW5ndGg7XHJcbiAgbGV0IHNjcmVlbkluZm87XHJcblxyXG5cclxuICBjb25zdCBfbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY3JlZW5JbmZvLm5leHQpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX3ByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NyZWVuSW5mby5wcmV2KTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9hZGRPYnNlcnZlciA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgb2JzZXJ2ZXJzLnB1c2gob2JqKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfZ2V0U2NyZWVucyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5hdkRhdGEuc2NyZWVucztcclxuICB9O1xyXG5cclxuICBjb25zdCBfaXNDb21wbGV0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBjcC5EW2NwU2xpZGVJZF0ubW5jXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2lzSW50ZXJhY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBjcFNsaWRlTGFiZWwgPT09ICdtbkludGVyYWN0aW9uJyAmJiAhX2lzQ29tcGxldGVkKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2lzUXVpeiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGNwU2xpZGVMYWJlbCA9PT0gJ21uUXVpeic7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2dldFNjcmVlbkluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBzY3JlZW5JbmZvO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uKHdpbk5hbWUpIHtcclxuICAgIHdpbk1hbmFnZXIudG9nZ2xlKHdpbk5hbWUpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9nZXRDb3Vyc2VOYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmF2RGF0YS5jb3Vyc2VOYW1lO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICByZXR1cm4gd2luTWFuYWdlci5nZXRXaW5kb3cod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX3Nob3dXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICByZXR1cm4gd2luTWFuYWdlci5zaG93KHdpbk5hbWUpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9oaWRlV2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbk1hbmFnZXIuaGlkZSh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfb25TbGlkZUVudGVyID0gZnVuY3Rpb24oZSl7XHJcbiAgICBjcFNsaWRlTGFiZWwgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcpO1xyXG4gICAgY3BTbGlkZU51bWJlciA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgY3BTbGlkZUlkID0gbmF2RGF0YS5zaWRzW2NwU2xpZGVOdW1iZXItMV07XHJcblxyXG4gICAgc2NlbmVJbmRleCA9IGNwU2xpZGVOdW1iZXIgLSAxO1xyXG4gICAgc2NyZWVuSW5mbyA9IFV0aWxzLmdldEN1cnJlbnRTY3JlZW5JbmZvKG5hdkRhdGEsc2NlbmVJbmRleCk7XHJcbiAgICBfdXBkYXRlKCk7XHJcblxyXG4gICAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25IaWdobGlnaHQsJ2hpZ2hsaWdodCcpO1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25GcmFtZUNoYW5nZSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcblxyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywwKTtcclxuICAgIGNwQXBpLnBsYXkoKTtcclxuICAgIC8vYWcuc3RhcnQoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfb25TbGlkZUV4aXQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBldmVudEVtaXR0ZXJPYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLF9vbkhpZ2hsaWdodCwnaGlnaGxpZ2h0Jyk7XHJcbiAgICBldmVudEVtaXR0ZXJPYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLF9vbkZyYW1lQ2hhbmdlLCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuICAgIC8vYWcuY2xlYXIoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfb25IaWdobGlnaHQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZihlLkRhdGEubmV3VmFsID09PSAxKSBjcC5EW2NwU2xpZGVJZF0ubW5jID0gdHJ1ZTtcclxuICAgIF91cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfb25GcmFtZUNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBpc0Jsb2NrZWQgPSBfaXNRdWl6KCkgfHwgX2lzSW50ZXJhY3Rpb24oKTtcclxuICAgIGxldCBlbmRGcmFtZSA9IGNwLkRbY3BTbGlkZUlkXS50by0xO1xyXG4gICAgbGV0IGN1cnJGcmFtZSA9IGUuRGF0YS5uZXdWYWw7XHJcbiAgICBjb25zb2xlLmxvZygnZnJvbScsY3AuRFtjcFNsaWRlSWRdLmZyb20sXCJ0b1wiLGNwLkRbY3BTbGlkZUlkXS50byk7XHJcbiAgICBpZihjdXJyRnJhbWUgPj0gZW5kRnJhbWUpIHtcclxuICAgICAgZXZlbnRFbWl0dGVyT2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25GcmFtZUNoYW5nZSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcbiAgICAgIGlmKCFfaXNRdWl6KCkpIGNwQXBpLnBhdXNlKCk7XHJcbiAgICAgIF91cGRhdGUoKTtcclxuICAgICAgLy9hZy5zdG9wKCk7XHJcbiAgICAgIGlmKCFpc0Jsb2NrZWQpIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2hpZ2hsaWdodCcsMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvL2FnLmp1Z2dsZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIG9ic2VydmVycy5tYXAobyA9PiBvLnVwZGF0ZSgpKTtcclxuICB9O1xyXG5cclxuICAvLyBEbyBkYW55Y2ggc2xhamR1LCBkb2RhamVteSBwYXJhbWV0ciBcIm1uY1wiIG9rcmXFm2xhasSFY3ksXHJcbiAgLy8gY3p5IGVrcmFuIHpvc3RhxYIgemFsaWN6b255IChza3LDs3Qgb2QgbW5jb21wbGV0ZSkuXHJcbiAgLy8gRG9tecWbbG5pZSBuYWRhamVteSBtdSB0xIUgc2FtxIUgd2FydG/Fm2MgY28gcGFyYW1ldHIgXCJ2XCIgKHZpc2l0ZWQpXHJcbiAgLy8geiBrb2xlam5lZ28gc2xhamR1LlxyXG4gIC8vIFBhcmFtZXRyIFwibW5jXCIgYsSZZHppZSBww7PFum5pZWogd3lrb3J6eXN0eXdhbnkgZG8gc3R3aWVyZHplbmlhLFxyXG4gIC8vIGN6eSBwcnplasWbY2llIGRvIG5hc3TEmXBuZWdvIGVrcmFudSBuYWxlxbx5IHphYmxva293YWMuXHJcbiAgbmF2RGF0YS5zaWRzID0gY3AuRC5wcm9qZWN0X21haW4uc2xpZGVzLnNwbGl0KCcsJyk7XHJcbiAgbmF2RGF0YS5zaWRzLm1hcCgoc2lkLGluZGV4LGFycikgPT4ge1xyXG4gICAgbGV0IGlzTmV4dFNsaWRlID0gaW5kZXggKyAxIDwgYXJyLmxlbmd0aDtcclxuICAgIGNwLkRbc2lkXS5tbmMgPSBpc05leHRTbGlkZSA/IGNwLkRbYXJyW2luZGV4KzFdXS52IDogZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxfb25TbGlkZUVudGVyKTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFWElUJyxfb25TbGlkZUV4aXQpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmV4dDogX25leHQsXHJcbiAgICBwcmV2OiBfcHJldixcclxuICAgIGlzQ29tcGxldGVkOiBfaXNDb21wbGV0ZWQsXHJcbiAgICBpc0ludGVyYWN0aW9uOiBfaXNJbnRlcmFjdGlvbixcclxuICAgIGlzUXVpejogX2lzUXVpeixcclxuICAgIGdldFNjcmVlbkluZm86IF9nZXRTY3JlZW5JbmZvLFxyXG4gICAgZ2V0Q291cnNlTmFtZTogX2dldENvdXJzZU5hbWUsXHJcbiAgICBhZGRPYnNlcnZlcjogX2FkZE9ic2VydmVyLFxyXG4gICAgdG9nZ2xlV2luZG93OiBfdG9nZ2xlV2luZG93LFxyXG4gICAgZ2V0V2luZG93OiBfZ2V0V2luZG93LFxyXG4gICAgc2hvd1dpbmRvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlV2luZG93OiBfaGlkZVdpbmRvdyxcclxuICAgIGdldFNjcmVlbnM6IF9nZXRTY3JlZW5zXHJcbiAgfTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uO1xyXG5cclxuXHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxmdW5jdGlvbihlKSB7XHJcbi8vICBjb25zb2xlLmxvZygnY3BRdWl6SW5mb0Fuc3dlckNob2ljZScsZS5EYXRhKTtcclxuLy99LCdjcFF1aXpJbmZvQW5zd2VyQ2hvaWNlJyk7XHJcblxyXG5cclxuLy9ldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVQQVVTRScsIGZ1bmN0aW9uKGUpIHtcclxuICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVBBVVNFJyk7XHJcbiAgLy8kKCcjbmF2LW5leHQnKS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbi8vfSk7XHJcblxyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVNUT1AnLCBmdW5jdGlvbihlKSB7XHJcbiAgLy9jb25zb2xlLmxvZygnQ1BBUElfTU9WSUVTVE9QJyk7XHJcbi8vfSk7XHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX0lOVEVSQUNUSVZFSVRFTVNVQk1JVCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgLy9jb25zb2xlLmxvZygnQ1BBUElfSU5URVJBQ1RJVkVJVEVNU1VCTUlUJyxlLkRhdGEpO1xyXG4vL30pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5jb25zdCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgY29uc3QgX21udG9jID0gJCgnI21udG9jJyk7XHJcbiAgY29uc3QgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW50b2MnKTtcclxuXHJcbiAgbGV0IG91dHB1dCA9IFtdO1xyXG4gIGxldCBzY3JlZW5zID0gbmF2LmdldFNjcmVlbnMoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIG91dHB1dC5wdXNoKFwiPGRpdj48aW5wdXQgdHlwZT0nYnV0dG9uJyBuYW1lPSd0b2MtaXRlbScgaWQ9J3RvYy1pdGVtLVwiK2krXCInPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8bGFiZWwgZm9yPSd0b2MtaXRlbS1cIitpK1wiJz5cIitcclxuICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2ZhIGZhLW1hcC1tYXJrZXIgZmEtbGcnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxzcGFuPlwiK3NjcmVlbnNbaV0ubnIrXCIuPC9zcGFuPiZuYnNwOyZuYnNwO1wiK1xyXG4gICAgICAgICAgICAgICAgc2NyZWVuc1tpXS5sYWJlbCtcIjwvbGFiZWw+PC9kaXY+XCIpO1xyXG4gIH1cclxuICAkKCcjbW50b2MgLnNsaWRlcy1ncm91cCcpLmh0bWwob3V0cHV0LmpvaW4oJycpKTtcclxuICAkKCcuc2xpZGVzLWdyb3VwIGRpdicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vY29uc29sZS5sb2coJCh0aGlzKS5pbmRleCgpKTtcclxuICAgIGxldCBzY3JlZW5JbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgIGxldCBzY2VuZUluZGV4ID0gc2NyZWVuc1tzY3JlZW5JbmRleF0uc2NlbmVzWzBdO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY2VuZUluZGV4KTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9GcmFtZUFuZFJlc3VtZScsMCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBfdXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGUgdG9jJyk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3LFxyXG4gICAgdXBkYXRlOiBfdXBkYXRlXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFiZWxPZkNvbnRlbnRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgX2lkID0gaWQ7XHJcbiAgbGV0IF9lbGVtZW50ID0gJCgnIycrX2lkKSxcclxuICBfdmlzaWJsZSA9IGZhbHNlLFxyXG4gIF90dXJuZWRvbiA9IHRydWUsXHJcblxyXG4gIF9nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9pZDtcclxuICB9LFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3Zpc2libGU7XHJcbiAgfSxcclxuXHJcbiAgX2lzVHVybmVkT24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdHVybmVkb247XHJcbiAgfSxcclxuXHJcbiAgX3Nob3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gdHJ1ZTtcclxuICAgIF9lbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVVcCgyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9zZXRUdXJuZWRPbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA/IF9zaG93KCkgOiBfaGlkZSgpO1xyXG4gICAgX3R1cm5lZG9uID0gdmFsdWU7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGUoKSA6IF9zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBpc1R1cm5lZE9uOiBfaXNUdXJuZWRPbixcclxuICAgIHNob3c6IF9zaG93LFxyXG4gICAgaGlkZTogX2hpZGUsXHJcbiAgICBzZXRUdXJuZWRPbjogX3NldFR1cm5lZE9uLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgX2ZpbmRTY3JlZW5JbmRleCA9IGZ1bmN0aW9uKGFycixzY2VuZUluZGV4KSB7XHJcbiAgbGV0IHNjcmVlbnNMZW4gPSBhcnIubGVuZ3RoO1xyXG4gIGxldCBvdXRwdXQ7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JlZW5zTGVuOyBpKyspIHtcclxuICAgIG91dHB1dCA9IGFycltpXS5zY2VuZXMgIT09IHVuZGVmaW5lZCA/IGFycltpXS5zY2VuZXMuZmlsdGVyKHNjZW5lID0+IHtcclxuICAgICAgICByZXR1cm4gc2NlbmUgPT09IHNjZW5lSW5kZXg7XHJcbiAgICB9KSA6IFtdO1xyXG4gICAgaWYob3V0cHV0Lmxlbmd0aCA+IDApIHJldHVybiBpO1xyXG4gIH1cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5jb25zdCBfZ2V0U2NyZWVuc0FycmF5ID0gZnVuY3Rpb24obmF2LGN1cnJTY2VuZSkge1xyXG4gIGxldCBpc0hpZGRlbiA9IF9pc1NjZW5lSGlkZGVuKG5hdi5oaWRkZW4sY3VyclNjZW5lKTtcclxuICByZXR1cm4gaXNIaWRkZW4gPyBuYXYuaGlkZGVuIDogbmF2LnNjcmVlbnM7XHJcbn07XHJcblxyXG5jb25zdCBfaXNTY2VuZUhpZGRlbiA9IGZ1bmN0aW9uKGFycixzY2VuZUluZGV4KSB7XHJcbiAgcmV0dXJuIGFyci5maWx0ZXIoc2NyID0+IHtcclxuICAgIHJldHVybiBzY3Iuc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgIHJldHVybiBzY2VuZSA9PT0gc2NlbmVJbmRleDtcclxuICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgfSkubGVuZ3RoID4gMDtcclxufTtcclxuXHJcbmNvbnN0IF9nZXRQcmV2U2NlbmVJbmRleCA9IGZ1bmN0aW9uKGFycixjdXJyU2NlbmUpIHtcclxuICBsZXQgc2NyZWVuSW5kZXggPSBfZmluZFNjcmVlbkluZGV4KGFycixjdXJyU2NlbmUpO1xyXG4gIGxldCBzY3JlZW4sIHNjZW5lcywgc2NlbmVJbmRleDtcclxuXHJcbiAgaWYoc2NyZWVuSW5kZXggPj0gMCkge1xyXG4gICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4XTtcclxuICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICBzY2VuZUluZGV4ID0gc2NlbmVzLmluZGV4T2YoY3VyclNjZW5lKTtcclxuICAgIGlmKHNjZW5lSW5kZXggPiAwKXtcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZUluZGV4IC0gMV07XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuLnByZXYgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHJldHVybiBzY3JlZW4ucHJldjtcclxuICAgIH0gZWxzZSBpZihzY3JlZW5JbmRleCA+IDApe1xyXG4gICAgICBzY3JlZW4gPSBhcnJbc2NyZWVuSW5kZXggLSAxXTtcclxuICAgICAgc2NlbmVzID0gc2NyZWVuLnNjZW5lcztcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZXMubGVuZ3RoLTFdO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5jb25zdCBfZ2V0TmV4dFNjZW5lSW5kZXggPSBmdW5jdGlvbihhcnIsY3VyclNjZW5lKSB7XHJcbiAgbGV0IHNjcmVlbkluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChhcnIsY3VyclNjZW5lKTtcclxuICBsZXQgc2NyZWVuLCBzY2VuZXMsIHNjZW5lSW5kZXg7XHJcblxyXG4gIGlmKHNjcmVlbkluZGV4ID49IDApIHtcclxuICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleF07XHJcbiAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgc2NlbmVJbmRleCA9IHNjZW5lcy5pbmRleE9mKGN1cnJTY2VuZSk7XHJcbiAgICBpZihzY2VuZUluZGV4IDwgc2NlbmVzLmxlbmd0aCAtIDEpe1xyXG4gICAgICByZXR1cm4gc2NlbmVzW3NjZW5lSW5kZXggKyAxXTtcclxuICAgIH0gZWxzZSBpZihzY3JlZW4ubmV4dCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgcmV0dXJuIHNjcmVlbi5uZXh0O1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbkluZGV4IDwgYXJyLmxlbmd0aCAtIDEpe1xyXG4gICAgICBzY3JlZW4gPSBhcnJbc2NyZWVuSW5kZXggKyAxXTtcclxuICAgICAgc2NlbmVzID0gc2NyZWVuLnNjZW5lcztcclxuICAgICAgcmV0dXJuIHNjZW5lc1swXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0Q3VycmVudFNjcmVlbkluZm8gPSBmdW5jdGlvbihuYXYsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zID0gX2dldFNjcmVlbnNBcnJheShuYXYsc2NlbmVJbmRleCk7XHJcbiAgbGV0IGluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChzY3JlZW5zLHNjZW5lSW5kZXgpO1xyXG4gIGxldCBzY3JlZW4gPSBpbmRleCA+PSAwID8gc2NyZWVuc1tpbmRleF0gOiBudWxsO1xyXG4gIC8vY29uc29sZS5sb2coJ2dldEN1cnJlbnRTY3JlZW5JbmZvJyxpbmRleCxzY3JlZW4sc2NlbmVJbmRleCk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGluZGV4OiBpbmRleCxcclxuICAgIG5yOiBzY3JlZW4ubnIsXHJcbiAgICBsYWJlbDogc2NyZWVuLmxhYmVsLFxyXG4gICAgY3VyclNjZW5lOiBzY3JlZW4uc2NlbmVzLmluZGV4T2Yoc2NlbmVJbmRleCksXHJcbiAgICB0b3RhbFNjZW5lczogc2NyZWVuLnNjZW5lcy5sZW5ndGgsXHJcbiAgICBwcmV2OiBfZ2V0UHJldlNjZW5lSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KSxcclxuICAgIG5leHQ6IF9nZXROZXh0U2NlbmVJbmRleChzY3JlZW5zLHNjZW5lSW5kZXgpXHJcbiAgfTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRDdXJyZW50U2NyZWVuSW5mb307XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBjb25zdCBfdG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICB3Lndpbi50b2dnbGUoKTtcclxuICAgICAgICBfY3VycmVudCA9IHcud2luLmlzVmlzaWJsZSgpID8gd2lkIDogbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX3Nob3dXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBpZihfY3VycmVudCAhPT0gbnVsbCAmJiBfY3VycmVudCAhPT0gd2lkKSBfaGlkZVdpbmRvdyhfY3VycmVudCk7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCkge1xyXG4gICAgICAgIF9jdXJyZW50ID0gd2lkO1xyXG4gICAgICAgIHcud2luLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9hZGRXaW5kb3cgPSBmdW5jdGlvbih3aW5PYmopIHtcclxuICAgIF93aW5kb3dzLnB1c2god2luT2JqKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfZ2V0V2luZG93ID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgbGV0IF93aW4gPSBfd2luZG93cy5maWx0ZXIodyA9PiB7XHJcbiAgICAgIHJldHVybiB3Lndpbi5nZXRJZCgpID09PSBuYW1lO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gX3dpbi5sZW5ndGggPiAwID8gX3dpblswXSA6IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRvZ2dsZTogX3RvZ2dsZVdpbmRvdyxcclxuICAgIHNob3c6IF9zaG93V2luZG93LFxyXG4gICAgaGlkZTogX2hpZGVXaW5kb3csXHJcbiAgICBhZGRXaW5kb3c6IF9hZGRXaW5kb3csXHJcbiAgICBnZXRXaW5kb3c6IF9nZXRXaW5kb3dcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93TWFuYWdlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgV2luZG93TWFuYWdlciA9IHJlcXVpcmUoJy4vV2luZG93TWFuYWdlcicpO1xyXG5jb25zdCBIZWFkZXIgPSByZXF1aXJlKCcuL0hlYWRlcicpO1xyXG5jb25zdCBOYXZiYXIgPSByZXF1aXJlKCcuL05hdmJhcicpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9NZW51Jyk7XHJcbmNvbnN0IFRhYmxlT2ZDb250ZW50cyA9IHJlcXVpcmUoJy4vVGFibGVPZkNvbnRlbnRzJyk7XHJcbmNvbnN0IE5hdmlnYXRpb24gPSByZXF1aXJlKCcuL05hdmlnYXRpb24nKTtcclxuY29uc3QgSW50ZXJhY3Rpb25VdGlscyA9IHJlcXVpcmUoJy4vSW50ZXJhY3Rpb25VdGlscycpO1xyXG5cclxuZ2xvYmFsLm1uID0gKGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNwSW50ZXJmYWNlO1xyXG4gIC8vbGV0IG15T3ZlcmxheTtcclxuICBsZXQgd2luTWFuYWdlciA9IG5ldyBXaW5kb3dNYW5hZ2VyKCk7XHJcbiAgbGV0IG15SGVhZGVyO1xyXG4gIGxldCBteVRvYztcclxuICBsZXQgbXlNZW51O1xyXG4gIGxldCBteU5hdmJhcjtcclxuICBsZXQgbXlOYXZpZ2F0aW9uO1xyXG4gIGxldCBpbnRlcmFjdGlvblV0aWxzID0gbmV3IEludGVyYWN0aW9uVXRpbHMoKTtcclxuXHJcbiAgLypmdW5jdGlvbiBvblJlc2l6ZShlKSB7XHJcbiAgICBsZXQgdmlld3BvcnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgbGV0IHZpZXdwb3J0SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgbGV0IGxlZnQgPSAwO1xyXG4gICAgbGV0IHNjYWxlID0gMTtcclxuXHJcbiAgICBpZih2aWV3cG9ydFdpZHRoIDw9IDEyODApIHtcclxuICAgICAgbGV0IHdzY2FsZSA9IHZpZXdwb3J0V2lkdGggLyA4MDA7XHJcbiAgICAgIGxldCBoc2NhbGUgPSB2aWV3cG9ydEhlaWdodCAvIDYwMDtcclxuICAgICAgc2NhbGUgPSBNYXRoLm1pbih3c2NhbGUsaHNjYWxlKTtcclxuICAgICAgbGVmdCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZWZ0ID0gKHZpZXdwb3J0V2lkdGggLSAoODAwICogc2NhbGUpKSAqIC41O1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2codmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIHNjYWxlLCBsZWZ0KTtcclxuICAgICQoJyNtYWluX2NvbnRhaW5lcicpLmF0dHIoJ3N0eWxlJyxgXHJcbiAgICAgIHRvcDogMHB4O1xyXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgIGxlZnQ6ICR7bGVmdH1weDtcclxuICAgICAgd2lkdGg6IDgwMHB4O1xyXG4gICAgICBoZWlnaHQ6IDYwMHB4O1xyXG4gICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0IHRvcCAwcHg7XHJcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoJHtzY2FsZX0pO1xyXG4gICAgYCk7XHJcbiAgfSovXHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuICAgIC8vd2luZG93LmNwLlNldFNjYWxlQW5kUG9zaXRpb24gPSBmdW5jdGlvbigpe3JldHVybiBmYWxzZTt9O1xyXG4gICAgJC5nZXRKU09OKFwibmF2aWdhdGlvbi5qc29uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBteU5hdmlnYXRpb24gPSBuZXcgTmF2aWdhdGlvbihjcEludGVyZmFjZSx3aW5NYW5hZ2VyLGRhdGEpO1xyXG5cclxuICAgICAgICBteUhlYWRlciA9IG5ldyBIZWFkZXIoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteUhlYWRlcik7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15SGVhZGVyKTtcclxuICAgICAgICBteVRvYyA9IG5ldyBUYWJsZU9mQ29udGVudHMoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteVRvYyk7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15VG9jKTtcclxuICAgICAgICBteU1lbnUgPSBuZXcgTWVudShjcEludGVyZmFjZSxteU5hdmlnYXRpb24pO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15TmF2YmFyKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvL29uUmVzaXplKCk7XHJcbiAgLy8kKCB3aW5kb3cgKS5yZXNpemUob25SZXNpemUpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW50OmludGVyYWN0aW9uVXRpbHNcclxuICB9XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1uO1xyXG4iXX0=
