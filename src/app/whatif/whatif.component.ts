import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatInput, MatSidenav} from '@angular/material';
import {CostSalesSequent, VisitorService} from '../generators/visitor/visitor.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Component({
    selector: 'app-whatif',
    templateUrl: './whatif.component.html',
    styleUrls: ['./whatif.component.scss']
})
export class WhatifComponent implements OnInit {

    @ViewChild('sidenav') snav: MatSidenav;
    @ViewChild('pickFrom')  picker: ElementRef;
    @ViewChild('pickTo')  pick2: ElementRef;
    private sidenavOpen = false;
    data$: ReplaySubject<CostSalesSequent> = new ReplaySubject();
    pickerFr = '01/01/2018';
    pickerTo = '05/05/2018';

    constructor(private  service: VisitorService) {
    }

    ngOnInit() {
        this.data$.subscribe(console.log);

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
        console.log('xx', this.picker.nativeElement.value);
    }


}
