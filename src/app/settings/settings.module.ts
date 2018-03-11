import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialsModule} from '../../materials/materials.module';
import {FormsModule} from '@angular/forms';
import {SettingEditComponent} from './setting-edit/setting-edit.component';
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef} from '@angular/material';
import {ConfirmDeleteDialogComponent} from '../components/confirm-delete-dialog/confirm-delete-dialog.component';
import {VistorMonthlyComponent} from './visitor-heuristic/vistor-monthly/vistor-monthly.component';
import {VisitorWeeklyComponent} from './visitor-heuristic/visitor-weekly/visitor-weekly.component';
import {OperatingCostsComponent} from './operating-costs/operating-costs.component';
import {FixedCostsComponent} from './fixed-costs/fixed-costs.component';
import {FixedCostEditComponent} from './fixed-costs/fixed-cost-edit/fixed-cost-edit.component';

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
        VistorMonthlyComponent,
        ConfirmDeleteDialogComponent,
        VisitorWeeklyComponent,
        OperatingCostsComponent,
        FixedCostsComponent,
        FixedCostEditComponent,

    ],
    entryComponents: [SettingEditComponent,
        FixedCostsComponent,
        FixedCostEditComponent,
        ConfirmDeleteDialogComponent],
    exports: [
        SettingsComponent,
        VistorMonthlyComponent,
        VisitorWeeklyComponent,
        FixedCostEditComponent,
        FixedCostsComponent,
        OperatingCostsComponent],
    providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},

    ]
})
export class SettingsModule {
}
