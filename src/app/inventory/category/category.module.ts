import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AddCategoryComponent } from './add-category/add-category.component';



@NgModule({
  declarations: [
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
