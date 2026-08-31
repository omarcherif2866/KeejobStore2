import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationsPlatformeComponent } from './certifications-platforme.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CertificationsPlatformeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CertificationsPlatformeComponent } // ← route par défaut du module
    ])
  ]
})
export class CertificationsPlatformeModule { }
