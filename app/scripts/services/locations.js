'use strict';

/**
 * @ngdoc service
 * @name gmapPluginApp.locations
 * @description
 * # locations
 * Factory in the gmapPluginApp.
 */
angular.module('gmapPluginApp')
  .factory('locations', function($firebaseArray) {
    var ref = new Firebase("https://wcre-i21.firebaseio.com/locations");
    return $firebaseArray(ref);
  });
