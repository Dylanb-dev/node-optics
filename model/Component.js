/**
 * 		Components are those that exits between fibers, these cause
 * 		reflections, power changes and in some cases shifts in freq
 *
 */

class Component extends Device {

	/**
	 *
	 * @param name
	 * @param abs
	 * @param ref
	 * @param enableRef
	 */
	constructor(name, abs, ref, enableRef){

      this.fb1 = new Fibre;
      this.fb2 = new Fibre;
			this.name = name;
			reflection = ref;
			absorption = abs;
			boolRef = enableRef;
	}


	/**
	 * 		recieve and proccess and send signal
	 */
	moveSignal(signal){

		deviceEffect(signal);
		//if not end of line send on
		if(fb1 != null && fb2 != null){
			//if signal was sent from fb1 send to fb2 else send to fb1
			if(signal.sender==fb1.name){
				signal.sender = name;			//update sender to this component
				fb2.moveSignal(signal);			//send to fb2
			} else {
				signal.sender = name;
				fb1.moveSignal(signal);
			}
		}
	}

	/**
	 * 		decide where to move reflected signal and sends
	 */
   reflectSignal(sig){
		if(sig.sender==fb1.name){
			sig.sender = name;
			fb1.moveSignal(sig);
		} else {
			sig.sender = name;
			fb2.moveSignal(sig);
		}
	}

}
module.exports = Component;
