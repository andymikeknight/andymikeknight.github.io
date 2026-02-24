// JavaScript Document

	
document.addEventListener('DOMContentLoaded',pwmplot,false);
function pwmplot(){
  		'use strict';


	/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_shunt" and the canvas to have an id="canvas_shunt" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	
	//the rest of the function


	var cont_pwm = document.getElementById("canvasholder_pwm");
	var myc_pwm = document.getElementById("canvas_pwm");
 	if (null===myc_pwm || !myc_pwm.getContext) {
 		return; 
 	}
 	var ctx_pwm=myc_pwm.getContext("2d");	
	
	
	/* find the width of the cont_sh that holds the canvas. This is needed to re-size the canvas for different page sizes 
	*/
	
 	var contW=cont_pwm.offsetWidth;

 	/*define some basic size information required for drawings. Max canvas width is set to 460px and aspect ratio is 1
 	*/
  	
    var maxW=460; var aspect=1;
	var scale, canW, canH;

	ctx_pwm.fillStyle="#000000";
	ctx_pwm.font="12px sans-serif";
 	ctx_pwm.textAlign="left";	
 	ctx_pwm.font = " "+Math.round(12*scale)+"px sans-serif";
 

// finished init of canvas, now init drawing
	
	/* Define Armature Cicruit Parameters and calculate nominal plot data*/
	var ma=0.8;
	var f=1;
	var fc=11;
	
	
	
	var fmin = 0.8;
	var fmax = 4;
	var fcmin = 11;
	var fcmax = 88;
	var mamax=1;
	var mamin=0;
	var border, spacing, axesH, axesW;
	// initial data

	
	function initDrawing(){
	
		contW=cont_pwm.offsetWidth;
		if (contW>maxW){
			canW=maxW;
			scale=1;
		}
		if (contW<maxW){
			scale=contW/maxW;
			canW=contW;
		}
		canH=canW*aspect;

	 // set canvas size based on containing element size (fluid resizing)		
		ctx_pwm.canvas.width=canW;
		ctx_pwm.canvas.height=canH;

		/* define axes heights and widths*/
		border=0.05*canW;
		spacing=0.02*canH;
		axesH=0.15*canH;
		axesW=0.9*canW;

		drawMain();
	}
	
	

	/* the canvas is re-drawn by the mousehandler events which calls drawRangeConrol*/
	/* if the page is re-sized, this entire routine is called again by the html page. */
    initDrawing();
	window.addEventListener('resize',initDrawing,false);

	var stepUpma = document.getElementById('stepUpma');
	var stepDnma = document.getElementById('stepDnma');
	var stepUpf = document.getElementById('stepUpf');
	var stepDnf = document.getElementById('stepDnf');
	var stepUpfc = document.getElementById('stepUpfc');
	var stepDnfc = document.getElementById('stepDnfc');
	stepUpma.addEventListener("click", function(){
			
			ma=ma+0.1;			
			if (ma>mamax){
				ma=mamax;
			}
		 	initDrawing();
        });  
	stepDnma.addEventListener("click", function(){

			ma=ma-0.1;			
			if (ma<mamin){
				ma=mamin;
			}
		 	initDrawing();
        }); 
	stepUpf.addEventListener("click", function(){
			
			f=f+0.3;			
			if (f>fmax){
				f=fmax;
			}
			if (fc<11*f){
				fc=11*f;
			}
		 	initDrawing();
        });  
	stepDnf.addEventListener("click", function(){

			f=f-0.1;			
			if (f<fmin){
				f=fmin;
			}
		 	initDrawing();
        }); 
	stepUpfc.addEventListener("click", function(){
			
			fc=fc+5;			
			if (fc>fcmax){
				fc=fcmax;
			}

		 	initDrawing();
        });  
	stepDnfc.addEventListener("click", function(){

			fc=fc-5;			
			if (fc<fcmin){
				fc=fcmin;
			}
			if (fc<11*f){
				fc=11*f;
			}
		 	initDrawing();
        });
	
	function drawMain(){

		
		/* plot axes, and label them*/
		plotaxes(ctx_pwm,border,spacing+axesH,axesW,axesH,"Time","Pu V");
		plotaxes(ctx_pwm,border,3*(spacing+axesH),axesW,axesH,"Time","A out");
		plotaxes(ctx_pwm,border,4*(spacing+axesH),axesW,axesH,"Time","B out");
		plotaxes(ctx_pwm,border,5*(spacing+axesH),axesW,axesH,"Time","LL out");
		
		/*plot PWM on first axis*/
		ctx_pwm.strokeStyle="#FF0000";
		drawcarrier(ctx_pwm,border,spacing+axesH,axesW,axesH,fc);
		/*plot phase A on first axis*/
		ctx_pwm.strokeStyle="#000000";
		drawcos(ctx_pwm,border,spacing+axesH,axesW,axesH*ma,f,0)
		/*plot phase B on first axis*/;
		ctx_pwm.strokeStyle="#0000FF";
		drawcos(ctx_pwm,border,spacing+axesH,axesW,axesH*ma,f,-Math.PI*2/3)	;	
		
		/*plot PWM A on second axis*/ 
		ctx_pwm.strokeStyle="#000000";
		drawPWM_LN(ctx_pwm,border,3*(spacing+axesH),axesW,axesH,fc,ma,f,0);
		
		/*plot PWM B on tird axis*/ 
		ctx_pwm.strokeStyle="#0000FF";
		drawPWM_LN(ctx_pwm,border,4*(spacing+axesH),axesW,axesH,fc,ma,f,-Math.PI*2/3);
		
		/*plot PWM line-line on 4th axis*/ 
		ctx_pwm.strokeStyle="#006600";
		drawPWM_LL(ctx_pwm,border,5*(spacing+axesH),axesW,axesH,fc,ma,f,0,-Math.PI*2/3)		;
		

		
		
			
		
	}
		  


}


function plotaxes(ctx, x1,y1,dw,dh,xlabel,ylabel){
	'use strict';
	ctx.strokeStyle = "rgb(64,64,64)"; 
	ctx.beginPath(); ctx.moveTo(x1,y1-dh); ctx.lineTo(x1,y1+dh);
	ctx.moveTo(x1,y1); ctx.lineTo(x1+dw,y1); ctx.stroke();
	ctx.textAlign="right";ctx.fillText(xlabel,x1+dw,y1+10);
	ctx.save();ctx.translate(x1,y1-dh); ctx.rotate(-Math.PI/2);
	ctx.textAlign="right"; ctx.fillText(ylabel,0,-5); ctx.restore();
}

function drawcos(ctx,xs,ys,dw,mag,freq,phase){
	'use strict';	
	var m=mag*Math.cos(phase);
	var period=Math.round(dw/freq);
	ctx.beginPath(); 
	ctx.moveTo(xs,ys-m);
	var x=0;
	while (x<dw){ 
		x++; 
		m=mag*Math.cos(2*Math.PI*x/period+phase);
		ctx.lineTo(xs+x,ys-m);
	}
	ctx.stroke();
}

function drawcarrier(ctx,xs,ys,dw,dh,fc){
	'use strict';	
	var cperiod=Math.round(dw/fc);
	var c1=Math.round(cperiod*0.25);
	var c2=Math.round(cperiod*0.5);
	var c3=Math.round(cperiod*0.75);
	var dx, mc;
	ctx.beginPath(); 
	ctx.moveTo(xs,ys);
	var x=0;
	while (x<dw){
		x++;
		dx=x-Math.floor(x/cperiod)*cperiod;
		if (dx<c1){
			mc=dx/c1;
		}else if (dx<c3){
			mc=1-2*(dx-c1)/(c2);
		}else{
			mc=-1+(dx-c3)/c1;
		}

		ctx.lineTo(xs+x,ys-mc*dh);					   
	}
	ctx.stroke();
}

function drawPWM_LN(ctx,xs,ys,dw,dh,fc,ma,freq,phase){
	'use strict';
	var cperiod=Math.round(dw/fc);
	var c1=Math.round(cperiod*0.25);
	var c2=Math.round(cperiod*0.5);
	var c3=Math.round(cperiod*0.75);
	var mperiod=Math.round(dw/freq);
	var mc;
	var m=ma*Math.cos(phase);
	var m0;
	var dx;
	if (m>0){
		m0=0;
	}else{
		m0=dh;
	}
	ctx.beginPath(); 
	ctx.moveTo(xs,ys-m0);
	var x=0;
	while (x<dw){
		x++;
		m=ma*Math.cos(2*Math.PI*x/mperiod+phase);
		dx=x-Math.floor(x/cperiod)*cperiod;
		if (dx<c1){
			mc=dx/c1;
		}else if (dx<c3){
			mc=1-2*(dx-c1)/(c2);
		}else{
			mc=-1+(dx-c3)/c1;
		}
		if (mc>m){
			ctx.lineTo(xs+x,ys-m0);
			ctx.lineTo(xs+x,ys);
			m0=0;
		} else{
			ctx.lineTo(xs+x,ys-m0);
			ctx.lineTo(xs+x,ys-dh);
			m0=dh;
		}
					   
	}
	ctx.stroke();
}
function drawPWM_LL(ctx,xs,ys,dw,dh,fc,ma,freq,ph1,ph2){
	'use strict';	
	var cperiod=Math.round(dw/fc);
	var c1=Math.round(cperiod*0.25);
	var c2=Math.round(cperiod*0.5);
	var c3=Math.round(cperiod*0.75);
	var mperiod=Math.round(dw/freq);
	var mc;
	var m1=ma*Math.cos(ph1);
	var m2=ma*Math.cos(ph2);
	var m0, pwm1, pwm2, dx;

	ctx.beginPath(); 
	ctx.moveTo(xs,ys);
	var x=0;
	m1=ma*Math.cos(ph1);
	if (m1>0){
		m0=dh;
	}else{
		m0=0;
	}
	while (x<dw){
		x++;
		m1=ma*Math.cos(2*Math.PI*x/mperiod+ph1);
		m2=ma*Math.cos(2*Math.PI*x/mperiod+ph2);
		dx=x-Math.floor(x/cperiod)*cperiod;
		if (dx<c1){
			mc=dx/c1;
		}else if (dx<c3){
			mc=1-2*(dx-c1)/(c2);
		}else{
			mc=-1+(dx-c3)/c1;
		}
		if (mc>m1){
			pwm1=0;
		} else{
			pwm1=1;
		}
		if (mc>m2){
			pwm2=0;
		} else{
			pwm2=1;
		}
		ctx.lineTo(xs+x,ys-m0);	
		m0=dh*(pwm1-pwm2);
		ctx.lineTo(xs+x,ys-m0);						   
	}
	ctx.stroke();
}	
