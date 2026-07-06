import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
 
  events = [
    {
      id: 1,
      title: `Salon RDV Emploi by Keejob 2026 : deux jours pour accélérer votre carrière`,
      date: '8 et 9 octobre 2026',
      location: `l'UTICA de Tunis`,
      image: '../../assets/events/SKJ08.png',
      description: `Trouver un emploi ne se résume plus à envoyer des dizaines de candidatures en ligne. Les recruteurs recherchent aujourd'hui des profils motivés, capables d'échanger directement avec eux et de valoriser leurs compétences. Les salons de recrutement offrent justement cette opportunité en réunissant, en un même lieu, entreprises, candidats et experts de l'emploi.
Les 8 et 9 octobre 2026, le Salon RDV Emploi by Keejob revient pour sa 6ᵉ édition à l'UTICA de Tunis. Organisé par Keejob, cet événement s'impose comme l'un des rendez-vous incontournables du recrutement en Tunisie.
Une rencontre directe avec les recruteurs
Le salon rassemble des entreprises de différents secteurs à la recherche de nouveaux talents. Que vous soyez étudiant, jeune diplômé ou professionnel expérimenté, vous pourrez rencontrer directement les recruteurs, découvrir leurs opportunités et échanger sur votre parcours.
Cette approche permet de créer un premier contact humain, souvent déterminant dans un processus de recrutement.
Bien préparer sa participation
Participer à un salon de l'emploi demande un minimum de préparation. Un CV à jour, une présentation claire de son parcours et quelques recherches sur les entreprises présentes permettent de faire la différence.
Préparez également un court discours de présentation, identifiez les employeurs qui vous intéressent et n'hésitez pas à poser des questions sur les postes, les perspectives d'évolution ou la culture d'entreprise.
Développer son réseau professionnel
Au-delà des offres d'emploi, le salon est une excellente occasion de développer son réseau. Les échanges avec les recruteurs, les responsables RH et les autres participants peuvent ouvrir la porte à de futures opportunités, à des stages ou à des collaborations.
Chaque rencontre peut devenir un contact précieux pour votre parcours professionnel.
Un événement tourné vers l'avenir
Le Salon RDV Emploi propose également des conférences, ateliers et interventions d'experts autour des évolutions du marché du travail, des compétences recherchées et des nouvelles tendances du recrutement.
C'est une occasion unique de mieux comprendre les attentes des entreprises et d'anticiper les métiers de demain.
Saisissez votre chance
Que votre objectif soit de décrocher un premier emploi, de changer de carrière ou d'élargir votre réseau professionnel, le Salon RDV Emploi by Keejob constitue une opportunité à ne pas manquer.
Préparez votre CV, travaillez votre présentation et profitez de ces deux journées pour multiplier les rencontres et donner un nouvel élan à votre carrière.
`,
      expanded: false
    },
    {
      id: 2,
      title: `Salon en ligne de la formation professionnelle 2026 : préparez votre avenir sans vous déplacer`,
      date: 'le 20 novembre 2026',
      location: 'En ligne',
      image: '../../assets/events/SKJ03.png',
      description: `Dans un marché du travail en constante évolution, développer ses compétences est devenu un véritable atout. Les entreprises recherchent des profils capables de s'adapter rapidement aux nouvelles technologies, aux nouveaux métiers et aux exigences d'un environnement professionnel toujours plus compétitif.
C'est dans cette dynamique que se tiendra, le 20 novembre 2026, le Salon virtuel de la formation professionnelle, un événement 100 % en ligne dédié à toutes les personnes souhaitant évoluer, se reconvertir ou acquérir de nouvelles compétences.
Un événement accessible à tous
Depuis votre ordinateur, votre tablette ou votre smartphone, vous pourrez accéder à l'ensemble des espaces du salon, sans contrainte de déplacement. Cette formule permet à chacun de participer, quel que soit son lieu de résidence, et de profiter pleinement des nombreuses opportunités proposées.
Étudiants, jeunes diplômés, demandeurs d'emploi, salariés ou professionnels en reconversion pourront échanger directement avec les organismes de formation et obtenir des réponses personnalisées à leurs questions.
Découvrez les formations qui recrutent
Le salon réunira des établissements et des organismes proposant des formations dans de nombreux domaines : numérique, intelligence artificielle, cybersécurité, commerce, marketing digital, industrie, bâtiment, santé, logistique, management, finance, langues et bien d'autres secteurs porteurs.
Les visiteurs pourront découvrir les compétences recherchées par les entreprises, les certifications proposées, les modalités d'inscription ainsi que les débouchés professionnels de chaque parcours.
Des conférences animées par des experts
Tout au long de la journée, des conférences et des ateliers en ligne permettront d'aborder les grandes tendances de la formation et de l'emploi. Les intervenants partageront leurs conseils sur les métiers d'avenir, les compétences les plus demandées, la reconversion professionnelle et les stratégies pour renforcer son employabilité.
Ces échanges offriront aux participants une vision concrète des évolutions du marché du travail et des opportunités à saisir.
Échangez directement avec les organismes de formation
Le salon permettra également de dialoguer en direct avec les représentants des établissements présents. Les visiteurs pourront poser leurs questions sur les programmes, les conditions d'admission, les certifications, les possibilités de financement et les perspectives de carrière.
Cette proximité facilitera le choix d'une formation adaptée à chaque projet professionnel.
Une opportunité pour construire son avenir
Se former, c'est investir dans son avenir. Dans un contexte où les compétences évoluent rapidement, la formation professionnelle constitue un levier essentiel pour accéder à de nouvelles opportunités, évoluer dans son métier ou réussir une reconversion.
Le Salon virtuel de la formation professionnelle, organisé le 20 novembre 2026, offrira à chaque participant l'occasion de découvrir des formations de qualité, de rencontrer des experts et de construire un projet professionnel en adéquation avec les besoins du marché.
Une journée à ne pas manquer pour préparer sereinement son avenir et donner un nouvel élan à sa carrière.
`,
      expanded: false
    },
    {
      id: 3,
      title: `Salon en ligne des PFE 2027 : trouvez votre projet de fin d'études`,
      date: '25 janvier 2027',
      location: 'En ligne',
      image: '../../assets/events/SKJ04.png',
      description: `Dans un marché du travail en constante évolution, développer ses compétences est devenu un véritable atout. Les entreprises recherchent des profils capables de s'adapter rapidement aux nouvelles technologies, aux nouveaux métiers et aux exigences d'un environnement professionnel toujours plus compétitif.
C'est dans cette dynamique que se tiendra, le 20 novembre 2026, le Salon virtuel de la formation professionnelle, un événement 100 % en ligne dédié à toutes les personnes souhaitant évoluer, se reconvertir ou acquérir de nouvelles compétences.
Un événement accessible à tous
Depuis votre ordinateur, votre tablette ou votre smartphone, vous pourrez accéder à l'ensemble des espaces du salon, sans contrainte de déplacement. Cette formule permet à chacun de participer, quel que soit son lieu de résidence, et de profiter pleinement des nombreuses opportunités proposées.
Étudiants, jeunes diplômés, demandeurs d'emploi, salariés ou professionnels en reconversion pourront échanger directement avec les organismes de formation et obtenir des réponses personnalisées à leurs questions.
Découvrez les formations qui recrutent
Le salon réunira des établissements et des organismes proposant des formations dans de nombreux domaines : numérique, intelligence artificielle, cybersécurité, commerce, marketing digital, industrie, bâtiment, santé, logistique, management, finance, langues et bien d'autres secteurs porteurs.
Les visiteurs pourront découvrir les compétences recherchées par les entreprises, les certifications proposées, les modalités d'inscription ainsi que les débouchés professionnels de chaque parcours.
Des conférences animées par des experts
Tout au long de la journée, des conférences et des ateliers en ligne permettront d'aborder les grandes tendances de la formation et de l'emploi. Les intervenants partageront leurs conseils sur les métiers d'avenir, les compétences les plus demandées, la reconversion professionnelle et les stratégies pour renforcer son employabilité.
Ces échanges offriront aux participants une vision concrète des évolutions du marché du travail et des opportunités à saisir.
Échangez directement avec les organismes de formation
Le salon permettra également de dialoguer en direct avec les représentants des établissements présents. Les visiteurs pourront poser leurs questions sur les programmes, les conditions d'admission, les certifications, les possibilités de financement et les perspectives de carrière.
Cette proximité facilitera le choix d'une formation adaptée à chaque projet professionnel.
Une opportunité pour construire son avenir
Se former, c'est investir dans son avenir. Dans un contexte où les compétences évoluent rapidement, la formation professionnelle constitue un levier essentiel pour accéder à de nouvelles opportunités, évoluer dans son métier ou réussir une reconversion.
Le Salon virtuel de la formation professionnelle, organisé le 20 novembre 2026, offrira à chaque participant l'occasion de découvrir des formations de qualité, de rencontrer des experts et de construire un projet professionnel en adéquation avec les besoins du marché.
Une journée à ne pas manquer pour préparer sereinement son avenir et donner un nouvel élan à sa carrière.
`,
      expanded: false
    }
  ];
 
  event: any;
 
  constructor(private route: ActivatedRoute, private router: Router) {}
 
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    this.event = this.events.find(e => e.id === id);
  });
}
 
  // goBack() {
  // this.router.navigate(['/'], { fragment: 'events-section' });
  // }

}
