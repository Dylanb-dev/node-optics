import Device from './Device.js';
import AOM from './AOM.js';
import Circulator from './Circulator.js';
import Component from './Component.js';
import Divider_Multiplier from './Divider_Multiplier.js';
import FiberLink from './FiberLink.js';
import Fibre from './Fibre.js';
import Filter from './Filter.js';
import FrequencySynthesizer from './FrequencySynthesizer.js';
import Globals from './Globals.js';
import Isolator from './Isolator.js';
import Laser from './Laser.js';
import Mixer from './Mixer.js';
import PhotonDetector from './PhotonDetector.js';
import Signal from './Signal.js';
import Simulator from './Simulator.js';
import Splitter from './Splitter.js';
/**
 *		Class for testing of the software. Including the gui and simulation of the optical fiber model
 *
 */

export default class test {

  //test0()
  //test1();
  //test2();
  //test3();
  //test4();
  //test5();
  //test6();
  //test7();
  //test8();
  //test9();
  //test10();
  //test11();
  //test12();
  //test13();

  //test17();
  //test18();

  test0() {
      console.log(Globals.delta);
      let a = new Signal(2, 2, "as", "asd");
      let b = new Signal(2, 3, "asd", "asdfa");
      console.log(a.delta_f.length + "this is it");

    }
    /*
     * 		test basic construction of simulation and basic run
     * 		with mirror reflecting signal back
     * 		let --- fiber ---- let --- fiber --- mirror
     */
  test1() {

    //drag and drop initilizes these objects
    let lazer = new Laser("Lazer1", "master", 10, 400);
    let cmp = new Component("Amp1", 0, 0, false);
    let mirror = new Component("Mirror1", 0, 0, true);

    //link drawn between initlizes fiber and links devices
    let fb = new Fibre("Fiber1", lazer, cmp, 0);
    let fb2 = new Fibre("Fiber2", cmp, mirror, 0);
    lazer.fb1 = fb;
    cmp.fb1 = fb;
    cmp.fb2 = fb2;
    mirror.fb1 = fb2;

    //press simulate!!!
    lazer.moveSignal();

    console.log("");
    console.log(fb.log);
    console.log(fb2.log);

  }

  /*
   * 		test more complicated circuit with splitter
   *
   * 							component1
   * 								|
   * 							  fiber2
   * 								|
   * 		let --- fiber1 ---- let --- fiber3 --- mirror
   * 								|
   * 							  fiber4
   * 								|
   * 							component2
   */
  test2() {

    //drag and drop initializes these objects
    let lazer = new Laser("Lazer1", "master", 10, 400);
    let split = new Splitter("split1", 0, 0, false, -3, -3);
    let cmp1 = new Component("Amp1", 0, 0, false);
    let cmp2 = new Component("Amp1", 0, 0, false);
    let mirror = new Component("Mirror1", 0, 0, true);

    //link drawn between initializes fiber and links devices
    let fb1 = new Fibre("Fiber1", lazer, split, 0);
    let fb2 = new Fibre("Fiber2", split, cmp1, 0);
    let fb3 = new Fibre("Fiber3", split, mirror, 0);
    let fb4 = new Fibre("Fiber4", split, cmp2, 0);

    lazer.fb1 = fb1;
    split.fbWest = fb1;
    split.fbNorth = fb2;
    split.fbEast = fb3;
    split.fbSouth = fb4;
    cmp1.fb1 = fb2;
    cmp2.fb1 = fb4;
    mirror.fb1 = fb3;

    //press simulate!!!
    lazer.moveSignal();

    console.log("");
    console.log(fb1.log);
    console.log(fb2.log);
    console.log(fb3.log);
    console.log(fb4.log);
  }


  test3() {

    /*
     * 		test more complicated circuit with splitter
     *
     * 							 mirror2
     * 								|
     * 							  fiber2
     * 								|
     * 		let --- fiber1 ---- let --- fiber3 --- mirror
     * 								|
     * 							  fiber4
     * 								|
     * 							Photon Detector
     *
     */

    //drag and drop initializes these objects
    let lazer = new Laser("Lazer1", "master", 10, 400);
    let split = new Splitter("split1", 0, 0, false, -3, -3);
    let mirror2 = new Component("Mirror2", 0, 0, true);
    let pd2 = new PhotonDetector("photon detector", 0, 0, false);
    let mirror = new Component("Mirror1", 0, 0, true);

    //link drawn between initializes fiber and links devices
    let fb1 = new Fibre("Fiber1", lazer, split, 0);
    let fb2 = new Fibre("Fiber2", split, mirror2, 0);
    let fb3 = new Fibre("Fiber3", split, mirror, 0);
    let fb4 = new Fibre("Fiber4", split, pd2, 0);

    lazer.fb1 = fb1;
    split.fbWest = fb1;
    split.fbNorth = fb2;
    split.fbEast = fb3;
    split.fbSouth = fb4;
    mirror2.fb1 = fb2;
    pd2.fbIn = fb4;
    mirror.fb1 = fb3;

    //press simulate!!!
    lazer.moveSignal();

    console.log("");
    console.log(fb1.log);
    console.log(fb2.log);
    console.log(fb3.log);
    console.log(fb4.log);


  }

  test4() {

    /*
     * 		test more complicated circuit with splitter
     *
     * 							 mirror2				  mirror3
     * 								| 						|
     * 							  fiber2				  fiber5
     * 								|						|
     * 		let --- fiber1 ---- let --- fiber3 --- splitter2-------fiber6-------mirror
     * 								|						|
     * 							  fiber4					|
     * 								|						|
     * 							Photon Detector
     *
     */

    //drag and drop initializes these objects
    let lazer = new Laser("Laser1", "master", 10, 400);
    let split = new Splitter("split1", 0, 0, false, -3, -3);
    let split2 = new Splitter("split2", 0, 0, false, -3, -3);
    let pd2 = new PhotonDetector("photon detector", 0, 0, false);
    let mirror = new Component("Mirror1", 0, 0, true);
    let mirror2 = new Component("Mirror2", 0, 0, true);
    let mirror3 = new Component("Mirror3", 0, 0, true);
    let cmp1 = new Component("Amp1", 0, 0, false);

    //link drawn between initializes fiber and links devices
    let fb1 = new Fibre("Fiber1", lazer, split, 0);
    let fb2 = new Fibre("Fiber2", split, mirror2, 0);
    let fb3 = new Fibre("Fiber3", split, split2, 0);
    let fb4 = new Fibre("Fiber4", split, pd2, 0);
    let fb5 = new Fibre("Fiber5", mirror3, split2, 0);
    let fb6 = new Fibre("Fiber6", split2, mirror, 0);
    let fb7 = new Fibre("Fiber7", split2, cmp1, 0);


    lazer.fb1 = fb1;
    split.fbWest = fb1;
    split.fbNorth = fb2;
    split.fbEast = fb3;
    split.fbSouth = fb4;
    mirror2.fb1 = fb2;
    pd2.fbIn = fb4;
    mirror.fb1 = fb6;
    mirror3.fb1 = fb5;
    split2.fbWest = fb3;
    split2.fbNorth = fb5;
    split2.fbEast = fb6;
    split2.fbSouth = fb7;

    //press simulate!!!
    lazer.moveSignal();

    console.log("");
    console.log(fb1.log);
    console.log(fb2.log);
    console.log(fb3.log);
    console.log(fb4.log);


  }
  test5() {

    /*
     * 		test more complicated circuit with splitter
     * 																				 mirror3
     * 																					|
     * 																					|
     * 																		 		fiber8
     * 																					|
     * 																					|
     * 																		   			AMO2
     * 							 mirror2				 		 			  			|
     * 								| 													|
     * 							  fiber2				  							fiber5
     * 								|											        |
     * 		let --- fiber1 ---- let --- fiber3 --- AOM --- FiberLink(fb7) --- splitter2-------fiber6-------Photon Detector2
     * 								|													|
     * 							  fiber4												|
     * 								|													|
     * 							Photon Detector
     * 								|
     * 								|
     * 							  fiber9
     * 								|
     * 								|
     * 								BPF
     * 								|
     * 								|
     * 							   fiber10
     * 								|
     * 								|
     * 	           FS----fiber11---mixer---fiber12---LPF----
     *
     *
     *
     */
    let f1 = 2.0 * Math.pow(10, 8); // let frequency is 200THz = 2 * 10^8 Mhz
    let aom_f = 50; //AOM frequency is 50MHz
    let aom_f2 = 40; //AOM2 frequency is 40MHz

    /*drag and drop initializes these objects*/

    //let generates 5dBm, 200Thz sig
    let lazer = new Laser("Lazer1", "master", 5, f1);

    //let with half power split
    let split = new Splitter("split1", 0, 0, false, -3, -3);
    let split2 = new Splitter("split2", 0, 0, false, -3, -3);

    let pd = new PhotonDetector("photon detector", 0, 0, false);
    let pd2 = new PhotonDetector("photon detector2", 0, 0, false);

    //mirror with 0.5dB asb
    let mirror2 = new Component("Mirror2", -0.5, 0, true);


    let mirror3 = new Component("Mirror3", -0.5, 0, true);

    //AOM with 2.5 dB power loss and 50MHz freq shift
    let AOM = new AOM("AOM", -2.5, 0, false, aom_f);

    //AOM with 2.5 dB power loss and 40MHz freq shift
    let AOM2 = new AOM("AOM2", -2.5, 0, false, aom_f2);

    //BPF sending signals between 160 and 190MHz
    let BPF = new Filter("BPF", -1, 0, false, 160, 370);

    //mixer
    let mixer = new Mixer("mixer", 0, 0, false, 0);

    //FS will generate frequency 180 MHz and at power = 5
    let FS = new FrequencySynthesizer("FS", "syth_sig", 5, 180);

    let LPF = new Filter("BPF", -1, 0, 3.8E8, 'L');


    //link drawn between initializes fiber and links devices
    let fb1 = new Fibre("Fiber1", lazer, split, 0); //normal fiber dones not introduce power shift
    let fb2 = new Fibre("Fiber2", split, mirror2, 0);
    let fb3 = new Fibre("Fiber3", split, AOM, 0);
    let fb4 = new Fibre("Fiber4", split, pd, 0);
    let fb5 = new Fibre("Fiber5", AOM2, split2, 0);
    let fb6 = new Fibre("Fiber6", split2, pd2, 0);

    //f7 is the fiber link which introduce a -10 power drop for signals passing through
    let fb7 = new Fibre("FiberLink", AOM, split2, -10);

    let fb8 = new Fibre("Fiber8", mirror3, AOM2, 0);
    let fb9 = new Fibre("Fiber9", pd, BPF, 0);
    let fb10 = new Fibre("Fiber10", BPF, mixer, 0);
    let fb11 = new Fibre("Fiber11", FS, mixer, 0);
    let fb12 = new Fibre("Fiber12", LPF, mixer, 0);

    lazer.fb1 = fb1;

    split.fbWest = fb1;
    split.fbNorth = fb2;
    split.fbEast = fb3;
    split.fbSouth = fb4;

    mirror2.fb1 = fb2;
    pd.fbIn = fb4;
    pd.fbOut = fb9;
    pd2.fbIn = fb6;
    mirror3.fb1 = fb8;

    mixer.loFiber = fb11;
    mixer.rfFiber = fb10;
    mixer.ifFiber = fb12;

    LPF.fb1 = fb12;

    BPF.fb1 = fb9;
    BPF.fb2 = fb10;

    FS.fb1 = fb11;

    AOM.fb1 = fb3;
    AOM.fb2 = fb7;
    AOM2.fb1 = fb8;
    AOM2.fb2 = fb5;


    split2.fbWest = fb7;
    split2.fbNorth = fb5;
    split2.fbEast = fb6;
    split2.fbSouth = null;

    //press simulate!!!
    FS.Fequency_Synthesizer_Siwtch_On();
    lazer.moveSignal();


    console.log("");
    console.log(fb1.log);
    console.log(fb2.log);
    console.log(fb3.log);
    console.log(fb4.log);
    console.log(fb5.log);
    console.log(fb6.log);
    console.log(fb7.log);
    console.log(fb8.log);
    console.log(fb9.log);
    console.log(fb10.log);
    console.log(fb11.log);
    console.log(fb12.log);


  }

  // test6() {
  //
  //   let a = new Simulator();
  //   let sp1 = new Splitter("sp1", 0, 0, false, 0, 0);
  //   let sp2 = new Splitter("sp2", 0, 0, false, 0, 0);
  //
  //   a.addDevice("Splitter", 5, 15);
  //   a.addDevice("Splitter", 14, 20);
  //   a.connectDevices(sp1.name, sp2.name, 1, 1, null);
  //   //return sp1.Object_to_Jason_String();
  //
  //   JSONArray list1 = new JSONArray();
  //   list1.add(sp1.Object_to_Jason_String(1));
  //   list1.add(sp2.Object_to_Jason_String(2));
  //
  //   JSONArray list2 = new JSONArray();
  //   list2.add(sp1.Object_to_Jason_String(1));
  //   list2.add(sp2.Object_to_Jason_String(2));
  //
  //   Map < String, Serializable > obj = new LinkedHashMap < String, Serializable > ();
  //   obj.put("device", list1);
  //   obj.put("device2", list2);
  //
  //   String jsonText = JSONValue.toJSONString(obj);
  //   console.log(jsonText);
  //   return jsonText;
  //}

  // test7() {
  //     String s = test6();
  //
  //     Object obj = JSONValue.parse(s);
  //     Globals.log("");
  //     //JSONArray array=(JSONArray)obj;
  //     console.log("");
  //     Map array = (Map) obj;
  //     JSONArray a = (JSONArray) array.get("coordinate");
  //
  //     //Globals.log(a.get(0).toString());
  //     //Globals.log(a.get(1).toString());
  //     Globals.log("haha");
  //     //Map a = (Map) array.get("device");
  //
  //
  //     Globals.log(obj.getClass().toString());
  //     Globals.log("haha");
  //     Globals.log(array.getClass().toString());
  //     Globals.log("haha");
  //     Globals.log(array.get("device").toString());
  //     Globals.log("haha");
  //
  //     Globals.log("haha");
  //     Globals.log(a.get(0).getClass().toString());
  //
  //
  //
  //
  //     console.log(obj.getClass().toString());
  //     console.log(array.getClass().toString());
  //     console.log(array.get("device").toString());
  //
  //     console.log(a.get(0).toString());
  //
  //
  //
  //   }
    /*
     * 		test this: let 1---- 3 fiber1 1 ----3 cmpt 1-----3 fiber2 1-----3 mir
     *
     * 		using sim export default class.
     *
     */
  test8() {
    let sim = new Simulator();

    //add devices
    let lID = sim.addDevice("Laser", 0, 0);
    let cID = sim.addDevice("AOM", 0, 0);

    //add mirror
    let mID = sim.addDevice("Component", 0, 0);

    //prlet id's
    console.log("ID's:");
    console.log(String.valueOf(lID));
    console.log(String.valueOf(cID));
    console.log(String.valueOf(mID));

    console.log();

    //connect
    sim.connectDevices(String.valueOf(lID), String.valueOf(cID), 2, 4, null);
    sim.connectDevices(String.valueOf(cID), String.valueOf(mID), 2, 4, null);

    //check sim state
    console.log("Device Array");
    for (let i = 0; i < sim.deviceAry.length; i++) {
      if (sim.deviceAry[i] !== null) {
        console.log("Index = " + i + " ID: " + String.valueOf(sim.deviceAry[i].name))
      };
    };

    console.log();

    console.log("Device to fiber matrix");
    console.log("D1 D2 P1 P2 F");
    for (let i = 0; i < sim.device_to_fiber.length; i++) {
      if (sim.device_to_fiber[i][0] != -1) {
        for (let b = 0; b < 5; b++) {
          System.out.print(String.valueOf(sim.device_to_fiber[i][b]) + "  ");
        }
        console.log();
      }

    }

    console.log();

    console.log("let Array");
    for (let i = 0; i < sim.fiberAry.length; i++) {
      if (sim.fiberAry[i] != null) console.log("Index = " + i);
    }

    console.log();

    //run sim
    sim.run();

    console.log("FIBER LOGS:");

    //prlet logs
    sim.printAllLogs();

    console.log("********* DELETE let **************");

    //delete laser
    sim.deleteDevice(String.valueOf(lID));

    //check sim state
    console.log("Device Array");
    for (let i = 0; i < sim.deviceAry.length; i++) {
      if (sim.deviceAry[i] != null) console.log("Index = " + i + " ID: " + String.valueOf(sim.deviceAry[i].name));
    }

    console.log();

    console.log("Device to fiber matrix");
    console.log("D1 D2 P1 P2 F");
    for (let i = 0; i < sim.device_to_fiber.length; i++) {
      if (sim.device_to_fiber[i][0] != -1) {
        for (let b = 0; b < 5; b++) {
          System.out.print(String.valueOf(sim.device_to_fiber[i][b]) + "  ");
        }
        console.log();
      }

    }

    console.log();

    console.log("let Array");
    for (let i = 0; i < sim.fiberAry.length; i++) {
      if (sim.fiberAry[i] != null) console.log("Index = " + i);
    }

    console.log();

  }
  test9() {
    let cmp1 = new Component("1", -0.5, 0, false);
    let cmp2 = new Component("2", -0.5, 0, false);

    let f = new Fibre("3", cmp1, cmp2, 0);
    cmp1.fb1 = f;
    cmp2.fb1 = f;

    f = null;

    //cmp1.fb1 = null;
    if (cmp1.fb1 == null) {
      console.log("cmp1 f is null");
    }
    if (cmp2.fb1 == null) {
      console.log("cmp2 f is null");
    }
  }

  /**
   * 		tests fiber log change
   */
  test15() {
    let sim = new Simulator();

    let lID = sim.addDevice("Laser", 0, 0);
    let cID = sim.addDevice("Component", 0, 0);

    sim.connectDevices(String.valueOf(lID), String.valueOf(cID), 2, 4, null);



    console.log("First TEST:");
    sim.run();
    sim.printAllLogs();

    sim.setSigFreq(10000, String.valueOf(lID));

    console.log("Second TEST:");
    sim.run();
    sim.printAllLogs();

    sim.setSigPower(-4, String.valueOf(lID));
    sim.setSigName("laz1", String.valueOf(lID));

    console.log("Third TEST:");
    sim.run();
    sim.printAllLogs();

  }

  test13() {
    test12();
    Globals.log("after test 12");
    Globals.log(" under waster squad   ");
    let pwd = "save.txt";
    let sim = Simulator.load(pwd);
    if (sim == null) {
      console.log("lol");
    }
    console.log(sim.deviceAry[0].getClass());
    sim.printState();
  }

  /**
   * 		tests this: lazer1 ------- mirror --------------- lazer2
   */
  test14() {

    /*let sim = new Simulator();

    let l1ID = sim.addDevice("Laser", 0, 0);
    let l2ID = sim.addDevice("Laser", 0, 0);
    let cID = sim.addDevice("Component", 0, 0);

    sim.connectDevices(String.valueOf(l1ID), String.valueOf(cID), 2, 4);
    sim.connectDevices(String.valueOf(l2ID), String.valueOf(cID), 4, 2);

    sim.toggleRef(String.valueOf(cID));
    sim.setSigName("laz1", String.valueOf(l2ID));

    sim.run();
    sim.printAllLogs();*/

    //THIS TEST GOES AGAINTS HOW MIRROR IS USED: THUS INVALID

  }


  /**
   * 		testing bug that cause this circuit
   *
   * 				laser---------
   * 				  |			 |
   * 				Cmpt--------AOM
   */
  test16() {
    let sim = new Simulator();
    let l1ID = sim.addDevice("Laser", 0, 0);
    let cID = sim.addDevice("Component", 0, 0);
    let aID = sim.addDevice("AOM", 0, 0);

    sim.connectDevices(String.valueOf(l1ID), String.valueOf(aID), 2, 1, null);
    sim.connectDevices(String.valueOf(aID), String.valueOf(cID), 4, 2, null);
    sim.connectDevices(String.valueOf(cID), String.valueOf(l1ID), 1, 3, null);

    //sim.run();
    sim.printState();
  }

  /**
   * 		test load/save of let --- AOM --- Comp
   */
  test17() {
    let sim = new Simulator();
    let l1ID = sim.addDevice("Laser", 0, 0);
    let mID = sim.addDevice("Component", 0, 0);
    let aID = sim.addDevice("AOM", 0, 0);

    sim.connectDevices(String.valueOf(mID), String.valueOf(aID), 4, 2, null);
    sim.connectDevices(String.valueOf(aID), String.valueOf(l1ID), 4, 2, null);

    sim.run();
    sim.printAllLogs();
    sim.printState();
    sim.save("save.optc");

    console.log("Save----->load");

    sim = null;
    let sim1 = sim.load("save.optc");
    sim1.run();
    sim1.printAllLogs();
    sim1.printState();

    let l1 = sim1.getDevice(String.valueOf(l1ID));
    let a1 = sim1.getDevice(String.valueOf(aID));
    let c1 = sim1.getDevice(String.valueOf(mID));

    console.log("Laser: fb1: " + l1.fb1.name);

    console.log("AOM: fb1: ");
    if (a1.fb1 != null) System.out.print(a1.fb1.name);
    console.log(" fb2: ");
    if (a1.fb2 != null) console.log(a1.fb2.name);

    console.log("Component: fb1: ");
    if (c1.fb1 != null) System.out.print(c1.fb1.name);
    console.log(" fb2: ");
    if (c1.fb2 != null) console.log(c1.fb2.name);
  }

  /**
   * 		test Divider_Multiplier
   */
  test18() {
    let sim = new Simulator();
    let l1ID = sim.addDevice("Laser", 0, 0);
    let cID = sim.addDevice("Component", 0, 0);
    let dmID = sim.addDevice("Divider_Multiplier", 0, 0);

    sim.connectDevices(String.valueOf(l1ID), String.valueOf(dmID), 2, 4, null);
    sim.connectDevices(String.valueOf(dmID), String.valueOf(cID), 2, 4, null);

    sim.run();
    sim.printState();
  }
}
