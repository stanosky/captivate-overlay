'use strict';

let InteractionUtils = function(cpApi) {

  let _isVarEqual = function(variable,value) {
    return cpApi.getVariableValue(variable) === value;
  };

  let _areVarsEqual = function(variables,values) {
    var equalVars = variables.filter((v,i) => {
      return _isVarEqual(v,values[i]);
    });
    return equalVars.length === variables.length;
  };

  return  {
    isVarEqual:_isVarEqual,
    areVarsEqual:_areVarsEqual
  }
};

module.exports = InteractionUtils;
