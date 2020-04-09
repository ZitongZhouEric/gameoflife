const mongoose = require('mongoose');

//mongoose options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
};


// blueprint for documents
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  board: {type: mongoose.Schema.ObjectId, ref: 'BoardSchema'}
});

const BoardSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.ObjectId, ref: 'UserSchema'},
  name: {type: String, required: true},
  board: [Boolean],
  createdAt: Date
});

const CommentSchema = new mongoose.Schema({
  username: String,
  comment: {type: String, required: true},
  board: {type: mongoose.Schema.ObjectId, ref: 'BoardSchema'},
  createdAt: Date,
  quote: {type: mongoose.Schema.ObjectId, ref: 'CommentSchema'}
});

mongoose.model('User', UserSchema); // collection name will be articles
mongoose.model('Board', BoardSchema);
mongoose.model('Comment', CommentSchema);
mongoose.connect('mongodb://localhost/game', mongooseOptions);

console.log('Schema Registered\n');

