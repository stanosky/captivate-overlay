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
      blink();
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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxJbnRlcmFjdGlvblV0aWxzLmpzIiwic3JjXFxqc1xcTWVudS5qcyIsInNyY1xcanNcXE5hdmJhci5qcyIsInNyY1xcanNcXE5hdmlnYXRpb24uanMiLCJzcmNcXGpzXFxUYWJsZU9mQ29udGVudHMuanMiLCJzcmNcXGpzXFxUb2dnbGVXaW5kb3cuanMiLCJzcmNcXGpzXFxVdGlscy5qcyIsInNyY1xcanNcXFdpbmRvd01hbmFnZXIuanMiLCJzcmNcXGpzXFxzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZ0JBQVIsQ0FBckI7QUFDQSxJQUFNLFFBQVEsUUFBUSxTQUFSLENBQWQ7O0FBR0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFVLEtBQVYsRUFBZ0IsR0FBaEIsRUFBb0I7QUFDakMsTUFBTSxNQUFNLElBQUksWUFBSixDQUFpQixVQUFqQixDQUFaO0FBQ0EsTUFBTSxhQUFhLEVBQUUsYUFBRixDQUFuQjtBQUNBLE1BQU0sY0FBYyxFQUFFLGNBQUYsQ0FBcEI7QUFDQSxNQUFNLFlBQVksRUFBRSxZQUFGLENBQWxCO0FBQ0EsTUFBTSxTQUFTLEVBQUUsV0FBRixDQUFmO0FBQ0EsTUFBSSxrQkFBSjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBTSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzlCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxhQUFhLFNBQWIsVUFBYSxHQUFZO0FBQzdCO0FBQ0EsUUFBSSxJQUFKO0FBQ0QsR0FIRDs7QUFLQSxNQUFNLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDN0I7QUFDQSxRQUFJLElBQUo7QUFDRCxHQUhEOztBQUtBLE1BQU0sUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN4QjtBQUNB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VUFBUyxJQUFULEVBQWU7QUFDeEMscUJBQWUsSUFBSSxVQUFKLENBQWUsV0FBZixFQUEyQixVQUEzQixFQUFzQyxJQUF0QyxDQUFmOztBQUVBLGlCQUFXLElBQUksTUFBSixDQUFXLFdBQVgsRUFBdUIsWUFBdkIsQ0FBWDtBQUNBLGlCQUFXLFNBQVgsQ0FBcUIsUUFBckI7QUFDQSxtQkFBYSxXQUFiLENBQXlCLFFBQXpCO0FBQ0EsY0FBUSxJQUFJLGVBQUosQ0FBb0IsV0FBcEIsRUFBZ0MsWUFBaEMsQ0FBUjtBQUNBLGlCQUFXLFNBQVgsQ0FBcUIsS0FBckI7QUFDQSxtQkFBYSxXQUFiLENBQXlCLEtBQXpCO0FBQ0EsZUFBUyxJQUFJLElBQUosQ0FBUyxXQUFULEVBQXFCLFlBQXJCLENBQVQ7QUFDQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0EsbUJBQWEsV0FBYixDQUF5QixNQUF6QjtBQUNBLGlCQUFXLElBQUksTUFBSixDQUFXLFdBQVgsRUFBdUIsWUFBdkIsQ0FBWDtBQUNBLG1CQUFhLFdBQWIsQ0FBeUIsUUFBekI7QUFDSCxLQWREO0FBZUQsR0FuQkQ7O0FBcUJBO0FBQ0E7O0FBRUEsU0FBTztBQUNMLFNBQUk7QUFEQyxHQUFQO0FBR0QsQ0FoRVcsRUFBWjs7QUFrRUEsT0FBTyxPQUFQLEdBQWlCLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XHJcblxyXG5cclxuY29uc3QgSGVhZGVyID0gZnVuY3Rpb24gKGNwQXBpLG5hdil7XHJcbiAgY29uc3QgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5oZWFkZXInKTtcclxuICBjb25zdCBjb3Vyc2VOYW1lID0gJCgnI2NvdXJzZU5hbWUnKTtcclxuICBjb25zdCBzbGlkZU51bWJlciA9ICQoJyNzbGlkZU51bWJlcicpO1xyXG4gIGNvbnN0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuICBjb25zdCBoZWFkZXIgPSAkKCcjbW5oZWFkZXInKTtcclxuICBsZXQgdGltZW91dElkO1xyXG4gIGxldCBjdXJyU2NyZWVuO1xyXG5cclxuICBjb25zdCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYmxpbmsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBzaG93SGVhZGVyKCk7XHJcbiAgICB0aW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dChoaWRlSGVhZGVyLDIwMDApO1xyXG4gIH07XHJcblxyXG4gICQoJyNtbmhlYWRlcicpLnNsaWRlVXAoMCk7XHJcbiAgJCggXCIjbW5yb2xsb3ZlclwiIClcclxuICAgIC5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHNob3dIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSlcclxuICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGhpZGVIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gIGNvbnN0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBzY3JlZW5JbmZvID0gbmF2LmdldFNjcmVlbkluZm8oKTtcclxuICAgIGlmKGN1cnJTY3JlZW4gIT09IHNjcmVlbkluZm8uaW5kZXgpIHtcclxuICAgICAgY3VyclNjcmVlbiA9IHNjcmVlbkluZm8uaW5kZXg7XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuZ2V0Q291cnNlTmFtZSgpKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChzY3JlZW5JbmZvLm5yKycuJyk7XHJcbiAgICAgIHNsaWRlTmFtZS5odG1sKHNjcmVlbkluZm8ubGFiZWwpO1xyXG4gICAgICBibGluaygpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEludGVyYWN0aW9uVXRpbHMgPSBmdW5jdGlvbihjcEFwaSkge1xyXG5cclxuICBsZXQgX3ZhcnMgPSBbXSxfY29yciA9IFtdO1xyXG5cclxuICBjb25zdCBfc2V0VmFyaWFibGVzID0gZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgIF92YXJzID0gYXJyYXk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBfc2V0Q29ycmVjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICBfY29yciA9IGFycmF5O1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9pc1ZhckVxdWFsID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIHJldHVybiBjcEFQSUludGVyZmFjZS5nZXRWYXJpYWJsZVZhbHVlKF92YXJzW2luZGV4XSkgPT0gX2NvcnJbaW5kZXhdO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9hcmVWYXJzRXF1YWwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBlcXVhbFZhcnMgPSBfdmFycy5maWx0ZXIoKHYsaSkgPT4ge1xyXG4gICAgICByZXR1cm4gX2lzVmFyRXF1YWwoaSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBlcXVhbFZhcnMubGVuZ3RoID09PSBfdmFycy5sZW5ndGg7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuICB7XHJcbiAgICBzZXRWYXJpYWJsZXM6IF9zZXRWYXJpYWJsZXMsXHJcbiAgICBzZXRDb3JyZWN0OiBfc2V0Q29ycmVjdCxcclxuICAgIGlzVmFyRXF1YWw6IF9pc1ZhckVxdWFsLFxyXG4gICAgYXJlVmFyc0VxdWFsOiBfYXJlVmFyc0VxdWFsXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGlvblV0aWxzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5jb25zdCBNZW51ID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGNvbnN0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21ubWVudScpO1xyXG5cclxuICAkKCcjbWVudS10b2MnKS5jbGljayhlID0+IG5hdi5zaG93V2luZG93KCdtbnRvYycpKTtcclxuICAkKCcjbWVudS1leGl0JykuY2xpY2soZSA9PiBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRFeGl0JywxKSk7XHJcbiAgJCgnI21lbnUtcHJpbnQnKS5jbGljayhlID0+IHdpbmRvdy5wcmludCgpKTtcclxuXHJcbiAgJCgnI21lbnUtc291bmQnKVswXS5jaGVja2VkID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTXV0ZScpID09PSAwO1xyXG4gICQoJyNtZW51LXNvdW5kJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTXV0ZScsZS50YXJnZXQuY2hlY2tlZCA/IDAgOiAxKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS12b2x1bWUnKVswXS52YWx1ZSA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZFZvbHVtZScpO1xyXG4gICQoJyNtZW51LXZvbHVtZScpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZFZvbHVtZScsZS50YXJnZXQudmFsdWUpO1xyXG4gIH07XHJcblxyXG4gICQoJyNtZW51LWhlYWRlcicpWzBdLmNoZWNrZWQgPSBuYXYuZ2V0V2luZG93KCdtbmhlYWRlcicpLndpbi5pc1R1cm5lZE9uKCk7XHJcbiAgJCgnI21lbnUtaGVhZGVyJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgbmF2LmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uc2V0VHVybmVkT24oZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgfVxyXG4gIGNvbnN0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZSBtZW51Jyk7XHJcbiAgfTtcclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHcsXHJcbiAgICB1cGRhdGU6IF91cGRhdGVcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG5jb25zdCBOYXZiYXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgY29uc3QgbmF2YmFyID0gJCgnI21ubmF2YmFyJyk7XHJcbiAgY29uc3QgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBjb25zdCBwcm9ncmVzcyA9ICQoJyNsZXNzb24tcHJvZ3Jlc3MnKTtcclxuICBjb25zdCBwcm9ncmVzc0xhYmVsID0gJCgnI2xlc3Nvbi1wcm9ncmVzcy1sYWJlbCBzdHJvbmcnKTtcclxuXHJcbiAgZnVuY3Rpb24gX3VwZGF0ZSgpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZSBuYXZiYXInKTtcclxuICAgIGxldCBzY3JlZW5JbmZvID0gbmF2LmdldFNjcmVlbkluZm8oKTtcclxuICAgIGxldCBpc1F1aXogPSBuYXYuaXNRdWl6KCk7XHJcbiAgICBsZXQgaXNJbnRlcmFjdGlvbiA9IG5hdi5pc0ludGVyYWN0aW9uKCk7XHJcbiAgICBsZXQgdG90YWxTY3JlZW5zID0gbmF2LmdldFNjcmVlbnMoKS5sZW5ndGg7XHJcblxyXG4gICAgJCgnI25hdi1uZXh0JylbMF0uZGlzYWJsZWQgPSBpc1F1aXogfHwgaXNJbnRlcmFjdGlvbiB8fCBzY3JlZW5JbmZvLm5leHQgPT09IC0xO1xyXG4gICAgJCgnI25hdi1wcmV2JylbMF0uZGlzYWJsZWQgPSBpc1F1aXogfHwgc2NyZWVuSW5mby5wcmV2ID09PSAtMTtcclxuICAgICQoJyNuYXYtdG9jJylbMF0uZGlzYWJsZWQgPSBpc1F1aXo7XHJcbiAgICAkKCcjbWVudS10b2MnKVswXS5kaXNhYmxlZCA9IGlzUXVpejtcclxuXHJcbiAgICBpZihuYXYuaXNDb21wbGV0ZWQoKSAmJiBzY3JlZW5JbmZvLm5leHQgIT09IC0xKSB7XHJcbiAgICAgICQoJyNuYXYtbmV4dCArIGxhYmVsJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI25hdi1uZXh0ICsgbGFiZWwnKS5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9jcG9zaXRpb24uaHRtbCgoc2NyZWVuSW5mby5ucikgKyAnLycgKyB0b3RhbFNjcmVlbnMpO1xyXG4gICAgaWYoaXNRdWl6KSB7XHJcbiAgICAgIHByb2dyZXNzLnZhbCgxMDApO1xyXG4gICAgICAvL3Byb2dyZXNzTGFiZWwuaHRtbCgnU2NlbmEgMSB6IDEnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBjdXJyU2NlbmUgPSBzY3JlZW5JbmZvLmN1cnJTY2VuZSArIDE7XHJcbiAgICAgIGlmKHNjcmVlbkluZm8uY3VyclNjZW5lID4gLTEpIHtcclxuICAgICAgICBwcm9ncmVzcy52YWwoKGN1cnJTY2VuZSAvIHNjcmVlbkluZm8udG90YWxTY2VuZXMpICogMTAwKTtcclxuICAgICAgICAvL3Byb2dyZXNzTGFiZWwuaHRtbCgnU2NlbmEgJyArIGN1cnJTY2VuZSArICcgeiAnICsgc2NyZWVuSW5mby50b3RhbFNjZW5lcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJvZ3Jlc3MudmFsKDEwMCk7XHJcbiAgICAgICAgLy9wcm9ncmVzc0xhYmVsLmh0bWwoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgJCgnI25hdi1uZXh0JykuY2xpY2soKGUpID0+IG5hdi5uZXh0KCkpO1xyXG4gICQoJyNuYXYtcHJldicpLmNsaWNrKChlKSA9PiBuYXYucHJldigpKTtcclxuICAkKCcjbmF2LXRvYycpLmNsaWNrKChlKSA9PiBuYXYudG9nZ2xlV2luZG93KCdtbnRvYycpKTtcclxuICAkKCcjbmF2LW1lbnUnKS5jbGljaygoZSkgPT4gbmF2LnRvZ2dsZVdpbmRvdygnbW5tZW51JykpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdXBkYXRlOiBfdXBkYXRlXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XHJcbi8vY29uc3QgQWdlbnRKdWdnbGVyID0gcmVxdWlyZSgnLi9BZ2VudEp1Z2dsZXInKTtcclxuXHJcbmNvbnN0IE5hdmlnYXRpb24gPSBmdW5jdGlvbihjcEFwaSx3aW5NYW5hZ2VyLGRhdGEpIHtcclxuICAvL2NvbnN0IGFnID0gbmV3IEFnZW50SnVnZ2xlcigpO1xyXG4gIGxldCBvYnNlcnZlcnMgPSBbXTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgbGV0IG5hdkRhdGEgPSBkYXRhO1xyXG5cclxuICBsZXQgY3BTbGlkZUxhYmVsO1xyXG4gIGxldCBjcFNsaWRlTnVtYmVyO1xyXG4gIGxldCBjcFNsaWRlSWQ7XHJcblxyXG4gIGxldCBzY2VuZUluZGV4O1xyXG4gIGxldCB0b3RhbFNjcmVlbnMgPSBuYXZEYXRhLnNjcmVlbnMubGVuZ3RoO1xyXG4gIGxldCBzY3JlZW5JbmZvO1xyXG5cclxuXHJcbiAgY29uc3QgX25leHQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NyZWVuSW5mby5uZXh0KTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9wcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjcmVlbkluZm8ucHJldik7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfYWRkT2JzZXJ2ZXIgPSBmdW5jdGlvbihvYmopIHtcclxuICAgIG9ic2VydmVycy5wdXNoKG9iaik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2dldFNjcmVlbnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuYXZEYXRhLnNjcmVlbnM7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2lzQ29tcGxldGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gY3AuRFtjcFNsaWRlSWRdLm1uY1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9pc0ludGVyYWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gY3BTbGlkZUxhYmVsID09PSAnbW5JbnRlcmFjdGlvbicgJiYgIV9pc0NvbXBsZXRlZCgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9pc1F1aXogPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBjcFNsaWRlTGFiZWwgPT09ICdtblF1aXonO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9nZXRTY3JlZW5JbmZvID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gc2NyZWVuSW5mbztcclxuICB9XHJcblxyXG4gIGNvbnN0IF90b2dnbGVXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICB3aW5NYW5hZ2VyLnRvZ2dsZSh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfZ2V0Q291cnNlTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5hdkRhdGEuY291cnNlTmFtZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfZ2V0V2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbk1hbmFnZXIuZ2V0V2luZG93KHdpbk5hbWUpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9zaG93V2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbk1hbmFnZXIuc2hvdyh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBfaGlkZVdpbmRvdyA9IGZ1bmN0aW9uKHdpbk5hbWUpIHtcclxuICAgIHJldHVybiB3aW5NYW5hZ2VyLmhpZGUod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX29uU2xpZGVFbnRlciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgY3BTbGlkZUxhYmVsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKTtcclxuICAgIGNwU2xpZGVOdW1iZXIgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGUnKTtcclxuICAgIGNwU2xpZGVJZCA9IG5hdkRhdGEuc2lkc1tjcFNsaWRlTnVtYmVyLTFdO1xyXG5cclxuICAgIHNjZW5lSW5kZXggPSBjcFNsaWRlTnVtYmVyIC0gMTtcclxuICAgIHNjcmVlbkluZm8gPSBVdGlscy5nZXRDdXJyZW50U2NyZWVuSW5mbyhuYXZEYXRhLHNjZW5lSW5kZXgpO1xyXG4gICAgX3VwZGF0ZSgpO1xyXG5cclxuICAgIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uSGlnaGxpZ2h0LCdoaWdobGlnaHQnKTtcclxuICAgIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uRnJhbWVDaGFuZ2UsJ2NwSW5mb0N1cnJlbnRGcmFtZScpO1xyXG5cclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2hpZ2hsaWdodCcsMCk7XHJcbiAgICBjcEFwaS5wbGF5KCk7XHJcbiAgICAvL2FnLnN0YXJ0KCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX29uU2xpZGVFeGl0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25IaWdobGlnaHQsJ2hpZ2hsaWdodCcpO1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25GcmFtZUNoYW5nZSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcbiAgICAvL2FnLmNsZWFyKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX29uSGlnaGxpZ2h0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYoZS5EYXRhLm5ld1ZhbCA9PT0gMSkgY3AuRFtjcFNsaWRlSWRdLm1uYyA9IHRydWU7XHJcbiAgICBfdXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX29uRnJhbWVDaGFuZ2UgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBsZXQgaXNCbG9ja2VkID0gX2lzUXVpeigpIHx8IF9pc0ludGVyYWN0aW9uKCk7XHJcbiAgICBsZXQgZW5kRnJhbWUgPSBjcC5EW2NwU2xpZGVJZF0udG8tMTtcclxuICAgIGxldCBjdXJyRnJhbWUgPSBlLkRhdGEubmV3VmFsO1xyXG4gICAgY29uc29sZS5sb2coJ2Zyb20nLGNwLkRbY3BTbGlkZUlkXS5mcm9tLFwidG9cIixjcC5EW2NwU2xpZGVJZF0udG8pO1xyXG4gICAgaWYoY3VyckZyYW1lID49IGVuZEZyYW1lKSB7XHJcbiAgICAgIGV2ZW50RW1pdHRlck9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uRnJhbWVDaGFuZ2UsJ2NwSW5mb0N1cnJlbnRGcmFtZScpO1xyXG4gICAgICBpZighX2lzUXVpeigpKSBjcEFwaS5wYXVzZSgpO1xyXG4gICAgICBfdXBkYXRlKCk7XHJcbiAgICAgIC8vYWcuc3RvcCgpO1xyXG4gICAgICBpZighaXNCbG9ja2VkKSBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdoaWdobGlnaHQnLDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy9hZy5qdWdnbGUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBfdXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBvYnNlcnZlcnMubWFwKG8gPT4gby51cGRhdGUoKSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gRG8gZGFueWNoIHNsYWpkdSwgZG9kYWplbXkgcGFyYW1ldHIgXCJtbmNcIiBva3JlxZtsYWrEhWN5LFxyXG4gIC8vIGN6eSBla3JhbiB6b3N0YcWCIHphbGljem9ueSAoc2tyw7N0IG9kIG1uY29tcGxldGUpLlxyXG4gIC8vIERvbXnFm2xuaWUgbmFkYWplbXkgbXUgdMSFIHNhbcSFIHdhcnRvxZtjIGNvIHBhcmFtZXRyIFwidlwiICh2aXNpdGVkKVxyXG4gIC8vIHoga29sZWpuZWdvIHNsYWpkdS5cclxuICAvLyBQYXJhbWV0ciBcIm1uY1wiIGLEmWR6aWUgcMOzxbpuaWVqIHd5a29yenlzdHl3YW55IGRvIHN0d2llcmR6ZW5pYSxcclxuICAvLyBjenkgcHJ6ZWrFm2NpZSBkbyBuYXN0xJlwbmVnbyBla3JhbnUgbmFsZcW8eSB6YWJsb2tvd2FjLlxyXG4gIG5hdkRhdGEuc2lkcyA9IGNwLkQucHJvamVjdF9tYWluLnNsaWRlcy5zcGxpdCgnLCcpO1xyXG4gIG5hdkRhdGEuc2lkcy5tYXAoKHNpZCxpbmRleCxhcnIpID0+IHtcclxuICAgIGxldCBpc05leHRTbGlkZSA9IGluZGV4ICsgMSA8IGFyci5sZW5ndGg7XHJcbiAgICBjcC5EW3NpZF0ubW5jID0gaXNOZXh0U2xpZGUgPyBjcC5EW2FycltpbmRleCsxXV0udiA6IGZhbHNlO1xyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsX29uU2xpZGVFbnRlcik7XHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRVhJVCcsX29uU2xpZGVFeGl0KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG5leHQ6IF9uZXh0LFxyXG4gICAgcHJldjogX3ByZXYsXHJcbiAgICBpc0NvbXBsZXRlZDogX2lzQ29tcGxldGVkLFxyXG4gICAgaXNJbnRlcmFjdGlvbjogX2lzSW50ZXJhY3Rpb24sXHJcbiAgICBpc1F1aXo6IF9pc1F1aXosXHJcbiAgICBnZXRTY3JlZW5JbmZvOiBfZ2V0U2NyZWVuSW5mbyxcclxuICAgIGdldENvdXJzZU5hbWU6IF9nZXRDb3Vyc2VOYW1lLFxyXG4gICAgYWRkT2JzZXJ2ZXI6IF9hZGRPYnNlcnZlcixcclxuICAgIHRvZ2dsZVdpbmRvdzogX3RvZ2dsZVdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvdyxcclxuICAgIHNob3dXaW5kb3c6IF9zaG93V2luZG93LFxyXG4gICAgaGlkZVdpbmRvdzogX2hpZGVXaW5kb3csXHJcbiAgICBnZXRTY3JlZW5zOiBfZ2V0U2NyZWVuc1xyXG4gIH07XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbjtcclxuXHJcblxyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsZnVuY3Rpb24oZSkge1xyXG4vLyAgY29uc29sZS5sb2coJ2NwUXVpekluZm9BbnN3ZXJDaG9pY2UnLGUuRGF0YSk7XHJcbi8vfSwnY3BRdWl6SW5mb0Fuc3dlckNob2ljZScpO1xyXG5cclxuXHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgLy9jb25zb2xlLmxvZygnQ1BBUElfTU9WSUVQQVVTRScpO1xyXG4gIC8vJCgnI25hdi1uZXh0JykuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4vL30pO1xyXG5cclxuLy9ldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVTVE9QJywgZnVuY3Rpb24oZSkge1xyXG4gIC8vY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4vL30pO1xyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLCBmdW5jdGlvbiAoZSkge1xyXG4gIC8vY29uc29sZS5sb2coJ0NQQVBJX0lOVEVSQUNUSVZFSVRFTVNVQk1JVCcsZS5EYXRhKTtcclxuLy99KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxuY29uc3QgVGFiZWxPZkNvbnRlbnRzID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGNvbnN0IF9tbnRvYyA9ICQoJyNtbnRvYycpO1xyXG4gIGNvbnN0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21udG9jJyk7XHJcblxyXG4gIGxldCBvdXRwdXQgPSBbXTtcclxuICBsZXQgc2NyZWVucyA9IG5hdi5nZXRTY3JlZW5zKCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JlZW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBvdXRwdXQucHVzaChcIjxkaXY+PGlucHV0IHR5cGU9J2J1dHRvbicgbmFtZT0ndG9jLWl0ZW0nIGlkPSd0b2MtaXRlbS1cIitpK1wiJz5cIitcclxuICAgICAgICAgICAgICAgIFwiPGxhYmVsIGZvcj0ndG9jLWl0ZW0tXCIraStcIic+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdmYSBmYS1tYXAtbWFya2VyIGZhLWxnJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8c3Bhbj5cIitzY3JlZW5zW2ldLm5yK1wiLjwvc3Bhbj4mbmJzcDsmbmJzcDtcIitcclxuICAgICAgICAgICAgICAgIHNjcmVlbnNbaV0ubGFiZWwrXCI8L2xhYmVsPjwvZGl2PlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgc2NyZWVuSW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBsZXQgc2NlbmVJbmRleCA9IHNjcmVlbnNbc2NyZWVuSW5kZXhdLnNjZW5lc1swXTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NlbmVJbmRleCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvRnJhbWVBbmRSZXN1bWUnLDApO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIHRvYycpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmVsT2ZDb250ZW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgVG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IF9pZCA9IGlkO1xyXG4gIGxldCBfZWxlbWVudCA9ICQoJyMnK19pZCksXHJcbiAgX3Zpc2libGUgPSBmYWxzZSxcclxuICBfdHVybmVkb24gPSB0cnVlLFxyXG5cclxuICBfZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfaWQ7XHJcbiAgfSxcclxuXHJcbiAgX2lzVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF92aXNpYmxlO1xyXG4gIH0sXHJcblxyXG4gIF9pc1R1cm5lZE9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3R1cm5lZG9uO1xyXG4gIH0sXHJcblxyXG4gIF9zaG93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IHRydWU7XHJcbiAgICBfZWxlbWVudC5zbGlkZURvd24oMjAwKTtcclxuICB9LFxyXG5cclxuICBfaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoIV90dXJuZWRvbikgcmV0dXJuO1xyXG4gICAgX3Zpc2libGUgPSBmYWxzZTtcclxuICAgIF9lbGVtZW50LnNsaWRlVXAoMjAwKTtcclxuICB9LFxyXG5cclxuICBfc2V0VHVybmVkT24gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdmFsdWUgPyBfc2hvdygpIDogX2hpZGUoKTtcclxuICAgIF90dXJuZWRvbiA9IHZhbHVlO1xyXG4gIH0sXHJcblxyXG4gIF90b2dnbGVWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfdmlzaWJsZSA/IF9oaWRlKCkgOiBfc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIF9lbGVtZW50LnNsaWRlVXAoMCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZXRJZDogX2dldElkLFxyXG4gICAgaXNWaXNpYmxlOiBfaXNWaXNpYmxlLFxyXG4gICAgaXNUdXJuZWRPbjogX2lzVHVybmVkT24sXHJcbiAgICBzaG93OiBfc2hvdyxcclxuICAgIGhpZGU6IF9oaWRlLFxyXG4gICAgc2V0VHVybmVkT246IF9zZXRUdXJuZWRPbixcclxuICAgIHRvZ2dsZTogX3RvZ2dsZVZpc2libGVcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVXaW5kb3c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IF9maW5kU2NyZWVuSW5kZXggPSBmdW5jdGlvbihhcnIsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zTGVuID0gYXJyLmxlbmd0aDtcclxuICBsZXQgb3V0cHV0O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyZWVuc0xlbjsgaSsrKSB7XHJcbiAgICBvdXRwdXQgPSBhcnJbaV0uc2NlbmVzICE9PSB1bmRlZmluZWQgPyBhcnJbaV0uc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNjZW5lID09PSBzY2VuZUluZGV4O1xyXG4gICAgfSkgOiBbXTtcclxuICAgIGlmKG91dHB1dC5sZW5ndGggPiAwKSByZXR1cm4gaTtcclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuY29uc3QgX2dldFNjcmVlbnNBcnJheSA9IGZ1bmN0aW9uKG5hdixjdXJyU2NlbmUpIHtcclxuICBsZXQgaXNIaWRkZW4gPSBfaXNTY2VuZUhpZGRlbihuYXYuaGlkZGVuLGN1cnJTY2VuZSk7XHJcbiAgcmV0dXJuIGlzSGlkZGVuID8gbmF2LmhpZGRlbiA6IG5hdi5zY3JlZW5zO1xyXG59O1xyXG5cclxuY29uc3QgX2lzU2NlbmVIaWRkZW4gPSBmdW5jdGlvbihhcnIsc2NlbmVJbmRleCkge1xyXG4gIHJldHVybiBhcnIuZmlsdGVyKHNjciA9PiB7XHJcbiAgICByZXR1cm4gc2NyLnNjZW5lcy5maWx0ZXIoc2NlbmUgPT4ge1xyXG4gICAgICByZXR1cm4gc2NlbmUgPT09IHNjZW5lSW5kZXg7XHJcbiAgICB9KS5sZW5ndGggPiAwO1xyXG4gIH0pLmxlbmd0aCA+IDA7XHJcbn07XHJcblxyXG5jb25zdCBfZ2V0UHJldlNjZW5lSW5kZXggPSBmdW5jdGlvbihhcnIsY3VyclNjZW5lKSB7XHJcbiAgbGV0IHNjcmVlbkluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChhcnIsY3VyclNjZW5lKTtcclxuICBsZXQgc2NyZWVuLCBzY2VuZXMsIHNjZW5lSW5kZXg7XHJcblxyXG4gIGlmKHNjcmVlbkluZGV4ID49IDApIHtcclxuICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleF07XHJcbiAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgc2NlbmVJbmRleCA9IHNjZW5lcy5pbmRleE9mKGN1cnJTY2VuZSk7XHJcbiAgICBpZihzY2VuZUluZGV4ID4gMCl7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVJbmRleCAtIDFdO1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbi5wcmV2ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gc2NyZWVuLnByZXY7XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuSW5kZXggPiAwKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4IC0gMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVzLmxlbmd0aC0xXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuY29uc3QgX2dldE5leHRTY2VuZUluZGV4ID0gZnVuY3Rpb24oYXJyLGN1cnJTY2VuZSkge1xyXG4gIGxldCBzY3JlZW5JbmRleCA9IF9maW5kU2NyZWVuSW5kZXgoYXJyLGN1cnJTY2VuZSk7XHJcbiAgbGV0IHNjcmVlbiwgc2NlbmVzLCBzY2VuZUluZGV4O1xyXG5cclxuICBpZihzY3JlZW5JbmRleCA+PSAwKSB7XHJcbiAgICBzY3JlZW4gPSBhcnJbc2NyZWVuSW5kZXhdO1xyXG4gICAgc2NlbmVzID0gc2NyZWVuLnNjZW5lcztcclxuICAgIHNjZW5lSW5kZXggPSBzY2VuZXMuaW5kZXhPZihjdXJyU2NlbmUpO1xyXG4gICAgaWYoc2NlbmVJbmRleCA8IHNjZW5lcy5sZW5ndGggLSAxKXtcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZUluZGV4ICsgMV07XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuLm5leHQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHJldHVybiBzY3JlZW4ubmV4dDtcclxuICAgIH0gZWxzZSBpZihzY3JlZW5JbmRleCA8IGFyci5sZW5ndGggLSAxKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4ICsgMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbMF07XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAtMTtcclxufTtcclxuXHJcbmNvbnN0IGdldEN1cnJlbnRTY3JlZW5JbmZvID0gZnVuY3Rpb24obmF2LHNjZW5lSW5kZXgpIHtcclxuICBsZXQgc2NyZWVucyA9IF9nZXRTY3JlZW5zQXJyYXkobmF2LHNjZW5lSW5kZXgpO1xyXG4gIGxldCBpbmRleCA9IF9maW5kU2NyZWVuSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KTtcclxuICBsZXQgc2NyZWVuID0gaW5kZXggPj0gMCA/IHNjcmVlbnNbaW5kZXhdIDogbnVsbDtcclxuICAvL2NvbnNvbGUubG9nKCdnZXRDdXJyZW50U2NyZWVuSW5mbycsaW5kZXgsc2NyZWVuLHNjZW5lSW5kZXgpO1xyXG4gIHJldHVybiB7XHJcbiAgICBpbmRleDogaW5kZXgsXHJcbiAgICBucjogc2NyZWVuLm5yLFxyXG4gICAgbGFiZWw6IHNjcmVlbi5sYWJlbCxcclxuICAgIGN1cnJTY2VuZTogc2NyZWVuLnNjZW5lcy5pbmRleE9mKHNjZW5lSW5kZXgpLFxyXG4gICAgdG90YWxTY2VuZXM6IHNjcmVlbi5zY2VuZXMubGVuZ3RoLFxyXG4gICAgcHJldjogX2dldFByZXZTY2VuZUluZGV4KHNjcmVlbnMsc2NlbmVJbmRleCksXHJcbiAgICBuZXh0OiBfZ2V0TmV4dFNjZW5lSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KVxyXG4gIH07XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Z2V0Q3VycmVudFNjcmVlbkluZm99O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IF93aW5kb3dzID0gW107XHJcbiAgbGV0IF9jdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgY29uc3QgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9zaG93V2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IG51bGwgJiYgX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICBfY3VycmVudCA9IHdpZDtcclxuICAgICAgICB3Lndpbi5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IF9oaWRlV2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQgfHwgd2lkID09PSB1bmRlZmluZWQgfHwgd2lkID09PSBudWxsKSB7XHJcbiAgICAgICAgdy53aW4uaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIF9jdXJyZW50ID0gbnVsbDtcclxuICB9O1xyXG5cclxuICBjb25zdCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgX2dldFdpbmRvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIGxldCBfd2luID0gX3dpbmRvd3MuZmlsdGVyKHcgPT4ge1xyXG4gICAgICByZXR1cm4gdy53aW4uZ2V0SWQoKSA9PT0gbmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIF93aW4ubGVuZ3RoID4gMCA/IF93aW5bMF0gOiBudWxsO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0b2dnbGU6IF90b2dnbGVXaW5kb3csXHJcbiAgICBzaG93OiBfc2hvd1dpbmRvdyxcclxuICAgIGhpZGU6IF9oaWRlV2luZG93LFxyXG4gICAgYWRkV2luZG93OiBfYWRkV2luZG93LFxyXG4gICAgZ2V0V2luZG93OiBfZ2V0V2luZG93XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd01hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSByZXF1aXJlKCcuL1dpbmRvd01hbmFnZXInKTtcclxuY29uc3QgSGVhZGVyID0gcmVxdWlyZSgnLi9IZWFkZXInKTtcclxuY29uc3QgTmF2YmFyID0gcmVxdWlyZSgnLi9OYXZiYXInKTtcclxuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vTWVudScpO1xyXG5jb25zdCBUYWJsZU9mQ29udGVudHMgPSByZXF1aXJlKCcuL1RhYmxlT2ZDb250ZW50cycpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9OYXZpZ2F0aW9uJyk7XHJcbmNvbnN0IEludGVyYWN0aW9uVXRpbHMgPSByZXF1aXJlKCcuL0ludGVyYWN0aW9uVXRpbHMnKTtcclxuXHJcbmdsb2JhbC5tbiA9IChmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICAvL2xldCBteU92ZXJsYXk7XHJcbiAgbGV0IHdpbk1hbmFnZXIgPSBuZXcgV2luZG93TWFuYWdlcigpO1xyXG4gIGxldCBteUhlYWRlcjtcclxuICBsZXQgbXlUb2M7XHJcbiAgbGV0IG15TWVudTtcclxuICBsZXQgbXlOYXZiYXI7XHJcbiAgbGV0IG15TmF2aWdhdGlvbjtcclxuICBsZXQgaW50ZXJhY3Rpb25VdGlscyA9IG5ldyBJbnRlcmFjdGlvblV0aWxzKCk7XHJcblxyXG4gIC8qZnVuY3Rpb24gb25SZXNpemUoZSkge1xyXG4gICAgbGV0IHZpZXdwb3J0V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgIGxldCB2aWV3cG9ydEhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgIGxldCBsZWZ0ID0gMDtcclxuICAgIGxldCBzY2FsZSA9IDE7XHJcblxyXG4gICAgaWYodmlld3BvcnRXaWR0aCA8PSAxMjgwKSB7XHJcbiAgICAgIGxldCB3c2NhbGUgPSB2aWV3cG9ydFdpZHRoIC8gODAwO1xyXG4gICAgICBsZXQgaHNjYWxlID0gdmlld3BvcnRIZWlnaHQgLyA2MDA7XHJcbiAgICAgIHNjYWxlID0gTWF0aC5taW4od3NjYWxlLGhzY2FsZSk7XHJcbiAgICAgIGxlZnQgPSAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGVmdCA9ICh2aWV3cG9ydFdpZHRoIC0gKDgwMCAqIHNjYWxlKSkgKiAuNTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBzY2FsZSwgbGVmdCk7XHJcbiAgICAkKCcjbWFpbl9jb250YWluZXInKS5hdHRyKCdzdHlsZScsYFxyXG4gICAgICB0b3A6IDBweDtcclxuICAgICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgICBsZWZ0OiAke2xlZnR9cHg7XHJcbiAgICAgIHdpZHRoOiA4MDBweDtcclxuICAgICAgaGVpZ2h0OiA2MDBweDtcclxuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdCB0b3AgMHB4O1xyXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKCR7c2NhbGV9KTtcclxuICAgIGApO1xyXG4gIH0qL1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vZHVsZVJlYWR5RXZlbnRcIiwgZnVuY3Rpb24oZXZ0KVxyXG4gIHtcclxuICAgIGNwSW50ZXJmYWNlID0gZXZ0LkRhdGE7XHJcbiAgICAvL3dpbmRvdy5jcC5TZXRTY2FsZUFuZFBvc2l0aW9uID0gZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fTtcclxuICAgICQuZ2V0SlNPTihcIm5hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uID0gbmV3IE5hdmlnYXRpb24oY3BJbnRlcmZhY2Usd2luTWFuYWdlcixkYXRhKTtcclxuXHJcbiAgICAgICAgbXlIZWFkZXIgPSBuZXcgSGVhZGVyKGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlIZWFkZXIpO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteUhlYWRlcik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteVRvYyk7XHJcbiAgICAgICAgbXlNZW51ID0gbmV3IE1lbnUoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteU1lbnUpO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteU1lbnUpO1xyXG4gICAgICAgIG15TmF2YmFyID0gbmV3IE5hdmJhcihjcEludGVyZmFjZSxteU5hdmlnYXRpb24pO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteU5hdmJhcik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy9vblJlc2l6ZSgpO1xyXG4gIC8vJCggd2luZG93ICkucmVzaXplKG9uUmVzaXplKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGludDppbnRlcmFjdGlvblV0aWxzXHJcbiAgfVxyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtbjtcclxuIl19
