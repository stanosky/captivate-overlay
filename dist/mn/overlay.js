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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxJbnRlcmFjdGlvblV0aWxzLmpzIiwic3JjXFxqc1xcTWVudS5qcyIsInNyY1xcanNcXE5hdmJhci5qcyIsInNyY1xcanNcXE5hdmlnYXRpb24uanMiLCJzcmNcXGpzXFxUYWJsZU9mQ29udGVudHMuanMiLCJzcmNcXGpzXFxUb2dnbGVXaW5kb3cuanMiLCJzcmNcXGpzXFxVdGlscy5qcyIsInNyY1xcanNcXFdpbmRvd01hbmFnZXIuanMiLCJzcmNcXGpzXFxzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZ0JBQVIsQ0FBckI7QUFDQSxJQUFNLFFBQVEsUUFBUSxTQUFSLENBQWQ7O0FBR0EsSUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFVLEtBQVYsRUFBZ0IsR0FBaEIsRUFBb0I7QUFDL0IsTUFBSSxNQUFNLElBQUksWUFBSixDQUFpQixVQUFqQixDQUFWO0FBQ0EsTUFBSSxhQUFhLEVBQUUsYUFBRixDQUFqQjtBQUNBLE1BQUksY0FBYyxFQUFFLGNBQUYsQ0FBbEI7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCO0FBQ0EsTUFBSSxTQUFTLEVBQUUsV0FBRixDQUFiO0FBQ0EsTUFBSSxrQkFBSjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzVCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7QUFHQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxRQUFJLElBQUo7QUFDRCxHQUhEOztBQUtBLE1BQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUMzQjtBQUNBLFFBQUksSUFBSjtBQUNELEdBSEQ7O0FBS0EsTUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFZO0FBQ3RCO0FBQ0Es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LENBQVo7O0FBRUEsU0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsVUFBUyxHQUFULEVBQzVDO0FBQ0Usa0JBQWMsSUFBSSxJQUFsQjs7QUFFQSxNQUFFLE9BQUYsQ0FBVSxpQkFBVixFQUE2QixVQUFTLElBQVQsRUFBZTtBQUN4QyxxQkFBZSxJQUFJLFVBQUosQ0FBZSxXQUFmLEVBQTJCLFVBQTNCLEVBQXNDLElBQXRDLENBQWY7O0FBRUEsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixZQUF2QixDQUFYO0FBQ0EsaUJBQVcsU0FBWCxDQUFxQixRQUFyQjtBQUNBLG1CQUFhLFdBQWIsQ0FBeUIsUUFBekI7QUFDQSxjQUFRLElBQUksZUFBSixDQUFvQixXQUFwQixFQUFnQyxZQUFoQyxDQUFSO0FBQ0EsaUJBQVcsU0FBWCxDQUFxQixLQUFyQjtBQUNBLG1CQUFhLFdBQWIsQ0FBeUIsS0FBekI7QUFDQSxlQUFTLElBQUksSUFBSixDQUFTLFdBQVQsRUFBcUIsWUFBckIsQ0FBVDtBQUNBLGlCQUFXLFNBQVgsQ0FBcUIsTUFBckI7QUFDQSxtQkFBYSxXQUFiLENBQXlCLE1BQXpCO0FBQ0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixZQUF2QixDQUFYO0FBQ0EsbUJBQWEsV0FBYixDQUF5QixRQUF6QjtBQUVILEtBZkQ7QUFnQkQsR0FwQkQ7O0FBc0JBLFNBQU87QUFDTCxTQUFJO0FBREMsR0FBUDtBQUdELENBdENXLEVBQVo7O0FBd0NBLE9BQU8sT0FBUCxHQUFpQixFQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xyXG5cclxuXHJcbmxldCBIZWFkZXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2KXtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5oZWFkZXInKTtcclxuICBsZXQgY291cnNlTmFtZSA9ICQoJyNjb3Vyc2VOYW1lJyk7XHJcbiAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgbGV0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuICBsZXQgaGVhZGVyID0gJCgnI21uaGVhZGVyJyk7XHJcbiAgbGV0IHRpbWVvdXRJZDtcclxuICBsZXQgY3VyclNjcmVlbjtcclxuXHJcbiAgbGV0IGNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xyXG4gIH07XHJcbiAgbGV0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGJsaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2hvd0hlYWRlcigpO1xyXG4gICAgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoaGlkZUhlYWRlciwyMDAwKTtcclxuICB9O1xyXG5cclxuICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDApO1xyXG4gICQoIFwiI21ucm9sbG92ZXJcIiApXHJcbiAgICAubW91c2VlbnRlcihmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzaG93SGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pXHJcbiAgICAubW91c2VsZWF2ZShmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBoaWRlSGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG5cclxuICBsZXQgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHNjcmVlbkluZm8gPSBuYXYuZ2V0U2NyZWVuSW5mbygpO1xyXG4gICAgaWYoY3VyclNjcmVlbiAhPT0gc2NyZWVuSW5mby5pbmRleCkge1xyXG4gICAgICBjdXJyU2NyZWVuID0gc2NyZWVuSW5mby5pbmRleDtcclxuICAgICAgY291cnNlTmFtZS5odG1sKG5hdi5nZXRDb3Vyc2VOYW1lKCkpO1xyXG4gICAgICBzbGlkZU51bWJlci5odG1sKHNjcmVlbkluZm8ubnIrJy4nKTtcclxuICAgICAgc2xpZGVOYW1lLmh0bWwoc2NyZWVuSW5mby5sYWJlbCk7XHJcbiAgICAgIGJsaW5rKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3LFxyXG4gICAgdXBkYXRlOiBfdXBkYXRlXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IEludGVyYWN0aW9uVXRpbHMgPSBmdW5jdGlvbihjcEFwaSkge1xyXG5cclxuICBsZXQgX2lzVmFyRXF1YWwgPSBmdW5jdGlvbih2YXJpYWJsZSx2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGNwQXBpLmdldFZhcmlhYmxlVmFsdWUodmFyaWFibGUpID09PSB2YWx1ZTtcclxuICB9O1xyXG5cclxuICBsZXQgX2FyZVZhcnNFcXVhbCA9IGZ1bmN0aW9uKHZhcmlhYmxlcyx2YWx1ZXMpIHtcclxuICAgIHZhciBlcXVhbFZhcnMgPSB2YXJpYWJsZXMuZmlsdGVyKCh2LGkpID0+IHtcclxuICAgICAgcmV0dXJuIF9pc1ZhckVxdWFsKHYsdmFsdWVzW2ldKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGVxdWFsVmFycy5sZW5ndGggPT09IHZhcmlhYmxlcy5sZW5ndGg7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuICB7XHJcbiAgICBpc1ZhckVxdWFsOl9pc1ZhckVxdWFsLFxyXG4gICAgYXJlVmFyc0VxdWFsOl9hcmVWYXJzRXF1YWxcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aW9uVXRpbHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBNZW51ID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbm1lbnUnKTtcclxuXHJcbiAgJCgnI21lbnUtdG9jJykuY2xpY2soZSA9PiBuYXYuc2hvd1dpbmRvdygnbW50b2MnKSk7XHJcbiAgJCgnI21lbnUtZXhpdCcpLmNsaWNrKGUgPT4gY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSkpO1xyXG4gICQoJyNtZW51LXByaW50JykuY2xpY2soZSA9PiB3aW5kb3cucHJpbnQoKSk7XHJcblxyXG4gICQoJyNtZW51LXNvdW5kJylbMF0uY2hlY2tlZCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnKSA9PT0gMDtcclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnLGUudGFyZ2V0LmNoZWNrZWQgPyAwIDogMSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gbmF2LmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uaXNUdXJuZWRPbigpO1xyXG4gICQoJyNtZW51LWhlYWRlcicpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIG5hdi5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLnNldFR1cm5lZE9uKGUudGFyZ2V0LmNoZWNrZWQpO1xyXG4gIH1cclxuICBsZXQgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIG1lbnUnKTtcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH07XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuXHJcbmxldCBOYXZiYXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgbGV0IG5hdmJhciA9ICQoJyNtbm5hdmJhcicpO1xyXG4gIGxldCB0b2Nwb3NpdGlvbiA9ICQoJyN0b2Nwb3NpdGlvbicpO1xyXG5cclxuICBmdW5jdGlvbiBfdXBkYXRlKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIG5hdmJhcicpO1xyXG4gICAgbGV0IHNjcmVlbkluZm8gPSBuYXYuZ2V0U2NyZWVuSW5mbygpO1xyXG4gICAgbGV0IGlzUXVpeiA9IG5hdi5pc1F1aXooKTtcclxuICAgIGxldCBpc0ludGVyYWN0aW9uID0gbmF2LmlzSW50ZXJhY3Rpb24oKTtcclxuICAgIGxldCB0b3RhbFNjcmVlbnMgPSBuYXYuZ2V0U2NyZWVucygpLmxlbmd0aDtcclxuXHJcbiAgICAkKCcjbmF2LW5leHQnKVswXS5kaXNhYmxlZCA9IGlzUXVpeiB8fCBpc0ludGVyYWN0aW9uIHx8IHNjcmVlbkluZm8ubmV4dCA9PT0gLTE7XHJcbiAgICAkKCcjbmF2LXByZXYnKVswXS5kaXNhYmxlZCA9IGlzUXVpeiB8fCBzY3JlZW5JbmZvLnByZXYgPT09IC0xO1xyXG4gICAgJCgnI25hdi10b2MnKVswXS5kaXNhYmxlZCA9IGlzUXVpejtcclxuICAgICQoJyNtZW51LXRvYycpWzBdLmRpc2FibGVkID0gaXNRdWl6O1xyXG5cclxuICAgIGlmKG5hdi5pc0NvbXBsZXRlZCgpICYmIHNjcmVlbkluZm8ubmV4dCAhPT0gLTEpIHtcclxuICAgICAgJCgnI25hdi1uZXh0ICsgbGFiZWwnKS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjbmF2LW5leHQgKyBsYWJlbCcpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2Nwb3NpdGlvbi5odG1sKChzY3JlZW5JbmZvLm5yKSArICcvJyArIHRvdGFsU2NyZWVucyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgJCgnI25hdi1uZXh0JykuY2xpY2soKGUpID0+IG5hdi5uZXh0KCkpO1xyXG4gICQoJyNuYXYtcHJldicpLmNsaWNrKChlKSA9PiBuYXYucHJldigpKTtcclxuICAkKCcjbmF2LXRvYycpLmNsaWNrKChlKSA9PiBuYXYudG9nZ2xlV2luZG93KCdtbnRvYycpKTtcclxuICAkKCcjbmF2LW1lbnUnKS5jbGljaygoZSkgPT4gbmF2LnRvZ2dsZVdpbmRvdygnbW5tZW51JykpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdXBkYXRlOiBfdXBkYXRlXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XHJcblxyXG5sZXQgTmF2aWdhdGlvbiA9IGZ1bmN0aW9uKGNwQXBpLHdpbk1hbmFnZXIsZGF0YSkge1xyXG4gIGxldCBvYnNlcnZlcnMgPSBbXTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgbGV0IG5hdkRhdGEgPSBkYXRhO1xyXG5cclxuICBsZXQgY3BTbGlkZUxhYmVsO1xyXG4gIGxldCBjcFNsaWRlTnVtYmVyO1xyXG4gIGxldCBjcFNsaWRlSWQ7XHJcblxyXG4gIGxldCBzY2VuZUluZGV4O1xyXG4gIGxldCB0b3RhbFNjcmVlbnMgPSBuYXZEYXRhLnNjcmVlbnMubGVuZ3RoO1xyXG4gIGxldCBzY3JlZW5JbmZvO1xyXG5cclxuXHJcbiAgbGV0IF9uZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjcmVlbkluZm8ubmV4dCk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgX3ByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NyZWVuSW5mby5wcmV2KTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkT2JzZXJ2ZXIgPSBmdW5jdGlvbihvYmopIHtcclxuICAgIG9ic2VydmVycy5wdXNoKG9iaik7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRTY3JlZW5zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmF2RGF0YS5zY3JlZW5zO1xyXG4gIH07XHJcblxyXG4gIGxldCBfaXNDb21wbGV0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBjcC5EW2NwU2xpZGVJZF0ubW5jXHJcbiAgfTtcclxuXHJcbiAgbGV0IF9pc0ludGVyYWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gY3BTbGlkZUxhYmVsID09PSAnbW5JbnRlcmFjdGlvbicgJiYgIV9pc0NvbXBsZXRlZCgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBfaXNRdWl6ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gY3BTbGlkZUxhYmVsID09PSAnbW5RdWl6JztcclxuICB9O1xyXG5cclxuICBsZXQgX2dldFNjcmVlbkluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBzY3JlZW5JbmZvO1xyXG4gIH1cclxuXHJcbiAgbGV0IF90b2dnbGVXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICB3aW5NYW5hZ2VyLnRvZ2dsZSh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBsZXQgX2dldENvdXJzZU5hbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuYXZEYXRhLmNvdXJzZU5hbWU7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICByZXR1cm4gd2luTWFuYWdlci5nZXRXaW5kb3cod2luTmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9zaG93V2luZG93ID0gZnVuY3Rpb24od2luTmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbk1hbmFnZXIuc2hvdyh3aW5OYW1lKTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbih3aW5OYW1lKSB7XHJcbiAgICByZXR1cm4gd2luTWFuYWdlci5oaWRlKHdpbk5hbWUpO1xyXG4gIH07XHJcblxyXG4gIGxldCBfb25TbGlkZUVudGVyID0gZnVuY3Rpb24oZSl7XHJcbiAgICBjcFNsaWRlTGFiZWwgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcpO1xyXG4gICAgY3BTbGlkZU51bWJlciA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgY3BTbGlkZUlkID0gbmF2RGF0YS5zaWRzW2NwU2xpZGVOdW1iZXItMV07XHJcblxyXG4gICAgc2NlbmVJbmRleCA9IGNwU2xpZGVOdW1iZXIgLSAxO1xyXG4gICAgc2NyZWVuSW5mbyA9IFV0aWxzLmdldEN1cnJlbnRTY3JlZW5JbmZvKG5hdkRhdGEsc2NlbmVJbmRleCk7XHJcbiAgICBfdXBkYXRlKCk7XHJcblxyXG4gICAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25IaWdobGlnaHQsJ2hpZ2hsaWdodCcpO1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25GcmFtZUNoYW5nZSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcblxyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywwKTtcclxuICAgIGNwQXBpLnBsYXkoKTtcclxuICB9O1xyXG5cclxuICBsZXQgX29uU2xpZGVFeGl0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25IaWdobGlnaHQsJ2hpZ2hsaWdodCcpO1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxfb25GcmFtZUNoYW5nZSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9vbkhpZ2hsaWdodCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmKGUuRGF0YS5uZXdWYWwgPT09IDEpIGNwLkRbY3BTbGlkZUlkXS5tbmMgPSB0cnVlO1xyXG4gICAgX3VwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBfb25GcmFtZUNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBpc0Jsb2NrZWQgPSBfaXNRdWl6KCkgfHwgX2lzSW50ZXJhY3Rpb24oKTtcclxuICAgIC8vY29uc29sZS5sb2coJ2Zyb20nLGNwLkRbY3BTbGlkZUlkXS5mcm9tLFwidG9cIixjcC5EW2NwU2xpZGVJZF0udG8pO1xyXG4gICAgaWYoY3AuRFtjcFNsaWRlSWRdLnRvLTEgPT09IGUuRGF0YS5uZXdWYWwgJiYgIWlzQmxvY2tlZCkge1xyXG4gICAgICBjcEFwaS5wYXVzZSgpO1xyXG4gICAgICBpZighX2lzSW50ZXJhY3Rpb24oKSAmJiAhX2lzUXVpeigpKSBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdoaWdobGlnaHQnLDEpO1xyXG4gICAgICBfdXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbGV0IF91cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIG9ic2VydmVycy5tYXAobyA9PiBvLnVwZGF0ZSgpKTtcclxuICB9O1xyXG5cclxuICAvLyBEbyBkYW55Y2ggc2xhamR1LCBkb2RhamVteSBwYXJhbWV0ciBcIm1uY1wiIG9rcmXFm2xhasSFY3ksXHJcbiAgLy8gY3p5IGVrcmFuIHpvc3RhxYIgemFsaWN6b255IChza3LDs3Qgb2QgbW5jb21wbGV0ZSkuXHJcbiAgLy8gRG9tecWbbG5pZSBuYWRhamVteSBtdSB0xIUgc2FtxIUgd2FydG/Fm2MgY28gcGFyYW1ldHIgXCJ2XCIgKHZpc2l0ZWQpXHJcbiAgLy8geiBrb2xlam5lZ28gc2xhamR1LlxyXG4gIC8vIFBhcmFtZXRyIFwibW5jXCIgYsSZZHppZSBww7PFum5pZWogd3lrb3J6eXN0eXdhbnkgZG8gc3R3aWVyZHplbmlhLFxyXG4gIC8vIGN6eSBwcnplasWbY2llIGRvIG5hc3TEmXBuZWdvIGVrcmFudSBuYWxlxbx5IHphYmxva293YWMuXHJcbiAgbmF2RGF0YS5zaWRzID0gY3AuRC5wcm9qZWN0X21haW4uc2xpZGVzLnNwbGl0KCcsJyk7XHJcbiAgbmF2RGF0YS5zaWRzLm1hcCgoc2lkLGluZGV4LGFycikgPT4ge1xyXG4gICAgbGV0IGlzTmV4dFNsaWRlID0gaW5kZXggKyAxIDwgYXJyLmxlbmd0aDtcclxuICAgIGNwLkRbc2lkXS5tbmMgPSBpc05leHRTbGlkZSA/IGNwLkRbYXJyW2luZGV4KzFdXS52IDogZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxfb25TbGlkZUVudGVyKTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFWElUJyxfb25TbGlkZUV4aXQpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmV4dDogX25leHQsXHJcbiAgICBwcmV2OiBfcHJldixcclxuICAgIGlzQ29tcGxldGVkOiBfaXNDb21wbGV0ZWQsXHJcbiAgICBpc0ludGVyYWN0aW9uOiBfaXNJbnRlcmFjdGlvbixcclxuICAgIGlzUXVpejogX2lzUXVpeixcclxuICAgIGdldFNjcmVlbkluZm86IF9nZXRTY3JlZW5JbmZvLFxyXG4gICAgZ2V0Q291cnNlTmFtZTogX2dldENvdXJzZU5hbWUsXHJcbiAgICBhZGRPYnNlcnZlcjogX2FkZE9ic2VydmVyLFxyXG4gICAgdG9nZ2xlV2luZG93OiBfdG9nZ2xlV2luZG93LFxyXG4gICAgZ2V0V2luZG93OiBfZ2V0V2luZG93LFxyXG4gICAgc2hvd1dpbmRvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlV2luZG93OiBfaGlkZVdpbmRvdyxcclxuICAgIGdldFNjcmVlbnM6IF9nZXRTY3JlZW5zXHJcbiAgfTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uO1xyXG5cclxuXHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxmdW5jdGlvbihlKSB7XHJcbi8vICBjb25zb2xlLmxvZygnY3BRdWl6SW5mb0Fuc3dlckNob2ljZScsZS5EYXRhKTtcclxuLy99LCdjcFF1aXpJbmZvQW5zd2VyQ2hvaWNlJyk7XHJcblxyXG5cclxuLy9ldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVQQVVTRScsIGZ1bmN0aW9uKGUpIHtcclxuICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVBBVVNFJyk7XHJcbiAgLy8kKCcjbmF2LW5leHQnKS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbi8vfSk7XHJcblxyXG4vL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVNUT1AnLCBmdW5jdGlvbihlKSB7XHJcbiAgLy9jb25zb2xlLmxvZygnQ1BBUElfTU9WSUVTVE9QJyk7XHJcbi8vfSk7XHJcbi8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX0lOVEVSQUNUSVZFSVRFTVNVQk1JVCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgLy9jb25zb2xlLmxvZygnQ1BBUElfSU5URVJBQ1RJVkVJVEVNU1VCTUlUJyxlLkRhdGEpO1xyXG4vL30pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgVGFiZWxPZkNvbnRlbnRzID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBfbW50b2MgPSAkKCcjbW50b2MnKTtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW50b2MnKTtcclxuXHJcbiAgbGV0IG91dHB1dCA9IFtdO1xyXG4gIGxldCBzY3JlZW5zID0gbmF2LmdldFNjcmVlbnMoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIG91dHB1dC5wdXNoKFwiPGRpdj48aW5wdXQgdHlwZT0nYnV0dG9uJyBuYW1lPSd0b2MtaXRlbScgaWQ9J3RvYy1pdGVtLVwiK2krXCInPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8bGFiZWwgZm9yPSd0b2MtaXRlbS1cIitpK1wiJz5cIitcclxuICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2ZhIGZhLW1hcC1tYXJrZXIgZmEtbGcnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxzcGFuPlwiK3NjcmVlbnNbaV0ubnIrXCIuPC9zcGFuPiZuYnNwOyZuYnNwO1wiK1xyXG4gICAgICAgICAgICAgICAgc2NyZWVuc1tpXS5sYWJlbCtcIjwvbGFiZWw+PC9kaXY+XCIpO1xyXG4gIH1cclxuICAkKCcjbW50b2MgLnNsaWRlcy1ncm91cCcpLmh0bWwob3V0cHV0LmpvaW4oJycpKTtcclxuICAkKCcuc2xpZGVzLWdyb3VwIGRpdicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vY29uc29sZS5sb2coJCh0aGlzKS5pbmRleCgpKTtcclxuICAgIGxldCBzY3JlZW5JbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgIGxldCBzY2VuZUluZGV4ID0gc2NyZWVuc1tzY3JlZW5JbmRleF0uc2NlbmVzWzBdO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY2VuZUluZGV4KTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9GcmFtZUFuZFJlc3VtZScsMCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZygndXBkYXRlIHRvYycpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90dyxcclxuICAgIHVwZGF0ZTogX3VwZGF0ZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmVsT2ZDb250ZW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFRvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gIGxldCBfaWQgPSBpZDtcclxuICBsZXQgX2VsZW1lbnQgPSAkKCcjJytfaWQpLFxyXG4gIF92aXNpYmxlID0gZmFsc2UsXHJcbiAgX3R1cm5lZG9uID0gdHJ1ZSxcclxuXHJcbiAgX2dldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX2lkO1xyXG4gIH0sXHJcblxyXG4gIF9pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfaXNUdXJuZWRPbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF90dXJuZWRvbjtcclxuICB9LFxyXG5cclxuICBfc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoIV90dXJuZWRvbikgcmV0dXJuO1xyXG4gICAgX3Zpc2libGUgPSB0cnVlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVEb3duKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gZmFsc2U7XHJcbiAgICBfZWxlbWVudC5zbGlkZVVwKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX3NldFR1cm5lZE9uID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHZhbHVlID8gX3Nob3coKSA6IF9oaWRlKCk7XHJcbiAgICBfdHVybmVkb24gPSB2YWx1ZTtcclxuICB9LFxyXG5cclxuICBfdG9nZ2xlVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX3Zpc2libGUgPyBfaGlkZSgpIDogX3Nob3coKTtcclxuICB9O1xyXG5cclxuICBfZWxlbWVudC5zbGlkZVVwKDApO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2V0SWQ6IF9nZXRJZCxcclxuICAgIGlzVmlzaWJsZTogX2lzVmlzaWJsZSxcclxuICAgIGlzVHVybmVkT246IF9pc1R1cm5lZE9uLFxyXG4gICAgc2hvdzogX3Nob3csXHJcbiAgICBoaWRlOiBfaGlkZSxcclxuICAgIHNldFR1cm5lZE9uOiBfc2V0VHVybmVkT24sXHJcbiAgICB0b2dnbGU6IF90b2dnbGVWaXNpYmxlXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9nZ2xlV2luZG93O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgX2ZpbmRTY3JlZW5JbmRleCA9IGZ1bmN0aW9uKGFycixzY2VuZUluZGV4KSB7XHJcbiAgbGV0IHNjcmVlbnNMZW4gPSBhcnIubGVuZ3RoO1xyXG4gIGxldCBvdXRwdXQ7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JlZW5zTGVuOyBpKyspIHtcclxuICAgIG91dHB1dCA9IGFycltpXS5zY2VuZXMgIT09IHVuZGVmaW5lZCA/IGFycltpXS5zY2VuZXMuZmlsdGVyKHNjZW5lID0+IHtcclxuICAgICAgICByZXR1cm4gc2NlbmUgPT09IHNjZW5lSW5kZXg7XHJcbiAgICB9KSA6IFtdO1xyXG4gICAgaWYob3V0cHV0Lmxlbmd0aCA+IDApIHJldHVybiBpO1xyXG4gIH1cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5sZXQgX2dldFNjcmVlbnNBcnJheSA9IGZ1bmN0aW9uKG5hdixjdXJyU2NlbmUpIHtcclxuICBsZXQgaXNIaWRkZW4gPSBfaXNTY2VuZUhpZGRlbihuYXYuaGlkZGVuLGN1cnJTY2VuZSk7XHJcbiAgcmV0dXJuIGlzSGlkZGVuID8gbmF2LmhpZGRlbiA6IG5hdi5zY3JlZW5zO1xyXG59O1xyXG5cclxubGV0IF9pc1NjZW5lSGlkZGVuID0gZnVuY3Rpb24oYXJyLHNjZW5lSW5kZXgpIHtcclxuICByZXR1cm4gYXJyLmZpbHRlcihzY3IgPT4ge1xyXG4gICAgcmV0dXJuIHNjci5zY2VuZXMuZmlsdGVyKHNjZW5lID0+IHtcclxuICAgICAgcmV0dXJuIHNjZW5lID09PSBzY2VuZUluZGV4O1xyXG4gICAgfSkubGVuZ3RoID4gMDtcclxuICB9KS5sZW5ndGggPiAwO1xyXG59O1xyXG5cclxubGV0IF9nZXRQcmV2U2NlbmVJbmRleCA9IGZ1bmN0aW9uKGFycixjdXJyU2NlbmUpIHtcclxuICBsZXQgc2NyZWVuSW5kZXggPSBfZmluZFNjcmVlbkluZGV4KGFycixjdXJyU2NlbmUpO1xyXG4gIGxldCBzY3JlZW4sIHNjZW5lcywgc2NlbmVJbmRleDtcclxuXHJcbiAgaWYoc2NyZWVuSW5kZXggPj0gMCkge1xyXG4gICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4XTtcclxuICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICBzY2VuZUluZGV4ID0gc2NlbmVzLmluZGV4T2YoY3VyclNjZW5lKTtcclxuICAgIGlmKHNjZW5lSW5kZXggPiAwKXtcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZUluZGV4IC0gMV07XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuLnByZXYgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHJldHVybiBzY3JlZW4ucHJldjtcclxuICAgIH0gZWxzZSBpZihzY3JlZW5JbmRleCA+IDApe1xyXG4gICAgICBzY3JlZW4gPSBhcnJbc2NyZWVuSW5kZXggLSAxXTtcclxuICAgICAgc2NlbmVzID0gc2NyZWVuLnNjZW5lcztcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZXMubGVuZ3RoLTFdO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5sZXQgX2dldE5leHRTY2VuZUluZGV4ID0gZnVuY3Rpb24oYXJyLGN1cnJTY2VuZSkge1xyXG4gIGxldCBzY3JlZW5JbmRleCA9IF9maW5kU2NyZWVuSW5kZXgoYXJyLGN1cnJTY2VuZSk7XHJcbiAgbGV0IHNjcmVlbiwgc2NlbmVzLCBzY2VuZUluZGV4O1xyXG5cclxuICBpZihzY3JlZW5JbmRleCA+PSAwKSB7XHJcbiAgICBzY3JlZW4gPSBhcnJbc2NyZWVuSW5kZXhdO1xyXG4gICAgc2NlbmVzID0gc2NyZWVuLnNjZW5lcztcclxuICAgIHNjZW5lSW5kZXggPSBzY2VuZXMuaW5kZXhPZihjdXJyU2NlbmUpO1xyXG4gICAgaWYoc2NlbmVJbmRleCA8IHNjZW5lcy5sZW5ndGggLSAxKXtcclxuICAgICAgcmV0dXJuIHNjZW5lc1tzY2VuZUluZGV4ICsgMV07XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuLm5leHQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHJldHVybiBzY3JlZW4ubmV4dDtcclxuICAgIH0gZWxzZSBpZihzY3JlZW5JbmRleCA8IGFyci5sZW5ndGggLSAxKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4ICsgMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbMF07XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAtMTtcclxufTtcclxuXHJcbmxldCBnZXRDdXJyZW50U2NyZWVuSW5mbyA9IGZ1bmN0aW9uKG5hdixzY2VuZUluZGV4KSB7XHJcbiAgbGV0IHNjcmVlbnMgPSBfZ2V0U2NyZWVuc0FycmF5KG5hdixzY2VuZUluZGV4KTtcclxuICBsZXQgaW5kZXggPSBfZmluZFNjcmVlbkluZGV4KHNjcmVlbnMsc2NlbmVJbmRleCk7XHJcbiAgbGV0IHNjcmVlbiA9IGluZGV4ID49IDAgPyBzY3JlZW5zW2luZGV4XSA6IG51bGw7XHJcbiAgLy9jb25zb2xlLmxvZygnZ2V0Q3VycmVudFNjcmVlbkluZm8nLGluZGV4LHNjcmVlbixzY2VuZUluZGV4KTtcclxuICByZXR1cm4ge1xyXG4gICAgaW5kZXg6IGluZGV4LFxyXG4gICAgbnI6IHNjcmVlbi5ucixcclxuICAgIGxhYmVsOiBzY3JlZW4ubGFiZWwsXHJcbiAgICBwcmV2OiBfZ2V0UHJldlNjZW5lSW5kZXgoc2NyZWVucyxzY2VuZUluZGV4KSxcclxuICAgIG5leHQ6IF9nZXROZXh0U2NlbmVJbmRleChzY3JlZW5zLHNjZW5lSW5kZXgpXHJcbiAgfTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRDdXJyZW50U2NyZWVuSW5mb307XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBXaW5kb3dNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IF93aW5kb3dzID0gW107XHJcbiAgbGV0IF9jdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgbGV0IF90b2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBpZihfY3VycmVudCAhPT0gd2lkKSBfaGlkZVdpbmRvdyhfY3VycmVudCk7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCkge1xyXG4gICAgICAgIHcud2luLnRvZ2dsZSgpO1xyXG4gICAgICAgIF9jdXJyZW50ID0gdy53aW4uaXNWaXNpYmxlKCkgPyB3aWQgOiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX3Nob3dXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBpZihfY3VycmVudCAhPT0gbnVsbCAmJiBfY3VycmVudCAhPT0gd2lkKSBfaGlkZVdpbmRvdyhfY3VycmVudCk7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCkge1xyXG4gICAgICAgIF9jdXJyZW50ID0gd2lkO1xyXG4gICAgICAgIHcud2luLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9oaWRlV2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQgfHwgd2lkID09PSB1bmRlZmluZWQgfHwgd2lkID09PSBudWxsKSB7XHJcbiAgICAgICAgdy53aW4uaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIF9jdXJyZW50ID0gbnVsbDtcclxuICB9O1xyXG5cclxuICBsZXQgX2FkZFdpbmRvdyA9IGZ1bmN0aW9uKHdpbk9iaikge1xyXG4gICAgX3dpbmRvd3MucHVzaCh3aW5PYmopO1xyXG4gIH07XHJcblxyXG4gIGxldCBfZ2V0V2luZG93ID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgbGV0IF93aW4gPSBfd2luZG93cy5maWx0ZXIodyA9PiB7XHJcbiAgICAgIHJldHVybiB3Lndpbi5nZXRJZCgpID09PSBuYW1lO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gX3dpbi5sZW5ndGggPiAwID8gX3dpblswXSA6IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRvZ2dsZTogX3RvZ2dsZVdpbmRvdyxcclxuICAgIHNob3c6IF9zaG93V2luZG93LFxyXG4gICAgaGlkZTogX2hpZGVXaW5kb3csXHJcbiAgICBhZGRXaW5kb3c6IF9hZGRXaW5kb3csXHJcbiAgICBnZXRXaW5kb3c6IF9nZXRXaW5kb3dcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93TWFuYWdlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgV2luZG93TWFuYWdlciA9IHJlcXVpcmUoJy4vV2luZG93TWFuYWdlcicpO1xyXG5jb25zdCBIZWFkZXIgPSByZXF1aXJlKCcuL0hlYWRlcicpO1xyXG5jb25zdCBOYXZiYXIgPSByZXF1aXJlKCcuL05hdmJhcicpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9NZW51Jyk7XHJcbmNvbnN0IFRhYmxlT2ZDb250ZW50cyA9IHJlcXVpcmUoJy4vVGFibGVPZkNvbnRlbnRzJyk7XHJcbmNvbnN0IE5hdmlnYXRpb24gPSByZXF1aXJlKCcuL05hdmlnYXRpb24nKTtcclxuY29uc3QgSW50ZXJhY3Rpb25VdGlscyA9IHJlcXVpcmUoJy4vSW50ZXJhY3Rpb25VdGlscycpO1xyXG5cclxuZ2xvYmFsLm1uID0gKGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNwSW50ZXJmYWNlO1xyXG4gIGxldCBteU92ZXJsYXk7XHJcbiAgbGV0IHdpbk1hbmFnZXIgPSBuZXcgV2luZG93TWFuYWdlcigpO1xyXG4gIGxldCBteUhlYWRlcjtcclxuICBsZXQgbXlUb2M7XHJcbiAgbGV0IG15TWVudTtcclxuICBsZXQgbXlOYXZiYXI7XHJcbiAgbGV0IG15TmF2aWdhdGlvbjtcclxuICBsZXQgaW50ZXJhY3Rpb25VdGlscyA9IG5ldyBJbnRlcmFjdGlvblV0aWxzKHdpbmRvdy5jcEFQSUludGVyZmFjZSk7XHJcblxyXG4gIG15T3ZlcmxheSA9ICQoJyNtbm92ZXJsYXknKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb2R1bGVSZWFkeUV2ZW50XCIsIGZ1bmN0aW9uKGV2dClcclxuICB7XHJcbiAgICBjcEludGVyZmFjZSA9IGV2dC5EYXRhO1xyXG5cclxuICAgICQuZ2V0SlNPTihcIm5hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgbXlOYXZpZ2F0aW9uID0gbmV3IE5hdmlnYXRpb24oY3BJbnRlcmZhY2Usd2luTWFuYWdlcixkYXRhKTtcclxuXHJcbiAgICAgICAgbXlIZWFkZXIgPSBuZXcgSGVhZGVyKGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlIZWFkZXIpO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteUhlYWRlcik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLG15TmF2aWdhdGlvbik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteVRvYyk7XHJcbiAgICAgICAgbXlNZW51ID0gbmV3IE1lbnUoY3BJbnRlcmZhY2UsbXlOYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteU1lbnUpO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteU1lbnUpO1xyXG4gICAgICAgIG15TmF2YmFyID0gbmV3IE5hdmJhcihjcEludGVyZmFjZSxteU5hdmlnYXRpb24pO1xyXG4gICAgICAgIG15TmF2aWdhdGlvbi5hZGRPYnNlcnZlcihteU5hdmJhcik7XHJcblxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbnQ6aW50ZXJhY3Rpb25VdGlsc1xyXG4gIH1cclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbW47XHJcbiJdfQ==
