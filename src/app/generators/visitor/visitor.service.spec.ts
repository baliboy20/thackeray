import {TestBed, inject} from '@angular/core/testing';

import {DateSequent, ForecastModelBasic, VisitorSequent, VisitorService} from './visitor.service';
import {Observable} from 'rxjs/Observable';
import moment = require('moment');

describe('VisitorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VisitorService]
        });
    });

    it('should be created', inject([VisitorService], (service: VisitorService) => {
        expect(service).toBeTruthy();
    }));

    it('ForecastModelBasic to exist)', inject([VisitorService], (service: VisitorService) => {
        expect(ForecastModelBasic).toBeTruthy();
    }));

    it('Daily date generation incrments with correct dayno,year,qtr)', inject([VisitorService], (service: VisitorService) => {
        const testdate = (date, string) => expect(moment(date).format('MM/DD/YYYY')).toEqual((string));
        const results = [
            {dateBucket: 'day', dayNo: 1, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 1, date: '01-Jan-2018'},
            {dateBucket: 'day', dayNo: 2, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 2, date: '02-Jan-2018'},
            {dateBucket: 'day', dayNo: 3, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 3, date: '03-Jan-2018'},
            {dateBucket: 'day', dayNo: 4, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 4, date: '04-Jan-2018'}
            ];
        const fmb = ForecastModelBasic;
        fmb.fromDateObservable('01/01/2018', '01/04/2018', 'day')
            // .do(console.log)
            .toArray()
            .subscribe(a => {
                expect(a).not.toBeUndefined();
                expect(a.length).toEqual(4);
                const dt: string = (a[0] as DateSequent).date;
                for (let idx in a) {
                    const inputval = a[idx];
                    const res = results[idx];
                    expect(inputval.dateBucket).toEqual(res.dateBucket);
                    expect(inputval.date).toEqual(res.date);
                    expect(inputval.dayNo).toEqual(res.dayNo);
                    expect(inputval.year).toEqual(res.year);
                    expect(inputval.weekNo).toEqual(res.weekNo);
                    expect(inputval.qtr).toEqual(res.qtr);
                    expect(inputval.isoWeekday).toEqual(res.isoWeekday);
                }
            });
    }));

});
