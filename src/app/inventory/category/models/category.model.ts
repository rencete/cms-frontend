import { nanoid } from "nanoid";

import { Category } from "@shared/models/category.interface";

export class CategoryModel implements Category {
  id: string;

  constructor(public name: string, public description: string) {
    this.id = nanoid();
  }
}
