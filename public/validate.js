/*
validate.js

front-end js that 1) validates user's customized rule 2.1) restart the page if valid 2.2) apply the rule

Acknowledgement:
	https://developers.google.com/caja/docs/runningjavascript
	API Documentation: https://google.github.io/caja/docs/cajajs/
*/



//initialize google caja in the background
caja.initialize({ cajaServer: 'http://caja.appspot.com', debug: true});

let tamedTesting = undefined;
caja.whenReady(function() {
		caja.markFunction(testing);
		tamedTesting = caja.tame(testing);
	});


//validate user's customized code with regex
let base = "//alive:bool, indicates current cell's status\\n//neighbors:\\[bool\\], 8-bool array of neighbors' status\\nfunction isAlive\\(alive, neighbors\\)\\{(.|\n)*\\}";
let func = "//alive:bool, indicates current cell's status\n//neighbors:[bool], 8-bool array of neighbors' status\nfunction isAlive(alive, neighbors){\n\treturn true;\n}";

var regex = new RegExp("^" + base + "$", "i");

document.getElementById('user-alive-rule').addEventListener('input', function(evt){
	let userCode = this.value;
	if (!regex.test(userCode)){
		this.value = func;
	}else{
		func = this.value;
	}
})

//test if the function toTest behaves as supposedly, return bool
function testing(toTest){

	//takes a 9-digit binary, converts into a 9-boolean array
	let binToInput = function(bi){
		return ('0'.repeat(8 - bi.toString(2).length) + bi.toString(2))
				.split('')
				.map(e => (e === 1? true : false));
	}

	//test if the output is bool on all input
	for (bi = 0b0; bi <= 0b11111111; bi++){
		let neighbors = binToInput(bi);
		if (typeof toTest(true, neighbors) != 'boolean'){
			return false;
		}
		if (typeof toTest(false, neighbors) != 'boolean'){
			return false;
		}
	}

	return true;
}


/*
	google caja for validation
*/
document.getElementById('sbmbut').addEventListener('click', function(evt){
	//pause the canvas
	if (isRunning){
		myBoard.stop();
		document.querySelector('#runbtn').textContent = "Run";
	}

	let userCode = document.getElementById('user-alive-rule').value;
	let testingCode = userCode + ';return tamedTesting(isAlive);';

	try {
		caja.load(undefined, undefined, function(frame) {
	    	frame.code(undefined, 'application/javascript', testingCode)  // input source code
	    	.api({tamedTesting : tamedTesting})
	    	.run(function(result) {
	    		console.log('eval:', result);

	    		//if tested positive
	    		if(result){
	    			applyUserRule(userCode);
	    		}
	    		else{
					alert("Use a valid boolean function!");
	    		}
	    	});
	    });
	} catch (err) {
		console.log(err)
		alert("Use a valid boolean function!");
	}

	evt.preventDefault();
});





