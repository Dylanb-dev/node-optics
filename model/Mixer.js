

/**
 * 	Electronic mixers are 3-port devices. A signal of interest
 * is fed into the RF port and beats against a stable reference
 * signal fed into the LO port. The beat products are produced at
 * the IF port. Power output is the addition of these signals powers
 * plus a constant.
 *
 * @author Zachary Newman and Dylan Broadbridge
 *
 */
const Device = require('./Device.js');

export default class Mixer extends Device {

	/**
	 * constructor
	 * @param name  name of mixer
	 * @param abs   absorption of mixer
	 * @param ref   reflection of mixer
	 * @param enableRef  indicating this mixer
	 * @param pConst
	 */

	constructor(name, abs, ref, enableRef, pConst){
    super();

    //connecting fibers
    this.rfFiber = new Fibre();
    this.loFiber = new Fibre();
    this.ifFiber = new Fibre();

    //RF and LO signals
    this.rfSig = new Signal();
    this.loSig = new Signal();
    this.beat = new Signal();

    //beat signal produce
    this.beat_up_converted = new Signal();
    this.beat_down_converted = new Signal();


    this.name = name;
		this.reflection=ref;
		this.boolRef = enableRef;
		this.absorption=abs;

    //power constants
    this.pConst = pConst;
    this.leakage = -10.0;

    //signal arrays and beat
		this.rfSignals = new Signal[50];
		this.loSignals = new Signal[50];

    //construct a int[2] array to store x and y coordinates
		this.coordinate = new int[2];
	}

	/**
	 * 		Receive and process and send signal
	 */
	moveSignal(signal){

		//if sender is lo or rf add signal
		if((loFiber!=null && signal.sender==loFiber.name) || (rfFiber!=null && signal.sender==rfFiber.name)){
			deviceEffect(signal);
			addSignal(signal);
		}
	}

	/**
	 * 		add signal to signals array
	 *
	 * @param sig, signal being added to photon detector
	 * @return 0 beat was created from added signal, 1 otherwise
	 */
	addSignal(sig){

		//send signal on first with leakage
		beat = sig;
		beat.power += leakage;
		sendBeat();

		//add signal to array, make beats, send them
		if(loFiber!=null && sig.sender==loFiber.name){
			for(let i=0;i<loSignals.length;i++){
				if(loSignals[i] == null){
					loSignals[i] = sig;
					createBeats(i,0);
					return 0;
				}
			}
		}else if(rfFiber!=null && sig.sender==rfFiber.name){
			for(let i=0;i<rfSignals.length;i++){
				if(rfSignals[i] == null){
					console.log("DSSD"+i);
					rfSignals[i] = sig;
					createBeats(i,1);
					return 0;
				}
			}
		}
		return 1;
	}


	/**
	 * 		Create beat signal/signals for newly added signal
	 * @param index of newly added signal
	 * @param port 0 = loport signal 1 = rfport signal
	 */
	createBeats(index, port){

		//if sig from loport
		if(port === 0){
			for(let b=0;b<loSignals.length;b++){
				if(loSignals[b]!=null && b != index){
					//MIX UP
					beat = new Signal(		loSignals[index].power+loSignals[b].power+pConst,
							 				loSignals[index].freq + loSignals[b].freq,
							 				"Mix"+this.name+"U("+loSignals[index].name+"+"+loSignals[b].name+")",
							 				name);

					perturbationBeat(beat, loSignals[index], loSignals[b] );
					sendBeat();

					//MIX DOWN
					beat = new Signal(		loSignals[index].power+loSignals[b].power+pConst,
			 								Math.abs(loSignals[index].freq-loSignals[b].freq),
			 								"Mix"+this.name+"D("+loSignals[index].name+"+"+loSignals[b].name+")",
			 								name);

					perturbationBeat(beat, loSignals[index], loSignals[b] );
					sendBeat();
				}
			}

			for(let b=0;b<rfSignals.length;b++){
				if(rfSignals[b]!=null){
					//MIX UP
					beat = new Signal(		loSignals[index].power+rfSignals[b].power+pConst,
							 				loSignals[index].freq + rfSignals[b].freq,
							 				"Mix"+this.name+"U("+loSignals[index].name+"+"+rfSignals[b].name+")",
							 				name);

					perturbationBeat(beat, loSignals[index], rfSignals[b] );
					sendBeat();

					//MIX DOWN
					beat = new Signal(		loSignals[index].power+rfSignals[b].power+pConst,
			 								Math.abs(loSignals[index].freq-rfSignals[b].freq),
			 								"Mix"+this.name+"D("+loSignals[index].name+"+"+rfSignals[b].name+")",
			 								name);

					perturbationBeat(beat, loSignals[index], rfSignals[b] );
					sendBeat();
				}
			}

		//if sig from rfport
  }else if(port === 1){

			for(let b=0;b<rfSignals.length;b++){
				if(rfSignals[b]!=null && b != index){
					//MIX UP
					beat = new Signal(		rfSignals[index].power+rfSignals[b].power+pConst,
							 				rfSignals[index].freq + rfSignals[b].freq,
							 				"Mix"+this.name+"U("+rfSignals[index].name+"+"+rfSignals[b].name+")",
							 				name);

					perturbationBeat(beat, rfSignals[index], rfSignals[b] );
					sendBeat();

					//MIX DOWN
					beat = new Signal(		rfSignals[index].power+rfSignals[b].power+pConst,
			 								Math.abs(rfSignals[index].freq-rfSignals[b].freq),
			 								"Mix"+this.name+"D("+rfSignals[index].name+"+"+rfSignals[b].name+")",
			 								name);

					perturbationBeat(beat, rfSignals[index], rfSignals[b] );
					sendBeat();
				}
			}

			for(let b=0;b<loSignals.length;b++){
				if(loSignals[b]!=null){
					//MIX UP
					beat = new Signal(		rfSignals[index].power+loSignals[b].power+pConst,
							 				rfSignals[index].freq + loSignals[b].freq,
							 				"Mix"+this.name+"U("+rfSignals[index].name+"+"+loSignals[b].name+")",
							 				name);

					perturbationBeat(beat, rfSignals[index], loSignals[b] );
					sendBeat();

					//MIX DOWN
					beat = new Signal(		rfSignals[index].power+loSignals[b].power+pConst,
			 								Math.abs(rfSignals[index].freq-loSignals[b].freq),
			 								"Mix"+this.name+"D("+rfSignals[index].name+"+"+loSignals[b].name+")",
			 								name);

					perturbationBeat(beat, rfSignals[index], loSignals[b] );
					sendBeat();
				}
			}
		}
	}

	/**
	 * 		send beat to IF fibre
	 */
	sendBeat(){
		if(ifFiber!=null){
			ifFiber.moveSignal(beat);
		}
	}

	/**
	 * 		decide where to move reflected signal and send
	 */
   reflectSignal(sig){
		if(sig.sender==rfFiber.name){
			sig.sender = name;
			rfFiber.moveSignal(sig);
		} else if(sig.sender==loFiber.name) {
			sig.sender = name;
			loFiber.moveSignal(sig);
		}
	}

	/**
	 * 		clears signals from array & beat is also cleared
	 */
	clearSigs(){
		for(let i=0;i<loSignals.length;i++){
			loSignals[i] = null;
			rfSignals[i] = null;
		}
		beat = null;
	}

}
module.exports = Mixer;
