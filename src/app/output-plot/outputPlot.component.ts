// import { ValueProvider } from '@angular/core/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { svgService } from '../service/svg-service';
// import { Observable, Subscription } from 'rxjs/Rx';
declare let Snap :any;
// import * as math from 'mathjs'
declare let mina: any;
@Component({
    selector: 'output-plot',
    templateUrl: 'outputPlot.html'
})
export class outputPlot implements OnInit, OnDestroy {
    plot: any;
    ticks = 0;

    grp_pre: any;
    grp: any
    stop_flag: number  = 0;
    choice: any;
    t: Array<any> = [100, "", "", -100];
    currentArray :Array<any> = [];
    elemSelected: any;

    
    constructor(
        private svg : svgService,
    ) { 
        this.currentArray = this.svg.currentArray;
    }

    ngOnInit() { 
        this.plot = Snap('#graph');
        this.grp_pre = this.plot.g();
        this.grp = this.grp_pre.clone();
        this.grp.addClass('red');
        this.grp_pre.addClass('green');
        // this.grp_pre.transform('t-200, 50');
        
     }

    
    start(x){
        this.stop_flag =0;
        let tick  = 0;
        console.log('started' + x);
        // let freq = 50;
        // let numberOfcycles = 2;
        let self = this;
        let width_graph = 200;
        let height_graph = 100;
        let repitionPoints = 100; //per tick
        let x_multiplier  = width_graph/repitionPoints;
        let y_multiplier = 1; // max(f(t))*2/height_graph
        let animationTime = 2000; //ms //tamebase
        // let samplerate = width_graph/animationTime ; // px/ms

        this.t = [-2*x, "", "", 2*x];
        
        function callback(){
            console.log('callback1');
            if(self.stop_flag==0){
                // console.log('callback');
                try{
                    if(tick !=0){
                        self.grp.remove();    
                        self.grp =  self.grp_pre.clone();
                         let cir = self.grp_pre.selectAll('circle');
                        for (let points of cir) {
                            // console.log(points); // 9,2,5
                            points.remove();
                        }
                         self.grp.transform(`t${0}, ${height_graph/2}`);
                    }
                   
                    for(let i=0; i<=repitionPoints; i++){ //called each 20uS
                        self.grp_pre.circle(i*x_multiplier, y_multiplier*50*(-x)/ (2*x), 1);
                    }
                    self.grp_pre.transform(`t${-width_graph}, ${height_graph/2}`);
                    tick +=1;
                    self.grp_pre.animate({'transform' : `t${0}, ${height_graph/2}`}, animationTime, mina.linear, callback);
                    if(tick !=0){
                         self.grp.animate({'transform' : `t${width_graph}, ${height_graph/2}`}, animationTime, mina.linear );
                    }
                }
                catch(err){
                    console.warn(err);
                }
            }
        }


        function parseEquation(){
            // should be of the form
            /*
                key: Value
                params: values

                

            */
        }
        
        callback();
        parseEquation();

    }



    stop(){
        console.log("stopped");
        this.stop_flag =1;
    }

    translateViewBox(i){
        this.plot.attr({viewBox:i+","+0+","+0+","+0})
    }

    //  renderGraph(equation_in_time){
    //      console.log('renderGraph');
    //      // equation_in_time="A*sin(w*t)+ B- C"
    //  }

     
     
    ngOnDestroy(){
        console.log("Destroy timer");
        // unsubscribe here
        // this.sub.unsubscribe();

    }


    graph(){
        console.log(this.elemSelected);
        console.log(this.choice);

        var temp = this.currentArray[this.elemSelected]
        var x =  this.choice==1?temp.current: temp.voltage;

        this.stop();    
        this.start(x);
    }     





}

/* component ends here */