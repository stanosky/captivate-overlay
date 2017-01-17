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

var Header = require('./header');

(function () {
  var cpInterface = void 0;
  var myHeader = void 0;

  window.addEventListener("moduleReadyEvent", function (evt) {
    cpInterface = evt.Data;
    $.getJSON("../navigation.json", function (json) {
      //console.log('json',json);
      myHeader = new Header(cpInterface, json);
    });
  });
})();

},{"./header":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxoZWFkZXIuanMiLCJzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUEsSUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFVLFlBQVYsRUFBdUIsR0FBdkIsRUFBMkI7QUFDdEMsTUFBSSxhQUFhLEVBQUUsYUFBRixDQUFqQjtBQUNBLE1BQUksY0FBYyxFQUFFLGNBQUYsQ0FBbEI7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCOztBQUVBLE1BQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUMzQixNQUFFLFdBQUYsRUFBZSxPQUFmLENBQXVCLEdBQXZCO0FBQ0QsR0FGRDs7QUFJQSxNQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0IsTUFBRSxXQUFGLEVBQWUsU0FBZixDQUF5QixHQUF6QjtBQUNELEdBRkQ7O0FBSUEsTUFBSSxrQkFBa0IsYUFBYSxlQUFiLEVBQXRCO0FBQ0Esa0JBQWdCLGdCQUFoQixDQUFpQyxrQkFBakMsRUFBb0QsVUFBUyxDQUFULEVBQVc7QUFDN0Q7QUFDQSxRQUFHLFFBQVEsSUFBWCxFQUFpQjtBQUNmO0FBQ0EsVUFBSSxRQUFRLEVBQUUsSUFBRixDQUFPLFdBQVAsR0FBbUIsQ0FBL0I7QUFDQSxVQUFJLFlBQVksSUFBSSxNQUFKLENBQVcsS0FBWCxDQUFoQjtBQUNBLGlCQUFXLElBQVgsQ0FBZ0IsSUFBSSxVQUFwQjtBQUNBO0FBQ0Esa0JBQVksSUFBWixDQUFpQixVQUFVLEtBQVYsR0FBZ0IsR0FBakM7QUFDQSxnQkFBVSxJQUFWLENBQWUsVUFBVSxLQUF6QjtBQUVEO0FBQ0YsR0FaRDs7QUFjQSxJQUFFLFdBQUYsRUFBZSxPQUFmLENBQXVCLENBQXZCO0FBQ0EsSUFBRyxhQUFILEVBQ0csVUFESCxDQUNjLFVBQVMsS0FBVCxFQUFnQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxVQUFNLGNBQU4sR0FBdUIsTUFBTSxjQUFOLEVBQXZCLEdBQWlELE1BQU0sV0FBTixHQUFvQixLQUFyRTtBQUNELEdBTkgsRUFPRyxVQVBILENBT2MsVUFBUyxLQUFULEVBQWdCO0FBQzFCO0FBQ0EsVUFBTSxjQUFOLEdBQXVCLE1BQU0sY0FBTixFQUF2QixHQUFpRCxNQUFNLFdBQU4sR0FBb0IsS0FBckU7QUFDRCxHQVZIO0FBV0EsU0FBTztBQUNMLFVBQU0sVUFERDtBQUVMLFVBQU07QUFGRCxHQUFQO0FBSUQsQ0E1Q0Q7O0FBOENBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7O0FDaERBOztBQUVBLElBQU0sU0FBUyxRQUFRLFVBQVIsQ0FBZjs7QUFFQSxDQUFDLFlBQVU7QUFDVCxNQUFJLG9CQUFKO0FBQ0EsTUFBSSxpQkFBSjs7QUFFQSxTQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxVQUFTLEdBQVQsRUFDNUM7QUFDRSxrQkFBYyxJQUFJLElBQWxCO0FBQ0EsTUFBRSxPQUFGLENBQVUsb0JBQVYsRUFBZ0MsVUFBUyxJQUFULEVBQWU7QUFDM0M7QUFDQSxpQkFBVyxJQUFJLE1BQUosQ0FBVyxXQUFYLEVBQXVCLElBQXZCLENBQVg7QUFDSCxLQUhEO0FBSUQsR0FQRDtBQVFELENBWkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IEhlYWRlciA9IGZ1bmN0aW9uIChpbnRlcmZhY2VPYmosbmF2KXtcclxuICBsZXQgY291cnNlTmFtZSA9ICQoJyNjb3Vyc2VOYW1lJyk7XHJcbiAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgbGV0IHNsaWRlTmFtZSA9ICQoJyNzbGlkZU5hbWUnKTtcclxuXHJcbiAgbGV0IGhpZGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDEwMCk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcjbW5oZWFkZXInKS5zbGlkZURvd24oMTAwKTtcclxuICB9O1xyXG5cclxuICB2YXIgZXZlbnRFbWl0dGVyT2JqID0gaW50ZXJmYWNlT2JqLmdldEV2ZW50RW1pdHRlcigpO1xyXG4gIGV2ZW50RW1pdHRlck9iai5hZGRFdmVudExpc3RlbmVyKCdDUEFQSV9TTElERUVOVEVSJyxmdW5jdGlvbihlKXtcclxuICAgIC8vY29uc29sZS5sb2coJ25hdicsbmF2KTtcclxuICAgIGlmKG5hdiAhPT0gbnVsbCkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuRGF0YS5zbGlkZU51bWJlcik7XHJcbiAgICAgIHZhciBpbmRleCA9IGUuRGF0YS5zbGlkZU51bWJlci0xO1xyXG4gICAgICB2YXIgY3VyclNsaWRlID0gbmF2LnNsaWRlc1tpbmRleF07XHJcbiAgICAgIGNvdXJzZU5hbWUuaHRtbChuYXYuY291cnNlTmFtZSk7XHJcbiAgICAgIC8vc2xpZGVOdW1iZXIuaHRtbChlLkRhdGEuc2xpZGVOdW1iZXIrJy4nKTtcclxuICAgICAgc2xpZGVOdW1iZXIuaHRtbChjdXJyU2xpZGUuaW5kZXgrJy4nKTtcclxuICAgICAgc2xpZGVOYW1lLmh0bWwoY3VyclNsaWRlLmxhYmVsKTtcclxuXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJyNtbmhlYWRlcicpLnNsaWRlVXAoMCk7XHJcbiAgJCggXCIjbW5yb2xsb3ZlclwiIClcclxuICAgIC5tb3VzZWVudGVyKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHNob3dIZWFkZXIoKTtcclxuICAgICAgLy92YXIgc2NyZWVuTnVtYmVyID0gd2luZG93LmNwQVBJSW50ZXJmYWNlLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScpO1xyXG4gICAgICAvL3dpbmRvdy5jcEFQSUludGVyZmFjZS5zZXRWYXJpYWJsZVZhbHVlKCdjcENtbmRHb3RvU2xpZGUnLHNjcmVlbk51bWJlcisxKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSlcclxuICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGhpZGVIZWFkZXIoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHNob3c6IHNob3dIZWFkZXIsXHJcbiAgICBoaWRlOiBoaWRlSGVhZGVyXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgSGVhZGVyID0gcmVxdWlyZSgnLi9oZWFkZXInKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGxldCBjcEludGVyZmFjZTtcclxuICBsZXQgbXlIZWFkZXI7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgY3BJbnRlcmZhY2UgPSBldnQuRGF0YTtcclxuICAgICQuZ2V0SlNPTihcIi4uL25hdmlnYXRpb24uanNvblwiLCBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnanNvbicsanNvbik7XHJcbiAgICAgICAgbXlIZWFkZXIgPSBuZXcgSGVhZGVyKGNwSW50ZXJmYWNlLGpzb24pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiJdfQ==
