// JavaScript Document
// JavaScript Document

document.addEventListener('DOMContentLoaded',dblerot,false);

function dblerot() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_phiborsa" and the canvas to have an id="canvas_phiborsa" */
/*The script a simplified phasor diagram (no RA) for a standalone generator. The inputs available to the user via html buttons set the following cases:
 increase / decrease E
 increase / decrease IA
 power factor lagging / leading / unity */	

/* math for the phasor diagram variation is carried out in per-unit, and then scaled, to fit diagram within canvas window space */
	
 var cont_dr=document.getElementById("canvasholder_dblerot");
 var myc_dr = document.getElementById("canvas_dblerot");
	
 

 if (null===myc_dr || !myc_dr.getContext) {
 	return; 
 }

 var ctx_dr=myc_dr.getContext("2d");
 
 ctx_dr=myc_dr.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 2 lines text, phasor diagram, bottom section of 7 lines text. 
 Aspect ratio will be worked out when drawing is initialized.
 */
  
    var maxW=512; var aspect=0.5;
	var scale, winW, winH, width1, drawW, drawH, maxPhasor, border;
	var x0,y0,x1, phColor, nomFontH=12;
	var maxsteps=180, tstep=50, frameNo=0, id;
	
	
	// define some basic phasor information, in per unit
	
	var theta=0;
	var fwd={mag:0.5,phase:theta};
	var bwd={mag:0.5,phase:Math.PI-theta};
	var tot={mag:0,phase:0};
	addPhasors(tot,fwd,bwd);



	function initDrawing(){
		
		width1=cont_dr.offsetWidth;
		if (width1>maxW){
			winW=maxW;
			scale=1;
		}
		if (width1<maxW){
			scale=width1/maxW;
			winW=width1;
		}
		

	 // set canvas size based on containing div size (fluid resizing)
		winH=winW*aspect;
		ctx_dr.canvas.width=winW;
		ctx_dr.canvas.height=winH;
	// drawing size is made up of two retangular boxes, side by side
		x0=winH/2;
		y0=winH/2;
		x1=x0+winH;
		
		
	 // define font sizes, scaled with width.

		ctx_dr.fillStyle="#000000";
		ctx_dr.lineWidth=2;
		ctx_dr.font="12px serif";
		ctx_dr.textAlign="left";	
		ctx_dr.font = " "+Math.round(nomFontH*scale)+"px serif";
		
		// drawing border =2% of width;
		border =Math.round(winW*0.02);
		// actual diagram width
		drawW=winW-2*border;
		// actual daigram height
		drawH=winH-2*border;
		
		maxPhasor= drawH/2;
		
		ctx_dr.fillText(winW.toFixed(1),10,10);
		ctx_dr.fillText(winH.toFixed(1),10,20);
		ctx_dr.fillText(x0.toFixed(1),10,30);
		ctx_dr.fillText(y0.toFixed(1),10,40);
		ctx_dr.fillText(maxPhasor.toFixed(1),10,50);
		ctx_dr.fillText(drawH.toFixed(1),10,60);
		


// finished init of canvas, now init drawing

		
		doDrawing();
	}
	
	function doDrawing(){
		ctx_dr.clearRect(0,0,winW,winH);
		fwd={mag:0.5,phase:theta};
		bwd={mag:0.5,phase:Math.PI-theta};

		addPhasors(tot,fwd,bwd);
		// plot fwd
		phColor="#DD0000";
		drawPhasor(ctx_dr, x0, y0,maxPhasor*fwd.mag,fwd.phase, phColor,'f', 3);
		// plot bwd
		phColor="#0000DD";
		drawPhasor(ctx_dr, x0, y0,maxPhasor*bwd.mag,bwd.phase, phColor,'b', 3);
		// plot total
		phColor="#DD0000";
		drawPhasor(ctx_dr, x1, y0,maxPhasor*fwd.mag,fwd.phase, phColor,'f', 3);
		phColor="#0000DD";
		var offsetx=maxPhasor*fwd.mag*Math.cos(fwd.phase);
		var offsety=maxPhasor*fwd.mag*Math.sin(fwd.phase);
		drawPhasor(ctx_dr, x1+offsetx, y0-offsety, maxPhasor*bwd.mag,bwd.phase, phColor,'b', 3);
		phColor="#000000";
		drawPhasor(ctx_dr, x1, y0,maxPhasor*tot.mag,tot.phase, phColor,'t', 3);
		
	}

	function animateDrawing(){
	/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=1;
		}
		theta=frameNo*2*Math.PI/maxsteps;
		doDrawing();
	// all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
	}
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);

	var runButton = document.getElementById('runAnim');
	var stopButton = document.getElementById('stopAnim');
	var stepButton = document.getElementById('stepAnim');


	runButton.addEventListener("click", function(){
			clearInterval(id) ;
			initDrawing();
            id=setInterval(animateDrawing,tstep);
        });
    stopButton.addEventListener("click", function(){
			clearInterval(id) ;
        });
	stepButton.addEventListener("click", function(){
			clearInterval(id) ;
		  	frameNo++;
			if (frameNo===maxsteps+1){
				frameNo=1;
			}
			theta=(frameNo-1)*2*Math.PI/maxsteps;
			doDrawing();
        }); 

	
}

	
function drawPhasor(ctx,x0,y0,magn,phase,col,name, nameoffset){	
	'use strict';
	ctx.save();
	ctx.strokeStyle=col;
	ctx.fillStyle=col;
	ctx.translate(x0,y0);
	ctx.rotate(-phase);
	ctx.beginPath(); 
	ctx.moveTo(0,0);
	ctx.lineTo(magn,0); 
	ctx.lineTo(magn-4,0-4); 
	ctx.lineTo(magn-4,0+4); 
	ctx.lineTo(magn,0); 
	ctx.stroke();
	ctx.translate(magn-Math.abs(3*nameoffset),-nameoffset);
	ctx.rotate(phase);
	ctx.fillText(name,0,0);
	ctx.restore();
}	


function addPhasors(a,b,c){
	//a=b+c
	'use strict';
	var  real, imag;
	real=b.mag*Math.cos(b.phase)+c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)+c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}
function subPhasors(a,b,c){
	// a=b-c
	'use strict';
	var real, imag;
	real=b.mag*Math.cos(b.phase)-c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)-c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}

	
