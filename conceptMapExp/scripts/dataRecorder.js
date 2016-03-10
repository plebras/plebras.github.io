(function(){
	function dataRecorder(){
		this.nTopics = 30; // to be reset

		this.expId;
		this.expType;
		this.order1;
		this.order2;
		this.currentTask;
		this.searchResults;
	}

	// register the experiment id and initialise array order
	dataRecorder.prototype.regExpId = function(id){
		this.expId = id;
		this.expType = parseInt(id.split("-")[1]);

		// long random, ensuring no items have similar indices in two arrays
		/*var section = this.nTopics/5;
		var arr = Array.apply(null, {length: this.nTopics}).map(Number.call, Number);
		d3.shuffle(arr);
		this.order1 = d3.shuffle(arr.slice(0,section))
			.concat(d3.shuffle(arr.slice(section,section*2)))
			.concat(d3.shuffle(arr.slice(section*2,section*3)))
			.concat(d3.shuffle(arr.slice(section*3,section*4)))
			.concat(d3.shuffle(arr.slice(section*4,this.nTopics)))
		this.order2 = d3.shuffle(arr.slice(section*2,section*3))
			.concat(d3.shuffle(arr.slice(section*3,section*4)))
			.concat(d3.shuffle(arr.slice(section*4,this.nTopics)))
			.concat(d3.shuffle(arr.slice(section*2,section*3)))
			.concat(d3.shuffle(arr.slice(section,section*2)))*/

		// short random, might have similar indices in two arrays	
		this.order1 = Array.apply(null, {length: this.nTopics}).map(Number.call, Number);
		this.order2 = Array.apply(null, {length: this.nTopics}).map(Number.call, Number);
		d3.shuffle(this.order1);
		d3.shuffle(this.order2);

		this.currentTask = 0;

		this.searchResults = {"hexmap":[], "gmap":[]}
	}

	dataRecorder.prototype.writeToFile = function(){
		var writeObj = {
			expId : this.expId,
			expType : this.expType,
			searchResults : this.searchResults
		}

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log("Success!");
			} else {
				console.log("readyState = " + xhr.readyState);
				console.log("status = " + xhr.status);
			}
		}

		address = "results/filesaver.php?data=" +  JSON.stringify(writeObj, null, 0);
		xhr.open("GET", address);
		xhr.send();
	}

	this.dataRecorder = new dataRecorder();
})();