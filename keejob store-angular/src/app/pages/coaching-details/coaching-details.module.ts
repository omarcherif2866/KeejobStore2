import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingDetailsComponent } from './coaching-details.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CoachingDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CoachingDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class CoachingDetailsModule { }
