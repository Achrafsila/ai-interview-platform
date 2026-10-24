import type { Exercise } from "./catalog";

export type PremiumGuide = {
  objective: string;
  context: string;
  methodology: string;
  evidence: string[];
  pitfalls: string[];
  example: string;
  reflection: string;
};

/** Révision pédagogique assistée par IA, pour pilote interne uniquement. Pas de validation humaine/certification. */
const guides: Record<string, PremiumGuide> = {
  "pitch-1-foundation": {
    objective: "Construire une présentation claire et mémorable en une minute.",
    context: "Vous rencontrez un recruteur pour la première fois. Il attend une présentation ciblée, et non la lecture de votre CV.",
    methodology: "Présent → expérience utile → preuve → lien avec le poste. Visez environ 90 à 120 mots, puis ajustez au débit naturel et à la clarté de votre voix.",
    evidence: ["Une identité professionnelle claire dès l'ouverture.", "Une expérience ou un projet concret illustrant une compétence.", "Une phrase qui relie le parcours au poste convoité.", "Une durée proche de 60 secondes à l'oral."],
    pitfalls: ["Énumérer toutes ses expériences dans l'ordre chronologique.", "Utiliser des adjectifs sans illustration.", "Terminer sans évoquer le poste ciblé."],
    example: "Je termine une formation en analyse de données. Lors de mon projet de fin d'études, j'ai construit un tableau de bord pour faciliter le suivi d'indicateurs. J'y ai appris à clarifier un besoin métier et à présenter des résultats simplement. Je souhaite aujourd'hui développer ces compétences dans une équipe Data.",
    reflection: "Votre interlocuteur pourrait-il résumer votre proposition de valeur en une phrase ?"
  },
  "pitch-1-practice": {
    objective: "Adapter son pitch à une opportunité précise avec des preuves.",
    context: "Vous candidatez à un poste qui met l'accent sur la collaboration et l'amélioration continue. Le recruteur vous demande de vous présenter en une minute.",
    methodology: "Choisissez deux compétences attendues, puis associez chacune à une réalisation prouvable. Terminez par votre motivation pour cette mission.",
    evidence: ["Deux compétences reliées au poste.", "Au moins un exemple vérifiable.", "Une transition naturelle entre les idées.", "Une conclusion spécifique à l'opportunité."],
    pitfalls: ["Reprendre le même pitch pour tous les postes.", "Réciter des compétences sans preuves.", "Surévaluer son rôle dans un résultat collectif."],
    example: "Je travaille sur des projets transverses depuis trois ans. J'ai notamment coordonné une amélioration de processus avec deux équipes, ce qui a réduit les reprises manuelles. Cette expérience m'a appris à construire des solutions avec les utilisateurs. C'est cet équilibre entre analyse et collaboration que je souhaite retrouver dans votre équipe.",
    reflection: "Qu'avez-vous changé dans votre pitch en fonction de cette opportunité ?"
  },
  "pitch-1-challenge": {
    objective: "Défendre une proposition de valeur concise face à un recruteur exigeant.",
    context: "Un dirigeant dispose de 45 secondes et vous interrompt : « Beaucoup de candidats ont ce type d'expérience. Qu'est-ce qui vous distingue réellement ? »",
    methodology: "Répondez d'abord par une différence observable, apportez une preuve, puis formulez le bénéfice attendu pour l'équipe.",
    evidence: ["Une différenciation précise, sans prétention excessive.", "Une preuve personnelle et vérifiable.", "Un impact formulé en termes métier.", "Une réponse concise malgré l'interruption."],
    pitfalls: ["Confondre assurance et affirmation non démontrée.", "Reprendre tout son CV pour se justifier.", "Inventer une mesure pour convaincre."],
    example: "Ma différence tient à ma capacité à transformer un problème mal cadré en plan d'action partagé. Dans mon dernier projet, j'ai aligné les équipes métier et technique sur trois priorités mesurables. Les décisions ont pu être prises dans un cadre partagé, avec des responsabilités plus claires. C'est cette approche structurée que je peux apporter ici.",
    reflection: "Votre argument résisterait-il à la question : « Pouvez-vous me le démontrer ? »"
  },
  "communication-1-foundation": {
    objective: "Expliquer son métier à une personne extérieure à son secteur.",
    context: "Une personne du service RH vous demande simplement : « En quoi consiste votre travail au quotidien ? »",
    methodology: "Problème traité → action principale → utilité. Évitez les sigles non expliqués.",
    evidence: ["Un problème compréhensible sans expertise technique.", "Une action décrite avec des mots simples.", "Un bénéfice concret pour l'organisation.", "Aucun jargon indispensable laissé sans explication."],
    pitfalls: ["Multiplier les acronymes.", "Parler exclusivement des outils.", "Oublier de préciser pour qui le travail est utile."],
    example: "J'aide les équipes à comprendre leurs données pour prendre de meilleures décisions. Je rassemble les informations, vérifie leur qualité et prépare des indicateurs faciles à lire. L'objectif est que les responsables puissent repérer les problèmes plus tôt.",
    reflection: "Une personne qui ne connaît pas votre secteur comprendrait-elle votre valeur ajoutée ?"
  },
  "behavior-1-foundation": {
    objective: "Décrire un conflit professionnel sans désigner de coupable.",
    context: "En entretien comportemental, le recruteur demande comment vous avez géré un désaccord avec un collègue.",
    methodology: "Situation factuelle → point de divergence → écoute → solution → apprentissage. Distinguez les faits de vos interprétations.",
    evidence: ["Le désaccord est expliqué sans jugement de valeur.", "Votre rôle et vos actions sont identifiables.", "La recherche de solution est explicite.", "L'apprentissage est formulé honnêtement."],
    pitfalls: ["Présenter l'autre personne comme le problème.", "Décrire une victoire personnelle plutôt qu'une résolution.", "Omettre ce qui a changé après le conflit."],
    example: "Nous avions des priorités différentes pour une livraison. J'ai proposé de clarifier les contraintes de chacun avec notre responsable de projet. Nous avons identifié un périmètre commun, puis revu le calendrier. J’ai appris à clarifier les contraintes de chacun avant qu’un désaccord ne s’installe.",
    reflection: "Votre récit donne-t-il des preuves de coopération et de responsabilité ?"
  },
  "structure-1-foundation": {
    objective: "Raconter une situation en suivant quatre étapes distinctes.",
    context: "Le recruteur souhaite un exemple de problème résolu dans vos études ou au travail.",
    methodology: "STAR : Situation (contexte), Tâche (responsabilité), Action (contribution personnelle), Résultat (conséquence observable).",
    evidence: ["La situation de départ est compréhensible.", "La responsabilité est identifiée.", "Les actions personnelles sont spécifiques.", "Le résultat est factuel, même non chiffré."],
    pitfalls: ["Confondre actions collectives et contribution personnelle.", "Décrire longuement le contexte sans résultat.", "Inventer un pourcentage ou une performance."],
    example: "Dans un projet de groupe, nous recevions les informations trop tard (S). Je devais fluidifier la coordination (T). J'ai mis en place un point hebdomadaire et un tableau des tâches (A). L'équipe a pu livrer son dossier dans les délais (R).",
    reflection: "Si vous surlignez chaque phrase, retrouvez-vous bien S, T, A et R ?"
  }
};
export function premiumGuide(exercise: Exercise): PremiumGuide | null {
  return guides[exercise.id] ?? null;
}
