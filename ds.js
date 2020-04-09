//ds.js
//stores the data structures used by the app

//the ds corresponds to BoardSchema in db.js
class Board{

	//data is an array of boolean, presumasbly of size 100x100 
	constructor(data) {
		this.data = data;
	};
}

module.exports = {
	BoardDS : Board,
};