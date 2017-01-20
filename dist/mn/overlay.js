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
      if (!btn.hasClass('menu-inactive')) {
        if (this.id === 'menu-toc') winManager.show('mntoc');
        if (this.id === 'menu-exit') cpApi.setVariableValue('cpCmndExit', 1);
        if (this.id === 'menu-print') window.print();
        if (this.id === 'menu-materials') console.log('materials btn clicked');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsWUFBVixFQUF1QixHQUF2QixFQUEyQjtBQUN0QyxNQUFJLGFBQWEsRUFBRSxhQUFGLENBQWpCO0FBQ0EsTUFBSSxjQUFjLEVBQUUsY0FBRixDQUFsQjtBQUNBLE1BQUksWUFBWSxFQUFFLFlBQUYsQ0FBaEI7QUFDQSxNQUFJLFNBQVMsRUFBRSxXQUFGLENBQWI7QUFDQSxNQUFJLGtCQUFKO0FBQ0EsTUFBSSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzVCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7QUFHQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxXQUFPLE9BQVAsQ0FBZSxHQUFmO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxXQUFPLFNBQVAsQ0FBaUIsR0FBakI7QUFDRCxHQUhEOztBQUtBLE1BQUksUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN0QjtBQUNBLGdCQUFZLE9BQU8sVUFBUCxDQUFrQixVQUFsQixFQUE2QixJQUE3QixDQUFaO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGtCQUFrQixhQUFhLGVBQWIsRUFBdEI7QUFDQSxrQkFBZ0IsZ0JBQWhCLENBQWlDLGtCQUFqQyxFQUFvRCxVQUFTLENBQVQsRUFBVztBQUM3RCxRQUFHLFFBQVEsSUFBWCxFQUFpQjtBQUNmLFVBQUksUUFBUSxF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SSxJQUFKLENBQVMsV0FBVCxFQUFxQixVQUFyQixDQUFUO0FBQ0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixJQUF2QixFQUE0QixVQUE1QixDQUFYOztBQUVBLGlCQUFXLFNBQVgsQ0FBcUIsS0FBckI7QUFDQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0EsZ0JBQVUsR0FBVixDQUFjLGlCQUFkO0FBQ0gsS0FWRDtBQVdELEdBaEJEO0FBaUJELENBekJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBIZWFkZXIgPSBmdW5jdGlvbiAoaW50ZXJmYWNlT2JqLG5hdil7XHJcbiAgbGV0IGNvdXJzZU5hbWUgPSAkKCcjY291cnNlTmFtZScpO1xyXG4gIGxldCBzbGlkZU51bWJlciA9ICQoJyNzbGlkZU51bWJlcicpO1xyXG4gIGxldCBzbGlkZU5hbWUgPSAkKCcjc2xpZGVOYW1lJyk7XHJcbiAgbGV0IGhlYWRlciA9ICQoJyNtbmhlYWRlcicpO1xyXG4gIGxldCB0aW1lb3V0SWQ7XHJcbiAgbGV0IGNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xyXG4gIH07XHJcbiAgbGV0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIGhlYWRlci5zbGlkZVVwKDEwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIGhlYWRlci5zbGlkZURvd24oMTAwKTtcclxuICB9O1xyXG5cclxuICBsZXQgYmxpbmsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBzaG93SGVhZGVyKCk7XHJcbiAgICB0aW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dChoaWRlSGVhZGVyLDIwMDApO1xyXG4gIH07XHJcblxyXG4gIHZhciBldmVudEVtaXR0ZXJPYmogPSBpbnRlcmZhY2VPYmouZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRU5URVInLGZ1bmN0aW9uKGUpe1xyXG4gICAgaWYobmF2ICE9PSBudWxsKSB7XHJcbiAgICAgIHZhciBpbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICB2YXIgY3VyclNsaWRlID0gbmF2LnNsaWRlc1tpbmRleF07XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuY291cnNlTmFtZSk7XHJcbiAgICAgIHNsaWRlTnVtYmVyLmh0bWwoY3VyclNsaWRlLmluZGV4KycuJyk7XHJcbiAgICAgIHNsaWRlTmFtZS5odG1sKGN1cnJTbGlkZS5sYWJlbCk7XHJcbiAgICAgIGJsaW5rKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJyNtbmhlYWRlcicpLnNsaWRlVXAoMCk7XHJcbiAgJCggXCIjbW5yb2xsb3ZlclwiIClcclxuICAgIC5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHNob3dIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSlcclxuICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGhpZGVIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHNob3c6IHNob3dIZWFkZXIsXHJcbiAgICBoaWRlOiBoaWRlSGVhZGVyXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxubGV0IE1lbnUgPSBmdW5jdGlvbiAoY3BBcGksd2luTWFuYWdlcikge1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbm1lbnUnKTtcclxuICBsZXQgX2J0bnMgPSBbJ21lbnUtdG9jJywnbWVudS1tYXRlcmlhbHMnLCdtZW51LWdsb3NzYXJ5JywnbWVudS1iaWJsaW9ncmFwaHknLFxyXG4gICAgICAgICAgICAgICdtZW51LWhlbHAnLCdtZW51LXByaW50JywnbWVudS1zYXZlJywnbWVudS1leGl0JywnbWVudS1zb3VuZCcsXHJcbiAgICAgICAgICAgICAgJ21lbnUtdm9sdW1lJywnbWVudS1hbmltYXRpb25zJywnbWVudS1oZWFkZXInXTtcclxuICBfYnRucy5tYXAoYiA9PiB7XHJcbiAgICBsZXQgYnRuID0gJCgnIycrYik7XHJcbiAgICBidG4uY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKCFidG4uaGFzQ2xhc3MoJ21lbnUtaW5hY3RpdmUnKSkge1xyXG4gICAgICAgIGlmKHRoaXMuaWQgPT09ICdtZW51LXRvYycpIHdpbk1hbmFnZXIuc2hvdygnbW50b2MnKTtcclxuICAgICAgICBpZih0aGlzLmlkID09PSAnbWVudS1leGl0JykgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kRXhpdCcsMSk7XHJcbiAgICAgICAgaWYodGhpcy5pZCA9PT0gJ21lbnUtcHJpbnQnKSB3aW5kb3cucHJpbnQoKTtcclxuICAgICAgICBpZih0aGlzLmlkID09PSAnbWVudS1tYXRlcmlhbHMnKSBjb25zb2xlLmxvZygnbWF0ZXJpYWxzIGJ0biBjbGlja2VkJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBOYXZiYXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2LHdpbk1hbmFnZXIpIHtcclxuICBsZXQgbmF2YmFyID0gJCgnI21ubmF2YmFyJyk7XHJcbiAgbGV0IGJ1dHRvbnMgPSBbJ25hdi1tZW51JywnbmF2LXByZXYnLCduYXYtdG9jJywnbmF2LW5leHQnXTtcclxuXHJcbiAgbGV0IGhpZGVNZW51cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRvYy5oaWRlKCk7XHJcbiAgICBtZW51LmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTmV4dFNsaWRlJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRQcmV2aW91cycsMSk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBidXR0b25zLm1hcCggYiA9PiB7XHJcbiAgICBsZXQgYnRuID0gJCgnIycrYik7XHJcbiAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgIGJ0bi5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi1uZXh0JykgbmV4dCgpO1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmF2LXByZXYnKSBwcmV2KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtdG9jJykgd2luTWFuYWdlci50b2dnbGUoJ21udG9jJyk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtbWVudScpIHdpbk1hbmFnZXIudG9nZ2xlKCdtbm1lbnUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGJ0bi5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGxldCBidG4gPSAkKCcjJytldmVudC5jdXJyZW50VGFyZ2V0LmlkKTtcclxuICAgICAgYnRuLnJlbW92ZUNsYXNzKCdncmFkaWVudC1pZGxlJyk7XHJcbiAgICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtb3ZlcicpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KS5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGxldCBidG4gPSAkKCcjJytldmVudC5jdXJyZW50VGFyZ2V0LmlkKTtcclxuICAgICAgYnRuLnJlbW92ZUNsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBidG47XHJcbiAgfSk7XHJcbiAgXHJcbiAgbGV0IHRvY3Bvc2l0aW9uID0gJCgnI3RvY3Bvc2l0aW9uJyk7XHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGNwQXBpLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIC8vbGV0IHRvdGFsU2xpZGVzID0gbmF2LnNsaWRlcy5sZW5ndGg7XHJcbiAgbGV0IHRvdGFsU2xpZGVzID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvU2xpZGVDb3VudCcpO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICAkKCcjbmV4dGJ0bicpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQtYnRuJyk7XHJcbiAgICAvL2NoZWNrIG1vZGVcclxuICAgIC8vbGV0IHNsaWRlTGFiZWwgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcpO1xyXG4gICAgLy9pZihzbGlkZUxhYmVsID09PSAnJykgbmF2YmFyLmFkZENsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG4gICAgLy9lbHNlIG5hdmJhci5yZW1vdmVDbGFzcygnaGlkZS1uYXZiYXInKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVUeXBlJyxjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVUeXBlJykpO1xyXG4gICAgLy9jb25zb2xlLmxvZygnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJykpO1xyXG4gICAgaWYobmF2ICE9PSBudWxsKSB7XHJcbiAgICAgIGxldCBpbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICAvL2xldCBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgbGV0IGN1cnJTbGlkZSA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgICB0b2Nwb3NpdGlvbi5odG1sKGN1cnJTbGlkZSsnLycrdG90YWxTbGlkZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCB0b3RhbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0ZyYW1lQ291bnQnKTtcclxuICAgIC8vY29uc29sZS5sb2coZS5EYXRhLnZhck5hbWUsZS5EYXRhLm5ld1ZhbCx0b3RhbCk7XHJcbiAgfSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVBBVVNFJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFUEFVU0UnKTtcclxuICAgICQoJyNuZXh0YnRuJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVNUT1AnKTtcclxuICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgVGFiZWxPZkNvbnRlbnRzID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBfbW50b2MgPSAkKCcjbW50b2MnKTtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW50b2MnKTtcclxuXHJcbiAgbGV0IG91dHB1dCA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2LnNsaWRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgb3V0cHV0LnB1c2goXCI8ZGl2PjxwPjxzcGFuPlwiK25hdi5zbGlkZXNbaV0uaW5kZXgrXHJcbiAgICAgICAgICAgICAgICBcIi48L3NwYW4+Jm5ic3A7Jm5ic3A7XCIrbmF2LnNsaWRlc1tpXS5sYWJlbCtcIjwvcD48L2Rpdj5cIik7XHJcbiAgfVxyXG4gICQoJyNtbnRvYyAuc2xpZGVzLWdyb3VwJykuaHRtbChvdXRwdXQuam9pbignJykpO1xyXG4gICQoJy5zbGlkZXMtZ3JvdXAgZGl2JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZygkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgbGV0IGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyxpbmRleCk7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvRnJhbWVBbmRSZXN1bWUnLDApO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFiZWxPZkNvbnRlbnRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgVG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IF9pZCA9IGlkO1xyXG4gIGxldCBfZWxlbWVudCA9ICQoJyMnK19pZCksXHJcbiAgX3Zpc2libGUgPSBmYWxzZSxcclxuXHJcbiAgX2dldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX2lkO1xyXG4gIH0sXHJcblxyXG4gIF9pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfc2hvd1RvYyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX3Zpc2libGUgPSB0cnVlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVEb3duKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGVUb2MgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID0gZmFsc2U7XHJcbiAgICBfZWxlbWVudC5zbGlkZVVwKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGVUb2MoKSA6IF9zaG93VG9jKCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBzaG93OiBfc2hvd1RvYyxcclxuICAgIGhpZGU6IF9oaWRlVG9jLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlPdmVybGF5O1xyXG4gIGxldCB3aW5NYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIoKTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuICAgIG15T3ZlcmxheSA9ICQoJyNtbm92ZXJsYXknKTtcclxuICAgIG15T3ZlcmxheS5jc3MoJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcbiAgICAkLmdldEpTT04oXCIuLi9uYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2pzb24nLGpzb24pO1xyXG4gICAgICAgIG15SGVhZGVyID0gbmV3IEhlYWRlcihjcEludGVyZmFjZSxqc29uKTtcclxuICAgICAgICBteVRvYyA9IG5ldyBUYWJsZU9mQ29udGVudHMoY3BJbnRlcmZhY2UsanNvbix3aW5NYW5hZ2VyKTtcclxuICAgICAgICBteU1lbnUgPSBuZXcgTWVudShjcEludGVyZmFjZSx3aW5NYW5hZ2VyKTtcclxuICAgICAgICBteU5hdmJhciA9IG5ldyBOYXZiYXIoY3BJbnRlcmZhY2UsanNvbix3aW5NYW5hZ2VyKTtcclxuXHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlUb2MpO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15TWVudSk7XHJcbiAgICAgICAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogYmxvY2s7Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkoKTtcclxuIl19
