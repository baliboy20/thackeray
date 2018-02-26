import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from './daily/daily.component';
import { AggPeriodComponent } from './agg-period/agg-period.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DailyComponent, AggPeriodComponent]
})
export class ComponentsModule { }
