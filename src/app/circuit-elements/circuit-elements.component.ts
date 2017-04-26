// import { Component, Input, OnInit } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { electricalComponents } from '../service/model';
// // import {Snap} from 'snapsvg';
// // import Snap = require('snapsvg');
// // import * as Snap from 'snapsvg'
// declare var Snap : any;

// @Component({
//   selector: 'circuit-elements',
//   templateUrl: '/src/components/circuit-elements/circuit-elements.html',
// })

// export class CircuitElements implements OnInit {
//     i: number = 0;
//     paper: any;
//     componentList: Array<electricalComponents> =[];
//     count: number = 0;
//     selectedElem: any;
//     selElem: any;
//     transformMatrix: any;
//     arrayOfTerminals: Array<Array<number>> = [];
//     elements: any;
//     paths: any;

//     ngOnInit(){
//         console.log('Ready to create new svg');
//         console.log(Snap);
//         this.paper = Snap('#svgout');
        
//         this.paths = this.paper.g(); // all the paths drawn
//         this.elements = this.paper.g(); //all the elements

//         this.initComponentList();
//         this.clickEventOnPaper();
//         // this.dragEventOnPaper();
//         this.mousewheelEvent();
  
//     }

//     // removeHighlightClass(){
//     //     var rectToUnfocus = this.paper.selectAll('rect');
//     //         for(let rec of rectToUnfocus){
//     //             if(rec.hasClass('highlight')){rec.removeClass('highlight')}
//     //         }
//     // }

//     // clickEventOnPaper(){
//     //     var self = this;
//     //     var flag  = 0;
//     //     var count = 0;
//     //     this.paper.click(function(event, cx,cy){
//     //         console.log(cx, cy);
//     //         console.log(event);
//     //         // cx = event.offsetX; event.offsetY;
            
//     //          var elemOnPoint =  Snap.getElementByPoint(cx,cy);
//     //          var rectToUnfocus = this.paper.selectAll('rect');
//     //         for(let rec of rectToUnfocus){
//     //             if(rec.hasClass('highlight')){rec.removeClass('highlight')}
//     //         }
//     //         console.log(elemOnPoint);
//     //         if(elemOnPoint.type =="rect"){
//     //             elemOnPoint.addClass("highlight");
//     //             this.selectedElem = elemOnPoint.parent().id;
//     //             // var rgEx = new RegExp('/t');//'[a-zA-z]+ _positive|_negative'
//     //             var terminalSelectConfirm = /(_positive|_negative)$/;
//     //             if(elemOnPoint.attr('id').search(terminalSelectConfirm)!=-1){
//     //                 //it is clicked
//     //                 var elmB = elemOnPoint.node.getBoundingClientRect();
//     //                 console.log(elmB);//elemOnPoint.getBBox();
//     //                 var parB = elemOnPoint.parent().getBBox();
//     //                 console.log(elmB);
//     //                 console.log(parB);
//     //                 var x_t = event.layerX;
//     //                 var y_t = event.layerY;
//     //                 self.arrayOfTerminals.push([x_t, y_t]);
//     //                 count+=1;
//     //                 if(flag==1 && count==2){
//     //                     // now ensured that terminals have been clicked twice continuously
//     //                     //draw  wire between two terminals
//     //                     var pth = `<path d = "M${self.arrayOfTerminals[0][0]} ${self.arrayOfTerminals[0][1]} H${self.arrayOfTerminals[1][0]} M${self.arrayOfTerminals[1][0]} ${self.arrayOfTerminals[0][1]} V${self.arrayOfTerminals[1][1]}"/>`;
//     //                     // var x  = (this.paper.path(pth)) ;
//     //                     var elem = Snap.parse(pth);
//     //                     console.log(elem);
//     //                     self.paths.add(elem);
//     //                 //   this.paths.add(x);
                      
//     //                    count =0;
//     //                     flag = 0;
//     //                     self.arrayOfTerminals=[];
//     //                 }
//     //                     flag =1;
//     //                  // check for duplicacy
//     //             }
                  
//     //         }
//     //     })
//     // }
  
//     // dragEventOnComponent(el){
//     //     var  onmove = function(x,y){
//     //         console.log('move drag');
//     //         this.attr({
//     //             transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [x, y]
//     //         });
//     //     }
//     //     var onend = function (){
//     //     console.log('finished dragging');
//     //     }
    
//     //     var onstart =function (){
//     //         console.log('start drag');
//     //         this.data('origTransform', this.transform().local );
//     //     }  
//     //     el.drag(onmove, onstart, onend);

//     // }

//     // attachEvents(el){
//     //     this.dragEventOnComponent(el);
//     // }

//     // renderComponent(index){
//     //     this.count++
//     //     var elem = Snap.parse(this.componentList[index].svgParse);
//     //     console.log(elem);
//     //     this.elements.add(elem);

//     //     console.log(elem);
//     //     this.transformMatrix = new Snap.Matrix();
//     //     var allElem = this.elements.selectAll('g');

//     //     console.log(this.elements);
//     //     var insertedElemIndex =allElem.length - 2;
//     //     this.attachEvents(allElem[insertedElemIndex]); 
        
        
//     // }
    
//     clearAll(){
//         this.paper.clear();
//     }

//     // initComponentList(){
//     //     console.log('initComponentList');
//     //     this.componentList.push( new electricalComponents('resistor',
//     //      20,
//     //       'ohm',
//     //       ['mOhm','ohm', 'kOhm', 'Mohm'],
//     //       [1],
//     //       [-1],
//     //       `<g id="resistance">
//     //             <g>
//     //             <path id="path4172" d="m29 211 1 18-11 9 22 9-22 10 22 10-11 8 0 18" style="fill:none;stroke-width:2.13047051;stroke:#000"/>
//     //             </g>
//     //             <rect id= "resistance_rect" y="213" x="0" height="80" width="60" style="fill-rule:nonzero;fill:rgba(0,0,0,0);stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4"/>
//     //             <rect id= "resistance_positive"  y="203" x="24" height="10" width="10" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
//     //             <rect id= "resistance_negative" y="293" x="24" height="10" width="10" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/> 
//     //         </g>`
//     //      ));

//     //      this.componentList.push( new electricalComponents('Vdc',
//     //      20,
//     //       'V',
//     //       ['mV','V', 'kV', 'MV'],
//     //       [2],
//     //       [-2],
//     //       ` <g id="Vdc">
//     //             <g transform="translate(40,0)">
//     //             <path id="path4154" d="m17 85c13 0 13 0 48 0" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00036979;stroke:#000"/>
//     //             <path id="path4156" d="m40 85 0-33" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00802779;stroke:#000"/>
//     //             <path id="path4158" d="m27 100 27 0" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00189424;stroke:#000"/>
//     //             <path id="path4160" d="m41 100 0 33" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00802803;stroke:#000"/>
//     //             </g>
//     //         <rect id = "Vdc_rect" y="52" x="50" height="80" width="60"  style="fill-rule:nonzero;fill:rgba(0,0,0,0);stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4"/>
//     //         <rect id= "Vdc_positive"y="43" x="76" height="10" width="10" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
//     //         <rect id = "Vdc_negative" y="133" x="76" height="10" width="10"  style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
//     //         </g>`
//     //      ));
//     // }

//     // rotateComponents(){
//     //     var updatedElem = this.updateSelectedElem(this.paper.selectedElem);  
//     //     var bbox = updatedElem.getBBox(); //bounding box, get coords and centre
//     //     var rotateMat = new Snap.Matrix();
//     //     rotateMat.rotate(90,bbox.cx, bbox.cy);
//     //     var w = updatedElem.transform().localMatrix;
//     //     w.multLeft(rotateMat);
//     //     updatedElem.transform(w);

//     // }

//     // updateSelectedElem(currentID: string){
//     //     var allgs = this.paper.selectAll("*");
//     //     for(let g of allgs){
//     //         if(g.id == currentID){
//     //             return g;
//     //         }
//     //     } 
//     //     return null;
//     // }
//     // mousewheelEvent(){
//     //     var self = this;
//     //     var wi = 400;
//     //     var hi =300;
//     //     if( (/Firefox/i.test(navigator.userAgent)) ) {
//     //         this.paper.node.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
//     //     } else {
//     //         this.paper.node.addEventListener("mousewheel", mouseWheelHandler, false);
//     //     }
//     //     function  mouseWheelHandler (ev) { 
//     //         ev.preventDefault();
//     //         console.log( ev.target.localName );
//     //         console.log(ev);
//     //         // self.paper.circle(ev.clientX -10, ev.clientY-140, 9);
//     //         if(ev.deltaY>0){
//     //             wi+=5;
//     //             hi+=5;
//     //         }else{
//     //             wi-=5;
//     //             hi-=5;
//     //         }
            
//     //         self.paper.attr({viewBox:0+","+0+","+wi+","+hi});
//     //     }
        
//     // }
    

    
// }
// //below was for testing purpose
