import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FixedCostsImpl, VisitorService} from '../generators/visitor/visitor.service';
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogRef} from '@angular/material';
import {SettingEditComponent} from './setting-edit/setting-edit.component';
import {ScrollStrategy} from '@angular/cdk/overlay';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],

})
export class SettingsComponent implements OnInit {


    constructor(private service: VisitorService,
                public pop: MatDialog) {
    }

    assumptions: any;
    newAssumptions: FixedCostsImpl[];

    addSettings() {
        const fc = new FixedCostsImpl();
        fc.configName = '==> [New Record] <===';
            fc.lease = {amount: 200, dayDue: 21, frequency: 'm'};
            fc.rates = {amount: 5000 / 4, dayDue: 21, frequency: 'q'};
            fc.rent = {amount: 30000 / 4, dayDue: 21, frequency: 'q'};
            fc.serviceCharge = {amount: 12000 / 4, dayDue: 21, frequency: 'q'};
return fc;
    }

    ngOnInit() {
        console.log('assumptes', this.service.getAssumptions());
        this.assumptions = this.service.getAssumptions();
    }

    openDialog() {
        const data = {mode: 'NEW_REC', data: this.addSettings()}
         const dialogRef = this.pop.open( SettingEditComponent, {data: data,
             height: '850px',
             disableClose: true,
             hasBackdrop: true});
         dialogRef.afterClosed()
             .subscribe((a) => {
                 if (a === undefined) {
                     return;
                 } else if (a.mode === 'NEW_REC') {
                     this.assumptions.push(a.data);
                 }
                 this.service.setAssuptions(this.assumptions);
             });
    }

}
