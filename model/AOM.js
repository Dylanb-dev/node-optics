class AOM extends Device {
  /**
   *
   * @param name  name of AOM
   * @param abs  absorbtion of the device
   * @param ref  reflection of AOM
   * @param enableRef  weather AOM introduce an reflection of signal
   * @param fs  frequency shift of AOM
   * @note perturbation_flag is set to be true by default. It can be switched on and off by calling method perturbation_on（） and
   * 			perturbation_off（）
   */
  constructor(name, abs, ref, enableRef, fs) {
    this.typeName = "AOM";
    this.name = name;
    this.reflection = ref;
    this.boolRef = enableRef;
    this.absorption = abs;
    this.frequency_shift = fs;
    this.perturbation_flag = true; //flag to indicate weather peerturbation of AOM appears in the final result
    this.coordinate = new int[2]; //construct a int[2] array to store x and y coordinates
  }


  moveSignal(signal) {
      deviceEffect(signal);
      aomShifts(signal);
      //if not end of line send on
      if (fb1 != null && fb2 != null) {
        //if signal was sent from fb1 send to fb2 else send to fb1
        if (signal.sender==fb1.name) {
          signal.sender = name; //update sender to this component
          fb2.moveSignal(signal); //send to fb2
        } else {
          signal.sender = name;
          fb1.moveSignal(signal);
        }
      }
    }
    /**
     * switch on the perturbation od AOM by setting perturbation_flag as true
     */
  perturbation_on() {
    perturbation_flag = true;
  }

  /**
   * switch off the perturbation od AOM by setting perturbation_flag as false
   */
  perturbation_off() {
    perturbation_flag = false;
  }

  /**
   * 		receive and process signal,
   * 	    add perturbation to signal if perturbation_flag is true
   * @param signal signal being processed
   */
  aomShifts(signal) {
    signal.freq += frequency_shift;
    if (perturbation_flag) {
      signal.add_delta_f(Globals.delta + "AOM" + name);
    }
  }
}
module.exports = AOM;
