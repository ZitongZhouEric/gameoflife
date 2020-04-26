/*
commnity.js
front-end js that displays the community grid of game of life boards

Acknowledgement: 
	
*/ 


function populate(num, elem){
		let d = [];
		for (let i = 0; i < num; i++){
			d.push(elem);
		}
		return d;
}

class BoardThumbnail{
	constructor(data, env, name, username){
		this.canvas = document.createElement('canvas');
		this.env = env;
		this.context = this.canvas.getContext('2d');
		this.pixelWidth = 8;
		this.lineWidth = 1;
		this.pixels = 20;
		this.board = new Board(this.thumbnailify(data), this.pixels);
		this.name = name;
		this.username = username;

		this.render();
	}

	indexToPixel(x, y){
		//return [col, row]
		return [2 + y * (this.pixelWidth + this.lineWidth), 2 + x * (this.pixelWidth + this.lineWidth)];
	}
	
	render(){
		this.canvas.width = this.pixels * (this.pixelWidth + this.lineWidth) + this.lineWidth;
		this.canvas.height = this.canvas.width;
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

		for (let row = 0; row < this.pixels; row++){
			for (let col = 0; col < this.pixels; col++)
				if (this.board.getCell(row, col))
					ctx.fillRect(...this.indexToPixel(row, col), this.pixelWidth - 1, this.pixelWidth - 1);
		}

		this.env.appendChild(this.canvas);

	}
	thumbnailify(data){
		let dataWidth = Math.floor(Math.sqrt(data.length));
		let newdata = [];

		if (data.length === this.pixels * this.pixels){
			return data;
		}
		else if (data.length < this.pixels * this.pixels){
			const x = (this.pixels - dataWidth) / 2;
			const upGap = Math.ceil(x), leftGap = upGap, downGap = Math.floor(x), rightGap = downGap;
			newdata = newdata.concat(populate(upGap * this.pixels, false));

			for(let i = 0; i < dataWidth; i++){
				newdata = newdata.concat(populate(leftGap, false))
				.concat(data.slice(i * dataWidth, (i + 1) * dataWidth))
				.concat(populate(rightGap, false))
			}
			newdata = newdata.concat(populate(downGap * this.pixels, false));
		}
		else{
			const row_offset = Math.floor((dataWidth - this.pixels) / 2), col_offset = row;
			for (let row = 0; row < this.pixels; row++){
				newdata = newdata.concat(data.slice((row_offset + row) * dataWidth + col_offset, (row_offset + row) * dataWidth + col_offset + this.pixels));
			}
			return newdata;
			if (newdata.length != this.pixels * this.pixels)
				console.log("ERRRR");
		}
		
		return newdata;
	}
}

//send xhr to the server to get a list of boards
function loadBoards(){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/community-request-grid', true);
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200){
			const responseJSON = JSON.parse(this.responseText);
			const boards = responseJSON.boards;
	
			const env = document.getElementById('boards-grid');
			const boardThumbnails = boards.map(b => new BoardThumbnail(b.board, env, b.name, b.username));			
		}
	};
	xhr.send();
}

loadBoards();