import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {MaterialsModule} from '../materials/materials.module';
import {RouterModule, Routes} from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import {WhatifModule} from './whatif/whatif.module';
import {VisualisationsModule} from './visualisations/visualisations.module';
import {SettingsModule} from './settings/settings.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToDoModule} from './to-do/to-do.module';
import {WhatifComponent} from './whatif/whatif.component';
import {ConfigureModule} from './configure/configure.module';
import { VisitorWeeklyComponent } from './visitor-heuristic/visitor-weekly/visitor-weekly.component';

const appRoutes: Routes = [
    // {path: 'whatif', loadChildren: './whatif/whatif.module#WhatifModule' },
    // {path: 'visualisation', loadChildren: './visualisations/visualisations.module#VisualisationsModule' },
]
@NgModule({
  declarations: [
    AppComponent,
    VisitorWeeklyComponent,


  ],
  imports: [
    BrowserModule,
      BrowserAnimationsModule,
      MaterialsModule,
      RouterModule.forRoot( appRoutes),
      WhatifModule,
      VisualisationsModule,
      SettingsModule,
      ToDoModule,
      ConfigureModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
