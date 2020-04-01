import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Category } from '@app/shared/models/category.interface';
import { Observable, of, Subject } from 'rxjs';
import { map, tap } from "rxjs/operators";

import { API_URL_TOKEN } from "./api-url.token";
import { UrlUtils } from "@shared/utils/url-utils";
import { UrlParts } from '@app/shared/models/url-parts.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService {
  private categories: Category[];
  private loaded: boolean = false; // becomes true when initial load completed
  private loadedSubject: Subject<boolean> = new Subject<boolean>();
  private loaded$ = this.loadedSubject.asObservable();
  private apiUrl: string;

  constructor(@Inject(API_URL_TOKEN) public urlParts: UrlParts, public http: HttpClient) {
    this.apiUrl = UrlUtils.createUrlFromParts(urlParts);

    this.http.get<Category[]>(UrlUtils.appendPathToUrl(this.apiUrl, "category")).subscribe((data) => {
      this.categories = data;
      this.loaded = true;
      this.loadedSubject.next(true);
      this.loadedSubject.complete();
    });
  }

  getAllCategories(): Observable<Category[]> {
    if (this.loaded) {
      return of(this.categories);
    } else {
      return this.loaded$.pipe(map(() => this.categories));
    }
  }

  getCategory(id: string): Observable<Category> {
    if (this.loaded) {
      return of(this.categories.find(category => category.id === id));
    } else {
      return this.loaded$.pipe(
        map(() => this.categories.find(category => category.id === id))
      );
    }
  }

  upsertCategory(category: Category): Observable<Category> {
    let index = -1;

    return this.http.put<Category>(
      UrlUtils.appendPathToUrl(this.apiUrl, "category", category.id),
      category
    ).pipe(
      tap(() => {
        index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          this.categories.splice(index, 1, category);
        }
        else {
          this.categories.push(category);
        }
      })
    );
  }

  deleteCategory(id: string): Observable<Category> {
    let index = -1;

    return this.http.delete<Category>(
      UrlUtils.appendPathToUrl(this.apiUrl, "category", id)
    ).pipe(
      tap(() => {
        index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories.splice(index, 1);
        }
      })
    );
  }
}
