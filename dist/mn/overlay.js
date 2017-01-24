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
  console.log("$('#menu-volume')", $('#menu-volume'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQSxJQUFNLGVBQWUsUUFBckIsQUFBcUIsQUFBUTs7QUFFN0IsSUFBSSxTQUFTLFNBQVQsQUFBUyxPQUFBLEFBQVUsY0FBVixBQUF1QixLQUFJLEFBQ3RDO01BQUksTUFBTSxJQUFBLEFBQUksYUFBZCxBQUFVLEFBQWlCLEFBRTNCOztNQUFJLGFBQWEsRUFBakIsQUFBaUIsQUFBRSxBQUNuQjtNQUFJLGNBQWMsRUFBbEIsQUFBa0IsQUFBRSxBQUNwQjtNQUFJLFlBQVksRUFBaEIsQUFBZ0IsQUFBRSxBQUNsQjtNQUFJLFNBQVMsRUFBYixBQUFhLEFBQUUsQUFDZjtNQUFJLGlCQUFKLEFBQ0E7TUFBSSxlQUFlLFNBQWYsQUFBZSxlQUFXLEFBQzVCO1dBQUEsQUFBTyxhQURULEFBQ0UsQUFBb0IsQUFDckIsQUFDRDs7TUFBSSxhQUFhLFNBQWIsQUFBYSxhQUFZLEFBQzNCLEFBQ0E7O1FBRkYsQUFFRSxBQUFJLEFBQ0wsQUFFRDs7O01BQUksYUFBYSxTQUFiLEFBQWEsYUFBWSxBQUMzQixBQUNBOztRQUZGLEFBRUUsQUFBSSxBQUNMLEFBRUQ7OztNQUFJLFFBQVEsU0FBUixBQUFRLFFBQVksQUFDdEIsQUFDQTs7Z0JBQVksT0FBQSxBQUFPLFdBQVAsQUFBa0IsWUFGaEMsQUFFRSxBQUFZLEFBQTZCLEFBQzFDLEFBRUQ7OztNQUFJLGtCQUFrQixhQUF0QixBQUFzQixBQUFhLEFBQ25DO2tCQUFBLEFBQWdCLGlCQUFoQixBQUFp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QUNBLGNBQVEsSUFBSSxlQUFKLENBQW9CLFdBQXBCLEVBQWdDLElBQWhDLEVBQXFDLFVBQXJDLENBQVI7QUFDQSxpQkFBVyxTQUFYLENBQXFCLEtBQXJCO0FBQ0EsZUFBUyxJQUFJLElBQUosQ0FBUyxXQUFULEVBQXFCLFVBQXJCLENBQVQ7QUFDQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixJQUF2QixFQUE0QixVQUE1QixDQUFYOztBQUVBLGdCQUFVLEdBQVYsQ0FBYyxpQkFBZDtBQUNILEtBWEQ7QUFZRCxHQWpCRDtBQWtCRCxDQTFCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgSGVhZGVyID0gZnVuY3Rpb24gKGludGVyZmFjZU9iaixuYXYpe1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbmhlYWRlcicpO1xyXG5cclxuICBsZXQgY291cnNlTmFtZSA9ICQoJyNjb3Vyc2VOYW1lJyk7XHJcbiAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgbGV0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuICBsZXQgaGVhZGVyID0gJCgnI21uaGVhZGVyJyk7XHJcbiAgbGV0IHRpbWVvdXRJZDtcclxuICBsZXQgY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XHJcbiAgfTtcclxuICBsZXQgaGlkZUhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNsZWFyVGltZW91dCgpO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgc2hvd0hlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNsZWFyVGltZW91dCgpO1xyXG4gICAgX3R3LnNob3coKTtcclxuICB9O1xyXG5cclxuICBsZXQgYmxpbmsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBzaG93SGVhZGVyKCk7XHJcbiAgICB0aW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dChoaWRlSGVhZGVyLDIwMDApO1xyXG4gIH07XHJcblxyXG4gIGxldCBldmVudEVtaXR0ZXJPYmogPSBpbnRlcmZhY2VPYmouZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRU5URVInLGZ1bmN0aW9uKGUpe1xyXG4gICAgaWYobmF2ICE9PSBudWxsKSB7XHJcbiAgICAgIHZhciBpbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICB2YXIgY3VyclNsaWRlID0gbmF2LnNsaWRlc1tpbmRleF07XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuY291cnNlTmFtZSk7XHJcbiAgICAgIHNsaWRlTnVtYmVyLmh0bWwoY3VyclNsaWRlLmluZGV4KycuJyk7XHJcbiAgICAgIHNsaWRlTmFtZS5odG1sKGN1cnJTbGlkZS5sYWJlbCk7XHJcbiAgICAgIGJsaW5rKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJyNtbmhlYWRlcicpLnNsaWRlVXAoMCk7XHJcbiAgJCggXCIjbW5yb2xsb3ZlclwiIClcclxuICAgIC5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHNob3dIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSlcclxuICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGhpZGVIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxubGV0IE1lbnUgPSBmdW5jdGlvbiAoY3BBcGksd2luTWFuYWdlcikge1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbm1lbnUnKTtcclxuXHJcbiAgJCgnI21lbnUtdG9jJykuY2xpY2soZSA9PiB3aW5NYW5hZ2VyLnNob3coJ21udG9jJykpO1xyXG4gICQoJyNtZW51LWV4aXQnKS5jbGljayhlID0+IGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEV4aXQnLDEpKTtcclxuICAkKCcjbWVudS1wcmludCcpLmNsaWNrKGUgPT4gd2luZG93LnByaW50KCkpO1xyXG5cclxuICAkKCcjbWVudS1zb3VuZCcpWzBdLmNoZWNrZWQgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJykgPT09IDA7XHJcbiAgJCgnI21lbnUtc291bmQnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJyxlLnRhcmdldC5jaGVja2VkID8gMCA6IDEpO1xyXG4gIH07XHJcbiAgY29uc29sZS5sb2coXCIkKCcjbWVudS12b2x1bWUnKVwiLCAkKCcjbWVudS12b2x1bWUnKSk7XHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0udmFsdWUgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnKTtcclxuICAkKCcjbWVudS12b2x1bWUnKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRWb2x1bWUnLGUudGFyZ2V0LnZhbHVlKTtcclxuICB9O1xyXG5cclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5jaGVja2VkID0gd2luTWFuYWdlci5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLmlzVHVybmVkT24oKTtcclxuICAkKCcjbWVudS1oZWFkZXInKVswXS5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICB3aW5NYW5hZ2VyLmdldFdpbmRvdygnbW5oZWFkZXInKS53aW4uc2V0VHVybmVkT24oZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IE5hdmJhciA9IGZ1bmN0aW9uIChjcEFwaSxuYXYsd2luTWFuYWdlcikge1xyXG4gIGxldCBuYXZiYXIgPSAkKCcjbW5uYXZiYXInKTtcclxuICBsZXQgYnV0dG9ucyA9IFsnbmF2LW1lbnUnLCduYXYtcHJldicsJ25hdi10b2MnLCduYXYtbmV4dCddO1xyXG5cclxuICBsZXQgaGlkZU1lbnVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdG9jLmhpZGUoKTtcclxuICAgIG1lbnUuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBuZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmROZXh0U2xpZGUnLDEpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZFByZXZpb3VzJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGJ1dHRvbnMubWFwKCBiID0+IHtcclxuICAgIGxldCBidG4gPSAkKCcjJytiKTtcclxuICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgYnRuLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmF2LW5leHQnKSBuZXh0KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtcHJldicpIHByZXYoKTtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi10b2MnKSB3aW5NYW5hZ2VyLnRvZ2dsZSgnbW50b2MnKTtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi1tZW51Jykgd2luTWFuYWdlci50b2dnbGUoJ21ubWVudScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYnRuLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LW92ZXInKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1pZGxlJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGJ0bjtcclxuICB9KTtcclxuICBcclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgLy9sZXQgdG90YWxTbGlkZXMgPSBuYXYuc2xpZGVzLmxlbmd0aDtcclxuICBsZXQgdG90YWxTbGlkZXMgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9TbGlkZUNvdW50Jyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgICQoJyNuZXh0YnRuJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICAgIC8vY2hlY2sgbW9kZVxyXG4gICAgLy9sZXQgc2xpZGVMYWJlbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJyk7XHJcbiAgICAvL2lmKHNsaWRlTGFiZWwgPT09ICcnKSBuYXZiYXIuYWRkQ2xhc3MoJ2hpZGUtbmF2YmFyJyk7XHJcbiAgICAvL2Vsc2UgbmF2YmFyLnJlbW92ZUNsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnKSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcsY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKSk7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgbGV0IGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIC8vbGV0IGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBsZXQgY3VyclNsaWRlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICAgIHRvY3Bvc2l0aW9uLmh0bWwoY3VyclNsaWRlKycvJyt0b3RhbFNsaWRlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IHRvdGFsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvRnJhbWVDb3VudCcpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhlLkRhdGEudmFyTmFtZSxlLkRhdGEubmV3VmFsLHRvdGFsKTtcclxuICB9LCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ1BBUElfTU9WSUVQQVVTRScpO1xyXG4gICAgJCgnI25leHRidG4nKS5hZGRDbGFzcygnaGlnaGxpZ2h0LWJ0bicpO1xyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVTVE9QJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgbGV0IF9tbnRvYyA9ICQoJyNtbnRvYycpO1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbnRvYycpO1xyXG5cclxuICBsZXQgb3V0cHV0ID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBvdXRwdXQucHVzaChcIjxkaXY+PHA+PHNwYW4+XCIrbmF2LnNsaWRlc1tpXS5pbmRleCtcclxuICAgICAgICAgICAgICAgIFwiLjwvc3Bhbj4mbmJzcDsmbmJzcDtcIituYXYuc2xpZGVzW2ldLmxhYmVsK1wiPC9wPjwvZGl2PlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5zbGlkZXMtZ3JvdXAnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnLnNsaWRlcy1ncm91cCBkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQodGhpcykuaW5kZXgoKSk7XHJcbiAgICBsZXQgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLGluZGV4KTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9GcmFtZUFuZFJlc3VtZScsMCk7XHJcbiAgICBfdHcuaGlkZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2luOiBfdHdcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJlbE9mQ29udGVudHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBUb2dnbGVXaW5kb3cgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgX2lkID0gaWQ7XHJcbiAgbGV0IF9lbGVtZW50ID0gJCgnIycrX2lkKSxcclxuICBfdmlzaWJsZSA9IGZhbHNlLFxyXG4gIF90dXJuZWRvbiA9IHRydWUsXHJcblxyXG4gIF9nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9pZDtcclxuICB9LFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX3Zpc2libGU7XHJcbiAgfSxcclxuXHJcbiAgX2lzVHVybmVkT24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdHVybmVkb247XHJcbiAgfSxcclxuXHJcbiAgX3Nob3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gdHJ1ZTtcclxuICAgIF9lbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZighX3R1cm5lZG9uKSByZXR1cm47XHJcbiAgICBfdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVVcCgyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9zZXRUdXJuZWRPbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA/IF9zaG93KCkgOiBfaGlkZSgpO1xyXG4gICAgX3R1cm5lZG9uID0gdmFsdWU7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGUoKSA6IF9zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBpc1R1cm5lZE9uOiBfaXNUdXJuZWRPbixcclxuICAgIHNob3c6IF9zaG93LFxyXG4gICAgaGlkZTogX2hpZGUsXHJcbiAgICBzZXRUdXJuZWRPbjogX3NldFR1cm5lZE9uLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9nZXRXaW5kb3cgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICBsZXQgX3dpbiA9IF93aW5kb3dzLmZpbHRlcih3ID0+IHtcclxuICAgICAgcmV0dXJuIHcud2luLmdldElkKCkgPT09IG5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfd2luLmxlbmd0aCA+IDAgPyBfd2luWzBdIDogbnVsbDtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvdyxcclxuICAgIGdldFdpbmRvdzogX2dldFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuICAgIG15T3ZlcmxheSA9ICQoJyNtbm92ZXJsYXknKTtcclxuICAgIG15T3ZlcmxheS5jc3MoJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcbiAgICAkLmdldEpTT04oXCIuLi9uYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2pzb24nLGpzb24pO1xyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxqc29uKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteUhlYWRlcik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLGpzb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KGNwSW50ZXJmYWNlLHdpbk1hbmFnZXIpO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLGpzb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogYmxvY2s7Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkoKTtcclxuIl19
