'use strict';
const ToggleWindow = require('./ToggleWindow');

let TabelOfContents = function (cpApi,nav) {
  let _mntoc = $('#mntoc');
  let _tw = new ToggleWindow('mntoc');

  let output = [];
  for (var i = 0; i < nav.slides.length; i++) {
    output.push("<li><a href='javascript:void(0);' onclick='return false;'>"+nav.slides[i].label+"</a></li>");
  }
  $('#mntoc .innertoc').html(output.join(''));
  $('#mntoc li').click(function(e) {
    console.log($(this).index());
    cpApi.setVariableValue('cpCmndGotoSlide',$(this).index());
    _tw.hide();
  });

  return {
    win: _tw
  }

};

module.exports = TabelOfContents;
