class Board{
	constructor(game, cookiesHelper, canvas, gridSize){
		this.game = game;
		this.cookiesHelper = cookiesHelper;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		
		this.gridSize = gridSize;
		this.triangleBox = new Vector(canvas.width / gridSize.x, canvas.height / gridSize.y);
		this.targetPolygonBoardPoints = null;
		
		var b = this;
		
		this.pieces = new Array();
		this.selectedPiece = null;
		this.mouseButton = -1;
		this.isDragging = false;
		this.isMouseDown = false;
		this.isMouseHeldDown = false;
		this.mouseDownDuration = 0;
		var mouseDownP, mouseMoveP;
		
		canvas.addEventListener("mousemove", function(event){
			b.isDragging = b.selectedPiece != null;
			mouseMoveP = new Vector(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
			ta.value = "boardPoint: (" + mouseMoveP.x + ", " + mouseMoveP.y + ")\ngridPoint: (" + (Math.round(mouseMoveP.x / 3) / 10) + ", " + (Math.round(mouseMoveP.y / 2.6) / 10) + ")";
			
			if(b.selectedPiece){
				b.selectedPiece.dragOffsetP = mouseMoveP.minus(mouseDownP);
			}
		}, false);
		
		canvas.addEventListener("mousedown", function(event){
			b.isMouseDown = true;
			b.mouseButton = event.button;
			mouseDownP = new Vector(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
			b.selectedPiece = b.getPieceAt(mouseDownP);
			
			if(b.selectedPiece){
				console.log("grid points:");
				for(var boardPoint of b.selectedPiece.boardPoints){
					console.log(boardPoint.pointwiseDivide(b.triangleBox));
				}
			}
		}, false);
		
		canvas.addEventListener("mouseup", function(event){
			b.isMouseDown = false;
			
			//if mouse was not held down
			if(!b.isMouseHeldDown){
				//after dragging
				if(b.isDragging){
					if(b.selectedPiece){
						var mouseUpP = new Vector(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
						
						b.selectedPiece.dragOffsetP = new Vector(0, 0);
						b.selectedPiece.translate(mouseUpP.minus(mouseDownP));
						
						//check for overlap with any other piece
						if(b.overlapsAnyPiece(b.selectedPiece)){
							//if overlaps undo translation
							b.selectedPiece.translate(mouseDownP.minus(mouseUpP));
						}
					}
				
				//if clicked but not dragged
				}else{
					if(b.selectedPiece){
						//left mouse button
						if(b.mouseButton == 0){
							b.selectedPiece.rotateCounterClockwise();
							//if overlap, undo rotation
							if(b.overlapsAnyPiece(b.selectedPiece)){
								b.selectedPiece.rotateClockwise();
							}

						//right mousebutton
						}else if (b.mouseButton == 2){
							b.selectedPiece.rotateClockwise();
							//if overlap, undo rotation
							if(b.overlapsAnyPiece(b.selectedPiece)){
								b.selectedPiece.rotateCounterClockwise(); //if overlap, undo rotation
							}
						}
					}
				}
			}
			
			b.isMouseHeldDown = false;
			b.mouseDownDuration = 0;
			b.isDragging = false;
			b.selectedPiece = null;
			
			b.savePiecesAsCookie();
			b.game.checkIfCompletedLevel();
		}, false);
		
		canvas.addEventListener("contextmenu", function(event){
			//prevent context menu from popping up
			event.preventDefault();
		}, false);
	}
	
	flipSelectedPiece(){
		if(this.selectedPiece){
			this.selectedPiece.flip();
		
			//if overlap, undo flip
			if(this.overlapsAnyPiece(this.selectedPiece)){
				this.selectedPiece.flip();
			}
		}
		
		this.mouseDownDuration = 0;
		this.isDragging = false;
		this.selectedPiece = null;
	}
	
	getPieceAt(boardP){
		for(var piece of this.pieces){
			if(piece.contains(boardP)){
				return piece;
			}
		}
		
		return null;
	}
	
	snapToGrid(boardP){
		var row = Math.round(boardP.y / this.triangleBox.y);
		var ry = row * this.triangleBox.y;
		var rx;
		if(row % 2 === 0){
				rx = Math.round(boardP.x / this.triangleBox.x) * this.triangleBox.x;
		}else{
				rx = (Math.floor(boardP.x / this.triangleBox.x) + 0.5) * this.triangleBox.x;
		}
		
		return new Vector(rx, ry);
	}
	
	useStandardTargetPolygon(){
		var rawGridPoints = [[0,0], [2,0], [3,2], [5,2], [6,4], [5,6], [6,8], [5,10], [3,10], [2,12], [0,12], [-1,10], [-3,10], [-4,8], [-3,6], [-4,4], [-3,2], [-1,2], [0,0]];
		
		//centralise polygon horizontally on board
		var offset = new Vector(this.gridSize.x / 2 - 1, 0);
		
		this.targetPolygonBoardPoints = new Array();
		for(var rawGridPoint of rawGridPoints){
			var targetPolygonGridPoint = new Vector(rawGridPoint[0], rawGridPoint[1]);
			this.targetPolygonBoardPoints.push(targetPolygonGridPoint.plus(offset).pointwiseTimes(this.triangleBox));
		}
	}
	
	useStandardPieces(){
		var rawPieces = [
			[
				[[2, 0], [2.5, 1], [2, 2], [1.5, 3], [0.5, 3], [1, 2], [0.5, 1], [1, 0], [1.5, 1]],
				[[true, [1.5, 1]], [false, [1.5, 1]], [true, [0.5, 1]], [false, [0.5, 1]], [true, [1, 2]], [false, [1, 2]], [true, [0.5, 3]]],
				COLORS[YELLOW]
			],
			[
				[[4.5, 1], [5, 2], [5.5, 3], [4.5, 3], [3.5, 3], [2.5, 3], [3, 2], [3.5, 1], [4, 2]],
				[[true, [4, 2]], [false, [4, 2]], [true, [4.5, 3]], [true, [2.5, 3]], [false, [3, 2]], [true, [3, 2]], [true, [3.5, 3]]],
				COLORS[BLUE]
			],
			[
				[[5.5, 1], [6, 0], [7, 0], [8, 0], [7.5, 1], [6.5, 1]],
				[[true, [5.5, 1]], [false, [6, 0]], [true, [6.5, 1]], [false, [7, 0]]],
				COLORS[RED]
			],
			[
				[[0.5, 5], [1, 4], [2, 4], [2.5, 5], [2, 6], [1, 6]],
				[[true, [0.5, 5]], [false, [0.5, 5]], [false, [1, 4]], [true, [1.5, 5]], [false, [1.5, 5]], [true, [1, 6]]],
				COLORS[BLUE]
			],
			[
				[[16.5, 1], [17, 2], [16.5, 3], [15.5, 3], [16, 2], [15, 2], [15.5, 1]],
				[[false, [15.5, 1]], [true, [16, 2]], [false, [16, 2]], [true, [15.5, 3]], [true, [15, 2]]],
				COLORS[RED]
			],
			[
				[[17, 2], [17.5, 1], [18, 0], [19, 0], [19.5, 1], [20, 2], [19, 2], [18, 2]],
				[[true, [17, 2]], [false, [17.5, 1]], [true, [17.5, 1]], [true, [18, 2]], [false, [18.5, 1]], [true, [19, 2]], [true, [18.5, 1]], [false, [18, 0]]],
				COLORS[GREEN]
			],
			[
				[[16, 6], [16.5, 5], [16, 4], [16.5, 3], [17, 4], [18, 4], [17.5, 5], [18, 6], [17, 6]],
				[[false, [16.5, 5]], [true, [16, 6]], [true, [17, 6]], [true, [16.5, 5]], [false, [16, 4]], [true, [16, 4]], [false, [17, 4]]],
				COLORS[YELLOW]
			],
			[
				[[17.5, 3], [18.5, 3], [19.5, 3], [19, 4], [18.5, 5], [18, 4]],
				[[false, [17.5, 3]], [true, [18, 4]], [false, [18.5, 3]], [false, [18, 4]]],
				COLORS[RED]
			],
			[
				[[2.5, 5], [3.5, 5], [4, 4], [4.5, 5], [5.5, 5], [5, 6], [4, 6], [3, 6]],
				[[false, [2.5, 5]], [true, [3, 6]], [false, [3.5, 5]], [true, [4, 6]], [false, [4.5, 5]], [true, [3.5, 5]]],
				COLORS[BLUE]
			],
			[
				[[17.5, 7], [18, 6], [19, 6], [20, 6], [19.5, 7], [19, 8], [18.5, 7]],
				[[true, [17.5, 7]], [false, [18, 6]], [true, [18.5, 7]], [false, [18.5, 7]], [false, [19, 6]]],
				COLORS[YELLOW]
			],
			[
				[[14.5, 7], [15.5, 7], [16, 8], [16.5, 7], [17.5, 7], [17, 8], [16.5, 9], [15.5, 9], [15, 8]],
				[[false, [14.5, 7]], [true, [15, 8]], [false, [15, 8]], [true, [15.5, 9]], [false, [16, 8]], [true, [16, 8]], [false, [16.5, 7]]],
				COLORS[BLUE]
			],
			[
				[[0.5, 7], [1, 8], [1.5, 7], [2, 8], [1.5, 9], [1, 10], [0.5, 9], [0, 8]],
				[[true, [0, 8]], [false, [0, 8]], [true, [0.5, 9]], [false, [1, 8]], [true, [1, 8]], [false, [0.5, 9]]],
				COLORS[YELLOW]
			],
			[
				[[2.5, 9], [2, 8], [2.5, 7], [3.5, 7], [4.5, 7], [5, 8], [4.5, 9], [4, 8], [3, 8]],
				[[false, [2, 8]], [true, [2, 8]], [false, [2.5, 7]], [true, [3, 8]], [false, [3.5, 7]], [true, [4, 8]], [false, [4, 8]]],
				COLORS[RED]
			],
			[
				[[17.5, 9], [18, 8], [19, 8], [19.5, 9], [19, 10], [19.5, 11], [18.5, 11], [18, 10], [18.5, 9]],
				[[false, [18.5, 9]], [true, [17.5, 9]], [false, [18, 8]], [true, [18.5, 9]], [true, [18, 10]], [false, [18, 10]], [true, [18.5, 11]]],
				COLORS[RED]
			],
			[
				[[14, 0], [14.5, 1], [15, 2], [14, 2], [13.5, 1], [12.5, 1], [12, 0], [13, 0]],
				[[true, [12.5, 1]], [true, [14, 2]], [false, [13.5, 1]], [true, [13.5, 1]], [false, [13, 0]], [false, [12, 0]]],
				COLORS[RED]
			],
			[
				[[2.5, 9], [3.5, 9], [4, 10], [3.5, 11], [2.5, 11], [1.5, 11], [1, 10], [2, 10]],
				[[false, [2.5, 9]], [false, [1, 10]], [true, [1.5, 11]], [false, [2, 10]], [true, [2, 10]], [true, [2.5, 11]], [false, [3, 10]], [true, [3, 10]]],
				COLORS[GREEN]
			],
			[
				[[12, 12], [11.5, 11], [12, 10], [13, 10], [13.5, 11], [14, 12], [13, 12], [12.5, 11]],
				[[false, [11.5, 11]], [true, [11.5, 11]], [false, [12, 10]], [true, [12.5, 11]], [false, [12.5, 11]], [true, [13, 12]]],
				COLORS[BLUE]
			],
			[
				[[5, 10], [4.5, 11], [4, 10], [4.5, 9], [5.5, 9], [6, 10], [6.5, 11], [5.5, 11]],
				[[false, [5, 10]], [true, [4, 10]], [false, [4, 10]], [false, [4.5, 9]], [true, [5, 10]], [true, [5.5, 11]]],
				COLORS[GREEN]
			],
			[
				[[14, 10], [15, 10], [16, 10], [15.5, 11], [16, 12], [15, 12], [14, 12], [14.5, 11]],
				[[false, [14, 10]], [true, [14.5, 11]], [false, [15, 10]], [false, [14.5, 11]], [true, [14, 12]], [true, [15, 12]]],
				COLORS[GREEN]
			],
			[
				[[16.5, 9], [17, 10], [17.5, 11], [18, 12], [17, 12], [16.5, 11], [16, 10]],
				[[true, [16, 10]], [false, [16, 10]], [true, [16.5, 11]], [false, [16.5, 11]], [true, [17, 12]]],
				COLORS[RED]
			],
			[
				[[0, 12], [1, 12], [2, 12], [2.5, 13], [2, 14], [1.5, 13], [1, 14], [0.5, 13]],
				[[false, [0, 12]], [true, [0.5, 13]], [false, [1, 12]], [true, [1.5, 13]], [false, [1.5, 13]], [false, [0.5, 13]]],
				COLORS[GREEN]
			],
			[
				[[3, 12], [4, 12], [5, 12], [5.5, 11], [6, 12], [5.5, 13], [4.5, 13], [3.5, 13]],
				[[false, [3, 12]], [true, [3.5, 13]], [false, [4, 12]], [true, [4.5, 13]], [false, [5, 12]], [true, [5, 12]]],
				COLORS[YELLOW]
			],
			[
				[[7.5, 13], [8, 12], [9, 12], [8.5, 13], [8, 14], [7, 14], [6, 14], [5.5, 13], [6.5, 13]],
				[[true, [6, 14]], [false, [6.5, 13]], [true, [7, 14]], [false, [7.5, 13]], [true, [7.5, 13]], [false, [8, 12]], [false, [5.5, 13]]],
				COLORS[YELLOW]
			],
			[
				[[9, 14], [9.5, 13], [10.5, 13], [11, 12], [11.5, 13], [12, 14], [11, 14], [10, 14]],
				[[true, [9, 14]], [false, [9.5, 13]], [true, [10, 14]], [false, [10.5, 13]], [true, [10.5, 13]], [true, [11, 14]]],
				COLORS[GREEN]
			],
			[
				[[13, 14], [12.5, 13], [13.5, 13], [14.5, 13], [15, 14], [14.5, 15], [14, 14]],
				[[true, [14, 14]], [false, [12.5, 13]], [true, [13, 14]], [false, [13.5, 13]], [false, [14, 14]]],
				COLORS[RED]
			],
			[
				[[3, 16], [2.5, 15], [2, 14], [3, 14], [4, 14], [4.5, 15], [5, 16], [4, 16]],
				[[true, [3, 16]], [false, [2, 14]], [true, [2.5, 15]], [false, [2.5, 15]], [false, [3, 14]], [false, [3.5, 15]], [true, [3.5, 15]], [true, [4, 16]]],
				COLORS[YELLOW]
			],
			[
				[[15.5, 13], [16.5, 13], [17.5, 13], [18, 14], [17.5, 15], [16.5, 15], [16, 14]],
				[[false, [15.5, 13]], [true, [16, 14]], [false, [16, 14]], [false, [16.5, 13]], [true, [17, 14]], [false, [17, 14]], [true, [16.5, 15]]],
				COLORS[YELLOW]
			]
		];
		
		this.pieces = new Array();
		for(var rawPiece of rawPieces){
			var piece = new Piece(this, rawPiece[0], rawPiece[1], rawPiece[2]);
			this.pieces.push(piece);
		}
	}
	
	overlapsAnyPiece(piece){
		for(var p of this.pieces){
			if(p !== piece && p.overlaps(piece)){
				return p;
			}
		}
		
		return null;
	}
	
	anyPieceProperlyContainsLine(bp1, bp2){
		for(var piece of this.pieces){
			if(piece.properlyContainsLine(bp1, bp2)) return true;
		}
		return false;
	}
	
	anyPieceContainsTriangle(leftMostBoardP, isPointingUp){
		for(var piece of this.pieces){
			if(piece.containsTriangle(leftMostBoardP, isPointingUp)) return true;
		}
		return false;
	}
	
	getPieceThatHasGridPoints(gridPoints){
		for(var piece of this.pieces){
			if(piece.boardPoints.length == gridPoints.length && piece.hasGridPoints(gridPoints)) return piece;
		}
		return null;
	}
	
	getNeighbouringPieces(piece){
		var r = new Array();
		for(var p of this.pieces){
			if(p !== pieces && p.isNeighbouring(piece)){
				r.push(p);
			}
		}
		return r;
	}
	
	drawLine(boardP1, boardP2){
		this.ctx.moveTo(boardP1.x, boardP1.y);
		this.ctx.lineTo(boardP2.x, boardP2.y);
	}
	
	drawGrid(){
		var gw = this.gridSize.x;
		var gh = this.gridSize.y;
		var tw = this.triangleBox.x;
		var th = this.triangleBox.y;
		
		this.ctx.beginPath();
		
		//diagonal lines
		for(var i=-gh/2; i<gw; i++){
			//left corners
			if(i<0){
				this.drawLine(new Vector(0, th * -2 * i), new Vector(tw * (i+(gh/2)), th * gh));
				this.drawLine(new Vector(tw * (i+(gh/2)), 0), new Vector(0, th * 2 * i + th * gh));
			//right corners
			}else if(i>=gw-(gh/2)){
				this.drawLine(new Vector(tw * i, 0), new Vector(tw * gw, th * 2*(gw-i)));
				this.drawLine(new Vector(tw * gw, th * 2 * (i-gw+gh/2)), new Vector(tw * i, th * gh));
			//middle part
			}else{
				this.drawLine(new Vector(tw * i, 0), new Vector(tw * (i+(gh/2)), th * gh));
				this.drawLine(new Vector(tw * (i+(gh/2)), 0), new Vector(tw * i, th * gh));
			}
		}
		
		//horizontal lines
		for(var i=0; i<=gh; i++){
			this.drawLine(new Vector(0, th * i), new Vector(tw * gw, th * i));
		}
		
		//vertical lines
		this.drawLine(new Vector(0, 0), new Vector(0, th * gh));
		this.drawLine(new Vector(tw * gw, 0), new Vector(tw * gw, th * gh));
		
		this.ctx.strokeStyle = "white";
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	drawTargetPolygon(){
		if(this.targetPolygonBoardPoints){
			this.ctx.beginPath();
					
			//first vertex
			var bp = this.targetPolygonBoardPoints[0];
			this.ctx.moveTo(bp.x, bp.y);
			
			//all other vertices
			for(var i=1; i<this.targetPolygonBoardPoints.length; i++){
				var bp = this.targetPolygonBoardPoints[i];
				this.ctx.lineTo(bp.x, bp.y);
			}
			
			this.ctx.fillStyle = "#AAAAAA";
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
	
	draw(){
		this.ctx.clearRect(0, 0, this.gridSize.x * this.triangleBox.x, this.gridSize.y * this.triangleBox.y);
		this.drawTargetPolygon();
		this.drawGrid();
		
		for(var piece of this.pieces){
			if(piece !== this.selectedPiece) piece.draw(this.ctx);
		}
		if(this.selectedPiece) this.selectedPiece.draw(this.ctx);
	}
	
	savePiecesAsCookie(){
		var cookieString = "";
		for(var piece of this.pieces){
			cookieString += piece.toCookieString();
		}
		
		this.cookiesHelper.removeCookie("board");
		this.cookiesHelper.setCookie("board", cookieString);
	}
	
	loadPiecesFromCookie(){
		var pattern = /(p|v|t|,|[0-9\.]+)/g;
		var cookieString = this.cookiesHelper.getCookie("board");
		
		if(cookieString){
			var m, p;
			this.pieces = new Array();
			
			m = pattern.exec(cookieString);
			if(m && (m[1] == "p")){
				do{
					p = Piece.fromCookieString(this, pattern, cookieString);
					this.pieces.push(p);
				}while(pattern.lastIndex > 0); //continue loop if there is more of cookieString to parse
			}
			
		}else{
			console.log("Could not load board from cookie!");
		}
	}
}
