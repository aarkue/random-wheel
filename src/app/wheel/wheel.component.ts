import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent implements OnInit, AfterViewInit {

  @ViewChild('wheelCanvas')
  private wheelCanvas : ElementRef<HTMLCanvasElement>;

  @ViewChild('wheelArrow')
  private wheelArrow : IonIcon;
  
  private wheelContext: CanvasRenderingContext2D;
  private rad : number;
  protected ang : number = 0;
  @Input('friction')
  private friction : number = 0.989;
  protected velocity : number = 0;
  private interval;
  @Input('velocityEnd')
  private readonly VELOCITY_CUTOFF : number = 0.001;
  private currSector = undefined;

  @Input('segments')
  public segmentsInput : { label: string, color: string, weight?: number}[]  = [
    {color:"#ef281e", label:"Option 1", weight: 1}
  ];
  
  private segments : {label: string, color: string, weight?: number}[] = [];

  private segmentAngels = [];

  private weightedN : number = 0;

  protected result = null;
  public arrowColor = "#003c58"

  @Input('riggedResult')
  public riggedResult : number  = -1;

  @Output('onResult')
  private resultEmitter : EventEmitter<number> = new EventEmitter<number>();

  constructor() { }



  public ngOnInit() {
  }

  public ngAfterViewInit(): void {
    this.wheelCanvas.nativeElement.height = this.wheelCanvas.nativeElement.width;
    this.wheelContext = this.wheelCanvas.nativeElement.getContext('2d');
    this.rad =  this.wheelContext.canvas.width/2;
    this.initWheel()
  }

  public initWheel(){
    if(this.segmentsInput && this.segmentsInput.length > 0){
    this.segments = [...this.segmentsInput];
    clearInterval(this.interval)
    this.result = null;
    this.velocity = 0;
    this.segmentAngels = [];
    this.weightedN = this.summedWeightsUpTo(this.segments.length-1);
    this.segments.forEach((val,index) => this.drawSegment(val,index));
    }
  }

  protected drawSegment(segment : {label: string, color: string, weight?: number}, index : number){
    this.wheelContext.save();
    let arc = (Math.PI *  2) * (1) / this.weightedN;
    let ang = this.summedWeightsUpTo(index-1) * arc;
    this.segmentAngels.push(ang);
    this.wheelContext.beginPath();
    this.wheelContext.fillStyle = segment.color+"ff";
    this.wheelContext.moveTo(this.rad,this.rad);
    this.wheelContext.arc(this.rad,this.rad,this.rad,ang,ang+this.getSegWeight(index)*arc);
    this.wheelContext.lineTo(this.rad,this.rad)
    this.wheelContext.fill();

    this.wheelContext.translate(this.rad,this.rad);
    this.wheelContext.rotate((ang+ang+this.getSegWeight(index)*arc)/2)

    if(navigator.userAgent.toLowerCase().indexOf('firefox') < 0){
      this.wheelContext.textAlign = "right";
      this.wheelContext.fillStyle = "#fff";
      
      let fontSize = ((segment.label.length/20 + this.weightedN / 40 + (0.04/this.getSegWeight(index)) ) * -50) + 80;
      this.wheelContext.font = `bold ${fontSize}px sans-serif`;
      this.wheelContext.fillText(segment.label, this.rad - 30,10);
    }
  
    this.wheelContext.restore();
  }

  protected rotate(){
    this.currSector = this.segments[this.getIndexFromAngle(this.ang + (Math.PI/2))];
    this.arrowColor = this.currSector.color+"ff";
    this.wheelContext.canvas.style.transform = `rotate(${this.ang}rad)`;
  }

  protected drawOnAngle(){
    this.wheelContext.save();
    let arc = 0.03;
    this.wheelContext.beginPath();
    this.wheelContext.fillStyle = "#375";
    this.wheelContext.moveTo(this.rad,this.rad);
    this.wheelContext.arc(this.rad,this.rad,this.rad,-this.ang - (Math.PI/2) ,-this.ang - (Math.PI/2) +arc);
    this.wheelContext.lineTo(this.rad,this.rad)
    this.wheelContext.fill();
    this.wheelContext.restore();
  }

  protected drawFrame(){
    if(!this.velocity){ 
      clearInterval(this.interval);
      this.currSector = this.segments[this.getIndexFromAngle(this.ang + (Math.PI/2))];
      this.arrowColor = this.currSector.color+"ff";
      this.result = this.currSector.label;
      this.resultEmitter.emit(this.getIndexFromAngle(this.ang + (Math.PI/2)))
      return;
    }
    this.velocity = this.velocity * this.friction;
    if (this.velocity < this.VELOCITY_CUTOFF){
      this.velocity = 0;
      
    }
    this.ang += this.velocity;
    this.ang = this.ang % (Math.PI * 2)
    this.rotate();
  }
  
  
  public startWheel(velocity : number | undefined = undefined){
    clearInterval(this.interval)
    this.result = null;
    if(velocity !== undefined){
      this.velocity = velocity;
    }else{
      this.velocity = (Math.random() * (0.55 - 0.35) + 0.55)
    }
    

    if(this.riggedResult >= 0){
      let simVel = this.velocity;
      let simI = 0;
      let simAng = this.ang;
      while(simVel > this.VELOCITY_CUTOFF){
        simVel *= this.friction;
        simI++;
        simAng += simVel;
        simAng = simAng % (Math.PI * 2)
      }
      if(this.getIndexFromAngle(simAng + (Math.PI/2)) !== this.riggedResult){
        this.startWheel();
        return;
      }
    }

    this.interval = setInterval(() => {
      this.drawFrame();
    },30)
  }


  protected getIndexFromAngle(ang :number) : number{
    ang = ang % (Math.PI * 2);
    let index = this.segments.length-1;
    for (let i = 0; i < this.segmentAngels.length; i++) {
      if(2* Math.PI  - ang >= this.segmentAngels[i]){
        index = i;
      }else{
        break;
      }
    }
    return index;
  }

  protected getSegWeight(index: number){
    return this.segments[index].weight ? this.segments[index].weight : 1;
  }

  protected summedWeightsUpTo(index : number){
    let ret = 0;
    for (let i = 0; i <= index; i++) {
      ret += this.getSegWeight(i);
    }
    return ret;
  }
}
