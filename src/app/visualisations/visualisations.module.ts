import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualisationsComponent } from './visualisations.component';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from '../settings/settings.component';
const route: Routes = [
    {path: 'visualisation', component: VisualisationsComponent}
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(route),
  ],
  declarations: [VisualisationsComponent]
})
export class VisualisationsModule { }
