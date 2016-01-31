
/**
 * 		super export default class for all devices. sets general export default class variables and device effects
 * 		caused by reflection and absorption.
 *
 * @author Zachary Newman and Dylan Broadbridge
 *
 */
export default class Device {

  constructor() {
    this.coordinate = new int[2];
    this.name = '';
    this.type;
    this.label = '';
    this.absorption; //+ or - dB from forward signal
    this.reflectSignal; //create reflected signal with + or - this dB from original signal
    /**
     * 		this is needed to specify weather the device has no reflection or
     * 		has reflection with no change to dBm power
     * 		true = ref false = no ref
     */
    this.boolRef;
  }

  moveSignal(signal) {}


  /**
   * 		simulates the effects of the component on the signal
   * 		dependent on the component properties (absorption, reflection)
   */
  deviceEffect(signal) {

    // add absorption if there
    if (absorption != 0) {
      signal.power = signal.power + absorption;;
    }

    //if device has reflection(dB) and is above threshold create reflection signal
    if (boolRef) {
      if ((signal.power + reflection) > Globals.MIN_POWER) {
        let reflectedSignal = new Signal(signal.power + reflection,
          signal.freq,
          signal.name + "_ref",
          signal.sender);

        //**************    the reflected signal inherit original signals perturbation
        inheritPerturbation(signal, reflectedSignal);
        //**************
        reflectSignal(reflectedSignal);
      }
    }

    /*add power shift here
    if(power_shift != 0){
    	signal.power = signal.power + power_shift;;
    }
    //add frequency shift here
    if(frequency_shift != 0){
    	signal.freq = signal.freq + frequency_shift;;
    }*/

  }

  //**********************************************************************************
  /**
   *	copying original signal's delta f terms and corresponding coefficient
   *	into the newly created signal
   */
  inheritPerturbation(original, duplicate) {
    // if (original.delta_f.length > duplicate.delta_f.length) {
    //   let a = new String[original.delta_f.length];
    //   duplicate.delta_f = a;
    //   let b = new double[original.delta_f.length];
    //   duplicate.coefficient = b;
    //
    // }

    //copy delta f and its coefficient into the new reflected signal
    const duplicate = original.slice();
    const original  = duplicate.slice();

  }

  /**
   *	create the delta f term resulting from signal a beating against signal b and copy the result into the signal beat
   *	@note calculation is done on a minus b so the sign of delta f may vary
   *  @note always assume a is always shorter or equal to b, first copy all delta f terms to beat, modification will be done later on
   * @param beat beat signal of a and b
   * @param a signal
   * @param b signal
   */

  perturbationBeat(beat, a, b) {

    inheritPerturbation(b, beat);
    let i = 0;
    let j = 0;
    let flag = 0;
    while (i < a.delta_f.length && a.delta_f[i] != null) {
      while (j < b.delta_f.length && b.delta_f[j] != null) {
        //Globals.log( b.delta_f[j]  );
        if (a.delta_f[i].equalsIgnoreCase(b.delta_f[j])) { //if found the same delta f term, then update the coefficient in the beat.
          beat.coefficient[j] -= a.coefficient[i];
          flag = 1;
          break;
        }
        j++;

      }

      if (flag == 0) {
        //after looping through b, if no delta f from a is found, then add the delta f term to beat, but with negative coefficient
        //Globals.log( beat.delta_f.length + "   " + a.delta_f.length    );
        //Globals.log( beat.name   );
        //Globals.log( beat.get_delta_f_in_string()  );
        //Globals.log( a.name   );
        //Globals.log( a.get_delta_f_in_string()  );
        beat.delta_f[j] = a.delta_f[i];
        beat.coefficient[j] = -a.coefficient[i];
      }
      j = 0; //re-initialise j
      flag = 0;
      i++;
    }
  }

  non_zero_element_counter(a) {
    counter = 0;
    for (s in a) {
      if (s != null) {
        counter++;
      }
    }
    return counter;
  }

  /**
   * 		decide where to move reflected signal
   */
  reflectSignal(sig) {}
}
