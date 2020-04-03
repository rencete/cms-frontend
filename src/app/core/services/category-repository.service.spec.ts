import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';

import { CategoryRepositoryService } from './category-repository.service';
import { Category } from '@app/shared/models/category.interface';
import { UrlParts } from '@app/shared/models/url-parts.interface';
import { API_URL_TOKEN } from './api-url.token';

describe('CategoryRepositoryService tests', () => {
  let initialCategoryValues: Category[] = [];
  let service: CategoryRepositoryService;
  let httpClientSpy: {
    get: jasmine.Spy,
    post: jasmine.Spy,
    put: jasmine.Spy,
    delete: jasmine.Spy
  };
  let urlParts: UrlParts;
  let urlFullPath: string;

  beforeEach(() => {
    initialCategoryValues = [{
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
    urlFullPath = "http://sub.main.domain:1234/a/category"
  });

  describe("REST API success tests", () => {
    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
      httpClientSpy.get.and.callFake(() => {
        return of(initialCategoryValues);
      });

      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: API_URL_TOKEN, useValue: urlParts }
        ]
      });
      service = TestBed.inject(CategoryRepositoryService);
    })

    it('GET: Retrieve all categories', async () => {
      const result = await service.getCategories().toPromise()
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${urlFullPath}`);
      expect(result).toEqual(initialCategoryValues);
    });

    it('GET: Retrieves category data given ID', async () => {
      const result = await service.getCategory("2").toPromise();
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${urlFullPath}`);
      expect(result).toEqual({
        id: "2",
        name: "b",
        description: "desc b"
      });
    });

    it('POST: Adds category data', async () => {
      let postData = {
        id: "4",
        name: "d",
        description: "desc d"
      };

      httpClientSpy.post.and.callFake(() => {
        return of(postData);
      });

      await expectAsync(service.getCategory("4").toPromise())
        .toBeRejectedWith(new Error("Not Found"));

      await expectAsync(service.addCategory(postData).toPromise()).toBeResolved();
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.post).toHaveBeenCalledWith(`${urlFullPath}`, postData);

      const allCategories = await service.getCategories().toPromise();
      expect(allCategories.length).toBe(4);
      expect(allCategories.find(c => c.id === postData.id)).toEqual(postData);
    });

    it('PUT: Updates category data', async () => {
      let putData = {
        id: "2",
        name: "d",
        description: "desc d"
      };

      httpClientSpy.put.and.callFake(() => {
        return of(putData);
      });

      await expectAsync(service.getCategory("2").toPromise())
        .toBeResolvedTo(initialCategoryValues.find(c => c.id === "2"));

      await expectAsync(service.updateCategory(putData).toPromise()).toBeResolved();
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.put).toHaveBeenCalledWith(`${urlFullPath}/2`, putData);

      const allCategories = await service.getCategories().toPromise();
      expect(allCategories.length).toBe(3);
      expect(allCategories.find(c => c.id === putData.id)).toEqual(putData);
    });

    it('DELETE: Deletes category data given id', async () => {
      httpClientSpy.delete.and.callFake(() => {
        return of({});
      });

      await expectAsync(service.getCategory("2").toPromise())
        .toBeResolvedTo(initialCategoryValues.find(c => c.id === "2"));

      await expectAsync(service.deleteCategory("2").toPromise()).toBeResolved();
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${urlFullPath}/2`);

      await expectAsync(service.getCategory("2").toPromise())
        .toBeRejectedWith(new Error("Not Found"));
    });

    it('Retrieves from cache for multiple calls to getAllCategories', async () => {
      await expectAsync(service.getCategories().toPromise()).toBeResolvedTo(initialCategoryValues);
      await expectAsync(service.getCategories().toPromise()).toBeResolvedTo(initialCategoryValues);
      const result = await service.getCategories().toPromise();
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${urlFullPath}`);
      expect(result).toEqual(initialCategoryValues);
    });

    it('Throw error when GET data of non-existent ID', async () => {
      await expectAsync(service.getCategory("4").toPromise())
        .toBeRejectedWith(new Error("Not Found"));
      await expectAsync(service.getCategory("Test").toPromise())
        .toBeRejectedWith(new Error("Not Found"));
      await expectAsync(service.getCategory("0").toPromise())
        .toBeRejectedWith(new Error("Not Found"));
    });
  });

  describe("Timing tests", () => {
    it('Wait for the loading to complete before returning data', done => {
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
        expect(result).toEqual(initialCategoryValues);
        done();
      });

      obs.next(initialCategoryValues);
    });
  });
});
