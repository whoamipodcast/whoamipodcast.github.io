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
}