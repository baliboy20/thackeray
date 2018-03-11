import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MONTHLY_VISITOR_BIAS, MonthlyVisitorBias, VisitorService, WeeklyVisitorBias} from '../../../generators/visitor/visitor.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDeleteDialogComponent} from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
    selector: 'app-vistor-monthly',
    templateUrl: './vistor-monthly.component.html',
    styleUrls: ['./vistor-monthly.component.scss']
})
export class VistorMonthlyComponent implements OnInit {

    @ViewChild('tmplEditMonthly') tmp: TemplateRef<any>;
    @ViewChild('tmplConfirmDelete') tmplConfirmDelete: TemplateRef<any>;
    private monthlyVisitorBias: MonthlyVisitorBias[] = [];
    private weeklyVisitorBias: WeeklyVisitorBias[] = [];

    private currMonthlyVisitorBias: MonthlyVisitorBias;
    private editMonthlyVisitorBias: MonthlyVisitorBias;
    private currWeeklyVisitorBias: WeeklyVisitorBias;
    private editWeeklyVisitorBias: WeeklyVisitorBias;
    private editState = 'EDIT_REC';
    private monthFlds = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
        'AUG', 'SEP', 'OCT', 'DEC'];

    private weekFlds = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
        'Saturday', 'Sunday'];

    constructor(private service: VisitorService,
                private dialog: MatDialog,
                private ref: MatDialogRef<any>,) {

    }

    ngOnInit() {
        const [m, w] = this.service.retrieveTemporalBiases();
        this.monthlyVisitorBias = m;
        this.weeklyVisitorBias.concat(m);

    }

    getProperty(obj, idx) {
        idx++;
        return obj[idx];
    }

    modelChange(event) {
        this.service.applyCurrentBiases([this.currMonthlyVisitorBias, this.currWeeklyVisitorBias]);
    }

    onEditClicked(value, dup?: false) {


        if (value === undefined) {
            this.editMonthlyVisitorBias = Object.assign(MONTHLY_VISITOR_BIAS);
            this.editState = 'NEW_REC';

        } else if(!dup){
            this.editMonthlyVisitorBias =  value ;
            this.editState = 'EDIT_REC';
        } else {

            this.editMonthlyVisitorBias =  Object.assign({}, value);

            this.editState = 'NEW_REC';
        }



        this.ref = this.dialog.open(this.tmp, {});
        this.ref.afterClosed().subscribe(a => {
            if (a === 'cancel') {
                return;
            } else {
                if (this.editState === 'NEW_REC') {
                    this.monthlyVisitorBias.push(a);
                }
                this.service.persistMonthlyBias(this.monthlyVisitorBias);
            }
        });
    }

    onDialogOK(isOk) {
        if (isOk) {
            this.ref.close(this.editMonthlyVisitorBias);
        } else {
            this.ref.close('cancel');
        }
    }

    onRemoveClicked(idx: number) {

        // const cfg = {data:{name: 'charles'} };
        const cfg = {data:{name: this.monthlyVisitorBias[idx].name} }
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, cfg );
        dialogRef.afterClosed().subscribe(a => {

            if (a.status === 'deleteConfirmed') {
                this.monthlyVisitorBias.splice(idx, 1);
                this.service.persistMonthlyBias(this.monthlyVisitorBias);
            }
        });
    }


}
