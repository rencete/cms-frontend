import { Injectable } from '@angular/core';
import { nanoid } from "nanoid";

import { CategoryRepositoryService } from "@core/services/category-repository.service";
import { Category } from "@shared/models/category.interface";
import { Observable } from 'rxjs';

@Injectable()
export class CategoryModel {
  constructor(private repository: CategoryRepositoryService) {
  }

  addCategory(name: string, description: string = ""): Observable<Category> {
    let newCategory: Category = {
      name: name,
      description: description,
      id: nanoid()
    };
    return this.repository.upsertCategory(newCategory);
  }
}
