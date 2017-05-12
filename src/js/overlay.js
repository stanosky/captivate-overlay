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
  let winManager = new WindowManager();
  let myHeader;
  let myToc;
  let myMenu;
  let myNavbar;
  let myNavigation;
  let interactionUtils = new InteractionUtils();

  function onResize(e) {
    let viewportWidth = $(window).width();
    let viewportHeight = $(window).height();
    let left = 0;
    let scale = 1;
    let wscale = scale;
    let hscale = scale;
    let maxWidth = 960;
    //viewportWidth = viewportWidth < 960 ? viewportWidth : 960;
    wscale = (viewportWidth < maxWidth ? viewportWidth : maxWidth) / 800;
    hscale = viewportHeight / 600;
    scale = Math.min(wscale,hscale);
    left = (viewportWidth - (800 * scale)) * .5;

    //console.log(viewportWidth, viewportHeight, scale, left);
    //console.log('style',document.getElementById('main_container').style.cssText);
    cp.movie.m_scaleFactor = scale;
    $('#main_container').attr('style',`
      top: 0px;
      position: fixed;
      left: ${left}px;
      width: 800px;
      height: 600px;
      transform-origin: left top 0px;
      transform: scale(${scale});
    `);
  }

  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;
    window.cp.SetScaleAndPosition = function(){return true;};
    onResize();
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

  $( window ).resize(onResize);

  return {
    int:interactionUtils
  }
})();

module.exports = mn;
