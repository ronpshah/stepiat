//Loading all the scripts and style sheets
var $ = jQuery;

$(document).ready(function() {
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
	var arrCSS = [["css/print.css" , "print"],
				  ["js/cm/codemirror.css", "screen, projection"],
				  ["js/cm/util/simple-hint.css"],
				  ["css/cm/docs.css"],
				  ["css/demo_page.css"],
				  ["css/jquery-ui.css"],
				  ["css/step-css.css"],
				  ["css/tei-editor.css"]];

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

	var arrScripts =[   'js/underscore.js',
						'js/tei/step-dom-functions.js',
						'js/jquery/jquery.dataTables.js',
						"js/jquery/jquery.jeditable.js",
						"js/jquery/jquery.mousewheel.js",
						"js/jquery/jquery.windowmsg-1.0.js",
						"js/tei/step-cm-fill-tables.js",
						"js/tei/step-elems-attrs.js",
						"js/beautify-html.js",
						"js/cm/codemirror.js",
						"js/cm/xml.js",
						"js/cm/util/foldcode.js",
						"js/cm/util/closetag.js",
						"js/cm/util/xml-hint.js",
						"js/cm/util/simple-hint.js",
						'js/tei/step-load-rng.js',
						"js/tei/step-node-docs.js",
						"js/tei/step-cm-functions.js",
						"js/tei/step-json.js",
						"js/tei/step-highlight-functions.js",
						"js/tei/step-digital-image.js",
						"js/tei/step-tei-edit-mode.js",
						"js/tei/step-cm-init.js",
						"artifact/edit.js"];
	
	var index= 0;
	function loader() {
		index++;
		if (arrScripts[index] != undefined){
			loadScript(arrScripts[index] , loader);
		}
	}
	
	loadScript(arrScripts[0] , loader);
});