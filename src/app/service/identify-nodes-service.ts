import { Injectable } from '@angular/core';
// import { svgService } from './svg-service';

// declare let math : any;
// import * as math from 'mathjs';

@Injectable()
export class identifyNodesService{

    constructor(
        // private svg: svgService,
    ){
        // console.log(this.svg);
    }
groups : Array<Array<number>>= [];
  
    identifyNodes(pathArray){

        let pathArrayCopy = JSON.parse(
            JSON.stringify(
                pathArray
            )
        );
        let tempArray = [];
        this.groups = [];
        for(let path of pathArrayCopy){
            tempArray.push(path.nodesOnStart);
        }
        // console.log(tempArray);
        // let groups = []; let groups_temp = [];

        for (let array of tempArray){
            this.searchInGroup(array);
        }
        // console.log(this.groups);
        for (let g of this.groups){
            g.sort(function(x,y){
                return x-y
            })
        }
        return this.groups;

    }
    searchInGroup(arrayToSearch){
        let newNode =true;
        // let comGrpCount = 0;
        for (let group of this.groups){

           if( this.isCommon(arrayToSearch, group)){
               newNode = false;
               for( let u of arrayToSearch){
                   if(group.indexOf(u)==-1){
                       group.push(u);
                   }
               }
           }
        }
        if(newNode){
            this.groups.push(arrayToSearch);
        }

    }

    isCommon(g1:Array<number>,g2: Array<number>){
        for ( let g of g1){
            if(g2.indexOf(g) !=-1){
                return true;
            }
        }
        return false;
    }

    // checkComInSuperG(gSuper){
    //     for( let i =0; i<gSuper.length-1; i++){

    //     }
    // }

}