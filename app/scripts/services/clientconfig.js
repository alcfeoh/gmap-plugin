'use strict';

/**
 * @ngdoc service
 * @name gmapPluginApp.clientConfig
 * @description
 * # clientConfig
 * Service in the gmapPluginApp.
 */
angular.module('gmapPluginApp')
  .service('clientConfig', function($firebaseObject, Config) {
    var ref = new Firebase("https://wcre-i21.firebaseio.com/"+Config.clientId+"/config");
    return $firebaseObject(ref);
  });
