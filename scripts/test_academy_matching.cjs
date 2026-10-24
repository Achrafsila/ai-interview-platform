const fs=require('fs');const Module=require('module');const path=require('path');const ts=require('../web/node_modules/typescript');
require.extensions['.ts']=function(mod,filename){const source=fs.readFileSync(filename,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;mod._compile(js,filename)};
const {synthesizeLearningNeeds}=require('../web/src/app/exercises/ld-synthesis.ts');
const cases=[
 {id:"sales-technical",turns:["Je passe un entretien technique pour un rôle de responsable commercial"],must:["sales"],avoid:["technical"]},
 {id:"hr-softskills",turns:["J'ai du mal à répondre aux questions RH et soft skills","Un entretien final RH avec une DRH","La structure et comment mettre en avant les soft skills, les questions qualité défaut","Et pour les soft skills ?"],must:["softskills","hr_final"],avoid:["technical"]},
 {id:"stress",turns:["Je souhaite mieux gérer mon stress à l'entretien"],must:["stress"],avoid:["technical"]},
 {id:"star",turns:["Je veux structurer mes réponses avec STAR"],must:["structure"],avoid:["technical"]},
 {id:"internship",turns:["Je prépare mon entretien de stage PFE"],must:["internship"],avoid:["technical"]},
 {id:"first-job",turns:["Comment préparer mon premier entretien d'embauche ?"],must:["first_interview"],avoid:["technical"]},
 {id:"salary",turns:["Comment négocier mon salaire ?"],must:["negotiation"],avoid:["technical"]},
 {id:"leadership",turns:["Je veux valoriser mon leadership et mon management"],must:["leadership"],avoid:["technical"]},
 {id:"oral",turns:["Je veux travailler ma communication orale"],must:["communication"],avoid:["technical"]}
];let failures=0;
for(const c of cases){const s=synthesizeLearningNeeds(c.turns);const keys=s.needs.map(n=>n.key);const pass=c.must.every(k=>keys.includes(k))&&c.avoid.every(k=>!keys.includes(k));if(!pass)failures++;console.log((pass?"PASS ":"FAIL ")+c.id+" => "+keys.join(", ")+" | "+s.steps.map(x=>x.pathId).join(","));}
console.log("RESULT",cases.length-failures,"/",cases.length);if(failures)process.exitCode=1;
