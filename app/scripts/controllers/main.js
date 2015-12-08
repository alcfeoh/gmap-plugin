'use strict';

/**
 * @ngdoc function
 * @name gmapPluginApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gmapPluginApp
 */
angular.module('gmapPluginApp')
  .controller('MainCtrl', function ($scope, locations) {
    $scope.locations = locations;
    $scope.map = {center: {latitude: 38.270224, longitude: -97.563396 }, zoom: 4 };
    $scope.options = {scrollwheel: false};


  });
