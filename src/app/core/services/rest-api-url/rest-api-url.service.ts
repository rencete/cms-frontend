import { Injectable, Inject } from '@angular/core';
import * as urljoin from "url-join";

import { UrlParts } from "../../../shared/models/url-parts.interface";
import { API_URL_TOKEN } from '@app/core/services/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class RestApiUrlService {
  private apiBaseUrl: string;

  get restApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  constructor(@Inject(API_URL_TOKEN) private urlParts: UrlParts) {
    this.apiBaseUrl = this.createUrlFromParts(urlParts);
  }

  private createUrlFromParts(url: UrlParts): string {
    const protocol = url.protocol.replace(/:+/, "");
    const port = url.port ? ":" + url.port : "";
    const path = (url.pathname || "").replace(/^\/+/, "");
    return `${protocol}://${url.hostname}${port}${path && "/" + path}`;
  };

  public createRestApiUrl(...apiPaths: string[]): string {
    const normalizedPaths = apiPaths.map(p => p || "");
    return urljoin(this.apiBaseUrl, ...normalizedPaths);
  }
}
