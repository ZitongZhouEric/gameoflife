//Author: Eric Zitong Zhou
//zitongzhou1999@gmail.com

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const BoardDS = require('./ds.js');

require('./db');
require('./db.js');

const app = express();
const Comment = mongoose.model('Comment');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.render('index', {title: "this is /"});
});

app.get('/community', (req, res) => {
	Comment.find({}, (err, comments) => {
		res.render('community', {title: 'this is /community', comments: comments});
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

app.listen(process.env.PORT || 3000);
