'use strict';

/**
 * @ngdoc filter
 * @name gmapPluginApp.filter:multiFilter
 * @function
 * @description
 * # multiFilter
 * Filter in the gmapPluginApp.
 */
angular.module('gmapPluginApp')
  .filter('multiFilter', function (filterFilter) {
    return function (input, filters) {
      return filterFilter(input, filters);
    };
  });
