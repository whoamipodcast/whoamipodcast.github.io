class Vector{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	plus(v){
		return new Vector(this.x + v.x, this.y + v.y);
	}
	
	minus(v){
		return new Vector(this.x - v.x, this.y - v.y);
	}
	
	times(s){
		return new Vector(this.x * s, this.y * s);
	}
	
	divide(s){
		return new Vector(this.x / s, this.y / s);
	}
	
	pointwiseTimes(v){
		return new Vector(this.x * v.x, this.y * v.y);
	}
	
	pointwiseDivide(v){
		return new Vector(this.x / v.x, this.y / v.y);
	}
	
	normSquared(){
		return this.x * this.x + this.y * this.y;
	}
	
	equals(v){
		return this.x === v.x && this.y === v.y;
	}
	
	toString(){
		return "(" + this.x + ", " + this.y + ")";
	}
	
	toCookieString(){
		return "v" + this.x + "," + this.y;
	}
	
	static fromCookieString(pattern, cookieString){
		var m, x, y, v;
		
		m = pattern.exec(cookieString); //x value
		if(m){
			x = parseFloat(m[1]);
			if(x != null && isFinite(x)){
				m = pattern.exec(cookieString); //,
				if(m && m[1] == ","){
					m = pattern.exec(cookieString); //y value
					if(m){
						y = parseFloat(m[1]);
						if(y != null && isFinite(y)){
							v = new Vector(x, y);
							if(v){
								return v;
							}
						}
					}
				}
			}
		}
		return null;
	}
}