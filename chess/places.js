const pawnPlaces = (piece, placements) => {
	const possibleNewPlaces = [];
	const deltaY = piece.isBlack ? 1 : -1;
	
	//one row forward
	let newY = piece.tileY + deltaY;
	if(newY >= 0 && newY < 8){
	
		//strike enemy
		const newXs = [piece.tileX - 1, piece.tileX + 1];
		for(let newX of newXs){
			if(newX >= 0 && newX < 8){
				const p = placements[newY][newX];
				if(p && p.isBlack != piece.isBlack){
					possibleNewPlaces.push([newX, newY]);
				}
			}
		}
	
		//one space forward
		if(placements[newY][piece.tileX] == null){
			possibleNewPlaces.push([piece.tileX, newY]);
		
			//two spaces forward
			const initialY = piece.isBlack ? 1 : 6;
			if(piece.tileY == initialY && placements[newY][piece.tileX] == null){
				newY += deltaY;
				possibleNewPlaces.push([piece.tileX, newY]);
			}
		}
	}
	
	return possibleNewPlaces;
};

const rookPlaces = (piece, placements) => {
	const possibleNewPlaces = [];
	
	let newX, newY;
	
	const deltasXY = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	for(let deltaXY of deltasXY){
		
		newX = piece.tileX;
		newY = piece.tileY;
		
		while(true){
			newX += deltaXY[0];
			newY += deltaXY[1];
			
			if(newX >= 0 && newX < 8 && newY >= 0 && newY < 8){
				const p = placements[newY][newX];
				
				//move to empty space
				if(p == null){
					possibleNewPlaces.push([newX, newY]);
					
				//strike enemy (and if so, cannot move beyond)
				}else if(p && p.isBlack != piece.isBlack){
					possibleNewPlaces.push([newX, newY]);
					break;
					
				//movement no longer possible
				}else{
					break;
				}
			}else{
				break;
			}
		}
	}
	
	return possibleNewPlaces;
}

const bishopPlaces = (piece, placements) => {
	const possibleNewPlaces = [];
	
	let newX, newY;
	
	const deltasXY = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
	for(let deltaXY of deltasXY){
		
		newX = piece.tileX;
		newY = piece.tileY;
		
		while(true){
			newX += deltaXY[0];
			newY += deltaXY[1];
			
			if(newX >= 0 && newX < 8 && newY >= 0 && newY < 8){
				const p = placements[newY][newX];
				
				//move to empty space
				if(p == null){
					possibleNewPlaces.push([newX, newY]);
					
				//strike enemy (and if so, cannot move beyond)
				}else if(p && p.isBlack != piece.isBlack){
					possibleNewPlaces.push([newX, newY]);
					break;
					
				//movement no longer possible
				}else{
					break;
				}
			}else{
				break;
			}
		}
	}
	
	return possibleNewPlaces;
};

const horsePlaces = (piece, placements) => {
	const possibleNewPlaces = [];
	
	const deltasXY = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
	for(let deltaXY of deltasXY){
		
		const newX = piece.tileX + deltaXY[0];
		const newY = piece.tileY + deltaXY[1];
		
		if(newX >= 0 && newX < 8 && newY >= 0 && newY < 8){
			const p = placements[newY][newX];
			
			//move to empty space
			if(p == null){
				possibleNewPlaces.push([newX, newY]);
				
			//strike enemy (and if so, cannot move beyond)
			}else if(p && p.isBlack != piece.isBlack){
				possibleNewPlaces.push([newX, newY]);
			}
		}
	}
	
	return possibleNewPlaces;
};

const kingPlaces = (piece, placements) => {
	const possibleNewPlaces = [];
	
	const deltasXY = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
	for(let deltaXY of deltasXY){
		
		const newX = piece.tileX + deltaXY[0];
		const newY = piece.tileY + deltaXY[1];
		
		if(newX >= 0 && newX < 8 && newY >= 0 && newY < 8){
			const p = placements[newY][newX];
			
			//move to empty space
			if(p == null){
				possibleNewPlaces.push([newX, newY]);
				
			//strike enemy (and if so, cannot move beyond)
			}else if(p && p.isBlack != piece.isBlack){
				possibleNewPlaces.push([newX, newY]);
			}
		}
	}
	
	return possibleNewPlaces;
};

const queenPlaces = (piece, placements) => {
	let possibleNewPlaces = rookPlaces(piece, placements).concat(bishopPlaces(piece, placements));
	
	return possibleNewPlaces;
};

const getPlacesFunction = (pieceIndex) => {
	const placesFunctions = [pawnPlaces, rookPlaces, horsePlaces, bishopPlaces, queenPlaces, kingPlaces];
	return placesFunctions[pieceIndex];
}