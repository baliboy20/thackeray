import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

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
import * as moment from 'moment';
import {Observer} from 'rxjs/Observer';
import {error} from 'util';
import {reduce} from 'rxjs/operators';

// import {let} from 'rxjs/operators';

@Injectable()
export class VisitorService {

    basePeriod = new Date('01/31/2018');
    baseVisitorNo = 100;

    constructor() {
    }

    getForecast(from1: string, to: string, interval1: string, forecastmodel?: any) {
        return ForecastModelBasic.baseModel(from1, to, interval1);
    }

    getForecastGrouped(from1: string, to: string, interval1: string, forecastmodel?: any) {
        return ForecastModelBasic.baseModelGrouped(from1, to, interval1);
    }

}

/**
 *                          INTERFACES
 */
interface Dayts {
    date: string;
    dateBucket: string;
    dayNo: number;
}

export interface CostSalesSequent extends VisitorSequent {
    fixedCosts: number;
    variableCosts: number;
    netSales: number;
    vatOnSales: number;
    totalCosts: number;
    profit: number;
    cashflow: number;
    cumVat: number;
    cumProfit: number;
    cumCosts: number;
    cumTotalCosts: number;
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
    trades: number;
    tradeBase: number;
}

const VisitorSequentFactory: (ds: DateSequent, tradeBase) => VisitorSequent = (ds: DateSequent) =>
    ({
        dayNo: ds.dayNo,
        month: ds.month,
        year: ds.year,
        qtr: ds.qtr,
        weekNo: ds.weekNo,
        date: ds.date,
        tradeBase: OperatingCosts.tradesBase,
        trades: computeVisitors(ds.month, ds.isoWeekday, OperatingCosts.tradesBase),
        isoWeekday: ds.isoWeekday
    } as VisitorSequent);

const computeVisitors = (month, isoWeekday, trades) => {
    const tr = +(trades * monthlyVisitorBias[month] * weeklyVisitorBias[isoWeekday]);
    return tr;
};

// const format2Decimals = (value) => value.toFixed(2);
export class FixedCostsImpl implements FixedCosts {
    configName = 'default';
    serviceCharge: { amount: 300, frequency: 'q', dayDue: 30 };
    rent = { amount: 300, frequency: 'q', dayDue: 30 };
    rates = { amount: 300, frequency: 'q', dayDue: 30 };
    lease = { amount: 300, frequency: 'q', dayDue: 30 };
}

export interface FixedCosts {
    configName: string;
    serviceCharge: {
        amount: number,
        frequency: string, // due on
        dayDue: number,
    };
    rent: {amount: number, frequency: string, dayDue: number};
    rates: {amount: number, frequency: string, dayDue: number};
    lease: {amount: number, frequency: string, dayDue: number};
}

export class StoreLocalSettings {
    static settingName = 'thackSettings';
    save(value: any[]) {
        const str = JSON.stringify(value);
        window.localStorage.setItem(StoreLocalSettings.settingName, str);
    }
    retrieve(key) {
        const data = window.localStorage.getItem(StoreLocalSettings.settingName);
        return JSON.parse(data);
    }
}


const computeFixedCosts: (arg: VisitorSequent) => CostSalesSequent = (arg: VisitorSequent) => {
    const v: number[] = [3, 6, 9, 12];
    const fc: CostSalesSequent = arg as CostSalesSequent;
    const ohds = (v.includes(arg.month) && moment(arg.date).format('D') === '1') ? OperatingCosts.serviceCharge : 0;
    const rent = moment(arg.date).format('D') === '1' ? OperatingCosts.rent : 0;
    const staff = OperatingCosts.staffPerDay;
    fc.fixedCosts = +(ohds + staff + rent).toPrecision(2);
    fc.cumVat = 0;
    fc.cumProfit = 0;
    fc.cashflow = 0;
    fc.cumCosts = 0;
    fc.profit = 0;
    return fc;
};

const computeVariableCosts: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
    a.variableCosts = +((a as VisitorSequent).trades *
        OperatingCosts.averageSale * .33);
    return a;
};

const computeTotalCosts: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
    a.totalCosts = +(a.variableCosts + a.fixedCosts);
    a.profit = a.netSales - a.totalCosts;
    return a;
};

const computeCumTotals: (a: CostSalesSequent, b: CostSalesSequent, i: number) => CostSalesSequent =
    (prev: CostSalesSequent, curr: CostSalesSequent, idx: number) => {

        if (idx === 0) {
            prev.cumProfit = prev.profit;
            curr.cumProfit = prev.profit + curr.profit;
            prev.cumVat = prev.vatOnSales;
            curr.cumVat = prev.vatOnSales + curr.vatOnSales;
            curr.cumTotalCosts = curr.totalCosts;
            prev.cumTotalCosts = prev.totalCosts;
            curr.cumTotalCosts = prev.cumTotalCosts + curr.totalCosts;
            console.log('cum pr', curr.cumProfit);
        } else {
            curr.cumProfit = prev.cumProfit + curr.profit;
            curr.cumVat = prev.cumVat + curr.vatOnSales;
            curr.cumTotalCosts = prev.cumTotalCosts + curr.totalCosts;
        }
        return curr;
    };

const computeNetSales: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
    a.netSales = (a as VisitorSequent).trades *
        OperatingCosts.averageSale;
    a.vatOnSales = (a as VisitorSequent).trades *
        OperatingCosts.averageSale * .2;
    // console.log("xxxii", OperatingCosts.averageSale, a.trades);
    return a;
};

// Grouped computes
const computeGroupedValues = (key) => {
    return reduce((acc: CostSalesSequent, curr: CostSalesSequent, idx) => {
        if (idx === 0) {
            acc.trades = 0;
            acc.profit = 0;
            acc.vatOnSales = 0;
            acc.variableCosts = 0;
            acc.vatOnSales = 0;
            acc.netSales = 0;
        } else {
            acc.trades += curr.trades;
            acc.profit += curr.profit;
            acc.vatOnSales += curr.vatOnSales;
            acc.variableCosts += curr.variableCosts;
            acc.netSales += curr.netSales;
        }
        acc.date = key;
        return acc;
    }, {} as CostSalesSequent);
};

const monthlyVisitorBias = {
    '1': .8,
    '2': 1,
    '3': 1.02,  // mar
    '4': 1.03,
    '5': 1.04,
    '6': 1.1,
    '7': 1.2,   // jul
    '8': 1.1,
    '9': 1.1,   // sep
    '10': 1,
    '11': 1,
    '12': .7    // dec
};

const weeklyVisitorBias = {
    '1': 1, // su
    '2': .5, // mo
    '3': .8, // tu
    '4': 1.2,  // w
    '5': 1.5,  // th
    '6': 1.5, // f
    '7': 1.8, // sa
};

const OperatingCosts = {
    staffPerDay: 200,
    tradesBase: 210,
    rent: 30000 / 12,
    averageSale: 2.2,
    serviceCharge: 3000 // per quarter
};

export class ForecastModelBasic {


    private static _varCosts(date: string): number {
        const dayOfYr = moment(date).diff('2018-01-01', 'days');
        return moment(date).quarter() * 1000 + dayOfYr;
    }

    private static _varRevs(date: string): number {
        const dayOfYr = moment(date).diff('2018-01-01', 'days');
        return -(moment(date).quarter() * 1004 + dayOfYr);
    }

    static fromDateObservable(from1: string = '01/01/2018', to: string = '04/01/2018',
                              gap: string = 'day'): Observable<DateSequent> {
        return Observable.create((observer: Observer<Dayts>) => {
                let d = 0;
                let moDate = moment(from1);

                while (moDate.isSameOrBefore(to)) {

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
                    moDate = moment(from1).add(d, 'd');
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
     * @param {string} bucket
     * @returns {Observable<number>}
     */
    static observableVistorGenerator(from1: string = '01/01/2018', to: string = '04/01/2018',
                                     bucket: string = 'day'): Observable<number> {
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
     dayNo: d,
     month: moment(moDate).month() + 1,
     Year: moment(moDate).year(),
     qtr: moment(moDate).quarter(),
     weekNo: moment(moDate).isoWeek(),
     date: moDate.format('DD-MMM-YYYY'),
     */

    static computeVisitors(baseVisitorNo: number, monthno: number, isoWeekday: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
        return (baseVisitorNo * weeklyVisitorBias[isoWeekday] * monthlyVisitorBias[monthno]).toPrecision(2);
    }

    static baseModel(from1: string = '02/01/2018', to: string = '26/01/2018',
                     gap: string = 'day'): Observable<CostSalesSequent> {
        console.log('baseModel s', from1, to, gap);
        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => VisitorSequentFactory(a, 100))
            .map(a => computeFixedCosts(a))
            .map(a => computeVariableCosts(a))
            .map(a => computeFixedCosts(a))
            .map(a => computeNetSales(a))
            .map(a => computeTotalCosts(a))
            .scan(computeCumTotals);
    }

    static baseModelGrouped(from1: string = '01/01/2018', to: string = '04/01/2018',
                            gap: string = 'day'): Observable<any> {
        console.log('baseModelGrouped', from1, to, gap);
        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => VisitorSequentFactory(a, 100))
            .map(a => computeFixedCosts(a))
            .map(a => computeVariableCosts(a))
            .map(a => computeFixedCosts(a))
            .map(a => computeNetSales(a))
            .map(a => computeTotalCosts(a))
            .scan(computeCumTotals)
            // .groupBy(a => moment(a).week())
            .groupBy(a => computeGroupOnPeriod(a, gap))
            .flatMap(a => from(a).pipe(computeGroupedValues(a.key)));
        // .do(a => console.log(a));
    }
}

const computeGroupOnPeriod = (a: any, b: string) => {
    let retval;
    if (b === 'year') {
        retval = moment(a.date).format('YYYY');
    } else if (b === 'day') {
        retval = a.dayNo;
    } else if (b === 'month') {
        retval = moment(a.date).format('MMMYY');
    } else if (b === 'quarter') {
        retval = a.qtr;
    } else if (b === 'week') {
        retval = a.weekNo;
    } else {
        throw error('Group period is not set');
    }
   // console.log('the computer group period is', retval, a);
    return retval;
};

/***
 * month: moment(moDate).month() + 1,
 year: moment(moDate).year(),
 qtr: moment(moDate).quarter(),
 weekNo: moment(moDate).isoWeek(),
 isoWeekday: moment(moDate).isoWeekday(),
 date: moDate.format('DD-MMM-YYYY'),
 */

