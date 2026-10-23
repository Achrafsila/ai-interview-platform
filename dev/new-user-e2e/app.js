const $ = id => document.getElementById(id);
const STEPS = ["welcome","auth","onboarding","dashboard","configure","interview","recap"];
const GOALS = {
  first_job:"Premier emploi", job_change:"Changer de poste", career_growth:"Évoluer",
};
const PREP = {
  confidence:"Confiance en soi", answer_structure:"Structurer mes réponses comportementales",
  communication:"Communication en entretien RH", domain_knowledge:"Connaissances métier",
  stress_management:"Gérer les questions RH difficiles",
  rh_motivation:"Motivations et projet professionnel",
  rh_parcours:"Présenter et valoriser mon parcours",
  rh_teamwork:"Collaboration et travail en équipe",
  rh_leadership:"Leadership et influence",
  rh_behavioral:"Situations vécues et méthode STAR",
  rh_conflict:"Gestion des désaccords et conflits",
  tech_fundamentals:"Fondamentaux techniques",
  tech_problem_solving:"Résolution de problèmes techniques",
  tech_architecture:"Architecture et conception",
  tech_debugging:"Débogage et investigation",
  tech_practices:"Qualité et bonnes pratiques",
  tech_reasoning:"Structuration du raisonnement",
  tech_explain:"Expliquer clairement mes choix techniques",
  tech_incident:"Diagnostic et gestion d'incident",
  tech_sql:"SQL, requêtes et optimisation",
  tech_data_pipelines:"ETL, pipelines et qualité des données",
  tech_ml:"Machine learning et IA",
  tech_api:"API, backend et intégrations",
  tech_system_design:"Conception et scalabilité des systèmes",
  tech_cloud:"Cloud, infrastructure et conteneurs",
  tech_cicd:"CI/CD et déploiements",
  tech_observability:"Monitoring et observabilité",
  tech_security:"Sécurité applicative et vulnérabilités",
  tech_threat_model:"Analyse de risques et menaces",
  tech_iam:"Identités, accès et IAM",
  tech_automation:"Automatisation des tests",
  tech_quality:"Qualité, anomalies et stratégie QA",
  tech_test_strategy:"Conception de scénarios de test",
  tech_requirements:"Analyse et cadrage des besoins",
  tech_user_stories:"User stories et critères d'acceptation",
  tech_stakeholders:"Ateliers et gestion des parties prenantes",
};
const RH_SIM_GOALS = [
  "rh_motivation","rh_parcours","communication","answer_structure",
  "rh_teamwork","rh_leadership","rh_behavioral","rh_conflict",
  "confidence","stress_management",
];
const TECH_SIM_GOALS = [
  "tech_fundamentals","tech_problem_solving","tech_architecture",
  "tech_debugging","tech_practices","tech_reasoning",
  "tech_explain","tech_incident",
];
const TECH_DOMAIN_GOALS = {
  software:["tech_api","tech_system_design"],
  data_ai:["tech_sql","tech_data_pipelines","tech_ml"],
  cloud_devops:["tech_cloud","tech_cicd","tech_observability"],
  cybersecurity:["tech_security","tech_threat_model","tech_iam"],
  testing_qa:["tech_automation","tech_quality","tech_test_strategy"],
  business_analysis:["tech_requirements","tech_user_stories","tech_stakeholders"],
};
const state = {
  mode:"demo", liveConfig:null, page:"welcome", authMode:"signup",
  user:null, accessToken:null, profile:null, selectedGoals:[],
  selection:null, questions:[], answers:[], index:0,
  aiReady:false, aiSession:null, aiTotal:0, aiPhase:"primary",
  aiCurrentQuestion:null, aiFeedback:null,
  simGoalSelections:{}, lastRenderedFamily:null,
};
function show(page) {
  state.page = page;
  for(const name of STEPS) $(name).classList.toggle("hidden", name!==page);
  const index=STEPS.indexOf(page);
  for(const step of document.querySelectorAll(".step")){
    const i=STEPS.indexOf(step.dataset.step);
    step.classList.toggle("active", i===index);
    step.classList.toggle("done", i<index);
  }
  window.scrollTo(0,0);
}
function text(id,value){ $(id).textContent=String(value??""); }
function error(id,e){text(id,e instanceof Error?e.message:e);}
function names(list){return (list||[]).map(v=>PREP[v]||v).join(" · ")||"Aucun";}

async function jsonResponse(url,init={}){
  const response=await fetch(url,{...init,redirect:"error",cache:"no-store"});
  const body=await response.json().catch(()=>({}));
  if(!response.ok){
    const message=body.msg||body.error_description||body.message||body.error||
      "Service indisponible (HTTP "+response.status+")";
    throw new Error(typeof message==="string"?message:"Erreur de connexion");
  }
  return body;
}
function authHeaders(accessToken=null){
  const key=state.liveConfig?.publishable_key;
  if(!key)throw new Error("Supabase n'est pas configuré");
  return {
    apikey:key,"content-type":"application/json",
    ...(accessToken?{authorization:"Bearer "+accessToken}:{})
  };
}
function supabasePath(path){
  const base=state.liveConfig?.supabase_url;
  if(!base || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base))
    throw new Error("URL Supabase invalide");
  return base+path;
}
async function verifyAuth(accessToken){
  return jsonResponse(supabasePath("/auth/v1/user"),{
    headers:authHeaders(accessToken),
    method:"GET",headers:{...authHeaders(accessToken)},
  });
}
async function loadProfile(){
  const user=state.user;
  const query="/rest/v1/candidate_profiles?user_id=eq."+encodeURIComponent(user.id)+"&select=*";
  const profiles=await jsonResponse(supabasePath(query),{
    method:"GET",headers:authHeaders(state.accessToken),
  });
  return profiles[0]||null;
}
async function saveProfile(profile){
  if(state.mode==="demo"){
    state.profile={...profile,user_id:state.user.id,onboarding_completed_at:new Date().toISOString()};
    sessionStorage.setItem("ai_e2e_demo_profile",JSON.stringify({
      email:state.user.email,profile:state.profile
    }));
    return;
  }
  const payload={
    user_id:state.user.id,
    professional_goal:profile.professional_goal,
    preparation_goals:profile.preparation_goals,
    target_role:profile.target_role||null,
    preferred_locale:profile.preferred_locale,
  };
  const rows=await jsonResponse(supabasePath("/rest/v1/candidate_profiles?on_conflict=user_id"),{
    method:"POST",
    headers:{...authHeaders(state.accessToken),
      Prefer:"resolution=merge-duplicates,return=representation"},
    body:JSON.stringify(payload),
  });
  if(!Array.isArray(rows)||rows.length!==1)throw Error("Impossible de confirmer l'enregistrement du profil");
  state.profile=rows[0];
}

function enterAuth(mode){
  state.mode=mode;state.authMode="signup";renderAuth();
  text("modeIndicator",mode==="demo"?"DÉMO · DONNÉES LOCALES":"SUPABASE · INSCRIPTION RÉELLE");
  show("auth");
}
function renderAuth(){
  const live=state.mode==="live",signup=state.authMode==="signup";
  text("authHeading",signup?"Créer mon compte":"Se connecter");
  text("authSub",live
    ? "Supabase Auth : votre compte et vos objectifs seront réellement enregistrés dans le projet de développement."
    : "Mode démo : compte fictif, aucune inscription et aucune donnée envoyée à Supabase.");
  text("authSubmit",signup?"Créer mon compte →":"Se connecter →");
  text("toggleAuth",signup?"Déjà inscrit ? Se connecter":"Créer un compte");
  $("password").setAttribute("autocomplete",signup?"new-password":"current-password");
  $("emailPending").classList.add("hidden");text("authError","");
}
async function doAuth(event){
  event.preventDefault();text("authError","");
  const email=$("email").value.trim().toLowerCase();
  const password=$("password").value;
  if(!email.includes("@")||password.length<8){error("authError","Saisissez un e-mail valide et au moins 8 caractères.");return;}
  $("authSubmit").disabled=true;
  try{
    if(state.mode==="demo"){
      const saved=JSON.parse(sessionStorage.getItem("ai_e2e_demo_profile")||"null");
      state.user={id:"demo-new-user",email};
      if(state.authMode==="login"&&saved?.email===email){
        state.profile=saved.profile;renderDashboard();show("dashboard");
      }else{
        state.profile=null;renderOnboarding();show("onboarding");
      }
      return;
    }
    const signup=state.authMode==="signup";
    const endpoint=signup?"/auth/v1/signup":"/auth/v1/token?grant_type=password";
    const result=await jsonResponse(supabasePath(endpoint),{
      method:"POST",headers:authHeaders(),body:JSON.stringify({email,password}),
    });
    if(!result.access_token){
      $("emailPending").classList.remove("hidden");
      text("authError","Confirmation e-mail requise. Vérifiez votre messagerie puis connectez-vous.");
      return;
    }
    state.accessToken=result.access_token;
    const verified=await verifyAuth(result.access_token);
    state.user={id:verified.id,email:verified.email||email};
    const savedProfile=await loadProfile();
    if(savedProfile){state.profile=savedProfile;renderDashboard();show("dashboard");}
    else{state.profile=null;renderOnboarding();show("onboarding");}
  }catch(e){error("authError",e);}finally{$("authSubmit").disabled=false;}
}
function chosenPrep(container){return [...$(container).querySelectorAll('input[type="checkbox"]:checked')].map(x=>x.value);}
function renderOnboarding(){
  const p=state.profile;
  for(const option of $("professionalOptions").querySelectorAll("input")){
    option.checked=p?.professional_goal===option.value;
    option.closest(".choice").classList.toggle("selected",option.checked);
  }
  for(const option of $("preparationOptions").querySelectorAll("input")){
    option.checked=(p?.preparation_goals||[]).includes(option.value);
    option.closest(".choice").classList.toggle("selected",option.checked);
  }
  $("targetRole").value=p?.target_role||"";
  $("preferredLocale").value=p?.preferred_locale||"fr";
  text("onboardingError","");
}
async function submitOnboarding(event){
  event.preventDefault();
  text("onboardingError","");
  const professional_goal=$('onboardingForm').querySelector('input[name="professionalGoal"]:checked')?.value;
  const preparation_goals=chosenPrep("preparationOptions");
  if(!professional_goal){error("onboardingError","Sélectionnez un objectif professionnel.");return;}
  if(!preparation_goals.length){error("onboardingError","Sélectionnez au moins un objectif de préparation.");return;}
  const payload={professional_goal,preparation_goals,
    target_role:$("targetRole").value.trim()||null,
    preferred_locale:$("preferredLocale").value};
  $("saveProfile").disabled=true;
  try{await saveProfile(payload);renderDashboard();show("dashboard");}
  catch(e){error("onboardingError",e);}
  finally{$("saveProfile").disabled=false;}
}
function renderDashboard(){
  text("profileMode",state.mode==="demo"?"PROFIL DÉMO · TEMPORAIRE":"PROFIL RÉEL · RLS");
  text("profileEmail",state.user.email);
  text("profileGoal",GOALS[state.profile.professional_goal]||state.profile.professional_goal);
  text("profilePrep",names(state.profile.preparation_goals));
  text("profileRole",state.profile.target_role||"Non renseigné");
  text("dashboardNotice",state.mode==="demo"
    ? "En mode démo, vous pouvez parcourir toutes les étapes avec des questions brouillon issues de votre référentiel local. Pas de notation IA."
    : "Votre profil est enregistré dans Supabase. Aucune question n'est encore publiée dans le catalogue réel : la simulation complète reste bloquée.");
}
function renderConfiguration(){
  state.selectedGoals=[...state.profile.preparation_goals];
  const container=$("simulationGoals");container.replaceChildren();
  for(const [code,label] of Object.entries(PREP)){
    const item=document.createElement("label");item.className="choice";
    const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.value=code;
    checkbox.checked=state.selectedGoals.includes(code);
    item.classList.toggle("selected",checkbox.checked);
    const bold=document.createElement("b");bold.textContent=label;
    item.append(checkbox,bold);container.append(item);
  }
  $("simDifficulty").value="";
  $("simJobDescription").value="";
  $("simFamily").value="rh";
  $("simCount").value="3";
  text("configurationError","");
}
async function startSimulation(event){
  event.preventDefault();text("configurationError","");
  const simGoals=chosenPrep("simulationGoals");
  if(!simGoals.length){error("configurationError","Choisissez au moins un objectif pour cet entretien.");return;}
  state.selection={
    family:$("simFamily").value,
    difficulty:$("simDifficulty").value?Number($("simDifficulty").value):null,
    locale:state.profile.preferred_locale,
    count:Number($("simCount").value),
    prepGoals:simGoals,
    jobDescription:$("simJobDescription").value.trim(),
  };
  if(state.mode==="live"){
    error("configurationError",
      "Le catalogue Supabase contient 0 question approuvée/publiée. Une vraie simulation ne peut pas démarrer. Testez le parcours en mode démo pour vérifier l'interface complète.");
    return;
  }
  $("launchInterview").disabled=true;
  try{
    const {items}=await jsonResponse("/api/questions?family="+encodeURIComponent(state.selection.family)+"&locale="+state.selection.locale);
    let filtered=items.filter(q=>!state.selection.difficulty||q.difficulty===state.selection.difficulty);
    if(filtered.length===0)throw Error("Aucune question démo pour ce niveau.");
    state.questions=filtered.slice(0,state.selection.count);
    state.answers=[];state.index=0;
    showCurrentQuestion();show("interview");
  }catch(e){error("configurationError",e);}
  finally{$("launchInterview").disabled=false;}
}
function showCurrentQuestion(){
  const q=state.questions[state.index],count=state.questions.length;
  text("interviewProgress","Question "+(state.index+1)+" / "+count);
  $("interviewProgressBar").style.width=(100*state.index/count)+"%";
  text("interviewCode",q.code);
  text("interviewLevel","L"+q.difficulty+" · "+q.category);
  text("interviewPrompt",q.prompt);
  const followup=q.followup?"Relance préparée (non IA) : "+q.followup:"Pas de relance prédéfinie";
  text("interviewFollowup",followup);
  $("interviewAnswer").value="";
  text("interviewError","");
  text("submitAnswer",state.index===count-1?"Terminer l'entretien":"Valider ma réponse et continuer →");
}
function completeStep(){
  state.answers.push({
    code:state.questions[state.index].code,
    prompt:state.questions[state.index].prompt,
    answer:$("interviewAnswer").value.trim(),
  });
  state.index+=1;
  if(state.index>=state.questions.length){renderRecap();show("recap");}
  else{showCurrentQuestion();}
}
function renderRecap(){
  text("recapCount",state.answers.length+" question(s)");
  text("recapPersistentGoals",names(state.profile.preparation_goals));
  text("recapSimulationGoals",names(state.selection.prepGoals));
  $("recapAnswers").replaceChildren();
  for(const answer of state.answers){
    const block=document.createElement("div");block.className="item";
    const code=document.createElement("span");code.className="tag";code.textContent=answer.code;
    const title=document.createElement("h3");title.textContent=answer.prompt;
    const paragraph=document.createElement("p");paragraph.textContent=answer.answer||"Aucune réponse saisie";
    block.append(code,title,paragraph);$("recapAnswers").append(block);
  }
}
async function signOut(){
  if(state.mode==="live"&&state.accessToken){
    try{await jsonResponse(supabasePath("/auth/v1/logout"),{
      method:"POST",headers:authHeaders(state.accessToken),body:"{}",
    });}catch { /* Client state is still cleared; backend tokens expire server-side. */ }
  }
  state.user=null;state.accessToken=null;state.profile=null;state.selectedGoals=[];
  state.questions=[];state.answers=[];state.index=0;
  text("modeIndicator","MODE DÉMO · LOCAL");
  show("welcome");
}
async function init(){
  try{
    const cfg=await jsonResponse("/api/e2e/config");
    if(cfg.live_available){
      state.liveConfig={supabase_url:cfg.supabase_url,publishable_key:cfg.publishable_key};
      $("chooseLive").disabled=false;
      text("liveAvailability","Disponible : compte Supabase réel et préférences persistantes.");
    }else{
      text("liveAvailability","Mode réel disponible après configuration des variables SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY sur votre Mac.");
    }
  }catch(e){text("liveAvailability","Impossible de vérifier la connexion Supabase locale : "+e.message);}
}
$("chooseDemo").onclick=()=>enterAuth("demo");
$("chooseLive").onclick=()=>{if(state.liveConfig)enterAuth("live");};
$("toggleAuth").onclick=()=>{state.authMode=state.authMode==="signup"?"login":"signup";renderAuth();};
$("authForm").addEventListener("submit",doAuth);
$("onboardingForm").addEventListener("submit",submitOnboarding);
$("professionalOptions").addEventListener("change",event=>{
  if(event.target.matches('input[type="radio"]'))
    for(const node of event.currentTarget.querySelectorAll(".choice"))
      node.classList.toggle("selected",node.querySelector("input").checked);
});
for(const id of ["preparationOptions","simulationGoals"]){
  $(id).addEventListener("change",event=>{
    if(event.target.matches('input[type="checkbox"]'))
      event.target.closest(".choice").classList.toggle("selected",event.target.checked);
  });
}
$("editProfile").onclick=()=>{renderOnboarding();show("onboarding");};
$("signOut").onclick=signOut;
$("goConfigure").onclick=()=>{renderConfiguration();show("configure");};
$("backDashboard").onclick=()=>{renderDashboard();show("dashboard");};
$("configurationForm").addEventListener("submit",startSimulation);
$("submitAnswer").onclick=completeStep;
$("stopInterview").onclick=()=>{renderDashboard();show("dashboard");};
$("retrySimulation").onclick=()=>{renderConfiguration();show("configure");};
$("returnDashboard").onclick=()=>{renderDashboard();show("dashboard");};
init();
