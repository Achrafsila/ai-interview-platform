import assert from 'node:assert/strict';
import {test} from 'node:test';
// @ts-ignore Required by Node's strip-types runner.
import {createResponseContract} from './response-contract.ts';
test('case response gets typed presentation',()=>assert.equal(createResponseContract({kind:'answer',reply:'## Cas pratique · HRBP',question:'Votre décision ?'}).view,'case'));
test('feedback keeps continuation action',()=>assert.deepEqual(createResponseContract({kind:'answer',reply:'Très bien',practiceFeedback:true}).actions.map(x=>x.type),['continue']));
test('recommendation is not a write operation',()=>assert.deepEqual(createResponseContract({kind:'recommend',reason:'Exercice conseillé'}).actions.map(x=>x.type),['save']));
test('clarification gets question view',()=>assert.equal(createResponseContract({kind:'clarify',question:'Quel poste préparez-vous ?'}).view,'question'));
