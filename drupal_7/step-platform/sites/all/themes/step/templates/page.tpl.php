<div class="texture-overlay"> 
  <div id="page-wrapper"> 
    <div id="page" class="<?php print $classes; ?>"> 
      <div id="header-wrapper"> 
        <div class="container clearfix"> 
          <header id="header" role="banner"> 
            <div class="header-inner clearfix">
              <?php if ($site_logo || $site_name || $site_slogan): ?>
              <div id="branding" class="branding-elements clearfix <?php print $branding_attributes; ?>">
                <?php if ($site_logo): ?>
                <div id="logo"> <?php print $site_logo; ?> </div>
                <?php endif; ?>
                <?php if ($site_name || $site_slogan): ?>
                <hgroup id="name-and-slogan"<?php print $hgroup_attributes; ?>>
                  <?php if ($site_name): ?>
                  <h1 id="site-name"<?php print $site_name_attributes; ?>><?php print $site_name; ?></h1>
                  <?php endif; ?>
                  <?php if ($site_slogan): ?>
                  <h2 id="site-slogan"<?php print $site_slogan_attributes; ?>><?php print $site_slogan; ?></h2>
                  <?php endif; ?>
                </hgroup>
                <?php endif; ?>
              </div>
              <?php endif; ?>
              <?php print render($page['header']); ?> </div>
          </header>
        </div>
      </div>
      
      <?php if ($page['menu_bar'] || $primary_navigation || $secondary_navigation): ?>
      <div id="nav-wrapper"> 
        <div class="container clearfix"> <?php print render($page['menu_bar']); ?>
          <?php if ($primary_navigation): print $primary_navigation; endif; ?>
          <?php if ($secondary_navigation): print $secondary_navigation; endif; ?>
        </div>
      </div>
      <?php endif; ?>
      
      <?php if ($messages || $page['help']): ?>
      <div id="messages-help-wrapper"> 
        <div class="container clearfix"> <?php print $messages; ?> <?php print render($page['help']); ?> </div>
      </div>
      <?php endif; ?>
      
      <?php if ($breadcrumb): ?>
      <div id="breadcrumb-wrapper"> 
        <div class="container clearfix"> <?php print $breadcrumb; ?> </div>
      </div>
      <?php endif; ?>
      
      <?php if ($page['secondary_content']): ?>
      <div id="secondary-content-wrapper"> 
        <div class="container clearfix"> <?php print render($page['secondary_content']); ?> </div>
      </div>
      <?php endif; ?>
      
      <div id="columns-wrapper"> 
        <div class="container clearfix"> 
          <div id="columns"> 
            <div class="columns-inner clearfix"> 
              <div id="content-column"> 
                <div class="content-inner"> <?php print render($page['highlight']); ?> 
                  <<?php print $tag; ?> id="main-content" role="main"> <?php print render($title_prefix); ?>
                  <?php if ($title || $primary_local_tasks || $secondary_local_tasks || $action_links = render($action_links)): ?>
                  <header id="main-content-header" class="clearfix">
                    <?php if ($title): ?>
                    <h1 id="page-title"><?php print $title; ?></h1>
                    <?php endif; ?>
                    <?php if ($primary_local_tasks || $secondary_local_tasks || $action_links): ?>
                    <div id="tasks" class="clearfix">
                      <?php if ($primary_local_tasks): ?>
                      <ul class="tabs primary clearfix">
                        <?php print render($primary_local_tasks); ?>
                      </ul>
                      <?php endif; ?>
                      <?php if ($secondary_local_tasks): ?>
                      <ul class="tabs secondary clearfix">
                        <?php print render($secondary_local_tasks); ?>
                      </ul>
                      <?php endif; ?>
                      <?php if ($action_links = render($action_links)): ?>
                      <ul class="action-links clearfix">
                        <?php print $action_links; ?>
                      </ul>
                      <?php endif; ?>
                    </div>
                    <?php endif; ?>
                  </header>
                  <?php endif; ?>
                  <?php print render($title_suffix); ?>
                  <?php if ($content = render($page['content'])): ?>
                  <div id="content"> <?php print $content; ?> </div>
                  <?php endif; ?>
                  <?php print $feed_icons; ?> </<?php print $tag; ?>> <!-- end tag --> 
                  <?php print render($page['content_aside']); ?> </div>
              </div>
              <?php print render($page['sidebar_first']); ?> <?php print render($page['sidebar_second']); ?> </div>
          </div>
        </div>
      </div>
      
      <?php if ($page['tertiary_content']): ?>
      <div id="tertiary-content-wrapper"> 
        <div class="container clearfix"> <?php print render($page['tertiary_content']); ?> </div>
      </div>
      <?php endif; ?>
      
      <?php if ($page['footer']): ?>
      <div id="footer-wrapper"> 
        <div class="container clearfix"> 
          <footer<?php print $footer_attributes; ?>> <?php print render($page['footer']); ?> </footer>
        </div>
      </div>
      <?php endif; ?>
    </div>
  </div>
</div>
