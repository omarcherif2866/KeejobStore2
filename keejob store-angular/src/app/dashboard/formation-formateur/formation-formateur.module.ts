import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationFormateurComponent } from './formation-formateur.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FormationFormateurComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
  { path: '', component: FormationFormateurComponent },      // sans id (Admin)
  { path: ':id', component: FormationFormateurComponent },   // avec id (Formateur)
    ])    
  ]
})
export class FormationFormateurModule { }
