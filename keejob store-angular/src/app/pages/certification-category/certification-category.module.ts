import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CertificationCategoryComponent } from './certification-category.component';



@NgModule({
  declarations: [CertificationCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CertificationCategoryComponent } // ← route par défaut du module
    ])
  ]
})
export class CertificationCategoryModule { }
