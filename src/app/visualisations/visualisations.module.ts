import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualisationsComponent } from './visualisations.component';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from '../settings/settings.component';
import {NumFmtPipe} from './num-fmt.pipe';
import {MaterialsModule} from '../../materials/materials.module';
const route: Routes = [
    {path: 'visualisation', component: VisualisationsComponent}
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(route),
      MaterialsModule,
  ],
  declarations: [VisualisationsComponent, NumFmtPipe]
})
export class VisualisationsModule { }
