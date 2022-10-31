// JavaScript Document

document.addEventListener('DOMContentLoaded',drawtrqexc,false);
document.addEventListener('DOMContentLoaded',drawtrqrel,false);

function drawtrqexc() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_ac_gen" and the canvas to have an id="canvas_ac_gen" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	

	var cont_tqe=document.getElementById("canvasholder_ac_trq-exc");
	var myc_tqe = document.getElementById("canvas_ac_trq-exc");

	if (null===myc_tqe || !myc_tqe.getContext) {
	return; 
 	}

 	var ctx_tqe=myc_tqe.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 
 There are three squares sections each wwith width & height equal to 1/3 of the total canvas width
 */
  
    var maxW=750; 
	var aspect=0.5;
	var scale, winW, winH, width1, boxsize;
	
 // define font sizes, scaled with width. 
 	ctx_tqe.fillStyle="#000000";
	ctx_tqe.font="14px sans-serif";
 	ctx_tqe.textAlign="left";	
 	ctx_tqe.font = " "+Math.round(14*scale)+"px sans-serif";
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing


	// have to hard code coil colors for specific cases?
	var theta_R=0;
	var frameNo=0;
	var maxsteps=72;
	
	
	function init_drawing(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_tqe.offsetWidth;
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
		ctx_tqe.canvas.width=winW;
		ctx_tqe.canvas.height=winH;	
		
		/* canvas is divided into two equal sized boxes */
	    boxsize=winW/2;

		
	// init drawing 
		trqaxes(ctx_tqe, boxsize, boxsize/4, boxsize);
		update_drawing();
	}
	

	
	function update_drawing(){
		/* call the functions that draw the components of the animation*/
		plotstat_rot(ctx_tqe, 0, 0, boxsize, theta_R);
		plotBSR(ctx_tqe, boxsize, 0, boxsize, theta_R);
		plottrq(ctx_tqe, boxsize, boxsize/4, boxsize, theta_R);
		
	}
	
	
	init_drawing();
	window.addEventListener('resize',init_drawing,false);

	var stepUpButton = document.getElementById('stepUpAnim');
	var stepDnButton = document.getElementById('stepDnAnim');

	stepUpButton.addEventListener("click", function(){

		  	frameNo++;
			if (frameNo===maxsteps+1){
				frameNo=1;
			}
			theta_R=(frameNo-1)*2*Math.PI/maxsteps;
			update_drawing();
        });  
	stepDnButton.addEventListener("click", function(){

		  	frameNo--;
			if (frameNo===0){
				frameNo=maxsteps;
			}
			theta_R=(frameNo-1)*2*Math.PI/maxsteps;
			update_drawing();
        }); 
	
		function plotstat_rot(ctx, x0,y0, width, th){
			
			var stat_or, stat_ir, origin, rotr_or;
			ctx.clearRect(x0,y0,width,width);
			/*move canvas origin to centre of box.*/
			ctx.save();
				ctx.translate(x0,y0);
				origin=Math.round(width/2); 
				ctx.translate(origin,origin); 


				stat_or=Math.round(0.45*width); 
				stat_ir=Math.round(0.35*width);
				rotr_or=Math.round(0.325*width);
				var stat_midr=Math.round((stat_or+stat_ir)/2);
			// draw stator as solid circle.
				ctx.lineWidth=Math.round(stat_or-stat_ir);
				ctx.strokeStyle="rgba(180,230,230,1.0)";
				ctx.beginPath(); 
				ctx.arc(0,0,stat_midr, 0, 2*Math.PI,true); 
				ctx.stroke();
			ctx.restore();
			/* reset canvas*/

		// draw red half red, half blue for N/S poles 	
			ctx.save();
				ctx.translate(x0,y0);
				ctx.translate(origin,origin);
				ctx.save();
					ctx.rotate(-th+Math.PI/2);
					// red North pole

					ctx.strokeStyle="rgba(127,0,0,0.75)";
					ctx.fillStyle="rgba(250,0,0,0.75)";
					ctx.beginPath(); 
					ctx.arc(0,0,rotr_or,0,Math.PI,true); 
					ctx.stroke();
					ctx.fill();

					// blue South pole

					ctx.strokeStyle="rgba(0,0,127,0.75)";
					ctx.fillStyle="rgba(0,0,250,0.75)";
					ctx.beginPath(); 
					ctx.arc(0,0,rotr_or,Math.PI,2*Math.PI,true); 
					ctx.stroke();
					ctx.fill();


					// undo rotation
				ctx.restore();


				ctx.save();
					ctx.rotate(-th);	
					ctx.stokestyle="#666666";
					ctx.beginPath(); 
					ctx.setLineDash([10,4,4,4]);
					ctx.moveTo(0,0);
					ctx.lineTo(rotr_or,0);
					ctx.stroke();
				ctx.restore();


				ctx.beginPath();
				ctx.setLineDash([10,4,4,4]);
				ctx.moveTo(0,0);	
				ctx.lineTo(Math.round(stat_or),0);
				ctx.stroke();

				ctx.fillStyle="#666666";
				ctx.textAlign='right';
				ctx.textBaseline='Top';
				var th_deg=th*180/Math.PI;
				ctx.fillText('Theta R',width/4-5,-0.45*width);
				ctx.textAlign='left';
				ctx.fillText(th_deg.toFixed(1),width/4+5,-0.45*width);
			ctx.restore();

		}

		function plotBSR(ctx,x0,y0,width, th){
			
			var x1, y1, dh, dw;
			ctx.save();
			ctx.translate(x0,y0);
			ctx.clearRect(0,0,width, width/2);
			y1=Math.round(0.25*width);
			x1=Math.round(0.05*width);
			dh=Math.round(0.2*width);
			dw=Math.round(0.9*width);
			// plotting axes 
			plotaxes(ctx,x1,y1,dw,dh,"Theta","Flux Density");

			ctx.textAlign='left';
			ctx.textBaseline='bottom';

			ctx.strokeStyle="#FF0000";
			drawcos(ctx,x1,y1,dw,dw,dh/2,0);
			ctx.fillStyle="#FF0000";
			ctx.fillText('BS',2*x1,0.45*width);

			ctx.strokeStyle="#000000";
			ctx.fillStyle="#000000";
			ctx.fillText('BR',4*x1,0.45*width);
			drawcos(ctx,x1,y1,dw,dw,dh/2,-th);	

			ctx.strokeStyle="#0000FF";
			ctx.fillStyle="#0000FF";
			ctx.fillText('Bnet',6*x1,0.45*width);
			ctx.beginPath(); 
			ctx.moveTo(x1,y1-m);
			var x=0;
			var ths=2*Math.PI*x/dw;
			var m1=Math.cos(ths);
			var m2=Math.cos(ths-th);
			var m=Math.round(dh/2*(m1+m2));
			var m0=m;
			ctx.moveTo(x1,y1-m);
			while (x<dw-5){ 
				x=x+5; 
				ths=2*Math.PI*x/dw;
				m1=Math.cos(ths);
				m2=Math.cos(ths+th);
				m=Math.round(dh/2*(m1+m2));
				ctx.lineTo(x1+x,y1-m);
			}
			ctx.lineTo(x1+dw,y1-m0);
			ctx.stroke();

			ctx.restore();


		}

		function trqaxes(ctx,x0,y0,width){
		

			ctx.strokeStyle = "#303030" ;
			var xmid=width/2;
			var ymid=width/2;
			var dw=width*0.45;
			var dh=dw/2;
			// draw centered axes this time

			ctx.save();
			ctx.translate(x0,y0);
			ctx.beginPath(); ctx.moveTo(xmid,ymid-dh); ctx.lineTo(xmid,ymid+dh);
			ctx.moveTo(xmid-dw,ymid); ctx.lineTo(xmid+dw,ymid); ctx.stroke();
			ctx.textAlign="right";ctx.fillText('Theta R',xmid+dw,ymid+10);
			ctx.save();
			ctx.translate(xmid,ymid-dh); ctx.rotate(-Math.PI/2); ctx.textAlign="right"; ctx.fillText('Normalized Torque',0,-5); 
			ctx.restore();
			ctx.restore();

			// normalized torque is just -sin theta

		}

		function plottrq(ctx,x0,y0,width, th){
			


			ctx.strokeStyle = "rgb(0,0,128)"; 
			ctx.fillStyle= "rgb(0,0,128)"; 
			var xmid=width/2;
			var ymid=width/2;
			var dw=width*0.45;
			var dh=dw/2;
			var x,y;
			// draw centered axes this time
			ctx.save();
			ctx.translate(x0,y0);
			if (th>Math.PI){
				x=Math.round(dw*(th-2*Math.PI)/Math.PI);		
			} else{
				x=Math.round(dw*th/Math.PI);
			}
			y=Math.round(dh*Math.sin(th));


			ctx.save();
			ctx.translate(xmid,ymid); 
			ctx.beginPath(); 
			ctx.arc(x,y,2,0,2*Math.PI,true); 
			ctx.fill();
			ctx.restore();
			ctx.restore();
			// normalized torque is just -sin theta

		}


 }

function drawtrqrel() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_ac_gen" and the canvas to have an id="canvas_ac_gen" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	

	var cont_tqr=document.getElementById("canvasholder_ac_trq-rel");
	var myc_tqr = document.getElementById("canvas_ac_trq-rel");

	if (null===myc_tqr || !myc_tqr.getContext) {
	return; 
 	}

 	var ctx_tqr=myc_tqr.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 
 There are three squares sections each wwith width & height equal to 1/3 of the total canvas width
 */
  
    var maxW=750; 
	var aspect=0.5;
	var scale, winW, winH, width1, boxsize;
	
 // define font sizes, scaled with width. 
 	ctx_tqr.fillStyle="#000000";
	ctx_tqr.font="14px sans-serif";
 	ctx_tqr.textAlign="left";	
 	ctx_tqr.font = " "+Math.round(14*scale)+"px sans-serif";
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing


	// have to hard code coil colors for specific cases?
	var theta_R=0;
	var frameNo=0;
	var maxsteps=72;
	
	
	function init_drawing(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_tqr.offsetWidth;
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
		ctx_tqr.canvas.width=winW;
		ctx_tqr.canvas.height=winH;	
		
		/* canvas is divided into two equal sized boxes */
	    boxsize=winW/2;

		
	// init drawing 
		trqaxes(ctx_tqr, boxsize, boxsize/4, boxsize);
		update_drawing();
	}
	

	
	function update_drawing(){
		/* call the functions that draw the components of the animation*/
		plotstat_rot(ctx_tqr, 0, 0, boxsize, theta_R);
		plotBS(ctx_tqr, boxsize, 0, boxsize, theta_R);
		plottrq(ctx_tqr, boxsize, boxsize/4, boxsize, theta_R);
		
	}
	
	
	init_drawing();
	window.addEventListener('resize',init_drawing,false);

	var stepUpRButton = document.getElementById('stepUpRAnim');
	var stepDnRButton = document.getElementById('stepDnRAnim');

	stepUpRButton.addEventListener("click", function(){

		  	frameNo++;
			if (frameNo===maxsteps+1){
				frameNo=1;
			}
			theta_R=(frameNo-1)*2*Math.PI/maxsteps;
			update_drawing();
        });  
	stepDnRButton.addEventListener("click", function(){

		  	frameNo--;
			if (frameNo===0){
				frameNo=maxsteps;
			}
			theta_R=(frameNo-1)*2*Math.PI/maxsteps;
			update_drawing();
        }); 
	
		function plotstat_rot(ctx, x0,y0, width, th){
	
			var stat_or, stat_ir, origin, rotr_or, rotr_mr;
			ctx.clearRect(x0,y0,width,width);
			/*move canvas origin to centre of box.*/
			ctx.save();
				ctx.translate(x0,y0);
				origin=Math.round(width/2); 
				ctx.translate(origin,origin); 


				stat_or=Math.round(0.45*width); 
				stat_ir=Math.round(0.35*width);
				rotr_or=Math.round(0.325*width);
				rotr_mr=Math.round(0.25*width);
				var stat_midr=Math.round((stat_or+stat_ir)/2);
			
			// draw stator as solid circle.
				ctx.lineWidth=Math.round(stat_or-stat_ir);
				ctx.strokeStyle="rgba(180,230,230,1.0)";
				ctx.beginPath(); 
				ctx.arc(0,0,stat_midr, 0, 2*Math.PI,true); 
				ctx.stroke();

		// draw ellipse, rotated	
				ctx.lineWidth=1;
				ctx.fillStyle="rgba(180,230,230,1.0)";
				ctx.beginPath(); 
				ctx.ellipse(0,0,rotr_or,rotr_mr,-th,0,2*Math.PI); 
				ctx.fill();

				ctx.strokeStyle="#666666";
				ctx.save();
					ctx.rotate(-th);			
					ctx.beginPath(); 
					ctx.setLineDash([10,4,4,4]);
					ctx.moveTo(0,0);
					ctx.lineTo(rotr_or,0);
					ctx.stroke();
				ctx.restore();


				ctx.beginPath();
			    ctx.strokeStyle="#666666";
				ctx.setLineDash([10,4,4,4]);
				ctx.moveTo(0,0);	
				ctx.lineTo(Math.round(stat_or),0);
				ctx.stroke();

				ctx.fillStyle="#666666";
				ctx.textAlign='right';
				ctx.textBaseline='Top';
				var th_deg=th*180/Math.PI;
				ctx.fillText('Theta R',width/4-5,-0.45*width);
				ctx.textAlign='left';
				ctx.fillText(th_deg.toFixed(1),width/4+5,-0.45*width);
			ctx.restore();

		}

		function plotBS(ctx,x0,y0,width, th){
			var x1, y1, dh, dw;
			ctx.save();
			ctx.translate(x0,y0);
			ctx.clearRect(0,0,width, width/2);
			y1=Math.round(0.25*width);
			x1=Math.round(0.05*width);
			dh=Math.round(0.2*width);
			dw=Math.round(0.9*width);
			// plotting axes 
			plotaxes(ctx,x1,y1,dw,dh,"Theta"," ");

			ctx.textAlign='right';
			ctx.textBaseline='bottom';

			ctx.strokeStyle="#FF0000";
			drawcos(ctx,x1,y1,dw,dw,dh/2,0);
			ctx.fillStyle="#FF0000";
			ctx.fillText('mmf_s',4*x1,0.45*width);

			ctx.strokeStyle="#000000";
			ctx.fillStyle="#000000";
			ctx.fillText('g(\u03B8)',6*x1,0.45*width);
			drawcos(ctx,x1,y1/2,dw/2,dw,-dh/5,-2*th);	

			ctx.strokeStyle="#0000FF";
			ctx.fillStyle="#0000FF";
			ctx.fillText('Bs',8*x1,0.45*width);
			ctx.beginPath(); 
			ctx.moveTo(x1,y1-m);
			var x=0;
			var ths=2*Math.PI*x/dw;
			var m1=Math.cos(ths);
			var m2=0.5-0.2*Math.cos(2*(ths-th));
			var m=Math.round(dh/3.5*(m1/m2));
			var m0=m;
			ctx.moveTo(x1,y1-m);
			while (x<dw-5){ 
				x=x+5; 
				ths=2*Math.PI*x/dw;
				m1=Math.cos(ths);
				m2=0.5-0.2*Math.cos(2*(ths-th));
				m=Math.round(dh/3.5*(m1/m2));
				ctx.lineTo(x1+x,y1-m);
			}
			ctx.lineTo(x1+dw,y1-m0);
			ctx.stroke();

			ctx.restore();


		}

		function trqaxes(ctx,x0,y0,width){


			ctx.strokeStyle = "#303030" ;
			var xmid=width/2;
			var ymid=width/2;
			var dw=width*0.45;
			var dh=dw/2;
			// draw centered axes this time

			ctx.save();
			ctx.translate(x0,y0);
			ctx.beginPath(); ctx.moveTo(xmid,ymid-dh); ctx.lineTo(xmid,ymid+dh);
			ctx.moveTo(xmid-dw,ymid); ctx.lineTo(xmid+dw,ymid); ctx.stroke();
			ctx.textAlign="right";ctx.fillText('Theta R',xmid+dw,ymid+10);
			ctx.save();
			ctx.translate(xmid,ymid-dh); ctx.rotate(-Math.PI/2); ctx.textAlign="right"; ctx.fillText('Normalized Torque',0,-5); 
			ctx.restore();
			ctx.restore();

			// normalized torque is just -sin theta

		}

		function plottrq(ctx,x0,y0,width, th){
	

			ctx.strokeStyle = "rgb(0,0,128)"; 
			ctx.fillStyle= "rgb(0,0,128)"; 
			var xmid=width/2;
			var ymid=width/2;
			var dw=width*0.45;
			var dh=dw/2;
			var x,y;
			// draw centered axes this time
			ctx.save();
			ctx.translate(x0,y0);
			if (th>Math.PI){
				x=Math.round(dw*(th-2*Math.PI)/Math.PI);		
			} else{
				x=Math.round(dw*th/Math.PI);
			}
			y=Math.round(dh*Math.sin(2*th));


			ctx.save();
			ctx.translate(xmid,ymid); 
			ctx.beginPath(); 
			ctx.arc(x,y,2,0,2*Math.PI,true); 
			ctx.fill();
			ctx.restore();
			ctx.restore();
			// normalized torque is just -sin theta

		}


 }




function plotaxes(ctx, x1,y1,dw,dh,xlabel,ylabel){
	'use strict';
	ctx.strokeStyle = "rgb(64,64,64)"; 
	ctx.save();
	ctx.beginPath(); ctx.moveTo(x1,y1-dh); ctx.lineTo(x1,y1+dh);ctx.moveTo(x1,y1); ctx.lineTo(x1+dw,y1); ctx.stroke();
	ctx.textAlign="right";ctx.fillText(xlabel,x1+dw,y1+10);
	ctx.translate(x1,y1-dh); ctx.rotate(-Math.PI/2); ctx.textAlign="right"; ctx.fillText(ylabel,0,-5); 
	ctx.restore();
}

function drawcos(ctx,xs,ys,period,xrange,mag,phase){
	'use strict';	
	var m=mag*Math.cos(phase);
	ctx.beginPath(); 
	ctx.moveTo(xs,ys-m);
	var x=0;
	while (x<xrange-5){ 
		x=x+5; 
		m=mag*Math.cos(2*Math.PI*x/period+phase);
		ctx.lineTo(xs+x,ys-m);
	}
	x=xrange;
	m=mag*Math.cos(2*Math.PI*x/period+phase);
	ctx.lineTo(xs+x,ys-m);
	ctx.stroke();
}
	


	
