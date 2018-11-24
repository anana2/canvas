var map = [];
for(var i = 0; i < 1000; i++){
	map[i] = [];
	for(var j = 0; j < 1000; j++){
		map[i][j] = null;
	}
}
var map2 = [];
for(var i = 0; i < 20; i++){
	map2[i] = null;
}
map2[1] = "#000000";
map2[2] = "#ffffff";
map2[3] = "#ff0000";
map2[4] = "#ffaa00";
map2[5] = "#ffff00";
map2[6] = "#00ff00";
map2[7] = "#00ffff";
map2[8] = "#0000ff";
map2[9] = "#ff00ff";

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
var color = "#000000";

var cv = document.getElementById("canvas");
var mid = document.getElementById("mid");
var pos = document.getElementById("midpos");
var c1 = document.getElementById("color1");
var c2 = document.getElementById("color2");
var red = document.getElementById("Red");
var green = document.getElementById("Green");
var blue = document.getElementById("Blue");
var redtext = document.getElementById("redtext");
var greentext = document.getElementById("greentext");
var bluetext = document.getElementById("bluetext");

$(function(){
	var c1x = c1.getContext("2d");
	c1x.fillRect(0,0,2,2);
	
	redrawColors(true,c2);
	
	var cv2 = cv.getContext("2d");
	
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
		color = map2[index];
		if(color == null){
			c1x.fillStyle = "#000000";
			c1x.fillRect(0, 0, 1, 1);
			c1x.fillRect(1, 1, 1, 1);
			c1x.fillStyle = "#dddddd";
			c1x.fillRect(1, 0, 1, 1);
			c1x.fillRect(0, 1, 1, 1);
			
			var n = document.getElementById("colorstring2");
			var message = "Eraser";
			n.innerHTML = message;
			
			red.value = 0;
			green.value = 0;
			blue.value = 0;
			
			redtext.innerHTML = "Red: N/A"
			greentext.innerHTML = "Green: N/A"
			bluetext.innerHTML = "Blue: N/A"
		}
		else{
			c1x.fillStyle = color;
			c1x.fillRect(0,0,2,2);
			
			var n = document.getElementById("colorstring2");
			var message = color; 
			n.innerHTML = message;
			
			var r = parseInt(color.substring(1,3), 16);
			var g = parseInt(color.substring(3,5), 16);
			var b = parseInt(color.substring(5,7), 16);
			
			red.value = r;
			green.value = g;
			blue.value = b;
			
			redtext.innerHTML = "Red: "+r;
			greentext.innerHTML = "Green: "+g;
			bluetext.innerHTML = "Blue: "+b;
		}
	});
	red.oninput = function() {
		var rt = (parseInt(red.value)).toString(16);
		var gt = (parseInt(green.value)).toString(16);
		var bt = (parseInt(blue.value)).toString(16);
		if(rt == "0"){
			rt = rt+"0";
		}
		if(gt == "0"){
			gt = gt+"0";
		}
		if(bt == "0"){
			bt = bt+"0";
		}
		color = "#"+rt+gt+bt;
		
		c1x.fillStyle = color;
		c1x.fillRect(0,0,2,2);
			
		var n = document.getElementById("colorstring2");
		var message = color; 
		n.innerHTML = message;
		
		redtext.innerHTML = "Red: "+red.value;
	}
	green.oninput = function() {
		var rt = (parseInt(red.value)).toString(16);
		var gt = (parseInt(green.value)).toString(16);
		var bt = (parseInt(blue.value)).toString(16);
		if(rt == "0"){
			rt = rt+"0";
		}
		if(gt == "0"){
			gt = gt+"0";
		}
		if(bt == "0"){
			bt = bt+"0";
		}
		color = "#"+rt+gt+bt;
		
		c1x.fillStyle = color;
		c1x.fillRect(0,0,2,2);
			
		var n = document.getElementById("colorstring2");
		var message = color; 
		n.innerHTML = message;
		
		greentext.innerHTML = "Green: "+green.value;
	}
	blue.oninput = function() {
		var rt = (parseInt(red.value)).toString(16);
		var gt = (parseInt(green.value)).toString(16);
		var bt = (parseInt(blue.value)).toString(16);
		if(rt == "0"){
			rt = rt+"0";
		}
		if(gt == "0"){
			gt = gt+"0";
		}
		if(bt == "0"){
			bt = bt+"0";
		}
		color = "#"+rt+gt+bt;
		
		c1x.fillStyle = color;
		c1x.fillRect(0,0,2,2);
			
		var n = document.getElementById("colorstring2");
		var message = color; 
		n.innerHTML = message;
		
		bluetext.innerHTML = "Blue: "+blue.value;
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
	var div = document.getElementById("midscale");
	z = z*2;
	if(z > 64){
		z = 64;
	}
	div.style.transform = "scale("+z+","+z+")";
	
	var n = document.getElementById("zoomlevel");
	var message = "Zoom: "+z+"x  "; 
	n.innerHTML = message;
};
function ZoomOut(){
	var div = document.getElementById("midscale");
	z = z/2;
	if(z < 1){
		z = 1;
	}
	div.style.transform = "scale("+z+","+z+")";
	
	var n = document.getElementById("zoomlevel");
	var message = "Zoom: "+z+"x  "; 
	n.innerHTML = message;
	
	var cv = document.getElementById("canvas");
	var ctx = cv.getContext("2d");
	if(mousex > -1 && mousex < 1000 && mousey > -1 && mousey < 1000){
		if(!map[mousex][mousey]){
			ctx.clearRect(mousex,mousey,1,1);
		}
	}
};
function Zoom(amount){
	var div = document.getElementById("midscale");
	if(z<3 && amount>0){
		z = (Math.round((z+(amount*0.1))*10))/10;
	}
	else if(z<3.5 && amount<0){
		z = (Math.round((z+(amount*0.1))*10))/10;
	}
	else if(z>15.5 && amount>0){
		z = z+(2*amount);
	}
	else if(z>16 && amount<0){
		z = z+(2*amount);
	}
	else if(z>31.5 && amount>0){
		z = z+(4*amount);
	}
	else if(z>32 && amount<0){
		z = z+(4*amount);
	}
	else{
		z = z+amount;
	}
	if(z > 64){
		z = 64;
	}
	else if(z < 1){
		z = 1;
	}
	else{
		div.style.transform = "scale("+z+","+z+")";
	
		var n = document.getElementById("zoomlevel");
		var message = "Zoom: "+z+"x  "; 
		n.innerHTML = message;
	
		var cv = document.getElementById("canvas");
		writeMessage(cv);
	}
};
function writeMessage(canvas){
	var ctx = canvas.getContext("2d");
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
	
		var n = document.getElementById("translatelevel");
		var message = "Camera Position: "+Math.floor(x)+" "+Math.floor(y)+"  ";  
		n.innerHTML = message;
	}
	else if(tempx != mousex || tempy != mousey){
		if(tempx > -1 && tempx < 1000 && tempy > -1 && tempy < 1000){
			if(map[tempx][tempy] == null){
				ctx.clearRect(tempx,tempy,1,1);
			}
			else{
				ctx.fillStyle = map[tempx][tempy];
				ctx.fillRect(tempx,tempy,1,1);
			}
		}
	}
	if(mousex > -1 && mousex < 1000 && mousey > -1 && mousey < 1000){
		if(map[mousex][mousey] != color){
			if(color == null){
				ctx.clearRect(mousex,mousey,1,1);
			}
			else{
				ctx.fillRect(mousex,mousey,1,1);
			}
		}
	}

	var n = document.getElementById("colorstring");
	var message = "x:"+mousex+" y:"+mousey+""; 
	n.innerHTML = message;
	
	var m = document.getElementById("realposition");
	var message = "Real Mouse Position: "+realmousex+" "+realmousey+" "; 
	m.innerHTML = message;
};
function drawCanvas(canvas){
	if(map[mousex][mousey] != color){
		if(color == null){
			map[mousex][mousey] = color;
			var ctx = canvas.getContext("2d");
			ctx.clearRect(mousex,mousey,1,1);
		}
		else{
			var base = false;
			var prev = color;
			for(var i = 0; i < 20; i++){
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
		
			map[mousex][mousey] = color;
			var ctx = canvas.getContext("2d");
			ctx.fillStyle = color;
			ctx.fillRect(mousex,mousey,1,1);
		}
	}
};
function redrawColors(complete,canvas){
	var range = 0;
	var c2x = c2.getContext("2d");
	if(complete){
		range = 0;
		c2x.fillStyle = "#eeddee";
		c2x.fillRect(0,0,30,5);
	}
	else{
		range = 10;
	}
	for(var i = range; i < 20; i++){
		if(map2[i] != null){
			c2x.fillStyle = map2[i];
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3, 2, 2);
		}
		else{
			c2x.fillStyle = "#000000";
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3, 1, 1);
			c2x.fillRect((3*i)%30+1, (Math.floor(i/10))*3+1, 1, 1);
			c2x.fillStyle = "#dddddd";
			c2x.fillRect((3*i)%30+1, (Math.floor(i/10))*3, 1, 1);
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3+1, 1, 1);
		}
	}
}