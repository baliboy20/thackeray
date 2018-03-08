import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialsModule} from '../../materials/materials.module';
import {FormsModule} from '@angular/forms';
import {SettingEditComponent} from './setting-edit/setting-edit.component';
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef} from '@angular/material';
import {ConfirmDeleteDialogComponent} from '../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { VistorCfgComponent } from './visitor-cfg/vistor-cfg/vistor-cfg.component';

const route: Routes = [
    {path: 'settings', component: SettingsComponent}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        MaterialsModule,
        FormsModule,
        // ConfirmDeleteDialogModule,
    ],
    declarations: [
        SettingsComponent,
        SettingEditComponent,
        VistorCfgComponent,
        ConfirmDeleteDialogComponent,

    ],
    entryComponents: [SettingEditComponent, ConfirmDeleteDialogComponent],
    exports: [SettingsComponent, VistorCfgComponent],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },

    ]
})
export class SettingsModule {
}
