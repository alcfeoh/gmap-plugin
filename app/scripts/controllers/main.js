'use strict';

/**
 * @ngdoc function
 * @name gmapPluginApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gmapPluginApp
 */
angular.module('gmapPluginApp')
  .controller('MainCtrl', function ($scope, locations, $timeout) {
    $scope.locations = locations;

    $scope.mapConf = {center: {latitude: 38.270224, longitude: -97.563396 }, zoom: 4 };
    $scope.options = {};
    $scope.clusterOptions = {};
    $scope.markerOptions ={icon: "http://wpdev.wcregroup.com/wp-content/uploads/2015/11/wcre-logo-marker-04.png"};
    $scope.map = {};

    $timeout(geocodeIfNeeded, 1000);

    function geocodeIfNeeded() {
      var geocoder = new google.maps.Geocoder();
    }

    function geocodeAddress(address, callback) {
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          callback(results[0].geometry.location);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    $scope.minFilterFn = function(actual, expected){
      return parseInt(actual.size) >= parseInt(expected);
    }

    $scope.maxFilterFn = function(actual, expected){
      return parseInt(actual.size) <= parseInt(expected);
    }

    $timeout(function(){
      google.maps.event.trigger($scope.map.getGMap(),'resize');
    }, 1000);


  });
