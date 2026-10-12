# Site Thomas Boulet Coaching

Site vitrine et page de vente, hébergé gratuitement sur GitHub Pages.
L'app clients reste dans le dépôt `tb-coaching-app`.

## Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : positionnement, différenciation, Méthode Charpente |
| `methode.html` | Mon histoire, la méthode, l'app TB my Coach, mes engagements |
| `coaching.html` | Page de vente du cycle de 12 semaines + formulaire de candidature |
| `offres.html` | Boutique : les 4 niveaux d'offres (générée depuis `produits.js`) |
| `calculateur.html`, `calcul.js` | Calculateur de force : 1RM, table RPE, délai pour un objectif, capture d'e-mail |
| `merci.html` | Page affichée après un paiement Stripe (`?offre=<id>`) |
| `ressources.html` | Guides gratuits (téléchargement contre e-mail) |
| `mentions-legales.html` | Mentions légales (SIRET et adresse à compléter) |
| `404.html` | Page d'erreur |
| `style.css`, `site.js` | Mise en forme et scripts communs |

## Ajouter ou modifier une offre

Tout se passe dans **`produits.js`** : copier un bloc `{ ... }`, changer les textes, enregistrer.
La page Offres se met à jour toute seule. Pour vendre en ligne, mettre le lien de paiement Stripe
dans le champ `lien` et passer le `statut` à `"dispo"`.

## Où arrivent les demandes

Candidatures, téléchargements du guide et inscriptions aux listes d'attente arrivent dans la table
`leads` de Supabase (la même que l'app), avec dans `data` : `origine: "site"` et `demande`
(`candidature`, `guide-3h`, `calculateur` ou `attente` + l'offre concernée).
Les demandes `calculateur` contiennent aussi `mouvement`, `e1rm`, `objectif` et `delai` : réponds-leur à la main sous 48 h, c'est la promesse affichée.

## Brancher le nom de domaine (thomasboulet-coaching.fr)

1. Acheter le domaine (OVH, Gandi…).
2. Dans le dépôt GitHub : Settings → Pages → Custom domain → `thomasboulet-coaching.fr`, puis cocher « Enforce HTTPS ».
3. Chez le registraire, créer les enregistrements DNS indiqués par GitHub
   (4 enregistrements A vers 185.199.108.153, .109.153, .110.153, .111.153, et un CNAME `www` vers `thomasbouletcoaching-lab.github.io`).

## Ajouter une photo soi-même

1. **Mettre la photo dans le dossier `img/`** : ouvrir `img/` sur GitHub → « Add file » → « Upload files » → glisser la photo → « Commit changes ». Format JPG ou WebP, pas trop lourd (quelques centaines de Ko suffisent, pas besoin de la pleine résolution du téléphone). Donner un nom simple sans espace ni accent, ex. `thomas-salle-2.jpg`.
2. **Ouvrir la page HTML à modifier** (icône crayon), et coller où on veut dans le texte :
   ```html
   <img class="photo-libre" src="img/thomas-salle-2.jpg" alt="Thomas Boulet">
   ```
   La classe `photo-libre` (déjà prête dans `style.css`) centre l'image, l'arrondit et la limite à une taille raisonnable automatiquement — rien d'autre à faire pour un résultat correct par défaut.
3. **Recadrer/centrer sans rogner le fichier** : ajouter `style="object-position:X% Y%"` sur la balise. C'est la partie de la photo qui reste visible dans le cadre.
   - `object-position:50% 50%` = centré (par défaut).
   - `object-position:50% 20%` = garde le haut de la photo visible (utile pour un visage proche du haut).
   - `object-position:50% 80%` = garde le bas visible.
   - Exemple : `<img class="photo-libre" src="img/thomas-salle-2.jpg" alt="Thomas Boulet" style="object-position:50% 25%">`
4. **Changer la forme ou la taille** avec `style`, toujours sur la même balise :
   - Carrée plutôt que portrait : `style="aspect-ratio:1/1"`
   - Plus petite : `style="max-width:240px"`
   - Collée à droite du texte façon magazine (comme sur `methode.html`) : `style="float:right;max-width:220px;margin:4px 0 16px 22px"`
   - Tout combiner : `style="aspect-ratio:1/1;max-width:240px;object-position:50% 15%"`
5. **Commit changes** sur `main` : le site est à jour en 1 à 2 minutes. Si le résultat ne plaît pas, rouvrir le fichier et changer les pourcentages — aucun risque de casser quoi que ce soit, et l'historique des commits permet de revenir en arrière à tout moment (onglet « Commits »).

Ne jamais coller un pourcentage avec le signe `%` oublié ou une virgule à la place du point (`50%,20%` au lieu de `50% 25%`) : la position serait ignorée silencieusement, pas d'erreur visible.

## Faire une modification

Modifier le fichier sur GitHub (icône crayon), « Commit changes » sur `main` : le site est à jour en 1 à 2 minutes.
L'en-tête et le pied de page sont répétés dans chaque page : un changement de menu se fait dans toutes les pages.

## Paiement (Stripe)

Produit « Cycle Charpente – coaching 12 semaines » à 1 600 € créé dans Stripe, avec un lien de paiement
(facture automatique, mention « TVA non applicable, art. 293 B du CGI »).
Tarif fondateur : prix à 790 € sur le même produit, avec un lien de paiement **limité à 10 ventes** (Stripe le désactive tout seul après la 10e).
Liens en mode test : 790 € https://buy.stripe.com/test_4gMbJ0axh4dy7hr3ML7Vm01 · 1 600 € https://buy.stripe.com/test_8x200ieNxcK41X75UT7Vm00
Ils sont **en mode test** : ils ne sont pas affichés sur le site. Le parcours reste candidature → appel → envoi du lien.
Quand le compte Stripe sera en production, recréer le lien en mode réel ; il pourra alors aller dans
le champ `lien` de l'offre `cycle-12` de `produits.js` si l'on veut proposer le paiement direct.

## Vidéo de présentation (VSL) et résultats clients

Tout se règle dans **`produits.js`**, en bas du fichier :
- `window.SITE.vsl` : coller le lien YouTube (ou Vimeo, ou `video/vsl.mp4`). Le bloc vidéo apparaît en haut de la page « Le cycle ». Vide = caché.
- `window.RESULTATS` : ajouter un bloc par client (modèle dans le fichier). La section « Ils l'ont fait » apparaît sur l'accueil et sur la page « Le cycle » dès qu'il y a un résultat. Uniquement des résultats réels, avec l'accord écrit du client.

## Tarif fondateur (790 € pour les 10 premières places)

Dans `produits.js`, `window.SITE.fondateur = { total: 10, prises: 0 }`.
À chaque client qui paie le tarif fondateur, augmenter `prises` de 1 : le compteur de places se met à jour sur l'accueil et la page « Le cycle ».
Quand `prises` atteint 10, le site affiche automatiquement le prix normal (1 600 €) partout.

## La boutique (4 niveaux)

| Niveau | Offres | Prix | Livraison |
|---|---|---|---|
| 1 · Commencer seul | Programme 3H, Programme Plateau (8 semaines), Pack Tableurs | 29 €, 29 €, 39 € | PDF + Google Sheets envoyés par e-mail |
| 2 · App en autonomie | TB my Coach | 14,90 €/mois ou 119 €/an | Accès créé dans l'app |
| 3 · Cycles 6 mois | Cycle 3H, Cycle Force (24 semaines) | 179 € | Programme chargé dans l'app, 6 mois d'accès inclus |
| 4 · Coaching | Cycle Charpente 12 semaines, suivi mensuel | 790 → 1 600 €, 149 €/mois | Sur candidature |

Règle de passage : le prix d'un cycle 6 mois acheté dans les 30 derniers jours est déduit du coaching Charpente (à appliquer à la main sur le lien de paiement envoyé).

### Paiement et mode test

Chaque offre payante a deux champs dans `produits.js` : `stripe` (lien réel) et `stripeTest` (lien de test).
- `stripe` rempli → bouton d'achat visible par tout le monde.
- `stripe` vide → le public voit « Bientôt en vente » et peut laisser son e-mail (liste d'attente).
- Pour essayer la boutique toi-même : ajoute `?test=1` à l'adresse de la page Boutique. Les boutons mènent alors aux paiements de test (carte `4242 4242 4242 4242`, date future, n'importe quel code). `?test=0` pour sortir.

Produits créés dans Stripe (mode test, compte « Thomas Boulet Transformation ») avec facture automatique et mention TVA non applicable. Après paiement, Stripe renvoie vers `merci.html?offre=<id>`.
**Passage en réel** : recréer les mêmes produits et liens de paiement dans le compte Stripe en production (même redirection vers merci.html), puis coller chaque lien dans le champ `stripe` de l'offre.

La livraison est manuelle pour l'instant : Stripe t'envoie un e-mail à chaque vente, tu envoies les fichiers ou crées l'accès dans l'app sous 24 h (c'est ce qu'annonce la page merci).

## Calculateur

`calculateur.html` : à mettre en lien dans la bio Instagram pour les contenus « tu stagnes ».
Formules dans `calcul.js` (Epley, Brzycki, Lander, poids de corps ajouté pour tractions, dips et muscle-ups lestés ; table RPE de Tuchscherer).
Selon le délai calculé, la page propose le Programme Plateau (≤ 8 semaines), le Cycle Force (≤ 24 semaines) ou le coaching.
