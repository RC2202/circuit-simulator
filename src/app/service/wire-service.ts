/* Not BEING USED */


import { Injectable } from '@angular/core';
// import { svgService } from './svg-service';
import { wires } from './model';
// declare let math : any;
// declare let Snap : any;

@Injectable()
export class wireService{

    constructor(
        // private svg: svgService
    ){
        // console.log(this.svg);
    }


    //variables
    paths: any;
    pathArray: any;
    arrayOfTerminals: any;


    wire(){
        let allPathsArray = this.paths.selectAll('path');
        let selectedPath = allPathsArray[allPathsArray.length-1];
        console.log(selectedPath);

        // selectedPath.hover(function(){
        //     selectedPath.addClass('highlightPath')
        // }, function(){
        //     selectedPath.removeClass('highlightPath');
        // });
 
        this.pathArray.push(new wires(selectedPath, [this.arrayOfTerminals[0][3], this.arrayOfTerminals[1][3]], selectedPath.id ));
        
        }

     dynamicGenerationOfPoint(array){
            // dynamically generate non overlapping paths between two points
            console.log(typeof(array[0][1]));
            let dummyH = array[0][1];//(array[0][1] + array[1][1])/2;
            let dummyV = array[0][0];//(array[0][0] + array[1][0])/2; // dummyH => from where the dummy horizontal line will be drawn
            // dummyH--> y coordinate of first point 
            /*
                              ___           
                     |       |             ____|
                _____|    ___|            |
                        path vertical   path horizonal
            */

            function pth_horizontal(dummyH){
                return `<path d = "
                M${array[0][0]} ${array[0][1]} 
                V${dummyH}  M${array[0][0]} ${dummyH} 
                H${array[1][0]} M${array[1][0]} ${dummyH}             
                V${array[1][1]}"/>`
            };

            function pth_vertical(dummyV){
                return `<path d = "
                M${array[0][0]} ${array[0][1]} 
                H${dummyV}  M${dummyV} ${array[0][1]} 
                V${array[1][1]}  M${dummyV} ${array[1][1]} 
                H${array[1][0]}"/>`
            };

            // line bisection 2d plane
            //          *------------*-------------*
            //         (x,y)  (x_b, y_b)   (x_f, y_f)


            // rule of path selection
            // if both are vertical then pth_horizontal
            // if both are horizontal then pth_vertical
            
            if(array[0][2]=="horizontal" && array[0][2]=="horizontal"){
                return pth_vertical(dummyH);
            }else{
                return pth_horizontal(dummyV);
            }
            
        }
}