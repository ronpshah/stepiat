var allowedValues = {
	hashElements : {}, // used to check if "elem.getAttribute("name")" is unique
    
	getElements : function(node , arrAllowedChildElements) {
    	for (var i = 0, l = node.childNodes.length; i < l; i++) {
        	var name = node.childNodes[i].nodeName;
            var elem = node.childNodes[i];  
                  
            switch(name) { // if we have an <element name="value">, we get its name and push it into arrAllowedChildElements
            	
				case "element" : { 
                    // add to arrAllowedChildElements if unique.
					if (allowedValues.hashElements[elem.getAttribute("name")] === undefined) {
                    	allowedValues.hashElements[elem.getAttribute("name")] = ""
                        arrAllowedChildElements.push([elem.getAttribute("name")])
                    }
                }
                break;
				
                // find <define(s) for this <ref and pass it
                case "ref" : {
                    for (y in schemaX.hashDef[elem.getAttribute("name")]) {
                        allowedValues.getElements(schemaX.hashDef[elem.getAttribute("name")][y].node[0] , arrAllowedChildElements);
                        break;
                    }
                }
                break; 
			
                case "attribute" :
                    break; 
                       
                case "a:documentation" :
                    break; 
                            
                case "ns" :
                    break;   
                
				case "#text" :
                    break; 
                
                default :
                    allowedValues.getElements(elem , arrAllowedChildElements);
                    break;
            }
        }
    },
    
    getAttributes : function  (node, arrAllowedAttributes) {
        //// This function builds an array of allowed attributes for an element
        // This function accepts a <element> node as a reference
        for (var i = 0, l = node.childNodes.length; i < l; i++ ) {
            var name = node.childNodes[i].nodeName;
            var elem = node.childNodes[i];
            switch(name) {   
                
                case "element" : { //we are too deep. we have reached another child <element> node.
                    break; 
                }
				
                case "ref" : {
                    for (y in schemaX.hashDef[elem.getAttribute("name")]) {
                        allowedValues.getAttributes(schemaX.hashDef[elem.getAttribute("name")][y].node[0], arrAllowedAttributes);
                        break;
                    }
                }
                break;
		
                case "attribute" : // we need only attribute node
                    // We need to get these values so we build an HTML combo box inside a table cell
                    var arrAttrsRestrictedValues = [];
                    allowedValues.findAttrValueRestrictions(elem, arrAttrsRestrictedValues); // this will find <value> and push values into arrAttrsRestrictedValues. 
     
                    // set a marker (key) to be used in creating different cell types later.
                    var key = "default";
                
                    if (arrAttrsRestrictedValues.length > 0) {  
                        key = "comboBox"; // or combo box
                    }
         
                    arrAllowedAttributes.push([elem.getAttribute("name"), arrAttrsRestrictedValues, key]); 
                    arrAttrsRestrictedValues = null;
                    break; 
                       
                case "a:documentation" :
                    break; 
                            
                case "ns" :
                    break;
                           
                case "#text" :
                    break; 
            
                default :
                    allowedValues.getAttributes(elem, arrAllowedAttributes);
                    break;
            }
        }
    },
          
    // This recursive function builds an array to hold restricted attribute values and it accepts a node and array as references
    findAttrValueRestrictions: function (node , arrAttrsRestrictedValues){
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            var name = node.childNodes[i].nodeName;
            var elem = node.childNodes[i]; 
            switch(name) {   
         
                case "ref" : {
              		for (y in schemaX.hashDef[elem.getAttribute("name")]) {
                        allowedValues.findAttrValueRestrictions(schemaX.hashDef[elem.getAttribute("name")][y].node[0], arrAttrsRestrictedValues);
                        break;
                    }
                }
        
                //<data type="dataType"/>
                // we are not doing anything with <data>
                case "data" : {
                    // we could get the value of "type" attribute and push into arrAttrsRestrictedValues
                    // if (elem.getAttribute("type") != null)
                    // {
                    // arrAttrsRestrictedValues.push(elem.getAttribute("type"))
                    // }
                    break;
                }
        		break;
				
                case "value" : {                    
                	// Attribute restrictions looks like this 
                    	/*	<choice>
                				<value>high</value>
                				<value>medium</value>
                				<value>low</value>
                				<value>unknown</value>
             				</choice>
             			*/
                    // if we have <value, we push it into arrAttrsRestrictedValues
                    arrAttrsRestrictedValues.push(elem.childNodes[0].textContent);
                    allowedValues.findAttrValueRestrictions(elem, arrAttrsRestrictedValues);                    
                }        
                break;
            
                default :
                    // any other nodes
                    allowedValues.findAttrValueRestrictions(elem, arrAttrsRestrictedValues);
                    break;
            }
        }
    }      
}
 
// This function create and array of "must have tags" . 
function  getRe(node) {     
    for (var i = 0, l = node.childNodes.length; i < l; i++) {
        var name = node.childNodes[i].nodeName;
        var elem = node.childNodes[i];  
        switch(name) { // if we have an <element name="value">, we get its name and pus it into arrAllowedChildElements
        
			case "element" : { 
            	nodeRegex += "("+ elem.getAttribute("name")+")";               
                break;
            }
            break;
			
            // find <define(s) for this <ref and pass it
            case "ref" : {
                for (y in schemaX.hashDef[elem.getAttribute("name")]) {
                    getRe(schemaX.hashDef[elem.getAttribute("name")][y].node[0]);
                    break;
                }
            }
            break; 
	 		
			case "a:documentation" :
            break; 
            
			case "ns" :
            break;
            
			case "define" :
            	getRe(elem);
            break;
            
			case "data" :
            	getRe(elem);
            break;
            
			case "value" :
            	getRe(elem);
            break;
            
			case "choice" : {
				// getRe(elem) 
                for (var x = 0, le = elem.childNodes.length; x < le; x++) {
                       nodeRegex += name + " ";
                       getRe(elem.childNodes[x]);                        
                    }
                break;
            	} 
				 
           	case "#text" :
            break; 
				
            default :
            	nodeRegex += name + " ";
                getRe(elem);
            break;
        }
    }
}