/* CATALOGUE DES OFFRES
   C'est le seul fichier à modifier pour ajouter, retirer ou changer une offre.
   La page « Offres » se construit toute seule à partir de cette liste.

   Champs :
   - id         : identifiant court, sans espace ni accent
   - famille    : "accompagnement", "app" ou "ressources" (définit la rubrique)
   - titre      : nom de l'offre
   - statut     : "dispo" (disponible), "attente" (liste d'attente) ou "bientot"
   - desc       : une ou deux phrases
   - points     : liste de ce qui est inclus (facultatif)
   - prix       : texte du prix, ou "" pour ne rien afficher
   - note       : petite ligne sous le prix (facultatif)
   - bouton     : texte du bouton
   - lien       : où mène le bouton (page du site, lien Stripe, etc.)
                  laisser "" pour un statut "attente" : le bouton inscrit à la liste d'attente
   - phare      : true pour mettre l'offre en grand en haut de sa rubrique
*/
window.CATALOGUE = [
  /* ---------- NIVEAU 4 : ÊTRE COACHÉ ---------- */
  {
    id: "cycle-12",
    famille: "accompagnement",
    titre: "Le cycle Charpente, 12 semaines",
    statut: "dispo",
    phare: true,
    desc: "L'accompagnement complet : un programme écrit pour toi, ton alimentation organisée autour de vrais plats, et un suivi chaque semaine dans l'app TB my Coach.",
    points: [
      "Programme individualisé, ajusté chaque semaine selon ton carnet",
      "Plan alimentaire sans régime, adapté à tes goûts",
      "Bilan hebdomadaire commenté et messagerie avec moi",
      "Une séance offerte avec moi en salle à Paris",
      "Le prix d'un cycle 6 mois acheté dans les 30 jours précédents est déduit"
    ],
    prix: "540\u00a0€ / mois",
    note: "3 mensualités, soit 1 620 € au total. Sur candidature. TVA non applicable, art. 293 B du CGI.",
    bouton: "Voir le cycle en détail",
    lien: "coaching.html"
  },
  {
    id: "coaching-leger",
    famille: "accompagnement",
    titre: "Le coaching léger",
    statut: "dispo",
    pour: "Être guidé, sans engagement",
    desc: "Je construis et j'ajuste ton programme et ton plan dans l'app, tu m'écris quand tu en as besoin. Idéal après un cycle, ou pour démarrer accompagné à moindre coût.",
    points: [
      "Tout ce que contient Premium",
      "Programme et plan alimentaire construits et ajustés par moi",
      "Messagerie avec moi dans l'app",
      "Un bilan régulier de ta progression"
    ],
    prix: "89\u00a0€ / mois",
    note: "Sans engagement, résiliable chaque mois depuis l'app. TVA non applicable, art. 293 B du CGI.",
    bouton: "Choisir dans l'app",
    lien: "https://thomasbouletcoaching-lab.github.io/tb-coaching-app/"
  },

  /* ---------- NIVEAU 3 : LES CYCLES 6 MOIS ---------- */
  {
    id: "cycle-force",
    famille: "cycles",
    titre: "Cycle Force, 24 semaines",
    pour: "Tu t'entraînes déjà et tu stagnes",
    desc: "Six mois de progression écrits à l'avance pour faire repartir tes charges sur les mouvements de base : squat, développé, soulevé de terre, tractions et dips lestés.",
    points: [
      "24 semaines de séances écrites, 4 séances par semaine",
      "Charges calculées depuis ton 1RM, en RPE",
      "Livré dans l'app TB my Coach : 6 mois de Premium inclus",
      "Tests de force aux semaines 8, 16 et 24",
      "Déduit du coaching Charpente si tu passes au suivi dans les 30 jours"
    ],
    prix: "179\u00a0€",
    note: "Paiement unique. Inclut 6 mois de TB my Coach Premium. TVA non applicable, art. 293 B du CGI.",
    bouton: "Acheter le cycle",
    stripe: "",
    stripeTest: "https://buy.stripe.com/test_3cI5kC20L39u31b6YX7Vm07"
  },
  {
    id: "cycle-3h",
    famille: "cycles",
    titre: "Cycle 3H, 24 semaines",
    pour: "Tu as peu de temps",
    desc: "Six mois de progression en trois séances d'une heure par semaine, pour te remuscler et travailler ta composition corporelle quand le travail et la famille prennent tout le reste.",
    points: [
      "24 semaines de séances écrites, 3 heures par semaine",
      "Versions salle et maison pour les semaines chargées",
      "Livré dans l'app TB my Coach : 6 mois de Premium inclus",
      "Repères alimentaires simples, sans régime",
      "Déduit du coaching Charpente si tu passes au suivi dans les 30 jours"
    ],
    prix: "179\u00a0€",
    note: "Paiement unique. Inclut 6 mois de TB my Coach Premium. TVA non applicable, art. 293 B du CGI.",
    bouton: "Acheter le cycle",
    stripe: "",
    stripeTest: "https://buy.stripe.com/test_4gMaEWaxhfWgcBLfvt7Vm08"
  },

  /* ---------- NIVEAU 2 : L'APP EN AUTONOMIE ---------- */
  {
    id: "app-premium",
    famille: "app",
    titre: "TB my Coach Premium",
    statut: "dispo",
    phare: true,
    pour: "Être ton propre coach, avec mes outils",
    desc: "Tous les outils que j'utilise avec mes clients, sur ton propre programme : génération, surcharge progressive automatique, nutrition calculée.",
    points: [
      "Programme modifiable, régénérable, banque de programmes",
      "Surcharge progressive automatique et vue par exercice",
      "Plan alimentaire calculé avec tes plats, estimateur de repas",
      "Sans engagement, résiliable depuis l'app"
    ],
    prix: "9,99\u00a0€ / mois",
    note: "Ou 59,99 € par an. 7 jours d'essai gratuit. TVA non applicable, art. 293 B du CGI.",
    bouton: "Essayer 7 jours gratuitement",
    lien: "https://thomasbouletcoaching-lab.github.io/tb-coaching-app/"
  },
  {
    id: "app-gratuit",
    famille: "app",
    titre: "TB my Coach Gratuit",
    statut: "dispo",
    pour: "Démarrer et prendre l'habitude",
    desc: "Crée ton compte, réponds au questionnaire : ton programme de départ est généré, tu notes ta première séance dans la foulée.",
    points: [
      "Programme de départ généré par ton questionnaire",
      "Carnet d'entraînement, chronos, records",
      "Poids, mensurations, journal alimentaire simple",
      "Sans carte bancaire"
    ],
    prix: "Gratuit",
    note: "",
    bouton: "Créer mon compte",
    lien: "https://thomasbouletcoaching-lab.github.io/tb-coaching-app/"
  },

  /* ---------- NIVEAU 1 : COMMENCER SEUL ---------- */
  {
    id: "prog-plateau",
    famille: "commencer",
    titre: "Programme Plateau, 8 semaines",
    pour: "Tu stagnes",
    desc: "Huit semaines pour débloquer tes charges : une progression simple en RPE, construite autour de ton 1RM.",
    points: [
      "4 séances par semaine, mouvements de base",
      "Carnet Google Sheets qui calcule tes charges",
      "Test de force en semaine 8"
    ],
    prix: "29\u00a0€",
    note: "PDF + Google Sheets. Accès à vie.",
    bouton: "Acheter le programme",
    stripe: "",
    stripeTest: "https://buy.stripe.com/test_00wbJ0bBlcK4fNXab97Vm03"
  },
  {
    id: "prog-3h",
    famille: "commencer",
    titre: "Programme 3H, 8 semaines",
    pour: "Tu as peu de temps",
    desc: "Huit semaines pour reprendre ou relancer ton corps avec trois séances d'une heure, en salle ou à la maison.",
    points: [
      "3 séances par semaine, 1 heure chacune",
      "Carnet Google Sheets inclus",
      "Repères pour placer tes séances dans ta semaine"
    ],
    prix: "29\u00a0€",
    note: "PDF + Google Sheets. Accès à vie.",
    bouton: "Acheter le programme",
    stripe: "",
    stripeTest: "https://buy.stripe.com/test_eVqaEW8p99xS59j1ED7Vm02"
  },
  {
    id: "pack-tableurs",
    famille: "commencer",
    titre: "Pack Tableurs, entraînement et nutrition",
    pour: "Tu veux construire toi-même",
    desc: "Mes deux outils de travail en Google Sheets : le tableur Powerbuilding pour planifier ta force sur l'année, et le générateur de plans alimentaires à partir de vrais plats.",
    points: [
      "Tableur Powerbuilding : séries, charges, progression annuelle",
      "Générateur de plans alimentaires et calcul des besoins"
    ],
    prix: "39\u00a0€",
    note: "Google Sheets à copier dans ton Drive. Accès à vie.",
    bouton: "Acheter le pack",
    stripe: "",
    stripeTest: "https://buy.stripe.com/test_fZu28qgVF4dycBL1ED7Vm04"
  },

  /* ---------- GRATUIT ---------- */
  {
    id: "calculateur",
    famille: "ressources",
    titre: "Calculateur de force",
    statut: "dispo",
    desc: "Ton 1RM estimé, tes charges à chaque RPE et une estimation indicative du délai pour ton objectif, qui dépend de ta régularité et de ta récupération.",
    prix: "Gratuit",
    note: "En ligne, sans inscription.",
    bouton: "Calculer mon 1RM",
    lien: "calculateur.html"
  },
  {
    id: "guide-3h",
    famille: "ressources",
    titre: "Guide « 3H qui changent tout »",
    statut: "dispo",
    desc: "Comment construire un corps solide avec trois heures par semaine : entraînement, posture, cardio utile et récupération, expliqués simplement.",
    prix: "Gratuit",
    note: "PDF à télécharger.",
    bouton: "Recevoir le guide",
    lien: "ressources.html#guide-3h"
  },
  {
    id: "guide-sec-30",
    famille: "ressources",
    titre: "Guide « Être sec et musclé après 30 ans »",
    statut: "attente",
    desc: "Ce qui change après 30 ans, et comment travailler ta composition corporelle en gardant ta force et ta vie sociale.",
    prix: "Gratuit",
    note: "",
    bouton: "Être prévenu de sa sortie",
    lien: ""
  }
];

window.FAMILLES = {
  app: { niveau: "Pour commencer", titre: "L'app TB my Coach", intro: "L'application que j'ai construite pour mes clients. Gratuite pour démarrer, Premium pour avoir tous mes outils sur ton propre programme." },
  accompagnement: { niveau: "Être accompagné", titre: "Le coaching", intro: "Je construis ton programme, je lis ton carnet et j'ajuste. Dans la même app : ton historique te suit." },
  cycles: { niveau: "Programmes à l'unité", titre: "Les cycles de 6 mois", intro: "Six mois de progression déjà écrits par moi, livrés dans l'app avec 6 mois de Premium." },
  commencer: { titre: "Programmes et outils", intro: "Un programme de 8 semaines ou mes outils Google Sheets, à petit prix." },
  ressources: { titre: "Gratuit", intro: "Des outils et des guides pour avancer avec une méthode solide." }
};

/* RÉGLAGES DU SITE
   - vsl : lien de ta vidéo de présentation (YouTube, Vimeo, ou fichier .mp4 dans le dossier video/).
           Laisse "" tant qu'elle n'est pas prête : le bloc vidéo reste caché.
           Exemples : "https://www.youtube.com/watch?v=XXXXXXXXXXX" ou "video/vsl.mp4"
*/
window.SITE = {
  vsl: ""
};

/* RÉSULTATS CLIENTS
   La section « Ils l'ont fait » n'apparaît sur le site que lorsqu'il y a au moins un résultat ici.
   N'ajoute que des résultats réels, avec l'accord écrit du client (prénom ou initiale, chiffres, photo).

   Champs :
   - prenom   : "Arthur" ou "A."
   - profil   : "38 ans, cadre, 2 enfants"
   - duree    : "12 semaines"
   - chiffres : liste de résultats mesurés, ex. ["Squat : 80 → 110 kg", "Tour de taille : -6 cm"]
   - citation : sa phrase, mot pour mot
   - photo    : facultatif, ex. "img/clients/arthur.jpg" (avant/après, avec son accord)

   Exemple à copier (retire les // au début des lignes) :
   // {
   //   prenom: "A.",
   //   profil: "38 ans, cadre, 2 enfants",
   //   duree: "12 semaines",
   //   chiffres: ["Squat : 80 → 110 kg", "Tour de taille : -6 cm"],
   //   citation: "Pour la première fois, j'ai tenu trois mois sans lâcher.",
   //   photo: ""
   // },
*/
window.RESULTATS = [
];
