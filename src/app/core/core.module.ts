import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { environment } from "@environments/environment";
import { API_URL_TOKEN } from "./services/api-url.token";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    { provide: API_URL_TOKEN, useValue: environment.apiUrlParts }
  ]
})
export class CoreModule { }
