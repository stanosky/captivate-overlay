'use strict';

const WindowManager = require('./WindowManager');
const Header = require('./Header');
const Navbar = require('./Navbar');
const Menu = require('./Menu');
const TableOfContents = require('./TableOfContents');

(function(){
  let cpInterface;
  let myOverlay;
  let winManager = new WindowManager();
  let myHeader;
  let myToc;
  let myMenu;
  let myNavbar;
  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;
    myOverlay = $('#mnoverlay');
    myOverlay.css('display: none;');
    $.getJSON("../navigation.json", function(json) {
        //console.log('json',json);
        myHeader = new Header(cpInterface,json);
        winManager.addWindow(myHeader);
        myToc = new TableOfContents(cpInterface,json,winManager);
        winManager.addWindow(myToc);
        myMenu = new Menu(cpInterface,winManager);
        winManager.addWindow(myMenu);
        myNavbar = new Navbar(cpInterface,json,winManager);
        
        myOverlay.css('display: block;');
    });
  });
})();
