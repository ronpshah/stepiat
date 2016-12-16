
<<?php print $tag; ?> class="<?php print $classes; ?>"<?php print $attributes; ?>>

  <?php if ('fieldset' == $tag): ?>
    <legend><span class="fieldset-legend"><?php print $legend; ?></span></legend>
    <div class="fieldset-wrapper">
  <?php endif; ?>

  <?php foreach ($fieldset_fields as $name => $field): ?>
	<?php print $field->wrapper_prefix . $field->label_html . $field->content . $field->wrapper_suffix; ?>
  <?php endforeach; ?>

  <?php if ('fieldset' == $tag): ?>
    </div>
  <?php endif; ?>

</<?php print $tag; ?>>
