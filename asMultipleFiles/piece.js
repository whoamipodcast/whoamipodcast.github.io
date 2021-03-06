class Piece{
	constructor(board, gridPoints, triangles, color){
		this.board = board;
		this.color = color;
		this.borderColor = "black";
		
		this.boardPoints = new Array();
		for(var gridPoint of gridPoints){
			if(Array.isArray(gridPoint)) gridPoint = new Vector(gridPoint[0], gridPoint[1]);
			this.boardPoints.push(gridPoint.pointwiseTimes(board.triangleBox));
		}
		
		this.dragOffsetP = new Vector(0, 0);
		
		this.triangles = new Array();
		for(var triangle of triangles){
			if(Array.isArray(triangle)) triangle = new Triangle(board, triangle[0], triangle[1]);
			this.triangles.push(triangle);
		}
	}
	
	draw(ctx){
		ctx.beginPath();
		var p = this.board.snapToGrid(this.boardPoints[0].plus(this.dragOffsetP));
		ctx.moveTo(p.x, p.y);
		
		for(var i=1; i<this.boardPoints.length; i++){
			p = this.board.snapToGrid(this.boardPoints[i].plus(this.dragOffsetP));
			ctx.lineTo(p.x, p.y);
		}
		
		p = this.board.snapToGrid(this.boardPoints[0].plus(this.dragOffsetP));
		ctx.lineTo(p.x, p.y);
		
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.borderColor;
		ctx.stroke();
		ctx.closePath();
		
		/*for(var triangle of this.triangles){
			triangle.draw(ctx);
		}*/
	}
	
	contains(boardP){
		for(var triangle of this.triangles){
			if(triangle.contains(boardP)) return true;
		}
		return false;
	}
	
	properlyContainsLine(bp1, bp2){
		var a = 0;
		for(var triangle of this.triangles){
			if(triangle.includes([bp1, bp2])) a++;
		}
		return a == 2;
	}
	
	translate(translateV){
		for(var i=0; i<this.boardPoints.length; i++){
			this.boardPoints[i] = this.board.snapToGrid(this.boardPoints[i].plus(translateV));
		}
		
		for(var triangle of this.triangles){
			triangle.translate(translateV);
		}
	}
	
	overlaps(piece){
		for(var thisTriangle of this.triangles){
			for(var givenTriangle of piece.triangles){
				if(thisTriangle.overlaps(givenTriangle)) return true;
			}
		}
		
		return false;
	}
	
	snapToGrid(){
		var orig, snappedToGrid, delta;
		var minDelta = null;
		for(var i=0; i<this.boardPoints.length; i++){
			orig = this.boardPoints[i];
			snappedToGrid = this.board.snapToGrid(this.boardPoints[i]);
			delta = snappedToGrid.minus(orig);
			if(minDelta === null || delta.normSquared() < minDelta.normSquared()){
				minDelta = delta;
			}
		}
		this.translate(minDelta);
	}
	
	getCentralPoint(){
		var x = 0;
		var y = 0;
		
		for(var bp of this.boardPoints){
			x += bp.x;
			y += bp.y;
		}
		
		x /= this.boardPoints.length;
		y /= this.boardPoints.length;
		
		return new Vector(x, y);
	}
	
	rotatePoint(boardPoint, clockwise){
		if(clockwise){
			return new Vector(
				0.5 * boardPoint.x - 0.866 * boardPoint.y,
				0.866 * boardPoint.x + 0.5 * boardPoint.y
			);
		}else{
			return new Vector(
				0.5 * boardPoint.x + 0.866 * boardPoint.y,
				-0.866 * boardPoint.x + 0.5 * boardPoint.y
			);
		}
	}
	
	rotate(clockwise){
		var central = this.getCentralPoint();
		var relativeToCentral;
		var rotatedRelativeToCentral;
		
		for(var i=0; i<this.boardPoints.length; i++){
			relativeToCentral = this.boardPoints[i].minus(central);
			rotatedRelativeToCentral = this.rotatePoint(relativeToCentral, clockwise);
			this.boardPoints[i] = central.plus(rotatedRelativeToCentral);
		}
		
		for(var i=0; i<this.triangles.length; i++){
			var leftmost = null;
			for(var j=0; j<3; j++){
				relativeToCentral = this.triangles[i].boardPoints[j].minus(central);
				rotatedRelativeToCentral = this.rotatePoint(relativeToCentral, clockwise);
				var rotated = central.plus(rotatedRelativeToCentral);
				if(leftmost === null || rotated.x < leftmost.x){
					leftmost = rotated;
				}
			}
			this.triangles[i].leftmostBoardP = leftmost;
			this.triangles[i].isPointingUp = !this.triangles[i].isPointingUp;
			this.triangles[i].refreshBoardPoints();
		}
		
		this.snapToGrid();
	}
	
	rotateClockwise(){
		this.rotate(true);
	}
	
	rotateCounterClockwise(){
		this.rotate(false);
	}
	
	flip(){
		var central = this.getCentralPoint();
		var relativeToCentral;
		var flippedRelativeToCentral;
		
		for(var i=0; i<this.boardPoints.length; i++){
			relativeToCentral = this.boardPoints[i].minus(central);
			flippedRelativeToCentral = new Vector(-relativeToCentral.x, relativeToCentral.y);
			this.boardPoints[i] = central.plus(flippedRelativeToCentral);
		}
		
		for(var i=0; i<this.triangles.length; i++){
			var leftmost = null;
			for(var j=0; j<3; j++){
				relativeToCentral = this.triangles[i].boardPoints[j].minus(central);
				flippedRelativeToCentral = new Vector(-relativeToCentral.x, relativeToCentral.y);
				var flipped = central.plus(flippedRelativeToCentral);
				if(leftmost === null || flipped.x < leftmost.x){
					leftmost = flipped;
				}
			}
			this.triangles[i].leftmostBoardP = leftmost;
			this.triangles[i].refreshBoardPoints();
		}
		
		this.snapToGrid();
	}
	
	containsTriangle(leftmostBoardP, isPointingUp){
		for(var triangle of this.triangles){
			if(triangle.leftmostBoardP.equals(leftmostBoardP) && triangle.isPointingUp == isPointingUp) return true;
		}
		return false;
	}
	
	isNeighbouring(piece){
		for(var tr1 of this.triangles){
			for(var tr2 of piece.triangles){
				if(tr1.isNeighbouring(tr2)) return true;
			}
		}
		return false;
	}
	
	toCookieString(){
		var s = "p" + COLORS.indexOf(this.color);
		for(var bp of this.boardPoints){
			s += bp.pointwiseDivide(this.board.triangleBox).toCookieString();
		}
		for(var tr of this.triangles){
			s += tr.toCookieString();
		}
		return s;
	}
	
	static fromCookieString(board, pattern, cookieString){
		var m, c, v, t;
		var vs = new Array();
		var ts = new Array();
		
		m = pattern.exec(cookieString); //0, 1, 2, ... -> color
		if(m){
			c = parseInt(m[1]);
			if(COLORS[c]){
				while(true){
					m = pattern.exec(cookieString);
					
					//null -> finished parsing cookieString, or "p" -> next piece
					if(m == null || m[1] == "p"){
						return new Piece(board, vs, ts, COLORS[c]);
					
					}else{
						
						//next grid point
						if(m[1] == "v"){
							v = Vector.fromCookieString(pattern, cookieString);
							if(v){
								vs.push(v);
							}else{
								return null;
							}
							
						//next triangle
						}else if(m[1] == "t"){
							t = Triangle.fromCookieString(board, pattern, cookieString);
							if(t){
								ts.push(t);
							}else{
								return null;
							}
							
						}
					}
				}
			}
		}
		return null;
	}
	
	hasGridPoints(gridPoints){
		for(var gridPoint of gridPoints){

			if(Array.isArray(gridPoint)) gridPoint = new Vector(gridPoint[0], gridPoint[1]);
			var boardPoint = gridPoint.pointwiseTimes(this.board.triangleBox);
			
			var hasGridPoint = false;
			for(var thisBoardPoint of this.boardPoints){
				if(thisBoardPoint.equals(boardPoint)){
					hasGridPoint = true;
					break;
				}
			}
			if(!hasGridPoint) return false;
			
		}
		return true;
	}
}
