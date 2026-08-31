import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationDetailsComponent } from './certification-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CertificationDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CertificationDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class CertificationDetailsModule { }
