// JavaScript Document
document.addEventListener('DOMContentLoaded',single_phasors,false);
window.addEventListener('resize',single_phasors,false);

function single_phasors() {
	'use strict';
		
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_1pac" 
    and the canvas to have an id="canvas_ipac" */

/*The script plots ac voltage and current phasors on the left, rotating vectors in the centre and time fucntions of
votlage and current on the right. Buttons (in the corresponding html code) allow the animation to be started, 
stopped or stepped through*/	
	

	var cont_1pac=document.getElementById("canvasholder_1pac");
	var myc_1pac = document.getElementById("canvas_1pac");

	if (null===myc_1pac || !myc_1pac.getContext) {
	return; 
 	}

 	var ctx_1pac=myc_1pac.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 square sections; 
 */
  
    var maxW=900; 
	var aspect=0.333;
	var scale, winW, winH, width1, boxsize;
	
 // define font sizes, scaled with width; initial scale is 1.0
    scale=1.0;
 	ctx_1pac.fillStyle="#000000";
	ctx_1pac.font="14px sans-serif";
 	ctx_1pac.textAlign="left";	
 	ctx_1pac.font = " "+Math.round(14*scale)+"px sans-serif";
 
	
 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; each section width 
 is equal to the drawing height
 */
	

// finished init of canvas, now init drawing
    // voltage and current phase angles
	var thv=45/360;
    var thi=-30/360

	// have to hard code coil colors for specific cases
	var phasordata ;	
    phasordata= [];
    // plot voltage as red, current as blue, using different brightnesses
    phasordata.push({r:255,g:0, b:0  , m:1.0, th:thv*2*Math.PI,label:'V'});
    phasordata.push({r:0,  g:0, b:192, m:0.8, th:thi*2*Math.PI,label:'I'});

    var vector_new ;
    vector_new =[];
    vector_new.push({th:thv*2*Math.PI, re:Math.cos(thv*2*Math.PI)});
    vector_new.push({th:thi*2*Math.PI, re:Math.cos(thi*2*Math.PI)});
    var vector_old;
    vector_old = [];
    vector_old.push({th:thv*2*Math.PI, re:Math.cos(thv*2*Math.PI)});
    vector_old.push({th:thi*2*Math.PI, re:Math.cos(thi*2*Math.PI)});

    // animation repeats after 2 cycles
    var maxsteps=180;
    var dtheta=4*Math.PI/maxsteps 
	var omegat=0;
	var frameNo=0;
	var tstep=50;
	var id;
    var boxsize;
    var midxy;
	var margin;
    var max_ampl;
    var dx;
	
	function init_drawing(){
	 /* find the containter size and set the canvas size*/ 
		
		width1=cont_1pac.offsetWidth;
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
		ctx_1pac.canvas.width=winW;
		ctx_1pac.canvas.height=winH;	
		
		/* canvas is divided into three square boxes*/
	    boxsize=winW/3;
        midxy=Math.round(boxsize/2.0);
        margin=Math.round(boxsize/50.0);
        max_ampl=midxy-margin;
        dx=2*max_ampl/maxsteps;
		
	// draw phasor and intial drawing, once
		do_drawing();
	}
	
	function animate_drawing(){
		/*sets up an interval loop that calls do_drawing*/
		frameNo++;
		if (frameNo===maxsteps){
			frameNo=0;
		}
		omegat=frameNo*dtheta;
		do_drawing();

	
	}
	
    function do_drawing(){
		/* call the functions that draw the components of the animation*/
     // all routines are passed context, x0,y0 (top left), width, then info on time, draw options and coils
        

        vector_old[0].th=thv*2*Math.PI+omegat-dtheta;
        vector_old[1].th=thi*2*Math.PI+omegat-dtheta;
        vector_old[0].re=Math.cos(thv*2*Math.PI+omegat-dtheta);
        vector_old[1].re=Math.cos(thi*2*Math.PI+omegat-dtheta); 

        vector_new[0].th=thv*2*Math.PI+omegat;
        vector_new[1].th=thi*2*Math.PI+omegat;
        vector_new[0].re=Math.cos(thv*2*Math.PI+omegat);
        vector_new[1].re=Math.cos(thi*2*Math.PI+omegat);

		if(frameNo===0){
            
            // plot all axes with y-axis centered in image
            // plotaxes takes (context, x0, y0, size, midpoint, margin, axes size)
            // lhs
            plotaxes(ctx_1pac, 0,0, boxsize, midxy, margin, max_ampl,'Re','Im');
            // plot phasors, these dont change with time 
            plotphasors(ctx_1pac, 0, 0, midxy, phasordata, max_ampl);
            // centre
            plotaxes(ctx_1pac, boxsize, 0, boxsize, midxy, margin, max_ampl,'Re','Im');
            // rhs 
            plotaxes(ctx_1pac, 2*boxsize, 0, boxsize, midxy, margin, max_ampl,'t','V,I');
            // add time labels to time plot
            timelabels(ctx_1pac, 2*boxsize, 0, boxsize, midxy, margin,  thv, thi);
        }
        // update current plot each timestep
        plotcurrent(ctx_1pac, 2*boxsize, 0, midxy, margin, frameNo, max_ampl, dx, phasordata, vector_new, vector_old);
        // have to replot vector axes each time step as whole plot is overwritten
        plotaxes(ctx_1pac, boxsize, 0, boxsize, midxy, margin, max_ampl,'Re','Im');
        plotvectors(ctx_1pac, boxsize, 0, midxy, max_ampl, phasordata, vector_new);	
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
 }

 function plotaxes(ctx, x0,y0, wi, mid, marg, ampl,xlabel,ylabel){
	'use strict';
// rhs axes are centred in a box
	ctx.save();
    ctx.clearRect(x0,y0,wi,wi);
    ctx.strokeStyle="#777";
    ctx.lineWidth=2
	ctx.translate(x0,y0);
// draw x-axis
    ctx.translate(marg,mid) ;
    drawarrow(ctx,2*ampl);
    ctx.fillText(xlabel,2*ampl-20,10);
    ctx.translate(-marg,-mid) ;
// draw y-axis
	ctx.translate(mid,wi-marg);
// rotate by 90 degrees then draw an arrow (always draws arrows horizontally), then rotate back
    ctx.rotate(-Math.PI/2)
    drawarrow(ctx,2*ampl);
    ctx.fillText(ylabel,2*ampl-20,-10);
    ctx.rotate(Math.PI/2)
    ctx.restore();
 }

  function timelabels(ctx, x0, y0, hi, mid, marg, thv, thi){
// plot labels for thv and thi
    ctx.save();
    ctx.translate(x0,y0);
    ctx.fillText("-\u03b8"+"v",mid*(1-thv)-5,hi-marg);
    ctx.fillText("-\u03b8"+"i",mid*(1-thi)-5,hi-marg);
// plot lines for thv and thi
    
    ctx.strokeStyle="#aaa";
   
    ctx.beginPath();
    ctx.moveTo(mid*(1-thv),marg);
    ctx.lineTo(mid*(1-thv),hi-2*marg);
    ctx.moveTo(mid*(1-thi),marg);
    ctx.lineTo(mid*(1-thi),hi-2*marg);
    ctx.stroke();
    ctx.restore();

}


function plotphasors(ctx, x0,y0, mid, pdata, ampl) {
	'use strict';
    var magn;

	ctx.save();
	ctx.translate(x0,y0);
	ctx.translate(mid,mid);
    

    for (var i=0;i<2;i++){
        ctx.save();
        magn=Math.round(ampl*pdata[i].m/1.41)
        ctx.strokeStyle="rgb("+ pdata[i].r +","+ pdata[i].g +","+ pdata[i].b +")";
        ctx.rotate(-pdata[i].th);
        drawarrow(ctx,magn);
        ctx.translate(magn+5,0);
        ctx.rotate(pdata[i].th);
        ctx.fillStyle="rgb("+ pdata[i].r +","+ pdata[i].g +","+ pdata[i].b +")";
        ctx.fillText(pdata[i].label,0,0);
        ctx.restore();
    }
    ctx.restore();
}

function plotcurrent(ctx, x0,y0, mid, marg, fn, ampl, dx, pdata, vnew, vold){
	'use strict';
	//move canvas origin to last data point

	ctx.save();
	ctx.translate(x0,y0);
    ctx.translate(0,mid)

    var x=fn*dx;
    var x_1;
    var x_0;

    x_1=mid+x-ampl;
    x_0=mid+x-ampl-dx;

    var y_0;
    var y_1;

    for (var j=0;j<2;j++){

        y_0=-ampl * pdata[j].m * vold[j].re;
        y_1=-ampl * pdata[j].m * vnew[j].re;
 
        ctx.strokeStyle="rgb("+ pdata[j].r +","+ pdata[j].g +","+ pdata[j].b +")";
        ctx.beginPath();
        ctx.moveTo(x_0,y_0);
        ctx.lineTo(x_1,y_1);
        ctx.stroke();
    } 
    ctx.restore();
}

function plotvectors(ctx, x0,y0, mid, ampl, pdata,vnew) {
	'use strict';
    var magn;

	ctx.save();
	ctx.translate(x0,y0);
	ctx.translate(mid,mid);
    

    for (var i=0;i<2;i++){
        ctx.save();
        magn=ampl*pdata[i].m
        ctx.strokeStyle="rgb("+ pdata[i].r +","+ pdata[i].g +","+ pdata[i].b +")";
        ctx.rotate(-vnew[i].th);
        drawarrow(ctx,magn);
        ctx.translate(magn-5,15);
        ctx.rotate(vnew[i].th);
        ctx.fillStyle="rgb("+ pdata[i].r +","+ pdata[i].g +","+ pdata[i].b +")";
        ctx.fillText(pdata[i].label,0,0);
        ctx.restore();
    }
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


	


