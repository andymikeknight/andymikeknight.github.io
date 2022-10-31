// JavaScript Document

document.addEventListener('DOMContentLoaded',seriesplot,false);
function seriesplot(){
  		'use strict';
   //the rest of the function


	var cont_ser = document.getElementById("canvasholder_series");
	var myc_ser = document.getElementById("canvas_series");
 	if (null===myc_ser || !myc_ser.getContext) {
 		return; 
 	}
 	var ctx_ser=myc_ser.getContext("2d");	
	
	



 	/*define some basic size information required for drawings. Max canvas width is set to 460px and aspect ratio is 1
 	*/
  
	
    var maxW=460; var aspect=1;
	var scale, canW, canH, midX, gridSize;
	
	var axes, range;
	
	ctx_ser.fillStyle="#000000";
	ctx_ser.font="12px sans-serif";
 	ctx_ser.textAlign="left";	
 	ctx_ser.font = " "+Math.round(12*scale)+"px sans-serif";
	

	
	/* Define Armature Cicruit Parameters and calculate nominal plot data*/
	var motorData={kc:0.05,R_S:1,I_max:10,V_T_Nom:60};
	
	motorData.t_s_Nom=motorData.kc*(motorData.V_T_Nom/motorData.R_S)*(motorData.V_T_Nom/motorData.R_S);
	motorData.t_Nom=motorData.kc*motorData.I_max*motorData.I_max;
	motorData.omega_Nom=motorData.V_T_Nom/Math.sqrt(motorData.kc)/Math.sqrt(motorData.t_Nom)-motorData.R_S/motorData.kc;
	motorData.nm_Nom=motorData.omega_Nom*30/Math.PI;
	

	
	var V_TMin = 0;
	var V_TMax = motorData.V_T_Nom;
	var dVT=(V_TMax-V_TMin)/16;
	motorData.V_T=motorData.V_T_Nom;
	
	
	function initDrawing(){
		/* find the width of the container that holds the canvas. This is needed to re-size the canvas for different page sizes */
	
 		var contW=cont_ser.offsetWidth;
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
		ctx_ser.canvas.width=canW;
		ctx_ser.canvas.height=canH;

		/* define midpoint hoizontally and a 1:20 wide grid*/
		midX=canW/2;
		gridSize=canW/20;

		/* Canvas is split into three zones
		1) topt6 grid lines gives data on machine armature circuit parameters
		2) grid lines 8-17 draw the plot
		Use  for this
		3) grid line 20 is the slider to display the input variable range.

		/* Define axes position and value scales */

		axes={xmin:2*gridSize, xmax:canW-2*gridSize, ymin:8*gridSize, ymax:16*gridSize};
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

		range=makeRange(midX-midX/2,canH-gridSize,midX,0.5*gridSize, V_TMin,V_TMax);
		range.pct=(motorData.V_T-V_TMin)/(V_TMax-V_TMin);

		/* beacuse the slider is the input to the diagram, call the function to draw the slider, which in turn calls the function to draw the rest of the canvas: drawMain */

		drawRange(range);
	}
	
    initDrawing();
	window.addEventListener('resize',initDrawing,false);
	var stepUpButton = document.getElementById('stepUpVT');
	var stepDnButton = document.getElementById('stepDnVT');

	stepUpButton.addEventListener("click", function(){			
			motorData.V_T=motorData.V_T+dVT;			
			if (motorData.V_T>V_TMax){
				motorData.V_T=V_TMax;
			}
			range.pct=(motorData.V_T-V_TMin)/(V_TMax-V_TMin);	
		 	initDrawing();
        });  
	stepDnButton.addEventListener("click", function(){

			motorData.V_T=motorData.V_T-dVT;
			
			if (motorData.V_T<V_TMin){
				motorData.V_T=V_TMin;
			}
			range.pct=(motorData.V_T-V_TMin)/(V_TMax-V_TMin);
			initDrawing();
        }); 

	
	
	function drawMain(){

		/* Report main information on Motor Parameters */
		ctx_ser.textAlign='right';
        ctx_ser.textBaseline='top';
		ctx_ser.fillStyle="#660000";
		ctx_ser.fillText('Defined Inputs & Values',6.5*gridSize,gridSize);
		ctx_ser.fillStyle="#000000";
		ctx_ser.fillText('Nomonal Terminal Voltage',6.5*gridSize,2*gridSize);
		ctx_ser.fillText('R_A + R_S', 6.5*gridSize,3*gridSize);
		ctx_ser.fillText('Max Armature Current' , 6.5*gridSize, 4*gridSize);
		ctx_ser.fillText('kc',6.5*gridSize,5*gridSize);
		
		ctx_ser.textAlign='left';
		ctx_ser.fillText(motorData.V_T_Nom.toFixed(1) +' V',7*gridSize,2*gridSize);
		ctx_ser.fillText(motorData.R_S.toFixed(2) +' \u03A9', 7*gridSize,3*gridSize);
		ctx_ser.fillText(motorData.I_max.toFixed(1)+' \A', 7*gridSize, 4*gridSize);
		ctx_ser.fillText(motorData.kc.toFixed(3),7*gridSize,5*gridSize);
		
		
		motorData.t_s=motorData.kc*(motorData.V_T/motorData.R_S)*(motorData.V_T/motorData.R_S);
		
		ctx_ser.textAlign='right';
		ctx_ser.fillStyle="#660000";
		ctx_ser.fillText('Calculated Values',15.5*gridSize,gridSize);
		ctx_ser.fillStyle="#000000";
		ctx_ser.fillText('Nominal Standstill Torque',15.5*gridSize,2*gridSize);
		ctx_ser.fillText('Rated Torque', 15.5*gridSize,3*gridSize);
		ctx_ser.fillText('Rated Speed' , 15.5*gridSize, 4*gridSize);
		ctx_ser.fillText('Termial Voltage Input',15.5*gridSize,5*gridSize);
		ctx_ser.fillText('Standstill Torque',15.5*gridSize,6*gridSize);
		ctx_ser.textAlign='left';
		ctx_ser.fillText(motorData.t_s_Nom.toFixed(1)+' N m' , 16*gridSize,2*gridSize);
		ctx_ser.fillText(motorData.t_Nom.toFixed(1)+' N m'   , 16*gridSize,3*gridSize);
		ctx_ser.fillText(motorData.nm_Nom.toFixed(0)+' rpm'   , 16*gridSize,4*gridSize);
		ctx_ser.fillStyle="#FF0000";
		ctx_ser.fillText( motorData.V_T.toFixed(1)+' V'      , 16*gridSize,5*gridSize);
		ctx_ser.fillText(motorData.t_s.toFixed(1)+' N m'    , 16*gridSize,6*gridSize);
		
	
		
		/* Now draw axes and plot torque vs speed.
		Draw two plots, back ground with nominal kphi, then new plot as slider is moved
		*/
		

		/* plot axes, and label them*/
		
		ctx_ser.fillStyle="#000000";
		ctx_ser.textAlign='left';
		ctx_ser.fillText('Speed (rpm)',axes.xmin, axes.ymin-gridSize);
		ctx_ser.textAlign='right';
		ctx_ser.fillText('Torque (N m)',axes.xmax, axes.ymax+gridSize);
		
		ctx_ser.strokeStyle='#000000';
		ctx_ser.beginPath();
		ctx_ser.moveTo(axes.xmin,axes.ymin);
		ctx_ser.lineTo(axes.xmin-3*scale,axes.ymin+3*scale);
		ctx_ser.lineTo(axes.xmin+3*scale,axes.ymin+3*scale);
		ctx_ser.lineTo(axes.xmin,axes.ymin);
		ctx_ser.lineTo(axes.xmin,axes.ymax);
		ctx_ser.lineTo(axes.xmax,axes.ymax);
		ctx_ser.lineTo(axes.xmax-3*scale,axes.ymax-3*scale);
		ctx_ser.lineTo(axes.xmax-3*scale,axes.ymax+3*scale);
		ctx_ser.lineTo(axes.xmax,axes.ymax);
		ctx_ser.stroke();
		
		/* plot nominal performance in 20 steps and create label*/
		/* need to calculate torque as function of speed range, then keep speed range constant for updated plot */
		
		
		
		ctx_ser.beginPath();
		ctx_ser.strokeStyle='rgba(0,0,255,0.75)';
		var npoints=30;
		var dspeed = motorData.omega_Nom/(npoints-1);
		var omega=motorData.omega_Nom;
		var torque = motorData.V_T_Nom*motorData.V_T_Nom/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
		var x0=axes.xmin+torque/axes.deltaxval*axes.width;
		var y0=axes.ymax-omega/axes.deltayval*axes.height;
		ctx_ser.moveTo(x0,y0);
		for (var i = 0; i < npoints; i++) {
			omega=motorData.omega_Nom-i*dspeed;
			torque = motorData.V_T_Nom*motorData.V_T_Nom/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
			x0=axes.xmin+torque/axes.deltaxval*axes.width;
			y0=axes.ymax-omega/axes.deltayval*axes.height;			
    		ctx_ser.lineTo(x0,y0);
		}	    
		ctx_ser.stroke();
		/* make a label */
		ctx_ser.moveTo(axes.labelx,axes.labely);
		ctx_ser.lineTo(axes.labelx+gridSize,axes.labely);
		ctx_ser.stroke();
		ctx_ser.fillStyle="#000000";
		ctx_ser.textAlign='left';
		ctx_ser.fillText('Nominal',axes.labelx+1.5*gridSize, axes.labely-0.25*gridSize);
		ctx_ser.stroke();
		
		
		/* plot modified performance and create label*/
		ctx_ser.beginPath();
		ctx_ser.strokeStyle='rgba(255,0,0,0.75)';
	    omega=motorData.omega_Nom;
		torque = motorData.V_T*motorData.V_T/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
		x0=axes.xmin+torque/axes.deltaxval*axes.width;
		y0=axes.ymax-omega/axes.deltayval*axes.height;
		ctx_ser.moveTo(x0,y0);
		for (i = 0; i < npoints; i++) {
			omega=motorData.omega_Nom-i*dspeed;
			torque = motorData.V_T*motorData.V_T/(omega+motorData.R_S/motorData.kc)/(omega+motorData.R_S/motorData.kc)/motorData.kc;
			x0=axes.xmin+torque/axes.deltaxval*axes.width;
			y0=axes.ymax-omega/axes.deltayval*axes.height;			
    		ctx_ser.lineTo(x0,y0);
		}	    
		ctx_ser.stroke();
		
		/* make a label*/
		ctx_ser.moveTo(axes.labelx,axes.labely+gridSize);
		ctx_ser.lineTo(axes.labelx+gridSize,axes.labely+gridSize);
		ctx_ser.stroke();
		ctx_ser.fillStyle="#000000";
		ctx_ser.textAlign='left';
		ctx_ser.fillText('Updated - changing Voltage',axes.labelx+1.5*gridSize, axes.labely+0.75*gridSize);
				
		
		
		ctx_ser.fillStyle="#000000";
		ctx_ser.textAlign='left';
		ctx_ser.fillText('Use the buttons below to adjust terminal voltage ',gridSize, 17*gridSize);	
		
		
			
		
	}
	

	  
	/* define Range Control position by top left corner*/
	function makeRange(x,y,width,height,minval,maxval){
		var range={x:x,y:y,width:width,height:height, minval:minval, maxval:maxval};
		/* variables that are used for definfing the coordinates to draw the slider*/
		range.xmin=range.x;
		range.xmax=range.x+range.width;
		/* remeber ymin is the top, ymax is the bottom*/
		range.ymin=range.y;
		range.ymax=range.y+range.height;
		//
		/* variable that define the output of whatver the slider is controling*/
		range.delta=range.maxval-range.minval;
		range.value=range.pct*range.delta+range.minval;
		return(range);
	}

	function drawRange(range){
		/* Clear Canvas*/
		ctx_ser.clearRect(0,0,canW, canH);
		/* draw white background for now */
		// bar
		ctx_ser.fillStyle='#ddddff';
		ctx_ser.fillRect(range.xmin,range.ymin, range.width, range.height);
		ctx_ser.lineWidth=2;
		ctx_ser.lineCap='round';
		ctx_ser.beginPath();
		ctx_ser.rect(range.xmin,range.ymin, range.width, range.height);
		ctx_ser.strokeStyle='black';
		ctx_ser.stroke();
		ctx_ser.beginPath();
		ctx_ser.moveTo(range.xmax, range.ymin);
		ctx_ser.lineTo(range.xmax, range.ymin+range.height);
		ctx_ser.strokeStyle="#0000FF";
		ctx_ser.stroke();
		ctx_ser.fillStyle="#0000FF";
		ctx_ser.textAlign='center';
		ctx_ser.textBaseline='top';
		ctx_ser.fillText(range.minval.toFixed(1),range.xmin, range.ymin-1.5*range.height);
		ctx_ser.fillText(range.maxval.toFixed(1),range.xmax, range.ymin-1.5*range.height);
		// thumb
		ctx_ser.beginPath();
		var thumbX=range.x+range.width*range.pct;
		ctx_ser.moveTo(thumbX,range.ymin);
		ctx_ser.lineTo(thumbX,range.ymax);
		ctx_ser.strokeStyle='rgba(255,0,0,0.75)';
		ctx_ser.stroke();
		
	

		/* finished redraeinf contoller slider, now execute rest of the canvas*/
		drawMain();
	}


}