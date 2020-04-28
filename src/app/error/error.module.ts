import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { ErrorDataComponent } from './components/error-data/error-data.component';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { ErrorContainerComponent } from './containers/error-container/error-container.component';


@NgModule({
  declarations: [
    ErrorDataComponent,
    ErrorListComponent,
    ErrorContainerComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ErrorContainerComponent
  ]
})
export class ErrorModule { }
