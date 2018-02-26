import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from './daily/daily.component';
import { AggPeriodComponent } from './agg-period/agg-period.component';
import {NumFmtPipe} from './pipes/num-fmt.pipe';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import {APP_DATE_FORMATS, AppDateAdapter} from './providers/MaterialDateAdapterProvider';

/**
 * related post:
 * https://stackoverflow.com/questions/44452966/angular-2-material-2-datepicker-date-format
 *
 */

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DailyComponent, AggPeriodComponent, NumFmtPipe],
  exports: [DailyComponent, AggPeriodComponent],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class ComponentsModule { }
