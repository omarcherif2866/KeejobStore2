import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-marche-travails-details',
  templateUrl: './marche-travails-details.component.html',
  styleUrls: ['./marche-travails-details.component.css']
})
export class MarcheTravailsDetailsComponent implements OnInit {

marcheTravail = [
  {
    id: 1,
    title: `Les métiers de demain : les compétences qui feront la différence`,
        icon: 'file',
    color: 'green',
    description: `Le monde du travail évolue à une vitesse sans précédent. L'intelligence artificielle, la transition écologique, la transformation numérique et les nouvelles attentes des entreprises redessinent le marché de l'emploi. Certains métiers disparaissent progressivement, tandis que de nouvelles professions émergent, créant des opportunités inédites pour celles et ceux qui savent s'adapter.
L'intelligence artificielle au cœur des transformations
L'essor de l'intelligence artificielle génère une forte demande en spécialistes de la data, ingénieurs en IA, développeurs, experts en cybersécurité et analystes de données. Ces métiers seront essentiels pour concevoir, sécuriser et optimiser les technologies de demain.
La transition écologique crée de nouveaux besoins
Face aux défis environnementaux, les entreprises recherchent des experts capables d'accompagner leur transition. Les métiers liés aux énergies renouvelables, à l'efficacité énergétique, au recyclage, à la mobilité durable et au développement durable connaîtront une croissance importante dans les prochaines années.
La santé et l'accompagnement humain restent indispensables
Le vieillissement de la population et les évolutions des systèmes de santé renforcent les besoins en professionnels de santé, aides-soignants, infirmiers, psychologues, ergothérapeutes et spécialistes du bien-être. Les compétences humaines demeurent irremplaçables.
Les métiers du numérique poursuivent leur expansion
Développeur web, spécialiste cloud, administrateur systèmes, expert en cybersécurité, UX/UI designer, chef de projet digital ou encore spécialiste du marketing numérique figurent parmi les profils les plus recherchés. Toutes les entreprises accélèrent leur transformation digitale.
Les compétences seront aussi importantes que les diplômes
Au-delà des connaissances techniques, les employeurs accordent une importance croissante aux compétences comportementales : capacité d'adaptation, créativité, esprit d'équipe, communication, résolution de problèmes et apprentissage continu. Dans un environnement en constante évolution, apprendre tout au long de sa carrière devient un véritable atout.
Se préparer dès aujourd'hui
Les métiers de demain ne concernent pas uniquement les nouvelles générations. Chaque professionnel peut développer de nouvelles compétences grâce à la formation, aux certifications et à l'expérience. Ceux qui investissent dans leur évolution professionnelle seront les mieux préparés aux opportunités futures.
L'avenir appartient aux personnes capables d'évoluer avec leur époque. Se former, rester curieux et développer des compétences recherchées sont les meilleures stratégies pour construire une carrière durable et réussir dans le monde du travail de demain.

`, // (gardez tout le texte complet ici)
    expanded: false
  },
  {
    id: 2,
    title: `Les compétences les plus recherchées par les entreprises aujourd'hui`,
        icon: 'search',
    color: 'orange',
    description: `Le marché de l'emploi évolue rapidement sous l'effet de la transformation numérique, de l'automatisation et des nouvelles méthodes de travail. Aujourd'hui, les recruteurs recherchent avant tout des candidats capables de s'adapter, d'apprendre rapidement et de contribuer efficacement à la performance de leur entreprise. Les compétences techniques restent essentielles, mais les qualités humaines prennent une place de plus en plus importante.
La maîtrise des outils numériques est devenue incontournable
Quel que soit le secteur d'activité, les entreprises attendent de leurs collaborateurs qu'ils maîtrisent les outils bureautiques, les plateformes collaboratives, les logiciels métiers et, de plus en plus, les solutions d'intelligence artificielle. Les compétences numériques sont désormais un véritable critère de recrutement.
Les soft skills font la différence
Communication, esprit d'équipe, organisation, autonomie, créativité et sens des responsabilités sont aujourd'hui parmi les qualités les plus recherchées. Ces compétences permettent de mieux collaborer, de gérer les imprévus et de s'intégrer rapidement dans une équipe.
L'adaptabilité est une qualité essentielle
Les métiers évoluent rapidement et les entreprises recherchent des profils capables de s'adapter aux changements, d'apprendre de nouvelles méthodes de travail et d'acquérir régulièrement de nouvelles compétences. La capacité à évoluer est devenue un atout majeur.
La résolution de problèmes est très appréciée
Les recruteurs privilégient les candidats capables d'analyser une situation, de proposer des solutions concrètes et de prendre des décisions pertinentes. L'esprit critique et la capacité d'analyse sont aujourd'hui des compétences très valorisées.
La cybersécurité et la gestion des données prennent de l'importance
Avec la digitalisation des entreprises, la protection des données est devenue un enjeu stratégique. Les profils maîtrisant les bonnes pratiques de cybersécurité, l'analyse de données ou les outils numériques sont de plus en plus recherchés.
L'apprentissage continu devient indispensable
Les connaissances évoluent rapidement. Les employeurs apprécient les collaborateurs qui se forment régulièrement, obtiennent de nouvelles certifications et développent leurs compétences tout au long de leur carrière. La curiosité et l'envie d'apprendre sont devenues de véritables avantages professionnels.
Se démarquer sur le marché de l'emploi
Aujourd'hui, un diplôme ne suffit plus toujours à faire la différence. Les entreprises recherchent des profils capables de combiner compétences techniques, qualités humaines et capacité d'évolution. Investir dans sa formation, développer ses compétences et rester à l'écoute des évolutions du marché constitue la meilleure stratégie pour construire une carrière durable et réussir professionnellement
`,
    expanded: false
  },
  {
    id: 3,
    title: `La conversation et le marché du travail`, // titre reconstitué à partir du contenu
        icon: 'target',
    color: 'blue',
    description: `Le marché du travail évolue rapidement sous l'effet de la transformation numérique, des nouveaux modes de collaboration et des attentes des entreprises. Aujourd'hui, la capacité à communiquer efficacement est devenue une compétence essentielle, au même titre que les compétences techniques.
Communiquer avec efficacité
Savoir écouter, s'exprimer clairement et échanger avec les autres favorise la collaboration, renforce la confiance et améliore la performance au sein des équipes.
Convaincre en entretien
Les recruteurs évaluent autant les compétences techniques que la capacité d'un candidat à dialoguer, argumenter et présenter ses idées avec assurance.
Travailler en équipe
La réussite d'un projet repose sur une communication fluide entre les collaborateurs. L'esprit d'équipe, l'écoute et le respect des autres sont des qualités très recherchées.
S'adapter aux nouvelles méthodes
Le télétravail, les outils collaboratifs et l'intelligence artificielle transforment les échanges professionnels. Il est essentiel de savoir communiquer efficacement, quel que soit le canal utilisé.
Développer son employabilité
Les professionnels qui maîtrisent la communication, l'écoute, la négociation et la gestion des relations disposent d'un avantage sur le marché de l'emploi et évoluent plus facilement dans leur carrière.
La communication n'est plus une compétence secondaire : elle est aujourd'hui un véritable levier de réussite professionnelle.
`,
    expanded: false
  }
];
  article: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.article = this.marcheTravail.find(a => a.id === id);
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

