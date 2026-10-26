export type Scenario={title:string;family:"rh"|"technical";jobTitle:string;context:string;interviewPersona:string;goals:string[];suggestedQuestions:string[];domain?:string};
const roles:Record<string,string[]>={
"Ressources humaines":["Talent Acquisition Specialist","HR Business Partner","Responsable RH","Learning & Development Manager"],
"Technologie & Data":["Software Engineer","Data Analyst","Data Engineer","Cloud & DevOps Engineer","Cybersecurity Analyst","QA Engineer"],
"Finance & Audit":["Financial Analyst","Contrôleur de gestion","Auditeur interne","Comptable"],
"Business & Marketing":["Business Developer","Account Manager","Digital Marketing Specialist","Product Manager"],
"Management & Conseil":["Project Manager","Business Analyst","Consultant en stratégie","Operations Manager"],
"Ingénierie & Industrie":["Industrial Engineer","Quality Manager","Supply Chain Analyst","Maintenance Engineer"],
"Service & Relation client":["Customer Success Manager","Customer Support Specialist","Responsable service client"],
"Début de carrière":["Stage PFE","Premier emploi","Graduate Program"]
};
const technical=/Software|Data |Cloud|Cyber|QA |Engineer|Analyst|Audit|Comptable|Contrôleur|Maintenance|Supply Chain/;
export const domains=Object.keys(roles);
export const roleCatalog=Object.entries(roles).flatMap(([domain,names])=>names.map(name=>({name,domain})));
export const templates:Scenario[]=[
 {title:"Entretien final RH",family:"rh",jobTitle:"Poste à préciser",context:"Entretien final avec une DRH : motivation, qualités, axes d’amélioration, valeurs et projection.",interviewPersona:"Directrice RH",goals:["answer_structure","communication"],suggestedQuestions:["Qu’est-ce qui vous motive dans cette opportunité ?","Quelle difficulté vous a fait progresser ?","Décrivez un désaccord que vous avez résolu."]},
 {title:"Entretien avec un manager",family:"rh",jobTitle:"Poste à préciser",context:"Échange avec un manager : réalisations, priorisation, collaboration, leadership et prise de décision.",interviewPersona:"Manager recruteur",goals:["answer_structure","confidence"],suggestedQuestions:["Quelle réalisation illustre le mieux votre impact ?","Comment arbitrez-vous deux priorités concurrentes ?","Que feriez-vous différemment sur un projet passé ?"]},
 {title:"Entretien technique",family:"technical",jobTitle:"Poste technique à préciser",context:"Entretien technique portant sur la maîtrise métier, le raisonnement et les choix de résolution.",interviewPersona:"Expert technique",goals:["domain_knowledge","communication"],suggestedQuestions:["Décrivez un problème technique complexe que vous avez résolu.","Quels compromis avez-vous envisagés ?","Comment avez-vous vérifié votre solution ?"]},
 {title:"Premier emploi ou stage",family:"rh",jobTitle:"Poste à préciser",context:"Premier entretien : motivation, apprentissage, projet académique et travail en équipe.",interviewPersona:"Chargé de recrutement",goals:["confidence","answer_structure"],suggestedQuestions:["Présentez votre parcours.","Quel projet vous a le plus appris ?","Pourquoi ce premier poste ?"]}
];
export function scenarioForRole(name:string,domain:string):Scenario{
 const family=technical.test(name)?"technical":"rh";
 return {title:`Entretien · ${name}`,family,jobTitle:name,domain,context:`Préparation pour le poste de ${name} dans le domaine ${domain}. Explorer les compétences, exemples et motivations en rapport avec ce rôle.`,interviewPersona:family==="technical"?"Expert métier et manager recruteur":"Manager recruteur",goals:family==="technical"?["domain_knowledge","communication"]:["answer_structure","confidence"],suggestedQuestions:[`Quelles expériences vous préparent au poste de ${name} ?`,"Décrivez une situation professionnelle complexe et vos actions.","Quel résultat concret avez-vous obtenu et qu’en avez-vous appris ?"]};
}
