// File to handle all the operations(zoom, pan, draw a marker) on Digital Image


var canvasWidth = 588;
var canvasHeight = 400;
var canvas;
var ctx;
var curr_im;
var imageOffsetLeft = 50;
var effectiveCanvasWidth = canvasWidth-imageOffsetLeft;

var imgWidth;
var imgHeight;
var imageObj = new Image();

var rect = {};

var drag = false, 
	drawn = false,
	isDown = false,
	isPanningEnabled = false;
	
var gX = 0, 
	gY = 0, 
	pX = 0, 
	pY = 0,
	imscale = 1,
	speed = 2;

var imgConfig = {
	aspectRatio:'',
	correctedImageWidth:''
};

// Create the canvas element and initiate functions on it
function loadCanvas(id,defaultImg) { 
	canvas = document.createElement('canvas');
	ctx = canvas.getContext("2d");
	
	div = document.getElementById(id); 
    canvas.id     = "OriginalImage";
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    div.appendChild(canvas)

	loadImage(defaultImg);
	zoom();
	pan();
}


// Load the digital image on the canvas element
function loadImage(im_src) {
	if(curr_im != im_src) {
		curr_im = im_src;
	imageObj.src = im_src;
	
	// Since the images are high resolution they take some time to load. Thus,the progress bar
	$('#progressBar').show();
    imageObj.onload = function() {			
			
			var widthRatio = 1;
			var heightRatio = 1;
			
			// adjust the size of the image according to the canvas size
			if(imageObj.width > effectiveCanvasWidth)
                widthRatio = effectiveCanvasWidth / imageObj.width;
			
			//Calculations to maintain the aspect ratio of the image
			imgConfig.aspectRatio=imageObj.width/imageObj.height;
			imgConfig.correctedImageWidth = imgConfig.aspectRatio * canvasHeight;
			
			//var currentImageAspectRatio = imageObj.width/imageObj.height;
			//var correctedImageWidth = currentImageAspectRatio * canvasHeight;
			
			$('#progressBar').hide();
			//ctx.drawImage(imageObj, 0, 0,canvas.width,canvas.height);	
			ctx.drawImage(imageObj, 0 , 0, imgConfig.correctedImageWidth, canvas.height);
			resetCanvas();	
    	};
	}
}


// Reset the canvas 
function resetCanvas(state)
{
	drag = false;
	isDown = false;
	isPanningEnabled = false;
	gX = 0;
    gY = 0;
    pX = 0;
    pY = 0;
    imscale = 1;
    speed = 2;
	if(!state) {
		rect = {};
	}
	drawn = false;
	redraw();
	zoom();
	pan();
}


// Zoom on the canvas using the mouse wheel	
function zoom() {
	
	// Add mouse event listeners to the canvas
	if (canvas.addEventListener) {
		canvas.addEventListener("mousewheel", mouseWheel, false);	// IE9, Chrome, Safari, Opera
		canvas.addEventListener('MozMousePixelScroll', mouseWheel, false);	// Firefox	    (//canvas.addEventListener('DOMMouseScroll', mouseWheel, false);	// Firefox)
	}
	else 
		canvas.attachEvent("onmousewheel", mouseWheel);		// IE 6/7/8
			
	function mouseWheel(event) {
    	var delta = 0;
    	if (!event) 
			event = window.event;
		
		// capture the delta movement depending on the different browsers 	
    	if (event.wheelDelta) {
        	delta = event.wheelDelta / 120;
    	} 
		else if (event.detail) {
        	delta = -event.detail / 3;
    	}
		
		// only if the image is zoomed in the panning is enabled on the canvas
		if (delta) {
			if(delta>0) {
				isPanningEnabled = true;
			}
        	handle(delta);
    	}
    	/*if (event.preventDefault) {
        	event.preventDefault();
    	}*/
    	//event.returnValue = false;
		return preventDefault(event);
	}
	
	// function to prevent the window scrolling in firefox when the scrolling on canvas is enabled
	function preventDefault(event) {

		// stop event propagation
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		else {
			event.cancelBubble = true; 
		}
		
		// stop event default processing
		if (event.preventDefault)  {
			event.preventDefault();
		}
		else  {
			event.returnValue = false;
		}		
		return false;
	}	
}


// Determine the amount of zoom in/out 
function handle(delta) {
	imscale += delta * 0.01;
    if (imscale < 1) 
		imscale = 1;
    redraw();
	pan();
}


var outDelta = 0;
var inDelta = 0;

// Zoom on the canvas using the button	
function buttonZoom(multiplier) {
	var scale = 25;
	if(multiplier>0){
		isPanningEnabled = true;
		inDelta += scale;
		handle(inDelta);
	}else{
		outDelta -= scale;
		handle(outDelta);
	}	
}


var panSet = false;
var drawRectSet = false;

// pan on the canvas using mouse and button
function pan(direction) {
	var move = 25;
	
	// panning is allowed only if the user is already zoomed into the image
	if(isPanningEnabled){
		// if panning is initiated by mousewheel, direction is absent
		panSet = !(direction);
		
		switch(direction){
			case 'up':{
				gY -= move;
				if (gY > 0) 
					gY = 0;
        		if (gY < canvas.height - canvas.height * imscale) 
					gY = canvas.height - canvas.height * imscale;
				break;
			}
			case 'down':{
				gY += move;
				if (gY > 0) 
					gY = 0;
        		if (gY < canvas.height - canvas.height * imscale) 
					gY = canvas.height - canvas.height * imscale;
				break;
			}
			case 'left':{
				gX -= move;
				if (gX > 0) 
					gX = 0;
        		if (gX < canvas.width -  canvas.width * imscale) 
					gX = canvas.width -  canvas.width * imscale;
				break;
			}
			case 'right':{
				gX += move;
				if (gX > 0) 
					gX = 0;
        		if (gX < canvas.width -  canvas.width * imscale) 
					gX = canvas.width -  canvas.width * imscale;
				break;
			}
		}
		drawOrPan();
		panSet=true;
	}
}


// Set the flag for drawing on the canvas
function draw_rect() {
	drawRectSet = true;
	$('#OriginalImage').css('cursor','crosshair');
	drawOrPan();
}


var startX,startY;

// handles both drawing on the canvas as well as pan depending on the flag set 
function drawOrPan() {
	if (highlighted_di == true)	{
		hideMarkers();
		imscale = 1;
		rect={};
	}
		
	canvas.addEventListener("mousedown", mouseDown, false);	   
	canvas.addEventListener("mousemove", mouseMove, false);	
    canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseOut, false);
	
	redraw(0, 0);
	function mouseDown(e) {
		if(drawRectSet) {
			drag = true;
			isDown = false;
			panSet = false;
			
			//capture the starting co-ordinates of the rectangle
			if(navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
			startX = e.layerX;  // Firexox  
			startY = e.layerY;
			}
			else {
			startX = e.offsetX;  // other browsers
			startY = e.offsetY;
			}
			return false;
		}
		else if(panSet) { 
			$('#OriginalImage').css('cursor','move');
			isDown =true;
			pX = e.pageX;
			pY = e.pageY;
			return false;
		}
	}	
	
	function mouseUp(e) {
		if(drawRectSet) {
			$('#OriginalImage').css('cursor','pointer');
			drag = false; 
			drawRectSet=false; 
			panSet=true;
			img_update();
			return false;
		}
		else if(panSet) {
			$('#OriginalImage').css('cursor','pointer');
			isDown = false; 
			return false;
		}		
			
	}
	
	// disable the drawing or panning if the mouse is outside the canvas 
	function mouseOut(e) {
		if(drawRectSet) 
			drag = false;
		 else if(panSet) 
				isDown = false;
	}
				
    function mouseMove(e) {		
	 	// to draw a marker on the canvas
		if(drag) {
			var endX, endY;
			if(navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
				endX = e.layerX;  // Firexox  
				endY = e.layerY;
			}
			else {
				endX = e.offsetX;  // other browsers
				endY = e.offsetY;
			}
		
			var w = endX - startX;
			var h = endY - startY;
			
			ctx.clearRect(0,0,canvas.width,canvas.height);
			rect.x = startX - gX;
			rect.y = startY - gY;
			
			// setting he dimensions of the rectagle to be drawn 
			rect.x = rect.x/imscale;
			rect.y = rect.y/imscale;
			rect.w = w/imscale;
			rect.h = h/imscale;
			
			var rgb =  hex2rgb('#000');
			ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] +', ' + rgb[2] + ', 0.3)';
			ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
			//console.log(rect.x,rect.y,rect.w,rect.h);
			redraw();
		}
		
		// to pan on the canvas
		else if(isDown) {
			gX -= (pX - e.pageX) * speed;
			gY -= (pY - e.pageY) * speed;
			pX = e.pageX;
			pY = e.pageY	
			if (gX > 0) 
				gX = 0;
        	if (gX < canvas.width -  canvas.width * imscale) 
				gX = canvas.width -  canvas.width * imscale;
			if (gY > 0) 
				gY = 0;
        	if (gY < canvas.height - canvas.height * imscale) 
				gY = canvas.height - canvas.height * imscale;
			redraw();
		}	
   }
}


// Redraw the image on the canvas with the marker(rectangle)
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	var im = rect;
    ctx.translate(gX, gY);
	ctx.scale(imscale, imscale);
	
	var currentImageAspectRatio = imageObj.width/imageObj.height;
	var correctedImageWidth = currentImageAspectRatio * canvasHeight;
	
	ctx.drawImage(imageObj, 0, 0,imgConfig.correctedImageWidth, canvas.height);
	
	//ctx.drawImage(imageObj, 0, 0,canvas.width,canvas.height);
	ctx.fillRect(im.x,im.y,im.w,im.h);
	ctx.restore();
}

// if a rectangle is drwan on the image then return the rectangle object	
function img_update () {
		drawn = true;
		if(rect.x == undefined|| rect.w == null){
			return {};
		}
		else
			return(rect);
}

function undoDraw() {
	if(drawn == true) {
		rect={};
		redraw(0,0);
	}
}

// make the colour of the marker translucent
function hex2rgb(colour) {
    var r,g,b;
	var rgb = {};
    if ( colour.charAt(0) == '#' ) {
        colour = colour.substr(1);
    }
    if ( colour.length == 3 ) {
            colour = colour.substr(0,1) + colour.substr(0,1) + colour.substr(1,2) + colour.substr(1,2) + colour.substr(2,3) + colour.substr(2,3);
    }
    r = colour.charAt(0) + '' + colour.charAt(1);
    g = colour.charAt(2) + '' + colour.charAt(3);
    b = colour.charAt(4) + '' + colour.charAt(5);
    rgb[0] = parseInt( r,16 );
    rgb[1] = parseInt( g,16 );
    rgb[2] = parseInt( b ,16);
    return rgb;
}
