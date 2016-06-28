import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


public class Util {
	private static final DateFormat DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	public static String formatDate(Date d){
		String result = null;
		result = DATEFORMAT.format(d);
		return result;
	}
}
