import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
// import {pipe} from 'rxjs/observable/p';

import {filter, map, reduce, scan, mergeMap, combineLatest, zip, take, takeUntil, takeWhile, tap} from 'rxjs/operators';
import {range} from 'rxjs/observable/range';
import {from} from 'rxjs/observable/from';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/zipAll';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/do';
import {interval} from 'rxjs/observable/interval';
import * as moment from 'moment';
import {Duration, Moment} from 'moment';
import {flatMap} from 'tslint/lib/utils';
import {zipAll} from 'rxjs/operator/zipAll';
import {Observer} from 'rxjs/Observer';
import {merge} from 'rxjs/operator/merge';
import {mergeAll} from 'rxjs/operator/mergeAll';
import {concat} from 'rxjs/operator/concat';
import {groupBy} from 'rxjs/operator/groupBy';
import {of} from 'rxjs/observable/of';
import {GroupedObservable} from 'rxjs/operators/groupBy';
import {toArray} from 'rxjs/operator/toArray';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

// import {let} from 'rxjs/operators';

@Injectable()
export class VisitorService {

    basePeriod = new Date('01/31/2018');
    baseVisitorNo = 100;

    constructor() {
    }

    getForecast(from1: string, to: string, interval1: PeriodOfString, forecastmodel?: any) {
        return ForecastModelBasic.baseModel(from1, to, interval1) ;
    }

}

type PeriodOfString = 'day' | ' week' | 'month' | 'quarter' | 'biannual' | 'year';

interface Dayts {
    date: string;
    dateBucket: PeriodOfString;
    dayNo: number;
}

interface DateSequent {
    dayNo: number;
    month: number;
    year: number;
    qtr: number;
    weekNo: number;
    date: string;
    isoWeekday: string;
}

interface VisitorSequent extends DateSequent {
    visitors: number;
}

const VisitorSequentFactory: (ds: DateSequent, visitors) => VisitorSequent = (ds: DateSequent, visitors) => ({
    dayNo: ds.dayNo,
    month: ds.month,
    year: ds.year,
    qtr: ds.qtr,
    weekNo: ds.weekNo,
    date: ds.date,
    visitors: visitors,
    isoWeekday: ds.isoWeekday
} as VisitorSequent);

const computeFixedCosts: (arg: VisitorSequent) => CostSalesSequent = (arg: VisitorSequent) => {
    const v: number[] = [3, 6, 9, 12];
    const fc: CostSalesSequent = arg as CostSalesSequent;
    fc.fixedCosts = (v.includes(arg.month) && moment(arg.date).format('D') === '1') ? 1300 : 0;
    return fc;
};

const computeVariableCosts: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
    a.variableCosts = (a as VisitorSequent).visitors * 5.5 * .33;
    return a;
};
const computeSales: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
    a.netSales = (a as VisitorSequent).visitors * 5.5 * .66;
    a.vatSales = (a as VisitorSequent).visitors * 5.5 * .66 * 1.2;
    return a;
};

export interface CostSalesSequent extends VisitorSequent {
    fixedCosts: number;
    variableCosts: number;
    netSales: number;
    vatSales: number;
}

const monthlyVisitorBias = {
    '0': .8,
    '1': 1,
    '2': 1.02,  // mar
    '3': 1.03,
    '4': 1.04,
    '5': 1.1,
    '6': 1.2,   // jul
    '7': 1.1,
    '8': 1.1,   // sep
    '9': 1,
    '10': 1,
    '11': .7    // dec
};

const weeklyVisitorBias = {
    '0': .3, // su
    '1': .4, // mo
    '2': .5, // tu
    '3': 1,  // w
    '4': 1,  // th
    '5': .9, // f
    '6': .3, // sa
};


export class ForecastModelBasic {

    static dateMap: Map<string, any[]> = new Map();

    static call() {
        const source$ = range(0, 10);
        source$.pipe(
            filter(x => x % 2 === 0),
            map(x => x + x),
            scan((acc, x) => acc + x, 0)
        )
            .subscribe(x => console.log(x + 'dd'));

        const scan1 = (acc, idx) => acc + idx;
        const merge = combineLatest(obs => Observable.range(1, 2)
            .map(a => a + ':' + obs));


        Observable.range(1, 2).pipe(merge).subscribe(a => {
            // a.subscribe(console.log);
            // console.log('hello there', a);
        });
    }

    static costs(p1?: Date, p2?: Date) {
        const s$ = interval();

        const TRANS_TO_DATE = map((cnt: number) => {
            const now = moment().add(cnt, 'days').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
            return now;
        });

        const TAKE_WHILE = takeWhile((a: any) => {
            const lmt = moment().add(10, 'days').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).toISOString();
            // console.log('mo', a.format())
            return a.isSameOrBefore(lmt);
        });

        const PIPE = s$.pipe(TRANS_TO_DATE,
            TAKE_WHILE,
            take(20)
        );

        // sub.subscribe(a => a);
        // console.log(moment.locale());
        return PIPE;
    }

    static costsByPeriod(periodType: PeriodOfString, start: string, finish: string) {
        const increr = scan((acc, curr) => {
            acc.total *= 1.01;
            acc.date = curr.date;
            return acc;
        }, {date: '', total: 100});

        const dates$ = this.costs();
        const d2$ = dates$.pipe(map(a => {
            return {date: a.toISOString(), total: 0};
        }), increr);
        return d2$;


    }

    static _dateGen() {

    }

    static _dateGen_() {
        const increr = scan((acc, curr) => {
            acc.total *= 1.01;
            acc.date = curr.date;
            return acc;
        }, {date: '', total: 100});

        const mapper = a => {
            return {date: a.toISOString(), total: 0};
        };

        const one = from(['a', 'b', 'c']);
        const func1 = (a) => Observable.from(one).map(b => ({date: a.date, one: b}));
        const func2 = (a) => Observable.from(two).map(b => b);
        const two = from(['e', 'f', 'g']);
        const source = range(1, 3);
        const flowtrans = map(a => ({date: a, one: [], two: []}));
        const zip1 = zip(func1);
        const zip2 = zip(func2);
        // source.pipe(flowtrans, zip1).subscribe(a => a.subscribe(console.log));
        const m3 = map(() => ({key: 'a', value: 'someval'}));
        const z3 = zip(range(4, 1), range(9, 1));
        // const r3 = range(1, 3).pipe( z3).subscribe(console.log);

        const costs = (a) => Observable.of(this._varCosts(a.date)).map(b => ({date: a.date, value: b, label: 'costs'}));
        const rev = (a) => Observable.of(this._varRevs(a.date)).map(b => ({date: a.date, value: b, label: 'revenue'}));
        const zip4 = zip(costs, rev);
        this.zzMergeAll();
    }

    private static _varCosts(date: string): number {
        const dayOfYr = moment(date).diff('2018-01-01', 'days');
        return moment(date).quarter() * 1000 + dayOfYr;
    }

    private static _varRevs(date: string): number {
        const dayOfYr = moment(date).diff('2018-01-01', 'days');
        return -(moment(date).quarter() * 1004 + dayOfYr);
    }

    static fromDateObservable(from1: string = '01/01/2018', to: string = '04/01/2018',
                              gap: PeriodOfString = 'day'): Observable<DateSequent> {
        return Observable.create((observer: Observer<Dayts>) => {
                let d = 0;
                let moDate = moment(from1);

                while (moDate.isSameOrBefore(to)) {
                    moDate = moment(from1).add(d, 'd');
                    const v: Dayts = {
                        dateBucket: gap,
                        dayNo: d,
                        month: moment(moDate).month() + 1,
                        year: moment(moDate).year(),
                        qtr: moment(moDate).quarter(),
                        weekNo: moment(moDate).isoWeek(),
                        isoWeekday: moment(moDate).isoWeekday(),
                        date: moDate.format('DD-MMM-YYYY'),
                    } as Dayts;
                    observer.next(v);
                    d++;
                    if (d > 2140) {
                        break;
                    }
                }
                observer.complete();
            }
        );
    }


    /**
     * Visitor numbers have two trend annual footfall,
     * @param {string} from1
     * @param {string} to
     * @param {PeriodOfString} bucket
     * @returns {Observable<number>}
     */
    static observableVistorGenerator(from1: string = '01/01/2018', to: string = '04/01/2018',
                                     bucket: PeriodOfString = 'day'): Observable<number> {
        return Observable.create((observer: Observer<Dayts>) => {
                let frm = from1;
                let dayno = 0;
                while (moment(frm).isSameOrBefore(to)) {
                    frm = moment(from1).add(dayno, 'd').toISOString();
                    const v: Dayts = {
                        dateBucket: bucket,
                        dayNo: dayno,
                        date: frm,
                    } as Dayts;
                    observer.next(v);
                    dayno++;
                    if (dayno > 2140) {
                        break;
                    }
                }
                observer.complete();
            }
        );
    }

    /**
     *
     */
    static zzMergeAll() {
        const costs = (a) => ({date: a, value: this._varCosts(a.date), label: 'costs'});

        const rev = (a) => ({date: a, value: this._varRevs(a.date), label: 'revenue'});
        const op = (...stms) => {
            return (source) => {
                return Observable.create(subscriber => {
                    const subscription = source.subscribe(value => {
                        stms.forEach(func => {
                            subscriber.next((func(value.date)));
                            console.log('....=>');
                        });
                    });
                    return subscription;
                });
            };
        };

        const reducer = reduce((x, y) => {
            const acc = {key: '', sum: 0, values: []};
            // console.log(y);
            acc.sum = y['value'];
            acc.values.push(y);
            acc.key = 'tobeadded';
            return acc;
        }, {sum: 0, key: '', values: []});

        const writer = a => a.subscribe(b => console.log('sub subscribe', b));


        const sumr = (a: GroupedObservable<any, any>) => {
            // console.log('sumr', a);
            return a.reduce((x, y) => x + y, 0);
        };
        const assigner = (a, b) => {
            a['key'] = b['key'];
            return a;
        };

        // this.obsDateGenerator('01/01/2018', '5/05/2018')
        //     .pipe(op(costs, rev))
        //     // .do(console.log)
        //     .groupBy(a => moment(a['date']).dayOfYear())
        //     // .flatMap(a => a.toArray())
        //     // .subscribe((console.log));
        //     .subscribe(obs => obs.pipe(take(2), map(a => {
        //         return assigner(a, obs);
        //     })).subscribe(console.log));

    }

    // static  gapDates: ReplaySubject<any> = new ReplaySubject<any>('value of gapdates');

    /**
     *
     dayNo: d,
     month: moment(moDate).month() + 1,
     Year: moment(moDate).year(),
     qtr: moment(moDate).quarter(),
     weekNo: moment(moDate).isoWeek(),
     date: moDate.format('DD-MMM-YYYY'),
     */

    static computeVisitors(baseVisitorNo: number, monthno: number, isoWeekday: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
        return baseVisitorNo * weeklyVisitorBias[isoWeekday] * monthlyVisitorBias[monthno];
    }

    static callZip() {
        console.clear();
        // todo addin map cache

        this.fromDateObservable('01-08-2018', '06-28-2018', 'month')
            .map((a: DateSequent) => VisitorSequentFactory(a, 100))
            .map(a => computeFixedCosts(a))
            .map(a => computeVariableCosts(a))
            .map(a => computeSales(a))
            .subscribe(console.log);

        console.log('day', moment().get('day'));
    }

    static baseModel(from1: string = '01/01/2018', to: string = '04/01/2018',
                     gap: PeriodOfString = 'day'): Observable<CostSalesSequent> {
        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => VisitorSequentFactory(a, 100))
            .map(a => computeFixedCosts(a))
            .map(a => computeVariableCosts(a))
            .map(a => computeSales(a));
    }

}
