// import { CyclicDependencyError } from '@angular/core/src/di/reflective_errors';
// import { ServicesModule } from '../../../src/services/services.module';
import { Injectable } from '@angular/core';
// import { svgService } from './svg-service';
// import * as math from 'mathjs';
// declare let math : any;
declare let Snap : any;
/* Not using paper -click -service and wire-Service
because communication among them and svg-service is creating
a circular loop dependency
*/


@Injectable()
export class paperClickService{

    constructor(
        // private svg: svgService
    ){
        // console.log(this.svg);
        // this.svg.clickEvent.subscribe(ev => this.onPaperClick(ev));
        console.log(this);
    }

    elemOnPoint: any;
    selectedComponentID:any;
    objectOnPoint: any;
    objectSelected: any;
    paper:any;
    arrayOfTerminals: Array<any> = [];
    count: number =0;
    flag: number =0;
    paths: any =[];
    pathArray: any = [];


    // function 
    getSelectedObject(e){
        console.log(e);
    }
    dynamicGenerationOfPoint(e){
        console.log(e);
    }   
    wire(){}


    onPaperClick(ev){
        console.log(this);
        console.log(ev);
        console.log('called');
        this.paper = ev.paper;
        this.paths = ev.path;
        let cx = ev.cood[0];
        let cy = ev.cood[1];
        
        this.elemOnPoint =  Snap.getElementByPoint(cx,cy);
            // self.rectToUnfocus = this.paper.selectAll('rect');
        this.removeHighlightClass();
        if(this.elemOnPoint.type =="path"){
            console.log('on path');
            console.log(this.elemOnPoint);
        }
        // this conditional is for selection of elements between which the paths is to be drawn

        if(this.elemOnPoint.type =="rect"){
            this.elemOnPoint.addClass("highlight");
            this.selectedComponentID = this.elemOnPoint.parent().id;
            this.objectOnPoint = this.getSelectedObject(this.selectedComponentID);
            // console.log(this.objectOnPoint);
            let offSet = this.paper.node.getScreenCTM(); // p.e and p.f
            this.objectSelected.emit("rect");

            let terminalSelectConfirm = /(_positive|_negative)$/;
            if(this.elemOnPoint.attr('id').search(terminalSelectConfirm)!=-1){
                let x_t = cx-offSet.e;
                let y_t = cy-offSet.f;
                
                let terminalID = this.elemOnPoint.attr('id');
                //  console.log(typeof(terminalID));
                let terminal = terminalID.match( /(_positive)$/)? this.objectOnPoint[1].positiveNodeID:this.objectOnPoint[1].negativeNodeID;

                this.arrayOfTerminals.push([Number(x_t.toFixed(2)), Number(y_t.toFixed(2)), this.objectOnPoint[1],terminal]);
                this.count+=1;
                if(this.flag==1 && this.count==2){
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
                    this.flag = 0;
                    this.arrayOfTerminals=[];
                }
                    this.flag =1;
                    
                    // check for duplicacy
            }
                
        }else{
            //set selectedElem to null

            this.selectedComponentID = null;
            this.objectSelected.emit();
        }
    }

    removeHighlightClass(){
        let rectToUnfocus = this.paper.selectAll('rect');
        for(let rec of rectToUnfocus){
            if(rec.hasClass('highlight')){rec.removeClass('highlight')}
        }
    }


}