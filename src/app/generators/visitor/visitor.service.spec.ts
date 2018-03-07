import {TestBed, inject} from '@angular/core/testing';

import {
    computeGroupOnPeriod,
    CostSalesSequent,
    DateSequent, FixedCosts, ForecastModelBasic, MonthlyVisitorBias, OPERATING_COSTS, VisitorSequent, VisitorSequentFactory, VisitorService,
    WeeklyVisitorBias
} from './visitor.service';
// import {Observable} from 'rxjs/Observable';
import moment = require('moment');
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
// import {ReplaySubject} from 'rxjs/ReplaySubject';
// import {toArray} from 'rxjs/operator/toArray';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import {Observable} from 'rxjs/Observable';
import {scan} from 'rxjs/operator/scan';
import {of} from 'rxjs/observable/of';
import {map} from 'rxjs/operator/map';
import {range} from 'rxjs/observable/range';
import {from} from 'rxjs/observable/from';

describe('VisitorService', () => {
    let results: DateSequent[];
    results = [
        {dateBucket: 'day', dayNo: 1, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 1, date: '01-Jan-2018'},
        {dateBucket: 'day', dayNo: 2, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 2, date: '02-Jan-2018'},
        {dateBucket: 'day', dayNo: 3, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 3, date: '03-Jan-2018'},
        {dateBucket: 'day', dayNo: 4, month: 1, year: 2018, qtr: 1, weekNo: 1, isoWeekday: 4, date: '04-Jan-2018'}
    ];
    let s: Subject<DateSequent> = new Subject();
    // const wvb: WeeklyVisitorBias = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1};
    const wvb: WeeklyVisitorBias = {1: 1, 2: 10, 3: 100, 4: 120, 5: .20, 6: 2, 7: 3};
    const mvb: MonthlyVisitorBias = {
        1: 1,
        2: 20,
        3: 30,
        4: 70,
        5: 7,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12
    };

    const test_fixedCosts: FixedCosts = {
        configName: 'defaultSettings',
        serviceCharge: {amount: 10, frequency: 'q', dayDue: 30},
        rent: {amount: 300, frequency: 'm', dayDue: 30},
        rates: {amount: 100, frequency: 'y', dayDue: 30},
        lease: {amount: 500, frequency: 'q', dayDue: 30}
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VisitorService]
        });
        s = new Subject();
        console.log('BEFORE EACH');
    });

    afterEach(() => console.log('TES HAS RUN SUCCESSFULLL'));

    it('The Visitor service is injected', inject([VisitorService], (service: VisitorService) => {
        expect(service).toBeTruthy();
    }));

    it('ForecastModelBasic to exist)', inject([VisitorService], (service: VisitorService) => {
        expect(ForecastModelBasic).toBeTruthy();
    }));

    xit('Date Generator -  provides correct dayno,year,qtr)',
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
                }, error => error, () => console.log('from date completed'));
        }));

    /****
     *  Group by testing
     */
    xit('Predicting Visitors for Weekdays', inject([VisitorService], (service: VisitorService) => {
        const bmg1 = ForecastModelBasic.fromDateObservable('01/01/2018', '01/07/2018',
            'day');
        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .toArray()
            .subscribe(a => {
                const ans = [100, 1000, 10000, 12000, 20, 200, 300];
                for (const idx in a) {
                    expect(a[idx].trades).toEqual(ans[idx]);
                    // console.log('values ar ', idx)eererer;
                }
            });


    }));


    it(' REAL :: Predicting Visitors for Weekdays', inject([VisitorService], (service: VisitorService) => {
        const bmg1 = ForecastModelBasic.fromDateObservable('02/05/2018', '02/11/2018',
            'day');


        // const MONTHLY_VISITOR_BIAS = {
        //     '1': .8,
        //     '2': 1,
        //     '3': 1.02,  // mar
        //     '4': 1.03,
        //     '5': 1.04,
        //     '6': 1.1,
        //     '7': 1.2,   // jul
        //     '8': 1.1,
        //     '9': 1.1,   // sep
        //     '10': 1,
        //     '11': 1,
        //     '12': .7    // dec
        // };
        //
        // const WEEKLY_VISITOR_BIAS = {
        //     '1': 1, // m
        //     '2': .5, // tu
        //     '3': .8, // w
        //     '4': 1.2,  // th
        //     '5': 1.5,  // f
        //     '6': 1.5, // sa
        //     '7': 1.8, // su
        // };


        const w = ForecastModelBasic.weeklyVisitorBias;
        const m = ForecastModelBasic.monthlyVisitorBias;
        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, w, m))
            .toArray()
            .subscribe(a => {
                console.log('\n\n\n\nvalues ar ', '\n\n\n\n');
                //const ans = [100, 1000, 10000, 12000, 20, 200, 300];
                let num = 0;
                for (const idx in a) {
num +=a[idx]['trades'];
                    console.log( a[idx].isoWeekday, a[idx]['trades']);
                }
                console.log(`Toal trades is ${num}`)
            });

    }));





    xit('Predicting Visitors for Months', inject([VisitorService], (service: VisitorService) => {
        const bmg1 = ForecastModelBasic.fromDateObservable('05/07/2018', '05/13/2018',
            'day');

        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .toArray()
            .subscribe(a => {
                const ans1 = [100 * 7, 1000 * 7, 10000 * 7, 12000 * 7, 20 * 7, 200 * 7, 300 * 7];
                for (const idx in a) {
                    expect(a[idx].trades).toEqual(ans1[idx]);
                }
            }, () => 22);
    }));

    xit('Compute Fixed costs)', inject([VisitorService], (service: VisitorService) => {

        const fc = ForecastModelBasic;
        const seg: CostSalesSequent = {} as CostSalesSequent;
        const bmg1 = ForecastModelBasic.fromDateObservable('01/01/2018', '12/31/2018',
            'day');
        bmg1
            .map(a => fc.computeFixedCosts(a, test_fixedCosts))
            .filter(a => a.fixedCosts > 0)
            .toArray()
            .subscribe(a => {
                expect(a[0].fixedCosts).toEqual(910);
                expect(a[1].fixedCosts).toEqual(300);
                expect(a[3].fixedCosts).toEqual(810);

                // console.log('aabbb', a);
            });


        expect(ForecastModelBasic).toBeTruthy();
    }));

    xit('Compute Variable Costs', inject([VisitorService], (service: VisitorService) => {
        const fc = ForecastModelBasic;
        const seg: CostSalesSequent = {} as CostSalesSequent;
        const wvb = {1: 2, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1};
        const mvb: MonthlyVisitorBias = {
            1: 1, 2: 1, 3: 1, 4: 2, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1
        };

        const [from, two, gap] = ['04/01/2018', '04/07/2018', 'day'];
        const bmg1 = ForecastModelBasic.fromDateObservable(from, two, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb));


// TODO: operating const needs to be changeable from the GUI.

        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeVariableCosts(a))

            .toArray()
            .subscribe(a => {
                // console.log(a);
                const ans = [145, 290];
                expect(Math.trunc(a[0].variableCosts)).toEqual(145);
                expect(Math.trunc(a[1].variableCosts)).toEqual(290);
            });


    }));

    xit('Compute Net sales', inject([VisitorService], (service: VisitorService) => {
        const fc = ForecastModelBasic;
        const seg: CostSalesSequent = {} as CostSalesSequent;
        const wvb = {
            1: 2, 2: 3,
            3: 1,
            4: 10,
            5: 6,
            6: 1, 7: 1
        };
        const mvb: MonthlyVisitorBias = {
            1: 1, 2: 1, 3: 1,
            4: 1.5,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1, 11: 1, 12: 1
        };

        const [from, two, gap] = ['04/01/2018', '04/03/2018', 'day'];
        const bmg1 = ForecastModelBasic.fromDateObservable(from, two, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb));

// console.log('day ',moment('04/01/2018').month())


        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeNetSales(a, 2.2))
            //  .map(a => f.computeRunningTotals(a))

            .toArray()
            .subscribe(b => {
                const res = [330, 660, 990];

                // .scan((lst,curr, idx) => ( res[0]) )
                expect(b[0].netSales).toEqual(330);
                expect(b[1].netSales).toEqual(660);
                expect(Math.trunc(b[2].netSales)).toEqual(990);
                expect(b[0].vatOnSales).toEqual(66);
                expect(b[1].vatOnSales).toEqual(132);
                expect(Math.trunc(b[2].vatOnSales)).toEqual(198);

            });
    }));

    xit('Compute profit and totals', inject([VisitorService], (service: VisitorService) => {
        const fc = ForecastModelBasic;
        const seg: CostSalesSequent = {} as CostSalesSequent;
        const wvb = {
            1: 2, 2: 3,
            3: 1,
            4: 10,
            5: 6,
            6: 1, 7: 1
        };
        const mvb: MonthlyVisitorBias = {
            1: 1, 2: 1, 3: 1,
            4: 1.5,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1, 11: 1, 12: 1
        };

        const [from1, two, gap] = ['04/01/2018', '04/03/2018', 'day'];
        const bmg1 = ForecastModelBasic.fromDateObservable(from1, two, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb));

        const [comrt, seed] = fc.computeRunningTotals() as [any, any];
        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeFixedCosts(a, test_fixedCosts))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeNetSales(a, 2.2))
            .map(a => fc.computeTotalCosts(a))
            // .scan(comrt, seed)
            .toArray()
            .subscribe(a => {
                // console.log( console.log( '%%%%%% &&',a.netSales, a.variableCosts, a.fixedCosts, a.profit));

                expect(a[0].profit).toEqual(-588.9);
                expect(a[1].profit).toEqual(442.2);
                // expect(b[1].netSales).toEqual(660);
                // expect(Math.trunc(b[2].netSales)).toEqual(990);
                // expect(b[0].vatOnSales).toEqual(66);
                // expect(b[1].vatOnSales).toEqual(132);
                // expect(Math.trunc(b[2].vatOnSales)).toEqual(198);
            });
    }));

    xit('Compute cumilative totals', inject([VisitorService], (service: VisitorService) => {
        const fc = ForecastModelBasic;
        const seg: CostSalesSequent = {} as CostSalesSequent;
        const wvb = {
            1: 2, 2: 3,
            3: 1,
            4: 10,
            5: 6,
            6: 1, 7: 1
        };
        const mvb: MonthlyVisitorBias = {
            1: 1, 2: 1, 3: 1,
            4: 1.5,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1, 11: 1, 12: 1
        };

        const [from1, two, gap] = ['04/01/2018', '04/03/2018', 'day'];
        const bmg1 = ForecastModelBasic.fromDateObservable(from1, two, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb));

        const [comrt, seed] = fc.computeRunningTotals() as [any, any];
        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeFixedCosts(a, test_fixedCosts))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeNetSales(a, 2.2))
            .map(a => fc.computeTotalCosts(a))
            .scan(comrt, seed)
            // .take(3)
            .toArray()
            .subscribe(a => {
                // console.log( console.log('KKK', a));
                expect(a[0].cumProfit).toEqual(1136.7);
                expect(a[1].cumProfit).toEqual(1463.4);
                expect(a[2].cumProfit).toEqual(1463.4);
            });
    }));

    xit('Compute groupby', inject([VisitorService], (service: VisitorService) => {
        const fc = ForecastModelBasic;
        const seg: CostSalesSequent = {} as CostSalesSequent;
        const wvb = {
            1: 2, 2: 3,
            3: 1,
            4: 10,
            5: 6,
            6: 1, 7: 1
        };
        const mvb: MonthlyVisitorBias = {
            1: 1, 2: 1, 3: 1,
            4: 1.5,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1, 11: 1, 12: 1
        };

        const [from1, two, gap] = ['04/01/2018', '09/03/2018', 'month'];
        const bmg1 = ForecastModelBasic.fromDateObservable(from1, two, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb));

        const [computeTotals, seed] = fc.computeRunningTotals() as [any, any];
        bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeFixedCosts(a, test_fixedCosts))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeNetSales(a, 2.2))
            .map(a => fc.computeTotalCosts(a))
            .scan(computeTotals, seed)
            .groupBy(a => fc.computeGroupOnPeriod(a, gap))
            .flatMap(a => from(a).pipe(fc.computeGroupedValues(a.key)))

            // .toArray()
            .subscribe(a => {
                console.log(console.log(a));
                // expect(a[0].cumProfit).toEqual(1136.7);
                // expect(a[1].cumProfit).toEqual(1463.4);
                // expect(a[2].cumProfit).toEqual(1463.4);
                expect(ForecastModelBasic).toBeTruthy();
            });
    }));

    // xit('Compute groupby', inject([VisitorService], (service: VisitorService) => {
    //     const fc = ForecastModelBasic;
    //     const seg: CostSalesSequent = {} as CostSalesSequent;
    //     const wvb = {
    //         1: 2, 2: 3,
    //         3: 1,
    //         4: 10,
    //         5: 6,
    //         6: 1, 7: 1
    //     };
    //     const mvb: MonthlyVisitorBias = {
    //         1: 1, 2: 1, 3: 1,
    //         4: 1.5,
    //         5: 1,
    //         6: 1,
    //         7: 1,
    //         8: 1,
    //         9: 1,
    //         10: 1, 11: 1, 12: 1
    //     };
    //
    //     const [from1, two, gap] = ['04/01/2018', '09/03/2018', 'month'];
    //     const bmg1 = ForecastModelBasic.fromDateObservable(from1, two, gap)
    //         .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb));
    //
    //     const [computeTotals, seed] = fc.computeRunningTotals() as [any, any];
    //     bmg1.map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
    //         .map(a => (a as CostSalesSequent))
    //         .map(a => fc.computeVariableCosts(a))
    //         .map(a => fc.computeFixedCosts(a, test_fixedCosts))
    //         .map(a => fc.computeVariableCosts(a))
    //         .map(a => fc.computeNetSales(a, 2.2))
    //         .map(a => fc.computeTotalCosts(a))
    //         .scan(computeTotals, seed)
    //         .groupBy(a => fc.computeGroupOnPeriod(a, gap))
    //         .flatMap(a => from(a).pipe(fc.computeGroupedValues(a.key)))
    //
    //         // .toArray()
    //         .subscribe(a => {
    //             console.log( console.log( a));
    //             // expect(a[0].cumProfit).toEqual(1136.7);
    //             // expect(a[1].cumProfit).toEqual(1463.4);
    //             // expect(a[2].cumProfit).toEqual(1463.4);
    //             expect(ForecastModelBasic).toBeTruthy();
    //         });
    // }));


});
