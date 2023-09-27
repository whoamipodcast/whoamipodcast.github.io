const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const boardSize = canvas.width;
const tileSize = boardSize / 8; //Math.min(canvas.width, canvas.height) / 8;
const tileBorder = Math.round(tileSize * 0.1);

const lightTileColor = "white";
const darkTileColor = "gray";


const drawTile = (tileX, tileY, backgroundColor, board) => {
	
	//used for gray/white tiles
	if(!backgroundColor){
		context.fillStyle = (tileX + tileY) % 2 ? darkTileColor : lightTileColor;
		context.fillRect(board.boardX + tileX * tileSize, board.boardY + tileY * tileSize, tileSize, tileSize);
		
	//used for other markings
	}else{
		context.fillStyle = backgroundColor;
		context.fillRect(board.boardX + tileX * tileSize + tileBorder, board.boardY + tileY * tileSize + tileBorder, tileSize - 2 * tileBorder, tileSize - 2 * tileBorder);
	}
};

const drawPiece = (piece, board) => {
	context.drawImage(piece.image, board.boardX + piece.tileX * tileSize + tileBorder, board.boardY + piece.tileY * tileSize + tileBorder, tileSize - 2 * tileBorder, tileSize - 2 * tileBorder);
};


const drawTileAndPiece = (tileX, tileY, backgroundColor, board) => {
	if(tileX >= 0 && tileX < 8 && tileY >= 0 && tileY < 8){
		drawTile(tileX, tileY, backgroundColor, board);
		
		const piece = board.placements[tileY][tileX];
		if(piece){
			drawPiece(piece, board);
		}
	}
};

const drawBench = (isBlackBench, benchY, bench, pieceImagesForColor) => {
	context.fillStyle = "lightgreen";
	context.fillRect(0, benchY, boardSize, 100);
	
	let slot = 0;
	for(let pieceIndex=0; pieceIndex<bench.length; pieceIndex++){
		if(bench[pieceIndex] > 0){
			for(let i=0; i<bench[pieceIndex]; i++){
				context.drawImage(pieceImagesForColor[pieceIndex], slot * tileSize * 0.5, benchY + 5);
				slot++;
			}
		}
	}
}

const drawBenches = (board) => {
	drawBench(true, board.blackBenchY, board.blackBench, board.pieceImages[1]);
	drawBench(false, board.whiteBenchY, board.whiteBench, board.pieceImages[0]);
}

const drawBoard = (board) => {
	for(let tileY=0; tileY<8; tileY++){
		for(let tileX=0; tileX<8; tileX++){
			drawTileAndPiece(tileX, tileY, null, board);
		}
	}
	
	drawBenches(board);
};