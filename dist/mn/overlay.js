(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');
var Utils = require('./Utils');

var Header = function Header(interfaceObj, nav) {
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

  var eventEmitterObj = interfaceObj.getEventEmitter();
  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', function (e) {
    if (nav !== null) {
      var sceneIndex = e.Data.slideNumber - 1;
      var screenIndex = Utils.findScreenIndex(nav, sceneIndex);
      var currSlide = nav.screens[screenIndex];
      if (currScreen !== screenIndex) {
        currScreen = screenIndex;
        courseName.html(nav.courseName);
        slideNumber.html(currSlide.nr + '.');
        slideName.html(currSlide.label);
        blink();
      }
    }
  });

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

  var next = function next() {
    cpApi.setVariableValue('cpCmndNextSlide', 1);
    winManager.hide();
  };

  var prev = function prev() {
    cpApi.setVariableValue('cpCmndPrevious', 1);
    winManager.hide();
  };

  var tocposition = $('#tocposition');
  var eventEmitterObj = cpApi.getEventEmitter();

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

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', function (e) {
    cpApi.setVariableValue('highlight', 0);

    var slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    var slideNumber = e.Data.slideNumber;
    var slideIndex = slideNumber - 1;
    var screenNumber = _Utils2.default.findScreenIndex(nav, slideIndex) + 1;
    var totalSlides = nav.screens.length;
    var currSlideId = nav.sids[slideIndex];
    var isCurrSlideCompleted = cp.D[currSlideId].mnc;

    $('#nav-next')[0].disabled = slideLabel === 'mnInteraction' && !isCurrSlideCompleted;

    tocposition.html(screenNumber + '/' + totalSlides);
  });

  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', function (e) {
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var currSlideId = nav.sids[slideNumber - 1];
    if (e.Data.newVal === 1) {
      cp.D[currSlideId].mnc = true;
      $('#nav-next')[0].disabled = false;
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }
  }, 'highlight');

  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', function (e) {
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var currSlideId = nav.sids[slideNumber - 1];
    //console.log('should stop',cp.D[currSlideId].to-1,e.Data.newVal);
    if (cp.D[currSlideId].to - 1 === e.Data.newVal) {
      cpApi.pause();
      cpApi.setVariableValue('highlight', 1);
    }
  }, 'cpInfoCurrentFrame');

  eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function (e) {
    //console.log('CPAPI_MOVIEPAUSE');
    //$('#nav-next').addClass('highlight');
  });

  eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function (e) {
    //console.log('CPAPI_MOVIESTOP');
  });
  eventEmitterObj.addEventListener('CPAPI_INTERACTIVEITEMSUBMIT', function (e) {
    //console.log('CPAPI_INTERACTIVEITEMSUBMIT',e.Data);
  });
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

var findScreenIndex = function findScreenIndex(nav, sceneIndex) {
  var screensLen = nav.screens.length;
  var inScenes = void 0;
  var inHidden = void 0;
  var screenIndex = 0;
  for (var i = 0; i < screensLen; i++) {
    inScenes = nav.screens[i].scenes !== undefined ? nav.screens[i].scenes.filter(function (scene) {
      return scene === sceneIndex;
    }).length > 0 : false;

    inHidden = nav.screens[i].hidden !== undefined ? nav.screens[i].hidden.filter(function (scene) {
      return scene === sceneIndex;
    }).length > 0 : false;

    if (inScenes || inHidden) {
      screenIndex = i;
      break;
    }
  }
  return screenIndex;
};

module.exports = { findScreenIndex: findScreenIndex };

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
  myOverlay.css('display: none;');

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

      myOverlay.css('display: block;');
    });
  });
})();

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4,"./WindowManager":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcVXRpbHMuanMiLCJzcmNcXGpzXFxXaW5kb3dNYW5hZ2VyLmpzIiwic3JjXFxqc1xcb3ZlcmxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLElBQU0sZUFBZSxRQUFyQixBQUFxQixBQUFRO0FBQzdCLElBQU0sUUFBUSxRQUFkLEFBQWMsQUFBUTs7QUFHdEIsSUFBSSxTQUFTLFNBQVQsQUFBUyxPQUFBLEFBQVUsY0FBVixBQUF1QixLQUFJLEFBQ3RDO01BQUksTUFBTSxJQUFBLEFBQUksYUFBZCxBQUFVLEFBQWlCLEFBQzNCO01BQUksYUFBYSxFQUFqQixBQUFpQixBQUFFLEFBQ25CO01BQUksY0FBYyxFQUFsQixBQUFrQixBQUFFLEFBQ3BCO01BQUksWUFBWSxFQUFoQixBQUFnQixBQUFFLEFBQ2xCO01BQUksU0FBUyxFQUFiLEFBQWEsQUFBRSxBQUNmO01BQUksaUJBQUosQUFDQTtNQUFJLGFBQUosQUFBaUIsQUFDakI7TUFBSSxlQUFlLFNBQWYsQUFBZSxlQUFXLEFBQzVCO1dBQUEsQUFBTyxhQURULEFBQ0UsQUFBb0IsQUFDckIsQUFDRDs7TUFBSSxhQUFhLFNBQWIsQUFBYSxhQUFZLEFBQzNCLEFBQ0E7O1FBRkYsQUFFRSxBQUFJLEFBQ0wsQUFFRDs7O01BQUksYUFBYSxTQUFiLEFBQWEsYUFBWSxBQUMzQixBQUNBOztRQUZGLEFBRUUsQUFBSSxBQUNMLEFBRUQ7OztNQUFJLFFBQVEsU0FBUixBQUFRLFFBQVksQUFDdEIsQUFDQTs7Z0JBQVksT0FBQSxBQUFPLFdBQVAsQUFBa0IsWUFGaEMsQUFFRSxBQUFZLEFBQTZC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QkFBZDtBQUNILEtBdkJEO0FBd0JELEdBNUJEO0FBNkJELENBMUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XHJcblxyXG5cclxubGV0IEhlYWRlciA9IGZ1bmN0aW9uIChpbnRlcmZhY2VPYmosbmF2KXtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5oZWFkZXInKTtcclxuICBsZXQgY291cnNlTmFtZSA9ICQoJyNjb3Vyc2VOYW1lJyk7XHJcbiAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgbGV0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuICBsZXQgaGVhZGVyID0gJCgnI21uaGVhZGVyJyk7XHJcbiAgbGV0IHRpbWVvdXRJZDtcclxuICBsZXQgY3VyclNjcmVlbiA9IDA7XHJcbiAgbGV0IGNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xyXG4gIH07XHJcbiAgbGV0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGJsaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2hvd0hlYWRlcigpO1xyXG4gICAgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoaGlkZUhlYWRlciwyMDAwKTtcclxuICB9O1xyXG5cclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gaW50ZXJmYWNlT2JqLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgIGlmKG5hdiAhPT0gbnVsbCkge1xyXG4gICAgICBsZXQgc2NlbmVJbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICBsZXQgc2NyZWVuSW5kZXggPSBVdGlscy5maW5kU2NyZWVuSW5kZXgobmF2LHNjZW5lSW5kZXgpO1xyXG4gICAgICBsZXQgY3VyclNsaWRlID0gbmF2LnNjcmVlbnNbc2NyZWVuSW5kZXhdO1xyXG4gICAgICBpZihjdXJyU2NyZWVuICE9PSBzY3JlZW5JbmRleCkge1xyXG4gICAgICAgIGN1cnJTY3JlZW4gPSBzY3JlZW5JbmRleFxyXG4gICAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuY291cnNlTmFtZSk7XHJcbiAgICAgICAgc2xpZGVOdW1iZXIuaHRtbChjdXJyU2xpZGUubnIrJy4nKTtcclxuICAgICAgICBzbGlkZU5hbWUuaHRtbChjdXJyU2xpZGUubGFiZWwpO1xyXG4gICAgICAgIGJsaW5rKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSx3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21ubWVudScpO1xyXG5cclxuICAkKCcjbWVudS10b2MnKS5jbGljayhlID0+IHdpbk1hbmFnZXIuc2hvdygnbW50b2MnKSk7XHJcbiAgJCgnI21lbnUtZXhpdCcpLmNsaWNrKGUgPT4gY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSkpO1xyXG4gICQoJyNtZW51LXByaW50JykuY2xpY2soZSA9PiB3aW5kb3cucHJpbnQoKSk7XHJcblxyXG4gICQoJyNtZW51LXNvdW5kJylbMF0uY2hlY2tlZCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnKSA9PT0gMDtcclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnLGUudGFyZ2V0LmNoZWNrZWQgPyAwIDogMSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gd2luTWFuYWdlci5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICB3aW5NYW5hZ2VyLmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uc2V0VHVybmVkT24oZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG5sZXQgTmF2YmFyID0gZnVuY3Rpb24gKGNwQXBpLG5hdix3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IG5hdmJhciA9ICQoJyNtbm5hdmJhcicpO1xyXG5cclxuICBsZXQgbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTmV4dFNsaWRlJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRQcmV2aW91cycsMSk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICQoJyNuYXYtbmV4dCcpLmNsaWNrKChlKSA9PiBuZXh0KCkpO1xyXG4gICQoJyNuYXYtcHJldicpLmNsaWNrKChlKSA9PiBwcmV2KCkpO1xyXG4gICQoJyNuYXYtdG9jJykuY2xpY2soKGUpID0+IHdpbk1hbmFnZXIudG9nZ2xlKCdtbnRvYycpKTtcclxuICAkKCcjbmF2LW1lbnUnKS5jbGljaygoZSkgPT4gd2luTWFuYWdlci50b2dnbGUoJ21ubWVudScpKTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRU5URVInLGZ1bmN0aW9uKGUpe1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywwKTtcclxuXHJcbiAgICBsZXQgc2xpZGVMYWJlbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJyk7XHJcbiAgICBsZXQgc2xpZGVOdW1iZXIgPSBlLkRhdGEuc2xpZGVOdW1iZXI7XHJcbiAgICBsZXQgc2xpZGVJbmRleCA9IHNsaWRlTnVtYmVyIC0gMTtcclxuICAgIGxldCBzY3JlZW5OdW1iZXIgPSBVdGlscy5maW5kU2NyZWVuSW5kZXgobmF2LHNsaWRlSW5kZXgpICsgMTtcclxuICAgIGxldCB0b3RhbFNsaWRlcyA9IG5hdi5zY3JlZW5zLmxlbmd0aDtcclxuICAgIGxldCBjdXJyU2xpZGVJZCA9IG5hdi5zaWRzW3NsaWRlSW5kZXhdO1xyXG4gICAgbGV0IGlzQ3VyclNsaWRlQ29tcGxldGVkID0gY3AuRFtjdXJyU2xpZGVJZF0ubW5jO1xyXG5cclxuICAgICQoJyNuYXYtbmV4dCcpWzBdLmRpc2FibGVkID0gc2xpZGVMYWJlbCA9PT0gJ21uSW50ZXJhY3Rpb24nICYmICFpc0N1cnJTbGlkZUNvbXBsZXRlZDtcclxuXHJcbiAgICB0b2Nwb3NpdGlvbi5odG1sKHNjcmVlbk51bWJlcisnLycrdG90YWxTbGlkZXMpO1xyXG4gIH0pO1xyXG5cclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxmdW5jdGlvbihlKSB7XHJcbiAgICBsZXQgc2xpZGVOdW1iZXIgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGUnKTtcclxuICAgIGxldCBjdXJyU2xpZGVJZCA9IG5hdi5zaWRzW3NsaWRlTnVtYmVyLTFdO1xyXG4gICAgaWYoZS5EYXRhLm5ld1ZhbCA9PT0gMSkge1xyXG4gICAgICBjcC5EW2N1cnJTbGlkZUlkXS5tbmMgPSB0cnVlO1xyXG4gICAgICAkKCcjbmF2LW5leHQnKVswXS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAkKCcjbmF2LW5leHQgKyBsYWJlbCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNuYXYtbmV4dCArIGxhYmVsJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgfVxyXG4gIH0sJ2hpZ2hsaWdodCcpO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBzbGlkZU51bWJlciA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgbGV0IGN1cnJTbGlkZUlkID0gbmF2LnNpZHNbc2xpZGVOdW1iZXItMV07XHJcbiAgICAvL2NvbnNvbGUubG9nKCdzaG91bGQgc3RvcCcsY3AuRFtjdXJyU2xpZGVJZF0udG8tMSxlLkRhdGEubmV3VmFsKTtcclxuICAgIGlmKGNwLkRbY3VyclNsaWRlSWRdLnRvLTEgPT09IGUuRGF0YS5uZXdWYWwpIHtcclxuICAgICAgY3BBcGkucGF1c2UoKTtcclxuICAgICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywxKTtcclxuICAgIH1cclxuICB9LCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVBBVVNFJyk7XHJcbiAgICAvLyQoJyNuYXYtbmV4dCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4gIH0pO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZygnQ1BBUElfSU5URVJBQ1RJVkVJVEVNU1VCTUlUJyxlLkRhdGEpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgbGV0IF9tbnRvYyA9ICQoJyNtbnRvYycpO1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbnRvYycpO1xyXG5cclxuICBsZXQgb3V0cHV0ID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYuc2NyZWVucy5sZW5ndGg7IGkrKykge1xyXG4gICAgb3V0cHV0LnB1c2goXCI8ZGl2PjxpbnB1dCB0eXBlPSdidXR0b24nIG5hbWU9J3RvYy1pdGVtJyBpZD0ndG9jLWl0ZW0tXCIraStcIic+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxsYWJlbCBmb3I9J3RvYy1pdGVtLVwiK2krXCInPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8aSBjbGFzcz0nZmEgZmEtbWFwLW1hcmtlciBmYS1sZycgYXJpYS1oaWRkZW49J3RydWUnPjwvaT5cIitcclxuICAgICAgICAgICAgICAgIFwiPHNwYW4+XCIrbmF2LnNjcmVlbnNbaV0ubnIrXCIuPC9zcGFuPiZuYnNwOyZuYnNwO1wiK1xyXG4gICAgICAgICAgICAgICAgbmF2LnNjcmVlbnNbaV0ubGFiZWwrXCI8L2xhYmVsPjwvZGl2PlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgc2NyZWVuSW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBsZXQgc2NlbmVJbmRleCA9IG5hdi5zY3JlZW5zW3NjcmVlbkluZGV4XS5zY2VuZXNbMF07XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjZW5lSW5kZXgpO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b0ZyYW1lQW5kUmVzdW1lJywwKTtcclxuICAgIF90dy5oaWRlKCk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90d1xyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmVsT2ZDb250ZW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFRvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gIGxldCBfaWQgPSBpZDtcclxuICBsZXQgX2VsZW1lbnQgPSAkKCcjJytfaWQpLFxyXG4gIF92aXNpYmxlID0gZmFsc2UsXHJcbiAgX3R1cm5lZG9uID0gdHJ1ZSxcclxuXHJcbiAgX2dldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX2lkO1xyXG4gIH0sXHJcblxyXG4gIF9pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfaXNUdXJuZWRPbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF90dXJuZWRvbjtcclxuICB9LFxyXG5cclxuICBfc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoIV90dXJuZWRvbikgcmV0dXJuO1xyXG4gICAgX3Zpc2libGUgPSB0cnVlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVEb3duKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gZmFsc2U7XHJcbiAgICBfZWxlbWVudC5zbGlkZVVwKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX3NldFR1cm5lZE9uID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHZhbHVlID8gX3Nob3coKSA6IF9oaWRlKCk7XHJcbiAgICBfdHVybmVkb24gPSB2YWx1ZTtcclxuICB9LFxyXG5cclxuICBfdG9nZ2xlVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX3Zpc2libGUgPyBfaGlkZSgpIDogX3Nob3coKTtcclxuICB9O1xyXG5cclxuICBfZWxlbWVudC5zbGlkZVVwKDApO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2V0SWQ6IF9nZXRJZCxcclxuICAgIGlzVmlzaWJsZTogX2lzVmlzaWJsZSxcclxuICAgIGlzVHVybmVkT246IF9pc1R1cm5lZE9uLFxyXG4gICAgc2hvdzogX3Nob3csXHJcbiAgICBoaWRlOiBfaGlkZSxcclxuICAgIHNldFR1cm5lZE9uOiBfc2V0VHVybmVkT24sXHJcbiAgICB0b2dnbGU6IF90b2dnbGVWaXNpYmxlXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9nZ2xlV2luZG93O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgZmluZFNjcmVlbkluZGV4ID0gZnVuY3Rpb24obmF2LHNjZW5lSW5kZXgpIHtcclxuICBsZXQgc2NyZWVuc0xlbiA9IG5hdi5zY3JlZW5zLmxlbmd0aDtcclxuICBsZXQgaW5TY2VuZXM7XHJcbiAgbGV0IGluSGlkZGVuO1xyXG4gIGxldCBzY3JlZW5JbmRleCA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JlZW5zTGVuOyBpKyspIHtcclxuICAgIGluU2NlbmVzID0gbmF2LnNjcmVlbnNbaV0uc2NlbmVzICE9PSB1bmRlZmluZWQgP1xyXG4gICAgbmF2LnNjcmVlbnNbaV0uc2NlbmVzLmZpbHRlcihzY2VuZSA9PiB7XHJcbiAgICAgIHJldHVybiBzY2VuZSA9PT0gc2NlbmVJbmRleDtcclxuICAgIH0pLmxlbmd0aCA+IDAgOiBmYWxzZTtcclxuXHJcbiAgICBpbkhpZGRlbiA9IG5hdi5zY3JlZW5zW2ldLmhpZGRlbiAhPT0gdW5kZWZpbmVkID9cclxuICAgIG5hdi5zY3JlZW5zW2ldLmhpZGRlbi5maWx0ZXIoc2NlbmUgPT4ge1xyXG4gICAgICByZXR1cm4gc2NlbmUgPT09IHNjZW5lSW5kZXg7XHJcbiAgICB9KS5sZW5ndGggPiAwIDogZmFsc2U7XHJcblxyXG4gICAgaWYoaW5TY2VuZXMgfHwgaW5IaWRkZW4pIHtcclxuICAgICAgc2NyZWVuSW5kZXggPSBpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHNjcmVlbkluZGV4O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7ZmluZFNjcmVlbkluZGV4fTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICBsZXQgX3dpbiA9IF93aW5kb3dzLmZpbHRlcih3ID0+IHtcclxuICAgICAgcmV0dXJuIHcud2luLmdldElkKCkgPT09IG5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfd2luLmxlbmd0aCA+IDAgPyBfd2luWzBdIDogbnVsbDtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIGxldCBuYXZpZ2F0aW9uO1xyXG5cclxuICBteU92ZXJsYXkgPSAkKCcjbW5vdmVybGF5Jyk7XHJcbiAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogbm9uZTsnKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb2R1bGVSZWFkeUV2ZW50XCIsIGZ1bmN0aW9uKGV2dClcclxuICB7XHJcbiAgICBjcEludGVyZmFjZSA9IGV2dC5EYXRhO1xyXG5cclxuICAgICQuZ2V0SlNPTihcIm5hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihuYXYpIHtcclxuICAgICAgICBuYXZpZ2F0aW9uID0gbmF2O1xyXG4gICAgICAgIG5hdmlnYXRpb24uc2lkcyA9IGNwLkQucHJvamVjdF9tYWluLnNsaWRlcy5zcGxpdCgnLCcpO1xyXG4gICAgICAgIG5hdmlnYXRpb24uc2lkcy5tYXAoKHNpZCxpbmRleCxhcnIpID0+IHtcclxuICAgICAgICAgIC8vIERvIGRhbnljaCBzbGFqZHUsIGRvZGFqZW15IHBhcmFtZXRyIFwibW5jXCIgb2tyZcWbbGFqxIVjeSxcclxuICAgICAgICAgIC8vIGN6eSBla3JhbiB6b3N0YcWCIHphbGljem9ueSAoc2tyw7N0IG9kIG1uY29tcGxldGUpLlxyXG4gICAgICAgICAgLy8gRG9tecWbbG5pZSBuYWRhamVteSBtdSB0xIUgc2FtxIUgd2FydG/Fm2MgY28gcGFyYW1ldHIgXCJ2XCIgKHZpc2l0ZWQpXHJcbiAgICAgICAgICAvLyB6IGtvbGVqbmVnbyBzbGFqZHUuXHJcbiAgICAgICAgICAvLyBQYXJhbWV0ciBcIm1uY1wiIGLEmWR6aWUgcMOzxbpuaWVqIHd5a29yenlzdHl3YW55IGRvIHN0d2llcmR6ZW5pYSxcclxuICAgICAgICAgIC8vIGN6eSBwcnplasWbY2llIGRvIG5hc3TEmXBuZWdvIGVrcmFudSBuYWxlxbx5IHphYmxva293YWMuXHJcbiAgICAgICAgICBsZXQgaXNOZXh0U2xpZGUgPSBpbmRleCArIDEgPCBhcnIubGVuZ3RoO1xyXG4gICAgICAgICAgY3AuRFtzaWRdLm1uYyA9IGlzTmV4dFNsaWRlID8gY3AuRFthcnJbaW5kZXgrMV1dLnYgOiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbXlIZWFkZXIgPSBuZXcgSGVhZGVyKGNwSW50ZXJmYWNlLG5hdmlnYXRpb24pO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15SGVhZGVyKTtcclxuICAgICAgICBteVRvYyA9IG5ldyBUYWJsZU9mQ29udGVudHMoY3BJbnRlcmZhY2UsbmF2aWdhdGlvbix3aW5NYW5hZ2VyKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteVRvYyk7XHJcbiAgICAgICAgbXlNZW51ID0gbmV3IE1lbnUoY3BJbnRlcmZhY2Usd2luTWFuYWdlcik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlNZW51KTtcclxuICAgICAgICBteU5hdmJhciA9IG5ldyBOYXZiYXIoY3BJbnRlcmZhY2UsbmF2aWdhdGlvbix3aW5NYW5hZ2VyKTtcclxuXHJcbiAgICAgICAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogYmxvY2s7Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkoKTtcclxuIl19
