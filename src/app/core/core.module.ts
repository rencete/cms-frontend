import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from "@environments/environment";
import { API_URL_TOKEN } from "./services/api-url.token";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: API_URL_TOKEN, useValue: () => environment.apiUrlParts }
  ]
})
export class CoreModule { }
