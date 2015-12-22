'use strict';

/**
 * @ngdoc filter
 * @name gmapPluginApp.filter:maxFilter
 * @function
 * @description
 * # maxFilter
 * Filter in the gmapPluginApp.
 */
angular.module('gmapPluginApp')
  .filter('maxFilter', function () {
    return function (input, fieldName, expected) {
      var result = [];
      if (! expected)
        return input;
      for (var i in input){
        if (input[i][fieldName]) {
          var val = new Number(input[i][fieldName]);
          if (val <= expected){
            result.push(input[i]);
          }
        }
      }
      return result;
    };
  });
