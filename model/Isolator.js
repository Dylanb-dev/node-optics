class Isolator extends Device {

	/**
	 * Constructor for isolator
	 * @param name name of the isolator
	 * @param abs  absorption of isolator
	 * @param ref  reflection of the isolator
	 * @param enableRef indicating if there is reflection on isolator
	 *
	 */
	public Isolator(name, abs, ref, enableRef){
    //fibers isolator is connected with
    this.receiveFb = new Fibre();
    this.sendFb = new Fibre();

    this.name = name;
		this.absorption = abs;
		this.reflection = ref;
		this.boolRef = enableRef;
		this.coordinate = new int[2];	//construct a int[2] array to store x and y coordinates

	}

	//only allowing signal to travel from receiving fiber to sending fiber

	moveSignal(signal){
		if(signal.sender==receiveFb.name){
			signal.sender = name;
			sendFb.moveSignal(signal);
		}
	}

	/**
	 * 		decide where to move reflected signal and sends
	 */
	reflectSignal(Signal sig){
		if(sig.sender==receiveFb.name){
			sig.sender = name;
			receiveFb.moveSignal(sig);
		} else {
			sig.sender = name;
			sendFb.moveSignal(sig);
		}
	}

}
module.exports = Isolator;
