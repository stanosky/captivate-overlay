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
  var tw = new ToggleWindow('#mnmenu');

  return {
    isVisible: tw.isVisible,
    show: tw.show,
    hide: tw.hide,
    toggle: tw.toggle
  };
};

module.exports = Menu;

},{"./ToggleWindow":5}],3:[function(require,module,exports){
'use strict';

var Navbar = function Navbar(cpApi, nav, toc, menu) {
  var navbar = $('#mnnavbar');
  var buttons = ['menubtn', 'prevbtn', 'tocbtn', 'nextbtn'];

  var hideMenus = function hideMenus() {
    toc.hide();
    menu.hide();
  };

  var next = function next() {
    cpApi.setVariableValue('cpCmndNextSlide', 1);
    hideMenus();
  };

  var prev = function prev() {
    cpApi.setVariableValue('cpCmndPrevious', 1);
    hideMenus();
  };

  buttons.map(function (b) {
    var btn = $('#' + b);
    btn.addClass('gradient-idle');
    btn.click(function () {
      if (this.id === 'nextbtn') next();
      if (this.id === 'prevbtn') prev();
      if (this.id === 'tocbtn') toc.toggle();
      if (this.id === 'menubtn') menu.toggle();
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
  var mntoc = $('#mntoc');
  var tw = new ToggleWindow('#mntoc');

  var output = [];
  for (var i = 0; i < nav.slides.length; i++) {
    output.push("<li><a href='javascript:void(0);' onclick='return false;'>" + nav.slides[i].label + "</a></li>");
  }
  $('#mntoc .innertoc').html(output.join(''));
  $('#mntoc li').click(function (e) {
    console.log($(this).index());
    cpApi.setVariableValue('cpCmndGotoSlide', $(this).index());
    tw.hide();
  });

  return {
    isVisible: tw.isVisible,
    show: tw.show,
    hide: tw.hide,
    toggle: tw.toggle
  };
};

module.exports = TabelOfContents;

},{"./ToggleWindow":5}],5:[function(require,module,exports){
'use strict';

var ToggleWindow = function ToggleWindow(id) {
  var element = $(id),
      visible = false,
      _isVisible = function _isVisible() {
    return visible;
  },
      _showToc = function _showToc() {
    visible = true;
    element.slideDown(200);
  },
      _hideToc = function _hideToc() {
    visible = false;
    element.slideUp(200);
  },
      _toggleVisible = function _toggleVisible() {
    visible ? _hideToc() : _showToc();
  };

  element.slideUp(0);

  return {
    isVisible: _isVisible,
    show: _showToc,
    hide: _hideToc,
    toggle: _toggleVisible
  };
};

module.exports = ToggleWindow;

},{}],6:[function(require,module,exports){
'use strict';

var Header = require('./Header');
var Navbar = require('./Navbar');
var Menu = require('./Menu');
var TableOfContents = require('./TableOfContents');

(function () {
  var cpInterface = void 0;
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;

    $.getJSON("../navigation.json", function (json) {
      //console.log('json',json);
      myHeader = new Header(cpInterface, json);
      myToc = new TableOfContents(cpInterface, json);
      myMenu = new Menu();
      myNavbar = new Navbar(cpInterface, json, myToc, myMenu);
    });
  });
})();

},{"./Header":1,"./Menu":2,"./Navbar":3,"./TableOfContents":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxIZWFkZXIuanMiLCJzcmNcXGpzXFxNZW51LmpzIiwic3JjXFxqc1xcTmF2YmFyLmpzIiwic3JjXFxqc1xcVGFibGVPZkNvbnRlbnRzLmpzIiwic3JjXFxqc1xcVG9nZ2xlV2luZG93LmpzIiwic3JjXFxqc1xcb3ZlcmxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBVSxZQUFWLEVBQXVCLEdBQXZCLEVBQTJCO0FBQ3RDLE1BQUksYUFBYSxFQUFFLGFBQUYsQ0FBakI7QUFDQSxNQUFJLGNBQWMsRUFBRSxjQUFGLENBQWxCO0FBQ0EsTUFBSSxZQUFZLEVBQUUsWUFBRixDQUFoQjtBQUNBLE1BQUksU0FBUyxFQUFFLFdBQUYsQ0FBYjtBQUNBLE1BQUksa0JBQUo7QUFDQSxNQUFJLGVBQWUsU0FBZixZQUFlLEdBQVc7QUFDNUIsV0FBTyxZQUFQLENBQW9CLFNBQXBCO0FBQ0QsR0FGRDtBQUdBLE1BQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUMzQjtBQUNBLFdBQU8sT0FBUCxDQUFlLEdBQWY7QUFDRCxHQUhEOztBQUtBLE1BQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUMzQjtBQUNBLFdBQU8sU0FBUCxDQUFpQixHQUFqQjtBQUNELEdBSEQ7O0FBS0EsTUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFZO0FBQ3RCO0FBQ0EsZ0JBQVksT0FBTyxVQUFQLENBQWtCLFVBQWxCLEVBQTZCLElBQTdCLENBQVo7QUFDRCxHQUhEOztBQUtBLE1BQUksa0JBQWtCLGFBQWEsZUFBYixFQUF0QjtBQUNBLGtCQUFnQixnQkFBaEIsQ0FBaUMsa0JBQWpDLEVBQW9ELFVBQVMsQ0FBVCxFQUFXO0FBQzdELFFBQUcsUUFBUSxJQUFYLEVBQWlCO0FBQ2YsVUFBSSxRQUFRLEVBQUUsSUFBRixDQUFPLFdBQVAsR0FBbUIsQ0FB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Z0MsQUFDeEM7ZUFBUyxJQUFULEFBQVMsQUFBSSxBQUNiO2lCQUFXLElBQUEsQUFBSSxPQUFKLEFBQVcsYUFBWCxBQUF1QixNQUF2QixBQUE0QixPQWYvQyxBQU1FLEFBSUUsQUFLSSxBQUFXLEFBQWtDLEFBQ2hELEFBQ0YsQUFDRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgSGVhZGVyID0gZnVuY3Rpb24gKGludGVyZmFjZU9iaixuYXYpe1xyXG4gIGxldCBjb3Vyc2VOYW1lID0gJCgnI2NvdXJzZU5hbWUnKTtcclxuICBsZXQgc2xpZGVOdW1iZXIgPSAkKCcjc2xpZGVOdW1iZXInKTtcclxuICBsZXQgc2xpZGVOYW1lID0gJCgnI3NsaWRlTmFtZScpO1xyXG4gIGxldCBoZWFkZXIgPSAkKCcjbW5oZWFkZXInKTtcclxuICBsZXQgdGltZW91dElkO1xyXG4gIGxldCBjbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICB9O1xyXG4gIGxldCBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBoZWFkZXIuc2xpZGVVcCgxMDApO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93SGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KCk7XHJcbiAgICBoZWFkZXIuc2xpZGVEb3duKDEwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGJsaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2hvd0hlYWRlcigpO1xyXG4gICAgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoaGlkZUhlYWRlciwyMDAwKTtcclxuICB9O1xyXG5cclxuICB2YXIgZXZlbnRFbWl0dGVyT2JqID0gaW50ZXJmYWNlT2JqLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgIGlmKG5hdiAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgaW5kZXggPSBlLkRhdGEuc2xpZGVOdW1iZXItMTtcclxuICAgICAgdmFyIGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBjb3Vyc2VOYW1lLmh0bWwobmF2LmNvdXJzZU5hbWUpO1xyXG4gICAgICBzbGlkZU51bWJlci5odG1sKGN1cnJTbGlkZS5pbmRleCsnLicpO1xyXG4gICAgICBzbGlkZU5hbWUuaHRtbChjdXJyU2xpZGUubGFiZWwpO1xyXG4gICAgICBibGluaygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDApO1xyXG4gICQoIFwiI21ucm9sbG92ZXJcIiApXHJcbiAgICAubW91c2VlbnRlcihmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzaG93SGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pXHJcbiAgICAubW91c2VsZWF2ZShmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBoaWRlSGVhZGVyKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIHJldHVybiB7XHJcbiAgICBzaG93OiBzaG93SGVhZGVyLFxyXG4gICAgaGlkZTogaGlkZUhlYWRlclxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0dyA9IG5ldyBUb2dnbGVXaW5kb3coJyNtbm1lbnUnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlzVmlzaWJsZTogdHcuaXNWaXNpYmxlLFxyXG4gICAgc2hvdzogdHcuc2hvdyxcclxuICAgIGhpZGU6IHR3LmhpZGUsXHJcbiAgICB0b2dnbGU6IHR3LnRvZ2dsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBOYXZiYXIgPSBmdW5jdGlvbiAoY3BBcGksbmF2LHRvYyxtZW51KSB7XHJcbiAgbGV0IG5hdmJhciA9ICQoJyNtbm5hdmJhcicpO1xyXG4gIGxldCBidXR0b25zID0gWydtZW51YnRuJywncHJldmJ0bicsJ3RvY2J0bicsJ25leHRidG4nXTtcclxuXHJcbiAgbGV0IGhpZGVNZW51cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRvYy5oaWRlKCk7XHJcbiAgICBtZW51LmhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZXQgbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTmV4dFNsaWRlJywxKTtcclxuICAgIGhpZGVNZW51cygpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcmV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjcEFwaS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRQcmV2aW91cycsMSk7XHJcbiAgICBoaWRlTWVudXMoKTtcclxuICB9O1xyXG5cclxuICBidXR0b25zLm1hcCggYiA9PiB7XHJcbiAgICBsZXQgYnRuID0gJCgnIycrYik7XHJcbiAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgIGJ0bi5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgaWYodGhpcy5pZCA9PT0gJ25leHRidG4nKSBuZXh0KCk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICdwcmV2YnRuJykgcHJldigpO1xyXG4gICAgICBpZih0aGlzLmlkID09PSAndG9jYnRuJykgdG9jLnRvZ2dsZSgpO1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbWVudWJ0bicpIG1lbnUudG9nZ2xlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBidG4ubW91c2VlbnRlcihmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBsZXQgYnRuID0gJCgnIycrZXZlbnQuY3VycmVudFRhcmdldC5pZCk7XHJcbiAgICAgIGJ0bi5yZW1vdmVDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LW92ZXInKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSkubW91c2VsZWF2ZShmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBsZXQgYnRuID0gJCgnIycrZXZlbnQuY3VycmVudFRhcmdldC5pZCk7XHJcbiAgICAgIGJ0bi5yZW1vdmVDbGFzcygnZ3JhZGllbnQtb3ZlcicpO1xyXG4gICAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LWlkbGUnKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYnRuO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgdG9jcG9zaXRpb24gPSAkKCcjdG9jcG9zaXRpb24nKTtcclxuICBsZXQgZXZlbnRFbWl0dGVyT2JqID0gY3BBcGkuZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgLy9sZXQgdG90YWxTbGlkZXMgPSBuYXYuc2xpZGVzLmxlbmd0aDtcclxuICBsZXQgdG90YWxTbGlkZXMgPSBjcEFwaS5nZXRWYXJpYWJsZVZhbHVlKCdjcEluZm9TbGlkZUNvdW50Jyk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgICQoJyNuZXh0YnRuJykucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodC1idG4nKTtcclxuICAgIC8vY2hlY2sgbW9kZVxyXG4gICAgLy9sZXQgc2xpZGVMYWJlbCA9IGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZUxhYmVsJyk7XHJcbiAgICAvL2lmKHNsaWRlTGFiZWwgPT09ICcnKSBuYXZiYXIuYWRkQ2xhc3MoJ2hpZGUtbmF2YmFyJyk7XHJcbiAgICAvL2Vsc2UgbmF2YmFyLnJlbW92ZUNsYXNzKCdoaWRlLW5hdmJhcicpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnLGNwQXBpLmdldFZhcmlhYmxlVmFsdWUoJ2NwSW5mb0N1cnJlbnRTbGlkZVR5cGUnKSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdjcEluZm9DdXJyZW50U2xpZGVMYWJlbCcsY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlTGFiZWwnKSk7XHJcbiAgICBpZihuYXYgIT09IG51bGwpIHtcclxuICAgICAgbGV0IGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIC8vbGV0IGN1cnJTbGlkZSA9IG5hdi5zbGlkZXNbaW5kZXhdO1xyXG4gICAgICBsZXQgY3VyclNsaWRlID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvQ3VycmVudFNsaWRlJyk7XHJcbiAgICAgIHRvY3Bvc2l0aW9uLmh0bWwoY3VyclNsaWRlKycvJyt0b3RhbFNsaWRlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9WQVJJQUJMRVZBTFVFQ0hBTkdFRCcsZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IHRvdGFsID0gY3BBcGkuZ2V0VmFyaWFibGVWYWx1ZSgnY3BJbmZvRnJhbWVDb3VudCcpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhlLkRhdGEudmFyTmFtZSxlLkRhdGEubmV3VmFsLHRvdGFsKTtcclxuICB9LCdjcEluZm9DdXJyZW50RnJhbWUnKTtcclxuXHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX01PVklFUEFVU0UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ1BBUElfTU9WSUVQQVVTRScpO1xyXG4gICAgJCgnI25leHRidG4nKS5hZGRDbGFzcygnaGlnaGxpZ2h0LWJ0bicpO1xyXG4gIH0pO1xyXG5cclxuICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfTU9WSUVTVE9QJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0NQQVBJX01PVklFU1RPUCcpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVG9nZ2xlV2luZG93ID0gcmVxdWlyZSgnLi9Ub2dnbGVXaW5kb3cnKTtcclxuXHJcbmxldCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoY3BBcGksbmF2KSB7XHJcbiAgbGV0IG1udG9jID0gJCgnI21udG9jJyk7XHJcbiAgbGV0IHR3ID0gbmV3IFRvZ2dsZVdpbmRvdygnI21udG9jJyk7XHJcblxyXG4gIGxldCBvdXRwdXQgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdi5zbGlkZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIG91dHB1dC5wdXNoKFwiPGxpPjxhIGhyZWY9J2phdmFzY3JpcHQ6dm9pZCgwKTsnIG9uY2xpY2s9J3JldHVybiBmYWxzZTsnPlwiK25hdi5zbGlkZXNbaV0ubGFiZWwrXCI8L2E+PC9saT5cIik7XHJcbiAgfVxyXG4gICQoJyNtbnRvYyAuaW5uZXJ0b2MnKS5odG1sKG91dHB1dC5qb2luKCcnKSk7XHJcbiAgJCgnI21udG9jIGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coJCh0aGlzKS5pbmRleCgpKTtcclxuICAgIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsJCh0aGlzKS5pbmRleCgpKTtcclxuICAgIHR3LmhpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlzVmlzaWJsZTogdHcuaXNWaXNpYmxlLFxyXG4gICAgc2hvdzogdHcuc2hvdyxcclxuICAgIGhpZGU6IHR3LmhpZGUsXHJcbiAgICB0b2dnbGU6IHR3LnRvZ2dsZVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmVsT2ZDb250ZW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IFRvZ2dsZVdpbmRvdyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gIGxldCBlbGVtZW50ID0gJChpZCksXHJcbiAgdmlzaWJsZSA9IGZhbHNlLFxyXG5cclxuICBfaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdmlzaWJsZTtcclxuICB9LFxyXG5cclxuICBfc2hvd1RvYyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmlzaWJsZSA9IHRydWU7XHJcbiAgICBlbGVtZW50LnNsaWRlRG93bigyMDApO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlVG9jID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2aXNpYmxlID0gZmFsc2U7XHJcbiAgICBlbGVtZW50LnNsaWRlVXAoMjAwKTtcclxuICB9LFxyXG5cclxuICBfdG9nZ2xlVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmlzaWJsZSA/IF9oaWRlVG9jKCkgOiBfc2hvd1RvYygpO1xyXG4gIH07XHJcblxyXG4gIGVsZW1lbnQuc2xpZGVVcCgwKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlzVmlzaWJsZTogX2lzVmlzaWJsZSxcclxuICAgIHNob3c6IF9zaG93VG9jLFxyXG4gICAgaGlkZTogX2hpZGVUb2MsXHJcbiAgICB0b2dnbGU6IF90b2dnbGVWaXNpYmxlXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9nZ2xlV2luZG93O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBIZWFkZXIgPSByZXF1aXJlKCcuL0hlYWRlcicpO1xyXG5jb25zdCBOYXZiYXIgPSByZXF1aXJlKCcuL05hdmJhcicpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9NZW51Jyk7XHJcbmNvbnN0IFRhYmxlT2ZDb250ZW50cyA9IHJlcXVpcmUoJy4vVGFibGVPZkNvbnRlbnRzJyk7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICBsZXQgY3BJbnRlcmZhY2U7XHJcbiAgbGV0IG15SGVhZGVyO1xyXG4gIGxldCBteVRvYztcclxuICBsZXQgbXlNZW51O1xyXG4gIGxldCBteU5hdmJhcjtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vZHVsZVJlYWR5RXZlbnRcIiwgZnVuY3Rpb24oZXZ0KVxyXG4gIHtcclxuICAgIGNwSW50ZXJmYWNlID0gZXZ0LkRhdGE7XHJcblxyXG4gICAgJC5nZXRKU09OKFwiLi4vbmF2aWdhdGlvbi5qc29uXCIsIGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdqc29uJyxqc29uKTtcclxuICAgICAgICBteUhlYWRlciA9IG5ldyBIZWFkZXIoY3BJbnRlcmZhY2UsanNvbik7XHJcbiAgICAgICAgbXlUb2MgPSBuZXcgVGFibGVPZkNvbnRlbnRzKGNwSW50ZXJmYWNlLGpzb24pO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KCk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLGpzb24sbXlUb2MsbXlNZW51KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KSgpO1xyXG4iXX0=
