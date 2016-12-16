<?php
	$postData = file_get_contents("php://input");
	$content = json_decode($postData, true);
	
	try {	
		if (empty($content["xml"])) {
			print("<p class=\"error\">No TEI Document found upon submission.</p>");
			exit();
		}		
		// Generate temp XML file from $xml above
		$tempFileName = md5(mt_rand() . microtime()) . ".xml";
		$libraryLoc = "/sites/all/libraries/step/validate/";
		$tempFileLoc = $content["cwd"] . $libraryLoc . "temp/" . $tempFileName;
		$httpFileLoc = $content["sitePath"] . $libraryLoc . "temp/" . $tempFileName;
		$httpRNGLoc = $content["sitePath"] . $libraryLoc . "schemas/" . $content["rng"];
		
		try {
			$fileOpen = fopen($tempFileLoc, "w+b");
			$fileWrite = fwrite($fileOpen, $content["xml"]);
			$fileClose = fclose($fileOpen);
		} catch(Exception $e) {
			throw new Exception("<p class=\"error\">An error occurred trying to write to the temporary validation file. Please notify IT support.</p>", 0, $e);
		}
						
		try {
			$exec_jar = exec("java -jar xmlrngvalidate.jar " . $httpRNGLoc . " " . $httpFileLoc, $results, $exec_jar_result);
			if ($results) {
				foreach ($results as $result) print("<p>" . htmlspecialchars($result) . "</p>");
			} else {
				print("<p class=\"error\">Error running validation application.</p>");
			}
		} catch(Exception $e) {
			throw new Exception("<p class=\"error\">An error occurred trying to run the validation application. Please notify IT support.</p>", 0, $e);
		}		
		
		// Delete the temp file here
		try {
			unlink($tempFileLoc);
		} catch (Exception $e) {
			throw new Exception("<p class=\"error\">An error occurred trying to remove the temporary validation file. Please notify IT support.</p>", 0, $e);
		}		
	} catch (Exception $e) {
		throw new Exception("<p class=\"error\">A serious error occurred with the validator, please contact your IT support.</p>", 0, $e);
	}
?>