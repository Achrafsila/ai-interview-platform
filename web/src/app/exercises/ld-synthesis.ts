import {interpretNeed} from "./ld-matching";
import {paths,stepsForPath} from "./paths";

export const themes=[
 {key:"softskills",label:"Valoriser vos soft skills",pathId:"behavioral",module:"behavior"},
 {key:"hr_final",label:"Réussir les questions RH et DRH",pathId:"behavioral",module:"behavior"},
 {key:"structure",label:"Structurer vos réponses",pathId:"star",module:"structure"},
 {key:"stress",label:"Gérer votre stress",pathId:"stress",module:"confidence"},
 {key:"communication",label:"Renforcer votre communication",pathId:"eloquence",module:"communication"},
 {key:"motivation",label:"Exprimer votre motivation",pathId:"first-job",module:"motivation"},
 {key:"first_interview",label:"Préparer votre premier entretien",pathId:"first-job",module:"pitch"},
 {key:"sales",label:"Préparer un entretien pour un poste commercial",pathId:"sales",module:"negotiation"},
 {key:"technical",label:"Défendre vos compétences techniques",pathId:"graduate-tech",module:"technical"},
 {key:"leadership",label:"Illustrer votre leadership",pathId:"lead-first",module:"leadership"},
 {key:"negotiation",label:"Préparer une négociation",pathId:"salary",module:"negotiation"},
 {key:"internship",label:"Préparer votre stage ou PFE",pathId:"internship",module:"graduates"},
] as const;
type Step={exerciseId:string;exerciseName:string;pathId:string;pathTitle:string;goal:string};
export function synthesizeLearningNeeds(userMessages:string[],semanticKeys?:string[]){
 const found:Array<(typeof themes)[number]["key"]>=[];
 for(const message of userMessages){
  const normalized=message.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  // Identify several topics within a single message rather than only the first regex match.
  for(const t of themes){
   const expressions:Record<string,RegExp>={
    softskills:/soft.?skills?|savoir.?etre|qualit.{0,12}defaut|qualites?|defauts?|point.{0,12}(fort|faible)|competenc.{0,12}comportement/,
    hr_final:/\bdrh\b|entretien.{0,20}\brh\b|final.{0,25}(rh|ressources humaines)|questions? rh/,
    structure:/structur|methode star|reponses? organis|reponses? constru/,
    stress:/stress|pression|trac|angoiss|confiance/,
    communication:/communi|expression orale|prise de parole|eloquen/,
    motivation:/motivation|pourquoi ce poste|pourquoi vous/,
    first_interview:/premier.{0,30}entretien|premier emploi/,
    sales:/responsable commercial|directeur commercial|poste commercial|role de commercial|fonction commerciale|business development|vente|commercial/,
    technical:/competences? techniques? (?:en informatique|en data)|data analyst|devops|cyber|developpement logiciel|programmation/,
    leadership:/leadership|management|manager|gestion d.equipe/,
    negotiation:/negoci|salaire|remuneration/,
    internship:/stage|\bpfe\b|alternance/
   };
   if(expressions[t.key].test(normalized)&&!found.includes(t.key))found.push(t.key);
  }
  const fallback=interpretNeed(message)?.key;
  if(fallback&&fallback!=="unknown"&&!(fallback==="technical"&&/entretien technique/.test(normalized))&&!found.includes(fallback))found.push(fallback);
 }
 const recent= userMessages.at(-1)||"";
 const recentNeeds=themes.filter(t=>{
  const one=synthesizeSingle(recent);
  return one.includes(t.key);
 }).map(t=>t.key);
 const validated=(semanticKeys||[]).filter(k=>themes.some(t=>t.key===k));
 const ordered=[...validated,...recentNeeds.filter(k=>!validated.includes(k)),...found.filter(k=>!validated.includes(k)&&!recentNeeds.includes(k))];
 const selected=ordered.slice(0,4).map(key=>themes.find(t=>t.key===key)!).filter(Boolean);
 const steps:Step[]=[];
 for(const theme of selected){
  const path=paths.find(p=>p.id===theme.pathId);
  if(!path)continue;
  const exercise=stepsForPath(path).find(s=>s.category===theme.module)?.exercise;
  if(exercise&&!steps.some(s=>s.exerciseId===exercise.id))steps.push({exerciseId:exercise.id,exerciseName:exercise.name,pathId:path.id,pathTitle:path.title,goal:theme.label});
 }
 return {needs:selected.map(t=>({key:t.key,label:t.label})),steps};
}
function synthesizeSingle(text:string){
 const normalized=text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const out:string[]=[];
 if(/soft.?skills?|savoir.?etre|qualit|defaut|point.{0,12}(fort|faible)/.test(normalized))out.push("softskills");
 if(/\bdrh\b|entretien.{0,20}\brh\b|questions? rh/.test(normalized))out.push("hr_final");
 if(/structur|\bstar\b/.test(normalized))out.push("structure");
 if(/stress|pression|trac/.test(normalized))out.push("stress");
 if(/communi|expression orale/.test(normalized))out.push("communication");
 if(/motivation|pourquoi ce poste/.test(normalized))out.push("motivation");
 if(/responsable commercial|poste commercial|commercial|vente|business development/.test(normalized))out.push("sales");
 return out;
}
