import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarcheTravailsDetailsComponent } from './marche-travails-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MarcheTravailsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MarcheTravailsDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class MarcheTravailsDetailsModule { }
