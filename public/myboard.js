/*
myboard.js
front-end js that animates game of life board

Acknowledgement: 
	https://bitstorm.org/gameoflife/;
	https://www.w3schools.com/graphics/tryit.asp?filename=trygame_default_gravity;
*/ 

//board is running
let isRunning = false;

//data structure of the board 
class Board{

	//data is an array of boolean, presumasbly of size 100x100 
	constructor(data, lineWidth, pixelWidth, pixels) {
		this.data = data;
		this.oldData = undefined;
		this.lineWidth = lineWidth;
		this.pixelWidth = pixelWidth;
		this.pixels = pixels;
		this.isAlive = function(isAlive, topLeft, top, topRight, left, right, btmLeft, btm, btmRight){
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

//front-end, animated, html canvas for displaying the board
const myBoard = {
		canvas: document.getElementById('canvas'),
		context: this.canvas.getContext('2d'),
		pixelWidth: 8,
		lineWidth: 1,
		pixels: 100,
		board: new Board(),
		ms: 1000,
		indexToPixel: function(x, y){
			//return [col, row]
			return [2 + y * (this.pixelWidth + this.lineWidth), 2 + x * (this.pixelWidth + this.lineWidth)];
		},
		pixelToIndex: function(col, row){
			if (col % 9 == 1 || row % 9 == 1)
				return "NON";
			else{
				return [Math.floor((row - 2) / (this.pixelWidth + this.lineWidth)), Math.floor((col - 2) / (this.pixelWidth + this.lineWidth))];
			}
		},
		flipCeil(row, col){
			this.board.setCell2(row, col, !this.board.getCell(row, col));
			this.flipCeilColor(row, col);
		},
		flipCeilColor(row, col){
			this.context.fillStyle = this.board.getCell(row, col)? "#EEEE00" : "#FFFFFF";
			this.context.fillRect(...this.indexToPixel(row, col), this.pixelWidth - 1, this.pixelWidth - 1);
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
		},
		boardGridSetup: function(){
			let ctx = this.context;

			//some styling
			ctx.lineWidth = this.lineWidth; //line width is 1px
			ctx.strokeStyle = "#AAAAAA";
			ctx.fillStyle = "#EEEE00";

			//vertical grid lines

			for (let x = 1; x <= this.canvas.width; x += this.pixelWidth + this.lineWidth){
				ctx.moveTo(x, 0);
				ctx.lineTo(x, this.canvas.height);
				ctx.stroke();
			}

			//horizontal grid lines
			for (let y = 1; y <= this.canvas.height; y += this.pixelWidth + this.lineWidth){
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

			//this.continue(1000);
			
		},
		continue: function (ms){
			this.interval = setInterval(this.updateBoard.bind(this), ms);
			isRunning = true;
		},
		stop: function(){
			clearInterval(this.interval);
			isRunning = false;
		},
		//switch the status of the cell on clicking
		onClick: function(){

		}
	}



function startGame(){
		myBoard.start();
}

//stop/run the canvas on clicking the button
document.querySelector('#runbtn').addEventListener('click', function(evt){
	if (isRunning){
		myBoard.stop();
		this.textContent = "Run";
	}
	else{
		myBoard.continue(myBoard.ms);
		this.textContent = "Stop";
	}
})

/*
	1) stop the canvas on clicking the canvas if running
	2) switch cell if not running
*/
document.querySelector('#canvas').addEventListener('click', function(evt){
	if (isRunning){
		myBoard.stop();
		document.querySelector('#runbtn').textContent = "Run";
	}
	else{
		console.log(evt.offsetX, " ", evt.offsetY);
		console.log(myBoard.pixelToIndex(evt.offsetX, evt.offsetY));
		myBoard.flipCeil(...myBoard.pixelToIndex(evt.offsetX, evt.offsetY));
	}
})

//
function applyUserRule(userCode){
	const funcBodyRegex = new RegExp('function isAlive\\(alive, neighbors\\)\\{(.|\n)*\\}')
	const toCrop = 34;
	const funcBody = funcBodyRegex.exec(userCode)[0].slice(toCrop);

	const ff = new Function('alive', 'neighbors', funcBody);
	const userIsAliveFunc = function(alive,a,b,c,d,e,f,g,h) {
		return ff(alive, [a,b,c,d,e,f,g,h]); 
	};
	
	startGame();
	myBoard.board.isAlive = userIsAliveFunc;
	
}

	
startGame();