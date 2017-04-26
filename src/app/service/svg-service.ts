// import { RangeObservable } from 'rxjs/observable/RangeObservable';
// import { elementAt } from 'rxjs/operator/elementAt';
// import { ArrayLikeObservable } from 'rxjs/observable/ArrayLikeObservable';
import { Injectable, EventEmitter } from '@angular/core';
import { wires } from './model';
// import { paperClickService } from './paper-click-service'
// import {wireService} from './wire-service';
declare let Snap : any;
// declare let math: any;
// import * as math from 'mathjs';

@Injectable()
export class svgService{
    constructor(
        // private pcs : paperClickService
    ){
     this.clickEvent.subscribe(ev => this.onPaperClick(ev));

    }
    // Snap objects
    paper: any;
    paths: any;
    elements: any;
    
    //being used by renderElement
    allElem: Array<any>;
    insertedElemIndex: number;
    // being used by clickevent
    elemOnPoint: any;
    objectOnPoint : any;
    rectToUnfocus: Array<any>;
    arrayOfTerminals: Array<any> =[];
    selectedComponentID: any;
    currentArray: Array<any> =[];
    pathArray: Array<any> = [];
    count: number = 0;
    flag : number  = 0;
    // offSet: any;
    public objectSelected: EventEmitter<any> = new EventEmitter(true);
    public clickEvent: EventEmitter<any> = new EventEmitter(true);
    // screenCTM:any;

    svgInitialize(){ 
        console.log('Ready to create new svg');
        // console.log(Snap);
        this.paper = Snap('#svgout');
        this.paths = this.paper.g(); // all the paths drawn
        this.elements = this.paper.g(); //all the elements
        // this.offSet = this.paper.node.getScreenCTM();
        // this.paper.click(this.clickresponse);
        this.paperclick();
        // this.screenCTM = this.paper.node.getScreenCTM();
        this.mousewheelEvent();
        
    }

     renderElement(svgElem: string){
        // let allElem, insertedElemIndex;
        this.elements.add(Snap.parse(svgElem));
        this.allElem = this.elements.selectAll('g');
        this.insertedElemIndex =this.allElem.length - 2;
        this.attachEvents(this.allElem[this.insertedElemIndex]); 
        // this.allElem[this.insertedElemIndex].select('text').node.innerHTML = "Test";
    }

    rotateElement(){
        if(this.selectedComponentID != null){
        let updatedElem = this.updateSelectedElem(this.selectedComponentID);  
        let bbox = updatedElem.getBBox(); //bounding box, get coords and centre
        let rotateMat = new Snap.Matrix();
        rotateMat.rotate(90,bbox.cx, bbox.cy);
        let w = updatedElem.transform().localMatrix; 
        w.multLeft(rotateMat);
        updatedElem.transform(w);
        // this.objectOnPoint[1].orientation = this.objectOnPoint[1].orientation =="vertical"? "horizonal": "vertical";
        switch (this.objectOnPoint[1].orientation) {
            case 0:
            this.objectOnPoint[1].orientation = 90;
            break;
            case 90:
            this.objectOnPoint[1].orientation = 180;
            break;
            case 180:
            this.objectOnPoint[1].orientation = 270;
            break;
            case 270:
            this.objectOnPoint[1].orientation = 0;
            break;
            
            default:
            this.objectOnPoint[1].orientation = 90;
        }

        console.log(this.objectOnPoint[1].orientation);

        }

    }   
    
    updateSelectedElem(currentID: string){
        let allelem = this.paper.selectAll("*");
        for(let elem of allelem){
            if(elem.id == currentID){
                return elem;
            }
        } 
        return null;
    }
    

    attachEvents(el){
        // console.log(el);
        // this.drag.dragEventOnComponent(el);
        this.dragEventOnComponent(el);
        el.hover(function(){
            el.addClass('hoverR');
        }, function(){
            el.removeClass('hoverR');
        });
    }

    dragEventOnComponent(el){
        let  onmove = function(x,y){
            console.log('move drag');
            this.attr({
                transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [x, y]
            });
        }
        let onend = function (){
        console.log('finished dragging');
        }
    
        let onstart =function (){
            console.log('start drag');
            this.data('origTransform', this.transform().local );
        }  
        el.drag(onmove, onstart, onend);
    }

    
    paperclick(){
        let self = this; // 
        this.paper.click(clickresponsetrail);
        function clickresponsetrail(event,cx,cy){
            console.log(event);
            self.clickEvent.emit([cx,cy]);
        }
    }

   
    onPaperClick(ev){
        console.log(this);
        console.log(ev);
        console.log('called');
        let svg = this.paper.node;
        var pt = svg.createSVGPoint();
        pt.x = ev[0];
        pt.y = ev[1];
        var ptn = pt.matrixTransform(svg.getScreenCTM().inverse());
        let offSet = this.paper.node.getScreenCTM(); // p.e and p.f
        // this.paper.circle(cx - w.e,cy - w.f,2);    
        this.elemOnPoint =  Snap.getElementByPoint(pt.x,pt.y);
            // self.rectToUnfocus = this.paper.selectAll('rect');
        this.removeHighlightClass();

        if(this.elemOnPoint.type =="path"){
            console.log('on path');
            console.log(this.elemOnPoint);
            this.elemOnPoint.addClass("highlight");
            this.selectedComponentID = this.elemOnPoint.id;
            this.objectOnPoint = this.getSelectedObject(this.selectedComponentID, "path");
        }

        
        // this conditional is for selection of elements between which the paths is to be drawn

        if(this.elemOnPoint.type =="rect"){
            this.elemOnPoint.addClass("highlight");
            this.selectedComponentID = this.elemOnPoint.parent().id;
            this.objectOnPoint = this.getSelectedObject(this.selectedComponentID, "element");
            // console.log(this.objectOnPoint);
            
            console.log(offSet);
            this.objectSelected.emit("rect");

            let terminalSelectConfirm = /(_positive|_negative)$/;
            if(this.elemOnPoint.attr('id').search(terminalSelectConfirm)!=-1){
                let x_t = ptn.x;//cx-offSet.e;
                let y_t = ptn.y;//  cy-offSet.f;
                
                let terminalID = this.elemOnPoint.attr('id');
                //  console.log(typeof(terminalID));
                let terminal = terminalID.match( /(_positive)$/)? this.objectOnPoint[1].positiveNodeID:this.objectOnPoint[1].negativeNodeID;
                if(this.arrayOfTerminals.length>0 ){
                    if(this.arrayOfTerminals[0][2].id != this.objectOnPoint[1].id){
                        this.arrayOfTerminals.push([Number(x_t.toFixed(2)), Number(y_t.toFixed(2)), this.objectOnPoint[1],terminal]);
                        this.count+=1;
                    }
                }else{
                    this.arrayOfTerminals.push([Number(x_t.toFixed(2)), Number(y_t.toFixed(2)), this.objectOnPoint[1],terminal]);
                    this.count+=1;
                }
                
                if(this.count==2){
                    // now ensured that terminals have been clicked twice continuously
                    //draw  wire between two terminals
                    console.log(this.arrayOfTerminals);
                    let pth = this.dynamicGenerationOfPoint(this.arrayOfTerminals);//`<path d = "M${this.arrayOfTerminals[0][0]} ${this.arrayOfTerminals[0][1]} H${this.arrayOfTerminals[1][0]} M${this.arrayOfTerminals[1][0]} ${this.arrayOfTerminals[0][1]} V${this.arrayOfTerminals[1][1]}"/>`;
                    // console.log(pth);
                    let elem = Snap.parse(pth);
                    this.paths.add(elem);
                    // push to arrayPath
                    this.wire();
                    console.log(this.pathArray);
                    this.count =0;
                    // this.flag = 0;
                    this.arrayOfTerminals=[];
                }
                    // this.flag =1;
                    
                    // check for duplicacy
            }else{
                // you have not clicked a rectange
                if(this.arrayOfTerminals.length>0){
                    // second time
                    this.arrayOfTerminals = [];
                    this.count = 0;
                    this.flag = 0;
                }
            }
            // 
            
                
        }else{
            //set selectedElem to null
            if(this.arrayOfTerminals.length>0){
                // second time
                this.arrayOfTerminals = [];
                this.count = 0;
                this.flag = 0;
            }
            this.selectedComponentID = null;
            this.objectSelected.emit();
        }
    }

    removeHighlightClass(){
        let rectToUnfocus = this.paper.selectAll('rect');
        let pathsToUnfocus = this.paths.selectAll('path');
        // rectToUnfocus.push(this.paths.selectAll('path'));
        for(let rec of rectToUnfocus){
            if(rec.hasClass('highlight')){rec.removeClass('highlight')}
        }
        for(let path of pathsToUnfocus){
            if(path.hasClass('highlight')){path.removeClass('highlight')}
        }

    }

    wire(){
            let allPathsArray = this.paths.selectAll('path');
            let selectedPath = allPathsArray[allPathsArray.length-1];
            console.log(selectedPath);

            selectedPath.hover(function(){
                selectedPath.addClass('highlightPath')
            }, function(){
                selectedPath.removeClass('highlightPath');
            });
            
            this.pathArray.push(new wires(selectedPath, [this.arrayOfTerminals[0][3], this.arrayOfTerminals[1][3]], selectedPath.id ));
            
    }

     dynamicGenerationOfPoint(array){
                // dynamically generate non overlapping paths between two points
                console.log(typeof(array[0][1]));
            let dummyH = array[0][1];//(array[0][1] + array[1][1])/2;
            let dummyV = array[0][0];//(array[0][0] + array[1][0])/2; // dummyH => from where the dummy horizontal line will be drawn
            // dummyH--> y coordinate of first point 
            /*
                              ___           
                     |       |             ____|
                _____|    ___|            |
                        path vertical   path horizonal
            */

            function pth_horizontal(dummyH){
                return `<path d = "
                M${array[0][0]} ${array[0][1]} 
                V${dummyH}  M${array[0][0]} ${dummyH} 
                H${array[1][0]} M${array[1][0]} ${dummyH}             
                V${array[1][1]}"/>`
            };

            function pth_vertical(dummyV){
                return `<path d = "
                M${array[0][0]} ${array[0][1]} 
                H${dummyV}  M${dummyV} ${array[0][1]} 
                V${array[1][1]}  M${dummyV} ${array[1][1]} 
                H${array[1][0]}"/>`
            };

            // line bisection 2d plane
            //          *------------*-------------*
            //         (x,y)  (x_b, y_b)   (x_f, y_f)


            // rule of path selection
            // if both are vertical then pth_horizontal
            // if both are horizontal then pth_vertical
            
            if(array[0][2]=="horizontal" && array[0][2]=="horizontal"){
                return pth_horizontal(dummyH);
            }else{
                return pth_vertical(dummyV);
            }
            
    }

     mousewheelEvent(){
        let self = this;
        let wi = 600;
        let hi = 400;
        if( (/Firefox/i.test(navigator.userAgent)) ) {
            this.paper.node.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        } else {
            this.paper.node.addEventListener("mousewheel", mouseWheelHandler, false);
        }
        function  mouseWheelHandler (ev) { 
            ev.preventDefault();
            console.log( ev.target.localName );
            console.log(ev);
            // self.paper.circle(ev.clientX -10, ev.clientY-140, 9);
            if(ev.deltaY>0){
                wi+=5;
                hi+=5;
            }else{
                wi-=5;
                hi-=5;
            }
            
            self.paper.attr({viewBox:0+","+0+","+wi+","+hi});
        }
        
    }

    
    deleteSelectedObject(){
        console.log('deleteSelectedObject');
        this.objectOnPoint[1].svgRefElem.remove();
        console.log(this.currentArray);
        //get the selected object and delete it
        if(this.objectOnPoint[2] =="element"){
            this.currentArray.splice(this.objectOnPoint[0], 1 );
        }else if(this.objectOnPoint[2] =="path"){
            this.pathArray.splice(this.objectOnPoint[0], 1 );
        }
        
    }
    
    getSelectedObject(id: any, type){
        //self--> the svgService
        //this--> element 
        // ignore the warning as it is being called inside the declared function
        // console.log(id);
        if(type=="element"){
            for (let item in this.currentArray) {
                // console.log(item); 
                if(this.currentArray[item].id == id){
                    return [item, this.currentArray[item], "element"]
                }
            }
        }else if(type == "path"){
            for (let item in this.pathArray) {
                // console.log(item); 
                if(this.pathArray[item].id == id){
                    return [item, this.pathArray[item], "path"]
                }
            }            
        }
        
        return null;
    }

    updateCurrentArray(arr :any){

        this.currentArray.push( JSON.parse(JSON.stringify(arr)));

        this.currentArray[this.currentArray.length -1].svgRefElem =  this.allElem[this.insertedElemIndex];
        this.currentArray[this.currentArray.length -1].id = this.allElem[this.insertedElemIndex].id;
        console.log(this.currentArray);
    }

    getCurrentArray(){
        return this.currentArray;
    }


   


}