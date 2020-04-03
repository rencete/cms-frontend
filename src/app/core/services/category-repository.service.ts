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
  private initialLoadCompleted: boolean = false;
  private initialLoadCompletedSubject: Subject<boolean> = new Subject<boolean>();
  private initialLoadCompleted$ = this.initialLoadCompletedSubject.asObservable();
  private restApiUrl: string;

  private CATEGORY_URL_BASE_PATH = "category";

  constructor(@Inject(API_URL_TOKEN) public urlParts: UrlParts, public http: HttpClient) {
    this.setRestApiUrl();
    this.loadInitialCategoryData();
  }

  private setRestApiUrl() {
    const urlBase: string = UrlUtils.createUrlFromParts(this.urlParts);
    this.restApiUrl = UrlUtils.appendPathToUrl(urlBase, this.CATEGORY_URL_BASE_PATH);
  }

  private loadInitialCategoryData() {
    this.http.get<Category[]>(this.restApiUrl).subscribe((data) => {
      this.categories = data;
      this.setInitialLoadCompleted();
    });
  }

  private setInitialLoadCompleted() {
    this.initialLoadCompleted = true;
    this.initialLoadCompletedSubject.next(this.initialLoadCompleted);
    this.initialLoadCompletedSubject.complete();
  }

  getCategories(): Observable<Category[]> {
    if (this.initialLoadCompleted) {
      return of(this.categories);
    } else {
      return this.initialLoadCompleted$.pipe(map(() => this.categories));
    }
  }

  getCategory(id: string): Observable<Category> {
    if (this.initialLoadCompleted) {
      return of(this.categories.find(category => category.id === id));
    } else {
      return this.initialLoadCompleted$.pipe(
        map(() => this.categories.find(category => category.id === id))
      );
    }
  }

  addCategory(category: Category): Observable<Category> {
    let index = -1;

    return this.http.post<Category>(this.restApiUrl, category).pipe(
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

  updateCategory(category: Category): Observable<Category> {
    let index = -1;

    return this.http.put<Category>(
      UrlUtils.appendPathToUrl(this.restApiUrl, category.id),
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
      UrlUtils.appendPathToUrl(this.restApiUrl, id)
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
