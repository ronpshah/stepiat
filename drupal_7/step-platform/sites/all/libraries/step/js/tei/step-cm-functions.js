// test
// Reset Tables and Documentations Divs
function resetAll() {
    $(".CodeMirror-completions").remove();
    $("#elementsDIVWrapper").hide();
    $("#attributesDIVWrapper").hide();
    $("#entitiesDIVWrapper").hide();
    $("#step-div-elem #all-elements").html("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"display\" id=\"step-tbl-elem\"></table>");
    $("#step-div-attrs").html("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"display\" id=\"step-tbl-attrs\"></table>");
}
// This function updates attributes and values in code mirror
// it accepts and attribute string, value string and the position of the open tag . <xml a="v"
function updateAttribute(attr, val, poOpen) {
    var newAttr = attr;
    var newAttrValue = val;
    var arrOpenTagTokens = [];
    AttrsPositions = [];
    var pos = {
        line: poOpen.lineNumber,
        ch: poOpen.start
    };
    // create an array of attributes and value and positions for the entire open tag . <xml a="c" b="x">
    arrOpenTagTokens = tokenizeOpenTag(pos);
    // insert into Codemirror editor as long there is a value for the attribute
    // refine arrOpenTagTokens . create an array of attributes and values.
    for (var i = 1, len = arrOpenTagTokens.length - 1; i < (len); i++) {
        arrAttrsFromXML.push(arrOpenTagTokens[i][0]);
    }
    var doesNewAttrExistInXML = false;
    // check to see if new attribute already exists in XML
    for (i = 0, l = arrAttrsFromXML.length; i < l; i = i + 2) {
        // if attribute is already in this open tag. set doesNewAttrExistInXML to true
        if (arrAttrsFromXML[i] == newAttr) {
            doesNewAttrExistInXML = true;
            break;
        }
    }
    // insert into Codemirror editor
    // attribute exists in this open tag. so we only replace the value. 
    if (doesNewAttrExistInXML) {
        for (i = 0, l = arrOpenTagTokens.length; i < l; i++) {
            // if new attribute value already exist in XML.
            if (newAttr == arrOpenTagTokens[i][0]) {
                // find the position of the attribute and replace its value. 
                var ln = arrOpenTagTokens[i + 1][1].line;
                var startCh = arrOpenTagTokens[i + 1][1].ch;
                var endCh = editor.getTokenAt({
                    line: arrOpenTagTokens[i + 1][1].line,
                    ch: arrOpenTagTokens[i + 1][1].ch
                }).end;
                editor.replaceRange(newAttrValue + '"', {
                    line: ln,
                    ch: startCh
                }, {
                    line: ln,
                    ch: endCh
                });
                break;
            }
        }
    }
    // attribute does not exist, so we need to insert attribute and value.
    else {
        // this inserts new attributes and values to CodeMirror
        var strAttrandValue = ' ' + newAttr + '="' + newAttrValue + '"'; // the result looks like this .  ' newAttr="newAttrValue"''
        // we need the position of last token in this open tag. we get it from arrOpenTagTokens and then we insert strAttrandValue
        var insertPos = arrOpenTagTokens[arrOpenTagTokens.length - 1][1]; // this givs us the position of ">"
        insertPos.ch = insertPos.ch - 1; // we move 1 charecter backward. that is 1 charecter left of ">"
        editor.replaceRange(strAttrandValue, insertPos, insertPos);
        // we need to update attrsFromXML.     
    }
}
//this function returns the position of the openTag "<xxxx a="xx" >"
// it reads characters one by one backward until "<" is found
function getPositionOfOpenTag(cursorPosition) {
    var ch = '';
    // in case cursor is on ch 0 , we need to go one line up and start from the end of that line
    if (cursorPosition.ch == 0) {
        var lineLength = editor.getLine(cursorPosition.line - 1).length;
        startPos = {
            ch: lineLength - 1,
            line: cursorPosition.line - 1
        }
        endPos = {
            ch: lineLength,
            line: cursorPosition.line - 1
        }
    } else {
        startPos = {
            ch: cursorPosition.ch - 1,
            line: cursorPosition.line
        }
        endPos = {
            ch: cursorPosition.ch,
            line: cursorPosition.line
        }
    }
    ch = editor.getRange(startPos, endPos);
    // move backward until "<" is found
    while (ch != "<") {
        if (startPos.ch == 0 || editor.getLine(endPos.line).length == 0) {
            startPos.line = startPos.line - 1;
            endPos.line = endPos.line - 1; // add line
            startPos.ch = (editor.lineInfo(endPos.line).text).length - 1; //  we could use editor.getLine(endPos.line).length -1 , 
            endPos.ch = (editor.lineInfo(endPos.line).text).length;
            continue;
        }
        // move 1 line up,( subtract 1 line)
        startPos.ch = startPos.ch - 1;
        endPos.ch = endPos.ch - 1;
        ch = editor.getRange(startPos, endPos);
    }
    var token = editor.getTokenAt(endPos);
    token.lineNumber = endPos.line;
    return token;
}
// function to create an array of attributes and value.
// This function accepts a start position "{line, ch}""
// it accepts the position of open tag , <XXX . then it parses tokens until ">" is found
function tokenizeOpenTag(startPosition) {
    var lineLength = (editor.lineInfo(startPosition.line).text).length;
    var anyToken = editor.getTokenAt(startPosition).string;
    // if AttrsPositions.length is more than 0, we exit. 
    // but if we have ">" and an empty array, this means ">" is for <tag1> , so we move to the next token to the right which is <tag2>. 
    // if token is ">" or "/>" we push it and its  position to AttrsPositions array and then we exit.
    if ((anyToken == (">") || anyToken == ("/>")) && AttrsPositions.length > 0) {
        AttrsPositions.push([anyToken, startPosition]);
        return AttrsPositions;
    }
    // this is the token from a previous element. 
    if ((anyToken == (">") || anyToken == ("/>")) && AttrsPositions.length == 0) {
        var position = {
            line: startPosition.line,
            ch: editor.getTokenAt(startPosition).end + 1
        };
        return tokenizeOpenTag(position);
    }
    // we want to create an array that has this format: ["attribute1", ""value1"", "attribute2", ""value2""] 
    // add only attributes and values. not "=" .
    if (anyToken.trim().length > 0 && anyToken != "=") {
        AttrsPositions.push([anyToken, startPosition]);
    }
    position = {
        line: startPosition.line,
        ch: editor.getTokenAt(startPosition).end + 1
    };
    if (lineLength == editor.getTokenAt(startPosition).end) {
        position.line += 1;
        position.ch = 0;
    }
    return tokenizeOpenTag(position);
}
// create css select box and apply css
// THis CSS is used for TEI XML documnets
function applyCSS() {
	var cssHeight = ($(window).height() * 95 / 100) - 70;
    $("#dialog").html("<div style=\"overflow:auto; height:" + cssHeight + "px; width:80%; min-width:300px;\" id=\"XMLfromCM\"></div><div style=\"overflow:auto; height:350px; width:18%; min-width:120px;\" id=\"CSSTitlesMenu\"></div>");
    $.getJSON(rootPath + 'css.json', function (data) {
        var menuItems = [];
        menuItems.push('<ul id="CSSmenu">');
        for (x in data.nodes) {
            menuItems.push('<li>' + data.nodes[x].node.title + '</li> ');
        }
        menuItems.push('</ul>');
        $('#CSSTitlesMenu').html(menuItems.join(""))
        $("#CSSmenu li").click(function () {
            $("#CSSForXML").empty();
            for (x in data.nodes) {
                if (this.innerHTML == data.nodes[x].node.title) {
                    $("#CSSForXML").html(data.nodes[x].node.field_step_tei_css);
                }
            }
        });
    });
    $("#XMLfromCM").html(editor.getValue());
    $("#dialog").dialog('open');
}
$(document).click(function(e) {
    {
        function isInsideWrapper(elem) {
            if (elem == null) return false
            if (elem.getAttribute("id") == "wrapper") {
                return true;
            } else {
                return isInsideWrapper((elem.parentElement));
            }
        }
        if (isInsideWrapper((e.target))) {
            $("#container").show()
        } else {
            $("#container").hide()
        }
    }
});

//This function returns an object that holds tag name and location (inside open tag or outside);
function getElementNameAndLocation(currentToken) {
    var elementX = ""; // name of element(Tag)
    var insideOpen = false; // inside of open tag or not
    try {
        if (currentToken.state.type == null) {
            if (currentToken.className == "attribute" || currentToken.className == "string") {
                elementX = currentToken.state.tagName;
                insideOpen = true;
            } else {
                if (currentToken.className == null) {
                    if (currentToken.state.context == null) {
                        elementX = currentToken.state.tagName;
                        insideOpen = true;
                    } else {
                        if (currentToken.string.trim() == "") {
                            elementX = currentToken.state.tagName;
                            insideOpen = true;
                        } else {
                            elementX = currentToken.state.context.tagName;
                        }
                    }
                } else {
                    elementX = currentToken.state.tagName;
                }
            }
        } else {
            if (currentToken.string == ">") {
                elementX = currentToken.state.context.tagName;
            } else {
                if (currentToken.state.type == "openTag") {
                    elementX = currentToken.state.tagName;
                    insideOpen = true;
                } else if (currentToken.state.type == "closeTag") {
                    elementX = currentToken.state.context.tagName;
                    insideOpen = false;
                } else {
                    if (currentToken.state.type == "equals") {
                        elementX = currentToken.state.tagName;
                        insideOpen = true;
                    } else {
                        elementX = currentToken.state.context.tagName;
                    }
                }
            }
        }
    } catch (e) {
        // cursor is outside of XML
        // We give elementX the value of "DefaultStartNode" , this value is manually set
        // DefaultStartNode will return the <start> node from the schema
        elementX = "DefaultStartNode";
        insideOpen = false;
    }
    if (elementX == null) {
        elementX = "DefaultStartNode";
        insideOpen = false;
    }
    return {
        name: elementX,
        insideOpen: insideOpen
    };
}

// This function displays code hint div. Autocomplete
function showElementCodeHint(CurrentToken, arrAllowedChildElements, cursorposition) {
    // we need absolute position of cursor. we use it to position the code hint div. "page" is the whole page
    var coor = editor.cursorCoords(true, "page");
    /*var myArrElems = {};
	for (x in arrAllowedChildElements) {
				var name = arrAllowedChildElements[x][0]; 	
				/*var obj = {
					name: arrAllowedChildElements[x][0],*/
				/*myArrElems[name] = {	
					count: 0
				};
	}*/
	// if user entered "<" , show hints div
    if (CurrentToken.string == "<") {
        // create a form and give it an absolute position (coor.x and coor.y) . I added small values to coor.x and coor.y so the div appears below and to the right of the cursor.
        var codeHintHTML = "<form onSubmit=\"return false\" name=\"frm\" class=\"CodeMirror-completions\" style=\"left: " + (coor.left + 4) + "px; top: " + (coor.top + 10) + "px; width: 100px;\">";
        codeHintHTML += "<input name=\"mySelect\" id=\"hintButton\"/></form>";
        
		// append the form
        $("body").append(codeHintHTML);
        
		//give focus to #hintButton
        $("#hintButton").focus();
        
		$(function () {
            // code hint takes a flat array.
            // convert arrAllowedChildElements from a multidimensional array to a flat array.
            var arrElems = [];
			
            for (x in arrAllowedChildElements) {
				/*var name = arrAllowedChildElements[x][0]; 	
				/*var obj = {
					name: arrAllowedChildElements[x][0],*/
				/*myArrElems[name] = {	
					count: 0
				};*/
                arrElems.push(arrAllowedChildElements[x][0]);
				//myArrElems.push(obj);		
            }
			console.log(arrElems);
			// Highlight the matched text - internet resource
			$.extend($.ui.autocomplete.prototype, {
				_renderItem: function(ul, item) {
					var term = this.element.val(),
						html = item.label.replace(term, "<span style='color:#3399ff;'>$&</span>"); //<b>$&</b> for bold 
					return $("<li></li>")
						.data("item.autocomplete", item)
						.append($("<a></a>").html(html))
						.appendTo(ul);
				}
			});

			var data_selected = false;
            $("#hintButton").autocomplete({
				// sort the source: arrElems 
                source: function (request, response) {
							var term = $.ui.autocomplete.escapeRegex(request.term)
								, startsWithMatcher = new RegExp("^" + term, "i")
								, startsWith = $.grep(arrElems, function(value) {
									return startsWithMatcher.test(value.label || value.value || value);
								})
								, containsMatcher = new RegExp(term, "i")
								, contains = $.grep(arrElems, function (value) {
									return $.inArray(value, startsWith) < 0 && 
										containsMatcher.test(value.label || value.value || value);
								});
							
							response(startsWith.concat(contains));
        		},
						
                select: function (e,ui) {
					data_selected = true;	/*$(this).data("selected", true);
											console.log("1: " + $(this).data("selected"));
											console.log("a: " + data_selected);	*/				
					// get the selected item from the list
					$("#hintButton").val(ui.item.value);
                    var elem = $("#hintButton").val();
                    
					// Add new string to CM
                    editor.replaceSelection(elem + "></" + elem + ">");
                    
					// set new cursor position
                    var l = cursorposition.line;
                    var ch = cursorposition.ch + elem.length;
                    editor.focus();
                    editor.setCursor({
                        line: l,
                        ch: ch
                    })
					
					/*frequentlyUsedElements[elem].count++;
					console.log(frequentlyUsedElements[elem]+" count: "+frequentlyUsedElements[elem].count)
					frequentElements();*/
                }
            }).bind("keydown", function(e) {
				var $this = $(this);
					
				if (e.which === $.ui.keyCode.ENTER || 
					e.which == $.ui.keyCode.NUMPAD_ENTER) {
						
					if (!data_selected) {
														/*console.log("2: " + $(this).data("selected"));					
														console.log("b: " + data_selected);*/					

						var data = $("#hintButton").val();
						editor.replaceSelection(data);
						var l = cursorposition.line;
						var ch = cursorposition.ch + data.length;
						editor.focus();
						editor.setCursor({
							line: l,
							ch: ch
						})
						e.preventDefault();
					}	
				} else 
					$this.data("selected", false);
					data_selected = false;
			});
			
        });
		
        $(".CodeMirror-completions").keydown(function (e) {
            if (e.keyCode == 8 && $("#hintButton").val().length < 1) {
                $(".CodeMirror-completions").remove();
                editor.replaceRange("", {
                    line: cursorposition.line,
                    ch: cursorposition.ch - 1
                }, {
                    line: cursorposition.line,
                    ch: cursorposition.ch
                })
                editor.focus();
                e.preventDefault();
            }
        })		
    }
}

// Maintain the Frequently Used Child Elements under the specific tag
function ValidFreqElements(freqElems, arrAllowedChildElements) {
	var validFreqElems = [];
	 for(elem in freqElems) {
		console.log(elem + " : " + freqElems[elem]);
	 }
	 
	 for(elem in arrAllowedChildElements) {
		 if(arrAllowedChildElements[elem][0] in freqElems) {
			 console.log("tag: " + arrAllowedChildElements[elem][0] + "    count: " + freqElems[arrAllowedChildElements[elem][0]]);
			 // collect items from tasks into a sortable array
			 validFreqElems.push({
                'tag': arrAllowedChildElements[elem][0],
                'count': freqElems[arrAllowedChildElements[elem][0]]
            });
		 }
		 	
	 }
	 
	 validFreqElems.sort(function(a, b) {
		 if (a.count > b.count)
		 	return -1;
	  	 if (a.count < b.count)
		 	return 1;
	  	 return 0;
     });
	 
	 // To retrieve only the 5 most frequently used elements
	 if(validFreqElems.length < 5) 
	 	var len = validFreqElems.length;
	 else
	 	len = 5; 
		
	 var arrFreqElem = [];		
	 for (i = 0; i < len; i++) {
		 arrFreqElem[i] = validFreqElems[i].tag;
		 console.log("list: "+ arrFreqElem[i]);
		 //console.log("list ::: "+ validFreqElems[i].tag);
	 }
	 return arrFreqElem;
}

// This function will display code hint for attributes
// This function is called if xml is invalid due to trying to insert an attribute.
// "<xml a></xml>" this is an invalid xml. user is trying to insert an attribute that starts with the letter "a"
function showAttrsCodeHint(CurrentToken, arrAllowedAttributes, cursorposition) {
    // we need to test to see if this a valid way to insert an attribute
    // if the new character is preceded with a space and ( followed by a space or ">" or "/>") , then we show code hint 
    //
    //calculate values of surounding tokens
    // Order does matter. I used cursorposition as a reference
    var nextPosition = cursorposition;
    nextPosition.ch = cursorposition.ch + 1;
    
	var nextToken = editor.getTokenAt(nextPosition); // get token .(to get the next value)
    var previousPosition = cursorposition;
    previousPosition.ch = cursorposition.ch - 2; // -2 chars because I am using cursorposition as a refrence// I am not making a copy of it.
    
	var previousToken = editor.getTokenAt(previousPosition); // get token .(to get the previous value)
    
	if (previousToken.string.trim().length == 0 && (nextToken.string.trim().length == 0 || nextToken.string == ">" || nextToken.string == "/>")) {
        if (CurrentToken.string.trim().length != 0) {
            // we use absolute positioning to display the code hint div. we get the position that is relative to the document ("page")
            var coor = editor.cursorCoords(true);
    			
			var ins = "<div onSubmit=\"return false\" name=\"frm\" class=\"CodeMirror-completions\" style=\"left: " + (coor.left + 4) + "px; top: " + (coor.top + 10) + "px; width: 100px;\">";
    		ins += "<input name=\"mySelect\" id=\"hintButton\"/></div>";
    
	        $('body').append(ins);
    
	        $("#hintButton").focus();
            $("#hintButton").val(CurrentToken.string);
    
	        $(function () {
                // code hint takes a flat array.
                // convert arrAllowedChildElements from a multidimensional array to a flat array.
                var arrElems = [];
                for (x in arrAllowedAttributes) {
                    arrElems.push(arrAllowedAttributes[x][0]);
                }
				
				// Highlight the matched text - internet resource
				$.extend($.ui.autocomplete.prototype, {
					_renderItem: function(ul, item) {
						var term = this.element.val(),
							html = item.label.replace(term, "<span style='color:#3399ff;'>$&</span>"); //<b>$&</b> for bold 
						return $("<li></li>")
							.data("item.autocomplete", item)
							.append($("<a></a>").html(html))
							.appendTo(ul);
					}
				});
				
				var data_selected = false;			
                $("#hintButton").autocomplete({
					// sort the source: arrElems 
					source: function (request, response) {
								var term = $.ui.autocomplete.escapeRegex(request.term)
									, startsWithMatcher = new RegExp("^" + term, "i")
									, startsWith = $.grep(arrElems, function(value) {
										return startsWithMatcher.test(value.label || value.value || value);
									})
									, containsMatcher = new RegExp(term, "i")
									, contains = $.grep(arrElems, function (value) {
										return $.inArray(value, startsWith) < 0 && 
											containsMatcher.test(value.label || value.value || value);
									});
								
								response(startsWith.concat(contains));
					},
                    select: function(e,ui) {
						data_selected = true;	/*$(this).data("selected", true);
												console.log("3: " + $(this).data("selected"));					
												console.log("c: " + data_selected);	*/				

						// get the selected item from the list
						$("#hintButton").val(ui.item.value);
                        var att = $("#hintButton").val();
                        
						var endPosition = jQuery.extend(true, {}, cursorposition);
                        endPosition.ch = endPosition.ch + 1;
                        
						editor.setSelection(cursorposition, endPosition);
                        editor.replaceSelection(att + '="' + '"');
                        editor.focus();
                        editor.setCursor(cursorposition.line, cursorposition.ch + att.length + 2);
                    }
                }).bind("keydown", function(e) {
					var $this = $(this);
						
					if (e.which === $.ui.keyCode.ENTER || 
						e.which == $.ui.keyCode.NUMPAD_ENTER) {
							
						if (!data_selected) {
													/*console.log("4: " + $(this).data("selected"));					
													console.log("d: " + data_selected);	*/				
															
							$(this).data("selected", true);
							var endPosition = jQuery.extend(true, {}, cursorposition);
                        	endPosition.ch = endPosition.ch + 1;
                       		editor.setSelection(cursorposition, endPosition);
							
							editor.replaceSelection(data);
							var l = cursorposition.line;
							var ch = cursorposition.ch + data.length;
							editor.focus();
							editor.setCursor({
								line: l,
								ch: ch
							})
							e.preventDefault();
						}	
					} else 
						$this.data("selected", false);
						data_selected = false;
				});
            });
            $(".CodeMirror-completions").keydown(function(e) {
                if (e.keyCode == 8 && $("#hintButton").val().length < 1) {
                    $(".CodeMirror-completions").remove();
                    editor.replaceRange("", {
                        line: cursorposition.line,
                        ch: cursorposition.ch
                    }, {
                        line: cursorposition.line,
                        ch: cursorposition.ch + 1
                    })
                    editor.focus();
                    e.preventDefault();
                }
            });
            $(".CodeMirror-completions").keyup(function(e) {
                if ($("#hintButton").val().length == 0) {
                    editor.replaceRange("", {
                        line: cursorposition.line,
                        ch: cursorposition.ch
                    }, {
                        line: cursorposition.line,
                        ch: cursorposition.ch + 1
                    })
                    editor.focus();
                    e.preventDefault();
                }
            })
        }
    }
}
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

function initXMLCSSDialog() {
    $("#dialog").dialog({
        modal: true,
        autoOpen: false,
        height: $(window).height() * 95 / 100,
        width: $(window).width() * 95 / 100,
        minWidth: 620,
        beforeClose: function (event, ui) {
            $("#dialog").empty()
            $("#CSSForXML").empty()
            return true;
        }
    });
}

// Buttons
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function getTabs(n) {
    var sp = [];
    for (var i = 0; i < n; i++) {
        sp.push(" ")
    }
    return sp.join("")
}

//beautify XML . get XML from Code Mirror, then beautify it , then insert it back into Code Mirror
function beautifyXML() {
    // disabled for now, we need to write a beautifier.
    //  copyMarkersToArray()
    //  addTags()
    var conf = confirm("Formatting will delete all highlighted regions and comments associated with them. \n\n Are You Sure?");
    if (conf) {
        editor.setValue(style_html(editor.getValue(), {
            removeSelfClosingTags: true,
            'indent_size': 1
        }));
		
		//Loop through all of the highlights that are associated with codemirror
		//and delete them from the JSON
		
		var highlightsJSON = jsonHighlights;//JSON.parse($("#edit-field-selection-highlights-und-0-value").val());
	
		$.each(highlightsJSON['markers'], function (key, value) {
			if( value['position'][2]===0){
				delete highlightsJSON['markers'][key]
			}
		});
		
		jsonHighlights.markers=highlightsJSON.markers;
		$("#edit-field-selection-highlights-und-0-value").val(JSON.stringify(highlightsJSON));
		showMarkersCount();
		return false;
    }
}

//web resource
// Prevent the backspace key from navigating back.// for all input fields
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD')) || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        } else {
            doPrevent = true;
        }
    }
    if (doPrevent) {
        event.preventDefault();
    }
});

function initConfigDialog() {
    $("#step-config-dialog").dialog({
        modal: true,
        autoOpen: false,
        height: jsonConfig.ConfigDialog.height(),
        width: jsonConfig.ConfigDialog.width(),
        minWidth: jsonConfig.ConfigDialog.minWidth
    });
    var strTabs = jsonConfigDialogTabs.createTabs(jsonConfigDialogTabs.tabs)
    $("#tabs").html(strTabs)
    $("#step-config-form").submit(function () {
        var UserWidth = $("#step-config-w").val()
        if (isNaN(UserWidth / 1)) {
            $("#step-config-w").css("border", "1px solid red")
            return false;
        } else {
            $("#step-config-w").css("border", "")
        }
        setDimensions(UserWidth);
        // update val
        $("#step-config-w").val(jsonConfig.global.curWidth)
        return false;
    })
}

function stepConfig() {
    $("#tabs").tabs();
    $("#step-config-dialog").dialog('open')
}

function setDimensions(UserWidth) {
    // This value controls the width of CM and tables. 
    //  jsonConfig.global.curWidth = UserWidth;
    $("#step-tables-wrapper").css("width", jsonConfig.tablesWrapper.width())
    editor.setSize(jsonConfig.CM.width(), jsonConfig.CM.height());
}

function initAddCommentsDialog() {
    $('body').append('<div id="step-add-comment-dialog" title="Highlight Types">');
    $("#step-add-comment-dialog").dialog({
        modal: true,
        autoOpen: false,
        height: 360,
        width: 300,
        beforeClose: function () {
            $("#step-form").remove();
			$('#step-add-comment-dialog').dialog('option','width',300);
        }
    });
    // add comment form
    $("#step-add-comment-dialog").append("<div id=\"step-add-comment-root\"/><div id=\"step-add-comment-subroot\"/>");
    $("#step-add-comment-root").html(jsonHighlights.getList());
}

// function to extract the body content from the tei document
function getContent() {
	var text = editor.getValue();
	var tag = "</body>"
	var offset = tag.length;
	var content = text.substring(text.indexOf("<body"), text.indexOf("</body>") + offset);
	return content;
}


// function to export the file to the specified tei tools (currently - transcriptor)
function downloadFile() {
	var container = document.querySelector('#step-export-tei-root');
	var output = container.querySelector('output');
	
	const MIME_TYPE = 'text/plain';
	
	var cleanUp = function(a) {
	  a.textContent = 'Downloaded';
	  a.dataset.disabled = true;
	
	  // Need a small delay for the revokeObjectURL to work properly.
	  setTimeout(function() {
		window.URL.revokeObjectURL(a.href);
	  }, 1500);
	};
	
	var df = function() {
	  window.URL = window.webkitURL || window.URL;
	
	  var prevLink = output.querySelector('a');
	  if (prevLink) {
		window.URL.revokeObjectURL(prevLink.href);
		output.innerHTML = '';
	  }
	
	  var bb = new Blob([getContent()], {type: MIME_TYPE});
	
	  var a = document.createElement('a');
	  a.download = 'tei-document.txt';
	  a.href = window.URL.createObjectURL(bb);
	  a.textContent = 'Download ready';
	
	  a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
	  a.draggable = true; // Don't really need, but good practice.
	  a.classList.add('dragout');
	
	  output.appendChild(a);
	
	  a.onclick = function(e) {
		if ('disabled' in this.dataset) {
		  return false;
		}
	
		cleanUp(this);
	  };
	};
	df();
}
	
