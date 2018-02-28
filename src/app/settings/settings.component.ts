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

    // private _tmpl;
    // @ViewChild('fart', {read: TemplateRef}) set tmpl(value: TemplateRef<any>) {
    //     console.log('value', value);
    //     this._tmpl = value;
    // }

    constructor(private service: VisitorService,
                public pop: MatDialog) {
        console.log('constructing');
    }

    assumptions: any;
    newAssumptions: FixedCostsImpl;

    addSettings() {
        const fc = new FixedCostsImpl();
        fc.configName = 'XXXX setting config';
        fc.lease = {amount: 0, dayDue: 0, frequency: 'q'};
        fc.rates = {amount: 0, dayDue: 0, frequency: 'q'};
        fc.rent = {amount: 0, dayDue: 0, frequency: 'q'};
        fc.serviceCharge = {amount: 0, dayDue: 0, frequency: 'q'};
return fc;
    }

    ngOnInit() {
        this.assumptions = this.service.getAssumptions();
    }

    openDialog() {
        const data = {mode: 'NEW_REC', data: this.addSettings()}
         const dialogRef = this.pop.open( SettingEditComponent, {data: data,
             height: '800px',
             disableClose: true,
             hasBackdrop: true});
         dialogRef.afterClosed()
             .subscribe((a) => console.log('after cloesed', a));
    }

}
