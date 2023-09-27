let selectedPiece = null;
let possibleNewPlaces = [];


const markPossibleNewPlaces = (possibleNewPlaces, board) => {
	for(let place of possibleNewPlaces){
		drawTileAndPiece(place[0], place[1], "red", board);
	}
}

const selectPiece = (tileX, tileY, piece, board) => {
	drawBoard(board);
	drawTileAndPiece(tileX, tileY, "blue", board);
		
	possibleNewPlaces = piece.move(piece, board.placements);
	markPossibleNewPlaces(possibleNewPlaces, board);
	
	selectedPiece = piece;
}

const movePiece = (tileX, tileY, piece, board) => {
	board.placements[piece.tileY][piece.tileX] = null;
	board.placements[tileY][tileX] = piece;
	
	piece.tileX = tileX;
	piece.tileY = tileY;
	
	drawBoard(board);
	
	selectedPiece = null;
}

const removePieceFromBoard = (piece, board) => {
	board.placements[piece.tileY][piece.tileX] = null;
	
	piece.tileX = -1;
	piece.tileY = -1;
	
	if(piece.isBlack){
		board.whiteBench[piece.pieceIndex]++;
	}else{
		board.blackBench[piece.pieceIndex]++;
	}
	
	console.log("black bench:", board.blackBench);
	console.log("white bench:", board.whiteBench);
}

const isAPossibleNewPlace = (tileX, tileY) => {
	return possibleNewPlaces.some(([newX, newY]) => newX == tileX && newY == tileY);
}

const makeCanvasClickable = (canvas, board) => {
	canvas.onclick = (event) => {
		const rect = canvas.getBoundingClientRect();
		const canvasX = event.clientX - rect.left;
		const canvasY = event.clientY - rect.top;
		
		const clickX = Math.floor((canvasX - board.boardX) / tileSize);
		const clickY = Math.floor((canvasY - board.boardY) / tileSize);
		
		console.log("clicked", clickX, clickY);
		
		if(clickX >= 0 && clickX < 8 && clickY >= 0 && clickY < 8){
			const piece = board.placements[clickY][clickX];
			
			//select a place to move selected piece to
			if(selectedPiece && possibleNewPlaces && isAPossibleNewPlace(clickX, clickY)){
				
				//if new place contains enemy piece
				if(piece){
					removePieceFromBoard(piece, board);
				}
				
				movePiece(clickX, clickY, selectedPiece, board);
				board.isWhitesTurn = !board.isWhitesTurn;
			
			//select a piece
			}else if(piece && piece.isBlack != board.isWhitesTurn){
				selectPiece(clickX, clickY, piece, board);
			}
			
		}
	};
}