burl = document.baseURI

function login() {

}


// 8-bit pallete
var palette = {
    red: [0,36,72,109,145,182,218,255],
    green: [0,36,72,109,145,182,218,255],
    blue: [0,85,170,255]
};


//initialize board colors and stuff
$(function(){
	$.ajax(burl + 'board', {
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



function itorgb(color) {
	return 'rgba('
		+ palette.red[(color & 0b11100000) >> 5] + ','
		+ palette.green[(color & 0b00011100) >> 2] + ','
		+ palette.blue[(color & 0b00000011)] + ','
		+ '1)'
}




var _color_selected = 0;

// color selector
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
$(function() {
	$('.slider').trigger('input');
});