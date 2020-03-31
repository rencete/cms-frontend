import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../../core/angular-material/angular-material.module";
import { AddCategoryComponent } from './add-category/add-category.component';



@NgModule({
  declarations: [
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  exports: [
    AddCategoryComponent
  ]
})
export class CategoryModule { }
