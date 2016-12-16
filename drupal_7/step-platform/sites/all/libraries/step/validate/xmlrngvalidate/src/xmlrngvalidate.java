import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import com.thaiopensource.validate.SchemaReader;
import com.thaiopensource.validate.ValidationDriver;
import com.thaiopensource.validate.auto.AutoSchemaReader;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class xmlrngvalidate {
	/**
	 * @param args
	 * @throws ParserConfigurationException 
	*/
	public static void main(String[] args) throws ParserConfigurationException, IOException{
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PrintStream ps = new PrintStream(baos);
		System.setErr(ps);
		
		//Accept file name as args		
		String rng = args[0];
		String xml = args[1];
		              					
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setValidating(false);
		factory.setNamespaceAware(true);

		DocumentBuilder builder = null;
		builder = factory.newDocumentBuilder();
		
		builder.setErrorHandler(new ErrorHandlerRoutine());
		boolean parsed = true;
		try {
			builder.parse(new InputSource(xml));
		} catch (SAXException e1) {
			parsed = false;
		}
		
		if (parsed) {	        
			SchemaReader sr = new AutoSchemaReader();
		    ValidationDriver driver = new ValidationDriver(sr);
		    InputSource inRng = ValidationDriver.uriOrFileInputSource(rng);
		    inRng.setEncoding("UTF-8");
		    
			try {
				driver.loadSchema(inRng);
			} catch (SAXException e) {
				System.out.println("ERROR");
				System.out.println("Invalid rng Schema file.");
			} catch (IOException e) {
				System.out.println("ERROR");
				System.out.println("Could not load rng Schema file.");
			}
		        
		    InputSource inXml = ValidationDriver.uriOrFileInputSource(xml);		        
		    inXml.setEncoding("UTF-8");
		    boolean val;
		    boolean error_flag = false;
			try {
				val = driver.validate(inXml);
				if (val) {
			    	System.out.println("VALID");
			    	System.out.println("Document is valid.");
				} else {
			        error_flag = true;	
					System.out.println("ERROR");
				}
				
			} catch (SAXException e) {	
				System.out.println("ERROR");
				System.out.println("Invalid xml file.");
			} catch (IOException e) {
				System.out.println("ERROR");
				System.out.println("Could not load xml file.");
			}
			
			if(error_flag){
				System.out.println("Document is not valid.");
				String errors = baos.toString();
				String[] error = errors.split("\n");
				int i = 0;
				while(error[i]!=null){				
					int spaceIndex = error[i].indexOf(" ");
					String e1 = error[i].substring(0,spaceIndex);
					String err = error[i].substring((spaceIndex+1),error[i].length());
					String[] temp1 = e1.split(":");
				
					String lineNo = temp1[2];
					String colNo = temp1[3];
				
					System.out.println("Line: " + lineNo);
					System.out.println("Character: " + colNo);
					System.out.println("<p class=\"error\">" + err  + "</p>");	
					i++;
				}
			}
		}      
	}			
}