// JavaScript Document

document.addEventListener('DOMContentLoaded',phasorex,false);

function phasorex() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_armr" and the canvas to have an id="canvas_armr" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. Depending on the the simulation button pressed by the user, the simulation plots the open circuit induced voltage, lagging current and resulting net field and voltage, to illustrate the effect of armature reaction. */	

 var cont_phex=document.getElementById("canvasholder_phasorex");
 var myc_phex = document.getElementById("canvas_phasorex");
	
 

 if (null===myc_phex || !myc_phex.getContext) {
 	return; 
 }

 var ctx_phex=myc_phex.getContext("2d");
 
 ctx_phex=myc_phex.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height, so aspect ratio is 2:1
 */
  
    var maxW=512; var aspect=2;
	var scale, winW, winH, width1, drawW, drawH, vscaling;
	
	
	// define some drawing related variable outside drawing fn that is called repeatedly

	var step=1;
	var theta=-25.842*Math.PI/180;
	var V={mag:346.4,phase:0};
	var IA={mag:529.2,phase:theta};
	var delta=23.475*Math.PI/180;
	var E={mag:478,phase:delta};
	var XS=0.4;
	var IXS={mag:(IA.mag*XS),phase:(IA.phase+Math.PI/2)};
	
	var xmax=Math.max(V.mag, E.mag*Math.cos(E.phase));
	var ymax=E.mag*Math.sin(E.phase);
	var ymin=V.mag*Math.cos(IA.phase)*Math.sin(IA.phase);
	
	
	// draw current on different scale to voltage...
	var iscale=0.5*V.mag/IA.mag;
	var x0,y0;
	
	function initDrawing(){
		width1=cont_phex.offsetWidth;
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
		ctx_phex.canvas.width=winW;
		ctx_phex.canvas.height=winH;

	 // define font sizes, scaled with width. 
		ctx_phex.fillStyle="#000000";
		ctx_phex.lineWidth=2;
		ctx_phex.font="12px serif";
		ctx_phex.textAlign="left";	
		ctx_phex.font = " "+Math.round(12*scale)+"px serif";
	 
		// right 20% of canvas will be used for data output, left 80% for drawing
		//	fit digram within box 90% of window height
		drawW=winW*0.8;
		drawH=winH*0.9;
		
		
     // find maximum x, y variation, fit phasor diagram into 80% of box height bo

		
		
		if(ymin<0){
			vscaling=Math.min(drawW/xmax, drawH/2/ymax, -drawH/2/ymin);
		}else{
			vscaling=Math.min(drawW/xmax, drawH/2/ymax);
		}
		// start x such that diagram is centered in canvas
		x0=Math.round((winW-vscaling*xmax)/2);
		y0=Math.round(winH/2);



// finished init of canvas, now init drawing

		
		doDrawing();
	}
	
	function doDrawing(){
		ctx_phex.clearRect(0,0,winW,winH);
		// always plot V
		var phColor="#000000";
		drawPhasor(ctx_phex, x0, y0,vscaling*V.mag,V.phase, phColor,'V', 10);
		if (step>2){
			// draw construction lines and IX phasor (draw before current phasor overwrites construction line instead of vice-versa)

			ctx_phex.save();
			ctx_phex.strokeStyle="#FF0000";
			ctx_phex.setLineDash([5]);
			ctx_phex.beginPath();
			ctx_phex.moveTo(x0, y0);
			var nextx=vscaling*V.mag*Math.cos(IA.phase)*Math.cos(IA.phase);
			var nexty=vscaling*V.mag*Math.cos(IA.phase)*Math.sin(-IA.phase);
			ctx_phex.lineTo(x0+nextx,y0+nexty);
			ctx_phex.lineTo(x0+vscaling*V.mag,y0);
			ctx_phex.stroke();
			ctx_phex.restore();
			ctx_phex.save();
			ctx_phex.translate(x0+nextx,y0+nexty);
			ctx_phex.rotate(-IXS.phase);
			ctx_phex.lineWidth=1;
			ctx_phex.strokeStyle="rgb(100,100,100)";
			ctx_phex.strokeRect(0,0,10*scale,-10*scale);
			ctx_phex.restore();
			
			// draw phasors
			phColor="#AA0000";
			drawPhasor(ctx_phex, x0+vscaling*V.mag, y0, vscaling*IXS.mag,      IXS.phase, phColor,'jIA Xs', -10);
			
			// draw angle and perpendicular reference
			ctx_phex.save();
			ctx_phex.lineWidth=1;
			ctx_phex.strokeStyle="rgb(100,100,100)";
			ctx_phex.beginPath();
			ctx_phex.moveTo(x0+vscaling*V.mag, y0);
			ctx_phex.lineTo(x0+vscaling*V.mag, y0-50*scale);
			ctx_phex.stroke();
			ctx_phex.restore();
			if (IA.phase<0){		
				labelAngle(ctx_phex,x0+vscaling*V.mag, y0,40*scale,3*Math.PI/2-IA.phase,3*Math.PI/2,'\u03B8');
			}else{
				labelAngle(ctx_phex,x0+vscaling*V.mag, y0,40*scale,3*Math.PI/2,3*Math.PI/2-IA.phase,'\u03B8');
			}	

		}		
		if(step!==1){
			// if step 2 or above, plot I and label angle
			phColor="#DD0000";
			drawPhasor(ctx_phex, x0,       y0, vscaling*IA.mag*iscale, IA.phase, phColor,'IA', -20);
			if (IA.phase<0){
				labelAngle(ctx_phex,x0, y0,40*scale,-IA.phase,0,'\u03B8');			
			}else{				
				labelAngle(ctx_phex,x0, y0,40*scale,0,-IA.phase,'\u03B8');
			}
		}

		if (step===4){
		//if step 3  plot E
			phColor="#0000DD";
			drawPhasor(ctx_phex, x0, y0,vscaling*E.mag,E.phase, phColor,'E', 10);
			if (E.phase<0){
				labelAngle(ctx_phex,x0, y0,50*scale,-E.phase,0,'\u03B4');			
			}else{

				labelAngle(ctx_phex,x0, y0,50*scale,0,-E.phase,'\u03B4');
			}
		// add text, depending on position of E.
			ctx_phex.save();
			ctx_phex.textAlign="right";
			ctx_phex.fillText('V'   ,  drawW-4, y0+10*scale);
			ctx_phex.fillText('E'   ,  drawW-4, y0+30*scale);
			ctx_phex.fillText('IA',    drawW-4, y0+50*scale);
			ctx_phex.fillText('IA XS' ,drawW-4, y0+70*scale);
			ctx_phex.fillText('\u03B8',drawW-4, y0+90*scale);
			ctx_phex.fillText('\u03B4',drawW-4, y0+110*scale);
						ctx_phex.textAlign="left";
			ctx_phex.fillText(V.mag.toFixed(1)+'V'                   , drawW, y0+10*scale);
			ctx_phex.fillText(E.mag.toFixed(1)+'V'                   , drawW, y0+30*scale);
			ctx_phex.fillText(IA.mag.toFixed(1)+'A'                  , drawW, y0+50*scale);
			ctx_phex.fillText(IXS.mag.toFixed(1)+'V'                 , drawW, y0+70*scale);
			ctx_phex.fillText((IA.phase*180/Math.PI).toFixed(1)+'deg', drawW, y0+90*scale);
			ctx_phex.fillText((E.phase *180/Math.PI).toFixed(1)+'deg', drawW, y0+110*scale);
			ctx_phex.restore();
		}
	}
		
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);


	
	var step1Button = document.getElementById('Step1');
	var step2Button = document.getElementById('Step2');
	var step3Button = document.getElementById('Step3');
	var step4Button = document.getElementById('Step4');

    step1Button.addEventListener("click", function(){
	  step=1;
	  initDrawing();
	});
	step2Button.addEventListener("click", function(){
		step=2;
		doDrawing();
	});  
	step3Button.addEventListener("click", function(){
		step=3;
		doDrawing();
	});  
	step4Button.addEventListener("click", function(){
		step=4;
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

	
