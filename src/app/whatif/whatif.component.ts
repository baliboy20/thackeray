import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatInput, MatSidenav} from '@angular/material';
import {CostSalesSequent, VisitorService} from '../generators/visitor/visitor.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
// import moment = require('moment');

import moment from 'moment/src/moment';

// @Component({
//     selector: 'app-cell',
//     styleUrls: ['./whatif.component.scss'],
//     template: `<table><tr><td class="cell"><span class="valueformat">{{value | numFmt}}</span></td></tr></table>`
// })
// export class CellOfTableComponent {
//     @Input('value') value: any;
// }
//
// @Component({
//     selector: 'app-hedr',
//     styleUrls: ['./whatif.component.scss'],
//     template: `<table><tr><td class="cell headerformat"><span class="">{{value}}</span></td></tr></table>`
// })
// export class HeaderOfTableComponent extends CellOfTableComponent {
//     @Input('value') value: any;
// }


@Component({
    selector: 'app-whatif',
    templateUrl: './whatif.component.html',
    styleUrls: ['./whatif.component.scss']
})
export class WhatifComponent implements OnInit {

    @ViewChild('sidenav') snav: MatSidenav;
    @ViewChild('pickFrom') picker: ElementRef;
    @ViewChild('pickTo') pick2: ElementRef;
    private sidenavOpen = true;
    data$: ReplaySubject<CostSalesSequent[]> = new ReplaySubject();
    pickerFr = '01/01/2018';
    pickerTo = '12/05/2018';
    fld = 'date';

    _from = new Date('02/13/2018');
    _to = new Date('08/13/2018');

    constructor(private  service: VisitorService) {
    }

    ngOnInit() {
        this.data$.subscribe(console.log);
        this.service.getForecast('2/1/2018',
            '2/26/2018',
            'day',
            null)
            .toArray()
            .subscribe(a => this.data$.next(a));
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.toggle();
        }, 10);
    }

    toggle() {
        this.snav.mode = 'side';
        this.snav.toggle();
    }

    onRecompute() {
        setTimeout(() => {

            this.service.getForecast(this._from.toISOString(),
                this._to.toISOString(),
                'day',
                null)
                .toArray()
                .subscribe(a => this.data$.next(a));
        }, 50);

    }

    onDateChanged(to, event) {
        if (to === 'from') {
            this._from = event;
        } else {
            this._to = event;
        }
        this.onRecompute();
    }

    onChanged(val) {
        this.onRecompute();
    }


}
