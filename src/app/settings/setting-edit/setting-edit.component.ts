import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FixedCostsImpl} from '../../generators/visitor/visitor.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScrollStrategy} from '@angular/cdk/overlay';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-setting-edit',
    templateUrl: './setting-edit.component.html',
    styleUrls: ['./setting-edit.component.scss']
})
export class SettingEditComponent implements OnInit {
    assumptions: FixedCostsImpl;
    mode = 'NEW_REC';

    @ViewChild('fm1') set fm(value: NgForm) {
        value.statusChanges.subscribe(a => console.log(a));
    }

    // addSetting() {
    //     const fc = new FixedCostsImpl();
    //     fc.configName = '==> [New Record] <===';
    //     fc.lease = {amount: 200, dayDue: 21, frequency: 'm'};
    //     fc.rates = {amount: 5000 / 4, dayDue: 0, frequency: 'q'};
    //     fc.rent = {amount: 30000 / 4, dayDue: 0, frequency: 'q'};
    //     fc.serviceCharge = {amount: 12000 / 4, dayDue: 0, frequency: 'q'};
    //     this.assumptions = fc;
    //     return fc;
    // }

    constructor(private ref: MatDialogRef<SettingEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.assumptions = data.cfg;
        this.mode = data.mode;

    }

    protected onInvalid(e) { console.log('onInvalid event; ', e);}
    ngOnInit() {
    }

    onClose() {
        this.ref.close();
    }

    read(){
        return 'read';
    }

}
