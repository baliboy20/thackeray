import {Component, Inject, OnInit} from '@angular/core';
import {FixedCostsImpl} from '../../generators/visitor/visitor.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScrollStrategy} from '@angular/cdk/overlay';

@Component({
    selector: 'app-setting-edit',
    templateUrl: './setting-edit.component.html',
    styleUrls: ['./setting-edit.component.scss']
})
export class SettingEditComponent implements OnInit {
    assumptions: FixedCostsImpl;
    editstate = 'NEW_REC';

    addSetting() {
        const fc = new FixedCostsImpl();
        fc.configName = 'New Record';
        fc.lease = {amount: 0, dayDue: 0, frequency: 'q'};
        fc.rates = {amount: 0, dayDue: 0, frequency: 'q'};
        fc.rent = {amount: 0, dayDue: 0, frequency: 'q'};
        fc.serviceCharge = {amount: 0, dayDue: 0, frequency: 'q'};
        this.assumptions = fc;
        return fc;
    }

    constructor(private ref: MatDialogRef<SettingEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        // if (data.mode === 'NEW_REC') {
        //
        // } else {
        //
        // }
        this.assumptions = data.data;

    }

    ngOnInit() {
    }

    onClose() {
        this.ref.close();
    }

}
