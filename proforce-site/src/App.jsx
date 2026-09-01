import { useState, useEffect } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  ink:       "#0d2545",       // bleu marine profond
  inkLight:  "#163366",       // bleu marine moyen
  paper:     "#ffffff",       // blanc pur
  paperDark: "#f0f4f9",       // blanc bleuté très léger
  orange:    "#e85d1a",
  orangeHov: "#d04e10",
  rule:      "#c8d4e3",       // filet bleu clair
  muted:     "#5a7a9a",       // bleu-gris pour texte secondaire
  white:     "#ffffff",
};

// ─── FONTS ────────────────────────────────────────────────────────────────────
// Clash Display (condensed grotesque bold) + Spectral (serif éditorial) + DM Mono (chiffres)
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
`;

// ─── GLOBAL ───────────────────────────────────────────────────────────────────
const G = `
  ${fonts}
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { font-family:'DM Sans',sans-serif; background:${C.paper}; color:${C.ink}; }

  h1,h2,h3 { font-family:'Clash Display',sans-serif; font-weight:600; letter-spacing:-0.02em; }

  /* Règle typographique */
  .rule { display:block; width:100%; height:1px; background:${C.rule}; }
  .rule-orange { display:block; height:2px; background:${C.orange}; }

  /* Label de section */
  .eyebrow {
    font-family:'DM Mono',monospace; font-size:0.68rem;
    letter-spacing:0.18em; text-transform:uppercase; color:${C.muted};
    display:flex; align-items:center; gap:10px;
  }
  .eyebrow::before { content:''; display:inline-block; width:20px; height:1px; background:${C.orange}; }

  /* Boutons */
  .btn-ink {
    display:inline-block; background:${C.ink}; color:#fff;
    padding:12px 28px; font-family:'DM Sans',sans-serif; font-weight:600;
    font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    transition:background 0.2s, transform 0.15s;
  }
  .btn-ink:hover { background:${C.inkLight}; transform:translateY(-2px); }

  .btn-orange {
    display:inline-block; background:${C.orange}; color:#fff;
    padding:12px 28px; font-family:'DM Sans',sans-serif; font-weight:600;
    font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    transition:background 0.2s, transform 0.15s;
  }
  .btn-orange:hover { background:${C.orangeHov}; transform:translateY(-2px); }

  .btn-ghost {
    display:inline-block; border:1.5px solid ${C.ink}; color:${C.ink};
    padding:11px 28px; font-family:'DM Sans',sans-serif; font-weight:600;
    font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    transition:background 0.2s, color 0.2s;
  }
  .btn-ghost:hover { background:${C.ink}; color:#fff; }

  a { text-decoration:none; color:inherit; }
  button { cursor:pointer; border:none; background:none; font-family:inherit; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ticker {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }
  .fu  { animation:fadeUp 0.6s ease both; }
  .fu2 { animation:fadeUp 0.6s 0.1s ease both; }
  .fu3 { animation:fadeUp 0.6s 0.2s ease both; }

  @media(max-width:768px){
    .hide-mobile { display:none !important; }
    .show-mobile { display:flex !important; }
    .two-col     { grid-template-columns:1fr !important; }
    .three-col   { grid-template-columns:1fr !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name:"Simon St-Amand",   photo:"/equipe/simon-st-amand.jpg", init:"SS", title:{en:"President",fr:"Président"}, sector:{en:"Food / CPG & Fashion",fr:"Alimentaire / CPG & Mode"}, linkedin:"https://www.linkedin.com/in/simonstamand", articles:["recrutement-passif","agisme-recrutement","erreurs-offre-emploi","marche-alimentaire-2026","combien-coute-recruteur","processus-entrevue-trop-long","salaires-alimentaire-canada-2026","penurie-main-oeuvre-alimentaire","onboarding-nouveau-directeur"],
    bio:{en:"Simon has been President and shareholder of Proforce since 2018. He joined the firm in 2015, founded its food division, and opened Ontario and the Maritimes as territories. He knows the food, CPG, and fashion markets in Quebec and Ontario as well as anyone in recruitment. His approach is direct, relationship-driven, and built on accountability. When you work with Proforce, you work with someone who's been doing this long enough to know what actually matters.",
         fr:"Simon est président et actionnaire de Proforce depuis 2018. Il a rejoint la firme en 2015, y a fondé la division alimentaire et ouvert l'Ontario et les Maritimes comme territoires. Il connaît les marchés alimentaire, CPG et mode au Québec et en Ontario aussi bien que n'importe qui dans le recrutement. Son approche est directe, axée sur les relations et fondée sur l'imputabilité. Quand tu travailles avec Proforce, tu travailles avec quelqu'un qui fait ça depuis assez longtemps pour savoir ce qui compte vraiment."} },
  { name:"Robin Anisef",     photo:"/equipe/robin-anisef.jpg", init:"RA", title:{en:"Partner",fr:"Associée"}, sector:{en:"Fashion & Apparel",fr:"Mode & Habillement"}, linkedin:"https://www.linkedin.com/in/robinanisef", articles:["mode-recrutement-canada"],
    bio:{en:"Robin is the reason Proforce's fashion practice is what it is. She spent years working in the fashion industry before moving into recruiting, which means she understands the business from the inside, not just from a job description. She's been recruiting in Canadian fashion for over 20 years and has built a network that runs deep across Montreal and Toronto.",
         fr:"Robin est la raison pour laquelle la pratique mode de Proforce est ce qu'elle est. Elle a travaillé dans l'industrie de la mode avant de passer au recrutement, ce qui veut dire qu'elle comprend le business de l'intérieur. Elle recrute dans la mode canadienne depuis plus de 20 ans et a bâti un réseau qui va loin dans Montréal et Toronto."} },
  { name:"Stéphanie Lanoie", photo:"/equipe/stephanie-lanoie.jpg", init:"SL", title:{en:"Recruiter",fr:"Recruteuse"}, sector:{en:"Food Industry, Quebec",fr:"Alimentaire, Québec"}, linkedin:"https://www.linkedin.com/in/stephanie-lanoie-84a321a4", articles:["erreurs-offre-emploi","changer-recruteur"],
    bio:{en:"Stéphanie is Proforce's Quebec food industry specialist. She knows the province's manufacturing and CPG sector, the plants, the companies, the people, and she brings that knowledge to every search. Her candidates aren't pulled from a database. They come from a network built through years of real conversations.",
         fr:"Stéphanie est la spécialiste de l'alimentaire au Québec chez Proforce. Elle connaît le secteur manufacturier et CPG de la province, les usines, les compagnies, les gens, et elle apporte cette connaissance à chaque mandat. Ses candidats ne viennent pas d'une base de données."} },
  { name:"Rana Yamak",       photo:"/equipe/rana-yamak.jpg", init:"RY", title:{en:"Recruiter",fr:"Recruteuse"}, sector:{en:"Food & CPG, Canada / US",fr:"Alimentaire & CPG, Canada / É.-U."}, linkedin:"https://www.linkedin.com/in/rana-yamak-13a107250", articles:["recrutement-passif","marche-alimentaire-2026","salaires-alimentaire-canada-2026","penurie-main-oeuvre-alimentaire","linkedin-profil-alimentaire"],
    bio:{en:"Rana covers the food and CPG market across Ontario and the United States with the same depth that Stéphanie brings to Quebec. She specializes in quality, food safety, and operations roles: the mandates that require real industry knowledge to fill well.",
         fr:"Rana couvre le marché alimentaire et CPG en Ontario et aux États-Unis avec la même profondeur que Stéphanie apporte au Québec. Elle se spécialise dans les rôles en qualité, salubrité alimentaire et opérations."} },
  { name:"Michaela Landers", photo:"/equipe/michaela-landers.jpg", init:"ML", title:{en:"Recruiting Director",fr:"Directrice, recrutement"}, sector:{en:"Food Industry, Ontario",fr:"Alimentaire, Ontario"}, linkedin:"https://www.linkedin.com/in/michaelalanders", articles:["agisme-recrutement","marche-alimentaire-2026","processus-entrevue-trop-long","onboarding-nouveau-directeur"],
    bio:{en:"Michaela leads Proforce's Ontario food manufacturing practice. She focuses on production, operations, and supply chain: the roles that keep a plant running. Her placements tend to stick because she takes the time to understand what a company actually needs.",
         fr:"Michaela dirige la pratique en fabrication alimentaire en Ontario chez Proforce. Elle se concentre sur la production, les opérations et la chaîne d'approvisionnement. Ses placements tendent à durer parce qu'elle prend le temps de comprendre ce qu'une compagnie a vraiment besoin."} },
];

const FOOD_ROLES = {
  en:["Plant Manager","QA Director","Production Supervisor","Food Safety Manager","VP Operations","R&D Scientist","Procurement Manager","Supply Chain Director","Account Manager","Sales Representative"],
  fr:["Directeur d'usine","Directeur assurance qualité","Superviseur de production","Responsable salubrité","VP Opérations","Scientifique R&D","Directeur approvisionnement","Directeur chaîne d'approvisionnement","Chargé de compte","Représentant aux ventes"],
};
const FASHION_ROLES = {
  en:["Buyer","Merchandise Planner","Brand Manager","Visual Merchandiser","Account Executive","Production Coordinator","Designer","Sales Director","Retail Manager","E-commerce Manager"],
  fr:["Acheteur","Planificateur marchandise","Gestionnaire de marque","Marchandiseur visuel","Chargé de compte","Coordinateur production","Designer","Directeur des ventes","Directeur de détail","Gestionnaire e-commerce"],
};
const CHARITIES = [
  {name:"UNICEF",desc:{en:"Supporting children's rights and well-being worldwide.",fr:"Soutien aux droits et au bien-être des enfants dans le monde."}},
  {name:"Starlight Foundation",desc:{en:"Bringing joy to seriously ill children and their families.",fr:"Apporter de la joie aux enfants gravement malades et leurs familles."}},
  {name:"Hôpital de Montréal pour Enfants",desc:{en:"Supporting pediatric care in Montreal.",fr:"Soutien aux soins pédiatriques à Montréal."}},
  {name:"Just for Kids Foundation",desc:{en:"Enriching the lives of children in need.",fr:"Enrichir la vie des enfants dans le besoin."}},
];

const POSTS = [
  { id:"recrutement-passif", cat:{en:"Hiring",fr:"Embauche"}, date:"Mai 2026", read:{en:"3 min",fr:"3 min"},
    title:{en:"The candidate you need isn't on any job board.",fr:"Le candidat dont t'as besoin n'est sur aucun babillard."},
    excerpt:{en:"Companies post, get 200 resumes, none fit, then call us. Here's why that pattern never changes.",fr:"Les compagnies affichent, reçoivent 200 CV, aucun ne convient, et ils nous appellent. Voilà pourquoi."},
    body:{en:`I've been placing food industry professionals for over 20 years. The pattern never changes: companies post a job, get 200 resumes, none of them fit, and then they call us. Here's why that happens.\n\nThe best plant managers, quality directors, and supply chain leaders aren't refreshing LinkedIn. They're running a shift, managing a team, dealing with an audit. They're employed, engaged, and not going anywhere, unless someone calls them with the right opportunity at the right time.\n\nThat's the whole game. Not posting and waiting. Calling people you already know, people who trust you enough to have a real conversation about what's next.\n\nWe've spent 25 years building that network. When a client calls us about a Plant Manager in Ontario, I'm not starting from scratch. I already know who the right people are. Half of them I've placed before, or they've referred someone to us, or we've talked three times over the years and stayed in touch.\n\nThe résumé pile approach works fine if you're hiring for an entry-level role. For anything that matters, a director, a VP, a quality lead, you need someone who isn't looking. And you need someone who can find them.\n\nThat's what we do.`,
          fr:`Ça fait plus de 20 ans que je place des professionnels dans l'alimentaire. Le pattern ne change jamais : une compagnie affiche un poste, reçoit 200 CV, aucun ne convient, et ils nous appellent. Voilà pourquoi.\n\nLes meilleurs directeurs d'usine, directeurs qualité et responsables chaîne d'approvisionnement ne rafraîchissent pas LinkedIn. Ils gèrent un quart, supervisent une équipe, passent un audit. Ils sont employés, engagés, et ils ne bougent pas, à moins que quelqu'un les appelle avec la bonne opportunité au bon moment.\n\nC'est tout le jeu. Pas afficher et attendre. Appeler des gens qu'on connaît déjà, des gens qui nous font assez confiance pour avoir une vraie conversation sur ce qui s'en vient.\n\nOn a passé 25 ans à bâtir ce réseau. Quand un client nous appelle pour un directeur d'usine en Ontario, je ne pars pas de zéro. Je sais déjà qui sont les bonnes personnes.\n\nL'approche par pile de CV fonctionne bien pour des postes d'entrée de gamme. Pour tout ce qui compte, un directeur, un VP, un responsable qualité, t'as besoin de quelqu'un qui ne cherche pas. Et t'as besoin de quelqu'un qui peut le trouver.\n\nC'est ce qu'on fait.`} },

  { id:"agisme-recrutement", cat:{en:"Hiring",fr:"Embauche"}, date:"Avril 2026", read:{en:"4 min",fr:"4 min"},
    title:{en:"\"We want someone long-term.\" Then why are you screening out the 50-year-olds?",fr:"\"On veut quelqu'un pour le long terme.\" Alors pourquoi vous éliminez les 50 ans?"},
    excerpt:{en:"Companies want stability. Then they pass on a 52-year-old with a track record and hire someone who leaves in 18 months.",fr:"Les compagnies veulent de la stabilité. Ensuite elles passent sur un candidat de 52 ans et embauchent quelqu'un qui part après 18 mois."},
    body:{en:`I hear it constantly. Companies want stability. They want someone who'll stay 5, 7, 10 years. And then they pass on a 52-year-old with a track record, and hire a 31-year-old who leaves in 18 months.\n\nThe data doesn't lie. Average job tenure for someone in their early 30s in food manufacturing? About 2.5 years. Someone in their early 50s? Closer to 6. If long-term retention is actually the goal, the math is pretty clear.\n\nI'm not saying age is everything. I'm saying it's a real factor that gets systematically ignored while companies claim to want stability.\n\nHere's what I see on the ground: a 53-year-old Quality Director with 25 years in food safety, who's seen every audit, every recall scare, every regulatory shift. Deep network. Steady under pressure. Not interested in climbing anymore, interested in doing good work and finishing strong.\n\nThat profile gets screened out before the first call because someone decides they want "fresh energy", which is often just code for age.\n\nIt's a costly mistake. And I tell my clients that directly.\n\nThe best hire isn't always the one who looks newest. Sometimes it's the one who's already been through everything you're about to face.`,
          fr:`Je l'entends tout le temps. Les compagnies veulent de la stabilité. Et ensuite elles passent sur un candidat de 52 ans avec un bilan solide, et embauchent un candidat de 31 ans qui part après 18 mois.\n\nLes données ne mentent pas. La durée moyenne en poste pour quelqu'un au début de la trentaine en fabrication alimentaire? Environ 2,5 ans. Pour quelqu'un au début de la cinquantaine? Plus proche de 6 ans. Si la rétention à long terme est vraiment l'objectif, le calcul est assez clair.\n\nJe dis pas que l'âge c'est tout. Je dis que c'est un facteur réel qui se fait systématiquement ignorer.\n\nVoilà ce que je vois sur le terrain : un directeur qualité de 53 ans avec 25 ans en salubrité alimentaire, qui a vu chaque audit, chaque risque de rappel, chaque changement réglementaire. Réseau solide. Calme sous pression. Plus intéressé à grimper, intéressé à bien faire son travail et finir en force.\n\nCe profil se fait éliminer avant le premier appel parce que quelqu'un décide qu'il veut une "énergie fraîche", ce qui est souvent juste un code pour l'âge.\n\nC'est une erreur coûteuse. Et je le dis directement à mes clients.`} },

  { id:"erreurs-offre-emploi", cat:{en:"Hiring",fr:"Embauche"}, date:"Mars 2026", read:{en:"3 min",fr:"3 min"},
    title:{en:"Your job posting is why you're not getting good candidates.",fr:"Ton offre d'emploi, c'est pour ça que t'as pas de bons candidats."},
    excerpt:{en:"Most food industry job postings are a list of requirements dressed up as an opportunity.",fr:"La plupart des offres d'emploi dans l'alimentaire sont une liste d'exigences déguisée en opportunité."},
    body:{en:`I read a lot of food industry job postings. Most of them are a list of requirements dressed up as an opportunity.\n\nFirst problem: you lead with what you want, not what you're offering. "5+ years of experience, HACCP certification required, bilingual, available for travel." Great. But why would someone good want to work for you specifically?\n\nSecond problem: the salary range is missing, or it's absurdly wide. "$60,000 to $110,000 depending on experience" tells a candidate exactly nothing. It signals that you haven't thought seriously about what this role is worth.\n\nThird problem: every company sounds the same. "Dynamic environment." "Fast-paced team." "Competitive benefits." These phrases mean nothing to a Quality Manager evaluating three different offers.\n\nWhat actually works: tell them something real about the plant. Tell them why the last person in this role left. Tell them what growth looks like. Give them a real salary range and a honest picture of the culture.\n\nGood candidates have options. If your posting doesn't answer the basic questions, they move on.\n\nThe posting is your first pitch. Make it count.`,
          fr:`Je lis beaucoup d'offres d'emploi dans l'alimentaire. La plupart sont une liste d'exigences déguisée en opportunité.\n\nPremier problème : tu commences par ce que tu veux, pas par ce que t'offres. "5+ ans d'expérience, certification HACCP requise, bilingue, disponible pour les voyages." Super. Mais pourquoi quelqu'un de bon voudrait travailler pour toi spécifiquement?\n\nDeuxième problème : la fourchette salariale est absente ou absurdement large. "60 000$ à 110 000$ selon l'expérience" ne dit absolument rien à un candidat.\n\nTroisième problème : toutes les compagnies sonnent pareil. "Environnement dynamique." "Avantages compétitifs." Ces phrases ne veulent rien dire.\n\nCe qui fonctionne : dis-leur quelque chose de concret sur l'usine. Dis-leur pourquoi la dernière personne dans ce rôle est partie. Donne-leur une vraie fourchette salariale et un portrait honnête de la culture.\n\nL'offre d'emploi c'est ton premier pitch. Fais-le compter.`} },

  { id:"changer-recruteur", cat:{en:"Career",fr:"Carrière"}, date:"Février 2026", read:{en:"3 min",fr:"3 min"},
    title:{en:"How to get a headhunter to actually call you back.",fr:"Comment faire en sorte qu'un chasseur de têtes te rappelle vraiment."},
    excerpt:{en:"You sent your resume to three agencies and heard nothing. Here's what's actually happening on our end.",fr:"T'as envoyé ton CV à trois agences et t'as rien entendu. Voilà ce qui se passe vraiment de notre côté."},
    body:{en:`You sent your resume to three agencies and heard nothing. Here's what's actually happening on our end.\n\nFirst, understand how we work. We're not sitting here waiting for resumes. Most of our placements happen in reverse: a client calls with a need, and we go into our network to find the right person. The unsolicited resume pile gets looked at occasionally, but it's not where we start.\n\nWhat actually gets you on our radar:\n\nBe specific. "Experienced food industry professional looking for new opportunities" tells me nothing. "Quality Assurance Manager with 8 years in dairy, SQF certified, open to Director-level roles in Ontario", now I can do something with that.\n\nMake it easy to find you. Update your LinkedIn. Put your certifications in your headline. Make your industry clear. When I'm looking for a HACCP-certified QA Director in Ontario, LinkedIn is where I start. If your profile doesn't surface, you don't exist.\n\nStay in touch without being annoying. If you reached out six months ago and nothing happened, follow up. One email: "Just checking in, still open to the right opportunity." That's it.\n\nThe people we call first are the ones we already know. The goal is to be known before you're needed.`,
          fr:`T'as envoyé ton CV à trois agences et t'as rien entendu. Voilà ce qui se passe vraiment de notre côté.\n\nD'abord, comprends comment on fonctionne. On est pas là à attendre que des CV arrivent. La plupart de nos placements se font à l'inverse : un client appelle avec un besoin, et on va dans notre réseau trouver la bonne personne.\n\nCe qui te met vraiment sur notre radar :\n\nSois spécifique. "Professionnel expérimenté dans l'alimentaire à la recherche de nouvelles opportunités" ne me dit rien. "Directeur assurance qualité avec 8 ans dans les produits laitiers, certifié SQF, ouvert à des rôles de direction en Ontario", là je peux faire quelque chose.\n\nFacilite-toi à trouver. Mets à jour ton LinkedIn. Mets tes certifications dans ton titre. Quand je cherche un directeur QA certifié HACCP en Ontario, LinkedIn c'est là que je commence.\n\nReste en contact sans être envahissant. Un courriel : "Juste pour prendre des nouvelles, je suis toujours ouvert à la bonne opportunité."\n\nLes gens qu'on appelle en premier sont ceux qu'on connaît déjà. L'objectif c'est d'être connu avant d'être nécessaire.`} },

  { id:"marche-alimentaire-2026", cat:{en:"Market",fr:"Marché"}, date:"Janvier 2026", read:{en:"4 min",fr:"4 min"},
    title:{en:"What I'm seeing in food industry hiring right now.",fr:"Ce que je vois dans l'embauche alimentaire en ce moment."},
    excerpt:{en:"25 years in, I still take notes on what's shifting. Here's the ground-level version, not the LinkedIn think-piece version.",fr:"Après 25 ans, je prends encore des notes sur ce qui change. Voilà la version terrain, pas la version article LinkedIn."},
    body:{en:`25 years in, I still take notes on what's shifting. Here's what's actually happening, not the LinkedIn think-piece version, the ground-level version.\n\nQuality and food safety roles are tight. Really tight. The pipeline of experienced QA professionals with HACCP, SQF, and FSMA knowledge hasn't kept up with demand, especially in Ontario manufacturing. Companies that used to take two months to hire are now taking five.\n\nSupply chain is in an interesting spot. The panic hiring of 2021 to 2022 created a generation of professionals with inflated titles and thin experience. Companies are now sorting through that, they want people who actually built resilient supply chains.\n\nSalary expectations have reset upward and aren't coming back down. A Plant Manager role that paid $110k in 2019 is now $140k minimum if you want serious candidates. Some clients are still anchored to pre-pandemic comp expectations. That's a conversation we have a lot.\n\nOntario is the growth market. More mandates out of the GTA and southwestern Ontario than ever before. Greenfield facilities coming online, the need for experienced operations and quality leadership is real and ongoing.\n\nThe best candidates are still getting multiple offers. If your process takes eight weeks and four rounds of interviews, you're losing people. Speed is a competitive advantage right now.\n\nThat's the landscape as I see it.`,
          fr:`Après 25 ans, je prends encore des notes sur ce qui change. Voilà ce qui se passe vraiment, pas la version article LinkedIn, la version terrain.\n\nLes postes en qualité et salubrité alimentaire sont serrés. Vraiment serrés. Le bassin de professionnels QA expérimentés avec des connaissances HACCP, SQF et FSMA n'a pas suivi la demande, surtout en Ontario. Des compagnies qui prenaient deux mois pour embaucher en prennent maintenant cinq.\n\nLa chaîne d'approvisionnement est dans une position intéressante. L'embauche de panique de 2021-2022 a créé une génération de professionnels avec des titres gonflés et une expérience mince.\n\nLes attentes salariales ont remonté et ne redescendront pas. Un poste de directeur d'usine qui payait 110 000$ en 2019 est maintenant 140 000$ minimum si tu veux des candidats sérieux.\n\nL'Ontario est le marché en croissance. Plus de mandats du Grand Toronto et du sud-ouest de l'Ontario que jamais.\n\nLes meilleurs candidats reçoivent encore plusieurs offres. Si ton processus prend huit semaines et quatre rondes d'entrevues, tu perds des gens. La vitesse est un avantage concurrentiel en ce moment.`} },

  { id:"combien-coute-recruteur", cat:{en:"Hiring",fr:"Embauche"}, date:"Mai 2026", read:{en:"4 min",fr:"4 min"},
    title:{en:"How much does a recruiter cost in food manufacturing? Here's the real answer.",fr:"Combien coûte un recruteur en fabrication alimentaire? Voilà la vraie réponse."},
    excerpt:{en:"Most companies have no idea what recruiter fees actually look like until they get the invoice. Let's fix that.",fr:"La plupart des compagnies n'ont aucune idée de ce à quoi ressemblent vraiment les honoraires de recruteur jusqu'à ce qu'elles reçoivent la facture. Réglons ça."},
    body:{en:`Most companies have no idea what recruiter fees actually look like until they get the invoice. Let's fix that.\n\nThe standard fee for a permanent placement recruiter in food manufacturing and CPG is between 18% and 25% of the placed candidate's first-year base salary. That's the market. Anyone charging significantly less is cutting corners somewhere. Anyone charging significantly more needs to justify it.\n\nAt Proforce, we work on a contingency or retained basis depending on the mandate. Contingency means no placement, no fee. Retained means an upfront payment to begin the search, with the balance due at placement.\n\nNow let's talk about whether it's worth it.\n\nA Quality Director in Ontario costs somewhere between $110,000 and $145,000 in base salary in today's market. At 20%, the recruiter fee is $22,000 to $29,000. That sounds like a lot until you think about what a bad hire costs.\n\nA failed hire at the director level, someone who leaves in 6 months or gets let go, typically costs 1.5x to 3x their annual salary when you factor in recruitment time, lost productivity, training investment, and team disruption. On a $130,000 role, that's $195,000 to $390,000 in real cost.\n\nThe recruiter fee isn't the cost. The bad hire is the cost.\n\nWhat you're paying for is two things: access and accountability. Access to candidates who are not on any job board and would never respond to your posting. And accountability, because a good recruiter stands behind their placement with a guarantee.\n\nIf a candidate leaves within the guarantee period, we find another one. At no additional charge.\n\nThat's the math. Call us if you want to talk through it for your specific situation.`,
          fr:`La plupart des compagnies n'ont aucune idée de ce à quoi ressemblent vraiment les honoraires de recruteur jusqu'à ce qu'elles reçoivent la facture. Réglons ça.\n\nLes honoraires standard pour un recruteur en placement permanent dans la fabrication alimentaire et le CPG se situent entre 18% et 25% du salaire de base de première année du candidat placé. C'est le marché. Quiconque charge nettement moins coupe des coins quelque part. Quiconque charge nettement plus doit le justifier.\n\nChez Proforce, on travaille sur une base contingente ou retenue selon le mandat. Contingent signifie pas de placement, pas d'honoraires. Retenu signifie un paiement initial pour commencer la recherche, avec le solde dû au placement.\n\nMaintenant parlons de si ça vaut la peine.\n\nUn directeur qualité en Ontario coûte quelque part entre 110 000$ et 145 000$ en salaire de base dans le marché d'aujourd'hui. À 20%, les honoraires du recruteur sont de 22 000$ à 29 000$. Ça semble beaucoup jusqu'à ce que tu penses à ce que coûte une mauvaise embauche.\n\nUne embauche ratée au niveau directeur, quelqu'un qui part après 6 mois ou qui se fait remercier, coûte typiquement 1,5 à 3 fois leur salaire annuel quand tu tiens compte du temps de recrutement, de la productivité perdue, de l'investissement en formation et de la perturbation de l'équipe. Sur un rôle à 130 000$, c'est 195 000$ à 390 000$ en coût réel.\n\nLes honoraires du recruteur ne sont pas le coût. La mauvaise embauche est le coût.\n\nCe pour quoi tu paies c'est deux choses : l'accès et l'imputabilité. L'accès à des candidats qui ne sont sur aucun babillard d'emploi et qui ne répondraient jamais à ton affichage. Et l'imputabilité, parce qu'un bon recruteur se tient derrière son placement avec une garantie.\n\nSi un candidat part dans la période de garantie, on en trouve un autre. Sans frais supplémentaires.\n\nC'est le calcul. Appelle-nous si tu veux en parler pour ta situation spécifique.`} },

  { id:"processus-entrevue-trop-long", cat:{en:"Hiring",fr:"Embauche"}, date:"Avril 2026", read:{en:"3 min",fr:"3 min"},
    title:{en:"Your interview process is too long. You're losing candidates because of it.",fr:"Ton processus d'entrevue est trop long. Tu perds des candidats à cause de ça."},
    excerpt:{en:"Four rounds of interviews for a plant supervisor. I've seen it. Here's what it's costing you.",fr:"Quatre rondes d'entrevues pour un superviseur d'usine. Je l'ai vu. Voilà ce que ça te coûte."},
    body:{en:`Four rounds of interviews for a plant supervisor. I've seen it. Here's what it's costing you.\n\nThe best candidates in food manufacturing right now are fielding multiple offers simultaneously. They are not sitting around waiting for your fourth interview. They are signing offers with companies that moved faster than you.\n\nI watch this happen regularly. A client finds a strong QA Manager candidate. First interview goes great. Second interview scheduled two weeks later. Then a panel interview. Then a meeting with the VP. Then a reference check that takes another week. Then an offer.\n\nSix weeks. The candidate accepted another offer in week three.\n\nThe irony is that the companies with the longest interview processes are usually the ones that say they "can't find good candidates." They found them. They just lost them.\n\nHere's what a reasonable process looks like for a mid to senior food manufacturing role: an initial recruiter screen, one substantive interview with the hiring manager, one second interview (optional, for senior roles), references, offer. Three to four weeks from first contact to signed offer.\n\nIf you need six interviews to make a hiring decision, the problem isn't the candidate. It's the decision-making process internally.\n\nWhen we present a shortlist, we tell our clients: these candidates are good and they have options. Move with intention. We're not trying to rush you into a bad decision, we're trying to help you make a good one before someone else does.\n\nSpeed is a competitive advantage. Use it.`,
          fr:`Quatre rondes d'entrevues pour un superviseur d'usine. Je l'ai vu. Voilà ce que ça te coûte.\n\nLes meilleurs candidats en fabrication alimentaire en ce moment reçoivent plusieurs offres simultanément. Ils n'attendent pas assis ta quatrième entrevue. Ils signent des offres avec des compagnies qui ont bougé plus vite que toi.\n\nJe vois ça arriver régulièrement. Un client trouve un candidat fort comme directeur QA. La première entrevue se passe bien. La deuxième entrevue est prévue deux semaines plus tard. Puis une entrevue de panel. Puis une rencontre avec le VP. Puis une vérification de références qui prend encore une semaine. Puis une offre.\n\nSix semaines. Le candidat a accepté une autre offre à la semaine trois.\n\nL'ironie c'est que les compagnies avec les processus d'entrevue les plus longs sont généralement celles qui disent qu'elles "ne trouvent pas de bons candidats." Elles les ont trouvés. Elles les ont juste perdus.\n\nVoilà à quoi ressemble un processus raisonnable pour un rôle intermédiaire à sénior en fabrication alimentaire : une évaluation initiale par le recruteur, une entrevue substantielle avec le gestionnaire, une deuxième entrevue (optionnelle, pour les rôles séniors), des références, une offre. Trois à quatre semaines du premier contact à l'offre signée.\n\nSi tu as besoin de six entrevues pour prendre une décision d'embauche, le problème n'est pas le candidat. C'est le processus décisionnel interne.\n\nLa vitesse est un avantage concurrentiel. Utilise-le.`} },

  { id:"salaires-alimentaire-canada-2026", cat:{en:"Market",fr:"Marché"}, date:"Mars 2026", read:{en:"5 min",fr:"5 min"},
    title:{en:"What food industry salaries actually look like in Canada in 2026.",fr:"À quoi ressemblent vraiment les salaires dans l'industrie alimentaire au Canada en 2026."},
    excerpt:{en:"The benchmarks have shifted. Here's what we're seeing on actual offers, not survey data.",fr:"Les références ont bougé. Voilà ce qu'on voit sur les vraies offres, pas les données de sondage."},
    body:{en:`The benchmarks have shifted significantly since 2019. Here's what we're actually seeing on offers, not survey data, not industry reports, but real numbers from real mandates in Quebec and Ontario.\n\nPlant Manager (food manufacturing, 200 to 500 employees): $130,000 to $165,000 base. P&L responsibility and union experience push toward the top of that range. In 2019 this role was $95,000 to $120,000.\n\nQuality Assurance Director (SQF/HACCP certified, 10+ years): $110,000 to $145,000. GFSI audit experience and bilingualism add value in Quebec. Strong demand, limited supply, candidates in this profile are receiving competing offers.\n\nSupply Chain Director (CPG, cross-functional): $115,000 to $150,000. SAP and ERP implementation experience push higher. This role has seen the most salary inflation over the past three years.\n\nProduction Supervisor (shift management, 3 to 5 years experience): $65,000 to $85,000. Variable by region, Ontario generally pays 8 to 12% higher than Quebec for equivalent roles.\n\nFood Safety Manager (HACCP, plant-level): $80,000 to $105,000. Bilingual candidates in Quebec are at a premium.\n\nVP Operations (multi-site, full P&L): $170,000 to $220,000 base, plus bonus structure. These mandates are retained searches.\n\nA few observations from the field:\n\nCandidates who receive a competing offer during your process will use it to negotiate. Budget accordingly or move faster.\n\nBonus structures matter more than they used to. A candidate choosing between two similar base salaries will lean toward the one with a clear, achievable bonus plan.\n\nRemote work expectations have reset. Most food manufacturing roles require site presence by definition. Candidates know this. The conversation has shifted to flexibility around start times, schedule arrangements, and hybrid options for administrative functions.\n\nIf your compensation ranges haven't been updated since 2022, they're out of market. We see this regularly and it is the single most common reason a search stalls.`,
          fr:`Les références ont bougé significativement depuis 2019. Voilà ce qu'on voit vraiment sur les offres, pas des données de sondage, pas des rapports d'industrie, mais de vrais chiffres de vrais mandats au Québec et en Ontario.\n\nDirecteur d'usine (fabrication alimentaire, 200 à 500 employés) : 130 000$ à 165 000$ base. La responsabilité P&L et l'expérience en milieu syndiqué poussent vers le haut de cette fourchette. En 2019 ce rôle était entre 95 000$ et 120 000$.\n\nDirecteur assurance qualité (certifié SQF/HACCP, 10+ ans) : 110 000$ à 145 000$. L'expérience d'audit GFSI et le bilinguisme ajoutent de la valeur au Québec. Forte demande, offre limitée, les candidats dans ce profil reçoivent des offres concurrentes.\n\nDirecteur chaîne d'approvisionnement (CPG, transversal) : 115 000$ à 150 000$. L'expérience d'implantation SAP et ERP pousse plus haut. Ce rôle a connu la plus forte inflation salariale au cours des trois dernières années.\n\nSuperviseur de production (gestion de quarts, 3 à 5 ans d'expérience) : 65 000$ à 85 000$. Variable selon la région, l'Ontario paie généralement 8 à 12% de plus que le Québec pour des rôles équivalents.\n\nResponsable salubrité alimentaire (HACCP, niveau usine) : 80 000$ à 105 000$. Les candidats bilingues au Québec sont à prime.\n\nVP Opérations (multi-sites, P&L complet) : 170 000$ à 220 000$ base, plus structure de boni. Ces mandats sont des recherches retenues.\n\nQuelques observations du terrain :\n\nLes candidats qui reçoivent une offre concurrente pendant ton processus l'utiliseront pour négocier. Budget en conséquence ou bouge plus vite.\n\nSi tes fourchettes de rémunération n'ont pas été mises à jour depuis 2022, elles sont hors marché. On voit ça régulièrement et c'est la raison la plus courante pour laquelle une recherche stagne.`} },

  { id:"penurie-main-oeuvre-alimentaire", cat:{en:"Market",fr:"Marché"}, date:"Février 2026", read:{en:"4 min",fr:"4 min"},
    title:{en:"The food industry labour shortage isn't going away. Here's why.",fr:"La pénurie de main-d'oeuvre dans l'alimentaire ne s'en va pas. Voilà pourquoi."},
    excerpt:{en:"I've been saying this for three years. The pipeline problem in food manufacturing is structural, not cyclical.",fr:"Je dis ça depuis trois ans. Le problème de pipeline en fabrication alimentaire est structurel, pas cyclique."},
    body:{en:`I've been saying this for three years. The pipeline problem in food manufacturing is structural, not cyclical.\n\nHere's what I mean.\n\nThe generation of plant managers, quality directors, and operations leaders who learned their craft in the 1990s and 2000s is retiring. And the generation behind them is smaller, less specialized, and increasingly aware that food manufacturing is a hard industry to work in, long hours, physical environments, regulatory pressure, unionized workforces.\n\nAt the same time, the industry has grown. Ontario has seen significant greenfield investment in food processing over the past five years. New facilities in Hamilton, Strathroy, and across the GTA are competing for the same limited pool of experienced operators and quality professionals.\n\nThe math doesn't work. More plants, fewer experienced people.\n\nWhat does this mean practically?\n\nTimelines are longer. The five-week search that was normal in 2018 is now ten to fourteen weeks for senior food manufacturing roles. Companies that planned to "fill the role before the current person leaves" are consistently finding out that's not realistic anymore.\n\nCompensation has inflated. We covered this in another post. The point is that the shortage gives candidates leverage, and they're using it.\n\nThe passive candidate is the only candidate worth pursuing. If you're waiting for someone to apply, you're fishing in a very small pond.\n\nThe companies that are winning the talent competition right now are the ones that move fast, pay fairly, and treat their recruiters as strategic partners rather than a last resort.\n\nThe ones that are struggling are the ones still running the 2015 playbook in a 2026 market.`,
          fr:`Je dis ça depuis trois ans. Le problème de pipeline en fabrication alimentaire est structurel, pas cyclique.\n\nVoilà ce que je veux dire.\n\nLa génération de directeurs d'usine, directeurs qualité et leaders en opérations qui ont appris leur métier dans les années 1990 et 2000 prend sa retraite. Et la génération derrière eux est plus petite, moins spécialisée, et de plus en plus consciente que la fabrication alimentaire est une industrie difficile, longues heures, environnements physiques, pression réglementaire, effectifs syndiqués.\n\nEn même temps, l'industrie a grandi. L'Ontario a connu des investissements greenfield significatifs en transformation alimentaire au cours des cinq dernières années. De nouvelles installations à Hamilton, Strathroy et dans tout le Grand Toronto se disputent le même bassin limité d'opérateurs et de professionnels qualité expérimentés.\n\nLe calcul ne fonctionne pas. Plus d'usines, moins de gens expérimentés.\n\nQu'est-ce que ça signifie concrètement?\n\nLes délais sont plus longs. La recherche de cinq semaines qui était normale en 2018 dure maintenant dix à quatorze semaines pour les rôles séniors en fabrication alimentaire.\n\nLa rémunération a augmenté. La pénurie donne aux candidats du levier, et ils l'utilisent.\n\nLe candidat passif est le seul candidat qui vaut la peine d'être poursuivi. Si tu attends que quelqu'un applique, tu pêches dans un très petit étang.\n\nLes compagnies qui gagnent la compétition des talents en ce moment sont celles qui bougent vite, paient équitablement et traitent leurs recruteurs comme des partenaires stratégiques plutôt qu'un dernier recours.`} },

  { id:"negocier-offre-emploi", cat:{en:"Career",fr:"Carrière"}, date:"Janvier 2026", read:{en:"4 min",fr:"4 min"},
    title:{en:"How to negotiate a job offer without losing it.",fr:"Comment négocier une offre d'emploi sans la perdre."},
    excerpt:{en:"Most people either don't negotiate at all or negotiate badly. Here's how to do it right in food and CPG.",fr:"La plupart des gens ne négocient pas du tout ou négocient mal. Voilà comment bien le faire dans l'alimentaire et le CPG."},
    body:{en:`Most people either don't negotiate at all or negotiate badly. Here's how to do it right in food and CPG.\n\nFirst, a reality check: every employer who makes you an offer expects you to negotiate. It is built into the process. Not negotiating doesn't make you seem easy to work with, it makes you seem like you didn't know you could.\n\nThat said, there's a right way and a wrong way.\n\nThe right way starts with knowing your number before you get the offer. What is the minimum salary you would accept? What would make you say yes without hesitation? What is genuinely above market for your experience and location? If you don't know these numbers going in, you're negotiating blind.\n\nWhen the offer comes, thank them for it genuinely and ask for time. "I'm excited about this opportunity. Can I have 24 to 48 hours to review everything?" This is completely normal and professional. Use that time to compare the full package, base, bonus, benefits, vacation, flexibility, not just the headline number.\n\nIf you want to negotiate, be specific. "Based on my experience in food safety at the director level and the current market for this type of role in Ontario, I was hoping we could get to $125,000" is a negotiation. "I was hoping for more" is not.\n\nOne number. Not a range. A range tells the employer to anchor to your lower number.\n\nAlso negotiate what you can't easily change later: starting vacation, sign-on bonus, start date, remote flexibility. Salary is easier to increase once you're inside. First-day vacation entitlements are not.\n\nWhat not to do: don't negotiate by email if you can avoid it, don't bring up personal financial needs as a justification, and don't give an ultimatum unless you mean it.\n\nAnd if they say no to everything you ask? At least you asked. Now you know exactly where the ceiling is and you can decide whether to accept or walk. Either way, you're making an informed decision.`,
          fr:`La plupart des gens ne négocient pas du tout ou négocient mal. Voilà comment bien le faire dans l'alimentaire et le CPG.\n\nD'abord, un retour à la réalité : chaque employeur qui te fait une offre s'attend à ce que tu négocies. C'est intégré dans le processus. Ne pas négocier ne te rend pas facile à travailler, ça donne l'impression que tu ne savais pas que tu pouvais.\n\nCela dit, il y a une bonne façon et une mauvaise façon.\n\nLa bonne façon commence par connaître ton chiffre avant de recevoir l'offre. Quel est le salaire minimum que tu accepterais? Qu'est-ce qui te ferait dire oui sans hésitation? Qu'est-ce qui est vraiment au-dessus du marché pour ton expérience et ta région?\n\nQuand l'offre arrive, remercie-les sincèrement et demande du temps. "Je suis enthousiaste à propos de cette opportunité. Est-ce que je peux avoir 24 à 48 heures pour tout réviser?" C'est complètement normal et professionnel.\n\nSi tu veux négocier, sois spécifique. "Basé sur mon expérience en salubrité alimentaire au niveau directeur et le marché actuel pour ce type de rôle en Ontario, j'espérais qu'on puisse arriver à 125 000$" est une négociation. "J'espérais avoir plus" n'en est pas une.\n\nUn chiffre. Pas une fourchette. Une fourchette dit à l'employeur d'ancrer sur ton chiffre inférieur.\n\nNégocie aussi ce que tu ne peux pas facilement changer plus tard : les vacances de départ, le boni à la signature, la date de début, la flexibilité de télétravail.\n\nEt si ils disent non à tout ce que tu demandes? Au moins tu as demandé.`} },

  { id:"linkedin-profil-alimentaire", cat:{en:"Career",fr:"Carrière"}, date:"Décembre 2025", read:{en:"3 min",fr:"3 min"},
    title:{en:"Your LinkedIn profile isn't getting you calls. Here's what to fix.",fr:"Ton profil LinkedIn ne te génère pas d'appels. Voilà ce qu'il faut régler."},
    excerpt:{en:"I search LinkedIn every day for food and CPG candidates. Most profiles make it impossible to know if someone is worth calling.",fr:"Je cherche sur LinkedIn chaque jour des candidats en alimentaire et CPG. La plupart des profils rendent impossible de savoir si quelqu'un vaut la peine d'être appelé."},
    body:{en:`I search LinkedIn every day for food and CPG candidates. Most profiles make it impossible to know if someone is worth calling. Here's what I'm looking for and what gets in the way.\n\nThe headline. This is the most important real estate on your profile. If it just says your job title and company name, you're invisible in search. A recruiter searching for a "SQF certified QA Director Ontario" needs to see those words somewhere visible. Use your headline to tell me who you are professionally, not just where you work. "Quality Assurance Director | SQF Practitioner | Food Manufacturing | Ontario" is a searchable headline. "Quality Director at Maple Leaf" is not.\n\nThe summary. Write two to four sentences about what you actually do, what you're known for, and what kind of opportunity interests you. Be direct. "I lead quality assurance programs in food manufacturing, with deep expertise in SQF, HACCP, and regulatory compliance. Open to director and VP-level opportunities in Ontario and Quebec." That tells me in ten seconds whether to pick up the phone.\n\nCertifications. Put them in the Licenses & Certifications section. SQF, HACCP, FSMA, BRC, these are searchable. If they're buried in your experience description or missing entirely, you don't exist in that search.\n\nExperience descriptions. Tell me what you accomplished, not just what you were responsible for. "Responsible for food safety programs" tells me nothing. "Led SQF Level 3 recertification across three facilities, maintained zero critical non-conformances over four audit cycles" tells me a lot.\n\nActivity. You don't need to post every week. But a profile that hasn't been touched in three years sends a signal. A comment on an industry article, a shared post about food safety, even minimal activity shows you're present.\n\nAnd for the love of everything, update your location. If you moved from Montreal to Toronto two years ago and your profile still says Montreal, I'm filtering you out of Ontario searches.`,
          fr:`Je cherche sur LinkedIn chaque jour des candidats en alimentaire et CPG. La plupart des profils rendent impossible de savoir si quelqu'un vaut la peine d'être appelé. Voilà ce que je cherche et ce qui bloque.\n\nLe titre. C'est l'espace le plus important de ton profil. Si ça dit juste ton titre de poste et le nom de la compagnie, tu es invisible dans la recherche. Utilise ton titre pour me dire qui tu es professionnellement, pas juste où tu travailles. "Directeur assurance qualité | Praticien SQF | Fabrication alimentaire | Ontario" est un titre cherchable. "Directeur qualité chez Maple Leaf" ne l'est pas.\n\nLe résumé. Écris deux à quatre phrases sur ce que tu fais vraiment, pour quoi tu es connu et quel type d'opportunité t'intéresse. Sois direct. "Je dirige des programmes d'assurance qualité en fabrication alimentaire, avec une expertise approfondie en SQF, HACCP et conformité réglementaire. Ouvert à des opportunités de niveau directeur et VP en Ontario et Québec."\n\nLes certifications. Mets-les dans la section Licences et certifications. SQF, HACCP, FSMA, BRC, celles-là sont cherchables.\n\nLes descriptions d'expérience. Dis-moi ce que tu as accompli, pas juste de quoi tu étais responsable. "Responsable des programmes de salubrité alimentaire" ne me dit rien. "Dirigé la recertification SQF Niveau 3 dans trois installations, maintenu zéro non-conformité critique sur quatre cycles d'audit" me dit beaucoup.\n\nEt mets à jour ta localisation. Si tu as déménagé de Montréal à Toronto il y a deux ans et que ton profil dit encore Montréal, je te filtre des recherches en Ontario.`} },

  { id:"mode-recrutement-canada", cat:{en:"Fashion",fr:"Mode"}, date:"Novembre 2025", read:{en:"4 min",fr:"4 min"},
    title:{en:"What's actually happening in Canadian fashion recruitment right now.",fr:"Ce qui se passe vraiment dans le recrutement mode au Canada en ce moment."},
    excerpt:{en:"The Canadian fashion industry is smaller than it looks. Which means the talent pool is smaller too. Robin Anisef on where the market is right now.",fr:"L'industrie mode canadienne est plus petite qu'elle en a l'air. Ce qui veut dire que le bassin de talents l'est aussi. Robin Anisef sur où est le marché en ce moment."},
    body:{en:`The Canadian fashion industry is smaller than it looks from the outside. Which means the talent pool is smaller too, the relationships matter more, and the wrong hire is more expensive than in a market where you can easily replace someone.\n\nHere's what I'm seeing right now, after 20 years recruiting in this space.\n\nBuyers are in demand, full stop. Good senior buyers with strong vendor relationships, particularly international sourcing experience in Asia or Europe, are getting multiple conversations happening simultaneously. If you find one you want, move on them. Don't run a six-week process.\n\nThe DTC shift has created a new kind of candidate. Companies that have built or are building direct-to-consumer channels need people who understand both the brand side and the operational side, inventory management, digital marketing, customer experience. This is a hybrid profile that didn't really exist ten years ago and is genuinely hard to find.\n\nMontreal and Toronto are increasingly one market for fashion talent. Candidates in both cities are open to the other, especially for the right opportunity. Remote and hybrid arrangements have expanded the pool on both sides.\n\nCompensation has moved. A Senior Buyer role that paid $80,000 in 2019 is now $95,000 to $110,000 for a strong candidate. Brand managers at the director level are pushing $120,000 to $140,000 in a competitive search.\n\nThe biggest mistake fashion companies make in hiring: waiting too long to engage a recruiter and then expecting a shortlist in a week. Good fashion candidates don't come out of a database pull. They come out of a conversation I had six months ago, or a referral from someone I placed three years back, or a candidate who reached out when they weren't ready to move and is now ready.\n\nThat's the value of working with someone who has been in this market for two decades. You're not buying a search. You're buying 20 years of relationships.`,
          fr:`L'industrie mode canadienne est plus petite qu'elle en a l'air de l'extérieur. Ce qui veut dire que le bassin de talents l'est aussi, que les relations comptent davantage, et que la mauvaise embauche est plus coûteuse que dans un marché où tu peux facilement remplacer quelqu'un.\n\nVoilà ce que je vois en ce moment, après 20 ans à recruter dans cet espace.\n\nLes acheteurs sont en demande, point final. Les bons acheteurs séniors avec de solides relations fournisseurs, particulièrement une expérience en approvisionnement international en Asie ou en Europe, reçoivent plusieurs conversations simultanément. Si tu en trouves un que tu veux, fais-leur une offre. Ne cours pas un processus de six semaines.\n\nLe virage DTC a créé un nouveau type de candidat. Les compagnies qui ont bâti ou qui bâtissent des canaux directs aux consommateurs ont besoin de gens qui comprennent à la fois le côté marque et le côté opérationnel. C'est un profil hybride qui n'existait pas vraiment il y a dix ans et qui est vraiment difficile à trouver.\n\nMontréal et Toronto sont de plus en plus un seul marché pour les talents mode. Les candidats dans les deux villes sont ouverts à l'autre, surtout pour la bonne opportunité.\n\nLa rémunération a bougé. Un poste d'acheteur principal qui payait 80 000$ en 2019 est maintenant 95 000$ à 110 000$ pour un candidat fort.\n\nLa plus grande erreur que les compagnies mode font en embauche : attendre trop longtemps pour engager un recruteur et ensuite s'attendre à une courte liste en une semaine. Les bons candidats mode ne sortent pas d'une extraction de base de données. Ils sortent d'une conversation que j'ai eue il y a six mois.\n\nC'est la valeur de travailler avec quelqu'un qui est dans ce marché depuis deux décennies. Tu n'achètes pas une recherche. Tu achètes 20 ans de relations.`} },

  { id:"onboarding-nouveau-directeur", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2025", read:{en:"3 min",fr:"3 min"},
    title:{en:"You hired a great plant manager. Now don't blow the onboarding.",fr:"Tu as embauché un bon directeur d'usine. Maintenant ne rate pas l'intégration."},
    excerpt:{en:"The first 90 days determine whether a senior hire stays or starts looking again. Most companies get this wrong.",fr:"Les 90 premiers jours déterminent si une embauche sénior reste ou recommence à chercher. La plupart des compagnies ratent ça."},
    body:{en:`The first 90 days determine whether a senior hire stays or starts looking again. Most companies get this wrong, and it costs them the placement guarantee window and then some.\n\nHere's what I see happen too often: a company works hard to recruit a strong plant manager or quality director, makes a competitive offer, and then essentially abandons them on day one. Here's the desk. Here's your email login. Good luck.\n\nSenior hires in food manufacturing are walking into complex situations. Union relationships, legacy processes, team dynamics, regulatory history, all of it existed before they arrived and none of it comes with a manual. If you don't give them a structured way to learn it, they'll spend the first three months trying to figure out what's actually going on instead of doing the job you hired them to do.\n\nWhat good onboarding looks like at the director level:\n\nA 30-60-90 day plan that was built before they started, with clear expectations for each phase. Not a task list, an outcomes list. What should they understand at 30 days? What decisions should they be making at 60? What should they have changed or launched by 90?\n\nRegular check-ins with their direct manager. Not just about tasks. About how they're finding the culture, who the key relationships are, what's surprising them.\n\nIntroductions that matter. Not just an office tour. Structured meetings with the people whose work intersects with theirs, quality, operations, HR, supply chain. Their first week should have a calendar, not a void.\n\nSpace to ask questions without looking incompetent. The worst thing a new senior hire can do is pretend they understand something they don't. Create an environment where not knowing is okay for the first 30 days.\n\nWhen onboarding fails, it's usually not because the candidate was a bad hire. It's because no one treated their first 90 days as a critical phase of the investment. You spent months finding the right person. Spend a few hours designing their start.`,
          fr:`Les 90 premiers jours déterminent si une embauche sénior reste ou recommence à chercher. La plupart des compagnies ratent ça, et ça leur coûte la fenêtre de garantie de placement et plus encore.\n\nVoilà ce que je vois arriver trop souvent : une compagnie travaille fort pour recruter un bon directeur d'usine ou directeur qualité, fait une offre compétitive, puis les abandonne essentiellement le jour un. Voilà ton bureau. Voilà ton accès courriel. Bonne chance.\n\nLes embauches séniors en fabrication alimentaire arrivent dans des situations complexes. Relations syndicales, processus hérités, dynamiques d'équipe, historique réglementaire, tout ça existait avant qu'ils arrivent et rien de ça ne vient avec un manuel.\n\nÀ quoi ressemble une bonne intégration au niveau directeur :\n\nUn plan 30-60-90 jours qui a été construit avant qu'ils commencent, avec des attentes claires pour chaque phase. Pas une liste de tâches, une liste de résultats. Qu'est-ce qu'ils devraient comprendre à 30 jours? Quelles décisions devraient-ils prendre à 60?\n\nDes suivis réguliers avec leur gestionnaire direct. Pas juste sur les tâches. Sur comment ils trouvent la culture, qui sont les relations clés, ce qui les surprend.\n\nDes introductions qui comptent. Pas juste une visite de bureau. Des rencontres structurées avec les gens dont le travail croise le leur.\n\nQuand l'intégration échoue, ce n'est généralement pas parce que le candidat était une mauvaise embauche. C'est parce que personne n'a traité leurs 90 premiers jours comme une phase critique de l'investissement. Tu as passé des mois à trouver la bonne personne. Passe quelques heures à concevoir leur départ.`} },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Avatar({ m, size, full, style }) {
  const box = full ? { width:"100%", aspectRatio:"1 / 1" } : { width:size, height:size };
  if (m.photo) {
    return (
      <img src={m.photo} alt={m.name} loading="lazy" style={{
        ...box, objectFit:"cover", objectPosition:"center 22%", display:"block",
        background:C.paperDark, flexShrink:0, ...style,
      }} />
    );
  }
  return (
    <div style={{
      ...box, background:C.orange, display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Clash Display',sans-serif", fontSize: full ? "2rem" : (size >= 56 ? "1rem" : "0.8rem"),
      color:"#fff", fontWeight:700, flexShrink:0, ...style,
    }}>{m.init}</div>
  );
}

// Chemin reel d'une page. Les moteurs de recherche indexent /equipe, pas /#/equipe.
function pathOf(page, sub) {
  const base = page === "home" ? "/" : `/${page}`;
  return sub ? `${base}/${sub}` : base;
}

// Un vrai lien <a>, pour que Google puisse suivre la navigation,
// tout en gardant la navigation instantanee cote client.
function PageLink({ to, sub, setPage, children, style, className }) {
  return (
    <a
      href={pathOf(to, sub)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        setPage(to, sub);
      }}
      style={{ textDecoration:"none", ...style }}
    >{children}</a>
  );
}

function Divider({ style }) {
  return <span className="rule" style={style} />;
}

function Eyebrow({ children }) {
  return <p className="eyebrow" style={{ marginBottom:"1.25rem" }}>{children}</p>;
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = lang === "en"
    ? [["food","Food"],["fashion","Fashion"],["employers","Employers"],["about","About"],["team","Team"],["candidates","Candidates"],["featured","Talent"],["jobs","Jobs"],["blog","Blog"],["contact","Contact"]]
    : [["food","Alimentaire"],["fashion","Mode"],["employers","Employeurs"],["about","À propos"],["team","Équipe"],["candidates","Candidats"],["featured","Talents"],["jobs","Emplois"],["blog","Blogue"],["contact","Contact"]];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        background: scrolled ? C.ink : "rgba(13,37,69,0.92)",
        borderBottom: scrolled ? `1px solid rgba(255,255,255,0.1)` : "none",
        backdropFilter:"blur(8px)",
        transition:"background 0.3s",
        padding:"0 2rem", height:"56px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        {/* Wordmark */}
        <PageLink to="home" setPage={setPage} style={{
          fontFamily:"'Clash Display',sans-serif", fontWeight:600,
          fontSize:"1.15rem", color:"#fff", letterSpacing:"-0.01em",
          display:"flex", alignItems:"center", gap:"4px",
        }}>
          PROFORCE
          <span style={{ color:C.orange, fontSize:"1.4rem", lineHeight:1 }}>.</span>
        </PageLink>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:"1.75rem" }}>
          {links.map(([k,l]) => (
            <PageLink key={k} to={k} setPage={setPage} style={{
              fontFamily:"'DM Mono',monospace", fontSize:"0.68rem",
              letterSpacing:"0.08em", textTransform:"uppercase",
              color: page===k ? C.orange : "rgba(255,255,255,0.65)",
              borderBottom: page===k ? `1px solid ${C.orange}` : "1px solid transparent",
              paddingBottom:"1px", transition:"color 0.2s",
            }}>{l}</PageLink>
          ))}
          <button onClick={() => setLang(lang==="en"?"fr":"en")} style={{
            fontFamily:"'DM Mono',monospace", fontSize:"0.68rem",
            letterSpacing:"0.08em", textTransform:"uppercase",
            color:C.orange, borderBottom:`1px solid ${C.orange}`,
            paddingBottom:"1px",
          }}>{lang==="en"?"FR":"EN"}</button>

          {/* Booking CTA */}
          <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer"
            onClick={() => track.contactClick()}
            style={{
              background:C.orange, color:"#fff", padding:"7px 16px",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.72rem",
              letterSpacing:"0.08em", textTransform:"uppercase",
              transition:"background 0.2s", whiteSpace:"nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.background=C.orangeHov}
            onMouseLeave={e => e.currentTarget.style.background=C.orange}
          >
            {lang==="en"?"Book a Call":"Réserver un appel"}
          </a>
        </div>

        {/* Mobile burger */}
        <button className="show-mobile" onClick={() => setOpen(!open)} style={{
          display:"none", color:"#fff", fontSize:"1.2rem",
          fontFamily:"'DM Mono',monospace",
        }}>{open?"✕":"☰"}</button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position:"fixed", top:"56px", left:0, right:0, bottom:0,
          background:C.ink, zIndex:199, padding:"2rem",
          display:"flex", flexDirection:"column", gap:"0",
          borderTop:`1px solid rgba(255,255,255,0.1)`,
          overflowY:"auto",
        }}>
          {links.map(([k,l]) => (
            <PageLink key={k} to={k} setPage={(p) => { setPage(p); setOpen(false); }} style={{
              display:"block",
              fontFamily:"'Clash Display',sans-serif", fontSize:"1.5rem",
              color: page===k ? C.orange : "#fff", textAlign:"left",
              padding:"0.9rem 0", borderBottom:`1px solid rgba(255,255,255,0.08)`,
              fontWeight:600, letterSpacing:"-0.01em",
            }}>{l}</PageLink>
          ))}
          <button onClick={() => setLang(lang==="en"?"fr":"en")} style={{
            color:C.orange, fontSize:"1rem", textAlign:"left",
            padding:"1rem 0", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em",
          }}>{lang==="en"?"Français":"English"}</button>

          {/* Mobile booking CTA */}
          <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer"
            onClick={() => { track.contactClick(); setOpen(false); }}
            style={{
              background:C.orange, color:"#fff", padding:"14px 24px",
              fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.85rem",
              letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center",
              marginTop:"1.5rem", display:"block",
            }}
          >
            {lang==="en"?"Book a 15-min Call":"Réserver un appel 15 min"}
          </a>
        </div>
      )}
    </>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker({ lang }) {
  const items = lang==="en"
    ? ["Food Industry","CPG","Fashion","Montreal","Toronto","Since 2001","Placement Guarantee","Specialist Firm","Network First"]
    : ["Alimentaire","CPG","Mode","Montréal","Toronto","Depuis 2001","Garantie de placement","Firme spécialisée","Réseau d'abord"];
  const text = items.map(i => `/ ${i}`).join("  ");
  return (
    <div style={{ background:C.ink, overflow:"hidden", whiteSpace:"nowrap", padding:"10px 0" }}>
      <div style={{ display:"inline-block", animation:"ticker 32s linear infinite" }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.orange }}>
          {text}&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ lang, setPage }) {
  const t = {
    en:{
      issue:"Vol. 25, Specialist Recruitment",
      h1:"We know\nyour industry.",
      h1em:"Not just the job.",
      sub:"Proforce Personnel places food, CPG, and fashion professionals across Montreal, Quebec City, and Toronto. No generalists. No job boards. A network built over 25 years.",
      cta1:"Our Sectors", cta2:"Contact Us",
      s2label:"Two industries. Full stop.",
      s2p:"Food and fashion. We made that call a long time ago. Because doing two things properly beats doing eight things adequately.",
      foodH:"Food & CPG", foodP:"From plant floor to executive office, quality directors, plant managers, supply chain leads, sales reps.",
      fashH:"Fashion & Apparel", fashP:"Buyers, brand managers, designers, production coordinators, we know the back rooms as well as the showrooms.",
      stat1:"25", sl1:"Years", stat2:"5", sl2:"Specialists", stat3:"MTL+TOR", sl3:"Markets", stat4:"100%", sl4:"Guaranteed",
      w1h:"Network over noise", w1p:"We don't post and wait. We call people we already know, people who aren't looking but who'd be perfect.",
      w2h:"Specialists, not generalists", w2p:"Your recruiter lives inside your industry. They've been there long enough to know who's who.",
      w3h:"Placement guarantee", w3p:"Every permanent placement is guaranteed. We stand behind who we send you.",
      ctaH:"Ready to talk?", ctaP:"One call is usually enough to know if we're the right fit.", cta3:"Get in Touch",
    },
    fr:{
      issue:"Vol. 25, Recrutement spécialisé",
      h1:"On connaît\nton industrie.",
      h1em:"Pas juste le poste.",
      sub:"Proforce Personnel place des professionnels de l'alimentaire, du CPG et de la mode à Montréal, Québec et Toronto. Pas de généralistes. Pas de babillards. Un réseau bâti sur 25 ans.",
      cta1:"Nos secteurs", cta2:"Nous contacter",
      s2label:"Deux industries. Point final.",
      s2p:"Alimentaire et mode. On a fait ce choix il y a longtemps. Parce que bien faire deux choses vaut mieux que faire huit choses à moitié.",
      foodH:"Alimentaire & CPG", foodP:"Du plancher d'usine jusqu'à la direction, directeurs qualité, directeurs d'usine, responsables chaîne d'approvisionnement.",
      fashH:"Mode & Habillement", fashP:"Acheteurs, gestionnaires de marque, designers, coordinateurs de production, on connaît les coulisses autant que les showrooms.",
      stat1:"25", sl1:"Ans", stat2:"5", sl2:"Spécialistes", stat3:"MTL+TOR", sl3:"Marchés", stat4:"100%", sl4:"Garanti",
      w1h:"Réseau plutôt que bruit", w1p:"On n'affiche pas et on n'attend pas. On appelle des gens qu'on connaît déjà, des gens qui ne cherchent pas, mais qui seraient parfaits.",
      w2h:"Spécialistes, pas généralistes", w2p:"Ton recruteur vit à l'intérieur de ton industrie. Il y est depuis assez longtemps pour savoir qui est qui.",
      w3h:"Garantie de placement", w3p:"Chaque placement permanent est garanti. On se tient derrière les gens qu'on t'envoie.",
      ctaH:"Prêt à jaser?", ctaP:"Un appel suffit généralement pour savoir si on est le bon fit.", cta3:"Nous contacter",
    },
  }[lang];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ background:C.ink, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"6rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        {/* Large issue number watermark */}
        <div style={{
          position:"absolute", top:"56px", right:"2rem",
          fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(6rem,20vw,18rem)",
          fontWeight:700, color:"rgba(255,255,255,0.04)", lineHeight:1,
          userSelect:"none", pointerEvents:"none", letterSpacing:"-0.04em",
        }}>2001</div>

        {/* Top rule + issue label */}
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.15)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>{t.issue}</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>proforce.ca</span>
          </div>
        </div>

        <div style={{ maxWidth:"900px" }}>
          {/* Orange accent */}
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />

          <h1 className="fu2" style={{
            fontFamily:"'Clash Display',sans-serif", fontWeight:700,
            fontSize:"clamp(3.5rem,10vw,9rem)", lineHeight:0.92,
            letterSpacing:"-0.03em", color:"#fff", whiteSpace:"pre-line",
            marginBottom:"1rem",
          }}>
            {t.h1}
          </h1>
          <h1 className="fu2" style={{
            fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic",
            fontSize:"clamp(2.5rem,7vw,6.5rem)", lineHeight:0.95,
            letterSpacing:"-0.01em", color:C.orange, marginBottom:"3rem",
          }}>
            {t.h1em}
          </h1>

          <div className="fu3" style={{ display:"flex", alignItems:"flex-start", gap:"4rem", flexWrap:"wrap" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", lineHeight:1.7, color:"rgba(255,255,255,0.6)", maxWidth:"440px" }}>{t.sub}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", paddingTop:"0.25rem" }}>
              <button className="btn-orange" onClick={() => setPage("food")}>{t.cta1}</button>
              <button style={{
                display:"inline-block", border:"1.5px solid rgba(255,255,255,0.3)", color:"#fff",
                padding:"11px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase",
                transition:"border-color 0.2s, background 0.2s", cursor:"pointer", background:"transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#fff"; e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"; e.currentTarget.style.background="transparent"; }}
                onClick={() => setPage("contact")}
              >{t.cta2}</button>
            </div>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ position:"absolute", bottom:"2rem", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.15)" }} />
        </div>
      </section>

      <Ticker lang={lang} />

      {/* ── SECTORS ── */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"3rem", flexWrap:"wrap", gap:"1rem" }}>
            <Eyebrow>{lang==="en"?"Specialties":"Spécialités"}</Eyebrow>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1.6rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink }}>{t.s2label}</h2>
          </div>
          <Divider style={{ marginBottom:"3rem" }} />
          <p style={{ color:C.muted, fontSize:"1rem", lineHeight:1.7, maxWidth:"480px", marginBottom:"4rem" }}>{t.s2p}</p>

          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", background:C.rule }}>
            {[{pg:"food",h:t.foodH,p:t.foodP,n:"01"},{pg:"fashion",h:t.fashH,p:t.fashP,n:"02"}].map(s => (
              <button key={s.pg} onClick={() => setPage(s.pg)} style={{
                background:C.paper, padding:"3rem 2.5rem", textAlign:"left",
                transition:"background 0.2s", width:"100%",
              }}
                onMouseEnter={e => e.currentTarget.style.background=C.paperDark}
                onMouseLeave={e => e.currentTarget.style.background=C.paper}
              >
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"2rem" }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1.4rem,3vw,2.2rem)", color:C.ink, letterSpacing:"-0.02em", marginBottom:"1rem" }}>{s.h}</h3>
                <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.7, marginBottom:"2rem" }}>{s.p}</p>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange }}>
                  {lang==="en"?"Read more →":"En savoir plus →"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── editorial strip ── */}
      <section style={{ background:C.ink, padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"0" }}>
            {[[t.stat1,t.sl1],[t.stat2,t.sl2],[t.stat3,t.sl3],[t.stat4,t.sl4]].map(([n,l],i) => (
              <div key={l} style={{ padding:"2rem", borderRight: i<3 ? `1px solid rgba(255,255,255,0.08)` : "none" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:700, color:C.orange, letterSpacing:"-0.03em", lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginTop:"0.5rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section style={{ background:C.paper, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Why Proforce":"Pourquoi Proforce"}</Eyebrow>
          <Divider style={{ marginBottom:"4rem" }} />
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"3rem" }}>
            {[[t.w1h,t.w1p,"01"],[t.w2h,t.w2p,"02"],[t.w3h,t.w3p,"03"]].map(([h,p,n]) => (
              <div key={n}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"1.5rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", letterSpacing:"-0.02em", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM STRIP ── */}
      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <Eyebrow>{lang==="en"?"The Team":"L'équipe"}</Eyebrow>
            <button onClick={() => setPage("team")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
              {lang==="en"?"Meet everyone →":"Voir l'équipe →"}
            </button>
          </div>
          <Divider style={{ marginBottom:"2.5rem" }} />
          <div style={{ display:"flex", gap:"0", flexWrap:"wrap" }}>
            {TEAM.map((m,i) => (
              <div key={m.name} style={{
                flex:"1 1 180px", padding:"1.5rem",
                borderRight: i<TEAM.length-1 ? `1px solid ${C.rule}` : "none",
              }}>
                <Avatar m={m} size={56} style={{ marginBottom:"1rem" }} />
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", fontWeight:600, color:C.ink, marginBottom:"0.2rem" }}>{m.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.muted }}>{m.title[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CANDIDATES STRIP ── */}
      <section style={{ background:C.ink, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <Eyebrow style={{ color:"rgba(255,255,255,0.4)" }}>{lang==="en"?"Featured Candidates":"Candidats vedettes"}</Eyebrow>
            <button onClick={() => setPage("featured")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
              {lang==="en"?"All profiles →":"Tous les profils →"}
            </button>
          </div>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)", marginBottom:"0" }} />
          {FEATURED.slice(0,3).map((c,i) => (
            <button key={c.id} onClick={() => setPage("featured")} style={{
              width:"100%", display:"grid", gridTemplateColumns:"auto 1fr auto",
              gap:"2rem", alignItems:"center", padding:"1.5rem 0",
              borderBottom:`1px solid rgba(255,255,255,0.07)`, textAlign:"left",
              transition:"opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.orange, letterSpacing:"0.1em", width:"28px" }}>0{i+1}</span>
              <div>
                <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", color:"#fff", letterSpacing:"-0.01em" }}>{c.title[lang]}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.35)", marginLeft:"1rem", letterSpacing:"0.06em" }}>{c.tag[lang]}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em" }}>{c.market[lang]}</div>
                {c.avail.en==="Actively looking" && (
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.orange, letterSpacing:"0.06em", marginTop:"3px" }}>{lang==="en"?"Active":"Actif"}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── BLOG STRIP ── */}
      <section style={{ background:C.paper, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <Eyebrow>{lang==="en"?"From the Blog":"Du blogue"}</Eyebrow>
            <button onClick={() => setPage("blog")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
              {lang==="en"?"All articles →":"Tous les articles →"}
            </button>
          </div>
          <Divider style={{ marginBottom:"0" }} />
          {POSTS.slice(0,3).map((p,i) => (
            <div key={p.id}>
              <button onClick={() => setPage("blog")} style={{
                width:"100%", display:"grid", gridTemplateColumns:"auto 1fr auto",
                gap:"2rem", alignItems:"center", padding:"1.75rem 0", textAlign:"left",
                transition:"opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", color:C.orange }}>0{i+1}</span>
                <span style={{ fontFamily:"'Spectral',serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", color:C.ink, fontWeight:400 }}>{p.title[lang]}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:C.muted, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{p.date}</span>
              </button>
              <Divider />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:C.orange, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"3rem" }}>
          <div>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,5vw,4rem)", color:"#fff", letterSpacing:"-0.03em", lineHeight:0.95, marginBottom:"1rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", lineHeight:1.7, maxWidth:"420px" }}>{t.ctaP}</p>
          </div>
          <button onClick={() => setPage("contact")} style={{
            background:"#fff", color:C.orange, padding:"14px 32px",
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.82rem",
            letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0,
            transition:"opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >{t.cta3}</button>
        </div>
      </section>
    </div>
  );
}

// ─── SECTOR PAGE TEMPLATE ─────────────────────────────────────────────────────
function SectorPage({ lang, setPage, sector }) {
  const data = {
    food: {
      en:{ eyebrow:"Food & CPG Recruitment, Montreal, Toronto & Atlantic Canada", h1:"Food industry recruitment,", h1i:"done by specialists.", sub:"Proforce Personnel places food manufacturing and CPG professionals across Quebec, Ontario, and Atlantic Canada. Plant managers, quality directors, supply chain leaders, we've been doing this since 2001.", roles:FOOD_ROLES.en,
        w1h:"We speak your language", w1p:"SQF, HACCP, FSMA, GMP, we don't need you to explain what these mean. Your recruiter has been in food long enough.",
        w2h:"Our candidates aren't on job boards", w2p:"The plant manager you need isn't refreshing LinkedIn. They're running a shift. We call them directly because we already know them.",
        w3h:"Quebec, Ontario & the Maritimes covered.", w3p:"Dedicated recruiters for Quebec, Ontario, and Atlantic Canada. Local expertise in every market we serve, not someone googling your city.",
        ctaH:"Ready to talk about your next food industry hire?", cta:"Contact Us" },
      fr:{ eyebrow:"Recrutement alimentaire & CPG, Montréal, Toronto et Atlantique", h1:"Recrutement alimentaire,", h1i:"fait par des spécialistes.", sub:"Proforce Personnel place des professionnels de la fabrication alimentaire et du CPG au Québec, en Ontario et dans les provinces atlantiques. Directeurs d'usine, directeurs qualité, responsables chaîne d'approvisionnement, on fait ça depuis 2001.", roles:FOOD_ROLES.fr,
        w1h:"On parle ta langue", w1p:"SQF, HACCP, FSMA, BPF, t'as pas besoin de nous expliquer. Ton recruteur est dans l'alimentaire depuis assez longtemps.",
        w2h:"Nos candidats ne sont pas sur les babillards", w2p:"Le directeur d'usine dont t'as besoin ne rafraîchit pas LinkedIn. Il gère un quart. On l'appelle directement parce qu'on le connaît déjà.",
        w3h:"Québec, Ontario et les Maritimes couverts.", w3p:"Recruteurs dédiés pour le Québec, l'Ontario et le Canada atlantique. Expertise locale dans chaque marché qu'on sert.",
        ctaH:"Prêt à parler de ta prochaine embauche dans l'alimentaire?", cta:"Nous contacter" },
    },
    fashion: {
      en:{ eyebrow:"Fashion & Apparel Recruitment, Montreal & Toronto", h1:"Canadian fashion recruitment,", h1i:"by someone who knows it.", sub:"Robin Anisef has spent 20+ years exclusively in fashion and apparel recruiting in Montreal and Toronto. Buyers, brand managers, designers, merchandisers, she knows the market from the inside.", roles:FASHION_ROLES.en,
        w1h:"Industry experience, not just recruiting experience", w1p:"Robin worked in fashion before she recruited for it. That's not common. It means she understands the business from the inside.",
        w2h:"The candidates you want aren't looking", w2p:"The best fashion talent in Canada is employed and busy. Robin knows who they are, and they know her. That's the difference.",
        w3h:"Montreal and Toronto. Both markets covered.", w3p:"Deep networks in both cities. If the right candidate exists in Canadian fashion, Robin either knows them or knows someone who does.",
        ctaH:"The candidate you need is probably in Robin's network.", cta:"Contact Us" },
      fr:{ eyebrow:"Recrutement mode & habillement, Montréal & Toronto", h1:"Recrutement mode canadien,", h1i:"par quelqu'un qui le connaît.", sub:"Robin Anisef a passé plus de 20 ans exclusivement dans le recrutement mode et habillement à Montréal et Toronto. Acheteurs, gestionnaires de marque, designers, marchandiseurs, elle connaît le marché de l'intérieur.", roles:FASHION_ROLES.fr,
        w1h:"Expérience de l'industrie, pas juste du recrutement", w1p:"Robin a travaillé dans la mode avant d'y recruter. Ce n'est pas commun. Ça veut dire qu'elle comprend le business de l'intérieur.",
        w2h:"Les candidats que tu veux ne cherchent pas", w2p:"Les meilleurs talents de la mode au Canada sont employés et occupés. Robin sait qui ils sont, et ils la connaissent.",
        w3h:"Montréal et Toronto. Les deux marchés couverts.", w3p:"Réseaux profonds dans les deux villes. Si le bon candidat existe dans la mode canadienne, Robin le connaît ou connaît quelqu'un qui le connaît.",
        ctaH:"Le candidat dont tu as besoin est probablement dans le réseau de Robin.", cta:"Nous contacter" },
    },
  };

  const t = data[sector][lang];

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"65vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", letterSpacing:"-0.01em", color:C.orange, lineHeight:0.95, marginBottom:"3rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"520px", marginBottom:"2rem" }}>{t.sub}</p>
          <button className="btn-ink" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Roles We Fill":"Postes qu'on comble"}</Eyebrow>
          <Divider style={{ marginBottom:"3rem" }} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"0", border:`1px solid ${C.rule}` }}>
            {t.roles.map((r,i) => (
              <div key={r} style={{ padding:"1rem 1.5rem", borderRight: (i+1)%4!==0?`1px solid ${C.rule}`:"none", borderBottom:`1px solid ${C.rule}`, fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.ink, display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ color:C.orange, fontSize:"0.7rem" }}>▸</span>{r}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.paper, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0", border:`1px solid ${C.rule}` }}>
            {[[t.w1h,t.w1p,"01"],[t.w2h,t.w2p,"02"],[t.w3h,t.w3p,"03"]].map(([h,p,n],i) => (
              <div key={n} style={{ padding:"2.5rem 2rem", borderRight: i<2?`1px solid ${C.rule}`:"none" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", letterSpacing:"-0.01em", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection lang={lang} type={sector} setPage={setPage} />

      <section style={{ background:C.orange, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem" }}>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1.6rem,4vw,3rem)", color:"#fff", letterSpacing:"-0.03em", maxWidth:"580px", lineHeight:1.05 }}>{t.ctaH}</h2>
          <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"13px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0 }}>{t.cta}</button>
        </div>
      </section>
    </div>
  );
}

// ─── FAQ COMPONENT ────────────────────────────────────────────────────────────
const FAQ_DATA = {
  food: {
    en:[
      { q:"How long does a food industry search typically take?", a:"Most food and CPG mandates result in a qualified shortlist within 2 to 3 weeks. From shortlist to accepted offer, timelines vary depending on your interview process, but we move fast and stay close throughout." },
      { q:"What levels do you recruit for in food and CPG?", a:"Everything from production supervisors and QA coordinators up to plant managers, directors, VPs, and C-suite. We don't have a minimum seniority level, we have a minimum of industry specificity. If it's a food role that requires real industry knowledge, we can fill it." },
      { q:"Do you recruit for food companies across Canada or just Quebec?", a:"Both. We have dedicated recruiters for Quebec (Stéphanie Lanoie) and for Ontario and the US market (Rana Yamak and Michaela Landers). We also place cross-border when the right candidate is the right candidate." },
      { q:"We've never used a recruiter before. How does your fee structure work?", a:"We work on a contingency or retained basis depending on the mandate. Our fee is a percentage of the placed candidate's first-year salary, invoiced on successful placement. No placement, no fee on contingency mandates. We're happy to walk you through it on a call." },
      { q:"What certifications and roles do your food candidates typically have?", a:"Our candidates hold certifications including SQF, HACCP, FSMA, GFSI, and BRC, among others. We regularly place quality directors, food safety managers, plant managers, R&D scientists, supply chain leaders, procurement managers, and sales and account management roles across food manufacturing and CPG." },
    ],
    fr:[
      { q:"Combien de temps prend généralement un mandat dans l'alimentaire?", a:"La plupart des mandats alimentaires et CPG résultent en une courte liste qualifiée en 2 à 3 semaines. De la courte liste à l'offre acceptée, les délais varient selon ton processus d'entrevue, mais on bouge vite et on reste proche tout au long." },
      { q:"Pour quels niveaux recrutez-vous dans l'alimentaire et le CPG?", a:"Tout, des superviseurs de production et coordinateurs QA jusqu'aux directeurs d'usine, directeurs, VP et cadres supérieurs. On n'a pas de niveau de séniorité minimum, on a un minimum de spécificité industrielle. Si c'est un rôle alimentaire qui exige une vraie connaissance de l'industrie, on peut le combler." },
      { q:"Recrutez-vous pour des compagnies alimentaires partout au Canada ou juste au Québec?", a:"Les deux. On a des recruteurs dédiés pour le Québec (Stéphanie Lanoie) et pour l'Ontario et le marché américain (Rana Yamak et Michaela Landers). On place aussi trans-frontalier quand le bon candidat est le bon candidat." },
      { q:"On n'a jamais utilisé de recruteur avant. Comment fonctionnent vos honoraires?", a:"On travaille sur une base contingente ou retenue selon le mandat. Nos honoraires sont un pourcentage du salaire de première année du candidat placé, facturés au placement réussi. Pas de placement, pas d'honoraires sur les mandats contingents. On est heureux de t'expliquer ça sur un appel." },
      { q:"Quelles certifications et quels rôles vos candidats alimentaires détiennent-ils typiquement?", a:"Nos candidats détiennent des certifications incluant SQF, HACCP, FSMA, GFSI et BRC, entre autres. On place régulièrement des directeurs qualité, responsables salubrité alimentaire, directeurs d'usine, scientifiques R&D, responsables chaîne d'approvisionnement, directeurs approvisionnement, et des rôles en ventes et gestion de comptes." },
    ],
  },
  fashion: {
    en:[
      { q:"Does Proforce work with both wholesale and retail fashion companies?", a:"Yes. Robin Anisef has placed buyers, brand managers, and account executives across national retailers, wholesale brands, and independent labels. She understands both sides of the market and recruits across all channels." },
      { q:"Can you find candidates for creative roles like designers and visual merchandisers?", a:"Yes. Design, visual merchandising, creative direction, these roles are part of Robin's network. Fashion is a small world, and she's been in it for over 20 years." },
      { q:"Do you work with fashion companies outside of Montreal?", a:"Absolutely. Robin covers Montreal and Toronto primarily, but her network spans the entire Canadian fashion industry. If the right candidate is in Vancouver or Calgary, she knows them." },
      { q:"How confidential is the search process for candidates?", a:"Completely. We never share a candidate's information with any employer without their explicit approval. Many of our fashion candidates are currently employed and searching discreetly. That's normal and we handle it that way." },
      { q:"What's the difference between working with Proforce and a large generalist agency for fashion roles?", a:"A generalist agency will post your job and send you whoever applied. Robin calls people she already knows, people who fit your brand specifically, who aren't on any job board, and who trust her enough to have an honest conversation about your opportunity." },
    ],
    fr:[
      { q:"Proforce travaille-t-elle avec des compagnies de mode en gros et au détail?", a:"Oui. Robin Anisef a placé des acheteurs, gestionnaires de marque et chargés de compte chez des détaillants nationaux, des marques en gros et des étiquettes indépendantes. Elle comprend les deux côtés du marché et recrute dans tous les canaux." },
      { q:"Pouvez-vous trouver des candidats pour des rôles créatifs comme designers et marchandiseurs visuels?", a:"Oui. Design, marchandisage visuel, direction créative, ces rôles font partie du réseau de Robin. La mode est un petit monde, et elle y est depuis plus de 20 ans." },
      { q:"Travaillez-vous avec des compagnies de mode en dehors de Montréal?", a:"Absolument. Robin couvre principalement Montréal et Toronto, mais son réseau s'étend à toute l'industrie mode canadienne. Si le bon candidat est à Vancouver ou Calgary, elle le connaît." },
      { q:"À quel point le processus de recherche est-il confidentiel pour les candidats?", a:"Complètement. On ne partage jamais l'information d'un candidat avec un employeur sans son approbation explicite. Beaucoup de nos candidats mode sont actuellement en poste et cherchent discrètement. C'est normal et on gère ça ainsi." },
      { q:"Quelle est la différence entre travailler avec Proforce et une grande agence généraliste pour des rôles mode?", a:"Une agence généraliste va afficher ton poste et t'envoyer quiconque a appliqué. Robin appelle des gens qu'elle connaît déjà, des gens qui correspondent à ta marque spécifiquement, qui ne sont sur aucun babillard, et qui lui font assez confiance pour avoir une conversation honnête sur ton opportunité." },
    ],
  },
  candidates: {
    en:[
      { q:"I'm not actively looking. Is it worth talking to you?", a:"That's actually our ideal candidate. The best placements happen when someone who isn't looking hears about the right opportunity at the right time. Getting on our radar now means we call you when something fits, not when you're desperate." },
      { q:"Will my employer find out I'm talking to you?", a:"No. We never share your information with any company without your explicit approval. Full stop. Your current employer doesn't hear about this conversation." },
      { q:"I sent my resume to three agencies and heard nothing. What's different here?", a:"Most agencies wait for the right mandate to come in and then match it to their database. We work the other way, we build relationships with candidates first, and call you when a specific opportunity fits. If you reach out, we'll have a real conversation and tell you honestly if and when we'd be able to help." },
      { q:"Do you only place permanent roles or do you do contract too?", a:"We focus exclusively on permanent placements. If you're looking for contract or temporary work, we're not the right fit, but we can point you in the right direction." },
      { q:"What industries do you recruit for?", a:"Food manufacturing, CPG, and fashion and apparel. That's it. If your background is in one of those industries, you're exactly who we talk to. If not, we're probably not the right recruiter for you." },
      { q:"How do I make sure you remember me when the right role comes up?", a:"Stay in touch. A quick email every few months, 'still open to the right opportunity', is enough. Update your LinkedIn so we can find you when we search. And be specific about what you want. Vague availability is hard to match. A clear target role and geography makes our job much easier." },
    ],
    fr:[
      { q:"Je ne cherche pas activement. Est-ce que ça vaut la peine de vous parler?", a:"C'est en fait notre candidat idéal. Les meilleurs placements se font quand quelqu'un qui ne cherche pas entend parler de la bonne opportunité au bon moment. Être sur notre radar maintenant signifie qu'on t'appelle quand quelque chose convient, pas quand tu es dans le besoin." },
      { q:"Est-ce que mon employeur va savoir que je vous parle?", a:"Non. On ne partage jamais ton information avec aucune compagnie sans ton approbation explicite. Point final. Ton employeur actuel n'entend pas parler de cette conversation." },
      { q:"J'ai envoyé mon CV à trois agences et je n'ai rien entendu. Qu'est-ce qui est différent ici?", a:"La plupart des agences attendent que le bon mandat rentre et le matchent ensuite à leur base de données. On fonctionne à l'inverse, on bâtit des relations avec des candidats d'abord, et on t'appelle quand une opportunité spécifique convient. Si tu prends contact, on va avoir une vraie conversation et te dire honnêtement si et quand on pourrait t'aider." },
      { q:"Placez-vous seulement des rôles permanents ou faites-vous du contrat aussi?", a:"On se concentre exclusivement sur les placements permanents. Si tu cherches du contrat ou du temporaire, on n'est pas le bon fit, mais on peut te pointer dans la bonne direction." },
      { q:"Dans quelles industries recrutez-vous?", a:"Fabrication alimentaire, CPG et mode et habillement. C'est tout. Si ton background est dans une de ces industries, tu es exactement à qui on parle. Sinon, on n'est probablement pas le bon recruteur pour toi." },
      { q:"Comment m'assurer que vous vous souvenez de moi quand le bon rôle se présente?", a:"Reste en contact. Un courriel rapide aux quelques mois, 'toujours ouvert à la bonne opportunité', suffit. Mets à jour ton LinkedIn pour qu'on puisse te trouver quand on cherche. Et sois spécifique sur ce que tu veux. Une disponibilité vague est difficile à matcher. Un rôle cible et une géographie clairs rendent notre travail beaucoup plus facile." },
    ],
  },
};

function FAQSection({ lang, type, setPage }) {
  const [open, setOpen] = useState(null);
  const faqs = FAQ_DATA[type]?.[lang] || [];

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  useEffect(() => {
    const id = `schema-faq-${type}`;
    let el = document.getElementById(id);
    if (!el) { el = document.createElement("script"); el.type = "application/ld+json"; el.id = id; document.head.appendChild(el); }
    el.text = JSON.stringify(schemaFAQ);
    return () => { const s = document.getElementById(id); if (s) s.remove(); };
  }, [lang, type]);

  return (
    <section style={{ background:C.paperDark, padding:"5rem 2rem" }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>
        <Eyebrow>{lang==="en"?"FAQ":"Foire aux questions"}</Eyebrow>
        <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1.8rem,3.5vw,2.5rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>
          {lang==="en"?"Common questions." : "Questions fréquentes."}
        </h2>
        <Divider style={{ marginBottom:"0" }} />
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom:`1px solid ${C.rule}` }}>
            <button onClick={() => setOpen(open===i ? null : i)} style={{
              width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"1.5rem 0", textAlign:"left", gap:"1.5rem",
            }}>
              <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1rem", color:C.ink, letterSpacing:"-0.01em", lineHeight:1.3 }}>{faq.q}</span>
              <span style={{ color:C.orange, fontSize:"1.2rem", flexShrink:0, fontWeight:300, lineHeight:1, transition:"transform 0.2s", transform: open===i?"rotate(45deg)":"rotate(0deg)" }}>+</span>
            </button>
            {open===i && (
              <div style={{ paddingBottom:"1.5rem" }}>
                <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop:"3rem" }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.muted, marginBottom:"1rem" }}>
            {lang==="en"?"Still have questions? We're easy to reach.":"Tu as encore des questions? On est faciles à joindre."}
          </p>
          <button className="btn-ink" onClick={() => setPage("contact")}>
            {lang==="en"?"Get in Touch":"Nous contacter"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED CANDIDATES DATA ─────────────────────────────────────────────────
const FEATURED = [
  {
    id: "fc-01",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"Quality Assurance Director", fr:"Directeur assurance qualité" },
    tag: { en:"Food Manufacturing", fr:"Fabrication alimentaire" },
    market: { en:"Ontario", fr:"Ontario" },
    exp: { en:"18 years", fr:"18 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["SQF Practitioner, HACCP & FSMA certified","Led QA programs across 3 manufacturing facilities","Managed teams of 12 to 18 QA professionals","Fluent in English and French"],
      fr:["Praticien SQF, certifié HACCP & FSMA","Dirigé des programmes QA dans 3 installations de fabrication","Géré des équipes de 12 à 18 professionnels QA","Bilingue anglais et français"],
    },
    summary: {
      en:"Senior QA leader with nearly two decades in food manufacturing. Has overseen CFIA audits, led plant certifications, and built QA teams from the ground up. Currently employed but open to the right Director or VP-level opportunity in Ontario or Quebec.",
      fr:"Leader QA senior avec près de deux décennies dans la fabrication alimentaire. A supervisé des audits ACIA, dirigé des certifications d'usine et bâti des équipes QA de zéro. Actuellement en poste mais ouvert à la bonne opportunité de niveau Directeur ou VP en Ontario ou Québec.",
    },
    recruiter: "Michaela Landers",
  },
  {
    id: "fc-02",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"Plant Manager", fr:"Directeur d'usine" },
    tag: { en:"Protein / Meat Processing", fr:"Protéines / Transformation des viandes" },
    market: { en:"Quebec", fr:"Québec" },
    exp: { en:"22 years", fr:"22 ans" },
    avail: { en:"Actively looking", fr:"En recherche active" },
    highlights: {
      en:["Managed facilities of 200 to 400 employees","P&L responsibility up to $85M","HACCP, SQF Level 3, and FSEP certified","Strong track record in union environments"],
      fr:["Géré des installations de 200 à 400 employés","Responsabilité P&L jusqu'à 85 M$","Certifié HACCP, SQF Niveau 3 et FSEP","Solide expérience en milieu syndiqué"],
    },
    summary: {
      en:"Seasoned plant manager with over two decades running large-scale protein processing facilities in Quebec. Brings deep operational expertise, a strong safety culture, and a track record of hitting production targets consistently. Available immediately.",
      fr:"Directeur d'usine chevronné avec plus de deux décennies à la tête d'installations de transformation de protéines à grande échelle au Québec. Apporte une expertise opérationnelle profonde, une culture de sécurité forte et un bilan constant d'atteinte des objectifs de production. Disponible immédiatement.",
    },
    recruiter: "Stéphanie Lanoie",
  },
  {
    id: "fc-03",
    sector: { en:"Fashion & Apparel", fr:"Mode & Habillement" },
    title: { en:"Senior Buyer", fr:"Acheteur principal" },
    tag: { en:"Women's Ready-to-Wear", fr:"Prêt-à-porter femme" },
    market: { en:"Montreal", fr:"Montréal" },
    exp: { en:"12 years", fr:"12 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["Managed open-to-buy budgets of $8 to 15M","Strong vendor relationships across Europe and Asia","Experience with both mass market and contemporary brands","Bilingual, French-first market expertise"],
      fr:["Géré des budgets open-to-buy de 8 à 15 M$","Solides relations fournisseurs en Europe et en Asie","Expérience avec des marques grand public et contemporaines","Bilingue, expertise du marché francophone"],
    },
    summary: {
      en:"A sharp, well-connected buyer with 12 years in women's ready-to-wear. Has worked both sides of the market, national retail and independent brands. Strong negotiator, excellent trend instinct, and a deep network across Canadian fashion.",
      fr:"Un acheteur aiguisé et bien connecté avec 12 ans dans le prêt-à-porter femme. A travaillé des deux côtés du marché, commerce de détail national et marques indépendantes. Excellent négociateur, bon instinct tendance et un réseau profond dans la mode canadienne.",
    },
    recruiter: "Robin Anisef",
  },
  {
    id: "fc-04",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"Supply Chain Director", fr:"Directeur chaîne d'approvisionnement" },
    tag: { en:"CPG / Distribution", fr:"CPG / Distribution" },
    market: { en:"Ontario", fr:"Ontario" },
    exp: { en:"15 years", fr:"15 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["Led end-to-end supply chain for $200M+ CPG operation","SAP and Oracle ERP implementation experience","Reduced logistics costs by 18% over 3 years","Cross-border Canada / US supply chain expertise"],
      fr:["Dirigé la chaîne d'approvisionnement de bout en bout pour une opération CPG de 200 M$+","Expérience d'implantation SAP et Oracle ERP","Réduit les coûts logistiques de 18% sur 3 ans","Expertise en chaîne d'approvisionnement transfrontalière Canada / É.-U."],
    },
    summary: {
      en:"A strategic supply chain leader who has built and optimized distribution networks for major CPG brands in Ontario. Combines strong analytical skills with hands-on operational experience. Currently in role but quietly exploring VP-level opportunities.",
      fr:"Un leader stratégique en chaîne d'approvisionnement qui a bâti et optimisé des réseaux de distribution pour des marques CPG majeures en Ontario. Combine de solides compétences analytiques avec une expérience opérationnelle concrète. Actuellement en poste mais explore discrètement des opportunités de niveau VP.",
    },
    recruiter: "Rana Yamak",
  },
  {
    id: "fc-05",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"VP Sales, Food Service", fr:"VP Ventes, Service alimentaire" },
    tag: { en:"Food Service / HRI", fr:"Service alimentaire / HRI" },
    market: { en:"Canada-wide", fr:"Partout au Canada" },
    exp: { en:"20 years", fr:"20 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["Built national food service sales teams from scratch","Managed $120M+ in annual revenue","Deep relationships with GPOs, distributors, and regional chains","Bilingual, coast-to-coast market experience"],
      fr:["Bâti des équipes de ventes nationales en service alimentaire de zéro","Géré plus de 120 M$ en revenus annuels","Relations profondes avec les GPO, distributeurs et chaînes régionales","Bilingue, expérience du marché coast-to-coast"],
    },
    summary: {
      en:"One of the most connected food service sales executives in Canada. Has built teams, grown accounts, and navigated the GPO landscape for two decades. Understands both the operator and distributor side of the business. Open to a national VP or C-level commercial role.",
      fr:"L'un des dirigeants des ventes en service alimentaire les plus connectés au Canada. A bâti des équipes, développé des comptes et navigué dans l'écosystème des GPO depuis deux décennies. Comprend à la fois le côté opérateur et le côté distributeur. Ouvert à un rôle commercial national VP ou C-niveau.",
    },
    recruiter: "Simon St-Amand",
  },
  {
    id: "fc-06",
    sector: { en:"Fashion & Apparel", fr:"Mode & Habillement" },
    title: { en:"Brand Manager", fr:"Gestionnaire de marque" },
    tag: { en:"Contemporary / Lifestyle", fr:"Contemporain / Lifestyle" },
    market: { en:"Toronto / Montreal", fr:"Toronto / Montréal" },
    exp: { en:"9 years", fr:"9 ans" },
    avail: { en:"Actively looking", fr:"En recherche active" },
    highlights: {
      en:["Built and executed brand strategies for mid-market and contemporary labels","Experience with wholesale, DTC, and e-commerce channels","Strong social and digital marketing background","Bilingual, creative, data-driven"],
      fr:["Bâti et exécuté des stratégies de marque pour des étiquettes de marché intermédiaire et contemporaines","Expérience dans les canaux de vente en gros, DTC et e-commerce","Solide background en marketing social et numérique","Bilingue, créatif, axé sur les données"],
    },
    summary: {
      en:"A brand manager who blends creative instinct with commercial discipline. Has grown brands in both the wholesale and DTC space, with a strong grasp of digital marketing and influencer strategy. Available now and looking for a Senior Manager or Director-level role in Canadian fashion.",
      fr:"Un gestionnaire de marque qui allie l'instinct créatif à la discipline commerciale. A développé des marques dans les espaces de vente en gros et DTC, avec une solide maîtrise du marketing numérique et de la stratégie d'influence. Disponible maintenant et cherche un rôle de Gestionnaire principal ou Directeur dans la mode canadienne.",
    },
    recruiter: "Robin Anisef",
  },
];

// ─── FEATURED CANDIDATES PAGE ─────────────────────────────────────────────────
function FeaturedCandidatesPage({ lang, setPage }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [active, setActive] = useState(null);

  const filters = {
    en:[["all","All"],["Food & CPG","Food & CPG"],["Fashion & Apparel","Fashion"]],
    fr:[["all","Tout"],["Alimentaire & CPG","Alimentaire & CPG"],["Mode & Habillement","Mode"]],
  }[lang];

  const filtered = activeFilter === "all"
    ? FEATURED
    : FEATURED.filter(c => c.sector[lang] === activeFilter);

  const t = {
    en:{ eyebrow:"Featured Candidates", h1:"Talent you won't find", h1i:"on any job board.", sub:"These profiles represent a small sample of the candidates in our active network. All searches are handled with complete confidentiality.", note:"Interested in a profile? Contact us. We'll arrange an introduction and share more detail.", cta:"Express Interest", cta2:"See All Sectors", exp:"Experience", market:"Market", avail:"Availability", recruiter:"Your contact", highlights:"Key highlights", fullBio:"About this candidate", contact:"I'm interested in this profile", back:"← Back to profiles" },
    fr:{ eyebrow:"Candidats vedettes", h1:"Des talents que tu ne trouveras", h1i:"sur aucun babillard.", sub:"Ces profils représentent un petit échantillon des candidats dans notre réseau actif. Toutes les recherches sont gérées avec une confidentialité complète.", note:"Intéressé par un profil? Contacte-nous. On va organiser une introduction et partager plus de détails.", cta:"Exprimer mon intérêt", cta2:"Voir nos secteurs", exp:"Expérience", market:"Marché", avail:"Disponibilité", recruiter:"Ton contact", highlights:"Points clés", fullBio:"À propos de ce candidat", contact:"Ce profil m'intéresse", back:"← Retour aux profils" },
  }[lang];

  // Detail view
  if (active) {
    const c = FEATURED.find(f => f.id === active);
    return (
      <div>
        <section style={{ background:C.ink, padding:"8rem 2rem 4rem" }}>
          <div style={{ maxWidth:"780px", margin:"0 auto" }}>
            <button onClick={() => setActive(null)} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"3rem", display:"flex", alignItems:"center", gap:"8px" }}>
              {t.back}
            </button>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange }}>{c.sector[lang]}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:"rgba(255,255,255,0.3)" }}>·</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>{c.tag[lang]}</span>
            </div>
            <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,6vw,5rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{c.title[lang]}</h1>
            <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap", marginTop:"2rem" }}>
              {[[t.exp, c.exp[lang]], [t.market, c.market[lang]], [t.avail, c.avail[lang]], [t.recruiter, c.recruiter]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"3px" }}>{label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color: label===t.avail && c.avail.en==="Actively looking" ? C.orange : "#fff", fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background:C.white, padding:"5rem 2rem" }}>
          <div style={{ maxWidth:"780px", margin:"0 auto" }}>
            <Divider style={{ marginBottom:"3rem" }} />

            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"1.25rem" }}>{t.fullBio}</h2>
            <p style={{ fontFamily:"'Spectral',serif", fontSize:"1.05rem", lineHeight:1.85, color:C.muted, fontWeight:300, marginBottom:"3rem" }}>{c.summary[lang]}</p>

            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"1.25rem" }}>{t.highlights}</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              {c.highlights[lang].map((h, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"1rem", padding:"0.85rem 0", borderBottom:`1px solid ${C.rule}` }}>
                  <span style={{ color:C.orange, fontSize:"0.7rem", marginTop:"2px", flexShrink:0 }}>▸</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.ink, lineHeight:1.6 }}>{h}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop:"3.5rem", padding:"2.5rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.muted, lineHeight:1.7, marginBottom:"1.5rem" }}>
                {lang==="en"
                  ? `This candidate is represented by ${c.recruiter}. To learn more or request an introduction, contact us directly.`
                  : `Ce candidat est représenté par ${c.recruiter}. Pour en savoir plus ou demander une introduction, contactez-nous directement.`}
              </p>
              <button className="btn-ink" onClick={() => setPage("contact")}>{t.contact}</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"55vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,7vw,6.5rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4.5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:"rgba(255,255,255,0.6)", fontSize:"1rem", lineHeight:1.75, maxWidth:"520px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          {/* Filters */}
          <div style={{ display:"flex", gap:"2rem", marginBottom:"3rem", flexWrap:"wrap" }}>
            {filters.map(([val, label]) => (
              <button key={val} onClick={() => setActiveFilter(val)} style={{
                fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase",
                color: activeFilter===val ? C.orange : C.muted,
                borderBottom: activeFilter===val ? `1px solid ${C.orange}` : "1px solid transparent",
                paddingBottom:"2px", transition:"color 0.2s",
              }}>{label}</button>
            ))}
          </div>

          <Divider style={{ marginBottom:"2rem" }} />
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", color:C.muted, marginBottom:"3rem" }}>
            {filtered.length} {lang==="en" ? "profiles available" : "profils disponibles"}
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"2px", background:C.rule }}>
            {filtered.map(c => (
              <button key={c.id} onClick={() => { setActive(c.id); track.candidateView(c.title[lang]); window.scrollTo({top:0,behavior:"smooth"}); }} style={{
                background:C.white, padding:"2.5rem", textAlign:"left",
                transition:"background 0.2s", width:"100%",
              }}
                onMouseEnter={e => e.currentTarget.style.background=C.paperDark}
                onMouseLeave={e => e.currentTarget.style.background=C.white}
              >
                {/* Sector tag */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange }}>{c.sector[lang]}</span>
                  {c.avail.en === "Actively looking" && (
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, border:`1px solid ${C.orange}`, padding:"2px 8px" }}>
                      {lang==="en"?"Active":"Actif"}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.25rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.4rem" }}>{c.title[lang]}</h3>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:C.muted, letterSpacing:"0.06em", marginBottom:"1.25rem" }}>{c.tag[lang]}</div>

                {/* Meta row */}
                <div style={{ display:"flex", gap:"1.5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
                  {[[t.exp, c.exp[lang]], [t.market, c.market[lang]]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, marginBottom:"2px" }}>{label}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:C.ink, fontWeight:500 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Top highlights */}
                <div style={{ marginBottom:"1.5rem" }}>
                  {c.highlights[lang].slice(0,2).map((h,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", marginBottom:"0.4rem" }}>
                      <span style={{ color:C.orange, fontSize:"0.65rem", marginTop:"2px", flexShrink:0 }}>▸</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:C.muted, lineHeight:1.5 }}>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginTop:"auto" }}>
                  {lang==="en"?"View profile →":"Voir le profil →"}
                </div>
              </button>
            ))}
          </div>

          {/* Note */}
          <div style={{ marginTop:"4rem", padding:"2.5rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.muted, fontSize:"0.9rem", lineHeight:1.7, marginBottom:"1.25rem" }}>{t.note}</p>
            <button className="btn-ink" onClick={() => setPage("contact")}>{t.cta}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutPage({ lang }) {
  const t = {
    en:{ eyebrow:"About Proforce Personnel, Montreal, Quebec City & Toronto", h1:"A specialist firm.", h1i:"Built on purpose.", story:"Proforce Personnel was founded in 2001 by David Inzlicht, with a clear idea: build a recruitment firm that actually knows the industries it serves. Not a generalist agency that does everything for everyone. Simon St-Amand joined in 2015, founded the food division, and opened Ontario and the Maritimes. He has been President and shareholder since 2018. 25 years later, that's still the idea: a specialist firm in food, CPG, and fashion, placing professionals in Montreal, Quebec City, Toronto, and Atlantic Canada.",
      v1h:"Specialists, not generalists", v1p:"Every recruiter at Proforce lives inside one industry. They know the roles, the players, the culture. That's not a pitch, it's how we've operated since day one.",
      v2h:"Network over algorithms", v2p:"We don't post job ads and wait. We call people we already know. The best candidates usually aren't looking, we know where they are.",
      v3h:"Guaranteed results", v3p:"Every placement comes with a guarantee. We're confident enough in our process to stand behind who we send you.",
      guarH:"Our Guarantee", guarP:"Every permanent placement comes with a replacement guarantee. If the candidate leaves or doesn't work out within the guarantee period, we find you another one. No charge. That's our commitment." },
    fr:{ eyebrow:"À propos de Proforce Personnel, Montréal, Québec & Toronto", h1:"Une firme spécialisée.", h1i:"Construite intentionnellement.", story:"Proforce Personnel a été fondée en 2001 par David Inzlicht, avec une idée claire : bâtir une firme de recrutement qui connaît vraiment les industries qu'elle sert. Pas une agence généraliste. Simon St-Amand a rejoint la firme en 2015, y a fondé la division alimentaire et ouvert l'Ontario et les Maritimes. Il en est président et actionnaire depuis 2018. 25 ans plus tard, c'est encore ça l'idée : une firme spécialisée en alimentaire, CPG et mode, qui place des professionnels à Montréal, Québec, Toronto et dans les provinces atlantiques.",
      v1h:"Spécialistes, pas généralistes", v1p:"Chaque recruteur chez Proforce vit à l'intérieur d'une industrie. Il connaît les rôles, les acteurs, la culture. C'est pas un pitch, c'est comme on opère depuis le premier jour.",
      v2h:"Réseau plutôt qu'algorithmes", v2p:"On ne publie pas d'offres d'emploi et on n'attend pas. On appelle des gens qu'on connaît déjà. Les meilleurs candidats ne cherchent généralement pas, on sait où ils sont.",
      v3h:"Des résultats garantis", v3p:"Chaque placement vient avec une garantie. On est suffisamment confiants dans notre processus pour se tenir derrière les gens qu'on t'envoie.",
      guarH:"Notre garantie", guarP:"Chaque placement permanent vient avec une garantie de remplacement. Si le candidat part ou ne convient pas dans la période de garantie, on en trouve un autre. Sans frais." },
  }[lang];

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:C.orange, lineHeight:0.95, marginBottom:"3rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1.05rem", lineHeight:1.8, maxWidth:"600px" }}>{t.story}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"What We Stand For":"Ce qu'on défend"}</Eyebrow>
          <Divider style={{ marginBottom:"4rem" }} />
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0", border:`1px solid ${C.rule}` }}>
            {[[t.v1h,t.v1p,"01"],[t.v2h,t.v2p,"02"],[t.v3h,t.v3p,"03"]].map(([h,p,n],i) => (
              <div key={n} style={{ padding:"2.5rem 2rem", borderRight: i<2?`1px solid ${C.rule}`:"none" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop:"4rem", padding:"3rem", background:C.paper, borderLeft:`3px solid ${C.orange}` }}>
            <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"0.75rem" }}>{t.guarH}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8 }}>{t.guarP}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────
function TeamPage({ lang, setPage, setBlogPost }) {
  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{lang==="en"?"Our Team":"Notre équipe"}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,6.5rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92, marginBottom:"1.5rem" }}>
            {lang==="en"?"Five specialists." : "Cinq spécialistes."}
          </h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4rem)", color:C.orange, lineHeight:0.95 }}>
            {lang==="en"?"No generalists." : "Aucun généraliste."}
          </h2>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />
          {TEAM.map((m, i) => (
            <div key={m.name}>
              <div style={{
                display:"grid", gridTemplateColumns:"280px 1fr", gap:"4rem",
                padding:"3.5rem 0", alignItems:"start",
              }}
                className="two-col"
              >
                {/* Left: identity */}
                <div>
                  <Avatar m={m} full style={{ marginBottom:"1.5rem", maxWidth:"280px" }} />
                  <div style={{ marginBottom:"1.5rem" }}>
                    <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.15rem", color:C.ink, fontWeight:600 }}>{m.name}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, marginTop:"4px" }}>{m.title[lang]}</div>
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.muted, marginBottom:"1.25rem" }}>{m.sector[lang]}</div>
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{
                    display:"inline-flex", alignItems:"center", gap:"6px",
                    fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase",
                    color:C.ink, borderBottom:`1px solid ${C.rule}`, paddingBottom:"2px", transition:"color 0.2s, border-color 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color=C.orange; e.currentTarget.style.borderColor=C.orange; }}
                    onMouseLeave={e => { e.currentTarget.style.color=C.ink; e.currentTarget.style.borderColor=C.rule; }}
                  ><LinkedInIcon /> LinkedIn</a>
                </div>

                {/* Right: bio + articles */}
                <div>
                  <p style={{ color:C.muted, fontSize:"0.95rem", lineHeight:1.8, marginBottom: m.articles.length ? "2rem" : "0" }}>{m.bio[lang]}</p>
                  {m.articles.length > 0 && (
                    <div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem" }}>
                        {lang==="en"?"Articles":"Articles"}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
                        {POSTS.filter(p => m.articles.includes(p.id)).map((post,j) => (
                          <button key={post.id} onClick={() => { setBlogPost(post.id); setPage("blog"); window.scrollTo({top:0,behavior:"smooth"}); }} style={{
                            textAlign:"left", padding:"0.6rem 0",
                            borderBottom:`1px solid ${C.rule}`,
                            display:"flex", alignItems:"center", gap:"1rem",
                            transition:"opacity 0.2s",
                          }}
                            onMouseEnter={e => e.currentTarget.style.opacity="0.6"}
                            onMouseLeave={e => e.currentTarget.style.opacity="1"}
                          >
                            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.orange, flexShrink:0 }}>0{j+1}</span>
                            <span style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.ink }}>{post.title[lang]}</span>
                            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.muted, marginLeft:"auto", flexShrink:0 }}>{post.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── CANDIDATES ───────────────────────────────────────────────────────────────
function CandidatesPage({ lang, setPage }) {
  const t = {
    en:{ eyebrow:"For Candidates, Food, CPG & Fashion", h1:"We work with people,", h1i:"not résumés.", sub:"If you're in food manufacturing, CPG, or fashion in Montreal, Toronto, or Atlantic Canada and you've built something real, we want to know you. Before there's even a job open.",
      h1h:"We reach out proactively", h1p:"If you've got the right background, we call you before there's even a posting. That's how our best placements happen.",
      h2h:"We don't waste your time", h2p:"We're strategic. One opportunity at a time, and only the right ones. No spray-and-pray.",
      h3h:"Your search stays private", h3p:"We don't share your info without your explicit approval. Your employer doesn't find out you're talking to us.",
      submitH:"Send us your background.", submitP:"Not sure if there's a fit right now? Reach out anyway. We'll remember you when the right mandate comes in.", cta:"Get in Touch" },
    fr:{ eyebrow:"Pour les candidats, Alimentaire, CPG & Mode", h1:"On travaille avec des gens,", h1i:"pas des CV.", sub:"Si t'es dans la fabrication alimentaire, le CPG ou la mode à Montréal, Toronto ou dans les provinces atlantiques et que t'as bâti quelque chose de réel, on veut te connaître. Avant même qu'il y ait un poste ouvert.",
      h1h:"On approche de façon proactive", h1p:"Si t'as le bon background, on t'appelle avant même qu'il y ait une affichage. C'est comme ça que nos meilleurs placements se font.",
      h2h:"On ne perd pas ton temps", h2p:"On est stratégiques. Une opportunité à la fois, et seulement les bonnes.",
      h3h:"Ta recherche reste privée", h3p:"On ne partage pas ton info sans ton approbation explicite. Ton employeur ne découvrira pas que tu nous parles.",
      submitH:"Envoie-nous ton background.", submitP:"Tu sais pas si y'a un fit présentement? Contacte-nous quand même. On va se souvenir de toi quand le bon mandat arrive.", cta:"Nous contacter" },
  }[lang];

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,7vw,6.5rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92, marginBottom:"0.5rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,6vw,5.5rem)", color:C.orange, lineHeight:0.95, marginBottom:"3rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"500px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0", border:`1px solid ${C.rule}`, marginBottom:"4rem" }}>
            {[[t.h1h,t.h1p,"01"],[t.h2h,t.h2p,"02"],[t.h3h,t.h3p,"03"]].map(([h,p,n],i) => (
              <div key={n} style={{ padding:"2.5rem 2rem", borderRight: i<2?`1px solid ${C.rule}`:"none" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>

          <div style={{ background:C.paper, padding:"3rem", borderLeft:`3px solid ${C.orange}` }}>
            <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.5rem", color:C.ink, marginBottom:"0.75rem" }}>{t.submitH}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8, maxWidth:"440px", marginBottom:"1.5rem" }}>{t.submitP}</p>
            <button className="btn-ink" onClick={() => setPage("contact")}>{t.cta}</button>
          </div>
        </div>
      </section>

      <FAQSection lang={lang} type="candidates" setPage={setPage} />
    </div>
  );
}

// ─── EMPLOYERS PAGE ───────────────────────────────────────────────────────────
function EmployersPage({ lang, setPage }) {
  const t = {
    en: {
      eyebrow: "For Employers, Montreal, Toronto & Atlantic Canada",
      h1: "You need the right person.",
      h1i: "Not just a résumé pile.",
      sub: "Proforce works with food manufacturers, CPG brands, and fashion companies in Montreal, Toronto, and Atlantic Canada that are serious about their next hire. We don't spray and pray. We find the person, the one who wasn't looking, and bring them to you.",
      processLabel: "How It Works",
      processH: "Simple. Accountable. Fast.",
      processLink: "See the full 9-step process →",
      steps: [
        { n:"01", h:{en:"We learn your business",fr:""}, p:{en:"One call. We want to understand the role, the team, the culture, and what's actually made previous people succeed or fail in this position. The more we know, the better we place.",fr:""} },
        { n:"02", h:{en:"We go into our network",fr:""}, p:{en:"We don't post your job publicly. We call people directly, people we already know, people who trust us, people who aren't refreshing job boards. That's where the best candidates live.",fr:""} },
        { n:"03", h:{en:"We send you a shortlist",fr:""}, p:{en:"Not 20 resumes. Two or three people, pre-qualified, already interested, already screened. Your time is too valuable for anything else.",fr:""} },
        { n:"04", h:{en:"We manage the process",fr:""}, p:{en:"Interview coordination, offer negotiation, reference checks, we handle it. We stay close through the placement and after, to make sure it sticks.",fr:""} },
      ],
      whyH: "Why companies choose us.",
      w1h: "We specialize. We don't generalize.",
      w1p: "Every recruiter at Proforce works in one industry. They know your world, the titles, the pressures, the certifications, the culture. You're not explaining your business to someone who placed a dental hygienist last week.",
      w2h: "We find people who aren't looking.",
      w2p: "The best candidates are employed. They're not on job boards. They're in our network, people we've placed, people we've talked to, people we've known for years. We call them. They answer.",
      w3h: "We stand behind our placements.",
      w3p: "Every permanent placement comes with a replacement guarantee. If it doesn't work out within the guarantee period, we find you another candidate. No charge. That's how confident we are in our process.",
      w4h: "We're fast when it matters.",
      w4p: "Speed is a competitive advantage in hiring. When you need someone, you need them now, not in three months. We move quickly because we're not starting from scratch every time.",
      guarH: "Our Guarantee",
      guarP: "Every permanent placement is covered by a replacement guarantee. If the candidate doesn't work out within the agreed period, we restart the search at no additional cost. We don't just place people and disappear.",
      feeH: "How Our Fees Work",
      feeP: "We work on a contingency or retained basis depending on the mandate. Our fee is a percentage of the placed candidate's first-year salary, invoiced upon successful placement. We're happy to walk you through the structure on a call, no surprises, no hidden costs.",
      sectorsH: "Industries We Serve",
      food: "Food & CPG", foodP: "Plant managers, quality directors, supply chain leaders, sales, operations, across Quebec and Ontario.",
      fashion: "Fashion & Apparel", fashionP: "Buyers, brand managers, designers, production coordinators, merchandisers, Montreal and Toronto.",
      ctaH: "Let's talk about your next hire.",
      ctaP: "One call is usually enough to know if we're the right fit for your mandate.",
      cta: "Contact Us",
      cta2: "See Our Sectors",
    },
    fr: {
      eyebrow: "Pour les employeurs, Montréal, Toronto et Atlantique",
      h1: "T'as besoin de la bonne personne.",
      h1i: "Pas juste une pile de CV.",
      sub: "Proforce travaille avec des fabricants alimentaires, des marques CPG et des compagnies mode à Montréal, Toronto et dans les provinces atlantiques qui prennent leur prochaine embauche au sérieux. On n'affiche pas et on croise pas les doigts. On trouve la personne, celle qui ne cherchait pas, et on te l'amène.",
      processLabel: "Comment ça fonctionne",
      processH: "Simple. Imputable. Rapide.",
      processLink: "Voir le processus complet en 9 étapes →",
      steps: [
        { n:"01", h:{en:"",fr:"On apprend ton business"}, p:{en:"",fr:"Un appel. On veut comprendre le rôle, l'équipe, la culture, et ce qui a fait réussir ou échouer les gens dans ce poste avant. Plus on en sait, mieux on place."} },
        { n:"02", h:{en:"",fr:"On va dans notre réseau"}, p:{en:"",fr:"On n'affiche pas ton poste publiquement. On appelle des gens directement, des gens qu'on connaît déjà, des gens qui nous font confiance, des gens qui ne rafraîchissent pas les babillards d'emploi. C'est là que vivent les meilleurs candidats."} },
        { n:"03", h:{en:"",fr:"On t'envoie une courte liste"}, p:{en:"",fr:"Pas 20 CV. Deux ou trois personnes, pré-qualifiées, déjà intéressées, déjà évaluées. Ton temps est trop précieux pour autre chose."} },
        { n:"04", h:{en:"",fr:"On gère le processus"}, p:{en:"",fr:"Coordination des entrevues, négociation de l'offre, vérification des références, on s'en occupe. On reste proche tout au long du placement et après, pour s'assurer que ça tient."} },
      ],
      whyH: "Pourquoi les compagnies nous choisissent.",
      w1h: "On se spécialise. On ne généralise pas.",
      w1p: "Chaque recruteur chez Proforce travaille dans une seule industrie. Il connaît ton monde, les titres, les pressions, les certifications, la culture. T'as pas à expliquer ton business à quelqu'un qui a placé une hygiéniste dentaire la semaine passée.",
      w2h: "On trouve des gens qui ne cherchent pas.",
      w2p: "Les meilleurs candidats sont employés. Ils ne sont pas sur les babillards d'emploi. Ils sont dans notre réseau, des gens qu'on a placés, des gens à qui on a parlé, des gens qu'on connaît depuis des années. On les appelle. Ils répondent.",
      w3h: "On se tient derrière nos placements.",
      w3p: "Chaque placement permanent vient avec une garantie de remplacement. Si ça ne fonctionne pas dans la période de garantie, on trouve un autre candidat. Sans frais. C'est à quel point on est confiants dans notre processus.",
      w4h: "On est rapides quand ça compte.",
      w4p: "La vitesse est un avantage concurrentiel dans l'embauche. Quand t'as besoin de quelqu'un, t'en as besoin maintenant, pas dans trois mois. On bouge vite parce qu'on ne repart pas de zéro à chaque fois.",
      guarH: "Notre garantie",
      guarP: "Chaque placement permanent est couvert par une garantie de remplacement. Si le candidat ne convient pas dans la période convenue, on relance la recherche sans frais supplémentaires. On ne place pas des gens et on disparaît pas.",
      feeH: "Comment nos honoraires fonctionnent",
      feeP: "On travaille sur une base contingente ou retenue selon le mandat. Nos honoraires sont un pourcentage du salaire de première année du candidat placé, facturé lors du placement réussi. On est heureux de te présenter la structure sur un appel, pas de surprises, pas de frais cachés.",
      sectorsH: "Industries qu'on sert",
      food: "Alimentaire & CPG", foodP: "Directeurs d'usine, directeurs qualité, responsables chaîne d'approvisionnement, ventes, opérations, au Québec et en Ontario.",
      fashion: "Mode & Habillement", fashionP: "Acheteurs, gestionnaires de marque, designers, coordinateurs de production, marchandiseurs, Montréal et Toronto.",
      ctaH: "Parlons de ta prochaine embauche.",
      ctaP: "Un appel suffit généralement pour savoir si on est le bon fit pour ton mandat.",
      cta: "Nous contacter",
      cta2: "Voir nos secteurs",
    },
  }[lang];

  return (
    <div>
      {/* Hero */}
      <section style={{ background:C.ink, minHeight:"65vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>proforce.ca</span>
          </div>
        </div>
        <div style={{ maxWidth:"900px" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.75, maxWidth:"560px", marginBottom:"2.5rem" }}>{t.sub}</p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
            <button style={{ display:"inline-block", border:"1.5px solid rgba(255,255,255,0.3)", color:"#fff", padding:"11px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", transition:"border-color 0.2s", cursor:"pointer", background:"transparent" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"}
              onClick={() => setPage("food")}
            >{t.cta2}</button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{t.processLabel}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.processH}</h2>
          <Divider style={{ marginBottom:"0" }} />
          {t.steps.map((step, i) => (
            <div key={step.n} style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:"2rem", padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"2.5rem", fontWeight:700, color:C.orange, letterSpacing:"-0.03em", lineHeight:1 }}>{step.n}</div>
              <div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.2rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{step.h[lang]}</h3>
                <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8 }}>{step.p[lang]}</p>
              </div>
            </div>
          ))}
          <div style={{ paddingTop:"2rem" }}>
            <button onClick={() => setPage("howwework")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, borderBottom:`1px solid ${C.orange}`, paddingBottom:"2px" }}>
              {t.processLink}
            </button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Why Proforce":"Pourquoi Proforce"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.whyH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"0", border:`1px solid ${C.rule}` }}>
            {[[t.w1h,t.w1p,"01"],[t.w2h,t.w2p,"02"],[t.w3h,t.w3p,"03"],[t.w4h,t.w4p,"04"]].map(([h,p,n],i) => (
              <div key={n} style={{
                padding:"2.5rem 2rem",
                borderRight: i%2===0 ? `1px solid ${C.rule}` : "none",
                borderBottom: i<2 ? `1px solid ${C.rule}` : "none",
                background:C.white,
              }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.05rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee + Fees */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", background:C.rule }} className="two-col">
          <div style={{ background:C.white, padding:"3rem 2.5rem" }}>
            <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.5rem" }} />
            <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"0.75rem" }}>{t.guarH}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8 }}>{t.guarP}</p>
          </div>
          <div style={{ background:C.white, padding:"3rem 2.5rem" }}>
            <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.5rem" }} />
            <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"0.75rem" }}>{t.feeH}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8 }}>{t.feeP}</p>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section style={{ background:C.ink, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow style={{ color:"rgba(255,255,255,0.4)" }}>{t.sectorsH}</Eyebrow>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", background:"rgba(255,255,255,0.08)", marginTop:"2rem" }} className="two-col">
            {[
              { h:t.food, p:t.foodP, pg:"food" },
              { h:t.fashion, p:t.fashionP, pg:"fashion" },
            ].map(s => (
              <button key={s.pg} onClick={() => setPage(s.pg)} style={{ background:C.inkLight, padding:"2.5rem", textAlign:"left", transition:"background 0.2s", width:"100%" }}
                onMouseEnter={e => e.currentTarget.style.background="#1e4080"}
                onMouseLeave={e => e.currentTarget.style.background=C.inkLight}
              >
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", color:C.orange, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{s.h}</h3>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.86rem", lineHeight:1.7, marginBottom:"1.25rem" }}>{s.p}</p>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>
                  {lang==="en"?"Learn more →":"En savoir plus →"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.orange, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"3rem" }}>
          <div>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,5vw,3.5rem)", color:"#fff", letterSpacing:"-0.03em", lineHeight:1, marginBottom:"0.75rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", maxWidth:"400px", lineHeight:1.7 }}>{t.ctaP}</p>
          </div>
          <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"14px 32px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >{t.cta}</button>
        </div>
      </section>
    </div>
  );
}

// ─── JOB LISTINGS ─────────────────────────────────────────────────────────────
function JobListingsPage({ lang }) {
  const t = {
    en:{ eyebrow:"Job Listings", h1:"Current", h1i:"Opportunities.", sub:"Active mandates across food, CPG, and fashion. All positions are permanent placements unless noted.",
      note:"Our full job board is on proforcejobs.com, all active listings, updated regularly.", cta:"Visit proforcejobs.com",
      roles:[{title:"Quality Coordinator",co:"Food Manufacturer",loc:"Rawdon, QC"},{title:"Account Manager | Food Ingredients",co:"Ingredients Distributor",loc:"Montreal, QC"},{title:"Customer Service Coordinator",co:"CPG Company",loc:"Toronto, ON"},{title:"Sales Representative",co:"Food Distributor",loc:"West Quebec"}] },
    fr:{ eyebrow:"Offres d'emploi", h1:"Opportunités", h1i:"en cours.", sub:"Mandats actifs en alimentaire, CPG et mode. Tous les postes sont des placements permanents sauf indication.",
      note:"Notre babillard complet est sur proforcejobs.com, toutes les offres actives, mises à jour régulièrement.", cta:"Visiter proforcejobs.com",
      roles:[{title:"Coordinateur qualité",co:"Manufacturier alimentaire",loc:"Rawdon, QC"},{title:"Chargé de compte | Ingrédients alimentaires",co:"Distributeur d'ingrédients",loc:"Montréal, QC"},{title:"Coordinateur service client",co:"Compagnie CPG",loc:"Toronto, ON"},{title:"Représentant aux ventes",co:"Distributeur alimentaire",loc:"Ouest du Québec"}] },
  }[lang];

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92 }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5.5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"500px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />
          {t.roles.map((r,i) => (
            <div key={r.title} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"1.75rem 0", borderBottom:`1px solid ${C.rule}`, flexWrap:"wrap", gap:"1rem",
            }}>
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.05rem", color:C.ink, letterSpacing:"-0.01em" }}>{r.title}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.06em", color:C.muted, marginTop:"4px" }}>{r.co} · {r.loc}</div>
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, border:`1px solid ${C.orange}`, padding:"4px 10px" }}>Permanent</span>
            </div>
          ))}

          <div style={{ marginTop:"4rem", padding:"2.5rem", background:C.paper, borderLeft:`3px solid ${C.orange}` }}>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8, marginBottom:"1.25rem" }}>{t.note}</p>
            <a href="https://www.proforcejobs.com" target="_blank" rel="noopener noreferrer" className="btn-ink">{t.cta}</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── GIVING ───────────────────────────────────────────────────────────────────
function GivingPage({ lang }) {
  const t = {
    en:{ eyebrow:"Giving Back", h1:"More than", h1i:"placements.", sub:"Proforce has supported causes close to our hearts since the beginning. These organizations do work that matters." },
    fr:{ eyebrow:"Donner en retour", h1:"Plus que des", h1i:"placements.", sub:"Proforce soutient des causes qui nous tiennent à cœur depuis le début. Ces organisations font un travail qui compte." },
  }[lang];

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92 }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5.5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"480px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />
          {CHARITIES.map(c => (
            <div key={c.name} style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"3rem", padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }} className="two-col">
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1rem", color:C.ink, fontWeight:600, paddingTop:"2px" }}>{c.name}</div>
              <div style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.75 }}>{c.desc[lang]}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── NEWSLETTER WIDGET ────────────────────────────────────────────────────────
function NewsletterWidget({ lang, compact }) {
  const [email, setEmail] = useState("");
  const [prefLang, setPrefLang] = useState(lang);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const t = {
    en: {
      h: compact ? "Get new articles in your inbox." : "Stay in the loop.",
      p: compact ? null : "New articles on food industry hiring, career moves, and market observations, straight to your inbox. No fluff.",
      placeholder: "your@email.com",
      lang_label: "Preferred language",
      cta: "Subscribe",
      sending: "Sending...",
      done: "You're in. Talk soon.",
      error: "Something went wrong. Try again.",
    },
    fr: {
      h: compact ? "Reçois les nouveaux articles par courriel." : "Reste dans la boucle.",
      p: compact ? null : "Nouveaux articles sur l'embauche dans l'alimentaire, les mouvements de carrière et les observations de marché, directement dans ta boîte. Pas de remplissage.",
      placeholder: "ton@courriel.com",
      lang_label: "Langue préférée",
      cta: "S'abonner",
      sending: "Envoi...",
      done: "C'est fait. À bientôt.",
      error: "Une erreur s'est produite. Réessaie.",
    },
  }[lang];

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("sending");
    try {
      // EmailJS call, replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id:  "YOUR_SERVICE_ID",
          template_id: "YOUR_NEWSLETTER_TEMPLATE_ID",
          user_id:     "YOUR_PUBLIC_KEY",
          template_params: {
            subscriber_email: email,
            preferred_lang: prefLang === "fr" ? "Français" : "English",
            source: "proforce.ca blog",
          },
        }),
      });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div style={{ padding: compact ? "1.5rem" : "2.5rem", background: C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
        <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1rem" }} />
        <p style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink }}>{t.done}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: compact ? "1.5rem 2rem" : "3rem", background: C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
      <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
      <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize: compact ? "1rem" : "1.3rem", color:C.ink, letterSpacing:"-0.01em", marginBottom: t.p ? "0.6rem" : "1.25rem" }}>{t.h}</h3>
      {t.p && <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.muted, fontSize:"0.88rem", lineHeight:1.7, marginBottom:"1.5rem", maxWidth:"420px" }}>{t.p}</p>}

      <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"flex-end" }}>
        <input
          type="email"
          placeholder={t.placeholder}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{
            flex:"1 1 220px", padding:"10px 0", background:"transparent",
            border:"none", borderBottom:`1px solid ${C.rule}`,
            fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.ink,
            outline:"none", transition:"border-color 0.2s", minWidth:"180px",
          }}
          onFocus={e => e.target.style.borderColor=C.orange}
          onBlur={e => e.target.style.borderColor=C.rule}
        />

        {!compact && (
          <select value={prefLang} onChange={e => setPrefLang(e.target.value)} style={{
            padding:"10px 8px", background:"transparent",
            border:"none", borderBottom:`1px solid ${C.rule}`,
            fontFamily:"'DM Mono',monospace", fontSize:"0.65rem",
            letterSpacing:"0.08em", textTransform:"uppercase", color:C.muted,
            outline:"none", cursor:"pointer",
          }}>
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="btn-ink"
          style={{ flexShrink:0, opacity: status === "sending" ? 0.6 : 1 }}
        >
          {status === "sending" ? t.sending : t.cta}
        </button>
      </div>

      {status === "error" && (
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", color:"#c0392b", marginTop:"0.75rem", letterSpacing:"0.06em" }}>{t.error}</p>
      )}
    </div>
  );
}
function BlogPage({ lang, setPage, initialPost, onOpenPost }) {
  const [activePost, setActivePost] = useState(initialPost || null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const openPost = (id) => {
    if (onOpenPost) onOpenPost(id);
    else setActivePost(id);
  };

  const cats = {
    en:[["all","All"],["Hiring","Hiring"],["Career","Career"],["Market","Market"]],
    fr:[["all","Tout"],["Embauche","Embauche"],["Carrière","Carrière"],["Marché","Marché"]],
  }[lang];

  const filtered = POSTS.filter(p => {
    const matchesCat = filter === "all" || p.cat[lang] === filter;
    const q = query.toLowerCase().trim();
    const matchesSearch = !q
      || p.title[lang].toLowerCase().includes(q)
      || p.excerpt[lang].toLowerCase().includes(q)
      || p.cat[lang].toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (activePost) {
    const post = POSTS.find(p => p.id===activePost);
    return (
      <div>
        <section style={{ background:C.paper, padding:"8rem 2rem 4rem" }}>
          <div style={{ maxWidth:"720px", margin:"0 auto" }}>
            <button onClick={() => setActivePost(null)} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.muted, marginBottom:"3rem", display:"flex", alignItems:"center", gap:"8px" }}>
              ← {lang==="en"?"Back":"Retour"}
            </button>
            <div style={{ display:"flex", gap:"1.5rem", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange }}>{post.cat[lang]}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:C.muted }}>{post.date} · {post.read[lang]}</span>
            </div>
            <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2rem,5vw,3.5rem)", letterSpacing:"-0.03em", color:C.ink, lineHeight:1.05, marginBottom:"3rem" }}>{post.title[lang]}</h1>
          </div>
        </section>
        <section style={{ background:C.white, padding:"4rem 2rem 6rem" }}>
          <div style={{ maxWidth:"680px", margin:"0 auto" }}>
            <Divider style={{ marginBottom:"3rem" }} />
            {post.body[lang].split("\n\n").map((para,i) => (
              <p key={i} style={{ fontFamily:"'Spectral',serif", fontSize:"1.05rem", lineHeight:1.9, color:C.inkLight, marginBottom:"1.75rem", fontWeight:300 }}>{para}</p>
            ))}
            <Divider style={{ marginTop:"3rem", marginBottom:"2rem" }} />
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"3rem" }}>
              <button className="btn-ink" onClick={() => setPage("contact")}>
                {lang==="en"?"Get in Touch":"Nous contacter"}
              </button>
              <button className="btn-ghost" onClick={() => setActivePost(null)}>
                {lang==="en"?"← Back to Blog":"← Retour au blogue"}
              </button>
            </div>
            <NewsletterWidget lang={lang} compact={true} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{lang==="en"?"Proforce Blog":"Blogue Proforce"}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.92, marginBottom:"1rem" }}>
            {lang==="en"?"Straight talk." : "Du vrai parler."}
          </h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2rem" }}>
            {lang==="en"?"No fluff." : "Pas de remplissage."}
          </h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"480px" }}>
            {lang==="en"?"25 years of observations on food, CPG, and fashion hiring.":"25 ans d'observations sur l'embauche dans l'alimentaire, le CPG et la mode."}
          </p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          {/* Filters + Search */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2.5rem", flexWrap:"wrap", gap:"1.5rem" }}>
            <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
              {cats.map(([val,label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{
                  fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase",
                  color: filter===val ? C.orange : C.muted,
                  borderBottom: filter===val ? `1px solid ${C.orange}` : "1px solid transparent",
                  paddingBottom:"2px", transition:"color 0.2s",
                }}>{label}</button>
              ))}
            </div>
            <div style={{ position:"relative", flexShrink:0 }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang==="en" ? "Search articles..." : "Rechercher..."}
                style={{
                  padding:"8px 32px 8px 12px", background:"transparent",
                  border:`1px solid ${C.rule}`, borderRadius:"0",
                  fontFamily:"'DM Mono',monospace", fontSize:"0.65rem",
                  letterSpacing:"0.06em", color:C.ink, outline:"none",
                  width:"200px", transition:"border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor=C.orange}
                onBlur={e => e.target.style.borderColor=C.rule}
              />
              <span style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:"0.75rem", pointerEvents:"none" }}>
                {query ? <button onClick={() => setQuery("")} style={{ color:C.orange, fontSize:"0.7rem", cursor:"pointer" }}>✕</button> : "⌕"}
              </span>
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding:"4rem 0", textAlign:"center" }}>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"1.1rem", color:C.muted, fontStyle:"italic" }}>
                {lang==="en" ? `No articles found for "${query}".` : `Aucun article trouvé pour « ${query} ».`}
              </p>
              <button onClick={() => { setQuery(""); setFilter("all"); }} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginTop:"1rem", borderBottom:`1px solid ${C.orange}` }}>
                {lang==="en" ? "Clear search" : "Effacer la recherche"}
              </button>
            </div>
          )}

          <Divider style={{ marginBottom:"0" }} />
          {filtered.map((post,i) => (
            <div key={post.id}>
              <button onClick={() => { openPost(post.id); window.scrollTo({top:0,behavior:"smooth"}); }} style={{
                width:"100%", display:"grid", gridTemplateColumns:"60px 1fr 120px",
                gap:"2rem", alignItems:"start", padding:"2.25rem 0", textAlign:"left",
                transition:"opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.65"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >
                <div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.orange, letterSpacing:"0.1em" }}>0{i+1}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.06em", marginTop:"4px" }}>{post.cat[lang]}</div>
                </div>
                <div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1rem,2.5vw,1.35rem)", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.5rem" }}>{post.title[lang]}</div>
                  <div style={{ fontFamily:"'Spectral',serif", fontSize:"0.9rem", color:C.muted, lineHeight:1.65, fontStyle:"italic" }}>{post.excerpt[lang]}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.muted, letterSpacing:"0.06em" }}>{post.date}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.muted, marginTop:"4px" }}>{post.read[lang]}</div>
                </div>
              </button>
              <Divider />
            </div>
          ))}

          {/* Newsletter */}
          <div style={{ marginTop:"4rem" }}>
            <NewsletterWidget lang={lang} compact={false} />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactPage({ lang }) {
  const [form, setForm] = useState({name:"",email:"",company:"",message:""});
  const [sent, setSent] = useState(false);
  const t = {
    en:{ eyebrow:"Get in Touch", h1:"Let's talk.", fName:"Your name", fEmail:"Email", fCo:"Company (optional)", fMsg:"What are you looking for?", send:"Send", sent:"Message sent. We'll be in touch shortly." },
    fr:{ eyebrow:"Nous joindre", h1:"Jasez avec nous.", fName:"Ton nom", fEmail:"Courriel", fCo:"Compagnie (optionnel)", fMsg:"Qu'est-ce que tu cherches?", send:"Envoyer", sent:"Message envoyé. On te revient bientôt." },
  }[lang];

  const inp = { width:"100%", padding:"11px 0", background:"transparent", border:"none", borderBottom:`1px solid ${C.rule}`, color:C.ink, fontFamily:"'DM Sans',sans-serif", fontSize:"0.95rem", outline:"none", transition:"border-color 0.2s" };

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3.5rem,10vw,9rem)", letterSpacing:"-0.03em", color:C.paper, lineHeight:0.9 }}>{t.h1}</h1>
        </div>
      </section>

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div className="two-col" style={{ maxWidth:"1000px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"6rem", alignItems:"start" }}>
          {/* Info */}
          <div>
            {[{city:"Montréal",phone:"(514) 905-0606",addr:"500 Place d'Armes, #1800\nMontréal, QC H2Y 2W2"},{city:"Québec",phone:"(418) 431-1441",addr:"1020, rue Bouvier, Bureau 400\nQuébec, QC G2K 0K9"},{city:"Toronto",phone:"(647) 490-6626",addr:"197 Yonge Street, Unit 201\nToronto, ON M5B 0C1"}].map(o => (
              <div key={o.city} style={{ marginBottom:"3rem" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"1.25rem" }}>{o.city}</div>
                <Divider style={{ marginBottom:"1.25rem" }} />
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginBottom:"0.4rem" }}>{lang==="en"?"Phone":"Téléphone"}</div>
                <a href={`tel:+1${o.phone.replace(/\D/g,"")}`} style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.ink, marginBottom:"1rem", textDecoration:"none" }}>{o.phone}</a>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginBottom:"0.4rem" }}>{lang==="en"?"Address":"Adresse"}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:C.muted, lineHeight:1.7, whiteSpace:"pre-line" }}>{o.addr}</div>
              </div>
            ))}
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginBottom:"0.4rem" }}>Email</div>
            <a href="mailto:info@proforce.ca" style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.ink, marginBottom:"2.5rem", textDecoration:"none" }}>info@proforce.ca</a>

            {/* Booking CTA */}
            <div style={{ padding:"1.75rem", background:C.ink, borderLeft:`3px solid ${C.orange}` }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.orange, marginBottom:"0.6rem" }}>
                {lang==="en"?"Prefer to book directly?":"Tu préfères réserver directement?"}
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:"rgba(255,255,255,0.65)", lineHeight:1.6, marginBottom:"1.25rem" }}>
                {lang==="en"
                  ? "Pick a time that works for you. 15 minutes is usually enough to know if we're the right fit."
                  : "Choisis un moment qui te convient. 15 minutes suffit généralement pour savoir si on est le bon fit."}
              </p>
              <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer"
                onClick={() => track.contactClick()}
                className="btn-orange"
                style={{ display:"inline-block" }}
              >
                {lang==="en"?"Book a 15-min Call":"Réserver un appel 15 min"}
              </a>
            </div>

            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem" }}>{lang==="en"?"Follow Us":"Nous suivre"}</div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              {[
                { href:"https://www.facebook.com/share/17YcPvUvNn/", title:"Facebook", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { href:"https://www.instagram.com/proforcepersonnel", title:"Instagram", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { href:"https://www.linkedin.com/company/proforce-personnel", title:"LinkedIn", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              ].map(s => (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title}
                  style={{ width:"36px", height:"36px", border:`1px solid ${C.rule}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.rule; e.currentTarget.style.color=C.muted; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ padding:"4rem 0" }}>
                <div style={{ width:"32px", height:"2px", background:C.orange, marginBottom:"1.5rem" }} />
                <p style={{ fontFamily:"'Spectral',serif", fontSize:"1.2rem", color:C.ink, fontStyle:"italic" }}>{t.sent}</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"2rem" }}>
                {[["name",t.fName,"text"],["email",t.fEmail,"email"],["company",t.fCo,"text"]].map(([k,pl,type]) => (
                  <input key={k} type={type} placeholder={pl} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    style={inp}
                    onFocus={e => e.target.style.borderColor=C.orange}
                    onBlur={e => e.target.style.borderColor=C.rule}
                  />
                ))}
                <textarea placeholder={t.fMsg} rows={5} value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  style={{...inp, resize:"vertical"}}
                  onFocus={e => e.target.style.borderColor=C.orange}
                  onBlur={e => e.target.style.borderColor=C.rule}
                />
                <button className="btn-ink" onClick={() => { setSent(true); track.formSubmit(); }} style={{ alignSelf:"flex-start" }}>{t.send}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ROI CALCULATOR PAGE ──────────────────────────────────────────────────────
function CalculatorPage({ lang, setPage }) {
  const [salary, setSalary] = useState(110000);
  const [weeks, setWeeks] = useState(12);
  const [turnover, setTurnover] = useState(40);
  const [feePct, setFeePct] = useState(20);
  const [fillTime, setFillTime] = useState(6);

  const fmt = (n) => n.toLocaleString(lang === "fr" ? "fr-CA" : "en-CA", { style:"currency", currency:"CAD", maximumFractionDigits:0 });

  const weeklyRate = salary / 52;
  const vacancyCostDIY = weeks * weeklyRate * 0.7;
  const badHireCost = salary * 0.30;
  const expectedBadHire = badHireCost * (turnover / 100);
  const totalDIY = vacancyCostDIY + expectedBadHire;
  const fee = salary * (feePct / 100);
  const weeksSaved = Math.max(0, weeks - fillTime);
  const vacancySaved = weeksSaved * weeklyRate * 0.7;
  const badHireSaved = badHireCost * Math.max(0, (turnover / 100) - 0.10);
  const grossSavings = vacancySaved + badHireSaved;
  const roi = grossSavings - fee;

  const t = {
    en:{
      eyebrow:"Recruitment ROI Calculator",
      h1:"What does hiring actually cost?",
      h1i:"Let's do the math.",
      sub:"Most companies underestimate the real cost of a vacant role. Adjust the sliders to see your numbers.",
      salary:"Annual salary of the role", weeks:"Weeks to fill without a recruiter",
      turnover:"Probability of a bad hire without a recruiter", feePct:"Proforce fee percentage",
      fillTime:"Weeks to fill with Proforce",
      resultsH:"Your numbers.",
      r1:"Cost of vacancy (DIY)", r1s:"Lost productivity during search",
      r2:"Expected bad hire cost", r2s:"Training + exit + re-recruit (weighted by probability)",
      r3:"Total DIY hiring risk", r3s:"What you're actually exposed to",
      r4:"Proforce fee", r4s:"One-time, success-based",
      r5:"Vacancy savings", r5s:"Filling faster = faster productivity",
      r6:"Bad hire risk eliminated", r6s:"Pre-screened candidates + placement guarantee",
      roiLabel:"Net savings with Proforce",
      positive: (r, f, s) => `A Proforce fee of ${f} on a ${s} role generates an estimated net savings of ${r}. The fee pays for itself before the candidate's 90-day mark.`,
      negative: (f) => `At these parameters, the ${f} fee is near breakeven. In most real food manufacturing scenarios, with higher vacancy costs and bad hire risk, the gap is wider.`,
      disclaimer:"These calculations use industry-average assumptions. Actual results vary based on your specific situation.",
      cta:"Ready to talk?", cta2:"Contact Us",
    },
    fr:{
      eyebrow:"Calculateur de ROI en recrutement",
      h1:"C'est quoi le vrai coût d'embaucher?",
      h1i:"On fait les chiffres.",
      sub:"La plupart des compagnies sous-estiment le vrai coût d'un poste vacant. Ajuste les curseurs pour voir tes chiffres.",
      salary:"Salaire annuel du poste", weeks:"Semaines pour combler sans recruteur",
      turnover:"Probabilité d'un mauvais candidat sans recruteur", feePct:"Pourcentage d'honoraires Proforce",
      fillTime:"Semaines pour combler avec Proforce",
      resultsH:"Tes chiffres.",
      r1:"Coût du poste vacant (DIY)", r1s:"Perte de productivité pendant la recherche",
      r2:"Coût attendu d'un mauvais candidat", r2s:"Formation + départ + reprise (pondéré par probabilité)",
      r3:"Risque total si tu gères seul", r3s:"Ce à quoi tu es vraiment exposé",
      r4:"Honoraires Proforce", r4s:"Unique, basé sur le succès",
      r5:"Économie sur la vacance", r5s:"Combler plus vite = productivité plus rapide",
      r6:"Risque de mauvais candidat éliminé", r6s:"Candidats présélectionnés + garantie de placement",
      roiLabel:"Économies nettes avec Proforce",
      positive: (r, f, s) => `Les honoraires Proforce de ${f} sur un poste à ${s} génèrent une économie nette estimée à ${r}. Les honoraires se remboursent avant les 90 premiers jours du candidat.`,
      negative: (f) => `Avec ces paramètres, les honoraires de ${f} sont proches du seuil de rentabilité. Dans la plupart des scénarios réels de fabrication alimentaire, l'écart est plus large.`,
      disclaimer:"Ces calculs utilisent des hypothèses moyennes de l'industrie. Les résultats réels varient selon ta situation spécifique.",
      cta:"Prêt à jaser?", cta2:"Nous contacter",
    },
  }[lang];

  const sliders = [
    { label:t.salary, value:salary, set:setSalary, min:60000, max:250000, step:5000, fmt:(v)=>`${fmt(v)}` },
    { label:t.weeks, value:weeks, set:setWeeks, min:4, max:26, step:1, fmt:(v)=>`${v} ${lang==="en"?"weeks":"semaines"}` },
    { label:t.turnover, value:turnover, set:setTurnover, min:10, max:70, step:5, fmt:(v)=>`${v}%` },
    { label:t.feePct, value:feePct, set:setFeePct, min:15, max:25, step:1, fmt:(v)=>`${v}%` },
    { label:t.fillTime, value:fillTime, set:setFillTime, min:2, max:16, step:1, fmt:(v)=>`${v} ${lang==="en"?"weeks":"semaines"}` },
  ];

  const rows = [
    { label:t.r1, sub:t.r1s, value:vacancyCostDIY, type:"cost" },
    { label:t.r2, sub:t.r2s, value:expectedBadHire, type:"cost" },
    { label:t.r3, sub:t.r3s, value:totalDIY, type:"total" },
    { label:t.r4, sub:t.r4s, value:fee, type:"fee" },
    { label:t.r5, sub:t.r5s, value:vacancySaved, type:"saving" },
    { label:t.r6, sub:t.r6s, value:badHireSaved, type:"saving" },
  ];

  const sliderStyle = { width:"100%", accentColor:C.orange, cursor:"pointer" };

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,7vw,6rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4rem)", color:C.orange, lineHeight:0.95, marginBottom:"2rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:"rgba(255,255,255,0.6)", fontSize:"1rem", lineHeight:1.75, maxWidth:"520px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"start" }} className="two-col">

          {/* Sliders */}
          <div>
            <Eyebrow>{lang==="en"?"Your scenario":"Ton scénario"}</Eyebrow>
            <Divider style={{ marginBottom:"2rem" }} />
            {sliders.map((sl, i) => (
              <div key={i} style={{ marginBottom:"2rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.6rem" }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:C.ink, fontWeight:500 }}>{sl.label}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.78rem", color:C.orange, fontWeight:600 }}>{sl.fmt(sl.value)}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={sl.value} onChange={e => sl.set(Number(e.target.value))}
                  style={sliderStyle}
                />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted }}>{sl.fmt(sl.min)}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted }}>{sl.fmt(sl.max)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div>
            <Eyebrow>{t.resultsH}</Eyebrow>
            <Divider style={{ marginBottom:"0" }} />

            {rows.map((row, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"0.9rem 0", borderBottom:`1px solid ${C.rule}`,
                background: row.type==="total" ? C.paperDark : "transparent",
                paddingLeft: row.type==="total" ? "0.5rem" : 0,
                paddingRight: row.type==="total" ? "0.5rem" : 0,
              }}>
                <div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color: row.type==="total" ? C.ink : C.ink, fontWeight: row.type==="total" ? 700 : 400 }}>{row.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:C.muted, marginTop:"1px" }}>{row.sub}</div>
                </div>
                <div style={{
                  fontFamily:"'DM Mono',monospace", fontSize:"0.88rem", fontWeight:700, flexShrink:0, marginLeft:"1rem",
                  color: row.type==="cost"||row.type==="total" ? "#c0392b" : row.type==="fee" ? C.muted : "#27ae60",
                }}>
                  {row.type==="saving" ? "+" : ""}{fmt(row.value)}
                </div>
              </div>
            ))}

            {/* ROI highlight */}
            <div style={{ marginTop:"1.5rem", padding:"1.75rem", background: roi >= 0 ? C.ink : "#fdf0ed", borderLeft:`4px solid ${roi >= 0 ? C.orange : "#c0392b"}` }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color: roi >= 0 ? C.orange : "#c0392b", marginBottom:"0.5rem" }}>{t.roiLabel}</div>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"2.5rem", fontWeight:700, letterSpacing:"-0.03em", color: roi >= 0 ? "#fff" : "#c0392b", lineHeight:1, marginBottom:"0.75rem" }}>
                {roi >= 0 ? "+" : ""}{fmt(Math.abs(roi))}
              </div>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.88rem", color: roi >= 0 ? "rgba(255,255,255,0.7)" : C.muted, lineHeight:1.7, fontWeight:300, fontStyle:"italic" }}
                dangerouslySetInnerHTML={{ __html: roi >= 0 ? t.positive(fmt(roi), fmt(fee), fmt(salary)) : t.negative(fmt(fee)) }}
              />
            </div>

            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:C.muted, lineHeight:1.6, marginTop:"1rem" }}>{t.disclaimer}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.orange, padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem" }}>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1.8rem,4vw,3rem)", color:"#fff", letterSpacing:"-0.03em" }}>{t.cta}</h2>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"13px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase" }}>{t.cta2}</button>
            <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer" style={{ background:"transparent", border:"2px solid rgba(255,255,255,0.5)", color:"#fff", padding:"11px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase" }}>
              {lang==="en"?"Book a Call":"Réserver un appel"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── HOW WE WORK PAGE ─────────────────────────────────────────────────────────
function HowWeWorkPage({ lang, setPage }) {
  const t = {
    en: {
      eyebrow: "How We Work, For Employers",
      h1: "No surprises.",
      h1i: "No black boxes.",
      sub: "Here's exactly what happens from the moment you call us to the day your new hire starts. Every step, every expectation, every commitment on our end.",
      phaseLabel: "The Full Process",
      phases: [
        {
          n: "01", phase: "Discovery",
          h: "We learn your business, not just the job description.",
          p: "The first conversation isn't about resumes. It's about your company, your team, your culture, and the real reason this role exists. We want to understand what's made people succeed in this position before, what's made them fail, and what kind of person actually fits your environment.\n\nThis call typically takes 30 to 60 minutes. We'll ask you things most recruiters don't ask, about management style, team dynamics, growth trajectory, and what you're not willing to compromise on. The more you tell us, the better we place.\n\nAt the end of this call, we tell you honestly whether we think we can help, what our timeline looks like, and what we'll need from you to move quickly.",
          duration: "30 to 60 minutes",
          deliverable: "Honest assessment of the mandate + timeline",
        },
        {
          n: "02", phase: "Mandate Definition",
          h: "We agree on what we're looking for, and what we're not.",
          p: "Before we start searching, we align on the profile. Not just the job title and years of experience, the actual person. What does success look like at 6 months? At 12? What certifications are truly required versus nice to have? What's the real salary range, not the posted range, the range you'd actually offer a strong candidate?\n\nWe also agree on exclusivity or contingency terms, the guarantee period, and the fee structure. Everything is clear before we start. No surprises at invoice time.\n\nIf the compensation range isn't competitive for the profile you're looking for, we tell you now, not after three weeks of searching.",
          duration: "1 to 2 business days",
          deliverable: "Signed mandate agreement + candidate profile brief",
        },
        {
          n: "03", phase: "Network Search",
          h: "We go into our network. Not a job board.",
          p: "We don't post your role publicly. We identify the candidates who fit your profile and we call them directly. These are people we already know, people we've placed before, people who've referred candidates to us, people we've spoken with over the years and stayed in touch with.\n\nFor some mandates, we also reach out to candidates in our extended network through targeted outreach. Every approach is personalized. We're not sending mass messages.\n\nThis phase typically takes 1 to 3 weeks depending on the complexity of the role and the market conditions. We update you regularly on what we're seeing, including if the profile you described doesn't match what's available at your compensation level.",
          duration: "1 to 3 weeks",
          deliverable: "Ongoing market feedback + candidate pipeline",
        },
        {
          n: "04", phase: "Screening & Evaluation",
          h: "We evaluate before you spend time interviewing.",
          p: "We conduct in-depth interviews with every candidate before presenting them to you. We evaluate their experience, their motivations, their cultural fit, and their realistic interest in your specific opportunity, not just in 'a new opportunity.'\n\nWe check for red flags: gaps they didn't mention, reasons for leaving that don't add up, compensation expectations that are out of range. We save you from spending an hour interviewing someone who was never going to accept your offer.\n\nWe also prepare candidates on your company, your culture, and the role, so that your interview time is spent evaluating fit, not explaining basics.",
          duration: "Ongoing during search",
          deliverable: "Pre-screened, pre-qualified candidates only",
        },
        {
          n: "05", phase: "Shortlist Presentation",
          h: "Two or three people. Not twenty.",
          p: "We present a shortlist of two to three candidates. Each submission includes a written profile summary, our assessment of strengths and fit, and an honest note on any risks or considerations you should factor into your evaluation.\n\nWe don't pad the shortlist. If we only have two candidates worth presenting, we present two. If we haven't found the right people yet, we tell you that instead of sending you candidates who don't fit just to look active.\n\nMost clients schedule their first interviews within a few days of receiving the shortlist.",
          duration: "Delivered when ready, not on an arbitrary deadline",
          deliverable: "Written candidate profiles + Proforce assessment",
        },
        {
          n: "06", phase: "Interview Coordination",
          h: "We manage the logistics. You focus on the conversation.",
          p: "We coordinate all interviews between your team and the candidates. We confirm availability, send details, handle reschedules, and follow up afterward with both sides.\n\nAfter each interview, we debrief with the candidate and share their feedback with you. We also gather your impressions and communicate them to the candidate, professionally and with appropriate discretion. This two-way communication keeps the process moving and prevents candidates from disengaging while you deliberate.",
          duration: "1 to 3 weeks depending on your process",
          deliverable: "Interview scheduling + post-interview debrief",
        },
        {
          n: "07", phase: "Offer & Negotiation",
          h: "We help you make an offer that lands.",
          p: "Before you make an offer, we talk. We tell you what the candidate's actual expectations are, not what they said in the first interview, but what they've told us through the process. We tell you if there's a competing offer on the table, if they have concerns about the role, and what would make them say yes without hesitation.\n\nWe help you structure the offer to maximize the chance of acceptance. That might mean adjusting the base, adding a sign-on, changing the start date, or simply framing it the right way.\n\nWe communicate the offer on your behalf or support you in making it directly, depending on your preference. We manage counteroffers and negotiate professionally on your behalf when needed.",
          duration: "1 to 5 business days",
          deliverable: "Offer strategy + negotiation support",
        },
        {
          n: "08", phase: "References & Background",
          h: "We verify before you onboard.",
          p: "We conduct professional reference checks on your final candidate before the offer is finalized or as a condition of acceptance. We speak with direct supervisors and colleagues, not just the references the candidate hand-picked.\n\nWe ask structured questions about performance, working style, strengths, and areas of development. We share a written reference summary with you.\n\nBackground checks (criminal, credential verification) can be arranged through our network of third-party providers if required.",
          duration: "3 to 5 business days",
          deliverable: "Written reference summary",
        },
        {
          n: "09", phase: "Placement & Guarantee",
          h: "We don't disappear when the offer is signed.",
          p: "We stay in touch after the placement. We check in with both you and the candidate during their first 90 days, not to be intrusive, but to catch any friction early before it becomes a problem.\n\nEvery permanent placement is covered by a replacement guarantee. If the candidate leaves or is terminated for performance reasons within the guarantee period, we restart the search at no additional charge.\n\nThe guarantee period is defined in your mandate agreement. We stand behind every placement we make.",
          duration: "Ongoing post-placement",
          deliverable: "90-day check-in + replacement guarantee",
        },
      ],
      timelineH: "Typical timelines.",
      timelines: [
        { role: lang === "en" ? "Production Supervisor / QA Coordinator" : "Superviseur de production / Coordinateur QA", time: "2 to 4 weeks" },
        { role: lang === "en" ? "Plant Manager / QA Director" : "Directeur d'usine / Directeur qualité", time: "4 to 8 weeks" },
        { role: lang === "en" ? "VP Operations / C-Suite" : "VP Opérations / C-niveau", time: "8 to 14 weeks" },
        { role: lang === "en" ? "Fashion Buyer / Brand Manager" : "Acheteur mode / Gestionnaire de marque", time: "3 to 6 weeks" },
        { role: lang === "en" ? "Greenfield / Multi-role mandate" : "Greenfield / Mandat multi-rôles", time: "Ongoing partnership" },
      ],
      commitH: "What we commit to.",
      commit1h: "Honesty", commit1p: "If we can't fill the role, we tell you early. If your compensation is out of market, we tell you before we start. No false promises.",
      commit2h: "Speed", commit2p: "We move fast. We don't wait for the perfect moment to reach out to a candidate. When we find someone strong, we call them that day.",
      commit3h: "Communication", commit3p: "You'll hear from us regularly. Not just when we have something to show you, when we have news, feedback, or a market observation worth sharing.",
      ctaH: "Ready to get started?",
      ctaP: "One call is usually enough to know if we're the right fit for your mandate.",
      cta: "Contact Us",
      cta2: "Book a Call",
    },
    fr: {
      eyebrow: "Comment on travaille, Pour les employeurs",
      h1: "Pas de surprises.",
      h1i: "Pas de boîte noire.",
      sub: "Voilà exactement ce qui se passe du moment où tu nous appelles jusqu'au jour où ta nouvelle embauche commence. Chaque étape, chaque attente, chaque engagement de notre côté.",
      phaseLabel: "Le processus complet",
      phases: [
        {
          n: "01", phase: "Découverte",
          h: "On apprend ton business, pas juste la description de poste.",
          p: "La première conversation ne porte pas sur les CV. Elle porte sur ta compagnie, ton équipe, ta culture, et la vraie raison pour laquelle ce rôle existe. On veut comprendre ce qui a fait réussir les gens dans ce poste avant, ce qui les a fait échouer, et quel type de personne convient vraiment à ton environnement.\n\nCet appel prend généralement 30 à 60 minutes. On va te poser des questions que la plupart des recruteurs ne posent pas, sur le style de gestion, la dynamique d'équipe, la trajectoire de croissance et ce sur quoi tu n'es pas prêt à faire de compromis. Plus tu nous en dis, mieux on place.\n\nÀ la fin de cet appel, on te dit honnêtement si on pense pouvoir aider, à quoi ressemble notre calendrier et ce dont on aura besoin de toi pour bouger rapidement.",
          duration: "30 à 60 minutes",
          deliverable: "Évaluation honnête du mandat + calendrier",
        },
        {
          n: "02", phase: "Définition du mandat",
          h: "On s'entend sur ce qu'on cherche, et ce qu'on cherche pas.",
          p: "Avant de commencer la recherche, on s'aligne sur le profil. Pas juste le titre et les années d'expérience, la vraie personne. À quoi ressemble le succès à 6 mois? À 12? Quelles certifications sont vraiment requises versus souhaitables? Quelle est la vraie fourchette salariale, pas celle affichée, celle que tu offrirais vraiment à un candidat fort?\n\nOn s'entend aussi sur les termes d'exclusivité ou de contingence, la période de garantie et la structure des honoraires. Tout est clair avant qu'on commence. Pas de surprises à la facturation.\n\nSi la fourchette salariale n'est pas compétitive pour le profil que tu cherches, on te le dit maintenant, pas après trois semaines de recherche.",
          duration: "1 à 2 jours ouvrables",
          deliverable: "Entente de mandat signée + brief de profil candidat",
        },
        {
          n: "03", phase: "Recherche réseau",
          h: "On va dans notre réseau. Pas sur un babillard d'emploi.",
          p: "On n'affiche pas ton rôle publiquement. On identifie les candidats qui correspondent à ton profil et on les appelle directement. Ce sont des gens qu'on connaît déjà, des gens qu'on a placés avant, des gens qui nous ont référé des candidats, des gens avec qui on a parlé au fil des années et avec qui on est restés en contact.\n\nCette phase prend généralement 1 à 3 semaines selon la complexité du rôle et les conditions du marché. On te tient au courant régulièrement de ce qu'on voit, incluant si le profil que tu as décrit ne correspond pas à ce qui est disponible à ton niveau de rémunération.",
          duration: "1 à 3 semaines",
          deliverable: "Rétroaction de marché continue + pipeline de candidats",
        },
        {
          n: "04", phase: "Évaluation",
          h: "On évalue avant que tu passes du temps en entrevue.",
          p: "On mène des entrevues approfondies avec chaque candidat avant de te les présenter. On évalue leur expérience, leurs motivations, leur adéquation culturelle et leur intérêt réel pour ton opportunité spécifique, pas juste pour 'une nouvelle opportunité.'\n\nOn vérifie les signaux d'alarme : les lacunes qu'ils n'ont pas mentionnées, les raisons de départ qui ne tiennent pas la route, les attentes salariales hors fourchette. On t'évite de passer une heure à interviewer quelqu'un qui n'aurait jamais accepté ton offre.\n\nOn prépare aussi les candidats sur ta compagnie, ta culture et le rôle, pour que ton temps d'entrevue soit consacré à évaluer l'adéquation, pas à expliquer les bases.",
          duration: "En continu pendant la recherche",
          deliverable: "Candidats pré-filtrés et pré-qualifiés seulement",
        },
        {
          n: "05", phase: "Présentation de la courte liste",
          h: "Deux ou trois personnes. Pas vingt.",
          p: "On présente une courte liste de deux à trois candidats. Chaque soumission inclut un résumé écrit du profil, notre évaluation des forces et de l'adéquation, et une note honnête sur les risques ou considérations à factoriser dans ton évaluation.\n\nOn ne gonfle pas la courte liste. Si on a seulement deux candidats valables à présenter, on en présente deux. Si on n'a pas encore trouvé les bonnes personnes, on te le dit plutôt que d'envoyer des candidats qui ne conviennent pas juste pour paraître actifs.\n\nLa plupart des clients planifient leurs premières entrevues dans les quelques jours suivant la réception de la courte liste.",
          duration: "Livré quand c'est prêt, pas sur une échéance arbitraire",
          deliverable: "Profils écrits des candidats + évaluation Proforce",
        },
        {
          n: "06", phase: "Coordination des entrevues",
          h: "On gère la logistique. Toi tu te concentres sur la conversation.",
          p: "On coordonne toutes les entrevues entre ton équipe et les candidats. On confirme les disponibilités, envoie les détails, gère les reports et fait le suivi après.\n\nAprès chaque entrevue, on débriefe avec le candidat et partageons leurs commentaires avec toi. On recueille aussi tes impressions et les communiquons au candidat, professionnellement et avec la discrétion appropriée. Cette communication bidirectionnelle fait avancer le processus et empêche les candidats de se désengager pendant que tu délibères.",
          duration: "1 à 3 semaines selon ton processus",
          deliverable: "Planification des entrevues + débrief post-entrevue",
        },
        {
          n: "07", phase: "Offre et négociation",
          h: "On t'aide à faire une offre qui atterrit.",
          p: "Avant que tu fasses une offre, on parle. On te dit quelles sont vraiment les attentes du candidat, pas ce qu'il a dit à la première entrevue, mais ce qu'il nous a dit tout au long du processus. On te dit s'il y a une offre concurrente sur la table, s'il a des préoccupations sur le rôle, et ce qui lui ferait dire oui sans hésitation.\n\nOn t'aide à structurer l'offre pour maximiser les chances d'acceptation. Ça peut vouloir dire ajuster la base, ajouter un boni à la signature, changer la date de début, ou simplement la formuler de la bonne façon.\n\nOn communique l'offre en ton nom ou on te supporte dans la faire directement, selon ta préférence.",
          duration: "1 à 5 jours ouvrables",
          deliverable: "Stratégie d'offre + soutien à la négociation",
        },
        {
          n: "08", phase: "Références et vérification",
          h: "On vérifie avant l'intégration.",
          p: "On mène des vérifications de références professionnelles sur ton candidat final avant que l'offre soit finalisée. On parle avec des superviseurs directs et des collègues, pas juste les références que le candidat a choisies.\n\nOn pose des questions structurées sur la performance, le style de travail, les forces et les axes de développement. On te partage un résumé écrit des références.",
          duration: "3 à 5 jours ouvrables",
          deliverable: "Résumé écrit des références",
        },
        {
          n: "09", phase: "Placement et garantie",
          h: "On ne disparaît pas quand l'offre est signée.",
          p: "On reste en contact après le placement. On fait un suivi avec toi et le candidat pendant leurs 90 premiers jours, pas pour être intrusif, mais pour détecter les frictions tôt avant qu'elles deviennent un problème.\n\nChaque placement permanent est couvert par une garantie de remplacement. Si le candidat part ou est congédié pour des raisons de performance dans la période de garantie, on relance la recherche sans frais supplémentaires.\n\nOn se tient derrière chaque placement qu'on fait.",
          duration: "En continu post-placement",
          deliverable: "Suivi 90 jours + garantie de remplacement",
        },
      ],
      timelineH: "Délais typiques.",
      timelines: [
        { role: "Superviseur de production / Coordinateur QA", time: "2 à 4 semaines" },
        { role: "Directeur d'usine / Directeur qualité", time: "4 à 8 semaines" },
        { role: "VP Opérations / C-niveau", time: "8 à 14 semaines" },
        { role: "Acheteur mode / Gestionnaire de marque", time: "3 à 6 semaines" },
        { role: "Greenfield / Mandat multi-rôles", time: "Partenariat continu" },
      ],
      commitH: "Ce à quoi on s'engage.",
      commit1h: "Honnêteté", commit1p: "Si on peut pas combler le rôle, on te le dit tôt. Si ta rémunération est hors marché, on te le dit avant de commencer. Pas de fausses promesses.",
      commit2h: "Vitesse", commit2p: "On bouge vite. On n'attend pas le moment parfait pour contacter un candidat. Quand on trouve quelqu'un de fort, on l'appelle ce jour-là.",
      commit3h: "Communication", commit3p: "T'as des nouvelles de nous régulièrement. Pas juste quand on a quelque chose à te montrer, quand on a des nouvelles, des commentaires ou une observation de marché qui vaut la peine d'être partagée.",
      ctaH: "Prêt à commencer?",
      ctaP: "Un appel suffit généralement pour savoir si on est le bon fit pour ton mandat.",
      cta: "Nous contacter",
      cta2: "Réserver un appel",
    },
  }[lang];

  const [openPhase, setOpenPhase] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section style={{ background:C.ink, minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ position:"absolute", right:"-1rem", bottom:"-1rem", fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(8rem,20vw,18rem)", fontWeight:700, color:"rgba(232,93,26,0.05)", lineHeight:1, userSelect:"none", letterSpacing:"-0.05em" }}>09</div>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.8, maxWidth:"580px" }}>{t.sub}</p>
        </div>
      </section>

      {/* Process steps, accordion */}
      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto" }}>
          <Eyebrow>{t.phaseLabel}</Eyebrow>
          <Divider style={{ marginBottom:"0" }} />

          {t.phases.map((phase, i) => (
            <div key={phase.n} style={{ borderBottom:`1px solid ${C.rule}` }}>
              <button onClick={() => setOpenPhase(openPhase === i ? null : i)} style={{
                width:"100%", display:"grid", gridTemplateColumns:"56px 1fr auto",
                gap:"1.5rem", alignItems:"center", padding:"2rem 0", textAlign:"left",
              }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.8rem", fontWeight:700, color: openPhase===i ? C.orange : C.rule, letterSpacing:"-0.03em", lineHeight:1, transition:"color 0.2s" }}>{phase.n}</div>
                <div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginBottom:"0.4rem" }}>{phase.phase}</div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1rem,2vw,1.2rem)", color:C.ink, letterSpacing:"-0.01em" }}>{phase.h}</div>
                </div>
                <span style={{ color:C.orange, fontSize:"1.3rem", fontWeight:300, transition:"transform 0.2s", transform: openPhase===i?"rotate(45deg)":"rotate(0deg)", flexShrink:0 }}>+</span>
              </button>

              {openPhase === i && (
                <div style={{ paddingBottom:"2.5rem", paddingLeft:"calc(56px + 1.5rem)" }}>
                  {phase.p.split("\n\n").map((para, j) => (
                    <p key={j} style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300, marginBottom:"1.25rem" }}>{para}</p>
                  ))}
                  <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap", marginTop:"1.5rem", paddingTop:"1.25rem", borderTop:`1px solid ${C.rule}` }}>
                    <div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.orange, marginBottom:"0.3rem" }}>{lang==="en"?"Typical duration":"Durée typique"}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:C.ink }}>{phase.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.orange, marginBottom:"0.3rem" }}>{lang==="en"?"What you get":"Ce que tu reçois"}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:C.ink }}>{phase.deliverable}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Timelines */}
      <section style={{ background:C.paperDark, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Timelines":"Délais"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,2.8rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.timelineH}</h2>
          <Divider style={{ marginBottom:"0" }} />
          {t.timelines.map((tl, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 0", borderBottom:`1px solid ${C.rule}`, flexWrap:"wrap", gap:"0.5rem" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.92rem", color:C.ink }}>{tl.role}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.06em", color:C.orange, flexShrink:0 }}>{tl.time}</span>
            </div>
          ))}
          <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.88rem", color:C.muted, fontStyle:"italic", marginTop:"1.5rem", lineHeight:1.7 }}>
            {lang==="en"
              ? "These are typical ranges based on current market conditions. Timelines vary based on role complexity, candidate availability, and interview speed on the client side."
              : "Ce sont des fourchettes typiques basées sur les conditions actuelles du marché. Les délais varient selon la complexité du rôle, la disponibilité des candidats et la vitesse des entrevues du côté client."}
          </p>
        </div>
      </section>

      {/* Commitments */}
      <section style={{ background:C.ink, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Our Commitments":"Nos engagements"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,2.8rem)", letterSpacing:"-0.03em", color:"#fff", marginBottom:"3rem" }}>{t.commitH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"2px", background:"rgba(255,255,255,0.05)" }}>
            {[[t.commit1h,t.commit1p,"01"],[t.commit2h,t.commit2p,"02"],[t.commit3h,t.commit3p,"03"]].map(([h,p,n]) => (
              <div key={n} style={{ background:C.inkLight, padding:"2.5rem 2rem" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"2rem", fontWeight:700, color:C.orange, letterSpacing:"-0.03em", lineHeight:1, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.05rem", color:"#fff", letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.orange, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2.5rem" }}>
          <div>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", color:"#fff", letterSpacing:"-0.03em", lineHeight:1, marginBottom:"0.75rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", lineHeight:1.7 }}>{t.ctaP}</p>
          </div>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"13px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", transition:"opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >{t.cta}</button>
            <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer" style={{ background:"transparent", border:"2px solid rgba(255,255,255,0.5)", color:"#fff", padding:"11px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", transition:"border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.5)"}
            >{t.cta2}</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PRESS PAGE ───────────────────────────────────────────────────────────────
const PRESS = [
  {
    id: "growthstory-ep40",
    type: { en:"Podcast", fr:"Balado" },
    outlet: "GrowthStory Podcast",
    date: "Décembre 2018",
    title: {
      en:"Episode 40, A New President for Proforce Personnel",
      fr:"Épisode 40, Un nouveau président pour Proforce Personnel",
    },
    desc: {
      en:"Simon sits down with GrowthStory host David Inzlicht to talk about his journey at Proforce, from not getting a callback on his first application, to founding the food division, opening new territories, and becoming President and shareholder in 2018.",
      fr:"Simon s'entretient avec l'animateur de GrowthStory David Inzlicht pour parler de son parcours chez Proforce, de ne pas avoir eu de rappel à sa première candidature, à la fondation de la division alimentaire, à l'ouverture de nouveaux territoires, et à devenir Président et actionnaire en 2018.",
    },
    url: "https://www.growthstory.ca/episode-40-simon-st-amand-proforce-new-president-recruiter/",
    featured: true,
  },
];

function PressPage({ lang, setPage }) {
  const t = {
    en:{
      eyebrow:"Press & Media",
      h1:"Proforce in the media.",
      h1i:"And on the record.",
      sub:"Interviews, podcast appearances, and mentions of Proforce Personnel and Simon St-Amand in the press.",
      featuredLabel:"Featured",
      listen:"Listen →", read:"Read →", watch:"Watch →",
      pitchH:"Media inquiries.",
      pitchP:"Journalist or podcast host looking to speak with Simon about food industry recruitment, talent shortages in manufacturing, or building a specialist firm? We're happy to talk.",
      cta:"Get in Touch",
      emptyH:"More to come.",
      emptyP:"We're in the process of compiling past media appearances. Check back soon.",
    },
    fr:{
      eyebrow:"Presse & Médias",
      h1:"Proforce dans les médias.",
      h1i:"Et pour la postérité.",
      sub:"Entrevues, apparitions en balado et mentions de Proforce Personnel et Simon St-Amand dans la presse.",
      featuredLabel:"À la une",
      listen:"Écouter →", read:"Lire →", watch:"Regarder →",
      pitchH:"Demandes médias.",
      pitchP:"Journaliste ou animateur de balado qui veut parler à Simon du recrutement dans l'industrie alimentaire, de la pénurie de main-d'oeuvre en fabrication, ou de comment bâtir une firme spécialisée? On est disponibles.",
      cta:"Nous contacter",
      emptyH:"D'autres à venir.",
      emptyP:"On est en train de compiler les apparitions médias passées. Revenez bientôt.",
    },
  }[lang];

  const ctaLabel = (type) => {
    if (type === "Podcast" || type === "Balado") return t.listen;
    if (type === "Article") return t.read;
    if (type === "Interview" || type === "Entrevue") return t.watch;
    return t.read;
  };

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ maxWidth:"900px" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,6.5rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4rem)", color:C.orange, lineHeight:0.95, marginBottom:"2rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"1rem", lineHeight:1.75, maxWidth:"520px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />

          {PRESS.map((item, i) => (
            <div key={item.id} style={{ padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", flexWrap:"wrap", gap:"0.75rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted }}>{item.outlet}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:C.muted }}>·</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:C.muted }}>{item.date}</span>
                  {item.featured && (
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, border:`1px solid ${C.orange}20`, background:C.orange+"10", padding:"2px 8px" }}>{t.featuredLabel}</span>
                  )}
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange + "80" }}>{item.type[lang]}</span>
              </div>

              <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.15rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.75rem" }}>{item.title[lang]}</h3>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.8, fontWeight:300, marginBottom:"1.25rem", maxWidth:"680px" }}>{item.desc[lang]}</p>

              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase",
                  color:C.orange, borderBottom:`1px solid ${C.orange}30`, paddingBottom:"2px", transition:"border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=C.orange}
                  onMouseLeave={e => e.currentTarget.style.borderColor=C.orange+"30"}
                >{ctaLabel(item.type[lang])}</a>
              )}
            </div>
          ))}

          {/* Placeholder pour futures mentions */}
          <div style={{ padding:"3rem", background:C.paperDark, marginTop:"2rem", borderLeft:`3px solid rgba(200,200,200,0.3)` }}>
            <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1rem", color:C.muted, marginBottom:"0.5rem" }}>{t.emptyH}</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:C.muted, lineHeight:1.7 }}>{t.emptyP}</p>
          </div>
        </div>
      </section>

      {/* Pitch section */}
      <section style={{ background:C.ink, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div style={{ width:"36px", height:"3px", background:C.orange, marginBottom:"1.5rem" }} />
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", letterSpacing:"-0.03em", color:"#fff", marginBottom:"1rem" }}>{t.pitchH}</h2>
          <p style={{ fontFamily:"'Spectral',serif", fontSize:"1rem", color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:"2rem", maxWidth:"520px", fontWeight:300 }}>{t.pitchP}</p>
          <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>
    </div>
  );
}

// ─── REFERRAL PAGE ────────────────────────────────────────────────────────────
function ReferralPage({ lang, setPage }) {
  const [form, setForm] = useState({ yourName:"", yourEmail:"", yourCompany:"", refName:"", refCompany:"", refEmail:"", refPhone:"", context:"" });
  const [sent, setSent] = useState(false);

  const t = {
    en: {
      eyebrow: "Referral Program",
      h1: "Know someone who needs a great recruiter?",
      h1i: "We'll take care of them.",
      sub: "If you refer a company that becomes a Proforce client, we credit $1,000 on your next mandate. No forms to track, no complicated process. You refer, we place, you get credited.",
      howH: "How it works.",
      s1h: "You refer", s1p: "Tell us about a company in your network, a food manufacturer, CPG brand, or fashion company, that could use a specialist recruiter. A quick email or a call is all it takes.",
      s2h: "We reach out", s2p: "We contact them, introduce Proforce, and handle everything from there. We're discreet and professional. We'll never make you look bad.",
      s3h: "They become a client", s3p: "If the referred company signs a mandate with Proforce within 12 months of your referral, the credit is applied.",
      s4h: "You get $1,000", s4p: "A $1,000 credit is applied to your next Proforce mandate. No minimum value required. It applies to any new search.",
      termH: "The details.",
      terms: [
        "The $1,000 credit applies to any new mandate signed within 12 months of the referral.",
        "The referred company must be a new Proforce client, not an existing active client.",
        "The credit is applied at invoice on your next mandate after the referred placement is completed.",
        "There is no limit to the number of referrals you can make.",
        "The referral must be submitted through this form or directly to your Proforce contact before we reach out to the referred company.",
        "Proforce reserves the right to decline mandates that are not a fit for our practice areas.",
      ],
      formH: "Submit a referral.",
      formSub: "Fill in what you know. We'll take it from there.",
      yourName: "Your name", yourEmail: "Your email", yourCompany: "Your company",
      refName: "Referred contact name", refCompany: "Their company", refEmail: "Their email (if known)", refPhone: "Their phone (if known)",
      context: "What's the context? (optional, e.g. they're looking for a QA Director, or they just opened a new plant)",
      send: "Submit Referral",
      sent: "Referral received. We'll follow up with you directly to confirm we've made contact.",
      whyH: "Why refer to Proforce?",
      why1h: "You look good", why1p: "Referring a specialist recruiter who actually delivers reflects well on you. It's a value-add to your network, not a sales pitch.",
      why2h: "We're discreet", why2p: "We never drop your name without permission. The referred company will know you thought of them, but we handle the introduction on your terms.",
      why3h: "Real money", why3p: "$1,000 off a mandate is real value. Most of our mandates run between $18,000 and $35,000. That's a meaningful credit.",
    },
    fr: {
      eyebrow: "Programme de référencement",
      h1: "Tu connais quelqu'un qui a besoin d'un bon recruteur?",
      h1i: "On s'en occupe.",
      sub: "Si tu nous réfères une compagnie qui devient cliente de Proforce, on te crédite 1 000$ sur ton prochain mandat. Pas de formulaires compliqués à suivre. Tu réfères, on place, tu obtiens le crédit.",
      howH: "Comment ça fonctionne.",
      s1h: "Tu réfères", s1p: "Dis-nous à propos d'une compagnie dans ton réseau, un fabricant alimentaire, une marque CPG ou une compagnie mode, qui pourrait avoir besoin d'un recruteur spécialisé. Un courriel rapide ou un appel, c'est tout ce qu'il faut.",
      s2h: "On les contacte", s2p: "On les contacte, on présente Proforce et on gère tout à partir de là. On est discrets et professionnels. On ne te fera jamais mal paraître.",
      s3h: "Ils deviennent clients", s3p: "Si la compagnie référée signe un mandat avec Proforce dans les 12 mois suivant ta référence, le crédit est appliqué.",
      s4h: "Tu reçois 1 000$", s4p: "Un crédit de 1 000$ est appliqué sur ton prochain mandat Proforce. Aucune valeur minimale requise. Ça s'applique à toute nouvelle recherche.",
      termH: "Les détails.",
      terms: [
        "Le crédit de 1 000$ s'applique à tout nouveau mandat signé dans les 12 mois suivant la référence.",
        "La compagnie référée doit être un nouveau client Proforce, pas un client actif existant.",
        "Le crédit est appliqué à la facturation de ton prochain mandat après la complétion du placement référé.",
        "Il n'y a pas de limite au nombre de références que tu peux soumettre.",
        "La référence doit être soumise via ce formulaire ou directement à ton contact Proforce avant qu'on contacte la compagnie référée.",
        "Proforce se réserve le droit de refuser des mandats qui ne correspondent pas à nos domaines de pratique.",
      ],
      formH: "Soumettre une référence.",
      formSub: "Remplis ce que tu sais. On s'occupe du reste.",
      yourName: "Ton nom", yourEmail: "Ton courriel", yourCompany: "Ta compagnie",
      refName: "Nom du contact référé", refCompany: "Leur compagnie", refEmail: "Leur courriel (si connu)", refPhone: "Leur téléphone (si connu)",
      context: "Quel est le contexte? (optionnel, ex: ils cherchent un directeur qualité, ou ils viennent d'ouvrir une nouvelle usine)",
      send: "Soumettre la référence",
      sent: "Référence reçue. On va faire un suivi avec toi directement pour confirmer qu'on a pris contact.",
      whyH: "Pourquoi référer à Proforce?",
      why1h: "Tu as l'air bon", why1p: "Référer un recruteur spécialisé qui livre vraiment te reflète bien. C'est une valeur ajoutée à ton réseau, pas un pitch de vente.",
      why2h: "On est discrets", why2p: "On ne mentionne jamais ton nom sans permission. La compagnie référée saura que tu as pensé à eux, mais on gère l'introduction selon tes conditions.",
      why3h: "De l'argent réel", why3p: "1 000$ de rabais sur un mandat, c'est une vraie valeur. La plupart de nos mandats se situent entre 18 000$ et 35 000$. C'est un crédit significatif.",
    },
  }[lang];

  const inp = { width:"100%", padding:"10px 0", background:"transparent", border:"none", borderBottom:`1px solid ${C.rule}`, color:C.ink, fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", outline:"none", transition:"border-color 0.2s" };

  return (
    <div>
      {/* Hero */}
      <section style={{ background:C.ink, minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:"2rem", bottom:"2rem", fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(6rem,18vw,16rem)", fontWeight:700, color:"rgba(232,93,26,0.06)", lineHeight:1, userSelect:"none", letterSpacing:"-0.05em" }}>1K$</div>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,7vw,6rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4rem)", color:C.orange, lineHeight:0.95, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.8, maxWidth:"560px" }}>{t.sub}</p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"The process":"Le processus"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.howH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"2px", background:C.rule }}>
            {[
              [t.s1h, t.s1p, "01"],
              [t.s2h, t.s2p, "02"],
              [t.s3h, t.s3p, "03"],
              [t.s4h, t.s4p, "04"],
            ].map(([h, p, n]) => (
              <div key={n} style={{ background:C.white, padding:"2.5rem 2rem" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"2.5rem", fontWeight:700, color:C.orange, letterSpacing:"-0.03em", lineHeight:1, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.05rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why refer */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.whyH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"3rem" }}>
            {[[t.why1h,t.why1p,"01"],[t.why2h,t.why2p,"02"],[t.why3h,t.why3p,"03"]].map(([h,p,n]) => (
              <div key={n}>
                <div style={{ width:"36px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral form */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Submit a referral":"Soumettre une référence"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,2.8rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"0.5rem" }}>{t.formH}</h2>
          <p style={{ color:C.muted, fontSize:"0.9rem", marginBottom:"3rem" }}>{t.formSub}</p>

          {sent ? (
            <div style={{ padding:"3rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
              <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"1.1rem", color:C.ink, fontStyle:"italic" }}>{t.sent}</p>
            </div>
          ) : (
            <div>
              {/* Your info */}
              <div style={{ marginBottom:"3rem" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.orange, marginBottom:"1.5rem" }}>
                  {lang==="en"?"Your information":"Tes informations"}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem 2rem" }} className="two-col">
                  {[["yourName",t.yourName,"text"],["yourEmail",t.yourEmail,"email"],["yourCompany",t.yourCompany,"text"]].map(([k,pl,type]) => (
                    <input key={k} type={type} placeholder={pl} value={form[k]}
                      onChange={e => setForm({...form,[k]:e.target.value})}
                      style={inp}
                      onFocus={e => e.target.style.borderColor=C.orange}
                      onBlur={e => e.target.style.borderColor=C.rule}
                    />
                  ))}
                </div>
              </div>

              {/* Their info */}
              <div style={{ marginBottom:"2rem" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.orange, marginBottom:"1.5rem" }}>
                  {lang==="en"?"Who you're referring":"Qui tu réfères"}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem 2rem", marginBottom:"1.5rem" }} className="two-col">
                  {[["refName",t.refName,"text"],["refCompany",t.refCompany,"text"],["refEmail",t.refEmail,"email"],["refPhone",t.refPhone,"tel"]].map(([k,pl,type]) => (
                    <input key={k} type={type} placeholder={pl} value={form[k]}
                      onChange={e => setForm({...form,[k]:e.target.value})}
                      style={inp}
                      onFocus={e => e.target.style.borderColor=C.orange}
                      onBlur={e => e.target.style.borderColor=C.rule}
                    />
                  ))}
                </div>
                <textarea placeholder={t.context} rows={4} value={form.context}
                  onChange={e => setForm({...form,context:e.target.value})}
                  style={{...inp, resize:"vertical", width:"100%"}}
                  onFocus={e => e.target.style.borderColor=C.orange}
                  onBlur={e => e.target.style.borderColor=C.rule}
                />
              </div>

              <button className="btn-orange" onClick={() => { setSent(true); track.formSubmit(); }}>{t.send}</button>
            </div>
          )}
        </div>
      </section>

      {/* Terms */}
      <section style={{ background:C.paperDark, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"780px", margin:"0 auto" }}>
          <Eyebrow>{t.termH}</Eyebrow>
          <Divider style={{ marginBottom:"0" }} />
          {t.terms.map((term, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"1rem", padding:"1rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <span style={{ color:C.orange, fontSize:"0.7rem", marginTop:"3px", flexShrink:0 }}>▸</span>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.muted, lineHeight:1.7 }}>{term}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── FOOTER NEWSLETTER (version légère pour fond navy) ───────────────────────
function FooterNewsletter({ lang }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const t = {
    en: { placeholder:"your@email.com", cta:"Subscribe", sending:"...", done:"You're in.", error:"Try again." },
    fr: { placeholder:"ton@courriel.com", cta:"S'abonner", sending:"...", done:"C'est fait.", error:"Réessaie." },
  }[lang];

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          service_id:"YOUR_SERVICE_ID", template_id:"YOUR_NEWSLETTER_TEMPLATE_ID", user_id:"YOUR_PUBLIC_KEY",
          template_params:{ subscriber_email:email, preferred_lang:lang==="fr"?"Français":"English", source:"proforce.ca footer" },
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  if (status === "done") return <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", color:C.orange }}>{t.done}</p>;

  return (
    <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"flex-end" }}>
      <input type="email" placeholder={t.placeholder} value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key==="Enter" && handleSubmit()}
        style={{ flex:"1 1 180px", padding:"9px 0", background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", outline:"none" }}
      />
      <button onClick={handleSubmit} disabled={status==="sending"} style={{
        background:C.orange, color:"#fff", padding:"9px 20px",
        fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.75rem",
        letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", flexShrink:0,
        opacity: status==="sending" ? 0.6 : 1,
      }}>{status==="sending" ? t.sending : t.cta}</button>
      {status==="error" && <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:"#e74c3c", width:"100%" }}>{t.error}</p>}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ lang, setPage }) {
  const links = lang==="en"
    ? [["food","Food"],["fashion","Fashion"],["employers","Employers"],["howwework","How We Work"],["calculator","ROI Calculator"],["startup","Startups"],["about","About"],["team","Team"],["simon","Simon St-Amand"],["press","Press"],["candidates","Candidates"],["featured","Talent"],["referral","Refer a Client"],["giving","Giving Back"],["jobs","Jobs"],["blog","Blog"],["glossary","Glossary"],["montreal","Montreal"],["quebec","Quebec City"],["toronto","Toronto"],["contact","Contact"]]
    : [["food","Alimentaire"],["fashion","Mode"],["employers","Employeurs"],["howwework","Comment on travaille"],["calculator","Calculateur ROI"],["startup","Startups"],["about","À propos"],["team","Équipe"],["simon","Simon St-Amand"],["press","Presse"],["candidates","Candidats"],["featured","Talents"],["referral","Référer un client"],["giving","Donner en retour"],["jobs","Emplois"],["blog","Blogue"],["glossary","Glossaire"],["montreal","Montréal"],["quebec","Québec"],["toronto","Toronto"],["contact","Contact"]];

  return (
    <footer style={{ background:C.ink, padding:"4rem 2rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ marginBottom:"3rem", borderLeft:`3px solid ${C.orange}`, padding:"1.5rem 2rem", background:"rgba(255,255,255,0.04)" }}>
          <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1rem" }} />
          <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"0.95rem", color:"#fff", marginBottom:"1rem" }}>
            {lang==="en"?"Get new articles in your inbox.":"Reçois les nouveaux articles par courriel."}
          </h3>
          <FooterNewsletter lang={lang} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"3rem", marginBottom:"3rem" }}>
          <div>
            <button onClick={() => setPage("home")} style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"1.3rem", color:C.paper, letterSpacing:"-0.01em", display:"flex", alignItems:"center", gap:"3px", marginBottom:"1rem" }}>
              PROFORCE<span style={{ color:C.orange }}>.</span>
            </button>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:"rgba(244,241,235,0.4)", lineHeight:1.7, maxWidth:"220px" }}>
              {lang==="en"?"Specialist recruitment. Food, CPG & Fashion. Montreal, Quebec City & Toronto. Since 2001.":"Recrutement spécialisé. Alimentaire, CPG & Mode. Montréal, Québec & Toronto. Depuis 2001."}
            </p>
          </div>

          <div style={{ display:"flex", gap:"4rem", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.orange, marginBottom:"1rem" }}>Pages</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                {links.map(([k,l]) => (
                  <PageLink key={k} to={k} setPage={setPage} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:"rgba(244,241,235,0.45)", textAlign:"left", transition:"color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color=C.paper}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(244,241,235,0.45)"}
                  >{l}</PageLink>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.orange, marginBottom:"1rem" }}>Contact</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:"rgba(244,241,235,0.45)", lineHeight:2 }}>
                <a href="tel:+15149050606" style={{ color:"inherit", textDecoration:"none" }}>(514) 905-0606</a><br/>
                <a href="tel:+14184311441" style={{ color:"inherit", textDecoration:"none" }}>(418) 431-1441</a><br/>
                <a href="tel:+16474906626" style={{ color:"inherit", textDecoration:"none" }}>(647) 490-6626</a><br/>
                <a href="mailto:info@proforce.ca" style={{ color:"inherit", textDecoration:"none" }}>info@proforce.ca</a>
              </div>
              <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.25rem" }}>
                <a href="https://www.facebook.com/share/17YcPvUvNn/" target="_blank" rel="noopener noreferrer"
                  style={{ width:"32px", height:"32px", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.45)", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="rgba(255,255,255,0.45)"; }}
                  title="Facebook"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/proforcepersonnel" target="_blank" rel="noopener noreferrer"
                  style={{ width:"32px", height:"32px", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.45)", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="rgba(255,255,255,0.45)"; }}
                  title="Instagram"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/proforce-personnel" target="_blank" rel="noopener noreferrer"
                  style={{ width:"32px", height:"32px", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.45)", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="rgba(255,255,255,0.45)"; }}
                  title="LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem", alignItems:"center" }}>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Proforce Personnel Inc.</p>
          <button onClick={() => setPage("privacy")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.2)", transition:"color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}
          >{lang==="en"?"Privacy Policy":"Politique de confidentialité"}</button>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.2)" }}>proforce.ca</p>
        </div>
      </div>
    </footer>
  );
}

// ─── SEO META DATA ────────────────────────────────────────────────────────────
const META = {
  home: {
    en: { title:"Proforce Personnel | Specialist Recruitment in Food, CPG & Fashion", desc:"Proforce Personnel places food, CPG, and fashion professionals across Montreal, Quebec City, and Toronto. Specialist recruiters, network-first approach, placement guarantee. Since 2001." },
    fr: { title:"Proforce Personnel | Recrutement spécialisé en alimentaire, CPG et mode", desc:"Proforce Personnel place des professionnels de l'alimentaire, du CPG et de la mode à Montréal, Québec et Toronto. Recruteurs spécialisés, réseau d'abord, garantie de placement. Depuis 2001." },
  },
  food: {
    en: { title:"Food & CPG Recruitment Montreal, Toronto & Atlantic Canada | Proforce Personnel", desc:"Specialist recruiters for food manufacturing and CPG companies in Montreal, Toronto, and Atlantic Canada. Plant managers, quality directors, supply chain leaders. Since 2001." },
    fr: { title:"Recrutement alimentaire & CPG Montréal, Toronto et Atlantique | Proforce Personnel", desc:"Recruteurs spécialisés pour les compagnies alimentaires et CPG à Montréal, Toronto et dans les provinces atlantiques. Directeurs d'usine, directeurs qualité, responsables chaîne d'approvisionnement. Depuis 2001." },
  },
  fashion: {
    en: { title:"Fashion & Apparel Recruitment Montreal & Toronto | Proforce Personnel", desc:"20+ years recruiting exclusively in Canadian fashion and apparel in Montreal and Toronto. Buyers, brand managers, designers, merchandisers. Robin Anisef, specialist recruiter." },
    fr: { title:"Recrutement mode & habillement Montréal & Toronto | Proforce Personnel", desc:"Plus de 20 ans à recruter exclusivement dans la mode canadienne à Montréal et Toronto. Acheteurs, gestionnaires de marque, designers, marchandiseurs. Robin Anisef, recruteuse spécialisée." },
  },
  about: {
    en: { title:"About Proforce Personnel | Food, CPG & Fashion Recruitment Since 2001", desc:"Proforce Personnel was founded in 2001. Simon St-Amand joined in 2015 and has been President since 2018. Specialist recruitment in food, CPG, and fashion across Quebec, Ontario, and Atlantic Canada." },
    fr: { title:"À propos de Proforce Personnel | Recrutement alimentaire, CPG et mode depuis 2001", desc:"Proforce Personnel a été fondée en 2001. Simon St-Amand a rejoint la firme en 2015 et en est président depuis 2018. Recrutement spécialisé en alimentaire, CPG et mode au Québec, en Ontario et dans les provinces atlantiques." },
  },
  team: {
    en: { title:"Our Team | Proforce Personnel", desc:"Meet the Proforce team: Simon St-Amand, Robin Anisef, Stéphanie Lanoie, Rana Yamak, and Michaela Landers. Five specialist recruiters in food, CPG, and fashion." },
    fr: { title:"Notre équipe | Proforce Personnel", desc:"Rencontrez l'équipe Proforce : Simon St-Amand, Robin Anisef, Stéphanie Lanoie, Rana Yamak et Michaela Landers. Cinq recruteurs spécialisés en alimentaire, CPG et mode." },
  },
  candidates: {
    en: { title:"Food, CPG & Fashion Candidates | Proforce Personnel", desc:"Looking for your next opportunity in food manufacturing, CPG, or fashion in Montreal, Toronto, or Atlantic Canada? Proforce works with people, not just résumés." },
    fr: { title:"Candidats alimentaire, CPG et mode | Proforce Personnel", desc:"À la recherche de ta prochaine opportunité dans la fabrication alimentaire, le CPG ou la mode à Montréal, Toronto ou dans les provinces atlantiques? Proforce travaille avec des gens, pas juste des CV." },
  },
  jobs: {
    en: { title:"Job Listings | Proforce Personnel", desc:"Current job openings in food manufacturing, CPG, and fashion across Quebec and Ontario. Permanent placements placed by specialist recruiters." },
    fr: { title:"Offres d'emploi | Proforce Personnel", desc:"Postes ouverts actuellement en fabrication alimentaire, CPG et mode au Québec et en Ontario. Placements permanents par des recruteurs spécialisés." },
  },
  giving: {
    en: { title:"Giving Back | Proforce Personnel", desc:"Proforce Personnel proudly supports UNICEF, Starlight Foundation, Hôpital de Montréal pour Enfants, and Just for Kids Foundation." },
    fr: { title:"Donner en retour | Proforce Personnel", desc:"Proforce Personnel soutient fièrement l'UNICEF, la Fondation Starlight, l'Hôpital de Montréal pour Enfants et la Fondation Just for Kids." },
  },
  blog: {
    en: { title:"Blog | Proforce Personnel", desc:"Straight talk on food industry hiring, career advice, and market observations. 25 years of experience, no fluff." },
    fr: { title:"Blogue | Proforce Personnel", desc:"Du vrai parler sur l'embauche dans l'alimentaire, les conseils de carrière et les observations de marché. 25 ans d'expérience, pas de remplissage." },
  },
  glossary: {
    en: { title:"Food, CPG & Fashion Recruitment Glossary | Proforce Personnel", desc:"Definitions of key terms in food manufacturing, CPG, and fashion recruiting. SQF, HACCP, FSMA, GFSI, co-manufacturing, open-to-buy, contingency search, and more." },
    fr: { title:"Glossaire recrutement alimentaire, CPG et mode | Proforce Personnel", desc:"Définitions des termes clés en fabrication alimentaire, CPG et recrutement mode. SQF, HACCP, FSMA, GFSI, co-fabrication, open-to-buy, recrutement contingent et plus." },
  },
  montreal: {
    en: { title:"Food, CPG & Fashion Recruitment in Montreal | Proforce Personnel", desc:"Proforce Personnel places food, CPG, and fashion professionals in Montreal, Quebec. Specialist recruiters with 25 years of experience in the Montreal market." },
    fr: { title:"Recrutement alimentaire, CPG et mode à Montréal | Proforce Personnel", desc:"Proforce Personnel place des professionnels de l'alimentaire, du CPG et de la mode à Montréal, Québec. Recruteurs spécialisés avec 25 ans d'expérience dans le marché montréalais." },
  },
  quebec: {
    en: { title:"Food & CPG Recruitment in Quebec City | Proforce Personnel", desc:"Proforce Personnel places food, CPG, and fashion professionals in Quebec City, Chaudiere-Appalaches, and the Beauce. A local office, recruiters who know the region's plants." },
    fr: { title:"Recrutement alimentaire et CPG à Québec | Proforce Personnel", desc:"Proforce Personnel place des professionnels de l'alimentaire, du CPG et de la mode à Québec, en Chaudière-Appalaches et en Beauce. Un bureau sur place, des recruteurs qui connaissent les usines de la région." },
  },
  toronto: {
    en: { title:"Food & CPG Recruitment in Toronto & Ontario | Proforce Personnel", desc:"Proforce Personnel places food manufacturing and CPG professionals across Toronto, the GTA, and Ontario. Dedicated Ontario recruiters with deep industry knowledge." },
    fr: { title:"Recrutement alimentaire & CPG à Toronto et en Ontario | Proforce Personnel", desc:"Proforce Personnel place des professionnels de la fabrication alimentaire et du CPG à Toronto, dans le Grand Toronto et en Ontario. Recruteurs dédiés à l'Ontario avec une connaissance approfondie de l'industrie." },
  },
  calculator: {
    en: { title:"Recruitment ROI Calculator | Proforce Personnel", desc:"Calculate the real cost of a vacant role and the ROI of using a specialist recruiter. Vacancy cost, bad hire risk, Proforce fee, see your numbers." },
    fr: { title:"Calculateur de ROI en recrutement | Proforce Personnel", desc:"Calculez le vrai coût d'un poste vacant et le ROI d'utiliser un recruteur spécialisé. Coût de vacance, risque de mauvais candidat, honoraires Proforce, voyez vos chiffres." },
  },
  howwework: {
    en: { title:"How We Work | Proforce Personnel Recruitment Process", desc:"A complete breakdown of Proforce Personnel's 9-step recruitment process for employers. Discovery, search, screening, shortlist, offer, negotiation, references, and placement guarantee." },
    fr: { title:"Comment on travaille | Processus de recrutement Proforce Personnel", desc:"Un aperçu complet du processus de recrutement en 9 étapes de Proforce Personnel pour les employeurs. Découverte, recherche, évaluation, courte liste, offre, négociation, références et garantie de placement." },
  },
  press: {
    en: { title:"Press & Media | Proforce Personnel", desc:"Interviews, podcast appearances, and media mentions of Proforce Personnel and Simon St-Amand. Food industry recruitment, talent shortages, building a specialist firm." },
    fr: { title:"Presse & Médias | Proforce Personnel", desc:"Entrevues, apparitions en balado et mentions médias de Proforce Personnel et Simon St-Amand. Recrutement alimentaire, pénurie de main-d'oeuvre, bâtir une firme spécialisée." },
  },
  simon: {
    en: { title:"Simon St-Amand | President, Proforce Personnel", desc:"Simon St-Amand is the President of Proforce Personnel. He founded the firm's food division, opened Ontario and Maritime territories, and built the team. 25 years in food and CPG recruitment." },
    fr: { title:"Simon St-Amand | Président, Proforce Personnel", desc:"Simon St-Amand est le président de Proforce Personnel. Il a fondé la division alimentaire de la firme, ouvert l'Ontario et les Maritimes comme territoires, et bâti l'équipe. 25 ans en recrutement alimentaire et CPG." },
  },
  referral: {
    en: { title:"Referral Program | Proforce Personnel", desc:"Refer a company to Proforce Personnel and earn a $1,000 credit on your next mandate. Food, CPG, and fashion recruitment specialist." },
    fr: { title:"Programme de référencement | Proforce Personnel", desc:"Référez une compagnie à Proforce Personnel et obtenez un crédit de 1 000$ sur votre prochain mandat. Recrutement spécialisé alimentaire, CPG et mode." },
  },
  startup: {
    en: { title:"Food Startup & Greenfield Recruitment | Proforce Personnel", desc:"Proforce Personnel helps food startups, CPG scale-ups, and greenfield facilities build their leadership teams. Multi-role searches, role sequencing, no HR infrastructure required." },
    fr: { title:"Recrutement startups alimentaires & greenfield | Proforce Personnel", desc:"Proforce Personnel aide les startups alimentaires, les scale-ups CPG et les installations greenfield à bâtir leurs équipes de leadership. Recherches multi-rôles, séquençage des rôles, aucune infrastructure RH requise." },
  },
  featured: {
    en: { title:"Featured Candidates | Proforce Personnel", desc:"Browse our featured candidate profiles in food, CPG, and fashion. Anonymous profiles, real talent. Contact us to learn more about any candidate." },
    fr: { title:"Candidats vedettes | Proforce Personnel", desc:"Parcourez nos profils de candidats vedettes en alimentaire, CPG et mode. Profils anonymes, vrais talents. Contactez-nous pour en savoir plus sur n'importe quel candidat." },
  },
  employers: {
    en: { title:"For Employers | Proforce Personnel", desc:"Proforce Personnel helps food, CPG, and fashion companies find the candidates who weren't looking. Specialist recruiters, placement guarantee, Quebec and Ontario." },
    fr: { title:"Pour les employeurs | Proforce Personnel", desc:"Proforce Personnel aide les compagnies alimentaires, CPG et mode à trouver les candidats qui ne cherchaient pas. Recruteurs spécialisés, garantie de placement, Québec et Ontario." },
  },
  contact: {
    en: { title:"Contact | Proforce Personnel", desc:"Get in touch with Proforce Personnel. Montreal: (514) 905-0606. Quebec City: (418) 431-1441. Toronto: (647) 490-6626. info@proforce.ca" },
    fr: { title:"Contact | Proforce Personnel", desc:"Contactez Proforce Personnel. Montréal : (514) 905-0606. Québec : (418) 431-1441. Toronto : (647) 490-6626. info@proforce.ca" },
  },
  notfound: {
    en: { title:"Page not found | Proforce Personnel", desc:"That page has moved or does not exist. Head back to the home page or reach out to Proforce Personnel directly." },
    fr: { title:"Page introuvable | Proforce Personnel", desc:"Cette page a bougé ou n'existe pas. Retourne à l'accueil ou contacte Proforce Personnel directement." },
  },
  privacy: {
    en: { title:"Privacy Policy | Proforce Personnel", desc:"Proforce Personnel privacy policy. How we collect, use, and protect your personal information." },
    fr: { title:"Politique de confidentialité | Proforce Personnel", desc:"Politique de confidentialité de Proforce Personnel. Comment nous collectons, utilisons et protégeons vos informations personnelles." },
  },
};

// ─── TRACKING PIXELS ──────────────────────────────────────────────────────────
// Remplace ces deux valeurs par tes vrais IDs une fois le site en ligne
const LINKEDIN_PARTNER_ID = "YOUR_LINKEDIN_PARTNER_ID"; // Ex: "1234567"
const META_PIXEL_ID       = "YOUR_META_PIXEL_ID";        // Ex: "987654321012345"

// Initialise les deux pixels une seule fois au chargement
function usePixelInit() {
  useEffect(() => {
    // Tant que les vrais identifiants ne sont pas en place, on ne charge rien
    const liReady = LINKEDIN_PARTNER_ID && !LINKEDIN_PARTNER_ID.startsWith("YOUR_");
    const fbReady = META_PIXEL_ID && !META_PIXEL_ID.startsWith("YOUR_");
    if (!liReady && !fbReady) return;

    // ── LinkedIn Insight Tag ──────────────────────────────────────────────────
    if (liReady) {
    if (!window._linkedin_data_partner_ids) {
      window._linkedin_data_partner_ids = [];
    }
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);

    if (!window.lintrk) {
      window.lintrk = function(a, b) {
        window.lintrk.q.push([a, b]);
      };
      window.lintrk.q = [];
    }

    const liScript = document.createElement("script");
    liScript.type = "text/javascript";
    liScript.async = true;
    liScript.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    document.head.appendChild(liScript);

    // LinkedIn noscript pixel
    const liNoscript = document.createElement("noscript");
    const liImg = document.createElement("img");
    liImg.height = "1"; liImg.width = "1"; liImg.style.display = "none";
    liImg.alt = "";
    liImg.src = `https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`;
    liNoscript.appendChild(liImg);
    document.body.appendChild(liNoscript);
    }

    // ── Meta Pixel ────────────────────────────────────────────────────────────
    if (fbReady && !window.fbq) {
      const fbScript = document.createElement("script");
      fbScript.text = `
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);

      // Meta noscript pixel
      const metaNoscript = document.createElement("noscript");
      const metaImg = document.createElement("img");
      metaImg.height = "1"; metaImg.width = "1"; metaImg.style.display = "none";
      metaImg.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
      metaNoscript.appendChild(metaImg);
      document.body.appendChild(metaNoscript);
    }

  }, []);
}

// Événements de conversion, appelés depuis les CTA et le formulaire
const track = {
  // Visite d'une page clé
  pageView: (pageName) => {
    try {
      if (window.fbq) window.fbq("track", "ViewContent", { content_name: pageName });
      if (window.lintrk) window.lintrk("track", { conversion_id: LINKEDIN_PARTNER_ID });
    } catch(e) {}
  },
  // Clic sur Contact ou CTA
  contactClick: () => {
    try {
      if (window.fbq) window.fbq("track", "Contact");
      if (window.lintrk) window.lintrk("track", { conversion_id: LINKEDIN_PARTNER_ID });
    } catch(e) {}
  },
  // Soumission du formulaire de contact
  formSubmit: () => {
    try {
      if (window.fbq) window.fbq("track", "Lead");
      if (window.lintrk) window.lintrk("track", { conversion_id: LINKEDIN_PARTNER_ID });
    } catch(e) {}
  },
  // Inscription newsletter
  newsletter: () => {
    try {
      if (window.fbq) window.fbq("track", "Subscribe");
    } catch(e) {}
  },
  // Vue d'un candidat vedette (signal d'intérêt employeur)
  candidateView: (title) => {
    try {
      if (window.fbq) window.fbq("track", "ViewContent", { content_name: `Candidate: ${title}`, content_category: "Featured Candidate" });
    } catch(e) {}
  },
};

// ─── 404 PAGE ─────────────────────────────────────────────────────────────────
function NotFoundPage({ lang, setPage }) {
  return (
    <div>
      <section style={{ background:C.ink, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"4rem 2rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(12rem,30vw,28rem)", fontWeight:700, color:"rgba(232,93,26,0.06)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.05em" }}>404</div>
        <div style={{ maxWidth:"600px", margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.orange, marginBottom:"2rem" }}>404</div>
          <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,7vw,5rem)", color:"#fff", letterSpacing:"-0.03em", lineHeight:0.95, marginBottom:"1rem" }}>
            {lang==="en" ? "This page doesn't exist." : "Cette page n'existe pas."}
          </h1>
          <h2 style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.5rem,4vw,3rem)", color:C.orange, lineHeight:1, marginBottom:"3rem" }}>
            {lang==="en" ? "But we can still help." : "Mais on peut quand même aider."}
          </h2>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"1rem", lineHeight:1.75, marginBottom:"3rem" }}>
            {lang==="en"
              ? "The page you're looking for has moved or doesn't exist. Head back home or get in touch directly."
              : "La page que tu cherches a bougé ou n'existe pas. Retourne à l'accueil ou contacte-nous directement."}
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-orange" onClick={() => setPage("home")}>
              {lang==="en" ? "Back to Home" : "Retour à l'accueil"}
            </button>
            <button style={{ display:"inline-block", border:"1.5px solid rgba(255,255,255,0.25)", color:"#fff", padding:"11px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", background:"transparent", cursor:"pointer", transition:"border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"}
              onClick={() => setPage("contact")}
            >
              {lang==="en" ? "Contact Us" : "Nous contacter"}
            </button>
          </div>
          <div style={{ marginTop:"4rem", display:"flex", gap:"2rem", justifyContent:"center", flexWrap:"wrap" }}>
            {[["food", lang==="en"?"Food & CPG":"Alimentaire & CPG"],["fashion", lang==="en"?"Fashion":"Mode"],["blog", lang==="en"?"Blog":"Blogue"],["team", lang==="en"?"Team":"Équipe"]].map(([k,l]) => (
              <button key={k} onClick={() => setPage(k)} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", borderBottom:`1px solid rgba(255,255,255,0.15)`, paddingBottom:"2px", transition:"color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color=C.orange}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.4)"}
              >{l}</button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PRIVACY PAGE ─────────────────────────────────────────────────────────────
function PrivacyPage({ lang, setPage }) {
  const t = {
    en: {
      eyebrow: "Legal",
      h1: "Privacy Policy.",
      updated: "Last updated: January 2025",
      sections: [
        { h:"Who We Are", p:"Proforce Personnel Inc. is a specialist recruitment firm headquartered in Montreal, Quebec, Canada. We operate across Montreal, Quebec City, and Toronto, placing professionals in the food, CPG, and fashion industries. You can reach us at info@proforce.ca or by phone at (514) 905-0606." },
        { h:"Information We Collect", p:"We collect personal information that you provide directly to us, including your name, email address, phone number, company name, and résumé or professional background, when you contact us through our website, submit a candidate profile, or engage with our recruitment services. We also collect basic usage data through our website (such as pages visited and time spent) to understand how visitors use our site." },
        { h:"How We Use Your Information", p:"We use the information we collect to respond to your inquiries, evaluate your fit for current or future mandates, connect you with potential employers or candidates (with your explicit consent), improve our website and services, and comply with legal obligations. We do not sell your personal information to third parties. Ever." },
        { h:"Sharing Your Information", p:"Your information is shared only when necessary to provide our recruitment services, specifically, with potential employers when you have explicitly authorized us to represent you as a candidate. We may also share information with service providers who assist us in operating our website and business, under confidentiality agreements." },
        { h:"Data Retention", p:"We retain your personal information for as long as necessary to provide our services and comply with legal requirements. Candidate profiles are typically retained for up to three years from the date of last contact. You may request deletion of your information at any time by contacting us at info@proforce.ca." },
        { h:"Your Rights", p:"You have the right to access, correct, or delete your personal information held by Proforce Personnel. You also have the right to withdraw consent for us to use your information at any time. To exercise these rights, contact us at info@proforce.ca. We will respond within 30 days." },
        { h:"Cookies", p:"Our website uses minimal cookies necessary for basic site functionality. We do not use advertising or tracking cookies. You can disable cookies in your browser settings without affecting your ability to use our site." },
        { h:"Security", p:"We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. Our website uses HTTPS encryption. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security." },
        { h:"Contact", p:"If you have questions about this privacy policy or how we handle your personal information, contact us at info@proforce.ca or write to us at Proforce Personnel Inc., 500 Place d'Armes, Suite 1800, Montreal, QC H2Y 2W2." },
      ],
    },
    fr: {
      eyebrow: "Légal",
      h1: "Politique de confidentialité.",
      updated: "Dernière mise à jour : janvier 2025",
      sections: [
        { h:"Qui nous sommes", p:"Proforce Personnel Inc. est une firme de recrutement spécialisée dont le siège social est à Montréal, Québec, Canada. Nous opérons à Montréal, Québec et Toronto, en plaçant des professionnels dans les industries alimentaire, CPG et mode. Vous pouvez nous joindre à info@proforce.ca ou par téléphone au (514) 905-0606." },
        { h:"Informations que nous collectons", p:"Nous collectons les informations personnelles que vous nous fournissez directement, incluant votre nom, adresse courriel, numéro de téléphone, nom de compagnie, et CV ou parcours professionnel, lorsque vous nous contactez via notre site web, soumettez un profil de candidat, ou engagez nos services de recrutement. Nous collectons également des données d'utilisation de base via notre site web pour comprendre comment les visiteurs utilisent notre site." },
        { h:"Comment nous utilisons vos informations", p:"Nous utilisons les informations collectées pour répondre à vos demandes, évaluer votre adéquation avec des mandats actuels ou futurs, vous connecter avec des employeurs ou candidats potentiels (avec votre consentement explicite), améliorer notre site web et nos services, et nous conformer aux obligations légales. Nous ne vendons jamais vos informations personnelles à des tiers." },
        { h:"Partage de vos informations", p:"Vos informations sont partagées uniquement lorsque nécessaire pour fournir nos services de recrutement, spécifiquement, avec des employeurs potentiels lorsque vous nous avez explicitement autorisés à vous représenter en tant que candidat. Nous pouvons également partager des informations avec des prestataires de services qui nous aident à opérer notre site web et nos activités, sous accords de confidentialité." },
        { h:"Conservation des données", p:"Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services et nous conformer aux exigences légales. Les profils de candidats sont généralement conservés jusqu'à trois ans à compter de la date du dernier contact. Vous pouvez demander la suppression de vos informations à tout moment en nous contactant à info@proforce.ca." },
        { h:"Vos droits", p:"Vous avez le droit d'accéder, corriger ou supprimer vos informations personnelles détenues par Proforce Personnel. Vous avez également le droit de retirer votre consentement à l'utilisation de vos informations à tout moment. Pour exercer ces droits, contactez-nous à info@proforce.ca. Nous répondrons dans les 30 jours." },
        { h:"Cookies", p:"Notre site web utilise des cookies minimaux nécessaires au fonctionnement de base du site. Nous n'utilisons pas de cookies publicitaires ou de traçage. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur sans affecter votre capacité à utiliser notre site." },
        { h:"Sécurité", p:"Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre tout accès, utilisation ou divulgation non autorisés. Notre site web utilise le chiffrement HTTPS. Cependant, aucune méthode de transmission sur Internet n'est sécurisée à 100%." },
        { h:"Contact", p:"Si vous avez des questions sur cette politique de confidentialité ou sur la façon dont nous traitons vos informations personnelles, contactez-nous à info@proforce.ca ou écrivez-nous à Proforce Personnel Inc., 500 Place d'Armes, Bureau 1800, Montréal, QC H2Y 2W2." },
      ],
    },
  }[lang];

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"40vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"780px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(2.5rem,6vw,5rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"1rem" }}>{t.h1}</h1>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)", marginTop:"1rem" }}>{t.updated}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />
          {t.sections.map((s, i) => (
            <div key={i} style={{ padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.75rem" }}>{s.h}</h2>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"1rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{s.p}</p>
            </div>
          ))}
          <div style={{ paddingTop:"3rem" }}>
            <button className="btn-ink" onClick={() => setPage("contact")}>
              {lang==="en" ? "Questions? Contact Us" : "Des questions? Contactez-nous"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── SEO HOOK ─────────────────────────────────────────────────────────────────
function useSEO(page, lang, blogPostId) {
  useEffect(() => {
    // L'origine reelle, pour que les URL canoniques et l'image de partage
    // fonctionnent autant sur le site de production que sur l'apercu Vercel
    const PROD_HOSTS = ["proforce.ca", "www.proforce.ca"];
    const host = typeof window !== "undefined" ? window.location.hostname : "proforce.ca";
    const base = typeof window !== "undefined" ? window.location.origin : "https://proforce.ca";
    const isProd = PROD_HOSTS.includes(host);

    // Tant que le site vit sur l'apercu, on empeche Google de l'indexer
    let robots = document.querySelector('meta[name="robots"]');
    if (!isProd) {
      if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
      robots.content = "noindex, nofollow";
    } else if (robots) {
      robots.remove();
    }
    const pageMeta = META[page]?.[lang] || META.home[lang];
    const postMeta = blogPostId ? POSTS.find(p => p.id === blogPostId) : null;

    const title = postMeta
      ? `${postMeta.title[lang]}, Proforce Personnel`
      : pageMeta.title;
    const desc = postMeta
      ? postMeta.excerpt[lang]
      : pageMeta.desc;
    const url = base + (postMeta ? pathOf("blog", blogPostId) : pathOf(page));

    // Title
    document.title = title;

    // Helper to upsert a meta tag
    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };

    setMeta('meta[name="description"]',         "content", desc);
    setMeta('meta[property="og:title"]',         "content", title);
    setMeta('meta[property="og:description"]',   "content", desc);
    setMeta('meta[property="og:url"]',           "content", url);
    setMeta('meta[property="og:type"]',          "content", postMeta ? "article" : "website");
    setMeta('meta[property="og:site_name"]',     "content", "Proforce Personnel");
    setMeta('meta[property="og:image"]',         "content", `${base}/og-image.jpg`);
    setMeta('meta[name="twitter:card"]',         "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]',        "content", title);
    setMeta('meta[name="twitter:description"]',  "content", desc);
    setMeta('meta[name="twitter:image"]',        "content", `${base}/og-image.jpg`);
    setMeta('meta[name="robots"]',               "content", "index, follow");
    setMeta('meta[name="language"]',             "content", lang === "fr" ? "fr-CA" : "en-CA");
    setMeta('meta[name="geo.region"]',           "content", "CA-QC");
    setMeta('meta[name="geo.placename"]',        "content", "Montreal, Quebec");

    // Canonical
    document.documentElement.lang = lang;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = url;

    // Pas de hreflang: les deux langues vivent a la meme adresse, la balise
    // enverrait un faux signal. Il faudra des prefixes /fr et /en pour la mettre en place.
    document.querySelectorAll("link[hreflang]").forEach(el => el.remove());

    // ── JSON-LD Schema.org ────────────────────────────────────────────────────
    const removeSchema = (id) => { const el = document.getElementById(id); if (el) el.remove(); };
    const addSchema = (id, data) => {
      removeSchema(id);
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = id;
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
    };

    // 1. Organization, always present
    addSchema("schema-org", {
      "@context": "https://schema.org",
      "@type": "EmploymentAgency",
      "name": "Proforce Personnel",
      "alternateName": "Proforce Personnel Inc.",
      "url": base,
      "logo": `${base}/logo.png`,
      "image": `${base}/og-image.jpg`,
      "description": "Specialist recruitment firm in food, CPG, and fashion. Montreal, Quebec City and Toronto. Since 2001.",
      "foundingDate": "2001",
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 5 },
      "address": [
        {
          "@type": "PostalAddress",
          "streetAddress": "500 Place d'Armes, Suite 1800",
          "addressLocality": "Montreal",
          "addressRegion": "QC",
          "postalCode": "H2Y 2W2",
          "addressCountry": "CA",
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "1020 Bouvier Street, Suite 400",
          "addressLocality": "Quebec City",
          "addressRegion": "QC",
          "postalCode": "G2K 0K9",
          "addressCountry": "CA",
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "197 Yonge Street, Unit 201",
          "addressLocality": "Toronto",
          "addressRegion": "ON",
          "postalCode": "M5B 0C1",
          "addressCountry": "CA",
        },
      ],
      "contactPoint": [
        { "@type": "ContactPoint", "telephone": "+1-514-905-0606", "contactType": "customer service", "areaServed": "CA-QC", "availableLanguage": ["French","English"] },
        { "@type": "ContactPoint", "telephone": "+1-418-431-1441", "contactType": "customer service", "areaServed": "CA-QC", "availableLanguage": ["French","English"] },
        { "@type": "ContactPoint", "telephone": "+1-647-490-6626", "contactType": "customer service", "areaServed": "CA-ON", "availableLanguage": ["English","French"] },
      ],
      "email": "info@proforce.ca",
      "sameAs": [
        "https://www.facebook.com/share/17YcPvUvNn/",
        "https://www.instagram.com/proforcepersonnel",
        "https://www.linkedin.com/company/proforce-personnel",
      ],
      "areaServed": [
        { "@type": "City", "name": "Montreal", "containedInPlace": { "@type": "Province", "name": "Quebec" } },
        { "@type": "City", "name": "Quebec City", "containedInPlace": { "@type": "Province", "name": "Quebec" } },
        { "@type": "City", "name": "Toronto", "containedInPlace": { "@type": "Province", "name": "Ontario" } },
      ],
      "knowsAbout": [
        "Food Industry Recruitment", "CPG Recruitment", "Fashion Recruitment",
        "Headhunting", "Executive Search", "Permanent Placement",
        "Recrutement alimentaire", "Recrutement mode", "Chasse de tête",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Recruitment Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Food & CPG Recruitment", "description": "Permanent placement of food manufacturing and CPG professionals across Quebec and Ontario." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fashion & Apparel Recruitment", "description": "Permanent placement of fashion professionals across Montreal and Toronto." } },
        ],
      },
    });

    // 2. Team members, Person schema
    addSchema("schema-team", {
      "@context": "https://schema.org",
      "@graph": TEAM.map(m => ({
        "@type": "Person",
        "name": m.name,
        "jobTitle": m.title.en,
        "worksFor": { "@type": "Organization", "name": "Proforce Personnel" },
        "url": m.linkedin,
        "sameAs": [m.linkedin],
        "knowsAbout": m.sector.en,
      })),
    });

    // 3. Blog article schema, only on article pages
    if (postMeta) {
      const author = TEAM.find(t => postMeta.recruiter && t.name === postMeta.recruiter) || TEAM[0];
      addSchema("schema-article", {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postMeta.title[lang],
        "description": postMeta.excerpt[lang],
        "url": url,
        "inLanguage": lang === "fr" ? "fr-CA" : "en-CA",
        "datePublished": postMeta.date,
        "author": {
          "@type": "Person",
          "name": "Simon St-Amand",
          "url": "https://www.linkedin.com/in/simonstamand",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Proforce Personnel",
          "url": base,
          "logo": { "@type": "ImageObject", "url": `${base}/logo.png` },
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
        "keywords": [postMeta.cat.en, "recruitment", "food industry", "CPG", "fashion", "Montreal", "Toronto"].join(", "),
      });
    } else {
      removeSchema("schema-article");
    }

    // 4. Local Business, for Google Maps / local search
    addSchema("schema-local", {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "EmploymentAgency"],
      "name": "Proforce Personnel",
      "url": base,
      "telephone": "+1-514-905-0606",
      "email": "info@proforce.ca",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "500 Place d'Armes, Suite 1800",
        "addressLocality": "Montreal",
        "addressRegion": "QC",
        "postalCode": "H2Y 2W2",
        "addressCountry": "CA",
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 45.5088, "longitude": -73.5548 },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:30", "closes": "17:30" },
      ],
      "priceRange": "$$",
      "currenciesAccepted": "CAD",
      "paymentAccepted": "Invoice",
      "areaServed": "Canada",
    });

    // 5. WebSite schema with SearchAction (enables Google Sitelinks search box)
    if (page === "home") {
      addSchema("schema-website", {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Proforce Personnel",
        "url": base,
        "inLanguage": ["fr-CA", "en-CA"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${base}/#/blog?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      });
    } else {
      removeSchema("schema-website");
    }

    // 6. FAQ schema, on employers and candidates pages
    if (page === "employers") {
      addSchema("schema-faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How does Proforce Personnel find candidates?", "acceptedAnswer": { "@type": "Answer", "text": "We call people directly from our network, people we already know, people who aren't actively looking. We don't post job ads and wait." } },
          { "@type": "Question", "name": "What industries does Proforce specialize in?", "acceptedAnswer": { "@type": "Answer", "text": "We specialize exclusively in food, CPG, and fashion recruitment in Montreal and Toronto." } },
          { "@type": "Question", "name": "Does Proforce offer a placement guarantee?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every permanent placement comes with a replacement guarantee. If the candidate doesn't work out within the guarantee period, we find another candidate at no charge." } },
          { "@type": "Question", "name": "How long does a search typically take?", "acceptedAnswer": { "@type": "Answer", "text": "Most searches result in a qualified shortlist within 2-3 weeks. Final placement timelines depend on the client's interview process." } },
        ],
      });
    } else {
      removeSchema("schema-faq");
    }

  }, [page, lang, blogPostId]);
}

// ─── HASH ROUTING HOOK ────────────────────────────────────────────────────────
const ROUTES = {
  "":           "home",
  "home":       "home",
  "food":       "food",
  "fashion":    "fashion",
  "glossary":   "glossary",
  "montreal":   "montreal",
  "quebec":     "quebec",
  "toronto":    "toronto",
  "calculator": "calculator",
  "howwework":  "howwework",
  "press":      "press",
  "simon":      "simon",
  "referral":   "referral",
  "startup":    "startup",
  "featured":   "featured",
  "employers":  "employers",
  "privacy":    "privacy",
  "about":      "about",
  "team":       "team",
  "candidates": "candidates",
  "jobs":       "jobs",
  "giving":     "giving",
  "blog":       "blog",
  "contact":    "contact",
};

function parseLocation() {
  // Compatibilite : les anciennes adresses en #/ sont converties en vrai chemin
  if (window.location.hash.startsWith("#/")) {
    const legacy = window.location.hash.slice(2).split("/");
    const url = "/" + legacy.filter(Boolean).join("/");
    window.history.replaceState(null, "", url === "/" ? "/" : url);
  }
  const parts = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/");
  const key   = parts[0] || "";
  const page  = ROUTES[key] !== undefined ? ROUTES[key] : "notfound";
  const sub   = parts[1] || null; // identifiant d'article de blogue
  return { page, sub };
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const initial = parseLocation();
  const [page, setPage] = useState(initial.page);
  const [lang, setLang] = useState("fr");
  const [blogPost, setBlogPost] = useState(initial.sub);

  // Init pixels once on mount
  usePixelInit();

  // Track page views on navigation
  useEffect(() => {
    track.pageView(page);
    // Track high-value pages specifically
    if (page === "contact") track.contactClick();
    if (page === "employers") track.pageView("Employers");
    if (page === "startup") track.pageView("Startups");
    if (page === "featured") track.pageView("Featured Candidates");
  }, [page]);

  // Sync state when browser back/forward used
  useEffect(() => {
    const onPop = () => {
      const { page: p, sub } = parseLocation();
      setPage(p);
      setBlogPost(sub);
      window.scrollTo({top:0,behavior:"smooth"});
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // SEO meta tags
  useSEO(page, lang, blogPost);

  const go = (p, sub) => {
    setPage(p);
    if (p !== "blog") setBlogPost(null);
    window.history.pushState(null, "", pathOf(p, sub));
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const goPost = (postId) => {
    setBlogPost(postId);
    setPage("blog");
    window.history.pushState(null, "", pathOf("blog", postId));
    window.scrollTo({top:0,behavior:"smooth"});
  };

// ─── GLOSSARY DATA ────────────────────────────────────────────────────────────
const GLOSSARY = [
  {
    term: "SQF (Safe Quality Food)",
    cat: { en:"Food Safety", fr:"Salubrité alimentaire" },
    def: {
      en: "A rigorous food safety and quality certification program recognized by the Global Food Safety Initiative (GFSI). SQF certification is required by many major retailers and food manufacturers in North America. Companies are audited annually by a certified SQF auditor. There are three levels: Level 1 (food safety fundamentals), Level 2 (food safety plans), and Level 3 (food safety and quality management systems).",
      fr: "Un programme rigoureux de certification en salubrité et qualité alimentaires reconnu par la Global Food Safety Initiative (GFSI). La certification SQF est exigée par de nombreux grands détaillants et fabricants alimentaires en Amérique du Nord. Les entreprises sont auditées annuellement par un auditeur SQF certifié. Il existe trois niveaux : Niveau 1 (fondamentaux de salubrité), Niveau 2 (plans de salubrité alimentaire) et Niveau 3 (systèmes de gestion de la salubrité et de la qualité alimentaires).",
    },
  },
  {
    term: "HACCP (Hazard Analysis Critical Control Points)",
    cat: { en:"Food Safety", fr:"Salubrité alimentaire" },
    def: {
      en: "A systematic preventive approach to food safety that identifies physical, chemical, and biological hazards in production processes. HACCP is a legal requirement in Canada under the Safe Food for Canadians Act (SFCA) and is foundational to virtually all food safety certification programs. Most food manufacturing QA and operations roles require HACCP knowledge.",
      fr: "Une approche préventive systématique de la salubrité alimentaire qui identifie les dangers physiques, chimiques et biologiques dans les processus de production. Le HACCP est une exigence légale au Canada en vertu de la Loi sur la salubrité des aliments au Canada (LSAC) et est fondamental à pratiquement tous les programmes de certification en salubrité alimentaire. La plupart des rôles en QA et en opérations dans la fabrication alimentaire exigent une connaissance du HACCP.",
    },
  },
  {
    term: "FSMA (Food Safety Modernization Act)",
    cat: { en:"Food Safety", fr:"Salubrité alimentaire" },
    def: {
      en: "US legislation signed into law in 2011 that fundamentally shifted food safety regulation from reactive to preventive. Canadian food companies that export to the United States must comply with FSMA requirements. FSMA knowledge is increasingly valued in Canadian food manufacturing roles, particularly for companies with cross-border operations.",
      fr: "Législation américaine adoptée en 2011 qui a fondamentalement transformé la réglementation de la salubrité alimentaire d'une approche réactive à préventive. Les entreprises alimentaires canadiennes qui exportent aux États-Unis doivent se conformer aux exigences de la FSMA. La connaissance de la FSMA est de plus en plus valorisée dans les rôles de fabrication alimentaire canadiens, particulièrement pour les entreprises avec des opérations trans-frontalières.",
    },
  },
  {
    term: "GFSI (Global Food Safety Initiative)",
    cat: { en:"Food Safety", fr:"Salubrité alimentaire" },
    def: {
      en: "A non-profit organization that benchmarks food safety certification programs against an international standard. GFSI-recognized certifications include SQF, BRC, FSSC 22000, and IFS. Retailers like Walmart, Costco, and Loblaw require GFSI certification from their suppliers. A food safety professional with GFSI experience is highly sought after across the industry.",
      fr: "Une organisation à but non lucratif qui évalue les programmes de certification en salubrité alimentaire par rapport à une norme internationale. Les certifications reconnues par GFSI incluent SQF, BRC, FSSC 22000 et IFS. Des détaillants comme Walmart, Costco et Loblaw exigent la certification GFSI de leurs fournisseurs. Un professionnel de la salubrité alimentaire avec une expérience GFSI est très recherché dans l'industrie.",
    },
  },
  {
    term: "BRC (British Retail Consortium) Global Standard",
    cat: { en:"Food Safety", fr:"Salubrité alimentaire" },
    def: {
      en: "A GFSI-recognized food safety certification, particularly prevalent among companies supplying to UK and European retailers. BRC certification is also common among Canadian food manufacturers with international distribution. The BRC standard covers food safety, quality, legality, and authenticity.",
      fr: "Une certification de salubrité alimentaire reconnue par GFSI, particulièrement répandue parmi les entreprises qui approvisionnent des détaillants britanniques et européens. La certification BRC est également courante parmi les fabricants alimentaires canadiens avec une distribution internationale. La norme BRC couvre la salubrité, la qualité, la légalité et l'authenticité des aliments.",
    },
  },
  {
    term: "CFIA (Canadian Food Inspection Agency)",
    cat: { en:"Regulation", fr:"Réglementation" },
    def: {
      en: "The federal agency responsible for food safety regulation and enforcement in Canada. CFIA conducts inspections, audits, and investigations across the food supply chain. Food safety managers and quality directors must be familiar with CFIA requirements and inspection protocols. CFIA audits are a significant driver of demand for qualified food safety professionals.",
      fr: "L'agence fédérale responsable de la réglementation et de l'application de la salubrité alimentaire au Canada. L'ACIA effectue des inspections, des audits et des enquêtes dans toute la chaîne d'approvisionnement alimentaire. Les gestionnaires de salubrité alimentaire et les directeurs qualité doivent être familiers avec les exigences de l'ACIA et les protocoles d'inspection. Les audits de l'ACIA sont un moteur important de la demande de professionnels qualifiés en salubrité alimentaire.",
    },
  },
  {
    term: "CPG (Consumer Packaged Goods)",
    cat: { en:"Industry", fr:"Industrie" },
    def: {
      en: "Products sold to consumers in packaging, purchased frequently and replaced regularly. The CPG industry includes food and beverage, personal care, household products, and more. In recruitment, CPG typically refers to branded food and beverage companies that manufacture, market, and sell products through retail channels. CPG companies often have distinct roles in sales, marketing, trade, category management, and supply chain that differ from pure manufacturing environments.",
      fr: "Produits vendus aux consommateurs en emballage, achetés fréquemment et remplacés régulièrement. L'industrie CPG inclut les aliments et boissons, les soins personnels, les produits ménagers et plus encore. En recrutement, CPG désigne généralement les entreprises alimentaires et de boissons de marque qui fabriquent, commercialisent et vendent des produits via des canaux de détail. Les entreprises CPG ont souvent des rôles distincts en ventes, marketing, commerce, gestion de catégorie et chaîne d'approvisionnement qui diffèrent des environnements de fabrication pure.",
    },
  },
  {
    term: "Open-to-Buy (OTB)",
    cat: { en:"Fashion & Retail", fr:"Mode & Commerce de détail" },
    def: {
      en: "A purchasing budget management system used by retail buyers to control inventory investment. OTB represents the dollar amount a buyer is authorized to spend on new inventory for a given period. Managing OTB effectively is a core competency for fashion buyers and merchandise planners. Candidates with strong OTB management experience are consistently in demand across Canadian retail.",
      fr: "Un système de gestion du budget d'achat utilisé par les acheteurs de détail pour contrôler l'investissement en inventaire. L'OTB représente le montant en dollars qu'un acheteur est autorisé à dépenser en nouvel inventaire pour une période donnée. Gérer l'OTB efficacement est une compétence clé pour les acheteurs mode et les planificateurs de marchandise. Les candidats avec une solide expérience en gestion OTB sont constamment en demande dans le commerce de détail canadien.",
    },
  },
  {
    term: "Co-manufacturing / Co-packing",
    cat: { en:"Industry", fr:"Industrie" },
    def: {
      en: "Arrangements where one company manufactures or packages products on behalf of another brand. Co-manufacturing is common in the food industry, allowing brands to scale production without owning facilities. Procurement managers, supply chain directors, and operations leaders in food often manage co-manufacturing relationships as a significant part of their role.",
      fr: "Arrangements où une entreprise fabrique ou emballe des produits au nom d'une autre marque. La co-fabrication est courante dans l'industrie alimentaire, permettant aux marques d'augmenter leur production sans posséder d'installations. Les directeurs approvisionnement, directeurs chaîne d'approvisionnement et leaders en opérations dans l'alimentaire gèrent souvent des relations de co-fabrication comme partie importante de leur rôle.",
    },
  },
  {
    term: "Contingency Recruitment",
    cat: { en:"Recruitment", fr:"Recrutement" },
    def: {
      en: "A fee structure where a recruiter is paid only upon successful placement of a candidate. No placement means no fee. This is the most common model for permanent placement recruitment. Contingency recruitment is best suited for roles where the client is open to candidates from multiple sources simultaneously. The recruiter's fee is typically a percentage of the placed candidate's first-year base salary.",
      fr: "Une structure d'honoraires où un recruteur est payé uniquement lors du placement réussi d'un candidat. Pas de placement signifie pas d'honoraires. C'est le modèle le plus courant pour le recrutement en placement permanent. Le recrutement contingent est mieux adapté aux rôles où le client est ouvert à des candidats de plusieurs sources simultanément. Les honoraires du recruteur sont généralement un pourcentage du salaire de base de première année du candidat placé.",
    },
  },
  {
    term: "Retained Search",
    cat: { en:"Recruitment", fr:"Recrutement" },
    def: {
      en: "A fee structure where a recruiter is paid an upfront retainer to conduct an exclusive search. The retained model is typically used for senior-level or difficult-to-fill mandates where the client wants dedicated resources and exclusivity. The retainer is usually paid in installments: at engagement, at shortlist presentation, and upon placement. Retained searches typically result in a more thorough and confidential process.",
      fr: "Une structure d'honoraires où un recruteur est payé un acompte initial pour mener une recherche exclusive. Le modèle retenu est généralement utilisé pour des mandats de niveau supérieur ou difficiles à combler où le client souhaite des ressources dédiées et l'exclusivité. L'acompte est généralement payé en versements : à l'engagement, à la présentation de la courte liste et au placement. Les recherches retenues résultent généralement en un processus plus approfondi et confidentiel.",
    },
  },
  {
    term: "Passive Candidate",
    cat: { en:"Recruitment", fr:"Recrutement" },
    def: {
      en: "A professional who is currently employed and not actively looking for a new role, but who may be open to the right opportunity. Passive candidates are generally considered higher quality than active candidates because they are succeeding in their current role. Reaching passive candidates requires a recruiter with an established network, they are not on job boards and do not respond to job postings.",
      fr: "Un professionnel qui est actuellement en emploi et qui ne cherche pas activement un nouveau rôle, mais qui pourrait être ouvert à la bonne opportunité. Les candidats passifs sont généralement considérés de meilleure qualité que les candidats actifs parce qu'ils réussissent dans leur rôle actuel. Atteindre les candidats passifs nécessite un recruteur avec un réseau établi, ils ne sont pas sur les babillards d'emploi et ne répondent pas aux affichages de postes.",
    },
  },
  {
    term: "P&L (Profit & Loss) Responsibility",
    cat: { en:"Leadership", fr:"Leadership" },
    def: {
      en: "Accountability for both the revenues and costs of a business unit, facility, or product line. P&L responsibility is a key differentiator for senior operations and general management candidates. A plant manager or VP Operations with P&L responsibility has managed budgets and is accountable for financial outcomes, not just operational metrics.",
      fr: "La responsabilité à la fois des revenus et des coûts d'une unité d'affaires, d'une installation ou d'une ligne de produits. La responsabilité P&L est un différenciateur clé pour les candidats séniors en opérations et en gestion générale. Un directeur d'usine ou VP Opérations avec responsabilité P&L a géré des budgets et est responsable des résultats financiers, pas seulement des indicateurs opérationnels.",
    },
  },
  {
    term: "GPO (Group Purchasing Organization)",
    cat: { en:"Food Service", fr:"Service alimentaire" },
    def: {
      en: "An entity that leverages the collective purchasing power of its members to negotiate discounts with suppliers. In food service, GPOs like Sysco, Gordon Food Service, and regional distributors are major channels through which food manufacturers sell their products. Sales leaders in food service need strong GPO relationships and an understanding of distribution economics.",
      fr: "Une entité qui tire parti du pouvoir d'achat collectif de ses membres pour négocier des rabais avec les fournisseurs. En service alimentaire, les GPO comme Sysco, Gordon Food Service et les distributeurs régionaux sont des canaux majeurs par lesquels les fabricants alimentaires vendent leurs produits. Les leaders en ventes de service alimentaire ont besoin de solides relations GPO et d'une compréhension de l'économie de distribution.",
    },
  },
  {
    term: "HRI (Hotel, Restaurant, Institution)",
    cat: { en:"Food Service", fr:"Service alimentaire" },
    def: {
      en: "The food service channel serving hotels, restaurants, and institutional buyers such as hospitals, schools, and corporate cafeterias. HRI is a distinct sales channel from retail, with different pricing structures, packaging formats, and relationship management requirements. Sales and account management professionals specializing in HRI are a distinct talent pool.",
      fr: "Le canal de service alimentaire desservant les hôtels, restaurants et acheteurs institutionnels comme les hôpitaux, les écoles et les cafétérias d'entreprises. HRI est un canal de vente distinct du commerce de détail, avec des structures de prix, des formats d'emballage et des exigences de gestion des relations différents. Les professionnels en ventes et gestion de comptes spécialisés en HRI constituent un bassin de talents distinct.",
    },
  },
];

// ─── MARKET PAGES DATA ────────────────────────────────────────────────────────
const MARKETS = {
  montreal: {
    en: {
      eyebrow: "Food, CPG & Fashion Recruitment, Montreal",
      h1: "Montreal's specialist recruiter.",
      h1i: "Food, CPG & Fashion.",
      sub: "Proforce Personnel has been placing professionals in Montreal's food, CPG, and fashion industries since 2001. Our headquarters is here. Our network is here. We know this market.",
      about: "Montreal is one of Canada's most important food manufacturing centres, home to major processors, dairy producers, confectionery brands, and a growing natural and organic food sector. The city is also the heart of Canadian fashion, with a concentration of wholesale brands, retailers, and designers unmatched outside of Toronto.",
      foodH: "Food & CPG in Montreal",
      foodP: "Montreal's food manufacturing sector spans everything from large-scale protein processing in the surrounding regions to specialty food producers in the city's industrial corridors. Companies like Saputo, Olymel, Agropur, and dozens of mid-size CPG brands call Montreal home. Proforce has placed quality directors, plant managers, supply chain leaders, and senior sales professionals across this ecosystem for over 25 years.",
      fashH: "Fashion in Montreal",
      fashP: "Montreal's fashion industry is centered on St-Laurent Boulevard and the Chabanel garment district, with a mix of established brands, emerging designers, and retail head offices. Robin Anisef has spent over 20 years building relationships across Montreal's fashion community, buyers, brand managers, designers, and merchandisers who trust her to handle their career conversations with discretion.",
      recruiterH: "Your Montreal recruiters",
      cta: "Contact Our Montreal Office",
      phone: "(514) 905-0606",
      addr: "500 Place d'Armes, Suite 1800, Montreal, QC H2Y 2W2",
    },
    fr: {
      eyebrow: "Recrutement alimentaire, CPG et mode, Montréal",
      h1: "Le recruteur spécialisé de Montréal.",
      h1i: "Alimentaire, CPG et mode.",
      sub: "Proforce Personnel place des professionnels dans les industries alimentaire, CPG et mode de Montréal depuis 2001. Notre siège social est ici. Notre réseau est ici. On connaît ce marché.",
      about: "Montréal est l'un des centres de fabrication alimentaire les plus importants au Canada, accueillant des transformateurs majeurs, des producteurs laitiers, des marques de confiserie et un secteur d'aliments naturels et biologiques en croissance. La ville est aussi le cœur de la mode canadienne, avec une concentration de marques en gros, de détaillants et de designers inégalée en dehors de Toronto.",
      foodH: "Alimentaire & CPG à Montréal",
      foodP: "Le secteur de la fabrication alimentaire de Montréal s'étend de la transformation de protéines à grande échelle dans les régions environnantes aux producteurs d'aliments spécialisés dans les corridors industriels de la ville. Des compagnies comme Saputo, Olymel, Agropur et des dizaines de marques CPG de taille moyenne ont Montréal comme chez-soi. Proforce a placé des directeurs qualité, directeurs d'usine, responsables chaîne d'approvisionnement et professionnels en ventes séniors dans cet écosystème depuis plus de 25 ans.",
      fashH: "Mode à Montréal",
      fashP: "L'industrie mode de Montréal est centrée sur le boulevard St-Laurent et le district du vêtement de Chabanel, avec un mélange de marques établies, de designers émergents et de sièges sociaux de détaillants. Robin Anisef a passé plus de 20 ans à bâtir des relations dans la communauté mode de Montréal, acheteurs, gestionnaires de marque, designers et marchandiseurs qui lui font confiance pour gérer leurs conversations de carrière avec discrétion.",
      recruiterH: "Vos recruteurs à Montréal",
      cta: "Contacter notre bureau de Montréal",
      phone: "(514) 905-0606",
      addr: "500 Place d'Armes, Bureau 1800, Montréal, QC H2Y 2W2",
    },
    recruiters: ["Simon St-Amand","Robin Anisef","Stéphanie Lanoie"],
  },
  quebec: {
    en: {
      eyebrow: "Food & CPG Recruitment, Quebec City",
      h1: "Quebec City's food industry recruiter.",
      h1i: "From the plant floor up.",
      sub: "Proforce Personnel has an office in Quebec City and a recruiter who covers the region full time. Capitale-Nationale, Chaudiere-Appalaches, Beauce, and Bas-Saint-Laurent.",
      about: "The Quebec City region is one of the densest food processing corridors in the province. Meat and poultry processing runs through Chaudiere-Appalaches and the Beauce, industrial bakery and dairy operations sit around the Capitale-Nationale, and seafood processing extends east along the river. These are plants that hire quality, operations, and maintenance leadership year round, and most of them never post those roles publicly.",
      foodH: "Food & CPG around Quebec City",
      foodP: "Stephanie Lanoie covers the Quebec food and CPG market full time from our Bouvier Street office. Quality and food safety leadership, plant management, production supervision, maintenance, and supply chain. She knows which plants are hiring, which ones people leave, and why. That is the part you cannot get from a job board.",
      fashH: "Fashion and apparel",
      fashP: "Fashion mandates in the Quebec City region are handled by Robin Anisef out of Montreal, where most retail head offices and wholesale brands sit. Retail head office and merchandising roles in the region go through her network.",
      recruiterH: "Your Quebec City recruiters",
      cta: "Contact Our Quebec City Office",
      phone: "(418) 431-1441",
      addr: "1020 Bouvier Street, Suite 400, Quebec City, QC G2K 0K9",
    },
    fr: {
      eyebrow: "Recrutement alimentaire et CPG, Québec",
      h1: "Le recruteur alimentaire de Québec.",
      h1i: "À partir du plancher d'usine.",
      sub: "Proforce Personnel a un bureau à Québec et une recruteuse qui couvre la région à temps plein. Capitale-Nationale, Chaudière-Appalaches, Beauce et Bas-Saint-Laurent.",
      about: "La région de Québec est un des corridors de transformation alimentaire les plus denses de la province. La transformation de viandes et de volaille traverse la Chaudière-Appalaches et la Beauce, la boulangerie industrielle et les produits laitiers occupent la Capitale-Nationale, et la transformation des produits de la mer s'étend vers l'est le long du fleuve. Ce sont des usines qui embauchent en qualité, en opérations et en maintenance à l'année, et la plupart n'affichent jamais ces postes publiquement.",
      foodH: "Alimentaire et CPG dans la région de Québec",
      foodP: "Stéphanie Lanoie couvre le marché alimentaire et CPG du Québec à temps plein depuis notre bureau de la rue Bouvier. Leadership en qualité et salubrité, direction d'usine, supervision de production, maintenance et chaîne d'approvisionnement. Elle sait quelles usines embauchent, lesquelles le monde quitte, et pourquoi. C'est le bout que tu ne trouves pas sur un babillard.",
      fashH: "Mode et habillement",
      fashP: "Les mandats en mode dans la région de Québec sont pris en charge par Robin Anisef depuis Montréal, où se trouvent la majorité des sièges sociaux de détaillants et des marques en gros. Les postes en siège social de détail et en marchandisage passent par son réseau.",
      recruiterH: "Vos recruteurs à Québec",
      cta: "Contacter notre bureau de Québec",
      phone: "(418) 431-1441",
      addr: "1020, rue Bouvier, Bureau 400, Québec, QC G2K 0K9",
    },
    recruiters: ["Stéphanie Lanoie","Simon St-Amand"],
  },
  toronto: {
    en: {
      eyebrow: "Food & CPG Recruitment, Toronto & Ontario",
      h1: "Ontario's food industry recruiter.",
      h1i: "From the GTA to the plant floor.",
      sub: "Proforce Personnel has expanded its Ontario food and CPG practice with two dedicated recruiters covering the GTA, southwestern Ontario, and cross-border US mandates.",
      about: "Ontario is Canada's largest food manufacturing province, home to the highest concentration of food and CPG companies in the country. The Greater Toronto Area alone houses hundreds of food manufacturers, ingredient suppliers, distributors, and CPG brands. Southwestern Ontario, from Guelph to Windsor, is a hub for protein processing, dairy, and large-scale food production.",
      foodH: "Food & CPG in Ontario",
      foodP: "Proforce's Ontario food practice covers the full spectrum of food manufacturing and CPG, quality and food safety leadership, plant operations, supply chain, procurement, R&D, and sales. Our Ontario recruiters (Rana Yamak and Michaela Landers) bring deep knowledge of the local market, including the greenfield facilities coming online in Hamilton, Strathroy, and the surrounding regions.",
      fashH: "Fashion in Toronto",
      fashP: "Toronto's fashion community, from Queen West to the King Street corridor, includes retail head offices, wholesale brands, and a growing DTC sector. Robin Anisef's network extends across both cities, and she regularly places buyers, brand managers, and merchandisers across Toronto's fashion industry.",
      recruiterH: "Your Toronto recruiters",
      cta: "Contact Our Toronto Office",
      phone: "(647) 490-6626",
      addr: "197 Yonge Street, Unit 201, Toronto, ON M5B 0C1",
    },
    fr: {
      eyebrow: "Recrutement alimentaire & CPG, Toronto et Ontario",
      h1: "Le recruteur alimentaire de l'Ontario.",
      h1i: "Du Grand Toronto au plancher d'usine.",
      sub: "Proforce Personnel a développé sa pratique alimentaire et CPG en Ontario avec deux recruteurs dédiés couvrant le Grand Toronto, le sud-ouest de l'Ontario et les mandats trans-frontaliers américains.",
      about: "L'Ontario est la plus grande province manufacturière alimentaire au Canada, accueillant la plus forte concentration de compagnies alimentaires et CPG du pays. Le Grand Toronto à lui seul abrite des centaines de fabricants alimentaires, fournisseurs d'ingrédients, distributeurs et marques CPG. Le sud-ouest de l'Ontario, de Guelph à Windsor, est un pôle pour la transformation de protéines, les produits laitiers et la production alimentaire à grande échelle.",
      foodH: "Alimentaire & CPG en Ontario",
      foodP: "La pratique alimentaire ontarienne de Proforce couvre tout le spectre de la fabrication alimentaire et du CPG, leadership en qualité et salubrité alimentaire, opérations d'usine, chaîne d'approvisionnement, approvisionnement, R&D et ventes. Nos recruteurs ontariens (Rana Yamak et Michaela Landers) apportent une connaissance approfondie du marché local, incluant les nouvelles installations qui s'ouvrent à Hamilton, Strathroy et les régions environnantes.",
      fashH: "Mode à Toronto",
      fashP: "La communauté mode de Toronto, de Queen West au corridor de King Street, inclut des sièges sociaux de détaillants, des marques en gros et un secteur DTC en croissance. Le réseau de Robin Anisef s'étend dans les deux villes, et elle place régulièrement des acheteurs, gestionnaires de marque et marchandiseurs dans l'industrie mode torontoise.",
      recruiterH: "Vos recruteurs à Toronto",
      cta: "Contacter notre bureau de Toronto",
      phone: "(647) 490-6626",
      addr: "197 Yonge Street, Unité 201, Toronto, ON M5B 0C1",
    },
    recruiters: ["Rana Yamak","Michaela Landers","Robin Anisef"],
  },
};

// ─── GLOSSARY PAGE ────────────────────────────────────────────────────────────
function GlossaryPage({ lang, setPage }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const cats = [...new Set(GLOSSARY.map(g => g.cat[lang]))];
  const filtered = GLOSSARY.filter(g => {
    const matchesCat = activeFilter === "all" || g.cat[lang] === activeFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || g.term.toLowerCase().includes(q) || g.def[lang].toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"50vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{lang==="en"?"Industry Glossary":"Glossaire de l'industrie"}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,6.5rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>
            {lang==="en" ? "Know the language." : "Connaître le vocabulaire."}
          </h1>
          <h2 className="fu2" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4rem)", color:C.orange, lineHeight:0.95, marginBottom:"2rem" }}>
            {lang==="en" ? "Food, CPG & Fashion." : "Alimentaire, CPG et mode."}
          </h2>
          <p className="fu3" style={{ color:"rgba(255,255,255,0.6)", fontSize:"1rem", lineHeight:1.75, maxWidth:"520px" }}>
            {lang==="en"
              ? "A practical reference for the certifications, terms, and concepts that come up in food manufacturing, CPG, and fashion recruiting."
              : "Une référence pratique pour les certifications, termes et concepts qui reviennent dans le recrutement en fabrication alimentaire, CPG et mode."}
          </p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          {/* Filters + search */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2.5rem", flexWrap:"wrap", gap:"1.5rem" }}>
            <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
              <button onClick={() => setActiveFilter("all")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color: activeFilter==="all" ? C.orange : C.muted, borderBottom: activeFilter==="all" ? `1px solid ${C.orange}` : "1px solid transparent", paddingBottom:"2px" }}>
                {lang==="en"?"All":"Tout"}
              </button>
              {cats.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color: activeFilter===cat ? C.orange : C.muted, borderBottom: activeFilter===cat ? `1px solid ${C.orange}` : "1px solid transparent", paddingBottom:"2px" }}>
                  {cat}
                </button>
              ))}
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang==="en"?"Search terms...":"Rechercher..."}
              style={{ padding:"7px 12px", border:`1px solid ${C.rule}`, fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.06em", color:C.ink, outline:"none", background:"transparent", width:"180px" }}
              onFocus={e => e.target.style.borderColor=C.orange}
              onBlur={e => e.target.style.borderColor=C.rule}
            />
          </div>

          <Divider style={{ marginBottom:"0" }} />

          {filtered.length === 0 && (
            <div style={{ padding:"4rem 0", textAlign:"center" }}>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"1rem", color:C.muted, fontStyle:"italic" }}>
                {lang==="en" ? `No terms found for "${search}".` : `Aucun terme trouvé pour « ${search} ».`}
              </p>
            </div>
          )}

          {filtered.map((item, i) => (
            <div key={item.term} style={{ padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.15rem", color:C.ink, letterSpacing:"-0.01em" }}>{item.term}</h2>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, border:`1px solid ${C.orange}20`, padding:"3px 8px", background:C.orange+"10", flexShrink:0 }}>{item.cat[lang]}</span>
              </div>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{item.def[lang]}</p>
            </div>
          ))}

          <div style={{ marginTop:"4rem", padding:"2.5rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.muted, lineHeight:1.7, marginBottom:"1.25rem" }}>
              {lang==="en"
                ? "Have a term you'd like us to add? Or want to talk about a role that requires any of this expertise?"
                : "Un terme que tu aimerais qu'on ajoute? Ou tu veux parler d'un rôle qui exige une de ces expertises?"}
            </p>
            <button className="btn-ink" onClick={() => setPage("contact")}>
              {lang==="en"?"Get in Touch":"Nous contacter"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MARKET PAGE ──────────────────────────────────────────────────────────────
function MarketPage({ lang, setPage, market }) {
  const t = MARKETS[market][lang];
  const recruiters = MARKETS[market].recruiters.map(name => TEAM.find(m => m.name === name)).filter(Boolean);

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ maxWidth:"900px" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,6.5rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1.8rem,4vw,4rem)", color:C.orange, lineHeight:0.95, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.75, maxWidth:"560px", marginBottom:"2.5rem" }}>{t.sub}</p>
          <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>

      {/* About the market */}
      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"3rem" }} />
          <p style={{ fontFamily:"'Spectral',serif", fontSize:"1.05rem", color:C.muted, lineHeight:1.9, fontWeight:300, marginBottom:"4rem" }}>{t.about}</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", background:C.rule, marginBottom:"4rem" }} className="two-col">
            {[{h:t.foodH,p:t.foodP,pg:"food"},{h:t.fashH,p:t.fashP,pg:"fashion"}].map(s => (
              <button key={s.pg} onClick={() => setPage(s.pg)} style={{ background:C.white, padding:"2.5rem", textAlign:"left", transition:"background 0.2s", width:"100%" }}
                onMouseEnter={e => e.currentTarget.style.background=C.paperDark}
                onMouseLeave={e => e.currentTarget.style.background=C.white}
              >
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.75rem" }}>{s.h}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.muted, lineHeight:1.75, marginBottom:"1.5rem" }}>{s.p}</p>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange }}>{lang==="en"?"Learn more →":"En savoir plus →"}</span>
              </button>
            ))}
          </div>

          {/* Recruiters */}
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"2rem" }}>{t.recruiterH}</h2>
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", marginBottom:"4rem" }}>
            {recruiters.map(m => (
              <div key={m.name} style={{ background:C.ink, padding:"1.75rem", borderTop:`3px solid ${C.orange}`, flex:"1 1 220px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem" }}>
                  <Avatar m={m} size={56} />
                  <div>
                    <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"0.9rem", color:"#fff" }}>{m.name}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, marginTop:"2px" }}>{m.title[lang]}</div>
                  </div>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{m.sector[lang]}</p>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"5px", fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginTop:"1rem", borderBottom:`1px solid rgba(255,255,255,0.15)`, paddingBottom:"2px" }}><LinkedInIcon />LinkedIn</a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ background:C.paperDark, padding:"2.5rem", borderLeft:`3px solid ${C.orange}` }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginBottom:"0.5rem" }}>{lang==="en"?"Office":"Bureau"}</div>
            <a href={`tel:+1${t.phone.replace(/\D/g,"")}`} style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:C.ink, marginBottom:"0.35rem", fontWeight:500, textDecoration:"none" }}>{t.phone}</a>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:C.muted, marginBottom:"1.5rem" }}>{t.addr}</div>
            <button className="btn-ink" onClick={() => setPage("contact")}>{t.cta}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── STARTUP / GREENFIELD PAGE ────────────────────────────────────────────────
function StartupPage({ lang, setPage }) {
  const t = {
    en: {
      eyebrow: "Startups & Greenfield Facilities, Quebec, Ontario & Atlantic Canada",
      h1: "You're building something.",
      h1i: "You need the right people. Fast.",
      sub: "Launching a new food facility or scaling a CPG brand is a different challenge than filling a single vacancy. You need multiple key hires, in the right sequence, before your production line goes live. We've done this. We know how to help.",
      diffH: "Why this is different from a standard search.",
      diff1h: "Multiple roles, one critical timeline",
      diff1p: "A greenfield facility doesn't wait. Your plant manager needs to be in place before you hire the quality director. Your quality director needs to be in place before SQF certification begins. The sequence matters as much as the hires. We manage the pipeline, not just individual searches.",
      diff2h: "No HR infrastructure yet",
      diff2p: "Most startups and new facilities don't have a full HR team in place when they start recruiting. We act as an extension of your leadership, helping define roles, structure compensation, and build a team from scratch without the usual internal support.",
      diff3h: "The right network for emerging companies",
      diff3p: "Established food professionals who want to join a startup or greenfield operation are a specific profile. They want to build something, not just run something. We know who they are. They're not the same candidates you'd target for a replacement search at an established manufacturer.",
      diff4h: "You can't afford a bad hire at launch",
      diff4p: "In a mature operation, a bad hire is costly. At a startup or greenfield facility, a bad hire in a key leadership role can derail an entire launch timeline. The stakes are higher and our process reflects that.",
      rolesH: "Roles we typically fill for startups and greenfield operations.",
      roles: [
        "General Manager / Site Director",
        "Plant Manager",
        "Director of Quality & Food Safety",
        "Director of Operations",
        "Supply Chain Director",
        "Head of Production",
        "Food Safety Manager",
        "Procurement Manager",
        "VP Sales (Food Service or Retail)",
        "Account Manager",
        "R&D Director",
        "HR Manager",
      ],
      processH: "How we work with startups and new facilities.",
      steps: [
        { n:"01", h:"Discovery call", p:"We learn your business model, your timeline, your funding stage, and what you're building. This is not a standard recruiter intake call. We want to understand the vision so we can find people who want to be part of it." },
        { n:"02", h:"Role sequencing", p:"We help you figure out which hires need to happen first, second, and third, based on your production timeline, regulatory requirements, and team structure. This is where our industry knowledge pays off." },
        { n:"03", h:"Targeted search", p:"We go into our network specifically for candidates who have done this before, people who've launched facilities, built teams from scratch, or come from a scale-up environment. Different profile than a standard search." },
        { n:"04", h:"Ongoing partnership", p:"We don't disappear after the first placement. Startups and greenfield operations often need multiple hires over 6 to 18 months. We stay close, adapt as the company evolves, and build the team with you." },
      ],
      whoH: "Who we work with.",
      who1h: "Food & CPG startups", who1p: "Emerging brands that have moved past early stage and are scaling production, natural foods, functional beverages, plant-based, specialty CPG. Companies that need their first real leadership team.",
      who2h: "Greenfield facilities", who2p: "New food manufacturing sites being built or commissioned in Ontario and Quebec. We've worked with facilities in Hamilton, Strathroy, and across the GTA corridor that needed to build leadership teams before production start.",
      who3h: "PE-backed acquisitions", who3p: "Private equity firms or strategic acquirers who've bought a food company and need to rebuild or upgrade the management team. We understand the urgency and the specific profile these situations require.",
      ctaH: "Building a team from scratch is exactly what we're built for.",
      ctaP: "Tell us what you're building. We'll tell you how we can help.",
      cta: "Let's Talk",
      blogH: "Related reading.",
    },
    fr: {
      eyebrow: "Startups & Installations greenfield, Québec, Ontario et Atlantique",
      h1: "Tu bâtis quelque chose.",
      h1i: "T'as besoin des bonnes personnes. Vite.",
      sub: "Lancer une nouvelle installation alimentaire ou faire croître une marque CPG est un défi fondamentalement différent de combler un poste vacant. Tu as besoin de plusieurs embauches clés, dans le bon ordre, avant que ta ligne de production soit en marche. On a fait ça. On sait comment aider.",
      diffH: "Pourquoi c'est différent d'une recherche standard.",
      diff1h: "Plusieurs rôles, une échéance critique",
      diff1p: "Une installation greenfield n'attend pas. Ton directeur d'usine doit être en place avant que tu embauches le directeur qualité. Ton directeur qualité doit être en place avant que la certification SQF commence. La séquence compte autant que les embauches. On gère le pipeline, pas juste des recherches individuelles.",
      diff2h: "Pas encore d'infrastructure RH",
      diff2p: "La plupart des startups et nouvelles installations n'ont pas d'équipe RH complète en place quand elles commencent à recruter. On agit comme une extension de ton leadership, aidant à définir les rôles, structurer la rémunération et bâtir une équipe de zéro sans le soutien interne habituel.",
      diff3h: "Le bon réseau pour les compagnies émergentes",
      diff3p: "Les professionnels alimentaires établis qui veulent rejoindre une startup ou une installation greenfield sont un profil spécifique. Ils veulent bâtir quelque chose, pas juste gérer quelque chose. On sait qui ils sont. Ce ne sont pas les mêmes candidats que tu ciblerais pour un remplacement dans un fabricant établi.",
      diff4h: "Tu ne peux pas te permettre une mauvaise embauche au lancement",
      diff4p: "Dans une opération mature, une mauvaise embauche est coûteuse. Dans une startup ou une installation greenfield, une mauvaise embauche dans un rôle de leadership clé peut dérailler tout un calendrier de lancement. Les enjeux sont plus élevés et notre processus le reflète.",
      rolesH: "Rôles qu'on comble typiquement pour les startups et opérations greenfield.",
      roles: [
        "Directeur général / Directeur de site",
        "Directeur d'usine",
        "Directeur qualité et salubrité alimentaire",
        "Directeur des opérations",
        "Directeur chaîne d'approvisionnement",
        "Responsable de production",
        "Responsable salubrité alimentaire",
        "Directeur approvisionnement",
        "VP Ventes (service alimentaire ou détail)",
        "Chargé de compte",
        "Directeur R&D",
        "Directeur ressources humaines",
      ],
      processH: "Comment on travaille avec les startups et nouvelles installations.",
      steps: [
        { n:"01", h:"Appel de découverte", p:"On apprend ton modèle d'affaires, ton échéancier, ton stade de financement et ce que tu bâtis. Ce n'est pas un appel de prise en charge standard de recruteur. On veut comprendre la vision pour pouvoir trouver des gens qui veulent en faire partie." },
        { n:"02", h:"Séquençage des rôles", p:"On t'aide à déterminer quelles embauches doivent se faire en premier, deuxième et troisième, basé sur ton calendrier de production, tes exigences réglementaires et ta structure d'équipe. C'est là que notre connaissance de l'industrie rapporte." },
        { n:"03", h:"Recherche ciblée", p:"On va dans notre réseau spécifiquement pour des candidats qui ont fait ça avant, des gens qui ont lancé des installations, bâti des équipes de zéro ou venu d'un environnement de scale-up. Profil différent d'une recherche standard." },
        { n:"04", h:"Partenariat continu", p:"On ne disparaît pas après le premier placement. Les startups et opérations greenfield ont souvent besoin de plusieurs embauches sur 6 à 18 mois. On reste proche, on s'adapte à mesure que la compagnie évolue et on bâtit l'équipe avec toi." },
      ],
      whoH: "Avec qui on travaille.",
      who1h: "Startups alimentaires & CPG", who1p: "Marques émergentes qui ont dépassé le stade précoce et qui font croître leur production, aliments naturels, boissons fonctionnelles, plant-based, CPG spécialisé. Compagnies qui ont besoin de leur première vraie équipe de leadership.",
      who2h: "Installations greenfield", who2p: "Nouveaux sites de fabrication alimentaire en construction ou mise en service en Ontario et Québec. On a travaillé avec des installations à Hamilton, Strathroy et dans tout le couloir du Grand Toronto qui avaient besoin de bâtir des équipes de leadership avant le démarrage de la production.",
      who3h: "Acquisitions par PE", who3p: "Firmes de capital-investissement ou acquéreurs stratégiques qui ont acheté une compagnie alimentaire et ont besoin de reconstruire ou mettre à niveau l'équipe de direction. On comprend l'urgence et le profil spécifique que ces situations exigent.",
      ctaH: "Bâtir une équipe de zéro, c'est exactement pour ça qu'on est faits.",
      ctaP: "Dis-nous ce que tu bâtis. On te dira comment on peut aider.",
      cta: "Parlons-en",
      blogH: "Articles reliés.",
    },
  }[lang];

  const relatedPosts = ["penurie-main-oeuvre-alimentaire","recrutement-passif","onboarding-nouveau-directeur","salaires-alimentaire-canada-2026"];

  return (
    <div>
      {/* Hero */}
      <section style={{ background:C.ink, minHeight:"70vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        {/* Background number */}
        <div style={{ position:"absolute", right:"2rem", bottom:"2rem", fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(8rem,20vw,18rem)", fontWeight:700, color:"rgba(232,93,26,0.06)", lineHeight:1, userSelect:"none", letterSpacing:"-0.05em" }}>01</div>

        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.92, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:C.orange, lineHeight:0.95, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.8, maxWidth:"580px", marginBottom:"2.5rem" }}>{t.sub}</p>
          <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>

      {/* Why different */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"The challenge":"Le défi"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.diffH}</h2>
          <Divider style={{ marginBottom:"0" }} />
          {[
            [t.diff1h, t.diff1p, "01"],
            [t.diff2h, t.diff2p, "02"],
            [t.diff3h, t.diff3p, "03"],
            [t.diff4h, t.diff4p, "04"],
          ].map(([h, p, n]) => (
            <div key={n} style={{ display:"grid", gridTemplateColumns:"60px 1fr", gap:"2rem", padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"2rem", fontWeight:700, color:C.orange, letterSpacing:"-0.03em", lineHeight:1 }}>{n}</div>
              <div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.15rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we work with */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Our clients":"Nos clients"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.whoH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"2px", background:C.rule }}>
            {[
              [t.who1h, t.who1p],
              [t.who2h, t.who2p],
              [t.who3h, t.who3p],
            ].map(([h, p]) => (
              <div key={h} style={{ background:C.white, padding:"2.5rem 2rem" }}>
                <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"What we fill":"Ce qu'on comble"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.rolesH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"0", border:`1px solid ${C.rule}` }}>
            {t.roles.map((r, i) => (
              <div key={r} style={{ padding:"1rem 1.5rem", borderRight:(i+1)%3!==0?`1px solid ${C.rule}`:"none", borderBottom:`1px solid ${C.rule}`, fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.ink, display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ color:C.orange, fontSize:"0.7rem", flexShrink:0 }}>▸</span>{r}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ background:C.ink, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow style={{ color:"rgba(255,255,255,0.4)" }}>{lang==="en"?"Our approach":"Notre approche"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:"#fff", marginBottom:"3rem" }}>{t.processH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"2px", background:"rgba(255,255,255,0.05)" }}>
            {t.steps.map(s => (
              <div key={s.n} style={{ background:C.inkLight, padding:"2.5rem 2rem" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"2.5rem", fontWeight:700, color:C.orange, letterSpacing:"-0.03em", lineHeight:1, marginBottom:"1.5rem" }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1rem", color:"#fff", letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{s.h}</h3>
                <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.85rem", lineHeight:1.75 }}>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related blog posts */}
      <section style={{ background:C.paperDark, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{t.blogH}</Eyebrow>
          <Divider style={{ marginBottom:"0" }} />
          {POSTS.filter(p => relatedPosts.includes(p.id)).map((post, i) => (
            <div key={post.id}>
              <button onClick={() => setPage("blog")} style={{
                width:"100%", display:"grid", gridTemplateColumns:"40px 1fr auto",
                gap:"1.5rem", alignItems:"center", padding:"1.5rem 0", textAlign:"left",
                transition:"opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.65"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.orange }}>0{i+1}</span>
                <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(0.95rem,2vw,1.1rem)", color:C.ink, letterSpacing:"-0.01em" }}>{post.title[lang]}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.muted, whiteSpace:"nowrap" }}>{post.date}</span>
              </button>
              <Divider />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.orange, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"3rem" }}>
          <div>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,5vw,3.5rem)", color:"#fff", letterSpacing:"-0.03em", lineHeight:1, marginBottom:"0.75rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", maxWidth:"400px", lineHeight:1.7 }}>{t.ctaP}</p>
          </div>
          <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"14px 32px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >{t.cta}</button>
        </div>
      </section>
    </div>
  );
}

// ─── SIMON PAGE ───────────────────────────────────────────────────────────────
function SimonPage({ lang, setPage }) {
  const simonPosts = POSTS.filter(p =>
    ["recrutement-passif","agisme-recrutement","erreurs-offre-emploi","marche-alimentaire-2026",
     "combien-coute-recruteur","processus-entrevue-trop-long","salaires-alimentaire-canada-2026",
     "penurie-main-oeuvre-alimentaire","onboarding-nouveau-directeur"].includes(p.id)
  );

  const t = {
    en:{
      eyebrow:"Simon St-Amand, President, Proforce Personnel",
      h1:"He applied to Proforce.", h1i:"They didn't call him back.", h1ii:"Now he runs it.",
      story1:"Simon St-Amand didn't grow up thinking he'd become a recruiter. He grew up watching his grandfather, the man who opened the first TV store in his village, build something from nothing. That stayed with him. He played football through CÉGEP, then spent five years coaching at the high school level, winning two Bols d'Or. Two provincial championships. He learned early what it means to be accountable to a team.",
      story2:"Before Proforce, Simon recruited for retail at Parcours (Boutiques Séduction), placed temporary workers at Travail Global, then moved into the food industry with Alimentation Maison, covering Montreal and the South Shore in sales coaching and recruiting. He joined Proforce in 2015 under David Inzlicht and Christopher Livingstone. When he first applied, he didn't even get a callback. He applied again. He got in. Once inside, he didn't just fill a role, he built one. He founded Proforce's food division from scratch, opened Ontario and the Maritimes as new territories, built the team that runs those markets today, and became President and shareholder in 2018.",
      story3:"Today Proforce's food practice covers Quebec, Ontario, the Maritimes, and cross-border US mandates. Simon leads business development, manages senior mandates in food and fashion, and is proudest of the management teams he's built, including at Levitts and Ferme Trudeau. His standard is simple: less than two years in role is a failure. The guarantee starts at 90 days and goes up to a year. He treats every client mandate like it's his own business. Because that's how he'd want to be treated.",
      philH:"How Simon recruits.",
      p1h:"Honesty above everything", p1p:"Simon tells you what you need to hear. If your salary range is out of market, he says it before the search starts. If a search is harder than expected, he says that too. No false promises, no padded timelines. That's it.",
      p2h:"He treats your mandate like his own business", p2p:"When Simon takes a mandate, he's not filling a slot. He's thinking about who this person needs to be, what they need to succeed, and whether this placement will hold. His internal standard: less than two years in role is a failure.",
      p3h:"Specialists don't pretend", p3p:"Simon recruits in meats, ready-to-eat, dairy, and food manufacturing. That's it. He doesn't pretend to know sectors he doesn't know. The people who bother him most are the ones with no experience who position themselves as specialists. He's been in the same niche for over a decade. That's different.",
      artH:"From Simon's desk.",
      conH:"Connect with Simon.",
      conP:"Whether you're hiring, looking, or just want to talk about what's happening in food and CPG right now, Simon is easy to reach.",
      cta:"Book a Call with Simon", cta2:"Send a Message",
    },
    fr:{
      eyebrow:"Simon St-Amand, Président, Proforce Personnel",
      h1:"Il a appliqué à Proforce.", h1i:"Ils ne l'ont pas rappelé.", h1ii:"Maintenant il dirige la compagnie.",
      story1:"Simon St-Amand n'a pas grandi en pensant qu'il deviendrait recruteur. Il a grandi en regardant son grand-père, l'homme qui a ouvert le premier magasin de télévision dans son village, bâtir quelque chose de rien. Ça l'a marqué. Il a joué au football jusqu'au niveau collégial, puis a passé cinq ans à coacher au secondaire, remportant deux Bols d'Or. Deux championnats provinciaux. Il a appris tôt ce que ça veut dire d'être imputable envers une équipe.",
      story2:"Avant Proforce, Simon a recruté pour le détail chez Parcours (Boutiques Séduction), placé des travailleurs temporaires chez Travail Global, puis s'est dirigé vers l'industrie alimentaire avec Alimentation Maison, couvrant Montréal et la Rive-Sud en coaching de ventes et recrutement. Il a rejoint Proforce en 2015 sous David Inzlicht et Christopher Livingstone. La première fois qu'il a appliqué, il ne s'est même pas fait rappeler. Il a appliqué encore. Il est rentré. Une fois à l'intérieur, il n'a pas juste comblé un rôle, il en a bâti un. Il a fondé la division alimentaire de Proforce de zéro, ouvert l'Ontario et les Maritimes comme nouveaux territoires, bâti l'équipe qui gère ces marchés aujourd'hui, et est devenu Président et actionnaire en 2018.",
      story3:"Aujourd'hui la pratique alimentaire de Proforce couvre le Québec, l'Ontario, les Maritimes et des mandats trans-frontaliers américains. Simon dirige le développement des affaires, gère des mandats séniors dans l'alimentaire et la mode, et est le plus fier des équipes de direction qu'il a bâties, notamment chez Levitts et Ferme Trudeau. Sa barre est simple : moins de deux ans en poste, c'est un échec. La garantie commence à 90 jours et va jusqu'à un an. Il traite chaque mandat client comme si c'était sa propre entreprise. Parce que c'est comme ça qu'il voudrait être traité.",
      philH:"Comment Simon recrute.",
      p1h:"L'honnêteté avant tout", p1p:"Simon te dit ce que tu as besoin d'entendre. Si ta fourchette salariale est hors marché, il le dit avant de commencer la recherche. Si un mandat est plus difficile que prévu, il le dit aussi. Pas de fausses promesses, pas de délais gonflés.",
      p2h:"Il traite ton mandat comme sa propre business", p2p:"Quand Simon prend un mandat, il ne comble pas un poste. Il réfléchit à qui cette personne doit être, ce dont elle a besoin pour réussir, et si ce placement va tenir. Sa barre interne : moins de deux ans en poste, c'est un échec.",
      p3h:"Les spécialistes ne font pas semblant", p3p:"Simon recrute dans les viandes, les prêts-à-manger, le laitier et la fabrication alimentaire. C'est tout. Il ne fait pas semblant de connaître des secteurs qu'il ne connaît pas. Ce qui l'énerve le plus, ce sont les gens sans expérience qui se positionnent comme spécialistes. Lui est dans la même niche depuis plus de dix ans. C'est différent.",
      artH:"Du bureau de Simon.",
      conH:"Connecte avec Simon.",
      conP:"Que tu recrutes, que tu cherches, ou que tu veuilles juste parler de ce qui se passe dans l'alimentaire et le CPG en ce moment, Simon est facile à joindre.",
      cta:"Réserver un appel avec Simon", cta2:"Envoyer un message",
    },
  }[lang];

  return (
    <div>
      {/* Hero */}
      <section style={{ background:C.ink, minHeight:"75vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ position:"absolute", right:"-1rem", bottom:"-2rem", fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(10rem,25vw,22rem)", fontWeight:700, color:"rgba(232,93,26,0.05)", lineHeight:1, userSelect:"none", letterSpacing:"-0.05em" }}>SS</div>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ width:"40px", height:"3px", background:C.orange, marginBottom:"2rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:"clamp(3rem,8vw,7rem)", letterSpacing:"-0.03em", color:"#fff", lineHeight:0.9, marginBottom:"0.5rem" }}>{t.h1}</h1>
          <h2 style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:"rgba(255,255,255,0.45)", lineHeight:0.95, marginBottom:"0.5rem" }}>{t.h1i}</h2>
          <h2 style={{ fontFamily:"'Spectral',serif", fontWeight:300, fontStyle:"italic", fontSize:"clamp(2rem,5vw,5rem)", color:C.orange, lineHeight:0.95 }}>{t.h1ii}</h2>
        </div>
      </section>

      {/* Story */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"3rem" }} />
          {[t.story1, t.story2, t.story3].map((para, i) => (
            <p key={i} style={{ fontFamily:"'Spectral',serif", fontSize:"1.05rem", lineHeight:1.9, color:C.inkLight, fontWeight:300, marginBottom:"1.75rem" }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Philosophy":"Philosophie"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:C.ink, marginBottom:"3rem" }}>{t.philH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"3rem" }}>
            {[[t.p1h,t.p1p,"01"],[t.p2h,t.p2p,"02"],[t.p3h,t.p3p,"03"]].map(([h,p,n]) => (
              <div key={n}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.15em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section style={{ background:C.ink, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"The people who shaped me":"Les gens qui m'ont formé"}</Eyebrow>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.03em", color:"#fff", marginBottom:"4rem" }}>
            {lang==="en" ? "Nobody does this alone." : "Personne ne fait ça seul."}
          </h2>

          {/* Christopher Livingstone */}
          <div style={{ borderLeft:`3px solid ${C.orange}`, paddingLeft:"2rem", marginBottom:"3.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
              <div style={{ width:"44px", height:"44px", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Clash Display',sans-serif", fontSize:"0.9rem", color:"#fff", fontWeight:700, flexShrink:0 }}>CL</div>
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.05rem", color:"#fff" }}>Christopher Livingstone</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, marginTop:"2px" }}>
                  {lang==="en"?"Recruitment Mentor":"Mentor en recrutement"}
                </div>
              </div>
              <a href="https://www.linkedin.com/in/chrislivingstone" target="_blank" rel="noopener noreferrer" style={{
                marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:"5px",
                fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.35)", borderBottom:"1px solid rgba(255,255,255,0.15)", paddingBottom:"2px", transition:"color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.color=C.orange}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}
              ><LinkedInIcon />LinkedIn</a>
            </div>
            <p style={{ fontFamily:"'Spectral',serif", fontSize:"1rem", color:"rgba(255,255,255,0.65)", lineHeight:1.85, fontWeight:300 }}>
              {lang==="en"
                ? "Christopher hired me. He's the one who took a chance on me when I didn't have a recruitment background, and he taught me everything about this business, how to build relationships, how to have the right conversations, how to actually help people instead of just filling roles. Everything I know about recruiting, I learned from watching him and listening to him. I don't take that lightly."
                : "C'est Christopher qui m'a embauché. C'est lui qui a pris une chance sur moi quand j'avais pas de background en recrutement, et c'est lui qui m'a tout appris sur ce métier, comment bâtir des relations, comment avoir les bonnes conversations, comment vraiment aider des gens plutôt que juste combler des postes. Tout ce que je sais sur le recrutement, je l'ai appris en le regardant faire et en l'écoutant. Je prends pas ça à la légère."
              }
            </p>
          </div>

          {/* David Inzlicht */}
          <div style={{ borderLeft:`3px solid rgba(255,255,255,0.15)`, paddingLeft:"2rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
              <div style={{ width:"44px", height:"44px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Clash Display',sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.6)", fontWeight:700, flexShrink:0 }}>DI</div>
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.05rem", color:"#fff" }}>David Inzlicht</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>
                  {lang==="en"?"Business Mentor, Founder, Proforce Personnel":"Mentor en affaires, Fondateur, Proforce Personnel"}
                </div>
              </div>
            </div>
            <p style={{ fontFamily:"'Spectral',serif", fontSize:"1rem", color:"rgba(255,255,255,0.55)", lineHeight:1.85, fontWeight:300 }}>
              {lang==="en"
                ? "David founded Proforce in 2001 and built it into what it was when I joined. When he handed me the keys in 2018, he didn't just give me a company, he gave me a model for how to run a business with integrity. David taught me that the way you treat people, clients and candidates alike, is the business. Not a value. The business. I think about that a lot."
                : "David a fondé Proforce en 2001 et l'a bâtie pour en faire ce qu'elle était quand je l'ai rejointe. Quand il m'a remis les clés en 2018, il m'a pas juste donné une compagnie, il m'a donné un modèle pour diriger un business avec intégrité. David m'a appris que la façon dont tu traites les gens, clients et candidats pareil, c'est le business. Pas une valeur. Le business. Je pense à ça souvent."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Press mention on Simon page */}
      <section style={{ background:C.paperDark, padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"In the Media":"Dans les médias"}</Eyebrow>
          <Divider style={{ marginBottom:"0" }} />
          {PRESS.map(item => (
            <div key={item.id} style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:"1.5rem", alignItems:"center", padding:"1.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <span style={{ width:"18px", height:"2px", background:C.orange, display:"block" }} />
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.2rem" }}>{item.title[lang]}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.muted }}>{item.outlet} · {item.date}</div>
              </div>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, whiteSpace:"nowrap" }}>
                  {lang==="en"?"Listen →":"Écouter →"}
                </a>
              )}
            </div>
          ))}
          <div style={{ marginTop:"1.5rem" }}>
            <button onClick={() => setPage("press")} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
              {lang==="en"?"All media mentions →":"Toutes les mentions médias →"}
            </button>
          </div>
        </div>
      </section>

      {/* Personal section */}
      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Outside the office":"En dehors du bureau"}</Eyebrow>
          <Divider style={{ marginBottom:"2.5rem" }} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem" }} className="two-col">
            <div>
              <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
              <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.6rem" }}>
                {lang==="en"?"Coach, Football & Softball":"Coach, Football & Balle-molle"}
              </h3>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.8, fontWeight:300 }}>
                {lang==="en"
                  ? "Simon coached high school football for five years and won two Bols d'Or, provincial championships. He's been coaching softball for ten years. The same things that make a good team make a good recruitment: clear roles, honest feedback, and people who show up when it counts."
                  : "Simon a coaché le football au secondaire pendant cinq ans et remporté deux Bols d'Or, des championnats provinciaux. Il coache la balle-molle depuis dix ans. Ce qui fait une bonne équipe, c'est ce qui fait un bon recrutement : des rôles clairs, du feedback honnête et des gens qui se présentent quand ça compte."}
              </p>
            </div>
            <div>
              <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
              <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.6rem" }}>
                {lang==="en"?"Father of three":"Père de trois filles"}
              </h3>
              <p style={{ fontFamily:"'Spectral',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.8, fontWeight:300 }}>
                {lang==="en"
                  ? "Simon had his first daughter at 19. He learned quickly what it means to be responsible for someone else. She's 17 now and competes in softball and flag football at a high level. He has two more daughters, one is four, one is five weeks old. He built his career the same way he built his family: with urgency, with intention, and without shortcuts."
                  : "Simon a eu sa première fille à 19 ans. Il a appris rapidement ce que ça veut dire d'être responsable de quelqu'un d'autre. Elle a 17 ans maintenant et compétitionne en balle-molle et flag football à un niveau élevé. Il a deux autres filles, une de 4 ans et une de 5 semaines. Il a bâti sa carrière comme il a bâti sa famille : avec urgence, avec intention, et sans raccourcis."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Eyebrow>{t.artH}</Eyebrow>
          <Divider style={{ marginBottom:"0" }} />
          {simonPosts.map((post, i) => (
            <div key={post.id}>
              <button onClick={() => setPage("blog")} style={{
                width:"100%", display:"grid", gridTemplateColumns:"40px 1fr auto",
                gap:"1.5rem", alignItems:"center", padding:"1.5rem 0", textAlign:"left", transition:"opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.65"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color:C.orange }}>0{i+1}</span>
                <div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(0.9rem,2vw,1.05rem)", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.2rem" }}>{post.title[lang]}</div>
                  <div style={{ fontFamily:"'Spectral',serif", fontSize:"0.83rem", color:C.muted, fontStyle:"italic" }}>{post.excerpt[lang]}</div>
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted, whiteSpace:"nowrap" }}>{post.date}</span>
              </button>
              <Divider />
            </div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section style={{ background:C.ink, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <Eyebrow>{t.conH}</Eyebrow>
          <p style={{ fontFamily:"'Spectral',serif", fontSize:"1.1rem", color:"rgba(255,255,255,0.65)", lineHeight:1.8, marginBottom:"3rem", maxWidth:"520px" }}>{t.conP}</p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", alignItems:"center", marginBottom:"2.5rem" }}>
            <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer" className="btn-orange" onClick={() => track.contactClick()}>{t.cta}</a>
            <button className="btn-ghost" onClick={() => setPage("contact")} style={{ borderColor:"rgba(255,255,255,0.25)", color:"#fff" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
            >{t.cta2}</button>
          </div>
          <a href="https://www.linkedin.com/in/simonstamand" target="_blank" rel="noopener noreferrer" style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.4)", borderBottom:"1px solid rgba(255,255,255,0.15)", paddingBottom:"2px", transition:"color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color=C.orange}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.4)"}
          >
            <LinkedInIcon /> LinkedIn, Simon St-Amand
          </a>
        </div>
      </section>
    </div>
  );
}

  const pages = {
    home:       <HomePage lang={lang} setPage={go} />,
    food:       <SectorPage lang={lang} setPage={go} sector="food" />,
    fashion:    <SectorPage lang={lang} setPage={go} sector="fashion" />,
    featured:   <FeaturedCandidatesPage lang={lang} setPage={go} />,
    employers:  <EmployersPage lang={lang} setPage={go} />,
    referral:   <ReferralPage lang={lang} setPage={go} />,
    startup:    <StartupPage lang={lang} setPage={go} />,
    calculator: <CalculatorPage lang={lang} setPage={go} />,
    howwework:  <HowWeWorkPage lang={lang} setPage={go} />,
    press:      <PressPage lang={lang} setPage={go} />,
    simon:      <SimonPage lang={lang} setPage={go} />,
    about:      <AboutPage lang={lang} />,
    team:       <TeamPage lang={lang} setPage={go} setBlogPost={(id) => goPost(id)} />,
    candidates: <CandidatesPage lang={lang} setPage={go} />,
    jobs:       <JobListingsPage lang={lang} />,
    giving:     <GivingPage lang={lang} />,
    blog:       <BlogPage lang={lang} setPage={go} initialPost={blogPost} onOpenPost={goPost} />,
    glossary:   <GlossaryPage lang={lang} setPage={go} />,
    montreal:   <MarketPage lang={lang} setPage={go} market="montreal" />,
    quebec:     <MarketPage lang={lang} setPage={go} market="quebec" />,
    toronto:    <MarketPage lang={lang} setPage={go} market="toronto" />,
    privacy:    <PrivacyPage lang={lang} setPage={go} />,
    notfound:   <NotFoundPage lang={lang} setPage={go} />,
    contact:    <ContactPage lang={lang} />,
  };

  // Fallback 404 for unknown hash routes
  const currentPage = pages[page] || pages.notfound;

  return (
    <>
      <style>{G}</style>
      <Nav page={page} setPage={go} lang={lang} setLang={setLang} />
      <main style={{ paddingTop:"56px" }}>{currentPage}</main>
      <Footer lang={lang} setPage={go} />

      {/* ── Floating booking widget ── */}
      <a href="YOUR_CALENDLY_LINK" target="_blank" rel="noopener noreferrer"
        onClick={() => track.contactClick()}
        style={{
          position:"fixed", bottom:"2rem", right:"2rem", zIndex:150,
          background:C.orange, color:"#fff",
          padding:"12px 20px",
          fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.75rem",
          letterSpacing:"0.08em", textTransform:"uppercase",
          boxShadow:"0 4px 20px rgba(232,93,26,0.4)",
          display:"flex", alignItems:"center", gap:"8px",
          transition:"transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(232,93,26,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(232,93,26,0.4)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
        </svg>
        {lang==="en"?"Book a 15-min Call":"Réserver 15 min"}
      </a>
    </>
  );
}
