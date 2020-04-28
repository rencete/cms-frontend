import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { ErrorDataComponent } from './components/error-data/error-data.component';
import { ErrorListComponent } from './components/error-list/error-list.component';


@NgModule({
  declarations: [
    ErrorDataComponent,
    ErrorListComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ErrorModule { }
