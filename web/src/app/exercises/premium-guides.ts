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
const a2Guides: Record<string, PremiumGuide> = {
  "pitch-1-foundation": {
    "objective": "Un fil professionnel identifiable — découverte.",
    "context": "Situation de pratique : Présentez votre parcours en 60 secondes sans réciter votre CV. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "La progression relie passé utile, contribution actuelle et ambition. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un fil professionnel identifiable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Se présenter en 60 secondes ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Une chronologie exhaustive cache la valeur créée.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : la progression relie passé utile, contribution actuelle et ambition.",
    "reflection": "Qu'est-ce que le recruteur doit retenir de vous ?"
  },
  "pitch-1-practice": {
    "objective": "Un fil professionnel identifiable — approfondissement.",
    "context": "Situation de pratique : Présentez votre parcours en 60 secondes sans réciter votre CV. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "La progression relie passé utile, contribution actuelle et ambition. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un fil professionnel identifiable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Se présenter en 60 secondes ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Une chronologie exhaustive cache la valeur créée.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : la progression relie passé utile, contribution actuelle et ambition.",
    "reflection": "Qu'est-ce que le recruteur doit retenir de vous ?"
  },
  "pitch-1-challenge": {
    "objective": "Un fil professionnel identifiable — challenge.",
    "context": "Situation de pratique : Présentez votre parcours en 60 secondes sans réciter votre CV. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "La progression relie passé utile, contribution actuelle et ambition. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un fil professionnel identifiable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Se présenter en 60 secondes ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Une chronologie exhaustive cache la valeur créée.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : la progression relie passé utile, contribution actuelle et ambition.",
    "reflection": "Qu'est-ce que le recruteur doit retenir de vous ?"
  },
  "pitch-2-foundation": {
    "objective": "Trois transitions justifiées — découverte.",
    "context": "Situation de pratique : Racontez votre évolution professionnelle en trois étapes cohérentes. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Chaque changement est motivé par un apprentissage ou une responsabilité. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : trois transitions justifiées.",
      "Le candidat apporte un élément concret et vérifiable lié à « Présenter son parcours en trois actes ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Ne raconter que des dates et des intitulés.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : chaque changement est motivé par un apprentissage ou une responsabilité.",
    "reflection": "Quel lien causal unit les étapes de votre parcours ?"
  },
  "pitch-2-practice": {
    "objective": "Trois transitions justifiées — approfondissement.",
    "context": "Situation de pratique : Racontez votre évolution professionnelle en trois étapes cohérentes. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Chaque changement est motivé par un apprentissage ou une responsabilité. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : trois transitions justifiées.",
      "Le candidat apporte un élément concret et vérifiable lié à « Présenter son parcours en trois actes ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Ne raconter que des dates et des intitulés.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : chaque changement est motivé par un apprentissage ou une responsabilité.",
    "reflection": "Quel lien causal unit les étapes de votre parcours ?"
  },
  "pitch-2-challenge": {
    "objective": "Trois transitions justifiées — challenge.",
    "context": "Situation de pratique : Racontez votre évolution professionnelle en trois étapes cohérentes. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Chaque changement est motivé par un apprentissage ou une responsabilité. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : trois transitions justifiées.",
      "Le candidat apporte un élément concret et vérifiable lié à « Présenter son parcours en trois actes ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Ne raconter que des dates et des intitulés.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : chaque changement est motivé par un apprentissage ou une responsabilité.",
    "reflection": "Quel lien causal unit les étapes de votre parcours ?"
  },
  "pitch-3-foundation": {
    "objective": "Des compétences transférables prouvées — découverte.",
    "context": "Situation de pratique : Expliquez ce qui motive votre réorientation et les compétences transférables. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Montrer ce qui reste pertinent dans le nouveau domaine. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : des compétences transférables prouvées.",
      "Le candidat apporte un élément concret et vérifiable lié à « Expliquer un changement de carrière ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la réorientation comme une fuite du précédent métier.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : montrer ce qui reste pertinent dans le nouveau domaine.",
    "reflection": "Quelle preuve montre que vous pouvez réussir la transition ?"
  },
  "pitch-3-practice": {
    "objective": "Des compétences transférables prouvées — approfondissement.",
    "context": "Situation de pratique : Expliquez ce qui motive votre réorientation et les compétences transférables. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Montrer ce qui reste pertinent dans le nouveau domaine. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : des compétences transférables prouvées.",
      "Le candidat apporte un élément concret et vérifiable lié à « Expliquer un changement de carrière ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la réorientation comme une fuite du précédent métier.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : montrer ce qui reste pertinent dans le nouveau domaine.",
    "reflection": "Quelle preuve montre que vous pouvez réussir la transition ?"
  },
  "pitch-3-challenge": {
    "objective": "Des compétences transférables prouvées — challenge.",
    "context": "Situation de pratique : Expliquez ce qui motive votre réorientation et les compétences transférables. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Montrer ce qui reste pertinent dans le nouveau domaine. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : des compétences transférables prouvées.",
      "Le candidat apporte un élément concret et vérifiable lié à « Expliquer un changement de carrière ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la réorientation comme une fuite du précédent métier.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : montrer ce qui reste pertinent dans le nouveau domaine.",
    "reflection": "Quelle preuve montre que vous pouvez réussir la transition ?"
  },
  "pitch-4-foundation": {
    "objective": "Une proposition de valeur concrète — découverte.",
    "context": "Situation de pratique : Formulez votre proposition de valeur professionnelle en deux phrases. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Associer un point fort à un problème que l'employeur rencontre. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une proposition de valeur concrète.",
      "Le candidat apporte un élément concret et vérifiable lié à « Créer une accroche mémorable ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Employer une formule impressionnante mais vide.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : associer un point fort à un problème que l'employeur rencontre.",
    "reflection": "Votre accroche pourrait-elle être utilisée par n'importe quel candidat ?"
  },
  "pitch-4-practice": {
    "objective": "Une proposition de valeur concrète — approfondissement.",
    "context": "Situation de pratique : Formulez votre proposition de valeur professionnelle en deux phrases. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Associer un point fort à un problème que l'employeur rencontre. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une proposition de valeur concrète.",
      "Le candidat apporte un élément concret et vérifiable lié à « Créer une accroche mémorable ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Employer une formule impressionnante mais vide.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : associer un point fort à un problème que l'employeur rencontre.",
    "reflection": "Votre accroche pourrait-elle être utilisée par n'importe quel candidat ?"
  },
  "pitch-4-challenge": {
    "objective": "Une proposition de valeur concrète — challenge.",
    "context": "Situation de pratique : Formulez votre proposition de valeur professionnelle en deux phrases. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Associer un point fort à un problème que l'employeur rencontre. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une proposition de valeur concrète.",
      "Le candidat apporte un élément concret et vérifiable lié à « Créer une accroche mémorable ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Employer une formule impressionnante mais vide.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : associer un point fort à un problème que l'employeur rencontre.",
    "reflection": "Votre accroche pourrait-elle être utilisée par n'importe quel candidat ?"
  },
  "pitch-5-foundation": {
    "objective": "Une réalisation vérifiable — découverte.",
    "context": "Situation de pratique : Présentez une réussite dont vous êtes fier sans surestimer votre rôle. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Distinguer contexte, contribution personnelle et conséquence. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une réalisation vérifiable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Parler de sa principale réussite ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "S'attribuer l'intégralité du travail collectif.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : distinguer contexte, contribution personnelle et conséquence.",
    "reflection": "Quels faits permettraient de vérifier votre rôle ?"
  },
  "pitch-5-practice": {
    "objective": "Une réalisation vérifiable — approfondissement.",
    "context": "Situation de pratique : Présentez une réussite dont vous êtes fier sans surestimer votre rôle. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Distinguer contexte, contribution personnelle et conséquence. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une réalisation vérifiable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Parler de sa principale réussite ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "S'attribuer l'intégralité du travail collectif.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : distinguer contexte, contribution personnelle et conséquence.",
    "reflection": "Quels faits permettraient de vérifier votre rôle ?"
  },
  "pitch-5-challenge": {
    "objective": "Une réalisation vérifiable — challenge.",
    "context": "Situation de pratique : Présentez une réussite dont vous êtes fier sans surestimer votre rôle. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Distinguer contexte, contribution personnelle et conséquence. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une réalisation vérifiable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Parler de sa principale réussite ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "S'attribuer l'intégralité du travail collectif.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : distinguer contexte, contribution personnelle et conséquence.",
    "reflection": "Quels faits permettraient de vérifier votre rôle ?"
  },
  "pitch-6-foundation": {
    "objective": "Une période expliquée sans excès — découverte.",
    "context": "Situation de pratique : Expliquez une période sans emploi de façon factuelle et constructive. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Présenter les faits, les acquis éventuels et la disponibilité actuelle. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une période expliquée sans excès.",
      "Le candidat apporte un élément concret et vérifiable lié à « Présenter un trou dans le CV ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Fournir des détails intimes non nécessaires.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : présenter les faits, les acquis éventuels et la disponibilité actuelle.",
    "reflection": "Votre explication est-elle factuelle et suffisamment brève ?"
  },
  "pitch-6-practice": {
    "objective": "Une période expliquée sans excès — approfondissement.",
    "context": "Situation de pratique : Expliquez une période sans emploi de façon factuelle et constructive. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Présenter les faits, les acquis éventuels et la disponibilité actuelle. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une période expliquée sans excès.",
      "Le candidat apporte un élément concret et vérifiable lié à « Présenter un trou dans le CV ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Fournir des détails intimes non nécessaires.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : présenter les faits, les acquis éventuels et la disponibilité actuelle.",
    "reflection": "Votre explication est-elle factuelle et suffisamment brève ?"
  },
  "pitch-6-challenge": {
    "objective": "Une période expliquée sans excès — challenge.",
    "context": "Situation de pratique : Expliquez une période sans emploi de façon factuelle et constructive. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Présenter les faits, les acquis éventuels et la disponibilité actuelle. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une période expliquée sans excès.",
      "Le candidat apporte un élément concret et vérifiable lié à « Présenter un trou dans le CV ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Fournir des détails intimes non nécessaires.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : présenter les faits, les acquis éventuels et la disponibilité actuelle.",
    "reflection": "Votre explication est-elle factuelle et suffisamment brève ?"
  },
  "pitch-7-foundation": {
    "objective": "Une candidature adaptée — découverte.",
    "context": "Situation de pratique : Présentez-vous comme candidat à un poste précis avec deux arguments pertinents. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Relier deux attentes du poste à deux éléments du parcours. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une candidature adaptée.",
      "Le candidat apporte un élément concret et vérifiable lié à « Adapter son pitch au poste ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Réciter un argument générique pour chaque employeur.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : relier deux attentes du poste à deux éléments du parcours.",
    "reflection": "Les exemples correspondent-ils vraiment au poste ?"
  },
  "pitch-7-practice": {
    "objective": "Une candidature adaptée — approfondissement.",
    "context": "Situation de pratique : Présentez-vous comme candidat à un poste précis avec deux arguments pertinents. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Relier deux attentes du poste à deux éléments du parcours. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une candidature adaptée.",
      "Le candidat apporte un élément concret et vérifiable lié à « Adapter son pitch au poste ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Réciter un argument générique pour chaque employeur.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : relier deux attentes du poste à deux éléments du parcours.",
    "reflection": "Les exemples correspondent-ils vraiment au poste ?"
  },
  "pitch-7-challenge": {
    "objective": "Une candidature adaptée — challenge.",
    "context": "Situation de pratique : Présentez-vous comme candidat à un poste précis avec deux arguments pertinents. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Relier deux attentes du poste à deux éléments du parcours. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une candidature adaptée.",
      "Le candidat apporte un élément concret et vérifiable lié à « Adapter son pitch au poste ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Réciter un argument générique pour chaque employeur.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : relier deux attentes du poste à deux éléments du parcours.",
    "reflection": "Les exemples correspondent-ils vraiment au poste ?"
  },
  "pitch-8-foundation": {
    "objective": "Une conclusion tournée vers la mission — découverte.",
    "context": "Situation de pratique : Terminez votre présentation en reliant votre parcours au besoin du recruteur. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Faire converger votre expérience et le besoin du recruteur. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une conclusion tournée vers la mission.",
      "Le candidat apporte un élément concret et vérifiable lié à « Conclure sa présentation ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Clore par une banalité sans lien avec le poste.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : faire converger votre expérience et le besoin du recruteur.",
    "reflection": "La dernière phrase donne-t-elle une raison de poursuivre l'échange ?"
  },
  "pitch-8-practice": {
    "objective": "Une conclusion tournée vers la mission — approfondissement.",
    "context": "Situation de pratique : Terminez votre présentation en reliant votre parcours au besoin du recruteur. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Faire converger votre expérience et le besoin du recruteur. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une conclusion tournée vers la mission.",
      "Le candidat apporte un élément concret et vérifiable lié à « Conclure sa présentation ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Clore par une banalité sans lien avec le poste.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : faire converger votre expérience et le besoin du recruteur.",
    "reflection": "La dernière phrase donne-t-elle une raison de poursuivre l'échange ?"
  },
  "pitch-8-challenge": {
    "objective": "Une conclusion tournée vers la mission — challenge.",
    "context": "Situation de pratique : Terminez votre présentation en reliant votre parcours au besoin du recruteur. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Faire converger votre expérience et le besoin du recruteur. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une conclusion tournée vers la mission.",
      "Le candidat apporte un élément concret et vérifiable lié à « Conclure sa présentation ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Clore par une banalité sans lien avec le poste.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : faire converger votre expérience et le besoin du recruteur.",
    "reflection": "La dernière phrase donne-t-elle une raison de poursuivre l'échange ?"
  },
  "communication-1-foundation": {
    "objective": "Un vocabulaire accessible — découverte.",
    "context": "Situation de pratique : Expliquez votre activité à une personne qui ne connaît pas votre métier. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Expliquer problème, action et valeur à une personne hors métier. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un vocabulaire accessible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Parler avec précision ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Accumuler des sigles ou des noms d'outils.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : expliquer problème, action et valeur à une personne hors métier.",
    "reflection": "Une personne non spécialiste pourrait-elle expliquer votre rôle ?"
  },
  "communication-1-practice": {
    "objective": "Un vocabulaire accessible — approfondissement.",
    "context": "Situation de pratique : Expliquez votre activité à une personne qui ne connaît pas votre métier. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Expliquer problème, action et valeur à une personne hors métier. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un vocabulaire accessible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Parler avec précision ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Accumuler des sigles ou des noms d'outils.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : expliquer problème, action et valeur à une personne hors métier.",
    "reflection": "Une personne non spécialiste pourrait-elle expliquer votre rôle ?"
  },
  "communication-1-challenge": {
    "objective": "Un vocabulaire accessible — challenge.",
    "context": "Situation de pratique : Expliquez votre activité à une personne qui ne connaît pas votre métier. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Expliquer problème, action et valeur à une personne hors métier. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un vocabulaire accessible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Parler avec précision ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Accumuler des sigles ou des noms d'outils.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : expliquer problème, action et valeur à une personne hors métier.",
    "reflection": "Une personne non spécialiste pourrait-elle expliquer votre rôle ?"
  },
  "communication-2-foundation": {
    "objective": "Un rythme audible — découverte.",
    "context": "Situation de pratique : Présentez une idée en prévoyant deux pauses pour structurer votre discours. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Utiliser de vraies pauses entre idée, preuve et conclusion. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un rythme audible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Faire une pause utile ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Parler sans respirer ou forcer une vitesse artificielle.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : utiliser de vraies pauses entre idée, preuve et conclusion.",
    "reflection": "Les idées clés sont-elles facilement repérables à l'oral ?"
  },
  "communication-2-practice": {
    "objective": "Un rythme audible — approfondissement.",
    "context": "Situation de pratique : Présentez une idée en prévoyant deux pauses pour structurer votre discours. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Utiliser de vraies pauses entre idée, preuve et conclusion. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un rythme audible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Faire une pause utile ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Parler sans respirer ou forcer une vitesse artificielle.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : utiliser de vraies pauses entre idée, preuve et conclusion.",
    "reflection": "Les idées clés sont-elles facilement repérables à l'oral ?"
  },
  "communication-2-challenge": {
    "objective": "Un rythme audible — challenge.",
    "context": "Situation de pratique : Présentez une idée en prévoyant deux pauses pour structurer votre discours. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Utiliser de vraies pauses entre idée, preuve et conclusion. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un rythme audible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Faire une pause utile ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Parler sans respirer ou forcer une vitesse artificielle.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : utiliser de vraies pauses entre idée, preuve et conclusion.",
    "reflection": "Les idées clés sont-elles facilement repérables à l'oral ?"
  },
  "communication-3-foundation": {
    "objective": "Un bénéfice compréhensible — découverte.",
    "context": "Situation de pratique : Traduisez une réalisation technique en bénéfice métier compréhensible. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Remplacer les noms d'outils par ce qu'ils permettent de résoudre. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un bénéfice compréhensible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Éviter le jargon ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Confondre expertise et accumulation de jargon.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : remplacer les noms d'outils par ce qu'ils permettent de résoudre.",
    "reflection": "Quelle conséquence concrète le destinataire comprend-il ?"
  },
  "communication-3-practice": {
    "objective": "Un bénéfice compréhensible — approfondissement.",
    "context": "Situation de pratique : Traduisez une réalisation technique en bénéfice métier compréhensible. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Remplacer les noms d'outils par ce qu'ils permettent de résoudre. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un bénéfice compréhensible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Éviter le jargon ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Confondre expertise et accumulation de jargon.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : remplacer les noms d'outils par ce qu'ils permettent de résoudre.",
    "reflection": "Quelle conséquence concrète le destinataire comprend-il ?"
  },
  "communication-3-challenge": {
    "objective": "Un bénéfice compréhensible — challenge.",
    "context": "Situation de pratique : Traduisez une réalisation technique en bénéfice métier compréhensible. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Remplacer les noms d'outils par ce qu'ils permettent de résoudre. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un bénéfice compréhensible.",
      "Le candidat apporte un élément concret et vérifiable lié à « Éviter le jargon ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Confondre expertise et accumulation de jargon.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : remplacer les noms d'outils par ce qu'ils permettent de résoudre.",
    "reflection": "Quelle conséquence concrète le destinataire comprend-il ?"
  },
  "communication-4-foundation": {
    "objective": "Une correction respectueuse — découverte.",
    "context": "Situation de pratique : Corrigez poliment une affirmation inexacte formulée par un recruteur. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Reconnaître le point exprimé, préciser les faits et proposer une clarification. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une correction respectueuse.",
      "Le candidat apporte un élément concret et vérifiable lié à « Répondre avec tact ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Mettre l'interlocuteur en défaut.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : reconnaître le point exprimé, préciser les faits et proposer une clarification.",
    "reflection": "Avez-vous préservé la qualité du dialogue ?"
  },
  "communication-4-practice": {
    "objective": "Une correction respectueuse — approfondissement.",
    "context": "Situation de pratique : Corrigez poliment une affirmation inexacte formulée par un recruteur. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Reconnaître le point exprimé, préciser les faits et proposer une clarification. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une correction respectueuse.",
      "Le candidat apporte un élément concret et vérifiable lié à « Répondre avec tact ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Mettre l'interlocuteur en défaut.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : reconnaître le point exprimé, préciser les faits et proposer une clarification.",
    "reflection": "Avez-vous préservé la qualité du dialogue ?"
  },
  "communication-4-challenge": {
    "objective": "Une correction respectueuse — challenge.",
    "context": "Situation de pratique : Corrigez poliment une affirmation inexacte formulée par un recruteur. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Reconnaître le point exprimé, préciser les faits et proposer une clarification. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une correction respectueuse.",
      "Le candidat apporte un élément concret et vérifiable lié à « Répondre avec tact ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Mettre l'interlocuteur en défaut.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : reconnaître le point exprimé, préciser les faits et proposer une clarification.",
    "reflection": "Avez-vous préservé la qualité du dialogue ?"
  },
  "communication-5-foundation": {
    "objective": "Une reprise cohérente — découverte.",
    "context": "Situation de pratique : Reprenez naturellement une réponse après une interruption. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Rappeler brièvement l'idée en cours puis poursuivre. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une reprise cohérente.",
      "Le candidat apporte un élément concret et vérifiable lié à « Gérer une interruption ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Recommencer la réponse entière après une interruption.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : rappeler brièvement l'idée en cours puis poursuivre.",
    "reflection": "La reprise reste-t-elle naturelle et pertinente ?"
  },
  "communication-5-practice": {
    "objective": "Une reprise cohérente — approfondissement.",
    "context": "Situation de pratique : Reprenez naturellement une réponse après une interruption. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Rappeler brièvement l'idée en cours puis poursuivre. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une reprise cohérente.",
      "Le candidat apporte un élément concret et vérifiable lié à « Gérer une interruption ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Recommencer la réponse entière après une interruption.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : rappeler brièvement l'idée en cours puis poursuivre.",
    "reflection": "La reprise reste-t-elle naturelle et pertinente ?"
  },
  "communication-5-challenge": {
    "objective": "Une reprise cohérente — challenge.",
    "context": "Situation de pratique : Reprenez naturellement une réponse après une interruption. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Rappeler brièvement l'idée en cours puis poursuivre. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une reprise cohérente.",
      "Le candidat apporte un élément concret et vérifiable lié à « Gérer une interruption ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Recommencer la réponse entière après une interruption.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : rappeler brièvement l'idée en cours puis poursuivre.",
    "reflection": "La reprise reste-t-elle naturelle et pertinente ?"
  },
  "communication-6-foundation": {
    "objective": "Une conviction étayée — découverte.",
    "context": "Situation de pratique : Défendez une proposition en variant exemples et raisonnement. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Associer avis personnel, preuve et réserve raisonnable. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une conviction étayée.",
      "Le candidat apporte un élément concret et vérifiable lié à « Argumenter sans réciter ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Affirmer avec force sans démontrer.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : associer avis personnel, preuve et réserve raisonnable.",
    "reflection": "Quel argument pourrait convaincre un contradicteur de bonne foi ?"
  },
  "communication-6-practice": {
    "objective": "Une conviction étayée — approfondissement.",
    "context": "Situation de pratique : Défendez une proposition en variant exemples et raisonnement. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Associer avis personnel, preuve et réserve raisonnable. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une conviction étayée.",
      "Le candidat apporte un élément concret et vérifiable lié à « Argumenter sans réciter ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Affirmer avec force sans démontrer.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : associer avis personnel, preuve et réserve raisonnable.",
    "reflection": "Quel argument pourrait convaincre un contradicteur de bonne foi ?"
  },
  "communication-6-challenge": {
    "objective": "Une conviction étayée — challenge.",
    "context": "Situation de pratique : Défendez une proposition en variant exemples et raisonnement. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Associer avis personnel, preuve et réserve raisonnable. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une conviction étayée.",
      "Le candidat apporte un élément concret et vérifiable lié à « Argumenter sans réciter ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Affirmer avec force sans démontrer.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : associer avis personnel, preuve et réserve raisonnable.",
    "reflection": "Quel argument pourrait convaincre un contradicteur de bonne foi ?"
  },
  "communication-7-foundation": {
    "objective": "Un désaccord constructif — découverte.",
    "context": "Situation de pratique : Formulez un désaccord professionnel sans confrontation. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Formuler la divergence, le fondement et une option alternative. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un désaccord constructif.",
      "Le candidat apporte un élément concret et vérifiable lié à « Exprimer un désaccord ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Personnaliser la critique.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : formuler la divergence, le fondement et une option alternative.",
    "reflection": "Votre proposition ouvre-t-elle une discussion utile ?"
  },
  "communication-7-practice": {
    "objective": "Un désaccord constructif — approfondissement.",
    "context": "Situation de pratique : Formulez un désaccord professionnel sans confrontation. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Formuler la divergence, le fondement et une option alternative. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un désaccord constructif.",
      "Le candidat apporte un élément concret et vérifiable lié à « Exprimer un désaccord ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Personnaliser la critique.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : formuler la divergence, le fondement et une option alternative.",
    "reflection": "Votre proposition ouvre-t-elle une discussion utile ?"
  },
  "communication-7-challenge": {
    "objective": "Un désaccord constructif — challenge.",
    "context": "Situation de pratique : Formulez un désaccord professionnel sans confrontation. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Formuler la divergence, le fondement et une option alternative. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un désaccord constructif.",
      "Le candidat apporte un élément concret et vérifiable lié à « Exprimer un désaccord ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Personnaliser la critique.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : formuler la divergence, le fondement et une option alternative.",
    "reflection": "Votre proposition ouvre-t-elle une discussion utile ?"
  },
  "communication-8-foundation": {
    "objective": "Une synthèse mémorable — découverte.",
    "context": "Situation de pratique : Résumez le message principal d'une réponse en une phrase mémorable. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Choisir une conclusion courte fidèle à l'argument développé. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une synthèse mémorable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Conclure en une phrase ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Introduire une idée nouvelle dans la conclusion.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : choisir une conclusion courte fidèle à l'argument développé.",
    "reflection": "Que retiendra-t-on dix minutes plus tard ?"
  },
  "communication-8-practice": {
    "objective": "Une synthèse mémorable — approfondissement.",
    "context": "Situation de pratique : Résumez le message principal d'une réponse en une phrase mémorable. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Choisir une conclusion courte fidèle à l'argument développé. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une synthèse mémorable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Conclure en une phrase ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Introduire une idée nouvelle dans la conclusion.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : choisir une conclusion courte fidèle à l'argument développé.",
    "reflection": "Que retiendra-t-on dix minutes plus tard ?"
  },
  "communication-8-challenge": {
    "objective": "Une synthèse mémorable — challenge.",
    "context": "Situation de pratique : Résumez le message principal d'une réponse en une phrase mémorable. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Choisir une conclusion courte fidèle à l'argument développé. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une synthèse mémorable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Conclure en une phrase ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Introduire une idée nouvelle dans la conclusion.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : choisir une conclusion courte fidèle à l'argument développé.",
    "reflection": "Que retiendra-t-on dix minutes plus tard ?"
  },
  "behavior-1-foundation": {
    "objective": "Une résolution collaborative — découverte.",
    "context": "Situation de pratique : Racontez un désaccord avec un collègue et la façon dont il a été résolu. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Présenter les intérêts opposés, votre écoute et un résultat réel. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une résolution collaborative.",
      "Le candidat apporte un élément concret et vérifiable lié à « Résoudre un conflit ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Mettre un collègue en accusation.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : présenter les intérêts opposés, votre écoute et un résultat réel.",
    "reflection": "Comment avez-vous aidé à rétablir la coopération ?"
  },
  "behavior-1-practice": {
    "objective": "Une résolution collaborative — approfondissement.",
    "context": "Situation de pratique : Racontez un désaccord avec un collègue et la façon dont il a été résolu. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Présenter les intérêts opposés, votre écoute et un résultat réel. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une résolution collaborative.",
      "Le candidat apporte un élément concret et vérifiable lié à « Résoudre un conflit ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Mettre un collègue en accusation.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : présenter les intérêts opposés, votre écoute et un résultat réel.",
    "reflection": "Comment avez-vous aidé à rétablir la coopération ?"
  },
  "behavior-1-challenge": {
    "objective": "Une résolution collaborative — challenge.",
    "context": "Situation de pratique : Racontez un désaccord avec un collègue et la façon dont il a été résolu. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Présenter les intérêts opposés, votre écoute et un résultat réel. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une résolution collaborative.",
      "Le candidat apporte un élément concret et vérifiable lié à « Résoudre un conflit ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Mettre un collègue en accusation.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : présenter les intérêts opposés, votre écoute et un résultat réel.",
    "reflection": "Comment avez-vous aidé à rétablir la coopération ?"
  },
  "behavior-2-foundation": {
    "objective": "Une contribution transversale — découverte.",
    "context": "Situation de pratique : Illustrez une réussite impliquant plusieurs équipes. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Identifier responsabilités partagées et coordination effective. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une contribution transversale.",
      "Le candidat apporte un élément concret et vérifiable lié à « Collaborer en transversal ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la réunion comme une réalisation suffisante.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : identifier responsabilités partagées et coordination effective.",
    "reflection": "Quelle action concrète a amélioré la collaboration ?"
  },
  "behavior-2-practice": {
    "objective": "Une contribution transversale — approfondissement.",
    "context": "Situation de pratique : Illustrez une réussite impliquant plusieurs équipes. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Identifier responsabilités partagées et coordination effective. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une contribution transversale.",
      "Le candidat apporte un élément concret et vérifiable lié à « Collaborer en transversal ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la réunion comme une réalisation suffisante.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : identifier responsabilités partagées et coordination effective.",
    "reflection": "Quelle action concrète a amélioré la collaboration ?"
  },
  "behavior-2-challenge": {
    "objective": "Une contribution transversale — challenge.",
    "context": "Situation de pratique : Illustrez une réussite impliquant plusieurs équipes. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Identifier responsabilités partagées et coordination effective. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une contribution transversale.",
      "Le candidat apporte un élément concret et vérifiable lié à « Collaborer en transversal ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la réunion comme une réalisation suffisante.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : identifier responsabilités partagées et coordination effective.",
    "reflection": "Quelle action concrète a amélioré la collaboration ?"
  },
  "behavior-3-foundation": {
    "objective": "Un feedback transformé en action — découverte.",
    "context": "Situation de pratique : Expliquez un retour critique et ce que vous en avez fait. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Citer un retour précis, votre réaction et le changement produit. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un feedback transformé en action.",
      "Le candidat apporte un élément concret et vérifiable lié à « Recevoir un feedback difficile ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Se défendre sans analyser le message.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : citer un retour précis, votre réaction et le changement produit.",
    "reflection": "Quel comportement avez-vous réellement changé ?"
  },
  "behavior-3-practice": {
    "objective": "Un feedback transformé en action — approfondissement.",
    "context": "Situation de pratique : Expliquez un retour critique et ce que vous en avez fait. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Citer un retour précis, votre réaction et le changement produit. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un feedback transformé en action.",
      "Le candidat apporte un élément concret et vérifiable lié à « Recevoir un feedback difficile ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Se défendre sans analyser le message.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : citer un retour précis, votre réaction et le changement produit.",
    "reflection": "Quel comportement avez-vous réellement changé ?"
  },
  "behavior-3-challenge": {
    "objective": "Un feedback transformé en action — challenge.",
    "context": "Situation de pratique : Expliquez un retour critique et ce que vous en avez fait. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Citer un retour précis, votre réaction et le changement produit. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un feedback transformé en action.",
      "Le candidat apporte un élément concret et vérifiable lié à « Recevoir un feedback difficile ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Se défendre sans analyser le message.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : citer un retour précis, votre réaction et le changement produit.",
    "reflection": "Quel comportement avez-vous réellement changé ?"
  },
  "behavior-4-foundation": {
    "objective": "Une adaptation observable — découverte.",
    "context": "Situation de pratique : Décrivez une situation où vos priorités ont brusquement changé. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Montrer comment les priorités ont été revues et communiquées. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une adaptation observable.",
      "Le candidat apporte un élément concret et vérifiable lié à « S'adapter au changement ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Confondre agilité et improvisation permanente.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : montrer comment les priorités ont été revues et communiquées.",
    "reflection": "Quels compromis avez-vous explicités ?"
  },
  "behavior-4-practice": {
    "objective": "Une adaptation observable — approfondissement.",
    "context": "Situation de pratique : Décrivez une situation où vos priorités ont brusquement changé. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Montrer comment les priorités ont été revues et communiquées. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une adaptation observable.",
      "Le candidat apporte un élément concret et vérifiable lié à « S'adapter au changement ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Confondre agilité et improvisation permanente.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : montrer comment les priorités ont été revues et communiquées.",
    "reflection": "Quels compromis avez-vous explicités ?"
  },
  "behavior-4-challenge": {
    "objective": "Une adaptation observable — challenge.",
    "context": "Situation de pratique : Décrivez une situation où vos priorités ont brusquement changé. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Montrer comment les priorités ont été revues et communiquées. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une adaptation observable.",
      "Le candidat apporte un élément concret et vérifiable lié à « S'adapter au changement ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Confondre agilité et improvisation permanente.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : montrer comment les priorités ont été revues et communiquées.",
    "reflection": "Quels compromis avez-vous explicités ?"
  },
  "behavior-5-foundation": {
    "objective": "Une initiative utile — découverte.",
    "context": "Situation de pratique : Racontez une amélioration que vous avez proposée sans qu'on vous le demande. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Partir d'un besoin réel, décrire l'initiative et son effet. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une initiative utile.",
      "Le candidat apporte un élément concret et vérifiable lié à « Faire preuve d'initiative ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Vanter une idée non mise en oeuvre.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : partir d'un besoin réel, décrire l'initiative et son effet.",
    "reflection": "Qu'avez-vous fait sans attendre une instruction ?"
  },
  "behavior-5-practice": {
    "objective": "Une initiative utile — approfondissement.",
    "context": "Situation de pratique : Racontez une amélioration que vous avez proposée sans qu'on vous le demande. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Partir d'un besoin réel, décrire l'initiative et son effet. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une initiative utile.",
      "Le candidat apporte un élément concret et vérifiable lié à « Faire preuve d'initiative ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Vanter une idée non mise en oeuvre.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : partir d'un besoin réel, décrire l'initiative et son effet.",
    "reflection": "Qu'avez-vous fait sans attendre une instruction ?"
  },
  "behavior-5-challenge": {
    "objective": "Une initiative utile — challenge.",
    "context": "Situation de pratique : Racontez une amélioration que vous avez proposée sans qu'on vous le demande. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Partir d'un besoin réel, décrire l'initiative et son effet. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une initiative utile.",
      "Le candidat apporte un élément concret et vérifiable lié à « Faire preuve d'initiative ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Vanter une idée non mise en oeuvre.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : partir d'un besoin réel, décrire l'initiative et son effet.",
    "reflection": "Qu'avez-vous fait sans attendre une instruction ?"
  },
  "behavior-6-foundation": {
    "objective": "Un arbitrage éthique explicable — découverte.",
    "context": "Situation de pratique : Expliquez comment vous avez géré un dilemme professionnel. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Identifier les contraintes, les parties concernées et l'action responsable. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un arbitrage éthique explicable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Agir avec éthique ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la conformité comme optionnelle.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : identifier les contraintes, les parties concernées et l'action responsable.",
    "reflection": "Votre choix serait-il défendable devant les parties prenantes ?"
  },
  "behavior-6-practice": {
    "objective": "Un arbitrage éthique explicable — approfondissement.",
    "context": "Situation de pratique : Expliquez comment vous avez géré un dilemme professionnel. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Identifier les contraintes, les parties concernées et l'action responsable. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un arbitrage éthique explicable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Agir avec éthique ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la conformité comme optionnelle.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : identifier les contraintes, les parties concernées et l'action responsable.",
    "reflection": "Votre choix serait-il défendable devant les parties prenantes ?"
  },
  "behavior-6-challenge": {
    "objective": "Un arbitrage éthique explicable — challenge.",
    "context": "Situation de pratique : Expliquez comment vous avez géré un dilemme professionnel. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Identifier les contraintes, les parties concernées et l'action responsable. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un arbitrage éthique explicable.",
      "Le candidat apporte un élément concret et vérifiable lié à « Agir avec éthique ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Présenter la conformité comme optionnelle.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : identifier les contraintes, les parties concernées et l'action responsable.",
    "reflection": "Votre choix serait-il défendable devant les parties prenantes ?"
  },
  "behavior-7-foundation": {
    "objective": "Un apprentissage appliqué — découverte.",
    "context": "Situation de pratique : Présentez une compétence acquise pour résoudre un problème nouveau. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Relier nouvelle compétence, méthode d'apprentissage et application. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : un apprentissage appliqué.",
      "Le candidat apporte un élément concret et vérifiable lié à « Apprendre rapidement ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Énumérer des cours sans résultat pratique.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : relier nouvelle compétence, méthode d'apprentissage et application.",
    "reflection": "Qu'avez-vous pu faire après l'apprentissage ?"
  },
  "behavior-7-practice": {
    "objective": "Un apprentissage appliqué — approfondissement.",
    "context": "Situation de pratique : Présentez une compétence acquise pour résoudre un problème nouveau. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Relier nouvelle compétence, méthode d'apprentissage et application. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : un apprentissage appliqué.",
      "Le candidat apporte un élément concret et vérifiable lié à « Apprendre rapidement ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Énumérer des cours sans résultat pratique.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : relier nouvelle compétence, méthode d'apprentissage et application.",
    "reflection": "Qu'avez-vous pu faire après l'apprentissage ?"
  },
  "behavior-7-challenge": {
    "objective": "Un apprentissage appliqué — challenge.",
    "context": "Situation de pratique : Présentez une compétence acquise pour résoudre un problème nouveau. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Relier nouvelle compétence, méthode d'apprentissage et application. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : un apprentissage appliqué.",
      "Le candidat apporte un élément concret et vérifiable lié à « Apprendre rapidement ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Énumérer des cours sans résultat pratique.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : relier nouvelle compétence, méthode d'apprentissage et application.",
    "reflection": "Qu'avez-vous pu faire après l'apprentissage ?"
  },
  "behavior-8-foundation": {
    "objective": "Une entraide avec impact — découverte.",
    "context": "Situation de pratique : Donnez un exemple de soutien apporté à un pair. Identifiez une idée principale et ajoutez un exemple concret.",
    "methodology": "Décrire le besoin du collègue, votre soutien et son autonomie finale. Nommez un fait simple et expliquez votre contribution.",
    "evidence": [
      "La réponse démontre : une entraide avec impact.",
      "Le candidat apporte un élément concret et vérifiable lié à « Aider un collègue ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau découverte et à l'interlocuteur."
    ],
    "pitfalls": [
      "Se présenter comme le sauveur d'une équipe.",
      "Évitez d’ajouter des détails inutiles.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : décrire le besoin du collègue, votre soutien et son autonomie finale.",
    "reflection": "Comment avez-vous rendu le collègue plus autonome ?"
  },
  "behavior-8-practice": {
    "objective": "Une entraide avec impact — approfondissement.",
    "context": "Situation de pratique : Donnez un exemple de soutien apporté à un pair. Formulez une réponse structurée et justifiez votre raisonnement.",
    "methodology": "Décrire le besoin du collègue, votre soutien et son autonomie finale. Mobilisez un exemple précis, une preuve vérifiable et un lien au poste.",
    "evidence": [
      "La réponse démontre : une entraide avec impact.",
      "Le candidat apporte un élément concret et vérifiable lié à « Aider un collègue ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau approfondissement et à l'interlocuteur."
    ],
    "pitfalls": [
      "Se présenter comme le sauveur d'une équipe.",
      "Évitez les réponses génériques non adaptées au contexte.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : décrire le besoin du collègue, votre soutien et son autonomie finale.",
    "reflection": "Comment avez-vous rendu le collègue plus autonome ?"
  },
  "behavior-8-challenge": {
    "objective": "Une entraide avec impact — challenge.",
    "context": "Situation de pratique : Donnez un exemple de soutien apporté à un pair. Imaginez un recruteur exigeant : répondez avec précision puis anticipez une relance.",
    "methodology": "Décrire le besoin du collègue, votre soutien et son autonomie finale. Ajoutez une objection plausible du recruteur et montrez comment vous y répondez avec nuance.",
    "evidence": [
      "La réponse démontre : une entraide avec impact.",
      "Le candidat apporte un élément concret et vérifiable lié à « Aider un collègue ».",
      "La contribution personnelle est distinguée des actions collectives.",
      "Le raisonnement est adapté au niveau challenge et à l'interlocuteur."
    ],
    "pitfalls": [
      "Se présenter comme le sauveur d'une équipe.",
      "Évitez d’inventer une certitude ou un chiffre sous pression.",
      "Inventer des résultats ou des faits pour rendre l'exemple plus convaincant."
    ],
    "example": "Trame de réponse (à personnaliser, pas à réciter) : « Dans [situation précise], mon objectif était [but]. J'ai choisi [action personnelle] car [raison]. Le résultat observable a été [fait vérifiable]. Cela m'a appris [enseignement lié à la compétence]. » Pour cet atelier, vérifiez particulièrement : décrire le besoin du collègue, votre soutien et son autonomie finale.",
    "reflection": "Comment avez-vous rendu le collègue plus autonome ?"
  }
};

export function premiumGuide(exercise: Exercise): PremiumGuide | null {
  return guides[exercise.id] ?? a2Guides[exercise.id] ?? null;
}
