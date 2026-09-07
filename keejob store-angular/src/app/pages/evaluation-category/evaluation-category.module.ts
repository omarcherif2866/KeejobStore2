import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationCategoryComponent } from './evaluation-category.component';
import { RouterModule } from '@angular/router';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [EvaluationCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: EvaluationCategoryComponent } // ← route par défaut du module
    ])
  ]
})
export class EvaluationCategoryModule { }
