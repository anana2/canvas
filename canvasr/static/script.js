burl = document.baseURI



/* user auth stuff
*/

var isLoggedIn = false;

// login verification
$('#login_form').submit(function(ev) {
	ev.preventDefault();
	user = $('#login_user').val();
	$.ajax('/login', {
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({
			user: user,
			pasw: $('#login_pasw').val()
		}),
		success: function(data, status, xhr){
			localStorage.setItem('user', user);
			localStorage.setItem('access_token', data['access_token']);
			$.notify({
				message: 'logging successful'
			},{
				allow_dismiss: false,
				element: '#canvas_container',
				type: 'success',
				placement: {
					from: "bottom",
					align: "center"
				},
				offset: {
					y: 32
				},
				delay: 800,
				animate: {
					enter: 'animated fadeIn',
					exit: 'animated fadeOut'
				},
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><span aria-hidden="true">&times;</span></button>' +
					'<div style="text-align: center;">' +
						'<span data-notify="message">{2}</span>' +
					'</div>' +
				'</div>'
			});
			loggedIn(user)
		},
		error: function() {
			$.notify({
				message: 'wrong username or password'
			},{
				allow_dismiss: false,
				element: '#canvas_container',
				type: 'danger',
				placement: {
					from: "bottom",
					align: "center"
				},
				offset: {
					y: 32
				},
				delay: 800,
				animate: {
					enter: 'animated fadeIn',
					exit: 'animated fadeOut'
				},
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><span aria-hidden="true">&times;</span></button>' +
					'<div style="text-align: center;">' +
						'<span data-notify="message">{2}</span>' +
					'</div>' +
				'</div>'
			});
		}
	});
});


function register(user, pasw) {
	$.ajax('/register', {
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({
			user: user,
			pasw: pasw
		}),
		success: function(data, status, xhr){
			localStorage.setItem('user', user);
			localStorage.setItem('access_token', data['access_token']);
			$.notify({
				message: 'registration successful'
			},{
				allow_dismiss: false,
				element: '#canvas_container',
				type: 'success',
				placement: {
					from: "bottom",
					align: "center"
				},
				offset: {
					y: 32
				},
				delay: 800,
				animate: {
					enter: 'animated fadeIn',
					exit: 'animated fadeOut'
				},
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><span aria-hidden="true">&times;</span></button>' +
					'<div style="text-align: center;">' +
						'<span data-notify="message">{2}</span>' +
					'</div>' +
				'</div>'
			});
			loggedIn(user)
		},
		error: function() {
			$.notify({
				message: 'user already exists'
			},{
				allow_dismiss: false,
				element: '#canvas_container',
				type: 'warning',
				placement: {
					from: "bottom",
					align: "center"
				},
				offset: {
					y: 32
				},
				delay: 800,
				animate: {
					enter: 'animated fadeIn',
					exit: 'animated fadeOut'
				},
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><span aria-hidden="true">&times;</span></button>' +
					'<div style="text-align: center;">' +
						'<span data-notify="message">{2}</span>' +
					'</div>' +
				'</div>'
			});
		}
	});
}


$('#register_form').submit(function(ev) {
	ev.preventDefault();
	user = $('#register_user').val();
	pasw = $('#register_pasw').val();
	register(user, pasw);
})


$('#register_submit').click(function() {
	$('#register_form').submit();
})

function loggedIn(user) {
	$('#login_text').toggleClass('invisible');
	$('#login_form').toggleClass('invisible');
	$('#user_text').html(user);
	$('#register_logout').html('logout');
	$('#register_logout').data('target','');
	isLoggedIn = true;
}

function loggedOut() {
	$('#login_text').toggleClass('invisible');
	$('#login_form').toggleClass('invisible');
	$('#register_logout').html('register');
	$('#register_logout').data('target','#registration');
	isLoggedIn = false;
}

$(function() {
	user = localStorage.getItem('user');
	if (user) {
		loggedIn(user);
	}
});

$('#register_logout').click(function() {
	switch($(this).text()) {
		case 'register':
			$('#registration').modal();
			break;
		case 'logout':
			localStorage.removeItem('user');
			localStorage.removeItem('access_token');
			loggedOut();
			break;
	}
});


// 8-bit pallete
var palette = {
    red: [0,36,72,109,145,182,218,255],
    green: [0,36,72,109,145,182,218,255],
    blue: [0,85,170,255]
};


//initialize board colors and stuff
$(function() {
	$.ajax('/board', {
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
		}
	});
});






/* socketio events
*/


const socket = io('/pixel');


socket.on('post', function(data) {
	draw(data.color, data.coord.x, data.coord.y);
});





/* Sliding color selectors
*/


var _color_selected = 0;

// color selector updates
$('.slider').on('input', function() {
	v = $(this).val();
	c = $(this).data('color');
	switch (c) {
		case 'red':
			v = v << 5;
			_color_selected = (_color_selected & 0b00011111) | v;
			break;
		case 'green':
			v = v << 2
			_color_selected = (_color_selected & 0b11100011) | v;
			break;
		case 'blue':
			_color_selected = (_color_selected & 0b11111100) | v;
			break;
	}
	$("<style type='text/css'>#color_selector_"
		+ c + "::-webkit-slider-thumb{background:"
		+ itorgb(v) + "</style>").appendTo($("head"));
	$("<style type='text/css'>#color_selector_"
		+ c + "::-moz-range-thumb{background:"
		+ itorgb(v) + "</style>").appendTo($("head"));
	$('#color_display').css("background-color",itorgb(_color_selected));
});

// update once at ready
$(function() {
	$('.slider').trigger('input');
});






/* canvas interactions
*/
var sizeX = 100;
var sizeY = 100;

var mouseX;
var mouseY;

var lastX;
var lastY;

var mc = new Hammer.Manager($('#canvas')[0]);

mc.add(new Hammer.Tap());

mc.on('tap', function(ev) {
	var offset = $('#canvas').offset();
	var width = $('#canvas').width();
	var height = $('#canvas').height();
	mouseX = Math.floor((ev.center.x - offset.left)*100/width);
	mouseY = Math.floor((ev.center.y - offset.top)*100/height);
	postPixel(_color_selected,mouseX,mouseY);
});

/*


$(document).mousemove(event => {
	lastX = mouseX;
	lastY = mouseY;
	posX = $('#canvas').offset().left;
	posY = $('#canvas').offset().top
	mouseX = event.pageX - posX;
	mouseY = event.pageY - posY;
	if (lastX >= )
});


$('#canvas').mousedown(event => {

});
*/






/* Helper functions
*/


function draw(color,x,y) {
	ctx = $('#canvas')[0].getContext('2d');
	ctx.fillStyle = itorgb(color);
	ctx.fillRect(x,y,1,1);
}


function itorgb(color) {
	return 'rgba('
		+ palette.red[(color & 0b11100000) >> 5] + ','
		+ palette.green[(color & 0b00011100) >> 2] + ','
		+ palette.blue[(color & 0b00000011)] + ','
		+ '1)'
}


function postPixel(color,x,y) {
	$.ajax({
		url: '/pixel',
		headers: {
			"Authorization": "Bearer " + localStorage.getItem('access_token')
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
		data: JSON.stringify({coord:{x:x,y:y},color: color})
	});
}