(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Header = function Header(interfaceObj, nav) {
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
    header.slideUp(100);
  };

  var showHeader = function showHeader() {
    clearTimeout();
    header.slideDown(100);
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
    show: showHeader,
    hide: hideHeader
  };
};

module.exports = Header;

},{}],2:[function(require,module,exports){
'use strict';

var ToggleWindow = require('./ToggleWindow');

var Menu = function Menu(cpApi, winManager) {
  var _tw = new ToggleWindow('mnmenu');
  var _btns = ['menu-toc', 'menu-materials', 'menu-glossary', 'menu-bibliography', 'menu-help', 'menu-print', 'menu-save', 'menu-exit', 'menu-sound', 'menu-volume', 'menu-animations', 'menu-header'];
  _btns.map(function (b) {
    var btn = $('#' + b);
    btn.click(function () {
      if (this.id === 'menu-toc') winManager.show('mntoc');
      if (this.id === 'menu-exit') cpApi.setVariableValue('cpCmndExit', 1);
      if (this.id === 'menu-print') {
        //$('#mnoverlay').hide();
        window.print();
        //$('#mnoverlay').show();
      }
    });
  });

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
      _getId = function _getId() {
    return _id;
  },
      _isVisible = function _isVisible() {
    return _visible;
  },
      _showToc = function _showToc() {
    _visible = true;
    _element.slideDown(200);
  },
      _hideToc = function _hideToc() {
    _visible = false;
    _element.slideUp(200);
  },
      _toggleVisible = function _toggleVisible() {
    _visible ? _hideToc() : _showToc();
  };

  _element.slideUp(0);

  return {
    getId: _getId,
    isVisible: _isVisible,
    show: _showToc,
    hide: _hideToc,
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

  return {
    toggle: _toggleWindow,
    show: _showWindow,
    hide: _hideWindow,
    addWindow: _addWindow
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
      myToc = new TableOfContents(cpInterface, json, winManager);
      myMenu = new Menu(cpInterface, winManager);
      myNavbar = new Navbar(cpInterface, json, winManager);

      winManager.addWindow(myToc);
      winManager.addWindow(myMenu);
      myOverlay.css('display: block;');
    });
  });
})();

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4,"./WindowManager":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsWUFBVixFQUF1QixHQUF2QixFQUEyQjtBQUN0QyxNQUFJLGFBQWEsRUFBRSxhQUFGLENBQWpCO0FBQ0EsTUFBSSxjQUFjLEVBQUUsY0FBRixDQUFsQjtBQUNBLE1BQUksWUFBWSxFQUFFLFlBQUYsQ0FBaEI7QUFDQSxNQUFJLFNBQVMsRUFBRSxXQUFGLENBQWI7QUFDQSxNQUFJLGtCQUFKO0FBQ0EsTUFBSSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzVCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7QUFHQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxXQUFPLE9BQVAsQ0FBZSxHQUFmO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxXQUFPLFNBQVAsQ0FBaUIsR0FBakI7QUFDRCxHQUhEOztBQUtBLE1BQUksUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN0QjtBQUNBLGdCQUFZLE9BQU8sVUFBUCxDQUFrQixVQUFsQixFQUE2QixJQUE3QixDQUFaO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGtCQUFrQixhQUFhLGVBQWIsRUFBdEI7QUFDQSxrQkFBZ0IsZ0JBQWhCLENBQWlDLGtCQUFqQyxFQUFvRCxVQUFTLENBQVQsRUFBVztBQUM3RCxRQUFHLFFBQVEsSUFBWCxFQUFpQjtBQUNmLFVBQUksUUFBUSxF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QVg7O0FBRUEsaUJBQVcsU0FBWCxDQUFxQixLQUFyQjtBQUNBLGlCQUFXLFNBQVgsQ0FBcUIsTUFBckI7QUFDQSxnQkFBVSxHQUFWLENBQWMsaUJBQWQ7QUFDSCxLQVZEO0FBV0QsR0FoQkQ7QUFpQkQsQ0F6QkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IEhlYWRlciA9IGZ1bmN0aW9uIChpbnRlcmZhY2VPYmosbmF2KXtcclxuICBsZXQgY291cnNlTmFtZSA9ICQoJyNjb3Vyc2VOYW1lJyk7XHJcbiAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgbGV0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuICBsZXQgaGVhZGVyID0gJCgnI21uaGVhZGVyJyk7XHJcbiAgbGV0IHRpbWVvdXRJZDtcclxuICBsZXQgY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XHJcbiAgfTtcclxuICBsZXQgaGlkZUhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNsZWFyVGltZW91dCgpO1xyXG4gICAgaGVhZGVyLnNsaWRlVXAoMTAwKTtcclxuICB9O1xyXG5cclxuICBsZXQgc2hvd0hlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNsZWFyVGltZW91dCgpO1xyXG4gICAgaGVhZGVyLnNsaWRlRG93bigxMDApO1xyXG4gIH07XHJcblxyXG4gIGxldCBibGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHNob3dIZWFkZXIoKTtcclxuICAgIHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGhpZGVIZWFkZXIsMjAwMCk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGV2ZW50RW1pdHRlck9iaiA9IGludGVyZmFjZU9iai5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgdmFyIGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIHZhciBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgY291cnNlTmFtZS5odG1sKG5hdi5jb3Vyc2VOYW1lKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChjdXJyU2xpZGUuaW5kZXgrJy4nKTtcclxuICAgICAgc2xpZGVOYW1lLmh0bWwoY3VyclNsaWRlLmxhYmVsKTtcclxuICAgICAgYmxpbmsoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICByZXR1cm4ge1xyXG4gICAgc2hvdzogc2hvd0hlYWRlcixcclxuICAgIGhpZGU6IGhpZGVIZWFkZXJcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uIChjcEFwaSx3aW5NYW5hZ2VyKSB7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21ubWVudScpO1xyXG4gIGxldCBfYnRucyA9IFsnbWVudS10b2MnLCdtZW51LW1hdGVyaWFscycsJ21lbnUtZ2xvc3NhcnknLCdtZW51LWJpYmxpb2dyYXBoeScsXHJcbiAgICAgICAgICAgICAgJ21lbnUtaGVscCcsJ21lbnUtcHJpbnQnLCdtZW51LXNhdmUnLCdtZW51LWV4aXQnLCdtZW51LXNvdW5kJyxcclxuICAgICAgICAgICAgICAnbWVudS12b2x1bWUnLCdtZW51LWFuaW1hdGlvbnMnLCdtZW51LWhlYWRlciddO1xyXG4gIF9idG5zLm1hcChiID0+IHtcclxuICAgIGxldCBidG4gPSAkKCcjJytiKTtcclxuICAgIGJ0bi5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ21lbnUtdG9jJykgd2luTWFuYWdlci5zaG93KCdtbnRvYycpO1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbWVudS1leGl0JykgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICdtZW51LXByaW50Jykge1xyXG4gICAgICAgIC8vJCgnI21ub3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgICB3aW5kb3cucHJpbnQoKTtcclxuICAgICAgICAvLyQoJyNtbm92ZXJsYXknKS5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBOYXZiYXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2LHdpbk1hbmFnZXIpIHtcclxuICBsZXQgbmF2YmFyID0gJCgnI21ubmF2YmFyJyk7XHJcbiAgbGV0IGJ1dHRvbnMgPSBbJ25hdi1tZW51JywnbmF2LXByZXYnLCduYXYtdG9jJywnbmF2LW5leHQnXTtcclxuXHJcbiAgbGV0IGhpZGVNZW51cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRvYy5oaWRlKCk7XHJcbiAgICBtZW51LmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTmV4dFNsaWRlJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRQcmV2aW91cycsMSk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBidXR0b25zLm1hcCggYiA9PiB7XHJcbiAgICBsZXQgYnRuID0gJCgnIycrYik7XHJcbiAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgIGJ0bi5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi1uZXh0JykgbmV4dCgpO1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmF2LXByZXYnKSBwcmV2KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtdG9jJykgd2luTWFuYWdlci50b2dnbGUoJ21udG9jJyk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtbWVudScpIHdpbk1hbmFnZXIudG9nZ2xlKCdtbm1lbnUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGJ0bi5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGxldCBidG4gPSAkKCcjJytldmVudC5jdXJyZW50VGFyZ2V0LmlkKTtcclxuICAgICAgYnRuLnJlbW92ZUNsYXNzKCdncmFkaWVudC1pZGxlJyk7XHJcbiAgICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtb3ZlcicpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KS5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGxldCBidG4gPSAkKCcjJytldmVudC5jdXJyZW50VGFyZ2V0LmlkKTtcclxuICAgICAgYnRuLnJlbW92ZUNsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBidG47XHJcbiAgfSk7XHJcbiAgXHJcbiAgbGV0IHRvY3Bvc2l0aW9uID0gJCgnI3RvY3Bvc2l0aW9uJyk7XHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGNwQXBpLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIC8vbGV0IHRvdGFsU2xpZGVzID0gbmF2LnNsaWRlcy5sZW5ndGg7XHJcbiAgbGV0IHRvdGFsU2xpZGVzID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvU2xpZGVDb3VudCcpO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICAkKCcjbmV4dGJ0bicpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQtYnRuJyk7XHJcbiAgICAvL2NoZWNrIG1vZGVcclxuICAgIC8vbGV0IHNsaWRlTGFiZWwgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcpO1xyXG4gICAgLy9pZihzbGlkZUxhYmVsID09PSAnJykgbmF2YmFyLmFkZENsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG4gICAgLy9lbHNlIG5hdmJhci5yZW1vdmVDbGFzcygnaGlkZS1uYXZiYXInKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVUeXBlJyxjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVUeXBlJykpO1xyXG4gICAgLy9jb25zb2xlLmxvZygnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJykpO1xyXG4gICAgaWYobmF2ICE9PSBudWxsKSB7XHJcbiAgICAgIGxldCBpbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICAvL2xldCBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgbGV0IGN1cnJTbGlkZSA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgICB0b2Nwb3NpdGlvbi5odG1sKGN1cnJTbGlkZSsnLycrdG90YWxTbGlkZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCB0b3RhbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0ZyYW1lQ291bnQnKTtcclxuICAgIC8vY29uc29sZS5sb2coZS5EYXRhLnZhck5hbWUsZS5EYXRhLm5ld1ZhbCx0b3RhbCk7XHJcbiAgfSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVBBVVNFJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFUEFVU0UnKTtcclxuICAgICQoJyNuZXh0YnRuJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVNUT1AnKTtcclxuICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgVGFiZWxPZkNvbnRlbnRzID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBfbW50b2MgPSAkKCcjbW50b2MnKTtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW50b2MnKTtcclxuXHJcbiAgbGV0IG91dHB1dCA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2LnNsaWRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgb3V0cHV0LnB1c2goXCI8ZGl2PjxwPjxzcGFuPlwiK25hdi5zbGlkZXNbaV0uaW5kZXgrXHJcbiAgICAgICAgICAgICAgICBcIi48L3NwYW4+Jm5ic3A7Jm5ic3A7XCIrbmF2LnNsaWRlc1tpXS5sYWJlbCtcIjwvcD48L2Rpdj5cIik7XHJcbiAgfVxyXG4gICQoJyNtbnRvYyAuc2xpZGVzLWdyb3VwJykuaHRtbChvdXRwdXQuam9pbignJykpO1xyXG4gICQoJy5zbGlkZXMtZ3JvdXAgZGl2JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZygkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgbGV0IGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxpbmRleCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvRnJhbWVBbmRSZXN1bWUnLDApO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFiZWxPZkNvbnRlbnRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgVG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IF9pZCA9IGlkO1xyXG4gIGxldCBfZWxlbWVudCA9ICQoJyMnK19pZCksXHJcbiAgX3Zpc2libGUgPSBmYWxzZSxcclxuXHJcbiAgX2dldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX2lkO1xyXG4gIH0sXHJcblxyXG4gIF9pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfc2hvd1RvYyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX3Zpc2libGUgPSB0cnVlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVEb3duKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGVUb2MgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID0gZmFsc2U7XHJcbiAgICBfZWxlbWVudC5zbGlkZVVwKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGVUb2MoKSA6IF9zaG93VG9jKCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBzaG93OiBfc2hvd1RvYyxcclxuICAgIGhpZGU6IF9oaWRlVG9jLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuICAgIG15T3ZlcmxheSA9ICQoJyNtbm92ZXJsYXknKTtcclxuICAgIG15T3ZlcmxheS5jc3MoJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcbiAgICAkLmdldEpTT04oXCIuLi9uYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2pzb24nLGpzb24pO1xyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxqc29uKTtcclxuICAgICAgICBteVRvYyA9IG5ldyBUYWJsZU9mQ29udGVudHMoY3BJbnRlcmZhY2UsanNvbix3aW5NYW5hZ2VyKTtcclxuICAgICAgICBteU1lbnUgPSBuZXcgTWVudShjcEludGVyZmFjZSx3aW5NYW5hZ2VyKTtcclxuICAgICAgICBteU5hdmJhciA9IG5ldyBOYXZiYXIoY3BJbnRlcmZhY2UsanNvbix3aW5NYW5hZ2VyKTtcclxuXHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogYmxvY2s7Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkoKTtcclxuIl19
