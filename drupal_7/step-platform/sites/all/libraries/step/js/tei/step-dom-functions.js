 
//Check xml errors, online resource  
//*********************
var xt="",h3OK=1;
function checkErrorXML(x)
{
    xt=""
    h3OK=1
    checkXML(x)
}

function checkXML(n)
{
    var l,i,nam
    nam=n.nodeName
    if (nam=="h3")
    {
		//
        if (h3OK==0)
        {
            return;
        }
        h3OK=0
    }
    if (nam=="#text")
    {
        xt=xt + n.nodeValue + "\n"
    }
    l=n.childNodes.length
    for (i=0;i<l;i++)
    {
        checkXML(n.childNodes[i])
    }
}

function validateXML(xml)
{
    // code for IE
    var txt =''
    if (window.ActiveXObject)
    {
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(xml);

        if(xmlDoc.parseError.errorCode!=0)
        {
            txt="Error Code: " + xmlDoc.parseError.errorCode + "\n";
            txt=txt+"Error Reason: " + xmlDoc.parseError.reason;
            txt=txt+"Error Line: " + xmlDoc.parseError.line;
          
              $("#step-error").text(txt)
            return false;
        }
        else
        {
       
             $("#step-error").empty()
            return true;
        }
    }
    // code for Mozilla, Firefox, Opera, etc.
    else if (document.implementation.createDocument)
    {
        var parser=new DOMParser();
        var text=xml;
        var xmlDoc=parser.parseFromString(text,"text/xml");

        if (xmlDoc.getElementsByTagName("parsererror").length>0)
        {
            checkErrorXML(xmlDoc.getElementsByTagName("parsererror")[0]);
      
            
            $("#step-error").text(xt)
            return false;
        }
        else
        {
             $("#step-error").empty()
            return true;
        }
    }
    else
    {
        c.log('Your browser cannot handle XML validation');
    }
}





// Function to parse DOM ,
// path is a parameter of xml document 
// does not work on ie
function loadDom(path){
   var xmlhttp
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
        xmlhttp.overrideMimeType("text/xml");
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET",path ,false);
    xmlhttp.send();
    return xmlhttp; 
}





// remove empty text nodes
// removes  "/n" 
//online resource
function removeEmptyTextNodes(elem){
    var children = elem.childNodes;
    var child;
    var len = children.length;
    var i = 0;
    var whitespace = /^\s*$/;
    for(; i < len; i++){
        child = children[i];
        if(child.nodeType == 3){
            if(whitespace.test(child.nodeValue)){
                elem.removeChild(child);
                i--;
                len--;
            }
        }else if(child.nodeType == 1){
            removeEmptyTextNodes(child);
        }
    }
}
      
      



   
function checkWellFormed(){

    if (window.DOMParser)
    {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString( editor.getValue(),"text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(editor.getValue());
    }
  
    
}




// parse XML string
function StringtoXML(text){
    if (window.ActiveXObject){
        var doc=new ActiveXObject('Microsoft.XMLDOM');
        doc.async='false';
        doc.loadXML(text);
    } else {
        var parser=new DOMParser();
        var doc=parser.parseFromString(text,'text/xml');
    }
    return doc;
}



