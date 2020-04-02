import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AngularMaterialModule } from "@core/angular-material/angular-material.module";
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryModel } from './models/category.model';



@NgModule({
  declarations: [
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularMaterialModule
  ],
  exports: [
    AddCategoryComponent
  ],
  providers: [
    CategoryModel
  ]
})
export class CategoryModule { }
