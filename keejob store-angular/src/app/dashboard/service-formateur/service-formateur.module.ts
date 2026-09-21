import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceFormateurComponent } from './service-formateur.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ServiceFormateurComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ServiceFormateurComponent },      // sans id (Admin)
       { path: ':id', component: ServiceFormateurComponent },   // avec id (Formateur)
    ])    
  ]
})
export class ServiceFormateurModule { }
