<?php
    header("content-type: text/javascript"); 
    
	echo $_GET['callback']. '(' . json_encode(file_get_contents("http://iat.iupui.edu/step/step-highlight-configuration")) . ');';
?>