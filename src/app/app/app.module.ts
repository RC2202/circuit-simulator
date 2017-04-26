import { outputPlot } from '../output-plot/outputPlot.component';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { solverService } from '../service/solver-service';
import { svgService } from '../service/svg-service';
import { identifyLoopsService } from '../service/identify-loops-service';
import { meshService } from '../service/mesh-service';
import { currentService } from '../service/current-service';
import { identifyNodesService } from '../service/identify-nodes-service';
import { paperClickService } from '../service/paper-click-service';
import { wireService } from '../service/wire-service';




// import { CircuitElements } from '../circuit-elements/circuit-elements.component';

import { appComponent }  from './app.component';
import { svgComponent } from '../svg/svg.component';
import { leftSidemenu } from '../left-sidemenu/left-sidemenu.component';
import { editCompValue } from '../edit-comp-value/editCompValue.component';


@NgModule({
  imports:      [ 
      BrowserModule ,
      FormsModule
   ],
  declarations: [ 
      appComponent, 
      svgComponent, 
        leftSidemenu,
      editCompValue, 
      outputPlot
    ],
  providers:    [ 
      svgService,
      solverService, 
      identifyLoopsService, 
      meshService,
      currentService,
      identifyNodesService,
      paperClickService,
      wireService
    ],
  bootstrap:    [ appComponent ]
})
export class AppModule { }
