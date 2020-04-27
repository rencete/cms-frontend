import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { environment } from "@environments/environment";
import { API_URL_TOKEN } from "./services/api-url.token";
import { BaseTemplateComponent } from './base-template/base-template.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { GlobalErrorHandlerService } from './services/error-handler/global-error-handler.service';

@NgModule({
  declarations: [
    BaseTemplateComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    AngularMaterialModule
  ],
  providers: [
    { provide: API_URL_TOKEN, useValue: environment.apiUrlParts },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  exports: [
    BaseTemplateComponent
  ]
})
export class CoreModule { }
