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

    runSimulation(){
        console.log('runSimulation');
        // console.log(this.currentArray);
        // this.identifyNodes();
        let compToAnalyse = 1;
        // let self = this;
        
        let nodes = this.nodes.identifyNodes(this.pathArray);
        let loops = this.identifyLoops.identifyLoops(nodes);
        console.log(nodes);
        console.log(loops);
        let meshSet = (this.mesh.loopsToUseForCal(compToAnalyse, loops, nodes));
        console.log(meshSet);
        let iSol = this.current.calculateCurrent(meshSet);
        let I_solution = this.current.currentThroughComponents(meshSet, iSol);
        this.current.currentsOnSvg(this.currentArray,I_solution );
    }

    
}

//https://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html