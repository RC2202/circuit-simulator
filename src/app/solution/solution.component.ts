import { Component } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { electricalComponents } from '../service/model';
// import {Snap} from 'snapsvg';
// import Snap = require('snapsvg');
// import * as Snap from 'snapsvg'
// declare var Snap : any;
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
  console.log(this.elements)
}

    
}

