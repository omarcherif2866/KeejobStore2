import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CentreFormationService } from '../../services/centre-formation.service';
import { AvisService } from '../../services/avis.service';
import { CentreFormation } from 'src/app/models/centre-formation';
import { Avis } from 'src/app/models/avis';

type TabId = 'presentation' | 'formations' | 'formateurs' | 'avis' | 'infos';


@Component({
  selector: 'app-centre-formation-details',
  templateUrl: './centre-formation-details.component.html',
  styleUrls: ['./centre-formation-details.component.css']
})
export class CentreFormationDetailsComponent implements OnInit {

  centre?: CentreFormation;
  avisList: Avis[] = [];
  loading = true;
  activeTab: TabId = 'presentation';

  tabs: { id: TabId; label: string }[] = [
    { id: 'presentation', label: 'Présentation' },
    { id: 'formations', label: 'Formations' },
    // { id: 'formateurs', label: 'Formateurs' },
    { id: 'avis', label: 'Avis' },
    { id: 'infos', label: 'Informations pratiques' },
  ];

  constructor(
    private route: ActivatedRoute,
    private centreService: CentreFormationService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.centreService.getCentreById(id).subscribe({
        next: (data) => { this.centre = data; this.loading = false; console.log('Centre data:', data); },
        error: () => { this.loading = false; }
      });

      this.avisService.getAvisByCentre(id).subscribe({
        next: (data) => this.avisList = data,
        error: () => this.avisList = []
      });
    }
  }

  get avisApercu(): Avis[] {
    return this.avisList.slice(0, 3);
  }

  get formationsPhares() {
    return this.centre?.formations?.slice(0, 4) ?? [];
  }

  setTab(tab: TabId): void {
    this.activeTab = tab;
  }

  stars(note: number): number[] {
    return Array(Math.round(note)).fill(0);
  }
}
