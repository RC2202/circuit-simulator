import { Component, OnInit } from '@angular/core';
import * as mathjs from 'mathjs';

declare let Snap : any;
@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello Home');
    console.log(Snap);
    console.log(mathjs);
  }

}
