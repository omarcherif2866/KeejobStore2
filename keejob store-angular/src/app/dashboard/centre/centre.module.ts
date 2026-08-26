import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreComponent } from './centre.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CentreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CentreComponent } // ← route par défaut du module
    ])    
  ]
})
export class CentreModule { }
