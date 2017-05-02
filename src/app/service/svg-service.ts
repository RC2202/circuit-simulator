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
    elemCountOnCanvas: number = 0;
    wireConfig: number =0;
    bboxArray: any= [];
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
            this.objectSelected.emit("path");

             if(this.arrayOfTerminals.length>0){
                // second time
                this.arrayOfTerminals = [];
                this.count = 0;
                this.flag = 0;
            }
        }

        
        // this conditional is for selection of elements between which the paths is to be drawn

       else if(this.elemOnPoint.type =="rect"){
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
                    }else{
                        alert('Terminal Short Circuit');
                    }
                }else{
                    this.arrayOfTerminals.push([Number(x_t.toFixed(2)), Number(y_t.toFixed(2)), this.objectOnPoint[1],terminal]);
                    this.count+=1;
                }
                
                if(this.count==2){
                    // now ensured that terminals have been clicked twice continuously
                    //draw  wire between two terminals
                    console.log(this.arrayOfTerminals);
                    try{
                         this.drawWire(this.arrayOfTerminals);
                    }catch(e){
                        console.log(e)
                    }
                   
                    // let pth = this.dynamicGenerationOfPoint(this.arrayOfTerminals);//`<path d = "M${this.arrayOfTerminals[0][0]} ${this.arrayOfTerminals[0][1]} H${this.arrayOfTerminals[1][0]} M${this.arrayOfTerminals[1][0]} ${this.arrayOfTerminals[0][1]} V${this.arrayOfTerminals[1][1]}"/>`;
                    // console.log(pth);
                    // let elem = Snap.parse(pth);
                    // this.paths.add(elem);
                    // push to arrayPath
                    // this.wire();
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
            this.objectOnPoint = null;
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

    drawWire(terminals){

        var self = this ;
        let BBox = [];
        // let flag =0;
        let dummyH = [
            terminals[0][1],
            (terminals[0][1] + terminals[1][1])/2,
            terminals[0][0]
        ]; //terminals[0][1];//
        let dummyV = [
            terminals[0][0],
            (terminals[0][0] + terminals[1][0])/2,
            terminals[0][1]
            ];
        let dummy = [dummyH, dummyV];
        // let pointsOnpath = [];
        let selectedPath;
        function pth_horizontal(dummyH){
            return `M${terminals[0][0]} ${terminals[0][1]} 
            V${dummyH}  M${terminals[0][0]} ${dummyH} 
            H${terminals[1][0]} M${terminals[1][0]} ${dummyH}             
            V${terminals[1][1]}`
        };

        function pth_vertical(dummyV){
            return `M${terminals[0][0]} ${terminals[0][1]} 
            H${dummyV}  M${dummyV} ${terminals[0][1]} 
            V${terminals[1][1]}  M${dummyV} ${terminals[1][1]} 
            H${terminals[1][0]}`
        };

        function renderAndCheckPath(pth){

            selectedPath.attr({d: pth});
            // let selectedPathBBox = selectedPath.getBBox();
            // check for bbox intersection
            let tempPathArray = getPointArrayOfPath(selectedPath);
            let intersectFlag  = isIntersecting(BBox, tempPathArray);

            if(intersectFlag){
                return 0;
            }else{
                return 1;
            }
        };

        function isIntersecting(bbox, tempAr){ console.log(self);
            for (let b of bbox){
                // self.paper.path(b.path);
                for( let w of tempAr){
                    // self.paper.circle(w.x,w.y, 7);
                    if(Snap.path.isPointInside(b, w.x, w.y)){
                        return true;
                    }
                }
            }
            return false;
        }

        function getPointArrayOfPath(path){
            let tempArrayOfPoints = [];
            let totalLength = path.getTotalLength();
            // let numberOfPoints = 10;
            let lengthBtwPts = 30;
            let ignoreVal = 0;
            let iteration = totalLength/lengthBtwPts;
            for(let i =ignoreVal; i<iteration; i++){
                tempArrayOfPoints.push(JSON.parse(
                    JSON.stringify(
                        path.getPointAtLength(i*lengthBtwPts)
                        )
                    )
                );
            }
            return tempArrayOfPoints;
            
        }

        this.paths.el("path").attr({
            d: pth_horizontal(dummy[0][0])
        })
        // this.paths.add(elem);

        let allPathsArray = this.paths.selectAll('path');
         selectedPath = allPathsArray[allPathsArray.length-1];

        for( let array of this.currentArray){

           let b =  array.svgRefElem.select('rect').node.getBoundingClientRect(); // top left bottom right width height
           let offset = self.paper.node.getScreenCTM();// offset.e, offset.f
           let t = self.paper.node.createSVGPoint();
          
           t.x = b.left;
           t.y = b.top;
           let ptn = t.matrixTransform(offset.inverse());

            let x = `
                M${ptn.x},${ptn.y} 
                ${ptn.x},${ptn.y + b.height} 
                ${ptn.x + b.width},${ptn.y + b.height} 
                ${ptn.x + b.width},${ptn.y }
                z`;

             BBox.push(
                     JSON.parse(
                         JSON.stringify(
                             x
                         )
                     )
                 );
        }

        selectedPath.hover(function(){
            selectedPath.addClass('highlightPath')
            }, function(){
                selectedPath.removeClass('highlightPath');
            }
        );


        for(let t in dummy){
            for(let tu of dummy[t]){
                let pth;
                if(t == '0'){
                    pth = pth_horizontal(tu);
                }else{
                    pth = pth_vertical(tu);
                }
                //call a function to draw and check
                if(renderAndCheckPath(pth)){
                   this.pathArray.push(new wires(selectedPath, [this.arrayOfTerminals[0][3], this.arrayOfTerminals[1][3]], selectedPath.id ));
                    return 1;
                };
                
            }
        }
        this.pathArray.push(new wires(selectedPath, [this.arrayOfTerminals[0][3], this.arrayOfTerminals[1][3]], selectedPath.id ));
        return 0;// no clean wire path found --> will draw the last option
    }
    

    mousewheelEvent(){
        let self = this;
    
        let wi = 600;
        let hi = 400;
        let ratio = wi/hi;
        if( (/Firefox/i.test(navigator.userAgent)) ) {
            this.paper.node.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        } else {
            this.paper.node.addEventListener("mousewheel", mouseWheelHandler, false);
        }
        function  mouseWheelHandler (ev) { 
            ev.preventDefault();
            wi = self.paper.node.viewBox.baseVal.width;
            hi = self.paper.node.viewBox.baseVal.height;
            ratio = wi/hi;
            // console.log( ev.target.localName );
            // console.log(ev);
            // self.paper.circle(ev.clientX -10, ev.clientY-140, 9);
            if(ev.deltaY>0){
                hi+=5;
                wi+=5*ratio;
            }else{
                hi-=5;
                wi-=5*ratio;
            }
            self.paper.node.viewBox.baseVal.width = wi;
            self.paper.node.viewBox.baseVal.height = hi;
            // self.paper.attr({viewBox:0+","+0+","+wi+","+hi});
        }
        
    }

    
    deleteSelectedObject(){
        console.log('deleteSelectedObject');
        if(this.objectOnPoint != null){
            this.objectOnPoint[1].svgRefElem.remove();
            console.log(this.currentArray);
            //get the selected object and delete it
            if(this.objectOnPoint[2] =="element"){
                this.currentArray.splice(this.objectOnPoint[0], 1 );
            }else if(this.objectOnPoint[2] =="path"){
                this.pathArray.splice(this.objectOnPoint[0], 1 );
            }
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

        this.currentArray.push( arr); //JSON.parse(JSON.stringify(arr)));

        this.currentArray[this.currentArray.length -1].svgRefElem =  this.allElem[this.insertedElemIndex];
        this.currentArray[this.currentArray.length -1].id = this.allElem[this.insertedElemIndex].id;
        console.log(this.currentArray);
    }

    getCurrentArray(){
        return this.currentArray;
    }


   


}