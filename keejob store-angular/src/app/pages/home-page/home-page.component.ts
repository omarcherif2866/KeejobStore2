import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';
export interface Expert {
  name: string;
  profession: string;
  hours: string;
  mode: string;
  avatarColor: string;
  
}
@Component({
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})
export class HomePage implements OnInit{
    formateurs: Formateur[] = [];
    loading = false;
searchActive = false;

experts = [
  { name: "David Aplegate", profession: "Professeur en MBA", hours: "24+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#B5C4DE", avatar: "../../assets/image3077112-6q95-300h.png"},
  { name: "Maria Vawda", profession: "Expert en finance d'entreprise", hours: "24+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#9ED4DC", avatar: "../../assets/image3097112-8rce-300w.png"},
  { name: "Angelina Elrick", profession: "Experte en Marketing ", hours: "24+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#DFF5A0", avatar: "../../assets/image3117112-vsbr-300w.png"},
  { name: "Helina Sue", profession: "coach en développement personnel", hours: "20+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#AD96EF", avatar: "../../assets/image3107112-1gss-300h.png"}
];

events = [
  {
    id: 1,
    title: `Salon RDV Emploi by Keejob 2026 : 2 jours pour accélérer votre carrière`,
    date: '8 et 9 octobre 2026',
    location: `l'UTICA de Tunis`,
    image: '../../assets/events/SKJ04.png',

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
`, // (gardez tout le texte complet ici)
    expanded: false
  },
  {
    id: 2,
    title: `Salon en ligne de la formation professionnelle 2026 `,
    date: 'le 20 novembre 2026',
    location: 'En ligne',
    image: '../../assets/events/event2.jpeg',

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
    title: `Salon en ligne des PFE 2027 : trouvez votre projet de fin d'études`, // titre reconstitué à partir du contenu
    date: '25 janvier 2027',
    location: 'En ligne',
    image: '../../assets/events/event1.jpeg',

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
    title: `La conversation et le marché du travail pour avenir professionnel`, // titre reconstitué à partir du contenu
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

coursPopulaires = [
  {
    titre: 'Cours Populaires',
    description: 'Ces cours sont généralement suivis par les demandeurs d’emploi qui cherchent à améliorer leurs compétences',
    icone: '../../assets/book.svg',
    couleur: 'rgba(78, 142, 201, 1)'
  },
  {
    titre: 'Meilleurs Formations',
    description: 'Ces formations conçues pour vous fournir une base solide.',
    icone: '../../assets/formationIcon.svg',
    couleur: '#72B656'
  },
  {
    titre: 'Certifications',
    description: 'Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique mauris id vitae. Id pulvinar eget vitae.',
    icone: '../../assets/certifIcon.svg',
    couleur: '#EE7F50'
  }
];


  constructor(private title: Title, private formateurservice: FormateurService, private router:Router) {
    this.title.setTitle('Keejob Store')
  }


    ngOnInit() {
    this.fetchFormateurs();
  }
  fetchFormateurs() {
    this.loading = true;
    this.formateurservice.getFormateur().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Formateur
        this.formateurs = response.map(f => new Formateur(
          f.id,
          f.phone,
          f.description,
          f.address,
          f.email,
          f.experience,
          f.poste,
          f.firstName,
          f.lastName,
          f.university,
          f.image,
          f.servicesFormateurs || [],
          f.titleWhyList || []
        ));
        this.formateurs = this.formateurs; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.formateurs);
      },
      (error) => {
        console.error('Erreur lors du chargement des formateurs:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors du chargement des données',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
sanitizeImage(url: string): string {
  if (!url) return '';

  // Cas où l'URL est en double
  if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
    const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
    return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
  }

  return url;
}

  toggleSearch() {
  this.searchActive = !this.searchActive;
}

goToSignUp() {
  this.router.navigate(['/register']);
}

navigateToCertifications() {
  this.router.navigate(['/certifications']);
}


}
