<?php
/*
Plugin Name: Map Plugin
Description: Developed for WCRE
Version: 0.91
Author: Alain Chautard
Author URI: http://www.interstate21.com
*/
register_activation_hook( __FILE__, 'install' );
add_shortcode('map', 'render_map');

function install() {

}

function render_map(){
  ?>
    <script src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/2.0.16/src/markerclusterer_packed.js"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/vendor.cffe057a.js' , __FILE__ ) ?>"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/scripts.7e860a97.js' , __FILE__ ) ?>"></script>
    <link rel="stylesheet" href="<? echo plugins_url( 'dist/styles/vendor.0eb12b9f.css' , __FILE__ ) ?>">
    <link rel="stylesheet" href="<? echo plugins_url( 'dist/styles/main.c256448e.css' , __FILE__ ) ?>">
  <?
  echo file_get_contents(plugins_url( 'dist/index.html' , __FILE__ ));
}
?>
