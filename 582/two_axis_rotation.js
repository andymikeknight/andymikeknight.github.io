// JavaScript Document
document.addEventListener('DOMContentLoaded',drawacrot,false);
document.addEventListener('DOMContentLoaded',drawmmf,false);


function drawacrot() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_ac_gen" and the canvas to have an id="canvas_ac_gen" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	

	var cont_acr=document.getElementById("canvasholder_2ax_rot");
	var myc_acr = document.getElementById("canvas_2ax_rot");

	if (null===myc_acr || !myc_acr.getContext) {
	return; 
 	}

 	var ctx_acr=myc_acr.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 
 There are three squares sections each wwith width & height equal to 1/3 of the total canvas width
 */
  
    var maxW=750; 
	var aspect=0.5;
	var scale, winW, winH, width1, boxsize;
	
 // define font sizes, scaled with width. 
 	ctx_acr.fillStyle="#000000";
	ctx_acr.font="14px sans-serif";
 	ctx_acr.textAlign="left";	
 	ctx_acr.font = " "+Math.round(14*scale)+"px sans-serif";
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing
	var ncoils=3;
	var coil_pitch=Math.PI/ncoils;
	var th0=0;

	// have to hard code coil colors for specific cases?
	var coildata ;	
	var omegat=0;
	var frameNo=0;
	var maxsteps=108;
	var tstep=50;
	var shift;
	var option;
	var id;
	
	
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
		
		/* canvas is divided into two equal sized boxes */
	    boxsize=winW/2;

		
	// init drawing 
		coil_pitch=Math.PI/ncoils;
		th0=Math.PI/2;
	
	    coildata = [];
		coildata.push({r:255,g:0,  b:0  ,th:th0});
		coildata.push({r:10, g:10,  b:10  ,th:th0+2*Math.PI/3});
		coildata.push({r:0,  g:0,  b:255,th:th0+4*Math.PI/3});

		shift=Math.round(boxsize/4);
		/* only need to draw stator on init...*/
		plotstator(ctx_acr, 0, 0, boxsize, ncoils, coildata);
		do_drawing();
	}
	
	function animate_drawing(){
		/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=1;
		}
		omegat=frameNo*2*Math.PI/maxsteps;
		do_drawing();
		// all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
	}
	
	function do_drawing(){
		/* call the functions that draw the components of the animation*/
		
		plotblankrotor(ctx_acr, 0, 0, boxsize);
		plotmmfarrow(ctx_acr, 0, 0, boxsize, omegat, coildata);
		plotcurrent(ctx_acr, winW/2, 0, boxsize, omegat, coildata);
		 /*plotiphasors(ctx_acr, winH, winH/2, boxsize, omegat, option, coildata);*/
		
	}
	
	
	init_drawing();
	window.addEventListener('resize',init_drawing,false);

	var ButtonABC = document.getElementById('abcAnim');
	var stopButton = document.getElementById('stopAnim');
	var stepButton = document.getElementById('stepAnim');


	ButtonABC.addEventListener("click", function(){
			clearInterval(id) ;
			option=4;
			init_drawing();
            id=setInterval(animate_drawing,tstep);
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

function plotstator(ctx, x0,y0, width, nc, cdata){
	'use strict';
	var stat_od, stat_id, origin;
	ctx.clearRect(x0,y0,width,width);
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
	ctx.strokeStyle="rgba(180,230,230,1.0)";
	ctx.beginPath(); 
	ctx.arc(0,0,stat_midr, 0, 2*Math.PI,true); 
	ctx.stroke();				


// draw coils and whitedots / crosses for positve and negative coil side
	ctx.lineWidth=2;
	var crad=coilheight/2;
	var slotCentreRad = stat_id/2+crad;
	var scx;
	var scy;
	

	var xh=crad/2;

		
	for (var i=0;i<nc;i++){ 

		theta_m=-cdata[i].th;
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
	ctx.strokeStyle="#ffffff"; ctx.fillStyle="rgba(180,230,230,1.0)";	
	ctx.beginPath(); 
	ctx.arc(0,0,rotr_od/2,0,2*Math.PI,true); 
	ctx.stroke(); 
	ctx.fill();
	ctx.restore();
}

function plotmmfarrow(ctx, x0,y0, width, theta_e,cdata) {
	'use strict';

	var rotr_od=Math.round(0.65*width);
	var origin=Math.round(width/2);
	var magn;
	ctx.save();
	ctx.translate(x0,y0);
	ctx.translate(origin,origin);
    ctx.strokeStyle="#999999";
		// draw sum total mmf
	ctx.save();
	magn=Math.round(0.49*rotr_od);
	ctx.rotate(-theta_e);
	var col="#009900"
	ctx.fillStyle=col;
	ctx.strokeStyle=col;
	drawarrow(magn);
	ctx.restore();

	for (let ph = 0; ph < 3; ph++) {
		// draw phase A mmf
		ctx.save();
		magn=-Math.round(0.33*rotr_od*Math.cos(+theta_e-ph*2*Math.PI/3));
		ctx.rotate(-cdata[ph].th-Math.PI/2);
		ctx.fillStyle="rgba("+ Math.round(cdata[ph].r) +","+ Math.round(cdata[ph].g) +","+ Math.round(cdata[ph].b) +",0.5)";
		drawarrow(magn);
		ctx.restore();
	}
	function drawarrow(magn){
		ctx.beginPath(); 
		ctx.moveTo(0,0);
		ctx.lineTo(magn,0); 
		ctx.lineTo(magn-4,0-4); 
		ctx.lineTo(magn-4,0+4); 
		ctx.lineTo(magn,0); 
		ctx.stroke();
	}
	ctx.restore();
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
function plotcurrent(ctx,x0,y0,width, theta_e,  cdata){
	'use strict';
	var x1, y1, dh, dw;
	ctx.save();
	ctx.translate(x0,y0);
	ctx.clearRect(0,0,width, width/2);
	y1=Math.round(0.25*width);
	x1=Math.round(0.05*width);
	dh=Math.round(0.45*width/2);
	dw=Math.round(0.9*width);
	// plotting axes 
	plotaxes(ctx,x1,y1,dw,dh,"Time","Current");

	

	for (let ph = 0; ph < 3; ph++) {
		ctx.save();
		ctx.strokeStyle="rgb("+ Math.round(cdata[ph].r) +","+ Math.round(cdata[ph].g) +","+ Math.round(cdata[ph].b) +")";
		drawcos(ctx,x1,y1,dw,dh,-ph*Math.PI*2/3);
		ctx.restore();
	}
	
	// draw vertical time indicator
	var xnow=x1+dw*theta_e/(2*Math.PI);
	ctx.beginPath();
	ctx.moveTo(xnow,y1-dh); 
	ctx.lineTo(xnow,y1+dh); 
	ctx.stroke();
	ctx.restore();	
}

function plotmmfspace(ctx,x0,y0,width, theta_e, opt, cdata){
	'use strict';
	ctx.save();
	ctx.translate(x0,y0);
	ctx.clearRect(0,0,width, width/2);
	var y1=Math.round(0.25*width);
	var x1=Math.round(0.05*width);
	var dh=Math.round(0.45*width/2);
	var dw=Math.round(0.9*width);
	// plot axes 
	plotaxes(ctx,x1,y1,dw,dh,"Position","MMF");
	
 	var MA=0.5*dh*Math.cos(theta_e);
 	var MB=0.5*dh*Math.cos(theta_e-2*Math.PI/3);
 	var MC=0.5*dh*Math.cos(theta_e+2*Math.PI/3);

	if (opt===1 || opt===4){ // draw phase A mmf
		// positive phase A MMF from 0-> pi/2, negative  pi/2 ->  3 pi /2, positve 3 pi/2 -> 2pi
		// step at 1/4 and 3/4
		// y- increases down incanvas, so signs are -ve...
		
		ctx.strokeStyle="rgba("+ Math.round(cdata[0].r) +","+ Math.round(cdata[0].g) +","+ Math.round(cdata[0].b) +",0.8)";
		ctx.beginPath();
		ctx.moveTo(x1,y1-MA);
		ctx.lineTo(x1+dw/4,y1-MA);
		ctx.lineTo(x1+dw/4,y1+MA);
		ctx.lineTo(x1+3*dw/4,y1+MA);
		ctx.lineTo(x1+3*dw/4,y1-MA);
		ctx.lineTo(x1+dw,y1-MA);
		ctx.stroke();	
		
	}
	if (opt===2 || opt===4){ // draw phase B mmf
		// negative phase B MMF from 0-> pi/6, positve  pi/6 ->  7 pi /6, negative 7 pi/6 ->  2pi
		// step at 1/12 and 7/12
		
		ctx.strokeStyle="rgba("+ Math.round(cdata[1].r) +","+ Math.round(cdata[1].g) +","+ Math.round(cdata[1].b) +",0.8)";
		ctx.beginPath();
		ctx.moveTo(x1,y1+MB);
		ctx.lineTo(x1+dw/12,y1+MB);
		ctx.lineTo(x1+dw/12,y1-MB);
		ctx.lineTo(x1+7*dw/12,y1-MB);
		ctx.lineTo(x1+7*dw/12,y1+MB);
		ctx.lineTo(x1+dw,y1+MB);
		ctx.stroke();
	
	}
    if (opt===3 || opt===4){ // draw phase C mmf
		// negative phase C MMF from 0-> 5 pi/6, positve  5pi/6 ->  11 pi /6, negative 11 pi/6 ->  2pi
		// step at 5/12 and 11/12
	
		ctx.strokeStyle="rgba("+ Math.round(cdata[2].r) +","+ Math.round(cdata[2].g) +","+ Math.round(cdata[2].b) +",0.8)";
		ctx.beginPath();
		ctx.moveTo(x1,y1+MC);
		ctx.lineTo(x1+5*dw/12,y1+MC);
		ctx.lineTo(x1+5*dw/12,y1-MC);
		ctx.lineTo(x1+11*dw/12,y1-MC);
		ctx.lineTo(x1+11*dw/12,y1+MC);
		ctx.lineTo(x1+dw,y1+MC);
		ctx.stroke();
	
	}
    if (opt===4){ // draw phase total mmf
		// steps at 1/12, 3/12, 5/12, 7/12, 9/12, 11/12 
		var dx=dw/12;
		ctx.strokeStyle="#008800";
		ctx.beginPath();
		var M1= MA-MB-MC;
		var M2= MA+MB-MC;
		var M3=-MA+MB-MC;
		var M4=-MA+MB+MC;
		var M5=-MA-MB+MC;
		var M6=+MA-MB+MC;
		
		ctx.moveTo(x1,y1-M1);
		ctx.lineTo(x1+   dx,y1-M1);
		ctx.lineTo(x1+   dx,y1-M2);
		ctx.lineTo(x1+ 3*dx,y1-M2);
		ctx.lineTo(x1+ 3*dx,y1-M3);
		ctx.lineTo(x1+ 5*dx,y1-M3);
		ctx.lineTo(x1+ 5*dx,y1-M4);
		ctx.lineTo(x1+ 7*dx,y1-M4);
		ctx.lineTo(x1+ 7*dx,y1-M5);
		ctx.lineTo(x1+ 9*dx,y1-M5);
		ctx.lineTo(x1+ 9*dx,y1-M6);
		ctx.lineTo(x1+11*dx,y1-M6);
		ctx.lineTo(x1+11*dx,y1-M1);
		ctx.lineTo(x1+   dw,y1-M1); 
		ctx.stroke();
		
	}
	
	ctx.restore();	
}


function drawmmf() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_mmf" and the canvas to have an id="canvas_mmf" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	

	var cont_mmf=document.getElementById("canvasholder_mmf");
	var myc_mmf = document.getElementById("canvas_mmf");

	if (null===myc_mmf || !myc_mmf.getContext) {
	return; 
 	}

 	var ctx_mmf=myc_mmf.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 
 There are three squares sections each wwith width & height equal to 1/3 of the total canvas width
 */
  
    var maxW=400; 
	var aspect=0.333;
	var scale, winW, winH, width1;
	
 // define font sizes, scaled with width. 
 	ctx_mmf.fillStyle="#000000";
	ctx_mmf.font="14px sans-serif";
 	ctx_mmf.textAlign="left";	
 	ctx_mmf.font = " "+Math.round(14*scale)+"px sans-serif";
 
	
	

	var omegat=0;
	var frameNo=0;
	var tstep=50;
	var option=1;
	var maxsteps=100;
	var maxpts=200;
	var id;
	var border, width, height;
	var xlabel="\u03B8";
	var ylabel="mmf";
	var dx, dth;
	
	
	function init_mmf(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_mmf.offsetWidth;
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
		ctx_mmf.canvas.width=winW;
		ctx_mmf.canvas.height=winH;

		
		/* canvas is divided into two equal sized boxes */
	    border=10*scale;
		width=winW-2*border;
		height=winH-2*border;
		/*  define space harmonics for all cases, with 100 points from 0 to 2pi */

		/*maxpts is set to nominally 200 discrete points across range. BUT can only plot actual discrete points.. */
		
		dx=Math.round(width/maxpts);
		maxpts=Math.round(width/dx);

		dth=2*Math.PI/(maxpts);
		
	// init drawing 	
		
		plotharm();
	}
	
	function animate_mmf(){
		/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=1;
		}
		omegat=frameNo*2*Math.PI/maxsteps;
		plotharm();
		// all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
	}
	
	function plotharm(){
		/* call the functions that draw the components of the animation*/
		
		// fundamental is always plotted.
		var x, th;
		
		ctx_mmf.clearRect(0,0,winW,winH);
		
		plotaxes(ctx_mmf, border,winH/2,width,height/2,xlabel,ylabel);

		var peakMagn=(winH/2-border)*0.9;
		var x0=border;
		var ymid=winH/2;
		var m;
		var mmfTot;
		
		ctx_mmf.strokeStyle='rgba(255,0,0,0.8)';
		ctx_mmf.beginPath();
		m=Math.round(peakMagn*Math.cos(omegat));
		ctx_mmf.moveTo(x0,ymid-m);
		x=x0;
		th=0;
		mmfTot=[];
		for (var pt=1;pt<maxpts;pt++){			
			x=x+dx;
			th=th+dth;
			m=Math.round(peakMagn*Math.cos(omegat-th));
			mmfTot.push(m);
			ctx_mmf.lineTo(x,ymid-m);
		}
		ctx_mmf.stroke();
		if (option>1){
			/*plot fifth harmonic*/
			ctx_mmf.strokeStyle='rgba(0,200,0,0.8)';
			ctx_mmf.beginPath();
			m=Math.round(peakMagn*Math.cos(omegat))/5;
			ctx_mmf.moveTo(x0,ymid-m);
			x=x0;
			th=0;
			mmfTot[0]=mmfTot[0]+m;
			for (pt=1;pt<maxpts;pt++){			
				x=x+dx;
				th=th+dth;
				m=Math.round(peakMagn*Math.cos(omegat+5*th)/5);
				ctx_mmf.lineTo(x,ymid-m);
				mmfTot[pt]=mmfTot[pt]+m;
			}
			ctx_mmf.stroke();			
		}
		if (option>5){
			/*plot seventh harmonic*/
			ctx_mmf.strokeStyle='rgba(200,0,0,0.8)';
			ctx_mmf.beginPath();
			m=-Math.round(peakMagn*Math.cos(omegat))/7;
			ctx_mmf.moveTo(x0,ymid-m);
			x=x0;
			th=0;
			mmfTot[0]=mmfTot[0]+m;
			for (pt=1;pt<maxpts;pt++){			
				x=x+dx;
				th=th+dth;
				m=-Math.round(peakMagn*Math.cos(omegat-7*th)/7);
				ctx_mmf.lineTo(x,ymid-m);
				mmfTot[pt]=mmfTot[pt]+m;
			}
			ctx_mmf.stroke();			
		}
		if (option>7){
			/*plot eleventh harmonic*/
			ctx_mmf.strokeStyle='rgba(0,150,0,0.8)';
			ctx_mmf.beginPath();
			m=Math.round(peakMagn*Math.cos(omegat))/11;
			ctx_mmf.moveTo(x0,ymid-m);
			x=x0;
			th=0;
			mmfTot[0]=mmfTot[0]+m;
			for (pt=1;pt<maxpts;pt++){			
				x=x+dx;
				th=th+dth;
				m=Math.round(peakMagn*Math.cos(omegat+11*th)/11);
				ctx_mmf.lineTo(x,ymid-m);
				mmfTot[pt]=mmfTot[pt]+m;
			}
			ctx_mmf.stroke();			
		}
		if (option>11){
			/*plot 13th harmonic*/
			ctx_mmf.strokeStyle='rgba(150,0,0,0.8)';
			ctx_mmf.beginPath();
			m=-Math.round(peakMagn*Math.cos(omegat))/13;
			ctx_mmf.moveTo(x0,ymid-m);
			x=x0;
			th=0;
			mmfTot[0]=mmfTot[0]+m;
			for (pt=1;pt<maxpts;pt++){			
				x=x+dx;
				th=th+dth;
				m=-Math.round(peakMagn*Math.cos(omegat-13*th)/13);
				ctx_mmf.lineTo(x,ymid-m);
				mmfTot[pt]=mmfTot[pt]+m;
			}
			ctx_mmf.stroke();			
		}
		
		/* plot total mmf with transparency*/
		ctx_mmf.strokeStyle='rgba(0,0,255,0.8)';
		ctx_mmf.beginPath();
		m=mmfTot[0];
		ctx_mmf.moveTo(x0,ymid-m);
		x=x0;	
		for (pt=1;pt<maxpts;pt++){			
			x=x+dx;
			m=mmfTot[pt];
			ctx_mmf.lineTo(x,ymid-m);
		}
		ctx_mmf.stroke();					
		
	}

		
	
	
	
	init_mmf();
	window.addEventListener('resize',init_mmf,false);


	
	var Button1 = document.getElementById('mmf1');
	var Button5 = document.getElementById('mmf5');
	var Button7 = document.getElementById('mmf7');
	var Button11 = document.getElementById('mmf11');
	var Button13 = document.getElementById('mmf13');
	var stopmmfButton = document.getElementById('stopmmf');
	var stepmmfButton = document.getElementById('stepmmf');

    Button1.addEventListener("click", function(){
          clearInterval(id) ;
		  option=1;
		  init_mmf();
          id=setInterval(animate_mmf,tstep);
        });
	Button5.addEventListener("click", function(){
			clearInterval(id) ;
			option=5;
			init_mmf();
			id=setInterval(animate_mmf,tstep);
        });
	Button7.addEventListener("click", function(){
			clearInterval(id) ;
			option=7;
			init_mmf();
			id=setInterval(animate_mmf,tstep);
        });
	Button11.addEventListener("click", function(){
			clearInterval(id) ;
			option=11;
			init_mmf();
            id=setInterval(animate_mmf,tstep);
        });
	Button13.addEventListener("click", function(){
			clearInterval(id) ;
			option=13;
			init_mmf();
            id=setInterval(animate_mmf,tstep);
        });
    stopmmfButton.addEventListener("click", function(){
			clearInterval(id) ;
        });
	stepmmfButton.addEventListener("click", function(){
			clearInterval(id) ;
		  	frameNo++;
			if (frameNo===maxsteps+1){
				frameNo=1;
			}
			omegat=(frameNo-1)*2*Math.PI/maxsteps;
			plotharm();
        });     


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

function drawcos(ctx,xs,ys,period,mag,phase){
	'use strict';	
	var m=mag*Math.cos(phase);
	var m0=m;
	ctx.beginPath(); 
	ctx.moveTo(xs,ys-m);
	var x=0;
	while (x<period-5){ 
		x=x+5; 
		m=mag*Math.cos(2*Math.PI*x/period+phase);
		ctx.lineTo(xs+x,ys-m);
	}
	ctx.lineTo(xs+period,ys-m0);
	ctx.stroke();
}
	


