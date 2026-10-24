const fs=require('fs');
const ts=require('../web/node_modules/typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {exercises}=require('../web/src/app/exercises/catalog.ts');
const {paths}=require('../web/src/app/exercises/paths.ts');
let failures=0;
const ids=new Set(exercises.map(x=>x.id));
if(ids.size!==exercises.length){console.log('FAIL duplicate exercise ids');failures++}
const invalid=exercises.filter(e=>!e.id||!e.name||!e.prompt||!e.intro||!e.skill||!e.duration||!Array.isArray(e.steps)||e.steps.length<2||e.steps.some(s=>!s||s.length<10));
if(invalid.length){console.log('FAIL malformed exercises',invalid.length);failures++}
const counts=Object.entries(exercises.reduce((a,e)=>(a[e.category]=(a[e.category]||0)+1,a),{})).sort((a,b)=>a[0].localeCompare(b[0]));
const levels=Object.entries(exercises.reduce((a,e)=>(a[e.level]=(a[e.level]||0)+1,a),{})).sort((a,b)=>a[0].localeCompare(b[0]));
const allModules=paths.flatMap(p=>p.modules);
const unknown=[...new Set(allModules)].filter(x=>!counts.some(([cat])=>cat===x));
if(unknown.length){console.log('FAIL unknown curriculum modules',unknown);failures++}
console.log('EXERCISES',exercises.length,'unique ids',ids.size);
console.log('CATEGORIES',counts.length,counts.map(([k,n])=>k+':'+n).join(' '));
console.log('LEVELS',levels.map(([k,n])=>k+':'+n).join(' '));
console.log('PATHS',paths.length,'module references',allModules.length);
console.log('CONTENT QUALITY',failures?'FAIL':'PASS','structural checks only');
console.log('EDITORIAL GATE PENDING: expert L&D validation required before actual candidates');
process.exitCode=failures?1:0;
