import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

public class ErrorHandlerRoutine implements ErrorHandler {

	@Override
	public void error(SAXParseException arg0) throws SAXException {
		System.out.println("ERROR");
		System.out.println("TEI Document is not well-formed.");
		System.out.println("Line: " + arg0.getLineNumber());
		System.out.println("Character: " + arg0.getColumnNumber());
		System.out.println("<p class=\"error\">Error: " + arg0.getMessage() + "</p>");		
	}

	@Override
	public void fatalError(SAXParseException arg0) throws SAXException {
		System.out.println("ERROR");
		System.out.println("TEI Document is not well-formed.");
		System.out.println("Line: " + arg0.getLineNumber());
		System.out.println("Character: " + arg0.getColumnNumber());
		System.out.println("<p class=\"error\">Error: " + arg0.getMessage() + "</p>");		
	}

	@Override
	public void warning(SAXParseException arg0) throws SAXException {
		System.out.println("ERROR");
		System.out.println("Line: " + arg0.getLineNumber());
		System.out.println("Character: " + arg0.getColumnNumber());
		System.out.println("<p class=\"error\">Error: " + arg0.getMessage() + "</p>");		
	}
}