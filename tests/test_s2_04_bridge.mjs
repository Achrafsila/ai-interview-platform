import test from "node:test";
import assert from "node:assert/strict";
import { createQuestionBankClient, QuestionBankApiError } from "../src/integrations/s2-04/question-bank-client.mjs";

test("published list sends bearer token and safe filters", async () => {
  const calls = [];
  const api = createQuestionBankClient({
    baseUrl: "https://example.supabase.co/functions/v1/question-bank",
    tokenProvider: async () => "server-user-token",
    fetchImpl: async (url, init) => {
      calls.push({url, init});
      return {ok: true, json: async () => ({items: [], next_cursor: null})};
    },
  });
  const result = await api.listPublished({locale:"fr", family:"technical", difficulty:2});
  assert.deepEqual(result, {items:[], next_cursor:null});
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /questions\?locale=fr&family=technical&difficulty=2/);
  assert.equal(calls[0].init.headers.authorization, "Bearer server-user-token");
  assert.equal(calls[0].init.cache, "no-store");
});

test("engine snapshot endpoint includes immutable reference by code", async () => {
  let request;
  const api = createQuestionBankClient({
    baseUrl:"https://example.supabase.co/functions/v1/question-bank/",
    tokenProvider:async()=>"jwt",
    fetchImpl:async(url)=>{request=url; return {ok:true,json:async()=>({snapshot:{code:"RH-004",question_version_id:"id"}})};},
  });
  const result = await api.getEngineSnapshot("RH-004","en");
  assert.match(request,/engine\/snapshot\/RH-004\?locale=en$/);
  assert.equal(result.snapshot.code,"RH-004");
});

test("evaluator path is independent from candidate path", async () => {
  let request;
  const api = createQuestionBankClient({
    baseUrl:"https://example.supabase.co/functions/v1/question-bank",
    tokenProvider:async()=>"jwt",
    fetchImpl:async(url)=>{request=url;return {ok:true,json:async()=>({reference:{expected_elements:[]}})};},
  });
  await api.getEvaluatorReference("TECH-003");
  assert.match(request,/evaluator\/questions\/TECH-003\?locale=fr$/);
});

test("missing token never reaches network", async () => {
  let called=false;
  const api=createQuestionBankClient({
    baseUrl:"https://example.supabase.co/functions/v1/question-bank",
    tokenProvider:async()=>"",
    fetchImpl:async()=>{called=true;throw Error("should not happen");},
  });
  await assert.rejects(api.listPublished(), e=>e instanceof QuestionBankApiError && e.status===401);
  assert.equal(called,false);
});

test("forbidden response is surfaced without guessing a role", async () => {
  const api=createQuestionBankClient({
    baseUrl:"https://example.supabase.co/functions/v1/question-bank",
    tokenProvider:async()=>"jwt",
    fetchImpl:async()=>({ok:false,status:403}),
  });
  await assert.rejects(api.getEngineSnapshot("RH-004"),e=>e instanceof QuestionBankApiError&&e.status===403);
});

test("malformed codes rejected before network access", async () => {
  const api=createQuestionBankClient({
    baseUrl:"https://example.supabase.co/functions/v1/question-bank",
    tokenProvider:async()=>"jwt",
    fetchImpl:async()=>{throw Error("should not happen");},
  });
  assert.throws(()=>api.getEngineSnapshot("../admin"),TypeError);
  assert.throws(()=>api.getEvaluatorReference("TECH-1"),TypeError);
});
