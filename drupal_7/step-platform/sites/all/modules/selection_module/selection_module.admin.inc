<?php

/**
 * @file
 * Simpletest case for node_example module.
 *
 * Verify example module functionality.
 */

/**
 * Functionality tests for node example module.
 */


function selection_module_form()
{
  $form = array();
  
 // Selection Module Workflow
  $form['selection_module'] = array(
    '#description' => 'Selection Module Workflow Settings',
    '#collapsed' => FALSE,
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#title' => 'Selection Module Workflow',
  );
  
  // Workflow State - Draft
  $form['selection_module']['draft'] = array(
    '#description' => 'configuration for workflow state - draft',
    '#collapsed' => FALSE,
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#title' => 'Workflow State - Draft setting',
  );
  
   // Workflow State - Published
  $form['selection_module']['published'] = array(
    '#description' => 'configuration for workflow state - Published',
    '#collapsed' => FALSE,
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#title' => 'Workflow State - Published setting',
  );
  
   // Workflow State - Needs Review
  $form['selection_module']['needs_review'] = array(
    '#description' => 'configuration for workflow state - Needs Review',
    '#collapsed' => FALSE,
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#title' => 'Workflow State - Needs Review setting',
  );
  
   // Workflow State -  Review for finalization
  $form['selection_module']['final_review'] = array(
    '#description' => 'configuration for workflow state - Review for finalization',
    '#collapsed' => FALSE,
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#title' => 'Workflow State - Review for finalization setting',
  );
  
  // Settings Draft
  
  $form['selection_module']['draft']['draft_element_rem'] = array(
    '#title' => t('Elements to be removed completly'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
    //'#required' => TRUE,
    '#default_value' => variable_get('draft_element_rem', 'a,h,hr'),
  );
  
  $form['selection_module']['draft']['draft_rem_tags'] = array(
    '#title' => t('Elements for which only tag to be removed'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
    //'#required' => TRUE,
    '#default_value' => variable_get('draft_remover_tags', 'a,h,hr'),
    
  );
    
  
  // Settings: Published
  
 $form['selection_module']['published']['pub_element_rem'] = array(
    '#title' => t('Elements to be removed completly'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
   // '#required' => TRUE,
    '#default_value' => variable_get('pub_element_rem', 'a,h,hr'),
  );
  
  $form['selection_module']['published']['pub_rem_tags'] = array(
    '#title' => t('Elements for which only tag to be removed'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
   // '#required' => TRUE,
    '#default_value' => variable_get('pub_remover_tags', 'a,h,hr'),
  );  

// Settings: Needs Review
 
  $form['selection_module']['needs_review']['need_rev_element_rem'] = array(
    '#title' => t('Elements to be removed completly'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
    //'#required' => TRUE,
    '#default_value' => variable_get('need_rev_element_rem', 'a,h,hr'),
  );
  
  $form['selection_module']['needs_review']['need_rev_rem_tags'] = array(
    '#title' => t('Elements for which only tag to be removed'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
    //'#required' => TRUE,
   '#default_value' => variable_get('need_rev_remover_tags', 'a,h,hr'),
  );
  
  // Settings: Review for finalization
  
  $form['selection_module']['final_review']['fin_rev_element_rem'] = array(
    '#title' => t('Elements to be removed completly'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
    //'#required' => TRUE,
    '#default_value' => variable_get('fin_rev_element_rem', 'a,h,hr'),
  );
  
  $form['selection_module']['final_review']['fin_rev_rem_tags'] = array(
    '#title' => t('Elements for which only tag to be removed'),
    '#description' => t('Enter elements to be removed separated by comma'),
    '#type' => 'textfield',
    //'#attributes' => array('class' => array('profile-name')),
   // '#field_suffix' => '<span class="field-suffix"></span>',
    //'#required' => TRUE,
   '#default_value' => variable_get('fin_rev_remover_tags', 'a,h,hr'),
  );
  
   //return system_settings_form($form);
   
    $form['buttons']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save Config Values'),
    '#weight' => 10,
    '#submit' => array('_selection_module_settings_form_submit'),
  );
  return $form;
}


function _selection_module_settings_form_submit($form, &$form_state)
{
  variable_set('draft_element_rem', $form_state['values']['draft_element_rem']);
  variable_set('draft_remover_tags', $form_state['values']['draft_rem_tags']);
  
  variable_set('pub_element_rem', $form_state['values']['pub_element_rem']);
  variable_set('pub_remover_tags', $form_state['values']['pub_rem_tags']);
  
  variable_set('need_rev_element_rem', $form_state['values']['need_rev_element_rem']);
  variable_set('need_rev_remover_tags', $form_state['values']['need_rev_rem_tags']);
  
  variable_set('fin_rev_element_rem', $form_state['values']['fin_rev_element_rem']);
  variable_set('fin_rev_remover_tags', $form_state['values']['fin_rev_rem_tags']);
  
  echo " value of remove element draft mode is :". variable_get('pub_element_rem');
  //$description = $form_state['values']['description'];
  //$exclusive = $form_state['values']['exclusive'];
  //$profiler = $form_state['values']['profiler'];
  //$profiler_includes = $form_state['values']['profiler_includes'];
}

function selection()
{
    
}
