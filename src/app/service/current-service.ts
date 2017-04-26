import { Injectable } from '@angular/core';
import { svgService } from './svg-service';

import * as math from 'mathjs';
@Injectable()
export class currentService{

    constructor(
        private svg: svgService,
    ){
        // console.log(this.svg);
    }
    // dependency on svgService
    //currentArray

    //variable
    impedenceArraySize: Number = 0;
    impedenceMatrix: Array<any> = [];
    voltageMatrix: Array<any> = [];

    //functions
    calculateCurrent(mesh_set){
            // calculate current
        this.impedenceMatrix = [];
        this.voltageMatrix = [];
        this.impedenceArraySize = mesh_set.length;
        for(let i =0; i<this.impedenceArraySize; i++){
            let tm =[];
            this.voltageMatrix.push(this.getVoltage(mesh_set[i])) ;
            for(let j =0; j<this.impedenceArraySize; j++){
                if(i==j){
                    //diagonal elem
                    tm.push(this.getVal(mesh_set[i]));
                }else{
                    tm.push(-this.getCommonElem(mesh_set[i], mesh_set[j]));
                }
            }

            this.impedenceMatrix.push(tm);
        }
        console.log(this.impedenceMatrix);
        console.log(this.voltageMatrix);

        this.impedenceMatrix = math.inv(this.impedenceMatrix);
        let I_solution=[];
        for( let im of this.impedenceMatrix){
            I_solution.push(math.multiply( im, this.voltageMatrix) );
        }
        return I_solution;
    }

    searchForComponent(terminalID){
        //change to absolute value
        let absTerminalID = Math.abs(terminalID);
        for(let obj of this.svg.currentArray){
            if(obj.positiveNodeID ==absTerminalID){
                return obj
            };
        }
    }

    getVal(elem_array){
        let tempVal = 0;
        let setOfActiveSource = ["Vdc"];
        for( let ar of elem_array){
                if(setOfActiveSource.indexOf(this.searchForComponent(ar).elements.name) ==-1){
                tempVal += this.searchForComponent(ar).elements.value; 
            }       
        }
        return tempVal
    }


    getCommonElem(f_a, l_a){
        let tempVal = 0;
        let setOfActiveSource = ["Vdc"];
            for( let ar of f_a){
                if(l_a.indexOf(ar)!=-1 || l_a.indexOf(-ar)!=-1){
                    if(setOfActiveSource.indexOf(this.searchForComponent(ar).elements.name) ==-1){
                        tempVal += this.searchForComponent(ar).elements.value;
                    }
                    
                }   
            }
            return tempVal
    }


    getVoltage(v){
        let tempVoltage = 0;
        let setOfActiveSource = ["Vdc"];
            for( let ar of v){
                if(setOfActiveSource.indexOf(this.searchForComponent(ar).elements.name) !=-1){
                    tempVoltage += (ar/math.abs(ar))* this.searchForComponent(ar).elements.value;
                }           
            }
        return tempVoltage
    }

    currentThroughComponents(impedMat, I_soln){
        let soln_obj = {};
        // should have positive key 

        // make an array of size -> no. of components and init value zero
        // each loop--> get the element--> add the value of current for that loop
        // return the element and the corresponding current
        console.log(impedMat);

        for(let i  = 0; i<impedMat.length; i++){
            // let sol_temp = I_soln[i];
            for( let j = 0; j<impedMat[i].length; j++){
                if(impedMat[i][j]>0){
                  soln_obj[impedMat[i][j]]=  soln_obj[impedMat[i][j]] ==undefined? I_soln[i]: (soln_obj[impedMat[i][j]] + I_soln[i]);
                }else{
                    soln_obj[-impedMat[i][j]] = soln_obj[-impedMat[i][j]] ==undefined? -I_soln[i]: (soln_obj[-impedMat[i][j]] - I_soln[i]);
                }
            }
        }

        console.log(soln_obj);
        return soln_obj;

    }
    currentsOnSvg(currentArray, solution){
        console.log(solution);
        for (let elem of currentArray){
            let id=  elem.positiveNodeID;
            
            let value =  math.round(solution[id],2);
           
            let v = elem.svgRefElem.select('#vals');
            let l = elem.svgRefElem.select('#line');
            let p = elem.svgRefElem.select('#towardPos'); 
            let n = elem.svgRefElem.select('#towardNeg'); 

            l.hasClass('hideArrow')? l.removeClass('hideArrow') : '' ; 
            v.hasClass('hideArrow')? v.removeClass('hideArrow') : '' ; 
            v.node.innerHTML = math.abs(value)+"A";

            if(value>=0){
                
                n.hasClass('hideArrow')? '': n.addClass('hideArrow') ; 
                p.hasClass('hideArrow')? p.removeClass('hideArrow') : '' ; 

            }else{
                p.hasClass('hideArrow')? '': p.addClass('hideArrow')  ; 
                n.hasClass('hideArrow')? n.removeClass('hideArrow') : '' ; 
            }
        }
    }
}
