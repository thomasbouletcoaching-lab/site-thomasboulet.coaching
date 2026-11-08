# Séquence Brevo : 7 e-mails après le calculateur

Brouillons à importer dans Brevo, **aucun n'a été envoyé**. Pour qui : les personnes qui laissent leur e-mail sur le calculateur (demande `calculateur`). Les personnes qui ont déjà réservé un appel sortent de la séquence (voir « Réglages »).

| # | Envoi | Objet | Aperçu | Fichier | But |
|---|---|---|---|---|---|
| 1 | J+0 | Tes chiffres (et ce qu'ils disent vraiment) | Ton 1RM, tes charges de travail, et la seule question qui compte. | `01-j0.html` | Tenir la promesse, installer le RPE |
| 2 | J+1 | Tu n'as pas manqué de motivation | Pourquoi tu as arrêté la dernière fois, et pourquoi ce n'était pas ta faute. | `02-j1.html` | Retirer la culpabilité, faire répondre |
| 3 | J+3 | Arrête d'aller à l'échec à chaque série | Le RPE, expliqué en 2 minutes, et pourquoi tes charges stagnent. | `03-j3.html` | Méthode : RPE et progression |
| 4 | J+5 | Une semaine d'entraînement en 3 heures | Trois séances d'une heure, et ce qu'on met dedans. | `04-j5.html` | Méthode : 3 h par semaine |
| 5 | J+7 | Sans régime, mais pas sans plan | Garder les plats que tu manges déjà, et changer les quantités. | `05-j7.html` | Méthode : sans régime |
| 6 | J+10 | Mon cycle de 12 semaines, chiffres compris | Ce que j'ai soulevé avant, après, et l'erreur que j'ai faite en semaine 10. | `06-j10.html` | Preuve : le cycle de Thomas |
| 7 | J+13 | 10 places, 12 semaines, avec moi | Le coaching individuel au tarif fondateur, jusqu'au 31 décembre. | `07-j13.html` | Offre : appel de 15 min |

## Réglages dans Brevo (une fois)
1. **Contacts → Paramètres → Attributs** : vérifie que l'attribut du prénom s'appelle `FIRSTNAME`. Si ton compte utilise `PRENOM`, remplace `{{ contact.FIRSTNAME }}` par `{{ contact.PRENOM }}` dans les 7 e-mails. Crée aussi les attributs texte `SOURCE`, `DEMANDE`, `E1RM`, `OBJECTIF` et `DELAI` (utilisés par la synchronisation).
2. **Contacts → Listes** : crée une liste « Calculateur » et une liste « Appel ». Note leurs numéros.
3. **Automatisations → Créer → Scénario personnalisé** : déclencheur « Contact ajouté à la liste Calculateur ». Puis e-mail 1, attente 1 jour, e-mail 2, attente 2 jours, e-mail 3, et ainsi de suite (J+0, 1, 3, 5, 7, 10, 13).
4. Pour chaque e-mail : **Créer un e-mail → Coder votre propre e-mail → coller le fichier HTML**, puis renseigner l'objet et le texte d'aperçu du tableau.
5. **Condition de sortie** : « Contact ajouté à la liste Appel » (il a réservé, inutile de lui vendre l'appel).
6. Envoie-toi chaque e-mail en test (bouton « Envoyer un test ») et ouvre-le sur ton téléphone avant d'activer le scénario.

## Après le 31/12/2026
L'e-mail 7 parle du tarif fondateur. Le 1er janvier, remplace le paragraphe du tarif par : « 1 600 € pour les 12 semaines, ou 3 mensualités de 540 €. »

## Liens
Chaque lien porte `?src=email-N` : dans l'app, Business → Objectif, tu vois quel e-mail amène des appels.

## Synchronisation site → Brevo
Les e-mails laissés sur le site arrivent dans la table `leads` de Supabase. La fonction `brevo-sync` (dépôt `tb-coaching-app`, dossier `supabase/functions/brevo-sync`) les ajoute automatiquement dans la bonne liste Brevo. La mise en route se fait en 4 étapes, décrites dans son README.
