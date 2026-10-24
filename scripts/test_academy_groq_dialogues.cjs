const fs=require('fs');const ts=require('../web/node_modules/typescript');require.extensions['.ts']=function(m,f){m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f)};const {synthesizeLearningNeeds}=require('../web/src/app/exercises/ld-synthesis.ts');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^(GROQ_API_KEY|ACADEMY_AI_MODEL)=/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const keys='softskills, hr_final, structure, stress, communication, motivation, first_interview, sales, technical, leadership, negotiation, internship';
const src=fs.readFileSync('web/src/app/api/academy/ask/route.ts','utf8');
const instruction=src.match(/const coachingInstruction=`([\s\S]*?)`;/)[1].replace('${[...validKeys].join(", ")}',keys);
const tests=[
 ['sales',['Je passe un entretien technique pour un rôle de responsable commercial'],['sales'],['technical']],
 ['hr-multi',['J’ai du mal avec les questions RH et les soft skills.','Je prépare un entretien final RH avec une DRH','La structure, les soft skills, mes qualités et défauts.','Et pour les soft skills ?'],['softskills','hr_final','structure'],['technical']],
 ['stress',['Je souhaite gérer mon stress en entretien'],['stress'],['technical']],
 ['first',['Comment préparer mon premier entretien d’embauche ?'],['first_interview'],['technical']],
 ['pfe',['Je prépare un entretien pour un stage PFE'],['internship'],['technical']],
 ['salary',['Je voudrais négocier mon salaire'],['negotiation'],['technical']],
 ['star',['J’ai du mal à structurer mes réponses avec STAR'],['structure'],['technical']],
 ['leadership',['Je veux montrer mon leadership dans une équipe'],['leadership'],['technical']],
 ['data',['Je passe un entretien Data Analyst, je veux revoir mes compétences techniques'],['technical'],['sales']],
 ['sales-skills',['Je candidate comme responsable commercial et veux illustrer mes qualités et défauts'],['sales','softskills'],['technical']],
 ['oral',['J’ai des difficultés à communiquer à l’oral'],['communication'],['technical']],
 ['motivation',['Comment expliquer ma motivation pour ce poste ?'],['motivation'],['technical']],
 ['drh-qualities',['J’ai un entretien avec la DRH : comment parler de mes points forts et de mes défauts ?'],['hr_final','softskills'],['technical']],
 ['sales-manager',['Je candidate comme directeur commercial, je veux préparer les questions sur la vente'],['sales'],['technical']],
 ['sales-business',['J’ai un entretien pour un poste business development'],['sales'],['technical']],
 ['finance',['Je prépare un entretien en audit financier et j’aimerais structurer mes exemples'],['structure'],['sales']],
 ['cyber',['Je passe un entretien en cybersécurité et veux revoir mes connaissances techniques'],['technical'],['sales']],
 ['graduate',['Je suis jeune diplômé, je prépare mon tout premier entretien'],['first_interview'],['sales']],
 ['team-management',['Je prépare un entretien de manager et je veux valoriser ma gestion d’équipe'],['leadership'],['technical']],
 ['communication',['J’ai des problèmes d’élocution quand je présente mon expérience'],['communication'],['technical']],
 ['salary-and-stress',['Je suis stressé à l’idée de négocier mon salaire'],['negotiation','stress'],['technical']],
 ['pfe-data',['Je prépare mon stage PFE en Data Engineering, avec des questions en informatique'],['internship','technical'],['sales']],
 ['hr-then-stress',['Je prépare un entretien final DRH','Je veux aussi gérer mon stress'],['hr_final','stress'],['technical']],
 ['switch-goal',['Je prépare un poste commercial','Finalement je veux travailler uniquement ma communication orale'],['communication'],['technical']],
 ['soft-followup',['Questions RH en entretien final','Et comment présenter mes soft skills ?'],['hr_final','softskills'],['technical']],
 ['first-stage',['Comment réussir mon tout premier entretien pour un stage ?'],['first_interview','internship'],['technical']],
 ['financial-questions',['Je suis contrôleur de gestion, je veux travailler mes réponses structurées'],['structure'],['sales']],
 ['recruiting-skills',['Entretien pour un poste RH : comment prouver mon sens de l’écoute ?'],['softskills'],['technical']],
 ['stress-oral',['Quand je parle à l’oral je perds mes moyens à cause du stress'],['stress','communication'],['technical']]
];
(async()=>{let success=0;let calls=0;let evaluated=0;let rateLimited=false;for(const [id,turns,must,avoid] of tests){try{
 const messages=[{role:'system',content:instruction},...turns.flatMap((m,i)=>i===0?[{role:'user',content:m}]:[{role:'assistant',content:'Pouvez-vous préciser votre besoin ?'},{role:'user',content:m}])];
 const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.GROQ_API_KEY},body:JSON.stringify({model:env.ACADEMY_AI_MODEL||'openai/gpt-oss-120b',temperature:0.1,max_tokens:1200,response_format:{type:'json_object'},messages})});calls++;if(!r.ok){console.log('HTTP',id,r.status);if(r.status===429){rateLimited=true;break;}continue;}const json=await r.json();const decision=JSON.parse(json.choices[0].message.content);const rawNeeds=decision.needs||[];
 const fallback=synthesizeLearningNeeds(turns);
 const concrete=fallback.needs.map(n=>n.key);
 const context=turns.join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const safe=rawNeeds.filter(k=>k!=='technical'||/informatique|developpement logiciel|programmation|data analyst|devops|cyber|ingenierie informatique/.test(context));
 const needs=synthesizeLearningNeeds(turns,[...concrete,...safe.filter(k=>!concrete.includes(k))]).needs.map(n=>n.key);
 const ok=must.every(x=>needs.includes(x))&&avoid.every(x=>!needs.includes(x));evaluated++;success+=Number(ok);console.log(ok?'PASS':'FAIL',id,'action='+decision.action,'needs='+needs.join(','));
 }catch(e){console.log('ERROR',id,e.name,e.message.slice(0,60))}}
 console.log('RESULT',success+'/'+evaluated,'EVALUATED',evaluated+'/'+tests.length,'CALLS',calls,'QUOTA_STOP',rateLimited);process.exitCode=rateLimited?2:(success===tests.length?0:1);})();
