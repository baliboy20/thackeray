import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {
    OPERATING_COSTS, OperatingCosts, VisitorService, WEEKLY_VISITOR_BIAS,
    WeeklyVisitorBias
} from '../../generators/visitor/visitor.service';
import {isNull} from "util";
import * as assert from "assert";
import {ConfirmDeleteDialogComponent} from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-operating-costs',
  templateUrl: './operating-costs.component.html',
  styleUrls: ['./operating-costs.component.scss']
})
export class OperatingCostsComponent implements OnInit {

  @ViewChild('tmplEditOc') tmp: TemplateRef<any>;

  private fmFlds = ['staffPerDay',  'tradesBase', 'averageSale'];

    private oC: OperatingCosts[] = [ ];
    private currOc: OperatingCosts;
    private editOc: OperatingCosts;
    private editState = 'EDIT_REC';

    constructor(private service: VisitorService,
                private dialog: MatDialog,
                private ref: MatDialogRef<any>,) {

    }

    ngOnInit() {
       const w = this.service.retrieveOperationgCosts();
        if(isNull(w) || w.length === 0) {
            this.oC.push(Object.assign({}, OPERATING_COSTS));
        } else {
            this.oC = w.filter(a => a !== null);
        }
    }

    getProperty(obj, idx) {
        idx++;
        return obj[idx];
    }

    modelChange(event) {
        this.service.applyOperatingCosts(this.currOc);

    }

    /* open edit dialog to amend/creat recored*/
    onEditClicked(value, dup?: false) {
        console.log('on edit clicked', value);

        if (value === undefined) {
           this.editOc = Object.assign({}, OPERATING_COSTS);
            console.log(this.editOc);
            this.editState = 'NEW_REC';

        } else if(!dup){
            this.editOc=  value ;
            this.editState = 'EDIT_REC';
        } else {
console.log('dupong');
            this.editOc =  Object.assign({}, value);
            console.log('assigning')
            this.editState = 'NEW_REC';
        }

        this.ref = this.dialog.open(this.tmp, {});
        this.ref.afterClosed().subscribe(a => {
            if (a === 'cancel') {
                return;
            } else {
                if (this.editState === 'NEW_REC') {
                   console.log('in newrec', this.editOc);
                    this.oC.push(this.editOc);
                }
                this.service.persistOperatingCosts(this.oC);
            }
        });
    }

    onDialogOK(isOk) {
        if (isOk) {
            this.ref.close(this.editOc);
        } else {
            this.ref.close('cancel');
        }
    }

    onRemoveClicked(idx: number) {
        console.log('The idx is', this.oC[idx], idx);
        // const cfg = {data:{name: 'charles'} };
        const cfg = {data:{name: this.oC[idx]['name']} }
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, cfg );
        dialogRef.afterClosed().subscribe(a => {
            console.log('after closed', a);
            if (a.status === 'deleteConfirmed') {
                this.oC.splice(idx, 1);
                this.service.persistOperatingCosts(this.oC);
            }
        });
    }


}
