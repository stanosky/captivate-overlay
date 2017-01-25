'use strict';

let Navbar = function (cpApi,nav,winManager) {
  let navbar = $('#mnnavbar');
  let buttons = ['nav-menu','nav-prev','nav-toc','nav-next'];

  let hideMenus = function () {
    toc.hide();
    menu.hide();
  };

  let next = function() {
    cpApi.setVariableValue('cpCmndNextSlide',1);
    winManager.hide();
  };

  let prev = function() {
    cpApi.setVariableValue('cpCmndPrevious',1);
    winManager.hide();
  };

  buttons.map( b => {
    let btn = $('#'+b);
    btn.addClass('gradient-idle');
    btn.click(function() {
      if(this.id === 'nav-next') next();
      if(this.id === 'nav-prev') prev();
      if(this.id === 'nav-toc') winManager.toggle('mntoc');
      if(this.id === 'nav-menu') winManager.toggle('mnmenu');
    });

    /*btn.mouseenter(function(event) {
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
    return btn;*/
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
    //let highlight = cpApi.getVariableValue('highlight');
    console.log(e.Data.varName,e.Data.newVal);
  },'highlight');

  eventEmitterObj.addEventListener('CPAPI_MOVIEPAUSE', function(e) {
    console.log('CPAPI_MOVIEPAUSE');
    $('#nextbtn').addClass('highlight-btn');
  });

  eventEmitterObj.addEventListener('CPAPI_MOVIESTOP', function(e) {
    console.log('CPAPI_MOVIESTOP');
  });
  eventEmitterObj.addEventListener('CPAPI_INTERACTIVEITEMSUBMIT', function (e) {
    console.log('CPAPI_INTERACTIVEITEMSUBMIT',e.Data);
  });
};

module.exports = Navbar;
