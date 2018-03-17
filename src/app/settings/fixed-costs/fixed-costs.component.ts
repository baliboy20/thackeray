import {Component, OnInit} from '@angular/core';
import {isNull} from 'util';
import {FixedCosts, FixedCostsImpl, OPERATING_COSTS, OperatingCosts, VisitorService} from '../../generators/visitor/visitor.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDeleteDialogComponent} from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import {FixedCostEditComponent} from './fixed-cost-edit/fixed-cost-edit.component';

@Component({
    selector: 'app-fixed-costs',
    templateUrl: './fixed-costs.component.html',
    styleUrls: ['./fixed-costs.component.scss']
})
export class FixedCostsComponent implements OnInit {


    flds = [
        {label: 'Name', value: 'configName', children: null},
        {label: 'Description', value: 'description', children: null},
        {label: 'Service Charge', value: 'serviceCharge',children: [
                {label: 'Amount', value: 'amount'},
                {label: 'Frequency', value: 'frequency'},
                {label: 'Due', value: 'dayDue'}
            ]},
        {
            label: 'Rent', value: 'rent', children: [
                {label: 'Amount', value: 'amount'},
                {label: 'Frequency', value: 'frequency'},
                {label: 'Due', value: 'dayDue'}
            ]
        },
        {
            label: 'Rates', value: 'rates', children: [
                {label: 'Amount', value: 'amount'},
                {label: 'Frequency', value: 'frequency'},
                {label: 'Due', value: 'dayDue'}
            ]
        },
        {
            label: 'Leases', value: 'lease', children: [
                {label: 'Amount', value: 'amount'},
                {label: 'Frequency', value: 'frequency'},
                {label: 'Due', value: 'dayDue'}
            ]
        }
    ];

    fixedCosts: FixedCosts[] = [];

    a(o, fld1, fld2) {

        const res = o[fld1][fld2];
        // console.log(o, fld1, fld2, res);
        return res;
    }

    private editFixedcost: FixedCosts;
    private editState = 'EDIT_REC';

    constructor(private service: VisitorService,
                private dialog: MatDialog,
                private ref: MatDialogRef<any>,) {

    }

    ngOnInit() {

        const w = this.service.retrieveAssumptions();

        if (isNull(w) || w.length === 0) {
            this.fixedCosts.push(Object.assign({}, new FixedCostsImpl()));
        } else {
            this.fixedCosts = w;
        }
    }

    modelChange(event) {
        //???? this.service.applyOperatingCosts(this.fixedCosts);

    }


    /* open edit dialog to amend/creat recored*/
    onEditClicked(value, dup?: false) {
// console.log("STATUS", value, dup);
      let props = {};

        if (value === undefined) {
            let fc = new FixedCostsImpl();
            fc.configName = '==> [New Record] <===';
            fc.description = ''
             props = {mode: 'NEW_REC', cfg:fc};
        } else if(!dup){
            // console.log('EDIT PATH');
            const fc  =  Object.assign({}, value);
            props = {mode: 'EDIT_REC', cfg: value};

        } else {
            // console.log('DUPE PATH');
            const fc  =  Object.assign({}, value);
            props = {mode: 'DUP_REC', cfg: fc};
        }

        this.ref = this.dialog.open(FixedCostEditComponent, {data:props});
        this.ref.afterClosed().subscribe(a => {
            if (a === 'cancel') {
                return;
            } else {
                if (a.mode === 'NEW_REC' || a.mode === 'DUP_REC') {
                    this.fixedCosts.push(a.data);
                } else {
                   const id = this.fixedCosts.find(s=> s.configName === a.data.configName);
                }
                this.service.persistAssumptions(this.fixedCosts);
            }
        });
    }

    onDialogOK(isOk) {
        if (isOk) {
            this.ref.close(this.editFixedcost);
        } else {
            this.ref.close('cancel');
        }
    }

    onRemoveClicked(idx: number) {
        const cfg = {data: {name: this.fixedCosts[idx]['name']}};
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, cfg);
        dialogRef.afterClosed().subscribe(a => {
            if (a.status === 'deleteConfirmed') {
                this.fixedCosts.splice(idx, 1);
                this.service.persistAssumptions(this.fixedCosts);
            }
        });
    }

}


/**
 configName = 'defaultSettings';
 description = 'Default Settings';
 serviceCharge = {amount: 14000 / 12, frequency: 'q', dayDue: 30};
 rent = {amount: 30000 / 12, frequency: 'q', dayDue: 30};
 rates = {amount: 5000 / 12, frequency: 'q', dayDue: 30};
 lease = {amount: 200, frequency: 'q', dayDue: 30};
 */