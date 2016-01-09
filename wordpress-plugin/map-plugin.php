<?php
/*
Plugin Name: Map Plugin
Description: Developed for WCRE
Version: 0.99i
Author: Alain Chautard
Author URI: http://www.interstate21.com
*/
register_activation_hook( __FILE__, 'install' );
add_shortcode('map', 'render_map');
add_action( 'admin_menu', 'add_my_custom_menu' );

function add_my_custom_menu() {
    //add an item to the menu
    add_menu_page (
        'Map Plugin',
        'Map Plugin',
        'manage_options',
        'map-admin-page',
        'map_admin_page_function'
    );
}

function map_admin_page_function() {
  ?>
    <script src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/2.0.16/src/markerclusterer_packed.js"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/vendor.cffe057a.js' , __FILE__ ) ?>"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/scripts.24180941.js' , __FILE__ ) ?>"></script>
    <link rel="stylesheet" href="<? echo plugins_url( 'dist/styles/vendor.0eb12b9f.css' , __FILE__ ) ?>">
    <link rel="stylesheet" href="<? echo plugins_url( 'dist/styles/main.61dc95c3.css' , __FILE__ ) ?>">
  <?
  echo file_get_contents(plugins_url( 'dist/admin.html' , __FILE__ ));
}

function install() {

}

function render_map($atts ) {
  $params = shortcode_atts( array(
      'filter' => '{}'
  ), $atts );
  ?>
    <script src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/2.0.16/src/markerclusterer_packed.js"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/vendor.cffe057a.js' , __FILE__ ) ?>"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/scripts.24180941.js' , __FILE__ ) ?>"></script>
    <link rel="stylesheet" href="<? echo plugins_url( 'dist/styles/vendor.0eb12b9f.css' , __FILE__ ) ?>">
    <link rel="stylesheet" href="<? echo plugins_url( 'dist/styles/main.61dc95c3.css' , __FILE__ ) ?>">
    <script>
      angular.module('gmapPluginApp').constant("Config", {
            "defaultFilter": <? echo $params['filter'] ?>
       });
    </script>
  <?
  echo file_get_contents(plugins_url( 'dist/index.html' , __FILE__ ));
}
?>
