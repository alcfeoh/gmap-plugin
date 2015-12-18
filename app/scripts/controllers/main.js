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
      options: {}
    };
    $scope.markerControl = {};
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

    $scope.$watch("filter.zip", function(){
      if ($scope.filter.zip && $scope.filter.zip.length == 5){
        geocodeAddress($scope.filter.zip + ",USA", function(loc){
          $scope.map.getGMap().setCenter(loc);
          $scope.map.getGMap().setZoom(13);
        })
      }
    })

    function geocodeAddress(address, callback) {
      geocoder = new google.maps.Geocoder();
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
      $scope.window.model = model;
      $scope.window.show = true;
    }

    $scope.resetFilters = function(){
      $scope.filter = {};
      $scope.map.getGMap().setCenter(new google.maps.LatLng(38.270224,-97.563396));
      $scope.map.getGMap().setZoom(4);
    }

    $scope.minFilterFn = function(actual, expected){
      return parseInt(actual.size) >= parseInt(expected);
    }

    $scope.maxFilterFn = function(actual, expected){
      return parseInt(actual.size) <= parseInt(expected);
    }

    $scope.selectMarker = function(id){
      var marker = $scope.markerControl.getGMarkers()[id];
      $scope.map.getGMap().setZoom(15);
      $scope.map.getGMap().setCenter(marker.getPosition());
      google.maps.event.trigger(marker, 'click', {
        latLng: new google.maps.LatLng(0, 0)
      });
    }

    $timeout(function(){
      google.maps.event.trigger($scope.map.getGMap(),'resize');
    }, 200);


  });
