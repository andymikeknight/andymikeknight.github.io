// JavaScript Document

document.addEventListener('DOMContentLoaded',seriesplot,false);
window.addEventListener('resize',seriesplot,false);
function seriesplot(){
  		'use strict';
   //the rest of the function


	var container = document.getElementById("seriescanvasholder");
	var myc = document.getElementById("seriesplot");
 	if (null===myc || !myc.getContext) {
 		return; 
 	}
 	var ctx=myc.getContext("2d");	
	
	
	/* find the width of the container that holds the canvas. This is needed to re-size the canvas for different page sizes 
	*/
	
	
 	var contW=container.offsetWidth;


 	/*define some basic size information required for drawings. Max canvas width is set to 450px and aspect ratio is 2
 	*/
  
	
    var maxW=460; var aspect=1;
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
	ctx.canvas.width=canW;
	ctx.canvas.height=canH;
	
	/* define midpoint hoizontally and a 1:20 wide grid*/
	var midX=canW/2;
	var gridSize=canW/20;
	
	/* Have now determined the size of the canvas set some drawing defaults */

 	ctx.fillStyle="#000000";
	ctx.font="12px sans-serif";
 	ctx.textAlign="left";	
 	ctx.font = " "+Math.round(12*scale)+"px sans-serif";
 

// finished init of canvas, now init drawing
	
	/* draw a white box for the entire canvas
	ctx.fillStyle="#FFFFFF";
    ctx.fillRect(1,1,canW,canH); */
	ctx.fillStyle="#000000";


	
	
	/* Canvas is split into three zones
	1) top gives data on machine armature circuit parameters
	Use top 6 grid lines for this
	2) Centre draw the plot
	Use grid lines 8-16 for this
	3) The slide for the flux input is at the bottom
	Use grid lines 17-20 for this
	
	Note have to draw the slider first to get a flux value that is used in top 2 secions
	function drawrangecontrol calls functions to draw other data*/
	
	/* Define Armature Cicruit Parameters and calculate nominal plot data*/
	var motorData={kc:0.05,R_S:1,I_max:10,V_T_Nom:60};
	
	motorData.t_s_Nom=motorData.kc*(motorData.V_T_Nom/motorData.R_S)*(motorData.V_T_Nom/motorData.R_S);
	motorData.t_Nom=motorData.kc*motorData.I_max*motorData.I_max;
	motorData.omega_Nom=motorData.V_T_Nom/Math.sqrt(motorData.kc)/Math.sqrt(motorData.t_Nom)-motorData.R_S/motorData.kc;
	motorData.nm_Nom=motorData.omega_Nom*30/Math.PI;
	

	
	var V_TMin = 0;
	var V_TMax = motorData.V_T_Nom;

	/* Define axes position and value scales */
	
	var axes={xmin:2*gridSize, xmax:canW-2*gridSize, ymin:8*gridSize, ymax:15*gridSize};
	axes.yvalMin=0;
	axes.yvalMax=motorData.omega_Nom*1.2;
	axes.xvalMin=0;
	axes.xvalMax=motorData.t_s_Nom*1.2;
	axes.width=axes.xmax-axes.xmin;
	axes.height=axes.ymax-axes.ymin;
	axes.deltaxval=axes.xvalMax-axes.xvalMin;
	axes.deltayval=axes.yvalMax-axes.yvalMin;
	axes.labelx = midX;
	axes.labely = axes.ymin;
	
	
	
	

	
	/* see code at bottom of function for slider implementation*/
	/* inputs are top x,y, width, height, output_min output_max */
	
	var range=makeRangeControl(midX-midX/2,canH-1.5*gridSize,midX,0.5*gridSize, V_TMin,V_TMax);
	
	/* beacuse the slider is the input to the diagram, call the function to draw the slider, which in turn calls the function to draw the rest of the canvas: drawMain */
	
	drawRangeControl(range);	
	
	function drawMain(){
		motorData.V_T=range.value;
		/* Report main information on Motor Parameters */
		ctx.textAlign='right';
        ctx.textBaseline='top';
		ctx.fillStyle="#660000";
		ctx.fillText('Defined Inputs & Values',6.5*gridSize,gridSize);
		ctx.fillStyle="#000000";
		ctx.fillText('Nomonal Terminal Voltage',6.5*gridSize,2*gridSize);
		ctx.fillText('R_A + R_S', 6.5*gridSize,3*gridSize);
		ctx.fillText('Max Armature Current' , 6.5*gridSize, 4*gridSize);
		ctx.fillText('kc',6.5*gridSize,5*gridSize);
		
		ctx.textAlign='left';
		ctx.fillText(motorData.V_T_Nom.toFixed(1) +' V',7*gridSize,2*gridSize);
		ctx.fillText(motorData.R_S.toFixed(2) +' \u03A9', 7*gridSize,3*gridSize);
		ctx.fillText(motorData.I_max.toFixed(1)+' \A', 7*gridSize, 4*gridSize);
		ctx.fillText(motorData.kc.toFixed(3),7*gridSize,5*gridSize);
		
		
		motorData.t_s=motorData.kc*(motorData.V_T/motorData.R_S)*(motorData.V_T/motorData.R_S);
		
		ctx.textAlign='right';
		ctx.fillStyle="#660000";
		ctx.fillText('Calculated Values',15.5*gridSize,gridSize);
		ctx.fillStyle="#000000";
		ctx.fillText('Nominal Standstill Torque',15.5*gridSize,2*gridSize);
		ctx.fillText('Rated Torque', 15.5*gridSize,3*gridSize);
		ctx.fillText('Rated Speed' , 15.5*gridSize, 4*gridSize);
		ctx.fillText('Termial Voltage Input',15.5*gridSize,5*gridSize);
		ctx.fillText('Standstill Torque',15.5*gridSize,6*gridSize);
		ctx.textAlign='left';
		ctx.fillStyle="#FF0000";
		ctx.fillText(motorData.t_s_Nom.toFixed(1)+' N m' , 16*gridSize,2*gridSize);
		ctx.fillText(motorData.t_Nom.toFixed(1)+' N m'   , 16*gridSize,3*gridSize);
		ctx.fillText(motorData.nm_Nom.toFixed(0)+' rpm'   , 16*gridSize,4*gridSize);
		ctx.fillText( motorData.V_T.toFixed(1)+' V'      , 16*gridSize,5*gridSize);
		ctx.fillText(motorData.t_s.toFixed(1)+' N m'    , 16*gridSize,6*gridSize);
		
	
		
		/* Now draw axes and plot torque vs speed.
		Draw two plots, back ground with nominal kphi, then new plot as slider is moved
		*/
		

		/* plot axes, and label them*/
		
		ctx.fillStyle="#000000";
		ctx.textAlign='left';
		ctx.fillText('Speed (rpm)',axes.xmin, axes.ymin-gridSize);
		ctx.textAlign='right';
		ctx.fillText('Torque (N m)',axes.xmax, axes.ymax+gridSize);
		
		ctx.strokeStyle='#000000';
		ctx.beginPath();
		ctx.moveTo(axes.xmin,axes.ymin);
		ctx.lineTo(axes.xmin-3*scale,axes.ymin+3*scale);
		ctx.lineTo(axes.xmin+3*scale,axes.ymin+3*scale);
		ctx.lineTo(axes.xmin,axes.ymin);
		ctx.lineTo(axes.xmin,axes.ymax);
		ctx.lineTo(axes.xmax,axes.ymax);
		ctx.lineTo(axes.xmax-3*scale,axes.ymax-3*scale);
		ctx.lineTo(axes.xmax-3*scale,axes.ymax+3*scale);
		ctx.lineTo(axes.xmax,axes.ymax);
		ctx.stroke();
		
		/* plot nominal performance in 20 steps and create label*/
		/* need to calculate torque as function of speed range, then keep speed range constant for updated plot */
		
		
		
		ctx.beginPath();
		ctx.strokeStyle='rgba(0,0,255,0.75)';
		var npoints=30
		var dspeed = motorData.omega_Nom/(npoints-1);
		var omega=motorData.omega_Nom;
		var torque = motorData.V_T_Nom*motorData.V_T_Nom/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
		var x0=axes.xmin+torque/axes.deltaxval*axes.width;
		var y0=axes.ymax-omega/axes.deltayval*axes.height;
		ctx.moveTo(x0,y0);
		for (var i = 0; i < npoints; i++) {
			omega=motorData.omega_Nom-i*dspeed;
			torque = motorData.V_T_Nom*motorData.V_T_Nom/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
			x0=axes.xmin+torque/axes.deltaxval*axes.width;
			y0=axes.ymax-omega/axes.deltayval*axes.height;			
    		ctx.lineTo(x0,y0);
		}	    
		ctx.stroke();
		/* make a label */
		ctx.moveTo(axes.labelx,axes.labely);
		ctx.lineTo(axes.labelx+gridSize,axes.labely);
		ctx.stroke();
		ctx.fillStyle="#000000";
		ctx.textAlign='left';
		ctx.fillText('Nominal',axes.labelx+1.5*gridSize, axes.labely-0.25*gridSize);
		ctx.stroke();
		
		
		/* plot modified performance and create label*/
		ctx.beginPath();
		ctx.strokeStyle='rgba(255,0,0,0.75)';
	    omega=motorData.omega_Nom;
		torque = motorData.V_T*motorData.V_T/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
		x0=axes.xmin+torque/axes.deltaxval*axes.width;
		y0=axes.ymax-omega/axes.deltayval*axes.height;
		ctx.moveTo(x0,y0);
		for (i = 0; i < npoints; i++) {
			omega=motorData.omega_Nom-i*dspeed;
			torque = motorData.V_T*motorData.V_T/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
			x0=axes.xmin+torque/axes.deltaxval*axes.width;
			y0=axes.ymax-omega/axes.deltayval*axes.height;			
    		ctx.lineTo(x0,y0);
		}	    
		ctx.stroke();
		
		/* make a label*/
		ctx.moveTo(axes.labelx,axes.labely+gridSize);
		ctx.lineTo(axes.labelx+gridSize,axes.labely+gridSize);
		ctx.stroke();
		ctx.fillStyle="#000000";
		ctx.textAlign='left';
		ctx.fillText('Updated - changing Voltage',axes.labelx+1.5*gridSize, axes.labely+0.75*gridSize);
				
		
		
		ctx.fillStyle="#000000";
		ctx.textAlign='left';
		ctx.fillText('Use the slider below to adjust terminal voltage ',gridSize, 17*gridSize);	
		
		
			
		
	}
	

	
	

	
	
	
	
/* the rest of the routine below is to implement a slider for a range input. This code can be reused in other applications but in this case, the slider returns a scaling factor fto vary the flux in the DC machine equations*/	
	
/* to be able to use a slider, need the x,y, co-ordinates of the top left corner of the canvas, so that we can subtract that from the mousehandler and get the local co-ordinates*/	
	
	function reOffset(){
    	var BB=myc.getBoundingClientRect();
    	offsetX=BB.left;
    	offsetY=BB.top;        
	}
	var offsetX,offsetY;
	reOffset();
	
	window.onscroll=function(e){ reOffset(); };
	window.onresize=function(e){ reOffset(); };

	var isDown=false;

	myc.onmousedown=(function(e){handleMouseDown(e);});
	myc.onmousemove=(function(e){handleMouseMove(e);});
	myc.onmouseup=(function(e){handleMouseUpOut(e);});
	myc.onmouseout=(function(e){handleMouseUpOut(e);});

	  
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
    range.pct=1.0;
	range.delta=range.maxval-range.minval;
	range.value=range.pct*range.delta+range.minval;
    return(range);
}

	
function drawRangeControl(range){
	/* Clear Canvas*/
    ctx.clearRect(0,0,canW, canH);
	/* draw white background for now */
	ctx.fillStyle='#FFFFFF';
	ctx.fillRect(0,0,canW, canH);

	    
    // bar
	ctx.fillStyle='#ddddff';
	ctx.fillRect(range.xmin,range.ymin, range.width, range.height);
    ctx.lineWidth=2;
    ctx.lineCap='round';
    ctx.beginPath();
	ctx.rect(range.xmin,range.ymin, range.width, range.height);
    ctx.strokeStyle='black';
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(range.xmax, range.ymin);
	ctx.lineTo(range.xmax, range.ymin+range.height);
	ctx.strokeStyle="#0000FF";
	ctx.stroke();
	ctx.fillStyle="#0000FF";
	ctx.textAlign='center';
	ctx.textBaseline='top';
	ctx.fillText('Rated',range.xmax, range.ymin-1.5*range.height);
    // thumb
    ctx.beginPath();
    var thumbX=range.x+range.width*range.pct;
    ctx.moveTo(thumbX,range.ymin);
    ctx.lineTo(thumbX,range.ymax);
    ctx.strokeStyle='rgba(255,0,0,0.75)';
    ctx.stroke();

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