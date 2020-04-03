import { TestBed } from '@angular/core/testing';

import { CategoryRepositoryService } from './category-repository.service';
import { HttpClient } from '@angular/common/http';
import { of, Subject, Observable } from 'rxjs';
import { Category } from '@app/shared/models/category.interface';
import { UrlParts } from '@app/shared/models/url-parts.interface';
import { API_URL_TOKEN } from './api-url.token';

describe('CategoryRepositoryService tests', () => {
  let initValue: Category[] = [];
  let service: CategoryRepositoryService;
  let httpClientSpy: {
    get: jasmine.Spy,
    put: jasmine.Spy,
    delete: jasmine.Spy
  };
  let urlParts: UrlParts;
  let urlFullPath: string;
  
  beforeEach(() => {
    initValue = [{
      id: "1",
      name: "a",
      description: "desc a"
    }, {
      id: "2",
      name: "b",
      description: "desc b"
    }, {
      id: "3",
      name: "c",
      description: "desc c"
    }]
  });

  beforeEach(() => {
    urlParts = {
      protocol: "http",
      hostname: "sub.main.domain",
      port: 1234,
      pathname: "a"
    }
    urlFullPath = "http://sub.main.domain:1234/a"
  });

  describe("API tests", () => {
    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete']);
      httpClientSpy.get.and.callFake(() => {
        return of(initValue);
      });
      httpClientSpy.put.and.callFake(() => {
        return of({
          id: "2",
          name: "d",
          description: "desc d"
        });
      });
      httpClientSpy.delete.and.callFake(() => {
        return of({
          id: "2",
          name: "b",
          description: "desc b"
        });
      });
      
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: API_URL_TOKEN, useValue: urlParts }
        ]
      });
      service = TestBed.inject(CategoryRepositoryService);
    })
  
    it('GET: ALL: Loads category data upon construction', async() => {  
      const result = await service.getCategories().toPromise()
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${urlFullPath}/category`);
      expect(result).toEqual(initValue);
    });
  
    it('GET: ALL: Retrieves from cache for multiple calls to getAllCategories', async() => {  
      await service.getCategories().toPromise();
      await service.getCategories().toPromise();
      const result = await service.getCategories().toPromise();
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${urlFullPath}/category`);
      expect(result).toEqual(initValue);
    });
  
    it('GET: ID: Retrieves category data given id', async () => {  
      const result = await service.getCategory("2").toPromise();
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${urlFullPath}/category`);
      expect(result).toEqual({
        id: "2",
        name: "b",
        description: "desc b"
      });
    });
  
    it('PUT: Updates category data', async () => {  
      let result;
      var data = {
        id: "2",
        name: "d",
        description: "desc d"
      };
      result = await service.updateCategory(data).toPromise();
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.put).toHaveBeenCalledWith(`${urlFullPath}/category/2`, data);
      expect(result).toEqual({
        id: "2",
        name: "d",
        description: "desc d"
      });

      // Verify all the rest of data
      result = await service.getCategories().toPromise();
      expect(result).toEqual([{
        id: "1",
        name: "a",
        description: "desc a"
      }, {
        id: "2",
        name: "d",
        description: "desc d"
      }, {
        id: "3",
        name: "c",
        description: "desc c"
      }]);
    });
  
    it('DELETE: Deletes category data given id', async () => {  
      let result;
      result = await service.deleteCategory("2").toPromise();
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${urlFullPath}/category/2`);      

      // Verify all the rest of data
      result = await service.getCategories().toPromise();
      expect(result).toEqual([{
        id: "1",
        name: "a",
        description: "desc a"
      }, {
        id: "3",
        name: "c",
        description: "desc c"
      }]);
    });
  })
  
  describe("Timing tests", () => {
    it('Waits for the loading to complete before returning data', done => {
      let obs: Subject<Category[]> = new Subject<Category[]>();
  
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      httpClientSpy.get.and.callFake(() => {
        return obs.asObservable();
      });
      
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: API_URL_TOKEN, useValue: urlParts }
        ]
      });
      service = TestBed.inject(CategoryRepositoryService);
  
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  
      service.getCategories().subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(initValue);
        done();
      });
  
      obs.next(initValue);
    });
  });
});
