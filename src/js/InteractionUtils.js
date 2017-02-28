'use strict';

const InteractionUtils = function(cpApi) {

  let _vars = [],_corr = [];

  const _setVariables = function(array) {
    _vars = array;
  }

  const _setCorrect = function(array) {
    _corr = array;
  };

  const _isVarEqual = function(index) {
    return cpAPIInterface.getVariableValue(_vars[index]) == _corr[index];
  };

  const _areVarsEqual = function() {
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
