'use strict';

let findScreenIndex = function(nav,sceneIndex) {
  let screensLen = nav.screens.length;
  let inScenes;
  let inHidden;
  let screenIndex = 0;
  for (var i = 0; i < screensLen; i++) {
    inScenes = nav.screens[i].scenes !== undefined ?
    nav.screens[i].scenes.filter(scene => {
      return scene === sceneIndex;
    }).length > 0 : false;

    inHidden = nav.screens[i].hidden !== undefined ?
    nav.screens[i].hidden.filter(scene => {
      return scene === sceneIndex;
    }).length > 0 : false;

    if(inScenes || inHidden) {
      screenIndex = i;
      break;
    }
  }
  return screenIndex;
};

module.exports = {findScreenIndex};
