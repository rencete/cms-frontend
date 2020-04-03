import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";

import { API_URL_TOKEN } from "./api-url.token";
import { UrlUtils } from "@shared/utils/url-utils";
import { UrlParts } from '@app/shared/models/url-parts.interface';
import { Category } from '@app/shared/models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService {
  private cachedCategories: Category[];
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
      this.cachedCategories = data;
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
      return of(this.cachedCategories);
    } else {
      return this.initialLoadCompleted$
        .pipe(
          map(() => this.cachedCategories),
          catchError(err => throwError(err))
        );
    }
  }

  getCategory(categoryId: string): Observable<Category> {
    if (this.initialLoadCompleted) {
      return this.getCategoryWithIdOrError(categoryId);
    } else {
      return this.initialLoadCompleted$
        .pipe(
          () => this.getCategoryWithIdOrError(categoryId)
        );
    }
  }

  addCategory(category: Category): Observable<Category> {
    return this.postCategoryAndUpdateCache(category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.putCategoryAndUpdateCache(category);
  }

  deleteCategory(categoryId: string): Observable<Category> {
    return this.deleteCategoryAndUpdateCache(categoryId);
  }

  private getCategoryWithIdOrError(categoryId: string): Observable<Category> {
    const category = this.cachedCategories.find(c => c.id === categoryId);
    if(category) {
      return of(category);
    } else {
      return throwError(new Error("Not Found"));
    }
  }

  private postCategoryAndUpdateCache(category: Category): Observable<Category> {
    let obs = this.http.post<Category>(this.restApiUrl, category);
    obs = obs.pipe(
      tap(() => {
        this.addOrUpdateCache(category);
      },
      catchError((error) => {
        return throwError(error);
      })));
    return obs;
  }

  private putCategoryAndUpdateCache(category: Category): Observable<Category> {
    let putApiUrl = UrlUtils.appendPathToUrl(this.restApiUrl, category.id);
    let obs = this.http.put<Category>(putApiUrl, category)
    obs = obs.pipe(
      tap(() => {
        this.addOrUpdateCache(category);
      },
      catchError((error) => {
        return throwError(error);
      })));
    return obs;
  }

  private addOrUpdateCache(category: Category): void {
    const index = this.cachedCategories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      this.cachedCategories.splice(index, 1, category);
    }
    else {
      this.cachedCategories.push(category);
    }
  }

  private deleteCategoryAndUpdateCache(categoryId: string): Observable<Category> {
    const deleteApiUrl = UrlUtils.appendPathToUrl(this.restApiUrl, categoryId);
    let obs = this.http.delete<Category>(deleteApiUrl);
    obs = obs.pipe(
      tap(() => {
        this.deleteFromCache(categoryId);
      },
      catchError((error) => {
        return throwError(error);
      })));
    return obs;
  }

  private deleteFromCache(categoryId: string): void {
    const index = this.cachedCategories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      this.cachedCategories.splice(index, 1);
    }
  }
}
