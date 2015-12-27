'use strict';

var Signal = class Signal {

  constructor(power, freq, name, sender){
    this.power = power;
    this.freq = freq;
    this.name = name;
    this.sender = sender;
    this.delta_f = [];

  }

  powerChange(chng){
		this.power += chng;
	}

  freqChange(chng){
  	this.freq += chng;
  }

  add_delta_f(f){
  			//Globals.log("haha new delta f is  being expanded " +" " + f + " " + this.name);
  			let size = this.delta_f.length;
  	        let flag = 0;										//flag to indicate if f is found in delta_f
  	        for(let i=0;i<this.delta_f.length;i++){

  	        	if(this.delta_f[i]==null) break;

  				//iterate through delta_f to find if f already existed
  				if(this.delta_f[i].equalsIgnoreCase(f)){     		//if found
  					coefficient[i] +=1;							//update the coefficient
  					flag = 1;									//update flag
  				}

  			}

  			if(i < size && flag == 0  ){							//f is not found in delta_f
  				this.delta_f[i] = f;									//insert f into delta_f
  				coefficient[i] = 1;								//set coefficient of first occurrence to 1
  				i++;											//increase the value of i by one, as there is another term added
  				flag = 1;
  			}
  			if(i >= size){											//delta_f is full
  																//expand the string array
  				//Globals.log("haha array being expanded " + i +" " + f + " " + this.name);
  				var swp = [this.delta_f.length * 2];
  				for(let a=0;a<this.delta_f.length;a++){
  					swp[a] = this.delta_f[a];
  				}
  				if(flag == 0)
  				{
  					swp[this.delta_f.length] = f;							//putting the delta f in the new array
  				}
  				this.delta_f = swp;

  				let swp2 = [coefficient.length * 2];  		//expand the coefficient array
  				for(let a=0;a<coefficient.length;a++){
  					swp2[a] = coefficient[a];
  				}
  				if(flag == 0)
  				{
  					swp2[coefficient.length] = 1;						//setting the new coefficient to be 1 in the new array
  				}
  				coefficient = swp2;
  			}


  	}

  	print_signal(){
  		return("the power is "+this.power +", frequency is "+this.freq+ " "+this.get_delta_f_in_string());
  	}


  	get_delta_f_in_string(){
  			let a = '';
  			for(let i=0;i<this.delta_f.length;i++){

  				if(this.delta_f[i]==null) break;

  				if(coefficient[i] != 0){						//if coefficient is 0 then cancel the delta f term
  					var sign = "+";
  					if(coefficient[i] < 0){
  						sign = "";
  					}
  					a += sign + coefficient[i] + this.delta_f[i] + " ";
  				}
  			}

  			//delete the last delimiter '+'
  			if (a.length > 0 && a[0] == '+') {
  				//builder.deleteCharAt(0);
          a = a.slice(0, 0) + a.slice(0, str.length);
  			}
  			return a;

  	}
}

module.exports = Signal;
