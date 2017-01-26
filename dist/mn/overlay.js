(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var Header = function Header(interfaceObj, nav) {
  var _tw = new ToggleWindow('mnheader');

  var courseName = $('#courseName');
  var slideNumber = $('#slideNumber');
  var slideName = $('#slideName');
  var header = $('#mnheader');
  var timeoutId = void 0;
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
      var index = e.Data.slideNumber - 1;
      var currSlide = nav.slides[index];
      courseName.html(nav.courseName);
      slideNumber.html(currSlide.index + '.');
      slideName.html(currSlide.label);
      blink();
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

},{"./ToggleWindow":5}],2:[function(require,module,exports){
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

var Navbar = function Navbar(cpApi, nav, winManager) {
  var navbar = $('#mnnavbar');

  var hideMenus = function hideMenus() {
    toc.hide();
    menu.hide();
  };

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
  var totalSlides = cpApi.getVariableValue('cpInfoSlideCount');

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
    var currSlideId = nav.slides[slideNumber - 1].sid;
    var isCurrSlideCompleted = cp.D[currSlideId].mnc;

    $('#nav-next')[0].disabled = slideLabel === 'mnInteraction' && !isCurrSlideCompleted;

    tocposition.html(slideNumber + '/' + totalSlides);
  });

  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', function (e) {
    var slideNumber = cpApi.getVariableValue('cpInfoCurrentSlide');
    var currSlideId = nav.slides[slideNumber - 1].sid;
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
    var currSlideId = nav.slides[slideNumber - 1].sid;
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

},{}],4:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var TabelOfContents = function TabelOfContents(cpApi, nav) {
  var _mntoc = $('#mntoc');
  var _tw = new ToggleWindow('mntoc');

  var output = [];
  for (var i = 0; i < nav.slides.length; i++) {
    output.push("<div><input type='button' name='toc-item' id='toc-item-" + i + "'>" + "<label for='toc-item-" + i + "'>" + "<i class='fa fa-map-marker fa-lg' aria-hidden='true'></i>" + "<span>" + nav.slides[i].index + ".</span>&nbsp;&nbsp;" + nav.slides[i].label + "</label></div>");
  }
  $('#mntoc .slides-group').html(output.join(''));
  $('.slides-group div').click(function (e) {
    //console.log($(this).index());
    var index = $(this).index();
    cpApi.setVariableValue('cpCmndGotoSlide', index);
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

},{}],7:[function(require,module,exports){
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
      var slidesList = cp.D.project_main.slides.split(',');
      var labels = [];
      slidesList.map(function (slide, index, slides) {
        if (navigation.slides[index] === undefined) {
          navigation.slides[index] = { index: index + 1, label: slide };
        }
        navigation.slides[index].sid = slide;
        // Do danych slajdu, dodajemy parametr "mnc" określający,
        // czy ekran został zaliczony (skrót od mncomplete).
        // Domyślnie nadajemy mu tą samą wartośc co parametr "v" (visited)
        // z kolejnego slajdu.
        // Parametr "mnc" będzie później wykorzystywany do stwierdzenia,
        // czy przejście do następnego ekranu należy zablokowac.
        var isNextSlide = index + 1 < slides.length;
        cp.D[slide].mnc = isNextSlide ? cp.D[slides[index + 1]].v : false;
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

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4,"./WindowManager":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQSxJQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjs7QUFFQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsWUFBVixFQUF1QixHQUF2QixFQUEyQjtBQUN0QyxNQUFJLE1BQU0sSUFBSSxZQUFKLENBQWlCLFVBQWpCLENBQVY7O0FBRUEsTUFBSSxhQUFhLEVBQUUsYUFBRixDQUFqQjtBQUNBLE1BQUksY0FBYyxFQUFFLGNBQUYsQ0FBbEI7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCO0FBQ0EsTUFBSSxTQUFTLEVBQUUsV0FBRixDQUFiO0FBQ0EsTUFBSSxrQkFBSjtBQUNBLE1BQUksZUFBZSxTQUFmLFlBQWUsR0FBVztBQUM1QixXQUFPLFlBQVAsQ0FBb0IsU0FBcEI7QUFDRCxHQUZEO0FBR0EsTUFBSSxhQUFhLFNBQWIsVUFBYSxHQUFZO0FBQzNCO0FBQ0EsUUFBSSxJQUFKO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxRQUFJLElBQUo7QUFDRCxHQUhEOztBQUtBLE1BQUksUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN0QjtBQUNBLGdCQUFZLE9BQU8sVUFBUCxDQUFrQixVQUFsQixFQUE2QixJQUE3QixDQUFaO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGtCQUFrQixhQUFhLGVBQWIsRUFBdEI7QUFDQSxrQkFBZ0IsZ0JBQWhCLENBQWlDLGtCQUFqQyxFQUFvRCxVQUFT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LEFBQVMsYUFBbEIsQUFBUyxBQUFxQixBQUM5QjtpQkFBQSxBQUFXLFVBQVgsQUFBcUIsQUFDckI7aUJBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxhQUFYLEFBQXVCLFlBQWxDLEFBQVcsQUFBa0MsQUFFN0M7O2dCQUFBLEFBQVUsSUEzQmQsQUEyQkksQUFBYyxBQUNqQixBQUNGO0FBakNELEFBa0NEO0FBL0NEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBIZWFkZXIgPSBmdW5jdGlvbiAoaW50ZXJmYWNlT2JqLG5hdil7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21uaGVhZGVyJyk7XHJcblxyXG4gIGxldCBjb3Vyc2VOYW1lID0gJCgnI2NvdXJzZU5hbWUnKTtcclxuICBsZXQgc2xpZGVOdW1iZXIgPSAkKCcjc2xpZGVOdW1iZXInKTtcclxuICBsZXQgc2xpZGVOYW1lID0gJCgnI3NsaWRlTmFtZScpO1xyXG4gIGxldCBoZWFkZXIgPSAkKCcjbW5oZWFkZXInKTtcclxuICBsZXQgdGltZW91dElkO1xyXG4gIGxldCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG4gIGxldCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93SGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIGxldCBibGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHNob3dIZWFkZXIoKTtcclxuICAgIHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGhpZGVIZWFkZXIsMjAwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGludGVyZmFjZU9iai5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgdmFyIGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIHZhciBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgY291cnNlTmFtZS5odG1sKG5hdi5jb3Vyc2VOYW1lKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChjdXJyU2xpZGUuaW5kZXgrJy4nKTtcclxuICAgICAgc2xpZGVOYW1lLmh0bWwoY3VyclNsaWRlLmxhYmVsKTtcclxuICAgICAgYmxpbmsoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSx3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21ubWVudScpO1xyXG5cclxuICAkKCcjbWVudS10b2MnKS5jbGljayhlID0+IHdpbk1hbmFnZXIuc2hvdygnbW50b2MnKSk7XHJcbiAgJCgnI21lbnUtZXhpdCcpLmNsaWNrKGUgPT4gY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSkpO1xyXG4gICQoJyNtZW51LXByaW50JykuY2xpY2soZSA9PiB3aW5kb3cucHJpbnQoKSk7XHJcblxyXG4gICQoJyNtZW51LXNvdW5kJylbMF0uY2hlY2tlZCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnKSA9PT0gMDtcclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnLGUudGFyZ2V0LmNoZWNrZWQgPyAwIDogMSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gd2luTWFuYWdlci5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICB3aW5NYW5hZ2VyLmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uc2V0VHVybmVkT24oZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IE5hdmJhciA9IGZ1bmN0aW9uIChjcEFwaSxuYXYsd2luTWFuYWdlcikge1xyXG4gIGxldCBuYXZiYXIgPSAkKCcjbW5uYXZiYXInKTtcclxuXHJcbiAgbGV0IGhpZGVNZW51cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRvYy5oaWRlKCk7XHJcbiAgICBtZW51LmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTmV4dFNsaWRlJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRQcmV2aW91cycsMSk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgbGV0IHRvdGFsU2xpZGVzID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvU2xpZGVDb3VudCcpO1xyXG5cclxuICAkKCcjbmF2LW5leHQnKS5jbGljaygoZSkgPT4gbmV4dCgpKTtcclxuICAkKCcjbmF2LXByZXYnKS5jbGljaygoZSkgPT4gcHJldigpKTtcclxuICAkKCcjbmF2LXRvYycpLmNsaWNrKChlKSA9PiB3aW5NYW5hZ2VyLnRvZ2dsZSgnbW50b2MnKSk7XHJcbiAgJCgnI25hdi1tZW51JykuY2xpY2soKGUpID0+IHdpbk1hbmFnZXIudG9nZ2xlKCdtbm1lbnUnKSk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2hpZ2hsaWdodCcsMCk7XHJcblxyXG4gICAgbGV0IHNsaWRlTGFiZWwgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcpO1xyXG4gICAgbGV0IHNsaWRlTnVtYmVyID0gZS5EYXRhLnNsaWRlTnVtYmVyO1xyXG4gICAgbGV0IGN1cnJTbGlkZUlkID0gbmF2LnNsaWRlc1tzbGlkZU51bWJlciAtIDFdLnNpZDtcclxuICAgIGxldCBpc0N1cnJTbGlkZUNvbXBsZXRlZCA9IGNwLkRbY3VyclNsaWRlSWRdLm1uYztcclxuXHJcbiAgICAkKCcjbmF2LW5leHQnKVswXS5kaXNhYmxlZCA9IHNsaWRlTGFiZWwgPT09ICdtbkludGVyYWN0aW9uJyAmJiAhaXNDdXJyU2xpZGVDb21wbGV0ZWQ7XHJcblxyXG4gICAgdG9jcG9zaXRpb24uaHRtbChzbGlkZU51bWJlcisnLycrdG90YWxTbGlkZXMpO1xyXG4gIH0pO1xyXG5cclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1ZBUklBQkxFVkFMVUVDSEFOR0VEJyxmdW5jdGlvbihlKSB7XHJcbiAgICBsZXQgc2xpZGVOdW1iZXIgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGUnKTtcclxuICAgIGxldCBjdXJyU2xpZGVJZCA9IG5hdi5zbGlkZXNbc2xpZGVOdW1iZXItMV0uc2lkO1xyXG4gICAgaWYoZS5EYXRhLm5ld1ZhbCA9PT0gMSkge1xyXG4gICAgICBjcC5EW2N1cnJTbGlkZUlkXS5tbmMgPSB0cnVlO1xyXG4gICAgICAkKCcjbmF2LW5leHQnKVswXS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAkKCcjbmF2LW5leHQgKyBsYWJlbCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNuYXYtbmV4dCArIGxhYmVsJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgfVxyXG4gIH0sJ2hpZ2hsaWdodCcpO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBzbGlkZU51bWJlciA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgbGV0IGN1cnJTbGlkZUlkID0gbmF2LnNsaWRlc1tzbGlkZU51bWJlci0xXS5zaWQ7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdzaG91bGQgc3RvcCcsY3AuRFtjdXJyU2xpZGVJZF0udG8tMSxlLkRhdGEubmV3VmFsKTtcclxuICAgIGlmKGNwLkRbY3VyclNsaWRlSWRdLnRvLTEgPT09IGUuRGF0YS5uZXdWYWwpIHtcclxuICAgICAgY3BBcGkucGF1c2UoKTtcclxuICAgICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnaGlnaGxpZ2h0JywxKTtcclxuICAgIH1cclxuICB9LCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVBBVVNFJyk7XHJcbiAgICAvLyQoJyNuYXYtbmV4dCcpLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4gIH0pO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZygnQ1BBUElfSU5URVJBQ1RJVkVJVEVNU1VCTUlUJyxlLkRhdGEpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgbGV0IF9tbnRvYyA9ICQoJyNtbnRvYycpO1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbnRvYycpO1xyXG5cclxuICBsZXQgb3V0cHV0ID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBvdXRwdXQucHVzaChcIjxkaXY+PGlucHV0IHR5cGU9J2J1dHRvbicgbmFtZT0ndG9jLWl0ZW0nIGlkPSd0b2MtaXRlbS1cIitpK1wiJz5cIitcclxuICAgICAgICAgICAgICAgIFwiPGxhYmVsIGZvcj0ndG9jLWl0ZW0tXCIraStcIic+XCIrXHJcbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdmYSBmYS1tYXAtbWFya2VyIGZhLWxnJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPlwiK1xyXG4gICAgICAgICAgICAgICAgXCI8c3Bhbj5cIituYXYuc2xpZGVzW2ldLmluZGV4K1wiLjwvc3Bhbj4mbmJzcDsmbmJzcDtcIitcclxuICAgICAgICAgICAgICAgIG5hdi5zbGlkZXNbaV0ubGFiZWwrXCI8L2xhYmVsPjwvZGl2PlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLGluZGV4KTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9GcmFtZUFuZFJlc3VtZScsMCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJlbE9mQ29udGVudHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBUb2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgX2lkID0gaWQ7XHJcbiAgbGV0IF9lbGVtZW50ID0gJCgnIycrX2lkKSxcclxuICBfdmlzaWJsZSA9IGZhbHNlLFxyXG4gIF90dXJuZWRvbiA9IHRydWUsXHJcblxyXG4gIF9nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9pZDtcclxuICB9LFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3Zpc2libGU7XHJcbiAgfSxcclxuXHJcbiAgX2lzVHVybmVkT24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdHVybmVkb247XHJcbiAgfSxcclxuXHJcbiAgX3Nob3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gdHJ1ZTtcclxuICAgIF9lbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVVcCgyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9zZXRUdXJuZWRPbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA/IF9zaG93KCkgOiBfaGlkZSgpO1xyXG4gICAgX3R1cm5lZG9uID0gdmFsdWU7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGUoKSA6IF9zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBpc1R1cm5lZE9uOiBfaXNUdXJuZWRPbixcclxuICAgIHNob3c6IF9zaG93LFxyXG4gICAgaGlkZTogX2hpZGUsXHJcbiAgICBzZXRUdXJuZWRPbjogX3NldFR1cm5lZE9uLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICBsZXQgX3dpbiA9IF93aW5kb3dzLmZpbHRlcih3ID0+IHtcclxuICAgICAgcmV0dXJuIHcud2luLmdldElkKCkgPT09IG5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfd2luLmxlbmd0aCA+IDAgPyBfd2luWzBdIDogbnVsbDtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIGxldCBuYXZpZ2F0aW9uO1xyXG5cclxuICBteU92ZXJsYXkgPSAkKCcjbW5vdmVybGF5Jyk7XHJcbiAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogbm9uZTsnKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb2R1bGVSZWFkeUV2ZW50XCIsIGZ1bmN0aW9uKGV2dClcclxuICB7XHJcbiAgICBjcEludGVyZmFjZSA9IGV2dC5EYXRhO1xyXG5cclxuICAgICQuZ2V0SlNPTihcIm5hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihuYXYpIHtcclxuICAgICAgICBuYXZpZ2F0aW9uID0gbmF2O1xyXG4gICAgICAgIGxldCBzbGlkZXNMaXN0ID0gY3AuRC5wcm9qZWN0X21haW4uc2xpZGVzLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgbGV0IGxhYmVscyA9IFtdO1xyXG4gICAgICAgIHNsaWRlc0xpc3QubWFwKChzbGlkZSxpbmRleCxzbGlkZXMpID0+IHtcclxuICAgICAgICAgIGlmKG5hdmlnYXRpb24uc2xpZGVzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRpb24uc2xpZGVzW2luZGV4XSA9IHtpbmRleDppbmRleCArIDEsbGFiZWw6c2xpZGV9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbmF2aWdhdGlvbi5zbGlkZXNbaW5kZXhdLnNpZCA9IHNsaWRlO1xyXG4gICAgICAgICAgLy8gRG8gZGFueWNoIHNsYWpkdSwgZG9kYWplbXkgcGFyYW1ldHIgXCJtbmNcIiBva3JlxZtsYWrEhWN5LFxyXG4gICAgICAgICAgLy8gY3p5IGVrcmFuIHpvc3RhxYIgemFsaWN6b255IChza3LDs3Qgb2QgbW5jb21wbGV0ZSkuXHJcbiAgICAgICAgICAvLyBEb215xZtsbmllIG5hZGFqZW15IG11IHTEhSBzYW3EhSB3YXJ0b8WbYyBjbyBwYXJhbWV0ciBcInZcIiAodmlzaXRlZClcclxuICAgICAgICAgIC8vIHoga29sZWpuZWdvIHNsYWpkdS5cclxuICAgICAgICAgIC8vIFBhcmFtZXRyIFwibW5jXCIgYsSZZHppZSBww7PFum5pZWogd3lrb3J6eXN0eXdhbnkgZG8gc3R3aWVyZHplbmlhLFxyXG4gICAgICAgICAgLy8gY3p5IHByemVqxZtjaWUgZG8gbmFzdMSZcG5lZ28gZWtyYW51IG5hbGXFvHkgemFibG9rb3dhYy5cclxuICAgICAgICAgIGxldCBpc05leHRTbGlkZSA9IGluZGV4ICsgMSA8IHNsaWRlcy5sZW5ndGg7XHJcbiAgICAgICAgICBjcC5EW3NsaWRlXS5tbmMgPSBpc05leHRTbGlkZSA/IGNwLkRbc2xpZGVzW2luZGV4KzFdXS52IDogZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxuYXZpZ2F0aW9uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteUhlYWRlcik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLG5hdmlnYXRpb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KGNwSW50ZXJmYWNlLHdpbk1hbmFnZXIpO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLG5hdmlnYXRpb24sd2luTWFuYWdlcik7XHJcblxyXG4gICAgICAgIG15T3ZlcmxheS5jc3MoJ2Rpc3BsYXk6IGJsb2NrOycpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiJdfQ==
