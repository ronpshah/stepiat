<?php

/**
 * @file
 * Editor integration functions for jWYSIWYG.
 */

/**
 * Plugin implementation of hook_editor().
 */
function wysiwyg_step_editor() {
  $editor['step'] = array(
    'title' => 'STEP',
    'vendor url' => 'http://code.google.com/p/step/',
    'download url' => 'http://code.google.com/p/step/downloads/list',
    'libraries' => array(
      '' => array(
        'title' => 'Source',
        'files' => array('step.js'),
      ),
      'pack' => array(
        'title' => 'Packed',
        'files' => array('step.pack.js'),
      ),
    ),
    'version callback' => 'wysiwyg_step_version',
    // @todo Wrong property; add separate properties for editor requisites.
    'css path' => wysiwyg_get_path('step'),
    'versions' => array(
      '0.5' => array(
        'js files' => array('step.js'),
        'css files' => array('step.css'),
      ),
    ),
  );
  return $editor;
}

/**
 * Detect editor version.
 *
 * @param $editor
 *   An array containing editor properties as returned from hook_editor().
 *
 * @return
 *   The installed editor version.
 */
function wysiwyg_step_version($editor) {
  $script = $editor['library path'] . '/step.js';
  if (!file_exists($script)) {
    return;
  }
  $script = fopen($script, 'r');
  fgets($script);
  $line = fgets($script);
  if (preg_match('@([0-9\.]+)$@', $line, $version)) {
    fclose($script);
    return $version[1];
  }
  fclose($script);
}

