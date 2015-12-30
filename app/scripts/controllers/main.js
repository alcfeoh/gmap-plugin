'use strict';

/**
 * @ngdoc function
 * @name gmapPluginApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gmapPluginApp
 */
angular.module('gmapPluginApp')
  .controller('MainCtrl', function ($scope, locations, $timeout, multiFilterFilter, minFilterFilter, maxFilterFilter, Config) {
    $scope.locations = locations;

    $scope.mapConf = {center: {latitude: 38.270224, longitude: -97.563396 }, zoom: 4 };
    $scope.options = {};
    $scope.clusterOptions = { styles: [
      {anchorText: [-3, 35], url: "http://wcregroup.com/wp-content/uploads/2015/12/cluster-marker.png",
        height: 50, width: 120, textSize: 16, textColor: "orange",

      }
    ]};
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
    $scope.defaultFilter = Config.defaultFilter;
    $scope.filter = {};
    angular.copy($scope.defaultFilter, $scope.filter);

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

    $scope.$watch("zipcode", function(){
      if ($scope.zipcode && $scope.zipcode.length == 5){
        geocodeAddress($scope.zipcode + ",USA", function(loc){
          $scope.map.getGMap().setCenter(loc);
          $scope.map.getGMap().setZoom(13);
        })
      }
    })

    $scope.$watch("filter", function(){
      if (google && $scope.locations)
        $scope.fitBounds();
    }, true)

    $scope.getFilteredLocations = function(){
      var res =  multiFilterFilter($scope.locations, $scope.filter);
      res = minFilterFilter(res, 'size', $scope.minSize);
      res = maxFilterFilter(res, 'size', $scope.maxSize);
      return res;
    }

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
      angular.copy($scope.defaultFilter, $scope.filter);
      $scope.zipcode = null;
      $scope.minSize = null;
      $scope.maxSize = null;
      $scope.resetBounds();
    }

    $scope.selectMarker = function(id){
      var markers = $scope.markerControl.getGMarkers();
      var marker;
      for (var m in markers){
        if (markers[m].key == id)
          marker = markers[m];
      }
      if (marker){
        $scope.map.getGMap().setZoom(15);
        $scope.map.getGMap().setCenter(marker.getPosition());
        google.maps.event.trigger(marker, 'click', {
          latLng: new google.maps.LatLng(0, 0)
        });
      }
    }

    $scope.fitBounds = function(){
      var bounds = new google.maps.LatLngBounds();
      var locations = $scope.getFilteredLocations();
      if (locations.length > 0){
        for (var l in locations){
          var loc = locations[l];
          bounds.extend(new google.maps.LatLng(loc.latitude, loc.longitude));
        }
        $scope.map.getGMap().fitBounds(bounds);
      } else
        $scope.resetBounds();
    }

    $scope.resetBounds = function(){
      $scope.map.getGMap().setCenter(new google.maps.LatLng(38.270224,-97.563396));
      $scope.map.getGMap().setZoom(4);
    }

    $timeout(function(){
      google.maps.event.trigger($scope.map.getGMap(),'resize');
    }, 200);
  });
