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
	 * @throws SAXException 
	 */
	public static void main(String[] args){
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
		try {
			builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e1) {			
		}

		builder.setErrorHandler(new ErrorHandlerRoutine());
		boolean parsed = true;
		try {
			builder.parse(new InputSource(xml));
		} catch (SAXException e1) {
			parsed = false;
		} catch (IOException e1) {		
		}
		
		if (parsed) {	        
			SchemaReader sr = new AutoSchemaReader();
		    ValidationDriver driver = new ValidationDriver(sr);
		    InputSource inRng = ValidationDriver.uriOrFileInputSource(rng);
		    inRng.setEncoding("UTF-8");
		    
			try {
				driver.loadSchema(inRng);
			} catch (SAXException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		        
		    InputSource inXml = ValidationDriver.uriOrFileInputSource(xml);		        
		    inXml.setEncoding("UTF-8");
		    boolean val;
			try {
				val = driver.validate(inXml);
				if (val) {
			    	System.out.println("Document is valid.");
				} else {
			        	System.out.println("Document is NOT valid.");
				}
			} catch (SAXException e) {					
			} catch (IOException e) {
			}
				
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
				System.out.println(err);	
				i++;
			}
		}      
	}			
}