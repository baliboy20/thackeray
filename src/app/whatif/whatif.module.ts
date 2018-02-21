import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatifComponent } from './whatif.component';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from '../settings/settings.component';
import {MaterialsModule} from '../../materials/materials.module';
import {VisitorService} from '../generators/visitor/visitor.service';
const route: Routes = [
    {path: 'whatif', component: WhatifComponent}
];

@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(route),
      MaterialsModule,
  ],
  declarations: [WhatifComponent],
    providers: [VisitorService]
})
export class WhatifModule { }
