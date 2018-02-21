import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SettingsComponent} from './settings.component';
import {RouterModule, Routes} from '@angular/router';

const route: Routes = [
    {path: 'settings', component: SettingsComponent}
    ];

@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(route),
  ],
  declarations: [
      SettingsComponent,
      ]
})
export class SettingsModule { }
