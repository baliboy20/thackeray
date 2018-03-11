import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FixedCosts, FixedCostsImpl} from '../../../generators/visitor/visitor.service';
import {NgForm} from '@angular/forms';
import {SettingEditComponent} from '../../setting-edit/setting-edit.component';

@Component({
  selector: 'app-fixed-cost-edit',
  templateUrl: './fixed-cost-edit.component.html',
  styleUrls: ['./fixed-cost-edit.component.scss']
})
export class FixedCostEditComponent implements OnInit {

    assumptions: FixedCosts;
    s;
    sts;
    mode = 'NONE';

    @ViewChild('fm1') set fm(value: NgForm) {
        value.statusChanges.subscribe(a => console.log(a));
    }

    constructor(private ref: MatDialogRef<SettingEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
      // console.log('DATA;;', data.cfg);
        this.assumptions = data.cfg;
        this.mode = data.mode;

    }

    protected onInvalid(e) { console.log('onInvalid event; ', e);}
    ngOnInit() {
    }

    onClose() {
        console.log('onclode', this.data, this.mode);
        this.ref.close();
    }

    read(){
        return 'read';
    }

}
