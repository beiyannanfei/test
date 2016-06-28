import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.processing.Filer;
import javax.lang.model.element.Element;
import javax.tools.FileObject;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileManager.Location;


public class Record {
	private static final String RECORDFILENAME = "topspeeder.record";
	
	private Date bestRecordTime;
	private float bestRecordKeysPerMinute;
	
	public Record() throws Exception{
		BufferedReader br = new BufferedReader(new FileReader(Record.RECORDFILENAME));
		bestRecordKeysPerMinute = Float.parseFloat(br.readLine());
		bestRecordTime = new Date(Long.parseLong(br.readLine()));
		br.close();
	}

	public Date getBestRecordTime() {
		return bestRecordTime;
	}

	public void setBestRecordTime(Date bestRecordTime) {
		this.bestRecordTime = bestRecordTime;
	}

	public float getBestRecordKeysPerMinute() {
		return bestRecordKeysPerMinute;
	}

	public void setBestRecordKeysPerMinute(float bestRecordKeysPerMinute) {
		this.bestRecordKeysPerMinute = bestRecordKeysPerMinute;
	}

	public void saveNewRecord(float keys, Date startTime) throws Exception {
		PrintWriter pw = new PrintWriter(new FileWriter(RECORDFILENAME, false));
		pw.println(keys);
		pw.println(startTime.getTime());
		pw.close();
	}
	
	
}
