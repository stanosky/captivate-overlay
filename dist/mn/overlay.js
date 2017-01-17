(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Header = function Header(interfaceObj, nav) {
  var courseName = $('#courseName');
  var slideNumber = $('#slideNumber');
  var slideName = $('#slideName');

  var hideHeader = function hideHeader() {
    $('#mnheader').slideUp(100);
  };

  var showHeader = function showHeader() {
    $('#mnheader').slideDown(100);
  };
  var eventEmitterObj = interfaceObj.getEventEmitter();
  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', function (e) {
    //console.log('nav',nav);
    if (nav !== null) {
      //console.log(e.Data.slideNumber);
      var index = e.Data.slideNumber - 1;
      var currSlide = nav.slides[index];
      courseName.html(nav.courseName);
      //slideNumber.html(e.Data.slideNumber+'.');
      slideNumber.html(currSlide.index + '.');
      slideName.html(currSlide.label);
    }
  });

  $('#mnheader').slideUp(0);
  $("#mnrollover").mouseenter(function (event) {
    showHeader();
    //var screenNumber = window.cpAPIInterface.getVariableValue('cpCmndGotoSlide');
    //window.cpAPIInterface.setVariableValue('cpCmndGotoSlide',screenNumber+1);
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

var Menu = function Menu() {};

module.exports = Menu;

},{}],3:[function(require,module,exports){
'use strict';

var Navbar = function Navbar(cpApi) {
  var buttons = ['menubtn', 'prevbtn', 'tocbtn', 'nextbtn'];
  buttons.map(function (b) {
    var btn = $('#' + b);
    btn.addClass('gradient-idle');
    btn.click(function () {
      if (this.id === 'nextbtn') cpApi.setVariableValue('cpCmndNextSlide', 1);
      if (this.id === 'prevbtn') cpApi.setVariableValue('cpCmndPrevious', 1);
      //console.log('btn clicked:',this.id);
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
};

module.exports = Navbar;

},{}],4:[function(require,module,exports){
'use strict';

var Header = require('./header');
var Navbar = require('./navbar');
var Menu = require('./menu');
var TableOfContents = require('./toc');

(function () {
  var cpInterface = void 0;
  var myHeader = void 0;
  var myToc = void 0;
  var myMenu = void 0;
  var myNavbar = void 0;
  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;

    console.log('cpInterface.getVariableValue', cpInterface.getVariableValue('cpCmndMute'), window.cpAPIInterface.getVariableValue('cpCmndMute'));
    $.getJSON("../navigation.json", function (json) {
      //console.log('json',json);
      myHeader = new Header(cpInterface, json);
      myToc = new TableOfContents();
      myMenu = new Menu();
      myNavbar = new Navbar(cpInterface, json);
    });
  });
})();

},{"./header":1,"./menu":2,"./navbar":3,"./toc":5}],5:[function(require,module,exports){
'use strict';

var TabelOfContents = function TabelOfContents() {};

module.exports = TabelOfContents;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxoZWFkZXIuanMiLCJzcmNcXGpzXFxtZW51LmpzIiwic3JjXFxqc1xcbmF2YmFyLmpzIiwic3JjXFxqc1xcb3ZlcmxheS5qcyIsInNyY1xcanNcXHRvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBLElBQUksU0FBUyxTQUFULEFBQVMsT0FBQSxBQUFVLGNBQVYsQUFBdUIsS0FBSSxBQUN0QztNQUFJLGFBQWEsRUFBakIsQUFBaUIsQUFBRSxBQUNuQjtNQUFJLGNBQWMsRUFBbEIsQUFBa0IsQUFBRSxBQUNwQjtNQUFJLFlBQVksRUFBaEIsQUFBZ0IsQUFBRSxBQUVsQjs7TUFBSSxhQUFhLFNBQWIsQUFBYSxhQUFZLEFBQzNCO01BQUEsQUFBRSxhQUFGLEFBQWUsUUFEakIsQUFDRSxBQUF1QixBQUN4QixBQUVEOzs7TUFBSSxhQUFhLFNBQWIsQUFBYSxhQUFZLEFBQzNCO01BQUEsQUFBRSxhQUFGLEFBQWUsVUFEakIsQUFDRSxBQUF5QixBQUMxQixBQUNEOztNQUFJLGtCQUFrQixhQUF0QixBQUFzQixBQUFhLEFBQ25DO2tCQUFBLEFBQWdCLGlCQUFoQixBQUFpQyxvQkFBbUIsVUFBQSxBQUFTLEdBQUUsQUFDN0QsQUFDQTs7UUFBRyxRQUFILEFBQVcsTUFBTSxBQUNmLEFBQ0E7O1VBQUksUUFBUSxFQUFBLEFBQUUsS0FBRixBQUFPLGNBQW5CLEFBQStCLEFBQy9CO1VBQUksWUFBWSxJQUFBLEFBQUksT0FBcEIsQUFBZ0IsQUFBVyxBQUMzQjtpQkFBQSxBQUFXLEtBQUssSUFBaEIsQUFBb0IsQUFDcEIsQUFDQTs7a0JBQUEsQUFBWSxLQUFLLFVBQUEsQUFBVSxRQUEzQixBQUFpQyxBQUNqQztnQkFBQSxBQUFVLEtBQUssVUFUbkIsQUFTSSxBQUF5QixBQUUxQixBQUNGLEFBRUQ7Ozs7SUFBQSxBQUFFLGFBQUYsQUFBZSxRQUFmLEFBQXVC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QUosQUFBVyxhQUF0QixBQUFXLEFBQXVCLEFBQ2xDO2NBQVEsSUFBUixBQUFRLEFBQUksQUFDWjtlQUFTLElBQVQsQUFBUyxBQUFJLEFBQ2I7aUJBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxhQWxCOUIsQUFNRSxBQU9FLEFBS0ksQUFBVyxBQUF1QixBQUNyQyxBQUNGLEFBQ0Y7Ozs7OztBQzVCRDs7QUFFQSxJQUFJLGtCQUFrQixTQUFsQixBQUFrQixrQkFBdEIsQUFBa0MsQUFHakM7O0FBRUQsT0FBQSxBQUFPLFVBQVAsQUFBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IEhlYWRlciA9IGZ1bmN0aW9uIChpbnRlcmZhY2VPYmosbmF2KXtcclxuICBsZXQgY291cnNlTmFtZSA9ICQoJyNjb3Vyc2VOYW1lJyk7XHJcbiAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgbGV0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuXHJcbiAgbGV0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDEwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcjbW5oZWFkZXInKS5zbGlkZURvd24oMTAwKTtcclxuICB9O1xyXG4gIHZhciBldmVudEVtaXR0ZXJPYmogPSBpbnRlcmZhY2VPYmouZ2V0RXZlbnRFbWl0dGVyKCk7XHJcbiAgZXZlbnRFbWl0dGVyT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0NQQVBJX1NMSURFRU5URVInLGZ1bmN0aW9uKGUpe1xyXG4gICAgLy9jb25zb2xlLmxvZygnbmF2JyxuYXYpO1xyXG4gICAgaWYobmF2ICE9PSBudWxsKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5EYXRhLnNsaWRlTnVtYmVyKTtcclxuICAgICAgdmFyIGluZGV4ID0gZS5EYXRhLnNsaWRlTnVtYmVyLTE7XHJcbiAgICAgIHZhciBjdXJyU2xpZGUgPSBuYXYuc2xpZGVzW2luZGV4XTtcclxuICAgICAgY291cnNlTmFtZS5odG1sKG5hdi5jb3Vyc2VOYW1lKTtcclxuICAgICAgLy9zbGlkZU51bWJlci5odG1sKGUuRGF0YS5zbGlkZU51bWJlcisnLicpO1xyXG4gICAgICBzbGlkZU51bWJlci5odG1sKGN1cnJTbGlkZS5pbmRleCsnLicpO1xyXG4gICAgICBzbGlkZU5hbWUuaHRtbChjdXJyU2xpZGUubGFiZWwpO1xyXG5cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI21uaGVhZGVyJykuc2xpZGVVcCgwKTtcclxuICAkKCBcIiNtbnJvbGxvdmVyXCIgKVxyXG4gICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2hvd0hlYWRlcigpO1xyXG4gICAgICAvL3ZhciBzY3JlZW5OdW1iZXIgPSB3aW5kb3cuY3BBUElJbnRlcmZhY2UuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kR290b1NsaWRlJyk7XHJcbiAgICAgIC8vd2luZG93LmNwQVBJSW50ZXJmYWNlLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NyZWVuTnVtYmVyKzEpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KVxyXG4gICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaGlkZUhlYWRlcigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICByZXR1cm4ge1xyXG4gICAgc2hvdzogc2hvd0hlYWRlcixcclxuICAgIGhpZGU6IGhpZGVIZWFkZXJcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgTmF2YmFyID0gZnVuY3Rpb24gKGNwQXBpKSB7XHJcbiAgbGV0IGJ1dHRvbnMgPSBbJ21lbnVidG4nLCdwcmV2YnRuJywndG9jYnRuJywnbmV4dGJ0biddO1xyXG4gIGJ1dHRvbnMubWFwKCBiID0+IHtcclxuICAgIGxldCBidG4gPSAkKCcjJytiKTtcclxuICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgYnRuLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZih0aGlzLmlkID09PSAnbmV4dGJ0bicpIGNwQXBpLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZE5leHRTbGlkZScsMSk7XHJcbiAgICAgIGlmKHRoaXMuaWQgPT09ICdwcmV2YnRuJykgY3BBcGkuc2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kUHJldmlvdXMnLDEpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdidG4gY2xpY2tlZDonLHRoaXMuaWQpO1xyXG4gICAgfSk7XHJcbiAgICBidG4ubW91c2VlbnRlcihmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBsZXQgYnRuID0gJCgnIycrZXZlbnQuY3VycmVudFRhcmdldC5pZCk7XHJcbiAgICAgIGJ0bi5yZW1vdmVDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgICBidG4uYWRkQ2xhc3MoJ2dyYWRpZW50LW92ZXInKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSlcclxuICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGxldCBidG4gPSAkKCcjJytldmVudC5jdXJyZW50VGFyZ2V0LmlkKTtcclxuICAgICAgYnRuLnJlbW92ZUNsYXNzKCdncmFkaWVudC1vdmVyJyk7XHJcbiAgICAgIGJ0bi5hZGRDbGFzcygnZ3JhZGllbnQtaWRsZScpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiAoZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBidG47XHJcbiAgfSk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEhlYWRlciA9IHJlcXVpcmUoJy4vaGVhZGVyJyk7XHJcbmNvbnN0IE5hdmJhciA9IHJlcXVpcmUoJy4vbmF2YmFyJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL21lbnUnKTtcclxuY29uc3QgVGFibGVPZkNvbnRlbnRzID0gcmVxdWlyZSgnLi90b2MnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlIZWFkZXI7XHJcbiAgbGV0IG15VG9jO1xyXG4gIGxldCBteU1lbnU7XHJcbiAgbGV0IG15TmF2YmFyO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnY3BJbnRlcmZhY2UuZ2V0VmFyaWFibGVWYWx1ZScsXHJcbiAgICAgICAgICAgICAgICBjcEludGVyZmFjZS5nZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRNdXRlJyksXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY3BBUElJbnRlcmZhY2UuZ2V0VmFyaWFibGVWYWx1ZSgnY3BDbW5kTXV0ZScpKTtcclxuICAgICQuZ2V0SlNPTihcIi4uL25hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnanNvbicsanNvbik7XHJcbiAgICAgICAgbXlIZWFkZXIgPSBuZXcgSGVhZGVyKGNwSW50ZXJmYWNlLGpzb24pO1xyXG4gICAgICAgIG15VG9jID0gbmV3IFRhYmxlT2ZDb250ZW50cygpO1xyXG4gICAgICAgIG15TWVudSA9IG5ldyBNZW51KCk7XHJcbiAgICAgICAgbXlOYXZiYXIgPSBuZXcgTmF2YmFyKGNwSW50ZXJmYWNlLGpzb24pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBUYWJlbE9mQ29udGVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFiZWxPZkNvbnRlbnRzO1xyXG4iXX0=
