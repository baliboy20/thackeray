import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatInput, MatSidenav} from '@angular/material';
import {CostSalesSequent, VisitorService} from '../generators/visitor/visitor.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';


@Component({
    selector: 'app-cell',
    styleUrls: ['./whatif.component.scss'],
    template: `<table><tr><td class="cell"><span class="valueformat">{{value | numFmt}}</span></td></tr></table>`
})
export class CellOfTableComponent {
    @Input('value') value: any;
}

@Component({
    selector: 'app-hedr',
    styleUrls: ['./whatif.component.scss'],
    template: `<table><tr><td class="cell headerformat"><span class="">{{value}}</span></td></tr></table>`
})
export class HeaderOfTableComponent extends CellOfTableComponent {
    @Input('value') value: any;
}


@Component({
    selector: 'app-whatif',
    templateUrl: './whatif.component.html',
    styleUrls: ['./whatif.component.scss']
})
export class WhatifComponent implements OnInit {

    @ViewChild('sidenav') snav: MatSidenav;
    @ViewChild('pickFrom')  picker: ElementRef;
    @ViewChild('pickTo')  pick2: ElementRef;
    private sidenavOpen = true;
    data$: ReplaySubject<CostSalesSequent[]> = new ReplaySubject();
    pickerFr = '01/01/2018';
    pickerTo = '12/05/2018';
fld = 'date';
    constructor(private  service: VisitorService) {
    }

    ngOnInit() {
        this.data$.subscribe(console.log);
        this.service.getForecast('2/13/2018',
            '12/18/2018',
            'day',
            null)
            .toArray()
            .subscribe(a => this.data$.next(a));

    }

    toggle() {
        this.snav.mode = 'side';
        this.snav.toggle();
    }

    onRecompute() {
        this.service.getForecast(this.picker.nativeElement.value,
            this.pick2.nativeElement.value,
            'day',
            null)
            .toArray()
            .subscribe(a => this.data$.next(a));
        // this.service.getForecast("2/13/2018",
        //     "2/18/2018",
        //     'day',
        //     null)kfdgsd
        //     .toArray()
        //     .subscribe(a => this.data$.next(a));
        // console.log('xx', this.picker.nativeElement.value);
    }


}
