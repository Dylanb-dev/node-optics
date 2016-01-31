 

/**
 * 			Simulator provides a template for new simulations. It handles saving and loading of
 * 			simulation files from JSON format.
 *
 * @author zachary
 *
 */
export default class Simulator {

	String deviceList[];

	Device possibleDevices[]; //list of all possible devices

	//list of possible parameters null if parameters do not exist in export default class constructor
	String params[][] = {{"Name","Power Change (dB)",		"Reflection (dB)",			"Primary Power (dB)",		"Secondary Power (dB)",	"Enable Reflection",  null, null		},
			{"Name","Power Change (dB)",		"Reflection (dB)",		"Power Constant",			"Enable Reflection",							null,					null,					null},
			{"Name","Power Change (dB)",		"Reflection (dB)",			"Power Constant",		"Enable Reflection",				null,					null,					null},
			{"Name","Generated Signal Name","Signal Power (dBm)",	"Signal Frequency (MHz)",		null,							null,					null,					null},
			{"Name","Power Change (dB)",		"Reflection (dB)",		"Enable Reflection",			null,							null,					null,					null},
			{"Name","Power Change (dB)",		"Reflection (dB)",		"Lower Frequency Limit (MHz)",	"Upper Frequency Limit (MHz)",	null,					null,					null},
			{"Name","Power Change (dB)",		"Reflection (dB)",		"Enable Reflection",			null,							null,					null,					null},
			{"Name","Power Change (dB)", "Power Change(1-2) (dB)",	"Power Change(2-3) (dB)",		"Reflection (dB)",		"Enable Reflection",								null,					null},
			{"Name","Power Change (dB)",		"Reflection (dB)",			"Frequency Shift (MHz)",		"Enable Perturbation",		"Enable Reflection",					null,					null},
			{"Name","Power Change (dB)",		"Reflection (dB)",			"Divide/Multiply Effect",		"Enable Reflection",				null,					null,					null}};


	let connectCount[];	//connection count for each device in workspace

	Device deviceAry[];	//devices init in workspace

	let deviceCoords[][];		//x y coordinates of each device

	/**
	 * holds key pairs of devices and the ports that they use in the following format
	 * 		{D1Index,D2Index,Port1,Port2,FbIndex}, null if empty
	 */
	let device_to_fiber[][];

	Fibre fiberAry[];			//fiber init in workspace
	let fiberCoords[][];		//x y coordinates of each fiber (MAYBE NOT NEEDED?)

	let currID;

	final let DEVICE_SIZE = 200;

	//constructor
	constructor(){

		currID = 0;

		deviceAry = new Device[DEVICE_SIZE];

		//deviceCoords = new int[DEVICE_SIZE][2];


		device_to_fiber = new int[DEVICE_SIZE*4][5];
		//fill empty link matrix
		for(let i=0;i<device_to_fiber.length;i++){
			for(let b=0;b<5;b++){
				device_to_fiber[i][b]=-1;
			}
		}

		connectCount = new int[DEVICE_SIZE];
		for(let i=0;i<connectCount.length;i++){
			connectCount[i] = 0;
		}

		fiberAry = new Fibre[DEVICE_SIZE*4];
		//fiberCoords = new int[DEVICE_SIZE*4][2];



		deviceList = new String[10];

		deviceList[0] = "Splitter";
		deviceList[1] = "PDetector";
		deviceList[2] = "Mixer";
		deviceList[3] = "Laser";
		deviceList[4] = "Isolator";
		deviceList[5] = "Filter";
		deviceList[6] = "Component";
		deviceList[7] = "Circulator";
		deviceList[8] = "AOM";
		deviceList[9] = "Divider_Multiplier";

	}

	/**
	 * 		runs simulator
	 * @return 0 for success 1 for fail
	 */
	let run(){
		Globals.RUN_CHECK = 0; //check for return start at 0=success
		let found = 1; //check for if laser is found

		//clear fiber logs
		clearLogs();
		//reset signals
		resetSigs();
		//reset mixer and photons beat signal arrays
		resetBeatArrays();
		//start timer
		Globals.startTime = System.nanoTime();

		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]!=null && deviceAry[i].type == 3){
				Laser l1 = (Laser)deviceAry[i];
				if(l1.fb1 != null){
					//START SIM
					try{
						l1.moveSignal();
					}catch(java.lang.StackOverflowError err){
						return 2;
					}
					found = 0;
				}
			}
		}
		printAllLogs();

		if(Globals.RUN_CHECK == 0 && found == 0){
			return 0;
		}else{
			return 1;
		}
	}

	/**
	 * 		resets the signal arrays in mixer and photon used to make beats
	 */
	resetBeatArrays(){
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]!=null && deviceAry[i].type == 1 ){
				PhotonDetector pd = (PhotonDetector)deviceAry[i];
				pd.clearSigs();
				pd.beat = null;
			} else if(deviceAry[i]!=null && deviceAry[i].type == 2 ){
				Mixer m1 = (Mixer)deviceAry[i];
				m1.clearSigs();
			}
		}
	}

	/**
	 * 		reset generated signals to there start properties
	 */
	resetSigs(){
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]!=null && deviceAry[i].type == 3 ){
				Laser l1 = (Laser)deviceAry[i];
				l1.reset();
			}
		}
	}

	/**
	 * 		clears fiber logs
	 */
	clearLogs(){
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i]!=null){
				fiberAry[i].log = new ArrayList<String[]>();
			}
		}
	}

	/**
	 * 		Returns desired device
	 * @param iD of desired device
	 * @return	the device or null on failure
	 */
	Device getDevice(String iD){
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]!=null && deviceAry[i].name==iD)){
				return deviceAry[i];
			}
		}
		return null;
	}

	/**
	 * 		prints current system state for testing
	 */
	printState(){

		console.log("Device Array");
		for(let i=0; i<deviceAry.length;i++){
			if(deviceAry[i]!=null){
				console.log("["+i+"]Name: "+deviceAry[i].name+" Type:" + deviceAry[i].getClass());
			}
		}
		console.log();
		console.log("Fiber Array");
		for(let i=0; i<fiberAry.length;i++){
			if(fiberAry[i]!=null){
				console.log("["+i+"]Name: "+fiberAry[i].name+" D1: "+fiberAry[i].d1+" D2: "+fiberAry[i].d2);
			}
		}
		console.log();
		console.log("Device to Fiber Array");
		for(let i=0; i<device_to_fiber.length;i++){
			if(device_to_fiber[i][0]!=-1){
				System.out.print("["+i+"]");
				for(let b=0;b<5;b++){
					System.out.print(device_to_fiber[i][b]+" ");
				}
				console.log();
			}
		}
		console.log();
		console.log("Connect Count");
		for(let i=0; i<connectCount.length;i++){
			if(connectCount[i]!=0){
				console.log("["+i+"] " + connectCount[i]);
			}
		}
	}

	/**
	 * 		add device with unique identifier
	 *
	 * @param x x coordinate
	 * @param y y coordinate
	 * @param type a string indicating the type of device to make
	 * @returns iD of new device or -1 for fail
	 */
	let addDevice(String type, let x, let y){
		//new device and its ID
		Device device;
		String iD = getID();

		if(type=="Splitter")){
			device = new Splitter(iD,0,0,false,-3,-3);
			device.type = 0;

		} else if(type=="PDetector")){
			device = new PhotonDetector(iD,0,0,false);
			device.type = 1;

		} else if(type=="Mixer")){
			device = new Mixer(iD,0,0,false,0);
			device.type = 2;

		} else if(type=="Laser")){
			device = new Laser(iD,"master",5,2.0 * Math.pow(10, 8)); //(5dB, 200THz)
			device.type = 3;

		} else if(type=="Isolator")){
			device = new Isolator(iD,0,0,false);
			device.type = 4;

		} else if(type=="Filter")){
			device = new Filter(iD,0,0,false,0,300);
			device.type = 5;

		} else if(type=="Component")){
			device = new Component(iD,0,0,false);
			device.type = 6;

		} else if(type=="Circulator")){
			device = new Circulator(iD,0,0,false,0,0);
			device.type = 7;

		} else if(type=="AOM")){
			device = new AOM(iD,0,0,false,0);
			device.type = 8;

		} else if(type=="Divider_Multiplier")){
			device = new Divider_Multiplier(iD,0,0,false,0);
			device.type = 9;
		}else{
			return -1;
		}

		device.coordinate[0] = x;
		device.coordinate[1] = y;

		//find empty spot in device array
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]==null){
				deviceAry[i] = device;
				return Integer.valueOf(deviceAry[i].name);
			}
		}
		return -1;
	}

	/**
	 * 		called to allocate new iD to device or fiber in simulation
	 *
	 * @return new iD
	 */
	String getID(){
		String iD = String.valueOf(currID);
		currID++;
		return iD;
	}


	/**
	 * 		gets the fiber belonging to a unique iD
	 * @param iD unique ID
	 * @return fiber found or null when not found
	 */
	Fibre getFiber(String iD){
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i]!=null && fiberAry[i].name==iD)){
				return fiberAry[i];
			}
		}
		return null;
	}

	/**
	 * 		Gets the index of a fiber
	 * @param fb the fiber being searched
	 * @return index of fiber or -1 for fail
	 */
	let getFiberIndex(Fibre fb){
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i]==fb){
				return i;
			}
		}
		return -1;
	}

	/**
	 * 		returns the log string of fiber attached to devices
	 * 		port.
	 * @param iD of device
	 * @param port of device where fiber is
	 * @return string of fiber log or ""
	 */
	String getFiberLog(let iD, let port){

		return "";
	}

	/**
	 * 		prints all fibers logs, used for testing
	 */
	printAllLogs(){
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i]!=null){
				console.log("Fiber "+fiberAry[i].name);

				for(let b=0;b<fiberAry[i].log.size();b++){
					if(fiberAry[i].log.get(b) != null){
						for(let c=0;c<6;c++){
							console.log(fiberAry[i].log.get(b)[c]);
						}
					}
				}

				console.log();
			}
		}
	}

	/**
	 * 		Deletes device and fiber connections from simulator
	 * @param iD of device
	 * @return 0 for success, 1 for fail
	 */
	let deleteDevice(String iD){
		let index = -1;

		//find device in deviceAry get index
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]!=null && deviceAry[i].name==String.valueOf(iD))){
				index = i;
			}
		}

		//if not found fail
		if(index==-1)return index;

		//find device in link matrix delete fiber and dependencies
		for(let i=0;i<device_to_fiber.length;i++){
			//when connection found remove dependencies
			if(device_to_fiber[i][0]==index || device_to_fiber[i][1]==index){
				removeFiberDependence(deviceAry[device_to_fiber[i][0]],fiberAry[device_to_fiber[i][4]]);
				removeFiberDependence(deviceAry[device_to_fiber[i][1]],fiberAry[device_to_fiber[i][4]]);
				//remove connection count
				connectCount[device_to_fiber[i][0]]--;
				connectCount[device_to_fiber[i][1]]--;

				//remove fiber
				fiberAry[device_to_fiber[i][4]] = null;
				//clear line
				for(let b=0;b<5;b++){
					device_to_fiber[i][b] = -1;
				}
			}
		}
		//TODO remove from connection count on dependant devices

		//remove device
		deviceAry[index] = null;
		//remove device connection count
		connectCount[index] = 0;

		return 0;
	}

	/**
	 * 		Deletes fiber from simulator
	 * @param iD of fiber
	 * @return 0 for success, 1 for fail
	 */
	let deleteFiber(String iD){
		let index = -1;
		//find fiber in fiberAry get index
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i]!=null && fiberAry[i].name==String.valueOf(iD))){
				index = i;
			}
		}

		//if found delete
		if(index != -1){
			//remove dependence
			removeFiberDependence(fiberAry[index].d1, fiberAry[index]);
			removeFiberDependence(fiberAry[index].d2, fiberAry[index]);

			//drop connect count for both devices
			let dIndex = getIndex(fiberAry[index].d1);
			if(dIndex==-1)return 1;
			connectCount[dIndex]--;
			dIndex = getIndex(fiberAry[index].d2);
			if(dIndex==-1)return 1;
			connectCount[dIndex]--;

			//remove entry in device to fiber
			for(let i=0;i<device_to_fiber.length;i++){
				if(device_to_fiber[i][4] == index){
					for(let b=0;b<5;b++){
						device_to_fiber[i][b] = -1;
					}
					break;
				}

				if(i==device_to_fiber.length-1){
					return 1;
				}
			}

			//delete fiber
			fiberAry[index] = null;
			return 0;
		}

		return 1;
	}

	/**
	 * 		Gets index of specified device
	 * @param d1 the device
	 * @return index or -1 for fail
	 */
	let getIndex(Device d1){
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]==d1){
				return i;
			}
		}
		return -1;
	}

	/**
	 * 		removes all fibers from a device and also the links
	 * 		of that fiber in remote devices
	 * @param d1 device considering
	 * @return 0 success 1 fail
	 */
	let removeFiberDependence(Device device, Fibre fb){

		//splitter
		if(device.type == 0){
			Splitter s1 = (Splitter)device;
			if(s1.fbNorth == fb){
				s1.fbNorth = null;
			} else if(s1.fbEast==fb){
				s1.fbEast = null;
			}else if(s1.fbSouth==fb){
				s1.fbSouth = null;
			}else if(s1.fbWest==fb){
				s1.fbWest = null;
			}
		//PDetector
		} else if (device.type == 1) {
			PhotonDetector p1 = (PhotonDetector)device;
			if(p1.fbIn == fb){
				p1.fbIn = null;
			} else if(p1.fbOut == fb){
				p1.fbOut = null;
			}else{
				return 1;
			}
			//clear signal array
			p1.clearSigs();
		//Mixer
		}else if (device.type == 2) {
			Mixer p1 = (Mixer)device;
			if(p1.ifFiber == fb){
				p1.ifFiber = null;
			} else if(p1.loFiber == fb){
				p1.loFiber = null;
			} else if (p1.rfFiber == fb){
				p1.rfFiber = null;
			}else{
				return 1;
			}
			//clear signal array
			p1.clearSigs();
		//Laser
		}else if (device.type == 3) {
			Laser p1 = (Laser)device;
			if(p1.fb1 == fb){
				p1.fb1 = null;
			}else{
				return 1;
			}
		//Isolator
		}else if (device.type == 4) {
			Isolator p1 = (Isolator)device;
			if(p1.receiveFb == fb){
				p1.receiveFb = null;
			} else if(p1.sendFb == fb){
				p1.sendFb = null;
			}else{
				return 1;
			}

		//Filter
		}else if (device.type == 5) {
			Filter p1 = (Filter)device;
			if(p1.fb1 == fb){
				p1.fb1 = null;
			} else if(p1.fb2 == fb){
				p1.fb2 = null;
			}else{
				return 1;
			}
		//Component
		}else if (device.type == 6) {
			Component p1 = (Component)device;
			if(p1.fb1 == fb){
				p1.fb1 = null;
			} else if(p1.fb2 == fb){
				p1.fb2 = null;
			}else{
				return 1;
			}
		//Circulator
		}else if (device.type == 7) {
			Circulator p1 = (Circulator)device;
			if(p1.fb1 == fb){
				p1.fb1 = null;
			} else if(p1.fb2 == fb){
				p1.fb2 = null;
			}else if(p1.fb3 == fb){
				p1.fb3 = null;
			}else{
				return 1;
			}
		//AOM
		}else if (device.type == 8) {
			AOM p1 = (AOM)device;
			if(p1.fb1 == fb){
				p1.fb1 = null;
			} else if(p1.fb2 == fb){
				p1.fb2 = null;
			}else{
				return 1;
			}
		}else if (device.type == 9) {
			Divider_Multiplier dm = (Divider_Multiplier)device;
			if(dm.fb1 == fb){
				dm.fb1 = null;
			} else if(dm.fb2 == fb){
				dm.fb2 = null;
			}else{
				return 1;
			}
		}else{
			return 1;
		}

		return 0;
	}


	/**
	 * 		adds new fiber to fiber array
	 * @param fb new fiber
	 * @return index of placement
	 */
	let addFiber(Fibre fb){
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i]==null){
				fiberAry[i] = fb;
				return i;
			}
		}
		return -1;
	}


	/**
	 * 		connect two devices by a fiber
	 *
	 * @param iD unique ID of device 1
	 * @param iD unique ID of device 2
	 * @param port1 port selected on device 1
	 * @param port2 port selected on device 2
	 * @return 0 on success 1 on failure
	 */
	let connectDevices(String iD1, String iD2, let port1, let port2, Fibre fb){
		Device d1 = null;
		Device d2 = null;
		let d1Index = -1;
		let d2Index = -1;
		//find both devices
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i]!=null){
				if(deviceAry[i].name==String.valueOf(iD1))){
					d1 = deviceAry[i];
					d1Index = i;

				} else if(deviceAry[i].name==String.valueOf(iD2))){
					d2 = deviceAry[i];
					d2Index = i;
				}
			}
			if(d1 != null && d2 != null) break;
			//if both not found it failed
			if(i == deviceAry.length - 1){
				return 1;
			}
		}

		//fail if any devices are already fully connected
		if(connectCount[d1Index] == 4 || connectCount[d2Index] == 4 ) return 1;

		/* returns the result from second connection function which gives
		 * index of newly added fiber in fiber array or -1 for fail
		 */
		let check;

		/* possible connecting fiber */
		boolean fbExist = false;
		Fibre fiber;
		if(fb == null){
			fiber = null;
		}else{
			fiber = fb;
			fbExist = true;
		}


		/* FOUR PORT DEVICE */
		if(d1.getClass() == Splitter.export default class){

			Splitter s1 = (Splitter)d1;

			/*find selected port and if empty connect new fiber
			 * note we don't want to connect anything until we
			 * know both device have valid connections
			 */
			if(port1 == 1 && s1.fbNorth == null){
				if(fiber==null){
					fiber = new Fibre(getID(),s1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					s1.fbNorth = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 2 && s1.fbEast == null){
				if(fiber==null){
					fiber = new Fibre(getID(),s1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					s1.fbEast = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 3 && s1.fbSouth == null){
				if(fiber==null){
					fiber = new Fibre(getID(),s1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					s1.fbSouth = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 4 && s1.fbWest == null){
				if(fiber==null){
					fiber = new Fibre(getID(),s1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					s1.fbWest = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = s1;

		/* THREE PORT DEVICES */

		/*		CONVERTION FOR CIRCULATOR
		 * 					 1
		 * 			4
		 * 			---fb1---( )---fb2---
		 * 					  |		2
		 * 					 fb3
		 * 				     3|
		 *
		 */
		} else if(d1.getClass() == Circulator.export default class){
			//fail if already connected
			if(connectCount[d1Index]==3) return 1;

			Circulator c1 = (Circulator)d1;

			//if correct port and port is empty make new fiber there
			if(port1 == 2 && c1.fb2 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),c1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					c1.fb2 = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 3 && c1.fb3 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),c1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					c1.fb3 = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 4 && c1.fb1 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),c1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					c1.fb1 = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = c1;

		/*		CONVERTION FOR MIXER
		 * 					|1
		 * 					RF
		 * 			4		|
		 * 			--LO---( )---IF--
		 * 							2
		 * 				   3
		 *
		 */
		} else if(d1.getClass() == Mixer.export default class){

			//fail if already connected
			if(connectCount[d1Index] == 3) return 1;

			Mixer m1 = (Mixer)d1;

			//if correct port and port is empty make new fiber there
			if(port1 == 1 && m1.rfFiber == null){
				if(fiber==null){
					fiber = new Fibre(getID(),m1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					m1.rfFiber = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 2 && m1.ifFiber == null){
				if(fiber==null){
					fiber = new Fibre(getID(),m1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					m1.ifFiber = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 4 && m1.loFiber == null){
				if(fiber==null){
					fiber = new Fibre(getID(),m1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					m1.loFiber = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = m1;

		/* TWO PORT DEVICES */
		} else if (d1.getClass() == AOM.export default class) {
			//fail if already connected fully
			if(connectCount[d1Index]==2) return 1;

			AOM a1 = (AOM)d1;

			if(a1.fb1 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),a1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					a1.fb1 = fiber;
				}else{
					return 1;
				}
			} else if(a1.fb2 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),a1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					a1.fb2 = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}

			//add new device back to array
			d1 = a1;

		} else if(d1.getClass() == PhotonDetector.export default class){
			//fail if already connected fully
			if(connectCount[d1Index]==2) return 1;

			PhotonDetector p1 = (PhotonDetector)d1;

			if(p1.fbIn == null && port1 == 1){
				if(fiber==null){
					fiber = new Fibre(getID(),p1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					p1.fbIn = fiber;
				}else{
					return 1;
				}
			} else if(p1.fbOut == null && port1 == 3){
				if(fiber==null){
					fiber = new Fibre(getID(),p1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					p1.fbOut = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = p1;

		} else if(d1.getClass() == Component.export default class){
			//fail if already connected fully
			if(connectCount[d1Index]==2) return 1;

			Component c1 = (Component)d1;

			if(c1.fb1 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),c1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					c1.fb1 = fiber;
				}else{
					return 1;
				}
			} else if(c1.fb2 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),c1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					c1.fb2 = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}

			//add new device back to array
			d1 = c1;

		} else if(d1.getClass() == Filter.export default class){
			//fail if already connected fully
			if(connectCount[d1Index]==2) return 1;

			Filter f1 = (Filter)d1;

			if(f1.fb1 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),f1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					f1.fb1 = fiber;
				}else{
					return 1;
				}
			} else if(f1.fb2 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),f1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					f1.fb2 = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = f1;
		/*		CONVERTION FOR ISOLATOR
		 * 					1
		 * 		4--RECIEVE---()---SEND--2
		 * 					3
		 */
		} else if(d1.getClass() == Isolator.export default class ){
			//fail if already connected fully
			if(connectCount[d1Index]==2) return 1;

			Isolator i1 = (Isolator)d1;

			if(port1 == 4 && i1.receiveFb == null){
				if(fiber==null){
					fiber = new Fibre(getID(),i1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					i1.receiveFb = fiber;
				}else{
					return 1;
				}
			} else if(port1 == 2 && i1.sendFb == null){
				if(fiber==null){
					fiber = new Fibre(getID(),i1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					i1.sendFb = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = i1;


		}else if(d1.getClass() == Divider_Multiplier.export default class){
				//fail if already connected fully
				if(connectCount[d1Index]==2) return 1;

				Divider_Multiplier c1 = (Divider_Multiplier)d1;

				if(c1.fb1 == null){
					if(fiber==null){
						fiber = new Fibre(getID(),c1,null,0);
						check = connectSecondDevice(fiber,d2,port2,d2Index,false);
					}else{
						check = connectSecondDevice(fiber,d2,port2,d2Index,true);
					}

					if(check != 1){
						c1.fb1 = fiber;
					}else{
						return 1;
					}
				} else if(c1.fb2 == null){
					if(fiber==null){
						fiber = new Fibre(getID(),c1,null,0);
						check = connectSecondDevice(fiber,d2,port2,d2Index,false);
					}else{
						check = connectSecondDevice(fiber,d2,port2,d2Index,true);
					}

					if(check != 1){
						c1.fb2 = fiber;
					}else{
						return 1;
					}
				} else {
					return 1;
				}

				//add new device back to array
				d1 = c1;


		/* ONE PORT DEVICES */
		} else if (d1.getClass() == Laser.export default class) {
			//fail if already connected fully
			if(connectCount[d1Index]==1) return 1;

			Laser l1 = (Laser)d1;


			if(l1.fb1 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),l1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					l1.fb1 = fiber;
				}else{
					return 1;
				}

			} else {
				return 1;
			}
			//add new device back to array
			d1 = l1;

		} else if (d1.getClass() == FrequencySynthesizer.export default class){
			//fail if already connected fully
			if(connectCount[d1Index]==1) return 1;

			FrequencySynthesizer fs1 = (FrequencySynthesizer)d1;

			if(fs1.fb1 == null){
				if(fiber==null){
					fiber = new Fibre(getID(),fs1,null,0);
					check = connectSecondDevice(fiber,d2,port2,d2Index,false);
				}else{
					check = connectSecondDevice(fiber,d2,port2,d2Index,true);
				}

				if(check != 1){
					fs1.fb1 = fiber;
				}else{
					return 1;
				}
			} else {
				return 1;
			}
			//add new device back to array
			d1 = fs1;
		} else {
			return 1;
		}

		//add fiber to fb array if not from load
		if(!fbExist){
			let fbIndex = addFiber(fiber);

			//update connection pair matrix
			for(let i=0;i<device_to_fiber.length;i++){
				if(device_to_fiber[i][0]==-1){
					device_to_fiber[i][0] = d1Index;
					device_to_fiber[i][1] = d2Index;
					device_to_fiber[i][2] = port1;
					device_to_fiber[i][3] = port2;
					device_to_fiber[i][4] = fbIndex;
					break;
				}
			}

			//added to connect count
			connectCount[d1Index]++;

		}
		//add device back to array
		deviceAry[d1Index] = d1;
		return 0;

	}

	/**
	 * 		calls for connection to another device
	 *
	 * @param fb fiber linking this device
	 * @param d2 device being linked to
	 * @param port2 port of device being linked to
	 * @param d2Index index in device array
	 * @return 0 success, 1 if fail
	 */
	let connectSecondDevice(Fibre fb, Device d2, let port, let index, boolean fiberMade){

		/* FOUR PORT DEVICE */
		if(d2.getClass() == Splitter.export default class){

			Splitter s1 = (Splitter)d2;

			/*find selected port and if empty connect new fiber
			 * note we don't want to connect anything until we
			 * know both device have valid connections
			 */
			if(port == 1 && s1.fbNorth == null){
				s1.fbNorth = fb;
			} else if(port == 2 && s1.fbEast == null){
				s1.fbEast = fb;
			} else if(port == 3 && s1.fbSouth == null){
				s1.fbSouth = fb;
			} else if(port == 4 && s1.fbWest == null){
				s1.fbWest = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = s1;

		/* THREE PORT DEVICES */

		/*		CONVERTION FOR CIRCULATOR
		 * 					 1
		 * 			4
		 * 			---fb1---( )---fb2---
		 * 					  |		2
		 * 					 fb3
		 * 				     3|
		 *
		 */
		} else if(d2.getClass() == Circulator.export default class){
			//fail if already connected
			if(connectCount[index]==3) return 1;

			Circulator c1 = (Circulator)d2;

			//if correct port and port is empty make new fiber there
			if(port == 2 && c1.fb2 == null){
				c1.fb2 = fb;
			} else if(port == 3 && c1.fb3 == null){
				c1.fb3 = fb;
			} else if(port == 4 && c1.fb1 == null){
				c1.fb1 = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = c1;

		/*		CONVERTION FOR MIXER
		 * 					|1
		 * 					RF
		 * 			4		|
		 * 			--LO---( )---IF--
		 * 							2
		 * 				   3
		 *
		 */
		} else if(d2.getClass() == Mixer.export default class){

			//fail if already connected
			if(connectCount[index] == 3) return 1;

			Mixer m1 = (Mixer)d2;

			//if correct port and port is empty make new fiber there
			if(port == 1 && m1.rfFiber == null){
				m1.rfFiber = fb;
			} else if(port == 2 && m1.ifFiber == null){
				m1.ifFiber = fb;
			} else if(port == 4 && m1.loFiber == null){
				m1.loFiber = fb;
			} else {
			}
			//add new device back to array
			d2 = m1;

		/* TWO PORT DEVICES */
		} else if (d2.getClass() == AOM.export default class) {
			//fail if already connected fully
			if(connectCount[index]==2) return 1;


			AOM a1 = (AOM)d2;

			if(a1.fb1 == null){

				a1.fb1 = fb;
			} else if(a1.fb2 == null){

				a1.fb2 = fb;
			} else {
				return 1;
			}

			//add new device back to array
			d2 = a1;

		} else if(d2.getClass() == PhotonDetector.export default class){
			//fail if already connected fully
			if(connectCount[index]==2) return 1;

			PhotonDetector p1 = (PhotonDetector)d2;

			if(p1.fbIn == null && port == 1){
				p1.fbIn = fb;
			} else if(p1.fbOut == null && port == 3){
				p1.fbOut = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = p1;

		} else if(d2.getClass() == Component.export default class){
			//fail if already connected fully
			if(connectCount[index]==2) return 1;

			Component c1 = (Component)d2;

			if(c1.fb1 == null){
				c1.fb1 = fb;
			} else if(c1.fb2 == null){
				c1.fb2 = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = c1;

		} else if(d2.getClass() == Filter.export default class){
			//fail if already connected fully
			if(connectCount[index]==2) return 1;

			Filter f1 = (Filter)d2;

			if(f1.fb1 == null){
				f1.fb1 = fb;
			} else if(f1.fb2 == null){
				f1.fb2 = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = f1;
		/*		CONVERTION FOR ISOLATOR
		 * 					1
		 * 		4--RECIEVE---()---SEND--2
		 * 					3
		 */
		} else if(d2.getClass() == Isolator.export default class ){
			//fail if already connected fully
			if(connectCount[index]==2) return 1;

			Isolator i1 = (Isolator)d2;

			if(port == 4 && i1.receiveFb == null){
				i1.receiveFb = fb;
			} else if(port == 2 && i1.sendFb == null){
				i1.sendFb = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = i1;


		} else if(d2.getClass() == Divider_Multiplier.export default class){
				//fail if already connected fully
				if(connectCount[index]==2) return 1;

				Divider_Multiplier c1 = (Divider_Multiplier)d2;

				if(c1.fb1 == null){
					c1.fb1 = fb;
				} else if(c1.fb2 == null){
					c1.fb2 = fb;
				} else {
					return 1;
				}
				//add new device back to array
				d2 = c1;


		/* ONE PORT DEVICES */
		} else if (d2.getClass() == Laser.export default class) {
			//fail if already connected fully
			if(connectCount[index]==1) return 1;

			Laser l1 = (Laser)d2;

			if(l1.fb1 == null){
				l1.fb1 = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = l1;

		} else if (d2.getClass() == FrequencySynthesizer.export default class){
			//fail if already connected fully
			if(connectCount[index]==1) return 1;

			FrequencySynthesizer fs1 = (FrequencySynthesizer)d2;

			if(fs1.fb1 == null){
				fs1.fb1 = fb;
			} else {
				return 1;
			}
			//add new device back to array
			d2 = fs1;
		} else {
			return 1;
		}

		//add device to fiber connection if fiber was not made by loader
		if(!fiberMade){
			if(fb.d1==null){
				fb.d1 = d2;
			} else if (fb.d2 == null){
				fb.d2 = d2;
			} else {
				return 1;
			}

			//add to connection count array
			connectCount[index]++;
		}

		//add d2 back to array
		deviceAry[index] = d2;

		//SUCCESS
		return 0;
	}


	/**
	 * 		Set minimum power threshold of signals
	 *
	 * @param min new minimum value
	 * @return 0 on success 1 on failure
	 */
	let setMinPower( double min){
		Globals.MIN_POWER = min;
		return 0;
	}

/************************************************************Save******************************************************/
	/**
	 * save three arrays separately
	 * 1. deviceArry
	 * 2.FiberArry
	 * 3.device_to_fiber array
	 *
	 * @param pwd the path of the save file
	 * @return 0 on success 1 on failure
	 */
	let save(String pwd){
		boolean flag = false ;
		//make sure file saves with ".optc" extension
		for(let b = pwd.length()-1;b>=0;b--){
			//if dot found and five from end possible ".optc"
			if(pwd.charAt(b) == '.' && b == pwd.length()-5){
				if(pwd.charAt(b+1) != 'o')return 1;
				if(pwd.charAt(b+2) != 'p')return 1;
				if(pwd.charAt(b+3) != 't')return 1;
				if(pwd.charAt(b+4) != 'c')return 1;
				flag = true;
			//if dot extension is wrong
			}else if(pwd.charAt(b) == '.'){
				return 1;
			//if at end no extension, add one
			}else if(b==0 && !flag){
				pwd += ".optc";
			}
			else{

			}
		}

		FileWriter fw;
		BufferedWriter rw;


		try {
			fw = new FileWriter(pwd);
		} catch (IOException e) {
			e.printStackTrace();
			return 1;
		}

		rw = new BufferedWriter(fw);
		//**********************************Save the currID ***********************************************************
		String currID_String = Integer.toString(currID);
		try {
			rw.write(currID_String);
			rw.newLine();
		}
		catch (IOException ioe) {
			   ioe.printStackTrace();
			   return 1;
		}
		//**********************************save all the devide in the device array to pwd*********************************
		Device d1 = null;
		for(let i=0;i<deviceAry.length;i++){
			if(deviceAry[i] != null){
				d1 = deviceAry[i];
				if(d1.getClass() == Splitter.export default class){
					String s = ((Splitter)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == AOM.export default class){
					String s = ((AOM)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Circulator.export default class){
					String s = ((Circulator)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Isolator.export default class){
					String s = ((Isolator)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Laser.export default class){
					String s = ((Laser)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Mixer.export default class){
					String s = ((Mixer)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == PhotonDetector.export default class){
					String s = ((PhotonDetector)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Component.export default class){
					String s = ((Component)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Divider_Multiplier.export default class){
					String s = ((Divider_Multiplier)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
				if(d1.getClass() == Filter.export default class){
					String s = ((Filter)d1).Object_to_Jason_String(i);
					try {
						rw.write(s);
						rw.newLine();
					}
					catch (IOException ioe) {
						   ioe.printStackTrace();
						   return 1;
					}
				}
			}
		}
		//******************************save all fibers*************************************
		Fibre fb = null;
		try {
			rw.write("fiber");				//indicating all line below is for fiber array
			rw.newLine();
		}
		catch (IOException ioe) {
			ioe.printStackTrace();
			return 1;
		}
		//save all the non-null fiber in the fiber array
		for(let i=0;i<fiberAry.length;i++){
			if(fiberAry[i] != null){
				fb = fiberAry[i];
				String s = fb.Object_to_Jason_String(i);
				try {
					rw.write(s);
					rw.newLine();
				}
				catch (IOException ioe) {
					   ioe.printStackTrace();
					   return 1;
				}
			}
		}
		//******************************save all Globals variables*************************************
		try {
			rw.write("globals");				//indicating all line below is for global variables
			rw.newLine();
		}
		catch (IOException ioe) {
			ioe.printStackTrace();
			return 1;
		}
		try {
			rw.write(Globals.Object_to_Jason_String());
			rw.newLine();
		}
		catch (IOException ioe) {
			   ioe.printStackTrace();
			   return 1;
		}
		//**************************************save device_to_fiber array*******************************************************
		try {
			rw.write("device to fiber");				//indicating all line below is for fiber array
			rw.newLine();
		}
		catch (IOException ioe) {
			ioe.printStackTrace();
			return 1;
		}
		for(let i=0; i< device_to_fiber.length; i++     ){
			if(device_to_fiber[i][0] != -1){
				String s = Globals.toString(device_to_fiber[i]);
				try {
					rw.write(s);
					rw.newLine();
				}
				catch (IOException ioe) {
					ioe.printStackTrace();
					return 1;
				}
			}
		}
		//*******************************************save connection count array********************************
		try {
			rw.write("connection count");				//indicating all line below is for fiber array
			rw.newLine();
		}
		catch (IOException ioe) {
			ioe.printStackTrace();
			return 1;
		}
		for(let i=0; i< connectCount.length; i++     ){
			if(connectCount[i] != 0){
				int[] a = new int[2];
				a[0] = connectCount[i];						//save it in an array [x,y]  x is the number of connection as represented by connectioncount[i]. while y is the index of that count in the connectioncount array
				a[1] = i;
				String s = Globals.toString(a);
				try {
					rw.write(s);
					rw.newLine();
				}
				catch (IOException ioe) {
					ioe.printStackTrace();
					return 1;
				}
			}
		}
		//**************************************************closing the buffered writer*****************************************************************
		try {
			rw.close();
		} catch (IOException e) {
			e.printStackTrace();
			return 1;
		}
		return 0;
	}

/****************************************************************Load******************************************************************/
	/**
	 * 		load from path if path black make new unsaved sim
	 * @return 0 on success 1 on failure
	 */
	static Simulator load(String pwd){

		//make sure file has ".json" extension
		for(let b = pwd.length()-1;b>=0;b--){
			//if dot found and five from end possible ".optc"
			if(pwd.charAt(b) == '.' && b == pwd.length()-5){
				if(pwd.charAt(b+1) != 'o')return null;
				if(pwd.charAt(b+2) != 'p')return null;
				if(pwd.charAt(b+3) != 't')return null;
				if(pwd.charAt(b+4) != 'c')return null;
				break;
			//if dot extension is wrong
			}else if(pwd.charAt(b) == '.'){
				return null;
			//if at end no extension, wrong
			}else if(b==0){
				return null;
			}
		}

		Simulator sim = new Simulator();
		FileReader fr;
		BufferedReader rd;

		try {
			fr = new FileReader(pwd);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		}

		rd = new BufferedReader(fr);

		//read the first line for currID value
		try {
			String currID_String = rd.readLine();
			let currID = Integer.parseInt(currID_String);
			sim.currID = currID;								//assiging it to the currID in sim instance
		}
		catch (IOException ioe) {
			ioe.printStackTrace();
			return null;
		}
		JSONParser parser=new JSONParser();
		try {
			String line = rd.readLine();
			Device device = null;
			while( line != null  && !line=="fiber")) {			//reading all the lines before "fiber"
				console.log(line);
				try {
					Object obj=parser.parse(line);
					Map array=(Map)obj;
					String type = (String) array.get("export default class_type");
					console.log(type);
					if(type=="Splitter")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						double primary_power = (Double) array.get("primary_power");
						double secondary_power = (Double) array.get("secondary_power");
						let index = Integer.parseInt( array.get("index").toString());
						device = new Splitter(name,absorption,reflection,enableRef,primary_power, secondary_power);
						device.label = label;
						device.type = 0;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;						//storing the splitter to the device array
					} else if(type=="PhotonDetector")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						double pConst = (Double) array.get("pConst");
						boolean enableRef = (Boolean) array.get("boolRef");
						let index = Integer.parseInt( array.get("index").toString());
						device = new PhotonDetector(name,absorption,reflection,enableRef);
						((PhotonDetector)device).pConst = pConst ;
						device.label = label;
						device.type = 1;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;						//storing the splitter to the device array

					} else if(type=="Mixer")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						double pConst = (Double)array.get("pConst");
						let index = Integer.parseInt( array.get("index").toString());
						device = new Mixer(name,absorption,reflection,enableRef,pConst);
						device.label = label;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						device.type = 2;
						sim.deviceAry[index] = device;
					} else if(type=="Laser")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String sigName = (String) array.get("sigName");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double power = (Double) array.get("power");
						double freq = (Double) array.get("freq");
						let index = Integer.parseInt( array.get("index").toString());
						device = new Laser(name,sigName,power,freq); //(5dB, 200THz)
						device.label = label;
						device.type = 3;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;
					} else if(type=="Isolator")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						let index = Integer.parseInt( array.get("index").toString());
						device = new Isolator(name,absorption,reflection,enableRef);
						device.label = label;
						device.type = 4;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;
					} else if(type=="Filter")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						double frequency_upper_limit = (Double) array.get("frequency_upper_limit");
						double frequency_lower_limit = (Double) array.get("frequency_lower_limit");
						char type_of_filter = ((String)array.get("type")).charAt(0);
						let index = Integer.parseInt( array.get("index").toString());
						device = new Filter(name,absorption,reflection,enableRef, frequency_upper_limit,frequency_lower_limit );
						device.label = label;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						((Filter)device).type_of_filter = type_of_filter;
						sim.deviceAry[index] = device;
						device.type = 5;
					} else if(type=="Component")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						let index = Integer.parseInt( array.get("index").toString());
						device = new Component(name,absorption,reflection, enableRef);
						device.label = label;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;
						device.type = 6;

					} else if(type=="Circulator")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						let index = Integer.parseInt( array.get("index").toString());
						double abs1_2 = (Double) array.get("abs1_2");
						double abs2_3 = (Double) array.get("abs2_3");
						device = new Circulator(name,absorption,reflection,enableRef,abs1_2,abs2_3);
						device.label = label;
						device.type = 7;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;
					} else if(type=="AOM")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						double frequency_shift = (Double) array.get("frequency_shift");
						boolean perturbation_flag = (Boolean) array.get("perturbation_flag");
						let index = Integer.parseInt( array.get("index").toString());
						device = new AOM(name,absorption,reflection,enableRef,frequency_shift);
						device.label = label;
						((AOM)device).perturbation_flag = perturbation_flag;
						device.type = 8;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;

					} else if(type=="Divider_Multiplier")){
						String name = (String) array.get("name");
						String label = (String) array.get("label");
						String x = (((ArrayList)array.get("coordinate")).get(0)).toString();
						String y = (((ArrayList)array.get("coordinate")).get(1)).toString();
						double reflection = (Double) array.get("reflection");
						double absorption = (Double) array.get("absorption");
						boolean enableRef = (Boolean) array.get("boolRef");
						double effect = (Double) array.get("effect");
						let index = Integer.parseInt( array.get("index").toString());
						device = new Divider_Multiplier(name,absorption,reflection, enableRef,effect);
						device.label = label;
						device.coordinate[0] = Integer.parseInt(x);
						device.coordinate[1] = Integer.parseInt(y);
						sim.deviceAry[index] = device;
						device.type = 9;

					}else{
						return null;
					}
				} catch (ParseException e) {
					e.printStackTrace();
					return null;
				}
				line = rd.readLine();
			}
			line = rd.readLine();				//get the line after "fiber"
			Fibre fb = null;
			while(line != null  && !line=="globals")) {
				console.log(line);
				try {
					Object obj=parser.parse(line);
					Map array=(Map)obj;
					String type = (String) array.get("export default class_type");
					console.log(type);
					String name = (String) array.get("name");
					double absorption = (Double) array.get("absorption");
					let index = Integer.parseInt( array.get("index").toString());
					fb = new Fibre(name, null, null, absorption);
					sim.fiberAry[index] = fb;
				}catch (ParseException e) {
					e.printStackTrace();
					return null;
				}
				line = rd.readLine();
			}
			line = rd.readLine();				//get the line after "globals"
			while(line != null  && !line=="device to fiber")) {
				console.log(line);
				try {
					Object obj=parser.parse(line);
					Map array=(Map)obj;
					String type = (String) array.get("export default class_type");
					console.log(type);
					double MIN_POWER = (Double) array.get("MIN_POWER");
					Globals.MIN_POWER = MIN_POWER;
				}catch (ParseException e) {
					e.printStackTrace();
					return null;
				}
				line = rd.readLine();
			}
			/*get the line after "device to fiber"*/
			line = rd.readLine();
			let counter = 0;							//a counter used to store numbers back into device to fiber array
			while(line != null && !line=="connection count") ) {
				console.log(line);
				//*****************converting the string back in to let array****************************
				String[] items = line.replaceAll("\\[", "").replaceAll("\\]", "").split(",");
				int[] results = new int[items.length];						//
				for (let i = 0; i < items.length; i++) {
				    try {
				        results[i] = Integer.parseInt(items[i]);
				        console.log(results[i]);
				    } catch (NumberFormatException nfe) {					//return null if the number format is wrong
				    	return null;
				    }
				}
				let d1_index = results[0];
				let d2_index = results[1];
				let p1 = results[2];
				let p2 = results[3];
				let fb_index = results[4];
				sim.device_to_fiber[counter][0] = d1_index;
				sim.device_to_fiber[counter][1] = d2_index;
				sim.device_to_fiber[counter][2] = p1;
				sim.device_to_fiber[counter][3] = p2;
				sim.device_to_fiber[counter][4] = fb_index;
				//***************************************************************************************
				//*************connecting the fiber to devices it is connected to
				assert sim.fiberAry[fb_index].d1 == null; 				//fiber should not be connected with any device before
				sim.fiberAry[fb_index].d1 = sim.deviceAry[d1_index];
				assert sim.fiberAry[fb_index].d2 == null; 				//fiber should not be connected with any device before
				sim.fiberAry[fb_index].d2 = sim.deviceAry[d2_index];

		//*************connecting the d1 to the fiber it is connected to********************************
				sim.connectDevices(sim.deviceAry[d1_index].name, sim.deviceAry[d2_index].name, p1, p2, sim.fiberAry[fb_index]);
		//**********************************************************************************************
				//next line

				counter++;
				line = rd.readLine();
			}
			/*get the line after "connection count"*/
			line = rd.readLine();
			while(line != null  ) {
				console.log(line);
				//*****************converting the string back in to let array****************************
				String[] items = line.replaceAll("\\[", "").replaceAll("\\]", "").split(",");
				int[] results = new int[items.length];						//
				for (let i = 0; i < items.length; i++) {
				    try {
				        results[i] = Integer.parseInt(items[i]);
				        console.log(results[i]);
				    } catch (NumberFormatException nfe) {					//return null if the number format is wrong
				    	return null;
				    }
				}
				sim.connectCount[ results[1] ]  = results[0]; 				//put the number in the connectCount array using the second number in th array as index
				line = rd.readLine();
			}

		//*****************************************the end of the save file*****************************************
		} catch (IOException e1) {
			e1.printStackTrace();
			return null;
		}

		try {
			rd.close();
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}

		return sim ;
	}


/********************************** SET/GET PROPERTY METHODS *******************************************************************************/




	/**
	 * 		Get Device custom label name
	 * @param iD of device
	 * @return custom label name of device
	 */
//	String getLabel(String iD){
//		Device d1 = getDevice(iD);
//		return d1.label;
//	}
//	this is not working -_-
	/**
	 * 		Set Device custom label name
	 * @param iD of device
	 * @return 0 if success
	 */
	let setLabel(String label,String iD){
		Device d1 = getDevice(iD);
		d1.label = label;
		return 0;
	}



	/**
	 * 		Change minimum power threshold of signals
	 *
	 * @param min new minimum value
	 * @return 0 on success 1 on failure
	 */
	let chngMinPower( double min){
		Globals.MIN_POWER = min;
		return 0;
	}

	/**
	 * 		Get the minimum power threshold for reflection
	 * @return minimum power threshold
	 */
	double getMinPower(){
		return Globals.MIN_POWER;
	}

	/**
	 * 		Get Device name
	 * @param iD of device
	 * @return name of device
	 */
	String getName(String iD){
		Device d1 = getDevice(iD);
		return d1.name;
	}

	/**
	 * 		Get fiber name
	 * @param iD of fiber
	 * @return name of fiber
	 */
	String getFiberName(String iD){
		Fibre fb = getFiber(iD);
		return fb.name;
	}

	/**
	 *		Get device type
	 * @param iD of device
	 * @return type of device
	 */
	let getType(String iD){
		Device d1 = getDevice(iD);
		return d1.type;
	}

	/**
	 * 		Toggle reflection property of a device
	 * @param iD of device
	 * @return 0 for success, 1 for fail
	 */
	let toggleRef(String iD){
		Device d1 = getDevice(iD);
		d1.boolRef = !(d1.boolRef);
		return 0;
	}

	/**
	 * 		Get reflection state from device
	 * @param iD of device
	 * @return state of reflection (ON/OFF)
	 */
	boolean getRefTogl(String iD){
		Device d1 = getDevice(iD);
		return d1.boolRef;
	}

	/**
	 * 		Set power constant in mixer
	 * @param pc new power constant
	 * @param iD of device
	 * @return 0 for success, 1 for fail
	 */
	let setPConst(double pc,String iD){
		Device d1 = getDevice(iD);

		if(d1.type == 1){
			PhotonDetector pd = (PhotonDetector)d1;
			pd.pConst = pc;
			return 0;
		}else if(d1.type == 2){
			Mixer m1 = (Mixer)d1;
			m1.pConst = pc;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get power constant from mixer
	 * @param iD of device
	 * @return power constant
	 */
	double getPConst(String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 1){
			PhotonDetector pd = (PhotonDetector)d1;
			return pd.pConst;
		}else if(d1.type == 2){
			Mixer m1 = (Mixer)d1;
			return m1.pConst;
		}
		return -1;
	}

	/**
	 * 		sets effect in Divider_Multiplier device
	 * @param effect new effect value
	 * @param iD ID of device
	 * @return 0 on success, 1 for fail
	 */
	let setEffect(double effect,String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 9){
			Divider_Multiplier dm = (Divider_Multiplier)d1;
			dm.effect = effect;
			return 0;
		}
		return 1;
	}

	/**
	 * 		gets effect in Divider_Multiplier device
	 * @param iD ID of device
	 * @return Divider_Multiplier effect or -1 for fail
	 */
	double getEffect(String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 9){
			Divider_Multiplier dm = (Divider_Multiplier)d1;
			return dm.effect;
		}
		return -1;
	}

	/**
	 * 		Sets generated signal name in laser and FrequencySynthesizer
	 * @param name new signal name
	 * @param iD of laser or FrequencySynthesizer
	 * @return 0 for success, 1 for fail
	 */
	let setSigName(String name, String iD){
		Device d1 = getDevice(iD);
		//if laser
		if(d1.type == 3){
			Laser l1 = (Laser)d1;
			l1.sigName = name;
			return 0;
		//if freqsynth
		} else if (d1.type == 5){
			FrequencySynthesizer f1 = (FrequencySynthesizer)d1;
			f1.signal.name = name;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Gets generated signal name in laser and FrequencySynthesizer
	 * @param iD of laser or FrequencySynthesizer
	 * @return signal name
	 */
	String getSigName(String iD){
		Device d1 = getDevice(iD);
		//if laser
		if(d1.type == 3){
			Laser l1 = (Laser)d1;
			return l1.sigName;
		//if freqsynth
		} else if (d1.type == 5){
			FrequencySynthesizer f1 = (FrequencySynthesizer)d1;
			return f1.signal.name;
		}
		return "";
	}


	/**
	 *
	 * 	 	change power of a potential signal generated by a device.
	 * 		this will only work when a freq syth or laser are selected
	 * @param pwr
	 * @param iD
	 * @return 0 for success, 1 for fail
	 */
	let setSigPower(double pwr,String iD){
		Device d1 = getDevice(iD);
		//if laser
		if(d1.type == 3){
			Laser l1 = (Laser)d1;
			l1.power = pwr;
			return 0;
		//if freqsynth
		} else if (d1.type == 5){
			FrequencySynthesizer f1 = (FrequencySynthesizer)d1;
			f1.power = pwr;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get Generated signal power from signal source
	 * @param iD of device
	 * @return generated signal power
	 */
	double getSigPower(String iD){
		Device d1 = getDevice(iD);
		double pwr = -1;
		//if laser
		if(d1.type == 3){
			Laser l1 = (Laser)d1;
			pwr = l1.power;
		}
		return pwr;
	}


	/**
	 * 		change frequency of a potential signal generated by a device.
	 * 		this will only work when a freq syth or laser are selected
	 * @param freq
	 * @param iD
	 * @return 0 for success, 1 for fail
	 */
	let setSigFreq(double freq,String iD){
		Device d1 = getDevice(iD);
		//if laser
		if(d1.type == 3){
			Laser l1 = (Laser)d1;
			l1.freq = freq;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get Generated signal frequency from signal source
	 * @param iD of device
	 * @return generated signal frequency
	 */
	double getSigFreq(String iD){
		Device d1 = getDevice(iD);
		double freq = -1;
		//if laser
		if(d1.type == 3){
			Laser l1 = (Laser)d1;
			freq = l1.freq;
		}
		return freq;
	}

	/**
	 * 		change absorption property of a device
	 *
	 * @param abs
	 * @param iD
	 * @return
	 */
	let setAbs(double abs, String iD){
		Device d1 = getDevice(iD);
		d1.absorption = abs;
		return 0;
	}

	/**
	 * 		get absorption property
	 * @param iD of device
	 * @return absorption property
	 */
	double getAbs(String iD){
		Device d1 = getDevice(iD);
		return d1.absorption;
	}


	/**
	 * 		change reflection property of a device
	 *
	 * @param ref new reflection value
	 * @param iD of device
	 * @return 0 for success, 1 for fail
	 */
	let setRef(double ref, String iD){
		Device d1 = getDevice(iD);
		d1.reflection = ref;
		return 0;
	}

	/**
	 * 		Get reflection property
	 * @param iD of device
	 * @return reflection property
	 */
	double getRef(String iD){
		Device d1 = getDevice(iD);
		return d1.reflection;
	}

	/**
	 * 		Set primary power in splitter
	 * @param pwr new primary power
	 * @param iD ID of splitter
	 * @return 0 on success, 1 on fail
	 */
	let setPrimary(double pwr, String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 0){
			Splitter s1 = (Splitter)d1;
			s1.primary_power = pwr;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get primary power from splitter
	 * @param iD ID of splitter
	 * @return power or -1
	 */
	double getPrimary(String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 0){
			Splitter s1 = (Splitter)d1;
			return s1.primary_power;
		}
		return -1;
	}

	/**
	 * 		Set secondary power in splitter
	 * @param pwr new primary power
	 * @param iD ID of splitter
	 * @return 0 on success, 1 on fail
	 */
	let setSecondary(double pwr, String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 0){
			Splitter s1 = (Splitter)d1;
			s1.secondary_power = pwr;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get secondary power from splitter
	 * @param iD ID of splitter
	 * @return power or -1
	 */
	double getSecondary(String iD){
		Device d1 = getDevice(iD);
		if(d1.type == 0){
			Splitter s1 = (Splitter)d1;
			return s1.secondary_power;
		}
		return -1;
	}



	/**
	 * 		Set lower frequency limit of filter
	 * @param lwr new lower frequency limit
	 * @param iD of device
	 * @return 0 for success, 1 for fail
	 */
	let setLowerLim(double lwr, String iD){
		Device d1 = getDevice(iD);
		//if filter
		if(d1.type == 5){
			Filter f1 = (Filter)d1;
			f1.frequency_lower_limit = lwr;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get lower limit property from filter
	 * @param iD of device
	 * @return lower limit property
	 */
	double getLowerLim(String iD){
		Device d1 = getDevice(iD);
		Globals.log(d1.getClass().toString());
		Filter f1 = (Filter)d1;
		return f1.frequency_lower_limit;

	}

	/**
	 * 		Set upper frequency limit of filter
	 * @param upr new upper frequency limit
	 * @param iD of device
	 * @return 0 for success, 1 for fail
	 */
	let setUpperLim(double upr, String iD){
		Device d1 = getDevice(iD);
		//if filter
		if(d1.type == 5){
			Filter f1 = (Filter)d1;
			f1.frequency_upper_limit = upr;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get Upper limit property from filter
	 * @param iD of device
	 * @return upper limit property
	 */
	double getUpperLim(String iD){
		Device d1 = getDevice(iD);
		Filter f1 = (Filter)d1;
		return f1.frequency_upper_limit;

	}

	/**
	 * 		Toggle perturbation in fiber
	 * @param iD of fiber
	 * @return 0 for success, 1 for fail
	 */
	let toglPertFiber(String iD){
		Fibre fb = getFiber(iD);
		fb.perturbation_flag = !fb.perturbation_flag;
		return 0;
	}

	/**
	 * 		Get perturbation value from fiber
	 * @param iD of fiber
	 * @return perturbation value
	 */
	boolean getPertFiber(String iD){
		Fibre fb = getFiber(iD);
		return fb.perturbation_flag;
	}

	/**
	 * 		Get log from fiber
	 * @param iD of fiber
	 * @return log string
	 */
	ArrayList<String[]> getLog(String iD){
		Fibre fb = getFiber(iD);
		return fb.log;
	}

	/**
	 * 		Set absorption of fiber
	 * @param abs new absorption value
	 * @param iD of fiber
	 * @return 0 for success, 1 for fail
	 */
	let setFiberAbs(double abs, String iD){
		Fibre fb = getFiber(iD);
		fb.absorption = abs;
		return 0;
	}

	/**
	 * 		Get absorption property of fiber
	 * @param iD of fiber
	 * @return absorption property
	 */
	double getFiberAbs(String iD){
		Fibre fb = getFiber(iD);
		return fb.absorption;
	}

	/**
	 * 		Set absorption between port 1 and 2 in circulator
	 * @param abs new absorption
	 * @param iD of circulator
	 * @return 0 for success, 1 for fail
	 */
	let setAbs1_2(double abs, String iD){
		Device d1 = getDevice(iD);
		//if Circulator
		if(d1.type == 7){
			Circulator c1 = (Circulator)d1;
			c1.abs1_2 = abs;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get absorption property for absorption between
	 * 		 port 1 and 2 in circulator
	 * @param iD of device
	 * @return absorption property
	 */
	double getAbs1_2(String iD){
		Device d1 = getDevice(iD);
		Circulator c1 = (Circulator)d1;
		return c1.abs1_2;

	}

	/**
	 * 		Set absorption between port 2 and 3 in circulator
	 * @param abs new absorption
	 * @param iD of circulator
	 * @return 0 for success, 1 for fail
	 */
	let setAbs2_3(double abs, String iD){
		Device d1 = getDevice(iD);
		//if Circulator
		if(d1.type == 7){
			Circulator c1 = (Circulator)d1;
			c1.abs2_3 = abs;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get absorption property for absorption between
	 * 		 port 1 and 2 in circulator
	 * @param iD of device
	 * @return absorption property
	 */
	double getAbs2_3(String iD){
		Device d1 = getDevice(iD);
		Circulator c1 = (Circulator)d1;
		return c1.abs2_3;
	}

	/**
	 * 		Set frequency shift in AOM
	 * @param fs new frequency shift
	 * @param iD of AOM
	 * @return 0 for success, 1 for fail
	 */
	let setFS(double fs, String iD){
		Device d1 = getDevice(iD);
		//if AOM
		if(d1.type == 8){
			AOM a1 = (AOM)d1;
			a1.frequency_shift = fs;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get  frequency shift of AOM
	 * @param iD of AOM
	 * @return frequency shift property
	 */
	double getFS(String iD){
		Device d1 = getDevice(iD);
		AOM a1 = (AOM)d1;
		return a1.frequency_shift;
	}

	/**
	 * 		Toggle perturbation in AOM
	 * @param iD of AOM
	 * @return 0 for success, 1 for fail
	 */
	let toglPertAOM(String iD){
		Device d1 = getDevice(iD);
		//if AOM
		if(d1.type == 8){
			AOM a1 = (AOM)d1;
			a1.perturbation_flag = !a1.perturbation_flag;
			return 0;
		}
		return 1;
	}

	/**
	 * 		Get perturbation value in AOM
	 * @param iD of AOM
	 * @return perturbation value
	 */
	boolean getPertAOM(String iD){
		Device d1 = getDevice(iD);
		AOM a1 = (AOM)d1;
		return a1.perturbation_flag;
	}
}
module.exports = Simulator;
