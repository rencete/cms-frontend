import { CategoryModel } from './category.model';

describe("Category model tests", () => {
  describe('Test CategoryModel instance creation', () => {
    var name: string;
    var description: string;

    beforeEach(() => {
      name = "test";
      description = "value";
    });

    it('should create an instance with an ID', () => {
      const model = new CategoryModel(name, description);
      expect(model).toBeTruthy();
      expect(model.id).toBeTruthy();
      expect(model.id).toMatch(/^[A-Za-z0-9_-]{21}$/);
    });

    it('should match the name and description passed', () => {
      const model = new CategoryModel(name, description);
      expect(model).toBeTruthy();
      expect(model.name).toBe(name);
      expect(model.description).toBe(description);
    });

    it('should create unique IDs', () => {
      const model1 = new CategoryModel(name, description);
      const model2 = new CategoryModel(name, description);
      expect(model1.id).not.toBe(model2.id);
    });
  });
});