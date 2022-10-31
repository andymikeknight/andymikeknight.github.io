// JavaScript Document
// JavaScript Document

document.addEventListener('DOMContentLoaded',twophase,false);

function twophase() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_phiborsa" and the canvas to have an id="canvas_phiborsa" */
/*The script a simplified phasor diagram (no RA) for a standalone generator. The inputs available to the user via html buttons set the following cases:
 increase / decrease E
 increase / decrease IA
 power factor lagging / leading / unity */	

/* math for the phasor diagram variation is carried out in per-unit, and then scaled, to fit diagram within canvas window space */
	
 var cont_2p=document.getElementById("canvasholder_2phase");
 var myc_2p = document.getElementById("canvas_2phase");
	
 

 if (null===myc_2p || !myc_2p.getContext) {
 	return; 
 }

 var ctx_2p=myc_2p.getContext("2d");
 
 ctx_2p=myc_2p.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 2 lines text, phasor diagram, bottom section of 7 lines text. 
 Aspect ratio will be worked out when drawing is initialized.
 */
  
    var maxW=512; var aspect=0.5;
	var scale, winW, winH, width1, drawW, drawH, unitPhasor, border;
	var x0,y0,x1, phColor, nomFontH=12, lineheight; 
	var maxsteps=180, tstep=50, frameNo=0, id;
	var theta_e=0, bscale=1, theta_off=Math.PI/2;
	
	
	// define some basic phasor information, in per unit
	

	var Afwd={mag:0.5,phase:theta_e};
	var Abwd={mag:0.5,phase:-theta_e};
	var Bfwd={mag:0.5*bscale,phase: theta_e-Math.PI/2+theta_off};
	var Bbwd={mag:0.5*bscale,phase:-theta_e-Math.PI/2-theta_off};
	var Atot={mag:0,phase:0};
	var Btot={mag:0,phase:0};
	var net={mag:0,phase:0};
	addPhasors(Atot,Afwd,Abwd);
	addPhasors(Btot,Bfwd,Bbwd);
	addPhasors(net,Atot,Btot);


	function initDrawing(){
		
		width1=cont_2p.offsetWidth;
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
		ctx_2p.fillStyle="#000000";
		ctx_2p.lineWidth=2;
		ctx_2p.font="12px serif";
		ctx_2p.textAlign="left";
		lineheight=Math.round(nomFontH*scale);
		ctx_2p.font = " "+lineheight+"px serif";
		
		ctx_2p.canvas.width=winW;
		ctx_2p.canvas.height=winH;
	// drawing size is made up of two retangular boxes, side by side
		
		x0=winW/4;
		y0=winH/2;
		x1=x0+winW/2;
		
		
	 // define font sizes, scaled with width.


		
		// drawing border =2% of width;
		border =Math.round(winW*0.02);
		// actual diagram width
		drawW=winW-2*border;
		// actual daigram height
		drawH=winH-2*border-4*lineheight;
		
		unitPhasor= drawH/3;
	
		


// finished init of canvas, now init drawing

		
		doDrawing();
	}
	
	function doDrawing(){
		ctx_2p.clearRect(0,0,winW,winH);
		ctx_2p.fillText('Phase A and B Pulsating Fields',border, border);
		ctx_2p.fillText('Phase A and B Rotating Components',border+winH,border);
		
		Afwd={mag:0.5,phase:theta_e};
		Abwd={mag:0.5,phase:-theta_e};
		Bfwd={mag:0.5*bscale,phase: theta_e-Math.PI/2+theta_off};
		Bbwd={mag:0.5*bscale,phase:-theta_e-Math.PI/2-theta_off};

		addPhasors(Atot,Afwd,Abwd);
		addPhasors(Btot,Bfwd,Bbwd);
		addPhasors(net,Atot,Btot);
		
		// plot pulsating components and net rotation on left
		
		// phase A - plot as solid lines

		phColor="#009900";
		drawPhasor(ctx_2p, x0, y0,unitPhasor*Atot.mag,Atot.phase, phColor,'A', 1);
		// phase B - plot as dash lines
		drawDashedPhasor(ctx_2p, x0, y0,unitPhasor*Btot.mag,Btot.phase, phColor,'B', 1);
		ctx_2p.restore();
		// net- plot as solid lines
		phColor="#000000";
		drawPhasor(ctx_2p, x0, y0,unitPhasor*net.mag,net.phase, phColor,'Net', 1);
		
		
		// plot rotating components and net rotation on right
		phColor="#DD0000";
		drawPhasor(ctx_2p, x1, y0,unitPhasor*Afwd.mag,Afwd.phase, phColor,'A-f', 1);
		phColor="#0000DD";
		drawPhasor(ctx_2p, x1, y0,unitPhasor*Abwd.mag,Abwd.phase, phColor,'A-b', 1);
		// phase B - plot as dash lines

		phColor="#DD0000";
		drawDashedPhasor(ctx_2p, x1, y0,unitPhasor*Bfwd.mag,Bfwd.phase, phColor,'B-f', 1);
		phColor="#0000DD";
		drawDashedPhasor(ctx_2p, x1, y0,unitPhasor*Bbwd.mag,Bbwd.phase, phColor,'B-b', 1);
		// net- plot as solid lines
		phColor="#000000";
		drawPhasor(ctx_2p, x1, y0,unitPhasor*net.mag,net.phase, phColor,'Net', 1);
		
		ctx_2p.fillText('Phase B Magnitude   '+(bscale).toFixed(1)+' times Phase A' 	 ,border,winH-2*lineheight);
		ctx_2p.fillText('Phase B Phase Angle '+(theta_off*180/Math.PI).toFixed(1)+' degrees from Phase A' 	 ,border,winH-lineheight);
		
	}

	function animateDrawing(){
	/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=1;
		}
		theta_e=frameNo*2*Math.PI/maxsteps;
		doDrawing();
	// all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
	}
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);

	var mupButton = document.getElementById('magUp');
	var mdnButton = document.getElementById('magDn');
	var pupButton = document.getElementById('phaseUp');
	var pdnButton = document.getElementById('phaseDn');
	var runButton = document.getElementById('run2p');
	var stopButton = document.getElementById('stop2p');


	mupButton.addEventListener("click", function(){
			if (bscale<1.45){
				bscale=bscale+0.1;
			}
			clearInterval(id) ;
            id=setInterval(animateDrawing,tstep);
        });
	mdnButton.addEventListener("click", function(){
			if (bscale>0.55){
				bscale=bscale-0.1;
			}
			clearInterval(id) ;
            id=setInterval(animateDrawing,tstep);
        });
	pupButton.addEventListener("click", function(){
			if (theta_off<3){
				theta_off=theta_off+Math.PI/8;
			}
			clearInterval(id) ;
            id=setInterval(animateDrawing,tstep);
        });
	pdnButton.addEventListener("click", function(){
			if (theta_off>0.3){
				theta_off=theta_off-Math.PI/8;
			}
			clearInterval(id) ;
            id=setInterval(animateDrawing,tstep);
        });
	runButton.addEventListener("click", function(){
			clearInterval(id) ;
            id=setInterval(animateDrawing,tstep);
        });
    stopButton.addEventListener("click", function(){
			clearInterval(id) ;
        });

function drawPhasor(ctx,x0,y0,magn,phase,col,name, nameoffset){	
	
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

function drawDashedPhasor(ctx,x0,y0,magn,phase,col,name, nameoffset){	
	
	ctx.save();
	ctx.strokeStyle=col;
	ctx.fillStyle=col;
	ctx.translate(x0,y0);
	ctx.rotate(-phase);
	
	ctx.save();
	ctx.beginPath();
	ctx.setLineDash([5]);
	ctx.moveTo(0,0);
	ctx.lineTo(magn,0);
	ctx.stroke();
	ctx.restore();
	ctx.beginPath();
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
	
	var  real, imag;
	real=b.mag*Math.cos(b.phase)+c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)+c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}
}

	



	
