const mongoose = require('mongoose');
// schema that describes article

// blueprint for documents
const UserSchema = new mongoose.Schema({
  uid: String,
  username: {type: String, required: true},
  hash: String,
  list: [Board]
});

const BoardSchema = new mongoose.Schema({
  user: UserSchema,
  name: {type: String, required: true},
  board: ,
  createdAt: Date
  
});

const CommentSchema = new mongoose.Schema({
  user: UserSchema,
  title: String,
  comment: {type: String, required: true},
  createdAt: Date,
  quote: CommentSchema
});

mongoose.model('User', UserSchema); // collection name will be articles
mongoose.model('Board', BoardSchema);
mongoose.model('Comment', CommentSchema);
mongoose.connect('mongodb://localhost/');