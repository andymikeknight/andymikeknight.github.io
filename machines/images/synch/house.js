// JavaScript Document

document.addEventListener('DOMContentLoaded',phasorhse,false);

function phasorhse() {
	'use strict';
/* this script requires the canvas to be placed in an html elemnt (div or figure) with id="canvasholder_hse" and the canvas to have an id="canvas_hse" */
/*The script draws a house diagam of two generators operaitng in parallel, as the power and no-load frequencies are asjusted. */

	
 var cont_hse=document.getElementById("canvasholder_house");
 var myc_hse = document.getElementById("canvas_house");
	
 

 if (null===myc_hse || !myc_hse.getContext) {
 	return; 
 }

 var ctx_hse=myc_hse.getContext("2d");
 
 ctx_hse=myc_hse.getContext("2d");
 

 /*define some basic size information required for drawings
 This drawing is divided into 2 sections; house diagram, bottom section of 4 lines text, surrounded by a border.
 Aspect ratio will be worked out when drawing is initialized.
 */
  
    var maxW=512; var aspect;
	var scale, winW, winH, width1, drawW, drawH, border, lineH, pscale, fscale, fymin, fymax;
	
	
	// define some machine base case and range information, in per unit
	
	var G1={pmax:1, fnl:60.1, p:4, sp:5};
	var G2={pmax:1, fnl:60.1, p:16, sp:4};
	var fsys, pload;
	
		//limit variation inputs 
	var Pmin = (G1.pmax+G2.pmax)*0.15;
	var Pmax = (G1.pmax+G2.pmax)*0.8;
	var dP = Pmax/10;
	var fsmin=59.8;
	var fsmax=60.1;
	var df=0.02;
	// initial condition
	fsys=60;
	G1.P=G1.sp*(G1.fnl-fsys);
	G2.P=G2.sp*(G2.fnl-fsys);
	pload=G1.P+G2.P;
	
	function gendata(gen){
		gen.df=gen.pmax/gen.sp;
		gen.ffl=gen.fnl-gen.df;
		gen.nnl=gen.fnl*120/gen.p;
		gen.nfl=gen.ffl*120/gen.p;
		gen.fmax=fsmax+gen.df;
		gen.fmin=fsmin+gen.df;
	}
	
	gendata(G1);
	gendata(G2);

	
	var x0,y0;
	var errormsg='';

	function initDrawing(){
		width1=cont_hse.offsetWidth;
		if (width1>maxW){
			winW=maxW;
			scale=1;
		}
		if (width1<maxW){
			scale=width1/maxW;
			winW=width1;
		}
		

	 // set canvas size based on containing div size (fluid resizing)		
		ctx_hse.canvas.width=winW;

	 // define font sizes, scaled with width.
		var nomFontH=16;
		var fontH=Math.round(nomFontH*scale);
		
		// drawing border =2% of width;
		border =Math.round(winW*0.02);
		// actual diagram width
		drawW=winW-2*border;
		// actual diagram height
		drawH=Math.round(drawW/2);
		//line spacing = 1.5 * font height
		lineH=Math.round(fontH*1.5);
		var botTextH=6*lineH;
		// define and set canvas height
		winH=2*border+drawH+botTextH;
		ctx_hse.canvas.height=winH;
		ctx_hse.fillStyle="#000000";
		ctx_hse.lineWidth=1;
		ctx_hse.font="Italic "+Math.round(fontH)+"px Times ";
		ctx_hse.textAlign="left";	
	
		aspect=winW/winH;

		
		
     // drawing always has zero power at centre point, 

		pscale=0.8*(drawW/2)/Math.max(G1.pmax, G2.pmax);
		fymin=59.5;
		fymax=60.4;
		fscale=(drawH-border)/(fymax-fymin); 


		// draw voltage origin at 5% in from left edge, 50% vertical
		x0=border;
		y0=drawH;
		

// finished init of canvas, now init drawing

		
		
		doDrawing();
	}

	
	
	
	function doDrawing(){
		ctx_hse.clearRect(0,0,winW,winH);


		// draw and label axes
		var arr=4*scale;
		ctx_hse.save();
		ctx_hse.strokeStyle="#000000";
		ctx_hse.beginPath();
		ctx_hse.moveTo(x0, y0);
		ctx_hse.lineTo(x0+arr,y0+arr);
		ctx_hse.lineTo(x0+arr,y0-arr);
		ctx_hse.lineTo(x0,y0);
		ctx_hse.lineTo(x0+drawW,y0);
		ctx_hse.lineTo(x0+drawW-arr,y0-arr);
		ctx_hse.lineTo(x0+drawW-arr,y0+arr);
		ctx_hse.lineTo(x0+drawW,y0);
		ctx_hse.moveTo(x0+drawW/2, y0);
		ctx_hse.lineTo(x0+drawW/2, border);
		ctx_hse.lineTo(x0+drawW/2-arr, border+arr);
		ctx_hse.lineTo(x0+drawW/2+arr, border+arr);
		ctx_hse.lineTo(x0+drawW/2, border);
		ctx_hse.stroke();
		ctx_hse.fillStyle="#000000";
		ctx_hse.textAlign="left";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('f',x0+drawW/2+2*arr, border);
		ctx_hse.fillStyle="#0000FF";
		ctx_hse.textAlign="left";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('+P G1',x0, y0+2*arr);
		ctx_hse.fillStyle="#FF0000";
		ctx_hse.textAlign="right";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('+P G2',x0+drawW, y0+2*arr);
		
		// draw G1 line
		ctx_hse.save();
		ctx_hse.strokeStyle="#0000FF";
		ctx_hse.beginPath();
		var yfnl=y0-Math.round(fscale*(G1.fnl-fymin));
		var yffl=y0-Math.round(fscale*(G1.ffl-fymin));
		ctx_hse.moveTo(winW/2,yfnl);
		ctx_hse.lineTo(winW/2-G1.pmax*pscale,yffl);
		ctx_hse.stroke();
		// draw dotted line for no-load
		ctx_hse.setLineDash([3]);
		ctx_hse.beginPath();
		ctx_hse.moveTo(winW/2,yfnl);
		ctx_hse.lineTo(winW/4,yfnl);
		ctx_hse.stroke();
		ctx_hse.fillStyle="#0000FF";
		ctx_hse.textAlign="left";
		ctx_hse.textBaseline="bottom";
		ctx_hse.fillText('f_nl = '+(G1.fnl).toFixed(3)+'Hz',winW/8,yfnl-arr);
		ctx_hse.restore();
		
		// draw G2 line
		ctx_hse.save();
		ctx_hse.strokeStyle="#FF0000";
		ctx_hse.beginPath();
		yfnl=y0-Math.round(fscale*(G2.fnl-fymin));
		yffl=y0-Math.round(fscale*(G2.ffl-fymin));
		ctx_hse.moveTo(winW/2,yfnl);
		ctx_hse.lineTo(winW/2+G2.pmax*pscale,yffl);
		ctx_hse.stroke();
		// draw dotted line for no-load
		ctx_hse.setLineDash([3]);
		ctx_hse.beginPath();
		ctx_hse.moveTo(winW/2,yfnl);
		ctx_hse.lineTo(3*winW/4,yfnl);
		ctx_hse.stroke();
		ctx_hse.fillStyle="#FF0000";
		ctx_hse.textAlign="right";
		ctx_hse.textBaseline="bottom";
		ctx_hse.fillText('f_nl = '+(G2.fnl).toFixed(3)+'Hz',7*winW/8,yfnl-arr);
		ctx_hse.restore();
		
		// draw fsys line
		ctx_hse.save();
		ctx_hse.strokeStyle="#000000";
	
		ctx_hse.beginPath();
		var yfsys=y0-Math.round(fscale*(fsys-fymin));
		ctx_hse.moveTo(winW/2-G1.P*pscale,yfsys);
		ctx_hse.lineTo(winW/2+G2.P*pscale,yfsys);
		ctx_hse.stroke();
		ctx_hse.setLineDash([4]);
		ctx_hse.beginPath();
		ctx_hse.moveTo(winW/2+G2.P*pscale,yfsys);
		ctx_hse.lineTo(border+drawW,yfsys);
		ctx_hse.stroke();
		ctx_hse.fillStyle="#000000";
		ctx_hse.textAlign="right";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('f_sys = '+fsys.toFixed(3)+'Hz',border+drawW,yfsys+arr);
		ctx_hse.restore();
		
		// draw and label vertical power lines
		ctx_hse.save();
		ctx_hse.setLineDash([4]);
		ctx_hse.strokeStyle="#0000FF";
		ctx_hse.beginPath();
		ctx_hse.moveTo(winW/2-G1.P*pscale,yfsys);
		ctx_hse.lineTo(winW/2-G1.P*pscale,y0+arr);
		ctx_hse.stroke();
		ctx_hse.fillStyle="#0000FF";
		ctx_hse.textAlign="center";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('P1',winW/2-G1.P*pscale,y0+arr);
		ctx_hse.fillText(''+(G1.P*1000).toFixed(1)+'kW',winW/2-G1.P*pscale,y0+arr+lineH);
		
		ctx_hse.strokeStyle="#FF0000";
		ctx_hse.beginPath();
		ctx_hse.moveTo(winW/2+G2.P*pscale,yfsys);
		ctx_hse.lineTo(winW/2+G2.P*pscale,y0+arr);
		ctx_hse.stroke();		
		ctx_hse.fillStyle="#FF0000";
		ctx_hse.textAlign="center";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('P1',winW/2+G2.P*pscale,y0+arr);
		ctx_hse.fillText(''+(G2.P*1000).toFixed(1)+'kW',winW/2+G2.P*pscale,y0+arr+lineH);		
		ctx_hse.restore();
		
		
		// add some info at the bottom
		ctx_hse.fillStyle="#333333";
		ctx_hse.textAlign="left";
		ctx_hse.textBaseline="top";
		ctx_hse.fillText('P load '+(pload*1000).toFixed(1)+'kW'						,border,y0+arr+2*lineH);
		ctx_hse.fillText('G1 no-load '+(G1.nnl).toFixed(2)+' rpm'					,border,y0+arr+3*lineH);		
		ctx_hse.fillText('G1 full-load '+(G1.nfl).toFixed(2)+' rpm'					,border,y0+arr+4*lineH);
		
		ctx_hse.fillText('G2 no-load '+(G2.nnl).toFixed(2)+' rpm'					,winW/2,y0+arr+3*lineH);		
		ctx_hse.fillText('G2 full-load '+(G2.nfl).toFixed(2)+' rpm'					,winW/2,y0+arr+4*lineH);
		
		ctx_hse.fillText(errormsg,border, winH-border-lineH);
	}
		
	
	initDrawing();
	window.addEventListener('resize',initDrawing,false);


	
	var stepUpPButton = document.getElementById('stepUpP');
	var stepDnPButton = document.getElementById('stepDnP');
	var stepUpfButton = document.getElementById('stepUpf');
	var stepDnfButton = document.getElementById('stepDnf');
	var stepUpG1Button = document.getElementById('stepUpG1');
	var stepDnG1Button = document.getElementById('stepDnG1');
	var stepUpG2Button = document.getElementById('stepUpG2');
	var stepDnG2Button = document.getElementById('stepDnG2');
	var resetButton = document.getElementById('reset');
	

	
    stepUpPButton.addEventListener("click", function(){
		errormsg='';
		pload=pload+dP;
		if (pload>Pmax){
			errormsg='Max power setting reached';
			pload=Pmax;
		}
		fsys=(G1.sp*G1.fnl+G2.sp*G2.fnl-pload)/(G1.sp+G2.sp);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		if(fsys<fsmin){
			errormsg='minimum system frequency reached';
			fsys=fsmin;
			G1.P=G1.sp*(G1.fnl-fsys);
			G2.P=G2.sp*(G2.fnl-fsys);
			pload=G1.P+G2.P;
		}
		
		if (G1.P>G1.pmax){
			errormsg='G1 max power reached';
			G1.P=G1.pmax;
			fsys=G1.fnl-G1.P/G1.sp;
			G2.P=G2.sp*(G2.fnl-fsys);
			pload=G1.P+G2.P;
		}
		if (G2.P>G1.pmax){
			errormsg='G2 max power reached';
			G2.P=G2.pmax;
			fsys=G2.fnl-G2.P/G2.sp;
			G1.P=G1.sp*(G1.fnl-fsys);
			pload=G1.P+G2.P;
		}
		
		doDrawing();
	});

    stepDnPButton.addEventListener("click", function(){
		errormsg='';
		pload=pload-dP;
		if (pload<Pmin){
			errormsg='Min power setting reached';
			pload=Pmin;
		}
		fsys=(G1.sp*G1.fnl+G2.sp*G2.fnl-pload)/(G1.sp+G2.sp);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		// decreasing P might have made one generator power go negative
		if (G1.P<0){
			errormsg='G1 power equals zero ';
			G1.P=0;
			fsys=G1.fnl;
			G2.P=G2.sp*(G2.fnl-fsys);
			pload=G2.P;
		}else if(G2.P<0){
			errormsg='G2 power equals zero ';
			G2.P=0;
			fsys=G2.fnl;
			G1.P=G1.sp*(G1.fnl-fsys);
			pload=G1.P;
		}
		
		
		doDrawing();
	});
    stepUpfButton.addEventListener("click", function(){
		errormsg='';
		G1.fnl=G1.fnl+df;
		G2.fnl=G2.fnl+df;
		fsys=(G1.sp*G1.fnl+G2.sp*G2.fnl-pload)/(G1.sp+G2.sp);
		if (fsys>fsmax){
			errormsg='max system frequency reached';
			fsys=fsmax;
			// calc max increase in both fnl values - reset to previous
			G1.fnl=G1.fnl-df;
			G2.fnl=G2.fnl-df;
			//power hasnt changed:
			var dfmax=(pload+(G1.sp+G2.sp)*fsys-(G1.sp*G1.fnl+G2.sp*G2.fnl))/(G1.sp+G2.sp);
			G1.fnl=G1.fnl+dfmax;
			G2.fnl=G2.fnl+dfmax;			
		}
		gendata(G1);
		gendata(G2);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		doDrawing();
	});

    stepDnfButton.addEventListener("click", function(){
		errormsg='';
		G1.fnl=G1.fnl-df;
		G2.fnl=G2.fnl-df;
		fsys=(G1.sp*G1.fnl+G2.sp*G2.fnl-pload)/(G1.sp+G2.sp);
		if (fsys<fsmin){
			errormsg='min system frequency reached';
			fsys=fsmin;
			// calc max increase in both fnl values - reset to previous
			G1.fnl=G1.fnl+df;
			G2.fnl=G2.fnl+df;
			//power hasnt changed:
			var dfmax=(pload+(G1.sp+G2.sp)*fsys-(G1.sp*G1.fnl+G2.sp*G2.fnl))/(G1.sp+G2.sp);
			G1.fnl=G1.fnl+dfmax;
			G2.fnl=G2.fnl+dfmax;			
		}
		gendata(G1);
		gendata(G2);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		doDrawing();
	});
	stepUpG1Button.addEventListener("click", function(){
		errormsg='';
		G1.fnl=G1.fnl+df;
		fsys=(G1.sp*G1.fnl+G2.sp*G2.fnl-pload)/(G1.sp+G2.sp);
		if (fsys>fsmax){
			errormsg='max system frequency reached';
			fsys=fsmax;
			// calc max increase in both fnl values - reset to previous
			G1.fnl=G1.fnl-df;
			//power hasnt changed:
			var dfmax=(pload+(G1.sp+G2.sp)*fsys-(G1.sp*G1.fnl+G2.sp*G2.fnl))/(G1.sp);
			G1.fnl=G1.fnl+dfmax;
			
		}
		gendata(G1);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		// increasing fnl1 might have made G1.P>G1.Pmax
		if (G1.P>G1.pmax){
			errormsg='G1 max power reached';
			G1.P=G1.pmax;
			G2.P=pload-G1.P;
			fsys=G2.fnl-G2.P/G2.sp;
			G1.fnl=G1.pmax/G1.sp+fsys;
			gendata(G1);
		}
		// increasing fnl1 might have made G2.P<0
		if (G1.P>pload){
			errormsg='G2 power equals zero ';
			G1.P=pload;
			G2.P=0;
			fsys=G2.fnl;
			G1.fnl=G1.P/G1.sp+fsys;
			gendata(G1);
		}
		doDrawing();

	});

    stepDnG1Button.addEventListener("click", function(){
		errormsg='';
		G1.fnl=G1.fnl-df;
		fsys=(G2.sp*G2.fnl+G1.sp*G1.fnl-pload)/(G1.sp+G2.sp);
		if (fsys<fsmin){
			errormsg='min system frequency reached';
			fsys=fsmin;
			// calc max increase in both fnl values - reset to previous
			G1.fnl=G1.fnl+df;
			//power hasnt changed:
			var dfmax=(pload+(G1.sp+G2.sp)*fsys-(G1.sp*G1.fnl+G2.sp*G2.fnl))/(G1.sp);
			G1.fnl=G1.fnl+dfmax;
			
		}
		gendata(G1);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		// decreasing fnl1 might have made G2.P>G2.Pmax
		if (G2.P>G2.pmax){
			errormsg='G2 max power reached';
			G2.P=G2.pmax;
			G1.P=pload-G2.P;
			fsys=G2.fnl-G2.P/G2.sp;
			G1.fnl=G1.P/G1.sp+fsys;
			gendata(G1);
		}
		// decreasing fnl1 might have made G1.P<0
		if (G1.P<0){
			errormsg='G1 power equals zero ';
			G2.P=pload;
			fsys=G2.fnl-G2.P/G2.sp;
			G1.P=0;
			G1.fnl=fsys;
			gendata(G1);
		}
		doDrawing();
	});
	stepUpG2Button.addEventListener("click", function(){
		errormsg='';
		G2.fnl=G2.fnl+df;
		fsys=(G2.sp*G2.fnl+G1.sp*G1.fnl-pload)/(G1.sp+G2.sp);
		if (fsys>fsmax){
			errormsg='max system frequency reached';
			fsys=fsmax;
			// calc max increase in both fnl values - reset to previous
			G2.fnl=G2.fnl-df;
			//power hasnt changed:
			var dfmax=(pload+(G1.sp+G2.sp)*fsys-(G1.sp*G1.fnl+G2.sp*G2.fnl))/(G2.sp);
			G2.fnl=G2.fnl+dfmax;
			
		}
		gendata(G2);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		// increasing fnl1 might have made G1.P>G1.Pmax
		if (G2.P>G1.pmax){
			errormsg='G2 max power reached';
			G2.P=G2.pmax;
			G1.P=pload-G2.P;
			fsys=G1.fnl-G1.P/G1.sp;
			G2.fnl=G2.pmax/G2.sp+fsys;
			gendata(G2);
		}
		// increasing fnl1 might have made G2.P<0
		if (G2.P>pload){
			errormsg='G1 power equals zero ';
			G2.P=pload;
			G1.P=0;
			fsys=G1.fnl;
			G2.fnl=G2.P/G2.sp+fsys;
			gendata(G2);
		}
		doDrawing();
	});

    stepDnG2Button.addEventListener("click", function(){
		errormsg='';
		G2.fnl=G2.fnl-df;
		fsys=(G2.sp*G2.fnl+G1.sp*G1.fnl-pload)/(G1.sp+G2.sp);
		if (fsys<fsmin){
			errormsg='min system frequency reached';
			fsys=fsmin;
			// calc max increase in both fnl values - reset to previous
			G2.fnl=G2.fnl+df;
			//power hasnt changed:
			var dfmax=(pload+(G1.sp+G2.sp)*fsys-(G1.sp*G1.fnl+G2.sp*G2.fnl))/(G2.sp);
			G2.fnl=G2.fnl+dfmax;
			
		}
		gendata(G2);
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		// decreasing fnl1 might have made G1.P>G1.Pmax
		if (G1.P>G1.pmax){
			errormsg='G1 max power reached';
			G1.P=G1.pmax;
			G2.P=pload-G1.P;
			fsys=G1.fnl-G1.P/G1.sp;
			G2.fnl=G2.P/G2.sp+fsys;
			gendata(G2);
		}
		// decreasing fnl1 might have made G1.P<0
		if (G2.P<0){
			errormsg='G2 power equals zero ';
			G1.P=pload;
			fsys=G1.fnl-G1.P/G1.sp;
			G2.P=0;
			G2.fnl=fsys;
			gendata(G2);
		}
		doDrawing();
	});
	resetButton.addEventListener("click", function(){
		errormsg='';
		G1.fnl=60.1;
		G2.fnl=60.1;

		fsys=60;
		G1.P=G1.sp*(G1.fnl-fsys);
		G2.P=G2.sp*(G2.fnl-fsys);
		pload=G1.P+G2.P;
	
		gendata(G1);
		gendata(G2);

	    doDrawing();
	}); 
	
}

