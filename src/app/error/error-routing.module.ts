import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorContainerComponent } from './containers/error-container/error-container.component';


const routes: Routes = [
  {
    path: '',
    component: ErrorContainerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ErrorRoutingModule { }
