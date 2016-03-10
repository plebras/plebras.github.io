var toggleMenu = function () {
    var w = window.innerWidth;
    if(w < 800){
	   $("#menuContent").animate({height:'toggle'},300);
    } else {
	   $("#menuContent").animate({width:'toggle'},300);
    }
	console.log("hello");
};

var showContent = function (url) {
	$.get(url, function(data){
		$('#container').html(data);
	})
};
