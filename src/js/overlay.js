'use strict';

const WindowManager = require('./WindowManager');
const Header = require('./Header');
const Navbar = require('./Navbar');
const Menu = require('./Menu');
const TableOfContents = require('./TableOfContents');
const Navigation = require('./Navigation');
const InteractionUtils = require('./InteractionUtils');

global.mn = (function(){
  let cpInterface;
  let myOverlay;
  let winManager = new WindowManager();
  let myHeader;
  let myToc;
  let myMenu;
  let myNavbar;
  let myNavigation;
  let interactionUtils = new InteractionUtils();

  myOverlay = $('#mnoverlay');

  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;

    $.getJSON("navigation.json", function(data) {
        myNavigation = new Navigation(cpInterface,winManager,data);

        myHeader = new Header(cpInterface,myNavigation);
        winManager.addWindow(myHeader);
        myNavigation.addObserver(myHeader);
        myToc = new TableOfContents(cpInterface,myNavigation);
        winManager.addWindow(myToc);
        myNavigation.addObserver(myToc);
        myMenu = new Menu(cpInterface,myNavigation);
        winManager.addWindow(myMenu);
        myNavigation.addObserver(myMenu);
        myNavbar = new Navbar(cpInterface,myNavigation);
        myNavigation.addObserver(myNavbar);

    });
  });

  return {
    int:interactionUtils
  }
})();

module.exports = mn;
