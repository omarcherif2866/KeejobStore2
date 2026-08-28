import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationKeejobComponent } from './formation-keejob.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    FormationKeejobComponent
  ],
  imports: [
    CommonModule,

    FormsModule,
    RouterModule.forChild([
      { path: '', component: FormationKeejobComponent } // ← route par défaut du module
    ])    
  ]
})
export class FormationKeejobModule { }
