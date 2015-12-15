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
    $scope.windowOptions = {visible: false};
    $scope.window = {
      marker: {},
      show: false,
        closeClick: function() {
          this.show = false;
        },
      options: {} // define when map is ready
    }
    var geocoder;

    //$timeout(geocodeIfNeeded, 1000);

    function geocodeIfNeeded() {
      geocoder = new google.maps.Geocoder();
      var i = 0;
      angular.forEach(locations, function(loc){
        if (! loc.latitude){
          $timeout(function() {
            geocodeAddress(loc.address + "," + loc.city + "," + loc.zipcode + ",USA", function (result) {
              loc.latitude = result.lat();
              loc.longitude = result.lng();
              locations.$save(loc);
              console.log("Done for " + loc.name);
            })
          }, i * 200);
          i++;
        }
      });
    }

    function geocodeAddress(address, callback) {
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log("OK for "+ address);
            callback(results[0].geometry.location);
          } else {
            console.error("Geocode was not successful for the following reason: " + status);
          }
        });
    }

    $scope.onClick = function(marker, eventName, model) {
      debugger;
      $scope.window.model = model;
      $scope.window.show = true;
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
