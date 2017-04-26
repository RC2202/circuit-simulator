import { Injectable } from '@angular/core';
// import { svgService } from './svg-service';
// declare let  math : any;
import * as math from 'mathjs';
@Injectable()
export class identifyLoopsService{

constructor(
    // private svg: svgService
){
    // console.log(this.svg);
}

// no dependency on svg service

groupedArrayOfNodes: Array<any> = [];// previous array nodes   refined
finalLoopsFound: Array<any> = [];
// checkIfItExists --> findNextGroup (perform this recursively)
arrayOfNodesInCurrentLoop:Array<any> = []; // structure [[1,6,5], [-1,-2, -4],...]
isPresent:boolean = false;
foundLoops:Array<any> = []; // again array of arrays
initialNode:any; 
groupOfElemInLoop: Array<any> = [];
// variables

// functions

    identifyLoops(nde){

        this.groupedArrayOfNodes=nde;
        this.finalLoopsFound = [];
        this.initialNode = this.groupedArrayOfNodes[0];
        this.arrayOfNodesInCurrentLoop =[];
        this.foundLoops = [];
        this.groupOfElemInLoop = [];
        this.arrayOfNodesInCurrentLoop.push(this.initialNode);

        for(let n in this.initialNode){
            this.checkIfNodeExistsInLoop(-this.initialNode[n]);
        }
        console.log(this.foundLoops);
        this.finalLoopsFound = this.removeDuplicateLoops(this.filterLoops(this.foundLoops));

        return this.finalLoopsFound
    }

    searchgroup(num){
        for(let grp of this.groupedArrayOfNodes){
            if(grp.indexOf(num) !=-1){
                return [grp, grp.indexOf(num)];
            }
        }
        return null;
    }

    checkIfNodeExistsInLoop(nd){
        let foundNodeIndex = -1;
        for( let nodeIndex in this.arrayOfNodesInCurrentLoop){
            this.isPresent = this.arrayOfNodesInCurrentLoop[nodeIndex].indexOf(nd) !=-1;
            if(this.isPresent){
                foundNodeIndex = Number(nodeIndex);
                break;
            }else{
                foundNodeIndex = -1;
            }
        }

        if(foundNodeIndex !=-1){
                // console.log('Node already exists==> loop found');
                this.arrayOfNodesInCurrentLoop.push(JSON.parse(JSON.stringify(this.searchgroup(nd)[0])));
                let  temp = JSON.parse(JSON.stringify(this.arrayOfNodesInCurrentLoop));
                this.foundLoops.push(JSON.parse(JSON.stringify(temp.slice(foundNodeIndex))));
                // console.log(this.foundLoops);
                // console.log(this.arrayOfNodesInCurrentLoop);
                this.arrayOfNodesInCurrentLoop.pop();
            
            }else {
                // not present 
                let arrayOfNodesToFind =  JSON.parse(JSON.stringify(this.searchgroup(nd)));
                this.arrayOfNodesInCurrentLoop.push(JSON.parse(JSON.stringify(arrayOfNodesToFind[0])));

                arrayOfNodesToFind[0].splice(arrayOfNodesToFind[1], 1);

                try{
                    for(let nodeToFind of arrayOfNodesToFind[0]) {
                    this.checkIfNodeExistsInLoop(- nodeToFind);
                    };
                    // console.log('popping last elem');
                    this.arrayOfNodesInCurrentLoop.pop();
                }catch(err){
                    console.warn('Check for open terminal');
                }

            }
    }

    filterLoops(loopsArray){ //[ [[],[]], [[],[]] ]6
        this.groupOfElemInLoop = [];
        for(let loop of loopsArray){// 3
            let ElemInLoop = [];
            for(let i = 0; i<loop.length-1; i++){ // we need to identify this loop to detect parallel paths
                let f = loop[i];//3
                let l = loop[i+1];//3
                let res = [];
                //let res = [];
                for(let x of f){
                    if(l.indexOf(-x)!=-1){
                        res.push(x);
                    }   
                }
                if(res.length >1){
                    // number of parallel paths = res.length
                    ElemInLoop.push(res);
                }else{
                    ElemInLoop.push(res[0]);
                }
            // ElemInLoop.push(res);
        }
        this.checkForParallelPathInElemLoop(ElemInLoop);
        }
        //  console.log(groupOfElemInLoop);
        return this.groupOfElemInLoop
    }

    checkForParallelPathInElemLoop(e){
            let flag = false;
            let ind = -1;
            for (let wr in e){
                    if( e[wr].length>1){
                    flag = true;
                    ind = Number(wr);
                    break
                }else{
                    flag = false;
                    ind = -1;
                }
            }
            if(flag){
                for(let x of e[ind]){
                    e[ind] = x;
                    if(e.indexOf(-x) ==-1){
                        this.checkForParallelPathInElemLoop(e);
                    }  
                }
            } else{

                this.groupOfElemInLoop.push(JSON.parse(JSON.stringify(e))); // instead push it to an empty array
            }
            
    }

    removeDuplicateLoops(dpl_Loop){// [[1,-3,], [2, -4]]
        // console.log(math.multiply(2,3));
        let sumArray = [];
        let dup_rem_array =[];
        let bias = 6;
        for( let l of dpl_Loop){
            let ab = JSON.parse(JSON.stringify(math.prod(math.add(math.abs(l), bias))));
            if(sumArray.indexOf(ab)==-1){
                sumArray.push(ab);
                dup_rem_array.push(JSON.parse(JSON.stringify(l)));
            }
        }
        // console.log(dup_rem_array);
        return dup_rem_array
    
    }

}