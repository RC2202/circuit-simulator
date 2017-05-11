import { Component, OnInit } from '@angular/core';
import { electricalComponents, elementOnCanvas} from '../service/model';
import { svgService } from '../service/svg-service';
import { wireService } from '../service/wire-service';
// import { svgComponent } from '../svg/svg.component';
// uses svg renderElement updateCurrentArray currentArray rotateElement deleteSelectedObject
@Component({
    selector: 'left-menu',
    templateUrl: 'left-sidemenu.html',
    // providers: [svgService]// already included in root module 
    //same instance shared everywhere
})
export class leftSidemenu implements OnInit {
    elements: Array<electricalComponents> = [];
    elementOnCanvas: Array<elementOnCanvas> = [];
    // @Output() renderElem: EventEmitter<any> = new EventEmitter<any>();
    // private elemCountOnCanvas: number = 0;
    

    constructor(
        private svg : svgService,
        private wire: wireService
    ) {
         this.svg.drawWireEvent.subscribe(ev => this.wire.drawWire(ev));
         this.svg.redrawWireEvent.subscribe(ev => this.wire.reWire(ev));
    }
    
    ngOnInit() {
        this.loadElements();
        // console.log(this.svgcomp);
    };

    loadElements(){
        console.log('init_elements');
        this.elements.push( new electricalComponents('resistor','R',
          `<g id="resistor">
                <g>
                <path id="path4172" d="m180 95 1 18-11 9 22 9-22 10 22 10-11 8 0 18" style="fill:none;stroke-width:2.13047051;stroke:#000"/>
                <text x = "136" y = "144" fill = "red" transform = "rotate(-90, 165, 144)">R = 20ohm</text>
                
                <path id= "towardPos" style="fill:none;" d="m 191,123 10,-10 10,10"/>
                <path id ="line" style="fill:none;  stroke-width: 2" d="m 201,147 0,-33"/>
                <path id = "towardNeg" style="fill:none;" d="m 211,140 -10,10 -10,-10"/>
                <text id="vals" x= "206" y = "139" width= "130" height = "80">2A</text>
				
                </g>
                <rect id= "resistor_rect" y="97" x="151" height="80" width="60" style="fill-rule:nonzero;fill:rgba(0,0,0,0);stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4"/>
                <rect id= "resistor_positive"  y="87" x="175" height="10" width="10" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
                <rect id= "resistor_negative" y="177" x="175" height="10" width="10" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/> 
            </g>`,
            20,
            ['ohm', 'K ohm', 'M ohm'],
            'ohm',
            0,
         ));

         this.elements.push( new electricalComponents('Vdc', 'Vdc',
          ` <g id="Vdc">
                <g transform="translate(140,43)">
                <path id="path4154" d="m17 85c13 0 13 0 48 0" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00036979;stroke:#000"/>
                <path id="path4156" d="m40 85 0-33" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00802779;stroke:#000"/>
                <path id="path4158" d="m27 100 27 0" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00189424;stroke:#000"/>
                <path id="path4160" d="m41 100 0 33" style="fill-rule:evenodd;fill:#000;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-width:2.00802803;stroke:#000"/>
                <text x = "-5" y = "115" fill = "red" transform = "rotate(-90, 16,110)">V = 20V</text>
                
                <path id= "towardPos" style="fill:none;" d="m 60,79 10,-10 10,10"/>
                <path id ="line" style="fill:none;  stroke-width: 2" d="m 70,103 0,-33"/>
                <path id = "towardNeg" style="fill:none;" d="m 80,95 -10,10 -10,-10"/>
                <text id="vals" x= "75" y = "95" width= "130" height = "80">2A</text>
                    
                </g>
            <rect id = "Vdc_rect" y="95" x="150" height="80" width="60"  style="fill-rule:nonzero;fill:rgba(0,0,0,0);stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4"/>
            <rect id= "Vdc_positive"y="86" x="176" height="10" width="10" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
            <rect id = "Vdc_negative" y="176" x="176" height="10" width="10"  style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
            </g>`,
            20,
            ['mV', 'V', 'kV'],
            'V',
            1
         ));

        //  this.elements.push(new electricalComponents('Ground', "G",
        //  `  <g id="gnd">
        //         <g >
        //         <path id="path4178" d="m177.54 131.46 0 8.54" style="fill:none;stroke-width:1.31;stroke:#000"/>
        //         <path id="path4182" d="m170 140 15 0" style="fill:none;stroke:#000"/>
        //         <path id="path4184" d="m171.96 145.36 10 0" style="fill:none;stroke:#000"/>
        //         <path id="path4186" d="m175 149.47 5 0" style="fill:none;stroke:#000"/>
        //         <text x = "150" y = "159" fill = "red" transform = "rotate(-90, 155,149)">G</text>
                
        //         <path id= "towardPos" style="fill:none;" d="m 185  ,128 10,-10 10,10"/>
        //         <path id ="line" style="fill:none;  stroke-width: 2" d="m 195,152 0,-33"/>
        //         <path id = "towardNeg" style="fill:none;" d="m 205,144 -10,10 -10,-10"/>
        //         <text id="vals" x= "197" y = "144" width= "130" height = "80">2A</text>
				
                
        //         </g>
                
        //         <rect id="Gnd_rect" y="126" x="165" height="25" width="25" id="rect4214" style="fill-rule:nonzero;fill:rgba(0,0,0,0);stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4"/>
        //         <rect id = "Gnd_positive" y="122" x="173" height="10" width="10" id="rect4188" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
        //         </g>`,
        //         0,
        //         [],
        //         '',
        //         2
        //     ));
        // this.elements.push(new electricalComponents('Vac', "Vac",
        // `   <g id="vac">
        //     <g>
        //         <ellipse cx="179" cy="136" rx="13" ry="14" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-width:2;stroke:#000"/>
        //         <path d="m179 122 0-26" style="fill:none;stroke-miterlimit:4;stroke-width:2.27;stroke:#000"/>
        //         <path d="m179 149 0 27" style="fill:none;stroke-miterlimit:4;stroke-width:2.15;stroke:#000"/>
        //         <path d="m172 137c0-1 1-2 1-2 0-1 1-1 1-2 0 0 0 0 1-1 0 0 1 0 1 0 0 0 1 0 1 0 0 0 1 0 1 1 1 1 2 3 2 4 0 1 0 2 1 3 0 1 1 1 1 1 0 0 1 1 1 1 0 0 1 0 1-1 0 0 1-1 1-1 1-1 1-2 2-4" style="fill:none;stroke-miterlimit:4;stroke:#000"/>
        //         <text x = "-1" y = "154" fill = "red" transform = "rotate(-90, 89,79)">Vac =20Vp</text>
            
        //         <path id= "towardPos" style="fill:none;" d="m 199,123 10,-10 10,10"/>
        //         <path id ="line" style="fill:none;  stroke-width: 2" d="m 209,147 0,-33"/>
        //         <path id = "towardNeg" style="fill:none;" d="m 219,139 -10,10 -10,-10"/>
        //         <text id="vals" x= "224" y = "139" width= "130" height = "80">2A</text>
                
        //     </g>
        //     <rect id = "Vac_rect" y="97" x="151" height="80" width="58" style="fill-rule:nonzero;fill:rgba(0,0,0,0);stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4"/>
        //     <rect id = "Vac_positive" y="91" x="175" height="6" width="8" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
        //     <rect id = "Vac_negative"  y="177" x="175" height="6" width="8" style="fill-rule:nonzero;fill:#fff ;stroke: #000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4"/>
        //     </g>`,
        //     20,
        //     ['mV', 'V', 'kV'],
        //     'V',
        //     3
        //     ));
    };

    renderComponent(index: number){
        console.log('renderComponent');
        let v = JSON.parse(JSON.stringify(this.elements[index]));
        // should call a svg components method
        // console.log(index);
        this.svg.elemCountOnCanvas +=1;
        this.svg.renderElement(this.elements[index].svgParse);
        this.svg.updateCurrentArray( new elementOnCanvas(v, this.svg.elemCountOnCanvas, -this.svg.elemCountOnCanvas, 0, [], []));

        let temp_r = this.svg.currentArray[this.svg.currentArray.length -1];
        let symbol = temp_r.elements.symbol;
        let id = temp_r.positiveNodeID;
        let value = temp_r.elements.value;
        let unit = JSON.parse(JSON.stringify(temp_r.elements.selectedUnit));
        if(unit=="ohm" || "M ohm" || "K ohm"){
            unit = unit.replace("ohm", "&#x2126");
        }
        let textInner = `${symbol}${id} = ${value}${unit}`;
        temp_r.svgRefElem.select('text').node.innerHTML = textInner;
        // console.log(temp_r);
        temp_r.svgRefElem.select('#vals').addClass('hideArrow');
        temp_r.svgRefElem.select('#line').addClass('hideArrow');
        temp_r.svgRefElem.select('#towardNeg').addClass('hideArrow');
        temp_r.svgRefElem.select('#towardPos').addClass('hideArrow');
        
    }

    rotateComponents(){
        console.log('rotateComponents');
        this.svg.rotateElement();
    };

    deleteComponents(){
        console.log('deleteComponents');
        this.svg.deleteSelectedObject();
    }


}