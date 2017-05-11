
import { Injectable } from '@angular/core';
import { svgService } from './svg-service';
import { wires } from './model';
import { identifyNodesService } from './identify-nodes-service';
import * as math from 'mathjs';
declare let Snap : any;

@Injectable()
export class wireService{

    constructor(
        private svg: svgService,
        private node: identifyNodesService
    ){
        
    }

    selectedPath: any;
    BBox: any;
    dummyH: any;
    dummyV : any;
    dummy: any;
    allPathsArray: any;

    drawWire(terminals ){
       if(!this.AreUniqueTerminals(terminals)){
            return;
       }; 
        console.log('drawWire');
        let selectedPath;
        this.dummyH = [
            terminals[0][1],
            terminals[1][1],
            (terminals[0][1] + terminals[1][1])/2,
            (-terminals[0][1] + 3*terminals[1][1])/2,
            (3*terminals[0][1] - terminals[1][1])/2
        ]; //terminals[0][1];//

        this.dummyV = [
            terminals[0][0],
            terminals[1][0],
            (terminals[0][0] + terminals[1][0])/2,
            (-terminals[0][0] + 3*terminals[1][0])/2,
            (3*terminals[0][0] - terminals[1][0])/2,
            ];
        this.dummy = [this.dummyH, this.dummyV];
        
        this.svg.paths.el("path").attr({
            d: this.pth_horizontal(this.dummy[0][0], terminals)
        });
        this.allPathsArray = this.svg.paths.selectAll('path');
        selectedPath = this.allPathsArray[this.allPathsArray.length-1];

        this.BBox  = this.generateBoundryForEachElem();

        selectedPath.hover(function(){
            selectedPath.addClass('highlightPath')
            }, function(){
                selectedPath.removeClass('highlightPath');
            }
        );

        // I can create more path options here
        for(let t in this.dummy){
            for(let tu of this.dummy[t]){
                let pth;
                if(t == '0'){
                    pth = this.pth_horizontal(tu, terminals);
                }else{
                    pth = this.pth_vertical(tu, terminals);
                }
                //call a function to draw and check
                if(this.renderAndCheckPath(pth, selectedPath)){
                   this.svg.pathArray.push(new wires(selectedPath, [terminals[0][3], terminals[1][3]], selectedPath.id ));
                    return 1;
                };
                
            }
        }
        this.svg.pathArray.push(new wires(selectedPath, [terminals[0][3], terminals[1][3]], selectedPath.id ));
        return 0;// no clean wire path found --> will draw the last option
    }

    generateBoundryForEachElem(){

        let tempBox = [];
        for( let array of this.svg.currentArray){

           let b =  array.svgRefElem.select('rect').node.getBoundingClientRect(); // top left bottom right width height
           let offset = this.svg.paper.node.getScreenCTM();// offset.e, offset.f
           let t = this.svg.paper.node.createSVGPoint();
          
           t.x = b.left;
           t.y = b.top;
           let ptn = t.matrixTransform(offset.inverse());

            let x = `
                M${ptn.x},${ptn.y} 
                ${ptn.x},${ptn.y + b.height} 
                ${ptn.x + b.width},${ptn.y + b.height} 
                ${ptn.x + b.width},${ptn.y }
                z`;

            tempBox.push(
                JSON.parse(
                    JSON.stringify(
                        x
                    )
                )
            );
        }
        return tempBox;
    }
    renderAndCheckPath(pth, selectedPath){

        selectedPath.attr({d: pth});
        // let selectedPathBBox = selectedPath.getBBox();
        // check for bbox intersection
        let tempPathArray = this.getPointArrayOfPath(selectedPath);
        let intersectFlag  = this.isIntersecting(this.BBox, tempPathArray);

        if(intersectFlag){
            return 0;
        }else{
            return 1;
        }
    };

    getPointArrayOfPath(path){
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

    isIntersecting(bbox, tempAr){ 
        for (let b of bbox){
            for( let w of tempAr){
                if(Snap.path.isPointInside(b, w.x, w.y)){
                    return true;
                }
            }
        }
        return false;
    }

    pth_horizontal(dummyH, terminals){
        return `M${terminals[0][0]} ${terminals[0][1]} 
        V${dummyH}  M${terminals[0][0]} ${dummyH} 
        H${terminals[1][0]} M${terminals[1][0]} ${dummyH}             
        V${terminals[1][1]}`
    };

    pth_vertical(dummyV, terminals){
        return `M${terminals[0][0]} ${terminals[0][1]} 
        H${dummyV}  M${dummyV} ${terminals[0][1]} 
        V${terminals[1][1]}  M${dummyV} ${terminals[1][1]} 
        H${terminals[1][0]}`
    };


    AreUniqueTerminals(terminals){
        // console.log(terminals);

        // get nodes
        // check if teh terminals lie in the same node
        let nodes = this.node.identifyNodes(this.svg.pathArray);
        for( let n of nodes){
           let s=  n.indexOf(terminals[0][3]) != -1;
           let e = n.indexOf(terminals[1][3]) != -1;

           if(s && e){
               return false
           }
        }
        return true

    }

    reWire(id){
        // get the wires connected to this node
        // get the node ends of the wire (other end)
        // solve for their location
        // draw wire
        this.svg.arrayOfTerminals = [];

        for(let i of this.svg.pathArray){
            let p = i.nodesOnStart.indexOf(id);
            let n = i.nodesOnStart.indexOf(-id);


            if(p!= -1 || n!= -1){
                // positive node 
                this.findTerminalCoordinate(i.nodesOnStart[0]);
                this.findTerminalCoordinate(i.nodesOnStart[1]);
                this.drawWire(this.svg.arrayOfTerminals);
                this.svg.arrayOfTerminals = [];

            }
            // if(n!= -1){
            //     // negative node  
            //     if(n == 1){
                    
            //     }else{

            //     }

            // }
           
        }
    }

    findTerminalCoordinate(terminalID){
        let isPositive = terminalID>=0;
        
        let temp = this.svg.getSelectedObject(math.abs(terminalID), 'element');
        let pterm = temp[1].svg.elements.name+'_positive';
        let nterm =  temp[1].svg.elements.name+'_negative';;
        if(isPositive){
           var x=  temp[1].svgRefElem.select(pterm);
        }else{
            var x=  temp[1].svgRefElem.select(nterm);
        }
         var node =   this.getBBoxCentre(x);
        this.svg.arrayOfTerminals.push([node[0], node[1], temp[1], terminalID]);
        
    }

    getBBoxCentre(ref){
           let b =  ref.node.getBoundingClientRect(); // top left bottom right width height
           let offset = this.svg.paper.node.getScreenCTM();// offset.e, offset.f
           let t = this.svg.paper.node.createSVGPoint(); 
           t.x = b.left;
           t.y = b.top;
           let ptn = t.matrixTransform(offset.inverse());
           return [Number((ptn.x + ptn.width/2).toFixed(2)), Number((ptn.y+ptn.height/2).toFixed(2))];

    }
    
}