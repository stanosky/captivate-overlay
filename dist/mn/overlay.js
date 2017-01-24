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

  $('#menu-sound')[0].checked = !(cpApi.getVariableValue('cpCmndMute') === 1);
  $('#menu-sound')[0].onchange = function (e) {
    cpApi.getVariableValue('cpCmndMute', e.target.checked ? 1 : 0);
  };

  $('#menu-volume')[0].value = cpApi.getVariableValue('cpCmndVolume');
  $('#menu-volume')[0].onchange = function (e) {
    cpApi.getVariableValue('cpCmndVolume', e.target.value);
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
  var buttons = ['nav-menu', 'nav-prev', 'nav-toc', 'nav-next'];

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

  buttons.map(function (b) {
    var btn = $('#' + b);
    btn.addClass('gradient-idle');
    btn.click(function () {
      if (this.id === 'nav-next') next();
      if (this.id === 'nav-prev') prev();
      if (this.id === 'nav-toc') winManager.toggle('mntoc');
      if (this.id === 'nav-menu') winManager.toggle('mnmenu');
    });

    btn.mouseenter(function (event) {
      var btn = $('#' + event.currentTarget.id);
      btn.removeClass('gradient-idle');
      btn.addClass('gradient-over');
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
    }).mouseleave(function (event) {
      var btn = $('#' + event.currentTarget.id);
      btn.removeClass('gradient-over');
      btn.addClass('gradient-idle');
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
    });
    return btn;
  });

  var tocposition = $('#tocposition');
  var eventEmitterObj = cpApi.getEventEmitter();
  //let totalSlides = nav.slides.length;
  var totalSlides = cpApi.getVariableValue('cpInfoSlideCount');

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', function (e) {
    $('#nextbtn').removeClass('highlight-btn');
    //check mode
    //let slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    //if(slideLabel === '') navbar.addClass('hide-navbar');
    //else navbar.removeClass('hide-navbar');

    //console.log('cpInfoCurrentSlideType',cpApi.getVariableValue('cpInfoCurrentSlideType'));
    //console.log('cpInfoCurrentSlideLabel',cpApi.getVariableValue('cpInfoCurrentSlideLabel'));
    if (nav !== null) {
      var index = e.Data.slideNumber - 1;
      //let currSlide = nav.slides[index];
      var currSlide = cpApi.getVariableValue('cpInfoCurrentSlide');
      tocposition.html(currSlide + '/' + totalSlides);
    }
  });

  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED', function (e) {
    var total = cpApi.getVariableValue('cpInfoFrameCount');
    //console.log(e.Data.varName,e.Data.newVal,total);
  }, 'cpInfoCurrentFrame');

  eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function (e) {
    console.log('CPAPI_MOVIEPAUSE');
    $('#nextbtn').addClass('highlight-btn');
  });

  eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function (e) {
    console.log('CPAPI_MOVIESTOP');
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
    output.push("<div><p><span>" + nav.slides[i].index + ".</span>&nbsp;&nbsp;" + nav.slides[i].label + "</p></div>");
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
  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;
    myOverlay = $('#mnoverlay');
    myOverlay.css('display: none;');
    $.getJSON("../navigation.json", function (json) {
      //console.log('json',json);
      myHeader = new Header(cpInterface, json);
      winManager.addWindow(myHeader);
      myToc = new TableOfContents(cpInterface, json, winManager);
      winManager.addWindow(myToc);
      myMenu = new Menu(cpInterface, winManager);
      winManager.addWindow(myMenu);
      myNavbar = new Navbar(cpInterface, json, winManager);

      myOverlay.css('display: block;');
    });
  });
})();

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4,"./WindowManager":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQSxJQUFNLGVBQWUsUUFBckIsQUFBcUIsQUFBUTs7QUFFN0IsSUFBSSxTQUFTLFNBQVQsQUFBUyxPQUFBLEFBQVUsY0FBVixBQUF1QixLQUFJLEFBQ3RDO01BQUksTUFBTSxJQUFBLEFBQUksYUFBZCxBQUFVLEFBQWlCLEFBRTNCOztNQUFJLGFBQWEsRUFBakIsQUFBaUIsQUFBRSxBQUNuQjtNQUFJLGNBQWMsRUFBbEIsQUFBa0IsQUFBRSxBQUNwQjtNQUFJLFlBQVksRUFBaEIsQUFBZ0IsQUFBRSxBQUNsQjtNQUFJLFNBQVMsRUFBYixBQUFhLEFBQUUsQUFDZjtNQUFJLGlCQUFKLEFBQ0E7TUFBSSxlQUFlLFNBQWYsQUFBZSxlQUFXLEFBQzVCO1dBQUEsQUFBTyxhQURULEFBQ0UsQUFBb0IsQUFDckIsQUFDRDs7TUFBSSxhQUFhLFNBQWIsQUFBYSxhQUFZLEFBQzNCLEFBQ0E7O1FBRkYsQUFFRSxBQUFJLEFBQ0wsQUFFRDs7O01BQUksYUFBYSxTQUFiLEFBQWEsYUFBWSxBQUMzQixBQUNBOztRQUZGLEFBRUUsQUFBSSxBQUNMLEFBRUQ7OztNQUFJLFFBQVEsU0FBUixBQUFRLFFBQVksQUFDdEIsQUFDQTs7Z0JBQVksT0FBQSxBQUFPLFdBQVAsQUFBa0IsWUFGaEMsQUFFRSxBQUFZLEFBQTZCLEFBQzFDLEFBRUQ7OztNQUFJLGtCQUFrQixhQUF0QixBQUFzQixBQUFhLEFBQ25DO2tCQUFBLEFBQWdCLGlCQUFoQixBQUFp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QUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjtlQUFTLElBQUEsQUFBSSxLQUFKLEFBQVMsYUFBbEIsQUFBUyxBQUFxQixBQUM5QjtpQkFBQSxBQUFXLFVBQVgsQUFBcUIsQUFDckI7aUJBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxhQUFYLEFBQXVCLE1BQWxDLEFBQVcsQUFBNEIsQUFFdkM7O2dCQUFBLEFBQVUsSUF2QmxCLEFBUUUsQUFLRSxBQVVJLEFBQWMsQUFDakIsQUFDRixBQUNGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBIZWFkZXIgPSBmdW5jdGlvbiAoaW50ZXJmYWNlT2JqLG5hdil7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21uaGVhZGVyJyk7XHJcblxyXG4gIGxldCBjb3Vyc2VOYW1lID0gJCgnI2NvdXJzZU5hbWUnKTtcclxuICBsZXQgc2xpZGVOdW1iZXIgPSAkKCcjc2xpZGVOdW1iZXInKTtcclxuICBsZXQgc2xpZGVOYW1lID0gJCgnI3NsaWRlTmFtZScpO1xyXG4gIGxldCBoZWFkZXIgPSAkKCcjbW5oZWFkZXInKTtcclxuICBsZXQgdGltZW91dElkO1xyXG4gIGxldCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG4gIGxldCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93SGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBfdHcuc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIGxldCBibGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHNob3dIZWFkZXIoKTtcclxuICAgIHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGhpZGVIZWFkZXIsMjAwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGludGVyZmFjZU9iai5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgdmFyIGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIHZhciBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgY291cnNlTmFtZS5odG1sKG5hdi5jb3Vyc2VOYW1lKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChjdXJyU2xpZGUuaW5kZXgrJy4nKTtcclxuICAgICAgc2xpZGVOYW1lLmh0bWwoY3VyclNsaWRlLmxhYmVsKTtcclxuICAgICAgYmxpbmsoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSx3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21ubWVudScpO1xyXG5cclxuICAkKCcjbWVudS10b2MnKS5jbGljayhlID0+IHdpbk1hbmFnZXIuc2hvdygnbW50b2MnKSk7XHJcbiAgJCgnI21lbnUtZXhpdCcpLmNsaWNrKGUgPT4gY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSkpO1xyXG4gICQoJyNtZW51LXByaW50JykuY2xpY2soZSA9PiB3aW5kb3cucHJpbnQoKSk7XHJcblxyXG4gICQoJyNtZW51LXNvdW5kJylbMF0uY2hlY2tlZCA9ICEoY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTXV0ZScpID09PSAxKTtcclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLm9uY2hhbmdlID0gKGUpID0+IHtcclxuICAgIGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE11dGUnLGUudGFyZ2V0LmNoZWNrZWQgPyAxIDogMCk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gd2luTWFuYWdlci5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICB3aW5NYW5hZ2VyLmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uc2V0VHVybmVkT24oZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IE5hdmJhciA9IGZ1bmN0aW9uIChjcEFwaSxuYXYsd2luTWFuYWdlcikge1xyXG4gIGxldCBuYXZiYXIgPSAkKCcjbW5uYXZiYXInKTtcclxuICBsZXQgYnV0dG9ucyA9IFsnbmF2LW1lbnUnLCduYXYtcHJldicsJ25hdi10b2MnLCduYXYtbmV4dCddO1xyXG5cclxuICBsZXQgaGlkZU1lbnVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdG9jLmhpZGUoKTtcclxuICAgIG1lbnUuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBuZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmROZXh0U2xpZGUnLDEpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZFByZXZpb3VzJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGJ1dHRvbnMubWFwKCBiID0+IHtcclxuICAgIGxldCBidG4gPSAkKCcjJytiKTtcclxuICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgYnRuLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmF2LW5leHQnKSBuZXh0KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtcHJldicpIHByZXYoKTtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi10b2MnKSB3aW5NYW5hZ2VyLnRvZ2dsZSgnbW50b2MnKTtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi1tZW51Jykgd2luTWFuYWdlci50b2dnbGUoJ21ubWVudScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYnRuLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LW92ZXInKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1pZGxlJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGJ0bjtcclxuICB9KTtcclxuICBcclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgLy9sZXQgdG90YWxTbGlkZXMgPSBuYXYuc2xpZGVzLmxlbmd0aDtcclxuICBsZXQgdG90YWxTbGlkZXMgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9TbGlkZUNvdW50Jyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgICQoJyNuZXh0YnRuJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICAgIC8vY2hlY2sgbW9kZVxyXG4gICAgLy9sZXQgc2xpZGVMYWJlbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJyk7XHJcbiAgICAvL2lmKHNsaWRlTGFiZWwgPT09ICcnKSBuYXZiYXIuYWRkQ2xhc3MoJ2hpZGUtbmF2YmFyJyk7XHJcbiAgICAvL2Vsc2UgbmF2YmFyLnJlbW92ZUNsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnKSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcsY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKSk7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgbGV0IGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIC8vbGV0IGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBsZXQgY3VyclNsaWRlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICAgIHRvY3Bvc2l0aW9uLmh0bWwoY3VyclNsaWRlKycvJyt0b3RhbFNsaWRlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IHRvdGFsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvRnJhbWVDb3VudCcpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhlLkRhdGEudmFyTmFtZSxlLkRhdGEubmV3VmFsLHRvdGFsKTtcclxuICB9LCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ1BBUElfTU9WSUVQQVVTRScpO1xyXG4gICAgJCgnI25leHRidG4nKS5hZGRDbGFzcygnaGlnaGxpZ2h0LWJ0bicpO1xyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVTVE9QJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgbGV0IF9tbnRvYyA9ICQoJyNtbnRvYycpO1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbnRvYycpO1xyXG5cclxuICBsZXQgb3V0cHV0ID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBvdXRwdXQucHVzaChcIjxkaXY+PHA+PHNwYW4+XCIrbmF2LnNsaWRlc1tpXS5pbmRleCtcclxuICAgICAgICAgICAgICAgIFwiLjwvc3Bhbj4mbmJzcDsmbmJzcDtcIituYXYuc2xpZGVzW2ldLmxhYmVsK1wiPC9wPjwvZGl2PlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLGluZGV4KTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9GcmFtZUFuZFJlc3VtZScsMCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJlbE9mQ29udGVudHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBUb2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgX2lkID0gaWQ7XHJcbiAgbGV0IF9lbGVtZW50ID0gJCgnIycrX2lkKSxcclxuICBfdmlzaWJsZSA9IGZhbHNlLFxyXG4gIF90dXJuZWRvbiA9IHRydWUsXHJcblxyXG4gIF9nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9pZDtcclxuICB9LFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3Zpc2libGU7XHJcbiAgfSxcclxuXHJcbiAgX2lzVHVybmVkT24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdHVybmVkb247XHJcbiAgfSxcclxuXHJcbiAgX3Nob3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gdHJ1ZTtcclxuICAgIF9lbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVVcCgyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9zZXRUdXJuZWRPbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA/IF9zaG93KCkgOiBfaGlkZSgpO1xyXG4gICAgX3R1cm5lZG9uID0gdmFsdWU7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGUoKSA6IF9zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBpc1R1cm5lZE9uOiBfaXNUdXJuZWRPbixcclxuICAgIHNob3c6IF9zaG93LFxyXG4gICAgaGlkZTogX2hpZGUsXHJcbiAgICBzZXRUdXJuZWRPbjogX3NldFR1cm5lZE9uLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICBsZXQgX3dpbiA9IF93aW5kb3dzLmZpbHRlcih3ID0+IHtcclxuICAgICAgcmV0dXJuIHcud2luLmdldElkKCkgPT09IG5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfd2luLmxlbmd0aCA+IDAgPyBfd2luWzBdIDogbnVsbDtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuICAgIG15T3ZlcmxheSA9ICQoJyNtbm92ZXJsYXknKTtcclxuICAgIG15T3ZlcmxheS5jc3MoJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcbiAgICAkLmdldEpTT04oXCIuLi9uYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2pzb24nLGpzb24pO1xyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxqc29uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteUhlYWRlcik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLGpzb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KGNwSW50ZXJmYWNlLHdpbk1hbmFnZXIpO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLGpzb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogYmxvY2s7Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkoKTtcclxuIl19
