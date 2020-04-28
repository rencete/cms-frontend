import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { ErrorDataComponent } from './components/error-data/error-data.component';


@NgModule({
  declarations: [
    ErrorDataComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ErrorModule { }
