import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { environment } from "@environments/environment";
import { API_URL_TOKEN } from "./services/api-url.token";
import { BaseTemplateComponent } from './base-template/base-template.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularMaterialModule } from '@core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    BaseTemplateComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    LayoutModule,
    AngularMaterialModule
  ],
  providers: [
    { provide: API_URL_TOKEN, useValue: environment.apiUrlParts }
  ],
  exports: [
    BaseTemplateComponent
  ]
})
export class CoreModule { }
