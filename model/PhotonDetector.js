/**
 * 		The photon detector stores a collection of all signals that it has recieved.
 * 		uppon reciving a new input signal a new beat output signal is produced from the
 * 		collection of signals in the detector.
 *
 * @author Zachary Newman
 *
 */
class PhotonDetector extends Device {

  /**
   *
   * @param name
   * @param abs
   * @param ref
   * @param enableRef
   */
  constructor(name, abs, ref, enableRef) {

    this.fbIn = new Fibre();
    this.fbOut = new Fibre();

    this.signals[] = new Signal(); //  public Signal signals[];
    this.beat = new Signal();

    this.name = name;
    this.pConst = 0.0;
    this.absorption = abs;
    this.reflection = ref;
    this.boolRef = enableRef;
    this.signals = new Signal[5];
    this.coordinate = new int[2]; //construct a int[2] array to store x and y coordinates
  }

  /**
   * 		Receive and process and send signal, photon detector is one way device, from fbin to fbout
   */
  moveSignal(signal) {

    //if sent from input continue otherwise fail
    if (fbIn != null && signal.sender.equals(fbIn.name)) {
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
  addSignal(sig) {
    //first check if any signal exist yet
    if (signals[0] == null) {
      signals[0] = sig;
      return 1;
    }
    //add to signals and create beats
    for (let i = 1; i < signals.length; i++) {
      if (signals[i] == null) {
        signals[i] = sig;
        createBeats(i);
        return 0;
      }
    }
    //if full expand array and add signal and create beat
    Signal swp[] = new Signal[signals.length + 5];
    let i = 0;
    for (i = 0; i < signals.length; i++) {
      swp[i] = signals[i];
    }
    swp[i] = sig; //swp[i+1] = sig;   i is already incremented by 1 from previous loop, so another i +1 will cause array out of boundray
    signals = swp;
    createBeats(i);
    return 0;
  }

  /**
   * 		create beat signal from signals array
   */
  createBeats(index) {
    //cycle through signals creating all new beats for added signal
    for (let i = 0; i < index; i++) { //for(int i=0;i<signals.length;i++) will make signals[i] pointing towards empty slot in the signals array, so need to fix this bug
      //if not added signal create new beat pair
      if (i != index) {

        beat = new Signal(signals[i].power + signals[index].power + this.pConst,
          Math.abs(signals[i].freq - signals[index].freq),
          "beat(" + signals[i].name + "+" + signals[index].name + ")",
          name);

        //************************
        //determining which signal has longer delta f terms
        //note .length only return the size of array, so its gonna be the same all the time, therefore, need to write a new method for
        //determining the number of non null elemets in a string array
        //non_zero_element_counter(String[] a)

        if (non_zero_element_counter(signals[index].delta_f) > non_zero_element_counter(signals[i].delta_f)) {
          perturbationBeat(beat, signals[i], signals[index]);
        } else {
          perturbationBeat(beat, signals[index], signals[i]);
        }
        //************************

        sendBeat();
      }
    }
  }

  sendBeat() {
    //if linked up send beat to next fiber
    if (fbIn != null && fbOut != null) {
      fbOut.moveSignal(beat);
    }
  }

  /**
   * 		move reflected signal back through input
   */
  reflectSignal(sig) {
    fbIn.moveSignal(sig);
  }

  /**
   * 		clears signals from array
   * 		clears signals from array & also clears beat
   */
  clearSigs() {
    for (int i = 0; i < signals.length; i++) {
      signals[i] = null;
    }
    beat = null;
  }
}
module.exports = PhotonDetector;
