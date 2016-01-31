 

/**
 * 			A device to make a frequency multiplier or a divider depending
 * 			on the specified effect value.
 * 			Divides or multiplies both the frequency and the perturbation
 * 			frequencies.
 *
 * @author Zachary Newman and Dylan Broadbridge
 *
 */
const Device = require('./Device.js');

export default class Divider_Multiplier extends Device {


  /**
   * 		Constructor
   * @param name name of device
   * @param abs absorption on device
   * @param ref reflection of device
   * @param enableRef
   * @param effect multiply/divide effect of device
   */
  constructor(name, abs, ref, enableRef, effect) {

    this.fb1 = new Fibre();
    this.fb2 = new Fibre();
    this.effect;   //effect on signal frequency
    this.name = name;
    this.reflection = ref;
    this.absorption = abs;
    this.boolRef = enableRef;
    this.effect = effect;
  }

  /**
   * 		recieve and proccess and send signal
   */

  moveSignal(signal) {
    //add general effect
    deviceEffect(signal);
    //add multiply/divide effect
    freqEffect(signal);
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
   * 		Adds effect to incoming signal
   * @param sig signal coming in
   */
  freqEffect(sig) {
    //add effect to frequency
    sig.freq = sig.freq * effect;
    //add effect to each coefficient
    for (let i = 0; i < sig.delta_f.length; i++) {
      if (sig.delta_f[i] != null) {
        sig.coefficient[i] = sig.coefficient[i] * effect;
      }
    }
  }

  /**
   * 		decide where to move reflected signal and sends
   */
   reflectSignal(sig) {
    if (sig.sender==fb1.name) {
      sig.sender = name;
      fb1.moveSignal(sig);
    } else {
      sig.sender = name;
      fb2.moveSignal(sig);
    }
  }

}
module.exports = Divider_Multiplier;
