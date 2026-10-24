import type {OnboardingProfile} from "@/components/ui/onboarding-stages";
import type {InterviewResult} from "@/lib/interview-results";
import {paths,stepsForPath,type AcademyPath} from "./paths";

export type LearningRecommendation={path:AcademyPath;reasons:string[];score:number;priorityModule:string|null};
const goalModules:Record<string,string[]>={
 confidence:["confidence","communication"],stress_management:["confidence","communication"],
 answer_structure:["structure","behavior"],communication:["communication","pitch"],
 domain_knowledge:["technical","problem"]
};
const concernRules:{pattern:RegExp;module:string;label:string}[]=[
 {pattern:/star|structur|organis|synthès|réponse.*longue/i,module:"structure",label:"structuration des réponses"},
 {pattern:/communi|oral|fluidit|clarté|expression|écout|élocution/i,module:"communication",label:"communication"},
 {pattern:/confiance|stress|pression|hésit/i,module:"confidence",label:"gestion des situations exigeantes"},
 {pattern:/exemple|résultat|impact|chiffr|preuve|illustr/i,module:"behavior",label:"illustration des réalisations"},
 {pattern:/techni|connaissance|métier|compétence/i,module:"technical",label:"argumentation métier"},
 {pattern:/prioris|problème|analys|décision/i,module:"problem",label:"résolution de problèmes"},
 {pattern:/leadership|management|délég|équipe/i,module:"leadership",label:"management"}
];
const jobMappings:{pattern:RegExp;id:string}[]=[
 {pattern:/data|analyst|business intelligence|scientist/i,id:"data"},
 {pattern:/cloud|devops|infrastructure|sre/i,id:"devops"},
 {pattern:/cyber|security|sécurité informatique/i,id:"cyber"},
 {pattern:/test|qa|quality assurance/i,id:"qa"},
 {pattern:/software|developer|développeur|ingénieur logiciel/i,id:"engineering"},
 {pattern:/recrut|talent acquisition|ressources humaines|\bhr\b/i,id:"hr"},
 {pattern:/financ|audit|contrôle de gestion/i,id:"finance"},
 {pattern:/legal|juridique|compliance|conformité/i,id:"legal"},
 {pattern:/product|business analyst|product owner/i,id:"product"},
 {pattern:/project|projet|scrum|agile/i,id:"project"},
 {pattern:/commercial|sales|business development/i,id:"sales"},
 {pattern:/marketing/i,id:"marketing"},
 {pattern:/consult|conseil/i,id:"consulting"}
];
export function learningRecommendations(profile:OnboardingProfile|null,results:InterviewResult[]):LearningRecommendation[]{
 const latest=results.find(r=>r.status==="completed"&&r.score_eligible===true&&typeof r.coach_priority==="string"&&r.coach_priority.trim().length>0);
 // score_eligible is an existing report provenance indicator, not a confidence metric.
 // Conservative use: route the stated coaching priority as an indicative signal only.
 const concern=latest?.coach_priority?concernRules.find(r=>r.pattern.test(latest.coach_priority!)):undefined;
 const job=results.find(r=>r.status==="completed"&&r.job_title)?.job_title||"";
 const jobMatch=jobMappings.find(x=>x.pattern.test(job));
 const seniority=profile?.experienceLevel;
 const goal=profile?.professionalGoal;
 const wanted=new Set((profile?.preparationGoals||[]).flatMap(g=>goalModules[g]||[]));
 const ranked=paths.map(path=>{
  let score=0;const reasons:string[]=[];
  if(concern&&path.modules.includes(concern.module)){score+=35;reasons.push("En lien avec votre dernier bilan : "+concern.label);}
  if(jobMatch&&path.id===jobMatch.id){score+=25;reasons.push("Ciblé sur le poste mentionné dans votre simulation.");}
  if(path.modules.some(m=>wanted.has(m))){score+=15;reasons.push("Correspond à vos objectifs de préparation.");}
  if(seniority){
   const suitable=(["starting","junior"].includes(seniority)&&path.level==="foundation")||(seniority==="experienced"&&path.level==="practice")||(seniority==="senior"&&path.level==="challenge");
   if(suitable){score+=20;reasons.push("Difficulté cohérente avec votre expérience déclarée.");}
  }
  const relevantGoal=(["first_job","internship"].includes(goal||"")&&["first-job","internship","graduate-tech","graduate-business"].includes(path.id))||
   (["job_change","employment_transition"].includes(goal||"")&&["career-switch","internal-mobility"].includes(path.id))||
   (goal==="return_to_work"&&["return-work","career-gap"].includes(path.id))||
   (goal==="career_growth"&&["promotion","lead-first"].includes(path.id))||
   (goal==="client_pitches"&&["pitch","eloquence"].includes(path.id));
  if(relevantGoal){score+=15;reasons.push("Aligné sur votre projet professionnel.");}
  if(!score&&path.id==="week"){score=1;reasons.push("Parcours polyvalent pour démarrer.");}
  return {path,score,reasons,priorityModule:concern&&path.modules.includes(concern.module)?concern.module:null};
 }).sort((a,b)=>b.score-a.score||a.path.title.localeCompare(b.path.title,"fr"));
 const chosen:LearningRecommendation[]=[];
 for(const item of ranked){
  if(chosen.length>=3)break;
  if(chosen.some(x=>x.path.id===item.path.id||x.path.category===item.path.category)&&ranked.some(x=>x.score>0&&x.path.category!==item.path.category&&!chosen.some(c=>c.path.id===x.path.id)))continue;
  chosen.push(item);
 }
 return chosen;
}
export function adaptiveSteps(path:AcademyPath,priorityModule:string|null){
 const list=stepsForPath(path);
 return priorityModule?[...list].sort((a,b)=>Number(b.category===priorityModule)-Number(a.category===priorityModule)):list;
}
