/**
 * fiber link is different from normal fiber class in a sense that it will introduce power shift in the signal as well as delta f tem
 * . therefore, in the constructor of FiberLink, the final parameter is power_shift, indicating how much it \
 * effect the power of signals that pass through it.
 *
 * @author Yiyang Gao
 */

public class FiberLink extends Fibre {

  //constructor for between cmps
  constructor(name, d1, d2, power_shift) {
    this.d1 = d1;
    this.d2 = d2;
    this.name = name;
    this.power_shift = power_shift;
    this.log = name + " Log:" + System.getProperty("line.separator");
  }


  /*
   * 	sends signal across fiber link from device1 to device2
   */
  moveSignal(Signal signal) {

    console.log(name + ": transfering signal");
    log(signal); //log signal properties


    //*************     add delta f perturbation to the signal
    signal.add_delta_f(Globals.delta + name);
    //*************

    signal.powerChange(power_shift); //shift signal's power

    //if signal was sent from d1 send to d2 else send to d1
    if (d1 != null && signal.sender==d1.name) { //check if fb1 is null first
      signal.sender = name; //update sender to fiber
      d2.moveSignal(signal); //send to d2
    }
    if (d2 != null && signal.sender==d2.name) { //check if fb2 is null first
      signal.sender = name;
      d1.moveSignal(signal);
    }
  }
}
module.exports = FibreLink;
