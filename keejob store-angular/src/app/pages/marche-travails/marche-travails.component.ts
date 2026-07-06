import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marche-travails',
  templateUrl: './marche-travails.component.html',
  styleUrls: ['./marche-travails.component.css']
})
export class MarcheTravailsComponent implements OnInit {
marcheTravail = [
  {
    id: 1,
    title: `Les métiers de demain : les compétences qui feront la différence`,
    description: `Le monde du travail évolue à une vitesse sans précédent...`,
    icon: 'file',
    color: 'green'
  },
  {
    id: 2,
    title: `Les compétences les plus recherchées par les entreprises aujourd'hui`,
    description: `Le marché de l'emploi évolue rapidement...`,
    icon: 'search',
    color: 'orange'
  },
  {
    id: 3,
    title: `La conversation et le marché du travail`,
    description: `Le marché du travail évolue rapidement...`,
    icon: 'target',
    color: 'blue'
  }
];
  constructor() { }

  ngOnInit(): void {
  }

}
