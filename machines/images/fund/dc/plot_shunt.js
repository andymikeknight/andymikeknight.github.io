// JavaScript Document

	
document.addEventListener('DOMContentLoaded',shuntplot,false);
function shuntplot(){
  		'use strict';
	var axes, midX, gridSize, range;

	/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_shunt" and the canvas to have an id="canvas_shunt" */
/*The script plots a simple ac generator with rotating N and S poles, and coils around the stator. The number of coils per phase can be varied. 
The script plots the spatial variation of the flux density as a function of angle, and the magnitude of the induced coil voltage, as time varying quantities.
The total phase voltage from the summation of individual coil voltages is also plotted as a time varying function*/	
	
	//the rest of the function


	var cont_sh = document.getElementById("canvasholder_shunt");
	var myc_sh = document.getElementById("canvas_shunt");
 	if (null===myc_sh || !myc_sh.getContext) {
 		return; 
 	}
 	var ctx_sh=myc_sh.getContext("2d");	
	
	
	/* find the width of the cont_sh that holds the canvas. This is needed to re-size the canvas for different page sizes 
	*/
	
 	var contW=cont_sh.offsetWidth;

 	/*define some basic size information required for drawings. Max canvas width is set to 460px and aspect ratio is 2
 	*/
  	
    var maxW=460; var aspect=1;
	var scale, canW, canH;

	ctx_sh.fillStyle="#000000";
	ctx_sh.font="12px sans-serif";
 	ctx_sh.textAlign="left";	
 	ctx_sh.font = " "+Math.round(12*scale)+"px sans-serif";
 

// finished init of canvas, now init drawing
	
	/* Define Armature Cicruit Parameters and calculate nominal plot data*/
	var motorData={V_T:40,R_A:4,I_max:3,kphiNom:1/Math.PI};
	
	motorData.omega_nlNom=motorData.V_T/motorData.kphiNom;
	motorData.n_nlNom=motorData.omega_nlNom*30/Math.PI;
	motorData.tmaxNom=motorData.I_max*motorData.kphiNom;
	motorData.omega_minNom=motorData.omega_nlNom-motorData.R_A*motorData.tmaxNom/(motorData.kphiNom*motorData.kphiNom);
	motorData.n_minNom=motorData.omega_minNom*30/Math.PI;
	
	
	var kphiMin = 0.9*motorData.kphiNom;
	var kphiMax = 1.1*motorData.kphiNom;
	var dkphi = 0.2*motorData.kphiNom/16;
	// initial data
	motorData.kphi = (kphiMax+kphiMin)/2;
	/* plot variable of kphi on a sliding scale*/
	/* inputs are top x,y, width, height, output_min output_max */

	
	function initDrawing(){
	
		contW=cont_sh.offsetWidth;
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
		ctx_sh.canvas.width=canW;
		ctx_sh.canvas.height=canH;

		/* define midpoint hoizontally and a 1:20 wide grid*/



		/* Canvas is split into three zones
		1) top gives data on machine armature circuit parameters
		Use top 6 grid lines for this
		2) Centre draw the plot
		Use grid lines 8-16 for this
		3) The slide for the flux input is at the bottom
		Use grid lines 17-20 for this

		Note have to draw the slider first to get a flux value that is used in top 2 secions
		function drawrangecontrol calls functions to draw other data*/



		/* Define axes position and value scales after re-sizing*/
		midX=canW/2;
		gridSize=canW/20;
		
	    axes={xmin:2*gridSize, xmax:canW-2*gridSize, ymin:8*gridSize, ymax:15*gridSize};
		axes.yvalMin=motorData.n_nlNom/2;
		axes.yvalMax=motorData.n_nlNom*1.2;
		axes.xvalMin=0;
		axes.xvalMax=motorData.tmaxNom*1.2;
		axes.width=axes.xmax-axes.xmin;
		axes.height=axes.ymax-axes.ymin;
		axes.deltaxval=axes.xvalMax-axes.xvalMin;
		axes.deltayval=axes.yvalMax-axes.yvalMin;
		axes.labelx = midX;
		axes.labely = axes.ymin;


		range=makeRange(midX-midX/2,canH-1*gridSize,midX,0.5*gridSize, kphiMin,kphiMax);
		range.pct=(motorData.kphi-kphiMin)/(kphiMax-kphiMin);

		drawRange(range);
	}
	
	

	/* the canvas is re-drawn by the mousehandler events which calls drawRangeConrol*/
	/* if the page is re-sized, this entire routine is called again by the html page. */
    initDrawing();
	window.addEventListener('resize',initDrawing,false);

	var stepUpButton = document.getElementById('stepUpFlux');
	var stepDnButton = document.getElementById('stepDnFlux');

	stepUpButton.addEventListener("click", function(){
			
			motorData.kphi=motorData.kphi+dkphi;
			
			if (motorData.kphi>kphiMax){
				motorData.kphi=kphiMax;
			}
			range.pct=(motorData.kphi-kphiMin)/(kphiMax-kphiMin);	
		 	initDrawing();
        });  
	stepDnButton.addEventListener("click", function(){

			motorData.kphi=motorData.kphi-dkphi;
			
			if (motorData.kphi<kphiMin){
				motorData.kphi=kphiMin;
			}
			range.pct=(motorData.kphi-kphiMin)/(kphiMax-kphiMin);
			initDrawing();
        }); 
	
	
	function drawMain(){

		/* Report main information on Motor Parameters */
		ctx_sh.textAlign='right';
        ctx_sh.textBaseline='top';
		ctx_sh.fillStyle="#660000";
		ctx_sh.fillText('Defined Inputs & Values',6.5*gridSize,gridSize);
		ctx_sh.fillStyle="#000000";
		ctx_sh.fillText('Terminal Voltage',6.5*gridSize,2*gridSize);
		ctx_sh.fillText('Armature Resistance', 6.5*gridSize,3*gridSize);
		ctx_sh.fillText('Max Armature Current' , 6.5*gridSize, 4*gridSize);
		ctx_sh.fillText('k \u03C6 Nominal',6.5*gridSize,5*gridSize);
		
		ctx_sh.textAlign='left';
		ctx_sh.fillText(motorData.V_T.toFixed(3) +' V',7*gridSize,2*gridSize);
		ctx_sh.fillText(motorData.R_A.toFixed(3) +' \u03A9', 7*gridSize,3*gridSize);
		ctx_sh.fillText(motorData.I_max.toFixed(3)+ ' A',7*gridSize, 4*gridSize);
		ctx_sh.fillText(motorData.kphiNom.toFixed(3),7*gridSize,5*gridSize);
		
		
		motorData.omega_nl=motorData.V_T/motorData.kphi;
		motorData.n_nl=motorData.omega_nl*30/Math.PI;
		motorData.tmax=motorData.I_max*motorData.kphi;
		motorData.omega_min=motorData.omega_nl-motorData.R_A*motorData.tmax/(motorData.kphi*motorData.kphi);
		motorData.n_min=motorData.omega_min*30/Math.PI;
		
		ctx_sh.textAlign='right';
		ctx_sh.fillStyle="#660000";
		ctx_sh.fillText('Calculated Values',15.5*gridSize,gridSize);
		ctx_sh.fillStyle="#000000";
		ctx_sh.fillText('No - Load Speed',15.5*gridSize,2*gridSize);
		ctx_sh.fillText('No - Load Speed', 15.5*gridSize,3*gridSize);
		ctx_sh.fillText('Maximum Torque' , 15.5*gridSize, 4*gridSize);
		ctx_sh.fillText('Speed at Max Torque',15.5*gridSize,5*gridSize);
		ctx_sh.fillText('k \u03C6 Input',15.5*gridSize,6*gridSize);
		ctx_sh.textAlign='left';
		ctx_sh.fillStyle="#FF0000";
		ctx_sh.fillText(motorData.omega_nl.toFixed(2)+' rad/s',16*gridSize,2*gridSize);
		ctx_sh.fillText(motorData.n_nl.toFixed(1)+' rpm', 16*gridSize,3*gridSize);
		ctx_sh.fillText(motorData.tmax.toFixed(3)+' Nm', 16*gridSize, 4*gridSize);
		ctx_sh.fillText( motorData.n_min.toFixed(1)+' rpm',16*gridSize,5*gridSize);
		ctx_sh.fillText(motorData.kphi.toFixed(3),16*gridSize,6*gridSize);
		
		
		
		/* Now draw axes and plot torque vs speed.
		Draw two plots, back ground with nominal kphi, then new plot as slider is moved
		*/
		

		/* plot axes, and label them*/
		
		ctx_sh.fillStyle="#000000";
		ctx_sh.textAlign='left';
		ctx_sh.fillText('Speed (rpm)',axes.xmin, axes.ymin-gridSize);
		ctx_sh.textAlign='right';
		ctx_sh.fillText('Torque (N m)',axes.xmax, axes.ymax+gridSize);
		
		ctx_sh.strokeStyle='#000000';
		ctx_sh.beginPath();
		ctx_sh.moveTo(axes.xmin,axes.ymin);
		ctx_sh.lineTo(axes.xmin-3*scale,axes.ymin+3*scale);
		ctx_sh.lineTo(axes.xmin+3*scale,axes.ymin+3*scale);
		ctx_sh.lineTo(axes.xmin,axes.ymin);
		ctx_sh.lineTo(axes.xmin,axes.ymax);
		ctx_sh.lineTo(axes.xmax,axes.ymax);
		ctx_sh.lineTo(axes.xmax-3*scale,axes.ymax-3*scale);
		ctx_sh.lineTo(axes.xmax-3*scale,axes.ymax+3*scale);
		ctx_sh.lineTo(axes.xmax,axes.ymax);
		ctx_sh.stroke();
		
		/* plot nominal performance and create label*/
		
		ctx_sh.beginPath();
		ctx_sh.strokeStyle='rgba(0,0,255,0.75)';
		var x0=axes.xmin;
		var y0=axes.ymax-axes.height*(motorData.n_nlNom-axes.yvalMin)/axes.deltayval;
		var x1=axes.xmin+axes.width*(motorData.tmaxNom/axes.xvalMax);
		var y1=	axes.ymax-axes.height*(motorData.n_minNom-axes.yvalMin)/axes.deltayval;
		ctx_sh.moveTo(x0,y0);
		ctx_sh.lineTo(x1,y1);
		ctx_sh.stroke();
		/* make a label */
		ctx_sh.moveTo(axes.labelx,axes.labely);
		ctx_sh.lineTo(axes.labelx+gridSize,axes.labely);
		ctx_sh.stroke();
		ctx_sh.fillStyle="#000000";
		ctx_sh.textAlign='left';
		ctx_sh.fillText('Nominal',axes.labelx+1.5*gridSize, axes.labely-0.25*gridSize);
		ctx_sh.stroke();
		
		
		/* plot modified performance and create label*/
		ctx_sh.beginPath();
		ctx_sh.strokeStyle='rgba(255,0,0,0.75)';
		y0=axes.ymax-axes.height*(motorData.n_nl-axes.yvalMin)/axes.deltayval;
		x1=axes.xmin+axes.width*(motorData.tmax/axes.xvalMax);
		y1=axes.ymax-axes.height*(motorData.n_min-axes.yvalMin)/axes.deltayval;
		ctx_sh.moveTo(x0,y0);
		ctx_sh.lineTo(x1,y1);
		ctx_sh.stroke();
		ctx_sh.moveTo(axes.labelx,axes.labely+gridSize);
		ctx_sh.lineTo(axes.labelx+gridSize,axes.labely+gridSize);
		ctx_sh.stroke();
		ctx_sh.fillStyle="#000000";
		ctx_sh.textAlign='left';
		ctx_sh.fillText('Updated - changing flux',axes.labelx+1.5*gridSize, axes.labely+0.75*gridSize);
				
		
		
		ctx_sh.fillStyle="#000000";
		ctx_sh.textAlign='left';
		ctx_sh.fillText('Use the buttons below to increase or decrese k \u03C6 ',gridSize, 17*gridSize);	
		
		
			
		
	}
		  
	/* define Range to show input on a slider*/
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
		ctx_sh.clearRect(0,0,canW, canH);

		// bar
		ctx_sh.fillStyle='#ddddff';
		ctx_sh.fillRect(range.xmin,range.ymin, range.width, range.height);
		ctx_sh.lineWidth=2;
		ctx_sh.lineCap='round';
		ctx_sh.beginPath();
		ctx_sh.rect(range.xmin,range.ymin, range.width, range.height);
		ctx_sh.strokeStyle='black';
		ctx_sh.stroke();
		ctx_sh.beginPath();
		ctx_sh.moveTo((range.xmax+range.xmin)/2, range.ymin);
		ctx_sh.lineTo((range.xmax+range.xmin)/2, range.ymin+range.height);
		ctx_sh.strokeStyle='rgba(0,0,255,0.75)';
		ctx_sh.stroke();
		ctx_sh.fillStyle="#000000";
		ctx_sh.textAlign='center';
		ctx_sh.textBaseline='top';
		ctx_sh.fillText('Nominal',(range.xmax+range.xmin)/2, range.ymin-1.5*range.height);
		ctx_sh.fillText(range.minval.toFixed(3),range.xmin, range.ymin-1.5*range.height);
		ctx_sh.fillText(range.maxval.toFixed(3),range.xmax, range.ymin-1.5*range.height);
		// thumb
		ctx_sh.beginPath();
		var thumbX=range.x+range.width*range.pct;
		ctx_sh.moveTo(thumbX,range.ymin);
		ctx_sh.lineTo(thumbX,range.ymax);
		ctx_sh.strokeStyle='rgba(255,0,0,0.75)';
		ctx_sh.stroke();

		/* finished redrawing contoller slider, now execute rest of the canvas*/
		drawMain();
	}


}