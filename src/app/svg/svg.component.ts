import {Component, OnInit} from '@angular/core';
import { svgService } from '../service/svg-service';
import { solverService } from '../service/solver-service';
// declare var Snap : any;

@Component({
    selector: 'svg-canvas',
    templateUrl: 'svg.html',
    // providers: [svgService]
})


export class svgComponent implements OnInit {

    constructor( 
        private snap: svgService,
        private solver: solverService
        ){}
    
    ngOnInit(){ 
        this.snap.svgInitialize();
        // console.log(this.solver);
    }
    runSim(){
        console.log('runSim');
        this.solver.currentArray = this.snap.currentArray;
        this.solver.pathArray = this.snap.pathArray;
        this.solver.runSimulation();
    }
} 