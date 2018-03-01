import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CostSalesSequent, VisitorService} from '../generators/visitor/visitor.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounce';
import 'rxjs/operators/scan';
import 'rxjs/add/observable/interval';
import {MatRadioGroup} from '@angular/material';
// import moment = require('moment');
import moment from 'moment/src/moment';

import {Observer} from 'rxjs/Observer';

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

    constructor(private  service: VisitorService, private rnd: Renderer2, private  ele: ElementRef) {
    }

    rgChanged(event) {
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
            .subscribe(b => this.data$ = b, (err) => console.log, () => console.log('completed'));


    }

    click_download() {


        const toCommaDelim = (a) => (`${a.trades},${a.netSales},${a.profit},${a.vatOnSales},${a.variableCosts},${a.date}}`);
        const toTabs = (a) => (`${a.trades} \t${a.netSales} \t${a.profit} \t${a.vatOnSales} \t${a.variableCosts} \t${a.date} \t\n`);
        const addTitles = `Trades \tNet Sales \tProfit \tVat on Sales \tVariable Costs \tDate\n`;
        const fmt2dec = (a) => {
            const arr = ['trades', 'netSales', 'profit', 'vatOnSales', 'variableCosts'];
            // console.log('inside fm2dec', a)
                arr.forEach(b => {
                    // console.log('a[b]', b, a);
                    a[b] = (+a[b]).toFixed(2);
                });
        return a;
        };
        const addMeta = `Date from: ${moment(this._from).format('DDMMMYY')}\t` +
            `to: ${moment(this._to).format('DDMMMYY')}\t Grouped by:${this.selectedGroupBy}\n`;
        let data = 'xxx';
        const obs = this.service.getForecastGrouped(this._from.toISOString(),
            this._to.toISOString(),
            this.selectedGroupBy,
            null);

        obs.do(() => this.data$ = [])
            .map(fmt2dec)
            .map(toTabs)
            .toArray()
            .do(a => a.unshift(addTitles))
            .do(a => a.unshift(addMeta))
            // .do((a) => console.log(addMeta))
            .subscribe(b => {
                data = b.toString().replace(/\,/g, '');
                data.replace('0', 'z');
                console.log('data', data);

            }, console.log, () => this.createDownloadElement(data));

    }

    onDateChanged(to, event) {
        if (to === 'from') {
            this._from = event.target.value;
        } else {
            this._to = event.target.value;
        }
        this.runOrRerun();
    }

    createDownloadElement(value) {
        console.log('DOWNLOADING...');
        const rn = this.rnd;
        const ele1: HTMLAnchorElement = rn.createElement('a') as HTMLAnchorElement;
        rn.appendChild(this.ele.nativeElement, ele1);
        // const dataUri = 'data:text/plain;base64,' + btoa('here we go again');
        const blob: Blob = new Blob([value], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        ele1.href = url;
        ele1.download = 'xlDownload';
        ele1.click();
        // window.URL.revokeObjectURL(blob);
        // window.open(url);

        // const a: File
        rn.removeChild(this.ele.nativeElement, ele1);
    }

}
