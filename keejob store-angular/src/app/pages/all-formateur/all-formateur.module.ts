import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllFormateurComponent } from './all-formateur.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AllFormateurComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AllFormateurComponent } // ← route par défaut du module
    ])
  ]
})
export class AllFormateurModule { }
