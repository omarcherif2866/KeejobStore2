import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarcheTravailsComponent } from './marche-travails.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MarcheTravailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MarcheTravailsComponent } // ← route par défaut du module
    ])
  ]
})
export class MarcheTravailsModule { }
