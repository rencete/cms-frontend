import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { CategoryRepositoryService } from '@app/core/services/category-repository.service';
import { Category } from '@app/shared/models/category.interface';

@Component({
  selector: 'category-add',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl()
  })

  constructor(private repository: CategoryRepositoryService) { }

  addCategory() {
    const values = this.form.value;
    const newCategory: Category = {
      id : "", // ID is set by the server
      name: values.name,
      description: values.description || ""
    }
    this.repository.addCategory(newCategory).subscribe();
  }
}
