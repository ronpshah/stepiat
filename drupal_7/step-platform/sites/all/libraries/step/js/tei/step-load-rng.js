var c = console;
var sitePath = Drupal.settings.STEP.sitePath + "/sites/all/libraries/step/";
// Load and prepare RNG
// this will hold schema and variables
var rngSchema = {}

// this function populates rngSchema
function loadRNG(schemaPath) {    
    rngSchema.schema = loadDom(schemaPath).responseXML; 
    rngSchema.defaultNS =  rngSchema.schema.getElementsByTagName("grammar")[0].getAttribute("ns"); 
    rngSchema.hashDef = {};
    rngSchema.hashCheckedRefs = {}; // this is to avoid checking the same element more than one time/
    rngSchema.hashCheckedRefs[ rngSchema.defaultNS] = {};
    rngSchema.arrDefine = rngSchema.schema.getElementsByTagName("define"); // Get all <define> elements from schema
    rngSchema.arrCheckedAttributes =[];
    rngSchema.hashAttributes ={}; // This array holds all <attribute> nodes
    
	// HashNS will hold all name spaces from the schema. 
    // each name space will have a child that is a reference to an element in the schema 
    // HashNS looks like this
    /*
    Object
    http://www.tei-c.org/ns/1.0: Object
        TEI: Element
        ab: Element
    MoreNS : Object
        more:ElementRefrence
    */
    rngSchema.HashNS ={};
    rngSchema.HashNS[rngSchema.defaultNS] = {}; // we need to manually add the defaulNs to HashNS
        
    rngSchema.attsNodes = rngSchema.schema.getElementsByTagName("attribute");
     rngSchema.hashAttrs ={}
}
loadRNG(sitePath + "tei_all.rng"); // This needs changed to be a Drupal environment variable so other schemas can be loaded.

// load an prepare schema 
/// pass schema path
var schemaX =  rngSchema ;

///load  and schema 
var schema = schemaX.schema;

for(var i = 0, l =  rngSchema.attsNodes.length; i<l; i++) {
	var attName =  rngSchema.attsNodes[i].getAttribute("name"); //get the name of the attribute
    rngSchema.hashAttrs[attName] = ( rngSchema.attsNodes[i]); //add nodes for that attribute
}

// remove empty text nodes  // makes it easier to debug // faster to process
// slow in opera
removeEmptyTextNodes(schemaX.schema);

// get the value  of "name" attribute for each item in arrDefine
$.each(schemaX.arrDefine, function(i) 
{
    schemaX.hashDef[$(schemaX.arrDefine[i]).attr("name" )]={};
})
//        
$.each(schemaX.arrDefine, function(i)
{  
    schemaX.hashDef[schemaX.arrDefine[i].getAttribute("name")][i]={
    	node : [schemaX.arrDefine[i]]
    };
});



// find the starting node for schema 
//find <start> and pass it to solver, if <start> do not exist, pass <element> that is a child of <grammer>
//there should be only one <start> tag in RNG schemas and it should be a child of <grammar>.
// if <start does not exist , there must be an <element> tag that is a child of grammar
// pass start node to solver
if (schema.getElementsByTagName("start")[0]) { 
    
    // we add a default start node to HashNS. This is used as a root node.
    // When we want the root (allowed element) from the schema. we get it from HashNS[anyNS]["DefaultStartNode"] ;
    //  in a normal TEI document,HashNS[anyNS]["DefaultStartNode"] will be <TEI> and <teiCorpus>
      schemaX.HashNS[schemaX.defaultNS]["DefaultStartNode"] = schema.getElementsByTagName("start")[0];
     
    
    solver(schema.getElementsByTagName("start")[0] ,schemaX.defaultNS ); 
}
else{ 
    // pass <element> node that is a direct child of grammar
     l =  schema.getElementsByTagName("grammar")[0].childNodes.length
    for ( i = 0; i <l;i++)
    {
        if (schema.getElementsByTagName("grammar")[0].childNodes[i].nodeName == "element")
        {    // set default start node   
            schemaX.HashNS[schemaX.defaultNS]["DefaultStartNode"] =schema.getElementsByTagName("grammar")[0].childNodes[i];
            //<start> was not found in schema, pass <element> that is a directchild of <grammar>")
            solver(schema.getElementsByTagName("grammar")[0].childNodes[i] ,schemaX.defaultNS ); 
           
        } 
    }
}




delete schemaX.hashCheckedRefs; // delete. no longer needed

// To be able to find out the alllowed elements structure of XML, we need to trace (dive) in the RNG schema file
// To get the allowed child elements of any element, we examine the child nodes in the schema
// an example for a child node will be 
// <oneOrMore>
//  <allowedChildelement>
//  </allowedChildelement>
// </oneOrMore>
// for the previous structure we use direct recursion.
// But if we have a <ref name"refToADefine"> element, we need to find a <define name="refToADefine"> element with the same name value
// So, if we have a <ref> we pass  its <define> tag(s). 
// searching for <define> by its "name" attribute value is SLOW , thats we have hashDef. 
// 
// 
// This recursive funtion will populate HashNS
function solver(node  , parentNS)
{      
    // we need Only element nodes
    if(node.nodeType == 1 )
    {
        var currentNS = parentNS;// set NS
        // if this node has an "ns" attribute, set currentNS to this node's "ns" attribute value
        if( node.hasAttribute("ns")){
            currentNS = node.getAttribute("ns");
        }     
        // for each child of node 
        for (var i = 0 ,l =node.childNodes.length;i<l;i++ )
        {
            
            var name = node.childNodes[i].nodeName; // nodeName is <nodeName>
            var currentChild = node.childNodes[i];  // this is a child of "node"
            switch(name)
            {
                //if we have an <element> . 
                case "element":
                {
                    //  does this <element> have a "ns" attribute?
                    //  if so, add new namespace if it  doesnt already exist
                    // we add the value of "ns" to both HashNS and schemaX.hashCheckedRefs
                    if( !(schemaX.HashNS.hasOwnProperty(currentNS))){
                        schemaX.HashNS[currentNS] = {};
                        schemaX.hashCheckedRefs[currentNS] ={};
                    }
                    
                    
                     
                    // not sure why I have this if statement
                    if(!(currentChild.getAttribute("name") in schemaX.HashNS[currentNS] )) 
                    {   
                        // we add (currentChild) reference to schemaX.HashNS if it 
                        schemaX.HashNS[currentNS][currentChild.getAttribute("name")]= currentChild; 
                        // pass this currentChild and currentNS
                        solver(currentChild , currentNS);
                    }
                    else
                    {
                        break;
                    }
                    break;
                }
		
                // we have a <ref > 
                // important:   <ref> could refere to one or more <define>
                case "ref":
                { // check if the <ref> has been checked before. if true, break. 
                    // we need to check this because some schema are refered to by multiple elements.
                    if (!(schemaX.hashCheckedRefs.hasOwnProperty(currentNS+currentChild.getAttribute("name"))))
                    { 
                        // add ref to hashChecked Refs, so we know we have checked it.
                        schemaX.hashCheckedRefs[currentNS+currentChild.getAttribute("name")] = "";
                         
                        /*A ref could refere to one or more <define>, so we need to check them all.
                           Search for all <define> and solve them.*/
                        for (y in schemaX.hashDef[currentChild.getAttribute("name")])
                        {
                            var n =  currentChild.getAttribute("ns");
                            if (n != null){
                                currentNS = n;
                            }
                            // This is important!
                            /// a <ref> refers to a <define> . so we need to pass a reference of <define> not currentChild
                            // the <define> is stored in hashDef, so we pass it
                            solver(schemaX.hashDef[currentChild.getAttribute("name")][y].node[0] , currentNS);
                            break;
                        }
                    }
                    break; 
                }
                // we break on the following
              
                case "a:documentation":
                    break; 
                            
                case "ns":
                    break;  
                        
                // default is to handle other nodes such as <zeroPrMore> , <choice> etc...        
                default:
                    solver(currentChild  , currentNS);
                    break;
            }
        }
    }
}