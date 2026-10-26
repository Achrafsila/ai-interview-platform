import assert from 'node:assert/strict';
import {test} from 'node:test';
// @ts-ignore Node's strip-types runner requires the .ts suffix for this test.
import {routeAcademyTurn} from './orchestrator.ts';
const u=(content:string)=>({role:'user' as const,content});
const a=(content:string)=>({role:'assistant' as const,content});
test('case selection starts roleplay',()=>assert.equal(routeAcademyTurn([u('Je prépare HRBP'),a('Quel aspect ?'),u('use case')]).intent,'case_start'));
test('answer stays in case even when discussing salary, negotiation and management',()=>assert.equal(routeAcademyTurn([u('use case'),a('## Cas pratique · HR Business Partner\n\nQuelle action lanceriez-vous ?'),u('Je propose une négociation et un pilote de mobilité sur six mois.')]).intent,'case_answer'));
test('explicit resource request changes intent',()=>assert.equal(routeAcademyTurn([u('use case'),a('## Cas pratique · HRBP\n\nQuelle action ?'),u('Avez-vous des supports pour préparer ce sujet ?')]).intent,'resources'));
test('explicit topic switch exits exercise',()=>assert.equal(routeAcademyTurn([u('use case'),a('## Cas pratique · HRBP\n\nQuelle action ?'),u('Changeons de sujet')]).intent,'switch'));
test('normal discussion does not trigger recommendation',()=>assert.equal(routeAcademyTurn([u('Je prépare un entretien HRBP')]).intent,'conversation'));
