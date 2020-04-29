import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseTemplateComponent } from './core/base-template/base-template.component';


const routes: Routes = [
  { path: 'error',
    component: BaseTemplateComponent,
    children: [
      { path: '', loadChildren: () => import('./error/error.module').then(mod => mod.ErrorModule)}
    ]
  },
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
