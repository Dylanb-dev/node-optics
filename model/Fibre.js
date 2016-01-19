'use strict';

class Fibre {

	 constructor(name, d1, d2, abs){
		this.d1 = d1;
		this.d2 = d2;
		this.name = name;
		this.absorption = abs;
    this.log = [];

		//default is that all fibre's perturbation is considered
		this.perturbation_flag = true;

	}


	/**
	 * switch on the perturbation od AOM by setting perturbation_flag as true
	 */
	perturbation_on(){
		this.perturbation_flag = true;
	}

	/**
	 * switch off the perturbation od AOM by setting perturbation_flag as false
	 */
	perturbation_off(){
		this.perturbation_flag = false;
	}



	/*
	 * 	sends signal across link device1 to device2
	 */
	moveSignal(signal){

		signal.power += absorption;		//add power loss

		//add delta f perturbation to the signal
		if(perturbation_flag){
			signal.add_delta_f('\u0394' +'F'  +this.name);
		}

	log(signal);					//log signal properties

		//if signal was sent from d1 send to d2 else send to d1
		if(d1!= null && signal.sender == d1.name){				//check if fb1 is null first
			signal.sender = name;			//update sender to fiber
			d2.moveSignal(signal);	//send to d2
		}
		if( d2!= null && signal.sender == d2.name  ){			//check if fb2 is null first
			signal.sender = name;
			d1.moveSignal(signal);
		}
	}

	/*
	 * 	logs signals that have passed through this fiber and their details
	 */
	log(signal){
		let sig = [];
    var d = new Date();
    sig[0] = '' +(d.nanoTime());
		sig[1] = signal.name;
		sig[2] = signal.sender;
		sig[3] = ''+signal.power;
		sig[4] = ''+signal.freq;
		sig[5] = signal.get_delta_f_in_string();
		log.push(sig);

	}

}
module.exports = Fibre;
