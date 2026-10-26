import test from 'node:test';
import assert from 'node:assert/strict';
import {evidenceCoverage,transcriptEvidence} from '../web/src/lib/learning/interview-evidence.ts';
test('no transcript never produces score or coverage claim',()=>{
 assert.deepEqual(evidenceCoverage(undefined),{answers:0,reviewed:0,scored:false,needsReview:false});
});
test('transcripts retain candidate quote provenance and question indexes',()=>{
 const e=transcriptEvidence([{question:'A',answer:''},{question:'B',answer:'I validated churn cohorts.'}]);
 assert.equal(e.length,1);assert.equal(e[0].turnIndex,1);assert.equal(e[0].status,'candidate_statement_unverified');
});
test('all evidence is unreviewed even with many answers',()=>{
 const r=evidenceCoverage([{question:'Why?',answer:'Because I researched.'}]);
 assert.equal(r.reviewed,0);assert.equal(r.scored,false);
});
