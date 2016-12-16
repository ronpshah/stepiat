//  Fill attributes and elements tables and attach event listeners

// Fill attribute table
function fillAttTable( arrAllowedAttributes  ,elementX , insideOpen , isXMLValid ,cursorposition ,currentToken) {
 
    //initilaze and reset variables
    //arrOpenTagTokens will hold open tag tokens and position for each token
    var arrOpenTagTokens=[];
    AttrsPositions = [];
    var poOpen;
    var po;
    
    if(insideOpen && isXMLValid && currentToken.state.type != "closeTag")
    {
        // cursor is inside an open tag. we need the find the position of the open tag . <xml 
        poOpen   = getPositionOfOpenTag(cursorposition) ;
 
        // we have the position of the open tag.(we know the starting point) which is "<".
        // we need to tokenize this open tag.
        // we call  tokenizeOpenTag(). tokenizeOpenTag() requires a starting position. 
        arrOpenTagTokens = tokenizeOpenTag( {
            line:poOpen.lineNumber , 
            ch: poOpen.start +1
        }); 
            
        //  position Of end tag ">"   is the last element of   arrOpenTagTokens
        positionOfEndTag   = arrOpenTagTokens[arrOpenTagTokens.length-1][1]; 
        
       
        // create and show tblAttributes 
        //  arrAttrsFromXML will hold attributes and values from XML
        //   arrAttrsFromXML has this form ["attributeName1","attributeValue1","attributeName2","attributeValue2",]  
        arrAttrsFromXML =[]; // reset
        // build an array of attributes and values . 
        // We dont need the first and last elements in arrOpenTagTokens. 
        // the first and last elements in arrOpenTagTokens are : "<tagName " and ">" 
        // that's why we start the loop from 1 and end at arrOpenTagTokens.length -1'

        for ( var i =1 , len =arrOpenTagTokens.length -1;i<(len );i++)
        {
            arrAttrsFromXML.push(arrOpenTagTokens[i][0])
        }
        // Now arrAttrsFromXML is populated with attributes and values
        // we take arrAllowedAttributes and add attributes values from arrAttrsFromXML
        try{
            
            for ( i = 0 ,l = arrAttrsFromXML.length; i<l;i=i+2)
            {
                for (j in  arrAllowedAttributes)
                {  
                    if (arrAllowedAttributes[j][0] == arrAttrsFromXML[i] && arrAllowedAttributes[j][2]== "default")
                    {
                        arrAllowedAttributes[j][1] = arrAttrsFromXML[i+1].substr(1).slice(0,-1)  ;   //.substr(1).slice(0,-1) removes " " (quotation) . 
                        break;
                    }
                }
            }
        }
        
        catch(e){
            console.log(e.stack)
        }
        // create table ,
        createAttributeTable(elementX, poOpen ,arrAllowedAttributes);
        arrAttrsFromXML =[]
        arrOpenTagTokens =[]
       
    }
  
}
  




function createAttributeTable( e, poOpen , arrAllowedAttributes){
  
    // I tried to to create tables when the Document is ready and then use the 
    // update function (see dataTables api)to update tables, but for some reason , it did not work.
    // so, I removed and recreated the table with each cursor change event
	$('#step-div-attrs:first-child').remove();
    $('#step-div-attrs').html("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"display\" id=\"step-tbl-attrs\"></table>");
	$('.attributes-tab-header .element-name').html(e);
	
    attTable = $('#step-tbl-attrs').dataTable( {
        "aaSorting":   jsonConfig.tblAttributes.sort ,//sort first column ascending
        "aaData": arrAllowedAttributes,  // "aaData" is array of data
        "bScrollInfinite":   jsonConfig.tblAttributes.ScrollInfinite ,  // allow scroll
        "sScrollY":   jsonConfig.tblAttributes.scrollheight, 
        "bFilter": jsonConfig.tblAttributes.filter,    
        "aoColumns": [
        {
            // first column
            "sTitle": "Attribute",
            "sClass" : "attCol"
        },// 
        { //secound column
            "sTitle": "Value" , 
            "sClass" : "editableCol" // give second column class 'editableCol' then assign "editable" function  to "editableCol"
        },
        ],
        // process data before rendering cells
        "fnCreatedRow": function( nRow, aData, iDataIndex ) {

            // we switch on aData[2] which is a key used to distingush different value types (default|comboBox|)
            // regEx cell type will be added in the future.
            
            switch(aData[2])
            { 
                // if aData[2] == "comboBox" , create a combobox html and set the cell to uneditable
                case "comboBox":
                {    
                    // does aData[0](attribute) exist in CM-XML? . in other words, do we have "myAttr" <xml myAttr="attVal"> in xml?
                    // if so, grab "attVal" and push to aData where arrAttrsFromXML[x] == "myAttr"
                    // 
                    var existingAttValue = "";
                    for (var i = 0 , len = arrAttrsFromXML.length; i<len; i=i+2)
                    {
                        if  (arrAttrsFromXML[i]==aData[0]){
                            existingAttValue=arrAttrsFromXML[i+1];
                            break;
                        }             
                    }
                    // create comboBox 
                    var arrHtml =   ['<select><option value="">'];
                    for ( x in aData[1]){
                        arrHtml.push(  '<option ')
                        // if comboBox option exists in XML, add 'selected="selected"' so this value is selected by default
                        if (aData[1][x] == existingAttValue.substr(1).slice(0,-1)) {   
                            arrHtml.push( 'selected="selected"' )
                        }
                        arrHtml.push( 'value="' + aData[1][x] + '">' + aData[1][x] + '</option>')
                    }
                    arrHtml.push ('</select>' );
                    $('.editableCol', nRow).html( arrHtml.join("") ); // join and set arrHtml as html inside this cell
                    $('.editableCol', nRow).editable('disable') // disable editable for selextBox cells
                    break; 
                } 
                // render cell as is
                default:{
                    }
            }
        }, 
                     
        // 
        "fnDrawCallback": function () {
            $('#step-tbl-attrs tbody td.editableCol').editable( function(value) {
                return(value);
            } ,
			{
                "placeholder" : "Click To Edit" // show empty cell if attribute value does not exist. (Override default msg "Click here to Edit")
            });
        },
          
     
        "oLanguage": {
            "sEmptyTable": "No Available Elements" // message in case of an empty tables
            ,
            //  this is the msg that appears below the table . _START_ , _END_ , _TOTAL_ are replace with values (this is done with in dataTables)
            sInfo: "Showing _START_ to _END_ of _TOTAL_ Attributes" 
        }
    });
        
        
     
    $('#step-tbl-attrs tr').click(function(e) {
        var aPos = attTable.fnGetPosition( this );
        // Get  row index. this will be used when user dblclick entities table
        rowPosition = aPos[0];
    });
    
    
    
    
         
    $('#step-tbl-attrs').click(function(e) {
        $(".item-documentation").html("<b> "+(e.target.textContent) +"</b>: "+ getAttributesDocumentations( rngSchema.hashAttrs[e.target.textContent]))
    });

                     
    $('#step-tbl-attrs').change(function(e ) {

        var newAttr = ($([e.target]).closest("tr").children("td")[0].innerHTML);
        var newAttrValue = $([e.target]).val();
        
        // update attributes in Codemirror
        updateAttribute(newAttr,newAttrValue,poOpen);
      
    });
        
         
}

function createElementsTable(e, arrAllowedChildElements) {
    // this removes the existing table and then create a new table.
    $("#step-div-elem").html("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"display\" id=\"step-tbl-elem\"></table>");
   
    $("#step-tbl-elem").dataTable({
        "aaSorting": jsonConfig.tblElements.sort,
        "bFilter": jsonConfig.tblElements.filter,
        "aaData": arrAllowedChildElements,
        "bScrollInfinite": true,
        "sScrollY": jsonConfig.tblElements.scrollheight, 
        "aoColumns": [{"sTitle": e}], // e is the name of the element
        "oLanguage": jsonConfig.tblElements.oLanguage
    });
     
    // Click inside step-tbl-elem // Show documentation for the target element     
    $('#step-tbl-elem ').click( function(e) {
        $(".item-documentation").html("&lt;<b> " + (e.target.textContent) +"</b>&gt;: " + getElemDocumentations(schemaX.HashNS["http://www.tei-c.org/ns/1.0"][e.target.textContent]));    
    }),
        
    $('#step-tbl-elem ').dblclick( function(e) {
        // if cell is not empty
        if (e.target.textContent !=  jsonConfig.tblElements.oLanguage.sEmptyTable){
           
            // get position of  selection
            var startCh = editor.getCursor("start").ch
            var startLine = editor.getCursor("start").line
            var endCh = editor.getCursor("end").ch
            var endLine = editor.getCursor("end").line

//*********************************************
	 var isSelection = editor.somethingSelected();
	 if (!isSelection){
		 var arrReq =["<"+(e.target.textContent)+">"]
		 arrReq.push("</"+(e.target.textContent)+">")
		 editor.replaceRange( arrReq.join(""),
							{
								line:startLine ,
								ch: startCh
							},
							{
								line:startLine ,
								ch: startCh
							});
		 editor.setCursor(startLine  ,startCh+ e.target.textContent.length +1 )
		 editor.focus();
	 }
//********************
	else {
				// add the open tag to the start of the selection. 
				editor.replaceRange("<"+(e.target.textContent)+">",
									{
										line:startLine ,
										ch: startCh
									}, 
									{
										line:startLine ,
										ch: startCh
									});
				// add the closing tag to the end of the selection.
				//  We need to add the length of the new tag and we also need to add  +2 (for < and >)characters .
				// We add the length of the new tag + 2 to the character position for the end of the selection. 
				editor.replaceRange("</"+(e.target.textContent)+">",
									{
										line:endLine ,
										ch: endCh +e.target.textContent.length +2
									}, {
										line:endLine ,
										ch: endCh +e.target.textContent.length +2
									});
			 
				// set cursor inside the newly inserted tag
				editor.setCursor(startLine  ,startCh+ e.target.textContent.length +1 )
				editor.focus();
			
			
			}       }      
    }); 
}
 
function createEntitiesTbl(createOptions){
	// create Entities table.  
    $('#step-tbl-entites').remove();
	$('#step-tbl-entites_wrapper').remove();
	$('#step-div-entities').append( $('<table  cellpadding="0" cellspacing="0" border="0" class="display" id="step-tbl-entites"></table>') );

	var jsonEntities ={}
	
	var arrJson = $('#step-div-entities').data('arrJson');
	if(!arrJson)
	{
		arrJson =[];
		$.ajax({
				async: false, 
				url: sitePath + "/step-entities",			
				dataType: 'json',
				success: function(data){
					jsonEntities =data
					for (x in data.entities)
					{
						var ent = data.entities[x].entity
						arrJson.push([ ent.title, ent.Value,ent.Category])
					}
				}
		});
		
		
		var allCategories = {}
		$.each(arrJson,function(entityIndex, entityDetails){
			var entityCategoryStr = entityDetails[2];
			if(!entityCategoryStr){
				entityCategoryStr='Misc';
			}
			entityCategoryArr = entityCategoryStr.split(',');
			
			$.each(entityCategoryArr,function(catIndex, category){
				var categoryName = $.trim(category);
				
				//If a categoryName does not already exist,
				//create a new category
				if(!allCategories[categoryName]){
					allCategories[categoryName]=[];
				}
				allCategories[categoryName].push(entityIndex);
				
			});
			
			
		});
		
		
		//Save the categories as a data attribute on the parent of the table
		//We need to store it on the parent because in order to refresh the categories
		//data tables needs to be destroyed/removed and recreated for the new data
		//because datatables does not allow its underlying data to be modified at runtime.
		 $('#step-div-entities').data('allCategories',allCategories);
		 
		 //Also save the entire data for the entities on the parent element
		 //for future processing
		 $('#step-div-entities').data('arrJson',arrJson);
	}else{
		var categoryInfo = $('#step-div-entities').data('allCategories');
		var originalJson = $('#step-div-entities').data('arrJson');
		
		if(createOptions){
			
			if(createOptions.selectedCategory==='All'){
				arrJson = originalJson;
			}
			else{
				arrJson = []
				$.each(categoryInfo[createOptions.selectedCategory],function(index, element){
					arrJson.push(originalJson[element]);
				});
			}
			
		}
	}
	
	
	
	
	
	
	
        // convert entities from json to an array
       entityTable = $('#step-tbl-entites').dataTable( {
            "aaData": arrJson,  // "aaData" is array of data
            "bScrollInfinite": jsonConfig.tblEntities.ScrollInfinite,  
            "sScrollY": '280px',
            "aaSorting":jsonConfig.tblEntities.sort,
            "bFilter": jsonConfig.tblEntities.filter,
           
            "sDom":jsonConfig.tblEntities.sDom, 
            "aoColumns": [ 
            //column 1
            {
                "sTitle": "Title" ,
	            "sClass" : "entity-title"
            },
            //column  2 
            //{
            //    "sTitle": "Visual" ,
			//	"bVisible":    false
				
            //}, 
            //column 3 to hold the value of entities. column 3 is hidden
            {
                "sTitle": "Value" ,
	            "sClass" : "entity-value"
            },
            ]     
        })

	
	 	
	 
    
        $('#step-tbl-entites td').dblclick(function(e ) {
            var aPos = entityTable.fnGetPosition( this );
            // Get the data array for this row
            var aData = entityTable.fnGetData( aPos[0] );
            var  curposition = editor.getCursor();
            editor.replaceRange(   aData[1] ,  curposition,  curposition);
            editor.setCursor(curposition.line   ,curposition.ch+ aData[1].length )
            editor.focus();
              
    });



}

// Function to create mare
 
function createMarkersTbl(arrmarkers){
    
     
    $('#step-markers-table').html( '<table  cellpadding="0" cellspacing="0" border="0" class="display" id="step-tbl-markers"></table>' ); 
    var  markersTable = $('#step-tbl-markers').dataTable( {
        "aaData": arrmarkers,  // "aaData" is array of data
		"bScrollInfinite": true,//jsonConfig.tblMarkers.ScrollInfinite ,
        "sScrollY": '315px',//jsonConfig.tblMarkers.scrollheight,
        "aaSorting":jsonConfig.tblMarkers.sort,
        "bFilter": jsonConfig.tblMarkers.filter ,
          
        "aoColumns": [
        //column 1
        {
            "sTitle": "marker" ,//,  
            "bVisible":    false 
        },
        //column  2 
        {
            "sTitle": "Date" ,
            "sClass" : "formattedTime" ,
			"sWidth":'50px'
        },
        {
            "sTitle": "User",
			"sWidth":'50px'
        }, 
         
        {
            "sTitle": "Lemma" //,     
        },
        {
            "sTitle": "Delete" ,  
            "sClass" : "delete-marker" ,
			"sWidth":'15px'
        },
      
        ] ,
        "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            // format unix time to human readable time.
            var newDate = new Date();
            newDate.setTime(aData[1] );
			$(nRow).data('rowData',aData);
           	var dateString = newDate.toDateString();
			dateString = newDate.getMonth()+1+'/'+newDate.getDate()+'/'+newDate.getFullYear();
            $('.formattedTime', nRow).html(dateString);
            
            // This is the delete button. the class delete-comment-btn is used somewhere else, do not change it
            var btnDelete ='<span class="delete-marker-btn">Delete</span>'
            $('.delete-marker', nRow).html(btnDelete);
        }
         
    });



// on click handler for Markers table
    $('#step-tbl-markers tr').click(function(e ) {
        
		var $this = $(this);
		
		var  className = e.target.getAttribute('class');
        var aPos = markersTable.fnGetPosition( this );
        
		
		var $target=$(e.target);
		//Create a clone of the current row and insert
		//it into the markers toolbar temporary table
		if (!$target.hasClass("delete-marker-btn")){
			
			$('.step-markers-container .toolbar').removeClass('hidden');
			$('#step-markers-table').addClass('hidden');
			
			//Create a deep copy - of the data on the current row. We dont need to copy the event listeners if any.
			var $currentRow = $this.clone(true,false);
			
			$currentRow.children('.delete-marker').remove();
			$('.step-markers-container .selected-marker table').children().remove().end().append($currentRow);
			$('#step-markers-comments').show();
		}
		
        // Get the data array for this row
        var aData = markersTable.fnGetData( aPos );
    
     	// if user click on the delete button
        if ($target.hasClass("delete-marker-btn"))
        {
           
			var $confirmDialog=$('body .confirm-delete-marker-dialog');
			
			if($confirmDialog.size()==0){
				$confirmDialog = $('<div title="Comfirm Delete" style="text-align:center;">Deleting A marker will delete all its associated comments as well. <br/></br>Are you sure you want to delete this marker?</div>');
			
				$('body').append($confirmDialog);
				$confirmDialog.dialog({
					resizable: false,
					modal: true,
					buttons: {
						"Yes": function() {
				
							hideMarkers(); 
					   
							var type=  $("#step-highlights-select").val()
							delete  jsonHighlights.markers[aData[0]].type[type] ;
					 
							// if there are no types for this marker, we delete the marker
					 
							var noMoreTypes = true
							
					
							for (x in jsonHighlights.markers[aData[0]].type){
								noMoreTypes = false
							}
					 
							if (noMoreTypes){
								delete  jsonHighlights.markers[aData[0]]
							}
						   
							createMarkersTbl(jsonHighlights.getMarkers())
							copyArrayToMarker();
							$('#step-tbl-comments').hide()
							 showMarkersCount();
							 updateTempTextArea();
				
				
							$confirmDialog.dialog('close');
						},
						"Cancel": function() {
							$confirmDialog.dialog('close');
						}
					}
				});
			}
			else{
				
				$confirmDialog.dialog('open');
			}
        } 
      
        else{
            // copy marker object to array or we update position for entire markers
           if(jsonHighlights.markers[aData[0]].position[2] == 0)
		   {
				//  show only this marker
				jsonHighlights.markers[aData[0]].textMarker.clear()
	  			var curMarker = jsonHighlights.markers[aData[0]]
				// disabled because it is buggy.
				// scroll to position in CM
				// get y for the start of the marker, then use scroll to it . function scrollIntoView does not work
				// pass the position of marker to get its y coor
			   var coorY = editor.charCoords(curMarker.position[0]).y
				
				// scroll to starting position
			   	editor.scrollIntoView(curMarker.position[0])
				// get the id for this marker based on the selection. then use the id to create a css class
				var css = "step-marker-color-"+ jsonHighlights.arrIdsAndColors[$("#step-highlights-select").val()][1]
				var m = editor.markText(curMarker.position[0],curMarker.position[1] ,{"className" : css});
				curMarker.textMarker = m
		   }
		   else
		   {
			   var curMarker = jsonHighlights.markers[aData[0]];
			   for (type in curMarker.type)
				{	
					firstType = type ;// this is the first type. 
					continue ; // we just need the first type
				}
			   var clr = jsonHighlights.arrIdsAndColors[firstType][0]; 
			   var rgb =  hex2rgb(clr);
			   ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] +', ' + rgb[2] + ', 0.3)';
			   ctx.lineWidth = '5';
			   
			   if(imageObj.src != curMarker.position[3]) {
					imageObj.src = curMarker.position[3];
					$('#progressBar').show();
					imageObj.onload = function() {
						$('#progressBar').hide();
    					ctx.drawImage(imageObj, 0, 0,canvasWidth,canvasHeight);
						ctx.fillRect(curMarker.position[0].x,curMarker.position[0].y,curMarker.position[1].w,curMarker.position[1].h);
						drawn = true;
						rect.x = curMarker.position[0].x;
						rect.y = curMarker.position[0].y;
						rect.w = curMarker.position[1].w;
						rect.h = curMarker.position[1].h;
						resetCanvas(drawn);
					}
				}
				else {
					    ctx.drawImage(imageObj, 0, 0,canvasWidth,canvasHeight);
						ctx.fillRect(curMarker.position[0].x,curMarker.position[0].y,curMarker.position[1].w,curMarker.position[1].h);
						drawn = true;
						rect.x = curMarker.position[0].x;
						rect.y = curMarker.position[0].y;
						rect.w = curMarker.position[1].w;
						rect.h = curMarker.position[1].h;
						resetCanvas(drawn);
				}
				
		   }
           createCommentsTbl(aData[0])   
            
        }
    })
}
 
function createCommentsTbl(curMarker){
    // get comments for current Marker
    var arrComments = jsonHighlights.getComments(curMarker);
    { 
        // create markers tables
        $('#step-markers-comments').html( '<table  cellpadding="0" cellspacing="0" border="0" class="display" id="step-tbl-comments"></table>' ); 
  
        var commentsTable = $('#step-tbl-comments').dataTable( {
            "aaData": arrComments,  // "aaData" is array of data
            "bScrollInfinite": true ,
            "sScrollY": '315',//jsonConfig.tblEntities.scrollheight,
            "bFilter": true ,
			"aaSorting": [[ 0, "desc" ],[1,"asc"]],
          
            "aoColumns": [ 
            //column 1
            {
                "sTitle": "Time" ,
                "sClass" : "formattedTime" 
            }, 
            //column  2 
            {
                "sTitle": "User",
				"sClass":"user"
            },
			{
                "sTitle": "Delete" ,
                "sClass" : "comment-options"
            },
            {
                "sTitle": "comment" ,//,
				"sClass":"user-comment editableCol"
            }
        	,
            ] ,
			"fnDrawCallback": function () {
				$('#step-markers-comments tbody td.editableCol').on("click.editable", function() {
					var $this = $(this);
					var iDataIndex = $(this).parents('tr').data('iDataIndex');
					$(this).editable(
						function(value) {
							
							var type=  $("#step-highlights-select").val();
							jsonHighlights.markers[curMarker].type[type].comments[iDataIndex][0]=new Date().getTime();
							jsonHighlights.markers[curMarker].type[type].comments[iDataIndex][3]=value;
							updateTempTextArea();
							
							return(value);
						},
						{
							"placeholder" : "Click To Edit", // show empty cell if attribute value does not exist. (Override default msg "Click here to Edit")
							type      : 'textarea',
							cancel    : 'Cancel',
				        	submit    : 'OK',
						 	onblur :'ignore',
							event : 'editableEvent'
						});						
						$(this).trigger("editableEvent");						
				});
			},
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                //format unix time to human readable time.
				
				//Save the index of the current row on the row itself.
				//This will later be retrieved to identify the comment.
				$(nRow).data('iDataIndex',iDataIndex);
            
                var newDate = new Date();
                newDate.setTime(aData[0] );
                dateString = newDate.getMonth()+1+'/'+newDate.getDate()+'/'+newDate.getFullYear();
                $('.formattedTime', nRow).html(dateString);
          
		  		
				var btnDone ='<span class="save-changes-btn actions edit-grp hidden">Done</span>';
				var btnCancel ='<span class="cancel-changes-btn actions edit-grp hidden">Cancel</span>';
		  		var btnEdit ='<span class="edit-comment-btn actions manage-grp">Edit</span>';
				var btnDelete ='<span class="delete-comment-btn actions manage-grp">Delete</span>';
				
				$('.comment-options', nRow).empty();
	            $('.comment-options', nRow).append(btnDone);
				$('.comment-options', nRow).append(btnCancel);
				$('.comment-options', nRow).append(btnEdit);
				$('.comment-options', nRow).append(btnDelete);
				
            } 
        })
        
        
        // show markers table
        $('#step-markers-comments').show();
		
		var $sortingOptions = $('<label for="sortingSelect" class="sorting-options">'+
			'	<span>Sort By<span>'+
			'	<select name="sortingSelect">'+
			'	  <option value="date">Date</option>'+
			'	  <option value="user">User</option>'+
			'	</select>'+
			'</label>');
			
		$('#step-tbl-comments_filter').append($sortingOptions);
		
		$('.sorting-options select').on('change.test',function(event){

			if($('option:selected',this).val()==='date'){
				
				var oTable = $('#example').dataTable();
		   
				// Sort immediately with columns 0 and 1
				commentsTable.fnSort( [[ 0, "desc" ]] );
		  
				};
			
			if($('option:selected',this).val()==='user'){
				commentsTable.fnSort( [[1,"asc"],[0,"desc"]] );
			};
			
		});
    }
    
    $('#step-tbl-comments tr').click(function(e ) {
        var aPos = commentsTable.fnGetPosition( this );
		
		var $target = $(e.target);
        // Get the data array for this row
        var aData = commentsTable.fnGetData( aPos );
        var type=  $("#step-highlights-select").val();
        var  className = e.target.getAttribute('class');
		if($target.hasClass('delete-comment-btn'))
        {
			
			var $confirmDialog=$('body .confirm-delete-comment-dialog');
			
			if($confirmDialog.size()==0){
				$confirmDialog = $('<div title="Comfirm Delete" style="text-align:center;">Are you sure you want to delete this comment?</div>');
			
				$('body').append($confirmDialog);
				$confirmDialog.dialog({
					resizable: false,
					modal: true,
					buttons: {
						"Yes": function() {
							jsonHighlights.markers[curMarker].type[type].comments.splice(aPos , 1);
							
							//Recreate the comments table for the specific marker after you delete any comment
							createCommentsTbl(curMarker);
							updateTempTextArea();
							$confirmDialog.dialog('close');
						},
						"Cancel": function() {
							$confirmDialog.dialog('close');
						}
					}
				});
			}
			else{
				
				$confirmDialog.dialog('open');
			}			
        }
    });
}