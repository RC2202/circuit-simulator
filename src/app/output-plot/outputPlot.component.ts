import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Observable, Subscription } from 'rxjs/Rx';
declare let Snap :any;
import * as math from 'mathjs'
declare let mina: any;
@Component({
    selector: 'output-plot',
    templateUrl: 'outputPlot.html'
})
export class outputPlot implements OnInit, OnDestroy {
    plot: any;
    ticks = 0;
    // private timer;
    // // Subscription object
    // private sub: Subscription;
    // mf_x : number =1 ;
    // mf_y : number =1 ;

    grp_pre: any;
    grp: any
    stop_flag: number  = 0;
    constructor() { }

    ngOnInit() { 
        this.plot = Snap('#graph');
        this.grp_pre = this.plot.g();
        this.grp = this.grp_pre.clone();
        // this.grp_pre.transform('t-200, 50');
     }

    
    start(){
        this.stop_flag =0;
        let tick  = 0;
        console.log('started');
        let freq = 50;
        let numberOfcycles = 2;
        let self = this;
        let width_graph = 200;
        let height_graph = 100;
        let repitionPoints = 100; //per tick
        let x_multiplier  = width_graph/repitionPoints;
        let y_multiplier = 1; // max(f(t))*2/height_graph
        let animationTime = 2000; //ms //tamebase
        // let samplerate = width_graph/animationTime ; // px/ms
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
                        self.grp_pre.circle(i*x_multiplier, y_multiplier*50*math.sin(2*Math.PI*freq*(i+tick*repitionPoints)*numberOfcycles/(repitionPoints*freq)) , 1);
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
        
        callback();

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



}

/* component ends here */