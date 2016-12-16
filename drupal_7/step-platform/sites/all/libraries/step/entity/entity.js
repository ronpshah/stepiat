// JavaScript Document
(function($){
	$(function(){
		
		var basePath = Drupal.settings.basePath;
	var sitePath = Drupal.settings.STEP.sitePath + "/sites/all/libraries/step/";
	var stepJS = "";

	var head = document.getElementsByTagName('head')[0];
	
	function loadCSS(path , media , CSSloader) {
		var e = document.createElement('link');
		e.rel = "stylesheet" ;
		e.type="text/css";
		e.href = sitePath + path;
		
		// add media only if it exsits
		if (media != undefined) {
			e.media = media ;
		}
			
		e.onload = CSSloader;
		head.appendChild(e);
	}

	//Pass path and media attribute
	var arrCSS = [["css/jquery-ui.css"]];

	var cssIndex = 0 ;
	function CSSloader() {
		cssIndex++
		if (arrCSS[cssIndex] != undefined) {
			loadCSS(arrCSS[cssIndex][0] ,arrCSS[cssIndex][1] , CSSloader);
		}
	}
	
	loadCSS(arrCSS[cssIndex][0] ,arrCSS[cssIndex][1] , CSSloader);

	function loadScript(path, loader) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = sitePath + path;
		
		// most browsers
		script.onload = loader; // add
	
		//ie browser
		script.onreadystatechange = function() {
			if (this.readyState == 'complete') {
				loader();
			}
		}
		head.appendChild(script);
	}
		
		var clicky;
		$('body').on('mousedown.clickyCapture',clickyCapture);
		
		function clickyCapture(event){
			console.log(event.target);
			if($(event.target).parents('.warning-dialog').length===0){
				clicky=event.target;
			}
		}
		
		var isTabEvent = false;
		$('.text-full').on('keydown.test',function(event){
			//console.log(event);
			if(event.which===9){
				isTabEvent=true;
			}
			
		});
		
		$('body').append('<div class="warning-dialog" title="Warning">'+
			'<div class="message">The value that you have entered has special characters '+
			'<span class="special-characters" style="font-weight:bold;"></span>'+
			' in it. Are you certain you did not mean to enter <span class="replacements" style="font-weight:bold;"></span> instead? <div>'+
		'</div>');
		
		var dialogResponse = 0;
		$('.warning-dialog').dialog({
				'autoOpen':false,
				modal: true,
				buttons: 
				{
					"No": function() {
							dialogResponse=1;
							$( this ).dialog( "close" );
							//$('.text-full').focus();
					},
					"Yes": function() {
						dialogResponse=2;
						$( this ).dialog( "close" );
					}
				},
				close:function(){
					
					if(dialogResponse===1){
						$('.text-full').focus();
					}
					else{
						if(dialogResponse===2){
							if(!isTabEvent){
								$(clicky).click().focus();
							}
							else{
								$('#edit-submit').focus();
							}
							//$('body').on('mousedown.clickyCapture',clickyCapture);
						}
					}
					dialogResponse=0;
					isTabEvent=false;
					$('body').on('mousedown.clickyCapture',clickyCapture);
				}
			});
		
		$('.text-full').on('blur',function(event){
			//console.log('blurred');
			console.log(clicky);
			$('body').off('mousedown.clickyCapture');
			
			var text = $(this).val();
			
			var specialCharacters = [];
			var replacements = [];
			
			if(text.indexOf('<')!==-1){
				specialCharacters.push('<');
				replacements.push('&lt;');
			};
			
			if(text.indexOf('>')!==-1){
				specialCharacters.push('>');
				replacements.push('&gt;');
			};
			
			
			if(text.indexOf('&')!==-1){
				specialCharacters.push('&');
				replacements.push('&amp;');
			};
			
			if(specialCharacters.length>0){
				//Empty the previous text from the warning dialog
				$('.warning-dialog  .special-characters').text('');
				$('.warning-dialog  .special-characters').text(specialCharacters.join(" , "));
				$('.warning-dialog  .replacements').text(replacements.join(" or "));
				
				//console.log(document.activeElement);
				$('.warning-dialog').dialog('open');
				
				//console.dir(event);
			}
			
			
		});
		
	});
})(jQuery);