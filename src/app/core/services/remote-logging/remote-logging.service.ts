import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

import { RestApiUrlService } from '@core/services/rest-api-url/rest-api-url.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteLoggingService {
  public static readonly REMOTE_LOGGING_URL_BASE_PATH = "logging";

  constructor(private restApiUrlService: RestApiUrlService, private httpClient: HttpClient) { }

  remoteLog(object: any): Observable<any> {
    return this.httpClient.post<any>(this.createApiUrl(), object).pipe(
      retry(3)
    );
  }

  private createApiUrl(...paths: string[]): string {
    return this.restApiUrlService.createRestApiUrl(RemoteLoggingService.REMOTE_LOGGING_URL_BASE_PATH, ...paths);
  }
}
