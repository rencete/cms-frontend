import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as urljoin from "url-join";

import { CategoryRepositoryService } from './category-repository.service';
import { Category } from '@app/shared/models/category.interface';
import { RestApiUrlService } from '@core/services/rest-api-url/rest-api-url.service';

describe('CategoryRepositoryService tests', () => {
  let initialCategoryValues: Category[] = [];
  let service: CategoryRepositoryService;
  let httpClientSpy: {
    get: jasmine.Spy,
    post: jasmine.Spy,
    put: jasmine.Spy,
    delete: jasmine.Spy
  };
  let apiUrlBase: string;
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
    apiUrlBase = "http://sub.main.domain:1234/a";
    urlFullPath = `${apiUrlBase}/${CategoryRepositoryService.CATEGORY_API_BASE_PATH}`;
  });

  function setupHttpClientSpyWithGetCallback(cb: () => Observable<Category[]>) {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    httpClientSpy.get.and.callFake(cb);
  }

  function setupMockApiURLandTestbed() {
    const mockApiUrlService = jasmine.createSpyObj('RestApiUrlService', ["createRestApiUrl"]);
    mockApiUrlService.createRestApiUrl.and.callFake((base: string = "", path: string = "") => {
      return urljoin(apiUrlBase, base, path);
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RestApiUrlService, useValue: mockApiUrlService }
      ]
    });
    service = TestBed.inject(CategoryRepositoryService);
  }

  describe("REST API success tests", () => {
    beforeEach(() => {
      setupHttpClientSpyWithGetCallback(() => of(initialCategoryValues))
      setupMockApiURLandTestbed();
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
    it('Wait for the loading to complete before returning data', fakeAsync(() => {
      setupHttpClientSpyWithGetCallback(() => {
        return of(initialCategoryValues).pipe(delay(100));
      });
      setupMockApiURLandTestbed();

      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);

      service.getCategories().subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(initialCategoryValues);
      });
      tick(100);
    }));
  });
});