import { useState, useEffect } from "react";

// ─── LIENS EXTERNES ───────────────────────────────────────────────────────────
const CALENDLY = "https://calendly.com/simonstamand/proforce";
const CONTACT_EMAIL = "info@proforce.ca";

// ─── ENVOI DES FORMULAIRES ────────────────────────────────────────────────────
// Remplir les quatre valeurs ci dessous active l'envoi silencieux par EmailJS.
// Tant qu'elles commencent par YOUR_, les formulaires ouvrent plutot le logiciel
// de courriel du visiteur avec le message deja ecrit. Dans les deux cas le
// message part pour vrai: on n'affiche jamais une confirmation sans envoi.
const EMAILJS = {
  serviceId:          "YOUR_SERVICE_ID",
  publicKey:          "YOUR_PUBLIC_KEY",
  contactTemplate:    "YOUR_CONTACT_TEMPLATE_ID",
  referralTemplate:   "YOUR_REFERRAL_TEMPLATE_ID",
  newsletterTemplate: "YOUR_NEWSLETTER_TEMPLATE_ID",
};

const isSet = v => !!v && !String(v).startsWith("YOUR_");
const emailjsReady = template =>
  isSet(EMAILJS.serviceId) && isSet(EMAILJS.publicKey) && isSet(template);

const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

// Retourne "sent" si EmailJS a confirme, "mail" si on a bascule sur le logiciel
// de courriel du visiteur. Leve une erreur si EmailJS refuse, pour qu'on puisse
// le dire au visiteur au lieu de pretendre que c'est parti.
async function sendForm(template, params, fallback) {
  if (emailjsReady(template)) {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: template,
        user_id: EMAILJS.publicKey,
        template_params: params,
      }),
    });
    if (!res.ok) throw new Error(`EmailJS ${res.status}`);
    return "sent";
  }
  const href = `mailto:${CONTACT_EMAIL}`
    + `?subject=${encodeURIComponent(fallback.subject)}`
    + `&body=${encodeURIComponent(fallback.body)}`;
  window.location.href = href;
  return "mail";
}

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
// Deux familles. Playfair Display, un serif a fort contraste, porte les titres
// et les phrases qui doivent peser. Archivo porte le reste: menu, corps de
// texte, etiquettes, boutons. Le contraste entre les deux est le dispositif
// principal de la mise en page, a la place des blocs de couleur.
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Archivo:wght@400;500;600;700&display=swap');
`;

// ─── GLOBAL ───────────────────────────────────────────────────────────────────
const G = `
  ${fonts}
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { font-family:'Archivo',sans-serif; background:${C.paper}; color:${C.ink}; }

  h1,h2,h3 { font-family:'Playfair Display',serif; font-weight:500; letter-spacing:-0.005em; }

  /* Règle typographique */
  .rule { display:block; width:100%; height:1px; background:${C.rule}; }
  .rule-orange { display:block; height:2px; background:${C.orange}; }

  /* Label de section */
  /* Le libelle de section, pose sur un filet qui traverse la largeur. Le filet
     fait le travail que faisait le gros titre: il ouvre la section. */
  .eyebrow {
    font-family:'Archivo',sans-serif; font-size:0.72rem; font-weight:600;
    letter-spacing:0.08em; text-transform:uppercase; color:#c24a10;
    display:block; padding-bottom:0.7rem; margin-bottom:1.4rem;
    border-bottom:2px solid ${C.orange};
  }

  /* Boutons */
  .btn-ink::after, .btn-orange::after, .btn-ghost::after { content:'\\00a0\\00a0↗'; }

  .btn-ink {
    display:inline-block; background:${C.ink}; color:#fff;
    padding:12px 28px; font-family:'Archivo',sans-serif; font-weight:600;
    font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    transition:background 0.2s, transform 0.15s;
  }
  .btn-ink:hover { background:${C.inkLight}; transform:translateY(-2px); }

  .btn-orange {
    display:inline-block; background:#c24a10; color:#fff;
    padding:12px 28px; font-family:'Archivo',sans-serif; font-weight:600;
    font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    transition:background 0.2s, transform 0.15s;
  }
  .btn-orange:hover { background:#a33d0c; transform:translateY(-2px); }

  .btn-ghost {
    display:inline-block; border:1.5px solid ${C.ink}; color:${C.ink};
    padding:11px 28px; font-family:'Archivo',sans-serif; font-weight:600;
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

  /* Le menu complet a besoin d'environ 1180px. En bas de ca on passe au burger,
     sinon le logo colle aux liens et le bouton d'appel sort de l'ecran. */
  @media(max-width:1200px){
    .hide-mobile { display:none !important; }
    .show-mobile { display:flex !important; }
  }
  /* Entre 1200 et 1400 on resserre un peu pour garder de l'air autour du logo. */
  @media(min-width:1201px) and (max-width:1400px){
    .nav-links { gap:1.25rem !important; }
  }

  /* <picture> ne doit pas casser les grilles: il disparait de la mise en page. */
  picture { display:contents; }

  /* ── Listes numerotees ────────────────────────────────────────────────
     Un filet orange a gauche de chaque item et le chiffre en serif. Le
     meme traitement tient en trois colonnes et une fois empile sur
     telephone, donc il n'y a qu'une seule regle a maintenir. */
  .num-list { gap:2rem !important; border:none !important; }
  .num-list > * {
    border:none !important;
    border-left:3px solid ${C.orange} !important;
    padding:0.15rem 0 0.15rem 1.3rem !important;
    background:transparent !important;
  }
  .num-list > * > div:first-child {
    font-family:'Playfair Display',serif !important;
    font-size:1rem !important;
    font-weight:600 !important;
    letter-spacing:0 !important;
    color:#c24a10 !important;
    margin-bottom:0.65rem !important;
  }
  .num-list > * > h3 { margin-bottom:0.7rem !important; }

  @media(max-width:768px){
    /* Les chiffres debordaient de leur colonne et se chevauchaient:
       MTL+TOR a 2.5rem demande plus de largeur qu'une demi colonne de 390px. */
    .stat-band  { padding:3.5rem 1.5rem !important; }
    .proof-row  { grid-template-columns:1fr !important; gap:2.25rem !important; }
    .proof-hero { font-size:4rem !important; }
    .client-grid{ grid-template-columns:repeat(2,1fr) !important; }
    /* En colonne, le flex-basis:0 des images ramenait leur hauteur a zero et
       la bande disparaissait completement du telephone. */
    .photo-band-3 { flex-direction:column !important; }
    .photo-band-3 > * { flex:0 0 auto !important; height:200px !important; }

    /* ── Respiration ────────────────────────────────────────────────────
       6rem en haut et en bas, c'est juste sur un ecran large. Empile sur
       un telephone, ca fait presque 200px de blanc entre deux blocs et la
       page a l'air vide. On exclut les heros, qui ont besoin de leur
       degagement sous le bandeau fixe, et les bandes photo pleine largeur
       qui doivent rester bord a bord. */
    section:not([style*="min-height"]):not(.photo-band-3):not(.band-full) {
      padding-top:3.75rem !important;
      padding-bottom:3.75rem !important;
    }
    /* Meme logique pour les filets: 4rem sous une etiquette, c'est un trou. */
    .rule[style*="margin-bottom: 4rem"],
    .rule[style*="margin-bottom: 3rem"],
    .rule[style*="margin-bottom: 2.5rem"] { margin-bottom:1.75rem !important; }

    /* Sur telephone un carre de 280px mangeait les trois quarts de l'ecran
       avant meme qu'on voie le nom de la personne. */
    .team-photo { max-width:190px !important; }

    .num-list { gap:1.9rem !important; }

    /* Bandeau d'equipe de l'accueil: la vignette et le nom cote a cote
       plutot qu'une petite photo perdue dans la largeur. */
    .team-strip { flex-direction:column !important; }
    .team-strip > * {
      border-right:none !important;
      border-bottom:1px solid ${C.rule} !important;
      display:flex !important; align-items:center !important; gap:1rem !important;
      padding:1.1rem 0 !important;
    }
    .team-strip > *:last-child { border-bottom:none !important; }
    /* Meme piege que la bande photo: en colonne, le flex-basis de 180px
       devient une hauteur minimale et laisse un trou sous chaque nom. */
    .team-strip > * { flex:0 0 auto !important; }
    .team-strip .av { margin-bottom:0 !important; }

    /* Fiches d'equipe: photo et identite sur la meme ligne. */
    .team-identity { display:flex !important; flex-wrap:wrap !important; align-items:center !important; gap:1.1rem !important; }
    .team-identity > .team-photo { flex:0 0 112px !important; max-width:112px !important; margin-bottom:0 !important; }
    .team-identity > div:nth-child(2) { flex:1 1 150px !important; margin-bottom:0 !important; }
    .team-identity > div:nth-child(3) { flex:1 0 100% !important; margin-bottom:0.25rem !important; }

    /* Sur telephone la vignette d'article rendait la ligne trop serree:
       l'article en vedette garde sa grande image, les autres non. */
    /* Sur telephone, trois colonnes laissaient environ 180px au titre, qui
       se cassait tous les trois mots. On empile, et les deux lignes de
       metadonnees passent a l'horizontale. */
    .post-row    { grid-template-columns:1fr !important; gap:0.55rem !important; padding:1.6rem 0 !important; }
    .post-row > :first-child,
    .post-row > :last-child { display:flex !important; align-items:center !important; gap:0.7rem !important; text-align:left !important; }
    .post-row > :first-child > div,
    .post-row > :last-child  > div { margin-top:0 !important; }
    .post-thumb  { display:none !important; }

    .two-col     { grid-template-columns:1fr !important; }
    /* Une fois empile, ce retrait s'ajoutait a l'ecart de la grille et
       creusait un trou entre le titre et le paragraphe. */
    .pt-desk     { padding-top:0 !important; }
    .three-col   { grid-template-columns:1fr !important; }
    /* Sur telephone le filigrane 2001 tombait pile sur l'etiquette du haut. */
    .hero-mark   { top:20vh !important; font-size:7rem !important; }
    .hero-meta   { font-size:0.55rem !important; letter-spacing:0.1em !important; }
    .hide-narrow { display:none !important; }
    /* Le bouton flottant recouvrait le bouton Nous contacter. */
    .float-cta   { bottom:1rem !important; right:1rem !important; left:1rem !important;
                   justify-content:center !important; padding:14px 16px !important; }
    .hero-section { padding-bottom:7.5rem !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name:"Simon St-Amand",   photo:"/equipe/simon-st-amand.jpg", init:"SS", title:{en:"President",fr:"Président"}, sector:{en:"Food / CPG & Fashion",fr:"Alimentaire / CPG & Mode"}, linkedin:"https://www.linkedin.com/in/simonstamand", articles:["dire-non-mandat","clients-qui-reviennent","batir-division-alimentaire","marche-alimentaire-2026","salaires-alimentaire-canada-2026","penurie-main-oeuvre-alimentaire"],
    bio:{en:"Simon has been President and shareholder of Proforce since 2018. He joined in 2015, built the food division from nothing, and opened Ontario and the Maritimes.\n\nSince 2019 he has personally placed more than 100 people, including plant managers, quality directors, sales directors, operations directors and VPs. 78 % of those placements came from clients who were coming back: twenty companies gave him a second search, five gave him five or more.\n\nHe will tell you no before taking a mandate he cannot deliver. It costs him searches. It saves you three months.",
         fr:"Simon est président et actionnaire de Proforce depuis 2018. Il est arrivé en 2015, a fondé la division alimentaire à partir de rien et ouvert l'Ontario et les Maritimes.\n\nDepuis 2019 il a personnellement placé plus de 100 personnes, notamment des directeurs d'usine, des directeurs qualité, des directeurs des ventes, des directeurs et VP des opérations. 78 % de ces placements viennent de clients qui revenaient: vingt entreprises lui ont redonné un mandat, cinq lui en ont confié cinq ou plus.\n\nIl va te dire non avant de prendre un mandat qu'il ne peut pas livrer. Ça lui coûte des mandats. Ça t'évite trois mois perdus."} },
  { name:"Robin Anisef",     photo:"/equipe/robin-anisef.jpg", init:"RA", title:{en:"Partner",fr:"Associée"}, sector:{en:"Fashion & Apparel",fr:"Mode & Habillement"}, linkedin:"https://www.linkedin.com/in/robinanisef", articles:["mode-acheteur-senior","mode-portfolio-designer","mode-montreal-toronto","mode-technicien-patron","calendrier-mode-recrutement","mode-recrutement-canada"],
    bio:{en:"Robin worked in the fashion industry before she moved into recruiting. She understands the business from the inside, not just from a job description.\n\nIn this business most searches are one offs. An agency places someone, the client calls somebody else the following year, and nobody remembers. Robin has a client who has been handing her searches for seven years. Seventeen people placed at the same company.\n\nShe has been recruiting in Canadian fashion for over 20 years. A network like hers across Montreal and Toronto does not get built in two.",
         fr:"Robin a travaillé dans l'industrie de la mode avant de passer au recrutement. Elle comprend le business de l'intérieur, pas juste à travers une description de poste.\n\nDans cette business, la plupart des mandats sont des one shot. Une agence place quelqu'un, le client appelle ailleurs l'année d'après, et personne ne s'en souvient. Robin a un client qui lui confie des mandats depuis sept ans. Dix-sept personnes placées chez la même entreprise.\n\nElle recrute dans la mode canadienne depuis plus de 20 ans. Un réseau comme le sien à Montréal et à Toronto, ça se bâtit pas en deux ans."} },
  { name:"Stéphanie Lanoie", photo:"/equipe/stephanie-lanoie.jpg", init:"SL", title:{en:"Recruiter",fr:"Recruteuse"}, sector:{en:"Food Industry, Quebec",fr:"Alimentaire, Québec"}, linkedin:"https://www.linkedin.com/in/stephanie-lanoie-84a321a4", articles:["preparer-candidat-entrevue","contre-offre","erreurs-offre-emploi","processus-entrevue-trop-long","onboarding-nouveau-directeur","changer-recruteur"],
    bio:{en:"Stéphanie is Proforce's Quebec food industry specialist.\n\nMost agencies chase new logos. Stéphanie has 22 clients, and those 22 clients have given her 70 searches. Six of them gave her five or more. One gave her eleven.\n\nHer candidates are not pulled from a database. She knows the plants and she knows the people inside them, and that is why a client calls her back instead of opening the search to three agencies.",
         fr:"Stéphanie est la spécialiste de l'alimentaire au Québec chez Proforce.\n\nLa plupart des agences courent après des nouveaux logos. Stéphanie a 22 clients, et ces 22 clients lui ont confié 70 mandats. Six d'entre eux lui en ont donné cinq ou plus. Un lui en a donné onze.\n\nSes candidats sortent pas d'une base de données. Elle connaît les usines et elle connaît le monde dedans, et c'est ce qui fait qu'un client la rappelle au lieu d'ouvrir le mandat à trois agences."} },
  { name:"Mathieu Roy",      photo:"/equipe/mathieu-roy.jpg", init:"MR", title:{en:"Senior Recruiter",fr:"Recruteur senior"}, sector:{en:"Food Industry, Quebec",fr:"Alimentaire, Québec"}, linkedin:"https://www.linkedin.com/in/mathieu-roy-453876204/", articles:["quart-de-nuit","recruter-en-region","candidats-disparaissent","quitter-montreal-region","ta-vie-avant-ton-cv","recrutement-passif"],
    bio:{en:"Mathieu chose recruiting to build a career, and he does it by putting people first. For him, a good placement starts with a real conversation, with the candidate as much as with the employer.\n\nAsk a generalist recruiter how many food plant roles he filled this year. For Mathieu it is 31 of his 36 placements. Production managers, quality leads, sales reps, a VP of sales. 78 % of them came from clients who were handing him another search.\n\nHe has lived all over Quebec and knows the small regions as well as the big cities. When a plant outside the major centres needs someone, he understands the local reality and what it takes to convince a candidate to move there.",
         fr:"Mathieu a choisi le recrutement pour s'y bâtir une carrière, et il le fait en mettant l'humain au centre. Pour lui, un bon placement commence par une vraie conversation, avec le candidat comme avec l'employeur.\n\nDemande à un recruteur généraliste combien de postes en usine alimentaire il a comblés cette année. Mathieu, c'est 31 de ses 36 placements. Des gérants de production, des responsables qualité, des représentants, un VP des ventes. 78 % viennent de clients qui lui redonnaient un mandat.\n\nIl a habité un peu partout au Québec et connaît les petites régions aussi bien que les grands centres. Quand une usine en région cherche quelqu'un, il comprend la réalité du coin et ce qu'il faut pour convaincre un candidat de s'y installer."} },
  { name:"Rana Yamak",       photo:"/equipe/rana-yamak.jpg", init:"RY", title:{en:"Recruiter",fr:"Recruteuse"}, sector:{en:"Food & CPG, Canada / US",fr:"Alimentaire & CPG, Canada / É.-U."}, linkedin:"https://www.linkedin.com/in/rana-yamak-13a107250", articles:["recruter-vendeur-ingredients","territoire-ventes","commissions-depart-vendeurs","gestionnaire-comptes-carnet","negocier-offre-emploi","linkedin-profil-alimentaire"],
    bio:{en:"Rana covers the food and CPG market across Ontario and the United States.\n\nShe joined Proforce in November 2025. The median salary on her placements is $100,000, and four of her seven searches were six figure roles. That is not agency volume, that is the top of the market, and it is where she started.\n\nShe works the commercial roles: account management, business development and territory sales, at manufacturers as much as at ingredient distributors. She also covers quality, food safety and operations.",
         fr:"Rana couvre le marché alimentaire et CPG en Ontario et aux États-Unis.\n\nElle est arrivée chez Proforce en novembre 2025. Le salaire médian de ses placements est de 100 000 $ et quatre de ses sept mandats sont à six chiffres. Ça, c'est pas du volume d'agence, c'est le haut du marché, et c'est là qu'elle a commencé.\n\nElle travaille les postes commerciaux: gestion de comptes, développement des affaires et représentation de territoire, chez les fabricants comme chez les distributeurs d'ingrédients. Elle couvre aussi la qualité, la salubrité alimentaire et les opérations."} },
  { name:"Michaela Landers", photo:"/equipe/michaela-landers.jpg", init:"ML", title:{en:"Recruiting Director",fr:"Directrice, recrutement"}, sector:{en:"Food Industry, Ontario",fr:"Alimentaire, Ontario"}, linkedin:"https://www.linkedin.com/in/michaelalanders", articles:["trente-cinq-entreprises","salubrite-poste-sous-estime","retenir-superviseurs-ontario","recruter-ontario-siege-quebec","cv-usine-ce-que-je-vois","trente-questions-avant-chercher"],
    bio:{en:"Michaela leads Proforce's Ontario food manufacturing practice.\n\nThe month a recruiter loses the most time is the first one at a new client: learning the shop, the role, the real need behind the job description. Michaela has done that 35 times in under four years. Thirty five different organizations, thirty five ways of working.\n\nShe covers production, operations and supply chain. She asks her questions before she sends a resume, not after.",
         fr:"Michaela dirige la pratique en fabrication alimentaire en Ontario chez Proforce.\n\nLe moment où un recruteur perd le plus de temps, c'est le premier mois chez un nouveau client: comprendre la shop, le poste, le vrai besoin derrière la description. Michaela a fait ça 35 fois en moins de quatre ans. Trente-cinq organisations différentes, trente-cinq façons de fonctionner.\n\nElle couvre la production, les opérations et la chaîne d'approvisionnement. Elle pose ses questions avant de sortir un CV, pas après."} },
  { name:"Richard Saucier",  photo:"/equipe/richard-saucier.jpg", init:"RS", title:{en:"Senior Advisor, Food Industry",fr:"Conseiller principal, industrie alimentaire"}, sector:{en:"Food Industry, Ontario & Quebec",fr:"Alimentaire, Ontario et Québec"}, linkedin:"https://www.linkedin.com/in/richardsaucier2/", articles:["trente-ans-alimentaire","directeur-usine-ideal","promouvoir-ou-embaucher","references-bien-faites","agisme-recrutement","combien-coute-recruteur"],
    bio:{en:"Richard spent 30 years in the food industry before joining Proforce.\n\nA business developer starting from nothing needs three years to build a book. Richard already knows the people. That is the difference between a prospect list and a contact book.\n\nAt Proforce he works with food companies in Ontario and Quebec on their hiring needs. He opens the mandates, the team delivers them.",
         fr:"Richard a passé 30 ans dans l'industrie alimentaire avant de se joindre à Proforce.\n\nUn développeur d'affaires qui part de zéro met trois ans à se bâtir un carnet. Richard connaît déjà le monde. C'est la différence entre une liste de prospects et un carnet d'adresses.\n\nChez Proforce, il accompagne les entreprises alimentaires de l'Ontario et du Québec dans leurs besoins d'embauche. Il ouvre les mandats, l'équipe les livre."} },
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
  { id:"dire-non-mandat", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Simon St-Amand",
    title:{en:"Why I turn down mandates I could invoice.",fr:"Pourquoi je refuse des mandats que je pourrais facturer."},
    excerpt:{en:"Saying yes to a search we can't deliver costs the client three months. It costs me one invoice.",fr:"Dire oui à un mandat qu'on ne peut pas livrer coûte trois mois au client. Ça me coûte une facture."},
    body:{en:`There are weeks where I turn down more searches than I take on. My competitors find that odd. I understand: a declined mandate is an invoice that won't go out.\n\nI do it anyway, and here's why.\n\nA search we accept without being able to deliver costs the client three times over. They pay in time, because they wait six weeks before realizing nothing is coming. They pay in internal credibility, because they told their team the role would be filled. And they pay in lost options, because meanwhile they didn't try anything else. I pay one invoice. That ratio isn't fair.\n\nHere are the cases where I say no.\n\nWhen the salary doesn't match the profile. If you want a plant manager with fifteen years of experience and your budget is a supervisor's, I'm not going to take your search and hope for a miracle. I'll tell you what the market pays, show you what I'm basing that on, and let you decide. Sometimes the client adjusts. Sometimes not, and we leave it there, no hard feelings.\n\nWhen the role has burned through three people in four years. The problem isn't the candidate pool. If I place a fourth person into a role that ejected three, I'm part of the problem. I'd rather have the conversation about what's actually happening in that job.\n\nWhen it isn't my industry. We do food, CPG and fashion. When someone calls me about a construction or pharmaceutical role, I say no and refer them elsewhere if I know someone. I'm not a generalist and I have no interest in becoming one.\n\nWhen the decision process isn't clear. If nobody can tell me who approves the hire and on what timeline, the search will die at interview three. I'd rather know up front.\n\nAnd when the client wants volume. If you want ten resumes tomorrow morning to compare, there are firms that do that very well. We bring two or three people and we stand behind them.\n\nWhat it produces in the end: eighty three percent of our placements come from clients who had already called us once. Seventy six companies out of a hundred and forty four have given us at least two searches. Nobody gives a second search to a firm that missed the first.\n\nSaying no costs mandates in the short term. It builds the only thing that matters in the long run, which is getting called back.\n\nGot a role and want an honest answer on whether it's doable at the budget you have? Call me. You'll get a straight answer either way.`,
          fr:`Il y a des semaines où je refuse plus de mandats que j'en accepte. Mes compétiteurs trouvent ça bizarre. Je comprends: un mandat refusé, c'est une facture qui ne sortira pas.\n\nMais je le fais pareil, et voilà pourquoi.\n\nUn mandat qu'on accepte sans pouvoir le livrer, le client le paie trois fois. Il paie en temps, parce qu'il attend six semaines avant de comprendre que rien ne s'en vient. Il paie en crédibilité interne, parce qu'il avait dit à son équipe que le poste serait comblé. Et il paie en occasions perdues, parce que pendant ce temps là il n'a pas essayé autre chose. Moi, je paie une facture. Le ratio n'est pas équitable.\n\nVoilà les cas où je dis non.\n\nQuand le salaire ne correspond pas au profil. Si tu cherches un directeur d'usine avec quinze ans d'expérience et que ton budget est celui d'un superviseur, je ne vais pas prendre ton mandat en espérant qu'on trouve un miracle. Je vais te dire ce que le marché paie, te montrer sur quoi je me base, et te laisser décider. Des fois le client ajuste. Des fois non, et on en reste là, sans rancune.\n\nQuand le poste a brûlé trois personnes en quatre ans. Le problème n'est pas le bassin de candidats. Si je place une quatrième personne dans un poste qui en a éjecté trois, je participe au problème. Je préfère avoir la conversation sur ce qui se passe réellement dans ce poste là.\n\nQuand ce n'est pas mon industrie. On fait de l'alimentaire, du CPG et de la mode. Quand quelqu'un m'appelle pour un poste en construction ou en pharmaceutique, je dis non et je réfère ailleurs si je connais quelqu'un. Je ne suis pas généraliste et je n'ai pas envie de l'être.\n\nQuand le processus décisionnel n'est pas clair. Si personne ne peut me dire qui approuve l'embauche et dans quel délai, le mandat va mourir en entrevue trois. J'aime mieux le savoir avant.\n\nEt quand le client cherche du volume. Si tu veux dix CV demain matin pour comparer, il y a des firmes qui font très bien ça. Nous, on présente deux ou trois personnes et on se tient derrière.\n\nCe que ça donne au bout du compte: quatre-vingt-trois pour cent de nos placements viennent de clients qui nous avaient déjà appelés une première fois. Soixante-seize entreprises sur cent quarante-quatre nous ont confié au moins deux mandats. Personne ne redonne une recherche à une firme qui a manqué la première.\n\nDire non coûte des mandats à court terme. Ça bâtit la seule chose qui compte à long terme, qui est qu'on te rappelle.\n\nTu as un poste et tu veux savoir honnêtement si c'est faisable au budget que tu as? Appelle-moi. La réponse va être franche dans les deux sens.`} },

  { id:"clients-qui-reviennent", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Simon St-Amand",
    title:{en:"What the twenty companies that kept coming back have in common.",fr:"Ce que les vingt entreprises qui nous ont redonné un mandat ont en commun."},
    excerpt:{en:"I went through seven years of placement records. The repeat clients behave differently, and it isn't about budget.",fr:"J'ai repris sept ans de registres de placements. Les clients qui reviennent se comportent différemment, et ce n'est pas une question de budget."},
    body:{en:`I went back through our placement records since 2019. A hundred and forty four client companies, and seventy six that gave us at least two searches. Twenty that gave me repeat business personally, five that trusted me with five or more.\n\nI wanted to understand what those clients do differently. It isn't budget, I checked. There are small companies among the loyal ones and large ones among the single search clients. Here's what I found.\n\n**They give the real context on the first call.** Not the job description, the situation. The last person left because they couldn't work with the operations director. The plant is coming out of a rough year. There's an expansion project that hasn't been announced yet. That information completely changes who we approach and how we talk about it. Clients who keep it to themselves get less accurate candidates, and they think that's on us.\n\n**They give feedback within forty eight hours.** Not a decision, feedback. That one is out because of this. That one is a maybe, I'm waiting on my director. That's all I need to adjust. Clients who answer a week later still get three candidates, but they're the wrong three, because I couldn't correct course.\n\n**They're willing to sell themselves.** A good employed candidate has no reason to move. Clients who close fast put a manager on the phone early, tour the plant, explain where the business is going. The ones who treat the interview as a one way exam lose the best people.\n\n**They move fast when they know.** Not fast all the time, fast at the right moment. When a candidate is unanimous, they make the offer. I've never seen anyone regret hiring a unanimous candidate too quickly. I've seen plenty regret waiting two more weeks.\n\n**And they tell us when it's going badly.** The placement that isn't working, the person struggling at six months. Loyal clients call us. That lets us fix it, and it teaches us something about their environment that we use next time. The ones who say nothing and switch firms deprive us both of the information.\n\nNone of this costs money. It's time and candour, mostly in the first two weeks.\n\nAnd it works both ways. If you're not getting the same from our side, tell us. That's how twenty companies are still with us seven years later.`,
          fr:`J'ai repris nos registres de placements depuis 2019. Cent quarante-quatre entreprises clientes, et soixante-seize qui nous ont confié au moins deux mandats. Vingt qui m'en ont redonné personnellement, cinq qui m'en ont confié cinq ou plus.\n\nJe voulais comprendre ce que ces clients là font différemment. Ce n'est pas le budget, j'ai vérifié. Il y a des petites entreprises dans la liste des fidèles et des grosses dans celle des mandats uniques. Voilà ce que j'ai trouvé.\n\n**Ils donnent le vrai contexte dès le premier appel.** Pas la description de poste, la situation. Le dernier titulaire est parti parce qu'il ne s'entendait pas avec le directeur des opérations. L'usine sort d'une année difficile. Il y a un projet d'agrandissement qui n'est pas encore annoncé. Ces informations changent complètement qui on approche et comment on en parle. Les clients qui les gardent pour eux reçoivent des candidats moins justes, et ils pensent que c'est nous.\n\n**Ils donnent un retour dans les quarante-huit heures.** Pas une décision, un retour. Celui là non parce que. Celui là peut-être, j'attends l'avis de mon directeur. C'est tout ce dont j'ai besoin pour ajuster. Les clients qui répondent une semaine plus tard reçoivent toujours trois candidats, mais ce sont les mauvais trois, parce que je n'ai pas pu corriger le tir.\n\n**Ils acceptent de se vendre.** Un bon candidat en poste n'a aucune raison de bouger. Les clients qui ferment vite mettent un gestionnaire au téléphone tôt, font visiter l'usine, expliquent où s'en va l'entreprise. Ceux qui traitent l'entrevue comme un examen à sens unique perdent les meilleurs.\n\n**Ils bougent vite quand ils savent.** Pas vite tout le temps, vite au bon moment. Quand un candidat fait l'unanimité, ils font l'offre. Je n'ai jamais vu quelqu'un regretter d'avoir embauché trop vite un candidat qui faisait l'unanimité. J'ai vu beaucoup de monde regretter d'avoir attendu deux semaines de plus.\n\n**Et ils nous disent quand ça va mal.** Le placement qui ne fonctionne pas, la personne qui a de la misère à six mois. Les clients fidèles nous appellent. Ça nous permet de régler, et ça nous apprend quelque chose sur leur environnement qu'on utilise la fois d'après. Ceux qui ne disent rien et qui changent de firme nous privent tous les deux de l'information.\n\nRien là dedans ne coûte de l'argent. C'est du temps et de la franchise, surtout dans les deux premières semaines.\n\nEt ça marche dans les deux sens. Si on ne te donne pas la même chose de notre bord, dis-le nous. C'est comme ça que vingt entreprises sont encore avec nous sept ans plus tard.`} },

  { id:"batir-division-alimentaire", cat:{en:"Career",fr:"Carrière"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Simon St-Amand",
    title:{en:"I built the food division from nothing. Here are the three mistakes I made.",fr:"J'ai bâti la division alimentaire à partir de rien. Voilà les trois erreurs que j'ai faites."},
    excerpt:{en:"Ten years in, the things that cost me the most weren't the ones I expected.",fr:"Dix ans plus tard, ce qui m'a coûté le plus cher n'est pas ce que je pensais."},
    body:{en:`I joined Proforce in 2015. There was no food division. I started with a phone, a list of companies and not a single client in the industry. Today it's the biggest part of the firm, we cover Quebec, Ontario and the Maritimes, and I've been president and shareholder since 2018.\n\nIt sounds good told that way. Here's what it actually cost.\n\n**First mistake: I tried to cover too much ground early on.** In the first years, I took everything. Food, but also a bit of pharmaceutical, a bit of packaging, a bit of general manufacturing. Every search outside the industry took me three times as long for a worse result, and above all it built me nothing. A food placement gives me a client, a candidate who becomes a contact, and three more names in my network. A placement outside the industry gives me an invoice and nothing else.\n\nThe day I stopped saying yes to everything, my productivity went up and my network started working for me. It's the decision that built the division, and I should have made it two years earlier.\n\n**Second mistake: I sold speed before I sold accuracy.** Early on, to win searches against bigger firms, I promised timelines. Three candidates in ten days. I delivered them, because I worked evenings. But three candidates in ten days isn't the same as three good candidates. I made placements that didn't stick, and those are the ones clients remember.\n\nToday I sell the opposite. I say how long it will really take, and I present fewer people. It's less impressive in a sales meeting. It's what makes clients come back.\n\n**Third mistake, and the costliest: I hired too quickly to grow.** When the searches came in volume, I needed hands. I recruited recruiters on their enthusiasm and general experience, telling myself the industry can be learned. The industry can be learned, yes, but not in six months and not without someone showing you. I lost people, I lost mandates, and above all I wasted the time of clients who trusted me.\n\nWhat I do differently now: I hire less often, I take longer, and the person works on existing searches beside someone before opening their own. It slows growth. It makes it solid.\n\nIf I had to sum up what ten years taught me: specialization beats volume, candour beats speed, and a team gets built more slowly than a client list.\n\nBuilding a team or a division yourself? That's a conversation I enjoy having, even when there's no mandate at the end of it.`,
          fr:`Je suis arrivé chez Proforce en 2015. Il n'y avait pas de division alimentaire. J'ai commencé avec un téléphone, une liste d'entreprises et aucun client dans l'industrie. Aujourd'hui c'est la plus grosse partie de la firme, on couvre le Québec, l'Ontario et les Maritimes, et je suis président et actionnaire depuis 2018.\n\nÇa sonne bien raconté de même. Voilà ce que ça a vraiment coûté.\n\n**Première erreur: j'ai voulu couvrir trop large au début.** Les premières années, je prenais tout. Alimentaire, mais aussi un peu de pharmaceutique, un peu d'emballage, un peu de manufacturier général. Chaque mandat hors industrie me prenait trois fois plus de temps pour un résultat moins bon, et surtout il ne me construisait rien. Un placement en alimentaire me donne un client, un candidat qui devient un contact, et trois noms de plus dans mon réseau. Un placement hors industrie me donne une facture et rien d'autre.\n\nLe jour où j'ai arrêté de dire oui à tout, ma productivité a monté et mon réseau a commencé à travailler pour moi. C'est la décision qui a bâti la division, et j'aurais dû la prendre deux ans plus tôt.\n\n**Deuxième erreur: j'ai vendu la vitesse avant de vendre la justesse.** Au début, pour gagner des mandats contre des firmes plus grosses, je promettais des délais. Trois candidats en dix jours. Je les livrais, parce que je travaillais les soirs. Mais trois candidats en dix jours, ce n'est pas la même chose que trois bons candidats. J'ai fait des placements qui n'ont pas tenu, et ce sont ceux là dont les clients se souviennent.\n\nAujourd'hui je vends l'inverse. Je dis combien de temps ça va prendre pour vrai, et je présente moins de monde. C'est moins impressionnant en réunion de vente. C'est ce qui fait que les clients reviennent.\n\n**Troisième erreur, et c'est la plus coûteuse: j'ai embauché trop vite pour grandir.** Quand les mandats sont arrivés en masse, j'avais besoin de bras. J'ai recruté des recruteurs sur leur enthousiasme et leur expérience générale, en me disant que l'industrie s'apprend. L'industrie s'apprend, oui, mais pas en six mois et pas sans quelqu'un pour te montrer. J'ai perdu des gens, j'ai perdu des mandats, et j'ai surtout fait perdre du temps à des clients qui me faisaient confiance.\n\nCe que je fais différemment maintenant: j'embauche moins souvent, je prends plus de temps, et la personne travaille sur des mandats existants à côté de quelqu'un avant d'en ouvrir à elle. Ça ralentit la croissance. Ça la rend solide.\n\nSi je devais résumer ce que dix ans m'ont appris: la spécialisation bat le volume, la franchise bat la vitesse, et une équipe se bâtit plus lentement qu'un carnet de clients.\n\nTu es en train de bâtir une équipe ou une division? C'est une conversation que j'aime avoir, même quand il n'y a pas de mandat au bout.`} },

  { id:"calendrier-mode-recrutement", cat:{en:"Fashion",fr:"Mode"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Robin Anisef",
    title:{en:"The fashion calendar decides who you can hire, and when.",fr:"Le calendrier mode décide qui tu peux recruter, et quand."},
    excerpt:{en:"Post the same role in March or in July and you're fishing in two completely different pools.",fr:"Affiche le même poste en mars ou en juillet et tu pêches dans deux bassins complètement différents."},
    body:{en:`In fashion, when you recruit matters almost as much as what you offer. It's something people coming from other industries don't see coming, and it costs them months.\n\nHere's how it works.\n\nProduct people, designers, technicians, development, are tied to a season calendar. When a collection is in full development, nobody leaves. It isn't about loyalty, it's that they can't abandon a half finished season without burning their reputation in a world where everyone knows everyone. Try to recruit a pattern technician in the middle of their cycle and you'll have polite conversations that go nowhere.\n\nCommercial people, buyers, planners, merchandising, follow a different rhythm. Their tipping point comes after the heavy weeks. The end of a big quarter, the end of a markdown period, the moment the season's numbers are known. That's when a buyer looks at their bonus, looks at their year, and decides whether to stay.\n\nAnd there's the bonus itself. It's the most underestimated factor. Many senior fashion roles have a variable portion paid at a specific point in the year. An excellent candidate won't move six weeks before their payout, whatever your offer. Either you wait, or you compensate, and if you compensate you have to put it on the table early, not at the end.\n\nHere's what that means in practice.\n\nIf you're after a product profile, start conversations well before you need the person. Not to recruit them immediately, so they know you when their window opens. That's exactly what I do: the people I place in January, I spoke to in September.\n\nIf you're after a commercial profile, target the period right after the crunch. People have more headspace and perspective on their year.\n\nAnd if your need is urgent and you land in the wrong window, be honest with yourself: either you pay to compensate for the timing, or you take a slightly more junior profile and grow them, or you wait. All three are valid decisions. Pretending the calendar doesn't exist isn't one.\n\nThe Canadian fashion market is small. The same people come back into my conversations year after year. Knowing where they are in their cycle is half my job.\n\nGot a fashion role to fill this year? Talk to me early, even if you're not ready. That's often what makes the difference.`,
          fr:`En mode, le moment où tu recrutes compte presque autant que ce que tu offres. C'est quelque chose que les gens qui viennent d'autres industries ne voient pas venir, et ça leur coûte des mois.\n\nVoilà comment ça fonctionne.\n\nLes gens de produit, designers, techniciens, développement, sont attachés à un calendrier de saison. Quand une collection est en plein développement, personne ne part. Ce n'est pas une question de loyauté, c'est qu'ils ne peuvent pas laisser une saison à moitié faite sans brûler leur réputation dans un milieu où tout le monde se connaît. Essaie de recruter un technicien de patron en plein milieu de son cycle et tu vas avoir des conversations polies qui ne mènent nulle part.\n\nLes gens du commercial, acheteurs, planificateurs, marchandisage, suivent un autre rythme. Leur point de bascule, c'est après les grosses semaines. La fin d'un gros trimestre, la fin d'une période de soldes, le moment où les chiffres de la saison sont connus. C'est là qu'un acheteur regarde son bonus, regarde son année, et décide s'il reste.\n\nEt il y a le bonus. C'est le facteur le plus sous-estimé. Beaucoup de postes seniors en mode ont une portion variable payée à un moment précis de l'année. Un candidat excellent ne bougera pas six semaines avant son versement, peu importe ton offre. Soit tu attends, soit tu compenses, et si tu compenses il faut le mettre sur la table tôt, pas à la fin.\n\nCe que ça donne concrètement.\n\nSi tu cherches un profil produit, commence tes conversations bien avant d'avoir besoin de la personne. Pas pour la recruter tout de suite, pour qu'elle te connaisse quand sa fenêtre s'ouvre. C'est exactement ce que je fais: les gens que je place en janvier, je leur ai parlé en septembre.\n\nSi tu cherches un profil commercial, cible la période juste après le gros coup de feu. Les gens ont la tête plus libre et le recul sur leur année.\n\nEt si ton besoin est urgent et que tu tombes dans la mauvaise fenêtre, sois honnête avec toi-même: soit tu paies pour compenser le timing, soit tu prends un profil un cran plus junior et tu le fais grandir, soit tu attends. Les trois sont des décisions valables. Faire semblant que le calendrier n'existe pas n'en est pas une.\n\nLe marché canadien de la mode est petit. Les mêmes personnes reviennent dans mes conversations année après année. Savoir où elles en sont dans leur cycle, c'est la moitié de mon travail.\n\nTu as un poste mode à combler cette année? Parle-m'en tôt, même si tu n'es pas prêt. C'est souvent ce qui fait la différence.`} },

  { id:"trente-cinq-entreprises", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Michaela Landers",
    title:{en:"Thirty five companies in under four years. Here's what the plants have in common.",fr:"Trente-cinq entreprises en moins de quatre ans. Voilà ce que les usines ont en commun."},
    excerpt:{en:"Walking into a new plant is the part of this job most recruiters do once a year. I've done it thirty five times.",fr:"Entrer dans une nouvelle usine, c'est la partie du métier que la plupart des recruteurs font une fois par année. Je l'ai faite trente-cinq fois."},
    body:{en:`In under four years at Proforce, I've delivered searches for thirty five different companies. That's roughly nine new organizations a year. Most recruiters discover two or three in the same span.\n\nIt isn't a performance number, it's a learning number. The slowest part of this job is the first month at a new client: understanding the shop, the real need behind the description, who actually decides. I've done it thirty five times. Here's what it taught me.\n\n**Plants that work well resemble each other more than plants making the same product do.** I thought the opposite when I started. I assumed a meat plant and an industrial bakery would be two worlds. In reality, two meat plants can be light years apart, and a good bakery looks a lot like a good meat plant. What matters is role clarity, respect between shifts, and the quality of communication between production and quality.\n\n**You know within thirty minutes whether a placement will stick.** Not by reading the resume, by visiting. Does the manager greet people on the floor by name? Do supervisors have a desk or a corner of a table? Are the production boards current or three weeks old? Those signals predict retention far better than any interview grid.\n\n**The job description is almost always out of date.** In nearly every search I've opened, the description dated from the last hire and no longer described the real role. The scope changed, the team changed, the equipment changed. If I take the description as written, I'm searching for a job that no longer exists.\n\n**The real need is rarely the stated one.** Someone asks me for a production supervisor. Digging in, what they need is someone able to stand up to a director who changes direction every two days. That's written nowhere, and it's the only criterion that will decide whether the person stays.\n\n**And every plant has one thing it's proud of.** New equipment, a certification, a retention rate, a product. I always ask, because that's what I'm going to tell candidates. A good candidate doesn't move for a salary, they move for a reason. My job is to find it and say it properly.\n\nThat's why I ask so many questions up front. It isn't slowness, it's thirty five repetitions of the same lesson.\n\nOpening a role in Ontario? Give me an hour and a plant tour, everything after that goes much faster.`,
          fr:`En moins de quatre ans chez Proforce, j'ai livré des mandats pour trente-cinq entreprises différentes. C'est à peu près neuf nouvelles organisations par année. La plupart des recruteurs en découvrent deux ou trois dans le même temps.\n\nCe n'est pas un chiffre de performance, c'est un chiffre d'apprentissage. La partie la plus lente du métier, c'est le premier mois chez un nouveau client: comprendre la shop, le vrai besoin derrière la description, qui décide pour vrai. Je l'ai refaite trente-cinq fois. Voilà ce que ça m'a appris.\n\n**Les usines qui fonctionnent bien se ressemblent plus entre elles que les usines du même produit.** Je pensais le contraire en arrivant. Je croyais qu'une usine de viande et une boulangerie industrielle seraient deux mondes. En réalité, deux usines de viande peuvent être à des années lumière l'une de l'autre, et une bonne boulangerie ressemble beaucoup à une bonne usine de viande. Ce qui compte, c'est la clarté des rôles, le respect entre les quarts et la qualité de la communication entre la production et la qualité.\n\n**On sait en trente minutes si un placement va tenir.** Pas en lisant le CV, en visitant. Est-ce que le directeur dit bonjour aux gens sur le plancher par leur nom? Est-ce que les superviseurs ont un bureau ou un coin de table? Est-ce que les tableaux de production sont à jour ou datent de trois semaines? Ce sont des signaux qui prédisent beaucoup mieux la rétention que n'importe quelle grille d'entrevue.\n\n**La description de poste est presque toujours périmée.** Dans à peu près tous les mandats que j'ai ouverts, la description datait de la dernière embauche et ne décrivait plus le poste réel. Le périmètre a changé, l'équipe a changé, les équipements ont changé. Si je prends la description telle quelle, je cherche un poste qui n'existe plus.\n\n**Le vrai besoin est rarement celui qui est annoncé.** On me demande un superviseur de production. En creusant, ce qu'il faut c'est quelqu'un capable de tenir tête à un directeur qui change d'idée tous les deux jours. Ça, ce n'est écrit nulle part, et c'est pourtant le seul critère qui va décider si la personne reste.\n\n**Et chaque usine a une chose dont elle est fière.** Un équipement neuf, une certification, un taux de rétention, un produit. Je demande toujours, parce que c'est ce que je vais raconter aux candidats. Un bon candidat ne bouge pas pour un salaire, il bouge pour une raison. Mon travail c'est de la trouver et de la dire correctement.\n\nC'est pour ça que je pose autant de questions au début. Ce n'est pas de la lenteur, c'est trente-cinq fois la même leçon.\n\nTu ouvres un poste en Ontario? Donne-moi une heure et une visite, le reste va beaucoup plus vite après.`} },

  { id:"salubrite-poste-sous-estime", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Michaela Landers",
    title:{en:"Your food safety lead is the most underestimated role in the plant.",fr:"Ton responsable salubrité est le poste le plus sous-estimé de ton usine."},
    excerpt:{en:"Paid like support, blamed like leadership, and the first one called when an audit goes wrong.",fr:"Payé comme du soutien, blâmé comme de la direction, et le premier appelé quand un audit tourne mal."},
    body:{en:`Of all the roles I fill in Ontario, the one that gives me the most trouble isn't the plant manager. It's the food safety lead.\n\nAnd it isn't because the candidates don't exist. It's because the role is badly built in most plants.\n\nHere's what I see.\n\n**It's paid like support and judged like leadership.** When everything is fine, the food safety lead is a compliance function sitting somewhere next to quality on the org chart. When an audit goes wrong, when there's a recall, when a customer demands a corrective action, they're the one answering. The accountability is a manager's, the pay is a coordinator's. Good candidates can do math.\n\n**They don't have the authority to stop a line.** Or they have it on paper and not in practice. In several plants, a food safety lead who stops a line has to justify it to production the next day. Once, that's fine. Twice, they get the message. After that, they stop stopping it, and that's exactly where serious problems begin.\n\n**They're asked to do everything at once.** Prerequisite programs, documentation, employee training, customer audits, certification, sometimes the lab and sometimes consumer complaints. In a two hundred person plant, that's three jobs. Plenty of postings put them in one.\n\n**And the title varies so much that candidates don't recognize themselves.** Food safety lead, quality and food safety coordinator, QA supervisor, compliance specialist. The same job carries six names. A good candidate who's looking scrolls past your posting because you used the seventh.\n\nWhat I recommend to plants that want to fix this.\n\nGive them the right to stop, in writing, and back them the first time they use it. It will travel through the plant in a day and it changes the culture.\n\nHave them report to someone with no production target. Otherwise the conflict of interest is structural and no individual can manage it.\n\nSplit the role if the scope is too large. A lead plus a coordinator costs less than a recall.\n\nAnd pay what it's worth. In the Ontario industrial corridor, this role has repriced significantly over the last three years. If your grid dates from 2022, it's below market.\n\nGot a food safety or quality role that won't close? Show me how it's built before you tell me about the profile. The answer is usually there.`,
          fr:`De tous les postes que je comble en Ontario, celui qui me donne le plus de mal n'est pas le directeur d'usine. C'est le responsable salubrité.\n\nEt ce n'est pas parce que les candidats n'existent pas. C'est parce que le poste est mal construit dans la majorité des usines.\n\nVoilà ce que je vois.\n\n**Il est payé comme du soutien et jugé comme de la direction.** Quand tout va bien, le responsable salubrité est une fonction de conformité, quelque part dans l'organigramme à côté de la qualité. Quand un audit tourne mal, quand il y a un rappel, quand un client exige une correction, c'est lui qui répond. La responsabilité est celle d'un cadre, la paie est celle d'un coordonnateur. Les bons candidats savent compter.\n\n**Il n'a pas l'autorité d'arrêter une ligne.** Ou bien il l'a sur papier et pas dans les faits. Dans plusieurs usines, le responsable salubrité qui arrête une ligne doit se justifier auprès de la production le lendemain. Une fois, ça passe. Deux fois, il comprend. Après, il ne l'arrête plus, et c'est exactement là que les problèmes graves commencent.\n\n**On lui demande tout en même temps.** Les programmes préalables, la documentation, la formation des employés, les audits clients, la certification, parfois le laboratoire et parfois les plaintes consommateurs. Dans une usine de deux cents personnes, c'est trois emplois. Beaucoup d'affichages les mettent dans un seul.\n\n**Et le titre varie tellement que les candidats ne se reconnaissent pas.** Responsable salubrité, coordonnateur qualité et salubrité, superviseur assurance qualité, spécialiste conformité. Le même travail porte six noms. Un bon candidat qui cherche passe à côté de ton affichage parce que tu as utilisé le septième.\n\nCe que je recommande aux usines qui veulent régler ça.\n\nDonne-lui le droit d'arrêter, par écrit, et soutiens-le la première fois qu'il l'utilise. Ça se saura dans l'usine en une journée et ça change la culture.\n\nFais-le relever de quelqu'un qui n'a pas d'objectif de production. Sinon, le conflit d'intérêt est structurel et aucune personne ne peut le gérer.\n\nDécoupe le poste si le périmètre est trop gros. Un responsable plus un coordonnateur coûte moins cher qu'un rappel.\n\nEt paie ce que ça vaut. Dans le corridor industriel ontarien, ce poste s'est nettement réévalué depuis trois ans. Si ta grille date de 2022, elle est en dessous du marché.\n\nTu as un poste de salubrité ou de qualité qui ne se comble pas? Montre-moi comment il est construit avant de me parler du profil. Souvent la réponse est là.`} },

  { id:"retenir-superviseurs-ontario", cat:{en:"Market",fr:"Marché"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Michaela Landers",
    title:{en:"Your Ontario plant keeps losing supervisors to the plant next door. Here's what holds them.",fr:"Ton usine ontarienne perd ses superviseurs au profit de celle d'à côté. Voilà ce qui les retient."},
    excerpt:{en:"When fifteen plants sit twenty minutes apart, a dollar an hour isn't a strategy.",fr:"Quand quinze usines sont à vingt minutes les unes des autres, une piastre de l'heure n'est pas une stratégie."},
    body:{en:`In some Ontario industrial corridors, there are fifteen food plants within twenty minutes of each other. A production supervisor who's unhappy on Monday can have an interview Wednesday and an offer Friday, without moving, without changing their commute, without explaining anything to their family.\n\nIn that context, an extra dollar an hour isn't a retention strategy. It's a bidding war your neighbour can match before month end.\n\nHere's what actually holds supervisors, based on what the ones I call and who refuse to move tell me.\n\n**A predictable schedule.** It isn't shift length that drives people out, it's unpredictability. Someone who knows a month ahead when they're working can organize their life. Someone called on Thursday for Saturday eventually answers a recruiter. Plants that publish their schedule in advance and honour it have an enormous advantage, and it costs them almost nothing.\n\n**Enough people on the shift.** A supervisor who spends their days plugging holes because they're three operators short isn't supervising anymore, they're surviving. It's the number one reason I hear when I ask why someone is listening to my call.\n\n**A visible path.** Not a promise, a path. Who became what in the last three years at your plant. If the answer is nobody, your supervisor understands their next role is elsewhere.\n\n**Equipment that works.** That may sound unrelated to retention. It isn't. A supervisor fighting a line that goes down every shift burns out, and they know full well the plant next door just invested.\n\n**And a manager who backs them in front of others.** That's the one that comes up most in my conversations. Not kindness, backing. When the supervisor's decision is challenged by another department, does their manager defend them or leave them alone? People rarely leave a company. They leave a person.\n\nWhat I tell Ontario plants that talk to me about turnover: before you add money, walk through these five points with your current supervisors. Honestly, one at a time. What you hear will cost less to fix than an across the board raise, and it will last longer.\n\nAnd if you have to recruit anyway, know that your candidate is going to ask exactly these questions. That's what I told them to do.\n\nGot turnover among your supervisors? Let's talk about what happens on the floor before we talk about the pay grid.`,
          fr:`Dans certains corridors industriels de l'Ontario, il y a quinze usines alimentaires à vingt minutes les unes des autres. Un superviseur de production qui n'est pas content le lundi peut avoir une entrevue le mercredi et une offre le vendredi, sans déménager, sans changer son trajet, sans rien expliquer à sa famille.\n\nDans ce contexte là, une piastre de l'heure de plus n'est pas une stratégie de rétention. C'est une surenchère que ton voisin peut égaler avant la fin du mois.\n\nVoilà ce qui retient réellement les superviseurs, d'après ce que me disent ceux que j'appelle et qui refusent de bouger.\n\n**Un horaire prévisible.** Ce n'est pas la longueur des quarts qui fait partir le monde, c'est l'imprévisibilité. Quelqu'un qui sait un mois d'avance quand il travaille peut organiser sa vie. Quelqu'un qu'on appelle le jeudi pour samedi finit par répondre à un recruteur. Les usines qui publient leur horaire à l'avance et qui le respectent ont un avantage énorme et il ne leur coûte presque rien.\n\n**Du personnel suffisant sur le quart.** Un superviseur qui passe ses journées à boucher des trous parce qu'il manque trois opérateurs ne supervise plus, il survit. C'est la raison numéro un que j'entends quand je demande pourquoi quelqu'un écoute mon appel.\n\n**Un chemin visible.** Pas une promesse, un chemin. Qui est devenu quoi dans les trois dernières années chez toi. Si la réponse est personne, ton superviseur comprend que son prochain poste est ailleurs.\n\n**Des équipements qui fonctionnent.** Ça peut sembler étranger à la rétention. Ça ne l'est pas. Un superviseur qui se bat chaque quart avec une ligne qui tombe finit épuisé, et il sait très bien que l'usine d'à côté vient d'investir.\n\n**Et un gestionnaire qui le soutient devant les autres.** C'est celui qui revient le plus souvent dans mes conversations. Pas de la gentillesse, du soutien. Quand une décision du superviseur est contestée par un autre service, est-ce que son patron le défend ou le laisse seul? Les gens partent rarement d'une entreprise. Ils partent d'une personne.\n\nCe que je conseille aux usines ontariennes qui me parlent de roulement: avant d'ajouter de l'argent, fais le tour de ces cinq points avec tes superviseurs actuels. Honnêtement, un par un. Ce que tu vas entendre va te coûter moins cher à régler qu'une hausse générale, et ça va tenir plus longtemps.\n\nEt si tu dois recruter quand même, sache que ton candidat va poser exactement ces questions là. C'est ce que je lui ai dit de faire.\n\nTu as du roulement dans tes superviseurs? Parlons de ce qui se passe sur le plancher avant de parler de la grille salariale.`} },

  { id:"mode-acheteur-senior", cat:{en:"Fashion",fr:"Mode"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Robin Anisef",
    title:{en:"A senior buyer won't answer your job posting. Here's what it actually takes.",fr:"Un acheteur senior ne répondra pas à ton affichage. Voilà ce que ça prend vraiment."},
    excerpt:{en:"The senior buyers who matter in Canada can be counted on two hands. None of them are looking.",fr:"Les acheteurs seniors qui comptent au Canada se comptent sur deux mains. Aucun ne cherche."},
    body:{en:`I've been recruiting in fashion in Montreal and Toronto for over twenty years. When a brand calls me about a senior buyer, the conversation almost always starts the same way. We posted it, we got forty resumes, there's nothing in there.\n\nThat's normal. The senior buyers who matter in Canada can be named. There are maybe a hundred of them, two hundred if you stretch the definition. They are all employed. They don't look at job boards because they don't need to: the day they want to move, three people call them within a week.\n\nThe forty resumes you got are assistant buyers angling for a promotion, people coming from store retail who want to move to head office, and a few profiles from another industry who think buying is buying. There's occasionally a gem in there. But it isn't the person you were looking for.\n\nWhat it takes is knowing who does what, in which category, for whom, and for how long. A womenswear buyer at a volume retailer is not doing the same job as a footwear buyer at a premium brand. Both carry the title of buyer. Put one in the other's seat and you'll regret it within six months.\n\nThen you have to call. Not write, call. A senior buyer gets messages every month. What makes them answer isn't the role, it's recognizing the name on the other end and knowing that person won't waste their time. That doesn't get built in three weeks. It's twenty years of calls, lunches and people I placed who call me back when they need someone.\n\nAnd you have to understand what would actually move them. A buyer who just finished a rough season with a team that doesn't listen is a candidate. A buyer who just got promoted with a bigger budget is a waste of time, even if your offer looks better on paper. The question is never how much you pay. The question is where they are right now.\n\nWhat I ask of brands who give me this kind of search is three things. Tell me the real category and volume, not just the title. Tell me who the person reports to and how that person works, because a senior buyer almost always leaves because of their manager and not because of money. And let me bring you two or three people, not ten. If I'm bringing ten, I haven't done my job.\n\nThe rest is patience. A good senior buyer isn't recruited in three weeks. They're recruited when the timing is right for them, and my job is to be there at that moment.\n\nGot a buying role that's been open for three months? Let's talk. I probably already know the person you're looking for.`,
          fr:`Ça fait plus de vingt ans que je recrute en mode à Montréal et à Toronto. Quand une marque m'appelle pour un acheteur senior, la conversation commence presque toujours de la même façon. On a affiché, on a reçu quarante CV, il n'y a rien dedans.\n\nC'est normal. Les acheteurs seniors qui comptent au Canada, tu peux les nommer. Ils sont une centaine, peut-être deux cents si on étire la définition. Ils sont tous en poste. Ils ne regardent pas les affichages parce qu'ils n'en ont pas besoin: le jour où ils veulent bouger, trois personnes les appellent dans la semaine.\n\nLes quarante CV que tu as reçus, ce sont des assistants acheteurs qui visent une promotion, des gens qui viennent du détail en magasin et qui veulent passer au bureau, et quelques profils d'une autre industrie qui pensent que l'achat, c'est l'achat. Il y a parfois une perle là-dedans. Mais ce n'est pas la personne que tu cherchais.\n\nCe que ça prend, c'est de savoir qui fait quoi, dans quelle catégorie, chez qui, et depuis combien de temps. Un acheteur en prêt à porter femme chez un détaillant de volume ne fait pas le même métier qu'un acheteur en chaussure chez une marque haut de gamme. Les deux ont le titre d'acheteur. Mets l'un à la place de l'autre et tu vas le regretter en six mois.\n\nEnsuite, il faut appeler. Pas écrire, appeler. Un acheteur senior reçoit des messages tous les mois. Ce qui le fait répondre, ce n'est pas le poste, c'est de reconnaître le nom au bout du fil et de savoir que la personne ne lui fera pas perdre son temps. Ça, ça ne se bâtit pas en trois semaines. C'est vingt ans d'appels, de dîners et de gens que j'ai placés et qui me rappellent quand ils cherchent quelqu'un.\n\nEt il faut comprendre ce qui le ferait bouger. Un acheteur qui vient de finir une saison difficile avec une équipe qui n'écoute pas, c'est un candidat. Un acheteur qui vient d'avoir une promotion et un budget plus gros, c'est une perte de temps, même si ton offre est meilleure sur papier. La question n'est jamais combien tu paies. La question, c'est où il en est.\n\nCe que je demande aux marques qui me confient ce genre de mandat, c'est trois choses. Dis-moi vraiment quelle catégorie et quel volume, pas juste le titre. Dis-moi à qui la personne se rapporte et comment cette personne travaille, parce qu'un acheteur senior part presque toujours à cause de son patron et pas à cause de l'argent. Et laisse-moi présenter deux ou trois personnes, pas dix. Si j'en présente dix, c'est que je n'ai pas fait mon travail.\n\nLe reste, c'est de la patience. Un bon acheteur senior ne se recrute pas en trois semaines. Il se recrute quand le moment est bon pour lui, et mon travail c'est d'être là à ce moment là.\n\nTu as un poste d'achat qui traîne depuis trois mois? On peut en parler. Je connais probablement déjà la personne que tu cherches.`} },

  { id:"mode-portfolio-designer", cat:{en:"Fashion",fr:"Mode"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Robin Anisef",
    title:{en:"A portfolio shows you the talent. It doesn't tell you if the season will ship.",fr:"Le portfolio te montre le talent. Il ne te dit pas si la saison va sortir."},
    excerpt:{en:"The best book I ever saw belonged to a designer who missed every deadline. I learned something that day.",fr:"Le plus beau portfolio que j'ai vu appartenait à une designer qui ratait toutes ses dates. J'ai appris quelque chose ce jour là."},
    body:{en:`The most beautiful portfolio I've seen in my career belonged to a designer who never delivered a season on time. The boards were gorgeous, the sketches perfect, the direction clear. She lasted eleven months at my client.\n\nI've looked at portfolios differently ever since.\n\nThe book tells you one thing: this person has taste and can draw. That's necessary. But design inside a company isn't a talent contest. It's delivering a full collection, on a tight calendar, with cost constraints, factories that answer when they feel like it and a buyer who changes their mind in February.\n\nWhat I look for beyond the book starts with context. Were these pieces produced, or did they stay on paper? How many styles per season? At what price point? A beautiful dress designed to retail at four hundred dollars proves nothing about the ability to make a profitable twenty dollar tee, and the reverse is true too.\n\nThen I ask what went wrong. Always. A season where the fabric didn't arrive, a supplier who changed a price at the last minute, a style that kept failing fit. A designer who never had a problem never had responsibility. The one who tells me how they pivoted is the one I want to present.\n\nI also watch how the person talks about their team. Pattern technicians, production coordinators, buyers. A designer who describes them as an obstacle will be a problem. A designer who says they walk over to their technician before locking an idea is going to deliver.\n\nAnd I ask about the calendar. Not in theory. I ask for the real dates of the last season, who set them, and what happened when they slipped. The answer tells you more than thirty boards.\n\nFor brands, my advice is simple. Pay for a short exercise instead of asking for a long free test. Give a real brief, with a cost constraint and a date. You'll learn in four hours what three interviews wouldn't have told you.\n\nAnd for the designers reading this: your book gets you in the door, it doesn't keep you the job. What keeps you the job is delivering, communicating, and knowing how to work with people who don't see clothes the way you do.\n\nLooking for a designer or a creative director in Canada? Tell me about your calendar before you tell me about the profile. That's where the answer is.`,
          fr:`Le plus beau portfolio que j'ai vu dans ma carrière appartenait à une designer qui n'a jamais livré une saison à temps. Les planches étaient superbes, les croquis parfaits, la direction claire. Elle a duré onze mois chez mon client.\n\nDepuis, je regarde un portfolio autrement.\n\nLe book te dit une chose: cette personne a du goût et sait dessiner. C'est nécessaire. Mais le design en entreprise, ce n'est pas un concours de talent. C'est livrer une collection complète, dans un calendrier serré, avec des contraintes de coût, des usines qui répondent quand ça leur tente et un acheteur qui change d'idée en février.\n\nCe que je cherche en plus du book, c'est d'abord le contexte. Est-ce que ces pièces ont été produites, ou est-ce qu'elles sont restées sur papier? Combien de styles par saison? Dans quelle gamme de prix? Une belle robe conçue pour se vendre quatre cents dollars ne prouve rien sur la capacité à faire un t-shirt rentable à vingt dollars, et l'inverse est vrai aussi.\n\nEnsuite, je demande ce qui a mal tourné. Toujours. Une saison où le tissu n'est pas arrivé, un fournisseur qui a changé un prix à la dernière minute, un style qui ne passait pas le fit. Un designer qui n'a jamais eu de problème n'a jamais eu de responsabilité. Celui qui me raconte comment il s'est viré de bord, c'est celui que je veux présenter.\n\nJe regarde aussi comment la personne parle de son équipe. Les techniciens de patron, les coordonnateurs de production, les acheteurs. Un designer qui parle d'eux comme d'un obstacle va être un problème. Un designer qui dit qu'il va voir son technicien avant de finaliser une idée, celui là va livrer.\n\nEt je pose la question du calendrier. Pas en théorie. Je demande les dates réelles de la dernière saison, qui les fixait, et ce qui arrivait quand elles glissaient. La réponse en dit plus long que trente planches.\n\nPour les marques, mon conseil est simple. Fais faire un exercice court et payé plutôt qu'un long test gratuit. Donne un brief réel, avec une contrainte de coût et une date. Tu vas apprendre en quatre heures ce que trois entrevues ne t'auraient pas dit.\n\nEt pour les designers qui me lisent: votre book vous ouvre la porte, il ne vous garde pas la job. Ce qui vous garde la job, c'est de livrer, de communiquer et de savoir travailler avec des gens qui ne voient pas les vêtements comme vous.\n\nTu cherches un designer ou un directeur de création au Canada? Parle-moi de ton calendrier avant de me parler du profil. C'est là que la réponse se trouve.`} },

  { id:"mode-montreal-toronto", cat:{en:"Market",fr:"Marché"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Robin Anisef",
    title:{en:"Montreal and Toronto are two fashion markets that don't hire the same way.",fr:"Montréal et Toronto, deux marchés mode qui ne recrutent pas pareil."},
    excerpt:{en:"Same country, same titles, two completely different conversations. Here's what changes.",fr:"Même pays, mêmes titres, deux conversations complètement différentes. Voilà ce qui change."},
    body:{en:`I've recruited in both cities for over twenty years and I can tell you they're two different markets. Same country, same titles on the resumes, two conversations that have nothing in common.\n\nMontreal is a manufacturing city. There are still workrooms, pattern rooms, people who know what it means to actually make a garment. The technical roles run deeper there: pattern technicians, production coordinators, product development. Teams are smaller and people wear several hats. A designer in Montreal often touches sourcing and talks to the factory directly.\n\nToronto is a brand and retail city. The weight sits on the commercial side: buyers, planners, merchandising, brand management. Structures are larger and more divided. A buyer in Toronto buys, full stop. There's a planner beside them and a visual merchandising team somewhere else in the building.\n\nThat changes everything when you hire.\n\nIf you're a Toronto brand looking for someone in product development, look at Montreal. The pool runs deeper and people there often have a technical grounding you won't find as easily at home.\n\nIf you're a Montreal manufacturer building a commercial team to sell into Canadian retail, look at Toronto. That's where the people who already have the relationship with the major buyers are.\n\nThere's also language, and I'll be blunt because it wastes a lot of people's time. A good share of Montreal roles require French, and a good share of Toronto candidates don't have it. If French isn't truly necessary for the role, say so right away and your pool doubles. If it is necessary, say that too, and you avoid three interviews for nothing.\n\nAnd there's pay. For the same title, Toronto generally pays more, and housing costs explain part of the gap. When I bring a Montreal candidate toward a Toronto role, I don't compare salaries, I compare what's left at the end of the month. When I do the reverse, I explain to the Montreal client why the Toronto candidate will find their offer low even if it's generous locally.\n\nMoving between the two cities happens, but less than people think. What works best are people who already have a tie to the other city: family, school, a stint early in their career. For everyone else, hybrid work opened a door. I've placed people who live in one city and go to the other twice a month. It works when it's clear from the start. It never works when it's a vague promise made to close a deal.\n\nMy summary: don't treat Canada as one fashion market. Decide which city actually holds the profile you want, adjust your offer to that reality, and be honest about language and travel. The rest sorts itself out.\n\nTorn between the two markets for a role? We can look at it together, I have numbers for both.`,
          fr:`Je recrute dans les deux villes depuis plus de vingt ans et je peux te dire que ce sont deux marchés différents. Même pays, mêmes titres sur les CV, deux conversations qui n'ont rien à voir.\n\nMontréal est une ville de fabrication. Il reste des ateliers, des salles de patrons, des gens qui savent ce que ça veut dire de faire un vêtement. Les postes techniques y sont plus profonds: techniciens de patron, coordonnateurs de production, développement de produit. Les équipes sont plus petites et les gens portent plusieurs chapeaux. Un designer à Montréal va souvent toucher au sourcing et parler directement à l'usine.\n\nToronto est une ville de marques et de détail. Le poids est du côté commercial: acheteurs, planificateurs, marchandisage, gestion de marque. Les structures sont plus grandes et plus découpées. Un acheteur à Toronto fait de l'achat, point. Il a un planificateur à côté de lui et une équipe de marchandisage visuel ailleurs dans l'édifice.\n\nÇa change tout quand tu recrutes.\n\nSi tu es une marque de Toronto qui cherche quelqu'un en développement de produit, regarde Montréal. Le bassin y est plus profond et les gens y ont souvent une compréhension technique que tu ne trouveras pas aussi facilement chez toi.\n\nSi tu es un manufacturier de Montréal qui veut bâtir une équipe commerciale pour vendre au détail canadien, regarde Toronto. C'est là que sont les gens qui ont déjà la relation avec les grands acheteurs.\n\nIl y a aussi la langue, et je vais être franche parce que ça fait perdre du temps à beaucoup de monde. Une bonne partie des postes à Montréal demande le français, et une bonne partie des candidats de Toronto ne l'ont pas. Si le français n'est pas vraiment nécessaire pour le poste, dis-le tout de suite, ton bassin double. Si c'est nécessaire, dis-le aussi, ça évite trois entrevues pour rien.\n\nEt il y a la rémunération. Pour un même titre, Toronto paie généralement plus, et le coût du logement explique une partie de l'écart. Quand j'amène un candidat de Montréal vers un poste de Toronto, je ne compare pas les salaires, je compare ce qui reste à la fin du mois. Quand je fais l'inverse, j'explique au client de Montréal pourquoi le candidat torontois va trouver son offre basse même si elle est généreuse localement.\n\nLe déménagement entre les deux villes se fait, mais moins qu'on pense. Ce qui marche le mieux, ce sont les gens qui ont déjà un lien avec l'autre ville, de la famille, des études, un passage en début de carrière. Pour les autres, le travail hybride a ouvert une porte: j'ai placé des gens qui vivent dans une ville et qui vont dans l'autre deux fois par mois. Ça fonctionne quand c'est clair dès le départ. Ça ne fonctionne jamais quand c'est une promesse floue faite pour conclure.\n\nMon résumé: ne traite pas le Canada comme un seul marché mode. Décide quelle ville a vraiment le profil que tu cherches, ajuste ton offre à cette réalité là, et sois honnête sur la langue et sur le déplacement. Le reste se règle.\n\nTu hésites entre les deux marchés pour un poste? On peut regarder ça ensemble, j'ai des chiffres pour les deux.`} },

  { id:"mode-technicien-patron", cat:{en:"Market",fr:"Marché"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Robin Anisef",
    title:{en:"The hardest fashion role to fill in Canada, and nobody talks about it.",fr:"Le poste le plus difficile à combler en mode au Canada, et personne n'en parle."},
    excerpt:{en:"Everyone is looking for designers. Meanwhile the people who make the clothes actually fit are retiring.",fr:"Tout le monde cherche des designers. Pendant ce temps, ceux qui font que le vêtement tombe bien prennent leur retraite."},
    body:{en:`Everyone talks to me about designers. Brands want creativity, a signature, someone who'll get them noticed. I understand. But the role that gives me the most trouble in Canada isn't the designer. It's the pattern technician.\n\nIf you're not in fashion, let me explain. The designer draws the idea. The pattern technician turns it into something that can be sewn, produced at scale and that actually fits a real body. They handle grading, fittings, adjustments, the technical relationship with the factory. Without them, you have beautiful sketches and a wall of returns.\n\nThe problem is that this trade is barely being taught anymore. The people who do it well usually started in the nineties or earlier, in workrooms that no longer exist. Many are nearing retirement. The pipeline is thin because programs shifted toward design and because manufacturing left the country, so the chances to learn on the floor left with it.\n\nThe result: when a brand asks me for a senior technician, I'm not searching a pool. I'm going after one specific person I already know, and checking whether the timing is right for them.\n\nHere's what I tell brands who'll listen.\n\nOne, pay them properly. This role is systematically underpaid relative to its real value. A good technician saves you thousands in returns and re-cuts. If you pay them like a support role, you'll lose them.\n\nTwo, build your own pipeline. Take someone with the fundamentals, in sewing, in garment construction, in technical assisting, and give them two years beside your senior. It's the only reliable path I see. Brands that did this five years ago don't call me about it today.\n\nThree, don't confuse the software with the craft. Someone who knows a digital patternmaking tool isn't necessarily a technician. Software can be learned. Judgment on a fitting can't.\n\nFour, look at the people who left the industry. There are technicians who moved to other trades when their employer closed and who would come back for the right offer. They're on no job board, but they exist.\n\nI'm not saying this to scare anyone. I'm saying it because the brands dealing with it now will have a huge advantage in five years, and the others will pay dearly for the same person.\n\nGot a technical role you can't fill? Call me before you post it. For this one, posting does absolutely nothing.`,
          fr:`Tout le monde me parle de designers. Les marques veulent de la créativité, une signature, quelqu'un qui va faire parler d'elles. Je comprends. Mais le poste qui me donne le plus de misère au Canada, ce n'est pas le designer. C'est le technicien de patron.\n\nSi tu n'es pas dans la mode, laisse-moi expliquer. Le designer dessine l'idée. Le technicien de patron la transforme en quelque chose qui se coud, qui se produit à grande échelle et qui tombe bien sur un vrai corps. C'est lui qui gère les tailles, les essayages, les ajustements, la relation technique avec l'usine. Sans lui, tu as de beaux croquis et des retours de marchandise.\n\nLe problème, c'est que ce métier ne se forme à peu près plus. Les gens qui le font bien ont souvent commencé dans les années quatre vingt dix ou avant, dans des ateliers qui n'existent plus. Beaucoup approchent de la retraite. La relève est mince parce que les programmes se sont déplacés vers le design et que la fabrication a quitté le pays, donc les occasions d'apprendre sur le plancher ont disparu avec elle.\n\nRésultat: quand une marque me demande un technicien senior, je ne vais pas chercher dans un bassin. Je vais chercher une personne précise que je connais déjà, et je vérifie si c'est le bon moment pour elle.\n\nCe que je dis aux marques qui m'écoutent.\n\nUn, paie-les correctement. Ce poste est systématiquement sous payé par rapport à sa valeur réelle. Un bon technicien t'économise des milliers de dollars en retours et en reprises de production. Si tu le paies comme un poste de soutien, tu vas le perdre.\n\nDeux, forme ta relève toi-même. Prends quelqu'un qui a les bases, en couture, en confection, en assistanat technique, et donne-lui deux ans à côté de ton senior. C'est le seul moyen fiable que je vois. Les marques qui l'ont fait il y a cinq ans ne m'appellent plus pour ça aujourd'hui.\n\nTrois, ne confonds pas le logiciel et le métier. Quelqu'un qui connaît un outil de patronage numérique n'est pas forcément un technicien. Le logiciel s'apprend. Le jugement sur un essayage, non.\n\nQuatre, regarde du côté des gens qui ont quitté l'industrie. Il y a des techniciens qui sont partis vers d'autres métiers quand leur employeur a fermé et qui reviendraient pour la bonne offre. Ceux là ne sont sur aucun site d'emploi, mais ils existent.\n\nJe ne dis pas ça pour faire peur. Je le dis parce que les marques qui s'en occupent maintenant vont avoir un avantage énorme dans cinq ans, et les autres vont payer très cher pour la même personne.\n\nTu as un poste technique difficile à combler? Appelle-moi avant de l'afficher. Pour ce métier là, l'affichage ne sert strictement à rien.`} },

  { id:"preparer-candidat-entrevue", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Stéphanie Lanoie",
    title:{en:"What I tell a candidate before their interview, and why it changes the outcome.",fr:"Ce que je dis à un candidat avant son entrevue, et pourquoi ça change le résultat."},
    excerpt:{en:"A candidate who walks in unprepared isn't a bad candidate. They're a candidate nobody prepared.",fr:"Un candidat qui arrive mal préparé n'est pas un mauvais candidat. C'est un candidat que personne n'a préparé."},
    body:{en:`People often tell me I close my searches fast. It's true, and it isn't because I work more hours than anyone else. A big part of it happens in the twenty minutes before the interview.\n\nA candidate who shows up unprepared isn't a bad candidate. They're a candidate nobody prepared. And when they stumble, everybody loses: the client starts over, the candidate stays where they were, and I go back to zero.\n\nSo I call, every time, the day before or that morning. Here's what I cover.\n\nFirst, who they're meeting and how that person operates. A plant manager who asks short, blunt questions isn't being hostile, that's just how they are. If the candidate knows that, they don't start doubting themselves five minutes in.\n\nThen, the two or three things the client is actually looking for. Not the job description, the real thing. Often it's one item: someone who can hold a night shift together, or someone who has been through an audit, or someone who won't quit in eight months like the last one. I tell the candidate so they talk about that and not something else.\n\nNext, I go through the gaps in their resume. Not to trip them up, so they have a clear, short answer. A year between jobs, three jobs in four years, a departure from the industry and a return: all of that explains itself beautifully when it's prepared and badly when it comes out cold.\n\nI also ask what they're going to ask. A candidate with no questions reads, to an employer, as not interested. I suggest two or three that show they've thought about the role. And I tell them which question not to ask in a first interview, starting with salary, because handling that is my job.\n\nAnd finally, the most important one: why they want this particular job. Not why they want to leave where they are. Why this one. If the candidate doesn't have a solid answer, that's fine, but we need to know before the interview and not during it.\n\nOn the client side, I ask for the same rigour. Tell me who's meeting the candidate and how much time you have. If you have thirty minutes, we don't walk through fifteen years of career, we aim. And give me feedback the same day, even if it's short. That's where good candidates are won or lost.\n\nIt isn't complicated. It's just work most people don't do. And that's why my searches close faster.\n\nGot a role to fill and want it to move? We'll start by preparing both sides properly.`,
          fr:`On me dit souvent que je ferme mes mandats vite. C'est vrai, et ce n'est pas parce que je travaille plus d'heures que les autres. C'est en grande partie à cause de ce qui se passe dans les vingt minutes avant l'entrevue.\n\nUn candidat qui arrive mal préparé n'est pas un mauvais candidat. C'est un candidat que personne n'a préparé. Et quand il se plante, tout le monde perd: le client recommence, le candidat reste là où il était, et moi je repars à zéro.\n\nAlors j'appelle, chaque fois, la veille ou le matin même. Voilà ce que je couvre.\n\nD'abord, qui il va rencontrer et comment cette personne fonctionne. Un directeur d'usine qui pose des questions courtes et sèches, ce n'est pas de l'hostilité, c'est sa façon d'être. Si le candidat le sait, il ne se met pas à douter au bout de cinq minutes.\n\nEnsuite, les deux ou trois choses que le client cherche vraiment. Pas la description de poste, ce qu'il cherche vraiment. Souvent, c'est une seule affaire: quelqu'un capable de tenir une équipe de nuit, ou quelqu'un qui a déjà passé une inspection, ou quelqu'un qui ne va pas démissionner dans huit mois comme le dernier. Je le dis au candidat pour qu'il parle de ça et pas d'autre chose.\n\nAprès, je passe à travers les trous de son CV. Pas pour l'embêter, pour qu'il ait une réponse claire et courte. Un an entre deux emplois, trois emplois en quatre ans, un départ de l'industrie et un retour: tout ça s'explique très bien quand c'est préparé et très mal quand ça sort à froid.\n\nJe lui demande aussi ce qu'il va demander. Un candidat sans questions, pour un employeur, ça veut dire pas intéressé. Je lui en suggère deux ou trois qui montrent qu'il a réfléchi au poste. Et je lui dis quelle question ne pas poser en première entrevue, à commencer par le salaire, parce que c'est mon travail de gérer ça.\n\nEt enfin, la plus importante: pourquoi il veut cette job là. Pas pourquoi il veut partir de chez lui. Pourquoi celle là. Si le candidat n'a pas de réponse solide, ce n'est pas grave, mais il faut qu'on le sache avant l'entrevue et pas pendant.\n\nDu côté client, je demande la même rigueur. Dis-moi qui rencontre le candidat et combien de temps tu as. Si tu as trente minutes, on ne fait pas le tour de quinze ans de carrière, on cible. Et donne-moi un retour le jour même, même court. C'est là que se gagnent ou se perdent les bons candidats.\n\nCe n'est pas compliqué. C'est juste du travail que la plupart des gens ne font pas. Et c'est pour ça que mes mandats ferment plus vite.\n\nTu as un poste à combler et tu veux que ça avance? On va commencer par bien préparer les deux côtés.`} },

  { id:"contre-offre", cat:{en:"Career",fr:"Carrière"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Stéphanie Lanoie",
    title:{en:"I can see a counter-offer coming three weeks out. Here's what tips me off.",fr:"La contre-offre, je la vois venir trois semaines d'avance. Voilà à quoi."},
    excerpt:{en:"Most people who accept a counter-offer are gone within a year anyway. The warning signs show up long before the resignation.",fr:"La plupart des gens qui acceptent une contre-offre sont partis dans l'année quand même. Les signes apparaissent bien avant la démission."},
    body:{en:`A candidate accepts an offer, they're happy, they resign, and two days later they call me sounding uncomfortable: their employer offered them more to stay. It happens. And most of the time, I saw it coming.\n\nHere are the signs.\n\nThe first is when the candidate never tells me about a concrete problem. They want a new challenge, they want to grow, they're looking for something else. Those are phrases, not reasons. Someone who's really leaving has a specific story: a manager it stopped working with, a promotion promised twice and never given, a schedule that wrecks their weekends. If I don't have that story, money will be enough to keep them.\n\nThe second is when the whole conversation revolves around money. A candidate who compares numbers and nothing else will keep comparing numbers right to the end, including the day their employer pulls out a chequebook.\n\nThe third is when they haven't discussed any of it at home. A move, a different schedule, a temporary dip in income: if it hasn't been talked through with a partner, the decision isn't made, it's postponed.\n\nThe fourth is when they tell me their employer will be surprised. In most cases the employer is never surprised. They know. And they already have a number in mind.\n\nWhat I do with all this. I ask the questions early, not at the end. By the second conversation, I ask what would happen if their employer offered fifteen percent more to keep them. The answer tells me everything. If the candidate hesitates, we work on it together, honestly. Sometimes the conclusion is that they should stay, and I say so. I'd rather lose a candidate in week two than burn my client in week eight.\n\nAnd I prepare the resignation with them. What to say, to whom, in what order, and what to answer when the counter-offer lands. Because it will land.\n\nFor the candidates reading this, one number worth keeping in mind: the large majority of people who accept a counter-offer end up leaving within the year anyway. Money treats the symptom. It doesn't treat the reason you answered my call in the first place.\n\nAnd for employers: if you have to offer more to keep someone on the day they resign, you already knew you were underpaying them. The real question is why you waited.\n\nLooking around and want to talk it through honestly? That's exactly the kind of conversation I like to have.`,
          fr:`Un candidat accepte une offre, il est content, il remet sa démission, et deux jours plus tard il m'appelle mal à l'aise: son employeur lui a offert plus pour rester. Ça arrive. Et la plupart du temps, je l'avais vu venir.\n\nVoilà les signes.\n\nLe premier, c'est quand le candidat ne me parle jamais d'un problème concret. Il veut un nouveau défi, il veut évoluer, il cherche autre chose. Ce sont des phrases, pas des raisons. Quelqu'un qui part pour de vrai a une histoire précise: un patron avec qui ça ne marche plus, une promotion promise deux fois et jamais donnée, un horaire qui détruit ses fins de semaine. Si je n'ai pas cette histoire là, le salaire va suffire à le retenir.\n\nLe deuxième, c'est quand toute la conversation tourne autour de l'argent. Un candidat qui compare les chiffres et rien d'autre va comparer les chiffres jusqu'à la fin, y compris le jour où son employeur sort son chéquier.\n\nLe troisième, c'est quand il n'a parlé de rien à la maison. Un déménagement, un horaire différent, une baisse temporaire de revenu: si ça n'a pas été discuté avec le conjoint, la décision n'est pas prise, elle est juste repoussée.\n\nLe quatrième, c'est quand il me dit que son employeur va être surpris. Dans la plupart des cas, l'employeur n'est jamais surpris. Il sait. Et il a déjà une idée de ce qu'il va offrir.\n\nCe que je fais avec ça. Je pose les questions tôt, pas à la fin. Dès la deuxième conversation, je demande ce qui se passerait si son employeur offrait quinze pour cent de plus pour qu'il reste. La réponse me dit tout. Si le candidat hésite, on travaille là dessus ensemble, honnêtement. Des fois la conclusion c'est qu'il devrait rester, et je le lui dis. Je préfère perdre un candidat en semaine deux que de brûler mon client en semaine huit.\n\nEt je prépare la démission avec lui. Quoi dire, à qui, dans quel ordre, et quoi répondre quand la contre-offre arrive. Parce qu'elle va arriver.\n\nPour les candidats qui me lisent, une donnée à garder en tête: la grande majorité des gens qui acceptent une contre-offre sont partis quand même dans l'année. L'argent règle le symptôme. Il ne règle pas la raison qui t'a fait répondre à mon appel.\n\nEt pour les employeurs: si tu dois offrir plus pour garder quelqu'un le jour de sa démission, tu savais déjà que tu le sous payais. La vraie question, c'est pourquoi tu as attendu.\n\nTu es en train de regarder ailleurs et tu veux en parler franchement? C'est exactement le genre de conversation que j'aime avoir.`} },

  { id:"recruter-vendeur-ingredients", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Rana Yamak",
    title:{en:"Hiring a food ingredient sales rep isn't hiring a salesperson.",fr:"Recruter un représentant en ingrédients alimentaires, ce n'est pas recruter un vendeur."},
    excerpt:{en:"The sales cycle runs eighteen months and the buyer is a food scientist. That changes who you need.",fr:"Le cycle de vente dure dix-huit mois et l'acheteur est un scientifique. Ça change complètement qui il te faut."},
    body:{en:`Since I joined Proforce, almost all of my placements have been commercial roles on the food ingredient side. Account management, territory sales, business development. And the thing I repeat most often to my clients is that this isn't a sales job in the usual sense.\n\nHere's why.\n\nThe sales cycle is long. Very long. When you sell an ingredient to a processor, you don't close in three calls. There are samples, lab trials, plant trials, food safety validations, sometimes a label change and a regulatory approval. Eighteen months between first contact and first order isn't unusual. A rep used to thirty day cycles will lose their mind and leave before closing anything.\n\nThe person across the table isn't a classic buyer. It's often a scientist in research and development, a quality lead or a production manager. Those people aren't buying a relationship, they're buying a solution to a technical problem. If your rep doesn't understand what a texture profile is, how an ingredient interacts with pH or what an allergen constraint means, the conversation ends on the first call.\n\nCommission arrives late. That's a structural detail that drives good people out. If your plan pays on the closed sale and the sale takes eighteen months, your new rep lives a year and a half on base salary while their former colleagues are cashing cheques somewhere else. Build something for the ramp up period.\n\nWhat I look for when I recruit these roles. Someone who can talk technical without being the technician. They don't need to be a chemist, but they need to hold a conversation with one, know when to pull in their own technical support, and translate a plant's need into a solution.\n\nSomeone with structured patience. I always ask them to walk me through an account that took more than a year to open, step by step. The ones who actually did it tell me about the failed trials. The ones who didn't tell me about their relationship with the client.\n\nAnd someone who knows their territory beyond a list. A good rep knows which plants are expanding, which one changed production managers last year, which one is reformulating. That can't be improvised.\n\nOne last point for employers: don't confuse a contact list with the ability to sell. I go into that in more detail elsewhere, but the short version is that a contact list runs dry in eighteen months and a good sales process lasts a whole career.\n\nLooking for someone to open or grow an ingredient territory? Let's talk about your sales cycle before we talk about the profile.`,
          fr:`Depuis que je suis chez Proforce, presque tous mes placements sont des postes commerciaux du côté des ingrédients alimentaires. Gestion de comptes, ventes de territoire, développement des affaires. Et la chose que je répète le plus souvent à mes clients, c'est que ce n'est pas un poste de vendeur au sens habituel.\n\nVoilà pourquoi.\n\nLe cycle de vente est long. Très long. Quand tu vends un ingrédient à un transformateur, tu ne fermes pas en trois appels. Il y a des échantillons, des essais en laboratoire, des essais en usine, des validations de salubrité, parfois un changement d'étiquette et une approbation réglementaire. Dix-huit mois entre le premier contact et la première commande, ce n'est pas rare. Un vendeur habitué à des cycles de trente jours va devenir fou et partir avant d'avoir conclu quoi que ce soit.\n\nLa personne en face n'est pas un acheteur classique. C'est souvent un scientifique en recherche et développement, un responsable qualité ou un directeur de production. Ces gens là n'achètent pas une relation, ils achètent une solution à un problème technique. Si ton représentant ne comprend pas ce qu'est un profil de texture, une interaction avec le pH ou une contrainte d'allergène, la conversation s'arrête au premier appel.\n\nLa commission arrive en retard. C'est un détail de structure qui fait partir des bonnes personnes. Si ton plan paie sur la vente conclue et que la vente prend dix-huit mois, ton nouveau représentant va vivre un an et demi sur son salaire de base pendant que ses anciens collègues encaissent ailleurs. Prévois quelque chose pour la période de montée.\n\nCe que je cherche quand je recrute pour ces postes. Quelqu'un qui est capable de parler technique sans être le technicien. Il ne doit pas être chimiste, mais il doit pouvoir tenir une conversation avec un chimiste, savoir quand appeler le soutien technique de son employeur et traduire un besoin d'usine en solution.\n\nQuelqu'un qui a de la patience structurée. Je demande toujours de me décrire un compte qui a pris plus d'un an à ouvrir, étape par étape. Ceux qui ont vraiment fait ça me racontent les essais ratés. Ceux qui ne l'ont pas fait me parlent de leur relation avec le client.\n\nEt quelqu'un qui connaît son territoire autrement que par une liste. Un bon représentant sait quelles usines sont en expansion, laquelle a changé de directeur de production l'an dernier, laquelle est en train de reformuler. Ça, ça ne s'improvise pas.\n\nUn dernier point pour les employeurs: ne confonds pas le carnet d'adresses et la capacité de vendre. J'en parle plus en détail ailleurs, mais la version courte, c'est qu'un carnet s'épuise en dix-huit mois et qu'un bon processus de vente dure toute une carrière.\n\nTu cherches quelqu'un pour ouvrir ou développer un territoire en ingrédients? Parlons de ton cycle de vente avant de parler du profil.`} },

  { id:"territoire-ventes", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Rana Yamak",
    title:{en:"The question everyone forgets to ask before hiring a territory rep.",fr:"La question que tout le monde oublie de poser avant d'embaucher un représentant de territoire."},
    excerpt:{en:"Two reps with the same title can have territories worth five times each other. Define it before you hire.",fr:"Deux représentants avec le même titre peuvent avoir des territoires qui valent cinq fois l'un l'autre. Définis-le avant d'embaucher."},
    body:{en:`When a client asks me for a territory rep, my first question isn't about the profile. It's: what exactly is the territory?\n\nNine times out of ten, the answer is vague. Quebec. Eastern Canada. Existing accounts plus new development. Those are words, not a territory.\n\nAnd it's a real problem, because two reps with the same title can hold territories worth five times each other. A territory with twelve established accounts ordering every month is not the same job as a blank territory where you knock on doors for two years. Both are legitimate roles. They are not the same people.\n\nHere's what I ask before I start searching.\n\nHow many active accounts, and how much revenue they already represent. A serious candidate will ask this in the interview. If you don't have the answer, you lose credibility.\n\nWhat share of the role is maintenance and what share is development. Give a real percentage. If it's eighty percent maintenance, say so, there are excellent account managers looking for exactly that. If you sell it as development to make it exciting and the person spends their days taking orders, they'll leave.\n\nWho held the territory before, and why they're gone. Candidates will ask. If there have been three people in four years, the issue isn't the profile anymore, it's the territory itself or the comp structure.\n\nHow you measure success in year one. Revenue? New accounts opened? Trials launched? In ingredients and CPG, a good rep can spend a year doing exactly the right work before a single order shows up. If your only metric is year one revenue, you'll fire someone who was succeeding.\n\nAnd the boundaries. Who owns a customer headquartered in Ontario with a plant in Quebec? Who gets the commission? It sounds administrative, but it's the number one source of friction inside a sales team, and experienced candidates will ask you about it.\n\nMy advice: write your territory out on one page before you post anything. The accounts, current revenue, the target, the maintenance and development split, the boundary rules. It takes an hour. It saves you from hiring the wrong person and starting over in eighteen months.\n\nWant to structure a territory before recruiting? That's a conversation I have every week, we can have it together.`,
          fr:`Quand un client me demande un représentant de territoire, ma première question n'est pas sur le profil. C'est: c'est quoi, exactement, le territoire?\n\nNeuf fois sur dix, la réponse est floue. Le Québec. L'est du Canada. Les comptes existants plus du nouveau développement. Ce sont des mots, pas un territoire.\n\nEt c'est un vrai problème, parce que deux représentants avec le même titre peuvent avoir des territoires qui valent cinq fois l'un l'autre. Un territoire avec douze comptes établis qui commandent tous les mois, ce n'est pas le même métier qu'un territoire vierge où il faut cogner aux portes pendant deux ans. Les deux sont des postes légitimes. Ce ne sont pas les mêmes personnes.\n\nCe que je demande avant de commencer à chercher.\n\nCombien de comptes actifs, et combien de revenu ils représentent déjà. Un candidat sérieux va poser cette question en entrevue. Si tu n'as pas la réponse, tu perds de la crédibilité.\n\nQuelle part du poste est du maintien et quelle part est du développement. Dis un vrai pourcentage. Si c'est quatre vingts pour cent de maintien, dis-le, il y a d'excellents gestionnaires de comptes qui cherchent exactement ça. Si tu vends le poste comme du développement pour le rendre excitant et que la personne passe ses journées à prendre des commandes, elle va partir.\n\nQui avait le territoire avant, et pourquoi il n'est plus là. Les candidats vont le demander. S'il y a eu trois personnes en quatre ans, la question n'est plus le profil, c'est le territoire lui-même ou la structure de rémunération.\n\nComment tu mesures le succès la première année. Du revenu? Des nouveaux comptes ouverts? Des essais lancés? Dans les ingrédients et le CPG, un bon représentant peut passer un an à faire exactement le bon travail sans qu'une commande n'apparaisse encore. Si ton seul indicateur est le revenu de l'année un, tu vas congédier quelqu'un qui était en train de réussir.\n\nEt les frontières. Qui s'occupe d'un client dont le siège social est en Ontario mais dont l'usine est au Québec? Qui touche la commission? Ça semble administratif, mais c'est la source numéro un des chicanes dans une équipe de vente, et les candidats expérimentés vont te le demander.\n\nMon conseil: écris ton territoire sur une page avant d'afficher quoi que ce soit. Les comptes, le revenu actuel, la cible, la répartition maintien et développement, les règles de frontière. Ça prend une heure. Ça t'évite d'embaucher la mauvaise personne et de recommencer dans dix-huit mois.\n\nTu veux structurer un territoire avant de recruter? C'est le genre de conversation que j'ai chaque semaine, on peut la faire ensemble.`} },

  { id:"commissions-depart-vendeurs", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Rana Yamak",
    title:{en:"Your best sales people keep leaving? Look at your commission plan before you blame the market.",fr:"Tes meilleurs vendeurs partent? Regarde ta structure de commissions avant de blâmer le marché."},
    excerpt:{en:"When three reps leave in two years, it's almost never three separate coincidences.",fr:"Quand trois représentants partent en deux ans, ce n'est à peu près jamais trois coïncidences."},
    body:{en:`A client calls me to replace a sales rep. I ask who was there before. He tells me it's the third one in two years. And he adds that the market is tough.\n\nThe market is tough, that's true. But three departures in two years is almost never three separate coincidences. In the commercial roles I recruit, the cause is almost always in the comp structure. Here are the problems I see most often.\n\nThe unannounced cap. The plan says commission is uncapped, except that the moment someone blows past target, their quota gets revised or their territory gets redrawn. The person understands very quickly that they're being punished for performing. They don't complain. They start answering recruiters.\n\nThe payment lag. In ingredients, an account opened today orders in eighteen months. If commission pays on the order, your new rep does good work for a year and a half without seeing a dollar of variable pay. Plenty of companies fix this with a declining guarantee over twelve or eighteen months. The ones that don't recruit again every two years.\n\nHouse accounts. The two or three big customers pulled out of the territory because management handles them. That can be defensible. But if you hire someone by selling them a territory and the best accounts aren't in it, say so in the interview. Candidates find out in month three and they remember.\n\nThe quota set after the hire. I still see offers where the target will be communicated later. A good rep doesn't accept that, or they accept and leave the moment they see the number. Put the target in the offer.\n\nThe unilateral change. Modifying the plan mid year, even for good reasons, is the strongest signal you can send a sales team. If you have to do it, explain it in person and protect the current year.\n\nWhat I ask my clients before launching a search is to show me the plan. Not a summary, the plan. I want to see the base, the percentage, the target, the accelerator mechanics if there are any, and what happens in year one. If I can't explain it clearly to a candidate in three minutes, it's too complicated, and a plan that's too complicated motivates nobody.\n\nAnd I always ask about realistic earnings. Not theoretical. What the person in the comparable role at your company actually made last year. It's the only number a good candidate believes.\n\nGot turnover in your sales team and want to understand why? Show me your plan, I'll tell you what candidates think of it.`,
          fr:`Un client m'appelle pour remplacer un représentant. Je demande qui était là avant. Il me répond que c'est le troisième en deux ans. Et il ajoute que le marché est difficile.\n\nLe marché est difficile, c'est vrai. Mais trois départs en deux ans, ce n'est à peu près jamais trois coïncidences. Dans les postes commerciaux que je recrute, la cause est presque toujours dans la structure de rémunération. Voilà les problèmes que je vois le plus souvent.\n\nLe plafond non annoncé. Le plan dit que la commission est illimitée, sauf qu'au moment où quelqu'un dépasse largement sa cible, on révise ses quotas ou on redécoupe son territoire. La personne comprend très vite qu'elle est punie d'avoir bien fait. Elle ne se plaint pas. Elle commence à répondre aux recruteurs.\n\nLe décalage de paiement. Dans les ingrédients, un compte ouvert aujourd'hui commande dans dix-huit mois. Si la commission se paie à la commande, ton nouveau représentant fait du bon travail pendant un an et demi sans voir un sou de variable. Beaucoup d'entreprises règlent ça avec une garantie décroissante sur douze ou dix-huit mois. Celles qui ne le font pas recrutent à nouveau chaque deux ans.\n\nLes comptes maison. Les deux ou trois gros clients retirés du territoire parce qu'ils sont gérés par la direction. Ça peut se défendre. Mais si tu embauches quelqu'un en lui vendant un territoire et que les meilleurs comptes n'en font pas partie, dis-le en entrevue. Les candidats le découvrent au mois trois et ils s'en souviennent.\n\nLa cible fixée après l'embauche. Je vois encore des offres où le quota sera communiqué plus tard. Un bon représentant n'accepte pas ça, ou il accepte et il part dès qu'il voit le chiffre. Mets la cible dans l'offre.\n\nLe changement unilatéral. Modifier le plan en cours d'année, même pour de bonnes raisons, c'est le signal le plus fort que tu peux envoyer à une équipe de vente. Si tu dois le faire, explique-le en personne et protège l'année en cours.\n\nCe que je demande à mes clients avant de lancer une recherche, c'est de me montrer le plan. Pas un résumé, le plan. Je veux voir la base, le pourcentage, la cible, la mécanique d'accélérateur s'il y en a une, et ce qui se passe la première année. Si je ne peux pas l'expliquer clairement à un candidat en trois minutes, c'est trop compliqué, et un plan trop compliqué ne motive personne.\n\nEt je pose toujours la question du revenu réaliste. Pas le théorique. Combien la personne qui occupe le poste similaire chez toi a gagné l'an dernier, pour vrai. C'est le seul chiffre auquel un bon candidat croit.\n\nTu as un roulement dans ton équipe de vente et tu veux comprendre pourquoi? Montre-moi ton plan, je vais te dire ce que les candidats en pensent.`} },

  { id:"gestionnaire-comptes-carnet", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Rana Yamak",
    title:{en:"An account manager shouldn't be judged on their contact list.",fr:"Un gestionnaire de comptes ne se juge pas sur son carnet d'adresses."},
    excerpt:{en:"A contact list runs dry in eighteen months. A real process lasts a career.",fr:"Un carnet d'adresses s'épuise en dix-huit mois. Un vrai processus dure une carrière."},
    body:{en:`In interviews, the question comes up constantly: is the candidate bringing clients with them?\n\nI understand why people ask. But it's the wrong question, and it leads to hiring the wrong people.\n\nFirst, because a contact list runs dry. A rep's contacts are an asset that starts depreciating on day one. People change jobs, companies change strategy, contracts are locked into multi year agreements. In my experience, whatever value was in the list is consumed within eighteen months. After that, what matters is the person's ability to build a new one.\n\nSecond, because customers rarely belong to one person. In food, a supplier relationship is a research and development scientist, a buyer, a quality lead, a plant manager, and an approval from a committee somewhere. A rep has a good relationship with one or two of those people. That opens a door. It doesn't transfer an account.\n\nAnd third, because someone selling you their contact list will sell yours to the next employer. That's not a moral judgment, it's just an observation. A person whose main argument is their list treats relationships as personal property. Two years from now, you'll be on the other side of that equation.\n\nHere's what I look at instead.\n\nHow the person opened their last significant account. I want the steps, not the anecdote. How they identified the target, who they reached first, what blocked, how long it took. Someone with a process can repeat it somewhere else. Someone who got lucky can't.\n\nHow they saved an account that was slipping. That's the real test of an account manager. Losing a customer because the price went up, everybody has lived that. What matters is what the person did between sensing the problem and it being too late.\n\nHow they work with people who don't report to them. In food, a rep closes nothing alone. They need technical, regulatory, logistics. The best ones I've placed are the ones their internal colleagues enjoy helping.\n\nAnd what they know about the market in general, not just their own accounts. Which plants are expanding, who's reformulating, where demand is heading. That curiosity predicts performance better than any list of names.\n\nMy advice to employers: stop asking who they're bringing. Ask how they do it. You'll hire someone who's still performing in five years.\n\nBuilding or rebuilding an account team? We can look together at what the right profile is for your market.`,
          fr:`En entrevue, la question revient tout le temps: est-ce que le candidat amène des clients avec lui?\n\nJe comprends pourquoi on la pose. Mais c'est la mauvaise question, et elle fait embaucher les mauvaises personnes.\n\nD'abord, parce qu'un carnet d'adresses s'épuise. Les contacts d'un représentant, c'est un actif qui se déprécie à partir du premier jour. Les gens changent de poste, les entreprises changent de stratégie, les contrats sont attachés à des ententes pluriannuelles. Dans mon expérience, ce qui restait de valeur du carnet est consommé en dix-huit mois. Après ça, ce qui compte c'est la capacité de la personne à en bâtir un nouveau.\n\nEnsuite, parce que les clients appartiennent rarement à une personne. Dans l'alimentaire, une relation fournisseur, c'est un scientifique en recherche et développement, un acheteur, un responsable qualité, un directeur d'usine, et une approbation d'un comité quelque part. Un représentant a une bonne relation avec une ou deux de ces personnes. Ça ouvre une porte. Ça ne transfère pas un compte.\n\nEt enfin, parce que quelqu'un qui vend son carnet va vendre le tien au prochain. Ce n'est pas un jugement moral, c'est juste une observation. La personne qui se présente avec sa liste comme argument principal considère les relations comme sa propriété personnelle. Deux ans plus tard, tu seras de l'autre côté de l'équation.\n\nCe que je regarde à la place.\n\nComment la personne a ouvert son dernier compte important. Je veux les étapes, pas l'anecdote. Comment elle a identifié la cible, qui elle a joint en premier, ce qui a bloqué, combien de temps ça a pris. Quelqu'un qui a un processus peut le répéter ailleurs. Quelqu'un qui a eu de la chance ne peut pas.\n\nComment elle a sauvé un compte en train de glisser. C'est le vrai test d'un gestionnaire de comptes. Perdre un client parce que le prix a monté, tout le monde a vécu ça. Ce qui compte, c'est ce que la personne a fait entre le moment où elle a senti le problème et le moment où il était trop tard.\n\nComment elle travaille avec les gens qui ne relèvent pas d'elle. Dans l'alimentaire, un représentant ne ferme rien tout seul. Il a besoin du technique, du réglementaire, de la logistique. Les meilleurs que j'ai placés sont ceux que leurs collègues internes aiment aider.\n\nEt ce qu'elle connaît du marché en général, pas seulement de ses comptes. Quelles usines sont en expansion, qui reformule, où s'en va la demande. Cette curiosité là prédit mieux la performance que n'importe quelle liste de noms.\n\nMon conseil aux employeurs: arrête de demander qui il amène. Demande comment il s'y prend. Tu vas embaucher quelqu'un qui va encore performer dans cinq ans.\n\nTu bâtis ou tu refais une équipe de comptes? On peut regarder ensemble à quoi ressemble le bon profil pour ton marché.`} },

  { id:"recruter-ontario-siege-quebec", cat:{en:"Market",fr:"Marché"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Michaela Landers",
    title:{en:"Hiring in Ontario when your head office is in Quebec.",fr:"Recruter en Ontario quand ton siège social est au Québec."},
    excerpt:{en:"Same country, same roles, and a dozen small differences that sink searches.",fr:"Même pays, mêmes postes, et une douzaine de petites différences qui font échouer des mandats."},
    body:{en:`I deliver a lot of Ontario searches for companies headquartered in Quebec. The roles look alike, the titles are identical, and yet searches fail for reasons that have nothing to do with the profile. Here's what I see.\n\nThe first is geography. The Greater Toronto Area isn't a city, it's a dozen labour markets glued together. A candidate living in Oshawa won't apply to a plant in Mississauga, even if it looks close on a map. Two hours round trip, five days a week, disqualifies an excellent candidate. When I open a search there, I start by drawing a realistic radius around the plant, and that radius is usually smaller than the client imagines.\n\nThe second is competition. In some Ontario industrial corridors there are fifteen food plants within twenty minutes of each other. Your production supervisor literally has a choice. If your offer sits at the average, you won't hire, you'll just push up your neighbours' wages. You need a clear advantage: the schedule, the stability, the progression, something.\n\nThe third is pay. For a number of plant roles, Ontario pays more than Quebec. When a Quebec client hands me their grid and asks for the same profile in Toronto, the conversation starts there. It isn't a negotiating position, it's the market. Better to adjust it than to lose two months.\n\nThe fourth is language. A perfectly qualified Ontario candidate doesn't speak French, and that's normal. If your leadership meetings run in French, say so plainly, we'll look for someone bilingual and it will take longer. If it isn't necessary, don't put it in the posting out of reflex, you're cutting your pool in half for nothing.\n\nThe fifth is how the company is perceived. A brand that's well known in Quebec can be completely unknown in Mississauga. The candidate doesn't know who you are, doesn't know anyone who works there, and has to take your word for it. That's a big part of my job: explaining who the employer is, why they're solid, what the team looks like. Clients who agree to put a manager on the phone early close far faster.\n\nAnd the sixth is pace. The Toronto market moves faster. A good candidate interviewing Monday can have an offer elsewhere by Friday. A four stage process spread over six weeks doesn't work there.\n\nWhat I tell a Quebec client opening in Ontario: treat it as a new market, not an extension of yours. Check your pay, tighten your process, be clear about language, and be willing to introduce yourself.\n\nOpening a role in Ontario and want to know what the local market will say about your offer? I can tell you before you post it.`,
          fr:`Je livre beaucoup de mandats en Ontario pour des entreprises dont le siège social est au Québec. Les postes se ressemblent, les titres sont les mêmes, et pourtant les recherches échouent pour des raisons qui n'ont rien à voir avec le profil. Voilà ce que je vois.\n\nLa première, c'est la géographie. Le Grand Toronto n'est pas une ville, c'est une douzaine de marchés de l'emploi collés ensemble. Un candidat qui habite Oshawa ne postulera pas pour une usine à Mississauga, même si sur une carte ça a l'air proche. Deux heures de trajet aller retour, cinq jours par semaine, ça disqualifie un excellent candidat. Quand j'ouvre un mandat là bas, je commence par tracer un rayon réaliste autour de l'usine, et ce rayon est souvent plus petit que ce que le client imagine.\n\nLa deuxième, c'est la concurrence. Dans certains corridors industriels ontariens, il y a quinze usines alimentaires à vingt minutes les unes des autres. Ton superviseur de production a littéralement le choix. Si ton offre est dans la moyenne, tu ne recruteras pas, tu vas juste faire monter les salaires de tes voisins. Il faut un avantage clair: l'horaire, la stabilité, la progression, quelque chose.\n\nLa troisième, c'est le salaire. Pour plusieurs postes d'usine, l'Ontario paie plus que le Québec. Quand un client québécois me donne sa grille et me demande le même profil à Toronto, la conversation commence là. Ce n'est pas une question de négociation, c'est le marché. Mieux vaut l'ajuster avant que de perdre deux mois.\n\nLa quatrième, c'est la langue. Un candidat ontarien parfaitement qualifié ne parle pas français, et c'est normal. Si tes réunions de direction se passent en français, dis-le franchement, on cherchera un bilingue et ça va prendre plus de temps. Si ce n'est pas nécessaire, ne le mets pas dans l'affichage par réflexe, tu coupes ton bassin de moitié pour rien.\n\nLa cinquième, c'est la perception de l'entreprise. Une marque bien connue au Québec peut être totalement inconnue à Mississauga. Le candidat ne sait pas qui tu es, ne connaît personne qui y travaille, et doit te faire confiance sur parole. C'est une grosse partie de mon travail: expliquer qui est l'employeur, pourquoi il est solide, à quoi ressemble l'équipe. Les clients qui acceptent de mettre un gestionnaire au téléphone tôt dans le processus ferment beaucoup plus vite.\n\nEt la sixième, c'est le rythme. Le marché torontois bouge plus vite. Un bon candidat qui passe en entrevue le lundi peut avoir une offre ailleurs le vendredi. Un processus à quatre étapes étalé sur six semaines ne fonctionne pas là bas.\n\nCe que je conseille à un client québécois qui ouvre en Ontario: traite ça comme un nouveau marché, pas comme une extension du tien. Vérifie ton salaire, resserre ton processus, sois clair sur la langue et accepte de te présenter.\n\nTu ouvres un poste en Ontario et tu veux savoir ce que le marché local va dire de ton offre? Je peux te le dire avant que tu l'affiches.`} },

  { id:"cv-usine-ce-que-je-vois", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Michaela Landers",
    title:{en:"What I see in a plant resume that you don't.",fr:"Ce que je vois dans un CV d'usine que tu ne vois pas."},
    excerpt:{en:"Certifications and titles tell you almost nothing. The useful signals are somewhere else.",fr:"Les certifications et les titres ne disent presque rien. Les vrais signaux sont ailleurs."},
    body:{en:`I read hundreds of plant resumes a year. After a while you stop reading the certification list and start seeing something else. Here are the signals I pay attention to, and that most managers don't look at.\n\nPlant size. A production manager in a forty person plant and a production manager in a four hundred person plant are not doing the same job. The first one is on the floor, touching everything, solving problems themselves. The second manages supervisors, budgets and meetings. The two titles are identical. Move someone from small to large without preparation and you'll have an excellent person who looks like they're drowning.\n\nProduct type. Meat, dairy, bakery, ready to eat: different rhythms, different food safety constraints, different cultures. Someone coming out of meat arrives with hygiene and traceability reflexes that transfer well elsewhere. The reverse isn't always true.\n\nShifts. A candidate who did five years of nights applying to a day role, I understand immediately why they're moving. A candidate who has always worked days being offered nights, that's an honest conversation to have before the interview, not after the offer.\n\nTenure. Three years, three years, three years is a stable profile. Eight months, fourteen months, ten months isn't necessarily a red flag, but it's a question to ask. Often the answer is a plant closure, an acquisition or a contract that ended. Don't disqualify before you've asked.\n\nInternal progression. Someone who started as an operator and is now a supervisor at the same employer tells me more than a diploma. It means the people who watched them work every day trusted them.\n\nConcrete projects. A quality system implementation, a line start up, an expansion, a certification achieved. Those are verifiable things that give you real material in an interview. A resume without any isn't bad, but you'll have to dig longer.\n\nAnd what I barely look at: formatting, minor typos, length. The best plant managers I've placed had ordinary resumes. These are people who run teams and equipment, not people who sell themselves on paper.\n\nWhat I ask clients for in return is to tell me what made the last person in the role fail. With that information, I know what to look for in the resumes. Without it, I'm guessing.\n\nGot a stack of resumes and nothing convincing? Send them to me with the context, I'll probably see different things in them.`,
          fr:`Je lis des centaines de CV d'usine par année. Après un certain temps, on arrête de lire la liste des certifications et on commence à voir autre chose. Voilà les signaux auxquels je fais attention, et que la plupart des gestionnaires ne regardent pas.\n\nLa taille de l'usine. Un directeur de production dans une usine de quarante employés et un directeur de production dans une usine de quatre cents ne font pas le même métier. Le premier est sur le plancher, touche à tout, règle les problèmes lui-même. Le deuxième gère des superviseurs, des budgets et des réunions. Les deux titres sont identiques. Fais passer quelqu'un du petit au grand sans préparation et tu vas avoir une personne excellente qui a l'air de couler.\n\nLe type de produit. La viande, le laitier, la boulangerie, le prêt à manger: ce sont des rythmes, des contraintes de salubrité et des cultures différentes. Quelqu'un qui vient de la viande arrive avec des réflexes d'hygiène et de traçabilité qui se transposent bien ailleurs. L'inverse n'est pas toujours vrai.\n\nLes quarts. Un candidat qui a fait cinq ans de nuit et qui postule sur un poste de jour, je comprends tout de suite pourquoi il bouge. Un candidat qui a toujours été de jour et à qui on propose de la nuit, c'est une conversation honnête à avoir avant l'entrevue, pas après l'offre.\n\nLes durées. Trois ans, trois ans, trois ans, c'est un profil stable. Huit mois, quatorze mois, dix mois, ce n'est pas nécessairement un drapeau rouge, mais c'est une question à poser. Plusieurs fois la réponse est une fermeture d'usine, un rachat ou un contrat qui s'est terminé. Ne disqualifie pas avant d'avoir demandé.\n\nLa progression interne. Quelqu'un qui est entré comme opérateur et qui est rendu superviseur chez le même employeur, ça me dit plus qu'un diplôme. Ça veut dire que les gens qui le voyaient travailler tous les jours lui ont fait confiance.\n\nLes projets concrets. Une implantation de système qualité, un démarrage de ligne, un agrandissement, une certification obtenue. Ce sont des choses vérifiables qui donnent une vraie matière en entrevue. Un CV qui n'en contient aucune n'est pas mauvais, mais il va falloir creuser plus longtemps.\n\nEt ce que je ne regarde presque pas: la mise en page, les fautes mineures, la longueur. Les meilleurs directeurs d'usine que j'ai placés avaient des CV ordinaires. Ce sont des gens qui gèrent des équipes et des équipements, pas des gens qui se vendent sur papier.\n\nCe que je demande aux clients en retour, c'est de me dire ce qui a fait échouer la dernière personne dans le poste. Avec cette information, je sais quoi chercher dans les CV. Sans elle, je devine.\n\nTu as une pile de CV et rien qui te convainc? Envoie-les moi avec le contexte, je vais probablement y voir des choses différentes.`} },

  { id:"trente-questions-avant-chercher", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Michaela Landers",
    title:{en:"Why I ask you thirty questions before I start searching.",fr:"Pourquoi je te pose trente questions avant de commencer à chercher."},
    excerpt:{en:"The hour at the start is what saves the three months at the end.",fr:"L'heure au début, c'est ce qui sauve les trois mois à la fin."},
    body:{en:`When a search is opened with me, I don't start looking that same day. I start with a long conversation, and I know that surprises some clients. They'd rather I got going immediately. I understand. But the hour we spend at the start is what saves the three months at the end.\n\nHere's the kind of thing I want to know.\n\nWhy the role is open. A departure, growth, a leave, a termination. All four lead to completely different searches. If someone was let go, I want to know why, because that's exactly what we need to avoid in the next person.\n\nWho was there before and for how long. If three people spent less than a year in this role, the problem isn't the candidate pool. We're going to talk about that before I start.\n\nWho the person reports to, and how that manager works. It's the most important question and the one I'm asked least. An excellent supervisor can fail under a manager who doesn't delegate. I'd rather know first.\n\nWhat a good day in this role looks like. Not the responsibilities, the day. How much time on the floor, how much in meetings, how much in front of a screen. Candidates ask this and I want to be able to answer.\n\nWhat's genuinely mandatory in the requirements. Not the list, the real minimum. If you tell me ten years of experience and the right person has seven, do we reject them? The answer is almost always no, and it opens the pool.\n\nWhat the real salary range is. Not the posted range, the one you'd pay for someone who makes you say yes on the spot.\n\nHow many stages in the process, who takes part, and over what timeline. If you tell me six weeks, I'll prepare candidates accordingly. If you tell me six weeks and it takes twelve, I lose their trust and yours.\n\nAnd finally: what would make you say no to someone who has everything else. That question often settles the whole search on its own. The answers are sometimes surprising and always useful.\n\nWhat it produces concretely is that I bring you two or three people instead of eight, and they fit. Clients who take that hour with me get more accurate candidates and close faster. The ones who don't have time get more resumes, which is exactly what they didn't want.\n\nGot a role to open? Block an hour with me before you block three months of searching.`,
          fr:`Quand on m'ouvre un mandat, je ne commence pas à chercher le jour même. Je commence par une longue conversation, et je sais que ça surprend certains clients. Ils voudraient que je parte tout de suite. Je comprends. Mais l'heure qu'on passe au début, c'est ce qui sauve les trois mois à la fin.\n\nVoilà le genre de choses que je veux savoir.\n\nPourquoi le poste est ouvert. Un départ, une croissance, un congé, un congédiement. Les quatre mènent à des recherches complètement différentes. Si quelqu'un a été congédié, je veux savoir pourquoi, parce que c'est exactement ce qu'il faut éviter chez le prochain.\n\nQui était là avant et combien de temps. Si trois personnes ont passé moins d'un an dans ce poste, le problème n'est pas le bassin de candidats. On va en parler avant que je commence.\n\nÀ qui la personne se rapporte, et comment ce gestionnaire travaille. C'est la question la plus importante et c'est celle qu'on me pose le moins. Un superviseur excellent peut échouer sous un gestionnaire qui ne délègue pas. Je préfère le savoir avant.\n\nÀ quoi ressemble une bonne journée dans ce poste. Pas les responsabilités, la journée. Combien de temps sur le plancher, combien en réunion, combien devant un écran. Les candidats posent cette question et je veux pouvoir répondre.\n\nQu'est ce qui est vraiment obligatoire dans les exigences. Pas la liste, le minimum réel. Si tu me dis dix ans d'expérience et que la bonne personne en a sept, est ce qu'on la rejette? La réponse est presque toujours non, et ça ouvre le bassin.\n\nQuelle est la vraie fourchette salariale. Pas la fourchette affichée, celle que tu accepterais de payer pour quelqu'un qui te fait dire oui tout de suite.\n\nCombien d'étapes dans le processus, qui y participe, et en combien de temps. Si tu me dis six semaines, je vais préparer les candidats en conséquence. Si tu me dis six semaines et que ça en prend douze, je perds leur confiance et la tienne.\n\nEt finalement: qu'est ce qui te ferait dire non à quelqu'un qui a tout le reste. Cette question là règle souvent le mandat à elle seule. Les réponses sont parfois surprenantes et toujours utiles.\n\nCe que ça donne concrètement, c'est que je présente deux ou trois personnes au lieu de huit, et qu'elles correspondent. Les clients qui prennent cette heure avec moi reçoivent des candidats plus justes et ferment plus vite. Ceux qui n'ont pas le temps reçoivent plus de CV, et c'est exactement ce qu'ils ne voulaient pas.\n\nTu as un poste à ouvrir? Bloque une heure avec moi avant de bloquer trois mois de recherche.`} },

  { id:"quart-de-nuit", cat:{en:"Hiring",fr:"Embauche"}, date:"Novembre 2026", iso:"2026-11-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Mathieu Roy",
    title:{en:"Your night shift isn't a pay problem. It's a management problem.",fr:"Ton quart de nuit n'est pas un problème de salaire. C'est un problème de gestion."},
    excerpt:{en:"Adding a premium doesn't fix a shift nobody wants to supervise. Here's what does.",fr:"Ajouter une prime ne règle pas un quart que personne ne veut superviser. Voilà ce qui le règle."},
    body:{en:`Every month, someone calls me about a night shift supervisor. And every month, the same sentence comes up: we raised the premium and we still can't find anyone.\n\nThe premium helps. But if it were only about money, the role would have been filled long ago. In the plants I visit, the night shift problem is almost always somewhere else.\n\nAt night, there's nobody above you. That's the first thing candidates tell me. A day supervisor has a production manager two doors down, a quality lead, a millwright, human resources. At night, they have themselves. When a line goes down at two in the morning, they decide alone, fix what they can, and explain it the next day. That's a load few people want to carry for a two dollar premium.\n\nAt night, you inherit the day's problems. Production shortfalls, maintenance nobody had time for, late orders. The night shift often spends its life catching up. Nobody likes working a job where you never win.\n\nAnd at night, you aren't seen. Promotions get decided among people who run into each other. A capable night supervisor can go three years without talking to the plant manager other than by email. They eventually figure out that their path runs through another employer.\n\nHere's what works, based on the clients who don't have a night shift problem.\n\nThey give real autonomy and they put it in writing. The night supervisor can stop a line, call a millwright, reject a lot. Without waiting for morning. That changes the nature of the job entirely.\n\nThey put a manager on nights regularly. Not a surprise visit, a scheduled presence, once a month. The message is clear: this shift counts.\n\nThey build in an exit. Two years of nights, then the first available day role. Written into the offer. A candidate accepts an inconvenience far more easily when it has an end date.\n\nAnd they fix the day's problems instead of passing them along. If your night shift is constantly repairing what day didn't do, your recruiting problem is actually a scheduling problem.\n\nWhen I recruit a night supervisor, I talk about all of this with the client before we talk about salary. Plants that fix these things fill the role. The others call me back in eight months.`,
          fr:`Chaque mois, quelqu'un m'appelle pour un superviseur de nuit. Et chaque mois, la même phrase revient: on a monté la prime et on ne trouve personne pareil.\n\nLa prime aide. Mais si c'était juste une question d'argent, le poste serait comblé depuis longtemps. Dans les usines que je visite, le problème de la nuit est presque toujours ailleurs.\n\nLa nuit, il n'y a personne au-dessus. C'est la première chose que les candidats me disent. Un superviseur de jour a un directeur de production à deux portes, un responsable qualité, un mécanicien, les ressources humaines. La nuit, il a lui-même. Quand une ligne tombe à deux heures du matin, il décide seul, il répare ce qu'il peut, et il explique le lendemain. C'est une charge que peu de gens veulent porter pour une prime de deux dollars de l'heure.\n\nLa nuit, on hérite des problèmes du jour. Les retards de production, l'entretien qu'on n'a pas eu le temps de faire, les commandes en retard. Le quart de nuit passe souvent sa vie à rattraper. Personne n'aime travailler dans un poste où on ne gagne jamais.\n\nEt la nuit, on n'est pas vu. Les promotions se décident entre gens qui se croisent. Un superviseur de nuit compétent peut passer trois ans sans jamais parler au directeur d'usine autrement que par courriel. Il finit par comprendre que son chemin passe par un autre employeur.\n\nCe qui marche, d'après ce que je vois chez les clients qui n'ont pas de problème de nuit.\n\nIls donnent une vraie autonomie et ils l'écrivent. Le superviseur de nuit a le droit d'arrêter une ligne, d'appeler un mécanicien, de refuser un lot. Sans attendre le matin. Ça change complètement la nature du poste.\n\nIls font passer un gestionnaire sur le quart de nuit régulièrement. Pas une visite surprise, une présence prévue, une fois par mois. Le message est clair: ce quart compte.\n\nIls mettent une porte de sortie. Deux ans de nuit, puis le premier poste de jour disponible. Écrit dans l'offre. Un candidat accepte beaucoup plus facilement un inconvénient qui a une fin.\n\nEt ils règlent les problèmes du jour au lieu de les refiler. Si ton quart de nuit répare constamment ce que le jour n'a pas fait, ton problème de recrutement est en fait un problème de planification.\n\nQuand je recrute un superviseur de nuit, je parle de tout ça avec le client avant de parler du salaire. Les usines qui corrigent ces choses comblent le poste. Les autres me rappellent dans huit mois.\n\nTu as un quart de nuit que tu n'arrives pas à stabiliser? Parlons de ce qui se passe entre minuit et sept heures avant de parler de la prime.`} },

  { id:"recruter-en-region", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Mathieu Roy",
    title:{en:"Your plant is outside the big centres? Stop selling the job. Sell the life.",fr:"Ton usine est en région? Arrête de vendre le poste, vends la vie."},
    excerpt:{en:"For a plant three hours from Montreal, the salary opens the door. It's everything else that gets someone to move.",fr:"Pour une usine à trois heures de Montréal, le salaire ouvre la porte. C'est tout le reste qui fait déménager quelqu'un."},
    body:{en:`I've lived all over Quebec. Big cities, villages where everybody knows everybody, places where the nearest grocery store is twenty minutes away. It taught me something I use every day in recruiting: outside the big centres, you don't recruit for a job. You recruit for a life.\n\nWhen a plant in a smaller town calls me for a production manager or a quality lead, the reflex is almost always the same. Look at the salary, the title, the responsibilities, and assume a good offer will close it. Sometimes it does. But most of the time, the real question the candidate is asking has nothing to do with the job.\n\nWill my partner find work? Is there a good school for the kids? Can I find a house? Will I make friends, or will I be "the guy from Montreal" for the next ten years?\n\nIf you don't answer those questions, your offer can be excellent and it will still end up in a drawer.\n\nWhat I do differently, first, is ask the life questions on the very first call. Not to pry, but to know right away whether the move is realistic. It saves everyone time, the candidate and the client.\n\nThen I look for people who already have a tie to the region. People who grew up there and left for school or for their career. People whose family is still there. People who have had a cottage in the area for twenty years. Nobody needs to sell them the region. They're just waiting for a good reason to come back.\n\nFinally, I ask the client to get involved. A plant tour is good. A tour of the town is better. Lunch with the team, a drive around the neighbourhood, a contact who can help the spouse find a job. Companies that do this have a huge advantage, and most of them don't.\n\nThe human side is the real work. A resume tells you what someone can do. It doesn't tell you whether they'll be happy in Rimouski, Drummondville or Abitibi. You learn that by talking with them, at length and honestly.\n\nA placement in the regions that ignores the life around the job is likely to land back on your desk within a year. One that takes it into account is someone who settles in, gets involved and stays.\n\nGot a plant outside the big centres and a role that's been open too long? Let's talk. I probably know the area.`,
          fr:`J'ai habité un peu partout au Québec. Des grandes villes, des villages où tout le monde se connaît, des coins où l'épicerie la plus proche est à vingt minutes. Ça m'a appris une chose qui me sert tous les jours en recrutement : en région, on ne recrute pas pour un poste. On recrute pour une vie.\n\nQuand une usine en région m'appelle pour un directeur de production ou un responsable qualité, le réflexe est presque toujours le même. On regarde le salaire, le titre, les responsabilités, et on se dit qu'avec une bonne offre, ça va débloquer. Des fois, oui. Mais la plupart du temps, la vraie question que se pose le candidat n'a rien à voir avec le poste.\n\nMa blonde ou mon chum va trouver une job? Il y a une bonne école pour les enfants? Je vais trouver une maison? Je vais me faire des amis, ou je vais rester "le gars de Montréal" pendant dix ans?\n\nSi tu ne réponds pas à ces questions, ton offre peut être excellente, elle va quand même finir dans le tiroir.\n\nCe que je fais différemment, d'abord, c'est poser les questions de vie dès le premier appel. Pas pour être indiscret, pour savoir tout de suite si le déménagement est réaliste. Ça sauve du temps à tout le monde, au candidat comme au client.\n\nEnsuite, je cherche les gens qui ont déjà un lien avec la région. Ceux qui y ont grandi et qui sont partis pour leurs études ou leur carrière. Ceux dont la famille est encore là. Ceux qui ont un chalet dans le coin depuis vingt ans. Ces gens n'ont pas besoin qu'on leur vende la région. Ils attendent juste une bonne raison de revenir.\n\nEnfin, je demande au client de s'impliquer. Une visite de l'usine, c'est bien. Une visite de la ville, c'est mieux. Un dîner avec l'équipe, un tour du quartier, un contact qui peut aider le conjoint à se trouver un emploi. Les entreprises qui font ça ont un avantage énorme, et la plupart ne le font pas.\n\nLe côté humain, c'est le vrai travail. Un CV te dit ce qu'une personne sait faire. Il ne te dit pas si elle va être heureuse à Rimouski, à Drummondville ou en Abitibi. Ça, tu l'apprends en parlant avec elle, longtemps et honnêtement.\n\nUn placement en région qui ne tient pas compte de la vie autour du poste risque de revenir sur ton bureau dans un an. Un placement qui en tient compte, c'est quelqu'un qui s'installe, qui s'implique et qui reste.\n\nT'as une usine en région et un poste qui traîne? Parlons-en. Je connais probablement le coin.`} },

  { id:"trente-ans-alimentaire", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Richard Saucier",
    title:{en:"30 years in the food industry taught me one thing: you don't hire a resume.",fr:"30 ans dans l'alimentaire m'ont appris une chose : on n'embauche pas un CV."},
    excerpt:{en:"The hires that lasted almost always had one thing in common, and it wasn't the resume.",fr:"Les embauches qui ont duré avaient presque toujours un point en commun, et ce n'était pas le CV."},
    body:{en:`I spent 30 years in the food industry before joining Proforce. I've seen plants grow, teams come together and others fall apart. And when I think back on the hires that really worked, they almost always had one thing in common: it wasn't the resume that made the difference.\n\nThe resume is the ticket in. It tells you someone has the certifications, the years of experience, the right titles. That matters. But I've seen people with perfect resumes leave after a year, and people with less conventional paths become the backbone of their plant.\n\nWhat makes the difference, in my view, starts with the culture on the floor. Every plant has its own way of working. In some, everything goes through discussion. In others, the hierarchy is clear and respected. A supervisor who shines in one plant can fall flat in the next. The question isn't just "can he do the job?", it's "will he work with this team?".\n\nThen there's reputation. In our industry, everybody knows everybody. The good ones get noticed, and so do the others. One call to the right person often tells you more than three interviews. That's why the network matters so much: not to place friends, but to really know who you're dealing with.\n\nThere's also speed. Good candidates don't stay on the market for long. I've seen companies lose the right person because the decision dragged on. When you know, you know. Act.\n\nAnd finally, honesty on both sides. A hire that starts on an inflated promise ends badly. If the role has its challenges, a difficult team, aging equipment, a demanding schedule, say so. The right candidate will respect that. The wrong one will walk away, and that's a good thing.\n\nThat's part of why I joined Proforce. The way it works looks a lot like what I learned on the ground: understand the business before looking for anyone, say things as they are, and aim for placements that last.\n\nGot an important role to fill and want to talk it through with someone who spent his career in your industry? We'll start by talking about your plant, not a resume.`,
          fr:`J'ai passé 30 ans dans l'industrie alimentaire avant de me joindre à Proforce. J'ai vu des usines grandir, des équipes se bâtir et d'autres se défaire. Et quand je repense aux embauches qui ont vraiment marché, elles avaient presque toujours un point en commun : ce n'était pas le CV qui avait fait la différence.\n\nLe CV, c'est le ticket d'entrée. Il te dit qu'une personne a les certifications, les années d'expérience, les bons titres. C'est nécessaire. Mais j'ai vu des gens au CV parfait partir après un an, et des gens au parcours moins classique devenir les piliers de leur usine.\n\nCe qui fait la différence, selon moi, c'est d'abord la culture du plancher. Chaque usine a sa façon de fonctionner. Dans certaines, tout passe par la discussion. Dans d'autres, la hiérarchie est claire et respectée. Un superviseur excellent dans une usine peut se casser les dents dans la suivante. La question à se poser, ce n'est pas juste "est-ce qu'il sait faire la job?", c'est "est-ce qu'il va fonctionner avec cette équipe?".\n\nEnsuite, la réputation. Dans notre industrie, tout le monde se connaît. Les bons se font remarquer, les autres aussi. Un appel à la bonne personne en dit souvent plus long que trois entrevues. C'est pour ça que le réseau compte autant : pas pour placer des amis, mais pour savoir vraiment à qui on a affaire.\n\nIl y a aussi la vitesse. Les bons candidats ne restent pas longtemps sur le marché. J'ai vu des entreprises perdre la bonne personne parce que la décision a traîné. Quand tu sais, tu sais. Agis.\n\nEt enfin, l'honnêteté des deux côtés. Une embauche qui commence sur une promesse exagérée finit mal. Si le poste a ses défis, une équipe difficile, des équipements vieillissants, un horaire exigeant, il faut le dire. Le bon candidat va respecter ça. Le mauvais va se retirer, et c'est tant mieux.\n\nC'est un peu pour ça que je me suis joint à Proforce. Sa façon de travailler ressemble à ce que j'ai appris sur le terrain : comprendre l'entreprise avant de chercher quelqu'un, dire les choses comme elles sont, et viser des placements qui durent.\n\nT'as un poste important à combler et tu veux en parler avec quelqu'un qui a passé sa carrière dans ton industrie? On va commencer par parler de ton usine, pas d'un CV.`} },

  { id:"candidats-disparaissent", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Mathieu Roy",
    title:{en:"Your candidates disappear after the interview? Look at what happens in between.",fr:"Tes candidats disparaissent après l'entrevue? Regarde ce qui se passe entre les deux."},
    excerpt:{en:"A candidate rarely vanishes for no reason. Most of the time, they just stopped hearing from you.",fr:"Un candidat disparaît rarement sans raison. La plupart du temps, il a juste arrêté d'avoir de tes nouvelles."},
    body:{en:`I hear it all the time. The candidate seemed interested in the interview, asked good questions, and then nothing. No call back, no reply to emails. For the employer, it's frustrating. But when I look closer at what happened, it's almost always the same story.\n\nThe candidate left the interview motivated. Then they waited a week without hearing anything. Then two. Meanwhile, another employer called them the day after their meeting, introduced them to the team and made an offer. For a candidate, silence doesn't mean "we're thinking about it". It means "we're not that interested".\n\nWhat works is simple, but you have to do it. Give the candidate a date at the end of the interview, and keep it. Even if the decision isn't made, a quick call to say "we're meeting two more people, I'll get back to you Thursday" keeps the connection alive.\n\nTell them what comes next, too. How many steps, with whom, on what timeline. A candidate who knows where things are going is far more patient than one who's in the dark.\n\nAnd above all, treat them like a person, not a file. A candidate who is employed and agrees to meet you is taking a risk. They take time off, they make arrangements, they picture themselves working for you. The least you can do is show them it matters.\n\nOn my end, this is a big part of my job. I stay in touch with candidates between every step, tell them where the process stands, answer their questions, and I can tell right away when something makes them hesitate. That often lets us clear up a doubt before it turns into a no.\n\nA candidate who disappears is rarely a candidate problem. It's usually a communication problem. And that can be fixed.`,
          fr:`On m'en parle souvent. Le candidat avait l'air intéressé en entrevue, il posait de bonnes questions, et après, plus rien. Il ne rappelle pas, il ne répond plus aux courriels. Pour l'employeur, c'est frustrant. Mais quand je regarde ce qui s'est passé de plus près, c'est presque toujours la même histoire.\n\nLe candidat est sorti de l'entrevue motivé. Ensuite, il a attendu une semaine sans nouvelles. Puis deux. Pendant ce temps, un autre employeur l'a rappelé le lendemain de sa rencontre, lui a présenté l'équipe et lui a fait une offre. Le silence, pour un candidat, ça ne veut pas dire "on réfléchit". Ça veut dire "on n'est pas si intéressés".\n\nCe qui marche, c'est simple, mais il faut le faire. Donne une date au candidat à la fin de l'entrevue, et respecte-la. Même si la décision n'est pas prise, un appel de deux minutes pour dire "on rencontre encore deux personnes, je te reviens jeudi" garde le lien vivant.\n\nDis-lui aussi ce qui se passe ensuite. Combien d'étapes, avec qui, dans quel délai. Un candidat qui sait où il s'en va est beaucoup plus patient qu'un candidat qui navigue à l'aveugle.\n\nEt surtout, traite-le comme une personne, pas comme un dossier. Un candidat en poste qui accepte de te rencontrer prend un risque. Il prend congé, il s'organise, il se projette chez toi. Le minimum, c'est de lui montrer que ça compte.\n\nDe mon côté, c'est une grosse partie de mon travail. Je reste en contact avec les candidats entre chaque étape, je leur dis où en est le processus, je réponds à leurs questions et je sens tout de suite quand quelque chose les fait hésiter. Ça permet souvent de régler un doute avant qu'il devienne un refus.\n\nUn candidat qui disparaît, c'est rarement un problème de candidat. C'est souvent un problème de communication. Et ça, ça se règle.`} },

  { id:"quitter-montreal-region", cat:{en:"Career",fr:"Carrière"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Mathieu Roy",
    title:{en:"Leaving Montreal for a job in the regions? Ask yourself these questions first.",fr:"Quitter Montréal pour une job en région? Pose-toi ces questions avant de dire oui."},
    excerpt:{en:"A great job in a smaller town can change your life. It can also go sideways if you only looked at the offer.",fr:"Une belle job en région peut changer ta vie. Elle peut aussi mal tourner si t'as juste regardé l'offre."},
    body:{en:`I've lived all over Quebec, and I've seen it from both sides: people who left the city for a job in the regions and would never go back, and others who returned after a year, disappointed. The difference is often the questions they asked themselves before signing.\n\nThe first is your family. If you have a partner, can they work there? In their field, or remotely? If you have kids, look at the schools, the daycares, the activities. An offer that works for you but not for your family won't work for long.\n\nThe second is your daily life. Housing first: the market isn't the same everywhere, and that's often where the surprise comes from. Then distances: the grocery store, the hospital, the airport, your loved ones. Drive it once for real before you decide.\n\nThe third is your place in the community. In smaller towns, your social life often runs through work, sports, volunteering, the neighbours. If you enjoy that, it's a huge strength. If you need the anonymity of the city, be honest with yourself.\n\nThe fourth is the future. Is the company solid? Are there other employers in your field nearby if you ever want to move on? One plant in the region is great stability, but it's also only one door.\n\nMy advice: spend a weekend there before you say yes. Not for the interview, for the life. Walk around, go to a restaurant, talk to people. You'll know pretty quickly whether you can see yourself there.\n\nAnd if you work with me, we'll talk about all of this openly from the start. My job isn't to get you to move at any cost. It's to help you make a decision you'll still be happy with five years from now.`,
          fr:`J'ai habité un peu partout au Québec, et je l'ai vu des deux côtés : des gens qui ont quitté la ville pour une job en région et qui ne reviendraient jamais en arrière, et d'autres qui sont revenus au bout d'un an, déçus. La différence, souvent, c'est les questions qu'ils se sont posées avant de signer.\n\nLa première, c'est ta famille. Si t'as un conjoint, est-ce qu'il ou elle peut travailler là? Dans son domaine, ou à distance? Si t'as des enfants, regarde les écoles, les garderies, les activités. Une offre qui marche pour toi, mais pas pour ta famille, ne marchera pas longtemps.\n\nLa deuxième, c'est ta vie au quotidien. Le logement, d'abord : le marché n'est pas le même partout, et c'est souvent là que la surprise arrive. Ensuite, les distances : l'épicerie, l'hôpital, l'aéroport, tes proches. Fais le trajet une fois en vrai avant de décider.\n\nLa troisième, c'est ta place dans la communauté. En région, ta vie sociale passe souvent par le travail, le sport, les bénévoles, le voisinage. Si t'aimes ça, c'est une force énorme. Si t'as besoin de l'anonymat de la ville, sois honnête avec toi-même.\n\nLa quatrième, c'est l'avenir. Est-ce que l'entreprise est solide? Est-ce qu'il y a d'autres employeurs dans ton domaine dans le coin si un jour tu veux changer? Une seule usine dans la région, c'est une belle stabilité, mais c'est aussi une seule porte.\n\nMon conseil : va passer une fin de semaine sur place avant de dire oui. Pas pour l'entrevue, pour la vie. Va te promener, va au restaurant, parle aux gens. Tu vas savoir assez vite si tu te vois là.\n\nEt si tu travailles avec moi, on va en parler franchement dès le départ. Mon travail, ce n'est pas de te faire déménager à tout prix. C'est de t'aider à prendre une décision dont tu vas être content dans cinq ans.`} },

  { id:"directeur-usine-ideal", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Richard Saucier",
    title:{en:"The plant manager on your wish list doesn't exist. And that's fine.",fr:"Le directeur d'usine de ta liste de souhaits n'existe pas. Et c'est correct."},
    excerpt:{en:"Twenty requirements on a job description usually means nobody decided what really matters.",fr:"Vingt exigences dans une description de poste, ça veut souvent dire que personne n'a décidé ce qui compte vraiment."},
    body:{en:`Over my career, I've seen a lot of job descriptions for plant managers. Engineer, MBA, fifteen years in the same product category, bilingual, continuous improvement expert, comfortable with unions, excellent communicator, available to travel, and ideally someone who already lives twenty minutes from the plant.\n\nThat person may exist. But if they do, they're very happy where they are, and they cost a lot more than your budget.\n\nThe problem with the wish list isn't that it's ambitious. It's that it puts everything on the same level. When twenty criteria are "essential", none of them really are. And you end up passing on very good candidates because they were missing item 17.\n\nWhat I recommend is forcing yourself to choose. Three criteria, no more, without which the person will fail in your plant. Not in a plant in general, in yours, with your team, your equipment and your current challenges.\n\nFor a plant coming out of a rough stretch, it might be leadership and the ability to rebuild trust on the floor. For a plant growing fast, it might be experience with new line startups. For a unionized plant, it might be labour relations. The answer changes from one plant to the next, and that's exactly why you need to find it.\n\nEverything else is a bonus. Great if the person has it. Not a reason to pass on someone who checks your three essentials.\n\nOver time, I've learned that the best plant managers I've known didn't have the perfect profile on paper. They had what their plant needed at that moment. That's what we're looking for.\n\nIf you have a leadership role to fill, we'll start with that exercise together. It's often the most useful conversation of the whole search.`,
          fr:`Dans ma carrière, j'ai vu passer beaucoup de descriptions de poste pour des directeurs d'usine. Ingénieur, MBA, quinze ans d'expérience dans le même type de produit, bilingue, expert en amélioration continue, à l'aise avec les syndicats, excellent communicateur, disponible pour voyager, et idéalement quelqu'un qui habite déjà à vingt minutes de l'usine.\n\nCette personne existe peut-être. Mais si elle existe, elle est très bien où elle est, et elle coûte beaucoup plus cher que ton budget.\n\nLe problème avec la liste de souhaits, ce n'est pas qu'elle est ambitieuse. C'est qu'elle met tout au même niveau. Quand vingt critères sont "essentiels", aucun ne l'est vraiment. Et tu finis par passer à côté de très bons candidats parce qu'il leur manquait le point 17.\n\nCe que je recommande, c'est de te forcer à choisir. Trois critères, pas plus, sans lesquels la personne va échouer dans ton usine. Pas dans une usine en général, dans la tienne, avec ton équipe, ton équipement et tes défis du moment.\n\nPour une usine qui sort d'une période difficile, c'est peut-être le leadership et la capacité à rebâtir la confiance du plancher. Pour une usine qui grossit vite, c'est peut-être l'expérience des démarrages de lignes. Pour une usine syndiquée, c'est peut-être les relations de travail. La réponse change d'une usine à l'autre, et c'est justement pour ça qu'il faut la trouver.\n\nLe reste, ce sont des atouts. C'est bien si la personne les a. Ce n'est pas une raison d'écarter quelqu'un qui coche tes trois essentiels.\n\nAvec le temps, j'ai appris que les meilleurs directeurs d'usine que j'ai connus n'avaient pas le profil parfait sur papier. Ils avaient ce dont leur usine avait besoin à ce moment précis. C'est ça qu'on cherche.\n\nSi tu as un poste de direction à combler, on commence par cet exercice ensemble. C'est souvent la conversation la plus utile de toute la recherche.`} },

  { id:"promouvoir-ou-embaucher", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Richard Saucier",
    title:{en:"Promote from within or hire from outside? What I've learned on the floor.",fr:"Promouvoir à l'interne ou embaucher à l'externe? Ce que j'ai appris sur le plancher."},
    excerpt:{en:"Your best operator won't automatically make your best supervisor. Here's how to think it through.",fr:"Ton meilleur opérateur ne fera pas automatiquement ton meilleur superviseur. Voici comment y réfléchir."},
    body:{en:`It's one of the decisions that comes up most often in a plant. A supervisor or manager role opens up, and the question comes right away: do we promote someone from the team, or do we look outside?\n\nI've seen both work. I've also seen both go wrong. Here's what I take from it.\n\nInternal promotion has huge advantages. The person knows the plant, the products, the people. They're already accepted by the team. And it sends a clear message to everyone: here, you can grow. For retention, it's hard to do better.\n\nBut there's a classic trap. You promote your best operator, the one who knows every machine by heart, assuming they'll make a good supervisor. Except supervising is a different job. It means handling conflict, making unpopular decisions, leading people who were colleagues the week before. Some thrive. Others are unhappy, and you lose your best operator along the way.\n\nHiring from outside brings fresh eyes. Someone who has seen other ways of working can unblock things that have been stuck for years. It's often the right path when the plant needs change, or when nobody inside has the required experience yet.\n\nThe risk is integration. A manager coming from outside has to earn the trust of a team that doesn't know them, and sometimes of a team that was hoping one of their own would get the job. That can be managed, but you have to plan for it.\n\nMy way of thinking it through comes down to three questions. Has someone inside already shown they can lead, not just execute? Does the plant need continuity or change? And if you promote, are you ready to support that person in the new role, with training and backup?\n\nThere's no universal right answer. But there is a wrong way to decide: by default, because it's easier. Take the time to think it through. And if the answer is to look outside, let's talk.`,
          fr:`C'est une des décisions qui revient le plus souvent dans une usine. Un poste de superviseur ou de directeur s'ouvre, et la question arrive tout de suite : on promeut quelqu'un de l'équipe, ou on va chercher à l'extérieur?\n\nJ'ai vu les deux marcher. J'ai aussi vu les deux mal tourner. Voici ce que j'en retiens.\n\nLa promotion interne a des avantages énormes. La personne connaît l'usine, les produits, les gens. Elle est déjà acceptée par l'équipe. Et ça envoie un message clair à tout le monde : ici, on peut grandir. Pour la rétention, c'est difficile de faire mieux.\n\nMais il y a un piège classique. On promeut le meilleur opérateur, celui qui connaît chaque machine par cœur, en se disant qu'il va faire un bon superviseur. Sauf que superviser, c'est un autre métier. Ça demande de gérer des conflits, de prendre des décisions impopulaires, de diriger des gens qui étaient des collègues la semaine d'avant. Certains s'épanouissent. D'autres sont malheureux, et tu perds au passage ton meilleur opérateur.\n\nL'embauche externe, elle, amène un regard neuf. Quelqu'un qui a vu d'autres façons de faire peut débloquer des choses qui stagnent depuis des années. C'est souvent la bonne voie quand l'usine a besoin de changement, ou quand personne à l'interne n'a encore l'expérience requise.\n\nLe risque, c'est l'intégration. Un gestionnaire qui arrive de l'extérieur doit gagner la confiance d'une équipe qui ne le connaît pas, et parfois d'une équipe qui espérait voir un des siens obtenir le poste. Ça se gère, mais il faut le prévoir.\n\nMa façon d'y réfléchir tient en trois questions. Est-ce que quelqu'un à l'interne a déjà montré qu'il sait diriger, pas juste exécuter? Est-ce que l'usine a besoin de continuité ou de changement? Et si tu promeus, es-tu prêt à accompagner la personne dans son nouveau rôle, avec de la formation et du soutien?\n\nIl n'y a pas de bonne réponse universelle. Mais il y a une mauvaise façon de décider : par défaut, parce que c'est plus simple. Prends le temps d'y penser. Et si la réponse est d'aller à l'externe, on peut en parler.`} },

  { id:"ta-vie-avant-ton-cv", cat:{en:"Career",fr:"Carrière"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Mathieu Roy",
    title:{en:"Why I ask about your life before we talk about your resume.",fr:"Pourquoi je te parle de ta vie avant de parler de ton CV."},
    excerpt:{en:"The first call with me might feel a bit unusual. There's a good reason for that.",fr:"Le premier appel avec moi peut sembler un peu différent. Il y a une bonne raison pour ça."},
    body:{en:`If we're talking for the first time, chances are I won't start with your resume. I'll ask where you live, what keeps you there, how your job is going right now, what you'd like it to look like in three years. Some candidates find that surprising. Here's why I do it.\n\nI've already read your resume. It tells me what you did, where and for how long. That matters, but it tells me almost nothing about what would make your next role a good decision for you.\n\nWhat makes a job change work is rarely just the title or the salary. It's a schedule that fits your family. It's a commute that doesn't eat two hours a day. It's a boss you get along with. It's a place where you feel you can grow. None of that is on a resume.\n\nWhen I understand your reality, I can do two things. First, show you only opportunities that make sense for you. Not ten random roles, one or two that really fit. Second, make your case to the employer with more than a list of past jobs. I can explain why you, why now, and why it will last.\n\nAnd sometimes the conversation leads somewhere we didn't expect: you're in the right place already. That's fine too. I'd rather tell you that honestly than push you into a role that doesn't suit you. We'll talk again when the timing is better.\n\nSo if I ask questions that seem far from work, it's not curiosity. It's because my goal is for you to still be happy with your decision five years from now. And that starts with getting to know you.`,
          fr:`Si on se parle pour la première fois, il y a de bonnes chances que je ne commence pas par ton CV. Je vais plutôt te demander où t'habites, ce qui te garde là, comment va ta job en ce moment, ce que tu aimerais que ce soit dans trois ans. Certains candidats trouvent ça surprenant. Voici pourquoi je fais ça.\n\nTon CV, je l'ai déjà lu. Il me dit ce que tu as fait, où et pendant combien de temps. C'est important, mais ça ne me dit presque rien sur ce qui ferait de ton prochain poste une bonne décision pour toi.\n\nCe qui fait qu'un changement de job marche, c'est rarement juste le titre ou le salaire. C'est l'horaire qui fonctionne avec ta famille. C'est un trajet qui ne te gruge pas deux heures par jour. C'est un patron avec qui tu t'entends. C'est un milieu où tu sens que tu peux grandir. Rien de tout ça n'est dans un CV.\n\nQuand je comprends ta réalité, je peux faire deux choses. D'abord, te présenter seulement des opportunités qui ont du sens pour toi. Pas dix postes au hasard, un ou deux qui collent vraiment. Ensuite, défendre ta candidature auprès de l'employeur avec autre chose que ta liste d'expériences. Je peux lui expliquer pourquoi toi, pourquoi maintenant, et pourquoi ça va durer.\n\nEt des fois, la conversation mène à une conclusion qu'on n'attendait pas : tu es bien où tu es. C'est correct aussi. Je préfère te le dire franchement que de te pousser dans un poste qui ne te convient pas. On va se reparler quand le moment sera meilleur.\n\nAlors, si je te pose des questions qui semblent loin du travail, ce n'est pas pour être curieux. C'est parce que mon objectif, c'est que tu sois encore content de ta décision dans cinq ans. Et ça, ça commence par te connaître.`} },

  { id:"references-bien-faites", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2026", iso:"2026-10-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Richard Saucier",
    title:{en:"References: the step everyone rushes, and the one that could save you.",fr:"Les références : l'étape que tout le monde bâcle, et celle qui pourrait te sauver."},
    excerpt:{en:"Most reference checks are a formality. Done right, they tell you what three interviews couldn't.",fr:"La plupart des vérifications de références sont une formalité. Bien faites, elles te disent ce que trois entrevues n'ont pas su te dire."},
    body:{en:`In most hiring processes I've seen, references come at the very end, when the decision is practically made. You call two names the candidate provided, ask three general questions, hear that the person is "hardworking and reliable", and check the box.\n\nThat's a shame, because done right, the reference check is one of the most useful steps in the whole process.\n\nThe first problem is timing. If you check references after you've decided, you're not really listening anymore. You're looking for confirmation. Do them instead while you're still torn between two finalists. That's when every answer counts.\n\nThe second problem is the questions. "Is this a good employee?" won't teach you anything. Ask specific questions tied to your role. How did this person react when a line went down in the middle of a shift? How did they handle a difficult employee? What could they have done better? Would you hire them again, and for what role?\n\nListen to what isn't said, too. A pause, a vague answer, a "they're a very particular person" often says a lot. In our industry, people are careful out of respect for a former colleague. You have to read between the lines.\n\nThe third problem is the source. References provided by the candidate are chosen to be positive, which is normal. When possible, and with the candidate's agreement, talk to a former direct supervisor, not just a colleague who likes them. And in an industry where everybody knows everybody, reputation travels. It doesn't replace a real check, but it adds to it.\n\nA good reference check takes about an extra hour. A bad hire in a key role at a plant costs months. The math is easy.\n\nAt Proforce, we do that work before we even present a candidate. When you receive a profile, we already know who we're dealing with.`,
          fr:`Dans la plupart des processus d'embauche que j'ai vus, les références arrivent à la toute fin, quand la décision est pratiquement prise. On appelle deux noms fournis par le candidat, on pose trois questions générales, on entend que la personne est "travaillante et fiable", et on coche la case.\n\nC'est dommage, parce que bien faite, la vérification de références est une des étapes les plus utiles de tout le processus.\n\nLe premier problème, c'est le moment. Si tu fais les références quand tu as déjà décidé, tu n'écoutes plus vraiment. Tu cherches une confirmation. Mieux vaut les faire quand tu hésites encore entre deux finalistes. Là, chaque réponse compte.\n\nLe deuxième problème, ce sont les questions. "Est-ce que c'est un bon employé?" ne t'apprendra rien. Pose des questions précises, liées à ton poste. Comment cette personne réagissait quand une ligne tombait en panne en plein quart? Comment elle gérait un employé difficile? Qu'est-ce qu'elle aurait pu mieux faire? Est-ce que vous la réembaucheriez, et pour quel poste?\n\nÉcoute aussi ce qui n'est pas dit. Une hésitation, une réponse vague, un "c'est quelqu'un de très particulier" en disent souvent long. Dans notre industrie, les gens sont prudents par respect pour un ancien collègue. Il faut savoir lire entre les lignes.\n\nLe troisième problème, c'est la source. Les références fournies par le candidat sont choisies pour être positives, c'est normal. Quand c'est possible et que le candidat est d'accord, parle à un ancien superviseur direct, pas juste à un collègue qui l'aime bien. Et dans un milieu où tout le monde se connaît, la réputation d'une personne circule. Ça ne remplace pas une vraie vérification, mais ça la complète.\n\nUne bonne vérification de références prend environ une heure de plus. Une mauvaise embauche à un poste clé, dans une usine, ça coûte des mois. Le calcul est vite fait.\n\nChez Proforce, on fait ce travail avant même de te présenter un candidat. Quand tu reçois un profil, on sait déjà à qui on a affaire.`} },

  { id:"recrutement-passif", cat:{en:"Hiring",fr:"Embauche"}, date:"Mai 2026", iso:"2026-05-19", read:{en:"3 min",fr:"3 min"}, recruiter:"Mathieu Roy",
    title:{en:"The candidate you need isn't on any job board.",fr:"Le candidat dont t'as besoin n'est sur aucun babillard."},
    excerpt:{en:"Companies post, get 200 resumes, none fit, then call us. Here's why that pattern never changes.",fr:"Les compagnies affichent, reçoivent 200 CV, aucun ne convient, et ils nous appellent. Voilà pourquoi."},
    body:{en:`I've been placing food industry professionals for over 20 years. The pattern never changes: companies post a job, get 200 resumes, none of them fit, and then they call us. Here's why that happens.\n\nThe best plant managers, quality directors, and supply chain leaders aren't refreshing LinkedIn. They're running a shift, managing a team, dealing with an audit. They're employed, engaged, and not going anywhere, unless someone calls them with the right opportunity at the right time.\n\nThat's the whole game. Not posting and waiting. Calling people you already know, people who trust you enough to have a real conversation about what's next.\n\nWe've spent 25 years building that network. When a client calls us about a Plant Manager in Ontario, I'm not starting from scratch. I already know who the right people are. Half of them I've placed before, or they've referred someone to us, or we've talked three times over the years and stayed in touch.\n\nThe résumé pile approach works fine if you're hiring for an entry-level role. For anything that matters, a director, a VP, a quality lead, you need someone who isn't looking. And you need someone who can find them.\n\nThat's what we do.`,
          fr:`Ça fait plus de 20 ans que je place des professionnels dans l'alimentaire. Le pattern ne change jamais : une compagnie affiche un poste, reçoit 200 CV, aucun ne convient, et ils nous appellent. Voilà pourquoi.\n\nLes meilleurs directeurs d'usine, directeurs qualité et responsables chaîne d'approvisionnement ne rafraîchissent pas LinkedIn. Ils gèrent un quart, supervisent une équipe, passent un audit. Ils sont employés, engagés, et ils ne bougent pas, à moins que quelqu'un les appelle avec la bonne opportunité au bon moment.\n\nC'est tout le jeu. Pas afficher et attendre. Appeler des gens qu'on connaît déjà, des gens qui nous font assez confiance pour avoir une vraie conversation sur ce qui s'en vient.\n\nOn a passé 25 ans à bâtir ce réseau. Quand un client nous appelle pour un directeur d'usine en Ontario, je ne pars pas de zéro. Je sais déjà qui sont les bonnes personnes.\n\nL'approche par pile de CV fonctionne bien pour des postes d'entrée de gamme. Pour tout ce qui compte, un directeur, un VP, un responsable qualité, t'as besoin de quelqu'un qui ne cherche pas. Et t'as besoin de quelqu'un qui peut le trouver.\n\nC'est ce qu'on fait.`} },

  { id:"agisme-recrutement", cat:{en:"Hiring",fr:"Embauche"}, date:"Avril 2026", iso:"2026-04-21", read:{en:"4 min",fr:"4 min"}, recruiter:"Richard Saucier",
    title:{en:"\"We want someone long-term.\" Then why are you screening out the 50-year-olds?",fr:"\"On veut quelqu'un pour le long terme.\" Alors pourquoi vous éliminez les 50 ans?"},
    excerpt:{en:"Companies want stability. Then they pass on a 52-year-old with a track record and hire someone who leaves in 18 months.",fr:"Les compagnies veulent de la stabilité. Ensuite elles passent sur un candidat de 52 ans et embauchent quelqu'un qui part après 18 mois."},
    body:{en:`I hear it constantly. Companies want stability. They want someone who'll stay 5, 7, 10 years. And then they pass on a 52-year-old with a track record, and hire a 31-year-old who leaves in 18 months.\n\nThe data doesn't lie. Average job tenure for someone in their early 30s in food manufacturing? About 2.5 years. Someone in their early 50s? Closer to 6. If long-term retention is actually the goal, the math is pretty clear.\n\nI'm not saying age is everything. I'm saying it's a real factor that gets systematically ignored while companies claim to want stability.\n\nHere's what I see on the ground: a 53-year-old Quality Director with 25 years in food safety, who's seen every audit, every recall scare, every regulatory shift. Deep network. Steady under pressure. Not interested in climbing anymore, interested in doing good work and finishing strong.\n\nThat profile gets screened out before the first call because someone decides they want "fresh energy", which is often just code for age.\n\nIt's a costly mistake. And I tell my clients that directly.\n\nThe best hire isn't always the one who looks newest. Sometimes it's the one who's already been through everything you're about to face.`,
          fr:`Je l'entends tout le temps. Les compagnies veulent de la stabilité. Et ensuite elles passent sur un candidat de 52 ans avec un bilan solide, et embauchent un candidat de 31 ans qui part après 18 mois.\n\nLes données ne mentent pas. La durée moyenne en poste pour quelqu'un au début de la trentaine en fabrication alimentaire? Environ 2,5 ans. Pour quelqu'un au début de la cinquantaine? Plus proche de 6 ans. Si la rétention à long terme est vraiment l'objectif, le calcul est assez clair.\n\nJe dis pas que l'âge c'est tout. Je dis que c'est un facteur réel qui se fait systématiquement ignorer.\n\nVoilà ce que je vois sur le terrain : un directeur qualité de 53 ans avec 25 ans en salubrité alimentaire, qui a vu chaque audit, chaque risque de rappel, chaque changement réglementaire. Réseau solide. Calme sous pression. Plus intéressé à grimper, intéressé à bien faire son travail et finir en force.\n\nCe profil se fait éliminer avant le premier appel parce que quelqu'un décide qu'il veut une "énergie fraîche", ce qui est souvent juste un code pour l'âge.\n\nC'est une erreur coûteuse. Et je le dis directement à mes clients.`} },

  { id:"erreurs-offre-emploi", cat:{en:"Hiring",fr:"Embauche"}, date:"Mars 2026", iso:"2026-03-17", read:{en:"3 min",fr:"3 min"}, recruiter:"Stéphanie Lanoie",
    title:{en:"Your job posting is why you're not getting good candidates.",fr:"Ton offre d'emploi, c'est pour ça que t'as pas de bons candidats."},
    excerpt:{en:"Most food industry job postings are a list of requirements dressed up as an opportunity.",fr:"La plupart des offres d'emploi dans l'alimentaire sont une liste d'exigences déguisée en opportunité."},
    body:{en:`I read a lot of food industry job postings. Most of them are a list of requirements dressed up as an opportunity.\n\nFirst problem: you lead with what you want, not what you're offering. "5+ years of experience, HACCP certification required, bilingual, available for travel." Great. But why would someone good want to work for you specifically?\n\nSecond problem: the salary range is missing, or it's absurdly wide. "$60,000 to $110,000 depending on experience" tells a candidate exactly nothing. It signals that you haven't thought seriously about what this role is worth.\n\nThird problem: every company sounds the same. "Dynamic environment." "Fast-paced team." "Competitive benefits." These phrases mean nothing to a Quality Manager evaluating three different offers.\n\nWhat actually works: tell them something real about the plant. Tell them why the last person in this role left. Tell them what growth looks like. Give them a real salary range and a honest picture of the culture.\n\nGood candidates have options. If your posting doesn't answer the basic questions, they move on.\n\nThe posting is your first pitch. Make it count.`,
          fr:`Je lis beaucoup d'offres d'emploi dans l'alimentaire. La plupart sont une liste d'exigences déguisée en opportunité.\n\nPremier problème : tu commences par ce que tu veux, pas par ce que t'offres. "5+ ans d'expérience, certification HACCP requise, bilingue, disponible pour les voyages." Super. Mais pourquoi quelqu'un de bon voudrait travailler pour toi spécifiquement?\n\nDeuxième problème : la fourchette salariale est absente ou absurdement large. "60 000$ à 110 000$ selon l'expérience" ne dit absolument rien à un candidat.\n\nTroisième problème : toutes les compagnies sonnent pareil. "Environnement dynamique." "Avantages compétitifs." Ces phrases ne veulent rien dire.\n\nCe qui fonctionne : dis-leur quelque chose de concret sur l'usine. Dis-leur pourquoi la dernière personne dans ce rôle est partie. Donne-leur une vraie fourchette salariale et un portrait honnête de la culture.\n\nL'offre d'emploi c'est ton premier pitch. Fais-le compter.`} },

  { id:"changer-recruteur", cat:{en:"Career",fr:"Carrière"}, date:"Février 2026", iso:"2026-02-17", read:{en:"3 min",fr:"3 min"}, recruiter:"Stéphanie Lanoie",
    title:{en:"How to get a headhunter to actually call you back.",fr:"Comment faire en sorte qu'un chasseur de têtes te rappelle vraiment."},
    excerpt:{en:"You sent your resume to three agencies and heard nothing. Here's what's actually happening on our end.",fr:"T'as envoyé ton CV à trois agences et t'as rien entendu. Voilà ce qui se passe vraiment de notre côté."},
    body:{en:`You sent your resume to three agencies and heard nothing. Here's what's actually happening on our end.\n\nFirst, understand how we work. We're not sitting here waiting for resumes. Most of our placements happen in reverse: a client calls with a need, and we go into our network to find the right person. The unsolicited resume pile gets looked at occasionally, but it's not where we start.\n\nWhat actually gets you on our radar:\n\nBe specific. "Experienced food industry professional looking for new opportunities" tells me nothing. "Quality Assurance Manager with 8 years in dairy, SQF certified, open to Director-level roles in Ontario", now I can do something with that.\n\nMake it easy to find you. Update your LinkedIn. Put your certifications in your headline. Make your industry clear. When I'm looking for a HACCP-certified QA Director in Ontario, LinkedIn is where I start. If your profile doesn't surface, you don't exist.\n\nStay in touch without being annoying. If you reached out six months ago and nothing happened, follow up. One email: "Just checking in, still open to the right opportunity." That's it.\n\nThe people we call first are the ones we already know. The goal is to be known before you're needed.`,
          fr:`T'as envoyé ton CV à trois agences et t'as rien entendu. Voilà ce qui se passe vraiment de notre côté.\n\nD'abord, comprends comment on fonctionne. On est pas là à attendre que des CV arrivent. La plupart de nos placements se font à l'inverse : un client appelle avec un besoin, et on va dans notre réseau trouver la bonne personne.\n\nCe qui te met vraiment sur notre radar :\n\nSois spécifique. "Professionnel expérimenté dans l'alimentaire à la recherche de nouvelles opportunités" ne me dit rien. "Directeur assurance qualité avec 8 ans dans les produits laitiers, certifié SQF, ouvert à des rôles de direction en Ontario", là je peux faire quelque chose.\n\nFacilite-toi à trouver. Mets à jour ton LinkedIn. Mets tes certifications dans ton titre. Quand je cherche un directeur QA certifié HACCP en Ontario, LinkedIn c'est là que je commence.\n\nReste en contact sans être envahissant. Un courriel : "Juste pour prendre des nouvelles, je suis toujours ouvert à la bonne opportunité."\n\nLes gens qu'on appelle en premier sont ceux qu'on connaît déjà. L'objectif c'est d'être connu avant d'être nécessaire.`} },

  { id:"marche-alimentaire-2026", cat:{en:"Market",fr:"Marché"}, date:"Janvier 2026", iso:"2026-01-20", read:{en:"4 min",fr:"4 min"}, recruiter:"Simon St-Amand",
    title:{en:"What I'm seeing in food industry hiring right now.",fr:"Ce que je vois dans l'embauche alimentaire en ce moment."},
    excerpt:{en:"Proforce has been doing this since 2001, and I still take notes on what's shifting. Here's the ground-level version, not the LinkedIn think-piece version.",fr:"Proforce fait ça depuis 2001, et je prends encore des notes sur ce qui change. Voilà la version terrain, pas la version article LinkedIn."},
    body:{en:`Proforce has been doing this since 2001, and I still take notes on what's shifting. Here's what's actually happening, not the LinkedIn think-piece version, the ground-level version.\n\nQuality and food safety roles are tight. Really tight. The pipeline of experienced QA professionals with HACCP, SQF, and FSMA knowledge hasn't kept up with demand, especially in Ontario manufacturing. Companies that used to take two months to hire are now taking five.\n\nSupply chain is in an interesting spot. The panic hiring of 2021 to 2022 created a generation of professionals with inflated titles and thin experience. Companies are now sorting through that, they want people who actually built resilient supply chains.\n\nSalary expectations have reset upward and aren't coming back down. A Plant Manager role that paid $110k in 2019 is now $140k minimum if you want serious candidates. Some clients are still anchored to pre-pandemic comp expectations. That's a conversation we have a lot.\n\nOntario is the growth market. More mandates out of the GTA and southwestern Ontario than ever before. Greenfield facilities coming online, the need for experienced operations and quality leadership is real and ongoing.\n\nThe best candidates are still getting multiple offers. If your process takes eight weeks and four rounds of interviews, you're losing people. Speed is a competitive advantage right now.\n\nThat's the landscape as I see it.`,
          fr:`Proforce fait ça depuis 2001, et je prends encore des notes sur ce qui change. Voilà ce qui se passe vraiment, pas la version article LinkedIn, la version terrain.\n\nLes postes en qualité et salubrité alimentaire sont serrés. Vraiment serrés. Le bassin de professionnels QA expérimentés avec des connaissances HACCP, SQF et FSMA n'a pas suivi la demande, surtout en Ontario. Des compagnies qui prenaient deux mois pour embaucher en prennent maintenant cinq.\n\nLa chaîne d'approvisionnement est dans une position intéressante. L'embauche de panique de 2021-2022 a créé une génération de professionnels avec des titres gonflés et une expérience mince.\n\nLes attentes salariales ont remonté et ne redescendront pas. Un poste de directeur d'usine qui payait 110 000$ en 2019 est maintenant 140 000$ minimum si tu veux des candidats sérieux.\n\nL'Ontario est le marché en croissance. Plus de mandats du Grand Toronto et du sud-ouest de l'Ontario que jamais.\n\nLes meilleurs candidats reçoivent encore plusieurs offres. Si ton processus prend huit semaines et quatre rondes d'entrevues, tu perds des gens. La vitesse est un avantage concurrentiel en ce moment.`} },

  { id:"combien-coute-recruteur", cat:{en:"Hiring",fr:"Embauche"}, date:"Mai 2026", iso:"2026-05-05", read:{en:"4 min",fr:"4 min"}, recruiter:"Richard Saucier",
    title:{en:"How much does a recruiter cost in food manufacturing? Here's the real answer.",fr:"Combien coûte un recruteur en fabrication alimentaire? Voilà la vraie réponse."},
    excerpt:{en:"Most companies have no idea what recruiter fees actually look like until they get the invoice. Let's fix that.",fr:"La plupart des compagnies n'ont aucune idée de ce à quoi ressemblent vraiment les honoraires de recruteur jusqu'à ce qu'elles reçoivent la facture. Réglons ça."},
    body:{en:`Most companies have no idea what recruiter fees actually look like until they get the invoice. Let's fix that.\n\nThe standard fee for a permanent placement recruiter in food manufacturing and CPG is between 18% and 25% of the placed candidate's first-year base salary. That's the market. Anyone charging significantly less is cutting corners somewhere. Anyone charging significantly more needs to justify it.\n\nAt Proforce, we work on a contingency or retained basis depending on the mandate. Contingency means no placement, no fee. Retained means an upfront payment to begin the search, with the balance due at placement.\n\nNow let's talk about whether it's worth it.\n\nA Quality Director in Ontario costs somewhere between $110,000 and $145,000 in base salary in today's market. At 20%, the recruiter fee is $22,000 to $29,000. That sounds like a lot until you think about what a bad hire costs.\n\nA failed hire at the director level, someone who leaves in 6 months or gets let go, typically costs 1.5x to 3x their annual salary when you factor in recruitment time, lost productivity, training investment, and team disruption. On a $130,000 role, that's $195,000 to $390,000 in real cost.\n\nThe recruiter fee isn't the cost. The bad hire is the cost.\n\nWhat you're paying for is two things: access and accountability. Access to candidates who are not on any job board and would never respond to your posting. And accountability, because a good recruiter stands behind their placement with a guarantee.\n\nIf a candidate leaves within the guarantee period, we find another one. At no additional charge.\n\nThat's the math. Call us if you want to talk through it for your specific situation.`,
          fr:`La plupart des compagnies n'ont aucune idée de ce à quoi ressemblent vraiment les honoraires de recruteur jusqu'à ce qu'elles reçoivent la facture. Réglons ça.\n\nLes honoraires standard pour un recruteur en placement permanent dans la fabrication alimentaire et le CPG se situent entre 18% et 25% du salaire de base de première année du candidat placé. C'est le marché. Quiconque charge nettement moins coupe des coins quelque part. Quiconque charge nettement plus doit le justifier.\n\nChez Proforce, on travaille sur une base contingente ou retenue selon le mandat. Contingent signifie pas de placement, pas d'honoraires. Retenu signifie un paiement initial pour commencer la recherche, avec le solde dû au placement.\n\nMaintenant parlons de si ça vaut la peine.\n\nUn directeur qualité en Ontario coûte quelque part entre 110 000$ et 145 000$ en salaire de base dans le marché d'aujourd'hui. À 20%, les honoraires du recruteur sont de 22 000$ à 29 000$. Ça semble beaucoup jusqu'à ce que tu penses à ce que coûte une mauvaise embauche.\n\nUne embauche ratée au niveau directeur, quelqu'un qui part après 6 mois ou qui se fait remercier, coûte typiquement 1,5 à 3 fois leur salaire annuel quand tu tiens compte du temps de recrutement, de la productivité perdue, de l'investissement en formation et de la perturbation de l'équipe. Sur un rôle à 130 000$, c'est 195 000$ à 390 000$ en coût réel.\n\nLes honoraires du recruteur ne sont pas le coût. La mauvaise embauche est le coût.\n\nCe pour quoi tu paies c'est deux choses : l'accès et l'imputabilité. L'accès à des candidats qui ne sont sur aucun babillard d'emploi et qui ne répondraient jamais à ton affichage. Et l'imputabilité, parce qu'un bon recruteur se tient derrière son placement avec une garantie.\n\nSi un candidat part dans la période de garantie, on en trouve un autre. Sans frais supplémentaires.\n\nC'est le calcul. Appelle-nous si tu veux en parler pour ta situation spécifique.`} },

  { id:"processus-entrevue-trop-long", cat:{en:"Hiring",fr:"Embauche"}, date:"Avril 2026", iso:"2026-04-07", read:{en:"3 min",fr:"3 min"}, recruiter:"Stéphanie Lanoie",
    title:{en:"Your interview process is too long. You're losing candidates because of it.",fr:"Ton processus d'entrevue est trop long. Tu perds des candidats à cause de ça."},
    excerpt:{en:"Four rounds of interviews for a plant supervisor. I've seen it. Here's what it's costing you.",fr:"Quatre rondes d'entrevues pour un superviseur d'usine. Je l'ai vu. Voilà ce que ça te coûte."},
    body:{en:`Four rounds of interviews for a plant supervisor. I've seen it. Here's what it's costing you.\n\nThe best candidates in food manufacturing right now are fielding multiple offers simultaneously. They are not sitting around waiting for your fourth interview. They are signing offers with companies that moved faster than you.\n\nI watch this happen regularly. A client finds a strong QA Manager candidate. First interview goes great. Second interview scheduled two weeks later. Then a panel interview. Then a meeting with the VP. Then a reference check that takes another week. Then an offer.\n\nSix weeks. The candidate accepted another offer in week three.\n\nThe irony is that the companies with the longest interview processes are usually the ones that say they "can't find good candidates." They found them. They just lost them.\n\nHere's what a reasonable process looks like for a mid to senior food manufacturing role: an initial recruiter screen, one substantive interview with the hiring manager, one second interview (optional, for senior roles), references, offer. Three to four weeks from first contact to signed offer.\n\nIf you need six interviews to make a hiring decision, the problem isn't the candidate. It's the decision-making process internally.\n\nWhen we present a shortlist, we tell our clients: these candidates are good and they have options. Move with intention. We're not trying to rush you into a bad decision, we're trying to help you make a good one before someone else does.\n\nSpeed is a competitive advantage. Use it.`,
          fr:`Quatre rondes d'entrevues pour un superviseur d'usine. Je l'ai vu. Voilà ce que ça te coûte.\n\nLes meilleurs candidats en fabrication alimentaire en ce moment reçoivent plusieurs offres simultanément. Ils n'attendent pas assis ta quatrième entrevue. Ils signent des offres avec des compagnies qui ont bougé plus vite que toi.\n\nJe vois ça arriver régulièrement. Un client trouve un candidat fort comme directeur QA. La première entrevue se passe bien. La deuxième entrevue est prévue deux semaines plus tard. Puis une entrevue de panel. Puis une rencontre avec le VP. Puis une vérification de références qui prend encore une semaine. Puis une offre.\n\nSix semaines. Le candidat a accepté une autre offre à la semaine trois.\n\nL'ironie c'est que les compagnies avec les processus d'entrevue les plus longs sont généralement celles qui disent qu'elles "ne trouvent pas de bons candidats." Elles les ont trouvés. Elles les ont juste perdus.\n\nVoilà à quoi ressemble un processus raisonnable pour un rôle intermédiaire à sénior en fabrication alimentaire : une évaluation initiale par le recruteur, une entrevue substantielle avec le gestionnaire, une deuxième entrevue (optionnelle, pour les rôles séniors), des références, une offre. Trois à quatre semaines du premier contact à l'offre signée.\n\nSi tu as besoin de six entrevues pour prendre une décision d'embauche, le problème n'est pas le candidat. C'est le processus décisionnel interne.\n\nLa vitesse est un avantage concurrentiel. Utilise-le.`} },

  { id:"salaires-alimentaire-canada-2026", cat:{en:"Market",fr:"Marché"}, date:"Mars 2026", iso:"2026-03-03", read:{en:"5 min",fr:"5 min"}, recruiter:"Simon St-Amand",
    title:{en:"What food industry salaries actually look like in Canada in 2026.",fr:"À quoi ressemblent vraiment les salaires dans l'industrie alimentaire au Canada en 2026."},
    excerpt:{en:"The benchmarks have shifted. Here's what we're seeing on actual offers, not survey data.",fr:"Les références ont bougé. Voilà ce qu'on voit sur les vraies offres, pas les données de sondage."},
    body:{en:`The benchmarks have shifted significantly since 2019. Here's what we're actually seeing on offers, not survey data, not industry reports, but real numbers from real mandates in Quebec and Ontario.\n\nPlant Manager (food manufacturing, 200 to 500 employees): $130,000 to $165,000 base. P&L responsibility and union experience push toward the top of that range. In 2019 this role was $95,000 to $120,000.\n\nQuality Assurance Director (SQF/HACCP certified, 10+ years): $110,000 to $145,000. GFSI audit experience and bilingualism add value in Quebec. Strong demand, limited supply, candidates in this profile are receiving competing offers.\n\nSupply Chain Director (CPG, cross-functional): $115,000 to $150,000. SAP and ERP implementation experience push higher. This role has seen the most salary inflation over the past three years.\n\nProduction Supervisor (shift management, 3 to 5 years experience): $65,000 to $85,000. Variable by region, Ontario generally pays 8 to 12% higher than Quebec for equivalent roles.\n\nFood Safety Manager (HACCP, plant-level): $80,000 to $105,000. Bilingual candidates in Quebec are at a premium.\n\nVP Operations (multi-site, full P&L): $170,000 to $220,000 base, plus bonus structure. These mandates are retained searches.\n\nA few observations from the field:\n\nCandidates who receive a competing offer during your process will use it to negotiate. Budget accordingly or move faster.\n\nBonus structures matter more than they used to. A candidate choosing between two similar base salaries will lean toward the one with a clear, achievable bonus plan.\n\nRemote work expectations have reset. Most food manufacturing roles require site presence by definition. Candidates know this. The conversation has shifted to flexibility around start times, schedule arrangements, and hybrid options for administrative functions.\n\nIf your compensation ranges haven't been updated since 2022, they're out of market. We see this regularly and it is the single most common reason a search stalls.`,
          fr:`Les références ont bougé significativement depuis 2019. Voilà ce qu'on voit vraiment sur les offres, pas des données de sondage, pas des rapports d'industrie, mais de vrais chiffres de vrais mandats au Québec et en Ontario.\n\nDirecteur d'usine (fabrication alimentaire, 200 à 500 employés) : 130 000$ à 165 000$ base. La responsabilité P&L et l'expérience en milieu syndiqué poussent vers le haut de cette fourchette. En 2019 ce rôle était entre 95 000$ et 120 000$.\n\nDirecteur assurance qualité (certifié SQF/HACCP, 10+ ans) : 110 000$ à 145 000$. L'expérience d'audit GFSI et le bilinguisme ajoutent de la valeur au Québec. Forte demande, offre limitée, les candidats dans ce profil reçoivent des offres concurrentes.\n\nDirecteur chaîne d'approvisionnement (CPG, transversal) : 115 000$ à 150 000$. L'expérience d'implantation SAP et ERP pousse plus haut. Ce rôle a connu la plus forte inflation salariale au cours des trois dernières années.\n\nSuperviseur de production (gestion de quarts, 3 à 5 ans d'expérience) : 65 000$ à 85 000$. Variable selon la région, l'Ontario paie généralement 8 à 12% de plus que le Québec pour des rôles équivalents.\n\nResponsable salubrité alimentaire (HACCP, niveau usine) : 80 000$ à 105 000$. Les candidats bilingues au Québec sont à prime.\n\nVP Opérations (multi-sites, P&L complet) : 170 000$ à 220 000$ base, plus structure de boni. Ces mandats sont des recherches retenues.\n\nQuelques observations du terrain :\n\nLes candidats qui reçoivent une offre concurrente pendant ton processus l'utiliseront pour négocier. Budget en conséquence ou bouge plus vite.\n\nSi tes fourchettes de rémunération n'ont pas été mises à jour depuis 2022, elles sont hors marché. On voit ça régulièrement et c'est la raison la plus courante pour laquelle une recherche stagne.`} },

  { id:"penurie-main-oeuvre-alimentaire", cat:{en:"Market",fr:"Marché"}, date:"Février 2026", iso:"2026-02-03", read:{en:"4 min",fr:"4 min"}, recruiter:"Simon St-Amand",
    title:{en:"The food industry labour shortage isn't going away. Here's why.",fr:"La pénurie de main-d'oeuvre dans l'alimentaire ne s'en va pas. Voilà pourquoi."},
    excerpt:{en:"I've been saying this for three years. The pipeline problem in food manufacturing is structural, not cyclical.",fr:"Je dis ça depuis trois ans. Le problème de pipeline en fabrication alimentaire est structurel, pas cyclique."},
    body:{en:`I've been saying this for three years. The pipeline problem in food manufacturing is structural, not cyclical.\n\nHere's what I mean.\n\nThe generation of plant managers, quality directors, and operations leaders who learned their craft in the 1990s and 2000s is retiring. And the generation behind them is smaller, less specialized, and increasingly aware that food manufacturing is a hard industry to work in, long hours, physical environments, regulatory pressure, unionized workforces.\n\nAt the same time, the industry has grown. Ontario has seen significant greenfield investment in food processing over the past five years. New facilities in Hamilton, Strathroy, and across the GTA are competing for the same limited pool of experienced operators and quality professionals.\n\nThe math doesn't work. More plants, fewer experienced people.\n\nWhat does this mean practically?\n\nTimelines are longer. The five-week search that was normal in 2018 is now ten to fourteen weeks for senior food manufacturing roles. Companies that planned to "fill the role before the current person leaves" are consistently finding out that's not realistic anymore.\n\nCompensation has inflated. We covered this in another post. The point is that the shortage gives candidates leverage, and they're using it.\n\nThe passive candidate is the only candidate worth pursuing. If you're waiting for someone to apply, you're fishing in a very small pond.\n\nThe companies that are winning the talent competition right now are the ones that move fast, pay fairly, and treat their recruiters as strategic partners rather than a last resort.\n\nThe ones that are struggling are the ones still running the 2015 playbook in a 2026 market.`,
          fr:`Je dis ça depuis trois ans. Le problème de pipeline en fabrication alimentaire est structurel, pas cyclique.\n\nVoilà ce que je veux dire.\n\nLa génération de directeurs d'usine, directeurs qualité et leaders en opérations qui ont appris leur métier dans les années 1990 et 2000 prend sa retraite. Et la génération derrière eux est plus petite, moins spécialisée, et de plus en plus consciente que la fabrication alimentaire est une industrie difficile, longues heures, environnements physiques, pression réglementaire, effectifs syndiqués.\n\nEn même temps, l'industrie a grandi. L'Ontario a connu des investissements greenfield significatifs en transformation alimentaire au cours des cinq dernières années. De nouvelles installations à Hamilton, Strathroy et dans tout le Grand Toronto se disputent le même bassin limité d'opérateurs et de professionnels qualité expérimentés.\n\nLe calcul ne fonctionne pas. Plus d'usines, moins de gens expérimentés.\n\nQu'est-ce que ça signifie concrètement?\n\nLes délais sont plus longs. La recherche de cinq semaines qui était normale en 2018 dure maintenant dix à quatorze semaines pour les rôles séniors en fabrication alimentaire.\n\nLa rémunération a augmenté. La pénurie donne aux candidats du levier, et ils l'utilisent.\n\nLe candidat passif est le seul candidat qui vaut la peine d'être poursuivi. Si tu attends que quelqu'un applique, tu pêches dans un très petit étang.\n\nLes compagnies qui gagnent la compétition des talents en ce moment sont celles qui bougent vite, paient équitablement et traitent leurs recruteurs comme des partenaires stratégiques plutôt qu'un dernier recours.`} },

  { id:"negocier-offre-emploi", cat:{en:"Career",fr:"Carrière"}, date:"Janvier 2026", iso:"2026-01-06", read:{en:"4 min",fr:"4 min"}, recruiter:"Rana Yamak",
    title:{en:"How to negotiate a job offer without losing it.",fr:"Comment négocier une offre d'emploi sans la perdre."},
    excerpt:{en:"Most people either don't negotiate at all or negotiate badly. Here's how to do it right in food and CPG.",fr:"La plupart des gens ne négocient pas du tout ou négocient mal. Voilà comment bien le faire dans l'alimentaire et le CPG."},
    body:{en:`Most people either don't negotiate at all or negotiate badly. Here's how to do it right in food and CPG.\n\nFirst, a reality check: every employer who makes you an offer expects you to negotiate. It is built into the process. Not negotiating doesn't make you seem easy to work with, it makes you seem like you didn't know you could.\n\nThat said, there's a right way and a wrong way.\n\nThe right way starts with knowing your number before you get the offer. What is the minimum salary you would accept? What would make you say yes without hesitation? What is genuinely above market for your experience and location? If you don't know these numbers going in, you're negotiating blind.\n\nWhen the offer comes, thank them for it genuinely and ask for time. "I'm excited about this opportunity. Can I have 24 to 48 hours to review everything?" This is completely normal and professional. Use that time to compare the full package, base, bonus, benefits, vacation, flexibility, not just the headline number.\n\nIf you want to negotiate, be specific. "Based on my experience in food safety at the director level and the current market for this type of role in Ontario, I was hoping we could get to $125,000" is a negotiation. "I was hoping for more" is not.\n\nOne number. Not a range. A range tells the employer to anchor to your lower number.\n\nAlso negotiate what you can't easily change later: starting vacation, sign-on bonus, start date, remote flexibility. Salary is easier to increase once you're inside. First-day vacation entitlements are not.\n\nWhat not to do: don't negotiate by email if you can avoid it, don't bring up personal financial needs as a justification, and don't give an ultimatum unless you mean it.\n\nAnd if they say no to everything you ask? At least you asked. Now you know exactly where the ceiling is and you can decide whether to accept or walk. Either way, you're making an informed decision.`,
          fr:`La plupart des gens ne négocient pas du tout ou négocient mal. Voilà comment bien le faire dans l'alimentaire et le CPG.\n\nD'abord, un retour à la réalité : chaque employeur qui te fait une offre s'attend à ce que tu négocies. C'est intégré dans le processus. Ne pas négocier ne te rend pas facile à travailler, ça donne l'impression que tu ne savais pas que tu pouvais.\n\nCela dit, il y a une bonne façon et une mauvaise façon.\n\nLa bonne façon commence par connaître ton chiffre avant de recevoir l'offre. Quel est le salaire minimum que tu accepterais? Qu'est-ce qui te ferait dire oui sans hésitation? Qu'est-ce qui est vraiment au-dessus du marché pour ton expérience et ta région?\n\nQuand l'offre arrive, remercie-les sincèrement et demande du temps. "Je suis enthousiaste à propos de cette opportunité. Est-ce que je peux avoir 24 à 48 heures pour tout réviser?" C'est complètement normal et professionnel.\n\nSi tu veux négocier, sois spécifique. "Basé sur mon expérience en salubrité alimentaire au niveau directeur et le marché actuel pour ce type de rôle en Ontario, j'espérais qu'on puisse arriver à 125 000$" est une négociation. "J'espérais avoir plus" n'en est pas une.\n\nUn chiffre. Pas une fourchette. Une fourchette dit à l'employeur d'ancrer sur ton chiffre inférieur.\n\nNégocie aussi ce que tu ne peux pas facilement changer plus tard : les vacances de départ, le boni à la signature, la date de début, la flexibilité de télétravail.\n\nEt si ils disent non à tout ce que tu demandes? Au moins tu as demandé.`} },

  { id:"linkedin-profil-alimentaire", cat:{en:"Career",fr:"Carrière"}, date:"Décembre 2025", iso:"2025-12-02", read:{en:"3 min",fr:"3 min"}, recruiter:"Rana Yamak",
    title:{en:"Your LinkedIn profile isn't getting you calls. Here's what to fix.",fr:"Ton profil LinkedIn ne te génère pas d'appels. Voilà ce qu'il faut régler."},
    excerpt:{en:"I search LinkedIn every day for food and CPG candidates. Most profiles make it impossible to know if someone is worth calling.",fr:"Je cherche sur LinkedIn chaque jour des candidats en alimentaire et CPG. La plupart des profils rendent impossible de savoir si quelqu'un vaut la peine d'être appelé."},
    body:{en:`I search LinkedIn every day for food and CPG candidates. Most profiles make it impossible to know if someone is worth calling. Here's what I'm looking for and what gets in the way.\n\nThe headline. This is the most important real estate on your profile. If it just says your job title and company name, you're invisible in search. A recruiter searching for a "SQF certified QA Director Ontario" needs to see those words somewhere visible. Use your headline to tell me who you are professionally, not just where you work. "Quality Assurance Director | SQF Practitioner | Food Manufacturing | Ontario" is a searchable headline. "Quality Director at Maple Leaf" is not.\n\nThe summary. Write two to four sentences about what you actually do, what you're known for, and what kind of opportunity interests you. Be direct. "I lead quality assurance programs in food manufacturing, with deep expertise in SQF, HACCP, and regulatory compliance. Open to director and VP-level opportunities in Ontario and Quebec." That tells me in ten seconds whether to pick up the phone.\n\nCertifications. Put them in the Licenses & Certifications section. SQF, HACCP, FSMA, BRC, these are searchable. If they're buried in your experience description or missing entirely, you don't exist in that search.\n\nExperience descriptions. Tell me what you accomplished, not just what you were responsible for. "Responsible for food safety programs" tells me nothing. "Led SQF Level 3 recertification across three facilities, maintained zero critical non-conformances over four audit cycles" tells me a lot.\n\nActivity. You don't need to post every week. But a profile that hasn't been touched in three years sends a signal. A comment on an industry article, a shared post about food safety, even minimal activity shows you're present.\n\nAnd for the love of everything, update your location. If you moved from Montreal to Toronto two years ago and your profile still says Montreal, I'm filtering you out of Ontario searches.`,
          fr:`Je cherche sur LinkedIn chaque jour des candidats en alimentaire et CPG. La plupart des profils rendent impossible de savoir si quelqu'un vaut la peine d'être appelé. Voilà ce que je cherche et ce qui bloque.\n\nLe titre. C'est l'espace le plus important de ton profil. Si ça dit juste ton titre de poste et le nom de la compagnie, tu es invisible dans la recherche. Utilise ton titre pour me dire qui tu es professionnellement, pas juste où tu travailles. "Directeur assurance qualité | Praticien SQF | Fabrication alimentaire | Ontario" est un titre cherchable. "Directeur qualité chez Maple Leaf" ne l'est pas.\n\nLe résumé. Écris deux à quatre phrases sur ce que tu fais vraiment, pour quoi tu es connu et quel type d'opportunité t'intéresse. Sois direct. "Je dirige des programmes d'assurance qualité en fabrication alimentaire, avec une expertise approfondie en SQF, HACCP et conformité réglementaire. Ouvert à des opportunités de niveau directeur et VP en Ontario et Québec."\n\nLes certifications. Mets-les dans la section Licences et certifications. SQF, HACCP, FSMA, BRC, celles-là sont cherchables.\n\nLes descriptions d'expérience. Dis-moi ce que tu as accompli, pas juste de quoi tu étais responsable. "Responsable des programmes de salubrité alimentaire" ne me dit rien. "Dirigé la recertification SQF Niveau 3 dans trois installations, maintenu zéro non-conformité critique sur quatre cycles d'audit" me dit beaucoup.\n\nEt mets à jour ta localisation. Si tu as déménagé de Montréal à Toronto il y a deux ans et que ton profil dit encore Montréal, je te filtre des recherches en Ontario.`} },

  { id:"mode-recrutement-canada", cat:{en:"Fashion",fr:"Mode"}, date:"Novembre 2025", iso:"2025-11-04", read:{en:"4 min",fr:"4 min"}, recruiter:"Robin Anisef",
    title:{en:"What's actually happening in Canadian fashion recruitment right now.",fr:"Ce qui se passe vraiment dans le recrutement mode au Canada en ce moment."},
    excerpt:{en:"The Canadian fashion industry is smaller than it looks. Which means the talent pool is smaller too. Robin Anisef on where the market is right now.",fr:"L'industrie mode canadienne est plus petite qu'elle en a l'air. Ce qui veut dire que le bassin de talents l'est aussi. Robin Anisef sur où est le marché en ce moment."},
    body:{en:`The Canadian fashion industry is smaller than it looks from the outside. Which means the talent pool is smaller too, the relationships matter more, and the wrong hire is more expensive than in a market where you can easily replace someone.\n\nHere's what I'm seeing right now, after 20 years recruiting in this space.\n\nBuyers are in demand, full stop. Good senior buyers with strong vendor relationships, particularly international sourcing experience in Asia or Europe, are getting multiple conversations happening simultaneously. If you find one you want, move on them. Don't run a six-week process.\n\nThe DTC shift has created a new kind of candidate. Companies that have built or are building direct-to-consumer channels need people who understand both the brand side and the operational side, inventory management, digital marketing, customer experience. This is a hybrid profile that didn't really exist ten years ago and is genuinely hard to find.\n\nMontreal and Toronto are increasingly one market for fashion talent. Candidates in both cities are open to the other, especially for the right opportunity. Remote and hybrid arrangements have expanded the pool on both sides.\n\nCompensation has moved. A Senior Buyer role that paid $80,000 in 2019 is now $95,000 to $110,000 for a strong candidate. Brand managers at the director level are pushing $120,000 to $140,000 in a competitive search.\n\nThe biggest mistake fashion companies make in hiring: waiting too long to engage a recruiter and then expecting a shortlist in a week. Good fashion candidates don't come out of a database pull. They come out of a conversation I had six months ago, or a referral from someone I placed three years back, or a candidate who reached out when they weren't ready to move and is now ready.\n\nThat's the value of working with someone who has been in this market for two decades. You're not buying a search. You're buying 20 years of relationships.`,
          fr:`L'industrie mode canadienne est plus petite qu'elle en a l'air de l'extérieur. Ce qui veut dire que le bassin de talents l'est aussi, que les relations comptent davantage, et que la mauvaise embauche est plus coûteuse que dans un marché où tu peux facilement remplacer quelqu'un.\n\nVoilà ce que je vois en ce moment, après 20 ans à recruter dans cet espace.\n\nLes acheteurs sont en demande, point final. Les bons acheteurs séniors avec de solides relations fournisseurs, particulièrement une expérience en approvisionnement international en Asie ou en Europe, reçoivent plusieurs conversations simultanément. Si tu en trouves un que tu veux, fais-leur une offre. Ne cours pas un processus de six semaines.\n\nLe virage DTC a créé un nouveau type de candidat. Les compagnies qui ont bâti ou qui bâtissent des canaux directs aux consommateurs ont besoin de gens qui comprennent à la fois le côté marque et le côté opérationnel. C'est un profil hybride qui n'existait pas vraiment il y a dix ans et qui est vraiment difficile à trouver.\n\nMontréal et Toronto sont de plus en plus un seul marché pour les talents mode. Les candidats dans les deux villes sont ouverts à l'autre, surtout pour la bonne opportunité.\n\nLa rémunération a bougé. Un poste d'acheteur principal qui payait 80 000$ en 2019 est maintenant 95 000$ à 110 000$ pour un candidat fort.\n\nLa plus grande erreur que les compagnies mode font en embauche : attendre trop longtemps pour engager un recruteur et ensuite s'attendre à une courte liste en une semaine. Les bons candidats mode ne sortent pas d'une extraction de base de données. Ils sortent d'une conversation que j'ai eue il y a six mois.\n\nC'est la valeur de travailler avec quelqu'un qui est dans ce marché depuis deux décennies. Tu n'achètes pas une recherche. Tu achètes 20 ans de relations.`} },

  { id:"onboarding-nouveau-directeur", cat:{en:"Hiring",fr:"Embauche"}, date:"Octobre 2025", iso:"2025-10-07", read:{en:"3 min",fr:"3 min"}, recruiter:"Stéphanie Lanoie",
    title:{en:"You hired a great plant manager. Now don't blow the onboarding.",fr:"Tu as embauché un bon directeur d'usine. Maintenant ne rate pas l'intégration."},
    excerpt:{en:"The first 90 days determine whether a senior hire stays or starts looking again. Most companies get this wrong.",fr:"Les 90 premiers jours déterminent si une embauche sénior reste ou recommence à chercher. La plupart des compagnies ratent ça."},
    body:{en:`The first 90 days determine whether a senior hire stays or starts looking again. Most companies get this wrong, and it costs them the placement guarantee window and then some.\n\nHere's what I see happen too often: a company works hard to recruit a strong plant manager or quality director, makes a competitive offer, and then essentially abandons them on day one. Here's the desk. Here's your email login. Good luck.\n\nSenior hires in food manufacturing are walking into complex situations. Union relationships, legacy processes, team dynamics, regulatory history, all of it existed before they arrived and none of it comes with a manual. If you don't give them a structured way to learn it, they'll spend the first three months trying to figure out what's actually going on instead of doing the job you hired them to do.\n\nWhat good onboarding looks like at the director level:\n\nA 30-60-90 day plan that was built before they started, with clear expectations for each phase. Not a task list, an outcomes list. What should they understand at 30 days? What decisions should they be making at 60? What should they have changed or launched by 90?\n\nRegular check-ins with their direct manager. Not just about tasks. About how they're finding the culture, who the key relationships are, what's surprising them.\n\nIntroductions that matter. Not just an office tour. Structured meetings with the people whose work intersects with theirs, quality, operations, HR, supply chain. Their first week should have a calendar, not a void.\n\nSpace to ask questions without looking incompetent. The worst thing a new senior hire can do is pretend they understand something they don't. Create an environment where not knowing is okay for the first 30 days.\n\nWhen onboarding fails, it's usually not because the candidate was a bad hire. It's because no one treated their first 90 days as a critical phase of the investment. You spent months finding the right person. Spend a few hours designing their start.`,
          fr:`Les 90 premiers jours déterminent si une embauche sénior reste ou recommence à chercher. La plupart des compagnies ratent ça, et ça leur coûte la fenêtre de garantie de placement et plus encore.\n\nVoilà ce que je vois arriver trop souvent : une compagnie travaille fort pour recruter un bon directeur d'usine ou directeur qualité, fait une offre compétitive, puis les abandonne essentiellement le jour un. Voilà ton bureau. Voilà ton accès courriel. Bonne chance.\n\nLes embauches séniors en fabrication alimentaire arrivent dans des situations complexes. Relations syndicales, processus hérités, dynamiques d'équipe, historique réglementaire, tout ça existait avant qu'ils arrivent et rien de ça ne vient avec un manuel.\n\nÀ quoi ressemble une bonne intégration au niveau directeur :\n\nUn plan 30-60-90 jours qui a été construit avant qu'ils commencent, avec des attentes claires pour chaque phase. Pas une liste de tâches, une liste de résultats. Qu'est-ce qu'ils devraient comprendre à 30 jours? Quelles décisions devraient-ils prendre à 60?\n\nDes suivis réguliers avec leur gestionnaire direct. Pas juste sur les tâches. Sur comment ils trouvent la culture, qui sont les relations clés, ce qui les surprend.\n\nDes introductions qui comptent. Pas juste une visite de bureau. Des rencontres structurées avec les gens dont le travail croise le leur.\n\nQuand l'intégration échoue, ce n'est généralement pas parce que le candidat était une mauvaise embauche. C'est parce que personne n'a traité leurs 90 premiers jours comme une phase critique de l'investissement. Tu as passé des mois à trouver la bonne personne. Passe quelques heures à concevoir leur départ.`} },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
// Sert le WebP quand le navigateur le prend (tous depuis 2020) et garde le JPEG
// en filet de securite. width et height evitent que la page saute pendant le
// chargement: le navigateur reserve la place avant que l'image arrive.
function Photo({ src, alt = "", w, h, eager, style, className }) {
  const webp = src.replace(/\.jpg$/, ".webp");
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={src} alt={alt} width={w} height={h}
        loading={eager ? "eager" : "lazy"} decoding="async"
        className={className} style={{ height:"auto", ...style }} />
    </picture>
  );
}

/* Bande photo pleine largeur. Chaque image vit dans son propre bloc parce que
   <picture> est en display:contents dans la feuille globale: l'image seule ne
   tiendrait pas sa case. items = [[src, poids, largeur, hauteur, alt], ...] */
function PhotoBand({ items, h = "clamp(190px,24vw,300px)" }) {
  return (
    <section className="photo-band-3" style={{ display:"flex", gap:"4px", background:"#fff" }}>
      {items.map(([src, grow, w, ht, alt]) => (
        <div key={src} style={{ flex:`${grow} 1 0`, minWidth:0, height:h, overflow:"hidden" }}>
          <Photo src={src} w={w} h={ht} alt={alt}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        </div>
      ))}
    </section>
  );
}

function Avatar({ m, size, full, style, className }) {
  const box = full ? { width:"100%", aspectRatio:"1 / 1" } : { width:size, height:size };
  if (m.photo) {
    return (
      <Photo src={m.photo} alt={m.name} w={760} h={760} className={className} style={{
        ...box, objectFit:"cover", objectPosition:"center 22%", display:"block",
        background:C.paperDark, flexShrink:0, ...style,
      }} />
    );
  }
  return (
    <div className={className} style={{
      ...box, background:C.orange, display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Archivo',sans-serif", fontSize: full ? "2rem" : (size >= 56 ? "1rem" : "0.8rem"),
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
    ? [["food","Food"],["fashion","Fashion"],["employers","Employers"],["team","Team"],["blog","Blog"],["candidates","Candidates"],["jobs","Jobs"],["contact","Contact"]]
    : [["food","Alimentaire"],["fashion","Mode"],["employers","Employeurs"],["team","Équipe"],["blog","Blogue"],["candidates","Candidats"],["jobs","Emplois"],["contact","Contact"]];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        background:"#fff",
        borderBottom:`1px solid ${scrolled ? C.ink : C.rule}`,
        transition:"background 0.3s",
        padding:"0 2rem", height:"56px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        {/* Wordmark */}
        <PageLink to="home" setPage={setPage} style={{
          fontFamily:"'Playfair Display',serif", fontWeight:600,
          fontSize:"1.35rem", color:C.ink, letterSpacing:"-0.005em",
          display:"flex", alignItems:"center", gap:"3px",
        }}>
          Proforce
          <span style={{ color:C.orange, fontSize:"1.5rem", lineHeight:1 }}>.</span>
        </PageLink>

        {/* Desktop links */}
        <div className="hide-mobile nav-links" style={{ display:"flex", alignItems:"center", gap:"1.75rem" }}>
          {links.map(([k,l]) => (
            <PageLink key={k} to={k} setPage={setPage} style={{
              fontFamily:"'Archivo',sans-serif", fontSize:"0.68rem",
              letterSpacing:"0.08em", textTransform:"uppercase",
              color: page===k ? "#c24a10" : C.ink,
              borderBottom: page===k ? `1px solid ${C.orange}` : "1px solid transparent",
              paddingBottom:"1px", transition:"color 0.2s",
            }}>{l}</PageLink>
          ))}
          <button onClick={() => setLang(lang==="en"?"fr":"en")} style={{
            fontFamily:"'Archivo',sans-serif", fontSize:"0.68rem",
            letterSpacing:"0.08em", textTransform:"uppercase",
            color:"#c24a10", borderBottom:`1px solid #c24a10`,
            paddingBottom:"1px",
          }}>{lang==="en"?"FR":"EN"}</button>

          {/* Booking CTA */}
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
            onClick={() => track.contactClick()}
            style={{
              background:"#c24a10", color:"#fff", padding:"7px 16px",
              fontFamily:"'Archivo',sans-serif", fontWeight:600, fontSize:"0.72rem",
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
          display:"none", color:C.ink, fontSize:"1.2rem",
          fontFamily:"'Archivo',sans-serif",
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
              fontFamily:"'Archivo',sans-serif", fontSize:"1.5rem",
              color: page===k ? C.orange : "#fff", textAlign:"left",
              padding:"0.9rem 0", borderBottom:`1px solid rgba(255,255,255,0.08)`,
              fontWeight:600, letterSpacing:"-0.01em",
            }}>{l}</PageLink>
          ))}
          <button onClick={() => setLang(lang==="en"?"fr":"en")} style={{
            color:C.orange, fontSize:"1rem", textAlign:"left",
            padding:"1rem 0", fontFamily:"'Archivo',sans-serif", letterSpacing:"0.08em",
          }}>{lang==="en"?"Français":"English"}</button>

          {/* Mobile booking CTA */}
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
            onClick={() => { track.contactClick(); setOpen(false); }}
            style={{
              background:C.orange, color:"#fff", padding:"14px 24px",
              fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.85rem",
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
        <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange }}>
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
      heroLabel:"Specialist recruitment in food, CPG and fashion",
      h1:"We know\nyour industry.",
      h1em:"Not just the job.",
      sub:"Proforce Personnel places food, CPG, and fashion professionals across Montreal, Quebec City, and Toronto. No generalists. No job boards. A network built over 25 years.",
      cta1:"Our Sectors", cta2:"Contact Us",
      p1n:"83%",
      p1h:"of our placements come from clients who called us back.",
      p1p:"76 of 144 companies have given us two mandates or more. Nobody gives a second search to a firm that got the first one wrong.",
      p2n:"400", p2p:"permanent placements since 2019, in food, CPG and fashion.",
      p3n:"24", p3p:"clients have trusted us with five mandates or more.",
      p4n:"90 days to 1 year", p4p:"replacement guarantee on every permanent placement, depending on the role.",
      psrc:"Figures from our placement records, March 2019 to September 2026",
      cliH:"144 companies have trusted us with a search since 2019.",
      cliP:"Here are a few of them. Each one gave us permission to show their name.",
      s2label:"Two industries. Full stop.",
      s2p:"Food and fashion. We made that call a long time ago. Because doing two things properly beats doing eight things adequately.",
      foodH:"Food & CPG", foodP:"From plant floor to executive office, quality directors, plant managers, supply chain leads, sales reps.",
      fashH:"Fashion & Apparel", fashP:"Buyers, brand managers, designers, production coordinators, we know the back rooms as well as the showrooms.",
      stat1:"25", sl1:"Years", stat2:"5", sl2:"Specialists", stat3:"MTL+TOR", sl3:"Markets", stat4:"100%", sl4:"Guaranteed",
      w1h:"Network over noise", w1p:"We don't post and wait. We call people we already know, people who aren't looking but who'd be perfect.",
      w2h:"Specialists, not generalists", w2p:"Your recruiter lives inside your industry. They've been there long enough to know who's who.",
      w3h:"Placement guarantee", w3p:"Every permanent placement is guaranteed. We stand behind who we send you.",
      noH:"We will tell you no before taking a search we cannot deliver.\nIt costs us searches.\nIt saves you three months.",
      noSrc:"Simon St-Amand, President", noLink:"Read his page",
      heroCta1:"Let's talk about your role", heroCta2:"Meet the team",
      proofLabel:"The number we watch",
      proofH:"Eighty-three percent of our placements come from clients who had already called us once.",
      proofP:"Seventy-six companies out of a hundred and forty-four have given us two searches or more. Nobody gives a second search to a firm that got the first one wrong.",
      f1n:"400", f1p:"permanent placements since 2019",
      f2n:"144", f2p:"client companies",
      f3n:"24", f3p:"clients at five searches or more",
      secLabel:"Our two industries",
      ctaH:"Ready to talk?", ctaP:"One call is usually enough to know if we're the right fit.", cta3:"Get in Touch",
    },
    fr:{
      issue:"Vol. 25, Recrutement spécialisé",
      heroLabel:"Recrutement spécialisé en alimentaire, CPG et mode",
      h1:"On connaît\nton industrie.",
      h1em:"Pas juste le poste.",
      sub:"Proforce Personnel place des professionnels de l'alimentaire, du CPG et de la mode à Montréal, Québec et Toronto. Pas de généralistes. Pas de babillards. Un réseau bâti sur 25 ans.",
      cta1:"Nos secteurs", cta2:"Nous contacter",
      p1n:"83 %",
      p1h:"de nos placements viennent de clients qui nous ont rappelés.",
      p1p:"76 entreprises sur 144 nous ont confié deux mandats ou plus. Personne ne donne une deuxième recherche à une firme qui a manqué la première.",
      p2n:"400", p2p:"placements permanents depuis 2019, en alimentaire, CPG et mode.",
      p3n:"24", p3p:"clients nous ont confié cinq mandats ou plus.",
      p4n:"90 jours à 1 an", p4p:"de garantie de remplacement sur chaque placement permanent, selon le poste.",
      psrc:"Chiffres tirés de nos registres de placements, mars 2019 à septembre 2026",
      cliH:"144 entreprises nous ont confié un mandat depuis 2019.",
      cliP:"En voici quelques unes. Chacune nous a donné sa permission pour afficher son nom.",
      s2label:"Deux industries. Point final.",
      s2p:"Alimentaire et mode. On a fait ce choix il y a longtemps. Parce que bien faire deux choses vaut mieux que faire huit choses à moitié.",
      foodH:"Alimentaire & CPG", foodP:"Du plancher d'usine jusqu'à la direction, directeurs qualité, directeurs d'usine, responsables chaîne d'approvisionnement.",
      fashH:"Mode & Habillement", fashP:"Acheteurs, gestionnaires de marque, designers, coordinateurs de production, on connaît les coulisses autant que les showrooms.",
      stat1:"25", sl1:"Ans", stat2:"5", sl2:"Spécialistes", stat3:"MTL+TOR", sl3:"Marchés", stat4:"100%", sl4:"Garanti",
      w1h:"Réseau plutôt que bruit", w1p:"On n'affiche pas et on n'attend pas. On appelle des gens qu'on connaît déjà, des gens qui ne cherchent pas, mais qui seraient parfaits.",
      w2h:"Spécialistes, pas généralistes", w2p:"Ton recruteur vit à l'intérieur de ton industrie. Il y est depuis assez longtemps pour savoir qui est qui.",
      w3h:"Garantie de placement", w3p:"Chaque placement permanent est garanti. On se tient derrière les gens qu'on t'envoie.",
      noH:"On va te dire non avant de prendre un mandat qu'on ne peut pas livrer.\nÇa nous coûte des mandats.\nÇa t'évite trois mois perdus.",
      noSrc:"Simon St-Amand, président", noLink:"Lire sa page",
      heroCta1:"Parlons de ton poste", heroCta2:"Voir l'équipe",
      proofLabel:"Le chiffre qu'on regarde",
      proofH:"Quatre-vingt-trois pour cent de nos placements viennent de clients qui nous avaient déjà appelés une première fois.",
      proofP:"Soixante-seize entreprises sur cent quarante-quatre nous ont confié deux mandats ou plus. Personne ne donne une deuxième recherche à une firme qui a manqué la première.",
      f1n:"400", f1p:"placements permanents depuis 2019",
      f2n:"144", f2p:"entreprises clientes",
      f3n:"24", f3p:"clients à cinq mandats ou plus",
      secLabel:"Nos deux industries",
      ctaH:"Prêt à jaser?", ctaP:"Un appel suffit généralement pour savoir si on est le bon fit.", cta3:"Nous contacter",
    },
  }[lang];

  return (
    <div>
      {/* ── HERO ── blanc, un libelle pose sur un filet orange, un seul titre ── */}
      <section style={{ background:"#fff", padding:"7.5rem 2rem 3.5rem" }}>
        <div style={{ maxWidth:"1150px", margin:"0 auto" }}>
          <div className="fu" style={{
            fontFamily:"'Archivo',sans-serif", fontSize:"0.72rem", fontWeight:600,
            letterSpacing:"0.08em", textTransform:"uppercase", color:"#c24a10",
            paddingBottom:"0.7rem",
          }}>{t.heroLabel}</div>
          <div className="fu" style={{ height:"2px", background:C.orange, marginBottom:"1.8rem" }} />

          <h1 className="fu2" style={{
            fontFamily:"'Playfair Display',serif", fontWeight:500,
            fontSize:"clamp(2.2rem,5.4vw,4.1rem)", lineHeight:1.06,
            letterSpacing:"-0.005em", textTransform:"uppercase", color:C.ink,
            marginBottom:"2.2rem", maxWidth:"1000px",
          }}>
            {lang==="en" ? "We know your industry" : "On connaît ton industrie"}
            <span style={{ color:C.orange }}>{lang==="en" ? ", not just the job" : ", pas juste le poste"}</span>
          </h1>

          <div className="fu3 two-col" style={{ display:"grid", gridTemplateColumns:"minmax(0,460px) 1fr", gap:"3.5rem", alignItems:"start" }}>
            <p style={{ fontSize:"1rem", lineHeight:1.8, color:C.inkLight }}>{t.sub}</p>
            <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", paddingTop:"0.2rem" }}>
              <button className="btn-orange" onClick={() => setPage("contact")}>{t.heroCta1}</button>
              <button className="btn-ghost" onClick={() => setPage("team")}>{t.heroCta2}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANDE PHOTO ── trois images bord a bord, aucun texte par-dessus ── */}
      <PhotoBand items={[
        ["/photos/petits-fruits-triage.jpg", 2, 1600, 900,
         lang==="en" ? "Workers sorting berries along a processing line" : "Des employées qui trient des petits fruits sur une ligne de transformation"],
        ["/photos/qualite-panneau.jpg", 1, 900, 900,
         lang==="en" ? "Quality technician at a production line control panel" : "Technicienne qualité devant un panneau de contrôle"],
        ["/photos/mode-echantillons.jpg", 1, 900, 900,
         lang==="en" ? "Production coordinator checking a rack of sample garments" : "Coordonnatrice de production qui vérifie un support d'échantillons"],
      ]} />

      {/* ── PREUVE ── bande marine, la phrase en serif, les chiffres a cote ── */}
      <section style={{ background:C.ink, padding:"4.5rem 2rem" }}>
        <div className="two-col" style={{ maxWidth:"1150px", margin:"0 auto", display:"grid", gridTemplateColumns:"minmax(0,540px) 1fr", gap:"3.5rem", alignItems:"start" }}>
          <div>
            <div style={{
              fontFamily:"'Archivo',sans-serif", fontSize:"0.72rem", fontWeight:600,
              letterSpacing:"0.08em", textTransform:"uppercase", color:"#f0803f", marginBottom:"0.9rem",
            }}>{t.proofLabel}</div>
            <p style={{
              fontFamily:"'Playfair Display',serif", fontWeight:500,
              fontSize:"clamp(1.5rem,2.8vw,2.2rem)", lineHeight:1.32, color:"#fff",
            }}>{t.proofH}</p>
          </div>
          <div className="pt-desk" style={{ paddingTop:"2rem" }}>
            <p style={{ fontSize:"0.95rem", lineHeight:1.85, color:"rgba(255,255,255,0.78)", marginBottom:"2rem" }}>{t.proofP}</p>
            <div className="three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:"1.5rem" }}>
              {[[t.f1n,t.f1p],[t.f2n,t.f2p],[t.f3n,t.f3p]].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:600, fontSize:"1.8rem", color:"#f0803f", marginBottom:"0.2rem" }}>{n}</div>
                  <div style={{ fontSize:"0.78rem", lineHeight:1.55, color:"rgba(255,255,255,0.72)" }}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.4)", marginTop:"1.5rem" }}>{t.psrc}</p>
          </div>
        </div>
      </section>

      {/* Bande pleine largeur sur le marine de la marque. Elle fait le pont
          entre la section bleue des chiffres et la section blanche des secteurs. */}
      <section className="band-full" style={{ background:C.ink, overflow:"hidden" }}>
        <div style={{ width:"100%", height:"clamp(170px,22vw,300px)" }}>
          <Photo src="/photos/biscuits-bleu.jpg" w={1600} h={900}
            alt={lang==="en" ? "Overhead view of filled biscuits in rows on a navy conveyor belt" : "Vue de haut de biscuits fourrés alignés sur une courroie marine"}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        </div>
      </section>

      {/* ── SECTEURS ── deux cartes photo et un bloc orange qui porte la phrase ── */}
      <section style={{ background:"#fff", padding:"4rem 2rem 5.5rem" }}>
        <div style={{ maxWidth:"1150px", margin:"0 auto" }}>
          <Eyebrow>{t.secLabel}</Eyebrow>
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:"1.75rem" }}>
            <button onClick={() => setPage("food")} style={{ textAlign:"left", display:"block", width:"100%" }}>
              <Photo src="/photos/usine-emballage-equipe.jpg" w={1600} h={900}
                alt={lang==="en" ? "Packing lines in a meat plant, workers along both sides" : "Lignes d'emballage dans une usine de viande, du monde des deux côtés"}
                style={{ width:"100%", height:"170px", objectFit:"cover", display:"block", marginBottom:"1rem" }} />
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"1.4rem", color:C.ink, marginBottom:"0.4rem" }}>{t.foodH}</h3>
              <p style={{ fontSize:"0.88rem", lineHeight:1.7, color:C.muted }}>{t.foodP}</p>
            </button>

            <button onClick={() => setPage("fashion")} style={{ textAlign:"left", display:"block", width:"100%" }}>
              <Photo src="/photos/atelier-couture-usine.jpg" w={1600} h={900}
                alt={lang==="en" ? "Rows of industrial sewing machines on an apparel production floor" : "Rangées de machines à coudre industrielles dans une usine de vêtements"}
                style={{ width:"100%", height:"170px", objectFit:"cover", display:"block", marginBottom:"1rem" }} />
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"1.4rem", color:C.ink, marginBottom:"0.4rem" }}>{t.fashH}</h3>
              <p style={{ fontSize:"0.88rem", lineHeight:1.7, color:C.muted }}>{t.fashP}</p>
            </button>
            <div style={{ background:"#c24a10", padding:"1.75rem 1.9rem", display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"1.5rem", lineHeight:1.28, color:"#fff", marginBottom:"0.8rem" }}>
                {lang==="en" ? "We will tell you no when the search makes no sense." : "On va te dire non quand le mandat n'a pas de bon sens."}
              </p>
              <p style={{ fontSize:"0.88rem", lineHeight:1.7, color:"#fff" }}>
                {lang==="en" ? "It costs us searches. It saves you three months." : "Ça nous coûte des mandats. Ça t'évite trois mois perdus."}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── LOGOS CLIENTS ── ne s'affiche que si on a des permissions ── */}
      {CLIENTS.length > 0 && (
        <section style={{ background:C.paper, padding:"6rem 2rem" }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
            <Eyebrow>{lang==="en"?"Clients":"Clients"}</Eyebrow>
            <h2 style={{
              fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3.4vw,2.6rem)",
              letterSpacing:"-0.015em", color:C.ink, lineHeight:1.15, margin:"1.25rem 0 0.9rem", maxWidth:"620px",
            }}>{t.cliH}</h2>
            <p style={{ color:C.muted, fontSize:"0.95rem", lineHeight:1.7, maxWidth:"520px", marginBottom:"3.5rem" }}>{t.cliP}</p>

            {/* Les filets sont dessines par chaque case, pas par le fond de la
                grille: sinon la derniere rangee incomplete laisse du gris. */}
            <div className="client-grid" style={{
              display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:0,
            }}>
              {CLIENTS.map(c => (
                <div key={c.nom} style={{
                  background:C.white, display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"2.25rem 1.5rem", minHeight:"130px",
                  boxShadow:`0 0 0 1px ${C.rule}`,
                }}>
                  <img src={c.logo} alt={c.nom} loading="lazy"
                    style={{ maxWidth:"100%", maxHeight:"46px", width:"auto", height:"auto", display:"block" }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY ── */}
      <section style={{ background:C.paper, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Why Proforce":"Pourquoi Proforce"}</Eyebrow>
          <Divider style={{ marginBottom:"4rem" }} />
          <div className="three-col num-list" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"3rem" }}>
            {[[t.w1h,t.w1p,"01"],[t.w2h,t.w2p,"02"],[t.w3h,t.w3p,"03"]].map(([h,p,n]) => (
              <div key={n}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.04em", color:C.orange, marginBottom:"1.5rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", letterSpacing:"-0.02em", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
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
            <button onClick={() => setPage("team")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
              {lang==="en"?"Meet everyone →":"Voir l'équipe →"}
            </button>
          </div>
          <Divider style={{ marginBottom:"2.5rem" }} />
          <div className="team-strip" style={{ display:"flex", gap:"0", flexWrap:"wrap" }}>
            {TEAM.map((m,i) => (
              <div key={m.name} style={{
                flex:"1 1 180px", padding:"1.5rem",
                borderRight: i<TEAM.length-1 ? `1px solid ${C.rule}` : "none",
              }}>
                <Avatar m={m} size={56} className="av" style={{ marginBottom:"1rem" }} />
                <div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", fontWeight:600, color:C.ink, marginBottom:"0.2rem" }}>{m.name}</div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em", color:C.muted }}>{m.title[lang]}</div>
                </div>
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
            <button onClick={() => setPage("featured")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
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
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.orange, letterSpacing:"0.1em", width:"28px" }}>0{i+1}</span>
              <div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", color:"#fff", letterSpacing:"-0.01em" }}>{c.title[lang]}</span>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:"rgba(255,255,255,0.35)", marginLeft:"1rem", letterSpacing:"0.06em" }}>{c.tag[lang]}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em" }}>{c.market[lang]}</div>
                {c.avail.en==="Actively looking" && (
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", color:C.orange, letterSpacing:"0.06em", marginTop:"3px" }}>{lang==="en"?"Active":"Actif"}</div>
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
            <button onClick={() => setPage("blog")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
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
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.1em", color:C.orange }}>0{i+1}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", color:C.ink, fontWeight:400 }}>{p.title[lang]}</span>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.muted, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{p.date}</span>
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
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.7rem,3.4vw,2.6rem)", color:"#fff", letterSpacing:"-0.015em", lineHeight:0.95, marginBottom:"1rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", lineHeight:1.7, maxWidth:"420px" }}>{t.ctaP}</p>
          </div>
          <button onClick={() => setPage("contact")} style={{
            background:"#fff", color:C.orange, padding:"14px 32px",
            fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.82rem",
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
      <section style={{
        position:"relative", background:C.ink, minHeight:"32vh",
        display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem",
        backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.93), rgba(13,37,69,0.74)), url(${sector === "food" ? "/photos/usine-vue-ensemble.jpg" : "/secteurs/mode-hero.jpg"})`,
        backgroundSize:"cover", backgroundPosition:"center",
      }}>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:C.paper, lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:C.orange, lineHeight:1.05, marginBottom:"3rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:"rgba(255,255,255,0.72)", fontSize:"1rem", lineHeight:1.75, maxWidth:"520px", marginBottom:"2rem" }}>{t.sub}</p>
          <button className="btn-ink" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>

      {sector === "food" ? (
        <PhotoBand items={[
          ["/photos/ligne-charcuterie.jpg", 2, 1600, 900,
           lang==="en" ? "Slicer laying bacon into trays on a packaging line" : "Trancheuse qui dépose du bacon dans des barquettes sur une ligne d'emballage"],
          ["/photos/fromagerie-cuve.jpg", 1, 1400, 700,
           lang==="en" ? "Two cheesemakers lifting curd from a copper vat" : "Deux fromagers qui sortent le caillé d'une cuve de cuivre"],
          ["/photos/ligne-yogourt.jpg", 1, 1600, 900,
           lang==="en" ? "Nozzles filling yogurt cups on a dairy line" : "Buses qui remplissent des pots de yogourt sur une ligne laitière"],
        ]} />
      ) : (
        <PhotoBand items={[
          ["/photos/atelier-couture.jpg", 2, 1400, 700,
           lang==="en" ? "Designer pinning a garment on a dress form" : "Designer qui épingle un vêtement sur un mannequin"],
          ["/photos/atelier-patrons.jpg", 1, 900, 900,
           lang==="en" ? "Pattern room, dress form and rolls of fabric" : "Salle de patrons, mannequin et rouleaux de tissu"],
        ]} />
      )}

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Roles We Fill":"Postes qu'on comble"}</Eyebrow>
          <Divider style={{ marginBottom:"3rem" }} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"0", border:`1px solid ${C.rule}` }}>
            {t.roles.map((r,i) => (
              <div key={r} style={{ padding:"1rem 1.5rem", borderRight: (i+1)%4!==0?`1px solid ${C.rule}`:"none", borderBottom:`1px solid ${C.rule}`, fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", color:C.ink, display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ color:C.orange, fontSize:"0.7rem" }}>▸</span>{r}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bande photo pleine largeur entre les postes et les trois arguments */}
      {sector === "food" && (
        <section className="band-full" style={{ background:C.ink, overflow:"hidden" }}>
          <div style={{ width:"100%", height:"clamp(200px,28vw,360px)", position:"relative" }}>
            <Photo
              src="/photos/ligne-fromage.jpg" w={1600} h={900}
              alt={lang==="en"
                ? "Automated slicer fanning cheese slices onto a belt"
                : "Trancheuse automatisée qui étale des tranches de fromage sur une courroie"}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(13,37,69,0.72) 0%, rgba(13,37,69,0.05) 60%)" }} />
          </div>
        </section>
      )}

      <section style={{ background:C.paper, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <div className="three-col num-list" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0", border:`1px solid ${C.rule}` }}>
            {[[t.w1h,t.w1p,"01"],[t.w2h,t.w2p,"02"],[t.w3h,t.w3p,"03"]].map(([h,p,n],i) => (
              <div key={n} style={{ padding:"2.5rem 2rem", borderRight: i<2?`1px solid ${C.rule}`:"none" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.04em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", letterSpacing:"-0.01em", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection lang={lang} type={sector} setPage={setPage} />

      <section style={{ background:C.orange, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,4vw,3rem)", color:"#fff", letterSpacing:"-0.015em", maxWidth:"580px", lineHeight:1.05 }}>{t.ctaH}</h2>
          <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"13px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0 }}>{t.cta}</button>
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
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,3.5vw,2.5rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>
          {lang==="en"?"Common questions." : "Questions fréquentes."}
        </h2>
        <Divider style={{ marginBottom:"0" }} />
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom:`1px solid ${C.rule}` }}>
            <button onClick={() => setOpen(open===i ? null : i)} style={{
              width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"1.5rem 0", textAlign:"left", gap:"1.5rem",
            }}>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1rem", color:C.ink, letterSpacing:"-0.01em", lineHeight:1.3 }}>{faq.q}</span>
              <span style={{ color:C.orange, fontSize:"1.2rem", flexShrink:0, fontWeight:300, lineHeight:1, transition:"transform 0.2s", transform: open===i?"rotate(45deg)":"rotate(0deg)" }}>+</span>
            </button>
            {open===i && (
              <div style={{ paddingBottom:"1.5rem" }}>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop:"3rem" }}>
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", color:C.muted, marginBottom:"1rem" }}>
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
// ─── LOGOS CLIENTS ────────────────────────────────────────────────────────────
// Vide par defaut: la section ne s'affiche pas tant qu'il n'y a aucun logo.
// Pour en ajouter un, deposer le fichier dans public/clients/ et ajouter une
// ligne ici. N'ajouter un client QUE si on a sa permission ecrite: afficher un
// logo sous "ils nous ont fait confiance" sous entend une recommandation.
//   { nom:"Nom de l'entreprise", logo:"/clients/nom-entreprise.svg" },
const CLIENTS = [];

const FEATURED = [
  {
    id: "fc-01",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"Quality Assurance Director", fr:"Directeur assurance qualité" },
    tag: { en:"Food Manufacturing", fr:"Fabrication alimentaire" },
    market: { en:"Ontario", fr:"Ontario" },
    exp: { en:"15 to 20 years", fr:"15 à 20 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["SQF Practitioner, HACCP and FSMA certified","Has run QA programs across multiple sites","Has built and led QA teams","Fluent in English and French"],
      fr:["Praticien SQF, certifié HACCP et FSMA","A dirigé des programmes QA sur plusieurs sites","A bâti et dirigé des équipes QA","Bilingue anglais et français"],
    },
    summary: {
      en:"Senior QA leader in food manufacturing. Has overseen CFIA audits, led plant certifications, and built QA teams from the ground up. Currently employed and open to the right Director or VP level role in Ontario or Quebec.",
      fr:"Leader QA senior en fabrication alimentaire. A supervisé des audits ACIA, dirigé des certifications d'usine et bâti des équipes QA de zéro. Actuellement en poste et ouvert au bon rôle de niveau Directeur ou VP en Ontario ou au Québec.",
    },
    recruiter: "Michaela Landers",
  },
  {
    id: "fc-02",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"Plant Manager", fr:"Directeur d'usine" },
    tag: { en:"Protein / Meat Processing", fr:"Protéines / Transformation des viandes" },
    market: { en:"Quebec", fr:"Québec" },
    exp: { en:"20+ years", fr:"Plus de 20 ans" },
    avail: { en:"Available now", fr:"Disponible maintenant" },
    highlights: {
      en:["Has managed large scale processing facilities","Full P&L responsibility","HACCP, SQF Level 3 and FSEP certified","Strong track record in union environments"],
      fr:["A géré des installations de transformation à grande échelle","Pleine responsabilité P&L","Certifié HACCP, SQF Niveau 3 et FSEP","Solide expérience en milieu syndiqué"],
    },
    summary: {
      en:"Seasoned plant manager who has run large scale protein processing in Quebec. Deep operational expertise, a strong safety culture, and a consistent record of hitting production targets. Available now.",
      fr:"Directeur d'usine chevronné qui a mené de la transformation de protéines à grande échelle au Québec. Expertise opérationnelle profonde, culture de sécurité forte et un bilan constant d'atteinte des objectifs de production. Disponible maintenant.",
    },
    recruiter: "Stéphanie Lanoie",
  },
  {
    id: "fc-03",
    sector: { en:"Fashion & Apparel", fr:"Mode & Habillement" },
    title: { en:"Senior Buyer", fr:"Acheteur principal" },
    tag: { en:"Women's Ready-to-Wear", fr:"Prêt-à-porter femme" },
    market: { en:"Quebec", fr:"Québec" },
    exp: { en:"10 to 15 years", fr:"10 à 15 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["Has owned open-to-buy budgets","Strong vendor relationships in Europe and Asia","Experience with both mass market and contemporary brands","Bilingual, knows the French speaking market"],
      fr:["A géré des budgets open-to-buy","Solides relations fournisseurs en Europe et en Asie","Expérience avec des marques grand public et contemporaines","Bilingue, connaît le marché francophone"],
    },
    summary: {
      en:"A sharp, well connected buyer in women's ready-to-wear. Has worked both sides of the market, national retail and independent brands. Strong negotiator with good trend instinct and a deep network in Canadian fashion.",
      fr:"Un acheteur aiguisé et bien connecté dans le prêt-à-porter femme. A travaillé des deux côtés du marché, détail national et marques indépendantes. Bon négociateur, bon instinct pour les tendances et un réseau profond dans la mode canadienne.",
    },
    recruiter: "Robin Anisef",
  },
  {
    id: "fc-04",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"Supply Chain Director", fr:"Directeur chaîne d'approvisionnement" },
    tag: { en:"CPG / Distribution", fr:"CPG / Distribution" },
    market: { en:"Ontario", fr:"Ontario" },
    exp: { en:"15 to 20 years", fr:"15 à 20 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["Has led end to end supply chain for a national CPG operation","SAP and Oracle ERP implementation experience","Track record of cutting logistics costs","Cross border Canada and US supply chain expertise"],
      fr:["A dirigé la chaîne d'approvisionnement de bout en bout pour une opération CPG nationale","Expérience d'implantation SAP et Oracle ERP","Bilan de réduction des coûts logistiques","Expertise en chaîne d'approvisionnement transfrontalière Canada et É.-U."],
    },
    summary: {
      en:"A strategic supply chain leader who has built and optimized distribution networks for CPG brands in Ontario. Combines strong analytics with hands on operational experience. Currently in role and open to VP level opportunities.",
      fr:"Un leader stratégique en chaîne d'approvisionnement qui a bâti et optimisé des réseaux de distribution pour des marques CPG en Ontario. Combine de solides compétences analytiques et une expérience opérationnelle concrète. Actuellement en poste et ouvert à des opportunités de niveau VP.",
    },
    recruiter: "Rana Yamak",
  },
  {
    id: "fc-05",
    sector: { en:"Food & CPG", fr:"Alimentaire & CPG" },
    title: { en:"VP Sales, Food Service", fr:"VP Ventes, Service alimentaire" },
    tag: { en:"Food Service / HRI", fr:"Service alimentaire / HRI" },
    market: { en:"Canada-wide", fr:"Partout au Canada" },
    exp: { en:"20+ years", fr:"Plus de 20 ans" },
    avail: { en:"Open to opportunities", fr:"Ouvert aux opportunités" },
    highlights: {
      en:["Has built national food service sales teams from scratch","Has carried national revenue responsibility","Works with GPOs, distributors and regional chains","Bilingual, coast to coast market experience"],
      fr:["A bâti des équipes de ventes nationales en service alimentaire de zéro","A porté une responsabilité de revenus nationale","Travaille avec les GPO, distributeurs et chaînes régionales","Bilingue, expérience du marché d'un océan à l'autre"],
    },
    summary: {
      en:"A well connected food service sales executive. Has built teams, grown accounts and navigated the GPO landscape for two decades. Understands both the operator and the distributor side. Open to a national VP or commercial leadership role.",
      fr:"Un dirigeant des ventes en service alimentaire très bien connecté. A bâti des équipes, développé des comptes et navigué dans l'écosystème des GPO depuis deux décennies. Comprend autant le côté opérateur que le côté distributeur. Ouvert à un rôle de VP national ou de direction commerciale.",
    },
    recruiter: "Simon St-Amand",
  },
  {
    id: "fc-06",
    sector: { en:"Fashion & Apparel", fr:"Mode & Habillement" },
    title: { en:"Brand Manager", fr:"Gestionnaire de marque" },
    tag: { en:"Contemporary / Lifestyle", fr:"Contemporain / Lifestyle" },
    market: { en:"Ontario / Quebec", fr:"Ontario / Québec" },
    exp: { en:"5 to 10 years", fr:"5 à 10 ans" },
    avail: { en:"Available now", fr:"Disponible maintenant" },
    highlights: {
      en:["Has built and run brand strategies for mid market and contemporary labels","Experience across wholesale, DTC and e-commerce","Strong social and digital marketing background","Bilingual, creative, works from the numbers"],
      fr:["A bâti et mené des stratégies de marque pour des étiquettes de marché intermédiaire et contemporaines","Expérience en vente en gros, DTC et commerce en ligne","Solide bagage en marketing social et numérique","Bilingue, créatif, travaille avec les chiffres"],
    },
    summary: {
      en:"A brand manager who blends creative instinct with commercial discipline. Has grown brands in both wholesale and DTC, with a good grasp of digital marketing and influencer strategy. Available now and looking for a Senior Manager or Director level role in Canadian fashion.",
      fr:"Un gestionnaire de marque qui allie l'instinct créatif à la discipline commerciale. A développé des marques en vente en gros et en DTC, avec une bonne maîtrise du marketing numérique et de la stratégie d'influence. Disponible maintenant et cherche un rôle de Gestionnaire principal ou Directeur dans la mode canadienne.",
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
        <section style={{ background:C.ink, padding:"9rem 2rem 3.5rem" }}>
          <div style={{ maxWidth:"780px", margin:"0 auto" }}>
            <button onClick={() => setActive(null)} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.4)", marginBottom:"3rem", display:"flex", alignItems:"center", gap:"8px" }}>
              {t.back}
            </button>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange }}>{c.sector[lang]}</span>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:"rgba(255,255,255,0.3)" }}>·</span>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.4)" }}>{c.tag[lang]}</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.5rem,6vw,5rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{c.title[lang]}</h1>
            <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap", marginTop:"2rem" }}>
              {[[t.exp, c.exp[lang]], [t.market, c.market[lang]], [t.avail, c.avail[lang]], [t.recruiter, c.recruiter]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)", marginBottom:"3px" }}>{label}</div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", color: label===t.avail && c.avail.en==="Actively looking" ? C.orange : "#fff", fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background:C.white, padding:"5rem 2rem" }}>
          <div style={{ maxWidth:"780px", margin:"0 auto" }}>
            <Divider style={{ marginBottom:"3rem" }} />

            <h2 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"1.25rem" }}>{t.fullBio}</h2>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", lineHeight:1.85, color:C.muted, fontWeight:300, marginBottom:"3rem" }}>{c.summary[lang]}</p>

            <h2 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"1.25rem" }}>{t.highlights}</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              {c.highlights[lang].map((h, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"1rem", padding:"0.85rem 0", borderBottom:`1px solid ${C.rule}` }}>
                  <span style={{ color:C.orange, fontSize:"0.7rem", marginTop:"2px", flexShrink:0 }}>▸</span>
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.ink, lineHeight:1.6 }}>{h}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop:"3.5rem", padding:"2.5rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
              <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.muted, lineHeight:1.7, marginBottom:"1.5rem" }}>
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
      <section style={{ background:C.ink, minHeight:"33vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/talents.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2rem,5vw,3.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.8rem,4vw,4.5rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:"rgba(255,255,255,0.6)", fontSize:"1rem", lineHeight:1.75, maxWidth:"520px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          {/* Filters */}
          <div style={{ display:"flex", gap:"2rem", marginBottom:"3rem", flexWrap:"wrap" }}>
            {filters.map(([val, label]) => (
              <button key={val} onClick={() => setActiveFilter(val)} style={{
                fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em",
                color: activeFilter===val ? C.orange : C.muted,
                borderBottom: activeFilter===val ? `1px solid ${C.orange}` : "1px solid transparent",
                paddingBottom:"2px", transition:"color 0.2s",
              }}>{label}</button>
            ))}
          </div>

          <Divider style={{ marginBottom:"2rem" }} />
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.1em", color:C.muted, marginBottom:"3rem" }}>
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
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange }}>{c.sector[lang]}</span>
                  {c.avail.en === "Actively looking" && (
                    <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, border:`1px solid ${C.orange}`, padding:"2px 8px" }}>
                      {lang==="en"?"Active":"Actif"}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.25rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.4rem" }}>{c.title[lang]}</h3>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.muted, letterSpacing:"0.06em", marginBottom:"1.25rem" }}>{c.tag[lang]}</div>

                {/* Meta row */}
                <div style={{ display:"flex", gap:"1.5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
                  {[[t.exp, c.exp[lang]], [t.market, c.market[lang]]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.02em", color:C.muted, marginBottom:"2px" }}>{label}</div>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.82rem", color:C.ink, fontWeight:500 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Top highlights */}
                <div style={{ marginBottom:"1.5rem" }}>
                  {c.highlights[lang].slice(0,2).map((h,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", marginBottom:"0.4rem" }}>
                      <span style={{ color:C.orange, fontSize:"0.65rem", marginTop:"2px", flexShrink:0 }}>▸</span>
                      <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.82rem", color:C.muted, lineHeight:1.5 }}>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginTop:"auto" }}>
                  {lang==="en"?"View profile →":"Voir le profil →"}
                </div>
              </button>
            ))}
          </div>

          {/* Note */}
          <div style={{ marginTop:"4rem", padding:"2.5rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
            <p style={{ fontFamily:"'Archivo',sans-serif", color:C.muted, fontSize:"0.9rem", lineHeight:1.7, marginBottom:"1.25rem" }}>{t.note}</p>
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
      <section style={{ background:C.ink, minHeight:"34vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/a-propos.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:C.paper, lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"3rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1.05rem", lineHeight:1.8, maxWidth:"600px" }}>{t.story}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"What We Stand For":"Ce qu'on défend"}</Eyebrow>
          <Divider style={{ marginBottom:"4rem" }} />
          <div className="three-col num-list" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0", border:`1px solid ${C.rule}` }}>
            {[[t.v1h,t.v1p,"01"],[t.v2h,t.v2p,"02"],[t.v3h,t.v3p,"03"]].map(([h,p,n],i) => (
              <div key={n} style={{ padding:"2.5rem 2rem", borderRight: i<2?`1px solid ${C.rule}`:"none" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.04em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop:"4rem", padding:"3rem", background:C.paper, borderLeft:`3px solid ${C.orange}` }}>
            <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"0.75rem" }}>{t.guarH}</h3>
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{lang==="en"?"Our Team":"Notre équipe"}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:600, fontSize:"clamp(2.1rem,5vw,3.8rem)", letterSpacing:"-0.012em", color:C.paper, lineHeight:1.15, marginBottom:"1.5rem" }}>
            {lang==="en"?"Seven specialists." : "Sept spécialistes."}
          </h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.4rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, lineHeight:0.95 }}>
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
                <div className="team-identity">
                  <div className="team-photo" style={{ marginBottom:"1.5rem", maxWidth:"280px" }}>
                    <Avatar m={m} full />
                  </div>
                  <div style={{ marginBottom:"1.5rem" }}>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.15rem", color:C.ink, fontWeight:600 }}>{m.name}</div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em", color:C.orange, marginTop:"4px" }}>{m.title[lang]}</div>
                  </div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em", color:C.muted, marginBottom:"1.25rem" }}>{m.sector[lang]}</div>
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{
                    display:"inline-flex", alignItems:"center", gap:"6px",
                    fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase",
                    color:C.ink, borderBottom:`1px solid ${C.rule}`, paddingBottom:"2px", transition:"color 0.2s, border-color 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color=C.orange; e.currentTarget.style.borderColor=C.orange; }}
                    onMouseLeave={e => { e.currentTarget.style.color=C.ink; e.currentTarget.style.borderColor=C.rule; }}
                  ><LinkedInIcon /> LinkedIn</a>
                  {Object.entries(MEMBERS).find(([,v]) => v.name === m.name) && (
                    <button
                      onClick={() => setPage(Object.entries(MEMBERS).find(([,v]) => v.name === m.name)[0])}
                      style={{
                        display:"block", marginTop:"0.9rem",
                        fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em",
                        textTransform:"uppercase", color:C.orange, borderBottom:`1px solid ${C.orange}`, paddingBottom:"2px",
                      }}
                    >{lang==="en" ? "Full profile" : "Sa page"}</button>
                  )}
                </div>

                {/* Right: bio + articles */}
                <div>
                  {/* Les fiches peuvent contenir plusieurs paragraphes, separes
                      par une ligne vide dans le texte. */}
                  {m.bio[lang].split("\n\n").map((para,bi,arr) => (
                    <p key={bi} style={{ color:C.muted, fontSize:"0.95rem", lineHeight:1.8,
                      marginBottom: bi < arr.length-1 ? "1.25rem" : (m.articles.length ? "2rem" : "0") }}>{para}</p>
                  ))}
                  {m.articles.length > 0 && (
                    <div>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.75rem" }}>
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
                            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.orange, flexShrink:0 }}>0{j+1}</span>
                            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.ink }}>{post.title[lang]}</span>
                            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.muted, marginLeft:"auto", flexShrink:0 }}>{post.date}</span>
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

      {/* L'histoire de la firme, retiree du menu principal */}
      <section style={{ background:C.paperDark, padding:"4.5rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem" }}>
          <div style={{ maxWidth:"540px" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.3rem,2.6vw,1.8rem)", color:C.ink, letterSpacing:"-0.02em", marginBottom:"0.6rem" }}>{lang==="en" ? "Proforce has been doing this since 2001." : "Proforce fait ça depuis 2001."}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.75 }}>{lang==="en" ? "Seven people is what the firm looks like today. If you want the rest of the story, how it started and what changed along the way, it is on the about page." : "Sept personnes, c'est ce que la firme est aujourd'hui. Si tu veux le reste de l'histoire, comment ça a commencé et ce qui a changé en chemin, c'est sur la page À propos."}</p>
          </div>
          <button className="btn-ink" onClick={() => setPage("about")} style={{ flexShrink:0 }}>{lang==="en" ? "About Proforce" : "À propos de Proforce"}</button>
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
      <section style={{ background:C.ink, minHeight:"34vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/appel-candidat.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative", }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2rem,5vw,3.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:C.paper, lineHeight:1.05, marginBottom:"0.5rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"3rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"500px" }}>{t.sub}</p>
        </div>
      </section>

      <PhotoBand items={[
        ["/photos/emballage-sourire.jpg", 2, 1600, 900,
         lang==="en" ? "Worker packing trays at the end of a meat packaging line" : "Employé qui emboîte des barquettes au bout d'une ligne d'emballage"],
        ["/photos/chocolat-mains.jpg", 1, 900, 900,
         lang==="en" ? "Worker checking coated chocolate at a panning drum" : "Employée qui vérifie des dragées de chocolat à la sortie de la turbine"],
        ["/photos/boulangerie-fournee.jpg", 1, 900, 900,
         lang==="en" ? "Braided loaves coming out of a bakery oven" : "Pains tressés qui sortent d'un four de boulangerie"],
      ]} />

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <div className="three-col num-list" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0", border:`1px solid ${C.rule}`, marginBottom:"4rem" }}>
            {[[t.h1h,t.h1p,"01"],[t.h2h,t.h2p,"02"],[t.h3h,t.h3p,"03"]].map(([h,p,n],i) => (
              <div key={n} style={{ padding:"2.5rem 2rem", borderRight: i<2?`1px solid ${C.rule}`:"none" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.04em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.75rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>

          <div style={{ background:C.paper, padding:"3rem", borderLeft:`3px solid ${C.orange}` }}>
            <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.5rem", color:C.ink, marginBottom:"0.75rem" }}>{t.submitH}</h3>
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/usine-discussion.webp)`, backgroundSize:"cover", backgroundPosition:"center" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>proforce.ca</span>
          </div>
        </div>
        <div style={{ maxWidth:"900px" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.75, maxWidth:"560px", marginBottom:"2.5rem" }}>{t.sub}</p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
            <button style={{ display:"inline-block", border:"1.5px solid rgba(255,255,255,0.3)", color:"#fff", padding:"11px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:600, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", transition:"border-color 0.2s", cursor:"pointer", background:"transparent" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"}
              onClick={() => setPage("food")}
            >{t.cta2}</button>
          </div>
        </div>
      </section>

      <PhotoBand items={[
        ["/photos/supervision-ligne.jpg", 2, 1600, 900,
         lang==="en" ? "Two supervisors reviewing a clipboard beside a bottling line" : "Deux superviseurs qui regardent un presse-papiers à côté d'une ligne d'embouteillage"],
        ["/photos/pesee-etiquetage.jpg", 1, 1600, 900,
         lang==="en" ? "Worker at a weighing and labelling station" : "Employé à un poste de pesée et d'étiquetage"],
        ["/photos/robot-emballage.jpg", 1, 1600, 900,
         lang==="en" ? "Pick and place robot over a sausage packaging line" : "Robot d'emballage au-dessus d'une ligne de saucisses"],
      ]} />

      {/* Process */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{t.processLabel}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.processH}</h2>
          <Divider style={{ marginBottom:"0" }} />
          {t.steps.map((step, i) => (
            <div key={step.n} style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:"2rem", padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"2.5rem", fontWeight:700, color:C.orange, letterSpacing:"-0.015em", lineHeight:1 }}>{step.n}</div>
              <div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.2rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{step.h[lang]}</h3>
                <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8 }}>{step.p[lang]}</p>
              </div>
            </div>
          ))}
          <div className="pt-desk" style={{ paddingTop:"2rem" }}>
            <button onClick={() => setPage("howwework")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, borderBottom:`1px solid ${C.orange}`, paddingBottom:"2px" }}>
              {t.processLink}
            </button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Why Proforce":"Pourquoi Proforce"}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.whyH}</h2>
          <div className="num-list" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"0", border:`1px solid ${C.rule}` }}>
            {[[t.w1h,t.w1p,"01"],[t.w2h,t.w2p,"02"],[t.w3h,t.w3p,"03"],[t.w4h,t.w4p,"04"]].map(([h,p,n],i) => (
              <div key={n} style={{
                padding:"2.5rem 2rem",
                borderRight: i%2===0 ? `1px solid ${C.rule}` : "none",
                borderBottom: i<2 ? `1px solid ${C.rule}` : "none",
                background:C.white,
              }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.04em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
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
            <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"0.75rem" }}>{t.guarH}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.8 }}>{t.guarP}</p>
          </div>
          <div style={{ background:C.white, padding:"3rem 2.5rem" }}>
            <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.5rem" }} />
            <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"0.75rem" }}>{t.feeH}</h3>
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
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", color:C.orange, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{s.h}</h3>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.86rem", lineHeight:1.7, marginBottom:"1.25rem" }}>{s.p}</p>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.4)" }}>
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
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.7rem,3.2vw,2.5rem)", color:"#fff", letterSpacing:"-0.015em", lineHeight:1, marginBottom:"0.75rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", maxWidth:"400px", lineHeight:1.7 }}>{t.ctaP}</p>
          </div>
          <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"14px 32px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >{t.cta}</button>
        </div>
      </section>

      {/* Candidats vedettes, retires du menu et ramenes la ou ils servent */}
      <section style={{ background:C.paperDark, padding:"4.5rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem" }}>
          <div style={{ maxWidth:"540px" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.3rem,2.6vw,1.8rem)", color:C.ink, letterSpacing:"-0.02em", marginBottom:"0.6rem" }}>{lang==="en" ? "People we are talking to right now." : "Du monde à qui on parle en ce moment."}</h3>
            <p style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.75 }}>{lang==="en" ? "Anonymous profiles of real candidates we know personally. If one of them looks like the person you need, tell us and we will make the introduction." : "Des profils anonymisés de vrais candidats qu'on connaît personnellement. Si un d'eux ressemble à la personne qu'il te faut, dis-le nous et on fait l'introduction."}</p>
          </div>
          <button className="btn-ink" onClick={() => setPage("featured")} style={{ flexShrink:0 }}>{lang==="en" ? "See the profiles" : "Voir les profils"}</button>
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/emplois.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.015em", color:C.paper, lineHeight:0.92 }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2rem" }}>{t.h1i}</h2>
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
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:C.ink, letterSpacing:"-0.01em" }}>{r.title}</div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.06em", color:C.muted, marginTop:"4px" }}>{r.co} · {r.loc}</div>
              </div>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange, border:`1px solid ${C.orange}`, padding:"4px 10px" }}>Permanent</span>
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/dons.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.015em", color:C.paper, lineHeight:0.92 }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2rem" }}>{t.h1i}</h2>
          <p className="fu3" style={{ color:C.muted, fontSize:"1rem", lineHeight:1.75, maxWidth:"480px" }}>{t.sub}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />
          {CHARITIES.map(c => (
            <div key={c.name} style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"3rem", padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }} className="two-col">
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1rem", color:C.ink, fontWeight:600, paddingTop:"2px" }}>{c.name}</div>
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
    if (!validEmail(email)) return;
    setStatus("sending");
    try {
      const r = await sendForm(EMAILJS.newsletterTemplate, {
        subscriber_email: email,
        preferred_lang: prefLang === "fr" ? "Français" : "English",
        source: "proforce.ca blog",
      }, {
        subject: "Inscription à l'infolettre",
        body: `Courriel: ${email}\nLangue: ${prefLang === "fr" ? "Français" : "English"}\nSource: blogue`,
      });
      setStatus(r === "mail" ? "mail" : "done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done" || status === "mail") {
    return (
      <div style={{ padding: compact ? "1.5rem" : "2.5rem", background: C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
        <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1rem" }} />
        <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink }}>{t.done}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: compact ? "1.5rem 2rem" : "3rem", background: C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
      <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
      <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize: compact ? "1rem" : "1.3rem", color:C.ink, letterSpacing:"-0.01em", marginBottom: t.p ? "0.6rem" : "1.25rem" }}>{t.h}</h3>
      {t.p && <p style={{ fontFamily:"'Archivo',sans-serif", color:C.muted, fontSize:"0.88rem", lineHeight:1.7, marginBottom:"1.5rem", maxWidth:"420px" }}>{t.p}</p>}

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
            fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.ink,
            outline:"none", transition:"border-color 0.2s", minWidth:"180px",
          }}
          onFocus={e => e.target.style.borderColor=C.orange}
          onBlur={e => e.target.style.borderColor=C.rule}
        />

        {!compact && (
          <select value={prefLang} onChange={e => setPrefLang(e.target.value)} style={{
            padding:"10px 8px", background:"transparent",
            border:"none", borderBottom:`1px solid ${C.rule}`,
            fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem",
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
        <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", color:"#c0392b", marginTop:"0.75rem", letterSpacing:"0.06em" }}>{t.error}</p>
      )}
    </div>
  );
}
// Chaque article a son image, nommee comme son identifiant.
const postCover = id => `/photos/blogue/${id}.jpg`;

function BlogPage({ lang, setPage, initialPost, onOpenPost }) {
  const [activePost, setActivePost] = useState(initialPost || null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const openPost = (id) => {
    if (onOpenPost) onOpenPost(id);
    else setActivePost(id);
  };

  const cats = {
    en:[["all","All"],["Hiring","Hiring"],["Career","Career"],["Market","Market"],["Fashion","Fashion"]],
    fr:[["all","Tout"],["Embauche","Embauche"],["Carrière","Carrière"],["Marché","Marché"],["Mode","Mode"]],
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
        <section style={{ background:C.paper, padding:"9rem 2rem 3.5rem" }}>
          <div style={{ maxWidth:"720px", margin:"0 auto" }}>
            <button onClick={() => setActivePost(null)} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.muted, marginBottom:"3rem", display:"flex", alignItems:"center", gap:"8px" }}>
              ← {lang==="en"?"Back":"Retour"}
            </button>
            <div style={{ display:"flex", gap:"1.5rem", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange }}>{post.cat[lang]}</span>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.muted }}>{post.date} · {post.read[lang]}</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.7rem,3.2vw,2.5rem)", letterSpacing:"-0.015em", color:C.ink, lineHeight:1.05, marginBottom:"2.5rem" }}>{post.title[lang]}</h1>
            {post.recruiter && (() => { const a = TEAM.find(t => t.name === post.recruiter); return a ? (
              <div style={{ display:"flex", alignItems:"center", gap:"0.85rem", marginTop:"-1rem", marginBottom:"2.5rem" }}>
                <Avatar m={a} size={44} />
                <div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", fontWeight:600, color:C.ink }}>{a.name}</div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.muted }}>{a.title[lang]}</div>
                </div>
              </div>
            ) : null; })()}
          </div>
        </section>

        {/* Image d'en tete, plus large que la colonne de texte */}
        <section style={{ background:C.paper, padding:"0 2rem" }}>
          <div style={{ maxWidth:"940px", margin:"0 auto" }}>
            <div style={{ width:"100%", aspectRatio:"16 / 9", overflow:"hidden", background:C.ink }}>
              <Photo src={postCover(post.id)} w={1600} h={873} eager
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
          </div>
        </section>

        <section style={{ background:C.white, padding:"4rem 2rem 6rem" }}>
          <div style={{ maxWidth:"680px", margin:"0 auto" }}>
            <Divider style={{ marginBottom:"3rem" }} />
            {post.body[lang].split("\n\n").map((para,i) => (
              <p key={i} style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", lineHeight:1.9, color:C.inkLight, marginBottom:"1.75rem", fontWeight:300 }}>{para}</p>
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/blogue-index.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{lang==="en"?"Proforce Blog":"Blogue Proforce"}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:C.paper, lineHeight:1.05, marginBottom:"1rem" }}>
            {lang==="en"?"Straight talk." : "Du vrai parler."}
          </h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2rem" }}>
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
                  fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em",
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
                  fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem",
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
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:C.muted, fontStyle:"italic" }}>
                {lang==="en" ? `No articles found for "${query}".` : `Aucun article trouvé pour « ${query} ».`}
              </p>
              <button onClick={() => { setQuery(""); setFilter("all"); }} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, marginTop:"1rem", borderBottom:`1px solid ${C.orange}` }}>
                {lang==="en" ? "Clear search" : "Effacer la recherche"}
              </button>
            </div>
          )}

          <Divider style={{ marginBottom:"0" }} />
          {filtered.map((post,i) => {
            // Le premier article est traite en vedette, grande image au dessus
            // du titre. Les suivants gardent la ligne compacte avec une vignette.
            const open = () => { openPost(post.id); window.scrollTo({top:0,behavior:"smooth"}); };
            const meta = (
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.muted, letterSpacing:"0.06em" }}>{post.date}</div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.muted, marginTop:"4px" }}>{post.read[lang]}</div>
              </div>
            );
            if (i === 0) {
              return (
                <div key={post.id}>
                  <button onClick={open} style={{ width:"100%", textAlign:"left", padding:"0 0 2.75rem", transition:"opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity="0.78"}
                    onMouseLeave={e => e.currentTarget.style.opacity="1"}
                  >
                    <div style={{ width:"100%", aspectRatio:"16 / 7", overflow:"hidden", background:C.ink, marginBottom:"1.75rem" }}>
                      <Photo src={postCover(post.id)} w={1600} h={873}
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    </div>
                    <div style={{ display:"flex", gap:"1.25rem", alignItems:"center", flexWrap:"wrap", marginBottom:"0.9rem" }}>
                      <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.orange, letterSpacing:"0.02em" }}>{post.cat[lang]}</span>
                      <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.muted, letterSpacing:"0.06em" }}>{post.date} · {post.read[lang]}</span>
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.5rem,3.4vw,2.2rem)", color:C.ink, letterSpacing:"-0.02em", lineHeight:1.12, marginBottom:"0.8rem" }}>{post.title[lang]}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:C.muted, lineHeight:1.7, fontStyle:"italic", maxWidth:"620px" }}>{post.excerpt[lang]}</div>
                  </button>
                  <Divider />
                </div>
              );
            }
            return (
              <div key={post.id}>
                <button onClick={open} className="post-row" style={{
                  width:"100%", display:"grid", gridTemplateColumns:"60px 150px 1fr 120px",
                  gap:"2rem", alignItems:"start", padding:"2.25rem 0", textAlign:"left",
                  transition:"opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity="0.65"}
                  onMouseLeave={e => e.currentTarget.style.opacity="1"}
                >
                  <div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.orange, letterSpacing:"0.1em" }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.06em", marginTop:"4px" }}>{post.cat[lang]}</div>
                  </div>
                  <div className="post-thumb" style={{ width:"100%", aspectRatio:"3 / 2", overflow:"hidden", background:C.ink }}>
                    <Photo src={postCover(post.id).replace(".jpg", "-480.jpg")} w={480} h={262}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1rem,2.5vw,1.35rem)", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.5rem" }}>{post.title[lang]}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.9rem", color:C.muted, lineHeight:1.65, fontStyle:"italic" }}>{post.excerpt[lang]}</div>
                  </div>
                  {meta}
                </button>
                <Divider />
              </div>
            );
          })}

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
  const [status, setStatus] = useState("idle"); // idle | sending | sent | mail | error
  const [touched, setTouched] = useState(false);
  const sent = status === "sent" || status === "mail";

  const missing = !form.name.trim() || !validEmail(form.email) || !form.message.trim();

  const submit = async () => {
    setTouched(true);
    if (missing || status === "sending") return;
    setStatus("sending");
    try {
      const r = await sendForm(EMAILJS.contactTemplate, {
        from_name: form.name, reply_to: form.email,
        company: form.company, message: form.message,
      }, {
        subject: `Demande du site, ${form.name}`,
        body: `Nom: ${form.name}\nCourriel: ${form.email}\nCompagnie: ${form.company || "non precisee"}\n\n${form.message}`,
      });
      setStatus(r);
      track.formSubmit();
    } catch {
      setStatus("error");
    }
  };
  const t = {
    en:{ eyebrow:"Get in Touch", h1:"Let's talk.", fName:"Your name", fEmail:"Email", fCo:"Company (optional)", fMsg:"What are you looking for?", send:"Send", sending:"Sending...", sent:"Message sent. We'll be in touch shortly.",
         sentMail:"Your email program just opened with your message ready to go. Send it and we'll get back to you. If nothing opened, write us at " + CONTACT_EMAIL + ".",
         errorMsg:"The message didn't go through. Call us at (514) 905-0606 or write to " + CONTACT_EMAIL + " and we'll pick it up from there.",
         required:"We need your name, a valid email and a message." },
    fr:{ eyebrow:"Nous joindre", h1:"Jasez avec nous.", fName:"Ton nom", fEmail:"Courriel", fCo:"Compagnie (optionnel)", fMsg:"Qu'est-ce que tu cherches?", send:"Envoyer", sending:"Envoi...", sent:"Message envoyé. On te revient bientôt.",
         sentMail:"Ton logiciel de courriel vient de s'ouvrir avec ton message déjà écrit. Envoie le et on te revient. Si rien ne s'est ouvert, écris nous au " + CONTACT_EMAIL + ".",
         errorMsg:"Le message n'est pas parti. Appelle nous au (514) 905-0606 ou écris au " + CONTACT_EMAIL + " et on embarque de là.",
         required:"Ça prend ton nom, un courriel valide et un message." },
  }[lang];

  const inp = { width:"100%", padding:"11px 0", background:"transparent", border:"none", borderBottom:`1px solid ${C.rule}`, color:C.ink, fontFamily:"'Archivo',sans-serif", fontSize:"0.95rem", outline:"none", transition:"border-color 0.2s" };

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/cafe-montreal.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative", }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(2.4rem,6vw,4.4rem)", letterSpacing:"-0.015em", color:C.paper, lineHeight:0.9 }}>{t.h1}</h1>
        </div>
      </section>

      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div className="two-col" style={{ maxWidth:"1000px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"6rem", alignItems:"start" }}>
          {/* Info */}
          <div>
            {[{city:"Montréal",phone:"(514) 905-0606",addr:"500 Place d'Armes, #1800\nMontréal, QC H2Y 2W2"},{city:"Québec",phone:"(418) 431-1441",addr:"1020, rue Bouvier, Bureau 400\nQuébec, QC G2K 0K9"},{city:"Toronto",phone:"(647) 490-6626",addr:"197 Yonge Street, Unit 201\nToronto, ON M5B 0C1"}].map(o => (
              <div key={o.city} style={{ marginBottom:"3rem" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"1.25rem" }}>{o.city}</div>
                <Divider style={{ marginBottom:"1.25rem" }} />
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.4rem" }}>{lang==="en"?"Phone":"Téléphone"}</div>
                <a href={`tel:+1${o.phone.replace(/\D/g,"")}`} style={{ display:"block", fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.ink, marginBottom:"1rem", textDecoration:"none" }}>{o.phone}</a>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.4rem" }}>{lang==="en"?"Address":"Adresse"}</div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.muted, lineHeight:1.7, whiteSpace:"pre-line" }}>{o.addr}</div>
              </div>
            ))}
            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.4rem" }}>Email</div>
            <a href="mailto:info@proforce.ca" style={{ display:"block", fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.ink, marginBottom:"2.5rem", textDecoration:"none" }}>info@proforce.ca</a>

            {/* Booking CTA */}
            <div style={{ padding:"1.75rem", background:C.ink, borderLeft:`3px solid ${C.orange}` }}>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.6rem" }}>
                {lang==="en"?"Prefer to book directly?":"Tu préfères réserver directement?"}
              </div>
              <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:"rgba(255,255,255,0.65)", lineHeight:1.6, marginBottom:"1.25rem" }}>
                {lang==="en"
                  ? "Pick a time that works for you. 15 minutes is usually enough to know if we're the right fit."
                  : "Choisis un moment qui te convient. 15 minutes suffit généralement pour savoir si on est le bon fit."}
              </p>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                onClick={() => track.contactClick()}
                className="btn-orange"
                style={{ display:"inline-block" }}
              >
                {lang==="en"?"Book a 15-min Call":"Réserver un appel 15 min"}
              </a>
            </div>

            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.75rem" }}>{lang==="en"?"Follow Us":"Nous suivre"}</div>
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
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:C.ink, fontStyle:"italic", lineHeight:1.6 }}>
                  {status === "mail" ? t.sentMail : t.sent}
                </p>
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
                {touched && missing && (
                  <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.orange, margin:0 }}>{t.required}</p>
                )}
                {status === "error" && (
                  <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.orange, margin:0, lineHeight:1.6 }}>{t.errorMsg}</p>
                )}
                <button className="btn-ink" onClick={submit} disabled={status === "sending"}
                  style={{ alignSelf:"flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
                  {status === "sending" ? t.sending : t.send}
                </button>
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
  const [prodLoss, setProdLoss] = useState(70);
  const [turnover, setTurnover] = useState(40);
  const [badHirePct, setBadHirePct] = useState(30);
  const [feePct, setFeePct] = useState(20);
  const [fillTime, setFillTime] = useState(6);

  const fmt = (n) => n.toLocaleString(lang === "fr" ? "fr-CA" : "en-CA", { style:"currency", currency:"CAD", maximumFractionDigits:0 });

  // Aucune hypothese n'est cachee dans le calcul: les cinq qui faisaient varier
  // le resultat sont maintenant des curseurs que le visiteur controle lui meme.
  const weeklyRate = salary / 52;
  const vacancyCost = weeks * weeklyRate * (prodLoss / 100);
  const badHireCost = salary * (badHirePct / 100);
  const expectedBadHire = badHireCost * (turnover / 100);
  const totalCost = vacancyCost + expectedBadHire;
  const fee = salary * (feePct / 100);
  const weeksSaved = Math.max(0, weeks - fillTime);
  const vacancySaved = weeksSaved * weeklyRate * (prodLoss / 100);
  const ecart = vacancySaved - fee;

  const t = {
    en:{
      eyebrow:"Cost of a vacant role",
      h1:"What is that empty seat",
      h1i:"actually costing you?",
      sub:"Every assumption below is a slider you control. Nothing goes into the math that you did not set yourself. Move one and watch the answer change, that is the point.",
      salary:"Annual salary of the role", weeks:"Weeks to fill on your own",
      prodLoss:"Productivity lost while the seat is empty",
      turnover:"Odds of a bad hire", badHirePct:"Cost of a bad hire, as a share of salary",
      feePct:"Fee percentage",
      fillTime:"Weeks to fill with a recruiter",
      resultsH:"What it costs you.",
      cmpH:"Now compare.",
      r1:"Cost of the vacancy", r1s:"Lost productivity during the search, at the rate you set",
      r2:"Expected cost of a bad hire", r2s:"Cost of a miss, weighted by the odds you set",
      r3:"Total", r3s:"Before anyone talks about fees",
      r4:"Fee", r4s:"One time, payable on success",
      r5:"Vacancy saved", r5s:"The weeks gained, at the productivity rate you set",
      r6:"Difference", r6s:"Vacancy saved minus the fee",
      note:"This math puts no value on the guarantee. It runs from 90 days to a year and it is in the contract, not in an estimate. Same for the candidates who never answer a job posting. We cannot put a number on them, and they are usually the ones you are looking for.",
      disclaimer:"This is not a study. It is your scenario with your assumptions. We did not hide a number anywhere to make the answer come out our way.",
      cta:"Ready to talk?", cta2:"Contact Us",
    },
    fr:{
      eyebrow:"Coût d'un poste vacant",
      h1:"Ça te coûte quoi au juste,",
      h1i:"une chaise vide?",
      sub:"Chaque hypothèse en dessous est un curseur que tu contrôles. Rien n'entre dans le calcul que tu n'as pas réglé toi-même. Bouge un curseur et la réponse change, c'est le but.",
      salary:"Salaire annuel du poste", weeks:"Semaines pour combler par toi-même",
      prodLoss:"Productivité perdue pendant que la chaise est vide",
      turnover:"Probabilité d'un mauvais candidat", badHirePct:"Coût d'un mauvais candidat, en % du salaire",
      feePct:"Pourcentage d'honoraires",
      fillTime:"Semaines pour combler avec un recruteur",
      resultsH:"Ce que ça te coûte.",
      cmpH:"Maintenant, compare.",
      r1:"Coût du poste vacant", r1s:"Productivité perdue pendant la recherche, au taux que tu as fixé",
      r2:"Coût attendu d'un mauvais candidat", r2s:"Le coût d'un échec, pondéré par la probabilité que tu as fixée",
      r3:"Total", r3s:"Avant même qu'on parle d'honoraires",
      r4:"Honoraires", r4s:"Une seule fois, payable au succès",
      r5:"Vacance économisée", r5s:"Les semaines gagnées, à la productivité que tu as fixée",
      r6:"Écart", r6s:"La vacance économisée moins les honoraires",
      note:"Ce calcul ne met aucune valeur sur la garantie. Elle va de 90 jours à un an et elle est dans le contrat, pas dans une estimation. Même chose pour les candidats qui ne répondent jamais à une annonce: on ne peut pas les chiffrer, et c'est souvent eux que tu cherches.",
      disclaimer:"C'est pas une étude. C'est ton scénario, avec tes hypothèses. On n'a caché aucun chiffre pour que la réponse sorte de notre bord.",
      cta:"Prêt à jaser?", cta2:"Nous contacter",
    },
  }[lang];

  const sliders = [
    { label:t.salary, value:salary, set:setSalary, min:60000, max:250000, step:5000, fmt:(v)=>`${fmt(v)}` },
    { label:t.weeks, value:weeks, set:setWeeks, min:4, max:26, step:1, fmt:(v)=>`${v} ${lang==="en"?"weeks":"semaines"}` },
    { label:t.prodLoss, value:prodLoss, set:setProdLoss, min:0, max:100, step:5, fmt:(v)=>`${v}%` },
    { label:t.turnover, value:turnover, set:setTurnover, min:0, max:70, step:5, fmt:(v)=>`${v}%` },
    { label:t.badHirePct, value:badHirePct, set:setBadHirePct, min:0, max:100, step:5, fmt:(v)=>`${v}%` },
    { label:t.feePct, value:feePct, set:setFeePct, min:15, max:25, step:1, fmt:(v)=>`${v}%` },
    { label:t.fillTime, value:fillTime, set:setFillTime, min:2, max:16, step:1, fmt:(v)=>`${v} ${lang==="en"?"weeks":"semaines"}` },
  ];

  // Deux blocs separes: ce que le poste vacant coute, puis seulement apres la
  // comparaison avec un mandat. Le premier bloc ne mentionne pas Proforce.
  const rows = [
    { label:t.r1, sub:t.r1s, value:vacancyCost, type:"cost" },
    { label:t.r2, sub:t.r2s, value:expectedBadHire, type:"cost" },
    { label:t.r3, sub:t.r3s, value:totalCost, type:"total" },
  ];
  const cmpRows = [
    { label:t.r4, sub:t.r4s, value:fee, type:"fee" },
    { label:t.r5, sub:t.r5s, value:vacancySaved, type:"saving" },
    { label:t.r6, sub:t.r6s, value:ecart, type: ecart >= 0 ? "saving" : "cost" },
  ];

  const sliderStyle = { width:"100%", accentColor:C.orange, cursor:"pointer" };

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2rem,5vw,3.6rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.4rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2rem" }}>{t.h1i}</h2>
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
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.ink, fontWeight:500 }}>{sl.label}</span>
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.78rem", color:C.orange, fontWeight:600 }}>{sl.fmt(sl.value)}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={sl.value} onChange={e => sl.set(Number(e.target.value))}
                  style={sliderStyle}
                />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", color:C.muted }}>{sl.fmt(sl.min)}</span>
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", color:C.muted }}>{sl.fmt(sl.max)}</span>
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
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color: row.type==="total" ? C.ink : C.ink, fontWeight: row.type==="total" ? 700 : 400 }}>{row.label}</div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.72rem", color:C.muted, marginTop:"1px" }}>{row.sub}</div>
                </div>
                <div style={{
                  fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", fontWeight:700, flexShrink:0, marginLeft:"1rem",
                  color: row.type==="cost"||row.type==="total" ? "#c0392b" : row.type==="fee" ? C.muted : "#27ae60",
                }}>
                  {row.type==="saving" ? "+" : ""}{fmt(row.value)}
                </div>
              </div>
            ))}

            {/* Le total du poste vacant: le seul chiffre mis en vedette, et il ne
                parle pas de nous. */}
            <div style={{ marginTop:"1.5rem", padding:"1.75rem", background:C.ink, borderLeft:`4px solid ${C.orange}` }}>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.5rem" }}>{t.r3}</div>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"2.5rem", fontWeight:700, letterSpacing:"-0.015em", color:"#fff", lineHeight:1 }}>
                {fmt(totalCost)}
              </div>
            </div>

            {/* La comparaison vient apres, et elle est presentee comme un ecart,
                pas comme une economie garantie. */}
            <div style={{ marginTop:"3rem" }}>
              <Eyebrow>{t.cmpH}</Eyebrow>
              <Divider style={{ marginBottom:"0" }} />
              {cmpRows.map((row, i) => (
                <div key={i} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"0.9rem 0", borderBottom:`1px solid ${C.rule}`,
                }}>
                  <div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.ink }}>{row.label}</div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.72rem", color:C.muted, marginTop:"1px" }}>{row.sub}</div>
                  </div>
                  <div style={{
                    fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", fontWeight:700, flexShrink:0, marginLeft:"1rem",
                    color: row.type==="cost" ? "#c0392b" : row.type==="fee" ? C.muted : "#27ae60",
                  }}>
                    {row.type==="saving" && row.value > 0 ? "+" : ""}{fmt(row.value)}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.88rem", color:C.inkLight, lineHeight:1.75, fontWeight:300, fontStyle:"italic", marginTop:"1.5rem" }}>{t.note}</p>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.75rem", color:C.muted, lineHeight:1.6, marginTop:"1rem" }}>{t.disclaimer}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.orange, padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,3rem)", color:"#fff", letterSpacing:"-0.015em" }}>{t.cta}</h2>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"13px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase" }}>{t.cta2}</button>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ background:"transparent", border:"2px solid rgba(255,255,255,0.5)", color:"#fff", padding:"11px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase" }}>
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
      <section style={{ background:C.ink, minHeight:"34vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ position:"absolute", right:"-1rem", bottom:"-1rem", fontFamily:"'Playfair Display',serif", fontSize:"clamp(8rem,20vw,18rem)", fontWeight:700, color:"rgba(232,93,26,0.05)", lineHeight:1, userSelect:"none", letterSpacing:"-0.025em" }}>09</div>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.8, maxWidth:"580px" }}>{t.sub}</p>
        </div>
      </section>

      <PhotoBand items={[
        ["/photos/ligne-bouteilles.jpg", 2, 1600, 900,
         lang==="en" ? "Capping head above juice bottles on a bottling line" : "Tête de capsulage au-dessus de bouteilles de jus sur une ligne d'embouteillage"],
        ["/photos/ligne-brioches.jpg", 1, 1600, 900,
         lang==="en" ? "Automated bagger closing packs of buns" : "Ensacheuse automatisée qui ferme des paquets de pains"],
        ["/photos/biscuits-confiture.jpg", 1, 900, 900,
         lang==="en" ? "Depositing head laying jam onto rows of biscuits" : "Tête de dosage qui dépose de la confiture sur des rangées de biscuits"],
      ]} />

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
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.8rem", fontWeight:700, color: openPhase===i ? C.orange : C.rule, letterSpacing:"-0.015em", lineHeight:1, transition:"color 0.2s" }}>{phase.n}</div>
                <div>
                  <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.4rem" }}>{phase.phase}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1rem,2vw,1.2rem)", color:C.ink, letterSpacing:"-0.01em" }}>{phase.h}</div>
                </div>
                <span style={{ color:C.orange, fontSize:"1.3rem", fontWeight:300, transition:"transform 0.2s", transform: openPhase===i?"rotate(45deg)":"rotate(0deg)", flexShrink:0 }}>+</span>
              </button>

              {openPhase === i && (
                <div style={{ paddingBottom:"2.5rem", paddingLeft:"calc(56px + 1.5rem)" }}>
                  {phase.p.split("\n\n").map((para, j) => (
                    <p key={j} style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300, marginBottom:"1.25rem" }}>{para}</p>
                  ))}
                  <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap", marginTop:"1.5rem", paddingTop:"1.25rem", borderTop:`1px solid ${C.rule}` }}>
                    <div>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.3rem" }}>{lang==="en"?"Typical duration":"Durée typique"}</div>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.ink }}>{phase.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.3rem" }}>{lang==="en"?"What you get":"Ce que tu reçois"}</div>
                      <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.ink }}>{phase.deliverable}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Photo + phrase d'appui, le seul dispositif visuel de la page */}
      <section style={{ background:C.ink, padding:"0" }}>
        <div className="two-col" style={{
          maxWidth:"1100px", margin:"0 auto", display:"grid",
          gridTemplateColumns:"minmax(0,0.85fr) minmax(0,1.15fr)", alignItems:"stretch",
        }}>
          <div style={{ minHeight:"340px", position:"relative", overflow:"hidden" }}>
            <Photo
              src="/photos/panneau-controle.jpg" w={896} h={1200}
              alt={lang==="en"
                ? "A production operator at the control panel of a packaging line"
                : "Un opérateur de production au panneau de contrôle d'une ligne d'emballage"}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
          </div>
          <div style={{ padding:"4rem 2.5rem", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} />
            <p style={{
              fontFamily:"'Playfair Display',serif", fontWeight:400,
              fontSize:"clamp(1.3rem,2.6vw,1.9rem)", lineHeight:1.5, color:"#fff", marginBottom:"1.5rem",
            }}>
              {lang==="en"
                ? "The people worth hiring are already working. They are not refreshing a job board on a Tuesday night."
                : "Le monde que ça vaut la peine d'embaucher travaille déjà. Y sont pas en train de rafraîchir un site d'emploi un mardi soir."}
            </p>
            <p style={{
              fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.03em",
              textTransform:"uppercase", color:"rgba(255,255,255,0.45)",
            }}>
              {lang==="en" ? "That is the whole method" : "C'est là que la méthode commence"}
            </p>
          </div>
        </div>
      </section>

      {/* Timelines */}
      <section style={{ background:C.paperDark, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Timelines":"Délais"}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.1rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.timelineH}</h2>
          <Divider style={{ marginBottom:"0" }} />
          {t.timelines.map((tl, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 0", borderBottom:`1px solid ${C.rule}`, flexWrap:"wrap", gap:"0.5rem" }}>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.92rem", color:C.ink }}>{tl.role}</span>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.72rem", letterSpacing:"0.06em", color:C.orange, flexShrink:0 }}>{tl.time}</span>
            </div>
          ))}
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.88rem", color:C.muted, fontStyle:"italic", marginTop:"1.5rem", lineHeight:1.7 }}>
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
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.1rem)", letterSpacing:"-0.015em", color:"#fff", marginBottom:"3rem" }}>{t.commitH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"2px", background:"rgba(255,255,255,0.05)" }}>
            {[[t.commit1h,t.commit1p,"01"],[t.commit2h,t.commit2p,"02"],[t.commit3h,t.commit3p,"03"]].map(([h,p,n]) => (
              <div key={n} style={{ background:C.inkLight, padding:"2.5rem 2rem" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"2rem", fontWeight:700, color:C.orange, letterSpacing:"-0.015em", lineHeight:1, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:"#fff", letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
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
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", color:"#fff", letterSpacing:"-0.015em", lineHeight:1, marginBottom:"0.75rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", lineHeight:1.7 }}>{t.ctaP}</p>
          </div>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"13px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", transition:"opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >{t.cta}</button>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ background:"transparent", border:"2px solid rgba(255,255,255,0.5)", color:"#fff", padding:"11px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", transition:"border-color 0.2s" }}
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ maxWidth:"900px" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.4rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2rem" }}>{t.h1i}</h2>
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
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.muted }}>{item.outlet}</span>
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.muted }}>·</span>
                  <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.muted }}>{item.date}</span>
                  {item.featured && (
                    <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.02em", color:C.orange, border:`1px solid ${C.orange}20`, background:C.orange+"10", padding:"2px 8px" }}>{t.featuredLabel}</span>
                  )}
                </div>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange + "80" }}>{item.type[lang]}</span>
              </div>

              <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.15rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.75rem" }}>{item.title[lang]}</h3>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.8, fontWeight:300, marginBottom:"1.25rem", maxWidth:"680px" }}>{item.desc[lang]}</p>

              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em",
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
            <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1rem", color:C.muted, marginBottom:"0.5rem" }}>{t.emptyH}</h3>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.muted, lineHeight:1.7 }}>{t.emptyP}</p>
          </div>
        </div>
      </section>

      {/* Pitch section */}
      <section style={{ background:C.ink, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div style={{ width:"36px", height:"3px", background:C.orange, marginBottom:"1.5rem" }} />
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", letterSpacing:"-0.015em", color:"#fff", marginBottom:"1rem" }}>{t.pitchH}</h2>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:"2rem", maxWidth:"520px", fontWeight:300 }}>{t.pitchP}</p>
          <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>
    </div>
  );
}

// ─── REFERRAL PAGE ────────────────────────────────────────────────────────────
function ReferralPage({ lang, setPage }) {
  const [form, setForm] = useState({ yourName:"", yourEmail:"", yourCompany:"", refName:"", refCompany:"", refEmail:"", refPhone:"", context:"" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | mail | error
  const [touched, setTouched] = useState(false);
  const sent = status === "sent" || status === "mail";

  const missing = !form.yourName.trim() || !validEmail(form.yourEmail) || !form.refName.trim();

  const submit = async () => {
    setTouched(true);
    if (missing || status === "sending") return;
    setStatus("sending");
    try {
      const r = await sendForm(EMAILJS.referralTemplate, {
        from_name: form.yourName, reply_to: form.yourEmail, your_company: form.yourCompany,
        ref_name: form.refName, ref_company: form.refCompany,
        ref_email: form.refEmail, ref_phone: form.refPhone, context: form.context,
      }, {
        subject: `Référence du site, ${form.refName}`,
        body: `De la part de: ${form.yourName}\nCourriel: ${form.yourEmail}\nCompagnie: ${form.yourCompany || "non precisee"}\n\n`
            + `Personne référée: ${form.refName}\nCompagnie: ${form.refCompany || "non precisee"}\n`
            + `Courriel: ${form.refEmail || "non precise"}\nTéléphone: ${form.refPhone || "non precise"}\n\n`
            + `Contexte: ${form.context || "aucun"}`,
      });
      setStatus(r);
      track.formSubmit();
    } catch {
      setStatus("error");
    }
  };

  const msg = {
    en:{ sending:"Sending...",
         sentMail:"Your email program just opened with the referral ready to go. Send it and we'll follow up with you. If nothing opened, write us at " + CONTACT_EMAIL + ".",
         errorMsg:"The referral didn't go through. Call us at (514) 905-0606 or write to " + CONTACT_EMAIL + " and we'll pick it up from there.",
         required:"We need your name, a valid email, and the name of the person you're referring." },
    fr:{ sending:"Envoi...",
         sentMail:"Ton logiciel de courriel vient de s'ouvrir avec la référence déjà écrite. Envoie la et on fait le suivi avec toi. Si rien ne s'est ouvert, écris nous au " + CONTACT_EMAIL + ".",
         errorMsg:"La référence n'est pas partie. Appelle nous au (514) 905-0606 ou écris au " + CONTACT_EMAIL + " et on embarque de là.",
         required:"Ça prend ton nom, un courriel valide, et le nom de la personne que tu réfères." },
  }[lang];

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

  const inp = { width:"100%", padding:"10px 0", background:"transparent", border:"none", borderBottom:`1px solid ${C.rule}`, color:C.ink, fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", outline:"none", transition:"border-color 0.2s" };

  return (
    <div>
      {/* Hero */}
      <section style={{ background:C.ink, minHeight:"34vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:"2rem", bottom:"2rem", fontFamily:"'Playfair Display',serif", fontSize:"clamp(6rem,18vw,16rem)", fontWeight:700, color:"rgba(232,93,26,0.06)", lineHeight:1, userSelect:"none", letterSpacing:"-0.025em" }}>1K$</div>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2rem,5vw,3.6rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.4rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.8, maxWidth:"560px" }}>{t.sub}</p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"The process":"Le processus"}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.howH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"2px", background:C.rule }}>
            {[
              [t.s1h, t.s1p, "01"],
              [t.s2h, t.s2p, "02"],
              [t.s3h, t.s3p, "03"],
              [t.s4h, t.s4p, "04"],
            ].map(([h, p, n]) => (
              <div key={n} style={{ background:C.white, padding:"2.5rem 2rem" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"2.5rem", fontWeight:700, color:C.orange, letterSpacing:"-0.015em", lineHeight:1, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why refer */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.whyH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"3rem" }}>
            {[[t.why1h,t.why1p,"01"],[t.why2h,t.why2p,"02"],[t.why3h,t.why3p,"03"]].map(([h,p,n]) => (
              <div key={n}>
                <div style={{ width:"36px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.6rem" }}>{h}</h3>
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
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.1rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"0.5rem" }}>{t.formH}</h2>
          <p style={{ color:C.muted, fontSize:"0.9rem", marginBottom:"3rem" }}>{t.formSub}</p>

          {sent ? (
            <div style={{ padding:"3rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
              <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:C.ink, fontStyle:"italic", lineHeight:1.6 }}>{status === "mail" ? msg.sentMail : t.sent}</p>
            </div>
          ) : (
            <div>
              {/* Your info */}
              <div style={{ marginBottom:"3rem" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"1.5rem" }}>
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
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"1.5rem" }}>
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

              {touched && missing && (
                <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.orange, marginBottom:"1rem" }}>{msg.required}</p>
              )}
              {status === "error" && (
                <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.orange, marginBottom:"1rem", lineHeight:1.6 }}>{msg.errorMsg}</p>
              )}
              <button className="btn-orange" onClick={submit} disabled={status === "sending"}
                style={{ opacity: status === "sending" ? 0.6 : 1 }}>
                {status === "sending" ? msg.sending : t.send}
              </button>
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
              <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", color:C.muted, lineHeight:1.7 }}>{term}</p>
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
    if (!validEmail(email)) return;
    setStatus("sending");
    try {
      const r = await sendForm(EMAILJS.newsletterTemplate, {
        subscriber_email: email,
        preferred_lang: lang === "fr" ? "Français" : "English",
        source: "proforce.ca footer",
      }, {
        subject: "Inscription à l'infolettre",
        body: `Courriel: ${email}\nLangue: ${lang === "fr" ? "Français" : "English"}\nSource: pied de page`,
      });
      setStatus(r === "mail" ? "mail" : "done");
    } catch { setStatus("error"); }
  };

  if (status === "done" || status === "mail") return <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.1em", color:C.orange }}>{t.done}</p>;

  return (
    <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"flex-end" }}>
      <input type="email" placeholder={t.placeholder} value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key==="Enter" && handleSubmit()}
        style={{ flex:"1 1 180px", padding:"9px 0", background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", outline:"none" }}
      />
      <button onClick={handleSubmit} disabled={status==="sending"} style={{
        background:C.orange, color:"#fff", padding:"9px 20px",
        fontFamily:"'Archivo',sans-serif", fontWeight:600, fontSize:"0.75rem",
        letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", flexShrink:0,
        opacity: status==="sending" ? 0.6 : 1,
      }}>{status==="sending" ? t.sending : t.cta}</button>
      {status==="error" && <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:"#e74c3c", width:"100%" }}>{t.error}</p>}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ lang, setPage }) {
  const links = lang==="en"
    ? [["food","Food"],["fashion","Fashion"],["employers","Employers"],["howwework","How We Work"],["calculator","Cost of a Vacancy"],["startup","Startups"],["about","About"],["team","Team"],["simon","Simon St-Amand"],["robin-anisef","Robin Anisef"],["stephanie-lanoie","Stéphanie Lanoie"],["mathieu-roy","Mathieu Roy"],["rana-yamak","Rana Yamak"],["michaela-landers","Michaela Landers"],["richard-saucier","Richard Saucier"],["press","Press"],["candidates","Candidates"],["featured","Talent"],["referral","Refer a Client"],["giving","Giving Back"],["jobs","Jobs"],["blog","Blog"],["glossary","Glossary"],["montreal","Montreal"],["quebec","Quebec City"],["toronto","Toronto"],["contact","Contact"]]
    : [["food","Alimentaire"],["fashion","Mode"],["employers","Employeurs"],["howwework","Comment on travaille"],["calculator","Coût d'un poste vacant"],["startup","Startups"],["about","À propos"],["team","Équipe"],["simon","Simon St-Amand"],["robin-anisef","Robin Anisef"],["stephanie-lanoie","Stéphanie Lanoie"],["mathieu-roy","Mathieu Roy"],["rana-yamak","Rana Yamak"],["michaela-landers","Michaela Landers"],["richard-saucier","Richard Saucier"],["press","Presse"],["candidates","Candidats"],["featured","Talents"],["referral","Référer un client"],["giving","Donner en retour"],["jobs","Emplois"],["blog","Blogue"],["glossary","Glossaire"],["montreal","Montréal"],["quebec","Québec"],["toronto","Toronto"],["contact","Contact"]];

  return (
    <footer style={{ background:C.ink, padding:"4rem 2rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ marginBottom:"3rem", borderLeft:`3px solid ${C.orange}`, padding:"1.5rem 2rem", background:"rgba(255,255,255,0.04)" }}>
          <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1rem" }} />
          <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.95rem", color:"#fff", marginBottom:"1rem" }}>
            {lang==="en"?"Get new articles in your inbox.":"Reçois les nouveaux articles par courriel."}
          </h3>
          <FooterNewsletter lang={lang} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"3rem", marginBottom:"3rem" }}>
          <div>
            <button onClick={() => setPage("home")} style={{ fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"1.3rem", color:C.paper, letterSpacing:"-0.01em", display:"flex", alignItems:"center", gap:"3px", marginBottom:"1rem" }}>
              PROFORCE<span style={{ color:C.orange }}>.</span>
            </button>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.82rem", color:"rgba(244,241,235,0.4)", lineHeight:1.7, maxWidth:"220px" }}>
              {lang==="en"?"Specialist recruitment. Food, CPG & Fashion. Montreal, Quebec City & Toronto. Since 2001.":"Recrutement spécialisé. Alimentaire, CPG & Mode. Montréal, Québec & Toronto. Depuis 2001."}
            </p>
          </div>

          <div style={{ display:"flex", gap:"4rem", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"1rem" }}>Pages</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                {links.map(([k,l]) => (
                  <PageLink key={k} to={k} setPage={setPage} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.82rem", color:"rgba(244,241,235,0.45)", textAlign:"left", transition:"color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color=C.paper}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(244,241,235,0.45)"}
                  >{l}</PageLink>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"1rem" }}>Contact</div>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.82rem", color:"rgba(244,241,235,0.45)", lineHeight:2 }}>
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
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Proforce Personnel Inc.</p>
          <button onClick={() => setPage("privacy")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.2)", transition:"color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}
          >{lang==="en"?"Privacy Policy":"Politique de confidentialité"}</button>
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.2)" }}>proforce.ca</p>
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
    en: { title:"Our Team | Proforce Personnel", desc:"Meet the Proforce team: Simon St-Amand, Robin Anisef, Stéphanie Lanoie, Mathieu Roy, Rana Yamak, Michaela Landers, and Richard Saucier. Seven specialists in food, CPG, and fashion recruitment." },
    fr: { title:"Notre équipe | Proforce Personnel", desc:"Rencontrez l'équipe Proforce : Simon St-Amand, Robin Anisef, Stéphanie Lanoie, Mathieu Roy, Rana Yamak, Michaela Landers et Richard Saucier. Sept spécialistes du recrutement en alimentaire, CPG et mode." },
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
    en: { title:"What a vacant role costs you | Proforce Personnel", desc:"Work out what an empty seat costs your plant. Every assumption is a slider you set yourself, then compare it with the cost of a search." },
    fr: { title:"Ce que te coûte un poste vacant | Proforce Personnel", desc:"Calculez ce qu'une chaise vide coûte à votre usine. Chaque hypothèse est un curseur que vous réglez vous-même, puis comparez avec le coût d'un mandat." },
  },
  howwework: {
    en: { title:"How We Work | Proforce Personnel Recruitment Process", desc:"A complete breakdown of Proforce Personnel's 9-step recruitment process for employers. Discovery, search, screening, shortlist, offer, negotiation, references, and placement guarantee." },
    fr: { title:"Comment on travaille | Processus de recrutement Proforce Personnel", desc:"Un aperçu complet du processus de recrutement en 9 étapes de Proforce Personnel pour les employeurs. Découverte, recherche, évaluation, courte liste, offre, négociation, références et garantie de placement." },
  },
  press: {
    en: { title:"Press & Media | Proforce Personnel", desc:"Interviews, podcast appearances, and media mentions of Proforce Personnel and Simon St-Amand. Food industry recruitment, talent shortages, building a specialist firm." },
    fr: { title:"Presse & Médias | Proforce Personnel", desc:"Entrevues, apparitions en balado et mentions médias de Proforce Personnel et Simon St-Amand. Recrutement alimentaire, pénurie de main-d'oeuvre, bâtir une firme spécialisée." },
  },
  "robin-anisef": {
    en: { title:"Robin Anisef, Fashion & Apparel Recruiter | Proforce Personnel", desc:"Robin Anisef recruits buyers, designers, pattern technicians and brand managers in Canadian fashion, Montreal and Toronto. Over 20 years in the market." },
    fr: { title:"Robin Anisef, recruteuse mode et habillement | Proforce Personnel", desc:"Robin Anisef recrute acheteurs, designers, techniciens de patron et gestionnaires de marque dans la mode canadienne, à Montréal et à Toronto. Plus de 20 ans dans le marché." },
  },
  "stephanie-lanoie": {
    en: { title:"Stéphanie Lanoie, Food Industry Recruiter, Quebec | Proforce Personnel", desc:"Stéphanie Lanoie fills plant management, production, quality and supply chain roles in Quebec food manufacturing. 70 searches from 22 clients." },
    fr: { title:"Stéphanie Lanoie, recruteuse en alimentaire, Québec | Proforce Personnel", desc:"Stéphanie Lanoie comble des postes de direction d'usine, production, qualité et chaîne d'approvisionnement dans l'alimentaire au Québec. 70 mandats pour 22 clients." },
  },
  "mathieu-roy": {
    en: { title:"Mathieu Roy, Senior Food Industry Recruiter, Quebec | Proforce Personnel", desc:"Mathieu Roy recruits production managers, quality leads and operations people for food plants across Quebec, in the cities and in the regions." },
    fr: { title:"Mathieu Roy, recruteur senior en alimentaire, Québec | Proforce Personnel", desc:"Mathieu Roy recrute gérants de production, responsables qualité et gens d'opérations pour les usines alimentaires du Québec, en ville comme en région." },
  },
  "rana-yamak": {
    en: { title:"Rana Yamak, Food & CPG Recruiter, Ontario & US | Proforce Personnel", desc:"Rana Yamak fills account management, business development and territory sales roles in food ingredients and CPG across Ontario and the United States." },
    fr: { title:"Rana Yamak, recruteuse alimentaire et CPG, Ontario et É.-U. | Proforce Personnel", desc:"Rana Yamak comble des postes de gestion de comptes, développement des affaires et représentation de territoire en ingrédients alimentaires et CPG, en Ontario et aux États-Unis." },
  },
  "michaela-landers": {
    en: { title:"Michaela Landers, Food Manufacturing Recruiter, Ontario | Proforce Personnel", desc:"Michaela Landers leads Proforce's Ontario food manufacturing practice. Production, operations, quality and supply chain. 35 client companies in under four years." },
    fr: { title:"Michaela Landers, recrutement en fabrication alimentaire, Ontario | Proforce Personnel", desc:"Michaela Landers dirige la pratique en fabrication alimentaire de Proforce en Ontario. Production, opérations, qualité et chaîne d'approvisionnement. 35 entreprises clientes en moins de quatre ans." },
  },
  "richard-saucier": {
    en: { title:"Richard Saucier, Senior Advisor, Food Industry | Proforce Personnel", desc:"Richard Saucier spent 30 years in the food industry before joining Proforce. He works with food companies in Ontario and Quebec on their hiring needs." },
    fr: { title:"Richard Saucier, conseiller principal, industrie alimentaire | Proforce Personnel", desc:"Richard Saucier a passé 30 ans dans l'industrie alimentaire avant de se joindre à Proforce. Il accompagne les entreprises alimentaires de l'Ontario et du Québec dans leurs besoins d'embauche." },
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
      <section style={{ background:C.ink, minHeight:"72vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"4rem 2rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:"'Playfair Display',serif", fontSize:"clamp(12rem,30vw,28rem)", fontWeight:700, color:"rgba(232,93,26,0.06)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.025em" }}>404</div>
        <div style={{ maxWidth:"600px", margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.orange, marginBottom:"2rem" }}>404</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(2rem,4.6vw,3.4rem)", color:"#fff", letterSpacing:"-0.015em", lineHeight:0.95, marginBottom:"1rem" }}>
            {lang==="en" ? "This page doesn't exist." : "Cette page n'existe pas."}
          </h1>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,4vw,3rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"3rem" }}>
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
            <button style={{ display:"inline-block", border:"1.5px solid rgba(255,255,255,0.25)", color:"#fff", padding:"11px 28px", fontFamily:"'Archivo',sans-serif", fontWeight:600, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", background:"transparent", cursor:"pointer", transition:"border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"}
              onClick={() => setPage("contact")}
            >
              {lang==="en" ? "Contact Us" : "Nous contacter"}
            </button>
          </div>
          <div style={{ marginTop:"4rem", display:"flex", gap:"2rem", justifyContent:"center", flexWrap:"wrap" }}>
            {[["food", lang==="en"?"Food & CPG":"Alimentaire & CPG"],["fashion", lang==="en"?"Fashion":"Mode"],["blog", lang==="en"?"Blog":"Blogue"],["team", lang==="en"?"Team":"Équipe"]].map(([k,l]) => (
              <button key={k} onClick={() => setPage(k)} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.4)", borderBottom:`1px solid rgba(255,255,255,0.15)`, paddingBottom:"2px", transition:"color 0.2s" }}
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
      <section style={{ background:C.ink, minHeight:"40vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem" }}>
        <div style={{ maxWidth:"780px" }}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.5rem,6vw,5rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"1rem" }}>{t.h1}</h1>
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)", marginTop:"1rem" }}>{t.updated}</p>
        </div>
      </section>

      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"0" }} />
          {t.sections.map((s, i) => (
            <div key={i} style={{ padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <h2 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.75rem" }}>{s.h}</h2>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{s.p}</p>
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
    // Sur un article, c'est son image qui est partagee, pas l'image generique
    // du site. Un lien sans image propre prend trois fois moins de place dans
    // un fil LinkedIn.
    const shareImage = postMeta
      ? `${base}/photos/blogue/${postMeta.id}.jpg`
      : `${base}/og-image.jpg`;

    setMeta('meta[property="og:image"]',         "content", shareImage);
    setMeta('meta[property="og:image:width"]',   "content", "1600");
    setMeta('meta[property="og:image:height"]',  "content", "873");
    setMeta('meta[name="twitter:card"]',         "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]',        "content", title);
    setMeta('meta[name="twitter:description"]',  "content", desc);
    setMeta('meta[name="twitter:image"]',        "content", shareImage);
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
        "image": shareImage,
        "inLanguage": lang === "fr" ? "fr-CA" : "en-CA",
        // Google exige une date ISO 8601. postMeta.date est du texte affiche
        // ("Mai 2026"), qui se fait rejeter, alors on envoie postMeta.iso.
        "datePublished": postMeta.iso || undefined,
        "dateModified": postMeta.iso || undefined,
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
  "robin-anisef": "robin-anisef",
  "stephanie-lanoie": "stephanie-lanoie",
  "mathieu-roy": "mathieu-roy",
  "rana-yamak": "rana-yamak",
  "michaela-landers": "michaela-landers",
  "richard-saucier": "richard-saucier",
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
    // Une visite de la page Contact n'est pas un clic de contact: on la compte
    // comme une vue de page, et contactClick reste reserve aux vrais clics.
    if (page === "contact") track.pageView("Contact");
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
    recruiters: ["Simon St-Amand","Robin Anisef","Stéphanie Lanoie","Mathieu Roy"],
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
    recruiters: ["Stéphanie Lanoie","Mathieu Roy","Simon St-Amand"],
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem" }}>
        <div style={{ maxWidth:"900px" }}>
          <Eyebrow>{lang==="en"?"Industry Glossary":"Glossaire de l'industrie"}</Eyebrow>
          <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>
            {lang==="en" ? "Know the language." : "Connaître le vocabulaire."}
          </h1>
          <h2 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.4rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2rem" }}>
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
              <button onClick={() => setActiveFilter("all")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color: activeFilter==="all" ? C.orange : C.muted, borderBottom: activeFilter==="all" ? `1px solid ${C.orange}` : "1px solid transparent", paddingBottom:"2px" }}>
                {lang==="en"?"All":"Tout"}
              </button>
              {cats.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color: activeFilter===cat ? C.orange : C.muted, borderBottom: activeFilter===cat ? `1px solid ${C.orange}` : "1px solid transparent", paddingBottom:"2px" }}>
                  {cat}
                </button>
              ))}
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang==="en"?"Search terms...":"Rechercher..."}
              style={{ padding:"7px 12px", border:`1px solid ${C.rule}`, fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.06em", color:C.ink, outline:"none", background:"transparent", width:"180px" }}
              onFocus={e => e.target.style.borderColor=C.orange}
              onBlur={e => e.target.style.borderColor=C.rule}
            />
          </div>

          <Divider style={{ marginBottom:"0" }} />

          {filtered.length === 0 && (
            <div style={{ padding:"4rem 0", textAlign:"center" }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:C.muted, fontStyle:"italic" }}>
                {lang==="en" ? `No terms found for "${search}".` : `Aucun terme trouvé pour « ${search} ».`}
              </p>
            </div>
          )}

          {filtered.map((item, i) => (
            <div key={item.term} style={{ padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <h2 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.15rem", color:C.ink, letterSpacing:"-0.01em" }}>{item.term}</h2>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.02em", color:C.orange, border:`1px solid ${C.orange}20`, padding:"3px 8px", background:C.orange+"10", flexShrink:0 }}>{item.cat[lang]}</span>
              </div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{item.def[lang]}</p>
            </div>
          ))}

          <div style={{ marginTop:"4rem", padding:"2.5rem", background:C.paperDark, borderLeft:`3px solid ${C.orange}` }}>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.muted, lineHeight:1.7, marginBottom:"1.25rem" }}>
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
// Montreal n'a pas encore sa propre photo: on emprunte la vue aerienne de
// l'accueil en attendant, plutot que de laisser le hero en marine plein.
const MARKET_PHOTOS = {
  montreal: "/photos/marche-montreal.jpg",
  quebec:   "/photos/marche-quebec.jpg",
  toronto:  "/photos/marche-toronto.jpg",
};

function MarketPage({ lang, setPage, market }) {
  const t = MARKETS[market][lang];
  const marketPhoto = MARKET_PHOTOS[market] || "/photos/parc-industriel.jpg";
  const recruiters = MARKETS[market].recruiters.map(name => TEAM.find(m => m.name === name)).filter(Boolean);

  return (
    <div>
      <section style={{ background:C.ink, minHeight:"34vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(${marketPhoto.replace(".jpg", ".webp")})`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ maxWidth:"900px" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.4rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.75, maxWidth:"560px", marginBottom:"2.5rem" }}>{t.sub}</p>
          <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>

      {/* About the market */}
      <section style={{ background:C.white, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"3rem" }} />
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", color:C.muted, lineHeight:1.9, fontWeight:300, marginBottom:"4rem" }}>{t.about}</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", background:C.rule, marginBottom:"4rem" }} className="two-col">
            {[{h:t.foodH,p:t.foodP,pg:"food"},{h:t.fashH,p:t.fashP,pg:"fashion"}].map(s => (
              <button key={s.pg} onClick={() => setPage(s.pg)} style={{ background:C.white, padding:"2.5rem", textAlign:"left", transition:"background 0.2s", width:"100%" }}
                onMouseEnter={e => e.currentTarget.style.background=C.paperDark}
                onMouseLeave={e => e.currentTarget.style.background=C.white}
              >
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.75rem" }}>{s.h}</h3>
                <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", color:C.muted, lineHeight:1.75, marginBottom:"1.5rem" }}>{s.p}</p>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange }}>{lang==="en"?"Learn more →":"En savoir plus →"}</span>
              </button>
            ))}
          </div>

          {/* Recruiters */}
          <h2 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.3rem", color:C.ink, marginBottom:"2rem" }}>{t.recruiterH}</h2>
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", marginBottom:"4rem" }}>
            {recruiters.map(m => (
              <div key={m.name} style={{ background:C.ink, padding:"1.75rem", borderTop:`3px solid ${C.orange}`, flex:"1 1 220px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem" }}>
                  <Avatar m={m} size={56} />
                  <div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:"#fff" }}>{m.name}</div>
                    <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, marginTop:"2px" }}>{m.title[lang]}</div>
                  </div>
                </div>
                <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.82rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{m.sector[lang]}</p>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"5px", fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginTop:"1rem", borderBottom:`1px solid rgba(255,255,255,0.15)`, paddingBottom:"2px" }}><LinkedInIcon />LinkedIn</a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ background:C.paperDark, padding:"2.5rem", borderLeft:`3px solid ${C.orange}` }}>
            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.02em", color:C.orange, marginBottom:"0.5rem" }}>{lang==="en"?"Office":"Bureau"}</div>
            <a href={`tel:+1${t.phone.replace(/\D/g,"")}`} style={{ display:"block", fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:C.ink, marginBottom:"0.35rem", fontWeight:500, textDecoration:"none" }}>{t.phone}</a>
            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.85rem", color:C.muted, marginBottom:"1.5rem" }}>{t.addr}</div>
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
      <section style={{ background:C.ink, minHeight:"40vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden", backgroundImage:`linear-gradient(to right, rgba(13,37,69,0.94), rgba(13,37,69,0.76)), url(/photos/startup.webp)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        {/* Background number */}
        <div style={{ position:"absolute", right:"2rem", bottom:"2rem", fontFamily:"'Playfair Display',serif", fontSize:"clamp(8rem,20vw,18rem)", fontWeight:700, color:"rgba(232,93,26,0.06)", lineHeight:1, userSelect:"none", letterSpacing:"-0.025em" }}>01</div>

        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.75rem" }}>{t.h1}</h1>
          <h2 className="fu3" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, marginBottom:"2.5rem" }}>{t.h1i}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1rem", lineHeight:1.8, maxWidth:"580px", marginBottom:"2.5rem" }}>{t.sub}</p>
          <button className="btn-orange" onClick={() => setPage("contact")}>{t.cta}</button>
        </div>
      </section>

      {/* Why different */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"The challenge":"Le défi"}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.diffH}</h2>
          <Divider style={{ marginBottom:"0" }} />
          {[
            [t.diff1h, t.diff1p, "01"],
            [t.diff2h, t.diff2p, "02"],
            [t.diff3h, t.diff3p, "03"],
            [t.diff4h, t.diff4p, "04"],
          ].map(([h, p, n]) => (
            <div key={n} style={{ display:"grid", gridTemplateColumns:"60px 1fr", gap:"2rem", padding:"2.5rem 0", borderBottom:`1px solid ${C.rule}` }}>
              <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"2rem", fontWeight:700, color:C.orange, letterSpacing:"-0.015em", lineHeight:1 }}>{n}</div>
              <div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.15rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.85, fontWeight:300 }}>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we work with */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Our clients":"Nos clients"}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.whoH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"2px", background:C.rule }}>
            {[
              [t.who1h, t.who1p],
              [t.who2h, t.who2p],
              [t.who3h, t.who3p],
            ].map(([h, p]) => (
              <div key={h} style={{ background:C.white, padding:"2.5rem 2rem" }}>
                <div style={{ width:"28px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
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
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.rolesH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"0", border:`1px solid ${C.rule}` }}>
            {t.roles.map((r, i) => (
              <div key={r} style={{ padding:"1rem 1.5rem", borderRight:(i+1)%3!==0?`1px solid ${C.rule}`:"none", borderBottom:`1px solid ${C.rule}`, fontFamily:"'Archivo',sans-serif", fontSize:"0.88rem", color:C.ink, display:"flex", alignItems:"center", gap:"0.75rem" }}>
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
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:"#fff", marginBottom:"3rem" }}>{t.processH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"2px", background:"rgba(255,255,255,0.05)" }}>
            {t.steps.map(s => (
              <div key={s.n} style={{ background:C.inkLight, padding:"2.5rem 2rem" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"2.5rem", fontWeight:700, color:C.orange, letterSpacing:"-0.015em", lineHeight:1, marginBottom:"1.5rem" }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1rem", color:"#fff", letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{s.h}</h3>
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
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.orange }}>0{i+1}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(0.95rem,2vw,1.1rem)", color:C.ink, letterSpacing:"-0.01em" }}>{post.title[lang]}</span>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.muted, whiteSpace:"nowrap" }}>{post.date}</span>
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
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.7rem,3.2vw,2.5rem)", color:"#fff", letterSpacing:"-0.015em", lineHeight:1, marginBottom:"0.75rem" }}>{t.ctaH}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", maxWidth:"400px", lineHeight:1.7 }}>{t.ctaP}</p>
          </div>
          <button onClick={() => setPage("contact")} style={{ background:"#fff", color:C.orange, padding:"14px 32px", fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >{t.cta}</button>
        </div>
      </section>
    </div>
  );
}

// ─── SIMON PAGE ───────────────────────────────────────────────────────────────
const MEMBERS = {
  "robin-anisef": {
    cta:{en:"Got a fashion role to fill in Montreal or Toronto? Talk to Robin.",fr:"Un poste en mode à combler à Montréal ou à Toronto? Parle à Robin."},
    g:{en:"she",fr:"elle"},
    name:"Robin Anisef",
    lede:{en:"Twenty years in Canadian fashion. The people you're looking for, she already knows by name.",fr:"Vingt ans dans la mode canadienne. Les gens que tu cherches, elle les connaît déjà par leur nom."},
    geo:{en:"Montreal and Toronto",fr:"Montréal et Toronto"},
    covers:[{en:"Buyers and senior buyers",fr:"Acheteurs et acheteurs seniors"}, {en:"Brand managers",fr:"Gestionnaires de marque"}, {en:"Designers and creative directors",fr:"Designers et directeurs de création"}, {en:"Pattern technicians",fr:"Techniciens de patron"}, {en:"Product development",fr:"Développement de produit"}, {en:"Production coordination",fr:"Coordination de production"}, {en:"Merchandising and planning",fr:"Marchandisage et planification"}],
    proof:{ n:"17", label:{en:"people placed at the same client",fr:"personnes placées chez le même client"}, ctx:{en:"Over seven years. In an industry where most searches are one offs, that's the only test that counts.",fr:"Sur sept ans. Dans une industrie où la plupart des mandats sont des one shot, c'est le seul test qui compte."} },
    how:[{h:{en:"She calls, she doesn't write",fr:"Elle appelle, elle n'écrit pas"},p:{en:"A senior buyer gets messages every month. What makes them answer is recognizing the name on the other end.",fr:"Un acheteur senior reçoit des messages tous les mois. Ce qui le fait répondre, c'est de reconnaître le nom au bout du fil."}}, {h:{en:"Two or three names, not ten",fr:"Deux ou trois noms, pas dix"},p:{en:"If she brings you ten, she hasn't done her job. The shortlist is the work, not the by-product.",fr:"Si elle en présente dix, c'est qu'elle n'a pas fait son travail. La courte liste, c'est le travail, pas le résidu."}}, {h:{en:"She knows the calendar",fr:"Elle connaît le calendrier"},p:{en:"In fashion, when you recruit matters as much as what you offer. She talks to people six months before their window opens.",fr:"En mode, le moment où tu recrutes compte autant que ce que tu offres. Elle parle aux gens six mois avant que leur fenêtre s'ouvre."}}],
  },
  "stephanie-lanoie": {
    cta:{en:"Got a plant role to fill in Quebec? Talk to Stéphanie.",fr:"Un poste à combler dans une usine au Québec? Parle à Stéphanie."},
    g:{en:"she",fr:"elle"},
    name:"Stéphanie Lanoie",
    lede:{en:"Twenty two clients, seventy searches. She closes fast because she prepares both sides.",fr:"Vingt-deux clients, soixante-dix mandats. Elle ferme vite parce qu'elle prépare les deux côtés."},
    geo:{en:"Quebec",fr:"Québec"},
    covers:[{en:"Plant management",fr:"Direction d'usine"}, {en:"Production and supervision",fr:"Production et supervision"}, {en:"Quality and food safety",fr:"Qualité et salubrité"}, {en:"Maintenance and engineering",fr:"Maintenance et ingénierie"}, {en:"Supply chain",fr:"Chaîne d'approvisionnement"}],
    proof:{ n:"70", label:{en:"searches from 22 clients",fr:"mandats confiés par 22 clients"}, ctx:{en:"Six of them gave her five or more. One gave her eleven.",fr:"Six d'entre eux lui en ont donné cinq ou plus. Un lui en a donné onze."} },
    how:[{h:{en:"She calls the candidate the day before",fr:"Elle appelle le candidat la veille"},p:{en:"Who they're meeting, what the client actually wants, what to say about the gaps. Twenty minutes that change the outcome.",fr:"Qui il rencontre, ce que le client cherche vraiment, quoi répondre sur les trous du CV. Vingt minutes qui changent le résultat."}}, {h:{en:"She sees the counter-offer coming",fr:"Elle voit venir la contre-offre"},p:{en:"She asks the question by the second conversation. If the candidate hesitates, it gets settled before the offer, not after.",fr:"Elle pose la question dès la deuxième conversation. Si le candidat hésite, ça se règle avant l'offre et pas après."}}, {h:{en:"She asks for feedback the same day",fr:"Elle demande un retour le jour même"},p:{en:"Not a decision, feedback. That's what lets her adjust before the right candidate is gone.",fr:"Pas une décision, un retour. C'est ce qui lui permet d'ajuster avant de perdre le bon candidat."}}],
  },
  "mathieu-roy": {
    cta:{en:"A plant outside the big centres looking for someone? Talk to Mathieu.",fr:"Une usine en région qui cherche quelqu'un? Parle à Mathieu."},
    g:{en:"he",fr:"il"},
    name:"Mathieu Roy",
    lede:{en:"Thirty one of his thirty six placements were in food plants. He knows all of Quebec, not just the highway.",fr:"Trente-et-un de ses trente-six placements sont en usine alimentaire. Il connaît tout le Québec, pas juste l'autoroute."},
    geo:{en:"Quebec, cities and regions",fr:"Québec, grands centres et régions"},
    covers:[{en:"Production management",fr:"Gérance de production"}, {en:"Quality and food safety",fr:"Qualité et salubrité"}, {en:"Operations",fr:"Opérations"}, {en:"Sales and territory reps",fr:"Ventes et représentation"}, {en:"Plant management",fr:"Direction d'usine"}],
    proof:{ n:"78 %", label:{en:"of his placements came from returning clients",fr:"de ses placements viennent de clients qui revenaient"}, ctx:{en:"Across thirty six placements. A client who hands you a second search is the only review that counts.",fr:"Sur trente-six placements. Un client qui te redonne un mandat, c'est le seul avis qui compte."} },
    how:[{h:{en:"He asks the life questions first",fr:"Il pose les questions de vie en premier"},p:{en:"Before the resume. The partner, the kids, the school, the house. Outside the big centres, that's what decides, not the salary.",fr:"Avant le CV. Le conjoint, les enfants, l'école, la maison. En région, c'est ça qui décide, pas le salaire."}}, {h:{en:"He stays in touch between steps",fr:"Il reste en contact entre les étapes"},p:{en:"A candidate who disappears is rarely a candidate problem. It's a communication problem, and that can be fixed.",fr:"Un candidat qui disparaît, c'est rarement un problème de candidat. C'est un problème de communication, et ça se règle."}}, {h:{en:"He knows the area",fr:"Il connaît le coin"},p:{en:"He has lived all over Quebec. When a plant is three hours from Montreal, he knows what he's talking about.",fr:"Il a habité un peu partout au Québec. Quand une usine est à trois heures de Montréal, il sait de quoi il parle."}}],
  },
  "rana-yamak": {
    cta:{en:"Got a commercial role in Ontario or the United States? Talk to Rana.",fr:"Un poste commercial à combler en Ontario ou aux États-Unis? Parle à Rana."},
    g:{en:"she",fr:"elle"},
    name:"Rana Yamak",
    lede:{en:"The top of the commercial market in food ingredients. Median salary of her placements: a hundred thousand dollars.",fr:"Le haut du marché commercial en ingrédients alimentaires. Salaire médian de ses placements: cent mille dollars."},
    geo:{en:"Ontario and the United States",fr:"Ontario et États-Unis"},
    covers:[{en:"Account management",fr:"Gestion de comptes"}, {en:"Business development",fr:"Développement des affaires"}, {en:"Territory sales",fr:"Représentation de territoire"}, {en:"Quality and food safety",fr:"Qualité et salubrité"}, {en:"Operations",fr:"Opérations"}],
    proof:{ n:"100 000 $", label:{en:"median salary of her placements",fr:"salaire médian de ses placements"}, ctx:{en:"Four of her first seven searches were six figures. She started at the top of the market.",fr:"Quatre de ses sept premiers mandats étaient à six chiffres. Elle a commencé en haut du marché."} },
    how:[{h:{en:"She defines the territory before searching",fr:"Elle définit le territoire avant de chercher"},p:{en:"How many accounts, how much revenue, what share is maintenance and what share is development. Without that, you're searching for a job that doesn't exist.",fr:"Combien de comptes, combien de revenu, quelle part de maintien et quelle part de développement. Sans ça, on cherche un poste qui n'existe pas."}}, {h:{en:"She reads the commission plan",fr:"Elle regarde le plan de commissions"},p:{en:"If she can't explain it to a candidate in three minutes, it's too complicated to motivate anyone.",fr:"Si elle ne peut pas l'expliquer à un candidat en trois minutes, il est trop compliqué pour motiver quelqu'un."}}, {h:{en:"She doesn't sell a contact list",fr:"Elle ne vend pas un carnet d'adresses"},p:{en:"A contact list runs dry in eighteen months. She looks for someone who has a process.",fr:"Un carnet s'épuise en dix-huit mois. Elle cherche quelqu'un qui a un processus."}}],
  },
  "michaela-landers": {
    cta:{en:"Got a role to fill in an Ontario plant? Talk to Michaela.",fr:"Un poste à combler dans une usine ontarienne? Parle à Michaela."},
    g:{en:"she",fr:"elle"},
    name:"Michaela Landers",
    lede:{en:"Thirty five companies in under four years. She walks into a new plant and reads it fast.",fr:"Trente-cinq entreprises en moins de quatre ans. Elle entre dans une nouvelle usine et elle la lit vite."},
    geo:{en:"Ontario",fr:"Ontario"},
    covers:[{en:"Production and operations",fr:"Production et opérations"}, {en:"Quality and food safety",fr:"Qualité et salubrité"}, {en:"Supply chain",fr:"Chaîne d'approvisionnement"}, {en:"Supervision",fr:"Supervision"}, {en:"Plant management",fr:"Direction d'usine"}],
    proof:{ n:"35", label:{en:"client companies in under four years",fr:"entreprises clientes en moins de quatre ans"}, ctx:{en:"Roughly nine new organizations a year. Most recruiters discover two or three in the same span.",fr:"À peu près neuf nouvelles organisations par année. La plupart des recruteurs en découvrent deux ou trois."} },
    how:[{h:{en:"She visits before she searches",fr:"Elle visite avant de chercher"},p:{en:"Thirty minutes on the floor says more about retention than any interview grid.",fr:"Trente minutes sur le plancher en disent plus long sur la rétention que n'importe quelle grille d'entrevue."}}, {h:{en:"She asks thirty questions",fr:"Elle pose trente questions"},p:{en:"Why the role is open, who was there before, what would make you say no to someone who has everything else.",fr:"Pourquoi le poste est ouvert, qui était là avant, ce qui te ferait dire non à quelqu'un qui a tout le reste."}}, {h:{en:"She rewrites the description",fr:"Elle réécrit la description"},p:{en:"In nearly every search she opens, the description dated from the last hire and no longer described the role.",fr:"Dans presque tous ses mandats, la description datait de la dernière embauche et ne décrivait plus le poste."}}],
  },
  "richard-saucier": {
    cta:{en:"A hiring need in Ontario or Quebec? Talk to Richard.",fr:"Un besoin d'embauche en Ontario ou au Québec? Parle à Richard."},
    g:{en:"he",fr:"il"},
    name:"Richard Saucier",
    lede:{en:"Thirty years in the food industry before joining Proforce. He already knows the people others have to go find.",fr:"Trente ans dans l'alimentaire avant de se joindre à Proforce. Il connaît déjà le monde que les autres doivent aller chercher."},
    geo:{en:"Ontario and Quebec",fr:"Ontario et Québec"},
    covers:[{en:"Plant management and operations",fr:"Direction d'usine et opérations"}, {en:"Quality and food safety",fr:"Qualité et salubrité"}, {en:"Supply chain",fr:"Chaîne d'approvisionnement"}, {en:"Sales and business development",fr:"Ventes et développement des affaires"}, {en:"General management",fr:"Direction générale"}],
    proof:{ n:"30", label:{en:"years in the food industry",fr:"ans dans l'industrie alimentaire"}, ctx:{en:"A business developer starting from scratch needs three years to build a contact list. Richard has had one for a long time.",fr:"Un développeur d'affaires qui part de zéro met trois ans à se bâtir un carnet. Richard en a un depuis longtemps."} },
    how:[{h:{en:"He talks about the plant before the resume",fr:"Il parle de l'usine avant du CV"},p:{en:"Floor culture decides who stays. A supervisor who is excellent elsewhere can fall flat at your plant.",fr:"La culture du plancher décide qui va rester. Un superviseur excellent ailleurs peut se casser les dents chez toi."}}, {h:{en:"He says things as they are",fr:"Il dit les choses comme elles sont"},p:{en:"If the role has its challenges, say so. The right candidate will respect it. The wrong one walks away, and that's a good thing.",fr:"Si le poste a ses défis, il faut le dire. Le bon candidat va respecter ça. Le mauvais va se retirer, et tant mieux."}}, {h:{en:"He opens, the team delivers",fr:"Il ouvre, l'équipe livre"},p:{en:"He isn't alone. The searches he opens are delivered by recruiters who specialize in that market.",fr:"Il n'est pas seul. Les mandats qu'il ouvre sont livrés par des recruteurs spécialisés dans ce marché."}}],
  },
};

/* ── Page personnelle ── une seule structure pour les six membres.
   Le contenu vient de MEMBERS, la photo, le titre, le secteur, la bio et
   la liste d'articles viennent de TEAM: une seule source par information. */
function MemberPage({ lang, setPage, slug, setBlogPost }) {
  const d = MEMBERS[slug];
  const m = TEAM.find(x => x.name === d.name);
  const posts = POSTS.filter(p => (m.articles || []).includes(p.id));

  return (
    <div>
      <section style={{ background:C.ink, padding:"9rem 2rem 3.5rem" }}>
        <div className="two-col" style={{ maxWidth:"1000px", margin:"0 auto", display:"grid", gridTemplateColumns:"240px 1fr", gap:"3rem", alignItems:"center" }}>
          <div className="team-photo" style={{ maxWidth:"240px" }}><Avatar m={m} full /></div>
          <div>
            <div style={{ height:"2px", width:"56px", background:C.orange, marginBottom:"1.4rem" }} />
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2rem,4.4vw,3.2rem)", textTransform:"uppercase", letterSpacing:"-0.005em", color:"#fff", lineHeight:1.05, marginBottom:"0.5rem" }}>{m.name}</h1>
            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, marginBottom:"1.6rem" }}>{m.title[lang]} &nbsp;/&nbsp; {m.sector[lang]}</div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.15rem,2.2vw,1.5rem)", lineHeight:1.4, color:"rgba(255,255,255,0.88)" }}>{d.lede[lang]}</p>
          </div>
        </div>
      </section>

      {/* Territoire */}
      <section style={{ background:"#fff", padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?`What ${d.g.en} covers`:"Son territoire"}</Eyebrow>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:"0", border:`1px solid ${C.rule}`, marginBottom:"1.5rem" }}>
            {d.covers.map((c,i) => (
              <div key={c.en} style={{ padding:"0.95rem 1.4rem", borderRight:`1px solid ${C.rule}`, borderBottom:`1px solid ${C.rule}`, fontFamily:"'Archivo',sans-serif", fontSize:"0.86rem", color:C.ink, display:"flex", alignItems:"center", gap:"0.7rem" }}>
                <span style={{ color:C.orange, fontSize:"0.68rem" }}>&#9656;</span>{c[lang]}
              </div>
            ))}
          </div>
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.78rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.muted }}>
            {lang==="en"?"Territory":"Territoire"} &nbsp;/&nbsp; {d.geo[lang]}
          </p>
        </div>
      </section>

      {/* Le chiffre */}
      <section style={{ background:C.paperDark, padding:"4rem 2rem" }}>
        <div className="two-col" style={{ maxWidth:"1000px", margin:"0 auto", display:"grid", gridTemplateColumns:"minmax(0,300px) 1fr", gap:"3rem", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:600, fontSize:"clamp(3.4rem,8vw,5rem)", lineHeight:1, color:C.orange, marginBottom:"0.6rem" }}>{d.proof.n}</div>
            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", lineHeight:1.5, color:C.ink }}>{d.proof.label[lang]}</div>
          </div>
          <p style={{ fontSize:"1rem", lineHeight:1.8, color:C.muted }}>{d.proof.ctx[lang]}</p>
        </div>
      </section>

      {/* Bio */}
      <section style={{ background:"#fff", padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto" }}>
          {m.bio[lang].split("\n\n").map((para,i) => (
            <p key={i} style={{ fontSize:"1rem", lineHeight:1.85, color:C.muted, marginBottom:"1.2rem" }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Comment elle travaille */}
      <section style={{ background:"#fff", padding:"1rem 2rem 4rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?`How ${d.g.en} works`:`Comment ${d.g.fr} travaille`}</Eyebrow>
          <div className="three-col num-list" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"2rem" }}>
            {d.how.map((x,i) => (
              <div key={x.h.en}>
                <div>{String(i+1).padStart(2,"0")}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:C.ink, marginBottom:"0.6rem" }}>{x.h[lang]}</h3>
                <p style={{ color:C.muted, fontSize:"0.86rem", lineHeight:1.75 }}>{x.p[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section style={{ background:C.paperDark, padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?`What ${d.g.en} writes about`:`Ce qu${d.g.fr==="elle"?"'elle":"'il"} écrit`}</Eyebrow>
          <div style={{ borderTop:`1px solid ${C.rule}` }}>
            {posts.map((p,i) => (
              <button key={p.id} onClick={() => setBlogPost(p.id)} style={{ width:"100%", textAlign:"left", display:"grid", gridTemplateColumns:"46px 1fr 110px", gap:"1.2rem", alignItems:"start", padding:"1.4rem 0", borderBottom:`1px solid ${C.rule}` }} className="post-row">
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.orange, letterSpacing:"0.08em", paddingTop:"0.25rem" }}>{String(i+1).padStart(2,"0")}</div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.08rem", color:C.ink, lineHeight:1.35, marginBottom:"0.3rem" }}>{p.title[lang]}</div>
                  <div style={{ fontSize:"0.84rem", lineHeight:1.6, color:C.muted, fontStyle:"italic", fontFamily:"'Playfair Display',serif" }}>{p.excerpt[lang]}</div>
                </div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", color:C.muted, textAlign:"right", paddingTop:"0.25rem" }}>{p.date}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ background:C.ink, padding:"4rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.5rem,3vw,2.1rem)", color:"#fff", lineHeight:1.3, marginBottom:"1.8rem", maxWidth:"620px" }}>
            {d.cta[lang]}
          </h2>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", alignItems:"center" }}>
            <button className="btn-orange" onClick={() => setPage("contact")}>{lang==="en"?"Get in touch":"Nous contacter"}</button>
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.45)", borderBottom:"1px solid rgba(255,255,255,0.18)", paddingBottom:"2px" }}>
              <LinkedInIcon /> LinkedIn, {m.name}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function SimonPage({ lang, setPage }) {
  const simonPosts = POSTS.filter(p =>
    (TEAM.find(m => m.name === "Simon St-Amand")?.articles || []).includes(p.id)
  );

  const t = {
    en:{
      eyebrow:"Simon St-Amand, President, Proforce Personnel",
      h1:"He applied to Proforce.", h1i:"They didn't call him back.", h1ii:"Now he runs it.",
      story1:"Simon St-Amand didn't grow up thinking he'd become a recruiter. He grew up watching his grandfather, the man who opened the first TV store in his village, build something from nothing. That stayed with him. He played football through CÉGEP, then spent five years coaching at the high school level, winning two Bols d'Or. Two provincial championships. He learned early what it means to be accountable to a team.",
      story2:"Before Proforce, Simon recruited for retail at Parcours (Boutiques Séduction), placed temporary workers at Travail Global, then moved into the food industry with Alimentation Maison, covering Montreal and the South Shore in sales coaching and recruiting. He joined Proforce in 2015 under David Inzlicht and Christopher Livingstone. When he first applied, he didn't even get a callback. He applied again. He got in. Once inside, he didn't just fill a role, he built one. He founded Proforce's food division from scratch, opened Ontario and the Maritimes as new territories, built the team that runs those markets today, and became President and shareholder in 2018.",
      story3:"Today Proforce's food practice covers Quebec, Ontario, the Maritimes and cross border US mandates. Simon leads business development and keeps the senior searches in food and fashion for himself.",
      story4:"Since 2019 he has personally placed more than 100 people. Plant managers, quality directors, sales directors, operations directors and VPs. Twenty nine of those roles paid $100,000 or more, the level where a bad hire costs a company a full year. And 78 % of those placements came from clients who were coming back: twenty companies gave him a second search, five gave him five or more.",
      story5:"His standard is simple: less than two years in role is a failure. The guarantee starts at 90 days and runs up to a year. He will say no before taking a search he cannot deliver, and it costs him searches. He treats every mandate like it is his own business, because that is how he would want to be treated.",
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
      story3:"Aujourd'hui la pratique alimentaire de Proforce couvre le Québec, l'Ontario, les Maritimes et des mandats transfrontaliers aux États-Unis. Simon dirige le développement des affaires et garde pour lui les mandats séniors en alimentaire et en mode.",
      story4:"Depuis 2019 il a personnellement placé plus de 100 personnes. Des directeurs d'usine, des directeurs qualité, des directeurs des ventes, des directeurs et VP des opérations. Vingt-neuf de ces postes sont à 100 000 $ et plus, le calibre où une mauvaise embauche coûte une année complète à une entreprise. Et 78 % de ces placements viennent de clients qui revenaient: vingt entreprises lui ont redonné un mandat, cinq lui en ont confié cinq ou plus.",
      story5:"Sa barre est simple: moins de deux ans en poste, c'est un échec. La garantie commence à 90 jours et va jusqu'à un an. Il va dire non avant de prendre un mandat qu'il ne peut pas livrer, et ça lui coûte des mandats. Il traite chaque recherche comme si c'était sa propre business, parce que c'est comme ça qu'il voudrait être traité.",
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
      <section style={{ background:C.ink, minHeight:"32vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"9rem 2rem 3.5rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"80px", left:"2rem", right:"2rem" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.3)" }}>{t.eyebrow}</span>
          </div>
        </div>
        <div style={{ position:"absolute", right:"-1rem", bottom:"-2rem", fontFamily:"'Playfair Display',serif", fontSize:"clamp(10rem,25vw,22rem)", fontWeight:700, color:"rgba(232,93,26,0.05)", lineHeight:1, userSelect:"none", letterSpacing:"-0.025em" }}>SS</div>
        <div style={{ maxWidth:"900px", position:"relative" }}>
          <div style={{ height:"2px", background:C.orange, marginBottom:"1.6rem" }} className="fu" />
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(2.1rem,5vw,3.9rem)", letterSpacing:"-0.005em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:"0.5rem" }}>{t.h1}</h1>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:400, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", color:"rgba(255,255,255,0.45)", lineHeight:0.95, marginBottom:"0.5rem" }}>{t.h1i}</h2>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:"clamp(1.7rem,3.6vw,2.8rem)", letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:1.05, color:C.orange, lineHeight:0.95 }}>{t.h1ii}</h2>
        </div>
      </section>

      {/* Story */}
      <section style={{ background:C.white, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <Divider style={{ marginBottom:"3rem" }} />
          {[t.story1, t.story2, t.story3, t.story4, t.story5].map((para, i) => (
            <p key={i} style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", lineHeight:1.9, color:C.inkLight, fontWeight:300, marginBottom:"1.75rem" }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ background:C.paperDark, padding:"6rem 2rem" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <Eyebrow>{lang==="en"?"Philosophy":"Philosophie"}</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:C.ink, marginBottom:"3rem" }}>{t.philH}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"3rem" }}>
            {[[t.p1h,t.p1p,"01"],[t.p2h,t.p2p,"02"],[t.p3h,t.p3p,"03"]].map(([h,p,n]) => (
              <div key={n}>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.62rem", letterSpacing:"0.04em", color:C.orange, marginBottom:"1.25rem" }}>{n}</div>
                <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.6rem" }}>{h}</h3>
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
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.015em", color:"#fff", marginBottom:"4rem" }}>
            {lang==="en" ? "Nobody does this alone." : "Personne ne fait ça seul."}
          </h2>

          {/* Christopher Livingstone */}
          <div style={{ borderLeft:`3px solid ${C.orange}`, paddingLeft:"2rem", marginBottom:"3.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
              <div style={{ width:"44px", height:"44px", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:"#fff", fontWeight:700, flexShrink:0 }}>CL</div>
              <div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:"#fff" }}>Christopher Livingstone</div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:C.orange, marginTop:"2px" }}>
                  {lang==="en"?"Recruitment Mentor":"Mentor en recrutement"}
                </div>
              </div>
              <a href="https://www.linkedin.com/in/chrislivingstone" target="_blank" rel="noopener noreferrer" style={{
                marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:"5px",
                fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.35)", borderBottom:"1px solid rgba(255,255,255,0.15)", paddingBottom:"2px", transition:"color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.color=C.orange}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}
              ><LinkedInIcon />LinkedIn</a>
            </div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"rgba(255,255,255,0.65)", lineHeight:1.85, fontWeight:300 }}>
              {lang==="en"
                ? "Christopher hired me. He's the one who took a chance on me when I didn't have a recruitment background, and he taught me everything about this business, how to build relationships, how to have the right conversations, how to actually help people instead of just filling roles. Everything I know about recruiting, I learned from watching him and listening to him. I don't take that lightly."
                : "C'est Christopher qui m'a embauché. C'est lui qui a pris une chance sur moi quand j'avais pas de background en recrutement, et c'est lui qui m'a tout appris sur ce métier, comment bâtir des relations, comment avoir les bonnes conversations, comment vraiment aider des gens plutôt que juste combler des postes. Tout ce que je sais sur le recrutement, je l'ai appris en le regardant faire et en l'écoutant. Je prends pas ça à la légère."
              }
            </p>
          </div>

          {/* David Inzlicht */}
          <div style={{ borderLeft:`3px solid rgba(255,255,255,0.15)`, paddingLeft:"2rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
              <div style={{ width:"44px", height:"44px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Archivo',sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.6)", fontWeight:700, flexShrink:0 }}>DI</div>
              <div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.05rem", color:"#fff" }}>David Inzlicht</div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.02em", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>
                  {lang==="en"?"Business Mentor, Founder, Proforce Personnel":"Mentor en affaires, Fondateur, Proforce Personnel"}
                </div>
              </div>
            </div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"rgba(255,255,255,0.55)", lineHeight:1.85, fontWeight:300 }}>
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
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1rem", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.2rem" }}>{item.title[lang]}</div>
                <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.muted }}>{item.outlet} · {item.date}</div>
              </div>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.orange, whiteSpace:"nowrap" }}>
                  {lang==="en"?"Listen →":"Écouter →"}
                </a>
              )}
            </div>
          ))}
          <div style={{ marginTop:"1.5rem" }}>
            <button onClick={() => setPage("press")} style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em", color:C.orange, borderBottom:`1px solid ${C.orange}` }}>
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
              <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.6rem" }}>
                {lang==="en"?"Coach, Football & Softball":"Coach, Football & Balle-molle"}
              </h3>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.8, fontWeight:300 }}>
                {lang==="en"
                  ? "Simon coached high school football for five years and won two Bols d'Or, provincial championships. He's been coaching softball for ten years. The same things that make a good team make a good recruitment: clear roles, honest feedback, and people who show up when it counts."
                  : "Simon a coaché le football au secondaire pendant cinq ans et remporté deux Bols d'Or, des championnats provinciaux. Il coache la balle-molle depuis dix ans. Ce qui fait une bonne équipe, c'est ce qui fait un bon recrutement : des rôles clairs, du feedback honnête et des gens qui se présentent quand ça compte."}
              </p>
            </div>
            <div>
              <div style={{ width:"32px", height:"3px", background:C.orange, marginBottom:"1.25rem" }} />
              <h3 style={{ fontFamily:"'Archivo',sans-serif", fontSize:"1.1rem", color:C.ink, marginBottom:"0.6rem" }}>
                {lang==="en"?"Father of three":"Père de trois filles"}
              </h3>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:C.muted, lineHeight:1.8, fontWeight:300 }}>
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
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.6rem", color:C.orange }}>0{i+1}</span>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(0.9rem,2vw,1.05rem)", color:C.ink, letterSpacing:"-0.01em", marginBottom:"0.2rem" }}>{post.title[lang]}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.83rem", color:C.muted, fontStyle:"italic" }}>{post.excerpt[lang]}</div>
                </div>
                <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:"0.58rem", color:C.muted, whiteSpace:"nowrap" }}>{post.date}</span>
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
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:"rgba(255,255,255,0.65)", lineHeight:1.8, marginBottom:"3rem", maxWidth:"520px" }}>{t.conP}</p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", alignItems:"center", marginBottom:"2.5rem" }}>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-orange" onClick={() => track.contactClick()}>{t.cta}</a>
            <button className="btn-ghost" onClick={() => setPage("contact")} style={{ borderColor:"rgba(255,255,255,0.25)", color:"#fff" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
            >{t.cta2}</button>
          </div>
          <a href="https://www.linkedin.com/in/simonstamand" target="_blank" rel="noopener noreferrer" style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            fontFamily:"'Archivo',sans-serif", fontSize:"0.65rem", letterSpacing:"0.02em",
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
    "robin-anisef": <MemberPage lang={lang} setPage={go} slug="robin-anisef" setBlogPost={(id) => goPost(id)} />,
    "stephanie-lanoie": <MemberPage lang={lang} setPage={go} slug="stephanie-lanoie" setBlogPost={(id) => goPost(id)} />,
    "mathieu-roy": <MemberPage lang={lang} setPage={go} slug="mathieu-roy" setBlogPost={(id) => goPost(id)} />,
    "rana-yamak": <MemberPage lang={lang} setPage={go} slug="rana-yamak" setBlogPost={(id) => goPost(id)} />,
    "michaela-landers": <MemberPage lang={lang} setPage={go} slug="michaela-landers" setBlogPost={(id) => goPost(id)} />,
    "richard-saucier": <MemberPage lang={lang} setPage={go} slug="richard-saucier" setBlogPost={(id) => goPost(id)} />,
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
      <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
        className="float-cta"
        onClick={() => track.contactClick()}
        style={{
          position:"fixed", bottom:"2rem", right:"2rem", zIndex:150,
          background:C.orange, color:"#fff",
          padding:"12px 20px",
          fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:"0.75rem",
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
