(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
  function hideHeader() {
    $('#mnheader').slideUp(100);
  }

  function showHeader() {
    $('#mnheader').slideDown(100);
  }

  window.addEventListener("moduleReadyEvent", function (evt) {
    let courseName = $('#courseName');
    let slideNumber = $('#slideNumber');
    let slideName = $('#slideName');

    $.getJSON("../navigation.json", function (json) {
      //console.log('json',json);
      var navigation = json;
      var interfaceObj = evt.Data;
      var eventEmitterObj = interfaceObj.getEventEmitter();
      eventEmitterObj.addEventListener('CPAPI_SLIDEENTER', function (e) {
        //console.log('navigation',navigation);
        if (navigation !== null) {
          //console.log(e.Data.slideNumber);
          var index = e.Data.slideNumber - 1;
          var currSlide = navigation.slides[index];
          courseName.html(navigation.courseName);
          //slideNumber.html(e.Data.slideNumber+'.');
          slideNumber.html(currSlide.index + '.');
          slideName.html(currSlide.label);
        }
      });
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
  });
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxvdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUEsQ0FBQyxZQUFVO0FBQ1QsV0FBUyxVQUFULEdBQXNCO0FBQ3BCLE1BQUUsV0FBRixFQUFlLE9BQWYsQ0FBdUIsR0FBdkI7QUFDRDs7QUFFRCxXQUFTLFVBQVQsR0FBc0I7QUFDcEIsTUFBRSxXQUFGLEVBQWUsU0FBZixDQUF5QixHQUF6QjtBQUNEOztBQUVELFNBQU8sZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFVBQVMsR0FBVCxFQUM1QztBQUNFLFFBQUksYUFBYSxFQUFFLGFBQUYsQ0FBakI7QUFDQSxRQUFJLGNBQWMsRUFBRSxjQUFGLENBQWxCO0FBQ0EsUUFBSSxZQUFZLEVBQUUsWUFBRixDQUFoQjs7QUFHQSxNQUFFLE9BQUYsQ0FBVSxvQkFBVixFQUFnQyxVQUFTLElBQVQsRUFBZTtBQUMzQztBQUNBLFVBQUksYUFBYSxJQUFqQjtBQUNBLFVBQUksZUFBZSxJQUFJLElBQXZCO0FBQ0EsVUFBSSxrQkFBa0IsYUFBYSxlQUFiLEVBQXRCO0FBQ0Esc0JBQWdCLGdCQUFoQixDQUFpQyxrQkFBakMsRUFBb0QsVUFBUyxDQUFULEVBQVc7QUFDN0Q7QUFDQSxZQUFHLGVBQWUsSUFBbEIsRUFBd0I7QUFDdEI7QUFDQSxjQUFJLFFBQVEsRUFBRSxJQUFGLENBQU8sV0FBUCxHQUFtQixDQUEvQjtBQUNBLGNBQUksWUFBWSxXQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBaEI7QUFDQSxxQkFBVyxJQUFYLENBQWdCLFdBQVcsVUFBM0I7QUFDQTtBQUNBLHNCQUFZLElBQVosQ0FBaUIsVUFBVSxLQUFWLEdBQWdCLEdBQWpDO0FBQ0Esb0JBQVUsSUFBVixDQUFlLFVBQVUsS0FBekI7QUFFRDtBQUNGLE9BWkQ7QUFhSCxLQWxCRDs7QUFvQkEsTUFBRSxXQUFGLEVBQWUsT0FBZixDQUF1QixDQUF2QjtBQUNBLE1BQUcsYUFBSCxFQUNHLFVBREgsQ0FDYyxVQUFTLEtBQVQsRUFBZ0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsWUFBTSxjQUFOLEdBQXVCLE1BQU0sY0FBTixFQUF2QixHQUFpRCxNQUFNLFdBQU4sR0FBb0IsS0FBckU7QUFDRCxLQU5ILEVBT0csVUFQSCxDQU9jLFVBQVMsS0FBVCxFQUFnQjtBQUMxQjtBQUNBLFlBQU0sY0FBTixHQUF1QixNQUFNLGNBQU4sRUFBdkIsR0FBaUQsTUFBTSxXQUFOLEdBQW9CLEtBQXJFO0FBQ0QsS0FWSDtBQVdELEdBdkNEO0FBd0NELENBakREIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gIGZ1bmN0aW9uIGhpZGVIZWFkZXIoKSB7XHJcbiAgICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDEwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93SGVhZGVyKCkge1xyXG4gICAgJCgnI21uaGVhZGVyJykuc2xpZGVEb3duKDEwMCk7XHJcbiAgfVxyXG4gIFxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW9kdWxlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldnQpXHJcbiAge1xyXG4gICAgbGV0IGNvdXJzZU5hbWUgPSAkKCcjY291cnNlTmFtZScpO1xyXG4gICAgbGV0IHNsaWRlTnVtYmVyID0gJCgnI3NsaWRlTnVtYmVyJyk7XHJcbiAgICBsZXQgc2xpZGVOYW1lID0gJCgnI3NsaWRlTmFtZScpO1xyXG5cclxuXHJcbiAgICAkLmdldEpTT04oXCIuLi9uYXZpZ2F0aW9uLmpzb25cIiwgZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2pzb24nLGpzb24pO1xyXG4gICAgICAgIHZhciBuYXZpZ2F0aW9uID0ganNvbjtcclxuICAgICAgICB2YXIgaW50ZXJmYWNlT2JqID0gZXZ0LkRhdGE7XHJcbiAgICAgICAgdmFyIGV2ZW50RW1pdHRlck9iaiA9IGludGVyZmFjZU9iai5nZXRFdmVudEVtaXR0ZXIoKTtcclxuICAgICAgICBldmVudEVtaXR0ZXJPYmouYWRkRXZlbnRMaXN0ZW5lcignQ1BBUElfU0xJREVFTlRFUicsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCduYXZpZ2F0aW9uJyxuYXZpZ2F0aW9uKTtcclxuICAgICAgICAgIGlmKG5hdmlnYXRpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlLkRhdGEuc2xpZGVOdW1iZXIpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBlLkRhdGEuc2xpZGVOdW1iZXItMTtcclxuICAgICAgICAgICAgdmFyIGN1cnJTbGlkZSA9IG5hdmlnYXRpb24uc2xpZGVzW2luZGV4XTtcclxuICAgICAgICAgICAgY291cnNlTmFtZS5odG1sKG5hdmlnYXRpb24uY291cnNlTmFtZSk7XHJcbiAgICAgICAgICAgIC8vc2xpZGVOdW1iZXIuaHRtbChlLkRhdGEuc2xpZGVOdW1iZXIrJy4nKTtcclxuICAgICAgICAgICAgc2xpZGVOdW1iZXIuaHRtbChjdXJyU2xpZGUuaW5kZXgrJy4nKTtcclxuICAgICAgICAgICAgc2xpZGVOYW1lLmh0bWwoY3VyclNsaWRlLmxhYmVsKTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjbW5oZWFkZXInKS5zbGlkZVVwKDApO1xyXG4gICAgJCggXCIjbW5yb2xsb3ZlclwiIClcclxuICAgICAgLm1vdXNlZW50ZXIoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBzaG93SGVhZGVyKCk7XHJcbiAgICAgICAgLy92YXIgc2NyZWVuTnVtYmVyID0gd2luZG93LmNwQVBJSW50ZXJmYWNlLmdldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScpO1xyXG4gICAgICAgIC8vd2luZG93LmNwQVBJSW50ZXJmYWNlLnNldFZhcmlhYmxlVmFsdWUoJ2NwQ21uZEdvdG9TbGlkZScsc2NyZWVuTnVtYmVyKzEpO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID8gZXZlbnQucHJldmVudERlZmF1bHQoKSA6IChldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcclxuICAgICAgfSlcclxuICAgICAgLm1vdXNlbGVhdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBoaWRlSGVhZGVyKCk7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgICB9KTtcclxuICB9KTtcclxufSkoKTtcclxuIl19
