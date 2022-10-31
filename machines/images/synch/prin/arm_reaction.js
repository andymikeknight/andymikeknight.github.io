// JavaScript Document

document.addEventListener('DOMContentLoaded',drawar,false);

function drawar() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_armr" and the canvas to have an id="canvas_armr" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. Depending on the the simulation button pressed by the user, the simulation plots the open circuit induced voltage, lagging current and resulting net field and voltage, to illustrate the effect of armature reaction. */	

 var cont_armr=document.getElementById("canvasholder_ar");
 var myc_armr = document.getElementById("canvas_ar");
	
 

 if (null===myc_armr || !myc_armr.getContext) {
 	return; 
 }

 var ctx_armr=myc_armr.getContext("2d");
 
 ctx_armr=myc_armr.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height, so aspect ratio is 0.5
 */
  
    var maxW=920; var whratio=0.5;
	var scale, winW, winH, width1, boxSize;
	
	
	// define some drawing related variable outside drawing fn that is called repeatedly
	var ncoils=9;
	var coil_pitch=Math.PI/ncoils;
	var th0=0;

	
	var coildata ;	
	var omegat=0;
	var frameNo=0;
	var maxsteps=108;
	var tstep=40;
	var id;
	var simCase=1;
	
	
	function initDrawing(){
		width1=cont_armr.offsetWidth;
		if (width1>maxW){
			winW=maxW;
			scale=1;
		}
		if (width1<maxW){
			scale=width1/maxW;
			winW=width1;
		}
		winH=winW*whratio;
		boxSize=Math.round(winW/2);
	 // set canvas size based on containing div size (fluid resizing)		
		ctx_armr.canvas.width=winW;
		ctx_armr.canvas.height=winH;

	 // define font sizes, scaled with width. 
		ctx_armr.fillStyle="#000000";
		ctx_armr.font="12px sans-serif";
		ctx_armr.textAlign="left";	
		ctx_armr.font = " "+Math.round(12*scale)+"px sans-serif";



// finished init of canvas, now init drawing


	// have to hard code coil colors for specific cases
		th0=Math.PI/2-coil_pitch;
	    coildata = [];
		coildata.push({r:254,g:0,  b:0  ,th:th0});
		coildata.push({r:200,g:0,  b:0  ,th:th0+coil_pitch});
		coildata.push({r:146,g:0,  b:0  ,th:th0+2*coil_pitch});
		coildata.push({r:254,g:254,b:0  ,th:th0+3*coil_pitch});
		coildata.push({r:200,g:200,b:0  ,th:th0+4*coil_pitch});
		coildata.push({r:146,g:146,b:0  ,th:th0+5*coil_pitch});
		coildata.push({r:0,  g:0,  b:254,th:th0+6*coil_pitch});
		coildata.push({r:0,  g:0,  b:200,th:th0+7*coil_pitch});
		coildata.push({r:0,  g:0,  b:146,th:th0+8*coil_pitch});
		
		omegat=0;	  
		frameNo=0;
	// stator core isnt animated
		
		doDrawing();
	}
	
	function doDrawing(){
		
		plotstator(ctx_armr, 0, 0, boxSize, ncoils, omegat, coildata,simCase);
		plotrotorvector(ctx_armr, 0, 0, boxSize, omegat, simCase);
		plotspace(ctx_armr, boxSize, 0, boxSize, omegat, ncoils, coildata,simCase);
	}
		
	function animate_plots(){
		frameNo++;
		if (frameNo===maxsteps+1){
			frameNo=1;
		}
		omegat=(frameNo-1)*2*Math.PI/maxsteps;
		doDrawing();
	}
	
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);


	
	var ButtonV = document.getElementById('vAnim');
	var ButtonI = document.getElementById('iAnim');
	var ButtonF = document.getElementById('fAnim');
	var stopButton = document.getElementById('stopAnim');
	var stepButton = document.getElementById('stepAnim');

    ButtonV.addEventListener("click", function(){
          clearInterval(id) ;
		  simCase=1;
          id=setInterval(animate_plots,tstep);
        });
	ButtonI.addEventListener("click", function(){
			clearInterval(id) ;
			simCase=2;
			id=setInterval(animate_plots,tstep);
        });
	ButtonF.addEventListener("click", function(){
			clearInterval(id) ;
			simCase=3;
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
			doDrawing();
        });     
	
	
 }


function plotstator(ctx, x0,y0, width, nc, theta_e, cdata, simno){	
	'use strict';
	var stat_od, stat_id, origin;

	ctx.clearRect(x0,y0,width,width);

	ctx.save();
	ctx.translate(x0,y0);

	origin=Math.round(width/2); 
	stat_od=Math.round(0.95*width); 
	stat_id=Math.round(0.7*width);
	var stat_midr=Math.round((stat_od+stat_id)/4);
	var coilsides=18;
	var circum, slotpitch, coilheight, theta_m;	
	circum=Math.PI*stat_id; 
	slotpitch=Math.round(circum/coilsides);	
	coilheight=Math.round(slotpitch/2);
// draw stator as solid circle. Note: no outline to make slot drawing easier 
	ctx.lineWidth=Math.round(0.125*width);
	ctx.strokeStyle="rgba(180,230,230,0.75)";
	ctx.beginPath(); ctx.arc(origin,origin,stat_midr, 0, 2*Math.PI,true); 
	ctx.stroke();	

	ctx.lineWidth=1;	
	
// draw slots and coils 
		// draw slots and coils 
	var slotCentreRad = stat_id/2+coilheight/2;
	var slotLabelRad =  stat_id/2+5*coilheight/3;
	var scx;
	var scy;
	var slx;
	var sly;
	var cmag, cphase, cm;
	ctx.save();
	ctx.translate(origin,origin);	
	for (var i=0;i<nc;i++){ 

			theta_m=-cdata[i].th;
			scx=slotCentreRad*Math.cos(theta_m);
			scy=slotCentreRad*Math.sin(theta_m);
			slx=slotLabelRad*Math.cos(theta_m);
			sly=slotLabelRad*Math.sin(theta_m);

		if (simno===1){
			// draw filled circle for one coil side, hollow circle for other
			ctx.lineWidth=coilheight/4;
			ctx.strokeStyle="rgb("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +")";
			ctx.fillStyle="rgb("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +")";
			ctx.beginPath(); 
			ctx.arc(scx, scy,3*coilheight/8, 0,2*Math.PI,true); 
			ctx.stroke(); 
			ctx.fill();
			ctx.fillStyle="#FFFFFF";
			ctx.beginPath(); 
			ctx.arc(-scx, -scy,3*coilheight/8, 0,2*Math.PI,true); 
			ctx.stroke();
			ctx.fill();


		}else{
			// draw circle based on current phase angle. Current phase is coil angle - 2pi/9 degrees
			cphase=theta_e-cdata[i].th-2*Math.PI/9;
			cmag=Math.cos(cphase);
			cm=Math.round(128*(1+Math.abs(cmag)));
			ctx.lineWidth=1;
			if(cmag>=0){
				ctx.strokeStyle="rgb("+cm+",0,0)";
                ctx.fillStyle="rgb("+cm+",0,0)";
				ctx.beginPath(); 
				ctx.arc(scx, scy,coilheight/2, 0,2*Math.PI,true); 
				ctx.stroke(); 
				ctx.fill();
				ctx.strokeStyle="rgb(0,0,"+cm+")";
				ctx.fillStyle  ="rgb(0,0,"+cm+")";
				ctx.beginPath(); 
				ctx.arc(-scx,-scy,coilheight/2, 0,2*Math.PI,true); 
				ctx.stroke();
				ctx.fill();
			}else{
				ctx.strokeStyle="rgb(0,0,"+cm+")";
				ctx.fillStyle=  "rgb(0,0,"+cm+")";
				ctx.beginPath(); 
				ctx.arc(scx, scy,coilheight/2, 0,2*Math.PI,true); 
				ctx.stroke(); 
				ctx.fill();
				ctx.strokeStyle="rgb("+cm+",0,0)";
                ctx.fillStyle  ="rgb("+cm+",0,0)";
				ctx.beginPath(); 
				ctx.arc(-scx,-scy,coilheight/2,0,2*Math.PI,true); 
				ctx.stroke();
				ctx.fill();
			}
		}
	}
	ctx.restore();
}

function plotrotorvector(ctx, x0,y0, width, theta_e,simno){
	'use strict';
	
	var rotr_or=Math.round(0.65*width/2);
	var origin=Math.round(width/2);
	var tip=Math.round(rotr_or*0.03);


// draw arrow to indicate location of B_rotor
	
	ctx.save();
	ctx.translate(x0,y0);
	ctx.translate(origin,origin); 
	ctx.fillStyle="#FFFFFF";
	ctx.beginPath(); ctx.arc(0,0,Math.round(0.66*width/2), 0, 2*Math.PI,true); ctx.fill();
		
 	// Black Arrow for B, voltage
	ctx.save();	
	ctx.rotate(-theta_e);
	ctx.strokeStyle="#000000";
	var len=rotr_or;
	ctx.beginPath(); ctx.moveTo(0,0);ctx.lineTo(len,0); ctx.lineTo(len-tip,-tip); ctx.lineTo(len,0); ctx.lineTo(len-tip,tip); ctx.stroke(); 
	ctx.restore();
	
	if(simno>1){
		// draw current phasor
		ctx.save();
		ctx.rotate(-theta_e+Math.PI*2/9);
		ctx.strokeStyle="#DD0000";
		len=0.5*rotr_or;
		ctx.beginPath(); ctx.moveTo(0,0);ctx.lineTo(len,0); ctx.lineTo(len-tip,-tip); ctx.lineTo(len,0); ctx.lineTo(len-tip,tip); ctx.stroke(); 
		ctx.restore();
	}
	if(simno===3){
	// draw Arm reaction phasor
		ctx.save();
		ctx.rotate(-theta_e+Math.PI*2/9+Math.PI/2);
		ctx.strokeStyle="#880000";
		len=0.8*rotr_or;
		ctx.beginPath(); ctx.moveTo(0,0);ctx.lineTo(len,0); ctx.lineTo(len-tip,-tip); ctx.lineTo(len,0); ctx.lineTo(len-tip,tip); ctx.stroke(); 
	// Draw resultant phasor
	    ctx.restore();
		ctx.save();
		ctx.rotate(-theta_e+0.90);
	    ctx.strokeStyle="#008800";
		len=0.782*rotr_or;
		ctx.beginPath(); ctx.moveTo(0,0);ctx.lineTo(len,0); ctx.lineTo(len-tip,-tip); ctx.lineTo(len,0); ctx.lineTo(len-tip,tip); ctx.stroke(); 
		ctx.restore();		
	}	
	ctx.restore();

}

// plot space variation
function plotspace(ctx, x0, y0, width, theta_e, nc, cdata,simno){
		'use strict';
	var dX, dY, bord, y01, y02, xx, yy, cphase, cmag;

	ctx.save();
	ctx.translate(x0,y0);
	ctx.clearRect(0,0,width, width);
// plot axis
	bord=Math.round(0.05*width); 
	dY=Math.round(0.2*width); 
	y01=bord; 
	y02=2*(bord+dY); 
	dX=Math.round(0.3*width);
	
	
	ctx.strokeStyle = "rgb(64,64,64)"; 
// draw 1st axis
	ctx.beginPath();
	ctx.moveTo(bord,y01); ctx.lineTo(bord,y01+2*dY); ctx.moveTo(bord,y01+dY); ctx.lineTo(bord+3*dX,y01+dY); 
	// ticks on x-axis
	xx=bord; yy=y01+dY;
	for (var i=0;i<3;i++){ 
		xx=xx+dX; ctx.moveTo(xx,yy+5); ctx.lineTo(xx,yy);
	}
	ctx.stroke();
// labels
	ctx.fillStyle="#000000";
	ctx.textAlign="right";
	ctx.fillText("2 \u03C0",bord+3*dX,yy+12);
	ctx.fillText("\u03b8 m",bord+3*dX,yy+24);
	ctx.save();
	ctx.translate(bord,y01+dY);
	ctx.rotate(-Math.PI/2);
	ctx.textAlign="left";
	ctx.fillText("B",0,-2);
	ctx.restore();

// draw 2nd axis
	ctx.moveTo(bord,y02); ctx.lineTo(bord,y02+2*dY); ctx.moveTo(bord,y02+dY); ctx.lineTo(bord+3*dX,y02+dY); 
// ticks on x-axis
	xx=bord; yy=y02+dY;
	for ( i=0;i<3;i++){ 
		xx=xx+dX; ctx.moveTo(xx,yy-5); ctx.lineTo(xx,yy);
	}
	ctx.stroke();
// labels
	ctx.fillStyle="#000000";
	ctx.textAlign="right";
	ctx.fillText("Coil #",bord+3*dX,yy+12);
	ctx.save();
	ctx.translate(bord,y02+dY);
	ctx.rotate(-Math.PI/2);
	ctx.textAlign="left";
	ctx.fillText("Coil V, I",0,-6);
	ctx.restore();	
		
// plot flux density at a cosine function in first axes set, then B columns at individual coil locations
	
 	
 	var step=3; 
	var dtheta=2*Math.PI*step/(3*dX);
	var thnow=-theta_e;
 	var imax=Math.floor((3*dX)/step)+1;
	
	
	// plot BRotor
	ctx.strokeStyle = "#000000";
	ctx.fillStyle="#000000";
 	yy=y01+dY;
	var magn =Math.cos(thnow) ;
 	var y1=yy-magn*dY; 
	var x1 = bord;
	ctx.beginPath();
 	ctx.moveTo(x1,y1);		
 	for ( i=1;i<=imax;i++) {
		x1=x1+step; thnow=thnow+dtheta; magn =Math.cos(thnow); y1=yy-magn*dY; ctx.lineTo(x1,y1);
 	}
 	ctx.stroke();
	if (simno===3){
		// plot BStator
		ctx.strokeStyle ="#880000";
		ctx.fillStyle="#000000";
		yy=y01+dY;
		magn = 0.8* Math.cos(thnow+2*Math.PI/9+Math.PI/2) ;
		y1=yy-magn*dY; x1 = bord;
		ctx.beginPath();
		ctx.moveTo(x1,y1);		
		for ( i=1;i<=imax;i++) {
			x1=x1+step; thnow=thnow+dtheta; magn = 0.8* Math.cos(thnow+2*Math.PI/9+Math.PI/2); y1=yy-magn*dY; ctx.lineTo(x1,y1);
		}
		ctx.stroke();
			// plot BNet
		ctx.strokeStyle = "#008800";
		ctx.fillStyle="#000000";
		yy=y01+dY;
		magn = 0.782*Math.cos(thnow+0.9) ;
		y1=yy-magn*dY; x1 = bord;
		ctx.beginPath();
		ctx.moveTo(x1,y1);		
		for ( i=1;i<=imax;i++) {
			x1=x1+step; thnow=thnow+dtheta;  magn = 0.782*Math.cos(thnow+0.9) ; y1=yy-magn*dY; ctx.lineTo(x1,y1);
		}
		ctx.stroke();
	}

// assume max 9 coils
// each coil requires plotting of voltage, current and a space to next coil.
// column with, step = dX / 9
// now plot columns at coil locations
	step=Math.round(dX/9);

	
	for ( i=0;i<nc;i++) {

  		thnow=cdata[i].th;
		if (thnow<0){
			thnow=thnow+2*Math.PI;
		}

		// Plot Voltage
		magn=Math.cos(theta_e-thnow);
		xx=Math.round(i*3*step)+bord+step/2;
 		y1=-magn*dY;
		ctx.strokeStyle = "#aaaaaa";
 		ctx.fillStyle="rgba("+ Math.round(cdata[i].r) +","+ Math.round(cdata[i].g) +","+ Math.round(cdata[i].b) +",0.5)";
		ctx.fillRect(xx,y02+dY,step,y1); 
		ctx.strokeRect(xx,y02+dY,step,y1);
		
		if (simno!==1){
		//Plot Current
		
		cphase=theta_e-cdata[i].th-2*Math.PI/9;
		cmag=Math.cos(cphase);
 		y1=-cmag*dY;
 		ctx.fillStyle="#cccccc";
		ctx.strokeStyle="#000000";
	    ctx.strokeRect(xx+step,y02+dY,step,y1); ctx.fillRect(xx+step,y02+dY,step,y1);	
		}
 	}
	ctx.restore();

}

	
