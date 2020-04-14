/*
myboard.js
Acknowledgement: 
	https://bitstorm.org/gameoflife/;
	https://www.w3schools.com/graphics/tryit.asp?filename=trygame_default_gravity;
*/ 


//front-end, animated, html canvas for displaying the board

const myBoard = {
		canvas: document.getElementById('canvas'),
		updateBoard: function() {
			// body... 
		},
		boardGridSetup: function(){
			let ctx = this.context;

			//some styling
			ctx.lineWidth = 1; //line width is 1px
			ctx.strokeStyle = "#AAAAAA";
			ctx.fillStyle = "#FFFF00";
			let pixelSize = this.canvas.width / 100;

			//vertical grid lines
			for (let x = pixelSize; x < this.canvas.width; x += pixelSize){
				ctx.moveTo(x, 0);
				ctx.lineTo(x, this.canvas.height);
				ctx.stroke();
			}

			//horizontal grid lines
			for (let y = pixelSize; y < this.canvas.height; y += pixelSize){
				ctx.moveTo(0, y);
				ctx.lineTo(this.canvas.width, y);
				ctx.stroke();
			}

			ctx.fillRect(501,501,8,8);
		},
		start: function () {
			this.canvas.width = 1000;
			this.canvas.height = 1000;
			this.canvas.style = 'red';
			this.context = this.canvas.getContext('2d');
			
			this.boardGridSetup();

			this.frameNo = 0;
			this.interval = setInterval(this.updateBoard, 20);
		}
	}



function startGame(){
		myBoard.start();
}

startGame();