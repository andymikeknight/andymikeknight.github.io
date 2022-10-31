// JavaScript Document

document.addEventListener('DOMContentLoaded',phasorib,false);

function phasorib() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_phiborsa" and the canvas to have an id="canvas_phiborsa" */
/*The script a simplified phasor diagram (no RA) for a standalone generator. The inputs available to the user via html buttons set the following cases:
 increase / decrease E
 increase / decrease IA
 power factor lagging / leading / unity */	

/* math for the phasor diagram variation is carried out in per-unit, and then scaled, to fit diagram within canvas window space */
	
 var cont_phib=document.getElementById("canvasholder_phasorib");
 var myc_phib = document.getElementById("canvas_phasorib");
	
 

 if (null===myc_phib || !myc_phib.getContext) {
 	return; 
 }

 var ctx_phib=myc_phib.getContext("2d");
 
 ctx_phib=myc_phib.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 3 sections; 2 lines text, phasor diagram, bottom section of 7 lines text. 
 Aspect ratio will be worked out when drawing is initialized.
 */
  
    var maxW=512; var aspect;
	var scale, winW, winH, width1, drawW, drawH, vscaling, border, lineH;
	
	
	// define some machine base case and range information, in per unit
	
	var VLL=1.1; //kV
	var vpbase = VLL/Math.sqrt(3);//kV
	var Sbase=1.0; //MW;
	var Ibase=Sbase/Math.sqrt(3)/VLL*1000;
	var Pnom=0.9;
	var XS=0.6;
	var Zbase=vpbase*1000/Ibase;
	var power=Pnom;
	var thetanom=-Math.acos(Pnom/Sbase)*180/Math.PI;
	var theta=thetanom*Math.PI/180;
	var V={mag:1,phase:0};
	var IA={mag:1,phase:theta};
	var IXS={mag:XS,phase:(IA.phase+Math.PI/2)};
	var E={mag:0,phase:0};
	addPhasors(E,V,IXS);
	var Enom=E.mag;
	var deltanom = E.phase*180/Math.PI;
	
	//limit variation in power 
	var Pmin = 0;
	var Pmax = Pnom;
	var dP = 0.1;
	//limit variation in E and set max current
	var Emin = 0.5;
	var Emax = Enom;	
	var Imax = 1.0;
	var dE =0.05;

	
	
	// draw current on different scale to voltage...
	var iscale=0.3;
	var x0,y0;
	var errormsg='';

	function initDrawing(){
		width1=cont_phib.offsetWidth;
		if (width1>maxW){
			winW=maxW;
			scale=1;
		}
		if (width1<maxW){
			scale=width1/maxW;
			winW=width1;
		}
		

	 // set canvas size based on containing div size (fluid resizing)		
		ctx_phib.canvas.width=winW;

	 // define font sizes, scaled with width.
		var nomFontH=12;
		ctx_phib.fillStyle="#000000";
		ctx_phib.lineWidth=2;
		ctx_phib.font="12px serif";
		ctx_phib.textAlign="left";	
		ctx_phib.font = " "+Math.round(nomFontH*scale)+"px serif";
		
		// drawing border =2% of width;
		border =Math.round(winW*0.02);
		// actual diagram width
		drawW=winW-2*border;
		// actual daigram height
		drawH=Math.round(drawW/2*(XS+0.71));
		
		lineH=nomFontH*scale*1.5;
		var topTextH=2*lineH;
		var botTextH=7*lineH;
		
		winH=2*border+drawH+topTextH+botTextH;
		ctx_phib.canvas.height=winH;
		aspect=winW/winH;

		
		
     // drawing always has nominal 1pu voltage equal to half drawing width

		vscaling=drawW/2;

		// draw voltage origin at 5% in from left edge, 50% vertical
		x0=border;
		y0=border+topTextH+XS*drawW/2;



// finished init of canvas, now init drawing

		
		doDrawing();
	}
	
	function doDrawing(){
		ctx_phib.clearRect(0,0,winW,winH);


		// draw construction lines and IX phasor (draw before current phasor overwrites construction line instead of vice-versa)
		ctx_phib.save();
		ctx_phib.strokeStyle="#FF0000";
		ctx_phib.setLineDash([5]);
		ctx_phib.beginPath();
		ctx_phib.moveTo(x0, y0);
		var nextx=vscaling*V.mag*Math.cos(IA.phase)*Math.cos(IA.phase);
		var nexty=vscaling*V.mag*Math.cos(IA.phase)*Math.sin(-IA.phase);
		ctx_phib.lineTo(x0+nextx,y0+nexty);
		ctx_phib.lineTo(x0+vscaling*V.mag,y0);
		ctx_phib.stroke();
		ctx_phib.restore();
		ctx_phib.save();
		ctx_phib.translate(x0+nextx,y0+nexty);
		ctx_phib.rotate(-IXS.phase);
		ctx_phib.lineWidth=1;
		ctx_phib.strokeStyle="rgb(100,100,100)";
		ctx_phib.strokeRect(0,0,10*scale,-10*scale);
		ctx_phib.restore();
		
				// plot arc of constant excitation
		ctx_phib.save();
		ctx_phib.strokeStyle="#0000FF";
		ctx_phib.setLineDash([5]);
		ctx_phib.beginPath();
		ctx_phib.arc(x0,y0,vscaling*E.mag, 0, 3*Math.PI/2,true); 
		ctx_phib.stroke();
		ctx_phib.restore();
		
		
		// plot dot-dash lines of constant power
		ctx_phib.save();
		ctx_phib.strokeStyle="#00aa00";
		ctx_phib.setLineDash([5, 2, 2, 2]);
		ctx_phib.beginPath();
		var Esind=vscaling*E.mag*Math.sin(E.phase);
		var Icost=vscaling*iscale*IA.mag*Math.cos(IA.phase);
		ctx_phib.moveTo(x0,y0-Esind);
		ctx_phib.lineTo(x0+vscaling*Emax,y0-Esind);
		ctx_phib.moveTo(x0+Icost, y0-vscaling*iscale*Pmax);
		ctx_phib.lineTo(x0+Icost, drawH);		
		ctx_phib.stroke();
		ctx_phib.restore();
		
				// plot V
		var phColor="#000000";
		drawPhasor(ctx_phib, x0, y0,vscaling*V.mag,V.phase, phColor,'V', 10);
		// draw IX phasor 
		phColor="#AA0000";
		drawPhasor(ctx_phib, x0+vscaling*V.mag, y0, vscaling*IXS.mag,      IXS.phase, phColor,'jIA Xs', -10);
			
		// draw angle and perpendicular reference
		ctx_phib.save();
		ctx_phib.lineWidth=1;
		ctx_phib.strokeStyle="rgb(100,100,100)";
		ctx_phib.beginPath();
		ctx_phib.moveTo(x0+vscaling*V.mag, y0);
		ctx_phib.lineTo(x0+vscaling*V.mag, y0-50*scale);
		ctx_phib.stroke();
		ctx_phib.restore();
		if (IA.phase<0){		
			labelAngle(ctx_phib,x0+vscaling*V.mag, y0,40*scale,3*Math.PI/2-IA.phase,3*Math.PI/2,'\u03B8');
		}else{
			labelAngle(ctx_phib,x0+vscaling*V.mag, y0,40*scale,3*Math.PI/2,3*Math.PI/2-IA.phase,'\u03B8');
		}	

		// if plot I and label angle
		phColor="#DD0000";
		drawPhasor(ctx_phib, x0,       y0, vscaling*IA.mag*iscale, IA.phase, phColor,'IA', -20);
		if (IA.phase<0){
			labelAngle(ctx_phib,x0, y0,40*scale,-IA.phase,0,'\u03B8');			
		}else{				
			labelAngle(ctx_phib,x0, y0,40*scale,0,-IA.phase,'\u03B8');
		}
		

		// plot E
		phColor="#0000DD";
		drawPhasor(ctx_phib, x0, y0,vscaling*E.mag,E.phase, phColor,'E', 10);
		if (E.phase<0){
			labelAngle(ctx_phib,x0, y0,50*scale,-E.phase,0,'\u03B4');			
		}else{

			labelAngle(ctx_phib,x0, y0,50*scale,0,-E.phase,'\u03B4');
		}

		
		// add text
		ctx_phib.save();
		ctx_phib.fillStyle="#0000DD";
		ctx_phib.textBaseline="top";
		ctx_phib.fillText('Dotted blue line gives locus of constant |E|',border,border);
		ctx_phib.fillStyle="#00aa00";
		ctx_phib.fillText('Dot-dash green line gives locus of constant power',border,border+lineH);		
		ctx_phib.fillStyle="#333333";
		var textY=border+drawH;
		ctx_phib.textAlign="left";
		ctx_phib.fillText('Nominal Conditions:',x0, textY);	
		ctx_phib.textAlign="left";
		ctx_phib.fillText('V = '+vpbase.toFixed(3)+'kV'   		,x0, textY+lineH*1);
		ctx_phib.fillText('E = '+(Enom*vpbase).toFixed(3)+'kV' 	,x0, textY+lineH*2);
		ctx_phib.fillText('IA = '+Ibase.toFixed(1)+'A'			,x0, textY+lineH*3);
		ctx_phib.fillText('\u03B8 = '+thetanom.toFixed(1)+'deg' ,x0, textY+lineH*4);
		ctx_phib.fillText('\u03B4 = '+deltanom.toFixed(1)+'deg' ,x0, textY+lineH*5);
		ctx_phib.fillText('Xs = '+(XS*Zbase).toFixed(3)+'\u03A9' ,x0, textY+lineH*6);

		ctx_phib.fillText('S = '+Sbase.toFixed(3)+' MVA' 		,winW/4, textY+lineH*1);
		var Qnom=Math.sqrt(1-Pnom*Pnom);
		ctx_phib.fillText('P = '+Pnom.toFixed(3)+' MW'			,winW/4, textY+lineH*2);	
		ctx_phib.fillText('Q = '+Qnom.toFixed(3)+' MVAr'		,winW/4, textY+lineH*3);
		ctx_phib.fillText('pf = '+Pnom.toFixed(3)				,winW/4, textY+lineH*4);


		ctx_phib.textAlign="left";
		ctx_phib.fillStyle="#000000";
		ctx_phib.fillText('Displayed Conditions:'					 			,winW/2,textY);	
		ctx_phib.fillText('V = '+vpbase.toFixed(3)+'kV'   			 			,winW/2, textY+lineH*1);
		ctx_phib.fillText('E = '+(E.mag*vpbase).toFixed(3)+'kV' 	 			,winW/2, textY+lineH*2);
		ctx_phib.fillText('IA = '+(IA.mag*Ibase).toFixed(1)+'A'		 			,winW/2, textY+lineH*3);
		ctx_phib.fillText('\u03B8 = '+(IA.phase*180/Math.PI).toFixed(1)+'deg' 	,winW/2, textY+lineH*4);
		ctx_phib.fillText('\u03B4 = '+(E.phase*180/Math.PI).toFixed(1)+'deg' 	,winW/2, textY+lineH*5);
		var pf=Math.cos(IA.phase);
	    var Qnow=IA.mag*Math.sqrt(1-pf*pf);
		ctx_phib.fillText('S = '+IA.mag.toFixed(3)+' MVA' 			,3*winW/4, textY+lineH*1);
		ctx_phib.fillText('P = '+power.toFixed(3)+' MW'				,3*winW/4, textY+lineH*2);	
		ctx_phib.fillText('Q = '+Qnow.toFixed(3)+' MVAr'			,3*winW/4, textY+lineH*3);	
		ctx_phib.fillText('pf = '+pf.toFixed(3) 					,3*winW/4, textY+lineH*4);
		
		ctx_phib.fillText(errormsg,border, winH-border-lineH);
	}
		
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);


	
	var stepUpPButton = document.getElementById('stepUpP');
	var stepDnPButton = document.getElementById('stepDnP');
	var stepUpEButton = document.getElementById('stepUpE');
	var stepDnEButton = document.getElementById('stepDnE');

	var resetButton = document.getElementById('reset');
	
	function calcImax_E(){
		//calculates phasors for case where I=Imax, but E has not changed (changing power)
		// need to first find E as a phasor, based on max magnitude of IX;
		// then for simplicity, recalculate IXS to get phase of IXS (less math)
		IA.mag=Imax;
		IXS.mag=Imax*XS;
		// cosine rule to find delta
		E.phase=Math.acos((E.mag*E.mag+1-IXS.mag*IXS.mag)/(2*E.mag)); // V=1pu
		power=E.mag*Math.sin(E.phase)/XS;
		subPhasors(IXS, E, V);
		IA.phase=IXS.phase-Math.PI/2;
		errormsg='IA max current limit reached';
	}
	
    stepUpPButton.addEventListener("click", function(){
		errormsg='';
		power=power+dP;
		if (Pmax<E.mag/XS){// hit Pmax limit first
			if (power>Pmax){
				power=Pmax;
				E.phase=Math.asin(power*XS/E.mag);
				subPhasors(IXS, E, V);
				IA.mag=IXS.mag/XS;
				IA.phase=IXS.phase-Math.PI/2;
				// still neeed to check if current limit has been reached before power limit
				if (IA.mag>Imax){
					// calculate power at Imax and E.mag
					calcImax_E();
				}else{
					errormsg='Maximum Power Limit has been reached';
				}
			}else{
				E.phase=Math.asin(power*XS/E.mag);
				subPhasors(IXS, E, V);
				IA.mag=IXS.mag/XS;
				IA.phase=IXS.phase-Math.PI/2;
				if (IA.mag>Imax){
					calcImax_E();
				}
			}
		}else{ // hit sin delta =1
			if(power>E.mag/XS){
				power=E.mag/XS;
				E.phase=Math.asin(power*XS/E.mag);
				subPhasors(IXS, E, V);
				IA.mag=IXS.mag/XS;
				IA.phase=IXS.phase-Math.PI/2;
				// still neeed to check if current limit has been reached before power limit
				if (IA.mag>Imax){
					calcImax_E();
				}else{
					errormsg= 'Power has reach limit at this Excitation (P=3VE/Xs)';
				}
			}else{
				E.phase=Math.asin(power*XS/E.mag);
				subPhasors(IXS, E, V);
				IA.mag=IXS.mag/XS;
				IA.phase=IXS.phase-Math.PI/2;
				if (IA.mag>Imax){
					// calculate power at Imax and E.mag
					IXS.mag=Imax*XS;
					// cosine rule to find delta
					E.phase=Math.acos((E.mag*E.mag+1-IXS.mag*IXS.mag)/(2*E.mag)); // V=1pu
					power=E.mag*Math.sin(E.phase)/XS;
					subPhasors(IXS, E, V);
					IA.mag=IXS.mag/XS;
					IA.phase=IXS.phase-Math.PI/2;
					errormsg='IA max current limit reached';
				}
			}
		}
		doDrawing();
	});

	stepDnPButton.addEventListener("click", function(){
		errormsg='';
		power=power-dP;
	 	if (power<Pmin){
			power=Pmin;
			E.phase=Math.asin(power*XS/E.mag);
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
			errormsg='Minimum Power Limit has been reached';
		}else{
			E.phase=Math.asin(power*XS/E.mag);
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
		}
	    doDrawing();
	});  
	stepUpEButton.addEventListener("click", function(){
		errormsg='';
		E.mag=E.mag+dE;
	 	if (E.mag>Emax){ // hit limit for max E
			E.mag=Emax;
			E.phase=Math.asin(power*XS/E.mag);
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
			// still neeed to check if current limit has been reached first
			if (IA.mag>Imax){
				// power  is known, find theta, E, delta at Imax
				IA.mag=Imax;
				IXS.mag=Imax*XS;
				IA.phase=-Math.acos(power/IA.mag); //if this limit is reached while increasing E, then theta is negative.
				IXS.phase=IA.phase+Math.PI/2	;				   
				addPhasors(E, V, IXS);
				errormsg='IA max current limit reached';
			}else{
			errormsg='Maximum Excitation Limit has been reached';	
			}
		}else{ // havent reaching E limit
			E.phase=Math.asin(power*XS/E.mag); 
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
			// still neeed to check if current limit has been reached
			if (IA.mag>Imax){
				// power  is known, find theta, E, delta at Imax
				IXS.mag=Imax*XS;
				IA.phase=-power/IA.mag; //if this limit is reached while increasing E, then theta is negative.
				IXS.phase=IA.phase+Math.PI/2;					   
				addPhasors(E, V, IXS);
				errormsg='IA max current limit reached';
			}
		}
	    doDrawing();
	});  
	stepDnEButton.addEventListener("click", function(){
		errormsg='';
		E.mag=E.mag-dE;
	 	if (E.mag<Emin){//hit minimum E limit
			E.mag=Emin;
			E.phase=Math.asin(power*XS/E.mag);
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
			// still neeed to check if current limit has been reached first
			if (IA.mag>Imax){
				// power  is known, find theta, E, delta at Imax
				IA.mag=Imax;
				IXS.mag=Imax*XS;
				IA.phase=Math.acos(power/IA.mag); //if this limit is reached while decreasing E, then theta is positive.
				IXS.phase=IA.phase+Math.PI/2;					   
				addPhasors(E, V, IXS);
				errormsg='IA max current limit reached';
			}else{
			errormsg='Minimum Excitation limit has been reached';	
			}
		} else if(power>E.mag/XS){
			E.mag=power*XS;
			E.phase=Math.PI/2;
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
			// still neeed to check if current limit has been reached
			if (IA.mag>Imax){
				// power  is known, find theta, E, delta at Imax
				IA.mag=Imax;
				IXS.mag=Imax*XS;
				IA.phase=Math.acos(power/IA.mag); //if this limit is reached while decreasing E, then theta is positive.
				IXS.phase=IA.phase+Math.PI/2	;				   
				addPhasors(E, V, IXS);
				errormsg='IA max current limit reached';
			}else{
				errormsg='Cannot reduce E and maintain power; limit been reached';
			}
		}else{
			E.phase=Math.asin(power*XS/E.mag);
			subPhasors(IXS, E, V);
			IA.mag=IXS.mag/XS;
			IA.phase=IXS.phase-Math.PI/2;
			// still neeed to check if current limit has been reached
			if (IA.mag>Imax){
				// power  is known, find theta, E, delta at Imax
				IA.mag=Imax;
				IXS.mag=Imax*XS;
				IA.phase=Math.acos(power/IA.mag); //if this limit is reached while decreasing E, then theta is positive.
				IXS.phase=IA.phase+Math.PI/2;					   
				addPhasors(E, V, IXS);
				errormsg='IA max current limit reached';
			}
		}
	    doDrawing();
	}); 
	
	resetButton.addEventListener("click", function(){
		theta=thetanom*Math.PI/180;
		IA={mag:1,phase:theta};
		IXS={mag:XS,phase:(IA.phase+Math.PI/2)};
		E.mag=Enom;
		E.phase=deltanom*Math.PI/180;
		V.mag=1;
		V.phase=0;
		power=Pnom;
	    doDrawing();
	}); 
	
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
function labelAngle(ctx,x0,y0,magn,start,end,name){	
	'use strict';
	ctx.save();
	ctx.lineWeight=1;
	ctx.strokeStyle="rgb(64,64,64)";
	ctx.beginPath();
	ctx.arc(x0,y0,magn, start, end,true); 
	ctx.stroke();
	var txtposx=(magn*1.25)*Math.cos((start+end)/2);
	var txtposy=(magn*1.25)*Math.sin((start+end)/2);
	ctx.fillStyle="rgb(64,64,64)";
	ctx.textBaseline="middle";
	ctx.textAlign="center";
	ctx.fillText(name,x0+txtposx,y0+txtposy);
	ctx.restore();
}	

function addPhasors(a,b,c){
	//a=b+c
	'use strict';
	var  real, imag;
	real=b.mag*Math.cos(b.phase)+c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)+c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}
function subPhasors(a,b,c){
	// a=b-c
	'use strict';
	var real, imag;
	real=b.mag*Math.cos(b.phase)-c.mag*Math.cos(c.phase);
	imag=b.mag*Math.sin(b.phase)-c.mag*Math.sin(c.phase);
	a.mag=Math.sqrt(real*real+imag*imag);
	a.phase=Math.atan2(imag,real);
}

	
