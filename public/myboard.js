/*
myboard.js
Acknowledgement: 
	https://bitstorm.org/gameoflife/;
	https://www.w3schools.com/graphics/tryit.asp?filename=trygame_default_gravity;
*/ 


//front-end, animated, html canvas for displaying the board

class Board{

	//data is an array of boolean, presumasbly of size 100x100 
	constructor(data, lineWidth, pixelWidth, pixels) {
		this.data = data;
		this.lineWidth = lineWidth;
		this.pixelWidth = pixelWidth;
		this.pixels = pixels;
		this.isAlive = function(left, right, up, down){
			let neighborsAlive = 0;
			if (left)
				neighborsAlive++;
			if (right)
				neighborsAlive++;
			if (up)
				neighborsAlive++;
			if (down)
				neighborsAlive++;
			return (neighborsAlive === 2 || neighborsAlive === 3);
		}
	};

	setCell(x, y, value){
		data[x * this.pixels + y] = value;
	}

	getCell(x, y){
		return data[x * this.pixels + y];
	}

	setAliveRule(func){
		//TODO: check func is a valid rule
		this.isAlive = func;
	}

	updateBoard(){
		//make a copy of data
		let newdata = [...this.data];
	}
}

const myBoard = {
		canvas: document.getElementById('canvas'),
		context: this.canvas.getContext('2d'),
		pixelWidth: 8,
		lineWidth: 1,
		pixels: 100,
		board: new Board([], this.lineWidth, this.pixelWidth),
		indexToPixel: function(x, y){
			return [1 + x * (this.pixelWidth + this.lineWidth), 1 + y * (this.pixelWidth + this.lineWidth)];
		},	
		updateBoard: function() {
			let ctx = this.context;

		},
		boardGridSetup: function(){
			let ctx = this.context;

			//some styling
			ctx.lineWidth = this.lineWidth; //line width is 1px
			ctx.strokeStyle = "#AAAAAA";
			ctx.fillStyle = "#FFFF00";

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
			ctx.fillRect(1,1,7,7);

			ctx.fillRect(10,10,7,7);

			ctx.fillRect(19,19,7,7);

		},
		start: function () {
			this.canvas.width = this.pixels * (this.pixelWidth + this.lineWidth) + this.lineWidth;
			this.canvas.height = this.canvas.width;

			console.log(this.board.data.length);
			
			this.boardGridSetup();

			this.frameNo = 0;
			this.interval = setInterval(this.updateBoard, 20);
		}
	}



function startGame(){
		myBoard.start();
}

startGame();