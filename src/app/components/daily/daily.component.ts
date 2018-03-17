import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/take';

@Component({
    selector: 'app-cf-daily',
    templateUrl: './daily.component.html',
    styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
    data$: Observable<any>;
    fld = 'date';
    @Input() set data(value: Observable<any>) {
      // value.map((a: any[]) => (a.slice(0, 5))).subscribe(console.log);
       this.data$ = value;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
