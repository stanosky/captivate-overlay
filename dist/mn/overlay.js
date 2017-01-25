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

    /*btn.mouseenter(function(event) {
      let btn = $('#'+event.currentTarget.id);
      btn.removeClass('gradient-idle');
      btn.addClass('gradient-over');
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }).mouseleave(function(event) {
      let btn = $('#'+event.currentTarget.id);
      btn.removeClass('gradient-over');
      btn.addClass('gradient-idle');
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    });
    return btn;*/
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
    //let highlight = cpApi.getVariableValue('highlight');
    console.log(e.Data.varName, e.Data.newVal);
  }, 'highlight');

  eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function (e) {
    console.log('CPAPI_MOVIEPAUSE');
    $('#nextbtn').addClass('highlight-btn');
  });

  eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function (e) {
    console.log('CPAPI_MOVIESTOP');
  });
  eventEmitterObj.addEventListener('CPAPI_INTERACTIVEITEMSUBMIT', function (e) {
    console.log('CPAPI_INTERACTIVEITEMSUBMIT', e.Data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcV2luZG93TWFuYWdlci5qcyIsInNyY1xcanNcXG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQSxJQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjs7QUFFQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsWUFBVixFQUF1QixHQUF2QixFQUEyQjtBQUN0QyxNQUFJLE1BQU0sSUFBSSxZQUFKLENBQWlCLFVBQWpCLENBQVY7O0FBRUEsTUFBSSxhQUFhLEVBQUUsYUFBRixDQUFqQjtBQUNBLE1BQUksY0FBYyxFQUFFLGNBQUYsQ0FBbEI7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCO0FBQ0EsTUFBSSxTQUFTLEVBQUUsV0FBRixDQUFiO0FBQ0EsTUFBSSxrQkFBSjtBQUNBLE1BQUksZUFBZSxTQUFmLFlBQWUsR0FBVztBQUM1QixXQUFPLFlBQVAsQ0FBb0IsU0FBcEI7QUFDRCxHQUZEO0FBR0EsTUFBSSxhQUFhLFNBQWIsVUFBYSxHQUFZO0FBQzNCO0FBQ0EsUUFBSSxJQUFKO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0I7QUFDQSxRQUFJLElBQUo7QUFDRCxHQUhEOztBQUtBLE1BQUksUUFBUSxTQUFSLEtBQVEsR0FBWTtBQUN0QjtBQUNBLGdCQUFZLE9BQU8sVUFBUCxDQUFrQixVQUFsQixFQUE2QixJQUE3QixDQUFaO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLGtCQUFrQixhQUFhLGVBQWIsRUFBdEI7QUFDQSxrQkFBZ0IsZ0JBQWhCLENBQWlDLGtCQUFqQyxFQUFvRCxVQUFT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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxubGV0IEhlYWRlciA9IGZ1bmN0aW9uIChpbnRlcmZhY2VPYmosbmF2KXtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5oZWFkZXInKTtcclxuXHJcbiAgbGV0IGNvdXJzZU5hbWUgPSAkKCcjY291cnNlTmFtZScpO1xyXG4gIGxldCBzbGlkZU51bWJlciA9ICQoJyNzbGlkZU51bWJlcicpO1xyXG4gIGxldCBzbGlkZU5hbWUgPSAkKCcjc2xpZGVOYW1lJyk7XHJcbiAgbGV0IGhlYWRlciA9ICQoJyNtbmhlYWRlcicpO1xyXG4gIGxldCB0aW1lb3V0SWQ7XHJcbiAgbGV0IGNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xyXG4gIH07XHJcbiAgbGV0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5oaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoKTtcclxuICAgIF90dy5zaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGJsaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2hvd0hlYWRlcigpO1xyXG4gICAgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoaGlkZUhlYWRlciwyMDAwKTtcclxuICB9O1xyXG5cclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gaW50ZXJmYWNlT2JqLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgIGlmKG5hdiAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgaW5kZXggPSBlLkRhdGEuc2xpZGVOdW1iZXItMTtcclxuICAgICAgdmFyIGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBjb3Vyc2VOYW1lLmh0bWwobmF2LmNvdXJzZU5hbWUpO1xyXG4gICAgICBzbGlkZU51bWJlci5odG1sKGN1cnJTbGlkZS5pbmRleCsnLicpO1xyXG4gICAgICBzbGlkZU5hbWUuaHRtbChjdXJyU2xpZGUubGFiZWwpO1xyXG4gICAgICBibGluaygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDApO1xyXG4gICQoIFwiI21ucm9sbG92ZXJcIiApXHJcbiAgICAubW91c2VlbnRlcihmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzaG93SGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pXHJcbiAgICAubW91c2VsZWF2ZShmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBoaWRlSGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90d1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBNZW51ID0gZnVuY3Rpb24gKGNwQXBpLHdpbk1hbmFnZXIpIHtcclxuICBsZXQgX3R3ID0gbmV3IFRvZ2dsZVdpbmRvdygnbW5tZW51Jyk7XHJcblxyXG4gICQoJyNtZW51LXRvYycpLmNsaWNrKGUgPT4gd2luTWFuYWdlci5zaG93KCdtbnRvYycpKTtcclxuICAkKCcjbWVudS1leGl0JykuY2xpY2soZSA9PiBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRFeGl0JywxKSk7XHJcbiAgJCgnI21lbnUtcHJpbnQnKS5jbGljayhlID0+IHdpbmRvdy5wcmludCgpKTtcclxuXHJcbiAgJCgnI21lbnUtc291bmQnKVswXS5jaGVja2VkID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTXV0ZScpID09PSAwO1xyXG4gICQoJyNtZW51LXNvdW5kJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTXV0ZScsZS50YXJnZXQuY2hlY2tlZCA/IDAgOiAxKTtcclxuICB9O1xyXG4gIGNvbnNvbGUubG9nKFwiJCgnI21lbnUtdm9sdW1lJylcIiwgJCgnI21lbnUtdm9sdW1lJykpO1xyXG4gICQoJyNtZW51LXZvbHVtZScpWzBdLnZhbHVlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kVm9sdW1lJyk7XHJcbiAgJCgnI21lbnUtdm9sdW1lJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kVm9sdW1lJyxlLnRhcmdldC52YWx1ZSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21lbnUtaGVhZGVyJylbMF0uY2hlY2tlZCA9IHdpbk1hbmFnZXIuZ2V0V2luZG93KCdtbmhlYWRlcicpLndpbi5pc1R1cm5lZE9uKCk7XHJcbiAgJCgnI21lbnUtaGVhZGVyJylbMF0ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgd2luTWFuYWdlci5nZXRXaW5kb3coJ21uaGVhZGVyJykud2luLnNldFR1cm5lZE9uKGUudGFyZ2V0LmNoZWNrZWQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdpbjogX3R3XHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBOYXZiYXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2LHdpbk1hbmFnZXIpIHtcclxuICBsZXQgbmF2YmFyID0gJCgnI21ubmF2YmFyJyk7XHJcbiAgbGV0IGJ1dHRvbnMgPSBbJ25hdi1tZW51JywnbmF2LXByZXYnLCduYXYtdG9jJywnbmF2LW5leHQnXTtcclxuXHJcbiAgbGV0IGhpZGVNZW51cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRvYy5oaWRlKCk7XHJcbiAgICBtZW51LmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTmV4dFNsaWRlJywxKTtcclxuICAgIHdpbk1hbmFnZXIuaGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRQcmV2aW91cycsMSk7XHJcbiAgICB3aW5NYW5hZ2VyLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBidXR0b25zLm1hcCggYiA9PiB7XHJcbiAgICBsZXQgYnRuID0gJCgnIycrYik7XHJcbiAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgIGJ0bi5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25hdi1uZXh0JykgbmV4dCgpO1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmF2LXByZXYnKSBwcmV2KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtdG9jJykgd2luTWFuYWdlci50b2dnbGUoJ21udG9jJyk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICduYXYtbWVudScpIHdpbk1hbmFnZXIudG9nZ2xlKCdtbm1lbnUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qYnRuLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGJ0biA9ICQoJyMnK2V2ZW50LmN1cnJlbnRUYXJnZXQuaWQpO1xyXG4gICAgICBidG4ucmVtb3ZlQ2xhc3MoJ2dyYWRpZW50LW92ZXInKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdncmFkaWVudC1pZGxlJyk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGJ0bjsqL1xyXG4gIH0pO1xyXG5cclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgLy9sZXQgdG90YWxTbGlkZXMgPSBuYXYuc2xpZGVzLmxlbmd0aDtcclxuICBsZXQgdG90YWxTbGlkZXMgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9TbGlkZUNvdW50Jyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgICQoJyNuZXh0YnRuJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICAgIC8vY2hlY2sgbW9kZVxyXG4gICAgLy9sZXQgc2xpZGVMYWJlbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJyk7XHJcbiAgICAvL2lmKHNsaWRlTGFiZWwgPT09ICcnKSBuYXZiYXIuYWRkQ2xhc3MoJ2hpZGUtbmF2YmFyJyk7XHJcbiAgICAvL2Vsc2UgbmF2YmFyLnJlbW92ZUNsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnKSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcsY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKSk7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgbGV0IGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIC8vbGV0IGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBsZXQgY3VyclNsaWRlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICAgIHRvY3Bvc2l0aW9uLmh0bWwoY3VyclNsaWRlKycvJyt0b3RhbFNsaWRlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfVkFSSUFCTEVWQUxVRUNIQU5HRUQnLGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vbGV0IGhpZ2hsaWdodCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgY29uc29sZS5sb2coZS5EYXRhLnZhck5hbWUsZS5EYXRhLm5ld1ZhbCk7XHJcbiAgfSwnaGlnaGxpZ2h0Jyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9NT1ZJRVBBVVNFJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFUEFVU0UnKTtcclxuICAgICQoJyNuZXh0YnRuJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICB9KTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFU1RPUCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDUEFQSV9NT1ZJRVNUT1AnKTtcclxuICB9KTtcclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfSU5URVJBQ1RJVkVJVEVNU1VCTUlUJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDUEFQSV9JTlRFUkFDVElWRUlURU1TVUJNSVQnLGUuRGF0YSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmJhcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUb2dnbGVXaW5kb3cgPSByZXF1aXJlKCcuL1RvZ2dsZVdpbmRvdycpO1xyXG5cclxubGV0IFRhYmVsT2ZDb250ZW50cyA9IGZ1bmN0aW9uIChjcEFwaSxuYXYpIHtcclxuICBsZXQgX21udG9jID0gJCgnI21udG9jJyk7XHJcbiAgbGV0IF90dyA9IG5ldyBUb2dnbGVXaW5kb3coJ21udG9jJyk7XHJcblxyXG4gIGxldCBvdXRwdXQgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdi5zbGlkZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIG91dHB1dC5wdXNoKFwiPGRpdj48cD48c3Bhbj5cIituYXYuc2xpZGVzW2ldLmluZGV4K1xyXG4gICAgICAgICAgICAgICAgXCIuPC9zcGFuPiZuYnNwOyZuYnNwO1wiK25hdi5zbGlkZXNbaV0ubGFiZWwrXCI8L3A+PC9kaXY+XCIpO1xyXG4gIH1cclxuICAkKCcjbW50b2MgLnNsaWRlcy1ncm91cCcpLmh0bWwob3V0cHV0LmpvaW4oJycpKTtcclxuICAkKCcuc2xpZGVzLWdyb3VwIGRpdicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vY29uc29sZS5sb2coJCh0aGlzKS5pbmRleCgpKTtcclxuICAgIGxldCBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsaW5kZXgpO1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b0ZyYW1lQW5kUmVzdW1lJywwKTtcclxuICAgIF90dy5oaWRlKCk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3aW46IF90d1xyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmVsT2ZDb250ZW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFRvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gIGxldCBfaWQgPSBpZDtcclxuICBsZXQgX2VsZW1lbnQgPSAkKCcjJytfaWQpLFxyXG4gIF92aXNpYmxlID0gZmFsc2UsXHJcbiAgX3R1cm5lZG9uID0gdHJ1ZSxcclxuXHJcbiAgX2dldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gX2lkO1xyXG4gIH0sXHJcblxyXG4gIF9pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfaXNUdXJuZWRPbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF90dXJuZWRvbjtcclxuICB9LFxyXG5cclxuICBfc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoIV90dXJuZWRvbikgcmV0dXJuO1xyXG4gICAgX3Zpc2libGUgPSB0cnVlO1xyXG4gICAgX2VsZW1lbnQuc2xpZGVEb3duKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmKCFfdHVybmVkb24pIHJldHVybjtcclxuICAgIF92aXNpYmxlID0gZmFsc2U7XHJcbiAgICBfZWxlbWVudC5zbGlkZVVwKDIwMCk7XHJcbiAgfSxcclxuXHJcbiAgX3NldFR1cm5lZE9uID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHZhbHVlID8gX3Nob3coKSA6IF9oaWRlKCk7XHJcbiAgICBfdHVybmVkb24gPSB2YWx1ZTtcclxuICB9LFxyXG5cclxuICBfdG9nZ2xlVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX3Zpc2libGUgPyBfaGlkZSgpIDogX3Nob3coKTtcclxuICB9O1xyXG5cclxuICBfZWxlbWVudC5zbGlkZVVwKDApO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2V0SWQ6IF9nZXRJZCxcclxuICAgIGlzVmlzaWJsZTogX2lzVmlzaWJsZSxcclxuICAgIGlzVHVybmVkT246IF9pc1R1cm5lZE9uLFxyXG4gICAgc2hvdzogX3Nob3csXHJcbiAgICBoaWRlOiBfaGlkZSxcclxuICAgIHNldFR1cm5lZE9uOiBfc2V0VHVybmVkT24sXHJcbiAgICB0b2dnbGU6IF90b2dnbGVWaXNpYmxlXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9nZ2xlV2luZG93O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgV2luZG93TWFuYWdlciA9IGZ1bmN0aW9uKCkge1xyXG4gIGxldCBfd2luZG93cyA9IFtdO1xyXG4gIGxldCBfY3VycmVudCA9IG51bGw7XHJcblxyXG4gIGxldCBfdG9nZ2xlV2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICB3Lndpbi50b2dnbGUoKTtcclxuICAgICAgICBfY3VycmVudCA9IHcud2luLmlzVmlzaWJsZSgpID8gd2lkIDogbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9zaG93V2luZG93ID0gZnVuY3Rpb24gKHdpZCkge1xyXG4gICAgaWYoX2N1cnJlbnQgIT09IG51bGwgJiYgX2N1cnJlbnQgIT09IHdpZCkgX2hpZGVXaW5kb3coX2N1cnJlbnQpO1xyXG4gICAgX3dpbmRvd3MubWFwKHcgPT4ge1xyXG4gICAgICBpZih3Lndpbi5nZXRJZCgpID09PSB3aWQpIHtcclxuICAgICAgICBfY3VycmVudCA9IHdpZDtcclxuICAgICAgICB3Lndpbi5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCBfaGlkZVdpbmRvdyA9IGZ1bmN0aW9uICh3aWQpIHtcclxuICAgIF93aW5kb3dzLm1hcCh3ID0+IHtcclxuICAgICAgaWYody53aW4uZ2V0SWQoKSA9PT0gd2lkIHx8IHdpZCA9PT0gdW5kZWZpbmVkIHx8IHdpZCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHcud2luLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBfY3VycmVudCA9IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgbGV0IF9hZGRXaW5kb3cgPSBmdW5jdGlvbih3aW5PYmopIHtcclxuICAgIF93aW5kb3dzLnB1c2god2luT2JqKTtcclxuICB9O1xyXG5cclxuICBsZXQgX2dldFdpbmRvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIGxldCBfd2luID0gX3dpbmRvd3MuZmlsdGVyKHcgPT4ge1xyXG4gICAgICByZXR1cm4gdy53aW4uZ2V0SWQoKSA9PT0gbmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIF93aW4ubGVuZ3RoID4gMCA/IF93aW5bMF0gOiBudWxsO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0b2dnbGU6IF90b2dnbGVXaW5kb3csXHJcbiAgICBzaG93OiBfc2hvd1dpbmRvdyxcclxuICAgIGhpZGU6IF9oaWRlV2luZG93LFxyXG4gICAgYWRkV2luZG93OiBfYWRkV2luZG93LFxyXG4gICAgZ2V0V2luZG93OiBfZ2V0V2luZG93XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd01hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSByZXF1aXJlKCcuL1dpbmRvd01hbmFnZXInKTtcclxuY29uc3QgSGVhZGVyID0gcmVxdWlyZSgnLi9IZWFkZXInKTtcclxuY29uc3QgTmF2YmFyID0gcmVxdWlyZSgnLi9OYXZiYXInKTtcclxuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vTWVudScpO1xyXG5jb25zdCBUYWJsZU9mQ29udGVudHMgPSByZXF1aXJlKCcuL1RhYmxlT2ZDb250ZW50cycpO1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNwSW50ZXJmYWNlO1xyXG4gIGxldCBteU92ZXJsYXk7XHJcbiAgbGV0IHdpbk1hbmFnZXIgPSBuZXcgV2luZG93TWFuYWdlcigpO1xyXG4gIGxldCBteUhlYWRlcjtcclxuICBsZXQgbXlUb2M7XHJcbiAgbGV0IG15TWVudTtcclxuICBsZXQgbXlOYXZiYXI7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb2R1bGVSZWFkeUV2ZW50XCIsIGZ1bmN0aW9uKGV2dClcclxuICB7XHJcbiAgICBjcEludGVyZmFjZSA9IGV2dC5EYXRhO1xyXG4gICAgbXlPdmVybGF5ID0gJCgnI21ub3ZlcmxheScpO1xyXG4gICAgbXlPdmVybGF5LmNzcygnZGlzcGxheTogbm9uZTsnKTtcclxuICAgICQuZ2V0SlNPTihcIi4uL25hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnanNvbicsanNvbik7XHJcbiAgICAgICAgbXlIZWFkZXIgPSBuZXcgSGVhZGVyKGNwSW50ZXJmYWNlLGpzb24pO1xyXG4gICAgICAgIHdpbk1hbmFnZXIuYWRkV2luZG93KG15SGVhZGVyKTtcclxuICAgICAgICBteVRvYyA9IG5ldyBUYWJsZU9mQ29udGVudHMoY3BJbnRlcmZhY2UsanNvbix3aW5NYW5hZ2VyKTtcclxuICAgICAgICB3aW5NYW5hZ2VyLmFkZFdpbmRvdyhteVRvYyk7XHJcbiAgICAgICAgbXlNZW51ID0gbmV3IE1lbnUoY3BJbnRlcmZhY2Usd2luTWFuYWdlcik7XHJcbiAgICAgICAgd2luTWFuYWdlci5hZGRXaW5kb3cobXlNZW51KTtcclxuICAgICAgICBteU5hdmJhciA9IG5ldyBOYXZiYXIoY3BJbnRlcmZhY2UsanNvbix3aW5NYW5hZ2VyKTtcclxuICAgICAgICBcclxuICAgICAgICBteU92ZXJsYXkuY3NzKCdkaXNwbGF5OiBibG9jazsnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KSgpO1xyXG4iXX0=
