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
	
	//breaks down lines into sections the length of a triangle's edge
	bigLinesToSmallLines(bigLines){
		var smallLines = new Array();
		
		for(var bigLine of bigLines){
			var fromBp = new Vector(bigLine.from[0], bigLine.from[1]);
			var toBp = new Vector(bigLine.to[0], bigLine.to[1]);
			var delta = toBp.minus(fromBp).divide(bigLine.sections);
			for(var i=0; i<bigLine.sections; i++){
				toBp = fromBp.plus(delta);
				smallLines.push([fromBp, toBp]);
				fromBp = toBp;
			}
		}
		
		return smallLines;
	}
	
	//do not cross the middle horizontal line
	completedLevel2(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var bigLines = [{ from: [6, 6], to: [14, 6], sections: 8 }];
		var smallLines = this.bigLinesToSmallLines(bigLines);
		
		return !this.isAnyLineCrossed(smallLines);
	}
	
	//clover
	completedLevel3(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var bigLines = [
			{ from: [8, 2], to: [10, 6], sections: 4 },
			{ from: [14, 6], to: [10, 6], sections: 4 },
			{ from: [8, 10], to: [10, 6], sections: 4 }
		];
		var smallLines = this.bigLinesToSmallLines(bigLines);
		
		return !this.isAnyLineCrossed(smallLines);
	}
	
	//bee hive
	completedLevel4(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var bigLines = [
			{ from: [8, 2], to: [8.5, 3], sections: 1 },
			{ from: [12, 2], to: [11.5, 3], sections: 1 },
			{ from: [14, 6], to: [13, 6], sections: 1 },
			{ from: [12, 10], to: [11.5, 9], sections: 1 },
			{ from: [8, 10], to: [8.5, 9], sections: 1 },
			{ from: [6, 6], to: [7, 6], sections: 1 },
			{ from: [7, 6], to: [8.5, 3], sections: 3 },
			{ from: [8.5, 3], to: [11.5, 3], sections: 3 },
			{ from: [11.5, 3], to: [13, 6], sections: 3 },
			{ from: [13, 6], to: [11.5, 9], sections: 3 },
			{ from: [11.5, 9], to: [8.5, 9], sections: 3 },
			{ from: [8.5, 9], to: [7, 6], sections: 3 }
		];
		var smallLines = this.bigLinesToSmallLines(bigLines);
		
		return !this.isAnyLineCrossed(smallLines);
	}
	
	//ice cream cones
	completedLevel5(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var bigLines = [
			{ from: [8, 2], to: [10, 6], sections: 4 },
			{ from: [12, 2], to: [10, 6], sections: 4 },
			{ from: [14, 6], to: [10, 6], sections: 4 },
			{ from: [12, 10], to: [10, 6], sections: 4 },
			{ from: [8, 10], to: [10, 6], sections: 4 },
			{ from: [6, 6], to: [10, 6], sections: 4 }
		];
		var smallLines = this.bigLinesToSmallLines(bigLines);
		
		return !this.isAnyLineCrossed(smallLines);
	}
	
	//connected colors
	completedLevel6(){
		if(!this.isTargetPolygonFilled()) return false;
		
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
	
	//flower power
	completedLevel7(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var bigLines = [
			{ from: [8, 2], to: [9.5, 5], sections: 3 },
			{ from: [12, 2], to: [10.5, 5], sections: 3 },
			{ from: [14, 6], to: [11, 6], sections: 3 },
			{ from: [12, 10], to: [10.5, 7], sections: 3 },
			{ from: [8, 10], to: [9.5, 7], sections: 3 },
			{ from: [6, 6], to: [9, 6], sections: 3 },
			{ from: [9.5, 5], to: [10.5, 5], sections: 1 },
			{ from: [10.5, 5], to: [11, 6], sections: 1 },
			{ from: [11, 6], to: [10.5, 7], sections: 1 },
			{ from: [10.5, 7], to: [9.5, 7], sections: 1 },
			{ from: [9.5, 7], to: [9, 6], sections: 1 },
			{ from: [9, 6], to: [9.5, 5], sections: 1 }
		];
		var smallLines = this.bigLinesToSmallLines(bigLines);
		
		return !this.isAnyLineCrossed(smallLines);
	}
	
	//william
	completedLevel8(){
		if(!this.isTargetPolygonFilled()) return false;
		
		var requiredPieces = [
			[[6, 6], [5.5, 5], [5, 4], [6, 4], [7, 4], [8, 4], [7.5, 5], [7, 6], [6.5, 5]],
			[[7, 6], [8, 6], [8.5, 5], [9, 4], [8, 4], [7.5, 5]],
			[[9, 6], [9.5, 7], [9, 8], [8.5, 7], [8, 6], [8.5, 5], [9, 4], [10, 4], [9.5, 5]],
			[[10.5, 5], [10, 4], [9.5, 5], [9, 6], [9.5, 7], [10.5, 7], [10, 6]],
			[[12, 4], [11.5, 5], [11, 6], [10.5, 7], [10, 6], [10.5, 5], [11, 4]],
			[[10.5, 7], [11, 6], [11.5, 5], [12, 6], [12.5, 7], [11.5, 7]],
			[[14, 6], [13, 6], [12, 6], [11.5, 5], [12, 4], [12.5, 5], [13, 4], [13.5, 5]]
		];
		
		for(var gridPoints of requiredPieces){
			var p = this.board.getPieceThatHasGridPoints(gridPoints);
			if(p == null) return false;
		}
		
		return true;
	}
}
