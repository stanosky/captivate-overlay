'use strict';
const ToggleWindow = require('./ToggleWindow');

let TabelOfContents = function (cpApi,nav) {
  let _mntoc = $('#mntoc');
  let _tw = new ToggleWindow('mntoc');

  let output = [];
  for (var i = 0; i < nav.screens.length; i++) {
    output.push("<div><input type='button' name='toc-item' id='toc-item-"+i+"'>"+
                "<label for='toc-item-"+i+"'>"+
                "<i class='fa fa-map-marker fa-lg' aria-hidden='true'></i>"+
                "<span>"+nav.screens[i].nr+".</span>&nbsp;&nbsp;"+
                nav.screens[i].label+"</label></div>");
  }
  $('#mntoc .slides-group').html(output.join(''));
  $('.slides-group div').click(function(e) {
    //console.log($(this).index());
    let screenIndex = $(this).index();
    let sceneIndex = nav.screens[screenIndex].scenes[0];
    cpApi.setVariableValue('cpCmndGotoSlide',sceneIndex);
    cpApi.setVariableValue('cpCmndGotoFrameAndResume',0);
    _tw.hide();
  });

  return {
    win: _tw
  }

};

module.exports = TabelOfContents;
