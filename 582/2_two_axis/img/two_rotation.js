// JavaScript Document
document.addEventListener('DOMContentLoaded',two_rot,false);
window.addEventListener('resize',two_rot,false);


function two_rot() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_two_rot" and the canvas to have an id="canvas_two_rot" */
/*The script plots a rotating mmf function, projected onto two axes. The axes can be stationary (x,y) or (x,-y) or can be rotating, with user control of speed of rotation and angle */
/*The animation has three boxes. Left is abc vectors and total vector. Centre is total vector, plus reference frame components. Right is time variation of ref frame components */
	
	var cont_tar=document.getElementById("canvasholder_two_rot");
	var myc_tar = document.getElementById("canvas_two_rot");

	if (null===myc_tar || !myc_tar.getContext) {
	return; 
 	}

 	var ctx_tar=myc_tar.getContext("2d");


 /*define some basic size information required for drawings
 This drawing is divided into 2 sections of equal wifth
 */
  
    var maxW=750; 
	var aspect=0.3334;
	var scale, winW, winH, width1, boxsize;
	
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing

	var th0=0;

	// have to hard code coil colors for specific cases?
	
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
	var option=1;

	// assume frequency f_e =1, and speed of rotating ref frame is given in p.u. of supply freq
	// therefore
	var f_ratio=1.0; 
	var dtheta_e=2*Math.PI/maxsteps;
	var dtheta=dtheta_e*f_ratio
	var wet=-dtheta; // increases in steps of dtheta_e
	var wt=-dtheta; // increases in steps of dtheta
	var pshift=2*Math.PI/3;

	var phasedata= [];
    // plot vectors as red black blue
	phasedata.push({r:255,g:0,  b:0    ,th:0,           label:'a'});
	phasedata.push({r:10, g:10, b:10   ,th:2*Math.PI/3, label:'b'});
	phasedata.push({r:0,  g:0,  b:255  ,th:4*Math.PI/3, label:'c'});

	var qd_old=[0,0];


	var abc=[1,-0.5,-0.5];
	var clark = math.matrix([[2/3,-1/3,-1/3],[0,-Math.sqrt(3)/3, Math.sqrt(3)/3]]);

	var cth=Math.cos(wet);
	var sth=Math.sin(wet);
	var park=math.matrix([[cth,-sth],[sth,cth]]);

	var ab;
	var qd;
	var xy=[];
	ab=math.multiply(clark, abc);
	qd=math.multiply(park, ab);

	var a =ab.get([0]);
	var b =ab.get([1]);
	var q =qd.get([0]);
	var d =qd.get([1]);

	var d0;
	var q0;
	var th0;
	

	function init_drawing(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_tar.offsetWidth;
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
		ctx_tar.canvas.width=winW;
		ctx_tar.canvas.height=winH;	
	//define font, scaleing with width
		ctx_tar.fillStyle="#000000";
		ctx_tar.font="italic 16px  Times New Roman serif";
		ctx_tar.textAlign="left";	
		ctx_tar.font = "italic "+Math.round(16*scale)+"px italic Times New Roman serif";
		
		/* canvas is divided into three equal sized boxes */
	    boxsize=winW/3;
        midxy=Math.round(boxsize/2.0);
        margin=Math.round(boxsize/50.0);
        max_ampl=midxy-margin;
        dx=(boxsize-2*margin)/maxsteps;

		
	// initialize drawing
		do_drawing();
	}
	
	function animate_drawing(){
		/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=0;
		}
		do_drawing();
		// all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
	}
	
	function do_drawing(){
		/* call the functions that draw the components of the animation*/
		 
		// update variables that change each fram
		// abc supply angles

		wet=wet+dtheta_e;
		if(wet>2*Math.PI){
			wet-2*Math.PI
		}
	    abc=[Math.cos(wet),Math.cos(wet-pshift),Math.cos(wet+pshift)];



		

		// update ref frame angle for new position
		dtheta=dtheta_e*f_ratio;
		wt=wt+dtheta;
		if(wt>2*Math.PI){
			wt-2*Math.PI
		}	
		cth=Math.cos(wt);
		sth=Math.sin(wt);
		park=math.matrix([[cth,-sth],[sth,cth]]);

		// calculate new ab, xy and qd variables

		qd_old=[qd.get([0]),qd.get([1])];
		ab=math.multiply(clark, abc);
		a =ab.get([0]);
		b =ab.get([1]);
		xy=[a,-b];
		qd=math.multiply(park, ab);


	//	q =qd.get([0]);
	//	d =qd.get([1]);

		if (frameNo===0){
			// replot the current - time axis
			plotaxes(ctx_tar, 2*boxsize, 0, boxsize, midxy, margin, max_ampl,'Time','f');
		}
		// draw the abc mmf vectors
		plotmmfabc(ctx_tar, 0, 0, boxsize, midxy, max_ampl, abc, wet, phasedata);

		if (option===1){ // plot (x,y) components of mmf
			// draw the two axis vectors as (x,y)
			q0=xy[1];
			d0=xy[0];
			th0=Math.PI/2;
			plotmmftwo(ctx_tar, boxsize, 0, boxsize, midxy, max_ampl, wet, q0,d0,th0, 'fy','fx');
			// plot (x,y) as functions of time
			plottwotime(ctx_tar, 2* boxsize, 0, midxy, margin, frameNo, max_ampl, dx, q0,d0);
		}
		if (option===2){ // plot alpha-beta components of mmf
			// draw the two axis vectors as alpha-beta
			q0=ab.get([0]);
			d0=ab.get([1]);
			th0=0;
			plotmmftwo(ctx_tar, boxsize, 0, boxsize, midxy, max_ampl, wet, q0,d0,th0,'fx','-fy');
			// plot (x,-y) as functions of time
			plottwotime(ctx_tar, 2* boxsize, 0, midxy, margin, frameNo, max_ampl, dx, q0,d0);
		}
		if (option===3){ // plot qd components of mmf in rotating ref frame
			// draw the two axis vectors as (x,-y)
			q0=qd.get([0]);
			d0=qd.get([1]);
			th0=wt;
			plotmmftwo(ctx_tar, boxsize, 0, boxsize, midxy, max_ampl, wet, q0,d0,th0, 'fq', 'fd');
			// plot (x,-y) as functions of time
			plottwotime(ctx_tar, 2* boxsize, 0, midxy, margin, frameNo, max_ampl, dx, q0,d0);
		}
	}
	
	
	init_drawing();

// check for user button presses.

    window.addEventListener('resize',init_drawing,false);
	var runButton = document.getElementById('run2A');
	var stopButton = document.getElementById('stop2A');
	var stepButton = document.getElementById('step2A');
	var xyButton = document.getElementById('xy2A');
	var abButton = document.getElementById('ab2A');
	var qdButton = document.getElementById('qd2A');

	var pwButton = document.getElementById('plusw');
	var mwButton = document.getElementById('minusw');
	var ptButton = document.getElementById('plusth');
	var mtButton = document.getElementById('minusth');

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
		do_drawing();
	});
	xyButton.addEventListener("click", function(){
		option=1 ;
    });
	abButton.addEventListener("click", function(){
		option=2 ;
    });
	qdButton.addEventListener("click", function(){
		option=3 ;
    }); 
	pwButton.addEventListener("click", function(){
		f_ratio=f_ratio+0.1;			
		if (f_ratio>1.2){
			f_ratio=1.2;
		}
        });  
	mwButton.addEventListener("click", function(){
		f_ratio=f_ratio-0.1;			
		if (f_ratio<0){
			f_ratio=0;
		}
        });
	ptButton.addEventListener("click", function(){
		wt=wt+Math.PI/36;
        });  
	mtButton.addEventListener("click", function(){
		wt=wt-Math.PI/36;
        });         
 

	function plotaxes(ctx, x0,y0, wi, mid, marg, ampl,xlabel,ylabel){
		'use strict';
	// vetical axis is on left margin of a box
		ctx.save();
		ctx.translate(x0,y0);
		ctx.clearRect(0,0,wi,wi);
		ctx.strokeStyle="#aaa";
		ctx.lineWidth=2
	// draw x-axis
		var xwidth=wi-2*marg
		ctx.translate(marg,mid) ;
		drawarrow(ctx,xwidth);
		ctx.fillText(xlabel,xwidth-30,15);
		ctx.translate(-marg,-mid) ;
	// draw y-axis
		ctx.translate(marg,wi-marg);
	// rotate by 90 degrees then draw an arrow (always draws arrows horizontally), then rotate back
		ctx.rotate(-Math.PI/2)
		drawarrow(ctx,2*ampl);
		ctx.translate(2*ampl-20,15);
		ctx.rotate(Math.PI/2)
		ctx.fillText(ylabel,0,0);
		ctx.restore();
	}
	function plotmmfabc(ctx, x0,y0, wi,mid, ampl, ft, thetae, pdata) {
		'use strict';
		var magn;
		var tt;
		
		ctx.save();
		ctx.translate(x0,y0);
		ctx.clearRect(0,0,wi,wi);
		ctx.translate(mid,mid);
		
		
		// plot light x-y lines in centre of box
		ctx.strokeStyle="#aaa"
		ctx.lineWidth=1;
		ctx.beginPath(); 
		ctx.moveTo(-ampl,0);
		ctx.lineTo(ampl,0); 
		ctx.moveTo(0,-ampl); 
		ctx.lineTo(0,ampl); 
		ctx.stroke();

		ctx.lineWidth=3;
	
			// draw sum total mmf
		ctx.save();
		ctx.rotate(-thetae);
		ctx.strokeStyle="#007700";
		ctx.lineWidth=3;
		magn=0.9*ampl
		drawarrow(ctx,magn);
		ctx.translate(magn,5);
		ctx.rotate(thetae);
		ctx.fillText('ft',0,10);
		ctx.restore();

		for (let ph = 0; ph < 3; ph++) {
			// draw phase mmf
			ctx.save();
			magn=0.6*ampl*ft[ph]
			tt=-ph*Math.PI*2/3
			
			if (magn<0){
				magn=-magn;
				tt=tt+Math.PI
			}
			ctx.rotate(tt); 
			ctx.strokeStyle="rgb("+ Math.round(pdata[ph].r) +","+ Math.round(pdata[ph].g) +","+ Math.round(pdata[ph].b) +")";
			drawarrow(ctx,magn);
			ctx.translate(magn+10,0);
			ctx.rotate(-tt);
			ctx.fillText(pdata[ph].label,0,0);
			ctx.restore();
		}
		ctx.restore();
	}
	function plotmmftwo(ctx, x0,y0, wi, mid, ampl, thetae, f0, f1, theta, qlabel,dlabel) {
		'use strict';

		ctx.save();
		ctx.translate(x0,y0);
		ctx.clearRect(0,0,wi,wi);
		ctx.translate(mid,mid);
		var magn;
		// plot light x-y lines in centre of box
		ctx.strokeStyle="#aaa"
		ctx.lineWidth=1;
		ctx.beginPath(); 
		ctx.moveTo(-ampl,0);
		ctx.lineTo(ampl,0); 
		ctx.moveTo(0,-ampl); 
		ctx.lineTo(0,ampl); 
		ctx.stroke();

		ctx.lineWidth=3;
	
			// draw sum total mmf
		ctx.save();
		ctx.rotate(-thetae);
		ctx.strokeStyle="#007700";
		ctx.lineWidth=3;
		magn=0.9*ampl
		drawarrow(ctx,magn);
		ctx.translate(magn,5);
		ctx.rotate(thetae);
		ctx.fillText('ft',0,10);
		ctx.restore();

		// draw dq components, with unit vector on top
		// q axis
		ctx.save();
		magn=0.6*ampl*f0;
		var tt = -theta;
		if (magn<0){
			magn=-magn;
			tt=tt+Math.PI;
		}
		ctx.rotate(tt); // need to rotate negative,  moving canvas relative to phase
		ctx.strokeStyle="#b47b00";
		drawarrow(ctx,magn);
		ctx.translate(magn+5,0);
		ctx.rotate(-tt);
		ctx.fillText(qlabel,0,0);
		ctx.restore();
		ctx.save();
		ctx.lineWidth=1;
		ctx.strokeStyle="#666";
		ctx.rotate(-theta);
		drawarrow(ctx,ampl/5);
		ctx.restore();

		// d axis
		ctx.save();
		magn=0.6*ampl*f1
		tt=-theta+Math.PI/2
		if (magn<0){
			magn=-magn;
			tt=tt+Math.PI;
		}
		ctx.rotate(tt); // need to rotate negative,  moving canvas relative to phase
		ctx.strokeStyle="#8c0177";
		drawarrow(ctx,magn);
		ctx.translate(magn+5,0);
		ctx.rotate(-tt);
		ctx.fillText(dlabel,0,0);
		ctx.restore();
		ctx.save();
		ctx.lineWidth=1;
		ctx.strokeStyle="#666";
		ctx.rotate(-theta+Math.PI/2);
		drawarrow(ctx,ampl/5);
		ctx.restore();

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

	function plottwotime(ctx, x0,y0, mid, marg, fn, ampl, dx, f0,f1){
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

		ctx.lineWidth=3;

		y_0=-0.6*ampl * f0;
		ctx.strokeStyle="#b47b00";
		ctx.beginPath();
		ctx.moveTo(x_0,y_0);
		ctx.lineTo(x_1,y_0);
		ctx.stroke();
		y_1=-0.6*ampl * f1;
		ctx.strokeStyle="#8c0177";
		ctx.beginPath();
		ctx.moveTo(x_0,y_1);
		ctx.lineTo(x_1,y_1);
		ctx.stroke();

		ctx.restore();
	}

}