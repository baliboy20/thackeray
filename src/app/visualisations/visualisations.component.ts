import {Component, OnInit} from '@angular/core';
import {CostSalesSequent, VisitorService} from '../generators/visitor/visitor.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounce';
import 'rxjs/operators/windowTime';
import 'rxjs/add/observable/interval';
import {windowTime} from 'rxjs/operators';

@Component({
    selector: 'app-visualisations',
    templateUrl: './visualisations.component.html',
    styleUrls: ['./visualisations.component.scss']
})
export class VisualisationsComponent implements OnInit {

    // data$: ReplaySubject<any[]> = new ReplaySubject();
    data$: any[] = [];
    flds = [
        'date',
        'trades',
        'profit',
        'vatOnSales',
        'VariableCosts',
        'netSales',
    ];

    constructor(private  service: VisitorService) {
    }


    ngOnInit() {
        // this.data$.subscribe(console.log);


        // const rang = Observable.range(1, 40)
        //     .map(a => ({k: a, v: `Dorrito${a}`}));
        //  rang
        //      .toArray()
        //      .subscribe(a => this.data$.next(a));


        const obs = this.service.getForecastGrouped('2/13/2018',
            '12/18/2018',
            'month',
            null);

        obs.subscribe(b => this.data$.push(b));
    }

}
