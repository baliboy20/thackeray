import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureComponent } from './configure.component';
import {RouterModule} from '@angular/router';
import {MaterialsModule} from '../../materials/materials.module';
import {SettingsModule} from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
      MaterialsModule,
      RouterModule.forChild([{path:'configure', component:ConfigureComponent}]),
      SettingsModule,
  ],
  declarations: [ConfigureComponent],
  exports: [ConfigureComponent],
})
export class ConfigureModule { }
