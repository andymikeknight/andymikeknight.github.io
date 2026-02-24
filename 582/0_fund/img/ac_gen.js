// JavaScript Document

document.addEventListener('DOMContentLoaded',drawacgen,false);


function drawacgen() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_ac_gen" and the canvas to have an id="canvas_ac_gen" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	var ncoils=1;
 	var cont_acg=document.getElementById("canvasholder_ac_gen");
 	var myc_acg = document.getElementById("canvas_ac_gen");

 if (null===myc_acg || !myc_acg.getContext) {
 	return; 
 }

 var ctx_acg=myc_acg.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 
 There are three squares sections each wwith width & height equal to 1/3 of the total canvas width
 */
  
    var maxW=1024; 
	var aspect=0.33;
	var scale, winW, winH, width1, boxsize;
	
 // define font sizes, scaled with width. 
 	ctx_acg.fillStyle="#000000";
	ctx_acg.font="14px sans-serif";
 	ctx_acg.textAlign="left";	
 	ctx_acg.font = " "+Math.round(14*scale)+"px sans-serif";
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing
	var coil_pitch=Math.PI/ncoils;
	var th0=0;

	// have to hard code coil colors for specific cases?
	var coildata ;	
	var omegat=0;
	var frameNo=0;
	var maxsteps=108;
	var tstep=40;
	var shift;
	var id;

	// stator isnt animated; rotor continually overdraws itself
	// therefore can plot stator once and only animate rotor..
	
	
	function init_drawing(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_acg.offsetWidth;
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
		ctx_acg.canvas.width=winW;
		ctx_acg.canvas.height=winH;	
		
		/* canvas is divided into three equal sized boxes */
	    boxsize=winW/3;

		
	// init drawing - each time init_drawing is called the number of coils may have changed.
		coil_pitch=Math.PI/ncoils;
		th0=Math.PI/2;
		if (ncoils>2){
			th0=th0-coil_pitch*(ncoils/3-1)/2;
		}
	
	    coildata = [];
		coildata.push({r:255,g:0,  b:0  ,th:th0});
		coildata.push({r:10, g:10,  b:10  ,th:th0+2*Math.PI/3});
		coildata.push({r:0,  g:0,  b:255,th:th0+4*Math.PI/3});
		coildata.push({r:200,g:0,  b:0  ,th:th0+coil_pitch});
		coildata.push({r:40, g:40, b:40  ,th:th0+coil_pitch+2*Math.PI/3});
		coildata.push({r:0,  g:0,  b:200,th:th0+coil_pitch+4*Math.PI/3});
		coildata.push({r:146,g:0,  b:0  ,th:th0+2*coil_pitch});
		coildata.push({r:70, g:70, b:70  ,th:th0+2*coil_pitch+2*Math.PI/3});
		coildata.push({r:0,  g:0,  b:146,th:th0+2*coil_pitch+4*Math.PI/3});

		shift=Math.round(boxsize/4);
		do_drawing();
	}
	
	function animate_plots(){
		frameNo++;
		if (frameNo===maxsteps+1){
			frameNo=1;
		}
		omegat=(frameNo-1)*2*Math.PI/maxsteps;
		do_drawing();
	}
	
	function do_drawing(){
		plotstator(ctx_acg, 0,0, 3*boxsize/4, shift, ncoils, omegat, coildata);
		plotrotor(ctx_acg, 0,0, 3*boxsize/4,shift, omegat);
		plotspace(ctx_acg, boxsize, 0, boxsize, omegat, ncoils, coildata, scale);
		plottime (ctx_acg, 2*boxsize,0, boxsize, omegat, ncoils, coildata);
	}
	

	init_drawing();
	window.addEventListener('resize',init_drawing,false);


	
	var Button1p = document.getElementById('1pAnim');
	var Button3c = document.getElementById('3cAnim');
	var Button6c = document.getElementById('6cAnim');
	var Button9c = document.getElementById('9cAnim');
	var stopButton = document.getElementById('stopAnim');
	var stepButton = document.getElementById('stepAnim');

    Button1p.addEventListener("click", function(){
          clearInterval(id) ;
		  ncoils=1;
		  init_drawing();
          id=setInterval(animate_plots,tstep);
        });
	Button3c.addEventListener("click", function(){
			clearInterval(id) ;
			ncoils=3;
			init_drawing();
			id=setInterval(animate_plots,tstep);
        });
	Button6c.addEventListener("click", function(){
			clearInterval(id) ;
			ncoils=6;
			init_drawing();
			id=setInterval(animate_plots,tstep);
        });
	Button9c.addEventListener("click", function(){
			clearInterval(id) ;
			ncoils=9;
			init_drawing();
            id=setInterval(animate_plots,tstep);
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
			omegat=(frameNo-1)*2*Math.PI/maxsteps;
			do_drawing();
        });     
	
	
 }

function plotstator(ctx_acg, x0,y0, width, shift, nc, theta_e, cdata){	
	'use strict';
	var stat_od, stat_id, origin;
	var xo, yo, transp;
	ctx_acg.clearRect(x0,y0,width,width);
	for (var j=0;j<shift;j++){ 
		xo=x0+j;
		yo=y0+j;
		transp=0.1+0.5*j/shift;
	
		ctx_acg.save();
		ctx_acg.translate(xo,yo);
		
		origin=Math.round(width/2); 
		stat_od=Math.round(0.95*width); 
		stat_id=Math.round(0.7*width);
		var stat_midr=Math.round((stat_od+stat_id)/4);
		var maxcoilsides=18;
		var circum, slotpitch, coilheight, theta_m;	
		circum=Math.PI*stat_id; 
		slotpitch=Math.round(circum/maxcoilsides);	
		coilheight=Math.round(slotpitch/2);
	// draw stator as solid circle. Note: no outline to make slot drawing easier 
	 	ctx_acg.lineWidth=Math.round(0.125*width);
		if (j===0){
			ctx_acg.strokeStyle="rgba(180,230,230,1.0)";
			ctx_acg.beginPath(); ctx_acg.arc(origin,origin,stat_midr, 0, 2*Math.PI,true); 
			ctx_acg.stroke();				
		}else if (j===shift-1){
			ctx_acg.strokeStyle="rgba(180,230,230,0.75)";
			ctx_acg.beginPath(); ctx_acg.arc(origin,origin,stat_midr, 0, 2*Math.PI,true); 
			ctx_acg.stroke();	
		}else{
			ctx_acg.strokeStyle="rgba(180,230,230,0.05)";
			ctx_acg.beginPath(); ctx_acg.arc(origin,origin,stat_midr, 0, 2*Math.PI,true); 
			ctx_acg.stroke();			
		}


		ctx_acg.lineWidth=2;
	// draw slots and coils 
		var slotCentreRad = stat_id/2+coilheight/2;
		var slotLabelRad =  stat_id/2+5*coilheight/3;
		var scx;
		var scy;
		var slx;
		var sly;
		ctx_acg.save();
		ctx_acg.translate(origin,origin); 
		
		for (var i=0;i<nc;i++){ 

			theta_m=-cdata[i].th;
			scx=slotCentreRad*Math.cos(theta_m);
			scy=slotCentreRad*Math.sin(theta_m);
			slx=slotLabelRad*Math.cos(theta_m);
			sly=slotLabelRad*Math.sin(theta_m);
				
			if (j===shift-1){
				ctx_acg.strokeStyle="#FFFFFF";
			}else{
				ctx_acg.strokeStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +","+transp+")";
			}
	
			ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +","+transp+")";

			ctx_acg.beginPath(); 
			ctx_acg.arc(scx, scy,coilheight/2, 0,2*Math.PI,true); 
			ctx_acg.stroke(); 
			ctx_acg.fill();

			
			ctx_acg.fillStyle="rgba("+Math.round(0.8*cdata[i].r)+","+Math.round(0.8*cdata[i].g)+","+Math.round(0.8*cdata[i].b)+","+transp+")";
			
			ctx_acg.beginPath(); 
			ctx_acg.arc(-scx,-scy,coilheight/2,0,2*Math.PI,true); 
			ctx_acg.stroke(); 
			ctx_acg.fill();
			
			
		}
		ctx_acg.restore();
		ctx_acg.restore();
	}
}

function plotrotor(ctx_acg, x0,y0, width, shift, theta_e){
	'use strict';
	var rotr_od=Math.round(0.65*width);
	var origin=Math.round(width/2);
	var xo, yo, transp;
	for (var j=0;j<shift;j++){ 
		xo=x0+j;
		yo=y0+j;
		transp=0.1+0.5*j/shift;
	

// draw 2 rotor halfs at angle offset by theta_e
	
		ctx_acg.save();
		ctx_acg.translate(xo,yo);
		ctx_acg.translate(origin,origin); ctx_acg.rotate(-theta_e+Math.PI/2);
		// red North pole
		
		if (j===0){
			ctx_acg.strokeStyle="rgba(127,0,0,0.15)";
			ctx_acg.fillStyle="rgba(250,0,0,0.15)";
			ctx_acg.beginPath(); ctx_acg.arc(0,0,rotr_od/2,0,Math.PI,true); 
			ctx_acg.stroke();
			ctx_acg.fill();
		
		}else if (j===shift-1){
			ctx_acg.strokeStyle="rgba(127,0,0,0.75)";
			ctx_acg.fillStyle="rgba(250,0,0,0.75)";
			ctx_acg.beginPath(); ctx_acg.arc(0,0,rotr_od/2,0,Math.PI,true); 
			ctx_acg.stroke();
			ctx_acg.fill();

		}else{
			ctx_acg.strokeStyle="rgba(127,0,0,0.15)";
			ctx_acg.fillStyle="rgba(250,0,0,0.15)";	
			ctx_acg.beginPath(); ctx_acg.arc(0,0,rotr_od/2,0,Math.PI,true); 
			ctx_acg.stroke();
		}

		
		// blue South pole
		if (j===0){
			ctx_acg.strokeStyle="rgba(0,0,127,0.15)";
			ctx_acg.fillStyle="rgba(0,0,250,0.15)";
			ctx_acg.beginPath(); ctx_acg.arc(0,0,rotr_od/2,Math.PI,2*Math.PI,true); 
			ctx_acg.stroke();
			ctx_acg.fill();	
		}else if (j===shift-1){
			ctx_acg.strokeStyle="rgba(0,0,127,0.75)";
			ctx_acg.fillStyle="rgba(0,0,250,0.75)";
			ctx_acg.beginPath(); ctx_acg.arc(0,0,rotr_od/2,Math.PI,2*Math.PI,true); 
			ctx_acg.stroke();
			ctx_acg.fill();

		}else{
			ctx_acg.strokeStyle="rgba(0,0,127,0.15)";
			ctx_acg.fillStyle="rgba(0,0,250,0.15)";	
			ctx_acg.beginPath(); ctx_acg.arc(0,0,rotr_od/2,Math.PI,2*Math.PI,true); 
			ctx_acg.stroke();
		}
		ctx_acg.restore();
	}
}

function plottime(ctx_acg, x0,y0, width, theta_e, nc, cdata) {
	'use strict';
	// if only one coil, then plot A-, A- and A total
	// if more that 1 coil, need to plot each of the individual coil voltages, plus the total phase voltage
	var dX, dY, bord, y01;
	var xx, yy;
	
	ctx_acg.save();
	ctx_acg.translate(x0,y0);
	ctx_acg.fillText("c",0,0);
	ctx_acg.clearRect(0,0,width, width);
	bord=Math.round(0.05*width); 
	dY=Math.round(0.45*width);
	var ymid =Math.round(0.5*width);
	y01=bord;
	
	ctx_acg.strokeStyle = "rgb(64,64,64)"; 
	
	var nX=3;
	dX=Math.round(0.9*width/nX);
	ctx_acg.beginPath();
	ctx_acg.moveTo(bord,y01);
	ctx_acg.lineTo(bord-3,y01+3);
	ctx_acg.lineTo(bord+3,y01+3);
	ctx_acg.lineTo(bord,y01);
	ctx_acg.lineTo(bord,y01+2*dY);  
	ctx_acg.moveTo(bord,y01+dY); 
	ctx_acg.lineTo(bord+nX*dX,y01+dY); 
	xx=bord; yy=y01+dY;
	
	for (var i=0;i<nX;i++){ 
		xx=xx+dX; ctx_acg.moveTo(xx,yy+5); ctx_acg.lineTo(xx,yy-5);
	}
	ctx_acg.stroke();
	
	ctx_acg.save();
	ctx_acg.translate(bord,ymid);
	ctx_acg.rotate(-Math.PI/2);
	ctx_acg.textAlign="right";
	ctx_acg.fillText("Normalized Voltage Components",dY,-0.5*bord);
	ctx_acg.restore();

	
	
	ctx_acg.fillStyle="#000000";
	ctx_acg.textAlign="left";
	if (nc<2){
		ctx_acg.fillText("A+",bord+0.6*dX,yy+12); ctx_acg.fillText("A-",bord+1.6*dX,yy+12); ctx_acg.fillText("A total",bord+2.6*dX,yy+12);
	}
		

// now plot columns at coil locations
// chart is divided into three sections
// if ncoils = 1 then we are plotting A+, A- and A total in a section each
// if ncoils >1 then we are plotting all coil sides and total voltage for each phase in each section
	
	var step=20;
	if (3*dX/(4*nc)<step){	
		step=3*dX/(4*nc);
	}
	ctx_acg.strokeStyle = "#aaaaaa";
	var thnow, magn, y1, spp, k;
	if (nc<2){
		
		thnow=cdata[0].th;
  		magn=Math.cos(theta_e-thnow);
		xx=bord+step;
 		y1=-Math.round(magn*dY/2);
		/* Draw positive coil side voltage column*/ 
 		ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",0.8)";
		ctx_acg.fillRect(xx-step/2,			y01+dY,2*step,y1);   
		ctx_acg.strokeRect(xx-step/2     ,	y01+dY,2*step,y1);
		/* Draw negative coil side voltage column*/ 		
 		ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",0.6)";
		ctx_acg.fillRect(xx-step/2+dX,  y01+dY,2*step,y1); 
		ctx_acg.strokeRect(xx-step/2+dX,y01+dY,2*step,y1);	
		/* Draw total voltage column*/
		ctx_acg.fillStyle="rgb("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +")";
		ctx_acg.fillRect(xx-step/2+2*dX,	y01+dY,2*step,2*y1); 
		ctx_acg.strokeRect(xx-step/2+2*dX,	y01+dY,2*step,2*y1);	


	}
	else{	
		spp=nc/3;
		for (i=0;i<3;i++) {
			var tmag=0;
			for (var j=0;j<spp;j++) {
				k=3*j+i;
  				thnow=cdata[k].th;
  				magn=-Math.cos(theta_e-thnow);
				// tmag=magn+tmag;
				xx=bord+3*step/2+i*dX+j*3*step;
 				y1=magn*dY/2;
				tmag=tmag+y1;
 				ctx_acg.fillStyle="rgba("+ Math.round(cdata[k].r) +","+ Math.round(cdata[k].g) +","+ Math.round(cdata[k].b) +",0.8)";
				ctx_acg.fillRect(xx-step/2,y01+dY,step,y1); ctx_acg.strokeRect(xx-step/2,y01+dY,step,y1);
 				ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",0.6)";
				ctx_acg.fillRect(xx+step-step/2,y01+dY,step,y1); ctx_acg.strokeRect(xx+step-step/2,y01+dY,step,y1);
			}
			xx=bord+3*step/2+i*dX+spp*3*step;
 			y1=2*tmag/spp;
 			ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",1)";
			ctx_acg.fillRect(xx-step/2,y01+dY,step,y1); ctx_acg.strokeRect(xx-step/2,y01+dY,step,y1);
		
		}
 	}
	ctx_acg.restore();	
	
}

// plot space axes and flux density as a cosine function, then as columns at coil locations
function plotspace(ctx_acg, x0, y0, width, theta_e, nc, cdata, scale){
	'use strict';
	var dX, dY, bord, y01, y02, xx, yy;

	ctx_acg.save();
	ctx_acg.translate(x0,y0);
	ctx_acg.clearRect(0,0,width, width);
// plot axis
	bord=Math.round(0.05*width); 
	dY=Math.round(0.2*width); 
	y01=bord; 
	y02=2*(bord+dY); 
	dX=Math.round(0.15*width);
	ctx_acg.strokeStyle = "rgb(64,64,64)"; 
// draw 1st axis
	ctx_acg.beginPath();
	ctx_acg.moveTo(bord,y01);
	ctx_acg.lineTo(bord-3,y01+3);
	ctx_acg.lineTo(bord+3,y01+3);
	ctx_acg.lineTo(bord,y01);	
	ctx_acg.lineTo(bord,y01+2*dY); 
	ctx_acg.moveTo(bord,y01+dY); 
	ctx_acg.lineTo(bord+6*dX,y01+dY);
	ctx_acg.lineTo(bord+6*dX-3,y01+dY+3);
	ctx_acg.lineTo(bord+6*dX-3,y01+dY-3);
	ctx_acg.lineTo(bord+6*dX,y01+dY);
	// ticks on x-axis
	xx=bord; yy=y01+dY;
	for (var i=0;i<6;i++){ 
		xx=xx+dX; ctx_acg.moveTo(xx,yy+5); ctx_acg.lineTo(xx,yy);
	}
	ctx_acg.stroke();
// labels
	ctx_acg.fillStyle="#000000";
	ctx_acg.textAlign="left";
	ctx_acg.fillText("\u03C0",bord+3*dX,yy+15*scale);
	ctx_acg.textAlign="right";	
	ctx_acg.fillText("2\u03C0",bord+6*dX,yy+15*scale);
	ctx_acg.fillText("\u03b8 m",bord+6*dX,yy+30*scale);
	ctx_acg.save();
	ctx_acg.translate(bord,y01+dY);
	ctx_acg.rotate(-Math.PI/2);
	ctx_acg.textAlign="right";
	ctx_acg.fillText("B_gap",dY,-bord/2);
	ctx_acg.restore();

// draw 2nd axis
	ctx_acg.moveTo(bord,y02); ctx_acg.lineTo(bord,y02+2*dY); ctx_acg.moveTo(bord,y02+dY); ctx_acg.lineTo(bord+6*dX,y02+dY); 
// ticks on x-axis
	xx=bord; yy=y02+dY;
	for ( i=0;i<6;i++){ 
		xx=xx+dX; ctx_acg.moveTo(xx,yy-5); ctx_acg.lineTo(xx,yy);
	}
	ctx_acg.stroke();
	ctx_acg.save();
	ctx_acg.translate(bord,y02+dY);
	ctx_acg.rotate(-Math.PI/2);
	ctx_acg.textAlign="right";
	ctx_acg.fillText("B_coil",dY,-bord/2);
	ctx_acg.restore();
		
// plot flux density at a cosine function in first axes set, then B columns at individual coil locations
	
 	
 	var step=3; 
	var dtheta=2*Math.PI*step/(6*dX);
	var thnow=-theta_e;
 	var imax=Math.floor((6*dX)/step)+1;
	
	ctx_acg.strokeStyle = "#0000cc";
	ctx_acg.fillStyle="#000000";


 	yy=y01+dY;
	var magn =Math.cos(thnow) ;
	var y1, x1;
 	y1=yy-magn*dY; x1 = bord;
	ctx_acg.beginPath();
 	ctx_acg.moveTo(x1,y1);		
 	for (i=1;i<=imax;i++) {
		x1=x1+step; 
		thnow=thnow+dtheta; 
		magn =Math.cos(thnow); 
		y1=yy-magn*dY; 
		ctx_acg.lineTo(x1,y1);
 	}
 	ctx_acg.stroke();
	
// now plot columns at coil locations
	step=10;
	if (6*dX/(4*nc)<step){	
		step=6*dX/(4*nc);
	}
	ctx_acg.strokeStyle = "#aaaaaa";
	for (i=0;i<nc;i++) {

  		thnow=cdata[i].th;
		if (thnow<0){
			thnow=thnow+2*Math.PI;
		}
		magn=Math.cos(theta_e-thnow);
		xx=Math.round(thnow/(2*Math.PI)*6*dX)+bord;
 		y1=-magn*dY;

 		ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",0.8)";
		ctx_acg.fillRect(xx-step/2,y02+dY,step,y1); ctx_acg.strokeRect(xx-step/2,y02+dY,step,y1);
 		ctx_acg.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",0.6)";
		if (thnow>Math.PI){
			ctx_acg.fillRect(xx-step/2-3*dX,y02+dY,step,-y1); ctx_acg.strokeRect(xx-step/2-3*dX,y02+dY,step,-y1);	
		}
		else{
			ctx_acg.fillRect(xx-step/2+3*dX,y02+dY,step,-y1); ctx_acg.strokeRect(xx-step/2+3*dX,y02+dY,step,-y1);
		}
 	}
	ctx_acg.restore();

}

	
