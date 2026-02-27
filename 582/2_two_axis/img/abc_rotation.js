// JavaScript Document
document.addEventListener('DOMContentLoaded',drawacrot,false);
window.addEventListener('resize',drawacrot,false);


function drawacrot() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_ac_gen" and the canvas to have an id="canvas_ac_gen" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	

	var cont_acr=document.getElementById("canvasholder_abc_rot");
	var myc_acr = document.getElementById("canvas_abc_rot");

	if (null===myc_acr || !myc_acr.getContext) {
	return; 
 	}

 	var ctx_acr=myc_acr.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 2 sections of equal wifth
 */
  
    var maxW=750; 
	var aspect=0.5;
	var scale, winW, winH, width1, boxsize;
	
 // define font sizes, scaled with width.
 	scale=1.0; 
 	ctx_acr.fillStyle="#000000";
	ctx_acr.font="italic Times New Roman 30px serif";
 	ctx_acr.textAlign="left";	
 	ctx_acr.font = "italic Times New Roman', "+Math.round(30*scale)+"px serif";
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing
	var ncoils=3;
	var coil_pitch=Math.PI/ncoils;
	var th0=0;

	// have to hard code coil colors for specific cases?
	
	var omegat=0;
	var frameNo=0;
	var maxsteps=180;
	var tstep=50;
	var shift;
	var id;
	var boxsize;
    var midxy;
	var margin;
    var max_ampl;
    var dx;
	var th0=Math.PI/2;
	var dtheta=2*Math.PI/maxsteps;


	var phasedata ;	
    phasedata= [];
    // plot vectors as red black blue
	phasedata.push({r:255,g:0,  b:0    ,th:0,           label:'a', new:1,    old:1});
	phasedata.push({r:10, g:10, b:10   ,th:2*Math.PI/3, label:'b', new:-0.5, old:-0.5});
	phasedata.push({r:0,  g:0,  b:255  ,th:4*Math.PI/3, label:'c', new:-0.5, old:-0.5});


	function init_drawing(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_acr.offsetWidth;
		clearInterval(id) ;
		if (width1>maxW){
			winW=maxW;
			scale=1;
		}
		if (width1<maxW){
			scale=width1/maxW;
			winW=width1;
		}
		winH=winW*aspect;
	 // set canvas size based on containing div size (fluid resizing)		
		ctx_acr.canvas.width=winW;
		ctx_acr.canvas.height=winH;
			
		ctx_acr.fillStyle="#000000";
		ctx_acr.font="italic Times New Roman 30px serif";
 		ctx_acr.textAlign="left";	
 		ctx_acr.font = "italic Times New Roman', "+Math.round(30*scale)+"px serif";
		
		/* canvas is divided into two equal sized boxes */
	    boxsize=winW/2;
        midxy=Math.round(boxsize/2.0);
        margin=Math.round(boxsize/50.0);
        max_ampl=midxy-margin;
        dx=(boxsize-2*margin)/maxsteps;
		
	// init drawing 
		
		shift=Math.round(boxsize/4);
		/* only need to draw stator on init...*/
		
		plotstator(ctx_acr, 0, 0, boxsize, ncoils, phasedata);
		do_drawing();
	}
	
	function animate_drawing(){
		/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=0;
		}
		omegat=frameNo*dtheta
		do_drawing();
		// all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
	}
	
	function do_drawing(){
		/* call the functions that draw the components of the animation*/
		 for (var i=0;i<3;i++){
			phasedata[i].new=Math.cos(-phasedata[i].th+omegat);
			phasedata[i].old=Math.cos(-phasedata[i].th+omegat-dtheta);
		 }
		if (frameNo===0){
			// replot the current - time axis
			plotaxes(ctx_acr, boxsize, 0, boxsize, midxy, margin, max_ampl,'Time','Current');
		}
		// draw over the mmf vectors
		plotblankrotor(ctx_acr, 0, 0, boxsize);
		// plot new mmf vectors
		plotmmfarrow(ctx_acr, 0, 0, boxsize, omegat, phasedata);
		// plot current
		plotcurrent(ctx_acr, boxsize, 0, midxy, margin, frameNo, max_ampl, dx, phasedata);
	}
	
	
	init_drawing();
    window.addEventListener('resize',init_drawing,false);
	var runButton = document.getElementById('runAnim');
	var stopButton = document.getElementById('stopAnim');
	var stepButton = document.getElementById('stepAnim');


	runButton.addEventListener("click", function(){
			clearInterval(id) ;
            id=setInterval(animate_drawing,tstep);
        });
    stopButton.addEventListener("click", function(){
			clearInterval(id) ;
        });
	stepButton.addEventListener("click", function(){
			clearInterval(id) ;
		  	frameNo++;
			if (frameNo===maxsteps){
				frameNo=0;
			}
			omegat=frameNo*dtheta;
			do_drawing();
        });     
 

	function plotstator(ctx, x0,y0, width, nc, cdata){
		'use strict';
		var stat_od, stat_id, origin;
	//	ctx.clearRect(x0,y0,width,width);
		/*move canvas origin to centre of box.*/
		
			
		
		ctx.save();
		ctx.translate(x0,y0);
		origin=Math.round(width/2); 
		ctx.translate(origin,origin); 
			
		
		stat_od=Math.round(0.95*width); 
		stat_id=Math.round(0.7*width);
		var stat_midr=Math.round((stat_od+stat_id)/4);
		var maxcoilsides=18;
		var circum, slotpitch, coilheight, theta_m;	
		circum=Math.PI*stat_id; 
		slotpitch=Math.round(circum/maxcoilsides);	
		coilheight=Math.round(slotpitch/2);
	// draw stator as solid circle.
		ctx.lineWidth=Math.round(0.125*width);
		ctx.strokeStyle="#5e80a5";
		ctx.beginPath(); 
		ctx.arc(0,0,stat_midr, 0, 2*Math.PI,true); 
		ctx.stroke();	
				
		
	
	// draw coils and whitedots / crosses for positve and negative coil side
		ctx.lineWidth=2;
		var crad=coilheight/2;
		var slotCentreRad = stat_id/2+crad;
		var scx;
		var scy;
		var theta_m;
		

		var xh=crad/2;

			
		for (var i=0;i<nc;i++){ 

			theta_m=-Math.PI/2-cdata[i].th;

			scx=slotCentreRad*Math.cos(theta_m);
			scy=slotCentreRad*Math.sin(theta_m);


			// positive coil side
			ctx.strokeStyle="#FFFFFF";
			ctx.fillStyle="rgb("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +")";
			ctx.beginPath(); 
			ctx.arc(scx, scy,crad, 0,2*Math.PI,true); 
			ctx.stroke(); 
			ctx.fill();	
			// white dot
			ctx.fillStyle="#FFFFFF";
			ctx.beginPath(); 
			ctx.arc(scx, scy, 2, 0,2*Math.PI,true); 
			ctx.fill();
			
			// negative coil side
			ctx.fillStyle="rgb("+Math.round(0.8*cdata[i].r)+","+Math.round(0.8*cdata[i].g)+","+Math.round(0.8*cdata[i].b)+")";
			ctx.beginPath(); 
			ctx.arc(-scx,-scy,crad,0,2*Math.PI,true); 
			ctx.stroke(); 
			ctx.fill();
			// white X
			ctx.beginPath();	
			ctx.moveTo(-scx-xh,-scy-xh);
			ctx.lineTo(-scx+xh,-scy+xh);
			ctx.moveTo(-scx-xh,-scy+xh);
			ctx.lineTo(-scx+xh,-scy-xh);
			ctx.stroke(); 

		}
		/* reset canvas origin*/
		ctx.restore();
	}

	function plotblankrotor(ctx, x0,y0, width){
		'use strict';
		var rotr_od=Math.round(0.65*width);
		var origin=Math.round(width/2);
	// draw gray circle 	
		ctx.save();
		ctx.translate(x0,y0); 
		ctx.translate(origin,origin); 
		ctx.strokeStyle="#ffffff"; ctx.fillStyle="#5e80a5";	
		ctx.beginPath(); 
		ctx.arc(0,0,rotr_od/2,0,2*Math.PI,true); 
		ctx.stroke(); 
		ctx.fill();
		ctx.restore();
	}

	function plotmmfarrow(ctx, x0,y0, width, theta_e, cdata) {
		'use strict';

		var rotr_od=Math.round(0.65*width);
		var origin=Math.round(width/2);
		var magn;
		ctx.save();
		ctx.translate(x0,y0);
		ctx.translate(origin,origin);
		ctx.lineWidth=3;
		ctx.strokeStyle="#999999";
			// draw sum total mmf
		ctx.save();
		magn=Math.round(0.45*rotr_od);
		ctx.rotate(-theta_e);
		var col="#02cf02"
		ctx.fillStyle=col;
		ctx.strokeStyle=col;
		drawarrow(ctx,magn);
		ctx.restore();

		for (let ph = 0; ph < 3; ph++) {
			// draw phase mmf
			ctx.save();
			magn=0.3*rotr_od*cdata[ph].new
			ctx.rotate(-cdata[ph].th); // need to rotate negative, am moving canvas relative to phase
			if (magn<0){
				magn=-magn;
				ctx.rotate(Math.PI);
			}
			ctx.strokeStyle="rgb("+ Math.round(cdata[ph].r) +","+ Math.round(cdata[ph].g) +","+ Math.round(cdata[ph].b) +")";
			drawarrow(ctx,magn);
			ctx.restore();
		}
		ctx.restore();
	}

	function plotaxes(ctx, x0,y0, wi, mid, marg, ampl,xlabel,ylabel){
		'use strict';
	// vetical axis is on left margin of a box
		ctx.save();
		ctx.translate(x0,y0);
		ctx.clearRect(0,0,wi,wi);
		ctx.strokeStyle="#777";
		ctx.lineWidth=2
	// draw x-axis
		var xwidth=wi-2*marg
		ctx.translate(marg,mid) ;
		drawarrow(ctx,xwidth);
		ctx.fillText(xlabel,xwidth-20,10);
		ctx.translate(-marg,-mid) ;
	// draw y-axis
		ctx.translate(marg,wi-marg);
	// rotate by 90 degrees then draw an arrow (always draws arrows horizontally), then rotate back
		ctx.rotate(-Math.PI/2)
		drawarrow(ctx,2*ampl);
		ctx.fillText(ylabel,2*ampl-30,10);
		ctx.rotate(Math.PI/2)
		ctx.restore();
	}
	function drawarrow(ctx,magn){
		ctx.beginPath(); 
		ctx.moveTo(0,0);
		ctx.lineTo(magn,0); 
		ctx.lineTo(magn-4,0-4); 
		ctx.lineTo(magn-4,0+4); 
		ctx.lineTo(magn,0); 
		ctx.stroke();
	}
	function plotcurrent(ctx, x0,y0, mid, marg, fn, ampl, dx, pdata){
		'use strict';
		//move canvas origin to 0,0 on axes

		ctx.save();
		ctx.translate(x0,y0);
		ctx.translate(marg,mid)

		var x=fn*dx;
		var x_1;
		var x_0;

		x_1=x;
		x_0=x-dx;

		var y_0;
		var y_1;

		for (var j=0;j<3;j++){

			y_0=-ampl * pdata[j].old;
			y_1=-ampl * pdata[j].new;
	
			ctx.strokeStyle="rgb("+ pdata[j].r +","+ pdata[j].g +","+ pdata[j].b +")";
			ctx.beginPath();
			ctx.moveTo(x_0,y_0);
			ctx.lineTo(x_1,y_1);
			ctx.stroke();
		} 
		ctx.restore();
	}
}
