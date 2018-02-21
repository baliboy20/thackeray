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
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/zipAll';
import 'rxjs/add/operator/take';
import {interval} from 'rxjs/observable/interval';
import * as moment from 'moment';
import {Duration, Moment} from 'moment';
import {flatMap} from 'tslint/lib/utils';
import {zipAll} from 'rxjs/operator/zipAll';
import {Observer} from 'rxjs/Observer';
import {merge} from 'rxjs/operator/merge';
import {mergeAll} from 'rxjs/operator/mergeAll';
import {concat} from 'rxjs/operator/concat';

// import {let} from 'rxjs/operators';

@Injectable()
export class VisitorService {

    basePeriod = new Date('01/31/2018');
    baseVisitorNo = 100;

    constructor() {
    }

    getForecast(from1: Date, to: Date, interval1: string, forecastmodel: any) {
        return ForecastModelBasic.callZip();
    }

}

type PeriodOfString = 'day' | ' week' | 'month' | 'quarter' | 'biannual' | 'year';

interface Dayts {
    date: string;
    dateBucket: PeriodOfString;
    dayNo: number;
}

export class ForecastModelBasic {


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
        return -(moment(date).quarter() * 1000 + dayOfYr);
    }

    static obsDateGenerator(from1: string = '01/01/2018', to: string = '04/01/2018',
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

    static zzMergeAll() {
        const costs = (a) => Observable.of(this._varCosts(a.date)).map(b => ({date: a.date, value: b, label: 'costs'}));
        const rev = (a) => Observable.of(this._varRevs(a.date)).map(b => ({date: a.date, value: b, label: 'revenue'}));

        // this.obsDateGenerator().pipe(map(costs), flatMap((x)=>x),).subscribe(console.log);
    }

    static callZip() {
        this._dateGen();
    }
}
