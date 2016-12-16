// Get documentations
var documentation = "";
          
//Build arrays of potential elements and attributes.
// this method is called on mouse click even. It build an array of potential attributes and element.
function  getElemDocumentations(el){
  
    for (var i = 0 ,l =el.childNodes.length;i<l;i++ )
    {
        var name = el.childNodes[i].nodeName;
        var elem = el.childNodes[i];  
                  
        switch(name)
        {     
            case "element":
            { 
                break;
            
            }
            break;
           
            case "ref":	{
                // search for all <define> and solve them
                for (y in hashDef[elem.getAttribute("name")]){
                    getDocumentations(hashDef[elem.getAttribute("name")][y].node[0] );
                    break;
                }
            }
            break; 
			
            case "attribute":
                  break; 
           
            case "a:documentation":
                return elem.textContent
				break; 
                            
            case "ns":
                break;
     
            case "#text":
                break; 
				
            default:
                getDocumentations(elem);
                break;
        }
    }
}
function  getAttributesDocumentations(el){
    for (var i = 0 ,l =el.childNodes.length;i<l;i++ )
    {
        var name = el.childNodes[i].nodeName;
        var elem = el.childNodes[i];  
		 
        switch(name)
        {     
            case "element":
            {
                break;
            }
        
            case "ref":    {
                // search for all <define> and solve them
                for (y in hashDef[elem.getAttribute("name")]){
                    buildAllowedAttributes(hashDef[elem.getAttribute("name")][y].node[0] );
                    break;
                }
                break;
            }
         
            case "a:documentation":
				return elem.textContent
				break;     
                            
            case "ns":
            	break;   
        
            case "attribute":   
            	break;    
                            
            case "#text":
            	break; 
				
            default:
            	getAttributesDocumentations(elem);
            	break;    
        }
    }
}