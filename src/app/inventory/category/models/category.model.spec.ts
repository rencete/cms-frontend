import { TestBed } from '@angular/core/testing';

import { CategoryModel } from './category.model';
import { CategoryRepositoryService } from '@app/core/services/category-repository.service';
import { Category } from '@app/shared/models/category.interface';

describe("Category model tests", () => {
  let service: CategoryModel;
  var name: string;
  var description: string;
  var repository: {
    upsertCategory: jasmine.Spy
  };

  beforeAll(() => {
    // Prepare spy
    repository = jasmine.createSpyObj('CategoryRepositoryService', ['upsertCategory']);
  })

  beforeEach(() => {
    // Initialize Testbed      
    TestBed.configureTestingModule({
      providers: [
        CategoryModel,
        { provide: CategoryRepositoryService, useValue: repository }
      ]
    });
    service = TestBed.inject(CategoryModel);
  });

  describe('Create new Categories', () => {
    beforeEach(() => {
      // Set expected values
      name = "test";
      description = "value";
    });

    it('should create new Category with an ID', () => {
      // Set mock behavior to check expected values
      repository.upsertCategory.and.callFake((category: Category) => {
        expect(category.name).toBe(name);
        expect(category.description).toBe(description);
        expect(category.id).toBeTruthy();
        expect(category.id).toMatch(/^[A-Za-z0-9_-]{21}$/);
      });

      service.addCategory(name, description);
    });

    it('should create unique IDs', () => {
      let categories : Category[] = [];
      // Set mock behavior to check expected values
      repository.upsertCategory.and.callFake((category: Category) => {
        categories.push(category);
      });

      // Generate 3 categories, each with unique IDs
      service.addCategory(name, description);
      service.addCategory(name, description);
      service.addCategory(name, description);

      // Check the uniqueness of the IDs
      expect(categories[0].id).not.toEqual(categories[1].id);
      expect(categories[1].id).not.toEqual(categories[2].id);
      expect(categories[0].id).not.toEqual(categories[2].id);
    });
  });
});