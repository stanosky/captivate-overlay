'use strict';

const Header = require('./Header');
const Navbar = require('./Navbar');
const Menu = require('./Menu');
const TableOfContents = require('./TableOfContents');

(function(){
  let cpInterface;
  let myHeader;
  let myToc;
  let myMenu;
  let myNavbar;
  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;

    $.getJSON("../navigation.json", function(json) {
        //console.log('json',json);
        myHeader = new Header(cpInterface,json);
        myToc = new TableOfContents(cpInterface,json);
        myMenu = new Menu();
        myNavbar = new Navbar(cpInterface,json,myToc,myMenu);
    });
  });
})();
