import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationComponent } from './certification.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CertificationComponent
  ],
  imports: [
    CommonModule,

    FormsModule,
    RouterModule.forChild([
      { path: '', component: CertificationComponent } // ← route par défaut du module
    ])    
  ]
})
export class CertificationModule { }
