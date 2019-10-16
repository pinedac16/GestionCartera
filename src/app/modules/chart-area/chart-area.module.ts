import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartAreaComponent } from './chart-area.component';
import { Ng2GoogleChartsModule} from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule, 
    Ng2GoogleChartsModule
  ],
  declarations: [ChartAreaComponent],
  exports: [
    ChartAreaComponent
  ]
})
export class ChartAreaModule { }
