var entityTable;
var nodeRegex ='' 
var objtripleRegion ={}// holds triple click range
var editor;
var attTable;
var teiNS = "http://www.tei-c.org/ns/1.0"; // this is the defaullt namespase. we use to get nodes that has this namespace.
var currentUser = Drupal.settings.STEP.currentUser; // user who creates a comments
var sitePath = Drupal.settings.STEP.sitePath;

// arrays to hold elements and attributes.
var arrAllowedChildElements =[] 
var arrAllowedAttributes =[]

//array to store the frequently used elements (tags)
var freqElems = {};
 
$("#edit-field-tei-document-und-0-xml").wrap('<div id="wrapper"/>');
$('#wrapper').append('<div class="tei-instruction">Click to edit</div>');

$('.tei-instruction').on('click',function(){
	$('#edit-field-tei-document-und-0-xml').focus();
});

TEI_EDITOR.initialize();

$("head").append('<style id="CSSForXML"/>');// this is to hold CSS for XML
 
var jsonHighlights ;
showMarkersCount()
// call this function to append css to html
jsonHighlights.appendCSS()

$("#step-apply-css").click(function(){
 applyCSS();
}); 
 
$("#step-beautifyXML").click(function(){
 beautifyXML();
});

var isCMInitilaized = false;
$('#edit-field-tei-document-und-0-xml').focus(function(){
	if (!isCMInitilaized){
		createEntitiesTbl(); // create entities table
           
		// initilize dialogs
		initConfigDialog();// Dialog to for user configurations
		initAddCommentsDialog();// Dialog to add a highlight and comments
		initXMLCSSDialog();// dialog contains XML from Code mirror . used to apply css to XML
    
		editor = CodeMirror.fromTextArea(document.getElementById("edit-field-tei-document-und-0-xml")
        , {
            mode:  'xml',
            lineNumbers: jsonConfig.CM.lineNumbers,
            lineWrapping: jsonConfig.CM.lineWrapping, // Buggy. will break line numbers
            indentWithTabs: jsonConfig.CM.indentWithTabs,
            indentUnit: jsonConfig.CM.indentUnit,
            extraKeys: { }
        });         
         
     	var hlLine = editor.addLineClass(0, "background", "activeline");
     	var foldFunc_html = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
    	editor.on("gutterClick", foldFunc_html); 
   		editor.on("blur", function() {
		updateTempTextArea();		
	   }) 

    	// this function handles the cursor activity event
    	editor.on("cursorActivity", function() {
			
  		$('.editor-instructions:visible .btn.hide-help').trigger('click');
		
        //for highlighting current active line . "activeline" is a css class          
        var cur = editor.getLineHandle(editor.getCursor().line);
        if (cur != hlLine) {
            editor.removeLineClass(hlLine, "background", "activeline");
            hlLine = editor.addLineClass(cur, "background", "activeline");
        }
         // hide tables      
        resetAll();   

        $("#entitiesDIVWrapper").show(); 
        allowedValues.hashElements = {}; //reset . used to prevent duplicate elements
        arrAllowedChildElements = [];
		arrAllowedAttributes = [];
        var  cursorPosition = editor.getCursor();// 
        var currentToken = editor.getTokenAt(cursorPosition);


        // we need to get the tag name where cursor is and we need to know if location is inside an open tag or not. 
        // objNameAndLocation will hold both Tag name and location
        var objNameAndLocation = getElementNameAndLocation(currentToken);
        var elementX = objNameAndLocation.name;
        var insideOpen = objNameAndLocation.insideOpen;
                          
        // test if xml from Code Mirror is valid . return is boolean
        var isXMLValid = validateXML(editor.getValue());
        var isSelection = editor.somethingSelected();// Boolean : true if a more there is a selection in code mirror		
		 
		    
        //******************************************************************
        //we don't do anything if we have a selected range . 
        // if( ){
        // XML from CM is valid
        if ( isXMLValid ){
            // cursor is inside an open tag. Show attributest able , populate arrAllowedAttributes , hide elements table. <x|ml></xml> . | is cursor
            if (insideOpen){
				
                // no range selected
                if (!isSelection){
                    $("#attributesDIVWrapper").show();
                    $("#elementsDIVWrapper").hide();
					
					TEI_EDITOR.manageTabs({
						show:'.attributes-tab-header',
						hide:'.elements-tab-header, .supporting-img-tab-header',
						activate:'.attributes-tab-header'
					});
					 
                    // populate arrAllowedAttributes
                    allowedValues.getAttributes( schemaX.HashNS[teiNS][elementX] , arrAllowedAttributes);  
                    $("#step-headerCurrentElement").text("Current Element: "+ elementX); 
                    fillAttTable( arrAllowedAttributes  ,elementX , insideOpen , isXMLValid,cursorPosition, currentToken );
                }
                // isSelection is true. we hide tables . this is a range
                else{
                    $("#attributesDIVWrapper").hide();
                    $("#elementsDIVWrapper").hide();
                }
            }
            // cursor is between tags. Show elements table, populate arrAllowedChildElements , hide attribute table .  <xml>|</xml>
            else{
                if(currentToken.state.type== "closeTag"){
                //nothing
                }
                else {
                    $("#elementsDIVWrapper").show();
                    $("#attributesDIVWrapper").hide();
					TEI_EDITOR.manageTabs({
						show:'.elements-tab-header, .supporting-img-tab-header',
						hide:'.attributes-tab-header',
						activate:'.elements-tab-header'
					});
					
                    allowedValues.getElements(schemaX.HashNS[teiNS][elementX], arrAllowedChildElements);  
					createElementsTable(elementX, arrAllowedChildElements);
         			//createFreqElementsTable(elementX, validFreqElems);	  

					/*for (x in arrAllowedChildElements) {
						var name = arrAllowedChildElements[x][0]; 	
						/*var obj = {
							name: arrAllowedChildElements[x][0],*/
						/*frequentlyUsedElements[name] = {	
							count: 0
						};
					}*/
					
					/*** +++ createFrequentElementsTable() should come here ***/ 
                }
            }
           
        }
        else{
            // Invalid xml and cursor is inside a new open tag .  <xml><  </xml>
            if (currentToken.type == "error" &&  currentToken.string == "<")
            {
                elementX = currentToken.state.context.tagName;
                allowedValues.getElements( schemaX.HashNS[teiNS][elementX] , arrAllowedChildElements) 
  				$("#elementsDIVWrapper").hide();
           		showElementCodeHint(currentToken ,arrAllowedChildElements,cursorPosition);// or hack original codehint ,  "'<'": function(cm) { CodeMirror.xmlHint(cm, '<'); },   
			}
            else {
                // Invalid xml and corsur is inside an exisiting open tag .  <xml a></xml>
                $("#elementsDIVWrapper").hide()
                // we do not want to show code hint if cursor is inside a closing tag . </xml a>
                if (currentToken.className != "error")
                {
                 allowedValues.getAttributes( schemaX.HashNS[teiNS][elementX] , arrAllowedAttributes)  
                 showAttrsCodeHint(currentToken ,arrAllowedAttributes,cursorPosition)
                }
            }
        }
    });
         
    // we must create markers soon after initilizing Codemirror the xml.
    initilizeMarkers()
	
	TEI_EDITOR.showEditingOptions();
   
    //set dimensions . width , height , etc
    setDimensions();
	
	
	isCMInitilaized =true;
	}   
});