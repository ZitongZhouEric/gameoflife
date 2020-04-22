/*
myboard.js
Acknowledgement: 
	https://bitstorm.org/gameoflife/;
	https://www.w3schools.com/graphics/tryit.asp?filename=trygame_default_gravity;
*/ 


//data structure of the board 
class Board{

	//data is an array of boolean, presumasbly of size 100x100 
	constructor(data, lineWidth, pixelWidth, pixels) {
		this.data = data;
		this.oldData = undefined;
		this.lineWidth = lineWidth;
		this.pixelWidth = pixelWidth;
		this.pixels = pixels;
		this.isAlive = function(isAlive, left, right, up, down, topleft, topRight, downleft, downRight){
			let neighborsAlive = 0;
			for (let x of Array.from(arguments).slice(1)){
					if (x)
						neighborsAlive++;
			}
			return ((isAlive && (neighborsAlive === 2 || neighborsAlive === 3)) || neighborsAlive == 3);
		}
	};

	populate(value){
		for (let i = 0; i < this.pixels * this.pixels; i++)
			this.data.push(value);
	}

	//for testing only
	setCell2(row, col, value){
		this.data[row * this.pixels + col] = value;
	}

	setCell(row, col, data, value){
		data[row * this.pixels + col] = value;
	}

	getCell(row, col){
		return this.data[row * this.pixels + col];
	}

	getOldCell(row, col){
		return this.oldData[row * this.pixels + col];
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

				this.setCell(row, col, newdata, this.isAlive(this.getCell(row, col), left, right, up, down, topLeft, topRight, downLeft, downRight));
			}
		}

		if (this.data === newdata)
			return "STOP";
		this.oldData = this.data;
		this.data = newdata;

		return "CONT";
	}
}

//front-end, animated, html canvas for displaying the board
const myBoard = {
		canvas: document.getElementById('canvas'),
		context: this.canvas.getContext('2d'),
		pixelWidth: 8,
		lineWidth: 1,
		pixels: 100,
		board: undefined,
		indexToPixel: function(x, y){
			//return [col, row]
			return [1 + y * (this.pixelWidth + this.lineWidth), 1 + x * (this.pixelWidth + this.lineWidth)];
		},
		renderCanvasOnNext: function(){
			for (let row = 0; row < this.pixels; row++){
				for (let col = 0; col < this.pixels; col++){
					if (!this.board.getOldCell(row, col) && this.board.getCell(row, col)){
						this.context.fillStyle = "#EEEE00";
						this.context.fillRect(...this.indexToPixel(row, col), this.pixelWidth - 1, this.pixelWidth - 1);
					}
					else if (this.board.getOldCell(row, col) && !this.board.getCell(row, col)){
						this.context.fillStyle = "#FFFFFF";
						this.context.fillRect(...this.indexToPixel(row, col), this.pixelWidth - 1, this.pixelWidth - 1);
					}
				}
			}
		},
		updateBoard: function() {
			let ctx = this.context;
			this.board.next();
			this.renderCanvasOnNext();
			//TODO: render;
		},
		boardGridSetup: function(){
			let ctx = this.context;

			//some styling
			ctx.lineWidth = this.lineWidth; //line width is 1px
			ctx.strokeStyle = "#AAAAAA";
			ctx.fillStyle = "#EEEE00";

			//vertical grid lines

			for (let x = 0; x <= this.canvas.width; x += this.pixelWidth + this.lineWidth){
				ctx.moveTo(x, 0);
				ctx.lineTo(x, this.canvas.height);
				ctx.stroke();
			}

			//horizontal grid lines
			for (let y = 0; y <= this.canvas.height; y += this.pixelWidth + this.lineWidth){
				ctx.moveTo(0, y);
				ctx.lineTo(this.canvas.width, y);
				ctx.stroke();
			}

			//default "activated" cell
			this.board.setCell2(0, 1,true);

			//ctx.fillRect(col, row, widthcol, widthrow)
			ctx.fillRect(...this.indexToPixel(0, 1), this.pixelWidth - 1, this.pixelWidth - 1);

			this.board.setCell2(1, 1,true);
			ctx.fillRect(...this.indexToPixel(1, 1), this.pixelWidth - 1, this.pixelWidth - 1);

			this.board.setCell2(2, 1,true);
			ctx.fillRect(...this.indexToPixel(2, 1), this.pixelWidth - 1, this.pixelWidth - 1);

		},
		start: function () {
			this.canvas.width = this.pixels * (this.pixelWidth + this.lineWidth) + this.lineWidth;
			this.canvas.height = this.canvas.width;

			//initialize board data structure
			this.board = new Board([], this.lineWidth, this.pixelWidth, this.pixels);
			this.board.populate(false);
			this.boardGridSetup();

			this.frameNo = 0;
			this.interval = setInterval(this.updateBoard.bind(this), 1000);
		}
	}



function startGame(){
		myBoard.start();
}

startGame();