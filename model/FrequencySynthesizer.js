/**
 * 		A frequency synthesizer produces an electronic signal between 0 Hz and 20 GHz,
 * 		with output powers ranging from -110 dBm to +20 dBm.
 *		Our synthesizers have an input which allows
 *		them to take our near-DC error signals and raise or
 *		lower their output frequency in response to that error signal.
 *		This is how we lock our servo loop.
 *
 *		frequency synthesizer just take a frequency as parameter and generate a signal at the specified frequency and power.
 *
 * @author Yiyang Gao
 *
 */
FrequencySynthesizer extends Device {

  /**
   * constructor for frequency synthesizer
   *
   */
  constructor(name, sigName, fq, pw) {
    this.fb1 = new Fibre();
    this.name = name;
    this.frequency = fq; //synthsizer will generate signal at this frequency
    this.power = pw; //synthsizer will generate signal at this power
    this.signal = new Signal(frequency, power, sigName, name);
    this.coordinate = new int[2]; //construct a int[2] array to store x and y coordinates
  }

  /**
   *  method that switch on frequency synthesizer
   *
   */
  Fequency_Synthesizer_Siwtch_On() { //?????????????????  is it likely connected to

    if (fb1 != null) {
      fb1.moveSignal(signal);
    }
  }
  
}
module.exports = FrequencySynthesizer;
