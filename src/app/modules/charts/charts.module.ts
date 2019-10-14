import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BarChartStackedComponent } from './components/bar-chart-stacked/bar-chart-stacked.component';

export { BarChartDatum } from './components/bar-chart/bar-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BarChartComponent,
    BarChartStackedComponent
  ],
  exports: [
    BarChartComponent,
    BarChartStackedComponent
  ]
})
export class ChartsModule { }
