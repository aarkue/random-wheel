import { Component, ViewChild } from '@angular/core';
import { WheelComponent } from '../wheel/wheel.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public segmentsInput : { label: string, color: string, weight?: number}[]  = [
    {color:"#ef281e", label:"Option 1", weight: 10},
    {color:"#f6a229", label:"Option 2", weight: 0.5},
    {color:"#E3DD2D", label:"Option 3", weight: 1}
  ];
  public velocity : number = 0;
  private readonly niceColors = ["#ef281e","#f6a229","#E3DD2D","#00bc58","#0881cd"]
  @ViewChild('wheel')
  private wheel : WheelComponent;
  public resultLabel : string | null = null;

  public riggedResult : number = -1;
  
  constructor() {}

  initWheel(){
    this.resultLabel = null;
    this.wheel.initWheel();
  }

  startWheel(){
    this.wheel.startWheel();

  }

  getNiceColor(){
    return this.niceColors[this.segmentsInput.length % this.niceColors.length];
  }

  showResult(ind : number){
    this.resultLabel = this.segmentsInput[ind].label;
    console.log(ind);
  }
}
