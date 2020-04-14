//import.js
//zitongzhoueric 

//feed some data into the database for testing

const mongoose = require('mongoose');

require('./db');
require('./db.js');

const User = mongoose.model('User');
const Board = mongoose.model('Board');
const Comment = mongoose.model('Comment');

//clear all existing documents
User.deleteOne({}, (err, log) => {
	console.log(log);
});
Board.deleteMany({}, (err, log) => {
	console.log(log);
});
Comment.deleteMany({}, (err, log) => {
	console.log(log);
});

const board1 = require('./data/board1.json');

let myuser1, myboard1, mycomment1;

myuser1 = new User({
	username: "testUser1",
}).save((err, user) => {
	if (err){
		console.log(err);
	}
	else{
		console.log(user, "saved to db\n");
		createboard(user);
	}
});

function createboard(user){
	myboard1 = new Board({
		user: user._id,
		name: "myboard1",
		board: board1.data,
		createdAt: Date()
	}).save((err, board) => {
		if (err){
			console.log(err);
		}
		else{
			console.log(board, "saved to db\n");
			createcomment(user, board);
		}
	});
}

function createcomment(user, board){
	const mycomment1 = new Comment({
		username: "commenter1",
		comment: "what a lovely board, nice job!",
		board: board._id,
		createdAt: Date(),
		quote: undefined
	}).save((err, comment) => {
		if (err){
			console.log(err);
		}
		else{
			console.log(comment, "saved to db\n");
			finalize(user, board);
		}
	});
}


function finalize(user, board){
	User.updateOne({_id: user._id}, {board: board._id}, (err, log) => {
		console.log(log);
	});
};


