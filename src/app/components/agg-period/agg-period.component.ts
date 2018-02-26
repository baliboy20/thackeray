import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cf-cum-periodic',
  templateUrl: './agg-period.component.html',
  styleUrls: ['./agg-period.component.scss']
})
export class AggPeriodComponent implements OnInit {
  @Input() set data(value) {
    this.data$ = value;
  }
    data$: any[] = [];
    flds = [
        'date',
        'trades',
        'profit',
        'vatOnSales',
        'VariableCosts',
        'netSales',
    ];

    ngOnInit(): void {
    }
}
