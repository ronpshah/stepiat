var sitePath = Drupal.settings.STEP.sitePath;

//dimensions , configurations
var jsonConfig = {
    "global" :{
        "curWidth" :"" ,
        // width of wrapper. set to the greatest value , either minWidth or $(window).width() which is viewport width .
        "width" : function(width){
        	return "50%";
        },   
        "height" :function(){
            return  $(window).height();
        } 
    },
   "ConfigDialog" :
    {
        height:  function(){
            return jsonConfig.global.height() * .50
        } ,
        width: function(){
            return jsonConfig.global.curWidth  * .50
        },
        minWidth :420
    } ,
    
    "CM" :{
        height: function(){
            return  "540"
        },
        width:  function(){
			return '599px';
        } ,
        lineNumbers: true,
        lineWrapping: true,
        indentWithTabs: false,
        indentUnit: 2
    },
	
	"tablesWrapper" :{
		 width : function(){
            return  "25%"
         }
	},
    "tblElements" : {
        "sort": [[0,'asc']], // sort first column ascending
        "filter": true, // show search box
        "ScrollInfinite": true,// 
        "scrollheight": "425px", // height of scroller. (height of elements table) . scroll wont work if it is set too high.
        "oLanguage": {
            "sEmptyTable": "No Available Elements" // message in case of an empty tables
            ,
            // this is the message "below" the table. dataTables replaces _START_ , _END_ , _TOTAL_ with numbers .
            // Because this is the elements table, we format it to show "Showing 1 to 10 of 50 Elements"
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ Elements" 
        } 
    } ,
    
    "tblAttributes" :{
        "sort": [[0,'asc']], // sort first column ascending
        "filter": true, // show search box
        "ScrollInfinite": true,// 
        "scrollheight": "215px", 
      
        "oLanguage": {
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ Attributes" 
        }  
           
    } ,
    
    "tblEntities" :{
        "sort": [[0,'asc']], // sort first column ascending
        "filter": true, // show search box
        "ScrollInfinite": true,// 
        "scrollheight": "120px" ,
        "sDom": '<"top"f>rt<"bottom"lp><"clear">'
    },
    
    "tblMarkers" :{
        "sort": [[0,'asc']], // sort first column ascending
        "filter": true, // show search box
        "ScrollInfinite": true,// 
        "scrollheight": "120px"
    }  
}
//*******************************JSON HIGLIGHTS***************************************************

// we need to know if we already have json in the hidden textarea
if ( $("#edit-field-selection-highlights-und-0-value").val() == ""){
  
    // this should be from a link. get the content using ajax call then create 
    // an object by parsing it . like this jQuery.parseJSON( "text from ajax call");
    // but for now, we create jsonHighlights here
	
	
// get types 
 $.ajax({
     async: false,
     url: sitePath + "/step-highlight-configuration",
     dataType: "json",
     success: function(data) {
		   jsonHighlights = data 
	$("#edit-field-selection-highlights-und-0-value").val() == jsonHighlights
       }
   });
 
	
	// append this function to jsonHighlights. we need to give an id to each type
    jsonHighlights.generateIDs = function(){
        // first we make sure that there are no IDs in json. 
		// We assign ids to each type
        if (jsonHighlights.arrIdsAndColors == undefined)
        {
            var id = 0;
            jsonHighlights.arrIdsAndColors ={};
        
            // we create a hash to hold ids, colors and names. jsonHighlights.arrIdsAndColors[name] = [ "color" , id]
            
			for (x in  jsonHighlights.nodes[0].node)
            { 
                jsonHighlights.arrIdsAndColors[x] = [jsonHighlights.nodes[0].node[x]  ,id++];
            }
        }    
    }
 
	jsonHighlights.generateIDs(); // call this function to generate IDs(if IDs do not exist) and to generate 
    jsonHighlights.markers ={} ;// create empty markers object 
	
    
}
else {// The hidden text field is not empty
    // get value from the hidden text field
	
	//Only the highlights and comments for the images
	//that are still present in the selection images should be
	//present in the JSON.
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
	
    jsonHighlights  =  jQuery.parseJSON( $("#edit-field-selection-highlights-und-0-value").val()); // Need to find a fix for und, as someone may change the language of the field value.
	
}
// append this function to jsonHighlights. this function is used to create a dropdown list
jsonHighlights.getDropdown = function(){

// we need the current selection to rebuild the dropdown list while maintain the current option selected
var currentSelection =$("#step-highlights-select").val() 

    var arrDropDown =[]
    arrDropDown.push('<select id="step-highlights-select">')
    arrDropDown.push('<option/>'); // empty option
    
    for (type in  jsonHighlights.arrIdsAndColors)
    {
        arrDropDown.push('<option value="'  +type+'"');
        // If this type is equals to currentSelection, give it the attribute   selected="selected" so it is selected by default
        if (type == currentSelection)
              arrDropDown.push(' selected="selected"');
        arrDropDown.push('>');
        arrDropDown.push(type );
        
        var countMarkers = 0
        
        for ( y in jsonHighlights.markers)
            { 
             if ( jsonHighlights.markers[y].type[type] != undefined )
               {countMarkers++}
            }
            
            if (countMarkers !=0)
            { arrDropDown.push(" (" + countMarkers + ")");}
            
        arrDropDown.push('</option>');
    }
    arrDropDown.push('</select>');
    return (arrDropDown.join("")) ;
}

// create dropdownto hold types
//$("#step-highlights").html(jsonHighlights.getDropdown());
//$("#step-highlights-select").change(function(){
//    // we show markers for this option(type)
//    $("#step-markers-comments").hide();
//    createMarkersTbl(jsonHighlights.getMarkers());
//})



jsonHighlights.getComments = function(curMarker){
    var type=  $("#step-highlights-select").val();
    return jsonHighlights.markers[curMarker].type[type].comments;
}

// this function will append CSS to html and it will return a list of names(annotations,Alterations etc )with a color box
jsonHighlights.getList = function(){
	
	var arrHtmlHighLights =[];

    arrHtmlHighLights.push('<div>');
                
    for (x in  jsonHighlights.arrIdsAndColors)
    {
        var arr = jsonHighlights.arrIdsAndColors;
        arrHtmlHighLights.push('<div class="inline step-highlight-div"><div class="marker-type">'+  x +'</div><div class="step-marker-color-' + arr[x][1]+ ' step-highlight"></div></div><div class="clear"></div>');
        arrHtmlHighLights.push();
       
    }
    arrHtmlHighLights.push('</div>');
    return arrHtmlHighLights.join("");
}


function showMarkersCount(){  
    countMarkers = 0;
    for (x in  jsonHighlights.markers)
    {
	
        countMarkers++  ;
    }
	
    //$("#step-show-markers").html( "Show Markers" + " (" + countMarkers +")");
    $("#step-highlights").html(jsonHighlights.getDropdown());
	// get markers for selection only
	$("#step-highlights-select").change(function(e){
    // we show markers for this option(type)
    
    $("#step-markers-comments").hide()
	hideMarkers(); 
	
	//If the markers toolbar is visible, it indicates that the user was viewing
		//the comments for the current marker. Simulate a click on the show markers button
		//to restore the view to the markers table instead of the comments table
		//if(!$('.step-markers-container .toolbar').hasClass('hidden')){
	if($('.step-markers-container .toolbar').is(':visible')){
		$('.show-other-markers').trigger('click');
	}
	
    createMarkersTbl(jsonHighlights.getMarkers(e))
    
})
   
}




/**********************************************/
jsonHighlights.appendCSS = function(){
    var strCSS =["<style>"];
	// add css to the document
    strCSS.push(".step-highlight{  width:20px;height:20px;margin-left:10px;}")
    strCSS.push(".step-highlight-div {margin:5px; }")
    strCSS.push(".inline div{display:inline;float:left;}")
    strCSS.push(".clear div{clear:both;}")
    strCSS.push(".marked-initial {background: none;} ")
    strCSS.push(".marker-hidden {background: none;} ")
  
   // add more css to the document.
   // use type ids to associate colors with markers ids
    for (x in  jsonHighlights.arrIdsAndColors)
    {
        var arr = jsonHighlights.arrIdsAndColors
       
        strCSS.push(".step-marker-color-"+arr[x][1]+" {background: " +arr[x][0] +";} ")
    }
    strCSS.push(["</style>"])
	// append to the document
    $("head").append(strCSS.join(""))

}

/**********************************************/



// this returns an array of markers. it is used to fill markers table
jsonHighlights.getMarkers = function(e){ 
    var arrmarkers = [];
    var selection =  $("#step-highlights-select").val() ;
  
    for ( i in jsonHighlights.markers){
        if (jsonHighlights.markers[i].type[selection] != undefined)
        { 
			if(jsonHighlights.markers[i].textMarker != "Image")
			{
				var strmarker = editor.getRange(jsonHighlights.markers[i].position[0] , jsonHighlights.markers[i].position[1])
				var newStr =  strmarker.substring(0, 25).replace(/(\r\n|\n|\r)/gm,' ').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\s+/g, ' '); 
				// the "x" at the end is a place holder for the delete button
				arrmarkers.push([i, jsonHighlights.markers[i].type[selection].timeStamp,jsonHighlights.markers[i].type[selection].user  , newStr , "x"])
			}
			else
				arrmarkers.push([i, jsonHighlights.markers[i].type[selection].timeStamp,jsonHighlights.markers[i].type[selection].user  , "Image" , "x"])
        }
    }
    return(arrmarkers)
}



// config dialog
var jsonConfigDialogTabs= { 
    // this hold tabs in config dialog
    "tabs" :{  
        //Key must be unique , it is used as an ID
        "step-config-tab1": {
            "title" :  "Config" , 
            "content" : function(){
				// form for configs, not used
                var arrForm = []
                arrForm.push('<form id="step-config-form" name="step-config-form">')
                arrForm.push('<br/>Height<input id="step-config-h" type="text" name="height" value="400" class="numeric">')
                arrForm.push('<br/>Width<input id="step-config-w" type="text" name="width" value="1000" class="numeric">')
                arrForm.push('<input type="submit" value="Submit">')
                arrForm.push('</form>');
                return  arrForm.join("");
            } 
        },
        "step-config-tab2": {
            "title" : "Color Highlight",
            "content" : function (){
                return jsonHighlights.getList()
            }
        },
        "step-config-tab3": {
            "title" : "else",
            "content" : function(){
                return "step-json.js \n this is found in var jsonConfigDialogTabs" 
            }
        }
    } ,
    
    
    
    
    
    
    // function to create  jQuery tabs tab dynamically 
    // Tha parameter is a json    //
    /*  "tabs" :{  
      "unique-name": {
            "title" : "The Title" , 
            "content" : function(){ return "whatever content" }   
        }, }
 */
    createTabs : function (json){
   
        var  strTabs = '<ul>'
        for (x in json)
        {  
            strTabs +=   '<li><a href="#' +x+ '">'
            strTabs += json[x].title 
            strTabs +='</a></li>'
        }
        strTabs += '</ul>'
        for (x in json)
        {
            strTabs +=  '<div id="'+ x +'">'
            strTabs += json[x].content()
            strTabs +=  '</div>'
        }
        return strTabs;
    }  
    
}


    