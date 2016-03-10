function hexmap(topicData, callback, width, height, margin){

	function getPolygonCoordinates(center,scale,rotation,numberOfPoints){
		var res = []
		for(var i = 0; i < numberOfPoints; i++){
			var x1 = center[0]+(Math.sin(2*Math.PI*i/numberOfPoints)*scale)
			var y1 = center[1]-(Math.cos(2*Math.PI*i/numberOfPoints)*scale)
			var x = ((x1-center[0])*Math.cos(rotation))-((y1-center[1])*Math.sin(rotation))+center[0]
			var y = ((y1-center[1])*Math.cos(rotation))+((x1-center[0])*Math.sin(rotation))+center[1]
			res.push([x,y])
		}
		return res
	}

	var groupColors = [
		'rgb(188, 36, 60)',
		'rgb(91, 94, 166)',
		'rgb(0, 152, 116)',
		'rgb(221, 65, 36)',
		'rgb(111, 65, 129)',
		'rgb(239, 192, 80)',
		'rgb(195, 68, 122)',
		'rgb(178, 186, 182)',
		'rgb(147, 86, 53)',
		'rgb(85, 180, 176)'
	];
	
	/*var width = 1200,
		height = 800,
		margin = 50;*/

	var zoom = d3.behavior.zoom()
		.scaleExtent([1, 2])
		.on("zoom", zoomed)//.scale(1).translate([0,0]);

	var svg = d3.select('svg#hexmap')
		.attr("width", width)
		.attr("height", height)
		.style("border","solid 1px")
		.append("g")
			//.call(zoom)
	svg.append("rect")
		.attr("width", width)
		.attr("height", height)
		.style("fill", "none")
		.style("pointer-events", "all");

	var container = svg.append("g");

	var hexagons = container.selectAll("g.hex");

	function zoomed(){
		container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	var verticalRange = Math.abs(d3.extent(topicData, function(d){return d.hexCoord.y}).reduce(function(a,b){return a-b}))+2,
		horizontalRange = Math.abs(d3.extent(topicData, function(d){return d.hexCoord.x}).reduce(function(a,b){return a-b}))+Math.sqrt(3);

	var scale,
		offsetX = 0,
		offsetY = 0;
	if(height/verticalRange < width/horizontalRange){
		scale = d3.scale.linear()
			.domain([d3.min(topicData, function(d){return d.hexCoord.y})-1, d3.max(topicData, function(d){return d.hexCoord.y})+1])
			.range([margin,height-margin])
		offsetX += (width-height)/2
	} else {
		scale = d3.scale.linear()
			.domain([d3.min(topicData, function(d){return d.hexCoord.x})-Math.sqrt(3)/2, d3.max(topicData, function(d){return d.hexCoord.x})+Math.sqrt(3)/2])
			.range([margin,width-margin])
		offsetY += (height-width)/2
	}

	var hexHeight = scale(2)-scale(1)-2;

	hexagons = hexagons.data(topicData)

	hexEnter = hexagons.enter()
		.append("g")
		.attr("class","hex")
	hexEnter.append("polygon")
	//hexEnter.append("circle") // was for doc mapping

	hexagons.attr("transform", function(d){return "translate(" + (scale(d.hexCoord.x)+offsetX) + "," + (scale(d.hexCoord.y)+offsetY) + ")"})
		.style("cursor","pointer")
		.on('mouseover', function(d){
			d3.select(this)
				//.style("cursor","pointer")
				.select("polygon").style("fill-opacity", 0.9);
			tip.show(d.words.map(function(d){return d.label}).join(', '));
		})
		.on('mouseout', function(d){
			d3.select(this)
				.select("polygon").style("fill-opacity", 0.7);
			tip.hide();
		})
		.on('click', function(d){
			tip.hide();
			callback(parseInt(d.topicId));
		})
		.select("polygon")
			.attr("points",function(d){
				var points = getPolygonCoordinates([0,0],hexHeight,0,6);
				var res = points.join(" ");
				return res;
			})
			.style("fill",function(d){return groupColors[d.cluster]})
			//.style("fill-opacity",function(d){return d.weight/maxWeight*0.8;})
			.style("fill-opacity", 0.7)
			.style("stroke-width","2px")
			.style("stroke",function(d){return groupColors[d.cluster]});

	tip = d3.tip()
		.html(function(d){return d})
		.style("background-color", 'rgba(0, 0, 0, 0.95)')
		.style("color", '#EEEEEE')
		.style("padding", '8px')
		.style("max-width","500px")
		.style("border-radius", '4px');
	svg.call(tip);

}