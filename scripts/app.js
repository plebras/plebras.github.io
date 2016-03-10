var data;
d3.json('data/30topics_allDocs_noYear.json', function(error, d){
	if(error){
		console.log('error loading data');
	}

	data = d;
})

function stop(){
	location.replace(location.origin);
}

route("/",function(){
	route.redirectTo("start");
});

route("start", "start", function(){
	done = function(){
		route.redirectTo("colorTest");
	} 
});

route("colorTest", "colorTest", function(){
	setTimeout(function(){
		var width = 1000;
		var height = 100;
		var groupColors = [
			'rgb(178, 186, 182)',
			'rgb(85, 180, 176)',
			'rgb(0, 152, 116)',
			'rgb(91, 94, 166)',
			'rgb(111, 65, 129)',
			'rgb(195, 68, 122)',
			'rgb(188, 36, 60)',
			'rgb(221, 65, 36)', 
			'rgb(239, 192, 80)',
			'rgb(147, 86, 53)'
		];
		d3.select("svg#colorSquares")
			.attr('width', width)
			.attr('height', height)
			.style('margin-top','20px')
			.style('margin-bottom','20px')
			.selectAll('rect').data(groupColors)
				.enter().append('rect')
					.attr('x',function(d,i){return i*(width/groupColors.length)})
					.attr('y', 0)
					.attr('width', (width/groupColors.length))
					.attr('height', height)
					.style('fill', function(d){return d})
					.style('fill-opacity', 0.7)
					.on('mouseover',function(){d3.select(this).style('fill-opacity',0.9)})
					.on('mouseout',function(){d3.select(this).style('fill-opacity',0.7)});
	},100)
	done = function(){
		route.redirectTo("expId");
	} 
})

route("expId", "expId", function(){
	done = function(){
		var expId = document.getElementById("currentExpId").value
		if(expId.match(/\d{4}-[0-1]-[A-Z]{2}/)){
			//console.log("match")
			dataRecorder.regExpId(expId);
			//console.log(dataRecorder);
			route.redirectTo("searchInstr");
		}
	}
});

var topicIdRequested,
	topicWordsRequested,
	topicIdSelected,
	viz,
	startTime,		
	time;

route("searchInstr", "searchInstr", function(){

	done = function(){
		startTime = Date.now(); // start timer
		route.redirectTo("searchTask");
	}
});

route("searchTask", "searchTask", function(){
	topicIdRequested = 
		dataRecorder.currentTask % 2 == 0 ? 
		dataRecorder.order1[(dataRecorder.currentTask/2)] : 
		dataRecorder.order2[((dataRecorder.currentTask-1)/2)];

	topicWordsRequested = data.filter(function(d){return parseInt(d.topicId) == topicIdRequested})[0].words.map(function(d){return d.label}).join(', ')
	viz =
		dataRecorder.currentTask % 2 == 0 ?
		(dataRecorder.expType == 0 ? "hexmap" : "gmap") :
		(dataRecorder.expType == 0 ? "gmap" : "hexmap");
	//makeviz = function(){
	//	console.log('hello')
	// leave time for template to load
	setTimeout(function(){
		if(viz == "hexmap"){
			hexmap(data, done, 1200, 800, 50)
		} else {
			gmap(data, done, 1200, 800, 150)
		}
	}, 100)
	//}
	done = function(topicSelected){
		time = Date.now() - startTime;
		// get topic selected from vis callback
		topicIdSelected = topicSelected;
		route.redirectTo("searchLikert");
	}
});

route("searchLikert", "searchLikert", function(){
	marginTop = Math.floor(Math.random()*600)
	this.correct = (topicIdRequested==topicIdSelected);
	var likertSelected = null;
	likertSelect = function(btn){
		/*[].forEach.call(document.getElementsByClassName("btn-likert"), function(b){
			b.setAttribute("class", "btn-likert");
		});
		btn.setAttribute("class", "btn-likert btn-likert-active")*/
		likertSelected = btn.value;
		done();
	}
	
	done = function(){
		if(likertSelected){
			// record
			var res = {};
			res.time = time;
			res.diff = likertSelected;
			res.reqTopic = topicIdRequested;
			res.selTopic = topicIdSelected;
			res.taskOrder = dataRecorder.currentTask % 2 == 0 ? dataRecorder.currentTask/2 : (dataRecorder.currentTask-1)/2 ;
			dataRecorder.searchResults[viz].push(res)
			// next task
			dataRecorder.currentTask += 1;
			if(dataRecorder.currentTask < dataRecorder.nTopics*2){
				startTime = Date.now(); // start timer
				route.redirectTo("searchTask");
			} else {
				dataRecorder.writeToFile();
				route.redirectTo("questionnaire1");
			}
		}
	}
});

route("questionnaire1", "questionnaire1", function(){
	done = function(){
		route.redirectTo("questionnaire2")
	}
});

route("questionnaire2", "questionnaire2", function(){
	done = function(){
		route.redirectTo("questionnaire3")
	}
});

route("questionnaire3", "questionnaire3", function(){
	setTimeout(function(){
		hexmap(data,null, 700, 466, 25)
		gmap(data,null, 700, 466, 75)
	},100)
	done = function(){
		route.redirectTo("finish")
	}
});

route("finish", "finish", function(){});
