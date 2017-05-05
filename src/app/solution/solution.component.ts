import { Component } from '@angular/core';
import { svgService } from '../service/svg-service';

@Component({
  selector: 'solution',
  templateUrl: 'solution.html',
})

export class solution  {

elements: any;

constructor(
  private svg : svgService,
){
  this.elements = this.svg.currentArray;
  // console.log(this.elements)
}

update(){
  console.log('update');
  this.elements = this.svg.currentArray;
}

    
}

