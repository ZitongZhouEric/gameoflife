/*
commnity.js
front-end js that displays the community grid of game of life boards

Acknowledgement: 
	
*/ 

//the array that stores the thumbnails on the page to be rendered
let boardThumbnails = undefined;
const commentSection = {
	DOM: document.getElementById('comment-section'),
	placeholderDiv: document.getElementById('placeholder'),
	bt: undefined, //thumbnail of the displayed board
	comments: undefined, // the json comments array
	clear: function(){
		while(this.placeholderDiv.firstChild){
			this.placeholderDiv.removeChild(this.placeholderDiv.lastChild);
		}
	}
}

function populate(num, elem){
		let d = [];
		for (let i = 0; i < num; i++){
			d.push(elem);
		}
		return d;
}

class BoardThumbnail{
	constructor(data, env, name, username, _id){
		this.bid = _id;
		this.canvas = document.createElement('canvas');
		this.container = document.createElement('div');
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

		const nameTag = document.createElement('p');
		nameTag.textContent = this.name;
		const authorTag = document.createElement('p');
		authorTag.textContent = `Creator: ${this.username}`;

		this.container.appendChild(this.canvas);
		this.container.appendChild(nameTag);
		this.container.appendChild(authorTag);
		this.container.setAttribute('class', 'board-container');

		this.env.appendChild(this.container);

	}
	thumbnailify(data){
		let dataWidth = Math.floor(Math.sqrt(data.length));
		let newdata = [];

		//if the matrix happens to be the right dimension
		if (data.length === this.pixels * this.pixels){
			return data;
		}
		//if the matrix is smaller
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
			const row_offset = Math.floor((dataWidth - this.pixels) / 2), col_offset = row_offset;
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

class Comment{
	constructor(author, comment, date, env){
		this.author = author;
		this.comment = comment;
		this.date = new Date(date);
		this.env = env;
		this.div = document.createElement('div');
	}

	render(){
		this.div.innerHTML = this.author + ': ' + this.comment + '<br>@' + this.date.getMonth() + '.' + this.date.getDate() + '.' + this.date.getFullYear();
		this.div.setAttribute('class', 'comment');
		this.env.appendChild(this.div);
		this.env.appendChild(document.createElement('hr'));
	}
}

//send xhr to the server to get a list of boards
function loadBoards(){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/community-request-grid?t=' + Math.random(), true);
	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200){
			//on Receiving Thumbnails

			const responseJSON = JSON.parse(this.responseText);
			const boards = responseJSON.boards;
	
			const env = document.getElementById('boards-grid');
			boardThumbnails = boards.map(b => new BoardThumbnail(b.board, env, b.name, b.username, b._id));

			//on Rendering Thumbnails
			attachThumbnailListeners();			
		}
	};
	xhr.send();
}

function onLoadCommentListener(bt){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', `/community-get-comments?t=${Math.random()}&bid=${bt.bid}`, true);
	xhr.onreadystatechange = function(){
		if (this.readyState === 4 && this.status === 200){
			let comments = JSON.parse(this.responseText).comments;
			commentObjs = comments.map(c => new Comment(c.username, c.comment, c.createdAt, commentSection.placeholderDiv));

			//if a new thumbnail is clicked, refresh; if it's the same thumbnail, check for updates
			if (bt !== commentSection.bt || commentSection.comments !== comments){
				commentSection.clear();
				commentObjs.forEach(v => v.render());
				document.getElementById('post-comment-container').style.display = 'block';
				commentSection.comments = comments;
			}
			commentSection.bt = bt;
			
		}
	}
	xhr.send();
}

//attach listeners:
//1) onclick, open comment sections
//2) doubleclick, goto /?bid=bt
function attachThumbnailListeners(){
	boardThumbnails.forEach(bt => {
		bt.canvas.addEventListener('click', () => onLoadCommentListener(bt));
	})
	boardThumbnails.forEach(bt => {
		bt.canvas.addEventListener('dblclick', () => window.location.href = `/?bid=${bt.bid}`);
	})
}

/*
	post comment to the server AJAX
*/

document.getElementById('submit-comment-btn').addEventListener('click', function (evt) {
	//check if the username entered is empty
	if (document.getElementById('username').value === '' || document.getElementById('comment-textarea').value === ''){
		alert('Username and Comment can\'t be empty');
		return;
	}

	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/community-post-comment', true);
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200){
			console.log('responseText: ', this.responseText);
			onLoadCommentListener(commentSection.bt);
		}
	};
	
	
	let comment = JSON.stringify({username: document.getElementById('username').value, 
								comment: document.getElementById('comment-textarea').value,
								bid: commentSection.bt.bid
							});
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(comment);

	evt.preventDefault();

});


loadBoards();
