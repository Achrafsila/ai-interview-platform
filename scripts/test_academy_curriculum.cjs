const fs=require('fs');const ts=require('../web/node_modules/typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {themes,synthesizeLearningNeeds}=require('../web/src/app/exercises/ld-synthesis.ts');
const {paths,stepsForPath}=require('../web/src/app/exercises/paths.ts');
const {exercises}=require('../web/src/app/exercises/catalog.ts');
const cases=[
 {id:'hr-multi',turns:['Entretien final DRH, les questions soft skills, qualités défauts, je dois mieux structurer'],expected:['softskills','hr_final','structure']},
 {id:'commercial-no-it',turns:['Je prépare un entretien technique de responsable commercial'],expected:['sales'],forbidden:['technical']},
 {id:'exclusive-switch',turns:['Je passe un entretien commercial','Finalement je veux travailler uniquement ma communication orale'],expected:['communication'],forbidden:['sales']},
 {id:'stress-oral',turns:['Quand je parle à l’oral je perds mes moyens à cause du stress'],expected:['stress','communication']},
 {id:'pfe-tech',turns:['Je prépare un stage PFE avec des questions de programmation'],expected:['internship','technical']}
];
let count=0,fail=0;
for(const p of paths){for(const step of stepsForPath(p)){count++;if(!step.exercise||step.exercise.category!==step.category||!exercises.includes(step.exercise)){fail++;console.log('FAIL path module',p.id,step.category)}}}
for(const t of themes){const p=paths.find(x=>x.id===t.pathId);if(!p||!p.modules.includes(t.module)){fail++;console.log('FAIL theme mapping',t.key,t.pathId,t.module)}}
for(const c of cases){const plan=synthesizeLearningNeeds(c.turns);const keys=plan.needs.map(n=>n.key);const ok=plan.steps.length>=c.expected.length&&c.expected.every(x=>keys.includes(x))&&(c.forbidden||[]).every(x=>!keys.includes(x))&&plan.steps.every(x=>x.method&&x.method.length>35&&exercises.some(y=>y.id===x.exerciseId)&&paths.some(y=>y.id===x.pathId))&&new Set(plan.steps.map(x=>x.exerciseId)).size===plan.steps.length;console.log(ok?'PASS':'FAIL',c.id,keys.join(','),'steps',plan.steps.length);if(!ok)fail++}
console.log('CURRICULUM QA',count,'path steps',themes.length,'theme mappings',cases.length,'dialogue cases','failures',fail);process.exitCode=fail?1:0;
