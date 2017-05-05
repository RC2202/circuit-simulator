import { Component, OnInit } from '@angular/core';
import { svgService } from '../service/svg-service';
@Component({
    selector: 'edit-comp-value',
    templateUrl: 'editCompValue.html'

})
// uses svg objectOnPoint and currentArray objectSelected

export class editCompValue implements OnInit {
    // public testArray : Array<number>;
    currentElementUnitArray: Array<any>;
    currentElementValue: number  = undefined;
    componentName: string = "";
    selectedUnit: string ="";
    enable: boolean = false;
    currentElementVoltageFlag:boolean = false;
    currentElementcurrentScopeFlag: boolean = false;
    currentElementvoltageScopeFlag:boolean = false;

    // units: any;
    constructor(private svg : svgService) {
        this.svg.objectSelected.subscribe(ev => this.componentSelected(ev));
     }

    ngOnInit() {
        this.currentElementVoltageFlag = false;
        // this.currentElementcurrentScopeFlag = false;
        // this.currentElementvoltageScopeFlag = false;
     }

    componentSelected(ev){
        // console.log(ev);
        // console.log('cmp')
        try{
            // console.log('trying');
            // console.log(this.svg.objectOnPoint);
            if(ev=="rect"){
                this.currentElementUnitArray = this.svg.objectOnPoint[1].elements.units;
                this.currentElementValue = this.svg.objectOnPoint[1].elements.value;
                this.componentName = this.svg.objectOnPoint[1].elements.name;
                this.selectedUnit = this.svg.objectOnPoint[1].elements.selectedUnit;
                this.currentElementVoltageFlag = this.svg.objectOnPoint[1].voltageFlag;
                // this.currentElementcurrentScopeFlag = this.svg.objectOnPoint[1].currentScopeFlag;
                // this.currentElementvoltageScopeFlag = this.svg.objectOnPoint[1].voltageScopeFlag;
                this.enable = true;

            }else{
                this.currentElementUnitArray = [];
                this.currentElementValue = undefined;
                this.componentName = "";
                this.selectedUnit = "";
                this.enable = false;
                this.currentElementVoltageFlag = false;
                // this.currentElementcurrentScopeFlag = false;
                // this.currentElementvoltageScopeFlag = false;
            }
            
        }catch(err){
            console.log(err);
        }
    }

   setValue(){
       if(this.currentElementVoltageFlag == undefined){
           this.currentElementVoltageFlag = false;
       }
    //    if(this.currentElementcurrentScopeFlag == undefined){
    //        this.currentElementcurrentScopeFlag =false;
    //    }
    //    if(this.currentElementvoltageScopeFlag== undefined){
    //        this.currentElementvoltageScopeFlag = false;
    //    }
        // console.log(this.currentElementValue, this.selectedUnit);
        let temp_ob =  this.svg.currentArray[this.svg.objectOnPoint[0]];
        let temp_selectedUnit = JSON.parse(JSON.stringify(this.selectedUnit));
        if(temp_selectedUnit=="ohm" || "M ohm" || "K ohm"){
            temp_selectedUnit = temp_selectedUnit.replace("ohm", "&#x2126");
        }
        let textInner = `${temp_ob.elements.symbol}${temp_ob.positiveNodeID} = ${this.currentElementValue}${temp_selectedUnit}`;
        temp_ob.elements.value = this.currentElementValue;
        temp_ob.elements.selectedUnit =  this.selectedUnit;
        temp_ob.svgRefElem.select('text').node.innerHTML = textInner;
        temp_ob.voltageFlag = JSON.parse(JSON.stringify(this.currentElementVoltageFlag));
        // temp_ob.currentScopeFlag = JSON.parse(JSON.stringify(this.currentElementcurrentScopeFlag));
        // temp_ob.voltageScopeFlag = JSON.parse(JSON.stringify(this.currentElementvoltageScopeFlag));

   }
}
