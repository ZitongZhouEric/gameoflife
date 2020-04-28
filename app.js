//Author: Eric Zitong Zhou
//zitongzhou1999@gmail.com

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const BoardDS = require('./ds.js');
const PORT = process.env.PORT || 3000;

require('./db');
require('./db.js');

const app = express();
const Comment = mongoose.model('Comment');
const Board = mongoose.model('Board');
const User = mongoose.model('User');


app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	//TODO: check query string boardID
	res.render('index', {title: "this is the game of life, have a try"});
});

const jsonParser = bodyParser.json();
app.post('/', jsonParser, (req, res) => {
	//TODO: Store this rule in the database?
	console.log(req.body);

	let onResponse = function(good){
		if(good){
			res.json({success: true});
		}else{
			res.status(500).json({success: false});
		}
	}
	//TODO: NOOOOO, call back hell
	new User({
	 	username: req.body.username,
	 	board: undefined
	 }).save((err, user) => {
	 	if (err){
	 		console.log(err);
	 		onResponse(false);
	 	}
	 	else{
	 		console.log(`user:${user.username}, saved to db\n`);
	 		new Board({
	 			username: user.username,
	 			name: req.body.name,
	 			board: req.body.data,
	 			user: user._id
	 		}).save((err, board) => {
	 			if (err){
	 				console.log(err);
	 				onResponse(false);
	 			}
	 			else{
	 				console.log(`board:${board.name}, saved to db\n`);
	 				User.updateOne({_id: user._id}, {board: board._id}, (err, log) => {
	 					console.log("err: ", err, "\n savelog: ", log);
	 				});
	 				onResponse(true);
	 			}
	 		})
	 	}
	 })
	
})

//
app.get('/community', (req, res) => {
	Comment.find({}, (err, comments) => {
		res.render('community', {title: 'this is /community', comments: comments});
	})
	
});

//handles XHR for displaying boards
app.get('/community-request-grid', (req, res) => {

	Board.find({}, (err, boards) => {
		res.json({success: true, boards: boards});
	})

});

app.get('/community-get-comments', (req, res) => {
	if (!req.query.bid){
		console.log('bid not found');
		res.json({success: false});
	}
	else{
		Comment.find({board : mongoose.Types.ObjectId(req.query.bid)}).sort({createdAt : 1}).exec((err, comments) => {
			res.json({success: true, comments: comments});
		});
		
	}
	
});

app.post('/community-post-comment', jsonParser, (req, res) => {
	console.log(req.body);

	let onResponse = function(good){
		if(good){
			res.json({success: true});
		}else{
			res.status(500).json({success: false});
		}
	}

	new Comment({
		username: req.body.username,
		comment: req.body.comment,
		board: mongoose.Types.ObjectId(req.body.bid)
	}).save((err, comment) => {
		if (err) {
			console.log(err);
			onResponse(false);
		} 
		else {
			console.log(comment, "saved in db\n");
			onResponse(true);
		}
		
	}); 
})

app.post('/community', (req, res) => {
	new Comment({
		username: req.body.username,
		comment: req.body.comment,
		board: mongoose.Types.ObjectId("5ea86488a8561a214dd1b470")
	}).save((err, comment) => {
		console.log(comment, "saved in db\n");
	});

	res.redirect('/community');
});

app.listen(PORT);
console.log("app listening on ", PORT);