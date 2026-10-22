/**
 * S2-04 server-side adapter for the protected S2-03 Edge Function.
 * Never bundle this module into a browser client or cache bearer credentials.
 * Supply the current verified Supabase Auth access token via a server-only callback.
 */
export class QuestionBankApiError extends Error {
  constructor(status, code) {
    super(code);
    this.name = "QuestionBankApiError";
    this.status = status;
  }
}

export function createQuestionBankClient({ baseUrl, tokenProvider, fetchImpl = fetch }) {
  if (typeof baseUrl !== "string" || !baseUrl.startsWith("https://")) {
    throw new TypeError("A HTTPS Edge Function base URL is required");
  }
  if (typeof tokenProvider !== "function") throw new TypeError("tokenProvider must be a function");
  const root = baseUrl.replace(/\/+$/, "");
  async function send(endpoint, params = {}) {
    const token = await tokenProvider();
    if (typeof token !== "string" || !token.trim()) throw new QuestionBankApiError(401, "missing_token");
    const url = new URL(root + "/" + endpoint);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
    const response = await fetchImpl(url.toString(), {
      method: "GET",
      headers: { authorization: "Bearer " + token, accept: "application/json" },
      redirect: "error",
      cache: "no-store",
    });
    if (!response.ok) {
      throw new QuestionBankApiError(response.status, "question_bank_request_failed");
    }
    return response.json();
  }
  const codePath = code => {
    if (typeof code !== "string" || !/^(RH|TECH)-[0-9]{3}$/.test(code))
      throw new TypeError("Invalid question code");
    return code;
  };
  return Object.freeze({
    listPublished: filters => send("questions", filters),
    getEngineSnapshot: (code, locale = "fr") => send("engine/snapshot/" + codePath(code), { locale }),
    getEvaluatorReference: (code, locale = "fr") => send("evaluator/questions/" + codePath(code), { locale }),
  });
}
