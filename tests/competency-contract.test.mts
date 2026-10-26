import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveLearningNeeds} from '../web/src/lib/learning/competency-contract.ts';
test('do not recommend learning paths based on unverified statements',()=>{
 assert.deepEqual(deriveLearningNeeds([{competency:'sql',source:'jd_explicit',status:'candidate_statement_unverified',turnIndex:0,quote:'I use SQL'}]),[]);
});
test('an observed explicit JD competency produces a review-required candidate need',()=>{
 const result=deriveLearningNeeds([{competency:'sql',source:'jd_explicit',status:'reviewed_observation',turnIndex:2,quote:'The answer did not describe the data validation step.'}]);
 assert.equal(result.length,1); assert.equal(result[0].status,'review_required');
});
test('title inferred competencies cannot become proven gaps',()=>{
 assert.deepEqual(deriveLearningNeeds([{competency:'leadership',source:'title_inferred',status:'reviewed_observation',turnIndex:1,quote:'Example'}]),[]);
});
