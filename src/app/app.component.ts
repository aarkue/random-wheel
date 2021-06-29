import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { WheelComponent } from './wheel/wheel.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public segmentsInput : { label: string, color: string, weight?: number}[]  = [
    {color:"#ef281e", label:"Option 1", weight: 1},
    {color:"#f6a229", label:"Option 2", weight: 1},
    {color:"#E3DD2D", label:"Option 3", weight: 1}
  ];
  public velocity : number = 0;
  private readonly niceColors = ["#ef281e","#f6a229","#E3DD2D","#00bc58","#0881cd"]
  @ViewChild('wheel')
  private wheel : WheelComponent;
  public result : {label: string, color: string, weight?: number} | null = null;
  public riggedResult : number = -1;

  @ViewChildren('labelInput') 
  private labelInputs: QueryList<IonInput>;

  @ViewChild('resultText')
  private resultText : ElementRef<HTMLHeadingElement>;

  constructor() {}

  initWheel(){
    this.wheel.initWheel();
    this.clearLastResult();
  }

  clearLastResult(){
    this.result = null;
    this.resultText.nativeElement.classList.remove('newResult');
    this.resultText.nativeElement.style.backgroundColor = '';
  }

  startWheel(){
    this.clearLastResult();
    this.wheel.startWheel();

  }

  getNiceColor(){
    return this.niceColors[this.segmentsInput.length % this.niceColors.length];
  }

  showResult(ind : number){
    this.result = this.segmentsInput[ind];
    this.resultText.nativeElement.classList.add('newResult');
    this.resultText.nativeElement.style.backgroundColor = this.result.color+'30';
    console.log(ind);
  }

  onLabelInputKeyDown(index : number, event: KeyboardEvent){
    if(event.key === 'Enter' && !event.ctrlKey){
      this.focusLabelInput(index + (event.shiftKey ? (-1) : 1))
    }else if(event.key === 'Enter' && event.ctrlKey){
      this.initWheel();
    }
  }

  async focusLabelInput(index : number){
    if(index >= 0 && index < this.segmentsInput.length){
      await this.labelInputs.get(index).setFocus();
    }else if(index == this.segmentsInput.length){
      this.initWheel();
    }
  }

}
