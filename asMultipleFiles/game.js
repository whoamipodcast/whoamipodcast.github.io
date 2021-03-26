class Game{
	constructor(cookiesHelper, canvas){
		var gridSize = new Vector(20, 16);
		this.cookiesHelper = cookiesHelper;
		this.board = new Board(this, cookiesHelper, canvas, gridSize);
		this.board.useStandardTargetPolygon();
		
		if(cookiesHelper.hasCookie("board")){
			this.board.loadPiecesFromCookie();
		}else{
			this.board.useStandardPieces();
		}
		this.board.savePiecesAsCookie();

		this.levels = new Levels(this.board);
		
		var interval = 40;
		var mouseDownDurationToFlipPiece = 700;
		var g = this;
		setInterval(function(){
			g.board.draw();
			//g.levels.draw();
			
			if(g.board.isMouseDown && !g.board.isMouseHeldDown && !g.board.isDragging){
				g.board.mouseDownDuration += interval;
				if(g.board.mouseDownDuration >= mouseDownDurationToFlipPiece){
					g.board.isMouseHeldDown = true;
					g.board.flipSelectedPiece();
				}
			}
			
			//ta.value = "mouseDown: " + g.board.isMouseDown + "\nmouseHeldDown: " + g.board.isMouseHeldDown + "\ndragging: " + g.board.isDragging + "\nmouseDownDuration: " + g.board.mouseDownDuration + "\nis a piece selected: " + (g.board.selectedPiece != null);
		}, interval);
	}
	
	checkIfCompletedLevel(){
		console.log("is level completed? " + this.levels.completedLevel8());
	}
}
