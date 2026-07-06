import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EventsComponent } // ← route par défaut du module
    ])
  ]
})
export class EventsModule { }
