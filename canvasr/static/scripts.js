var baseUrl = document.baseURI;
var path = baseUrl + '/board';

var map2 = [];
for(var i = 0; i < 20; i++){
	map2[i] = null;
}
map2[0] = 255;
map2[1] = 0;
map2[2] = 224;
map2[3] = 236;
map2[4] = 252;
map2[5] = 28;
map2[6] = 31;
map2[7] = 15;
map2[8] = 3;
map2[9] = 227;

// 8-bit pallete
var palette = {
    red: [0,36,72,109,145,182,218,255],
    green: [0,36,72,109,145,182,218,255],
    blue: [0,85,170,255]
};

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
var savedcolor = null;

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

var token = null;
var test = false;
var loggedIn = false;
var errMsg = null;
var username = null;

// socketio
const socket = io('/pixel');

function Login(username, password){
	var json = {user: username, pasw: password};
	var path = baseUrl + '/login';
	$.ajax({
		url: path,
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		type: 'POST',
		success: function(response){
			// console.log(response);
			// token = response.['access_token'];
			// token = response.access_token;
			AuthOver(username, response['access_token']);
			/*
			else if(response.status == 401){
				console.log(response['msg']);
				errMsg = "Incorrect password";
			}
			else if(response.status == 404){
				console.log(response['msg']);
				errMsg = "Incorrect username";
			}
			else {
				console.log(response['msg']);
			}
			*/
		},
		error: function(error){
			console.log(error);
		},
	});
}
function Register(username, password){
	var json = {user: username, pasw: password};
	var path = baseUrl + '/register';
	$.ajax({
		url: path,
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		type: 'POST',
		success: function(response){
			console.log(response);
			if (response.status == 200){
				// token = response.['access_token'];
				// token = response.access_token;
				AuthOver(username, response['access_token']);
			}
			else if(response.status == 403){
				console.log(response['msg']);
				errMsg = "Username already taken";
			}
			else {
				console.log(response['msg']);
			}
		},
		error: function(error){
			console.log(error);
		},
	});
}
function ResetAuth(){
	//	TODO: angular_js reset authentication box (intial tab: login tab)
	username = null;
	token = null;
	loggedIn = false;
}
function AuthOver(usernameSet, tokenSet){
	username = usernameSet;
	token = tokenSet;
	loggedIn = true;
	window.localStorage.setItem('access_token', tokenSet);
	window.localStorage.setItem('user',usernameSet);
	//	TODO: angular_js slide authentication box out of center
}

$(function() {
	token = window.localStorage.getItem('access_token');
	username = window.localStorage.getItem('user');
	if (token)
		loggedIn = true;
});

//initialize board colors and stuff
$(function(){
	//gotta fill the entire canvas with white, cuz else canvas has "empty" pixels that returns 0
	//for testing without server
	const fillImg = $('#canvas')[0].getContext('2d');
	fillImg.fillStyle = "#ffffff";
	fillImg.fillRect(0,0,100,100);
	
	$.ajax(path, {
		accepts: {
			xrgb8: 'application/x-rgb8'
		},
		converters: {
			'text xrgb8': function(data) {
				data = atob(data);
				l = data.length;
				var buf = new ArrayBuffer(l*4);
				var view = new Uint8ClampedArray(buf);
				var j = 0;
				for (var i = 0; i < l; i++) {
					d = data.charCodeAt(i);
					view[j++] = palette.red[(d & 0b11100000) >> 5];
					view[j++] = palette.green[(d & 0b00011100) >> 2];
					view[j++] = palette.blue[(d & 0b00000011)];
					view[j++] = 255;
				}
				return buf
			}
		},
		type: 'GET',
		dataType: 'xrgb8',
		success: function(data, status, xhr){
			const ctx = $('#canvas')[0].getContext('2d');
			const image = ctx.createImageData(ctx.canvas.width,ctx.canvas.height);
			image.data.set(new Uint8ClampedArray(data));
			ctx.putImageData(image,0,0);

			/*// TEMP FIX FOR MAP
			//TODO: PLEASE DON"T USE A MAP
			for (var x = 0; x < 100; x++)
				for (var y = 0; y < 100; y++)
					fill(x,y,getColor(x,y));*/
		}
	});
});

//socket thing
socket.on('post', function(data) {
	fill(data.coord.x, data.coord.y, data.color);
});

//setup controls and stuff
$(function(){
	changeColor(0);
	redrawColors(true);

	addEventListener("mousemove",function(event){
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
		var num = ((red.value << 5) & 0b11100000) | ((green.value << 2) & 0b00011100) | ((blue.value) & 0b00000011);
		changeColor(num);
	}
	green.oninput = function() {
		var num = ((red.value << 5) & 0b11100000) | ((green.value << 2) & 0b00011100) | ((blue.value) & 0b00000011);
		changeColor(num);
	}
	blue.oninput = function() {
		var num = ((red.value << 5) & 0b11100000) | ((green.value << 2) & 0b00011100) | ((blue.value) & 0b00000011);
		changeColor(num);
	}
	cv.addEventListener("mousedown",function(event){
		downx = event.clientX;
		downy = event.clientY;
		drawing = true;
	});
	mid.addEventListener("mousedown",function(event){
		clickx = realmousex;
		clicky = realmousey;
		moving = true;
	});
	mid.addEventListener("wheel",function(event){
		clickx = realmousex;
		clicky = realmousey;
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
			moving = false;
		}
	});
});

//all movement/drawing functions
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
	if(mousex > -1 && mousex < 100 && mousey > -1 && mousey < 100){
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
		ctx.fillStyle = getCurrentColor(color);
	}
	var rect = canvas.getBoundingClientRect();
	var width = rect.right - rect.left;
	var height = rect.bottom - rect.top;
	var multx = width/100;
	var multy = height/100;
	
	var tempx = mousex;
	var tempy = mousey;
	
	realmousex = (event.clientX - rect.left)/multx;
	realmousey = (event.clientY - rect.top)/multy;
	
	mousex = Math.floor(realmousex);
	mousey = Math.floor(realmousey);
	
	//either while zooming or while moving (mousedown and drag)
	if(moving || zooming){
		diffx = realmousex-clickx;
		diffy = realmousey-clicky;
	
		var div = document.getElementById("midpos");
		x = x+(multx*diffx/z);
		y = y+(multy*diffy/z);
	
		if(x<(-50*multx/z)){
			x = -50*multx/z;
		}
		if(x>(50*multx/z)){
			x = 50*multx/z;
		}
		if(y<(-50*multy/z)){
			y = -50*multy/z;
		}
		if(y>(50*multy/z)){
			y = 50*multy/z;
		}
		div.style.transform = "translate(" + x + "px," + y +"px)";

		realmousex = realmousex-diffx;
		realmousey = realmousey-diffy;
		mousex = Math.floor(realmousex);
		mousey = Math.floor(realmousey);
	}
	else if(tempx != mousex || tempy != mousey){
		//if previous pixel is in canvas
		if(tempx > -1 && tempx < 100 && tempy > -1 && tempy < 100){
			//if mouse leaves pixel and color != actual canvas color, go back to canvas color
			if(savedcolor != null){
				ctx.fillStyle = getCurrentColor(savedcolor);
				ctx.fillRect(tempx,tempy,1,1);
				savedcolor = null;
			}
		}
	}
	//if mouse position has gone from a pixel to another pixel (else no changes necessary)
	if(tempx != mousex || tempy != mousey){
		//if previous pixel is in canvas
		/*if(tempx > -1 && tempx < 100 && tempy > -1 && tempy < 100){
			//if mouse leaves pixel and color != actual canvas color, go back to canvas color
			if(savedcolor != null){
				ctx.fillStyle = getCurrentColor(savedcolor);
				ctx.fillRect(tempx,tempy,1,1);
				savedcolor = null;
			}
		}*/
		//if current pixel is in canvas
		if(mousex > -1 && mousex < 100 && mousey > -1 && mousey < 100){
			//if color of current pixel is not selected paint color (if it is, theres no need for highlighting)
			if(getColorInt(mousex, mousey) != color){
				//if selected paint color is SAMPLER (no highlight)
				if(color == null){
					savedcolor = null;
					//if previous pixel was in canvas
					if(tempx > -1 && tempx < 100 && tempy > -1 && tempy < 100){
						//if previous pixel color is not current pixel color (change bottom color display)
						if(getColorInt(mousex,mousey) != getColorInt(tempx,tempy)){
							c1x.fillStyle = getColor(mousex,mousey);
							c1x.fillRect(0,0,2,2);

							var tempcolor = getColor(mousex,mousey);
							var message = "Sampler: " + tempcolor;
							colortext.innerHTML = message;
							
							var tempcolorint = getColorInt(mousex,mousey);
							var r = palette.red.indexOf(getRed(tempcolorint));
							var g = palette.green.indexOf(getGreen(tempcolorint));
							var b = palette.blue.indexOf(getBlue(tempcolorint));
							
							red.value = r;
							green.value = g;
							blue.value = b;
							
							redtext.innerHTML = "R: "+r;
							greentext.innerHTML = "G: "+g;
							bluetext.innerHTML = "B: "+b;
						}
					}
					//previous pixel not in canvas (change bottom color display)
					else{
						c1x.fillStyle = getColor(mousex,mousey);
						c1x.fillRect(0,0,2,2);

						var tempcolor = getColor(mousex,mousey);
						var message = "Sampler: " + tempcolor;
						colortext.innerHTML = message;
							
						var tempcolorint = getColorInt(mousex,mousey);
						var r = palette.red.indexOf(getRed(tempcolorint));
						var g = palette.green.indexOf(getGreen(tempcolorint));
						var b = palette.blue.indexOf(getBlue(tempcolorint));
							
						red.value = r;
						green.value = g;
						blue.value = b;
							
						redtext.innerHTML = "R: "+r;
						greentext.innerHTML = "G: "+g;
						bluetext.innerHTML = "B: "+b;
					}
				}
				//selected paint color is valid (save actual color, and highlight)
				else{
					savedcolor = getColorInt(mousex,mousey);
					ctx.fillStyle = getCurrentColor(color);
					ctx.fillRect(mousex,mousey,1,1);
				}
			}
			//clear highlight
			else{
				savedcolor = null;
			}
		}
		//current pixel NOT in canvas, previous pixel in canvas, paint color is SAMPLER
		//change color display to sampler default
		else if(color == null && (tempx > -1 && tempx < 100 && tempy > -1 && tempy < 100)){
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
	
	var message = "x:"+mousex+" y:"+mousey+""; 
	mousepos.innerHTML = message;
};
function drawCanvas(canvas){
	if(color == null){
		changeColor(getColorInt(mousex, mousey));
	}
	else if(color != savedcolor){
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
			redrawColors(false);
		}
		draw(mousex,mousey);
	}
};
function fill(xpos,ypos,c){
	var ctx = canvas.getContext("2d");
	if(c == null){
		ctx.clearRect(xpos,ypos,1,1);
	}
	else if(color != null && xpos == mousex && ypos == mousey){
		savedcolor = c;
	}
	else{
		ctx.fillStyle = getCurrentColor(c);
		ctx.fillRect(xpos,ypos,1,1);
	}
}
function redrawColors(complete){
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
			c2x.fillStyle = getCurrentColor(map2[i]);
			c2x.fillRect((3*i)%30, (Math.floor(i/10))*3, 2, 2);
		}
	}
}
function changeColor(c){
	console.log(c);
	color = c;
	var c1x = c1.getContext("2d");
	if(color == null){
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
		
		redtext.innerHTML = "R: N/A"
		greentext.innerHTML = "G: N/A"
		bluetext.innerHTML = "B: N/A"
	}
	else{
		c1x.fillStyle = getCurrentColor(color);
		c1x.fillRect(0,0,2,2);
		
		var message = getCurrentColor(color);
		colortext.innerHTML = message;
		
		var r = palette.red.indexOf(getRed(color));
		var g = palette.green.indexOf(getGreen(color));
		var b = palette.blue.indexOf(getBlue(color));
							
		red.value = r;
		green.value = g;
		blue.value = b;
							
		redtext.innerHTML = "R: "+r;
		greentext.innerHTML = "G: "+g;
		bluetext.innerHTML = "B: "+b;
	}	
};
function draw(xcoord,ycoord){
	var json = {coord: {x: xcoord, y: ycoord}, color: color};
	var lk = baseUrl + '/pixel';
	//TODO: check for valid token
	var auth = "Bearer " + token;

	$.ajax({
		url: lk,
		headers: {
			"Authorization": auth
		},
		//dataType: 'json',
		type: 'POST',
		contentType: "application/json; charset=utf-8",
		success: function(response){
			savedcolor = color;
			//console.log(response);
		},
		error: function(error){
			//console.log(error);
		},
		data: JSON.stringify(json)
	});
}

//all getcolor functions
function getColor(coordx, coordy) {
	var ctx = $('#canvas')[0].getContext('2d');
	var pixel = ctx.getImageData(coordx,coordy,1,1);
	var data = pixel.data;
	return "rgba("
		+ data[0] + ","
		+ data[1] + ","
		+ data[2] + ","
		+ (data[3]/255) + ")";
}
function getColorInt(coordx, coordy){
	var ctx = $('#canvas')[0].getContext('2d');
	var pixel = ctx.getImageData(coordx,coordy,1,1);
	var data = pixel.data;
	var result = (palette.red.indexOf(data[0]) << 5) | (palette.green.indexOf(data[1]) << 2) | (palette.blue.indexOf(data[2]));
	return result;
}
function getCurrentColor(c){
	var r = palette.red[(c & 0b11100000) >> 5];
	var g = palette.green[(c & 0b00011100) >> 2];
	var b = palette.blue[(c & 0b00000011)];
	return "rgba("
		+ r + ","
		+ g + ","
		+ b + ","
		+ "1)";
}
function getRed(c){
	var r = palette.red[(c & 0b11100000) >> 5];
	return r;
}
function getGreen(c){
	var g = palette.green[(c & 0b00011100) >> 2];
	return g;
}
function getBlue(c){
	var b = palette.blue[(c & 0b00000011)];
	return b;
}