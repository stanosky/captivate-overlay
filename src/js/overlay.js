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
  let navigation;

  myOverlay = $('#mnoverlay');
  myOverlay.css('display: none;');

  window.addEventListener("moduleReadyEvent", function(evt)
  {
    cpInterface = evt.Data;

    $.getJSON("../navigation.json", function(nav) {
        navigation = nav;
        let slidesList = cp.D.project_main.slides.split(',');
        slidesList.map((slide,index) => {
          if(navigation.slides[index] === undefined) {
            navigation.slides[index] = {index:index + 1,label:slide};
          }
          navigation.slides[index].sid = slide;
        });

        //console.log('navigation',navigation);
        myHeader = new Header(cpInterface,navigation);
        winManager.addWindow(myHeader);
        myToc = new TableOfContents(cpInterface,navigation,winManager);
        winManager.addWindow(myToc);
        myMenu = new Menu(cpInterface,winManager);
        winManager.addWindow(myMenu);
        myNavbar = new Navbar(cpInterface,navigation,winManager);

        myOverlay.css('display: block;');
    });
  });
})();
