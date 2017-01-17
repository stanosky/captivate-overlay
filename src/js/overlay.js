'use strict';

const Header = require('./header');

(function(){
  let cpInterface;
  let myHeader;

  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;
    $.getJSON("../navigation.json", function(json) {
        //console.log('json',json);
        myHeader = new Header(cpInterface,json);
    });
  });
})();
