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
import {scan} from 'rxjs/operator/scan';
import {of} from 'rxjs/observable/of';


/**                 ************
 *                  CLASS VisitorService
 *
 */
@Injectable()
export class VisitorService {
    public static testval = 144;
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

    getAssumptions() {
        return StoreLocalSettings.retrieve();
    }

    setAssuptions(assumps: any) {
        console.log('assumptions have been srt', assumps);
        StoreLocalSettings.save(assumps);

    }
}

/**                         *********
 *                          INTERFACES
 */


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
    cumTotalSales: number;
}

export interface DateSequent {
    dateBucket: string;
    dayNo: number;
    month: number;
    year: number;
    qtr: number;
    weekNo: number;
    date: string;
    isoWeekday: number;
}

export interface VisitorSequent extends DateSequent {
    trades: number;
    tradeBase: number;
}

/**                         *********
 *                          CONSTANTS
 */
// @Deprecated
export const VisitorSequentFactory: (ds: DateSequent, tradeBase) => VisitorSequent = (ds: DateSequent) =>
    ({
        dayNo: ds.dayNo,
        month: ds.month,
        year: ds.year,
        qtr: ds.qtr,
        weekNo: ds.weekNo,
        date: ds.date,
        tradeBase: OPERATING_COSTS.tradesBase,
        trades: computeVisitors(ds.month, ds.isoWeekday, OPERATING_COSTS.tradesBase),
        isoWeekday: ds.isoWeekday
    } as VisitorSequent);

// @Deprecated
export const computeVisitors = (month, isoWeekday, trades) => {
    const tr = +(trades * MONTHLY_VISITOR_BIAS[month] * WEEKLY_VISITOR_BIAS[isoWeekday]);
    return tr;
};

const aa = 'kkk';


export interface FixedCosts {
    configName: string;
    serviceCharge: { amount: number, frequency: string, dayDue: number };
    rent: { amount: number, frequency: string, dayDue: number };
    rates: { amount: number, frequency: string, dayDue: number };
    lease: { amount: number, frequency: string, dayDue: number };
}

// @Deprecated
const computeFixedCosts: (arg: VisitorSequent) => CostSalesSequent = (arg: VisitorSequent) => {
    const f = ForecastModelBasic.dec2;
    const v: number[] = [3, 6, 9, 12];
    const fc: CostSalesSequent = arg as CostSalesSequent;
    const ohds = (v.includes(arg.month) && moment(arg.date).format('D') === '1') ? OPERATING_COSTS.serviceCharge : 0;
    const rent = moment(arg.date).format('D') === '1' ? OPERATING_COSTS.rent : 0;
    const staff = OPERATING_COSTS.staffPerDay;
    fc.fixedCosts = +(ohds + staff + rent).toPrecision(2);
    fc.cumVat = 0;
    fc.cumProfit = 0;
    fc.cashflow = 0;
    fc.cumCosts = 0;
    fc.profit = 0;
    return fc;
};

// const computeVariableCosts: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
//     if(a) throw new Error('const computeVariableCosts: old program');
//     a.variableCosts = +((a as VisitorSequent).trades *
//         OPERATING_COSTS.averageSale * .33);
//     return a;
// };

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
        OPERATING_COSTS.averageSale;
    a.vatOnSales = (a as VisitorSequent).trades *
        OPERATING_COSTS.averageSale * .2;
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

export interface MonthlyVisitorBias {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
    '7': number;
    '8': number;
    '9': number;
    '10': number;
    '11': number;
    '12': number;
}

const MONTHLY_VISITOR_BIAS = {
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

export interface WeeklyVisitorBias {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
}

const WEEKLY_VISITOR_BIAS = {
    '1': 1, // su
    '2': .5, // mo
    '3': .8, // tu
    '4': 1.2,  // w
    '5': 1.5,  // th
    '6': 1.5, // f
    '7': 1.8, // sa
};

export interface OperatingCosts {
    staffPerDay: number,
    tradesBase: number,
    rent: number,
    averageSale: number,
    serviceCharge: number
}

export const OPERATING_COSTS = {
    staffPerDay: 200,
    tradesBase: 210,
    rent: 30000 / 12,
    averageSale: 2.2,
    serviceCharge: 3000 // per quarter
};

export const computeGroupOnPeriod = (a: any, b: string) => {
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

/**             **********
 *              FixedCostsImpl
 *
 *
 */
export class FixedCostsImpl implements FixedCosts {
    configName = 'defaultSettings';
    serviceCharge = {amount: 300, frequency: 'q', dayDue: 30};
    rent = {amount: 300, frequency: 'q', dayDue: 30};
    rates = {amount: 300, frequency: 'q', dayDue: 30};
    lease = {amount: 300, frequency: 'q', dayDue: 30};
}

/**             **********
 *              CLASS LOCAL STOARAGE
 *
 *
 */
export class StoreLocalSettings {
    static settingName = 'thackSettings';

    static save(value: any[]) {
        const str = JSON.stringify(value);
        window.localStorage.setItem(StoreLocalSettings.settingName, str);
    }

    static retrieve() {

        const data = window.localStorage.getItem(StoreLocalSettings.settingName);
        const dat = data === null ? new FixedCostsImpl() : JSON.parse(data);
        return dat;
    }
}

/**                 ************************************************************************************************************************
 *                  CLASS ForecastModelBasic
 *                  ************************************************************************************************************************
 */
export class ForecastModelBasic {

    static computeGroupedValues = (key) => {
        const seed = {
            trades: 0,
            profit: 0,
            vatOnSales: 0,
            variableCosts: 0,
            netSales: 0
        };

        return reduce((acc: CostSalesSequent, curr: CostSalesSequent, idx) => {
                acc.trades += curr.trades;
                acc.profit += curr.profit;
                acc.vatOnSales += curr.vatOnSales;
                acc.variableCosts += curr.variableCosts;
                acc.netSales += curr.netSales;
            acc.date = key;
            return acc;
        }, seed );
    };

    private static _varCosts(date: string): number {
        const dayOfYr = moment(date).diff('2018-01-01', 'days');
        return moment(date).quarter() * 1000 + dayOfYr;
    }

    static computeTotalCosts: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
        a.totalCosts = a.variableCosts + a.fixedCosts;
        a.profit = a.netSales - a.totalCosts;
        return a;
    };
    /** */
    static computeGroupOnPeriod = (a: any, b: string) => {
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
    /** */
    static computeCumTotals: (a: CostSalesSequent, b: CostSalesSequent, i: number) => CostSalesSequent =
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

    /***
     * the accumilator holds ont the running/ cumilative totals updateds the current object and moves on
     * */
    static computeRunningTotals() {
        // static computeRunningTotals (a: Observable<CostSalesSequent>, seed = {cumProfit: 0, profit: 0, cumTotalCosts: 0,  cumVat: 0, cumTotalSales: 0 }) {

        const computer = (acc: CostSalesSequent, curr: CostSalesSequent) => {
            curr.profit = curr.totalCosts; // curr.netSales; // -
            // holding on
            acc.cumTotalCosts += curr.totalCosts;
            acc.cumTotalSales += curr.netSales;
            acc.cumProfit += curr.profit;
            // cpy into current
            curr.cumTotalCosts = acc.cumTotalCosts;
            curr.cumTotalSales = acc.cumTotalSales;
            curr.cumProfit = acc.cumProfit;
            return curr;
        };
        const seed = {cumProfit: 0, profit: 0, cumTotalCosts: 0, cumVat: 0, cumTotalSales: 0};
        // const [run, seedr] = [computer, seed];
        return [computer, seed];
    };

    /** */
    static computeFixedCosts(arg: DateSequent, fco: FixedCosts) {
        const dec2 = ForecastModelBasic.dec2;
        const v: number[] = [4, 7, 10, 1];

        const fc: CostSalesSequent = arg as CostSalesSequent;
        let compCost = 0;
        const isDue = (arg1: VisitorSequent, v1: number[],
                       props: { amount: number, frequency: string, dayDue: number }) => {
            if (props.frequency === 'q') {
                if (v.includes(arg1.month) && moment(arg1.date).format('D') === '1') {
                    compCost += props.amount;
                }
            } else if (props.frequency === 'm') {
                if (moment(arg1.date).format('D') === '1') {
                    compCost += props.amount;
                }

            } else if (props.frequency === 'y') {
                if (arg1.month === 1 && moment(arg1.date).format('D') === '1') {
                    compCost += props.amount;
                }

            } else if (props.frequency === 'w') {
                if (arg1.dayNo === 5) {
                    compCost += props.amount;
                }

            } else {
                throw new Error('period not known for prperty');
            }
        };

        isDue(fc, v, fco.rates);
        isDue(fc, v, fco.lease);
        isDue(fc, v, fco.rent);
        isDue(fc, v, fco.serviceCharge);
        fc.fixedCosts = compCost;
        return fc;
    };

    /** */
    static computeVariableCosts: (a: CostSalesSequent) => CostSalesSequent = (a: CostSalesSequent) => {
        a.variableCosts = +((a as VisitorSequent).trades *
            OPERATING_COSTS.averageSale * .33);
        return a;
    };

    /** */
    public static dec2(value: number): number {
        return Math.trunc(value * 100) / 100;
    }

    private static _varRevs(date: string): number {
        const dayOfYr = moment(date).diff('2018-01-01', 'days');
        return -(moment(date).quarter() * 1004 + dayOfYr);
    }

    static fromDateObservable(from1: string = '01/01/2018', to: string = '04/14/2018',
                              gap: string = 'day'): Observable<DateSequent> {
        return Observable.create((observer: Observer<any>) => {
                let d = 1;
                let moDate = moment(from1);

                while (moDate.isSameOrBefore(to)) {
                    const v: DateSequent = {
                        dateBucket: gap,
                        dayNo: d,                        //count of days in the series
                        month: moment(moDate).month() + 1,
                        year: moment(moDate).year(),
                        qtr: moment(moDate).quarter(),
                        weekNo: moment(moDate).isoWeek(),
                        isoWeekday: moment(moDate).isoWeekday(),
                        date: moDate.format('DD-MMM-YYYY'),
                    };
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
     */
    static observableVistorGenerator(from1: string = '01/01/2018', to: string = '04/01/2018',
                                     bucket: string = 'day'): Observable<number> {

        return Observable.create((observer: Observer<any>) => {
                let frm = from1;
                let dayno = 0;
                while (moment(frm).isSameOrBefore(to)) {
                    frm = moment(from1).add(dayno, 'd').toISOString();
                    const v: any = {
                        dateBucket: bucket,
                        dayNo: dayno,
                        date: frm,
                    } as any;
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

    /** */
    static computeNetSales: (a: CostSalesSequent, averageSale: number) => CostSalesSequent = (a: CostSalesSequent, averageSale: number) => {
        a.netSales = (a as VisitorSequent).trades *
            averageSale;
        a.vatOnSales = (a as VisitorSequent).trades *
            averageSale * .2;
        // console.log("xxxii", OperatingCosts.averageSale, a.trades);
        return a;
    };

    /**                        *********
     *                          VisitorSequentFactory1
     */
    static visitorSequentFactory1(ds: DateSequent, tradeBase,
                                  weeklyVisitorBias1: WeeklyVisitorBias,
                                  mvb: MonthlyVisitorBias): VisitorSequent {

        const f = ForecastModelBasic;
        const calcTrades = f.dec2(tradeBase * weeklyVisitorBias1[ds.isoWeekday] * mvb[ds.month]);
        // console.log('ds', ds);
        // console.log('CAlc trades: ', calcTrades, weeklyVisitorBias1[ds.isoWeekday], mvb[ds.month], '\n');

        return ({
            dayNo: ds.dayNo,
            month: ds.month,
            year: ds.year,
            qtr: ds.qtr,
            weekNo: ds.weekNo,
            date: ds.date,
            tradeBase: tradeBase,
            trades: calcTrades,
            isoWeekday: ds.isoWeekday
        } as VisitorSequent);
    }

    /** */
    static baseModel(from1: string = '02/01/2018', to: string = '26/01/2018',
                     gap: string = 'day'): Observable<CostSalesSequent> {
        const fc = ForecastModelBasic;
        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => VisitorSequentFactory(a, 100))
            .map(a => computeFixedCosts(a))
            .map(a => fc.computeVariableCosts(a))
            .map(a => computeFixedCosts(a))
            .map(a => computeNetSales(a))
            .map(a => computeTotalCosts(a))
            .scan(computeCumTotals);
    }

    static baseModelGrouped(from1: string = '01/01/2018', to: string = '04/01/2018',
                            gap: string = 'day'): Observable<any> {
        // console.log('baseModelGrouped', from1, to, gap);
        const fc = ForecastModelBasic;
        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => VisitorSequentFactory(a, 100))
            .map(a => computeFixedCosts(a))
            .map(a => fc.computeVariableCosts(a))
            .map(a => computeFixedCosts(a))
            .map(a => computeNetSales(a))
            .map(a => computeTotalCosts(a))
            .scan(computeCumTotals)
            // .groupBy(a => moment(a).week())
            .groupBy(a => computeGroupOnPeriod(a, gap))
            .flatMap(a => from(a).pipe(computeGroupedValues(a.key)));
        // .do(a => console.log(a));
    }


    static computeCumTotals_1: (a: CostSalesSequent, b: CostSalesSequent, i: number) => CostSalesSequent =
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

    static groupByFactory(): CostSalesSequent {
        const ini: CostSalesSequent =
            {
                date: null,
                trades: 0,
                fixedCosts: 0,
                variableCosts: 0,
                netSales: 0,
                vatOnSales: 0,
                totalCosts: 0,
                profit: 0,
                cashflow: 0,
                cumVat: 0,
                cumProfit: 0,
                cumCosts: 0,
                cumTotalCosts: 0,
            } as CostSalesSequent;
        return ini;
    }

    static aggByGroup(a, key, init) {
        const ini = init;
        // scan();
    }

    static baseModelGrouped1(from1: string = '01/01/2018', to: string = '04/01/2018',
                             gap: string = 'day', pWvb: WeeklyVisitorBias, pMvb: MonthlyVisitorBias,
                             pOc?: FixedCosts): void {
        console.log('running thru basemodelBrouped1');
        const f = ForecastModelBasic;
        const wvb = pWvb;
        const mvb = pMvb;
        const oc = pOc;
        const avSell = 2.2;
        const [computer, seed] = f.computeRunningTotals() as [any, any];
        this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => f.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => f.computeFixedCosts(a, oc))
            .map(a => f.computeVariableCosts(a))
            //.map(a => computeFixedCosts(a))
            .map(a => f.computeNetSales(a, avSell))
            .scan(computer, seed)
            // .scan(computeCumTotals)   // todo implenment this after grouby
            .groupBy(a => computeGroupOnPeriod(a, gap))

            .flatMap(a => from(a).pipe(computeGroupedValues(a.key)))
            .do(a => console.log('GROUPED', a)).subscribe(a => a);
    }

}

/**
 Date
 Transactions       | trades
 Fixed Costs        | fixedCosts: number;
 Variable Costs     | variableCosts
 TotalCosts         | totalCosts
 Net Sales          | netSales
 Profit             | profit
 cum. Profit        |cumProfit: number;
 cum. Total Costs   | cumCosts: number;

 Vat                |vatOnSales: number;
 cum. Vat           |cumVat:



 */

/*

300g - 30p
2tsp 1p
1tsp powder 2p
soda 2p
400ml powder milk 40 : 12p
oil :20
62


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
 */

/*
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

export interface DateSequent {
    dayNo: number;
    month: number;
    year: number;
    qtr: number;
    weekNo: number;
    date: string;
    isoWeekday: string;
}

export interface VisitorSequent extends DateSequent {
    trades: number;
    tradeBase: number;
}
 */
