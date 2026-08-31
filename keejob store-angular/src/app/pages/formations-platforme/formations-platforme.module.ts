import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormationsPlatformeComponent } from './formations-platforme.component';



@NgModule({
  declarations: [FormationsPlatformeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FormationsPlatformeComponent } // ← route par défaut du module
    ])
  ]
})
export class FormationsPlatformeModule { }
