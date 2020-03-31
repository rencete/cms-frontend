import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AngularMaterialModule } from "@app/core/angular-material/angular-material.module";
import { AddCategoryComponent } from './add-category/add-category.component';



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
  ]
})
export class CategoryModule { }
