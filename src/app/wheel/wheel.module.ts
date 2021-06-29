import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WheelComponent } from './wheel.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [WheelComponent],
  exports: [WheelComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
})
export class WheelModule { }
