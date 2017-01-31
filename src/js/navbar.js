'use strict';
import Utils from './Utils';

let Navbar = function (cpApi,nav) {
  let navbar = $('#mnnavbar');
  let tocposition = $('#tocposition');

  function _update() {
    //console.log('update navbar');
    let screenInfo = nav.getScreenInfo();
    let isQuiz = nav.isQuiz();
    let isInteraction = nav.isInteraction();
    let totalScreens = nav.getScreens().length;

    $('#nav-next')[0].disabled = isQuiz || isInteraction || screenInfo.next === -1;
    $('#nav-prev')[0].disabled = isQuiz || screenInfo.prev === -1;
    $('#nav-toc')[0].disabled = isQuiz;
    $('#menu-toc')[0].disabled = isQuiz;

    if(nav.isCompleted() && screenInfo.next !== -1) {
      $('#nav-next + label').addClass('highlight');
    } else {
      $('#nav-next + label').removeClass('highlight');
    }

    tocposition.html((screenInfo.nr) + '/' + totalScreens);
  }


  $('#nav-next').click((e) => nav.next());
  $('#nav-prev').click((e) => nav.prev());
  $('#nav-toc').click((e) => nav.toggleWindow('mntoc'));
  $('#nav-menu').click((e) => nav.toggleWindow('mnmenu'));

  return {
    update: _update
  }
};

module.exports = Navbar;
