// JavaScript Document

document.addEventListener('DOMContentLoaded',plot_1p,false);
window.addEventListener('resize',plot_1p,false);
function plot_1p(){
  		'use strict';
   //the rest of the function


	var cont_1p = document.getElementById("canvasholder_plot_1p");
	var canvas_1p = document.getElementById("canvas_plot_1p");
 	if (null===canvas_1p || !canvas_1p.getContext) {
 		return; 
 	}
 	var ctx_1p=canvas_1p.getContext("2d");	
	
	
	/* find the width of the containerthat holds the canvas. This is needed to re-size the canvas for different page sizes 
	*/
	
	
 	var contW=cont_1p.offsetWidth;


 	/*define some basic size information required for drawings. Max canvas width is set to 460px and aspect ratio is 1
 	*/
  
	
    var maxW=460; var aspect=1.0;
	var scale, canW, canH;
	
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
	ctx_1p.canvas.width=canW;
	ctx_1p.canvas.height=canH;
	
	/* define midpoint hoizontally and a 1:20 wide grid*/
	var midX=canW/2;
	var gridSize=canW/20;
	
	/* Have now determined the size of the canvas set some drawing defaults */

 	ctx_1p.fillStyle="#000000";
	ctx_1p.font="12px sans-serif";
 	ctx_1p.textAlign="left";	
 	ctx_1p.font = " "+Math.round(12*scale)+"px sans-serif";
 

// finished init of canvas, now init drawing
	
	/*draw a white box for the entire canvas*/
	ctx_1p.fillStyle="#FFFFFF";
    ctx_1p.fillRect(1,1,canW,canH); 
	ctx_1p.fillStyle="#000000";


	
	
	/* Canvas is split into three zones
	1) top gives data on V, I, S, theta, pf, P, Q, parameters
	Use top 6 grid lines for this
	2) Centre draw the plot
	Use grid lines 8-16 for this
	3) The slide for the theta input is at the bottom
	Use grid lines 17-20 for this
	
	Note have to draw the slider first to get a flux value that is used in top 2 secions
	function drawrangecontrol calls functions to draw other data*/
	
	/* Define Armature Cicruit Parameters and calculate nominal plot data*/
	var acData={Vpk:2.82842,Ipk:1.4142,theta:0};
	acData.V=acData.Vpk/Math.sqrt(2);
	acData.I=acData.Ipk/Math.sqrt(2);
	acData.VIpk=acData.Vpk*acData.Ipk;
	acData.S=acData.VIpk/2;
	acData.pf=Math.cos(acData.theta);
	acData.P=acData.S*acData.pf;
	acData.Q=-acData.S*Math.sin(acData.theta);
	
	var thetaMin = -Math.PI/2;
	var thetaMax = Math.PI/2;

	/* Define axes position and value scales */
	
	var axes={xmin:2*gridSize, xmax:canW-2*gridSize, ymin:8*gridSize, ymax:15*gridSize};
	axes.ymid=(axes.ymin+axes.ymax)/2;
	axes.yvalMin=-5;
	axes.yvalMax=5;
	axes.xvalMin=0;
	axes.xvalMax=Math.PI*4;
	axes.width=axes.xmax-axes.xmin;
	axes.height=axes.ymax-axes.ymin;
	axes.deltaxval=axes.xvalMax-axes.xvalMin;
	axes.deltayval=axes.yvalMax-axes.yvalMin;
	axes.labelx = axes.xmin;
	axes.labely = axes.ymax+gridSize;
	
	
	
	

	
	/* see code at bottom of function for slider implementation*/
	/* inputs are top x,y, width, height, output_min output_max */
	
	var range=makeRangeControl(midX-midX/2,canH-1.5*gridSize,midX,0.5*gridSize, thetaMin,thetaMax);
	
	/* beacuse the slider is the input to the diagram, to initialise the diagram need to call the function to draw the slider, which in turn calls the function to draw the rest of the canvas: drawMain */
	
	drawRangeControl(range);	
	
	function drawMain(){
		acData.theta=range.value;
		acData.thetaDeg=acData.theta*180/Math.PI;
		/* Report main information on Model Parameters */
		ctx_1p.textAlign='right';
        ctx_1p.textBaseline='top';
		ctx_1p.fillStyle="#660000";
		ctx_1p.fillText('Defined & Values Input',6.5*gridSize,gridSize);
		ctx_1p.fillStyle="#000000";
		ctx_1p.fillText('RMS Voltage',6.5*gridSize,2*gridSize);
		ctx_1p.fillText('RMS Current', 6.5*gridSize,3*gridSize);
		ctx_1p.fillText('Apparent Power' , 6.5*gridSize, 4*gridSize);
		ctx_1p.fillText('phase angle \u03B8',6.5*gridSize,5*gridSize);
		
		ctx_1p.textAlign='left';
		ctx_1p.fillText(acData.V.toFixed(2) +' V',7*gridSize,2*gridSize);
		ctx_1p.fillText(acData.I.toFixed(2) +' A', 7*gridSize,3*gridSize);
		ctx_1p.fillText(acData.S.toFixed(2)+' VA', 7*gridSize, 4*gridSize);
		ctx_1p.fillText(acData.thetaDeg.toFixed(2),7*gridSize,5*gridSize);
		
		
		acData.pf=Math.cos(acData.theta);
		acData.P=acData.S*acData.pf;
		acData.Q=-acData.S*Math.sin(acData.theta);
		
		ctx_1p.textAlign='right';
		ctx_1p.fillStyle="#660000";
		ctx_1p.fillText('Calculated Values',15.5*gridSize,gridSize);
		ctx_1p.fillStyle="#000000";
		ctx_1p.fillText('Power factor',15.5*gridSize,2*gridSize);
		ctx_1p.fillText('Power', 15.5*gridSize,3*gridSize);
		ctx_1p.fillText('Reactive Power' , 15.5*gridSize, 4*gridSize);
		ctx_1p.textAlign='left';
		ctx_1p.fillStyle="#FF0000";
		ctx_1p.fillText(acData.pf.toFixed(3),16*gridSize,2*gridSize);
		ctx_1p.fillText(acData.P.toFixed(2)+' W', 16*gridSize,3*gridSize);
		ctx_1p.fillText(acData.Q.toFixed(2)+' VAR', 16*gridSize, 4*gridSize);

		
		
		
		/* Now draw axes and plot torque vs speed.
		Draw two plots, back ground with nominal kphi, then new plot as slider is moved
		*/
		

		/* plot axes, and label them*/
		
		ctx_1p.fillStyle="#000000";
		ctx_1p.textAlign='right';
		ctx_1p.fillText('Theta',axes.xmax, axes.ymid+gridSize);
		
		ctx_1p.strokeStyle='#000000';
		ctx_1p.beginPath();
		ctx_1p.moveTo(axes.xmin,axes.ymin);
		ctx_1p.lineTo(axes.xmin-3*scale,axes.ymin+3*scale);
		ctx_1p.lineTo(axes.xmin+3*scale,axes.ymin+3*scale);
		ctx_1p.lineTo(axes.xmin,axes.ymin);
		ctx_1p.lineTo(axes.xmin,axes.ymax);
		ctx_1p.moveTo(axes.xmin,axes.ymid);
		ctx_1p.lineTo(axes.xmax,axes.ymid);
		ctx_1p.lineTo(axes.xmax-3*scale,axes.ymid-3*scale);
		ctx_1p.lineTo(axes.xmax-3*scale,axes.ymid+3*scale);
		ctx_1p.lineTo(axes.xmax,axes.ymid);
		ctx_1p.stroke();
		
		/* plot Voltage and create label*/
		
		ctx_1p.beginPath();
		ctx_1p.strokeStyle='#0000FF';
		var npoints=51;
		var dtheta = 4*Math.PI/(npoints-1);
		var wt=0;
		var volts=acData.Vpk*Math.cos(wt);
		var x0=axes.xmin+wt/axes.deltaxval*axes.width;
		var y0=axes.ymid-volts/axes.deltayval*axes.height;
		ctx_1p.moveTo(x0,y0);
		for (var i = 1; i < npoints; i++) {
			wt=i*dtheta;
			volts=acData.Vpk*Math.cos(wt);
			x0=axes.xmin+wt/axes.deltaxval*axes.width;
			y0=axes.ymid-volts/axes.deltayval*axes.height;			
    		ctx_1p.lineTo(x0,y0);
		}	    
		ctx_1p.stroke();
		/* make a label */
		ctx_1p.moveTo(axes.labelx,axes.labely);
		ctx_1p.lineTo(axes.labelx+gridSize,axes.labely);
		ctx_1p.stroke();
		ctx_1p.fillStyle="#000000";
		ctx_1p.textAlign='left';
		ctx_1p.fillText('v (\u03C9t)',axes.labelx+1.5*gridSize, axes.labely-0.25*gridSize);
		ctx_1p.stroke();
		
		
		/* plot Current and create label*/
		ctx_1p.beginPath();
		ctx_1p.strokeStyle='#FF0000';

		wt=0;
		var curr=acData.Ipk*Math.cos(wt+acData.theta);
		x0=axes.xmin+wt/axes.deltaxval*axes.width;
		y0=axes.ymid-curr/axes.deltayval*axes.height;
		ctx_1p.moveTo(x0,y0);
		for (i = 1; i < npoints; i++) {
			wt=i*dtheta;
			curr=acData.Ipk*Math.cos(wt+acData.theta);
			x0=axes.xmin+wt/axes.deltaxval*axes.width;
			y0=axes.ymid-curr/axes.deltayval*axes.height;			
    		ctx_1p.lineTo(x0,y0);
		}	    
		ctx_1p.stroke();
		/* make a label */
		ctx_1p.moveTo(axes.labelx+4*gridSize,axes.labely);
		ctx_1p.lineTo(axes.labelx+5*gridSize,axes.labely);
		ctx_1p.stroke();
		ctx_1p.fillStyle="#000000";
		ctx_1p.textAlign='left';
		ctx_1p.fillText('i (\u03C9t)',axes.labelx+5.5*gridSize, axes.labely-0.25*gridSize);
		ctx_1p.stroke();
				
		
		/* plot power and create label*/
		ctx_1p.beginPath();
		ctx_1p.strokeStyle='#880088';

		wt=0;
		var pow=acData.Vpk*Math.cos(wt)*acData.Ipk*Math.cos(wt+acData.theta);
		x0=axes.xmin+wt/axes.deltaxval*axes.width;
		y0=axes.ymid-pow/axes.deltayval*axes.height;
		ctx_1p.moveTo(x0,y0);
		for (i = 1; i < npoints; i++) {
			wt=i*dtheta;
			pow=acData.Vpk*Math.cos(wt)*acData.Ipk*Math.cos(wt+acData.theta);
			x0=axes.xmin+wt/axes.deltaxval*axes.width;
			y0=axes.ymid-pow/axes.deltayval*axes.height;			
    		ctx_1p.lineTo(x0,y0);
		}	    
		ctx_1p.stroke();
		/* make a label */
		ctx_1p.moveTo(axes.labelx+7*gridSize,axes.labely);
		ctx_1p.lineTo(axes.labelx+8*gridSize,axes.labely);
		ctx_1p.stroke();
		ctx_1p.fillStyle="#000000";
		ctx_1p.textAlign='left';
		ctx_1p.fillText('p (\u03C9t)',axes.labelx+8.5*gridSize, axes.labely-0.25*gridSize);
		ctx_1p.stroke();
				
		
		
		ctx_1p.fillStyle="#000000";
		ctx_1p.textAlign='left';
		ctx_1p.fillText('Use the slider below to increase or decrese \u03B8 ',gridSize, 17*gridSize);	
		
		
			
		
	}
	
	/* the canvas is re-drawn by the mousehandler events which calls drawRangeConrol*/
	/* if the page is re-sized, this entire routine is called again by the html page. */


	
/* the rest of the routine below is to implement a slider for a range input. This code can be reused in other applications but in this case, the slider returns a scaling factor fto vary the flux in the DC machine equations*/	
	
	
	/* reOffset  finds the x,y, co-ordinates of the top left corner of the canvas, so that we can subtract that from the mousehandler and get the local co-ordinates within the canvas. This is put into a fucntion to make sure that*/
	function reOffset_1p(){
    	var BB=canvas_1p.getBoundingClientRect();
    	offsetX=BB.left;
    	offsetY=BB.top;        
	}
	var offsetX,offsetY;
	
	
    reOffset_1p();
	window.addEventListener('scroll',reOffset_1p,false);
	
	window.onscroll=function(e){ reOffset_1p(); };
	window.onresize=function(e){ reOffset_1p(); }; 

	var isDown=false;

	canvas_1p.onmousedown=(function(e){handleMouseDown(e);});
	canvas_1p.onmousemove=(function(e){handleMouseMove(e);});
	canvas_1p.onmouseup=(function(e){handleMouseUpOut(e);});
	canvas_1p.onmouseout=(function(e){handleMouseUpOut(e);});

	  
	/* define Range Control position by top left corner*/
function makeRangeControl(x,y,width,height,minval,maxval){
    var range={x:x,y:y,width:width,height:height, minval:minval, maxval:maxval};
	/* variables that are used for definfing the coordinates to draw the slider*/
	range.xmin=range.x;
	range.xmax=range.x+range.width;
	/* remeber ymin is the top, ymax is the bottom*/
	range.ymin=range.y;
    range.ymax=range.y+range.height;
    //
	/* variable that define the output of whatver the slider is controling*/
    range.pct=0.50;
	range.delta=range.maxval-range.minval;
	range.value=range.pct*range.delta+range.minval;
    return(range);
}

	
function drawRangeControl(range){
	/* Clear Canvas*/
    ctx_1p.clearRect(0,0,canW, canH);
	/* draw white background for now */
	ctx_1p.fillStyle='#FFFFFF';
	ctx_1p.fillRect(0,0,canW, canH);

	    
    // bar
	ctx_1p.fillStyle='#ddddff';
	ctx_1p.fillRect(range.xmin,range.ymin, range.width, range.height);
    ctx_1p.lineWidth=2;
    ctx_1p.lineCap='round';
    ctx_1p.beginPath();
	ctx_1p.rect(range.xmin,range.ymin, range.width, range.height);
    ctx_1p.strokeStyle='black';
    ctx_1p.stroke();
	ctx_1p.beginPath();
	ctx_1p.moveTo((range.xmax+range.xmin)/2, range.ymin);
	ctx_1p.lineTo((range.xmax+range.xmin)/2, range.ymin+range.height);
	ctx_1p.strokeStyle='rgba(0,0,255,0.75)';
	ctx_1p.stroke();
	ctx_1p.fillStyle="#000000";
	ctx_1p.textAlign='center';
	ctx_1p.textBaseline='top';
	ctx_1p.fillText('Zero',(range.xmax+range.xmin)/2, range.ymin-1.5*range.height);
    // thumb
    ctx_1p.beginPath();
    var thumbX=range.x+range.width*range.pct;
    ctx_1p.moveTo(thumbX,range.ymin);
    ctx_1p.lineTo(thumbX,range.ymax);
    ctx_1p.strokeStyle='rgba(255,0,0,0.75)';
    ctx_1p.stroke();

	/* finished redraeinf contoller slider, now execute rest of the canvas*/
	drawMain();
}

	function handleMouseDown(e){
	  // tell the browser we're handling this event
	  e.preventDefault();
	  e.stopPropagation();
	  // get mouse position
	  var mx=parseInt(e.clientX-offsetX);
	  var my=parseInt(e.clientY-offsetY);
	  // test for possible start of dragging
	  isDown=(mx>range.xmin && mx<range.xmax && my>range.ymin && my<range.ymax);
	}

	function handleMouseUpOut(e){
	  // tell the browser we're handling this event
	  e.preventDefault();
	  e.stopPropagation();
	  // stop dragging
	  isDown=false;
	}

	function handleMouseMove(e){
	  if(!isDown){return;}
	  // tell the browser we're handling this event
	  e.preventDefault();
	  e.stopPropagation();
	  // get mouse position
	  var mouseX=parseInt(e.clientX-offsetX);
	/*  var mouseY=parseInt(e.clientY-offsetY); */ 
	  // set new thumb & redraw
	  range.pct=Math.max(0,Math.min(1,(mouseX-range.x)/range.width));
	  range.value=range.pct*range.delta+range.minval;
	  
	  drawRangeControl(range);
	  
	}

}