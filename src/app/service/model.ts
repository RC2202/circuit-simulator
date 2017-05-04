import { Injectable } from '@angular/core';


@Injectable()
export class electricalComponents{
    constructor(
        public name: string,
        public symbol: string,
        public svgParse: string,
        public value : number,//[20]
        public units: Array<string>,//[ohm,kohm,Kohm]
        public selectedUnit: string, //ohm
        public id: number,

    ){
        //methods
        
    }

}

@Injectable()
export class elementOnCanvas{
    constructor(
        public elements:any, // it has name and svg
        public positiveNodeID: number,
        public negativeNodeID:  number,
        public orientation: number,
        public connectedNodeID_positive?: Array<number>,
        public connectedNodeID_negative?: Array<number>,
        public svgRefElem?: any,
        public id?: any,
        public voltage?: number,
        public current?: number,
        public voltageFlag?: boolean,
        public currentFlag?: boolean,
        public currentScopeFlag?: boolean,
        public voltageScopeFlag?: boolean
        
    ){

    }
}


@Injectable()
export class wires{
    constructor(
        public svgRefElem: any,
        public nodesOnStart: Array<number>,
        public id: string,
        
    ){
        // logic for choosing path style
        // based on orientataion, position (2(h,v), 4(l,r,u,d)) of elements in consideration
        // 
        

    }
}

