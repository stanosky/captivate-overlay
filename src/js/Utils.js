'use strict';

let _findScreenIndex = function(arr,sceneIndex) {
  let screensLen = arr.length;
  let output;
  for (var i = 0; i < screensLen; i++) {
    output = arr[i].scenes !== undefined ? arr[i].scenes.filter(scene => {
        return scene === sceneIndex;
    }) : [];
    if(output.length > 0) return i;
  }
  return -1;
};

let _getScreensArray = function(nav,currScene) {
  let isHidden = _isSceneHidden(nav.hidden,currScene);
  return isHidden ? nav.hidden : nav.screens;
};

let _isSceneHidden = function(arr,sceneIndex) {
  return arr.filter(scr => {
    return scr.scenes.filter(scene => {
      return scene === sceneIndex;
    }).length > 0;
  }).length > 0;
};

let _getPrevSceneIndex = function(arr,currScene) {
  let screenIndex = _findScreenIndex(arr,currScene);
  let screen, scenes, sceneIndex;

  if(screenIndex >= 0) {
    screen = arr[screenIndex];
    scenes = screen.scenes;
    sceneIndex = scenes.indexOf(currScene);
    if(sceneIndex > 0){
      return scenes[sceneIndex - 1];
    } else if(screen.prev !== undefined){
      return screen.prev;
    } else if(screenIndex > 0){
      screen = arr[screenIndex - 1];
      scenes = screen.scenes;
      return scenes[scenes.length-1];
    }
  }
  return -1;
};

let _getNextSceneIndex = function(arr,currScene) {
  let screenIndex = _findScreenIndex(arr,currScene);
  let screen, scenes, sceneIndex;

  if(screenIndex >= 0) {
    screen = arr[screenIndex];
    scenes = screen.scenes;
    sceneIndex = scenes.indexOf(currScene);
    if(sceneIndex < scenes.length - 1){
      return scenes[sceneIndex + 1];
    } else if(screen.next !== undefined){
      return screen.next;
    } else if(screenIndex < arr.length - 1){
      screen = arr[screenIndex + 1];
      scenes = screen.scenes;
      return scenes[0];
    }
  }
  return -1;
};

let getCurrentScreenInfo = function(nav,sceneIndex) {
  let screens = _getScreensArray(nav,sceneIndex);
  let index = _findScreenIndex(screens,sceneIndex);
  let screen = index >= 0 ? screens[index] : null;
  //console.log('getCurrentScreenInfo',index,screen,sceneIndex);
  return {
    index: index,
    nr: screen.nr,
    label: screen.label,
    prev: _getPrevSceneIndex(screens,sceneIndex),
    next: _getNextSceneIndex(screens,sceneIndex)
  };
};


module.exports = {getCurrentScreenInfo};
