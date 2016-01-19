/**
 * 		A Circulator is a 3-port device in which a signal that enters port 1
 * 		leaves port 2, and a signal that enters port 2 leaves port 3. There
 * 		will be a certain amount of power loss from 1-to-2 and 2-to-3 that can
 * 		be specified.
 *
 * @author Zachary Newman
 *
 */
class Circulator extends Device {


	/**
	 * @param name name of the circulator
	 * @param abs absorption
	 * @param ref reflection
	 * @param enableRef indication if there is reflection
	 * @param abs1_2  absorption in dB from port 1 to 2
	 * @param abs2_3  absorption in dB from port 2 to 3
	 * constructor
	 */
   constructor(name, abs, ref, enableRef, abs1_2, abs2_3){


    //connecting fibers
    this.fb1 = new Fibre;
    this.fb2 = new Fibre;
    this.fb3 = new Fibre;


    this.name = name;
		this.absorption = abs;
		this.reflection = ref;
		this.boolRef = enableRef;
		this.abs1_2 = abs1_2; 	//absorption in dB from port 1 to 2
		this.abs2_3 = abs2_3;   //absorption in dB from port 2 to 3
		this.coordinate = new int[2];	//construct a int[2] array to store x and y coordinates
	}

	/**
	 * 		receive and process and send signal
	 */
	moveSignal(signal){

		if(fb1!=null && signal.sender.equals(fb1.name)){
			//add ref and overall abs effects
			deviceEffect(signal);
			signal.power += abs1_2;
			signal.sender = name;
			signal.name += "_circ12";
			if(fb2!=null){
				fb2.moveSignal(signal);
			}
		} else if(fb2!=null && signal.sender.equals(fb2.name)) {
			//add ref and overall abs effects
			deviceEffect(signal);
			signal.power += abs2_3;
			signal.sender = name;
			signal.name += "_circ23";
			if(fb3!=null){
				fb3.moveSignal(signal);
			}
		}
	}

	/**
	 * @param sig the signa being reflected
	 * 		decide where to move reflected signal and send
	 */
	@Override
	reflectSignal(sig){
		if(sig.sender.equals(fb1.name)){
			sig.sender = name;
			fb1.moveSignal(sig);
		} else if(sig.sender.equals(fb2.name)) {
			sig.sender = name;
			fb2.moveSignal(sig);
		} else {
			sig.sender = name;
			fb3.moveSignal(sig);
		}
	}

}
module.exports = Circulator;
