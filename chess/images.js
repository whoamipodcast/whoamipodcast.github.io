const createImage = async (filename) => {
	let image = new Image();
	image.src = filename;
	await image.decode();
	return image;
};

/*const getPieceImages = async (pieceImageFilenames) => {
	const pieceImageNames = [
		"blackKing",
		"blackQueen",
		"blackBishop",
		"blackHorse",
		"blackRook",
		"blackPawn",
		"whiteKing",
		"whiteQueen",
		"whiteBishop",
		"whiteHorse",
		"whiteRook",
		"whitePawn"
	];
	
	const pieceImages = {};
	for(let pieceImageName of pieceImageNames){
		pieceImages[pieceImageName] = await createImage("pieces/" + pieceImageName + ".png");
	}
	
	return pieceImages;
};*/

const getPieceImages = async (pieceImageFilenames) => {
	const pieceNames = ["Pawn", "Rook", "Horse", "Bishop", "Queen", "King"];
	
	const pieceImages = [[], []];
	
	for(let pieceName of pieceNames) pieceImages[0].push(await createImage("pieces/black" + pieceName + ".png"));
	for(let pieceName of pieceNames) pieceImages[1].push(await createImage("pieces/white" + pieceName + ".png"));
	
	return pieceImages;
};