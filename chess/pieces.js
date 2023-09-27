/*
const PAWN = 0;
const ROOK = 1;
const HORSE = 2;
const BISHOP = 3;
const QUEEN = 4;
const KING = 5;
*/

const pieceNames = ["Pawn", "Rook", "Horse", "Bishop", "Queen", "King"];

const createPiece = (isBlack, pieceIndex, tileX, tileY, pieceImages) => {
	return {
		isBlack: isBlack,
		pieceIndex: pieceIndex,
		tileX: tileX,
		tileY: tileY,
		//"image": pieceImages[(isBlack ? "black" : "white") + pieceNames[pieceIndex]],
		"image": pieceImages[(isBlack ? 0 : 1)][pieceIndex],
		move: getPlacesFunction(pieceIndex)
	};
}

const createPieces = (pi) => {
	return [
		createPiece(true, 1, 0, 0, pi),
		createPiece(true, 2, 1, 0, pi),
		createPiece(true, 3, 2, 0, pi),
		createPiece(true, 4, 3, 0, pi),
		createPiece(true, 5, 4, 0, pi),
		createPiece(true, 3, 5, 0, pi),
		createPiece(true, 2, 6, 0, pi),
		createPiece(true, 1, 7, 0, pi),
		
		createPiece(true, 0, 0, 1, pi),
		createPiece(true, 0, 1, 1, pi),
		createPiece(true, 0, 2, 1, pi),
		createPiece(true, 0, 3, 1, pi),
		createPiece(true, 0, 4, 1, pi),
		createPiece(true, 0, 5, 1, pi),
		createPiece(true, 0, 6, 1, pi),
		createPiece(true, 0, 7, 1, pi),
		
		createPiece(false, 0, 0, 6, pi),
		createPiece(false, 0, 1, 6, pi),
		createPiece(false, 0, 2, 6, pi),
		createPiece(false, 0, 3, 6, pi),
		createPiece(false, 0, 4, 6, pi),
		createPiece(false, 0, 5, 6, pi),
		createPiece(false, 0, 6, 6, pi),
		createPiece(false, 0, 7, 6, pi),
		
		createPiece(false, 1, 0, 7, pi),
		createPiece(false, 2, 1, 7, pi),
		createPiece(false, 3, 2, 7, pi),
		createPiece(false, 4, 3, 7, pi),
		createPiece(false, 5, 4, 7, pi),
		createPiece(false, 3, 5, 7, pi),
		createPiece(false, 2, 6, 7, pi),
		createPiece(false, 1, 7, 7, pi),
	];
}

/*const getPieces = (pieceImages) => {
	return [
		{ isBlack: true, image: pi["blackRook"], tileX: 0, tileY: 0, move: rookPlaces },
		{ isBlack: true, image: pi["blackHorse"], tileX: 1, tileY: 0, move: horsePlaces },
		{ isBlack: true, image: pi["blackBishop"], tileX: 2, tileY: 0, move: bishopPlaces },
		{ isBlack: true, image: pi["blackQueen"], tileX: 3, tileY: 0, move: queenPlaces },
		{ isBlack: true, image: pi["blackKing"], tileX: 4, tileY: 0, move: kingPlaces },
		{ isBlack: true, image: pi["blackBishop"], tileX: 5, tileY: 0, move: bishopPlaces },
		{ isBlack: true, image: pi["blackHorse"], tileX: 6, tileY: 0, move: horsePlaces },
		{ isBlack: true, image: pi["blackRook"], tileX: 7, tileY: 0, move: rookPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 0, tileY: 4, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 1, tileY: 3, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 2, tileY: 5, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 3, tileY: 2, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 4, tileY: 1, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 5, tileY: 1, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 6, tileY: 1, move: pawnPlaces },
		{ isBlack: true, image: pi["blackPawn"], tileX: 7, tileY: 1, move: pawnPlaces },

		{ isBlack: false, image: pi["whitePawn"], tileX: 0, tileY: 5, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 1, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 2, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 3, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 4, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 5, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 6, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whitePawn"], tileX: 7, tileY: 6, move: pawnPlaces },
		{ isBlack: false, image: pi["whiteRook"], tileX: 0, tileY: 7, move: rookPlaces },
		{ isBlack: false, image: pi["whiteHorse"], tileX: 1, tileY: 7, move: horsePlaces },
		{ isBlack: false, image: pi["whiteBishop"], tileX: 2, tileY: 7, move: bishopPlaces },
		{ isBlack: false, image: pi["whiteQueen"], tileX: 3, tileY: 7, move: queenPlaces },
		{ isBlack: false, image: pi["whiteKing"], tileX: 4, tileY: 7, move: kingPlaces },
		{ isBlack: false, image: pi["whiteBishop"], tileX: 5, tileY: 7, move: bishopPlaces },
		{ isBlack: false, image: pi["whiteHorse"], tileX: 6, tileY: 7, move: horsePlaces },
		{ isBlack: false, image: pi["whiteRook"], tileX: 7, tileY: 7, move: rookPlaces },
	];
};*/

const getPlacements = (pieces) => {
	const placements = [];
	for(let y=0; y<8; y++){
		const placementsRow = [];
		for(let x=0; x<8; x++){
			placementsRow.push(null);
		}
		placements.push(placementsRow);
	}
	
	for(let piece of pieces){
		placements[piece.tileY][piece.tileX] = piece;
	}

	return placements;
}