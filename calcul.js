/* Calculateur de force · Thomas Boulet Coaching
   1RM estimé (Epley, Brzycki, Lander, avec le poids de corps pour les mouvements lestés),
   table RPE (Tuchscherer), et délai estimé pour atteindre un objectif.
   Les fonctions de calcul sont pures et exportées pour les tests (window.CALC ou module.exports). */
(function(racine){
  "use strict";

  // Pourcentage du 1RM selon le nombre de reps « jusqu'à l'échec » (table RPE 10 de Tuchscherer).
  // Au-delà de 12, prolongé à environ -2,4 points par rep (valeurs estimées).
  var PCT = [null, 100, 95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.6, 63.2, 60.8, 58.4];

  function pctReps(n){ // n peut être décimal (RPE 9,5 = une demi-rep en réserve)
    if (n <= 1) return 100;
    if (n >= 16) return PCT[16];
    var b = Math.floor(n), f = n - b;
    return PCT[b] + (PCT[b + 1] - PCT[b]) * f;
  }

  // % du 1RM pour r reps à un RPE donné : RPE 8 sur 5 reps = 5 reps + 2 en réserve.
  function pctRpe(reps, rpe){ return pctReps(reps + (10 - rpe)); }

  // Trois formules classiques, appliquées à la charge totale déplacée.
  var FORMULES = {
    epley:   function(w, r){ return r <= 1 ? w : w * (1 + r / 30); },
    brzycki: function(w, r){ return r <= 1 ? w : w * 36 / (37 - r); },
    lander:  function(w, r){ return r <= 1 ? w : 100 * w / (101.3 - 2.67123 * r); }
  };

  // charge : kg sur la barre ou à la ceinture ; pdc : poids de corps (0 si mouvement à la barre)
  function unRM(charge, reps, pdc, rir){
    var total = charge + (pdc || 0), r = reps + (rir || 0);
    if (!(total > 0) || !(r >= 1) || r > 20) return null;
    var e = FORMULES.epley(total, r), b = FORMULES.brzycki(total, r), l = FORMULES.lander(total, r);
    var moy = (e + b + l) / 3;
    return { epley: e, brzycki: b, lander: l, moyenne: moy, lest: moy - (pdc || 0) };
  }

  // 1RM total nécessaire pour faire « reps » à « charge » (moyenne des trois formules inversées).
  function rmRequis(charge, reps, pdc){
    var r = unRM(charge, reps, pdc, 0);
    return r ? r.moyenne : null;
  }

  // Progression mensuelle réaliste du 1RM avec un programme structuré, selon l'ancienneté.
  var RYTHME = { debutant: 0.03, intermediaire: 0.015, confirme: 0.0075 };

  function delaiObjectif(rmActuel, rmVise, niveau){
    if (!(rmActuel > 0) || !(rmVise > 0)) return null;
    var ecart = rmVise / rmActuel - 1;
    if (ecart <= 0) return { ecart: ecart, semaines: 0 };
    var t = RYTHME[niveau] || RYTHME.intermediaire;
    // Les gains ralentissent : rythme dégressif de 3 % par mois écoulé.
    var rm = rmActuel, mois = 0;
    while (rm < rmVise && mois < 120) { rm *= 1 + t * Math.pow(0.97, mois); mois++; }
    var semaines = mois >= 120 ? null : Math.max(2, Math.round(mois * 4.33));
    return { ecart: ecart, semaines: semaines };
  }

  var CALC = { pctReps: pctReps, pctRpe: pctRpe, unRM: unRM, rmRequis: rmRequis, delaiObjectif: delaiObjectif, FORMULES: FORMULES };
  if (typeof module !== "undefined" && module.exports) { module.exports = CALC; return; }
  racine.CALC = CALC;

  /* ---------- Interface ---------- */
  var doc = racine.document;
  function $(s, r){ return (r || doc).querySelector(s); }
  function $$(s, r){ return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function num(el){ var v = parseFloat(String(el.value).replace(",", ".")); return isFinite(v) ? v : NaN; }
  function kg(v, d){ return (Math.round(v * (d ? 10 : 2) ) / (d ? 10 : 2)).toLocaleString("fr-FR") + " kg"; } // arrondi au 0,5 kg

  var form = $("[data-calc]");
  if (!form) return;
  var mvt = $("[name=mouvement]", form), champPdc = $("[data-pdc]", form);
  var estLeste = function(){ return mvt.selectedOptions[0].getAttribute("data-leste") === "1"; };

  function majPdc(){
    var l = estLeste();
    champPdc.hidden = !l;
    $$("[data-libelle-charge]").forEach(function(el){ el.textContent = l ? "Lest (kg)" : "Charge (kg)"; });
  }

  var etat = {};
  function calculer(){
    var l = estLeste(), pdc = l ? num($("[name=pdc]", form)) : 0;
    var charge = num($("[name=charge]", form)), reps = num($("[name=reps]", form)), rir = num($("[name=rir]", form)) || 0;
    var sortie = $("[data-resultat]"), detail = $("[data-detail]");
    if (l && !(pdc > 0)) { sortie.textContent = "Indique ton poids de corps"; detail.textContent = ""; etat.rm = null; majTable(); majObjectif(); return; }
    var r = unRM(charge || 0, reps, pdc, rir);
    if (!r || (!l && !(charge > 0))) { sortie.textContent = "—"; detail.textContent = "Renseigne tes reps et ta charge."; etat.rm = null; majTable(); majObjectif(); return; }
    etat = { rm: r.moyenne, pdc: pdc, leste: l, mouvement: mvt.value };
    sortie.textContent = l ? (r.lest >= 0 ? "+ " + kg(r.lest) : kg(r.lest)) : kg(r.moyenne);
    detail.innerHTML = (l ? "Soit " + kg(r.moyenne) + " déplacés au total (poids de corps compris). " : "") +
      "Epley " + kg(r.epley - pdc) + " · Brzycki " + kg(r.brzycki - pdc) + " · Lander " + kg(r.lander - pdc) +
      (reps + rir > 10 ? '<br><span class="calc-alerte">Au-delà de 10 reps, l\'estimation devient moins fiable : teste plutôt une série de 3 à 8.</span>' : "");
    majTable(); majObjectif();
  }

  // Table RPE : charge de travail pour 1 à 10 reps, RPE 7 à 10
  var RPES = [10, 9.5, 9, 8.5, 8, 7.5, 7];
  function majTable(){
    var t = $("[data-table-rpe]");
    if (!etat.rm) { t.innerHTML = '<p class="aide">Calcule d\'abord ton 1RM ci-dessus.</p>'; return; }
    var h = '<table><thead><tr><th scope="col">Reps</th>' + RPES.map(function(x){ return '<th scope="col">RPE ' + String(x).replace(".", ",") + "</th>"; }).join("") + "</tr></thead><tbody>";
    for (var reps = 1; reps <= 10; reps++) {
      h += '<tr><th scope="row">' + reps + "</th>";
      RPES.forEach(function(x){
        var tot = etat.rm * pctRpe(reps, x) / 100, v = tot - etat.pdc;
        h += "<td>" + (etat.leste ? (v >= 0 ? "+" + kg(v).replace(" kg", "") : '<span title="Assistance">' + kg(v).replace(" kg", "") + "</span>") : kg(v).replace(" kg", "")) + "</td>";
      });
      h += "</tr>";
    }
    t.innerHTML = h + "</tbody></table>";
  }

  // Objectif
  var CTA = {
    court: { titre: "Le Programme Plateau, 8 semaines", texte: "Ton objectif est à portée : 8 semaines bien construites suffisent souvent.", lien: "offres.html#prog-plateau", bouton: "Voir le programme · 29 €" },
    moyen: { titre: "Le Cycle Force, 24 semaines", texte: "C'est un objectif de plusieurs mois : il te faut une progression écrite à l'avance, pas des séances au feeling.", lien: "offres.html#cycle-force", bouton: "Voir le cycle · 179 €" },
    long: { titre: "Le coaching Charpente", texte: "Objectif ambitieux : pour gagner du temps, il faut un programme ajusté chaque semaine à tes séances.", lien: "coaching.html", bouton: "Voir le coaching" }
  };
  function majObjectif(){
    var out = $("[data-objectif]"), cta = $("[data-objectif-cta]");
    var oReps = num($("[name=obj_reps]")), oCharge = num($("[name=obj_charge]")), niveau = $("[name=niveau]").value;
    cta.hidden = true;
    if (!etat.rm) { out.innerHTML = '<p class="aide">Calcule d\'abord ton 1RM ci-dessus.</p>'; return; }
    if (!(oReps >= 1) || !(oCharge >= (etat.leste ? 0 : 1))) { out.innerHTML = '<p class="aide">Indique le nombre de reps et la charge que tu vises.</p>'; return; }
    var vise = rmRequis(oCharge, oReps, etat.pdc), d = delaiObjectif(etat.rm, vise, niveau);
    if (!d) { out.innerHTML = ""; return; }
    var cible = oReps + " rep" + (oReps > 1 ? "s" : "") + " à " + (etat.leste ? "+" : "") + kg(oCharge);
    etat.objectif = cible;
    if (d.semaines === 0) {
      etat.delai = "atteint";
      out.innerHTML = '<p class="calc-gros">Tu peux déjà le faire.</p><p>D\'après ton 1RM, ' + cible + " est dans tes cordes aujourd'hui. Vise plus haut !</p>";
      return;
    }
    var ecart = Math.round(d.ecart * 100);
    etat.delai = d.semaines ? d.semaines + " semaines" : "très long";
    out.innerHTML = '<p class="calc-gros">' + (d.semaines ? "≈ " + d.semaines + " semaines" : "Plus de 2 ans") + "</p>" +
      "<p>Pour " + cible + ", il te faut un 1RM d'environ " + kg(vise - etat.pdc) + (etat.leste ? " de lest" : "") +
      ", soit " + ecart + " % de plus qu'aujourd'hui. C'est le délai réaliste avec un programme structuré et des séances régulières ; sans plan, la plupart des pratiquants stagnent.</p>";
    var c = !d.semaines || d.semaines > 24 ? CTA.long : d.semaines > 8 ? CTA.moyen : CTA.court;
    $("[data-cta-titre]", cta).textContent = c.titre;
    $("[data-cta-texte]", cta).textContent = c.texte;
    var a = $("[data-cta-lien]", cta); a.href = c.lien; a.textContent = c.bouton;
    cta.hidden = false;
  }

  // Remplit les champs cachés du formulaire e-mail avec les résultats
  function majCaches(){
    var f = $("form[data-lead=calculateur]"); if (!f) return;
    f.elements.mouvement.value = etat.mouvement || "";
    f.elements.e1rm.value = etat.rm ? Math.round((etat.rm - etat.pdc) * 2) / 2 + " kg" + (etat.leste ? " de lest" : "") : "";
    f.elements.objectif.value = etat.objectif || "";
    f.elements.delai.value = etat.delai || "";
  }

  mvt.addEventListener("change", function(){ majPdc(); calculer(); majCaches(); });
  $$("input,select").forEach(function(el){ el.addEventListener("input", function(){ calculer(); majCaches(); }); });
  majPdc(); calculer(); majCaches();
})(typeof window !== "undefined" ? window : this);
