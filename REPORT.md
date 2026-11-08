# Rapport : audit coaching et tunnel de vente (8 novembre 2026)

Tout est sur des branches, avec une PR chacune. Rien n'est en ligne, rien n'est envoyé, Stripe et Brevo n'ont pas été touchés.

| PR | Contenu |
|---|---|
| Site #2 (branche `claude/offre-fondateur`) | Audit, page de vente, page d'appel, calculateur, règlement du concours, 7 e-mails. Inclut la PR site #1 (source des demandes, carte pro). |
| App #6 (`claude/brevo-sync`) | Synchronisation site → Brevo |
| App #4 (`claude/objectif-10k`) | Onglet Business → Objectif (travail précédent) |

## Ce qui est fait

**Phase 1 : `AUDIT-COACHING.md`**
- **15 offres réelles comparées** (8 françaises, 7 étrangères) : prix ramené à la semaine, durée, promesse, garantie, preuves, bonus, tunnel. Chaque ligne a sa source.
- **Ton offre notée** : prix 2/5 au prix plein (4/5 en fondateur), crédibilité 2/5, différenciation 4/5, risque perçu 2/5.
- **Ce qui crée la confiance chez les meilleurs** : moyennes chiffrées sur de nombreux clients, garanties précises avec leurs conditions, prix transparent, délais honnêtes, rareté expliquée.
- **Gamme pour 10 000 €/mois avec 10 places** : cycle individuel (5 333 €) + cycle de groupe à 297 € (2 970 €) + suivi Maintien à 99 € (1 485 €) + app (899 €) = **10 687 €/mois encaissés**. Avec la TVA, cela fait 8 906 € HT. Pour atteindre 10 000 € HT, il faut des groupes de 45 personnes.

**Phase 2 : le site** (testé en rendu iPhone 390 px : 21/21 pour le tunnel, 9/9 pour la source des demandes)
- **Page de vente** (`coaching.html`) :
  - promesse « environ 3 h par semaine, sans régime » ;
  - tarif fondateur 790 € (1 600 € barré), qui passe seul au prix normal le 1er janvier ;
  - séance en salle, appels réservables, concours ;
  - tes chiffres comme preuve de méthode, garantie de prolongation, FAQ « j'ai déjà abandonné ».
- **Page d'appel** (`appel.html`) : 4 questions, demande enregistrée avec sa source, puis bouton vers `calendly.com/thomboulet/15min`. Tous les anciens liens Calendly 30 min du site mènent maintenant à cette page.
- **Calculateur 1RM** : la capture d'e-mail existait déjà. Elle annonce maintenant la séquence, transmet le 1RM, l'objectif et le délai, et les objectifs lointains mènent à l'appel.
- **Règlement du concours** (`concours.html`) : critères mesurés dans l'app, aucun tirage au sort.
- **Séquence Brevo** (`emails-brevo/`) : 7 e-mails sur 13 jours (J+0, 1, 3, 5, 7, 10, 13). Ce sont des brouillons HTML, vérifiés sur mobile, avec le lien de désinscription Brevo et des liens qui portent `?src=email-N`. Le guide de mise en place est dans `SEQUENCE.md`.
- **Synchronisation site → Brevo** (PR app #6) : fonction Supabase testée (6/6), clés dans les secrets Supabase, non déployée.

## Ce qui reste (avant de fusionner)
1. **Corriger les CGV** (`tb-coaching-app/cgv.html`) : 1 600 € (au lieu de 1 620 €), tarif fondateur 790 €, et la garantie de prolongation si tu la gardes.
2. **Valider ou retirer** la garantie (D18), le règlement du concours (D19) et la publication de tes chiffres (D25).
3. Fusionner la PR site #2 (qui contient la #1), puis app #4 et #6.
4. Mettre en route Brevo (`emails-brevo/SEQUENCE.md`) et la synchronisation (`supabase/functions/brevo-sync/README.md`).
5. Mettre à jour `prises` dans `produits.js` à chaque place fondateur vendue, si tu veux afficher la jauge.
6. Le 1er janvier : remplacer le tarif fondateur dans l'e-mail 7 et dans la fiche `cycle-12` de `produits.js`. La page de vente, elle, bascule seule.

## Les 3 actions que tu dois faire toi-même
1. **Relire et valider les engagements** (prix 1 600 € / 790 €, garantie de 4 semaines, règlement du concours), puis faire mettre à jour les CGV en conséquence. Sans ça, la page de vente promet des choses que tes conditions de vente ne disent pas.
2. **Brancher Brevo** : créer les listes « Calculateur » et « Appel » et une clé d'API, puis coller les 4 secrets dans Supabase et créer le webhook (15 minutes, pas à pas dans le README). Coller ensuite les 7 e-mails dans un scénario et t'envoyer chaque e-mail en test.
3. **Décider du lot du concours** : 6 mois de suivi léger (recommandé) ou 6 mois de coaching individuel (une place bloquée, soit 3 200 € de capacité perdue).
