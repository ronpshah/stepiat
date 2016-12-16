//This document will be used to render the UI and its appropriate
//functions when a user wants to edit the content of a TEI document

TEI_EDITOR={};
    
//Initially the components that are used on the editor are not
//created or injected into the DOM
TEI_EDITOR.componentsCreated=false;

//The list of classe's/id's whose visibility needs to be toggled
//when you want to show/hide the editor
TEI_EDITOR.editingComponents=[
	'#step-buttons-wrapper',
	'#LoadImage',
	'.documentation-section',
        '#bottomRight'
];


    function loadPopup()
    {
          window.open("http://www.iupui.edu/~stepiat/step-platform/sites/all/libraries/step/js/tei/teiHeader.html");
    }
  
TEI_EDITOR.createEditorComponents = function() {	  
	var $stepButtons = $('<div id="step-buttons-wrapper">'+
	
		'<button class="tei-edit-options bckbutton" type="button" onClick="loadPopup();" ><img src="../../img/Import_Botton.png" height="50" width="100" alt="Import"></img></button>'+
		'<div class="divider"/>'+
		<!--'<button class="tei-edit-options import bckbutton" type="button" ><img src="../../img/Import_Botton.png" height="50" width="100" alt="Import"></img> </button>'+'<div class="divider"/>'+-->
		'<button class="tei-edit-options bckbutton" id="step-beautifyXML"  type="button" value="beautify" > <img src="../../img/Format_Botton.png" height="50" width="100" alt="Format"></img></button>'+'<div class="divider"/>'+
		'<button class="tei-edit-options validate-xml bckbutton" type="button" ><img src="../../img/Validate_Botton.png" height="50" width="100" alt="validate"></img></button>'+'<div class="divider"/>'+
		'<button class="tei-edit-options entity-search bckbutton" type="button"><img src="../../img/Symbol_Botton.png" height="50" width="100" alt="symbols"></img></button>'+'<div class="divider"/>'+
		'<button class="tei-edit-options add-comment bckbutton" type="button"><img src="../../img/Add_Highlight_Botton.png" height="50" width="100" alt="highlight"></img></button>'+'<div class="divider"/>'+
        '<button class="tei-edit-options save-xml bckbutton" type="button"><img src="../../img/Save_Botton.png" height="50" width="100" alt="save"></img></button>'+'<div class="divider"/>'+
		'<button class="tei-edit-options export bckbutton" type="button"><img src="../../img/Export_Botton.png" height="50" width="100" alt="Export"></img></button>'+'<div class="divider"/>'+		
		'<br>'+            '<!--<button class="tei-edit-options editor-help hidden" type="button">Help</button>-->'
	);

	var $bottomRight = $(
                
                '<div id="bottomRight" data-role="main">'+
  		'<ul>'+
		'<li class="comments-tab-header" ><a href="#commentsContents">Notes</a></li>'+
                '<li class="documentation-tab-header"><a href="#documentationContents">Tag Documentation</a></li>'+
  		'</ul>'+
  		'<div id="commentsContents" class="comments-tab-content">'+
  		'</div>'+
  		'<div id="documentationContents">'+
  		'</div>'+
		'</div>'                
	);

	var $documentationSection = $('<div class="documentation-section">'+
		'	<div class="item-documentation">'+
		'	</div>'+
		'</div>'
	);

	var $commentsHelper = $('<div class="help-button hidden">help</div>'+
		'<div class="instructions-comment help help-info">'+
		'<button type="button" class="close">×</button>'+
		'<span>To add comments, first select any text from the editor on the left.</span>'+
		'</div>'+
		'<div class="toolbar clearfix">'+
		'<div class="toggle-markers btn btn-small hidden">'+
		'<span class="show action">Show</span><span class="markers-label ">All Highlights</span>'+
		'</div>'+
		'</div>'
	);

	var $markerTypeSelector=$('<div id="step-highlights"></div>');

	//Container to hold the markers table and its selection states
	var $markersContainer = $('<div class="step-markers-container"></div>');
	var $markersContainerToolbar=$('<div class="toolbar clearfix hidden">'+
		'<span class="selected-marker"><table></table></span>'+
		'<span class="btn add-comments-to-highlight pull-right" title="Add comments for this highlight">+</span>'+
		'<span class="btn show-other-markers pull-right" title="Show Other Highlights">&#8629;</span>'+
		'</div>'
	);
	var $markersTableContainer = $('<div id="step-markers-table"></div>');
	$markersContainer.append($markersContainerToolbar);
	$markersContainer.append($markersTableContainer);

	//Container to hold the comments table and its selection states
	var $commentsContainer = $('<div class="step-comments-container"></div>');
	var $commentsContainerToolbar = $('<div class="step-comments-container-toolbar"></div>');
	var $commentsTableContainer = $('<div id="step-markers-comments"></div>');

	$commentsContainer.append($commentsContainerToolbar);
	$commentsContainer.append($commentsTableContainer);

	$markerTypeSelector.html(jsonHighlights.getDropdown());

	$bottomRight.find('#commentsContents').append($commentsHelper);
	$bottomRight.find('#commentsContents .toolbar').append($markerTypeSelector);
	$bottomRight.find('#commentsContents').append($markersContainer);
	$bottomRight.find('#commentsContents').append($commentsContainer);

	var $editorOptions = $('<div class="editor-options">'+
		'<ul class="editor-option-tab-headers">'+
		'<li class="supporting-img-tab-header hidden">'+
		'<a href="#supportingImgTabContent">Figures</a>'+
		'</li>'+
		'<li class="elements-tab-header hidden">'+
		'<a href="#step-div-elem">Elements</a>'+
		'</li>'+
		'<li class="attributes-tab-header hidden">'+
		'<a href="#step-div-attrs"><div class="desc">Attributes for </div><div class="element-name"></div></a>'+
		'</li>'+
		'<li class="help-tab-header">'+
		'<a href="#stepHelp">Help</a>'+
		'</li>'+
		'</ul>'+
		'<div id="supportingImgTabContent" class="hidden tab-body">'+
		'<div class="help-button ">help</div>'+
		'<div class="instructions-comment help help-info hidden">'+
		'<button type="button" class="close">×</button>'+
		'<span class="instruction">Double click on an image to insert it at the current cursor position.</span>'+
		'<span class="msg-error figure-not-valid hidden">Figure is not a valid element at the current cursor position.</span>'+
		'</div>'+
		'</div>'+
		'<div id="step-div-elem" class="hidden tab-body">'+
			'<div id="all-elements"></div>'+
			'<div id="frequently-used-elements">'+
				'<div class="title">Frequently Used</div>'+
				'<table id="elementList"></table>'+
			'</div>'+
		'</div>'+
		'<div id="step-div-attrs" class="hidden tab-body"></div>'+
		'<div id="stepHelp" class="hidden tab-body"></div>'+
		'</div>'
	);
	
	
	var $editorInstructions = $('<div class="editor-instructions">'+
		'<div><span class="title">Editing Tips</span><!--<span class="hide-help btn pull-right">Hide Help</span>--></div>'+
		'<ul class="editor-instruction-list unstyled tei-clearfix">'+
		'	<li>To add a highlight/comment, highlight text on the xml document on the left, and click on "Add highlights" above.</li>'+
		'	<li>Click anywhere on the TEI document to show options relevant to that element.<!--<span class="hide-help"> Hide these hints</span> to see your options.--></li>'+
		'	<li>Highlight areas on the image by selecting the square icon and clicking on "Add highlights" above.</li>'+
		'	<li>See below for highlights and comments made on this document.</li>'+
		'</ul>'+
		'</div>'
	);
						
	//Create two columns that will contain all the elements
	var $leftColumn = $('<div class="left-column"></div>');
	var $rightColumn = $('<div class="right-column"></div>');

	//The left column will contain the xml editor and the current image
	//which are present in the wrapper at the moment
	//$leftColumn.append($('#wrapper').html());

	//Add the two columns to the wrapper.
	$('#wrapper').append($leftColumn).append($rightColumn);
	this.componentsCreated=true;

	//Cache the components on the TEI_EDITOR object itself
	this.components={
		stepButtons:$stepButtons,
		documentationSection:$documentationSection,
		//markersTableContainer:$markersTableContainer,
		editorOptions:$editorOptions,
		editorInstructions:$editorInstructions,
		bottomRight:$bottomRight
	};
	
	
	//$('#step-div-elem td').attr('title','title="Click-> Show documentation; &#xA;Double click-> Add tag to tei editor;"');
	//Fetch the available entities JSON object 
	//and store it in a local cache
	$.getJSON(sitePath+"/step-entities",function(data){
		TEI_EDITOR.entites = data.entities;
	});
	
	var $entitiesDialog = $('<div class="entities-dialog">'+
		'<div id="step-div-entities"></div>'+
		'<div class="entity-details pull-right">'+
			'<div class="entity-info">Click to see value, Double click to insert into document.</div>'+
			'<div class="entity-value-details"></div>'+
		'</div>'+
	'</div>');
	
	
	var $highlightsInfoDialog = $('<div class="highlights-info-dialog" title="Instructions">'+
		'<div class="message" style="text-align:center;">'+
			'<p>To add a highlight,</p>'+
			'<p>Select some text in the editor.</p>'+
			'<p style="text-align:center;font-weight:bold;">OR</p>'+
			'<p>Select an area on an image.</p>'+
		'</div>'+
	'</div>');
	
	var $exportTeiDialog = $('<div id="step-export-tei-dialog" title="Tools">'+
		'<div id=\"step-export-tei-root\">'+
			'Export .step file to <button class="export-tei-options transcriptor" type="button" disabled >STEP Transcriptor</button>'+
			'<output></output>'+
			'<br><br>Export .step file to <button class="export-tei-options annotator" type="button" disabled>Step Emendator</button>'+
			'<output></output>'+
			'<br><br>Export .xml file to: <input type="text" name="LastName" value="URL" disabled><!--<button class="export-tei-options emendator" type="button ">Emendator</button>-->'+
			'<output></output>'+'<br><br>The export functionality is still under development phase'+
		'</div>'+
	'</div>');

        var $importTeiDialog = $('<div id="step-import-tei-dialog" title="Tools">'+
		'<div id=\"step-import-tei-root\">'+
			'Import .step file from<button class="import-tei-options transcriptor" type="button" disabled>STEP Transcriptor</button>'+
			'<br><br>Import .step file from <button class="import-tei-options transcriptor" type="button" disabled>STEP Emendator</button>'+
			'<br><br>Import .xml file from: <input type="text" value="URL" disabled>'+
			'<output></output>'+'<br><br>The import functionality is still under development phase'+
	
		'</div>'+
	'</div>');		
	var $saveDialog= $('<div id="saveCheck">The save functionality is still under development phase.Please use "Save Options" button to save the document.</div>');
        $('body').append($saveDialog);
	$('body').append($entitiesDialog);
	$('body').append($highlightsInfoDialog);
	$('body').append($exportTeiDialog);
	$('body').append($importTeiDialog);
	
	$(".highlights-info-dialog").dialog({
        modal: true,
        autoOpen: false,
        height: 200,
        width: 300
    })
	$("#saveCheck").dialog({
        modal: true,
        autoOpen: false,
        height: 200,
        width: 300
    });
	
	$("#step-export-tei-dialog").dialog({
        modal: true,
        autoOpen: false,
        height: 360,
        width: 300,
    });
	
        $("#step-import-tei-dialog").dialog({
        modal: true,
        autoOpen: false,
        height: 360,
        width: 300,
    });
	
	createEntitiesTbl();
	
	$entitiesDialog.dialog(
		{ 
			autoOpen: false,
			title : 'Insert Entities' ,
			minWidth : '450',
			minHeight : '300',
			open : function(){
				//Since the dialog is hidden on pageload, the width of the table header is not set properly
				//by datatable widget. This is a known issue. As a workaround, invoke the fnAdjustColumnSizing()
				//function after dialog open to force a resize. This causes all the widths to be calculated again
				//References
				//http://datatables.net/ref#fnAdjustColumnSizing
				//http://datatables.net/forums/discussion/2148/header-width-issue/p1
				var $entityTable = $('#step-tbl-entites').dataTable().fnAdjustColumnSizing();
				//$('#step-div-entities .dataTables_scrollHead').children().hide();
				
				var $entityCategorySelection = $('#step-div-entities .entity-categories');
				if($entityCategorySelection.length===0){
				var entityCategories={};
				entityCategories.categoryInfo = $('#step-div-entities').data('allCategories');
				entityCategories.options=['<option value="All">All</option>'];
				$.each(entityCategories.categoryInfo,function(key, value){
					entityCategories.options.push('<option value="'+ key +'">'+ key +'</option>');
				});
				
				
				if($entityCategorySelection.length===0){
					var $entityCategorySelection = $('<select class="entity-categories">'+
					entityCategories.options.join("")+
					'</select>');
										
					$('#step-div-entities').prepend($entityCategorySelection);
				}
					
					//Cache the original data of the entities
					var originalData = $('#step-tbl-entites').dataTable().fnGetData();
					
					$entityCategorySelection.on('change',function(event){
											
						//Remove the previous entities table
						$('#step-tbl-entites').remove();
						var selectedCategory = $("select.entity-categories option:selected").eq(0).val();
						
						//Create a new entities table again
						createEntitiesTbl({'selectedCategory':selectedCategory});
						
						//$('#step-div-entities .dataTables_scrollHead').children().hide();
						$('#step-tbl-entites tbody').on('click',TEI_EDITOR.entityClickHandler);
						
					});
					
				}
				
			}
		}
	);
	
	
}


TEI_EDITOR.validateHighlights = function(){
	
	var commentsJSON = JSON.parse($("#edit-field-selection-highlights-und-0-value").val());
	
	var referencedImages = {};

    $.each(commentsJSON['markers'], function (key, value) {
        if( value['position'][2]===1){
			if(!referencedImages[value['position'][3]]){
				referencedImages[value['position'][3]]=[];
			}
            referencedImages[value['position'][3]].push(key);
		}
    });
		
	var availableSelectionImages = [];
	
	$.each($('#selection-image-links a'),function(index, element){
		var $this = $(this);
		availableSelectionImages.push($this.attr('href'));
	});
	
	$.each(referencedImages,function(imageHref, keys){
		
		//If the image for a highlight is not present in the
		//selection images list, remove the higlight and save it
		//in the textArea
		if($.inArray(imageHref,availableSelectionImages) == -1){
			for(var i=0;i<keys.length;i++){
				delete commentsJSON['markers'][keys[i]];
			}
		}
		
	});
	
	$("#edit-field-selection-highlights-und-0-value").val(JSON.stringify(commentsJSON));
	
	
	
	
}



TEI_EDITOR.initialize=function(){
	//Create the editing components
	this.createEditorComponents();
	
	//Hide the UI components
	this.hideEditingOptions();
	
	//The hightlighs should only be present in the JSON
	//for the images in the selection images
	//TEI_EDITOR.validateHighlights();
}

TEI_EDITOR.hideEditingOptions = function (){
	$(this.editingComponents.join()).addClass('hidden');
}

TEI_EDITOR.manageTabs=function(config){
	if(config.show){
		//Show the tab header
		$(config.show).removeClass('hidden');
		
		//Show all the corresponding tab body
		$('a',config.show).each(function(){
			$($(this).prop('id')).removeClass('hidden');
		});
	}
	
	if(config.hide){
		//Hide the tab headers
		$(config.hide).addClass('hidden');
	
		//Hide all the corresponding tab body
		$('a',config.hide).each(function(){
			$($(this).prop('id')).addClass('hidden');
		});
	}
	
	//Simulate a click on the tab to be activated
	if(config.activate){
		$('a',config.activate).trigger('click');
	}	
};

TEI_EDITOR.entityClickHandler = function(event){
		var $this = $(this);
		var $target = $(event.target);
		
		if($target.hasClass('entity-title')){
			$('.entities-dialog .entity-value-details').html($target.siblings('.entity-value').text());
		}
	};

//Bind the event handling functions upon interface initialization
TEI_EDITOR.bindHandlers=function(){
	/*
        $(".img-container").resizable({
            alsoResize:".CodeMirror ",
            
        });

        $(".CodeMirror").resizable({
            alsoResize:".CodeMirror-vscrollbar ",
            
        });
        /*
        $(".img-container").resizable();
        $('.img-container').resize(function () {
            $('.CodeMirror').width($("#wrapper").width() - $(".img-container").width());
        });
        $(window).resize(function () {
            $('.CodeMirror').width($("#wrapper").width() - $(".img-container").width());
            $('.img-container').height($("#wrapper").height());
        });*/
        
	$('.export').on('click',function(){
		$("#step-export-tei-dialog").dialog('open') ;
	});
	
	$('.import').on('click',function(){
		$("#step-import-tei-dialog").dialog('open') ;
	});
	$('.save-xml').on('click',function(){
		$("#saveCheck").dialog('open') ;
	});
	
	$('.transcriptor').on('click',function(){
		downloadFile();
	});
	
	$('#selection-image-links figure').on('click',function(event){
		$(this).addClass('current').siblings().removeClass('current');
	});
	
	$('.img-container').hover(function(){
		$('.toolbar',this).show();
	},function(){
		$('.toolbar',this).hide();
	});
	
	$('.tei-header').on('click',function(){
		openTeiHeaderDialog();
	});
	
	$("#step-beautifyXML").on('click',beautifyXML);
	
	$('.editor-help').on('click',function(event){
		var $this = $(this);
		var $target = $(event.target);
		
		$this.toggle();
		$('.editor-instructions').toggleClass('hidden').siblings('.editor-options').toggleClass('hidden');
	});
	
	
	$('.editor-instructions .hide-help').on('click',function(event){
		$('.editor-help').trigger('click');
	});
	
	
	$('.entity-search').on('click',function(event){
		var $this = $(this);
		
		$('.entities-dialog').dialog('open');
	});
	
	
	$('#step-tbl-entites tbody').on('click',TEI_EDITOR.entityClickHandler);
	
	$('.close').on('click',function(event){
		var $this = $(this);
		var $parent = $this.parent();
		
		//Fade out the parent container.
		//And fade in the Help button
		$parent.fadeOut(300);
		$this.parents('.tab-body').find('.help-button').fadeIn(300);
	});
	
	$("#messages .close-messages").on('click', function(event){
		var $this = $(this);
		var $parent = $this.parent();
		//Fade out the parent container.
		//And fade in the Help button
		$parent.fadeOut(300);
	});
	
	$('.help-button').on('click',function(event){
		var $this = $(this);
		var $tabBody = $this.parents('.tab-body');
		
		//Fadout the Help button
		//Fadein the help instructions
		$this.fadeOut(300);
		$tabBody.find('.help').fadeIn(300);
	});
	
	$('.add-comment').on('click',function(){
		openCommentsDialog();
	});
	
	$('.validate-xml').on('click',function(){
		$("#messages").show();
		$(".messages").empty().html("<p>Validating</p>").removeClass("status error").addClass("process");
		editor.save();
		var xmlDocument = $("#edit-field-tei-document-und-0-xml").val();
		var xmlSchema = "tei_all.rng";
		var postData = {};
		postData["cwd"] = Drupal.settings.STEP.cwd;
		postData["sitePath"] = Drupal.settings.STEP.sitePath;
		postData["rng"] = xmlSchema;
		postData["xml"] = xmlDocument;
		var xmlRequest = $.ajax({
			type: "POST",
			data: JSON.stringify(postData),
			url: sitePath + "/sites/all/libraries/step/validate/validate.php",
  			processData: false
		}).done(function(results) {
			var messages = $(".messages");
			messages.empty().append(results).removeClass("process status error");
			
			if (messages.children().length) {
				messages.children().each(function() {
					if ($(this).is("p") && $(this).text() == "ERROR") {
						$(this).hide();
						messages.addClass("error");
					} else if ($(this).is("p") && $(this).text() == "VALID") {
						$(this).hide();
						messages.addClass("status");
					}
					if ($(this).hasClass("error")) {
						$(this).removeClass("error");
						messages.addClass("error");
					}
				});
			}
			$("#messages").show(300);
		});
	});
	
	$('#step-add-comment-root .step-highlight-div').hover(
		function(){
			$(this).addClass('hover');
		},
		function(){
			$(this).removeClass('hover')
		}
	);
	
	$('.step-highlight-div').click(function (event) {
		var $target = $(event.target);
		 
        // Get the type of the comment
        var type = $('.marker-type',this).html();//event.target.innerHTML;
    	
		$('#step-add-comment-root .selected').removeClass('selected');
		$target.addClass('selected');
		
		$target.parent('.step-highlight-div').addClass('selected');
		
		//Remove the previous form and submit button
		$('#step-form').remove();
		
		//Resize the dialog
		$('#step-add-comment-dialog').dialog('option','width',565);
        
		//Add a new form
        $('#step-add-comment-dialog').append('<div id="step-form"><form id="step-comment-form"><textarea/><input type="submit"/></form></div>');
		
        $('#step-comment-form').submit(function(e) {
			
            addComment(type);
			$('.img-container .toolbar .cancel-highlight').addClass('hidden').siblings('.draw').removeClass('hidden').siblings('.add-comment').addClass('hidden');
			
			$('#step-add-comment-dialog').animate({'opacity':'0'},1000,function(){
			    $('#step-add-comment-dialog').dialog( "close" ).css({'opacity':'1'});
				
				//Simulate a click on the comments and markers block to show the latest comment
				$('#step-highlights-select>option').each(function(index, element){
					if($(element).prop('value')===type){
						$('#step-highlights-select').prop('selectedIndex',index).change();
						
						
						var $currentMarkerRow = $('#step-tbl-markers tbody tr').filter(function() { 
						  return $(this).data('rowData')[0] === TEI_EDITOR.new_comment_markerID;
						});
						$currentMarkerRow.trigger('click');
					}
				});
			});
            return false;
        });
    });	
	
	//Action handler for the user to toggle the display
	//of markers in the comments section.
	$('.comments-tab-content .toolbar .toggle-markers').on('click',function(event){
		var $this = $(this);
		var $actionButton = $('.action',$this);
		
		if($actionButton.hasClass('show')){
			showMarkers();
			$actionButton.toggleClass('show hide');
			$actionButton.html('Hide');
		}
		else{
			hideMarkers();
			$actionButton.toggleClass('show hide');
			$actionButton.html('Show');
		}
	});
	
	$('.comments-tab-header a').one('click',function(event){
		createMarkersTbl(jsonHighlights.getMarkers()); 
	});	
	
	//Simulate a click on the documentation tab when the user clicks on
	//either the elements table or the attributes table
	$('#step-div-elem, #step-div-attrs').on('click',function(){
		$('.documentation-tab-header a').trigger('click');
	});
	
	$('.img-container .toolbar .draw').on('click',function(event){
		draw_rect();
		var $this = $(this);
		$this.addClass('hidden').siblings('.cancel-highlight, .add-comment').removeClass('hidden');
	});
	
	
	$('.img-container .toolbar .cancel-highlight').on('click',function(event){
		undoDraw();
		var $this = $(this);
		$this.addClass('hidden').siblings('.draw').removeClass('hidden').siblings('.add-comment').addClass('hidden');
	});

	
	$('.img-container .toolbar .reset').on('click',function(event){
		resetCanvas();
	});
	
	$('.img-container .toolbar .pan').on('click',function(event){
		var $this = $(this);
		pan($this.find('span').html());
	});
	
	$('.img-container .toolbar .zoom').on('click',function(event){
		var $this = $(this);
		//Cast the multiplier in the span, specified as 1 or -1 
		//and call the buttonZoom function.
		buttonZoom(+$this.find('span').html());
	});
	
	//$('.img-container .toolbar .view-full-image').on('click',function(event){
	//	var $this = $(this);
		
		//var childWin = window.open('../helpers/imagePopupWindow.html','child', "width=500, height=500, location=no, menubar=no, scrollbars=no, status=no, toolbar=no");
		
    //   if (window.focus) {childWin.focus()}
	//});
	
	$("#step-highlights-select").on('change',function(){
		//we show markers for this option(type)		
		$('#step-markers-comments').hide();
		
		//If the markers toolbar is visible, it indicates that the user was viewing
		//the comments for the current marker. Simulate a click on the show markers button
		//to restore the view to the markers table instead of the comments table
		//if(!$('.step-markers-container .toolbar').hasClass('hidden')){
		if($('.step-markers-container .toolbar').is(':visible')){
			$('.show-other-markers').trigger('click');
		}
		createMarkersTbl(jsonHighlights.getMarkers());
		
		//Hide any existing markers
		hideMarkers();
	});
	
	$('.step-markers-container .show-other-markers').on('click',function(event){
		var $this = $(this);
		
		//Hide the toolbar
		$this.parents('.toolbar').addClass('hidden');
		
		//Show the markers table container.
		$('#step-markers-table').removeClass('hidden');		
		$('#step-markers-comments').hide();
		
		//Hide the existing markers.
		hideMarkers();
		
	});
        
	
	$('.step-markers-container .add-comments-to-highlight').on('click',function(event){
			window.isFromRowSelection=true;
			
			var $addCommentToExistingHighlight = $('.add-comment-to-existing-highlight-dialog');
			
			if($addCommentToExistingHighlight.size()==0){
				$addCommentToExistingHighlight = $('<div class="add-comment-to-existing-highlight-dialog">'+
				'<form action=""><textarea name="" id="" cols="60" rows="15"></textarea><div class="btn add-new-comment pull-right">Submit</div></form>'+
				'</div>');
				$('body').append($addCommentToExistingHighlight);
				$addCommentToExistingHighlight.dialog( 
					{
						modal: true,
			        	autoOpen: false,
						width:'475px'
					}
				);
				
				$('.add-new-comment',$addCommentToExistingHighlight).on('click',function(event){
					//Set the flag
					window.isFromRowSelection=true;
					addComment();
					//Reset the flag
					window.isFromRowSelection=false;
					$addCommentToExistingHighlight.dialog('close');
					
					//Refresh the comments table for the current highlight
					createCommentsTbl($('.selected-marker tr').data('rowData')[0]);
				});
			}
			
			
			$addCommentToExistingHighlight.dialog({ title: "Add Comment : " + $('#step-highlights-select').val() + ' : for this Highlight'});
			
			//Clean up previous values, if any, in the text area
			$('textarea',$addCommentToExistingHighlight).val('');
			
			$addCommentToExistingHighlight.dialog('open');
	});
	

	
	$('#step-markers-comments').on('click',function(event){
		var $target = $(event.target);
		var $targetParent=$target.parent();
		if($target.hasClass('edit-comment-btn')){
			$('.user-comment',$target.parents('tr')).trigger('click');
		}
		else{
			if($target.hasClass('edit-grp')){				
				var $userCommentSection = $targetParent.siblings('.user-comment');				
				
				if($target.hasClass('save-changes-btn')){
					$('button[type="submit"]',$userCommentSection).trigger('click');
				}
				else{
					if($target.hasClass('cancel-changes-btn')){
						$('button[type="cancel"]',$userCommentSection).trigger('click');
					}
				}
				
				$('.edit-grp',$targetParent).addClass('hidden');
				$('.manage-grp',$targetParent).removeClass('hidden');
			}
			else{
				if($target.hasClass('user-comment')){
					$('.manage-grp',$targetParent).addClass('hidden');
					$('.edit-grp',$targetParent).removeClass('hidden');					
				}
			}
		}
	});	
	
	$('#selection-image-links a').on('click',function(event){
		event.preventDefault();
		var $this = $(this);

		if(!$this.hasClass('active')){
			
			$('.active').removeClass('active');
			$this.addClass('active');
			
			var newImg = $this.attr('href');
			$('.view-full-image').attr('href',newImg);
			loadImage(newImg);
		}			
	});
		
	//Suppress the click action for the supporting images
	$('#supportingImgTabContent a').on('click',function(event){
		
		var $tabContent = $('#supportingImgTabContent');
		
		
					
		//Dont go to any other page on clicking the anchor
		return false;
	});
	
	
	//Suppress the click action for the supporting images
	$('#supportingImgTabContent a').on('dblclick',function(event){
		
		var $tabContent = $('#supportingImgTabContent');
		
		var isFigureValid = $('.instructions-comment',$tabContent).data('isFigureValid');
		
		if(!isFigureValid){
			$('.help-button',$tabContent).trigger('click');
		}
		else{
			//Code to insert figure tab at the cursor position.
			
			
			// get position of  selection
			var startCh = editor.getCursor("start").ch
			var startLine = editor.getCursor("start").line
			var endCh = editor.getCursor("end").ch
			var endLine = editor.getCursor("end").line
	
			//*********************************************
			var isSelection = editor.somethingSelected();
			if (!isSelection){
				
				var figureElement='\r\n<figure> \r\n'+
					'<head></head>\r\n'+
					'<figDesc></figDesc>\r\n'+
					'<graphic url="'+$(this).prop('href')+'"/>\r\n'+
				'</figure>';

				editor.replaceRange( figureElement,
								{
									line:startLine ,
									ch: startCh
								},
								{
									line:startLine ,
									ch: startCh
								});
								
				editor.setCursor(startLine+1,0);
				editor.indentLine(startLine+1,'smart');
				editor.setCursor(startLine+2,0);
				editor.indentLine(startLine+2);
				editor.setCursor(startLine+3,0);
				editor.indentLine(startLine+3);
				editor.setCursor(startLine+4,0);
				editor.indentLine(startLine+4);
				editor.setCursor(startLine+5,0);
				editor.indentLine(startLine+5);
				editor.setCursor(startLine  ,startCh+ event.target.textContent.length +1 )
				editor.focus();
			}
				
				
		}
		
	});
	
	$('.supporting-img-tab-header>a').on('click',function(event){
		
		//Check the list of valid elements that can be inserted
		//at the cursor position by reading the data from the dataTable
		//If figure is a valid element, insert it
		//else display an error message to the user.
		
		var $tabContent = $('#supportingImgTabContent');
		var isFigureValid = false;
		
		$.each(arrAllowedChildElements,function(index, element){ 
			for (key in element)
			{
				if(element[key]==='figure'){
					isFigureValid=true;
				}
			}
		});
		
		//Save the current state on the instructions option
		$('.instructions-comment',$tabContent).data('isFigureValid',isFigureValid);
		
		if(isFigureValid){
			
			$tabContent.find('.figure-not-valid').addClass('hidden').siblings('.instruction').removeClass('hidden');
			$('.instructions-comment',$tabContent).removeClass('error-style');
		}
		else{
			$tabContent.find('span.figure-not-valid').removeClass('hidden').siblings('.instruction').addClass('hidden');
			$('.instructions-comment',$tabContent).addClass('error-style').data('isFigureValid',isFigureValid);
		}
	});
	
};

TEI_EDITOR.showEditingOptions = function (){
	
	
	$(this.editingComponents.join()).removeClass('hidden');

	var $leftColumn = $('.right-column');
	var $rightColumn = $('.left-column');
	
	//If the user is clicking on the editor for the first time
	//Add all the custom html of the editor to the UI
	if(!TEI_EDITOR.isUIInitialized){		
		$('.tei-instruction').hide();
		
		//Add the code editor and the image to the left column
		var $imgContainer = $('<div class="img-container" />');

		var $toolbar = $('<div class="toolbar">'+
		'	<div class="image-actions draw" title="Draw Highlight">Highlight <span class="hidden">highlight</span></div>'+
		'	<div class="image-actions cancel-highlight hidden" title="Cancel drawing highlight"><span>X</span><span class="hidden">Cancel Highligting</span></div>'+
		'<div class="image-actions add-comment hidden" title="Add Comment"></div>'+
			'	<div class="image-actions zoom  zoom-in" title="Zoom In">+&nbsp;&nbsp;<span class="hidden">1</span></div>'+
			'	<div class="image-actions zoom zoom-out" title="Zoom Out">-&nbsp;&nbsp;	<span class="hidden">-1</span></div>'+
			'	<div class="image-actions pan pan-up" title="Pan Up">&#9650; <span class="hidden">up</span></div>'+
			'	<div class="image-actions pan pan-down" title="Pan Down">&#9660; <span class="hidden">down</span></div>'+
			'	<div class="image-actions pan pan-left" title="Pan Left">&#9668; <span class="hidden">left</span></div>'+
			'	<div class="image-actions pan pan-right" title="Pan Right">&#9658; <span class="hidden">right</span></div>'+
			'	<div class="image-actions view-full-image" title="View original size image"><a class="view-full-image" target="_blank" href=""></a><span class="hidden">View original size image</span></div>'+
			'	<div class="image-actions reset" title="Reset to Original Size"><span class="hidden">reset</span></div>'+
			'</div>'
		);
		
		$imgContainer.append($toolbar);
		$imgContainer.append($('<div id="LoadImage"></div>'));
		$imgContainer.append($('#selection-image-links').removeClass('hidden'));
		
		
		//$leftColumn.append($('.CodeMirror')).append($imgContainer); // Old Layout
		//New Layout - Feb 13, 2014
		$leftColumn.append($('.CodeMirror'));
		//$leftColumn.append(TEI_EDITOR.components.stepButtons);
		//$leftColumn.append(TEI_EDITOR.components.editorOptions);
		//$leftColumn.append(TEI_EDITOR.components.editorInstructions);
		
		$rightColumn.append($imgContainer);
		
		var $pb = $('<img id="progressBar" style="display:none;" src= "http://iat.iupui.edu/sdev/sites/default/files/loading-gif-animation.gif"/>');
		$('#LoadImage').append($pb);
		
		var defaultImg = $('#selection-image-links a').eq(0).attr('href');
		$('.view-full-image').attr('href',defaultImg);
		loadCanvas("LoadImage",defaultImg);
		
		$('#selection-image-links figure').eq(0).addClass('current');
		
		//Horizontally Scroll through the artifact image list
		$('#selection-image-links .field-items').mousewheel(function(event, delta){
			  this.scrollLeft -= (delta * 30);
			  event.preventDefault();
		 });
		$('#selection-image-links figure').eq(0).addClass('current');
		
		var editorComponents = TEI_EDITOR.components;
		
		//To the right column, add
		//Buttons
		//Vertical tabs - comments, supporting elements, attributes, elements
		//Documentation Accordion
		$leftColumn.append(TEI_EDITOR.components.stepButtons);
		$leftColumn.append(TEI_EDITOR.components.editorOptions);
		//$leftColumn.append(TEI_EDITOR.components.editorInstructions);
		$('#stepHelp').append(TEI_EDITOR.components.editorInstructions);
		editorComponents.bottomRight.find('#documentationContents').append(editorComponents.documentationSection);
		
		editorComponents.bottomRight.tabs();
		$rightColumn.append(editorComponents.bottomRight);
		
		$('#supportingImgTabContent').append($('#figure-links').removeClass('hidden'));
		
		TEI_EDITOR.components.editorOptions.tabs({selected:3}).addClass('ui-tabs-vertical');
		
		TEI_EDITOR.bindHandlers();
		
		//Show the editor help and instructions by default
		//$('.editor-help').trigger('click').hide();
		
		
		
		
		//$rightColumn.append(editorComponents.bottomRight);
		
		//The hightlighs should only be present in the JSON
		//for the images in the selection images
		//TEI_EDITOR.validateHighlights();
		TEI_EDITOR.isUIInitialized=true;
		
	}	
}