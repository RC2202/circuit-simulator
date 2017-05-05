import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { svgService } from '../service/svg-service';
import { solverService } from '../service/solver-service';
// declare var svg : any;

@Component({
    selector: 'svg-canvas',
    templateUrl: 'svg.html',
    // providers: [svgService]
})


export class svgComponent implements OnInit {

    constructor( 
        private svg: svgService,
        private solver: solverService
        ){}
    
    @Output()
    change: EventEmitter<number> = new EventEmitter<any>();


    ngOnInit(){ 
        this.svg.svgInitialize();
        // console.log(this.solver);
    }
    runSim(){
        console.log('runSim');
        this.solver.currentArray = this.svg.currentArray;
        this.solver.pathArray = this.svg.pathArray;
        this.solver.runSimulation();
    }

    clearSvg(){
        for( let elem of this.svg.currentArray){
            elem.svgRefElem.remove();
            
        }

        for( let elem of this.svg.pathArray){
            elem.svgRefElem.remove();
        }

        this.svg.currentArray = [];
        this.svg.pathArray = [];
        this.svg.elemCountOnCanvas = 0;
        this.change.emit();
    }
} 