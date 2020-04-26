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
	res.render('index', {title: "this is /"});
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
	 					console.log("err:", err, "\nlogggggg:", log);
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

app.post('/community', (req, res) => {
	new Comment({
		username: req.body.username,
		comment: req.body.comment
	}).save((err, comment) => {
		console.log(comment, "saved in db\n");
	});

	res.redirect('/community');
});

app.listen(PORT);
console.log("app listening on ", PORT);
