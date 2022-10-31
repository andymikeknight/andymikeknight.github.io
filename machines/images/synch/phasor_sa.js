// JavaScript Document

document.addEventListener('DOMContentLoaded',phasorsa,false);

function phasorsa() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_phasorsa" and the canvas to have an id="canvas_phasorsa" */
/*The script a simplified phasor diagram (no RA) for a standalone generator. The inputs available to the user via html buttons set the following cases:
 increase / decrease E
 increase / decrease IA
 power factor lagging / leading / unity */	

/* math for the phasor diagram variation is carried out in per-unit, and then scaled, to fit diagram within canvas window space */
	
 var cont_phas=document.getElementById("canvasholder_phasorsa");
 var myc_phas = document.getElementById("canvas_phasorsa");
	
 

 if (null===myc_phas || !myc_phas.getContext) {
 	return; 
 }

 var ctx_phas=myc_phas.getContext("2d");
 
 ctx_phas=myc_phas.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height, so aspect ratio is 2:1
 */
  
    var maxW=512; var aspect=4/3;
	var scale, winW, winH, width1, drawW, drawH, vscaling, border;
	
	
	// define some machine base case and range information
	
	var theta=-20*Math.PI/180;
	var V={mag:1,phase:0};
	var IA={mag:1,phase:theta};
	var XS=0.5;
	var IXS={mag:0.5,phase:(IA.phase+Math.PI/2)};
	var E={mag:0,phase:0};
	addPhasors(E, V,IXS);
	var Enom=E.mag;
	var deltanom = E.phase*180/Math.PI;
	
	//limit variation in IA to +- 50%; changes in per unit 0.1 steps
	var IAmin = 0.5;
	var IAmax = 1.5;
	var dIA = 0.1;
	//limit variation in E to +- 20%; changes in per unit 0.05 pu steps
	var Emin = 0.8;
	var Emax = 1.2*Enom;	
	var dE =0.05;
	// limit variation in phase angle; change in 10 degree steps,
	var Thmin = -35*Math.PI/180;
	var Thmax = +35*Math.PI/180;
	var dTh=5*Math.PI/180;

	
	
	// draw current on different scale to voltage...
	var iscale=0.5;
	var x0,y0;
	
	function initDrawing(){
		width1=cont_phas.offsetWidth;
		if (width1>maxW){
			winW=maxW;
			scale=1;
		}
		if (width1<maxW){
			scale=width1/maxW;
			winW=width1;
		}
		winH=winW/aspect;

	 // set canvas size based on containing div size (fluid resizing)		
		ctx_phas.canvas.width=winW;
		ctx_phas.canvas.height=winH;

	 // define font sizes, scaled with width. 
		ctx_phas.fillStyle="#000000";
		ctx_phas.lineWidth=2;
		ctx_phas.font="12px serif";
		ctx_phas.textAlign="left";	
		ctx_phas.font = " "+Math.round(12*scale)+"px serif";
	 
		// right 20% of canvas will be used for data output, left 80% for drawing
		//	fit digram within box 90% of window height
		drawW=winW*0.8;
		drawH=winH*0.9;
		
		
     // find maximum x, y variation, fit phasor diagram into 80% of box height bo

		vscaling=drawH*0.7;

		// draw voltage origin at 5% in from left edge, 50% vertical
		border=winW/20;
		x0=Math.round(border);
		y0=Math.round(winH*0.6);



// finished init of canvas, now init drawing

		
		doDrawing();
	}
	
	function doDrawing(){
		ctx_phas.clearRect(0,0,winW,winH);

		// plot V
		var phColor="#000000";
		drawPhasor(ctx_phas, x0, y0,vscaling*V.mag,V.phase, phColor,'V', 10);
		// draw construction lines and IX phasor (draw before current phasor overwrites construction line instead of vice-versa)
		ctx_phas.save();
		ctx_phas.strokeStyle="#FF0000";
		ctx_phas.setLineDash([5]);
		ctx_phas.beginPath();
		ctx_phas.moveTo(x0, y0);
		var nextx=vscaling*V.mag*Math.cos(IA.phase)*Math.cos(IA.phase);
		var nexty=vscaling*V.mag*Math.cos(IA.phase)*Math.sin(-IA.phase);
		ctx_phas.lineTo(x0+nextx,y0+nexty);
		ctx_phas.lineTo(x0+vscaling*V.mag,y0);
		ctx_phas.stroke();
		ctx_phas.restore();
		ctx_phas.save();
		ctx_phas.translate(x0+nextx,y0+nexty);
		ctx_phas.rotate(-IXS.phase);
		ctx_phas.lineWidth=1;
		ctx_phas.strokeStyle="rgb(100,100,100)";
		ctx_phas.strokeRect(0,0,10*scale,-10*scale);
		ctx_phas.restore();
			
		// draw IX phasor 
		phColor="#AA0000";
		drawPhasor(ctx_phas, x0+vscaling*V.mag, y0, vscaling*IXS.mag,      IXS.phase, phColor,'jIA Xs', -10);
			
		// draw angle and perpendicular reference
		ctx_phas.save();
		ctx_phas.lineWidth=1;
		ctx_phas.strokeStyle="rgb(100,100,100)";
		ctx_phas.beginPath();
		ctx_phas.moveTo(x0+vscaling*V.mag, y0);
		ctx_phas.lineTo(x0+vscaling*V.mag, y0-50*scale);
		ctx_phas.stroke();
		ctx_phas.restore();
		if (IA.phase<0){		
			labelAngle(ctx_phas,x0+vscaling*V.mag, y0,40*scale,3*Math.PI/2-IA.phase,3*Math.PI/2,'\u03B8');
		}else{
			labelAngle(ctx_phas,x0+vscaling*V.mag, y0,40*scale,3*Math.PI/2,3*Math.PI/2-IA.phase,'\u03B8');
		}	

		// if plot I and label angle
		phColor="#DD0000";
		drawPhasor(ctx_phas, x0,       y0, vscaling*IA.mag*iscale, IA.phase, phColor,'IA', -20);
		if (IA.phase<0){
			labelAngle(ctx_phas,x0, y0,40*scale,-IA.phase,0,'\u03B8');			
		}else{				
			labelAngle(ctx_phas,x0, y0,40*scale,0,-IA.phase,'\u03B8');
		}
		

		// plot E
		phColor="#0000DD";
		drawPhasor(ctx_phas, x0, y0,vscaling*E.mag,E.phase, phColor,'E', 10);
		if (E.phase<0){
			labelAngle(ctx_phas,x0, y0,50*scale,-E.phase,0,'\u03B4');			
		}else{

			labelAngle(ctx_phas,x0, y0,50*scale,0,-E.phase,'\u03B4');
		}
		// plot arc of constant excitation
		ctx_phas.save();
		ctx_phas.strokeStyle="#0000FF";
		ctx_phas.setLineDash([5]);
		ctx_phas.beginPath();
		ctx_phas.arc(x0,y0,vscaling*E.mag, 0, 3*Math.PI/2,true); 
		ctx_phas.stroke();
		ctx_phas.restore();
		
		// add text
		ctx_phas.save();
		ctx_phas.fillStyle="#0000DD";
		ctx_phas.textBaseline="top";
		ctx_phas.fillText('Dotted blue line gives locus of constant |E|',border,border);
		ctx_phas.fillStyle="#333333";
		ctx_phas.textAlign="right";
		ctx_phas.fillText('Nominal Conditions:',winW-border,border);	
		ctx_phas.textAlign="left";
		ctx_phas.fillText('V = 1.00 pu',  drawW, border*2);
		ctx_phas.fillText('E = '+Enom.toFixed(3) ,  drawW, border*3);
		ctx_phas.fillText('IA = 1.00pu',    drawW, border*4);
		ctx_phas.fillText('IA XS = 0.50 pu' ,drawW, border*5);
		ctx_phas.fillText('\u03B8 = -20 deg',drawW, border*6);
		ctx_phas.fillText('\u03B4 = '+deltanom.toFixed(1)+ 'deg',drawW, border*7);
		ctx_phas.textAlign="right";
		ctx_phas.fillStyle="#000000";
		ctx_phas.fillText('Displayed Conditions:',winW-border,8*border);	
		ctx_phas.textAlign="left";
		ctx_phas.fillText('V = '+V.mag.toFixed(3)+' pu',  drawW, border*9);
		ctx_phas.fillText('E = '+E.mag.toFixed(3)+' pu' ,  drawW, border*10);
		ctx_phas.fillText('IA = '+IA.mag.toFixed(3)+' pu' ,    drawW, border*11);
		ctx_phas.fillText('IA XS = '+IXS.mag.toFixed(3)+' pu'  ,drawW, border*12);
		ctx_phas.fillText('\u03B8 = '+(IA.phase*180/Math.PI).toFixed(1)+' deg' ,drawW, border*13);
		ctx_phas.fillText('\u03B4 = '+(E.phase*180/Math.PI).toFixed(1)+' deg' ,drawW, border*14);

		
	}
		
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);


	
	var stepUpIAButton = document.getElementById('stepUpIA');
	var stepDnIAButton = document.getElementById('stepDnIA');
	var stepUpEButton = document.getElementById('stepUpE');
	var stepDnEButton = document.getElementById('stepDnE');
	var stepLeadButton = document.getElementById('stepLead');
	var stepLagButton = document.getElementById('stepLag');
	var resetButton = document.getElementById('reset');
	
	
	
    stepUpIAButton.addEventListener("click", function(){
		IA.mag=IA.mag+dIA;
	 	if (IA.mag>IAmax){
			IA.mag=IAmax;
		}
		IXS.mag=XS*IA.mag;
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
	    doDrawing();
	});
	stepDnIAButton.addEventListener("click", function(){
		IA.mag=IA.mag-dIA;
	 	if (IA.mag<IAmin){
			IA.mag=IAmin;
		}
		IXS.mag=XS*IA.mag;
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
	    doDrawing();
	});  
	stepUpEButton.addEventListener("click", function(){
		E.mag=E.mag+dE;
	 	if (E.mag>Emax){
			E.mag=Emax;
		}
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
	    doDrawing();
	});  
	stepDnEButton.addEventListener("click", function(){
		E.mag=E.mag-dE;
	 	if (E.mag<Emin){
			E.mag=Emin;
		}
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
	    doDrawing();
	}); 
	stepLeadButton.addEventListener("click", function(){
		IA.phase=IA.phase+dTh;
	 	if (IA.phase>Thmax){
			IA.phase=Thmax;
		}
		IXS.phase=IA.phase+Math.PI/2;
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
	    doDrawing();
	});  
	stepLagButton.addEventListener("click", function(){
		IA.phase=IA.phase-dTh;
	 	if (IA.phase<Thmin){
			IA.phase=Thmin;
		}
		IXS.phase=IA.phase+Math.PI/2;
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
	    doDrawing();
	}); 
	resetButton.addEventListener("click", function(){
		theta=-20*Math.PI/180;
		IA={mag:1,phase:theta};
		IXS={mag:0.5,phase:(IA.phase+Math.PI/2)};
		E.mag=Enom;
		E.phase=Math.asin(IXS.mag/E.mag*Math.sin(Math.PI/2+IA.phase));
		subPhasors(V,E,IXS);
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
function labelAngle(ctx,x0,y0,magn,start,end,name){	
	'use strict';
	ctx.save();
	ctx.lineWeight=1;
	ctx.strokeStyle="rgb(64,64,64)";
	ctx.beginPath();
	ctx.arc(x0,y0,magn, start, end,true); 
	ctx.stroke();
	var txtposx=(magn*1.25)*Math.cos((start+end)/2);
	var txtposy=(magn*1.25)*Math.sin((start+end)/2);
	ctx.fillStyle="rgb(64,64,64)";
	ctx.textBaseline="middle";
	ctx.textAlign="center";
	ctx.fillText(name,x0+txtposx,y0+txtposy);
	ctx.restore();
}	

function addPhasors(a,b,c){
	'use strict';
	var  real, imag;
	real=b.mag*Math.cos(b.phase)+c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)+c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}
function subPhasors(a,b,c){
	'use strict';
	var real, imag;
	real=b.mag*Math.cos(b.phase)-c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)-c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}

	
