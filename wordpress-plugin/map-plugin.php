<?php
/*
Plugin Name: Map Plugin
Description: Developed for WCRE
Version: 0.6
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
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/vendor.df35a56f.js' , __FILE__ ) ?>"></script>
    <script type="text/javascript" src="<? echo plugins_url( 'dist/scripts/scripts.bb3c3d71.js' , __FILE__ ) ?>"></script>
  <?
  echo file_get_contents(plugins_url( 'dist/views/main.html' , __FILE__ ));
}
?>
