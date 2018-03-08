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
 *                  assumption are fixed costs
 *                  biases for visitors
 *                  persist to cache
 *                  getCurrent is the cfg data presently being used
 *
 */
@Injectable()
export class VisitorService {
    public static testval = 144;
    basePeriod = new Date('01/31/2018');
    baseVisitorNo = 100;

    constructor() {
    }

    key = {
        MONTHLY_VISITOR_BIAS: 'MonthlyVisitorBias',
        WEEKLY_VISITOR_BIAS: 'WeeklyVisitorBias',
        ASSUMPTIONS: 'thackSettings',
        OPERATING_COSTS: 'operatingCosts'
    };

    getForecast(from1: string, to: string, interval1: string, forecastmodel?: any) {
        return ForecastModelBasic.baseModel(from1, to, interval1);
    }

    /** Actual forecast */
    getForecastGrouped(from1: string, to: string, gap: string, forecastmodel?: any) {
        return ForecastModelBasic.baseModelGrouped(from1, to, gap);
    }

    retrieveAssumptions() {
        const key = 'thackSettings';
        return StoreLocalSettings.retrieve(key);
    }

    retrieveOperationgCosts() {
        return StoreLocalSettings.retrieve(this.key.OPERATING_COSTS);
    }

    retrieveTemporalBiases(): [MonthlyVisitorBias[], WeeklyVisitorBias[]] {

        return [StoreLocalSettings.retrieve(this.key.MONTHLY_VISITOR_BIAS),
            StoreLocalSettings.retrieve(this.key.WEEKLY_VISITOR_BIAS)];
    };

    persistAssumptions(assumps: any) {
        StoreLocalSettings.save(assumps, this.key.ASSUMPTIONS);
    }

    getCurrentOperatingCosts() {
        return ForecastModelBasic.operatingCosts;
    }

    getCurrentBiases(): [MonthlyVisitorBias, WeeklyVisitorBias] {
        return [ForecastModelBasic.monthlyVisitorBias, ForecastModelBasic.weeklyVisitorBias];
    }

    getCurrentAssumptions() {
        return ForecastModelBasic.fixedCostAssumptions;
    }

    applyAssumption(assum) {
        ForecastModelBasic.fixedCostAssumptions = (assum);
    }

    applyCurrentBiases(value: [MonthlyVisitorBias, WeeklyVisitorBias]) {
        ForecastModelBasic.monthlyVisitorBias = value[0];
        // ForecastModelBasic.weeklyVisitorBias = value[1];
    }

    applyCurrentWeeklyBias(value: WeeklyVisitorBias) {
        ForecastModelBasic.weeklyVisitorBias = value;

    }

    applyCurrentMonthlyBias(value: MonthlyVisitorBias) {
        ForecastModelBasic.monthlyVisitorBias = value;

    }

    applyOperatingCosts(value: OperatingCosts) {
        ForecastModelBasic.operatingCosts = value;

    }


    persistWeekyBias(values: WeeklyVisitorBias[]) {
        StoreLocalSettings.save(values, this.key.WEEKLY_VISITOR_BIAS);
    }

    persistMonthlyBias(values: WeeklyVisitorBias[]) {
        console.log('persist monthly bias', values);
        StoreLocalSettings.save(values, this.key.MONTHLY_VISITOR_BIAS);
    }

    persistOperatingCosts(value) {
        StoreLocalSettings.save(value, this.key.OPERATING_COSTS);
    }

    test(value){
        console.log('ZS called', value);
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

export interface FixedCosts {
    configName: string;
    description: string;
    serviceCharge: { amount: number, frequency: string, dayDue: number };
    rent: { amount: number, frequency: string, dayDue: number };
    rates: { amount: number, frequency: string, dayDue: number };
    lease: { amount: number, frequency: string, dayDue: number };
}


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
            // console.log('cum pr', curr.cumProfit);
        } else {
            curr.cumProfit = prev.cumProfit + curr.profit;
            curr.cumVat = prev.cumVat + curr.vatOnSales;
            curr.cumTotalCosts = prev.cumTotalCosts + curr.totalCosts;
        }
        return curr;
    };

export interface MonthlyVisitorBias {
    description: string;
    name: string;
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

export const MONTHLY_VISITOR_BIAS: MonthlyVisitorBias = {
    description: 'Default config',
    name: 'DEFAULT',
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
    description: string;
    name: string;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
}

export const WEEKLY_VISITOR_BIAS: WeeklyVisitorBias = {
    description: 'Default config',
    name: 'DEFAULT',
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
    // rent: number,
    averageSale: number,
    // serviceCharge: number
}

export const OPERATING_COSTS = {
    name: 'Default Operating cost',
    description: 'initial values',
    staffPerDay: 200,
    tradesBase: 210,
    // rent: 30000 / 12,
    averageSale: 2.2,
    // serviceCharge: 3000 // per quarter
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

/**             **************
 *              FixedCostsImpl
 *
 *
 */
export class FixedCostsImpl implements FixedCosts {
    configName = 'defaultSettings';
    description = 'Default Settings';
    serviceCharge = {amount: 14000 / 12, frequency: 'q', dayDue: 30};
    rent = {amount: 30000 / 12, frequency: 'q', dayDue: 30};
    rates = {amount: 5000 / 12, frequency: 'q', dayDue: 30};
    lease = {amount: 200, frequency: 'q', dayDue: 30};
}

/**             ********************
 *              CLASS LOCAL STOARAGE
 *
 *
 */
export class StoreLocalSettings {
    static settingName = 'thackSettings';

    static save(value: any[], key: string) {
        const str = JSON.stringify(value);
        window.localStorage.setItem(key, str);
    }

    static retrieve(key: string) {

        const data = window.localStorage.getItem(key);
        const dat = JSON.parse(data);
        return dat;
    }
}

/**        ************************************************************************************************************************
 *          CLASS ForecastModelBasic
 *         ************************************************************************************************************************
 */
export class ForecastModelBasic {
    static weeklyVisitorBias: WeeklyVisitorBias = WEEKLY_VISITOR_BIAS;
    static monthlyVisitorBias: MonthlyVisitorBias = MONTHLY_VISITOR_BIAS;
    static operatingCosts: OperatingCosts = OPERATING_COSTS;
    static _fixedCostAssumptions: FixedCosts = new FixedCostsImpl() as FixedCosts;

    static set fixedCostAssumptions(value) {
        this._fixedCostAssumptions = value;
    }

    static get fixedCostAssumptions() {
        return this._fixedCostAssumptions;
    }

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
        }, seed);
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
                // console.log('cum pr', curr.cumProfit);
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
    static computeRunningTotals(prev: CostSalesSequent, curr: CostSalesSequent, idx) {

        if (idx === 0) {
            prev.cumProfit = prev.profit;
            prev.cumTotalSales = prev.netSales;
            prev.cumVat = prev.vatOnSales;
            prev.cumTotalCosts = prev.totalCosts;

            curr.cumProfit = curr.profit;
            curr.cumVat = curr.vatOnSales;
            curr.cumTotalCosts = curr.totalCosts;
            curr.cumTotalSales = curr.netSales;
            console.log('cum pr', curr.cumProfit);
        } else {
            curr.cumProfit = prev.cumProfit + curr.profit;
            curr.cumVat = prev.cumVat + curr.vatOnSales;
            curr.cumTotalCosts = prev.cumTotalCosts + curr.totalCosts;
            curr.cumTotalSales = prev.cumTotalSales + curr.netSales;
        }
        return curr;
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
        a.variableCosts = ((a as VisitorSequent).trades *
            OPERATING_COSTS.averageSale * .33 + OPERATING_COSTS.staffPerDay);
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
        const fixc = this.fixedCostAssumptions;
        const wvb = fc.weeklyVisitorBias;
        const mvb = fc.monthlyVisitorBias;

        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeFixedCosts(a, fixc))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeNetSales(a, 2.2))
            .map(a => fc.computeTotalCosts(a))
            .scan(fc.computeRunningTotals);
    }

    static baseModelGrouped(from1: string = '01/01/2018', to: string = '04/01/2018',
                            gap: string = 'day'): Observable<any> {
        const fc = ForecastModelBasic;

        const fixc = new FixedCostsImpl();
        const wvb = fc.weeklyVisitorBias;
        const mvb = fc.monthlyVisitorBias;

        return this.fromDateObservable(from1, to, gap)
            .map((a: DateSequent) => ForecastModelBasic.visitorSequentFactory1(a, 100, wvb, mvb))
            .map(a => (a as CostSalesSequent))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeFixedCosts(a, fixc))
            .map(a => fc.computeVariableCosts(a))
            .map(a => fc.computeNetSales(a, 2.2))
            .map(a => fc.computeTotalCosts(a))
            .scan(fc.computeRunningTotals)
            .groupBy(a => fc.computeGroupOnPeriod(a, gap))
            .flatMap(a => from(a).pipe(fc.computeGroupedValues(a.key)));
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
                // console.log('cum pr', curr.cumProfit);
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
}

