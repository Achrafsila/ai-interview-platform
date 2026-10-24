import json,urllib.request,urllib.error
from pathlib import Path
p=Path(__file__).resolve().parents[1]/"web/.env.local"
env=dict(line.split("=",1) for line in p.read_text().splitlines() if "=" in line and not line.startswith("#"))
key=env.get("GROQ_API_KEY","")
if not key:raise SystemExit("NO KEY")
model=env.get("ACADEMY_AI_MODEL","openai/gpt-oss-120b")
cases=[
 ("sales","Je passe un entretien technique pour un rôle de responsable commercial",["sales"],["technical"]),
 ("rh_softskills","J'ai du mal à répondre aux questions RH et soft skills. Je prépare un entretien final avec une DRH, et veux parler de mes qualités et défauts.",["softskills","hr_final"],["technical"]),
 ("stress","Je veux mieux gérer le stress avant mon entretien.",["stress"],["technical"]),
]
system='Tu es un analyste de besoin pédagogique. Réponds uniquement en JSON valide avec action (clarify ou recommend), needs (tableau de clés parmi sales, technical, softskills, hr_final, stress, structure, communication, motivation, first_interview, leadership, negotiation, internship), question, options. Entretien technique commercial NE signifie PAS compétence informatique. Soft skills implique comportemental. Identifie plusieurs besoins, sans inventer de parcours.'
for name,prompt,must,avoid in cases:
 req=urllib.request.Request("https://api.groq.com/openai/v1/chat/completions",data=json.dumps({"model":model,"messages":[{"role":"system","content":system},{"role":"user","content":prompt}],"response_format":{"type":"json_object"},"max_tokens":1200,"temperature":0.1}).encode(),headers={"Authorization":"Bearer "+key,"Content-Type":"application/json"})
 try:
  with urllib.request.urlopen(req,timeout=25) as res:out=json.load(res)
  data=json.loads(out["choices"][0]["message"]["content"])
  needs=data.get("needs",[])
  passed=all(x in needs for x in must) and not any(x in needs for x in avoid)
  print(("PASS" if passed else "FAIL"),name,"action",data.get("action"),"needs",needs)
 except urllib.error.HTTPError as e:

  try:
   issue=json.loads(e.read().decode()).get("error",{})
   print("HTTP",name,e.code,"type",issue.get("type"),"code",issue.get("code"),"detail",str(issue.get("message",""))[:140])
  except Exception:print("HTTP",name,e.code)
 except Exception as e:print("ERROR",name,type(e).__name__)
