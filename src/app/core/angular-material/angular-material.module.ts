import { NgModule } from '@angular/core';

//Angular Material Components
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";

const materialModules: any = [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
]

@NgModule({
    declarations: [],
    exports: [
        ...materialModules
    ]
})
export class AngularMaterialModule { }
