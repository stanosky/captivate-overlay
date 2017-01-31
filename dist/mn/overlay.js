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

  var _isVarEqual = function _isVarEqual(variable, value) {
    return cpApi.getVariableValue(variable) === value;
  };

  var _areVarsEqual = function _areVarsEqual(variables, values) {
    var equalVars = variables.filter(function (v, i) {
      return _isVarEqual(v, values[i]);
    });
    return equalVars.length === variables.length;
  };

  return {
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

var Navigation = function Navigation(cpApi, winManager, data) {
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
  };

  var _onSlideExit = function _onSlideExit(e) {
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', _onHighlight, 'highlight');
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', _onFrameChange, 'cpInfoCurrentFrame');
  };

  var _onHighlight = function _onHighlight(e) {
    if (e.Data.newVal === 1) cp.D[cpSlideId].mnc = true;
    _update();
  };

  var _onFrameChange = function _onFrameChange(e) {
    var isBlocked = _isQuiz() || _isInteraction();
    //console.log('from',cp.D[cpSlideId].from,"to",cp.D[cpSlideId].to);
    if (cp.D[cpSlideId].to - 1 === e.Data.newVal && !isBlocked) {
      cpApi.pause();
      if (!_isInteraction() && !_isQuiz()) cpApi.setVariableValue('highlight', 1);
      _update();
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
  var myOverlay = void 0;
  var winManager = new WindowManager();
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  var myNavigation = void 0;
  var interactionUtils = new InteractionUtils(window.cpAPIInterface);

  myOverlay = $('#mnoverlay');

  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;

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

  return {
    int: interactionUtils
  };
}();

module.exports = mn;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Header":1,"./InteractionUtils":2,"./Menu":3,"./Navbar":4,"./Navigation":5,"./TableOfContents":6,"./WindowManager":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxJbnRlcmFjdGlvblV0aWxzLmpzIiwic3JjXFxqc1xcTWVudS5qcyIsInNyY1xcanNcXE5hdmJhci5qcyIsInNyY1xcanNcXE5hdmlnYXRpb24uanMiLCJzcmNcXGpzXFxUYWJsZU9mQ29udGVudHMuanMiLCJzcmNcXGpzXFxUb2dnbGVXaW5kb3cuanMiLCJzcmNcXGpzXFxVdGlscy5qcyIsInNyY1xcanNcXFdpbmRvd01hbmFnZXIuanMiLCJzcmNcXGpzXFxzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZ0JBQVIsQ0FBckI7QUFDQSxJQUFNLFFBQVEsUUFBUSxTQUFSLENBQWQ7O0FBR0EsSUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFVLEtBQVYsRUFBZ0IsR0FBaEIsRUFBb0I7QUFDL0IsTUFBSSxNQUFNLElBQUksWUFBSixDQUFpQixVQUFqQixDQUFWO0FBQ0EsTUFBSSxhQUFhLEVBQUUsYUFBRixDQUFqQjtBQUNBLE1BQUksY0FBYyxFQUFFLGNBQUYsQ0FBbEI7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCO0FBQ0EsTUFBSSxTQUFTLEVBQUUsV0FBRixDQUFiO0FBQ0EsTUFBSSxrQkFBSjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzVCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7QUFHQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxRQUFJLElBQUo7QUFDRCxHQUhEOztBQUtBLE1BQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUMzQjtBQUNBLFFBQUksSUFBSjtBQUNELEdBSEQ7O0FBS0EsTUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFZO0FBQ3RCO0FBQ0Es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RUFBWixBQUFZLEFBQUUsQUFFZDs7U0FBQSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixVQUFBLEFBQVMsS0FDckQsQUFDRTtrQkFBYyxJQUFkLEFBQWtCLEFBRWxCOztNQUFBLEFBQUUsUUFBRixBQUFVLG1CQUFtQixVQUFBLEFBQVMsTUFBTSxBQUN4QztxQkFBZSxJQUFBLEFBQUksV0FBSixBQUFlLGFBQWYsQUFBMkIsWUFBMUMsQUFBZSxBQUFzQyxBQUVyRDs7aUJBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxhQUF0QixBQUFXLEFBQXVCLEFBQ2xDO2lCQUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjttQkFBQSxBQUFhLFlBQWIsQUFBeUIsQUFDekI7Y0FBUSxJQUFBLEFBQUksZ0JBQUosQUFBb0IsYUFBNUIsQUFBUSxBQUFnQyxBQUN4QztpQkFBQSxBQUFXLFVBQVgsQUFBcUIsQUFDckI7bUJBQUEsQUFBYSxZQUFiLEFBQXlCLEFBQ3pCO2VBQVMsSUFBQSxBQUFJLEtBQUosQUFBUyxhQUFsQixBQUFTLEFBQXFCLEFBQzlCO2lCQUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjttQkFBQSxBQUFhLFlBQWIsQUFBeUIsQUFDekI7aUJBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxhQUF0QixBQUFXLEFBQXVCLEFBQ2xDO21CQUFBLEFBQWEsWUFqQm5CLEFBSUUsQUFhSSxBQUF5QixBQUU1QixBQUNGLEFBRUQ7Ozs7O1NBbkNGLEFBQVksQUFBQyxBQW1DWCxBQUFPLEFBQ0wsQUFBSSxBQUVQOzs7O0FBRUQsT0FBQSxBQUFPLFVBQVAsQUFBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcclxuXHJcblxyXG5sZXQgSGVhZGVyID0gZnVuY3Rpb24gKGNwQXBpLG5hdil7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21uaGVhZGVyJyk7XHJcbiAgbGV0IGNvdXJzZU5hbWUgPSAkKCcjY291cnNlTmFtZScpO1xyXG4gIGxldCBzbGlkZU51bWJlciA9ICQoJyNzbGlkZU51bWJlcicpO1xyXG4gIGxldCBzbGlkZU5hbWUgPSAkKCcjc2xpZGVOYW1lJyk7XHJcbiAgbGV0IGhlYWRlciA9ICQoJyNtbmhlYWRlcicpO1xyXG4gIGxldCB0aW1lb3V0SWQ7XHJcbiAgbGV0IGN1cnJTY3JlZW47XHJcblxyXG4gIGxldCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG4gIGxldCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93SGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIGxldCBibGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHNob3dIZWFkZXIoKTtcclxuICAgIHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGhpZGVIZWFkZXIsMjAwMCk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgbGV0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBzY3JlZW5JbmZvID0gbmF2LmdldFNjcmVlbkluZm8oKTtcclxuICAgIGlmKGN1cnJTY3JlZW4gIT09IHNjcmVlbkluZm8uaW5kZXgpIHtcclxuICAgICAgY3VyclNjcmVlbiA9IHNjcmVlbkluZm8uaW5kZXg7XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuZ2V0Q291cnNlTmFtZSgpKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChzY3JlZW5JbmZvLm5yKycuJyk7XHJcbiAgICAgIHNsaWRlTmFtZS5odG1sKHNjcmVlbkluZm8ubGFiZWwpO1xyXG4gICAgICBibGluaygpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBJbnRlcmFjdGlvblV0aWxzID0gZnVuY3Rpb24oY3BBcGkpIHtcclxuXHJcbiAgbGV0IF9pc1ZhckVxdWFsID0gZnVuY3Rpb24odmFyaWFibGUsdmFsdWUpIHtcclxuICAgIHJldHVybiBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKHZhcmlhYmxlKSA9PT0gdmFsdWU7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9hcmVWYXJzRXF1YWwgPSBmdW5jdGlvbih2YXJpYWJsZXMsdmFsdWVzKSB7XHJcbiAgICB2YXIgZXF1YWxWYXJzID0gdmFyaWFibGVzLmZpbHRlcigodixpKSA9PiB7XHJcbiAgICAgIHJldHVybiBfaXNWYXJFcXVhbCh2LHZhbHVlc1tpXSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBlcXVhbFZhcnMubGVuZ3RoID09PSB2YXJpYWJsZXMubGVuZ3RoO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAge1xyXG4gICAgaXNWYXJFcXVhbDpfaXNWYXJFcXVhbCxcclxuICAgIGFyZVZhcnNFcXVhbDpfYXJlVmFyc0VxdWFsXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGlvblV0aWxzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSxuYXYpIHtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5tZW51Jyk7XHJcblxyXG4gICQoJyNtZW51LXRvYycpLmNsaWNrKGUgPT4gbmF2LnNob3dXaW5kb3coJ21udG9jJykpO1xyXG4gICQoJyNtZW51LWV4aXQnKS5jbGljayhlID0+IGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEV4aXQnLDEpKTtcclxuICAkKCcjbWVudS1wcmludCcpLmNsaWNrKGUgPT4gd2luZG93LnByaW50KCkpO1xyXG5cclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLmNoZWNrZWQgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJykgPT09IDA7XHJcbiAgJCgnI21lbnUtc291bmQnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJyxlLnRhcmdldC5jaGVja2VkID8gMCA6IDEpO1xyXG4gIH07XHJcblxyXG4gICQoJyNtZW51LXZvbHVtZScpWzBdLnZhbHVlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kVm9sdW1lJyk7XHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kVm9sdW1lJyxlLnRhcmdldC52YWx1ZSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtaGVhZGVyJylbMF0uY2hlY2tlZCA9IG5hdi5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBuYXYuZ2V0V2luZG93KCdtbmhlYWRlcicpLndpbi5zZXRUdXJuZWRPbihlLnRhcmdldC5jaGVja2VkKTtcclxuICB9XHJcbiAgbGV0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZSBtZW51Jyk7XHJcbiAgfTtcclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHcsXHJcbiAgICB1cGRhdGU6IF91cGRhdGVcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG5sZXQgTmF2YmFyID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBuYXZiYXIgPSAkKCcjbW5uYXZiYXInKTtcclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuXHJcbiAgZnVuY3Rpb24gX3VwZGF0ZSgpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZSBuYXZiYXInKTtcclxuICAgIGxldCBzY3JlZW5JbmZvID0gbmF2LmdldFNjcmVlbkluZm8oKTtcclxuICAgIGxldCBpc1F1aXogPSBuYXYuaXNRdWl6KCk7XHJcbiAgICBsZXQgaXNJbnRlcmFjdGlvbiA9IG5hdi5pc0ludGVyYWN0aW9uKCk7XHJcbiAgICBsZXQgdG90YWxTY3JlZW5zID0gbmF2LmdldFNjcmVlbnMoKS5sZW5ndGg7XHJcblxyXG4gICAgJCgnI25hdi1uZXh0JylbMF0uZGlzYWJsZWQgPSBpc1F1aXogfHwgaXNJbnRlcmFjdGlvbiB8fCBzY3JlZW5JbmZvLm5leHQgPT09IC0xO1xyXG4gICAgJCgnI25hdi1wcmV2JylbMF0uZGlzYWJsZWQgPSBpc1F1aXogfHwgc2NyZWVuSW5mby5wcmV2ID09PSAtMTtcclxuICAgICQoJyNuYXYtdG9jJylbMF0uZGlzYWJsZWQgPSBpc1F1aXo7XHJcbiAgICAkKCcjbWVudS10b2MnKVswXS5kaXNhYmxlZCA9IGlzUXVpejtcclxuXHJcbiAgICBpZihuYXYuaXNDb21wbGV0ZWQoKSAmJiBzY3JlZW5JbmZvLm5leHQgIT09IC0xKSB7XHJcbiAgICAgICQoJyNuYXYtbmV4dCArIGxhYmVsJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI25hdi1uZXh0ICsgbGFiZWwnKS5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9jcG9zaXRpb24uaHRtbCgoc2NyZWVuSW5mby5ucikgKyAnLycgKyB0b3RhbFNjcmVlbnMpO1xyXG4gIH1cclxuXHJcblxyXG4gICQoJyNuYXYtbmV4dCcpLmNsaWNrKChlKSA9PiBuYXYubmV4dCgpKTtcclxuICAkKCcjbmF2LXByZXYnKS5jbGljaygoZSkgPT4gbmF2LnByZXYoKSk7XHJcbiAgJCgnI25hdi10b2MnKS5jbGljaygoZSkgPT4gbmF2LnRvZ2dsZVdpbmRvdygnbW50b2MnKSk7XHJcbiAgJCgnI25hdi1tZW51JykuY2xpY2soKGUpID0+IG5hdi50b2dnbGVXaW5kb3coJ21ubWVudScpKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xyXG5cclxubGV0IE5hdmlnYXRpb24gPSBmdW5jdGlvbihjcEFwaSx3aW5NYW5hZ2VyLGRhdGEpIHtcclxuICBsZXQgb2JzZXJ2ZXJzID0gW107XHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGNwQXBpLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGxldCBuYXZEYXRhID0gZGF0YTtcclxuXHJcbiAgbGV0IGNwU2xpZGVMYWJlbDtcclxuICBsZXQgY3BTbGlkZU51bWJlcjtcclxuICBsZXQgY3BTbGlkZUlkO1xyXG5cclxuICBsZXQgc2NlbmVJbmRleDtcclxuICBsZXQgdG90YWxTY3JlZW5zID0gbmF2RGF0YS5zY3JlZW5zLmxlbmd0aDtcclxuICBsZXQgc2NyZWVuSW5mbztcclxuXHJcblxyXG4gIGxldCBfbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY3JlZW5JbmZvLm5leHQpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9wcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjcmVlbkluZm8ucHJldik7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgX2FkZE9ic2VydmVyID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBvYnNlcnZlcnMucHVzaChvYmopO1xyXG4gIH07XHJcblxyXG4gIGxldCBfZ2V0U2NyZWVucyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5hdkRhdGEuc2NyZWVucztcclxuICB9O1xyXG5cclxuICBsZXQgX2lzQ29tcGxldGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gY3AuRFtjcFNsaWRlSWRdLm1uY1xyXG4gIH07XHJcblxyXG4gIGxldCBfaXNJbnRlcmFjdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGNwU2xpZGVMYWJlbCA9PT0gJ21uSW50ZXJhY3Rpb24nICYmICFfaXNDb21wbGV0ZWQoKTtcclxuICB9O1xyXG5cclxuICBsZXQgX2lzUXVpeiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGNwU2xpZGVMYWJlbCA9PT0gJ21uUXVpeic7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRTY3JlZW5JbmZvID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gc2NyZWVuSW5mbztcclxuICB9XHJcblxyXG4gIGxldCBfdG9nZ2xlV2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgd2luTWFuYWdlci50b2dnbGUod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRDb3Vyc2VOYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmF2RGF0YS5jb3Vyc2VOYW1lO1xyXG4gIH07XHJcblxyXG4gIGxldCBfZ2V0V2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbk1hbmFnZXIuZ2V0V2luZG93KHdpbk5hbWUpO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uKHdpbk5hbWUpIHtcclxuICAgIHJldHVybiB3aW5NYW5hZ2VyLnNob3cod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9oaWRlV2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbk1hbmFnZXIuaGlkZSh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBsZXQgX29uU2xpZGVFbnRlciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgY3BTbGlkZUxhYmVsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKTtcclxuICAgIGNwU2xpZGVOdW1iZXIgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGUnKTtcclxuICAgIGNwU2xpZGVJZCA9IG5hdkRhdGEuc2lkc1tjcFNsaWRlTnVtYmVyLTFdO1xyXG5cclxuICAgIHNjZW5lSW5kZXggPSBjcFNsaWRlTnVtYmVyIC0gMTtcclxuICAgIHNjcmVlbkluZm8gPSBVdGlscy5nZXRDdXJyZW50U2NyZWVuSW5mbyhuYXZEYXRhLHNjZW5lSW5kZXgpO1xyXG4gICAgX3VwZGF0ZSgpO1xyXG5cclxuICAgIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uSGlnaGxpZ2h0LCdoaWdobGlnaHQnKTtcclxuICAgIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uRnJhbWVDaGFuZ2UsJ2NwSW5mb0N1cnJlbnRGcmFtZScpO1xyXG5cclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2hpZ2hsaWdodCcsMCk7XHJcbiAgICBjcEFwaS5wbGF5KCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9vblNsaWRlRXhpdCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGV2ZW50RW1pdHRlck9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uSGlnaGxpZ2h0LCdoaWdobGlnaHQnKTtcclxuICAgIGV2ZW50RW1pdHRlck9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsX29uRnJhbWVDaGFuZ2UsJ2NwSW5mb0N1cnJlbnRGcmFtZScpO1xyXG4gIH07XHJcblxyXG4gIGxldCBfb25IaWdobGlnaHQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZihlLkRhdGEubmV3VmFsID09PSAxKSBjcC5EW2NwU2xpZGVJZF0ubW5jID0gdHJ1ZTtcclxuICAgIF91cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgX29uRnJhbWVDaGFuZ2UgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBsZXQgaXNCbG9ja2VkID0gX2lzUXVpeigpIHx8IF9pc0ludGVyYWN0aW9uKCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdmcm9tJyxjcC5EW2NwU2xpZGVJZF0uZnJvbSxcInRvXCIsY3AuRFtjcFNsaWRlSWRdLnRvKTtcclxuICAgIGlmKGNwLkRbY3BTbGlkZUlkXS50by0xID09PSBlLkRhdGEubmV3VmFsICYmICFpc0Jsb2NrZWQpIHtcclxuICAgICAgY3BBcGkucGF1c2UoKTtcclxuICAgICAgaWYoIV9pc0ludGVyYWN0aW9uKCkgJiYgIV9pc1F1aXooKSkgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywxKTtcclxuICAgICAgX3VwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGxldCBfdXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBvYnNlcnZlcnMubWFwKG8gPT4gby51cGRhdGUoKSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gRG8gZGFueWNoIHNsYWpkdSwgZG9kYWplbXkgcGFyYW1ldHIgXCJtbmNcIiBva3JlxZtsYWrEhWN5LFxyXG4gIC8vIGN6eSBla3JhbiB6b3N0YcWCIHphbGljem9ueSAoc2tyw7N0IG9kIG1uY29tcGxldGUpLlxyXG4gIC8vIERvbXnFm2xuaWUgbmFkYWplbXkgbXUgdMSFIHNhbcSFIHdhcnRvxZtjIGNvIHBhcmFtZXRyIFwidlwiICh2aXNpdGVkKVxyXG4gIC8vIHoga29sZWpuZWdvIHNsYWpkdS5cclxuICAvLyBQYXJhbWV0ciBcIm1uY1wiIGLEmWR6aWUgcMOzxbpuaWVqIHd5a29yenlzdHl3YW55IGRvIHN0d2llcmR6ZW5pYSxcclxuICAvLyBjenkgcHJ6ZWrFm2NpZSBkbyBuYXN0xJlwbmVnbyBla3JhbnUgbmFsZcW8eSB6YWJsb2tvd2FjLlxyXG4gIG5hdkRhdGEuc2lkcyA9IGNwLkQucHJvamVjdF9tYWluLnNsaWRlcy5zcGxpdCgnLCcpO1xyXG4gIG5hdkRhdGEuc2lkcy5tYXAoKHNpZCxpbmRleCxhcnIpID0+IHtcclxuICAgIGxldCBpc05leHRTbGlkZSA9IGluZGV4ICsgMSA8IGFyci5sZW5ndGg7XHJcbiAgICBjcC5EW3NpZF0ubW5jID0gaXNOZXh0U2xpZGUgPyBjcC5EW2FycltpbmRleCsxXV0udiA6IGZhbHNlO1xyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsX29uU2xpZGVFbnRlcik7XHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRVhJVCcsX29uU2xpZGVFeGl0KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG5leHQ6IF9uZXh0LFxyXG4gICAgcHJldjogX3ByZXYsXHJcbiAgICBpc0NvbXBsZXRlZDogX2lzQ29tcGxldGVkLFxyXG4gICAgaXNJbnRlcmFjdGlvbjogX2lzSW50ZXJhY3Rpb24sXHJcbiAgICBpc1F1aXo6IF9pc1F1aXosXHJcbiAgICBnZXRTY3JlZW5JbmZvOiBfZ2V0U2NyZWVuSW5mbyxcclxuICAgIGdldENvdXJzZU5hbWU6IF9nZXRDb3Vyc2VOYW1lLFxyXG4gICAgYWRkT2JzZXJ2ZXI6IF9hZGRPYnNlcnZlcixcclxuICAgIHRvZ2dsZVdpbmRvdzogX3RvZ2dsZVdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvdyxcclxuICAgIHNob3dXaW5kb3c6IF9zaG93V2luZG93LFxyXG4gICAgaGlkZVdpbmRvdzogX2hpZGVXaW5kb3csXHJcbiAgICBnZXRTY3JlZW5zOiBfZ2V0U2NyZWVuc1xyXG4gIH07XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbjtcclxuXHJcblxyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsZnVuY3Rpb24oZSkge1xyXG4vLyAgY29uc29sZS5sb2coJ2NwUXVpekluZm9BbnN3ZXJDaG9pY2UnLGUuRGF0YSk7XHJcbi8vfSwnY3BRdWl6SW5mb0Fuc3dlckNob2ljZScpO1xyXG5cclxuXHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgLy9jb25zb2xlLmxvZygnQ1BBUElfTU9WSUVQQVVTRScpO1xyXG4gIC8vJCgnI25hdi1uZXh0JykuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4vL30pO1xyXG5cclxuLy9ldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVTVE9QJywgZnVuY3Rpb24oZSkge1xyXG4gIC8vY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4vL30pO1xyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLCBmdW5jdGlvbiAoZSkge1xyXG4gIC8vY29uc29sZS5sb2coJ0NQQVBJX0lOVEVSQUNUSVZFSVRFTVNVQk1JVCcsZS5EYXRhKTtcclxuLy99KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxubGV0IFRhYmVsT2ZDb250ZW50cyA9IGZ1bmN0aW9uIChjcEFwaSxuYXYpIHtcclxuICBsZXQgX21udG9jID0gJCgnI21udG9jJyk7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21udG9jJyk7XHJcblxyXG4gIGxldCBvdXRwdXQgPSBbXTtcclxuICBsZXQgc2NyZWVucyA9IG5hdi5nZXRTY3JlZW5zKCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JlZW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBvdXRwdXQucHVzaChcIjxkaXY+PGlucHV0IHR5cGU9J2J1dHRvbicgbmFtZT0ndG9jLWl0ZW0nIGlkPSd0b2MtaXRlbS1cIitpK1wiJz5cIitcclxuICAgICAgICAgICAgICAgIFwiPGxhYmVsIGZvcj0ndG9jLWl0ZW0tXCIraStcIic+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdmYSBmYS1tYXAtbWFya2VyIGZhLWxnJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8c3Bhbj5cIitzY3JlZW5zW2ldLm5yK1wiLjwvc3Bhbj4mbmJzcDsmbmJzcDtcIitcclxuICAgICAgICAgICAgICAgIHNjcmVlbnNbaV0ubGFiZWwrXCI8L2xhYmVsPjwvZGl2PlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgc2NyZWVuSW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBsZXQgc2NlbmVJbmRleCA9IHNjcmVlbnNbc2NyZWVuSW5kZXhdLnNjZW5lc1swXTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NlbmVJbmRleCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvRnJhbWVBbmRSZXN1bWUnLDApO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgbGV0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZSB0b2MnKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHcsXHJcbiAgICB1cGRhdGU6IF91cGRhdGVcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJlbE9mQ29udGVudHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBUb2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgX2lkID0gaWQ7XHJcbiAgbGV0IF9lbGVtZW50ID0gJCgnIycrX2lkKSxcclxuICBfdmlzaWJsZSA9IGZhbHNlLFxyXG4gIF90dXJuZWRvbiA9IHRydWUsXHJcblxyXG4gIF9nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9pZDtcclxuICB9LFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3Zpc2libGU7XHJcbiAgfSxcclxuXHJcbiAgX2lzVHVybmVkT24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdHVybmVkb247XHJcbiAgfSxcclxuXHJcbiAgX3Nob3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gdHJ1ZTtcclxuICAgIF9lbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVVcCgyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9zZXRUdXJuZWRPbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA/IF9zaG93KCkgOiBfaGlkZSgpO1xyXG4gICAgX3R1cm5lZG9uID0gdmFsdWU7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGUoKSA6IF9zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBpc1R1cm5lZE9uOiBfaXNUdXJuZWRPbixcclxuICAgIHNob3c6IF9zaG93LFxyXG4gICAgaGlkZTogX2hpZGUsXHJcbiAgICBzZXRUdXJuZWRPbjogX3NldFR1cm5lZE9uLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IF9maW5kU2NyZWVuSW5kZXggPSBmdW5jdGlvbihhcnIsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zTGVuID0gYXJyLmxlbmd0aDtcclxuICBsZXQgb3V0cHV0O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyZWVuc0xlbjsgaSsrKSB7XHJcbiAgICBvdXRwdXQgPSBhcnJbaV0uc2NlbmVzICE9PSB1bmRlZmluZWQgPyBhcnJbaV0uc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNjZW5lID09PSBzY2VuZUluZGV4O1xyXG4gICAgfSkgOiBbXTtcclxuICAgIGlmKG91dHB1dC5sZW5ndGggPiAwKSByZXR1cm4gaTtcclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxubGV0IF9nZXRTY3JlZW5zQXJyYXkgPSBmdW5jdGlvbihuYXYsY3VyclNjZW5lKSB7XHJcbiAgbGV0IGlzSGlkZGVuID0gX2lzU2NlbmVIaWRkZW4obmF2LmhpZGRlbixjdXJyU2NlbmUpO1xyXG4gIHJldHVybiBpc0hpZGRlbiA/IG5hdi5oaWRkZW4gOiBuYXYuc2NyZWVucztcclxufTtcclxuXHJcbmxldCBfaXNTY2VuZUhpZGRlbiA9IGZ1bmN0aW9uKGFycixzY2VuZUluZGV4KSB7XHJcbiAgcmV0dXJuIGFyci5maWx0ZXIoc2NyID0+IHtcclxuICAgIHJldHVybiBzY3Iuc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgIHJldHVybiBzY2VuZSA9PT0gc2NlbmVJbmRleDtcclxuICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgfSkubGVuZ3RoID4gMDtcclxufTtcclxuXHJcbmxldCBfZ2V0UHJldlNjZW5lSW5kZXggPSBmdW5jdGlvbihhcnIsY3VyclNjZW5lKSB7XHJcbiAgbGV0IHNjcmVlbkluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChhcnIsY3VyclNjZW5lKTtcclxuICBsZXQgc2NyZWVuLCBzY2VuZXMsIHNjZW5lSW5kZXg7XHJcblxyXG4gIGlmKHNjcmVlbkluZGV4ID49IDApIHtcclxuICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleF07XHJcbiAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgc2NlbmVJbmRleCA9IHNjZW5lcy5pbmRleE9mKGN1cnJTY2VuZSk7XHJcbiAgICBpZihzY2VuZUluZGV4ID4gMCl7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVJbmRleCAtIDFdO1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbi5wcmV2ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gc2NyZWVuLnByZXY7XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuSW5kZXggPiAwKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4IC0gMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVzLmxlbmd0aC0xXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxubGV0IF9nZXROZXh0U2NlbmVJbmRleCA9IGZ1bmN0aW9uKGFycixjdXJyU2NlbmUpIHtcclxuICBsZXQgc2NyZWVuSW5kZXggPSBfZmluZFNjcmVlbkluZGV4KGFycixjdXJyU2NlbmUpO1xyXG4gIGxldCBzY3JlZW4sIHNjZW5lcywgc2NlbmVJbmRleDtcclxuXHJcbiAgaWYoc2NyZWVuSW5kZXggPj0gMCkge1xyXG4gICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4XTtcclxuICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICBzY2VuZUluZGV4ID0gc2NlbmVzLmluZGV4T2YoY3VyclNjZW5lKTtcclxuICAgIGlmKHNjZW5lSW5kZXggPCBzY2VuZXMubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVJbmRleCArIDFdO1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbi5uZXh0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gc2NyZWVuLm5leHQ7XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuSW5kZXggPCBhcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleCArIDFdO1xyXG4gICAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgICByZXR1cm4gc2NlbmVzWzBdO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5sZXQgZ2V0Q3VycmVudFNjcmVlbkluZm8gPSBmdW5jdGlvbihuYXYsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zID0gX2dldFNjcmVlbnNBcnJheShuYXYsc2NlbmVJbmRleCk7XHJcbiAgbGV0IGluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChzY3JlZW5zLHNjZW5lSW5kZXgpO1xyXG4gIGxldCBzY3JlZW4gPSBpbmRleCA+PSAwID8gc2NyZWVuc1tpbmRleF0gOiBudWxsO1xyXG4gIC8vY29uc29sZS5sb2coJ2dldEN1cnJlbnRTY3JlZW5JbmZvJyxpbmRleCxzY3JlZW4sc2NlbmVJbmRleCk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGluZGV4OiBpbmRleCxcclxuICAgIG5yOiBzY3JlZW4ubnIsXHJcbiAgICBsYWJlbDogc2NyZWVuLmxhYmVsLFxyXG4gICAgcHJldjogX2dldFByZXZTY2VuZUluZGV4KHNjcmVlbnMsc2NlbmVJbmRleCksXHJcbiAgICBuZXh0OiBfZ2V0TmV4dFNjZW5lSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KVxyXG4gIH07XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Z2V0Q3VycmVudFNjcmVlbkluZm99O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgV2luZG93TWFuYWdlciA9IGZ1bmN0aW9uKCkge1xyXG4gIGxldCBfd2luZG93cyA9IFtdO1xyXG4gIGxldCBfY3VycmVudCA9IG51bGw7XHJcblxyXG4gIGxldCBfdG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICB3Lndpbi50b2dnbGUoKTtcclxuICAgICAgICBfY3VycmVudCA9IHcud2luLmlzVmlzaWJsZSgpID8gd2lkIDogbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9zaG93V2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IG51bGwgJiYgX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICBfY3VycmVudCA9IHdpZDtcclxuICAgICAgICB3Lndpbi5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfaGlkZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkIHx8IHdpZCA9PT0gdW5kZWZpbmVkIHx8IHdpZCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHcud2luLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBfY3VycmVudCA9IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9hZGRXaW5kb3cgPSBmdW5jdGlvbih3aW5PYmopIHtcclxuICAgIF93aW5kb3dzLnB1c2god2luT2JqKTtcclxuICB9O1xyXG5cclxuICBsZXQgX2dldFdpbmRvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIGxldCBfd2luID0gX3dpbmRvd3MuZmlsdGVyKHcgPT4ge1xyXG4gICAgICByZXR1cm4gdy53aW4uZ2V0SWQoKSA9PT0gbmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIF93aW4ubGVuZ3RoID4gMCA/IF93aW5bMF0gOiBudWxsO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0b2dnbGU6IF90b2dnbGVXaW5kb3csXHJcbiAgICBzaG93OiBfc2hvd1dpbmRvdyxcclxuICAgIGhpZGU6IF9oaWRlV2luZG93LFxyXG4gICAgYWRkV2luZG93OiBfYWRkV2luZG93LFxyXG4gICAgZ2V0V2luZG93OiBfZ2V0V2luZG93XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd01hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSByZXF1aXJlKCcuL1dpbmRvd01hbmFnZXInKTtcclxuY29uc3QgSGVhZGVyID0gcmVxdWlyZSgnLi9IZWFkZXInKTtcclxuY29uc3QgTmF2YmFyID0gcmVxdWlyZSgnLi9OYXZiYXInKTtcclxuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vTWVudScpO1xyXG5jb25zdCBUYWJsZU9mQ29udGVudHMgPSByZXF1aXJlKCcuL1RhYmxlT2ZDb250ZW50cycpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9OYXZpZ2F0aW9uJyk7XHJcbmNvbnN0IEludGVyYWN0aW9uVXRpbHMgPSByZXF1aXJlKCcuL0ludGVyYWN0aW9uVXRpbHMnKTtcclxuXHJcbmdsb2JhbC5tbiA9IChmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIGxldCBteU5hdmlnYXRpb247XHJcbiAgbGV0IGludGVyYWN0aW9uVXRpbHMgPSBuZXcgSW50ZXJhY3Rpb25VdGlscyh3aW5kb3cuY3BBUElJbnRlcmZhY2UpO1xyXG5cclxuICBteU92ZXJsYXkgPSAkKCcjbW5vdmVybGF5Jyk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuXHJcbiAgICAkLmdldEpTT04oXCJuYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIG15TmF2aWdhdGlvbiA9IG5ldyBOYXZpZ2F0aW9uKGNwSW50ZXJmYWNlLHdpbk1hbmFnZXIsZGF0YSk7XHJcblxyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxteU5hdmlnYXRpb24pO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15SGVhZGVyKTtcclxuICAgICAgICBteU5hdmlnYXRpb24uYWRkT2JzZXJ2ZXIobXlIZWFkZXIpO1xyXG4gICAgICAgIG15VG9jID0gbmV3IFRhYmxlT2ZDb250ZW50cyhjcEludGVyZmFjZSxteU5hdmlnYXRpb24pO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15VG9jKTtcclxuICAgICAgICBteU5hdmlnYXRpb24uYWRkT2JzZXJ2ZXIobXlUb2MpO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlNZW51KTtcclxuICAgICAgICBteU5hdmlnYXRpb24uYWRkT2JzZXJ2ZXIobXlNZW51KTtcclxuICAgICAgICBteU5hdmJhciA9IG5ldyBOYXZiYXIoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICBteU5hdmlnYXRpb24uYWRkT2JzZXJ2ZXIobXlOYXZiYXIpO1xyXG5cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW50OmludGVyYWN0aW9uVXRpbHNcclxuICB9XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1uO1xyXG4iXX0=
