//Throughout this file wherever there is a check with position[2] == 0/1 helps us to identify whether the marker comes from the text area or the image

// initilize markers from jsonHighlights 
// we need to this as soon as the xml file is loaded to code mirror.
// this function is similar to copyArrayToMarker. the only differance is the css class name
function initilizeMarkers(){
    // use the stored positions to create markers
    for (x in  jsonHighlights.markers){
        var curmarker = jsonHighlights.markers[x]
		if(curmarker.position[2] == 0) {
			var x = editor.markText(curmarker.position[0],curmarker.position[1] , {"className" :"marked-initial"});// marked-initial is a css class 
        	curmarker.textMarker = x;
		}
		if(curmarker.position[2] == 1) {
			curmarker.textMarker="Image";
		}
    }
}


// This will update the position array. 
// we call this function before removing marker object
function copyMarkersToArray(){
    for (x in jsonHighlights.markers){
		if(jsonHighlights.markers[x].position[2] == 0)	{
		   try{
			   var marker  = jsonHighlights.markers[x];
			   //set position array using find() to get the current pasition for marker
			   marker.position[0] = marker.textMarker.find().from;
			   marker.position[1] = marker.textMarker.find().to ;  
			  }
			  
		   catch(e){
				// if marker no longer exsits in the editor (user deleted the marked text)
				// then we delete this marker object
				delete jsonHighlights.markers[x];
				// reset markers count
				showMarkersCount();
		   }
		}
		if(jsonHighlights.markers[x].position[2] == 1) {
			marker  = jsonHighlights.markers[x];
		}
    }
}
    
 // create marker objects for positions array
function copyArrayToMarker(cssStyle){
    var css = cssStyle ||"marker-hidden"
    // create markers from positions array.
    for (x in jsonHighlights.markers){
        var marker  = jsonHighlights.markers[x];
		if(jsonHighlights.markers[x].position[2] == 0) {
        	var m = editor.markText(marker.position[0],marker.position[1] , {"className" :css});
			marker.textMarker = m;
		}
		if(jsonHighlights.markers[x].position[2] == 1) {
			ctx.clearRect(0,0,canvasWidth,canvasHeight);
			redraw();
		}
    }
}

var isSelection;
var rect ={};
// we open this dialog only if a range is selected.
function openCommentsDialog(){
    isSelection = editor.somethingSelected();
	if(!isSelection)
		rect = img_update();
    if (isSelection || !_.isEmpty(rect)){
        $("#step-add-comment-dialog").dialog('open') ;
    }else{
		$(".highlights-info-dialog").dialog('open') ;
	}
}

     
// This function saves  jsonHighlights (markers and comments) to a hidden textarea
// this function should be called when user is done with editing.
function  updateTempTextArea(){
    // we need to remove functions from jsonHighlights to be able to stringfy it
	
    copyMarkersToArray()// make sure array of positions is updated with the new marker positions
    // create a deep copy  for jsonHighlights
    var jsonTemp =jQuery.extend(true, {},  jsonHighlights);// deep copy
   
   //delete all marker object because we dont really need them
   for (x in  jsonTemp.markers)
    {
    delete  jsonTemp.markers[x].textMarker; 
    }
    // set to null because we cant convert it to a string as is  
    // copy what we need to the temporary json  
    // set the value of the hidden textarea to the temporary json (
    $("#edit-field-selection-highlights-und-0-value").val(JSON.stringify(jsonTemp));
}


var highlighted_cm = false;
var highlighted_di = false;
// This function will show all markers. the highlight color will be for the first "type"
function showMarkers(){
   // First we update the positions array.
   
   if((highlighted_cm == false))
	{
		copyMarkersToArray(); 
		for (x in jsonHighlights.markers){
			for (x in jsonHighlights.markers){
			   var markerid = jsonHighlights.markers[x];
			   if(markerid.position[2] == 0) {//if(markerid.textMarker!="Image"){
				   markerid.textMarker.clear() ;
				   //we need to get an id for this marker
				   // we get the id for the first type.
				   // we could change this so if this marker has more than one type, we give it a special color. 
				   var firstType ;
				   for (type in jsonHighlights.markers[x].type) {
					   firstType = type ;// this is the first type.
					   continue ; // we just need the first type
				   }
				   var  idOfFirstType = jsonHighlights.arrIdsAndColors[firstType][1];
				   var x = editor.markText(markerid.position[0],markerid.position[1] , {"className" :"step-marker-color-"+idOfFirstType});
				   highlighted_cm=true; 
				   markerid.textMarker = x;
			   }
		   }
		}
	}

	if(highlighted_di == false)
	{
		for (x in jsonHighlights.markers){
			var markerid = jsonHighlights.markers[x];
			if(markerid.position[2] == 1 && imageObj.src == markerid.position[3]) {
				
				var firstType ;
				for (type in jsonHighlights.markers[x].type)
				{	
					firstType = type ;// this is the first type. 
					continue ; // we just need the first type
				}
				
				var  clr = jsonHighlights.arrIdsAndColors[firstType][0];
				var rgb =  hex2rgb(clr);
				ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] +', ' + rgb[2] + ', 0.3)';
				ctx.lineWidth = '5';
				ctx.fillRect(markerid.position[0].x, markerid.position[0].y, markerid.position[1].w, markerid.position[1].h); 
				highlighted_di = true;
				//img_update();
			}
		}
	}
	
}


// This function hides all markers.
// it gives a css class to all markers with a bachground that is set to "none"
function hideMarkers(){
    // First we update the positions array.
     copyMarkersToArray();
    // for each marker object
    for (x in jsonHighlights.markers){
        var marker = jsonHighlights.markers[x];
		if(marker.position[2] == 0){
			// clear this marker
			marker.textMarker.clear() ;
			// reacreate the marker with the new css (marker-hidden) that has a background set to "none"". like this .marker-hidden{background:none;}
			var x = editor.markText(marker.position[0],marker.position[1] , {"className" :"marker-hidden"});
			// add the marker object to jsonHighlights
        	marker.textMarker = x;
		}
		else
		{	
			ctx.clearRect(0,0,canvasWidth,canvasHeight);
			ctx.drawImage(imageObj, 0, 0,imgConfig.correctedImageWidth, canvas.height);
			rect = {};
			//t_ctx.clearRect(0,0,canvasWidth,canvasHeight);
			//loadImage(curr_im);
			//redraw();
		}
		highlighted_cm=false;
		highlighted_di=false;
		drawn=false;
    }
}



function addComment(type) {  // we need to create a unique name for each marker.
	if (isSelection) {
		highlighted_cm = false;
		var startLine = editor.getCursor("start").line;
        var startCh = editor.getCursor("start").ch; //For some reason CM3 shift 1 Charecter to the right. I subtracted 1
        var endCh = editor.getCursor("end").ch;
        var endLine = editor.getCursor("end").line;
        
		// create a unique ID for this marker.
        var markerID = startLine + "-" + endLine + "-" +startCh + "-" +endCh;
        
        if (jsonHighlights.markers[markerID] == undefined) {
        	jsonHighlights.markers[markerID] = {};
           	jsonHighlights.markers[markerID].position = [{
            	"line": startLine,  
                "ch" : startCh
                },{
                        "line": endLine, 
                        "ch" : endCh
                    },0] ;  //0 helps us to identify that the marker is an XML textmarker
                
                    jsonHighlights.markers[markerID].textMarker =  editor.markText({
                        "line": startLine,  
                        "ch" : startCh
                    },{
                        "line": endLine, 
                        "ch" : endCh
                    } ,  {"className" :"marked-initial"}) ;
                } 
                if(jsonHighlights.markers[markerID].type == undefined){
                    jsonHighlights.markers[markerID].type ={} 
                }
                
                if(jsonHighlights.markers[markerID].type[type] == undefined){
                   
                    jsonHighlights.markers[markerID].type[type] = {
                        "comments" : [] ,
                        "user" : currentUser  , 
                        "timeStamp" : new Date().getTime()
                    } 
                }
				
				TEI_EDITOR.new_comment_markerID=markerID;
                jsonHighlights.markers[markerID].type[type].comments.push( [new Date().getTime() ,currentUser , "x", $("#step-comment-form textarea").val()])
            	// test. add count of markers to "how Marker" Button and marker dropdown list
             	//saveComment();
				updateTempTextArea();
                $("#step-form").html("Comment Added");
				editor.setSelection({"line": 0, "ch": 0});
				currMarker =jsonHighlights.markers[markerID];
		}
		
		if(rect && (highlighted_di == false) && drawn ==true)
		{	
			var markerID =   rect.x + "-" + rect.y + "-" + rect.w + "-" + rect.h   ;
        
                if(jsonHighlights.markers[markerID] == undefined){
                   
                    jsonHighlights.markers[markerID] = {};
                      
                    jsonHighlights.markers[markerID].position = [{
                        "x" : rect.x,  
                        "y" : rect.y
                    },{
                        "w" : rect.w, 
                        "h" : rect.h
                    },1,curr_im] ; //1 helps us to identify that the marker is an Image marker
                
                    jsonHighlights.markers[markerID].textMarker = "Image";
				}
				
                if(jsonHighlights.markers[markerID].type == undefined){
                    jsonHighlights.markers[markerID].type ={};
                }
                
                if(jsonHighlights.markers[markerID].type[type] == undefined){
                   
                    jsonHighlights.markers[markerID].type[type] = {}
                    jsonHighlights.markers[markerID].type[type] = {
                        "comments" : [] ,
                        "user" : currentUser  , 
                        "timeStamp" : new Date().getTime()
                    } 
                }
                jsonHighlights.markers[markerID].type[type].comments.push( [new Date().getTime() ,currentUser , "x", $("#step-comment-form textarea").val()])
					
                // test. add count of markers to "how Marker" Button and marker dropdown list
                //showMarkersCount()
              	
                //saveComment();
				updateTempTextArea();
                $("#step-form").html("Comment Added");
				currMarker =jsonHighlights.markers[markerID];
		}
		
		if(window.isFromRowSelection){
			var markerID = $('.selected-marker tr').data('rowData')[0];
			var type = $('#step-highlights-select').val();
			jsonHighlights.markers[markerID].type[type].comments.push( [new Date().getTime() ,currentUser , "x", $(".add-comment-to-existing-highlight-dialog textarea").val()])
			// test. add count of markers to "how Marker" Button and marker dropdown list
			//saveComment();
			updateTempTextArea();
			$("#step-form").html("Comment Added");
			editor.setSelection({"line": 0, "ch": 0});
			currMarker =jsonHighlights.markers[markerID];
			
		} 
		
		showMarkersCount();
		hideMarkers();
		showCurrMarker(currMarker);
}

function showCurrMarker(currMarker){
	var firstType ;
	for (type in currMarker.type) {
		firstType = type ;// this is the first type. 
		continue ; // we just need the first type
	}
	if(currMarker.position[2] == 0) {
		var  idOfFirstType = jsonHighlights.arrIdsAndColors[firstType][1];
		var x = editor.markText(currMarker.position[0],currMarker.position[1] , {"className" :"step-marker-color-"+idOfFirstType});
		currMarker.textMarker = x;
	}
	else if(currMarker.position[2] == 1) {			
			var  clr = jsonHighlights.arrIdsAndColors[firstType][0];
			var rgb =  hex2rgb(clr);
			ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] +', ' + rgb[2] + ', 0.3)';
			ctx.lineWidth = '5';
			ctx.fillRect(currMarker.position[0].x, currMarker.position[0].y, currMarker.position[1].w, currMarker.position[1].h);
			drawn = true; 
			rect.x = currMarker.position[0].x;
			rect.y = currMarker.position[0].y;
			rect.w = currMarker.position[1].w;
			rect.h = currMarker.position[1].h;
			resetCanvas(drawn);
			
	}
	
}