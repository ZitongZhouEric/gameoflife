/*
validate.js

front-end js that 1) validates user's customized rule 2.1) restart the page if valid 2.2) send to server via XHR if valid

Acknowledgement:
	https://developers.google.com/caja/docs/runningjavascript
	API Documentation: https://google.github.io/caja/docs/cajajs/
*/

/*
	google caja for validation
*/
document.getElementById('sbmbut').addEventListener('click', function(evt){

	let userCode = this.value;
	

	function ping(x, y){alert(x + y); return x * y;};
	/* host page code */
	caja.initialize({ cajaServer: 'http://caja.appspot.com' });
	caja.whenReady(function() {
		caja.markFunction(ping);
	});
	caja.load(undefined, undefined, function(frame) {
    	frame.code('http://example.com/default.js', 'application/javascript','return tamedPing(x, y);')  // input source code
    		.api({ x: 3, y: 4, tamedPing: caja.tame(ping)})
    		.run(function(result) {
    			console.log('eval:', result);
    		});
    });

	evt.preventDefault();
});
