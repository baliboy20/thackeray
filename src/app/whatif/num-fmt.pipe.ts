import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'numFmt'
})
export class NumFmtPipe implements PipeTransform {

    transform(value: any, args?: any): number | string {

        if (isNaN(value)) {
            return value;
        }
        return Math.trunc(value * 100) / 100;
    }
}
