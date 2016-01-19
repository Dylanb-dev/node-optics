/**
 * 			Laser creates signals and specifies their properties
 * 			it also can't recieve a signal
 *
 */

class Laser extends Device {

	/**
	 * Constructor for laser
	 * @param name name of laser
	 * @param sigName name of signal generated
	 * @param power power of signal generated
	 * @param freq  frequency of signal generated
	 */
	public Laser(name, sigName, power, freq){

    this.fb1 = new Fibre();

    this.name = name;
		this.power = power; //store the power for saving
		this.freq = freq; //store the frequency for saving
		this.sigName = sigName;

    //create signal

		this.signal = new Signal(power, freq, sigName, name);
		this.sigName = sigName;
		this.power = power;
		this.freq = freq;

		this.coordinate = new int[2];	//construct a int[2] array to store x and y coordinates
	}

	/**
	 * 		send signal to fiber
	 */
	moveSignal(){
		//if sender not laser don't send
		if(signal.sender.equals(name)){
			fb1.moveSignal(signal);

		}
	}


	/**
	 * 		change output signal power
	 * @param power new power
	 */
	changeSignalPower(double power){
		signal.power = power;
	}

	/**
	 * 		change output signal frequency
	 * @param freq new frequency
	 */
	changeSignalFreq(double freq){
		signal.freq = freq;
	}

	/**
	 * 		change name of signal sender
	 * @param name new sender name
	 */
	chngSigSender(String name){
		signal.sender = name;
	}

	/**
	 * 		resets laser signal to orignal properties
	 */
	reset(){
		signal.name = this.sigName;
		signal.sender = this.name;
		signal.power = this.power;
		signal.freq = this.freq;
		signal.delta_f = new String[10];
		signal.coefficient = new double[10];

	}
}
module.exports = Laser;
