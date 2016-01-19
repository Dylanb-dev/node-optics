'use-strict';

class Splitter extends Device {

  /**
   *
   * @param name
   * @param abs
   * @param ref
   * @param enableRef
   * @param absN
   * @param absE
   * @param absS
   * @param absW
   */
  public Splitter(String name, double abs, double ref, boolean enableRef,
    double power1, double power2) {

    //connecting fibers , north, east, south, west

    this.fbNorth = new Fibre();
    this.fbEast = new Fibre();
    this.fbSouth = new Fibre();
    this.fbWest = new Fibre();

    /*	power 1 is the power drop one, and power 2 is the power drop two.
     *  if its a 50%/50%   then power1 = -3 ,  power2  = -3
     *  if its a 90%/10%   then power1 = -10,  power2  = -0.46
     *            */

    this.primary_power = power1;
    this.secondary_power = power2;

    this.name = name;
    this.reflection = ref;
    this.boolRef = enableRef;
    this.absorption = abs;



    this.coordinate = new int[2]; //construct a int[2] array to store x and y coordinates
  }

  /**
   * 		recieve and proccess and send signal
   */
  @
  Override
  public void moveSignal(Signal signal) {
    //add device effects
    deviceEffect(signal);
    Globals.log("inside the move signal method");
    //if the signal is sent from west   signal will be sent out east and north
    if (fbWest != null && signal.sender==fbWest.name) {
      //create two new split signals and send
      //create north signal and inherit perturbation
      Signal sigN = new Signal(signal.power + primary_power, signal.freq, signal.name + "_split" + name + ":A", name);
      inheritPerturbation(signal, sigN);
      //create east signal and inherit perturbation
      Signal sigE = new Signal(signal.power + secondary_power, signal.freq, signal.name + "_split" + name + ":B", name);
      inheritPerturbation(signal, sigE);

      //move signals
      if (fbNorth != null) {
        fbNorth.moveSignal(sigN);
      }
      if (fbEast != null) {
        fbEast.moveSignal(sigE);
      }
    }
    //if the signal is sent from north  signal will be sent out west and south
    else if (fbNorth != null && signal.sender==fbNorth.name) {
      //create two new split signals and send

      //create west signal and inherit perturbation
      Signal sigW = new Signal(signal.power + primary_power, signal.freq, signal.name + "_split" + name + ":1", name);
      inheritPerturbation(signal, sigW);

      //create south signal and inherit perturbation
      Signal sigS = new Signal(signal.power + secondary_power, signal.freq, signal.name + "_split" + name + ":2", name);
      inheritPerturbation(signal, sigS);

      //move signals
      if (fbSouth != null) {
        fbSouth.moveSignal(sigS);
      }
      if (fbWest != null) {
        fbWest.moveSignal(sigW);
      }
    }
    //if the signal is sent from east  signal will be sent out south and west
    else if (fbEast != null && signal.sender==fbEast.name) {
      //create two new split signals and send

      //create south signal and inherit perturbation

      Signal sigS = new Signal(signal.power + primary_power, signal.freq, signal.name + "_split" + name + ":2", name);
      inheritPerturbation(signal, sigS);
      //create west signal and inherit perturbation
      Signal sigW = new Signal(signal.power + secondary_power, signal.freq, signal.name + "_split" + name + ":1", name);
      inheritPerturbation(signal, sigW);

      //move signals
      //move signals
      if (fbSouth != null) {
        fbSouth.moveSignal(sigS);
      }
      if (fbWest != null) {
        fbWest.moveSignal(sigW);
      }
    }
    //if signal is sent from south   signal will be sent out east and north
    else if (fbSouth != null && signal.sender==fbSouth.name) {
      //create two new split signals and send

      Signal sigN = new Signal(signal.power + secondary_power, signal.freq, signal.name + "_split" + name + ":A", name);
      inheritPerturbation(signal, sigN);

      //create east signal and inherit perturbation
      Signal sigE = new Signal(signal.power + primary_power, signal.freq, signal.name + "_split" + name + ":B", name);
      inheritPerturbation(signal, sigE);

      //move signals
      if (fbNorth != null) {
        fbNorth.moveSignal(sigN);
      }
      if (fbEast != null) {
        fbEast.moveSignal(sigE);
      }
    }
  }


  /**
   * 		decide where to move reflected signal
   */
  @
  Override
  public void reflectSignal(Signal sig) {
    if (sig.sender==fbNorth.name) {
      sig.sender = name;
      fbNorth.moveSignal(sig);
    } else if (sig.sender==fbEast.name) {
      sig.sender = name;
      fbEast.moveSignal(sig);
    } else if (sig.sender==fbSouth.name) {
      sig.sender = name;
      fbSouth.moveSignal(sig);
    } else {
      sig.sender = name;
      fbWest.moveSignal(sig);
    }
  }

  /**
   * 	@param int index the index of this device in the device array
   * 	@return a Json string that contains all the instance variables
   */
  @
  Override
  public String Object_to_Jason_String(int index) {
    JSONArray list1 = new JSONArray();
    list1.add(this.coordinate[0]);
    list1.add(this.coordinate[1]);

    Map < String, Serializable > obj = new LinkedHashMap < String, Serializable > ();
    obj.put("class_type", this.getClass().getSimpleName().toString());
    obj.put("name", this.name);
    obj.put("coordinate", list1);
    obj.put("reflection", new Double(this.reflection));
    obj.put("absorption", new Double(this.absorption));
    obj.put("boolRef", new Boolean(this.boolRef));
    obj.put("primary_power", new Double(this.primary_power));
    obj.put("secondary_power", new Double(this.secondary_power));
    obj.put("label", this.label);
    obj.put("index", index);

    String jsonText = JSONValue.toJSONString(obj);
    System.out.println(jsonText);
    return jsonText;
  }

  /**
   * a method belong to slitter class, receive a jsonText, retract all the information from the text and reconstruct the splitter
   * @param jsonText
   * @return the index of this splitter in the device array
   */
  public static int Decode_Jason_String_to_Object(String jsonText) {

    return -1;
  }

}
module.exports = Splitter;
