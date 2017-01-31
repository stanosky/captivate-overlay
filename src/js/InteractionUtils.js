'use strict';

let InteractionUtils = function(cpApi) {

  let _vars = [],_corr = [];

  let _setVariables = function(array) {
    _vars = array;
  }

  let _setCorrect = function(array) {
    _corr = array;
  };

  let _isVarEqual = function(index) {
    return cpAPIInterface.getVariableValue(_vars[index]) == _corr[index];
  };

  let _areVarsEqual = function() {
    var equalVars = _vars.filter((v,i) => {
      return _isVarEqual(i);
    });
    return equalVars.length === _vars.length;
  };

  return  {
    setVariables: _setVariables,
    setCorrect: _setCorrect,
    isVarEqual: _isVarEqual,
    areVarsEqual: _areVarsEqual
  }
};

module.exports = InteractionUtils;
