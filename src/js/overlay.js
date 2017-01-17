'use strict';

const Header = require('./header');
const Navbar = require('./navbar');
const Menu = require('./menu');
const TableOfContents = require('./toc');

(function(){
  let cpInterface;
  let myHeader;
  let myToc;
  let myMenu;
  let myNavbar;
  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;

    console.log('cpInterface.getVariableValue',
                cpInterface.getVariableValue('cpCmndMute'),
                window.cpAPIInterface.getVariableValue('cpCmndMute'));
    $.getJSON("../navigation.json", function(json) {
        //console.log('json',json);
        myHeader = new Header(cpInterface,json);
        myToc = new TableOfContents();
        myMenu = new Menu();
        myNavbar = new Navbar(cpInterface,json);
    });
  });
})();
