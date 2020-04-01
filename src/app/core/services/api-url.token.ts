import { InjectionToken } from '@angular/core';

import { UrlParts } from "@shared/models/url-parts.interface";

export const API_URL_TOKEN = new InjectionToken<UrlParts>('API-URL');