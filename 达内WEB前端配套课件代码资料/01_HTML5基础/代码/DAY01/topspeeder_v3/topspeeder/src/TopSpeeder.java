import java.io.BufferedReader;
import java.io.Console;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * TopSpeeder: Java�ؼ��ִ����ٶȲ��Թ���
 * @author Leon
 *
 */
public class TopSpeeder {
	private static final String LIBFILEBASENAME = "topspeeder";
	private List<String> lib;
	private Date startTime;
	private Date endTime;
	private Record record;
	private Console cs = System.console();
	private static int WORDINLINE = 6;
	private static int TESTLINE = 10;
	
	public TopSpeeder() throws Exception{
		this.lib = new ArrayList<String>();
		this.record = new Record();
	}
	
	public void printWelcome() throws Exception{
		System.out.println("********************************");
		System.out.println("***********����Ա����***********");
		System.out.println("********************************");
		System.out.println("**��Ŀǰ����óɼ���"+record.getBestRecordKeysPerMinute()+"��/����");
		System.out.println("**�úóɼ�ȡ�����ڣ�"+Util.formatDate(record.getBestRecordTime()));
		
		System.out.println("**��ѡ��˴β��Եķ�Χ��");
		System.out.println("** 1-Java    2-HTML    3-CSS    4-MySQL    0-INSANEģʽ");
		System.out.print("**��ѡ��");
		int testContent = Integer.parseInt(cs.readLine());;
		switch (testContent) {
		case 1:
			loadWordLib("java");
			break;
		case 2:
			loadWordLib("html");
			break;
		case 3:
			loadWordLib("css");
			break;
		case 4:
			loadWordLib("mysql");
			break;
		case 0:
			loadWordLib("java");
			loadWordLib("html");
			loadWordLib("css");
			loadWordLib("mysql");
			break;
		default:
			System.out.println("�޴�ѡ�");
			System.console().readLine();
			System.exit(-1);
		}
		
		System.out.print("**������˴β���ÿ�е�������");
		TopSpeeder.WORDINLINE = Integer.parseInt(cs.readLine());
		System.out.print("**������˴β���������");
		TopSpeeder.TESTLINE = Integer.parseInt(cs.readLine());
		System.out.println("**�ٴ�����س���ʼ�˴β���.....");
		cs.readLine();
		this.startNewTest();
	}
	private void loadWordLib(String surfix) throws Exception {
		BufferedReader br = new BufferedReader(new FileReader(TopSpeeder.LIBFILEBASENAME+"_"+surfix+".lib"));
		String line = null;
		while((line=br.readLine())!=null){
			line = line.trim();
			if(line.length()>0)
				lib.add(line);
		}
		br.close();
	}

	public void startNewTest() throws Exception{
		Random rdm =  new Random();
		this.startTime = new Date();
		int correctCount = 0;
		int totalCount = TopSpeeder.WORDINLINE*TopSpeeder.TESTLINE;
		int keyStrokeCount = 0;
		String[] line = new String[WORDINLINE];
		for(int i=0; i<TopSpeeder.TESTLINE; i++){
			for(int j=0; j<WORDINLINE; j++){
				line[j] = lib.get(rdm.nextInt(lib.size()));
				System.out.print(line[j]+" ");
				keyStrokeCount += (line[j].length()+1);
			}
			System.out.println();
			/*String input = cs.readLine();
			String[] inputArr = input.split(" ");
			while(inputArr.length<WORDINLINE){
				if(input.trim().length()>0){
					input += " "+ cs.readLine();
					inputArr = input.split(" ");
				}
			}*/
			String input = "";
			String[] inputArr = null;
			boolean flag = true;
			while(flag){
				String tmp = cs.readLine();
				if(tmp.trim().length()>0){
					if(input.trim().length()>0)
						input += " "+tmp.trim();
					else 
						input = tmp.trim();
				}
				inputArr = input.split(" ");
				if(inputArr.length>=WORDINLINE){
					flag  = false;
				}
			}
			for(int j=0; j<WORDINLINE; j++){
				if(line[j].equals(inputArr[j]))
					correctCount++;
			} 
		}
		this.endTime = new Date();
		double correctRate = ((double)correctCount)/totalCount;
		long timeUsed = endTime.getTime()-startTime.getTime();
		System.out.println("\n********************************");
		System.out.println("****���β��Խ������ɼ����£�****");
		System.out.println("**��ʼʱ�䣺"+Util.formatDate(startTime));
		System.out.println("**����ʱ�䣺"+Util.formatDate(endTime));
		System.out.println("**�ܴʻ�����"+totalCount);
		System.out.println("**����ʱ�䣺"+timeUsed+"����");
		System.out.println("**��ȷ��Ϊ��"+correctRate*100+"%");
		float keys = ((float)keyStrokeCount)/timeUsed*1000*60;
		System.out.println("**�����ٶȣ�"+keys+"��/����");
		System.out.println();
		if(correctRate>=0.9){
			if(keys>record.getBestRecordKeysPerMinute()){
				System.out.println("**��ϲ���˴δ������µ��ٶȼ�¼����");
				record.saveNewRecord(keys, startTime);
			}else if(keys==record.getBestRecordKeysPerMinute()){
				System.out.println("**���ͣ��˴δ�ƽ����ʷ����¼����");
				record.saveNewRecord(keys, startTime);
			}else{
				System.out.println("**����Ŭ���������ʷ��������¼Ϊ��"+record.getBestRecordKeysPerMinute()+"��/����");
			}
		}else{
			System.out.println("**��ȷ�ʲ���90%���ɼ���Ч��");
		}
		System.out.println("********************************\n\n");
	}
	
	public static void main(String[] args) throws Exception {
		boolean flag = true;
		while(flag){
			new TopSpeeder().printWelcome();
			System.out.print("����������(y/n)");
			if(System.console().readLine().trim().equalsIgnoreCase("n")){
				flag = false;
			}else{
				System.out.println("\n\n");
			}
		}
	}
}
