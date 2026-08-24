import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvDetailsComponent } from './cv-details.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CvDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CvDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class CvDetailsModule { }
