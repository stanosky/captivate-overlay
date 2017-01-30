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
  var currScreen = 0;
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

  var update = function update(screenInfo) {
    if (currScreen !== screenInfo.index) {
      currScreen = screenInfo.index;
      courseName.html(nav.courseName);
      slideNumber.html(screenInfo.nr + '.');
      slideName.html(screenInfo.label);
      blink();
    }
  };

  var updateHandler = function updateHandler(e) {
    var sceneIndex = e.Data.slideNumber - 1;
    var screenInfo = Utils.getCurrentScreenInfo(nav, sceneIndex);

    update(screenInfo);
  };

  var eventEmitterObj = cpApi.getEventEmitter();
  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', updateHandler);

  //update(cpApi.getVariableValue('cpInfoCurrentSlide') - 1);
  $('#mnheader').slideUp(0);
  $("#mnrollover").mouseenter(function (event) {
    showHeader();
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  }).mouseleave(function (event) {
    hideHeader();
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  });
  return {
    win: _tw
  };
};

module.exports = Header;

},{"./ToggleWindow":5,"./Utils":6}],2:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var Menu = function Menu(cpApi, winManager) {
  var _tw = new ToggleWindow('mnmenu');

  $('#menu-toc').click(function (e) {
    return winManager.show('mntoc');
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

  $('#menu-header')[0].checked = winManager.getWindow('mnheader').win.isTurnedOn();
  $('#menu-header')[0].onchange = function (e) {
    winManager.getWindow('mnheader').win.setTurnedOn(e.target.checked);
  };

  return {
    win: _tw
  };
};

module.exports = Menu;

},{"./ToggleWindow":5}],3:[function(require,module,exports){
'use strict';

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Navbar = function Navbar(cpApi, nav, winManager) {
  var navbar = $('#mnnavbar');
  var tocposition = $('#tocposition');
  var eventEmitterObj = cpApi.getEventEmitter();
  var screenInfo = null;

  var next = function next() {
    if (screenInfo !== null) cpApi.setVariableValue('cpCmndGotoSlide', screenInfo.next);
    winManager.hide();
  };

  var prev = function prev() {
    if (screenInfo !== null) cpApi.setVariableValue('cpCmndGotoSlide', screenInfo.prev);
    winManager.hide();
  };

  var updateNaviButtons = function updateNaviButtons(mode) {
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var slideIndex = slideNumber - 1;
    var isQuiz = mode === 'mnQuiz';
    var isInteraction = mode === 'mnInteraction';
    console.log('screenInfo', screenInfo.prev, screenInfo.index, screenInfo.next);
    $('#nav-next')[0].disabled = isQuiz || isInteraction || screenInfo.next === -1;
    $('#nav-prev')[0].disabled = isQuiz || screenInfo.prev === -1;
    $('#nav-toc')[0].disabled = isQuiz;
    $('#menu-toc')[0].disabled = isQuiz;
  };

  var onSlideEnter = function onSlideEnter(e) {

    var slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var slideIndex = slideNumber - 1;
    var totalSlides = nav.screens.length;

    screenInfo = _Utils2.default.getCurrentScreenInfo(nav, slideIndex);

    updateNaviButtons(slideLabel);
    tocposition.html(screenInfo.nr + '/' + totalSlides);
    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', onHighlight, 'highlight');
    eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', onFrameChange, 'cpInfoCurrentFrame');
    cpApi.setVariableValue('highlight', 0);
  };

  var onSlideExit = function onSlideExit(e) {
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', onHighlight, 'highlight');
    eventEmitterObj.removeEventListener('CPAPI_VARIABLEVALUECHANGED', onFrameChange, 'cpInfoCurrentFrame');
  };

  var onHighlight = function onHighlight(e) {
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var currSlideId = nav.sids[slideNumber - 1];
    //console.log('CPAPI_VARIABLEVALUECHANGED','highlight',e.Data.newVal);
    if (e.Data.newVal === 1) {
      cp.D[currSlideId].mnc = true;

      updateNaviButtons('');
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }
  };

  var onFrameChange = function onFrameChange(e) {
    var slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var currSlideId = nav.sids[slideNumber - 1];
    var isBlocked = slideLabel === 'mnInteraction' || slideLabel === 'mnQuiz';

    if (cp.D[currSlideId].to - 1 === e.Data.newVal && !isBlocked) {
      cpApi.pause();
      cpApi.setVariableValue('highlight', 1);
    }
  };

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', onSlideEnter);
  eventEmitterObj.addEventListener('CPAPI_SLIDEEXIT', onSlideExit);

  $('#nav-next').click(function (e) {
    return next();
  });
  $('#nav-prev').click(function (e) {
    return prev();
  });
  $('#nav-toc').click(function (e) {
    return winManager.toggle('mntoc');
  });
  $('#nav-menu').click(function (e) {
    return winManager.toggle('mnmenu');
  });

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

},{"./Utils":6}],4:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var TabelOfContents = function TabelOfContents(cpApi, nav) {
  var _mntoc = $('#mntoc');
  var _tw = new ToggleWindow('mntoc');

  var output = [];
  for (var i = 0; i < nav.screens.length; i++) {
    output.push("<div><input type='button' name='toc-item' id='toc-item-" + i + "'>" + "<label for='toc-item-" + i + "'>" + "<i class='fa fa-map-marker fa-lg' aria-hidden='true'></i>" + "<span>" + nav.screens[i].nr + ".</span>&nbsp;&nbsp;" + nav.screens[i].label + "</label></div>");
  }
  $('#mntoc .slides-group').html(output.join(''));
  $('.slides-group div').click(function (e) {
    //console.log($(this).index());
    var screenIndex = $(this).index();
    var sceneIndex = nav.screens[screenIndex].scenes[0];
    cpApi.setVariableValue('cpCmndGotoSlide', sceneIndex);
    cpApi.setVariableValue('cpCmndGotoFrameAndResume', 0);
    _tw.hide();
  });

  return {
    win: _tw
  };
};

module.exports = TabelOfContents;

},{"./ToggleWindow":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
  console.log('getCurrentScreenInfo', index, screen, sceneIndex);
  return {
    index: index,
    nr: screen.nr,
    label: screen.label,
    prev: _getPrevSceneIndex(screens, sceneIndex),
    next: _getNextSceneIndex(screens, sceneIndex)
  };
};

module.exports = { getCurrentScreenInfo: getCurrentScreenInfo };

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var WindowManager = require('./WindowManager');
var Header = require('./Header');
var Navbar = require('./Navbar');
var Menu = require('./Menu');
var TableOfContents = require('./TableOfContents');

(function () {
  var cpInterface = void 0;
  var myOverlay = void 0;
  var winManager = new WindowManager();
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  var navigation = void 0;

  myOverlay = $('#mnoverlay');

  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;

    $.getJSON("navigation.json", function (nav) {
      navigation = nav;
      navigation.sids = cp.D.project_main.slides.split(',');
      navigation.sids.map(function (sid, index, arr) {
        // Do danych slajdu, dodajemy parametr "mnc" określający,
        // czy ekran został zaliczony (skrót od mncomplete).
        // Domyślnie nadajemy mu tą samą wartośc co parametr "v" (visited)
        // z kolejnego slajdu.
        // Parametr "mnc" będzie później wykorzystywany do stwierdzenia,
        // czy przejście do następnego ekranu należy zablokowac.
        var isNextSlide = index + 1 < arr.length;
        cp.D[sid].mnc = isNextSlide ? cp.D[arr[index + 1]].v : false;
      });

      myHeader = new Header(cpInterface, navigation);
      winManager.addWindow(myHeader);
      myToc = new TableOfContents(cpInterface, navigation, winManager);
      winManager.addWindow(myToc);
      myMenu = new Menu(cpInterface, winManager);
      winManager.addWindow(myMenu);
      myNavbar = new Navbar(cpInterface, navigation, winManager);
    });
  });
})();

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4,"./WindowManager":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcVXRpbHMuanMiLCJzcmNcXGpzXFxXaW5kb3dNYW5hZ2VyLmpzIiwic3JjXFxqc1xcb3ZlcmxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLElBQU0sZUFBZSxRQUFRLGdCQUFSLENBQXJCO0FBQ0EsSUFBTSxRQUFRLFFBQVEsU0FBUixDQUFkOztBQUdBLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBVSxLQUFWLEVBQWdCLEdBQWhCLEVBQW9CO0FBQy9CLE1BQUksTUFBTSxJQUFJLFlBQUosQ0FBaUIsVUFBakIsQ0FBVjtBQUNBLE1BQUksYUFBYSxFQUFFLGFBQUYsQ0FBakI7QUFDQSxNQUFJLGNBQWMsRUFBRSxjQUFGLENBQWxCO0FBQ0EsTUFBSSxZQUFZLEVBQUUsWUFBRixDQUFoQjtBQUNBLE1BQUksU0FBUyxFQUFFLFdBQUYsQ0FBYjtBQUNBLE1BQUksa0JBQUo7QUFDQSxNQUFJLGFBQWEsQ0FBakI7QUFDQSxNQUFJLGVBQWUsU0FBZixZQUFlLEdBQVc7QUFDNUIsV0FBTyxZQUFQLENBQW9CLFNBQXBCO0FBQ0QsR0FGRDtBQUdBLE1BQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUMzQjtBQUNBLFFBQUksSUFBSjtBQUNELEdBSEQ7O0FBS0EsTUFBSSxhQUFhLFNBQWIsVUFBYSxHQUFZO0FBQzNCO0FBQ0EsUUFBSSxJQUFKO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLFFBQVEsU0FBUixLQUFRLEdBQVk7QUFDdEI7QUFDQSxnQkFBWSxPQUFPLFVBQVAsQ0FBa0IsVUFBbEIsRUFBNkIsSUFBN0IsQ0FBWjtBQUNELEdBSEQ7O0FBS0Es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QUFoQixDQUFvQixVQUFDLEdBQUQsRUFBSyxLQUFMLEVBQVcsR0FBWCxFQUFtQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLGNBQWMsUUFBUSxDQUFSLEdBQVksSUFBSSxNQUFsQztBQUNBLFdBQUcsQ0FBSCxDQUFLLEdBQUwsRUFBVSxHQUFWLEdBQWdCLGNBQWMsR0FBRyxDQUFILENBQUssSUFBSSxRQUFNLENBQVYsQ0FBTCxFQUFtQixDQUFqQyxHQUFxQyxLQUFyRDtBQUNELE9BVEQ7O0FBV0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixVQUF2QixDQUFYO0FBQ0EsaUJBQVcsU0FBWCxDQUFxQixRQUFyQjtBQUNBLGNBQVEsSUFBSSxlQUFKLENBQW9CLFdBQXBCLEVBQWdDLFVBQWhDLEVBQTJDLFVBQTNDLENBQVI7QUFDQSxpQkFBVyxTQUFYLENBQXFCLEtBQXJCO0FBQ0EsZUFBUyxJQUFJLElBQUosQ0FBUyxXQUFULEVBQXFCLFVBQXJCLENBQVQ7QUFDQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixVQUF2QixFQUFrQyxVQUFsQyxDQUFYO0FBRUgsS0F0QkQ7QUF1QkQsR0EzQkQ7QUE0QkQsQ0F4Q0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcclxuXHJcblxyXG5sZXQgSGVhZGVyID0gZnVuY3Rpb24gKGNwQXBpLG5hdil7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21uaGVhZGVyJyk7XHJcbiAgbGV0IGNvdXJzZU5hbWUgPSAkKCcjY291cnNlTmFtZScpO1xyXG4gIGxldCBzbGlkZU51bWJlciA9ICQoJyNzbGlkZU51bWJlcicpO1xyXG4gIGxldCBzbGlkZU5hbWUgPSAkKCcjc2xpZGVOYW1lJyk7XHJcbiAgbGV0IGhlYWRlciA9ICQoJyNtbmhlYWRlcicpO1xyXG4gIGxldCB0aW1lb3V0SWQ7XHJcbiAgbGV0IGN1cnJTY3JlZW4gPSAwO1xyXG4gIGxldCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG4gIGxldCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93SGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIGxldCBibGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHNob3dIZWFkZXIoKTtcclxuICAgIHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGhpZGVIZWFkZXIsMjAwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHVwZGF0ZSA9IGZ1bmN0aW9uKHNjcmVlbkluZm8pIHtcclxuICAgIGlmKGN1cnJTY3JlZW4gIT09IHNjcmVlbkluZm8uaW5kZXgpIHtcclxuICAgICAgY3VyclNjcmVlbiA9IHNjcmVlbkluZm8uaW5kZXg7XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuY291cnNlTmFtZSk7XHJcbiAgICAgIHNsaWRlTnVtYmVyLmh0bWwoc2NyZWVuSW5mby5ucisnLicpO1xyXG4gICAgICBzbGlkZU5hbWUuaHRtbChzY3JlZW5JbmZvLmxhYmVsKTtcclxuICAgICAgYmxpbmsoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxldCB1cGRhdGVIYW5kbGVyID0gZnVuY3Rpb24oZSl7XHJcbiAgICBsZXQgc2NlbmVJbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgbGV0IHNjcmVlbkluZm8gPSBVdGlscy5nZXRDdXJyZW50U2NyZWVuSW5mbyhuYXYsc2NlbmVJbmRleCk7XHJcblxyXG4gICAgdXBkYXRlKHNjcmVlbkluZm8pO1xyXG4gIH07XHJcblxyXG4gIGxldCBldmVudEVtaXR0ZXJPYmogPSBjcEFwaS5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsdXBkYXRlSGFuZGxlcik7XHJcblxyXG4gIC8vdXBkYXRlKGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpIC0gMSk7XHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSx3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21ubWVudScpO1xyXG5cclxuICAkKCcjbWVudS10b2MnKS5jbGljayhlID0+IHdpbk1hbmFnZXIuc2hvdygnbW50b2MnKSk7XHJcbiAgJCgnI21lbnUtZXhpdCcpLmNsaWNrKGUgPT4gY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSkpO1xyXG4gICQoJyNtZW51LXByaW50JykuY2xpY2soZSA9PiB3aW5kb3cucHJpbnQoKSk7XHJcblxyXG4gICQoJyNtZW51LXNvdW5kJylbMF0uY2hlY2tlZCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnKSA9PT0gMDtcclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnLGUudGFyZ2V0LmNoZWNrZWQgPyAwIDogMSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gd2luTWFuYWdlci5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICB3aW5NYW5hZ2VyLmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uc2V0VHVybmVkT24oZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG5sZXQgTmF2YmFyID0gZnVuY3Rpb24gKGNwQXBpLG5hdix3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IG5hdmJhciA9ICQoJyNtbm5hdmJhcicpO1xyXG4gIGxldCB0b2Nwb3NpdGlvbiA9ICQoJyN0b2Nwb3NpdGlvbicpO1xyXG4gIGxldCBldmVudEVtaXR0ZXJPYmogPSBjcEFwaS5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICBsZXQgc2NyZWVuSW5mbyA9IG51bGw7XHJcblxyXG4gIGxldCBuZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZihzY3JlZW5JbmZvICE9PSBudWxsKSBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjcmVlbkluZm8ubmV4dCk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgcHJldiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoc2NyZWVuSW5mbyAhPT0gbnVsbCkgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY3JlZW5JbmZvLnByZXYpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHVwZGF0ZU5hdmlCdXR0b25zID0gZnVuY3Rpb24obW9kZSkge1xyXG4gICAgbGV0IHNsaWRlTnVtYmVyID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICBsZXQgc2xpZGVJbmRleCA9IHNsaWRlTnVtYmVyIC0gMTtcclxuICAgIGxldCBpc1F1aXogPSBtb2RlID09PSAnbW5RdWl6JztcclxuICAgIGxldCBpc0ludGVyYWN0aW9uID0gbW9kZSA9PT0gJ21uSW50ZXJhY3Rpb24nO1xyXG4gICAgY29uc29sZS5sb2coJ3NjcmVlbkluZm8nLHNjcmVlbkluZm8ucHJldixzY3JlZW5JbmZvLmluZGV4LHNjcmVlbkluZm8ubmV4dCk7XHJcbiAgICAkKCcjbmF2LW5leHQnKVswXS5kaXNhYmxlZCA9IGlzUXVpeiB8fCBpc0ludGVyYWN0aW9uIHx8IHNjcmVlbkluZm8ubmV4dCA9PT0gLTE7XHJcbiAgICAkKCcjbmF2LXByZXYnKVswXS5kaXNhYmxlZCA9IGlzUXVpeiB8fCBzY3JlZW5JbmZvLnByZXYgPT09IC0xO1xyXG4gICAgJCgnI25hdi10b2MnKVswXS5kaXNhYmxlZCA9IGlzUXVpejtcclxuICAgICQoJyNtZW51LXRvYycpWzBdLmRpc2FibGVkID0gaXNRdWl6O1xyXG4gIH1cclxuXHJcbiAgbGV0IG9uU2xpZGVFbnRlciA9IGZ1bmN0aW9uKGUpe1xyXG5cclxuICAgIGxldCBzbGlkZUxhYmVsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKTtcclxuICAgIGxldCBzbGlkZU51bWJlciA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgbGV0IHNsaWRlSW5kZXggPSBzbGlkZU51bWJlciAtIDE7XHJcbiAgICBsZXQgdG90YWxTbGlkZXMgPSBuYXYuc2NyZWVucy5sZW5ndGg7XHJcblxyXG4gICAgc2NyZWVuSW5mbyA9IFV0aWxzLmdldEN1cnJlbnRTY3JlZW5JbmZvKG5hdixzbGlkZUluZGV4KTtcclxuXHJcbiAgICB1cGRhdGVOYXZpQnV0dG9ucyhzbGlkZUxhYmVsKTtcclxuICAgIHRvY3Bvc2l0aW9uLmh0bWwoKHNjcmVlbkluZm8ubnIpICsgJy8nICsgdG90YWxTbGlkZXMpO1xyXG4gICAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxvbkhpZ2hsaWdodCwnaGlnaGxpZ2h0Jyk7XHJcbiAgICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLG9uRnJhbWVDaGFuZ2UsJ2NwSW5mb0N1cnJlbnRGcmFtZScpO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywwKTtcclxuICB9O1xyXG5cclxuICBsZXQgb25TbGlkZUV4aXQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBldmVudEVtaXR0ZXJPYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLG9uSGlnaGxpZ2h0LCdoaWdobGlnaHQnKTtcclxuICAgIGV2ZW50RW1pdHRlck9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsb25GcmFtZUNoYW5nZSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IG9uSGlnaGxpZ2h0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IHNsaWRlTnVtYmVyID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICBsZXQgY3VyclNsaWRlSWQgPSBuYXYuc2lkc1tzbGlkZU51bWJlci0xXTtcclxuICAgIC8vY29uc29sZS5sb2coJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJywnaGlnaGxpZ2h0JyxlLkRhdGEubmV3VmFsKTtcclxuICAgIGlmKGUuRGF0YS5uZXdWYWwgPT09IDEpIHtcclxuICAgICAgY3AuRFtjdXJyU2xpZGVJZF0ubW5jID0gdHJ1ZTtcclxuXHJcbiAgICAgIHVwZGF0ZU5hdmlCdXR0b25zKCcnKTtcclxuICAgICAgJCgnI25hdi1uZXh0ICsgbGFiZWwnKS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjbmF2LW5leHQgKyBsYWJlbCcpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsZXQgb25GcmFtZUNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBzbGlkZUxhYmVsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKTtcclxuICAgIGxldCBzbGlkZU51bWJlciA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgbGV0IGN1cnJTbGlkZUlkID0gbmF2LnNpZHNbc2xpZGVOdW1iZXItMV07XHJcbiAgICBsZXQgaXNCbG9ja2VkID0gc2xpZGVMYWJlbCA9PT0gJ21uSW50ZXJhY3Rpb24nIHx8IHNsaWRlTGFiZWwgPT09ICdtblF1aXonO1xyXG5cclxuICAgIGlmKGNwLkRbY3VyclNsaWRlSWRdLnRvLTEgPT09IGUuRGF0YS5uZXdWYWwgJiYgIWlzQmxvY2tlZCkge1xyXG4gICAgICBjcEFwaS5wYXVzZSgpO1xyXG4gICAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdoaWdobGlnaHQnLDEpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG5cclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRU5URVInLG9uU2xpZGVFbnRlcik7XHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRVhJVCcsb25TbGlkZUV4aXQpO1xyXG5cclxuXHJcbiAgJCgnI25hdi1uZXh0JykuY2xpY2soKGUpID0+IG5leHQoKSk7XHJcbiAgJCgnI25hdi1wcmV2JykuY2xpY2soKGUpID0+IHByZXYoKSk7XHJcbiAgJCgnI25hdi10b2MnKS5jbGljaygoZSkgPT4gd2luTWFuYWdlci50b2dnbGUoJ21udG9jJykpO1xyXG4gICQoJyNuYXYtbWVudScpLmNsaWNrKChlKSA9PiB3aW5NYW5hZ2VyLnRvZ2dsZSgnbW5tZW51JykpO1xyXG5cclxuICAvL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsZnVuY3Rpb24oZSkge1xyXG4gIC8vICBjb25zb2xlLmxvZygnY3BRdWl6SW5mb0Fuc3dlckNob2ljZScsZS5EYXRhKTtcclxuICAvL30sJ2NwUXVpekluZm9BbnN3ZXJDaG9pY2UnKTtcclxuXHJcblxyXG4gIC8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVBBVVNFJyk7XHJcbiAgICAvLyQoJyNuYXYtbmV4dCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICAvL30pO1xyXG5cclxuICAvL2V2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVNUT1AnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVNUT1AnKTtcclxuICAvL30pO1xyXG4gIC8vZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX0lOVEVSQUNUSVZFSVRFTVNVQk1JVCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLGUuRGF0YSk7XHJcbiAgLy99KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgVGFiZWxPZkNvbnRlbnRzID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBfbW50b2MgPSAkKCcjbW50b2MnKTtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW50b2MnKTtcclxuXHJcbiAgbGV0IG91dHB1dCA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2LnNjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIG91dHB1dC5wdXNoKFwiPGRpdj48aW5wdXQgdHlwZT0nYnV0dG9uJyBuYW1lPSd0b2MtaXRlbScgaWQ9J3RvYy1pdGVtLVwiK2krXCInPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8bGFiZWwgZm9yPSd0b2MtaXRlbS1cIitpK1wiJz5cIitcclxuICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2ZhIGZhLW1hcC1tYXJrZXIgZmEtbGcnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxzcGFuPlwiK25hdi5zY3JlZW5zW2ldLm5yK1wiLjwvc3Bhbj4mbmJzcDsmbmJzcDtcIitcclxuICAgICAgICAgICAgICAgIG5hdi5zY3JlZW5zW2ldLmxhYmVsK1wiPC9sYWJlbD48L2Rpdj5cIik7XHJcbiAgfVxyXG4gICQoJyNtbnRvYyAuc2xpZGVzLWdyb3VwJykuaHRtbChvdXRwdXQuam9pbignJykpO1xyXG4gICQoJy5zbGlkZXMtZ3JvdXAgZGl2JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZygkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgbGV0IHNjcmVlbkluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xyXG4gICAgbGV0IHNjZW5lSW5kZXggPSBuYXYuc2NyZWVuc1tzY3JlZW5JbmRleF0uc2NlbmVzWzBdO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxzY2VuZUluZGV4KTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9GcmFtZUFuZFJlc3VtZScsMCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJlbE9mQ29udGVudHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBUb2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgX2lkID0gaWQ7XHJcbiAgbGV0IF9lbGVtZW50ID0gJCgnIycrX2lkKSxcclxuICBfdmlzaWJsZSA9IGZhbHNlLFxyXG4gIF90dXJuZWRvbiA9IHRydWUsXHJcblxyXG4gIF9nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9pZDtcclxuICB9LFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3Zpc2libGU7XHJcbiAgfSxcclxuXHJcbiAgX2lzVHVybmVkT24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdHVybmVkb247XHJcbiAgfSxcclxuXHJcbiAgX3Nob3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gdHJ1ZTtcclxuICAgIF9lbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVVcCgyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9zZXRUdXJuZWRPbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA/IF9zaG93KCkgOiBfaGlkZSgpO1xyXG4gICAgX3R1cm5lZG9uID0gdmFsdWU7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGUoKSA6IF9zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBpc1R1cm5lZE9uOiBfaXNUdXJuZWRPbixcclxuICAgIHNob3c6IF9zaG93LFxyXG4gICAgaGlkZTogX2hpZGUsXHJcbiAgICBzZXRUdXJuZWRPbjogX3NldFR1cm5lZE9uLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IF9maW5kU2NyZWVuSW5kZXggPSBmdW5jdGlvbihhcnIsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zTGVuID0gYXJyLmxlbmd0aDtcclxuICBsZXQgb3V0cHV0O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyZWVuc0xlbjsgaSsrKSB7XHJcbiAgICBvdXRwdXQgPSBhcnJbaV0uc2NlbmVzICE9PSB1bmRlZmluZWQgPyBhcnJbaV0uc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNjZW5lID09PSBzY2VuZUluZGV4O1xyXG4gICAgfSkgOiBbXTtcclxuICAgIGlmKG91dHB1dC5sZW5ndGggPiAwKSByZXR1cm4gaTtcclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxubGV0IF9nZXRTY3JlZW5zQXJyYXkgPSBmdW5jdGlvbihuYXYsY3VyclNjZW5lKSB7XHJcbiAgbGV0IGlzSGlkZGVuID0gX2lzU2NlbmVIaWRkZW4obmF2LmhpZGRlbixjdXJyU2NlbmUpO1xyXG4gIHJldHVybiBpc0hpZGRlbiA/IG5hdi5oaWRkZW4gOiBuYXYuc2NyZWVucztcclxufTtcclxuXHJcbmxldCBfaXNTY2VuZUhpZGRlbiA9IGZ1bmN0aW9uKGFycixzY2VuZUluZGV4KSB7XHJcbiAgcmV0dXJuIGFyci5maWx0ZXIoc2NyID0+IHtcclxuICAgIHJldHVybiBzY3Iuc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgIHJldHVybiBzY2VuZSA9PT0gc2NlbmVJbmRleDtcclxuICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgfSkubGVuZ3RoID4gMDtcclxufTtcclxuXHJcbmxldCBfZ2V0UHJldlNjZW5lSW5kZXggPSBmdW5jdGlvbihhcnIsY3VyclNjZW5lKSB7XHJcbiAgbGV0IHNjcmVlbkluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChhcnIsY3VyclNjZW5lKTtcclxuICBsZXQgc2NyZWVuLCBzY2VuZXMsIHNjZW5lSW5kZXg7XHJcblxyXG4gIGlmKHNjcmVlbkluZGV4ID49IDApIHtcclxuICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleF07XHJcbiAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgc2NlbmVJbmRleCA9IHNjZW5lcy5pbmRleE9mKGN1cnJTY2VuZSk7XHJcbiAgICBpZihzY2VuZUluZGV4ID4gMCl7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVJbmRleCAtIDFdO1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbi5wcmV2ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gc2NyZWVuLnByZXY7XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuSW5kZXggPiAwKXtcclxuICAgICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4IC0gMV07XHJcbiAgICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVzLmxlbmd0aC0xXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxubGV0IF9nZXROZXh0U2NlbmVJbmRleCA9IGZ1bmN0aW9uKGFycixjdXJyU2NlbmUpIHtcclxuICBsZXQgc2NyZWVuSW5kZXggPSBfZmluZFNjcmVlbkluZGV4KGFycixjdXJyU2NlbmUpO1xyXG4gIGxldCBzY3JlZW4sIHNjZW5lcywgc2NlbmVJbmRleDtcclxuXHJcbiAgaWYoc2NyZWVuSW5kZXggPj0gMCkge1xyXG4gICAgc2NyZWVuID0gYXJyW3NjcmVlbkluZGV4XTtcclxuICAgIHNjZW5lcyA9IHNjcmVlbi5zY2VuZXM7XHJcbiAgICBzY2VuZUluZGV4ID0gc2NlbmVzLmluZGV4T2YoY3VyclNjZW5lKTtcclxuICAgIGlmKHNjZW5lSW5kZXggPCBzY2VuZXMubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHJldHVybiBzY2VuZXNbc2NlbmVJbmRleCArIDFdO1xyXG4gICAgfSBlbHNlIGlmKHNjcmVlbi5uZXh0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gc2NyZWVuLm5leHQ7XHJcbiAgICB9IGVsc2UgaWYoc2NyZWVuSW5kZXggPCBhcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHNjcmVlbiA9IGFycltzY3JlZW5JbmRleCArIDFdO1xyXG4gICAgICBzY2VuZXMgPSBzY3JlZW4uc2NlbmVzO1xyXG4gICAgICByZXR1cm4gc2NlbmVzWzBdO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5sZXQgZ2V0Q3VycmVudFNjcmVlbkluZm8gPSBmdW5jdGlvbihuYXYsc2NlbmVJbmRleCkge1xyXG4gIGxldCBzY3JlZW5zID0gX2dldFNjcmVlbnNBcnJheShuYXYsc2NlbmVJbmRleCk7XHJcbiAgbGV0IGluZGV4ID0gX2ZpbmRTY3JlZW5JbmRleChzY3JlZW5zLHNjZW5lSW5kZXgpO1xyXG4gIGxldCBzY3JlZW4gPSBpbmRleCA+PSAwID8gc2NyZWVuc1tpbmRleF0gOiBudWxsO1xyXG4gIGNvbnNvbGUubG9nKCdnZXRDdXJyZW50U2NyZWVuSW5mbycsaW5kZXgsc2NyZWVuLHNjZW5lSW5kZXgpO1xyXG4gIHJldHVybiB7XHJcbiAgICBpbmRleDogaW5kZXgsXHJcbiAgICBucjogc2NyZWVuLm5yLFxyXG4gICAgbGFiZWw6IHNjcmVlbi5sYWJlbCxcclxuICAgIHByZXY6IF9nZXRQcmV2U2NlbmVJbmRleChzY3JlZW5zLHNjZW5lSW5kZXgpLFxyXG4gICAgbmV4dDogX2dldE5leHRTY2VuZUluZGV4KHNjcmVlbnMsc2NlbmVJbmRleClcclxuICB9O1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2dldEN1cnJlbnRTY3JlZW5JbmZvfTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICBsZXQgX3dpbiA9IF93aW5kb3dzLmZpbHRlcih3ID0+IHtcclxuICAgICAgcmV0dXJuIHcud2luLmdldElkKCkgPT09IG5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfd2luLmxlbmd0aCA+IDAgPyBfd2luWzBdIDogbnVsbDtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIGxldCBuYXZpZ2F0aW9uO1xyXG5cclxuICBteU92ZXJsYXkgPSAkKCcjbW5vdmVybGF5Jyk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuXHJcbiAgICAkLmdldEpTT04oXCJuYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24obmF2KSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbiA9IG5hdjtcclxuICAgICAgICBuYXZpZ2F0aW9uLnNpZHMgPSBjcC5ELnByb2plY3RfbWFpbi5zbGlkZXMuc3BsaXQoJywnKTtcclxuICAgICAgICBuYXZpZ2F0aW9uLnNpZHMubWFwKChzaWQsaW5kZXgsYXJyKSA9PiB7XHJcbiAgICAgICAgICAvLyBEbyBkYW55Y2ggc2xhamR1LCBkb2RhamVteSBwYXJhbWV0ciBcIm1uY1wiIG9rcmXFm2xhasSFY3ksXHJcbiAgICAgICAgICAvLyBjenkgZWtyYW4gem9zdGHFgiB6YWxpY3pvbnkgKHNrcsOzdCBvZCBtbmNvbXBsZXRlKS5cclxuICAgICAgICAgIC8vIERvbXnFm2xuaWUgbmFkYWplbXkgbXUgdMSFIHNhbcSFIHdhcnRvxZtjIGNvIHBhcmFtZXRyIFwidlwiICh2aXNpdGVkKVxyXG4gICAgICAgICAgLy8geiBrb2xlam5lZ28gc2xhamR1LlxyXG4gICAgICAgICAgLy8gUGFyYW1ldHIgXCJtbmNcIiBixJlkemllIHDDs8W6bmllaiB3eWtvcnp5c3R5d2FueSBkbyBzdHdpZXJkemVuaWEsXHJcbiAgICAgICAgICAvLyBjenkgcHJ6ZWrFm2NpZSBkbyBuYXN0xJlwbmVnbyBla3JhbnUgbmFsZcW8eSB6YWJsb2tvd2FjLlxyXG4gICAgICAgICAgbGV0IGlzTmV4dFNsaWRlID0gaW5kZXggKyAxIDwgYXJyLmxlbmd0aDtcclxuICAgICAgICAgIGNwLkRbc2lkXS5tbmMgPSBpc05leHRTbGlkZSA/IGNwLkRbYXJyW2luZGV4KzFdXS52IDogZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxuYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteUhlYWRlcik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLG5hdmlnYXRpb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KGNwSW50ZXJmYWNlLHdpbk1hbmFnZXIpO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLG5hdmlnYXRpb24sd2luTWFuYWdlcik7XHJcblxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiJdfQ==
