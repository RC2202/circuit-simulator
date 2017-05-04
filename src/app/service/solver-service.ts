// import * as path from 'path';
import { Injectable } from '@angular/core';
// import { svgService } from './svg-service';
import { identifyLoopsService } from './identify-loops-service';
import { meshService } from './mesh-service';
import { currentService } from './current-service';
import { identifyNodesService } from './identify-nodes-service';

// declare let math : any;
// import * as math from 'mathjs';
@Injectable()
export class solverService{

constructor(
    // private svg: svgService,
    private identifyLoops: identifyLoopsService,
    private mesh : meshService,
    private current: currentService,
    private nodes: identifyNodesService
){
    // console.log(this.svg);
}
// this is just to remove error.. because it does not get the variable it
// looks into its parent or the calling function for it.
pathArray : any = [];
currentArray: any = [];

nodeGroup: any= [];
loops: any = [];
iSol: any;
I_solution: any;
meshSet: any;
    runSimulation(){
        console.log('runSimulation');

        // remove traces of ground in pathArray, currentArray
        // keep the position of node attached to ground
        // run runSimulation
        // assign values
        // add back the values of pathArray and currentArray
        
                
        this.nodeGroup = this.nodes.identifyNodes(this.pathArray);
        this.loops = this.identifyLoops.identifyLoops(this.nodeGroup);
        console.log(this.nodeGroup);
        console.log(this.loops);
        this.meshSet = (this.mesh.loopsToUseForCal( this.loops, this.nodeGroup));
        console.log(this.meshSet);
        if(this.meshSet.length !=0){
            this.iSol = this.current.calculateCurrent(this.meshSet);
            if(this.iSol !==0){
                this.I_solution = this.current.currentThroughComponents(this.meshSet, this.iSol);
                this.current.currentsOnSvg(this.currentArray,this.I_solution );
            }else{
                alert("Check for Parallel DC sources or Possible short circuit");
            }
           
        }else{
            alert("Check for open terminals");
        }
        // console.log(this.currentArray);
    }

    
}

//https://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html



// rules for single terminal components

/* 
    Only 1 wire can be drawn from its terminal


    Eg: Ground, Scope Voltage wrt gnd


*/

// There is an alternate way to show voltage without going through all these trouble


/*
    To the component object : Add 
    Voltage across, 
    Current through, 
    Voltage Flag, 
    Current Flag, 
    Scope Current and Voltage


    If flag is true, show the corresponding voltage on a side bar list;
    element| current| voltage
*/

