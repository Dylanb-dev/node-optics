/**
 * 		filter let signal within the spercified frequency range to pass through
 * 		also power_shift indicate how power of signals passing through is effected
 *
 *		@author yiyang gao
 *
 */

class Filter extends Device  {

	/**
	 * constructor for band pass filter
	 * @param name name of filter
	 * @param abs absorbtion of filter
	 * @param ref reflection of filter
	 * @param frequency_limit1  the lower or upper limit of frequency allowed to pass
	 * @param frequency_limit2 	the lower or upper limit of frequency allowed to pass
	 */

	public Filter(String name, double abs, double ref,boolean enableRef, double frequency_limit1, double frequency_limit2){
		//received both upper limit and
		this.name = name;
    this.fb1 = new Fibre();
    this.fb2 = new Fibre();
		//interchangeable bounds
		if(frequency_limit1 > frequency_limit2){
			this.frequency_upper_limit = frequency_limit1;
			this.frequency_lower_limit = frequency_limit2;
		}else{
			this.frequency_upper_limit = frequency_limit2;
			this.frequency_lower_limit = frequency_limit1;
		}

		this.coordinate = new int[2];	//construct a int[2] array to store x and y coordinates

		this.type_of_filter = 'B';				//the filter is a band pass filer
		this.absorption = abs;
		this.reflection = ref;
		this.boolRef = enableRef;
	}

	/**
	 * constructor for low pass filter or high pass filer
	 * @param name name of the filer
	 * @param abs  absorption
	 * @param ref  reflection
	 * @param frequency_limit   the upper limit of allowable frequency if LPF, the lower limit of allowable frequency if HBF
	 * @param type  type indicating if the filter is low pass filter or high pass filer
	 */

	public Filter(String name, double abs, double ref, double frequency_limit,char type){

		//only received one frequency, then could be a HPF or LPF
		this.name = name;
		this.type_of_filter =  type;
		if(type == 'H'){			//high pass filter
			this.frequency_lower_limit = frequency_limit;
		}
		if(type == 'L'){
			this.frequency_upper_limit = frequency_limit;
		}
		absorption = abs;
		reflection = ref;
	}

	/**
	 * 		recieve and proccess and send signal
	 */
	@Override
	public void moveSignal(Signal signal){
		if(fb1 != null && fb2 != null){
			if(filter(signal)){						//if the signal can pass through the filer
				deviceEffect(signal);				//changing the power of siganls passing through
				//if signal was sent from fb1 send to fb2 else send to fb1
				if(signal.sender.equals(fb1.name)){
					signal.sender = name;			//update sender to this component
					fb2.moveSignal(signal);			//send to fb2
				} else {
					signal.sender = name;
					fb1.moveSignal(signal);
				}
			}
		}

	}

	private boolean filter(Signal sig){
		if(type_of_filter == 'H'){				//filter is a high pass filter
			if(sig.freq > frequency_lower_limit){		//signal frequency is bigger than lower limit
				return true;
			}
		}

		if(type_of_filter == 'L'){
			if(sig.freq < frequency_upper_limit){		//signal frequency is lower than upper limit
				return true;
			}
		}

		if(type_of_filter == 'B'){									//filter is a band pas filer
			if(sig.freq < frequency_upper_limit && sig.freq > frequency_lower_limit ){		//signal frequency is lower than upper limit
				return true;
			}
		}

		return false;				//false if non of the criteria is met

	}

}
module.exports = Filter;
