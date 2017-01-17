'use strict';

let Navbar = function (cpApi) {
  let buttons = ['menubtn','prevbtn','tocbtn','nextbtn'];
  buttons.map( b => {
    let btn = $('#'+b);
    btn.addClass('gradient-idle');
    btn.click(function() {
      if(this.id === 'nextbtn') cpApi.setVariableValue('cpCmndNextSlide',1);
      if(this.id === 'prevbtn') cpApi.setVariableValue('cpCmndPrevious',1);
      //console.log('btn clicked:',this.id);
    });
    btn.mouseenter(function(event) {
      let btn = $('#'+event.currentTarget.id);
      btn.removeClass('gradient-idle');
      btn.addClass('gradient-over');
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    })
    .mouseleave(function(event) {
      let btn = $('#'+event.currentTarget.id);
      btn.removeClass('gradient-over');
      btn.addClass('gradient-idle');
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    });
    return btn;
  });

};

module.exports = Navbar;
