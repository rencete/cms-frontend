import { NgModule } from '@angular/core';

import { CoreModule } from '@core/core.module';
import { BaseTemplateComponent } from './core/base-template/base-template.component';

@NgModule({
  imports: [
    CoreModule
  ],
  bootstrap: [
    BaseTemplateComponent
  ]
})
export class AppModule { }