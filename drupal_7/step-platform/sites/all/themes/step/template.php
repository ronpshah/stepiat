<?php
// STEP by Adaptivethemes.com

/**
 * Override or insert variables into the html template.
 */
function step_preprocess_html(&$vars) {
  global $theme_key;

  $theme_name = 'step';
  $path_to_theme = drupal_get_path('theme', $theme_name);

  // Add a class for the active color scheme
  if (module_exists('color')) {
    $class = check_plain(get_color_scheme_name($theme_key));
    $vars['classes_array'][] = 'color-scheme-' . drupal_html_class($class);
  }

  // Add class for the active theme
  $vars['classes_array'][] = drupal_html_class($theme_key);

  // Add theme settings classes
  $settings_array = array(
    'box_shadows',
    'body_background',
    'menu_bullets',
    'menu_bar_position',
    'corner_radius',
  );
  foreach ($settings_array as $setting) {
    $vars['classes_array'][] = theme_get_setting($setting);
  }

  // Special case for PIE htc rounded corners, not all themes include this
  if (theme_get_setting('ie_corners') == 1) {
    drupal_add_css($path_to_theme . '/css/ie-htc.css', array(
      'group' => CSS_THEME,
      'browsers' => array(
        'IE' => 'lte IE 8',
        '!IE' => FALSE,
        ),
      'preprocess' => FALSE,
      )
    );
  }
}

/**
 * Override or insert variables into the html template.
 */
function step_process_html(&$vars) {
  // Hook into color.module
  if (module_exists('color')) {
    _color_html_alter($vars);
  }
}

/**
 * Override or insert variables into the page template.
 */
function step_process_page(&$vars) {
  // Hook into color.module
  if (module_exists('color')) {
    _color_page_alter($vars);
  }
  global $user, $base_url;
  if(isset($user->name)) { drupal_add_js(array('STEP' => array('currentUser' => $user->name)), 'setting'); }
  else { drupal_add_js(array('STEP' => array('currentUser' => 'N/A')), 'setting'); }
  if(isset($base_url)) { drupal_add_js(array('STEP' => array('sitePath' => $base_url)), 'setting'); }
  else { drupal_add_js(array('STEP' => array('sitePath' => "")), 'setting'); }
  if(getcwd()) { drupal_add_js(array('STEP' => array('cwd' => getcwd())), 'setting'); }
  else { drupal_add_js(array('STEP' => array('cwd' => "")), 'setting'); }
}

/**
 * Override or insert variables into the block template.
 */
function step_preprocess_block(&$vars) {
  if($vars['block']->module == 'superfish' || $vars['block']->module == 'nice_menu') {
    $vars['content_attributes_array']['class'][] = 'clearfix';
  }
}
