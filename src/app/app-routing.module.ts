import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseTemplateComponent } from './core/base-template/base-template.component';


const routes: Routes = [
  { path: '', component: BaseTemplateComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
