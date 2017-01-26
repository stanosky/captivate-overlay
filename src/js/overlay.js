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

    $.getJSON("navigation.json", function(nav) {
        navigation = nav;
        let slidesList = cp.D.project_main.slides.split(',');
        let labels = [];
        slidesList.map((slide,index,slides) => {
          if(navigation.slides[index] === undefined) {
            navigation.slides[index] = {index:index + 1,label:slide};
          }
          navigation.slides[index].sid = slide;
          // Do danych slajdu, dodajemy parametr "mnc" określający,
          // czy ekran został zaliczony (skrót od mncomplete).
          // Domyślnie nadajemy mu tą samą wartośc co parametr "v" (visited)
          // z kolejnego slajdu.
          // Parametr "mnc" będzie później wykorzystywany do stwierdzenia,
          // czy przejście do następnego ekranu należy zablokowac.
          let isNextSlide = index + 1 < slides.length;
          cp.D[slide].mnc = isNextSlide ? cp.D[slides[index+1]].v : false;
        });

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
