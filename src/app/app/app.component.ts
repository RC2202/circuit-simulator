import {Component, OnInit} from '@angular/core';
// import { svgComponent} from '../svg/svg.component';


@Component({
    selector: 'my-app',
    templateUrl: 'app.html',
})


export class appComponent implements OnInit {

    ngOnInit(){  
        
    }

    test(i){
        console.log(i);
    }


  
} 
