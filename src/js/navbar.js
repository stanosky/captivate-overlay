'use strict';

let Navbar = function (cpApi,nav,toc,menu) {
  let navbar = $('#mnnavbar');
  let buttons = ['menubtn','prevbtn','tocbtn','nextbtn'];

  let hideMenus = function () {
    toc.hide();
    menu.hide();
  };

  let next = function() {
    cpApi.setVariableValue('cpCmndNextSlide',1);
    hideMenus();
  };

  let prev = function() {
    cpApi.setVariableValue('cpCmndPrevious',1);
    hideMenus();
  };

  buttons.map( b => {
    let btn = $('#'+b);
    btn.addClass('gradient-idle');
    btn.click(function() {
      if(this.id === 'nextbtn') next();
      if(this.id === 'prevbtn') prev();
      if(this.id === 'tocbtn') toc.toggle();
      if(this.id === 'menubtn') menu.toggle();
    });

    btn.mouseenter(function(event) {
      let btn = $('#'+event.currentTarget.id);
      btn.removeClass('gradient-idle');
      btn.addClass('gradient-over');
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }).mouseleave(function(event) {
      let btn = $('#'+event.currentTarget.id);
      btn.removeClass('gradient-over');
      btn.addClass('gradient-idle');
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    });
    return btn;
  });

  let tocposition = $('#tocposition');
  let eventEmitterObj = cpApi.getEventEmitter();
  //let totalSlides = nav.slides.length;
  let totalSlides = cpApi.getVariableValue('cpInfoSlideCount');

  eventEmitterObj.addEventListener('CPAPI_SLIDEENTER',function(e){
    $('#nextbtn').removeClass('highlight-btn');
    //check mode
    //let slideLabel = cpApi.getVariableValue('cpInfoCurrentSlideLabel');
    //if(slideLabel === '') navbar.addClass('hide-navbar');
    //else navbar.removeClass('hide-navbar');

    //console.log('cpInfoCurrentSlideType',cpApi.getVariableValue('cpInfoCurrentSlideType'));
    //console.log('cpInfoCurrentSlideLabel',cpApi.getVariableValue('cpInfoCurrentSlideLabel'));
    if(nav !== null) {
      let index = e.Data.slideNumber-1;
      //let currSlide = nav.slides[index];
      let currSlide = cpApi.getVariableValue('cpInfoCurrentSlide');
      tocposition.html(currSlide+'/'+totalSlides);
    }
  });

  eventEmitterObj.addEventListener('CPAPI_VARIABLEVALUECHANGED',function(e) {
    let total = cpApi.getVariableValue('cpInfoFrameCount');
    //console.log(e.Data.varName,e.Data.newVal,total);
  },'cpInfoCurrentFrame');

  eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function(e) {
    console.log('CPAPI_MOVIEPAUSE');
    $('#nextbtn').addClass('highlight-btn');
  });

  eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function(e) {
    console.log('CPAPI_MOVIESTOP');
  });
};

module.exports = Navbar;
