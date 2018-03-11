import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {WEEKLY_VISITOR_BIAS, VisitorService, WeeklyVisitorBias} from '../../../generators/visitor/visitor.service';
import {ConfirmDeleteDialogComponent} from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import * as assert from 'assert';
import {isNull} from 'util';

@Component({
    selector: 'app-visitor-weekly',
    templateUrl: './visitor-weekly.component.html',
    styleUrls: ['./visitor-weekly.component.scss']
})
export class VisitorWeeklyComponent implements OnInit {

    @ViewChild('tmplEditWeekly') tmp: TemplateRef<any>;
    @ViewChild('tmplConfirmDelete') tmplConfirmDelete: TemplateRef<any>;

    private currWeeklyVisitorBias: WeeklyVisitorBias;
    private weeklyVisitorBias: WeeklyVisitorBias[] = [];
    private editWeeklyVisitorBias: WeeklyVisitorBias;
    private editState = 'EDIT_REC';
    private monthFlds = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];


    constructor(private service: VisitorService,
                private dialog: MatDialog,
                private ref: MatDialogRef<any>,) {

    }

    ngOnInit() {
        const [m, w] = this.service.retrieveTemporalBiases();
        if (isNull(w) || w.length === 0) {
            this.weeklyVisitorBias.push(Object.assign({}, WEEKLY_VISITOR_BIAS));
        } else {
            this.weeklyVisitorBias = w;
        }
    }

    getProperty(obj, idx) {
        idx++;
        return obj[idx];
    }

    modelChange(event) {
        this.service.applyCurrentWeeklyBias(this.currWeeklyVisitorBias);
        assert('dow we really want to run this?');

    }

    onEditClicked(value, dup?: false) {

        if (value === undefined) {
            this.editWeeklyVisitorBias = Object.assign({}, WEEKLY_VISITOR_BIAS);
            this.editState = 'NEW_REC';

        } else if (!dup) {
            this.editWeeklyVisitorBias = value;
            this.editState = 'EDIT_REC';
        } else {

            this.editWeeklyVisitorBias = Object.assign({}, value);
            this.editState = 'NEW_REC';
        }

        this.ref = this.dialog.open(this.tmp, {});
        this.ref.afterClosed().subscribe(a => {
            if (a === 'cancel') {
                return;
            } else {
                if (this.editState === 'NEW_REC') {
                    this.weeklyVisitorBias.push(a);
                }
                this.service.persistWeekyBias(this.weeklyVisitorBias);
            }
        });
    }

    onDialogOK(isOk) {
        if (isOk) {
            this.ref.close(this.editWeeklyVisitorBias);
        } else {
            this.ref.close('cancel');
        }
    }

    onRemoveClicked(idx: number) {
        const cfg = {data: {name: this.weeklyVisitorBias[idx].name}};
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, cfg);
        dialogRef.afterClosed().subscribe(a => {
            if (a.status === 'deleteConfirmed') {
                this.weeklyVisitorBias.splice(idx, 1);
                this.service.persistWeekyBias(this.weeklyVisitorBias);
            }
        });
    }
}
