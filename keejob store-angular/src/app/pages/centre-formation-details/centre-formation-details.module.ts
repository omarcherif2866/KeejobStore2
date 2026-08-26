import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreFormationDetailsComponent } from './centre-formation-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CentreFormationDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CentreFormationDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class CentreFormationDetailsModule { }
