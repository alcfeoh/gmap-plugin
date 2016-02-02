'use strict';

/**
 * @ngdoc function
 * @name gmapPluginApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gmapPluginApp
 */
angular.module('gmapPluginApp')
  .controller('MainCtrl', function ($scope, locations, clientConfig, $timeout, multiFilterFilter, minFilterFilter, maxFilterFilter, Config, uiGmapGoogleMapApi) {

    var vm = this;

    vm.locations = locations;
    vm.clientConfig = clientConfig;

    vm.mapConf = {center: {latitude: 38.270224, longitude: -97.563396 }, zoom: 4 };
    vm.options = {};

    vm.map = {};
    vm.markerControl = {};
    var geocoder;
    vm.defaultFilter = Config.defaultFilter;
    vm.filter = {};
    angular.copy(vm.defaultFilter, vm.filter);

    uiGmapGoogleMapApi.then(function(maps) {
      vm.window = {
        marker: {},
        show: false,
        closeClick: function() {
          this.show = false;
        },
        options: {
          pixelOffset: new google.maps.Size(0, -40)
        }
      };
      if (vm.defaultFilter){
          vm.applyFilters();
      }

      vm.locations.$loaded(
        function() {
          vm.filteredLocations = vm.getFilteredLocations();
          $scope.$watch("vm.filteredLocations", function(){
            vm.fitBounds();
          }, true);
        }
      );

      vm.clientConfig.$loaded(
        function(){
          vm.markerOptions = clientConfig.markerOptions;
          vm.clusterOptions = clientConfig.clusterOptions;
        }
      )

      $timeout(function(){
        google.maps.event.trigger(vm.map.getGMap(),'resize');
      }, 200);
    });

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

    vm.zoomChanged = function(map, event, args){
      console.log("Zoom changed to "+ map.getZoom());
      if (map.getZoom() <= 10)
        vm.window.show = false;
    }

    vm.getFilteredLocations = function(){
      var res =  multiFilterFilter(vm.locations, vm.appliedFilter);
      res = minFilterFilter(res, 'size', vm.minSize);
      res = maxFilterFilter(res, 'size', vm.maxSize);
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

    vm.onClick = function(marker, eventName, model) {
      vm.window.model = model;
      vm.window.show = true;
    }

    vm.applyFilters = function(){
      vm.appliedFilter = {};
      angular.copy(vm.filter, vm.appliedFilter);
      if (vm.zipcode && vm.zipcode.length == 5){
        geocodeAddress(vm.zipcode + ",USA", function(loc){
          vm.map.getGMap().setCenter(loc);
          vm.map.getGMap().setZoom(13);
        })
      }
      vm.filteredLocations = vm.getFilteredLocations();
    }

    vm.resetFilters = function(){
      vm.filter = {};
      vm.window.show = false;
      angular.copy(vm.defaultFilter, vm.filter);
      angular.copy(vm.defaultFilter, vm.appliedFilter);
      vm.filteredLocations = vm.getFilteredLocations();
      vm.zipcode = null;
      vm.minSize = null;
      vm.maxSize = null;
      vm.resetBounds();
    }

    vm.selectMarker = function(id){
      var markers = vm.markerControl.getGMarkers();
      var marker;
      for (var m in markers){
        if (markers[m].key == id)
          marker = markers[m];
      }
      if (marker){
        vm.map.getGMap().setZoom(15);
        vm.map.getGMap().setCenter(marker.getPosition());
        google.maps.event.trigger(marker, 'click', {
          latLng: new google.maps.LatLng(0, 0)
        });
      }
    }

    vm.fitBounds = function(){
      var bounds = new google.maps.LatLngBounds();
      if (vm.filteredLocations.length > 0){
        for (var l in vm.filteredLocations){
          var loc = vm.filteredLocations[l];
          bounds.extend(new google.maps.LatLng(loc.latitude, loc.longitude));
        }
        if (vm.filteredLocations.length > 1)
          vm.map.getGMap().fitBounds(bounds);
        else {
          vm.map.getGMap().setCenter(new google.maps.LatLng(loc.latitude, loc.longitude));
          vm.map.getGMap().setZoom(15);
        }

      } else
        vm.resetBounds();
    }

    vm.resetBounds = function(){
        vm.map.getGMap().setCenter(new google.maps.LatLng(38.270224,-97.563396));
        if (vm.map.getGMap().getZoom() != 4)
          vm.map.getGMap().setZoom(4);
    }

  });
