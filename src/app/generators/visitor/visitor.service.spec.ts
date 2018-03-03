import {TestBed, inject} from '@angular/core/testing';

import {
    DateSequent, ForecastModelBasic, MonthlyVisitorBias, VisitorSequent, VisitorSequentFactory, VisitorService,
    WeeklyVisitorBias
} from './visitor.service';
import {Observable} from 'rxjs/Observable';
import moment = require('moment');
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

describe('VisitorService', () => {
    let results: DateSequent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VisitorService]
        });
        results = [
            {dateBucket: 'day', dayNo: 1, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 1, date: '01-Jan-2018'},
            {dateBucket: 'day', dayNo: 2, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 2, date: '02-Jan-2018'},
            {dateBucket: 'day', dayNo: 3, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 3, date: '03-Jan-2018'},
            {dateBucket: 'day', dayNo: 4, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 4, date: '04-Jan-2018'}
        ];

    });

    afterEach(() => console.log('TES HAS RUN SUCCESSFULLL'));

    it('should be created', inject([VisitorService], (service: VisitorService) => {
        expect(service).toBeTruthy();
    }));

    it('ForecastModelBasic to exist)', inject([VisitorService], (service: VisitorService) => {
        expect(ForecastModelBasic).toBeTruthy();
    }));

    it('TDate Generator - Daily date generation incrments with correct dayno,year,qtr)',
        inject([VisitorService], (service: VisitorService) => {
            const testdate = (date, string) => expect(moment(date).format('MM/DD/YYYY')).toEqual((string));

            const fmb = ForecastModelBasic;
            fmb.fromDateObservable('01/01/2018', '01/04/2018', 'day')
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

    /****
     *  Group by testing
     */
    it('Compute Visitor Bias for Weekdays & Months', inject([VisitorService], (service: VisitorService) => {
        expect(ForecastModelBasic).toBeTruthy();

        const s: Subject<DateSequent> = new ReplaySubject();
        const wvb: WeeklyVisitorBias = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1};
        const mvb: MonthlyVisitorBias = {
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            '11': 11,
            '12': 12
        };

        const bmg1 = ForecastModelBasic.fromDateObservable('01/01/2018', '01/07/2018',
            'day');
       bmg1.subscribe(a => s.next(a));
        s.map((a: DateSequent) =>  ForecastModelBasic.visitorSequentFactory1(a, 1, wvb, mvb))
            .subscribe(a => console.log('xx', a));


    }));

});
