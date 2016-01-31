 

export default class Globals {

  constructor(){
    /**
     *  lowest signal power in dBm (make possible to changed it)
     */
    this.MIN_POWER = -150;

    /**
     * 	return check for running of simulator
     */
    this.RUN_CHECK = 0;

    //start time of running simualtion
    this.startTime = Date.now();

    /**
     * the Greek letter δ
     */
    //static String cc2 = "2202";
    this.delta = '\u0394';
  }

	/**
	 * 		Simpify std printing
	 */
	log(log){
		console.log(log);
	}

	/**
	 * 	@return a Json string that contains all the instance variables
	 */
	Object_to_Jason_String(){
    const obj = [];
    obj.push("export default class_type","Globals");
		obj.push("MIN_POWER", new Double(MIN_POWER));
		let jsonText = JSON.stringify(obj);
		console.log(jsonText);
		return jsonText;
	}
}
module.exports = Globals;
