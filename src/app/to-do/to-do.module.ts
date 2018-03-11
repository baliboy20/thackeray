import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoComponent } from './to-do.component';
import {RouterModule} from '@angular/router';
import {MaterialsModule} from '../../materials/materials.module';
import {ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild([{path: 'todo', component: ToDoComponent}]),
      MaterialsModule,
      ComponentsModule,
  ],
  declarations: [ToDoComponent],
  exports: [ToDoComponent],
})
export class ToDoModule {



}
