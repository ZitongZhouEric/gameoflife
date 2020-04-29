/*
myboard.js
front-end js that animates game of life board

Acknowledgement: 
	https://bitstorm.org/gameoflife/;
	https://www.w3schools.com/graphics/tryit.asp?filename=trygame_default_gravity;
*/ 

//board is running
let isRunning = false;

//obtain query string
const urlParams = new URLSearchParams(window.location.search);
const bid = urlParams.get('bid');

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
					//to activate
					if (!this.board.getOldCell(row, col) && this.board.getCell(row, col)){
						this.context.fillStyle = "#EEEE00";
						this.context.fillRect(...this.indexToPixel(row, col), this.pixelWidth - 1, this.pixelWidth - 1);
					}
					//to deactivate
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

			this.renderCanvasOnNext();
		},
		start: function (bid) {
			
			this.canvas.width = this.pixels * (this.pixelWidth + this.lineWidth) + this.lineWidth;
			this.canvas.height = this.canvas.width;

			//initialize board data structure, check if bid is supplied
			//if yes, xhr request
			if (bid){
				let xhr = new XMLHttpRequest();
				xhr.open('GET', '/get-board?bid=' + bid, true);
				const myBoard_alias = this;
				xhr.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200){
						//on Receiving Thumbnails
						const thumbnail = JSON.parse(this.responseText).board;
						const data = deThumbnailify(thumbnail.board, myBoard_alias.pixels);

						myBoard_alias.board = new Board(data, myBoard_alias.pixels);
						// const env = document.getElementById('boards-grid');
						// boardThumbnails = boards.map(b => new BoardThumbnail(b.board, env, b.name, b.username, b._id));

						// //on Rendering Thumbnails
						// attachCommentSectionListeners();	
						myBoard_alias.boardGridSetup();
						myBoard_alias.frameNo = 0;		
					}
				};
				xhr.send();
			}
			//no use default board
			else{
				this.board = new Board(deThumbnailify([false, true, false, false, true, false, false, true, false], this.pixels), this.pixels);
				this.board.populate(false);
				this.boardGridSetup();
				this.frameNo = 0;
			}
			
			

			

			//this.continue(1000);
			
		},
		continue: function (ms){
			this.interval = setInterval(this.updateBoard.bind(this), ms);
			isRunning = true;
		},
		stop: function(){
			clearInterval(this.interval);
			isRunning = false;
		}
	}

//convert a thumbnail to a board data
function deThumbnailify(data, targetPixels){
	
	function populate(num, elem){
		let d = [];
		for (let i = 0; i < num; i++){
			d.push(elem);
		}
		return d;
	}

	let dataWidth = Math.floor(Math.sqrt(data.length));
	let newdata = [];

	//if the matrix happens to be the right dimension
	if (data.length === targetPixels * targetPixels){
		return data;
	}
	//if the matrix is smaller
	else if (data.length < targetPixels * targetPixels){
		const x = (targetPixels - dataWidth) / 2;
		const upGap = Math.ceil(x), leftGap = upGap, downGap = Math.floor(x), rightGap = downGap;
		newdata = newdata.concat(populate(upGap * targetPixels, false));

		for(let i = 0; i < dataWidth; i++){
			newdata = newdata.concat(populate(leftGap, false))
			.concat(data.slice(i * dataWidth, (i + 1) * dataWidth))
			.concat(populate(rightGap, false))
		}
		newdata = newdata.concat(populate(downGap * targetPixels, false));
	}
		
	return newdata;
}

function startGame(bid){
		myBoard.start(bid);
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
	
	startGame(bid);
	myBoard.board.isAlive = userIsAliveFunc;
	
}

//trim board data, getting rid of "false" rows and cols, return a n^2 size bool array representing data
function trimData(data){
	const width = Math.floor(Math.sqrt(data.length));
	const max_trim = Math.floor((width - 1) / 2);

	let trim1 = 0
	for (; trim1 < max_trim; trim1++){
		const rowTop = trim1, colLeft = trim1;
		let breakFlag = false;
		for (i = 0; i < width; i++){
			if (myBoard.board.getCell(rowTop, i) || myBoard.board.getCell(i, colLeft)){
				breakFlag = true;
				break;
			}
		}
		if (breakFlag){
			break;
		}
	}

	let trim2 = 0
	for (; trim2 < width - trim1; trim2++){
		const rowDown = width - 1 - trim2, colRight = width - 1 - trim2;
		let breakFlag = false;
		for (i = 0; i < width; i++){
			if (myBoard.board.getCell(rowDown, i) || myBoard.board.getCell(i, colRight)){
				breakFlag = true;
				break;
			}
		}
		if (breakFlag){
			break;
		}
	}

	const newdata = [];
	for(let row = trim1; row < width - trim2; row++){
		for(let col = trim1; col < width - trim2; col++){
			newdata.push(myBoard.board.getCell(row, col));
		}
	}
	return newdata;
} 

/*
	send board only to the server AJAX
*/

document.getElementById('submit-board-only-btn').addEventListener('click', function (evt) {
	//check if the username entered is empty
	if (document.getElementById('username').value === ''){
		alert('enter a valid username to submit');
		return;
	}

	//stop the board from running
	if (isRunning){
		myBoard.stop();
		document.querySelector('#runbtn').textContent = "Run";
	}

	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/', true);
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200){
			console.log('responseText: ', this.responseText);
		}
	};
	
	let bd = JSON.stringify({username: document.getElementById('username').value, 
								name: document.getElementById('board-name').value, 
								data: trimData(myBoard.board.data)
							});
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(bd);

});

// /*
// 	TODO: send board and rule to the server, AJAX
// */
// document.getElementById('submit-board-rule-btn').addEventListener('click', function (evt) {
// 	if (isRunning){
// 		myBoard.stop();
// 		document.querySelector('#runbtn').textContent = "Run";
// 	}

// 	// body... 
// });
	
startGame(bid);