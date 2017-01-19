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

var Menu = function Menu() {
  var _tw = new ToggleWindow('mnmenu');

  return {
    win: _tw
  };
};

module.exports = Menu;

},{"./ToggleWindow":5}],3:[function(require,module,exports){
'use strict';

var Navbar = function Navbar(cpApi, nav, winManager) {
  var navbar = $('#mnnavbar');
  var buttons = ['nav-menubtn', 'nav-prevbtn', 'nav-tocbtn', 'nav-nextbtn'];

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
      if (this.id === 'nav-nextbtn') next();
      if (this.id === 'nav-prevbtn') prev();
      if (this.id === 'nav-tocbtn') winManager.toggle('mntoc');
      if (this.id === 'nav-menubtn') winManager.toggle('mnmenu');
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
    output.push("<li><a href='javascript:void(0);' onclick='return false;'>" + nav.slides[i].label + "</a></li>");
  }
  $('#mntoc .innertoc').html(output.join(''));
  $('#mntoc li').click(function (e) {
    console.log($(this).index());
    cpApi.setVariableValue('cpCmndGotoSlide', $(this).index());
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
  var winManager = new WindowManager();
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;

    $.getJSON("../navigation.json", function (json) {
      //console.log('json',json);
      myHeader = new Header(cpInterface, json);
      myToc = new TableOfContents(cpInterface, json, winManager);
      myMenu = new Menu(winManager);
      myNavbar = new Navbar(cpInterface, json, winManager);

      winManager.addWindow(myToc);
      winManager.addWindow(myMenu);
    });
  });
})();

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4,"./WindowManager":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsWUFBVixFQUF1QixHQUF2QixFQUEyQjtBQUN0QyxNQUFJLGFBQWEsRUFBRSxhQUFGLENBQWpCO0FBQ0EsTUFBSSxjQUFjLEVBQUUsY0FBRixDQUFsQjtBQUNBLE1BQUksWUFBWSxFQUFFLFlBQUYsQ0FBaEI7QUFDQSxNQUFJLFNBQVMsRUFBRSxXQUFGLENBQWI7QUFDQSxNQUFJLGtCQUFKO0FBQ0EsTUFBSSxlQUFlLFNBQWYsWUFBZSxHQUFXO0FBQzVCLFdBQU8sWUFBUCxDQUFvQixTQUFwQjtBQUNELEdBRkQ7QUFHQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxXQUFPLE9BQVAsQ0FBZSxHQUFmO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxXQUFPLFNBQVAsQ0FBaUIsR0FBakI7QUFDRCxHQUhEOztBQUtBLE1BQUksUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN0QjtBQUNBLGdCQUFZLE9BQU8sVUFBUCxDQUFrQixVQUFsQixFQUE2QixJQUE3QixDQUFaO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGtCQUFrQixhQUFhLGVBQWIsRUFBdEI7QUFDQSxrQkFBZ0IsZ0JBQWhCLENBQWlDLGtCQUFqQyxFQUFvRCxVQUFTLENBQVQsRUFBVztBQUM3RCxRQUFHLFFBQVEsSUFBWCxFQUFpQjtBQUNmLFVBQUksUUFBUSxF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QWxCOztBQUVBLE1BQUUsT0FBRixDQUFVLG9CQUFWLEVBQWdDLFVBQVMsSUFBVCxFQUFlO0FBQzNDO0FBQ0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixJQUF2QixDQUFYO0FBQ0EsY0FBUSxJQUFJLGVBQUosQ0FBb0IsV0FBcEIsRUFBZ0MsSUFBaEMsRUFBcUMsVUFBckMsQ0FBUjtBQUNBLGVBQVMsSUFBSSxJQUFKLENBQVMsVUFBVCxDQUFUO0FBQ0EsaUJBQVcsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF1QixJQUF2QixFQUE0QixVQUE1QixDQUFYOztBQUVBLGlCQUFXLFNBQVgsQ0FBcUIsS0FBckI7QUFDQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0gsS0FURDtBQVVELEdBZEQ7QUFlRCxDQXRCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgSGVhZGVyID0gZnVuY3Rpb24gKGludGVyZmFjZU9iaixuYXYpe1xyXG4gIGxldCBjb3Vyc2VOYW1lID0gJCgnI2NvdXJzZU5hbWUnKTtcclxuICBsZXQgc2xpZGVOdW1iZXIgPSAkKCcjc2xpZGVOdW1iZXInKTtcclxuICBsZXQgc2xpZGVOYW1lID0gJCgnI3NsaWRlTmFtZScpO1xyXG4gIGxldCBoZWFkZXIgPSAkKCcjbW5oZWFkZXInKTtcclxuICBsZXQgdGltZW91dElkO1xyXG4gIGxldCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG4gIGxldCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBoZWFkZXIuc2xpZGVVcCgxMDApO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93SGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBoZWFkZXIuc2xpZGVEb3duKDEwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGJsaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2hvd0hlYWRlcigpO1xyXG4gICAgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoaGlkZUhlYWRlciwyMDAwKTtcclxuICB9O1xyXG5cclxuICB2YXIgZXZlbnRFbWl0dGVyT2JqID0gaW50ZXJmYWNlT2JqLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgIGlmKG5hdiAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgaW5kZXggPSBlLkRhdGEuc2xpZGVOdW1iZXItMTtcclxuICAgICAgdmFyIGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBjb3Vyc2VOYW1lLmh0bWwobmF2LmNvdXJzZU5hbWUpO1xyXG4gICAgICBzbGlkZU51bWJlci5odG1sKGN1cnJTbGlkZS5pbmRleCsnLicpO1xyXG4gICAgICBzbGlkZU5hbWUuaHRtbChjdXJyU2xpZGUubGFiZWwpO1xyXG4gICAgICBibGluaygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDApO1xyXG4gICQoIFwiI21ucm9sbG92ZXJcIiApXHJcbiAgICAubW91c2VlbnRlcihmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzaG93SGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pXHJcbiAgICAubW91c2VsZWF2ZShmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBoaWRlSGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIHJldHVybiB7XHJcbiAgICBzaG93OiBzaG93SGVhZGVyLFxyXG4gICAgaGlkZTogaGlkZUhlYWRlclxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBfdHcgPSBuZXcgVG9nZ2xlV2luZG93KCdtbm1lbnUnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IE5hdmJhciA9IGZ1bmN0aW9uIChjcEFwaSxuYXYsd2luTWFuYWdlcikge1xyXG4gIGxldCBuYXZiYXIgPSAkKCcjbW5uYXZiYXInKTtcclxuICBsZXQgYnV0dG9ucyA9IFsnbmF2LW1lbnVidG4nLCduYXYtcHJldmJ0bicsJ25hdi10b2NidG4nLCduYXYtbmV4dGJ0biddO1xyXG5cclxuICBsZXQgaGlkZU1lbnVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdG9jLmhpZGUoKTtcclxuICAgIG1lbnUuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBuZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmROZXh0U2xpZGUnLDEpO1xyXG4gICAgd2luTWFuYWdlci5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZFByZXZpb3VzJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGJ1dHRvbnMubWFwKCBiID0+IHtcclxuICAgIGxldCBidG4gPSAkKCcjJytiKTtcclxuICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgYnRuLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmF2LW5leHRidG4nKSBuZXh0KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtcHJldmJ0bicpIHByZXYoKTtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi10b2NidG4nKSB3aW5NYW5hZ2VyLnRvZ2dsZSgnbW50b2MnKTtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi1tZW51YnRuJykgd2luTWFuYWdlci50b2dnbGUoJ21ubWVudScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYnRuLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LW92ZXInKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1pZGxlJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGJ0bjtcclxuICB9KTtcclxuXHJcbiAgbGV0IHRvY3Bvc2l0aW9uID0gJCgnI3RvY3Bvc2l0aW9uJyk7XHJcbiAgbGV0IGV2ZW50RW1pdHRlck9iaiA9IGNwQXBpLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIC8vbGV0IHRvdGFsU2xpZGVzID0gbmF2LnNsaWRlcy5sZW5ndGg7XHJcbiAgbGV0IHRvdGFsU2xpZGVzID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvU2xpZGVDb3VudCcpO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICAkKCcjbmV4dGJ0bicpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQtYnRuJyk7XHJcbiAgICAvL2NoZWNrIG1vZGVcclxuICAgIC8vbGV0IHNsaWRlTGFiZWwgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcpO1xyXG4gICAgLy9pZihzbGlkZUxhYmVsID09PSAnJykgbmF2YmFyLmFkZENsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG4gICAgLy9lbHNlIG5hdmJhci5yZW1vdmVDbGFzcygnaGlkZS1uYXZiYXInKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVUeXBlJyxjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9DdXJyZW50U2xpZGVUeXBlJykpO1xyXG4gICAgLy9jb25zb2xlLmxvZygnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJykpO1xyXG4gICAgaWYobmF2ICE9PSBudWxsKSB7XHJcbiAgICAgIGxldCBpbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICAvL2xldCBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgbGV0IGN1cnJTbGlkZSA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZScpO1xyXG4gICAgICB0b2Nwb3NpdGlvbi5odG1sKGN1cnJTbGlkZSsnLycrdG90YWxTbGlkZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCB0b3RhbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0ZyYW1lQ291bnQnKTtcclxuICAgIC8vY29uc29sZS5sb2coZS5EYXRhLnZhck5hbWUsZS5EYXRhLm5ld1ZhbCx0b3RhbCk7XHJcbiAgfSwnY3BJbmZvQ3VycmVudEZyYW1lJyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVBBVVNFJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFUEFVU0UnKTtcclxuICAgICQoJyNuZXh0YnRuJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVNUT1AnKTtcclxuICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRvZ2dsZVdpbmRvdyA9IHJlcXVpcmUoJy4vVG9nZ2xlV2luZG93Jyk7XHJcblxyXG5sZXQgVGFiZWxPZkNvbnRlbnRzID0gZnVuY3Rpb24gKGNwQXBpLG5hdikge1xyXG4gIGxldCBfbW50b2MgPSAkKCcjbW50b2MnKTtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW50b2MnKTtcclxuXHJcbiAgbGV0IG91dHB1dCA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2LnNsaWRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgb3V0cHV0LnB1c2goXCI8bGk+PGEgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApOycgb25jbGljaz0ncmV0dXJuIGZhbHNlOyc+XCIrbmF2LnNsaWRlc1tpXS5sYWJlbCtcIjwvYT48L2xpPlwiKTtcclxuICB9XHJcbiAgJCgnI21udG9jIC5pbm5lcnRvYycpLmh0bWwob3V0cHV0LmpvaW4oJycpKTtcclxuICAkKCcjbW50b2MgbGknKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICBjb25zb2xlLmxvZygkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJywkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgX3R3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFiZWxPZkNvbnRlbnRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgVG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IF9pZCA9IGlkO1xyXG4gIGxldCBfZWxlbWVudCA9ICQoJyMnK19pZCksXHJcbiAgX3Zpc2libGUgPSBmYWxzZSxcclxuXHJcbiAgX2dldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX2lkO1xyXG4gIH0sXHJcblxyXG4gIF9pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfc2hvd1RvYyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX3Zpc2libGUgPSB0cnVlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVEb3duKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGVUb2MgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID0gZmFsc2U7XHJcbiAgICBfZWxlbWVudC5zbGlkZVVwKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX3RvZ2dsZVZpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIF92aXNpYmxlID8gX2hpZGVUb2MoKSA6IF9zaG93VG9jKCk7XHJcbiAgfTtcclxuXHJcbiAgX2VsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdldElkOiBfZ2V0SWQsXHJcbiAgICBpc1Zpc2libGU6IF9pc1Zpc2libGUsXHJcbiAgICBzaG93OiBfc2hvd1RvYyxcclxuICAgIGhpZGU6IF9oaWRlVG9jLFxyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlVmlzaWJsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVdpbmRvdztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFdpbmRvd01hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgX3dpbmRvd3MgPSBbXTtcclxuICBsZXQgX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuICBsZXQgX3RvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgdy53aW4udG9nZ2xlKCk7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3Lndpbi5pc1Zpc2libGUoKSA/IHdpZCA6IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfc2hvd1dpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIGlmKF9jdXJyZW50ICE9PSBudWxsICYmIF9jdXJyZW50ICE9PSB3aWQpIF9oaWRlV2luZG93KF9jdXJyZW50KTtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkKSB7XHJcbiAgICAgICAgX2N1cnJlbnQgPSB3aWQ7XHJcbiAgICAgICAgdy53aW4uc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBsZXQgX2hpZGVXaW5kb3cgPSBmdW5jdGlvbiAod2lkKSB7XHJcbiAgICBfd2luZG93cy5tYXAodyA9PiB7XHJcbiAgICAgIGlmKHcud2luLmdldElkKCkgPT09IHdpZCB8fCB3aWQgPT09IHVuZGVmaW5lZCB8fCB3aWQgPT09IG51bGwpIHtcclxuICAgICAgICB3Lndpbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgX2N1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGxldCBfYWRkV2luZG93ID0gZnVuY3Rpb24od2luT2JqKSB7XHJcbiAgICBfd2luZG93cy5wdXNoKHdpbk9iaik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdG9nZ2xlOiBfdG9nZ2xlV2luZG93LFxyXG4gICAgc2hvdzogX3Nob3dXaW5kb3csXHJcbiAgICBoaWRlOiBfaGlkZVdpbmRvdyxcclxuICAgIGFkZFdpbmRvdzogX2FkZFdpbmRvd1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vTmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL01lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi9UYWJsZU9mQ29udGVudHMnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgd2luTWFuYWdlciA9IG5ldyBXaW5kb3dNYW5hZ2VyKCk7XHJcbiAgbGV0IG15SGVhZGVyO1xyXG4gIGxldCBteVRvYztcclxuICBsZXQgbXlNZW51O1xyXG4gIGxldCBteU5hdmJhcjtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vZHVsZVJlYWR5RXZlbnRcIiwgZnVuY3Rpb24oZXZ0KVxyXG4gIHtcclxuICAgIGNwSW50ZXJmYWNlID0gZXZ0LkRhdGE7XHJcblxyXG4gICAgJC5nZXRKU09OKFwiLi4vbmF2aWdhdGlvbi5qc29uXCIsIGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdqc29uJyxqc29uKTtcclxuICAgICAgICBteUhlYWRlciA9IG5ldyBIZWFkZXIoY3BJbnRlcmZhY2UsanNvbik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLGpzb24sd2luTWFuYWdlcik7XHJcbiAgICAgICAgbXlNZW51ID0gbmV3IE1lbnUod2luTWFuYWdlcik7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLGpzb24sd2luTWFuYWdlcik7XHJcblxyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15VG9jKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteU1lbnUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiJdfQ==
