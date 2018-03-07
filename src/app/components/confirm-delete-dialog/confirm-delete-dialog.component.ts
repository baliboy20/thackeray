import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SettingEditComponent} from '../../settings/setting-edit/setting-edit.component';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],

})
export class ConfirmDeleteDialogComponent implements OnInit {



    constructor(
        private ref: MatDialogRef<SettingEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any
    ) {


    }

    ngOnInit() {
    }

    onClose() {
        // this.ref.close();
        console.log('closoed clicked');
    }

}
