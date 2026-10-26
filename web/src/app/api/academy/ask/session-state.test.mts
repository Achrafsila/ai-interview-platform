import assert from 'node:assert/strict';
import {test} from 'node:test';
// @ts-ignore Node's strip-types runner requires .ts suffix.
import {deriveSessionState} from './session-state.ts';
const u=(content:string)=>({role:'user' as const,content});
const a=(content:string)=>({role:'assistant' as const,content});
test('case starts and stores a current question',()=>{const state=deriveSessionState([u('Je prépare HRBP'),u('use case'),a('## Cas pratique · HR Business Partner\n\nQuelle action lanceriez-vous ?')]);assert.equal(state.mode,'case');assert.equal(state.step,1);assert.equal(state.role,'HRBP');assert.match(state.lastQuestion||'',/Quelle action/);});
test('multi-turn exercises advance',()=>{const state=deriveSessionState([a('## Cas pratique · HR Business Partner\n\nQuelles données ?'),u('Je chercherais les données RH pertinentes.'),a('Votre feedback\n\nQuelle action maintenant ?')]);assert.equal(state.mode,'case');assert.equal(state.step,2);assert.match(state.lastQuestion||'',/maintenant/);});
test('explicit stop clears case state',()=>{const state=deriveSessionState([a('## Cas pratique · HRBP\n\nQuelle action ?'),u('Changeons de sujet')]);assert.equal(state.mode,'conversation');assert.equal(state.lastQuestion,null);});
