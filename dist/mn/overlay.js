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
    output.push('<div>\n                    <input type=\'button\' name=\'toc-item\' id=\'toc-item-' + i + '\'>\n                    <label for=\'toc-item-' + i + '\'>\n                      <i class=\'fa fa-map-marker fa-lg\' aria-hidden=\'true\'></i>\n                      <strong>' + screens[i].nr + '.</strong>\n                      <span>&nbsp;&nbsp;' + screens[i].label + '</span>\n                    </label>\n                  </div>\n              ');
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
  var winManager = new WindowManager();
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  var myNavigation = void 0;
  var interactionUtils = new InteractionUtils();

  function onResize(e) {
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    var left = 0;
    var scale = 1;
    var wscale = scale;
    var hscale = scale;
    var maxWidth = 960;
    //viewportWidth = viewportWidth < 960 ? viewportWidth : 960;
    wscale = (viewportWidth < maxWidth ? viewportWidth : maxWidth) / 800;
    hscale = viewportHeight / 600;
    scale = Math.min(wscale, hscale);
    left = (viewportWidth - 800 * scale) * .5;

    //console.log(viewportWidth, viewportHeight, scale, left);
    //console.log('style',document.getElementById('main_container').style.cssText);
    cp.movie.m_scaleFactor = scale;
    $('#main_container').attr('style', '\n      top: 0px;\n      position: fixed;\n      left: ' + left + 'px;\n      width: 800px;\n      height: 600px;\n      transform-origin: left top 0px;\n      transform: scale(' + scale + ');\n    ');
  }

  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;
    window.cp.SetScaleAndPosition = function () {
      return true;
    };
    onResize();
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

  $(window).resize(onResize);

  return {
    int: interactionUtils
  };
}();

module.exports = mn;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Header":1,"./InteractionUtils":2,"./Menu":3,"./Navbar":4,"./Navigation":5,"./TableOfContents":6,"./WindowManager":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxJbnRlcmFjdGlvblV0aWxzLmpzIiwic3JjXFxqc1xcTWVudS5qcyIsInNyY1xcanNcXE5hdmJhci5qcyIsInNyY1xcanNcXE5hdmlnYXRpb24uanMiLCJzcmNcXGpzXFxUYWJsZU9mQ29udGVudHMuanMiLCJzcmNcXGpzXFxUb2dnbGVXaW5kb3cuanMiLCJzcmNcXGpzXFxVdGlscy5qcyIsInNyY1xcanNcXFdpbmRvd01hbmFnZXIuanMiLCJzcmNcXGpzXFxzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZ0JBQVIsQ0FBckI7QUFDQSxJQUFNLFFBQVEsUUFBUSxTQUFSLENBQWQ7O0FBR0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFVLEtBQVYsRUFBZ0IsR0FBaEIsRUFBb0I7QUFDakMsTUFBTSxNQUFNLElBQUksWUFBSixDQUFpQixVQUFqQixDQUFaO0FBQ0EsTUFBTSxhQUFhLEVBQUUsYUFBRixDQUFuQjtBQUNBLE1BQU0sY0FBYyxFQUFFLGNBQUYsQ0FBcEI7QUFDQSxNQUFNLFlBQVksRUFBRSxZQUFGLENBQWxCO0FBQ0EsTUFBTSxTQUFTLEVBQUUsV0FBRixDQUFmO0FBQ0EsTUFBSSxrQkFBSjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBTSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzlCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxhQUFhLFNBQWIsVUFBYSxHQUFZO0FBQzdCO0FBQ0EsUUFBSSxJQUFKO0FBQ0QsR0FIRDs7QUFLQSxNQUFNLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDN0I7QUFDQSxRQUFJLElBQUo7QUFDRCxHQUhEOztBQUtBLE1BQU0sUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN4QjtBQUNB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QUF2QixDQUFYO0FBQ0EsbUJBQWEsV0FBYixDQUF5QixRQUF6QjtBQUNILEtBZEQ7QUFlRCxHQXBCRDs7QUFzQkEsSUFBRyxNQUFILEVBQVksTUFBWixDQUFtQixRQUFuQjs7QUFFQSxTQUFPO0FBQ0wsU0FBSTtBQURDLEdBQVA7QUFHRCxDQWpFVyxFQUFaOztBQW1FQSxPQUFPLE9BQVAsR0FBaUIsRUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcclxuXHJcblxyXG5jb25zdCBIZWFkZXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2KXtcclxuICBjb25zdCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbmhlYWRlcicpO1xyXG4gIGNvbnN0IGNvdXJzZU5hbWUgPSAkKCcjY291cnNlTmFtZScpO1xyXG4gIGNvbnN0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgY29uc3Qgc2xpZGVOYW1lID0gJCgnI3NsaWRlTmFtZScpO1xyXG4gIGNvbnN0IGhlYWRlciA9ICQoJyNtbmhlYWRlcicpO1xyXG4gIGxldCB0aW1lb3V0SWQ7XHJcbiAgbGV0IGN1cnJTY3JlZW47XHJcblxyXG4gIGNvbnN0IGNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2hvd0hlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNsZWFyVGltZW91dCgpO1xyXG4gICAgX3R3LnNob3coKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBibGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHNob3dIZWFkZXIoKTtcclxuICAgIHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGhpZGVIZWFkZXIsMjAwMCk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc3QgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHNjcmVlbkluZm8gPSBuYXYuZ2V0U2NyZWVuSW5mbygpO1xyXG4gICAgaWYoY3VyclNjcmVlbiAhPT0gc2NyZWVuSW5mby5pbmRleCkge1xyXG4gICAgICBjdXJyU2NyZWVuID0gc2NyZWVuSW5mby5pbmRleDtcclxuICAgICAgY291cnNlTmFtZS5odG1sKG5hdi5nZXRDb3Vyc2VOYW1lKCkpO1xyXG4gICAgICBzbGlkZU51bWJlci5odG1sKHNjcmVlbkluZm8ubnIrJy4nKTtcclxuICAgICAgc2xpZGVOYW1lLmh0bWwoc2NyZWVuSW5mby5sYWJlbCk7XHJcbiAgICAgIC8vYmxpbmsoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHcsXHJcbiAgICB1cGRhdGU6IF91cGRhdGVcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBJbnRlcmFjdGlvblV0aWxzID0gZnVuY3Rpb24oY3BBcGkpIHtcclxuXHJcbiAgbGV0IF92YXJzID0gW10sX2NvcnIgPSBbXTtcclxuXHJcbiAgY29uc3QgX3NldFZhcmlhYmxlcyA9IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICBfdmFycyA9IGFycmF5O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgX3NldENvcnJlY3QgPSBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgX2NvcnIgPSBhcnJheTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfaXNWYXJFcXVhbCA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICByZXR1cm4gY3BBUElJbnRlcmZhY2UuZ2V0VmFyaWFibGVWYWx1ZShfdmFyc1tpbmRleF0pID09IF9jb3JyW2luZGV4XTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfYXJlVmFyc0VxdWFsID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZXF1YWxWYXJzID0gX3ZhcnMuZmlsdGVyKCh2LGkpID0+IHtcclxuICAgICAgcmV0dXJuIF9pc1ZhckVxdWFsKGkpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZXF1YWxWYXJzLmxlbmd0aCA9PT0gX3ZhcnMubGVuZ3RoO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAge1xyXG4gICAgc2V0VmFyaWFibGVzOiBfc2V0VmFyaWFibGVzLFxyXG4gICAgc2V0Q29ycmVjdDogX3NldENvcnJlY3QsXHJcbiAgICBpc1ZhckVxdWFsOiBfaXNWYXJFcXVhbCxcclxuICAgIGFyZVZhcnNFcXVhbDogX2FyZVZhcnNFcXVhbFxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZXJhY3Rpb25VdGlscztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxuY29uc3QgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSxuYXYpIHtcclxuICBjb25zdCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbm1lbnUnKTtcclxuXHJcbiAgJCgnI21lbnUtdG9jJykuY2xpY2soZSA9PiBuYXYuc2hvd1dpbmRvdygnbW50b2MnKSk7XHJcbiAgJCgnI21lbnUtZXhpdCcpLmNsaWNrKGUgPT4gY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSkpO1xyXG4gICQoJyNtZW51LXByaW50JykuY2xpY2soZSA9PiB3aW5kb3cucHJpbnQoKSk7XHJcblxyXG4gICQoJyNtZW51LXNvdW5kJylbMF0uY2hlY2tlZCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnKSA9PT0gMDtcclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnLGUudGFyZ2V0LmNoZWNrZWQgPyAwIDogMSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gbmF2LmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uaXNUdXJuZWRPbigpO1xyXG4gICQoJyNtZW51LWhlYWRlcicpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIG5hdi5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLnNldFR1cm5lZE9uKGUudGFyZ2V0LmNoZWNrZWQpO1xyXG4gIH1cclxuICBjb25zdCBfdXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGUgbWVudScpO1xyXG4gIH07XHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3LFxyXG4gICAgdXBkYXRlOiBfdXBkYXRlXHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5cclxuY29uc3QgTmF2YmFyID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGNvbnN0IG5hdmJhciA9ICQoJyNtbm5hdmJhcicpO1xyXG4gIGNvbnN0IHRvY3Bvc2l0aW9uID0gJCgnI3RvY3Bvc2l0aW9uJyk7XHJcbiAgY29uc3QgcHJvZ3Jlc3MgPSAkKCcjbGVzc29uLXByb2dyZXNzJyk7XHJcbiAgY29uc3QgcHJvZ3Jlc3NMYWJlbCA9ICQoJyNsZXNzb24tcHJvZ3Jlc3MtbGFiZWwgc3Ryb25nJyk7XHJcblxyXG4gIGZ1bmN0aW9uIF91cGRhdGUoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGUgbmF2YmFyJyk7XHJcbiAgICBsZXQgc2NyZWVuSW5mbyA9IG5hdi5nZXRTY3JlZW5JbmZvKCk7XHJcbiAgICBsZXQgaXNRdWl6ID0gbmF2LmlzUXVpeigpO1xyXG4gICAgbGV0IGlzSW50ZXJhY3Rpb24gPSBuYXYuaXNJbnRlcmFjdGlvbigpO1xyXG4gICAgbGV0IHRvdGFsU2NyZWVucyA9IG5hdi5nZXRTY3JlZW5zKCkubGVuZ3RoO1xyXG5cclxuICAgICQoJyNuYXYtbmV4dCcpWzBdLmRpc2FibGVkID0gaXNRdWl6IHx8IGlzSW50ZXJhY3Rpb24gfHwgc2NyZWVuSW5mby5uZXh0ID09PSAtMTtcclxuICAgICQoJyNuYXYtcHJldicpWzBdLmRpc2FibGVkID0gaXNRdWl6IHx8IHNjcmVlbkluZm8ucHJldiA9PT0gLTE7XHJcbiAgICAkKCcjbmF2LXRvYycpWzBdLmRpc2FibGVkID0gaXNRdWl6O1xyXG4gICAgJCgnI21lbnUtdG9jJylbMF0uZGlzYWJsZWQgPSBpc1F1aXo7XHJcblxyXG4gICAgaWYobmF2LmlzQ29tcGxldGVkKCkgJiYgc2NyZWVuSW5mby5uZXh0ICE9PSAtMSkge1xyXG4gICAgICAkKCcjbmF2LW5leHQgKyBsYWJlbCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNuYXYtbmV4dCArIGxhYmVsJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvY3Bvc2l0aW9uLmh0bWwoKHNjcmVlbkluZm8ubnIpICsgJy8nICsgdG90YWxTY3JlZW5zKTtcclxuICAgIGlmKGlzUXVpeikge1xyXG4gICAgICBwcm9ncmVzcy52YWwoMTAwKTtcclxuICAgICAgLy9wcm9ncmVzc0xhYmVsLmh0bWwoJ1NjZW5hIDEgeiAxJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgY3VyclNjZW5lID0gc2NyZWVuSW5mby5jdXJyU2NlbmUgKyAxO1xyXG4gICAgICBpZihzY3JlZW5JbmZvLmN1cnJTY2VuZSA+IC0xKSB7XHJcbiAgICAgICAgcHJvZ3Jlc3MudmFsKChjdXJyU2NlbmUgLyBzY3JlZW5JbmZvLnRvdGFsU2NlbmVzKSAqIDEwMCk7XHJcbiAgICAgICAgLy9wcm9ncmVzc0xhYmVsLmh0bWwoJ1NjZW5hICcgKyBjdXJyU2NlbmUgKyAnIHogJyArIHNjcmVlbkluZm8udG90YWxTY2VuZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByb2dyZXNzLnZhbCgxMDApO1xyXG4gICAgICAgIC8vcHJvZ3Jlc3NMYWJlbC5odG1sKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gICQoJyNuYXYtbmV4dCcpLmNsaWNrKChlKSA9PiBuYXYubmV4dCgpKTtcclxuICAkKCcjbmF2LXByZXYnKS5jbGljaygoZSkgPT4gbmF2LnByZXYoKSk7XHJcbiAgJCgnI25hdi10b2MnKS5jbGljaygoZSkgPT4gbmF2LnRvZ2dsZVdpbmRvdygnbW50b2MnKSk7XHJcbiAgJCgnI25hdi1tZW51JykuY2xpY2soKGUpID0+IG5hdi50b2dnbGVXaW5kb3coJ21ubWVudScpKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xyXG4vL2NvbnN0IEFnZW50SnVnZ2xlciA9IHJlcXVpcmUoJy4vQWdlbnRKdWdnbGVyJyk7XHJcblxyXG5jb25zdCBOYXZpZ2F0aW9uID0gZnVuY3Rpb24oY3BBcGksd2luTWFuYWdlcixkYXRhKSB7XHJcbiAgLy9jb25zdCBhZyA9IG5ldyBBZ2VudEp1Z2dsZXIoKTtcclxuICBsZXQgb2JzZXJ2ZXJzID0gW107XHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGNwQXBpLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGxldCBuYXZEYXRhID0gZGF0YTtcclxuXHJcbiAgbGV0IGNwU2xpZGVMYWJlbDtcclxuICBsZXQgY3BTbGlkZU51bWJlcjtcclxuICBsZXQgY3BTbGlkZUlkO1xyXG5cclxuICBsZXQgc2NlbmVJbmRleDtcclxuICBsZXQgdG90YWxTY3JlZW5zID0gbmF2RGF0YS5zY3JlZW5zLmxlbmd0aDtcclxuICBsZXQgc2NyZWVuSW5mbztcclxuXHJcblxyXG4gIGNvbnN0IF9uZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjcmVlbkluZm8ubmV4dCk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfcHJldiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY3JlZW5JbmZvLnByZXYpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2FkZE9ic2VydmVyID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBvYnNlcnZlcnMucHVzaChvYmopO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9nZXRTY3JlZW5zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmF2RGF0YS5zY3JlZW5zO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9pc0NvbXBsZXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGNwLkRbY3BTbGlkZUlkXS5tbmNcclxuICB9O1xyXG5cclxuICBjb25zdCBfaXNJbnRlcmFjdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGNwU2xpZGVMYWJlbCA9PT0gJ21uSW50ZXJhY3Rpb24nICYmICFfaXNDb21wbGV0ZWQoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfaXNRdWl6ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gY3BTbGlkZUxhYmVsID09PSAnbW5RdWl6JztcclxuICB9O1xyXG5cclxuICBjb25zdCBfZ2V0U2NyZWVuSW5mbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHNjcmVlbkluZm87XHJcbiAgfVxyXG5cclxuICBjb25zdCBfdG9nZ2xlV2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgd2luTWFuYWdlci50b2dnbGUod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2dldENvdXJzZU5hbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuYXZEYXRhLmNvdXJzZU5hbWU7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2dldFdpbmRvdyA9IGZ1bmN0aW9uKHdpbk5hbWUpIHtcclxuICAgIHJldHVybiB3aW5NYW5hZ2VyLmdldFdpbmRvdyh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uKHdpbk5hbWUpIHtcclxuICAgIHJldHVybiB3aW5NYW5hZ2VyLnNob3cod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICByZXR1cm4gd2luTWFuYWdlci5oaWRlKHdpbk5hbWUpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9vblNsaWRlRW50ZXIgPSBmdW5jdGlvbihlKXtcclxuICAgIGNwU2xpZGVMYWJlbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJyk7XHJcbiAgICBjcFNsaWRlTnVtYmVyID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICBjcFNsaWRlSWQgPSBuYXZEYXRhLnNpZHNbY3BTbGlkZU51bWJlci0xXTtcclxuXHJcbiAgICBzY2VuZUluZGV4ID0gY3BTbGlkZU51bWJlciAtIDE7XHJcbiAgICBzY3JlZW5JbmZvID0gVXRpbHMuZ2V0Q3VycmVudFNjcmVlbkluZm8obmF2RGF0YSxzY2VuZUluZGV4KTtcclxuICAgIF91cGRhdGUoKTtcclxuXHJcbiAgICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLF9vbkhpZ2hsaWdodCwnaGlnaGxpZ2h0Jyk7XHJcbiAgICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLF9vbkZyYW1lQ2hhbmdlLCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuXHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdoaWdobGlnaHQnLDApO1xyXG4gICAgY3BBcGkucGxheSgpO1xyXG4gICAgLy9hZy5zdGFydCgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9vblNsaWRlRXhpdCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGV2ZW50RW1pdHRlck9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uSGlnaGxpZ2h0LCdoaWdobGlnaHQnKTtcclxuICAgIGV2ZW50RW1pdHRlck9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uRnJhbWVDaGFuZ2UsJ2NwSW5mb0N1cnJlbnRGcmFtZScpO1xyXG4gICAgLy9hZy5jbGVhcigpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9vbkhpZ2hsaWdodCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmKGUuRGF0YS5uZXdWYWwgPT09IDEpIGNwLkRbY3BTbGlkZUlkXS5tbmMgPSB0cnVlO1xyXG4gICAgX3VwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9vbkZyYW1lQ2hhbmdlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IGlzQmxvY2tlZCA9IF9pc1F1aXooKSB8fCBfaXNJbnRlcmFjdGlvbigpO1xyXG4gICAgbGV0IGVuZEZyYW1lID0gY3AuRFtjcFNsaWRlSWRdLnRvLTE7XHJcbiAgICBsZXQgY3VyckZyYW1lID0gZS5EYXRhLm5ld1ZhbDtcclxuICAgIGNvbnNvbGUubG9nKCdmcm9tJyxjcC5EW2NwU2xpZGVJZF0uZnJvbSxcInRvXCIsY3AuRFtjcFNsaWRlSWRdLnRvKTtcclxuICAgIGlmKGN1cnJGcmFtZSA+PSBlbmRGcmFtZSkge1xyXG4gICAgICBldmVudEVtaXR0ZXJPYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLF9vbkZyYW1lQ2hhbmdlLCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuICAgICAgaWYoIV9pc1F1aXooKSkgY3BBcGkucGF1c2UoKTtcclxuICAgICAgX3VwZGF0ZSgpO1xyXG4gICAgICAvL2FnLnN0b3AoKTtcclxuICAgICAgaWYoIWlzQmxvY2tlZCkgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vYWcuanVnZ2xlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgb2JzZXJ2ZXJzLm1hcChvID0+IG8udXBkYXRlKCkpO1xyXG4gIH07XHJcblxyXG4gIC8vIERvIGRhbnljaCBzbGFqZHUsIGRvZGFqZW15IHBhcmFtZXRyIFwibW5jXCIgb2tyZcWbbGFqxIVjeSxcclxuICAvLyBjenkgZWtyYW4gem9zdGHFgiB6YWxpY3pvbnkgKHNrcsOzdCBvZCBtbmNvbXBsZXRlKS5cclxuICAvLyBEb215xZtsbmllIG5hZGFqZW15IG11IHTEhSBzYW3EhSB3YXJ0b8WbYyBjbyBwYXJhbWV0ciBcInZcIiAodmlzaXRlZClcclxuICAvLyB6IGtvbGVqbmVnbyBzbGFqZHUuXHJcbiAgLy8gUGFyYW1ldHIgXCJtbmNcIiBixJlkemllIHDDs8W6bmllaiB3eWtvcnp5c3R5d2FueSBkbyBzdHdpZXJkemVuaWEsXHJcbiAgLy8gY3p5IHByemVqxZtjaWUgZG8gbmFzdMSZcG5lZ28gZWtyYW51IG5hbGXFvHkgemFibG9rb3dhYy5cclxuICBuYXZEYXRhLnNpZHMgPSBjcC5ELnByb2plY3RfbWFpbi5zbGlkZXMuc3BsaXQoJywnKTtcclxuICBuYXZEYXRhLnNpZHMubWFwKChzaWQsaW5kZXgsYXJyKSA9PiB7XHJcbiAgICBsZXQgaXNOZXh0U2xpZGUgPSBpbmRleCArIDEgPCBhcnIubGVuZ3RoO1xyXG4gICAgY3AuRFtzaWRdLm1uYyA9IGlzTmV4dFNsaWRlID8gY3AuRFthcnJbaW5kZXgrMV1dLnYgOiBmYWxzZTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRU5URVInLF9vblNsaWRlRW50ZXIpO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVYSVQnLF9vblNsaWRlRXhpdCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuZXh0OiBfbmV4dCxcclxuICAgIHByZXY6IF9wcmV2LFxyXG4gICAgaXNDb21wbGV0ZWQ6IF9pc0NvbXBsZXRlZCxcclxuICAgIGlzSW50ZXJhY3Rpb246IF9pc0ludGVyYWN0aW9uLFxyXG4gICAgaXNRdWl6OiBfaXNRdWl6LFxyXG4gICAgZ2V0U2NyZWVuSW5mbzogX2dldFNjcmVlbkluZm8sXHJcbiAgICBnZXRDb3Vyc2VOYW1lOiBfZ2V0Q291cnNlTmFtZSxcclxuICAgIGFkZE9ic2VydmVyOiBfYWRkT2JzZXJ2ZXIsXHJcbiAgICB0b2dnbGVXaW5kb3c6IF90b2dnbGVXaW5kb3csXHJcbiAgICBnZXRXaW5kb3c6IF9nZXRXaW5kb3csXHJcbiAgICBzaG93V2luZG93OiBfc2hvd1dpbmRvdyxcclxuICAgIGhpZGVXaW5kb3c6IF9oaWRlV2luZG93LFxyXG4gICAgZ2V0U2NyZWVuczogX2dldFNjcmVlbnNcclxuICB9O1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmlnYXRpb247XHJcblxyXG5cclxuLy9ldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuLy8gIGNvbnNvbGUubG9nKCdjcFF1aXpJbmZvQW5zd2VyQ2hvaWNlJyxlLkRhdGEpO1xyXG4vL30sJ2NwUXVpekluZm9BbnN3ZXJDaG9pY2UnKTtcclxuXHJcblxyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVBBVVNFJywgZnVuY3Rpb24oZSkge1xyXG4gIC8vY29uc29sZS5sb2coJ0NQQVBJX01PVklFUEFVU0UnKTtcclxuICAvLyQoJyNuYXYtbmV4dCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuLy99KTtcclxuXHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVNUT1AnKTtcclxuLy99KTtcclxuLy9ldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfSU5URVJBQ1RJVkVJVEVNU1VCTUlUJywgZnVuY3Rpb24gKGUpIHtcclxuICAvL2NvbnNvbGUubG9nKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLGUuRGF0YSk7XHJcbi8vfSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmNvbnN0IFRhYmVsT2ZDb250ZW50cyA9IGZ1bmN0aW9uIChjcEFwaSxuYXYpIHtcclxuICBjb25zdCBfbW50b2MgPSAkKCcjbW50b2MnKTtcclxuICBjb25zdCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbnRvYycpO1xyXG5cclxuICBsZXQgb3V0cHV0ID0gW107XHJcbiAgbGV0IHNjcmVlbnMgPSBuYXYuZ2V0U2NyZWVucygpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyZWVucy5sZW5ndGg7IGkrKykge1xyXG4gICAgb3V0cHV0LnB1c2goYDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2J1dHRvbicgbmFtZT0ndG9jLWl0ZW0nIGlkPSd0b2MtaXRlbS0ke2l9Jz5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPSd0b2MtaXRlbS0ke2l9Jz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYSBmYS1tYXAtbWFya2VyIGZhLWxnJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3NjcmVlbnNbaV0ubnJ9Ljwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4+Jm5ic3A7Jm5ic3A7JHtzY3JlZW5zW2ldLmxhYmVsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICBgKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgc2NyZWVuSW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBsZXQgc2NlbmVJbmRleCA9IHNjcmVlbnNbc2NyZWVuSW5kZXhdLnNjZW5lc1swXTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NlbmVJbmRleCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvRnJhbWVBbmRSZXN1bWUnLDApO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIHRvYycpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmVsT2ZDb250ZW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgVG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IF9pZCA9IGlkO1xyXG4gIGxldCBfZWxlbWVudCA9ICQoJyMnK19pZCksXHJcbiAgX3Zpc2libGUgPSBmYWxzZSxcclxuICBfdHVybmVkb24gPSB0cnVlLFxyXG5cclxuICBfZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfaWQ7XHJcbiAgfSxcclxuXHJcbiAgX2lzVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF92aXNpYmxlO1xyXG4gIH0sXHJcblxyXG4gIF9pc1R1cm5lZE9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3R1cm5lZG9uO1xyXG4gIH0sXHJcblxyXG4gIF9zaG93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IHRydWU7XHJcbiAgICBfZWxlbWVudC5zbGlkZURvd24oMjAwKTtcclxuICB9LFxyXG5cclxuICBfaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoIV90dXJuZWRvbikgcmV0dXJuO1xyXG4gICAgX3Zpc2libGUgPSBmYWxzZTtcclxuICAgIF9lbGVtZW50LnNsaWRlVXAoMjAwKTtcclxuICB9LFxyXG5cclxuICBfc2V0VHVybmVkT24gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdmFsdWUgPyBfc2hvdygpIDogX2hpZGUoKTtcclxuICAgIF90dXJuZWRvbiA9IHZhbHVlO1xyXG4gIH0sXHJcblxyXG4gIF90b2dnbGVWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfdmlzaWJsZSA/IF9oaWRlKCkgOiBfc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIF9lbGVtZW50LnNsaWRlVXAoMCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZXRJZDogX2dldElkLFxyXG4gICAgaXNWaXNpYmxlOiBfaXNWaXNpYmxlLFxyXG4gICAgaXNUdXJuZWRPbjogX2lzVHVybmVkT24sXHJcbiAgICBzaG93OiBfc2hvdyxcclxuICAgIGhpZGU6IF9oaWRlLFxyXG4gICAgc2V0VHVybmVkT246IF9zZXRUdXJuZWRPbixcclxuICAgIHRvZ2dsZTogX3RvZ2dsZVZpc2libGVcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVXaW5kb3c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IF9maW5kU2NyZWVuSW5kZXggPSBmdW5jdGlvbihhcnIsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zTGVuID0gYXJyLmxlbmd0aDtcclxuICBsZXQgb3V0cHV0O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyZWVuc0xlbjsgaSsrKSB7XHJcbiAgICBvdXRwdXQgPSBhcnJbaV0uc2NlbmVzICE9PSB1bmRlZmluZWQgPyBhcnJbaV0uc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNjZW5lID09PSBzY2VuZUluZGV4O1xyXG4gICAgfSkgOiBbXTtcclxuICAgIGlmKG91dHB1dC5sZW5ndGggPiAwKSByZXR1cm4gaTtcclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuY29uc3QgX2dldFNjcmVlbnNBcnJheSA9IGZ1bmN0aW9uKG5hdixjdXJyU2NlbmUpIHtcclxuICBsZXQgaXNIaWRkZW4gPSBfaXNTY2VuZUhpZGRlbihuYXYuaGlkZGVuLGN1cnJTY2VuZSk7XHJcbiAgcmV0dXJuIGlzSGlkZGVuID8gbmF2LmhpZGRlbiA6IG5hdi5zY3JlZW5zO1xyXG59O1xyXG5cclxuY29uc3QgX2lzU2NlbmVIaWRkZW4gPSBmdW5jdGlvbihhcnIsc2NlbmVJbmRleCkge1xyXG4gIHJldHVybiBhcnIuZmlsdGVyKHNjciA9PiB7XHJcbiAgICByZXR1cm4gc2NyLnNjZW5lcy5maWx0ZXIoc2NlbmUgPT4ge1xyXG4gICAgICByZXR1cm4gc2NlbmUgPT09IHNjZW5lSW5kZXg7XHJcbiAgICB9KS5sZW5ndGggPiAwO1xyXG4gIH0pLmxlbmd0aCA+IDA7XHJcbn07XHJcblxyXG5jb25zdCBfZ2V0UHJldlNjZW5lSW5kZXggPSBmdW5jdGlvbihhcnIsY3VyclNjZW5lKSB7XHJcbiAgbGV0IHNjcmVlbkluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChhcnIsY3VyclNjZW5lKTtcclxuICBsZXQgc2NyZWVuLCBzY2VuZXMsIHNjZW5lSW5kZXg7XHJcblxyXG4gIGlmKHNjcmVlbkluZGV4ID49IDApIHtcclxuICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleF07XHJcbiAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgc2NlbmVJbmRleCA9IHNjZW5lcy5pbmRleE9mKGN1cnJTY2VuZSk7XHJcbiAgICBpZihzY2VuZUluZGV4ID4gMCl7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVJbmRleCAtIDFdO1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbi5wcmV2ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gc2NyZWVuLnByZXY7XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuSW5kZXggPiAwKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4IC0gMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVzLmxlbmd0aC0xXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuY29uc3QgX2dldE5leHRTY2VuZUluZGV4ID0gZnVuY3Rpb24oYXJyLGN1cnJTY2VuZSkge1xyXG4gIGxldCBzY3JlZW5JbmRleCA9IF9maW5kU2NyZWVuSW5kZXgoYXJyLGN1cnJTY2VuZSk7XHJcbiAgbGV0IHNjcmVlbiwgc2NlbmVzLCBzY2VuZUluZGV4O1xyXG5cclxuICBpZihzY3JlZW5JbmRleCA+PSAwKSB7XHJcbiAgICBzY3JlZW4gPSBhcnJbc2NyZWVuSW5kZXhdO1xyXG4gICAgc2NlbmVzID0gc2NyZWVuLnNjZW5lcztcclxuICAgIHNjZW5lSW5kZXggPSBzY2VuZXMuaW5kZXhPZihjdXJyU2NlbmUpO1xyXG4gICAgaWYoc2NlbmVJbmRleCA8IHNjZW5lcy5sZW5ndGggLSAxKXtcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZUluZGV4ICsgMV07XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuLm5leHQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHJldHVybiBzY3JlZW4ubmV4dDtcclxuICAgIH0gZWxzZSBpZihzY3JlZW5JbmRleCA8IGFyci5sZW5ndGggLSAxKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4ICsgMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbMF07XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAtMTtcclxufTtcclxuXHJcbmNvbnN0IGdldEN1cnJlbnRTY3JlZW5JbmZvID0gZnVuY3Rpb24obmF2LHNjZW5lSW5kZXgpIHtcclxuICBsZXQgc2NyZWVucyA9IF9nZXRTY3JlZW5zQXJyYXkobmF2LHNjZW5lSW5kZXgpO1xyXG4gIGxldCBpbmRleCA9IF9maW5kU2NyZWVuSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KTtcclxuICBsZXQgc2NyZWVuID0gaW5kZXggPj0gMCA/IHNjcmVlbnNbaW5kZXhdIDogbnVsbDtcclxuICAvL2NvbnNvbGUubG9nKCdnZXRDdXJyZW50U2NyZWVuSW5mbycsaW5kZXgsc2NyZWVuLHNjZW5lSW5kZXgpO1xyXG4gIHJldHVybiB7XHJcbiAgICBpbmRleDogaW5kZXgsXHJcbiAgICBucjogc2NyZWVuLm5yLFxyXG4gICAgbGFiZWw6IHNjcmVlbi5sYWJlbCxcclxuICAgIGN1cnJTY2VuZTogc2NyZWVuLnNjZW5lcy5pbmRleE9mKHNjZW5lSW5kZXgpLFxyXG4gICAgdG90YWxTY2VuZXM6IHNjcmVlbi5zY2VuZXMubGVuZ3RoLFxyXG4gICAgcHJldjogX2dldFByZXZTY2VuZUluZGV4KHNjcmVlbnMsc2NlbmVJbmRleCksXHJcbiAgICBuZXh0OiBfZ2V0TmV4dFNjZW5lSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KVxyXG4gIH07XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Z2V0Q3VycmVudFNjcmVlbkluZm99O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IF93aW5kb3dzID0gW107XHJcbiAgbGV0IF9jdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgY29uc3QgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9zaG93V2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IG51bGwgJiYgX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICBfY3VycmVudCA9IHdpZDtcclxuICAgICAgICB3Lndpbi5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9oaWRlV2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQgfHwgd2lkID09PSB1bmRlZmluZWQgfHwgd2lkID09PSBudWxsKSB7XHJcbiAgICAgICAgdy53aW4uaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIF9jdXJyZW50ID0gbnVsbDtcclxuICB9O1xyXG5cclxuICBjb25zdCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2dldFdpbmRvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIGxldCBfd2luID0gX3dpbmRvd3MuZmlsdGVyKHcgPT4ge1xyXG4gICAgICByZXR1cm4gdy53aW4uZ2V0SWQoKSA9PT0gbmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIF93aW4ubGVuZ3RoID4gMCA/IF93aW5bMF0gOiBudWxsO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0b2dnbGU6IF90b2dnbGVXaW5kb3csXHJcbiAgICBzaG93OiBfc2hvd1dpbmRvdyxcclxuICAgIGhpZGU6IF9oaWRlV2luZG93LFxyXG4gICAgYWRkV2luZG93OiBfYWRkV2luZG93LFxyXG4gICAgZ2V0V2luZG93OiBfZ2V0V2luZG93XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd01hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSByZXF1aXJlKCcuL1dpbmRvd01hbmFnZXInKTtcclxuY29uc3QgSGVhZGVyID0gcmVxdWlyZSgnLi9IZWFkZXInKTtcclxuY29uc3QgTmF2YmFyID0gcmVxdWlyZSgnLi9OYXZiYXInKTtcclxuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vTWVudScpO1xyXG5jb25zdCBUYWJsZU9mQ29udGVudHMgPSByZXF1aXJlKCcuL1RhYmxlT2ZDb250ZW50cycpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9OYXZpZ2F0aW9uJyk7XHJcbmNvbnN0IEludGVyYWN0aW9uVXRpbHMgPSByZXF1aXJlKCcuL0ludGVyYWN0aW9uVXRpbHMnKTtcclxuXHJcbmdsb2JhbC5tbiA9IChmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgd2luTWFuYWdlciA9IG5ldyBXaW5kb3dNYW5hZ2VyKCk7XHJcbiAgbGV0IG15SGVhZGVyO1xyXG4gIGxldCBteVRvYztcclxuICBsZXQgbXlNZW51O1xyXG4gIGxldCBteU5hdmJhcjtcclxuICBsZXQgbXlOYXZpZ2F0aW9uO1xyXG4gIGxldCBpbnRlcmFjdGlvblV0aWxzID0gbmV3IEludGVyYWN0aW9uVXRpbHMoKTtcclxuXHJcbiAgZnVuY3Rpb24gb25SZXNpemUoZSkge1xyXG4gICAgbGV0IHZpZXdwb3J0V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgIGxldCB2aWV3cG9ydEhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgIGxldCBsZWZ0ID0gMDtcclxuICAgIGxldCBzY2FsZSA9IDE7XHJcbiAgICBsZXQgd3NjYWxlID0gc2NhbGU7XHJcbiAgICBsZXQgaHNjYWxlID0gc2NhbGU7XHJcbiAgICBsZXQgbWF4V2lkdGggPSA5NjA7XHJcbiAgICAvL3ZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoIDwgOTYwID8gdmlld3BvcnRXaWR0aCA6IDk2MDtcclxuICAgIHdzY2FsZSA9ICh2aWV3cG9ydFdpZHRoIDwgbWF4V2lkdGggPyB2aWV3cG9ydFdpZHRoIDogbWF4V2lkdGgpIC8gODAwO1xyXG4gICAgaHNjYWxlID0gdmlld3BvcnRIZWlnaHQgLyA2MDA7XHJcbiAgICBzY2FsZSA9IE1hdGgubWluKHdzY2FsZSxoc2NhbGUpO1xyXG4gICAgbGVmdCA9ICh2aWV3cG9ydFdpZHRoIC0gKDgwMCAqIHNjYWxlKSkgKiAuNTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBzY2FsZSwgbGVmdCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdzdHlsZScsZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5fY29udGFpbmVyJykuc3R5bGUuY3NzVGV4dCk7XHJcbiAgICBjcC5tb3ZpZS5tX3NjYWxlRmFjdG9yID0gc2NhbGU7XHJcbiAgICAkKCcjbWFpbl9jb250YWluZXInKS5hdHRyKCdzdHlsZScsYFxyXG4gICAgICB0b3A6IDBweDtcclxuICAgICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgICBsZWZ0OiAke2xlZnR9cHg7XHJcbiAgICAgIHdpZHRoOiA4MDBweDtcclxuICAgICAgaGVpZ2h0OiA2MDBweDtcclxuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdCB0b3AgMHB4O1xyXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKCR7c2NhbGV9KTtcclxuICAgIGApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb2R1bGVSZWFkeUV2ZW50XCIsIGZ1bmN0aW9uKGV2dClcclxuICB7XHJcbiAgICBjcEludGVyZmFjZSA9IGV2dC5EYXRhO1xyXG4gICAgd2luZG93LmNwLlNldFNjYWxlQW5kUG9zaXRpb24gPSBmdW5jdGlvbigpe3JldHVybiB0cnVlO307XHJcbiAgICBvblJlc2l6ZSgpO1xyXG4gICAgJC5nZXRKU09OKFwibmF2aWdhdGlvbi5qc29uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBteU5hdmlnYXRpb24gPSBuZXcgTmF2aWdhdGlvbihjcEludGVyZmFjZSx3aW5NYW5hZ2VyLGRhdGEpO1xyXG5cclxuICAgICAgICBteUhlYWRlciA9IG5ldyBIZWFkZXIoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteUhlYWRlcik7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15SGVhZGVyKTtcclxuICAgICAgICBteVRvYyA9IG5ldyBUYWJsZU9mQ29udGVudHMoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteVRvYyk7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15VG9jKTtcclxuICAgICAgICBteU1lbnUgPSBuZXcgTWVudShjcEludGVyZmFjZSxteU5hdmlnYXRpb24pO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uLmFkZE9ic2VydmVyKG15TmF2YmFyKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAkKCB3aW5kb3cgKS5yZXNpemUob25SZXNpemUpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW50OmludGVyYWN0aW9uVXRpbHNcclxuICB9XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1uO1xyXG4iXX0=
