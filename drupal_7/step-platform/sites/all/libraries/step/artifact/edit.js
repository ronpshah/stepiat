(function ($) {
	$(document).ready(function() {
		
		// HIDE THE HIGHLIGHTS AND ARTIFACT AND SUPPORTING IMAGES LINK TABS
		$("#selection-node-form #tabs-0-one_main .item-list ul li:nth-child(7)").hide();
		$("#selection-node-form #tabs-0-one_main .item-list ul li:nth-child(8)").hide();
		$("#selection-node-form #tabs-0-one_main .item-list ul li:nth-child(9)").hide();
		
		// HIDE THE HIGHLIGHTS FIELD FOR ARTIFACT IMAGES
		$("#edit-field-artifact-digital-images-und-0-field-artifact-highlights").hide();
		
		// HIDE THE BODY LABEL IN ARTIFACT EDIT PAGES
		$("label[for='edit-field-artifact-body-und-0-xml']").hide();
		
		// HIDE THE PROMOTE AND STICK OPTIONS
		$("#selection-node-form .form-item-promote").hide();
		$("#selection-node-form .form-item-sticky").hide();
		$("#selection-node-form #edit-preview").hide();
		
		// MOVE THE SAVE BUTTON INTO THE MODERATION / PUBLISHING OPTIONS TAB
		$("#edit-actions").appendTo("#selection-publishing-options");
		
		// MOVE THE SELECTION IMAGE LINKS CONTAINER TO THE ENCODING TAB
		$("#selection-image-links").appendTo("#wrapper").addClass('hidden');
		
		// MOVE THE SUPPORTING IMAGE LINKS CONTAINER TO THE ENCODING TAB
		$("#figure-links").appendTo("#wrapper").addClass('hidden');
		
		// DUPLICATE THE XML TEXT FIELD FOR THE PREVIEW TAB
		//$("#tabs-0-one_main-2").clone([deepWithDataAndEvents=true]).attr("id", "tabs-0-one_main-9").appendTo("#tabs-0-one_main");
		//$("#edit-field-tei-document-body-und-0-xml").val().appendTo("#artifact-presentation .block-inner .block-content");
	
		// REMOVE EMPTY HTML ELEMENTS TO HELP CLEAN UP THE DOM
		$("#selection-node-form #tabs-0-one_main .item-list ul li:nth-child(8)").remove(); // Selection Images Tab Link
		$("#selection-node-form #tabs-0-one_main .item-list ul li:nth-child(8)").remove(); // Again with same nth-child as they are renumbered, this one catches the Figures and Graphics tab Link
		$("#tabs-0-one_main-8").remove(); // Selection Images Container
		$("#tabs-0-one_main-9").remove(); // Figures and Graphics Images Container
		
		// Create a close button for the Messages block in Drupal
		var closeMessages = function() {
			var messages = $("#messages");
			if (!messages.length) {
				$(".content-inner").prepend("<div id=\"messages\"><div class=\"messages\"></div></div>");
			}
			$("#messages").append('<button type="button" class="close-messages">×</button>');
			messages = $(".messages").children();
			if (!messages.length) {
				$("#messages").hide();	
			}
		};
		closeMessages();
		
		$("#messages .close-messages").on('click', function(event){
			var $this = $(this);
			var $parent = $this.parent();
			//Fade out the parent container.
			//And fade in the Help button
			$parent.fadeOut(300);
		});	
	});	
})(jQuery);

