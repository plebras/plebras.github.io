function gmap(topicData, callback, width, height, margin){

	var groupColors = [
		'rgb(239, 192, 80)',
		'rgb(195, 68, 122)',
		'rgb(178, 186, 182)',
		'rgb(147, 86, 53)',
		'rgb(85, 180, 176)',
		'rgb(188, 36, 60)',
		'rgb(91, 94, 166)',
		'rgb(0, 152, 116)',
		'rgb(221, 65, 36)',
		'rgb(111, 65, 129)'
	];

	/*var width = 1200,
		height = 800,
		margin = 100;*/

	var zoom = d3.behavior.zoom()
		.scaleExtent([1, 2])
		.on("zoom", zoomed)//.scale(1).translate([0,0]);

	var svg = d3.select('svg#gmap')
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

	function zoomed(){
		container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	var minX = d3.min(topicData, function(d){return d.projCoord.x}),
		maxX = d3.max(topicData, function(d){return d.projCoord.x}),
		minY = d3.min(topicData, function(d){return d.projCoord.y}),
		maxY = d3.max(topicData, function(d){return d.projCoord.y});

	var xScale = d3.scale.linear()
		.range([margin, width-margin])
		.domain([minX, maxX]),
		yScale = d3.scale.linear()
		.range([margin, height-margin])
		.domain([minY, maxY])

	var voronoi = d3.geom.voronoi()
		.x(function(d){return xScale(d.projCoord.x)})
		.y(function(d){return yScale(d.projCoord.y)})
		.clipExtent([[0,0],[width,height]]);

	var voronoiPaths = container.append("g")
		.attr("class","voronoiPaths")
		.selectAll("path");

	function polygon(d) {
		return "M" + d.join("L") + "Z";
	}

	var boundaryMarginX = Math.abs(xScale.invert(margin))/3,
		boundaryMarginY = Math.abs(yScale.invert(margin))/3;

	var boundaries = [];
	boundaries.push({projCoord:{x: minX-boundaryMarginX, y: minY-boundaryMarginY}});
	boundaries.push({projCoord:{x: minX-boundaryMarginX, y: maxY+boundaryMarginY}});
	boundaries.push({projCoord:{x: maxX+boundaryMarginX, y: minY-boundaryMarginY}});
	boundaries.push({projCoord:{x: maxX+boundaryMarginX, y: maxY+boundaryMarginY}});
	d3.range(minX, maxX, boundaryMarginX/1.5).forEach(function(p){
		boundaries.push({projCoord:{x: p, y: minY-boundaryMarginY}});
		boundaries.push({projCoord:{x: p, y: maxY+boundaryMarginY}});
	})
	d3.range(minY, maxY, boundaryMarginY/1.5).forEach(function(p){
		boundaries.push({projCoord:{x: minX-boundaryMarginX, y: p}});
		boundaries.push({projCoord:{x: maxX+boundaryMarginX, y: p}});
	})

	voronoiPaths = voronoiPaths.data(voronoi(topicData.concat(boundaries)), polygon);
	voronoiPaths.enter().append("path")
		.attr("d", polygon)
		.style("stroke",function(d){
			return (typeof d.point.cluster == "undefined") ? "none" : "none"
		})
		.style("fill",function(d){
			return (typeof d.point.cluster == "undefined") ? "white" : groupColors[d.point.cluster]
		})
		.style("fill-opacity",0.7)
		.style("cursor", function(d){
			if(typeof d.point.cluster != "undefined"){
				return "pointer"
			}
		})
		.on("mouseover",function(d){
			if(typeof d.point.cluster != "undefined"){
				//voronoiPaths.style("fill-opacity","0.4");
				d3.select(this).style("fill-opacity",0.9);
				tip.show(d.point.words.map(function(d){return d.label}).join(', '));
			}
		})
		.on("mouseout",function(d){
			if(typeof d.point.cluster != "undefined"){
				voronoiPaths.style("fill-opacity",0.7);
				tip.hide();
			}
		})
		.on('click', function(d){
			if(typeof d.point.cluster != "undefined"){
				tip.hide();
				callback(parseInt(d.point.topicId));
			}
		});

	voronoiPaths.order();

	tip = d3.tip()
		.html(function(d){return d})
		.style("background-color", 'rgba(0, 0, 0, 0.95)')
		.style("color", '#EEEEEE')
		.style("padding", '8px')
		.style("max-width","500px")
		.style("border-radius", '4px')
	svg.call(tip)

	var dots = container.selectAll("circle.nodes")
		.data(topicData.filter(function(d){return typeof d.cluster != "undefined"}))
		.enter().append("circle")
			.attr("class","nodes")
			.attr("r",5)
			.attr("cx",function(d){
				return xScale(d.projCoord.x);
			})
			.attr("cy",function(d){
				return yScale(d.projCoord.y);
			})
			.attr("fill",function(d){
				return groupColors[d.cluster];
			});
}