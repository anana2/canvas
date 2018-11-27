var map = [];
for(var i = 0; i < 1000; i++){
	map[i] = [];
	for(var j = 0; j < 1000; j++){
		map[i][j] = 255;
	}
}
var map2 = [];
for(var i = 0; i < 20; i++){
	map2[i] = null;
}
map2[0] = 0;
map2[1] = 255;
map2[2] = 128;
map2[3] = 66;
map2[4] = 33;
map2[5] = 200;
map2[6] = 222;
map2[7] = 199;
map2[8] = 50;
map2[9] = 99;

var x = 0;
var y = 0;
var z = 1;
var realmousex = -1;
var realmousey = -1;
var mousex = -1;
var mousey = -1;
var clickx = 0;
var clicky = 0;
var diffx = 0;
var diffy = 0;
var downx = 0;
var downy = 0
var drawing = true;
var moving = false;
var zooming = false;
var interval;
var color = 0;

var cv = document.getElementById("canvas");
var mid = document.getElementById("mid");
var pos = document.getElementById("midpos");
var sca = document.getElementById("midscale");
var zoomlevel = document.getElementById("zoomlevel");
var c1 = document.getElementById("color1");
var c2 = document.getElementById("color2");

var red = document.getElementById("Red");
var green = document.getElementById("Green");
var blue = document.getElementById("Blue");
var redtext = document.getElementById("redtext");
var greentext = document.getElementById("greentext");
var bluetext = document.getElementById("bluetext");

var mousepos = document.getElementById("colorstring");
var colortext = document.getElementById("colorstring2");

$(function(){
	changeColor(0);
	
	redrawColors(true,c2);
	
	var cv2 = cv.getContext("2d");
	cv2.fillStyle = 'rgb(35,35,64)';
	cv2.fillRect(0,0,100,100);
	
	mid.addEventListener("mousemove",function(event){
		if(!zooming){
			writeMessage(cv);
		}
	});
	c2.addEventListener("click",function(event){
		var rect = c2.getBoundingClientRect();
		var width = rect.right - rect.left;
		var height = rect.bottom - rect.top;
		var multx = width/29;
		var multy = height/5;
	
		var colorx = Math.floor((event.clientX - rect.left)/multx);
		var colory = Math.floor((event.clientY - rect.top)/multy);
		
		var index = Math.floor(colorx/3)+(Math.floor(colory/3))*10
		
		changeColor(map2[index]);
	});
	red.oninput = function() {
		var rt = parseInt(red.value).toString(2);
		var gt = parseInt(green.value).toString(2);
		var bt = parseInt(blue.value).toString(2);
		console.log(rt);
		while(rt.length < 3){
			rt = "0"+rt;
		}
		while(gt.length < 3){
			gt = "0"+gt;
		}
		while(bt.length < 2){
			bt = "0"+bt;
		}
		changeColor(parseInt(rt+gt+bt,2));
	}
	green.oninput = function() {
		var rt = parseInt(red.value).toString(2);
		var gt = parseInt(green.value).toString(2);
		var bt = parseInt(blue.value).toString(2);
		while(rt.length < 3){
			rt = "0"+rt;
		}
		while(gt.length < 3){
			gt = "0"+gt;
		}
		while(bt.length < 2){
			bt = "0"+bt;
		}
		changeColor(parseInt(rt+gt+bt,2));
	}
	blue.oninput = function() {
		var rt = parseInt(red.value).toString(2);
		var gt = parseInt(green.value).toString(2);
		var bt = parseInt(blue.value).toString(2);
		console.log(rt);
		while(rt.length < 3){
			rt = "0"+rt;
		}
		while(gt.length < 3){
			gt = "0"+gt;
		}
		while(bt.length < 2){
			bt = "0"+bt;
		}
		changeColor(parseInt(rt+gt+bt,2));
	}
	cv.addEventListener("mousedown",function(event){
		downx = event.clientX;
		downy = event.clientY;
		drawing = true;
		/*if(drawing){
			drawCanvas(cv);
			interval = setInterval(function(){
				drawCanvas(cv);
			}, 10);
		}*/
	});
	mid.addEventListener("mousedown",function(event){
		/*if(!drawing){
			clickx = mousex;
			clicky = mousey;
			moving = true;
			interval = setInterval(function(){}, 1000);
		}*/
		clickx = realmousex;
		clicky = realmousey;
		moving = true;
		//interval = setInterval(function(){}, 1000);
	});
	mid.addEventListener("wheel",function(event){
		clickx = realmousex;
		clicky = realmousey;
		/*if(clickx < 0){
			clickx = 0;
		}else if(clickx > 999){
			clickx = 999;
		}
		if(clicky < 0){
			clicky = 0;
		}else if(clicky > 999){
			clicky = 999;
		}*/
		zooming = true;
		var dir = Math.sign(event.wheelDelta);
		Zoom(dir);
		zooming = false;
	});
	
	addEventListener("mouseup",function(event){
		if(Math.abs(event.clientX-downx) < 5 && Math.abs(event.clientY-downy) < 5 && drawing){
			moving = false;
			drawing = false;
			drawCanvas(cv);
		}
		else{
			//clearInterval(interval);
			moving = false;
		}
	});
});//end $(function(){});

/*function ChangeDrawing(){
	if(drawing){
		drawing = false;
		
		var n = document.getElementById("testbutton");
		var message = "Moving"; 
		n.textContent = message;
	}
	else{
		drawing = true;
		
		var n = document.getElementById("testbutton");
		var message = "Drawing"; 
		n.textContent = message;
	}
	console.log("done");
};*/

function ZoomIn(){
	z = z*2;
	if(z > 64){
		z = 64;
	}
	sca.style.transform = "scale("+z+","+z+")";
	
	var message = "Zoom: "+z+"x  "; 
	zoomlevel.innerHTML = message;
};
function ZoomOut(){
	z = z/2;
	if(z < 1){
		z = 1;
	}
	sca.style.transform = "scale("+z+","+z+")";
	
	var message = "Zoom: "+z+"x  "; 
	zoomlevel.innerHTML = message;
	
	var ctx = cv.getContext("2d");
	if(mousex > -1 && mousex < 1000 && mousey > -1 && mousey < 1000){
		if(map[mousex][mousey] == null){
			ctx.clearRect(mousex,mousey,1,1);
		}
	}
};
function Zoom(amount){
	if(amount>0){
		if(z<2){
			z = (Math.round((z+(amount*0.1))*10))/10;
		}
		else if(z<16){
			z = z+amount;
		}
		else if(z < 32){
			z = z+(2*amount);
		}
		else{
			z = z+(4*amount);
		}
	}
	else{
		if(z<2.5){
			z = (Math.round((z+(amount*0.1))*10))/10;
		}
		else if(z<16.5){
			z = z+amount;
		}
		else if(z < 32.5){
			z = z+(2*amount);
		}
		else{
			z = z+(4*amount);
		}
	}
	
	if(z > 64){
		z = 64;
	}
	else if(z < 1){
		z = 1;
	}
	else{
		sca.style.transform = "scale("+z+","+z+")";
	
		var message = "Zoom: "+z+"x  "; 
		zoomlevel.innerHTML = message;
	
		writeMessage(cv);
	}
};
function writeMessage(canvas){
	var ctx = canvas.getContext("2d");
	var c1x = c1.getContext("2d");
	if(color != null){
		ctx.fillStyle = color;
	}
	var rect = canvas.getBoundingClientRect();
	var width = rect.right - rect.left;
	var height = rect.bottom - rect.top;
	var multx = width/1000;
	var multy = height/1000;
	
	var tempx = mousex;
	var tempy = mousey;
	
	realmousex = (event.clientX - rect.left)/multx;
	realmousey = (event.clientY - rect.top)/multy;
	
	mousex = Math.floor(realmousex);
	mousey = Math.floor(realmousey);
	
	if(moving || zooming){
		diffx = realmousex-clickx;
		diffy = realmousey-clicky;
	
		var div = document.getElementById("midpos");
		x = x+(multx*diffx/z);
		y = y+(multy*diffy/z);
	
		if(x<(-500*multx/z)){
			x = -500*multx/z;
		}
		if(x>(500*multx/z)){
			x = 500*multx/z;
		}
		if(y<(-500*multy/z)){
			y = -500*multy/z;
		}
		if(y>(500*multy/z)){
			y = 500*multy/z;
		}
		div.style.transform = "translate(" + x + "px," + y +"px)";
					
		realmousex = realmousex-diffx;
		realmousey = realmousey-diffy;
		mousex = Math.floor(realmousex);
		mousey = Math.floor(realmousey);
	}
	else if(tempx != mousex || tempy != mousey){
		if(tempx > -1 && tempx < 1000 && tempy > -1 && tempy < 1000){
			ctx.fillStyle = map[tempx][tempy];
			ctx.fillRect(tempx,tempy,1,1);
		}
	}
	if(tempx != mousex || tempy != mousey){
		if(mousex > -1 && mousex < 1000 && mousey > -1 && mousey < 1000){
			if(map[mousex][mousey] != color){
				if(color == null){
					if(map[mousex][mousey] != null){
						console.log("this");
						c1x.fillStyle = map[mousex][mousey];
						c1x.fillRect(0,0,2,2);
						
						var tempcolor = map[mousex][mousey];
						var message = "Sampler: " + tempcolor; 
						colortext.innerHTML = message;
						
						var bin = tempcolor.toString(2);
						while(bin.length < 8){
							bin = "0"+bin;
						}
						var r = parseInt(bin.substring(0,3), 2);
						var g = parseInt(bin.substring(3,6), 2);
						var b = parseInt(bin.substring(6,8), 2);
						
						red.value = r;
						green.value = g;
						blue.value = b;
						
						redtext.innerHTML = "R: "+r;
						greentext.innerHTML = "G: "+g;
						bluetext.innerHTML = "B: "+b;
					}
					else if(map[tempx][tempy] != null){
						c1x.fillStyle = "#bbbbbb";
						c1x.fillRect(0, 0, 1, 1);
						c1x.fillRect(1, 1, 1, 1);
						c1x.fillStyle = "#000000";
						c1x.fillRect(1, 0, 1, 1);
						c1x.fillRect(0, 1, 1, 1);
						
						var message = "Sampler"; 
						colortext.innerHTML = message;
						
						red.value = 0;
						green.value = 0;
						blue.value = 0;
						
						redtext.innerHTML = "R: N/A";
						greentext.innerHTML = "G: N/A";
						bluetext.innerHTML = "B: N/A";
					}
				}
				else{
					ctx.fillStyle = color;
					ctx.fillRect(mousex,mousey,1,1);
				}
			}
		}
	}

	var message = "x:"+mousex+" y:"+mousey+""; 
	mousepos.innerHTML = message;
};
function drawCanvas(canvas){
	if(color == null || color != map[mousex][mousey]){
		if(color == null){
			changeColor(map[mousex][mousey]);
		}
		else{
			var base = false;
			var prev = color;
			for(var i = 0; i < 19; i++){
				if((i > 9) && !base){
					var temp = map2[i];
					if(color == prev && i != 10){
						break;
					}
					else{
						map2[i] = prev;
					}
					prev = temp;
				}
				else if(map2[i] == color){
					base = true;
				}
			}
			if(!base){
				redrawColors(false,c2);
			}
			
			fill(mousex,mousey,color);
		}
	}
};
function fill(xpos,ypos,c){
	map[xpos][ypos] = c;
	var ctx = canvas.getContext("2d");
	if(c == null){
		ctx.clearRect(xpos,ypos,1,1);
	}
	else{
		ctx.fillStyle = c;
		ctx.fillRect(xpos,ypos,1,1);
	}
}
function redrawColors(complete,canvas){
	var range = 0;
	var end = 20;
	var c2x = c2.getContext("2d");
	if(complete){
		range = 0;
		end = 20;
		c2x.fillStyle = "#eeddee";
		c2x.fillRect(0,0,30,5);
	}
	else{
		range = 10;
		end = 19;
	}
	for(var i = range; i < end; i++){
		if(map2[i] == null){
			c2x.fillStyle = "#bbbbbb";
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3, 1, 1);
			c2x.fillRect((3*i)%30+1, (Math.floor(i/10))*3+1, 1, 1);
			c2x.fillStyle = "#000000";
			c2x.fillRect((3*i)%30+1, (Math.floor(i/10))*3, 1, 1);
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3+1, 1, 1);
		}
		else{
			c2x.fillStyle = map2[i];
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3, 2, 2);
		}
	}
}
function changeColor(c){
	color = c;
	var c1x = c1.getContext("2d");
	if(color == null){
		if(color == null){
			c1x.fillStyle = "#bbbbbb";
			c1x.fillRect(0, 0, 1, 1);
			c1x.fillRect(1, 1, 1, 1);
			c1x.fillStyle = "#000000";
			c1x.fillRect(1, 0, 1, 1);
			c1x.fillRect(0, 1, 1, 1);
			
			var message = "Sampler";
			colortext.innerHTML = message;
		}
		red.value = 0;
		green.value = 0;
		blue.value = 0;
		
		redtext.innerHTML = "R: N/A"
		greentext.innerHTML = "G: N/A"
		bluetext.innerHTML = "B: N/A"
	}
	else{
		c1x.fillStyle = color;
		c1x.fillRect(0,0,2,2);
		
		var message = color; 
		colortext.innerHTML = message;
		
		var bin = color.toString(2);
		while(bin.length < 8){
			bin = "0"+bin;
		}
		var r = parseInt(bin.substring(0,3), 2);
		var g = parseInt(bin.substring(3,6), 2);
		var b = parseInt(bin.substring(6,8), 2);
						
		red.value = r;
		green.value = g;
		blue.value = b;
						
		redtext.innerHTML = "R: "+r;
		greentext.innerHTML = "G: "+g;
		bluetext.innerHTML = "B: "+b;
	}	
};