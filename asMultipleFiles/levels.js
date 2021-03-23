class Levels{
	constructor(board){
		this.board = board;
		
		var targetPolygonRows = [[true, [8.5, 1], 5], [true, [8, 2], 7], [true, [5.5, 3], 17], [true, [5, 4], 19], [false, [5, 4], 19], [false, [5.5, 5], 17], [true, [5.5, 7], 17], [true, [5, 8], 19], [false, [5, 8], 19], [false, [5.5, 9], 17], [false, [8, 10], 7], [false, [8.5, 11], 5]];
		
		this.targetPolygonTriangles = new Array();
		var isPointingUp, deltaY, leftmostGridPoint, targetPolygonTriangle;
		
		for(var targetPolygonRow of targetPolygonRows){
			deltaY = targetPolygonRow[0] ? [0, -1] : [0, 1];
			for(var i=0; i<targetPolygonRow[2]; i++){
				isPointingUp = targetPolygonRow[0] == (i % 2 == 0);
				if(isPointingUp){
					leftmostGridPoint = [targetPolygonRow[1][0] + i/2, targetPolygonRow[1][1] + deltaY[i % 2]];
				}else{
					leftmostGridPoint = [targetPolygonRow[1][0] + i/2, targetPolygonRow[1][1] + deltaY[i % 2]];
				}
				this.targetPolygonTriangles.push(new Triangle(this.board, isPointingUp, leftmostGridPoint));
			}
		}
	}
	
	/*draw(){
		for(var targetPolygonTriangle of this.targetPolygonTriangles){
			targetPolygonTriangle.draw(this.board.ctx);
		}
	}*/
	
	isTargetPolygonFilled(){
		for(var targetPolygonTriangle of this.targetPolygonTriangles){
			if(!this.board.anyPieceContainsTriangle(targetPolygonTriangle.leftmostBoardP, targetPolygonTriangle.isPointingUp)){
				return false;
			}
		}
		return true;
	}
	
	isAnyLineCrossed(lines){
		for(var line of lines){
			if(this.board.anyPieceProperlyContainsLine(line[0], line[1])){
				return true;
			}
		}
		return false;
	}
	
	//fill target polygon
	completedLevel1(){
		return this.isTargetPolygonFilled();
	}
	
	//do not cross the middle horizontal line
	completedLevel2(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var lines = new Array();
		var bp1;
		var bp2 = new Vector(6 * this.board.triangleBox.x, 6 * this.board.triangleBox.y);
		var delta = new Vector(this.board.triangleBox.x, 0);
		for(var i=0; i<8; i++){
			bp1 = bp2;
			bp2 = bp1.plus(delta);
			lines.push([bp1, bp2]);
		}
		
		return !this.isAnyLineCrossed(lines);
	}
	
	completedColorLevel(){
		var amountOfPieces = this.board.pieces.length;
		
		//assign each piece its own group
		var groupIndices = new Array();
		for(var i=0; i<amountOfPieces; i++){
			groupIndices.push(i);
		}
		
		for(var i=0; i<amountOfPieces; i++){
			var p1 = this.board.pieces[i];
			for(var j=i+1; j<amountOfPieces; j++){
				var p2 = this.board.pieces[j];
				if(p1.color == p2.color && p1.isNeighbouring(p2)){
					var groupIndex1 = groupIndices[i];
					var groupIndex2 = groupIndices[j];
					//overwrite the group indices for all pieces in the same group as p2 to that of p1's group index
					for(var k=0; k<amountOfPieces; k++){
						if(groupIndices[k] == groupIndex2) groupIndices[k] = groupIndex1;
					}
				}
			}
		}
		
		var distinctGroupIndices = new Array();
		for(var i=0; i<amountOfPieces; i++){
			var groupIndex = groupIndices[i];
			if(!distinctGroupIndices.includes(groupIndex)) distinctGroupIndices.push(groupIndex);
		}
		
		//count amount of groups
		return distinctGroupIndices.length == COLORS.length;
	}
}
