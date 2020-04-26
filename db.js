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
  name: {type: String},
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



let dbconf = 'mongodb://localhost/game';

// if we're in PRODUCTION mode, then read the configration from a file
// use blocking file io to do this...

if (process.env.NODE_ENV === 'PRODUCTION'){
  const fs = require('fs');
  const path = require('path');
  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);

  // our configuration file will be in json, so parse it and set the
  // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
}


mongoose.connect(dbconf, mongooseOptions);

console.log(dbconf, 'Schema Registered\n');

