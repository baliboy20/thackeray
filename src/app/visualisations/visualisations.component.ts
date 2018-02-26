import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CostSalesSequent, VisitorService} from '../generators/visitor/visitor.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounce';
import 'rxjs/operators/windowTime';
import 'rxjs/add/observable/interval';
import {MatRadioGroup} from '@angular/material';

@Component({
    selector: 'app-visualisations',
    templateUrl: './visualisations.component.html',
    styleUrls: ['./visualisations.component.scss']
})
export class VisualisationsComponent implements OnInit {

    @ViewChild(MatRadioGroup) rg: ElementRef;
    data$: any[] = [];

    flds = [
        'date',
        'trades',
        'profit',
        'vatOnSales',
        'VariableCosts',
        'netSales',
    ];

    groupby = ['year', 'week', 'month', 'quarter'];
    selectedGroupBy: 'week';
    _from = new Date('02/13/2018');
    _to = new Date('08/13/2018');

    constructor(private  service: VisitorService) {
    }

    rgChanged(event) {
        console.log('event...', event);
        this.selectedGroupBy = event.value;
        this.runOrRerun();
    }

    ngOnInit() {
    }

    runOrRerun() {
        const obs = this.service.getForecastGrouped(this._from.toISOString(),
            this._to.toISOString(),
            this.selectedGroupBy,
            null);

        obs.do(() => this.data$ = []).toArray()
    .subscribe(b => this.data$ = b, (err) => console.log, () => console.log('completed') );


    }

    onDateChanged(to, event) {
        if (to === 'from') {
            this._from = event.target.value;
        } else {
           this._to = event.target.value;
        }
        this.runOrRerun();
    }

}
