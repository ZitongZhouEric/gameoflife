/*
commnity.js
front-end js that stores the definition of the class Board, the data structure 

*/

//data structure of the board 
class Board{

	//data is an array of boolean, presumasbly of size 100x100 
	constructor(data, pixels) {
		this.data = data;
		this.oldData = undefined;
		this.pixels = pixels;
		this.isAlive = function(isAlive, topLeft, top, topRight, left, right, btmLeft, btm, btmRight){
			//count the number of live neighbors
			let neighborsAlive = Array.from(arguments).slice(1).filter(x => x).length;
			
			return ((isAlive && (neighborsAlive === 2 || neighborsAlive === 3)) || neighborsAlive == 3);
		}
	};

	populate(value){
		for (let i = 0; i < this.pixels * this.pixels; i++)
			this.data.push(value);
	}

	setCell2(row, col, value){
		this.data[row * this.pixels + col] = value;
	}

	setCell(row, col, data, value){
		data[row * this.pixels + col] = value;
	}

	getCell(row, col){
		if (row < 0 || row >= this.pixels || col < 0 || col >= this.pixels)
			return false;
		return this.data[row * this.pixels + col];
	}

	getOldCell(row, col){
		return this.oldData? this.oldData[row * this.pixels + col] : false;
	}

	setAliveRule(func){
		//TODO: check func is a valid rule
		this.isAlive = func;
	}

	next(){
		//make a copy of data
		let newdata = [...this.data];
		for (let row = 0; row < this.pixels; row++){
			for (let col = 0; col < this.pixels; col++){
				let left = this.getCell(row, col - 1) || false;
				let right = this.getCell(row, col + 1) || false;
				let up = this.getCell(row - 1, col) || false;
				let down = this.getCell(row + 1, col) || false;
				let topLeft = this.getCell(row - 1, col - 1) || false;
				let topRight = this.getCell(row - 1, col + 1) || false;
				let downLeft = this.getCell(row + 1, col - 1) || false;
				let downRight = this.getCell(row + 1, col + 1) || false;

				this.setCell(row, col, newdata, this.isAlive(this.getCell(row, col), topLeft, up, topRight, left, right, downLeft, down, downRight));
			}
		}

		if (this.data === newdata)
			return "STOP";
		this.oldData = this.data;
		this.data = newdata;

		return "CONT";
	}
}