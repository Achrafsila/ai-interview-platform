import {paths,stepsForPath} from "./paths";

export type NeedKey="stress"|"structure"|"communication"|"technical"|"leadership"|"motivation"|"unknown";
type NeedRule={key:NeedKey;label:string;terms:RegExp;pathIds:string[];module:string};
const rules:NeedRule[]=[
 {key:"stress",label:"Gérer le stress en entretien",terms:/stress|angoiss|anxi|pression|panique|trac|peur|perd.{0,12}moyen|confiance|intimid|nerveu/i,pathIds:["stress","hard-questions","eloquence"],module:"confidence"},
 {key:"structure",label:"Structurer mes réponses",terms:/structur|star|réponse.{0,12}longue|synthès|organis.{0,12}idée/i,pathIds:["star","eloquence","behavioral"],module:"structure"},
 {key:"communication",label:"Mieux communiquer à l’oral",terms:/communi|oral|éloquen|articul|fluidit|exprimer|parler|clarté/i,pathIds:["eloquence","stress","behavioral"],module:"communication"},
 {key:"technical",label:"Renforcer l’argumentation métier",terms:/techni|data|développeur|code|cyber|devops|métier|expertis/i,pathIds:["data","engineering","graduate-tech"],module:"technical"},
 {key:"leadership",label:"Défendre mon leadership",terms:/leadership|manage|manager|équipe|délég|encadr/i,pathIds:["lead-first","promotion","senior-leader"],module:"leadership"},
 {key:"motivation",label:"Expliquer mes motivations",terms:/motivat|pourquoi ce poste|reconversion|changement de carrière/i,pathIds:["career-switch","first-job","internal-mobility"],module:"motivation"}
];
export function interpretNeed(text:string){
 const normalized=text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const matched=rules.find(r=>r.terms.test(normalized));
 return matched||null;
}
export function pedagogicalMatch(text:string,focus?:string){
 const need=interpretNeed(text+" "+(focus||""));
 if(!need)return {kind:"clarify" as const,question:"Sur quel aspect de vos entretiens souhaitez-vous progresser en priorité ?",options:["Gérer mon stress","Structurer mes réponses","Communiquer à l’oral","Approfondir les questions métier"]};
 const candidates=need.pathIds.map(id=>paths.find(p=>p.id===id)).filter((p):p is (typeof paths)[number]=>Boolean(p));
 const path=candidates[0];
 if(!path)return {kind:"clarify" as const,question:"Pouvez-vous préciser la difficulté rencontrée ?",options:["Questions imprévues","Présentation personnelle","Questions métier"]};
 const step=stepsForPath(path).find(s=>s.category===need.module)||stepsForPath(path)[0];
 return {kind:"recommend" as const,need:need.label,pathId:path.id,pathTitle:path.title,reason:`Ce parcours aborde « ${need.label.toLowerCase()} » grâce à des exercices de ${path.modules.includes(need.module)?"la compétence concernée":"préparation ciblée"}.`,exerciseId:step.exercise.id,exerciseName:step.exercise.name};
}
