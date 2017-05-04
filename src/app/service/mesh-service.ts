import { Injectable } from '@angular/core';
import { svgService } from './svg-service';

// declare let math : any;
import * as math from 'mathjs';
@Injectable()
export class meshService{

    constructor(
        private svg: svgService,
    ){
        // console.log(this.svg);
    }

    // dependency on svgService
    // currentArray
    currentArray: Array<any>= [];
    numberOfBranches: number;
    numberOfLoopsRequired: number;
    selectedLoops ;
    set = [];
    l: any;
    n: any;
    //variables
    
    // functions

    loopsToUseForCal(l, n){ // compID = 1 l-> loops found n-->nodes found
        // compID --> element through which current is to be decided
        // console.log(compID);
        this.currentArray = this.svg.currentArray;
        this.l= l;
        this.n = n;
        this.set = [];
        this.numberOfBranches = this.currentArray.length;
        this.numberOfLoopsRequired = this.numberOfBranches - n.length +1 ;
        this.recursive(this.numberOfLoopsRequired-1, 0, []);
        // console.log( this.set );

        for( let s of this.set){
            // s -- lps
            if(!this.isRequriedSetOfMesh(s)){
                return s
            }
        }
        return []
    }


    findCommonNodes(fArray, lArray){
            // let temp  = [];
            // console.log(array);
            let rejectMeshSet = false;
            for(let x of fArray){
                let pv = lArray.indexOf(x)!=-1; // x x match found
                // let nv = lArray.indexOf(-x)!=-1 // x -x match found --> mesh found
                if(pv){
                    // implies x is common between fArray , lArray
                    rejectMeshSet = true
                    break;
                    // temp.push(x);
                } 
            }

            return rejectMeshSet
    }

    isRequriedSetOfMesh(lps){ //[ [1, 2, 3], [3,4,6, ...]]
        // let temp_mesh_node =[];
        // let flag_m = true;
        let reject ;
        for( let w =0; w<lps.length; w++){
            for(let v =w+1; v<lps.length; v++){    
            reject = this.findCommonNodes(lps[w],lps[v]);
            if(reject){
                return true
            }
                
            }

        }
    }
// numberOfLoopsRequired-1, 0, []
    recursive(cross, s, a) {
        for( let i=s; i < this.l.length; i++ ){
            if( !cross ){
                let b = a.slice(0);
                b.push( this.l[i] );
                this.set.push( b );
            }
            else{ 
                a.push(this.l[i]); 
                this.recursive(cross-1, i+1, a); 
                a.splice(-1, 1);
            }
        }
    }

    checkIfLoopsCoverAllElem(selectedLoops){ // ensures that all elements are covered.
        let temp =[];
        for( let sl of selectedLoops){
            for(let  s of sl){
                if(temp.indexOf(s) ==-1){
                    temp.push(math.abs(s));
                }
            }
        }
        if(temp.length == this.numberOfBranches){
            return true
        }else{
            return false
        }
    }

}