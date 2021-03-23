class Triangle{
	constructor(board, isPointingUp, rawLeftmostGridP){
		this.board = board;
		this.isPointingUp = isPointingUp;
		this.leftmostBoardP = new Vector(rawLeftmostGridP[0] * board.triangleBox.x, rawLeftmostGridP[1] * board.triangleBox.y);
		
		this.refreshBoardPoints();
	}
	
	refreshBoardPoints(){
		this.boardPoints = [
			this.leftmostBoardP,
			this.leftmostBoardP.plus(new Vector(this.board.triangleBox.x, 0)),
			this.leftmostBoardP.plus(new Vector(this.board.triangleBox.x / 2, this.isPointingUp ? -this.board.triangleBox.y : this.board.triangleBox.y))
		];
	}
	
	draw(ctx){
		//draw filled triangle
		ctx.beginPath();
		var p = this.boardPoints[0];
		ctx.moveTo(p.x, p.y);
		
		p = this.boardPoints[1];
		ctx.lineTo(p.x, p.y);
		
		p = this.boardPoints[2];
		ctx.lineTo(p.x, p.y);
		
		p = this.boardPoints[0];
		ctx.lineTo(p.x, p.y);
		
		ctx.fillStyle = "orange";
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
		
		//draw circles at triangle corners
		/*for(var bp of this.boardPoints){
			ctx.beginPath();
			ctx.arc(bp.x - 2, bp.y - 2, 4, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgb(0, 0, 255)";
			ctx.fill();
			ctx.closePath();
		}
		
		ctx.beginPath();
		ctx.arc(this.leftmostBoardP.x - 2, this.leftmostBoardP.y - 2, 4, 0, 2 * Math.PI, false);
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fill();
		ctx.closePath();*/
	}
	
	contains(boardP){
		var r = false;

		if(this.isPointingUp){
				r = (this.leftmostBoardP.x <= boardP.x && boardP.x < this.leftmostBoardP.x + this.board.triangleBox.x) &&
				(this.leftmostBoardP.y - this.board.triangleBox.y <= boardP.y && boardP.y < this.leftmostBoardP.y);
		}else{
				r = (this.leftmostBoardP.x <= boardP.x && boardP.x < this.leftmostBoardP.x + this.board.triangleBox.x) &&
				(this.leftmostBoardP.y <= boardP.y && boardP.y < this.leftmostBoardP.y + this.board.triangleBox.y);
		}
		if(!r){
				return false;
		}
		
		var localP = boardP.minus(this.leftmostBoardP).pointwiseDivide(this.board.triangleBox);
		
		if(this.isPointingUp){
				localP.y += 1;
				r = (localP.y > Math.abs(localP.x * 2 - 1));
		}else{
				r = (localP.y < -Math.abs(localP.x * 2 - 1) + 1);
		}
		
		return r;
	}
	
	translate(translateV){
		this.leftmostBoardP = this.board.snapToGrid(this.leftmostBoardP.plus(translateV));
		this.refreshBoardPoints();
	}
	
	overlaps(triangle){
		return this.isPointingUp === triangle.isPointingUp
			&& this.leftmostBoardP.equals(triangle.leftmostBoardP);
	}
	
	includes(boardPoints){
		for(var bp1 of boardPoints){
			var a = false;
			for(var bp2 of this.boardPoints){
				if(bp1.equals(bp2)) a = true;
			}
			if(!a) return false;
		}
		return true;
	}
	
	isNeighbouring(triangle){
		if(this.isPointingUp == triangle.isPointingUp) return false;
		
		var a = 0;
		for(var bp1 of this.boardPoints){
			for(var bp2 of triangle.boardPoints){
				if(bp1.equals(bp2)) a++;
			}
		}
		
		return a == 2;
	}
	
	toCookieString(){
		return "t" + (this.isPointingUp ? 1 : 0) + this.leftmostBoardP.pointwiseDivide(this.board.triangleBox).toCookieString();
	}
}
