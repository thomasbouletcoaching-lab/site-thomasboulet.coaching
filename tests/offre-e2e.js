// Test du tunnel (iPhone 390×844, données fictives) : page de vente, tarif fondateur, page d'appel, calculateur.
// Lancement : python3 -m http.server 8766, puis « npm i playwright » et « BASE_URL=http://localhost:8766/ node tests/offre-e2e.js ».
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8766/';
const SHOTS = process.env.SHOTS_DIR || require('os').tmpdir();
let fails = 0, passed = 0; const ok = (c, m) => { if (c) { passed++; console.log('  ✓', m); } else { fails++; console.log('  ✗', m); } };
const vis = (p, sel) => p.$eval(sel, el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)).catch(() => false);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const mk = async (fixedNow) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); p.errs = []; p.posts = [];
    if (fixedNow) await p.addInitScript((t) => { const R = Date; const T = Date.parse(t); globalThis.Date = class extends R { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }; }, fixedNow);
    p.on('pageerror', e => p.errs.push(e.message));
    await p.route('https://xtapitojdvicgcaygeqj.supabase.co/**', r => { p.posts.push(r.request().postDataJSON()); r.fulfill({ status: 201, body: '' }); });
    await p.route(/fonts\.(googleapis|gstatic)|youtube|vimeo/, r => r.fulfill({ body: '' }));
    return p;
  };
  // 1. Page de vente pendant la période fondateur
  const p = await mk('2026-11-20T12:00:00+01:00');
  await p.goto(BASE + 'coaching.html?src=reel-cycle', { waitUntil: 'load' });
  const carte = (await p.textContent('[data-tarif]')).replace(/\s+/g, ' ');
  ok(/790 €/.test(carte) && /1 600 €/.test(carte), 'tarif fondateur 790 € affiché, prix normal 1 600 € barré');
  ok(/10 places au tarif fondateur/.test(carte) && !(await vis(p, '[data-places-jauge]')), 'sans décompte connu : « 10 places au tarif fondateur », pas de jauge inventée');
  ok(/3 heures par semaine/.test(await p.textContent('h1 + p')) && /sans régime/.test(await p.textContent('h1 + p')), 'promesse : environ 3 h par semaine, sans régime');
  const corps = (await p.textContent('main')).replace(/\s+/g, ' ');
  ok(/séance offerte/i.test(corps) && /Appels réservables/.test(corps) && /6 mois de suivi offerts/.test(corps), 'bonus : séance en salle, appels réservables, concours');
  ok(/\+85 kg/.test(corps) && /150 kg/.test(corps), 'preuve de méthode : les chiffres du cycle de Thomas');
  ok(/4 semaines de suivi offertes/.test(corps) && /80 %/.test(corps), 'garantie de prolongation avec ses conditions');
  ok(!/Charpente/.test(corps), 'plus de nom « Charpente » sur la page de vente');
  ok((await p.$$('main a[href="appel.html"]')).length >= 3, 'tous les appels à l\'action mènent à la page d\'appel');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'page de vente : aucun débordement à 390 px');
  await p.screenshot({ path: SHOTS + '/vente.png', fullPage: true });
  await p.locator('[data-tarif]').screenshot({ path: SHOTS + '/vente-tarif.png' });
  // 2. Page d'appel : formulaire → demande enregistrée → lien Calendly 15 min prérempli
  await p.click('main a[href="appel.html"] >> nth=0'); await p.waitForLoadState('load');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'page d\'appel : aucun débordement à 390 px');
  const f = 'form[data-lead="appel"]';
  await p.click(f + ' button[type=submit]'); await p.waitForTimeout(200);
  ok(/Indique ton prénom|Vérifie ton adresse/.test(await p.textContent(f + ' .retour')) && p.posts.length === 0, 'formulaire vide refusé, rien envoyé');
  await p.fill(f + ' [name=name]', 'Prospect'); await p.fill(f + ' [name=email]', 'prospect@exemple.fr');
  await p.selectOption(f + ' [name=goal]', { index: 2 }); await p.selectOption(f + ' [name=sessions]', '3');
  await p.fill(f + ' [name=frein]', 'Le travail et les enfants'); await p.check(f + ' [name=consent]');
  await p.click(f + ' button[type=submit]'); await p.waitForTimeout(800);
  const d = (p.posts[0] || {}).data || {};
  ok(d.demande === 'appel' && d.goal && d.sessions === '3' && d.frein && d.src === 'reel-cycle', 'demande « appel » enregistrée avec objectif, séances, frein et source (' + JSON.stringify(d) + ')');
  const href = await p.getAttribute('[data-creneau]', 'href').catch(() => '');
  ok(/^https:\/\/calendly\.com\/thomboulet\/15min\?name=Prospect&email=prospect%40exemple\.fr$/.test(href), 'bouton « Choisir mon créneau » vers Calendly 15 min, prénom et e-mail transmis');
  await p.screenshot({ path: SHOTS + '/appel-ok.png', fullPage: true });
  ok(!p.errs.length, 'aucune erreur JavaScript (vente + appel)' + (p.errs.length ? ' : ' + p.errs.join(' | ') : ''));
  // 3. Après le 31/12/2026 : prix normal
  const q = await mk('2027-01-02T12:00:00+01:00');
  await q.goto(BASE + 'coaching.html', { waitUntil: 'load' });
  const c2 = (await q.textContent('[data-tarif]')).replace(/\s+/g, ' ');
  ok(await vis(q, '[data-tarif] [data-si-complet]') && !(await vis(q, '[data-tarif] [data-si-places]')) && /1 600 €/.test(c2) && /540 €/.test(c2), 'après le 31/12/2026 : prix normal 1 600 € ou 3 × 540 €, plus de tarif fondateur');
  // 4. Calculateur : un objectif lointain mène à l'appel ; la capture d'e-mail transporte les chiffres
  const c = await mk();
  await c.goto(BASE + 'calculateur.html', { waitUntil: 'load' });
  await c.selectOption('[name=mouvement]', { index: 0 }); await c.fill('[name=charge]', '100'); await c.fill('[name=reps]', '5');
  await c.fill('[name=obj_reps]', '1'); await c.fill('[name=obj_charge]', '160'); await c.waitForTimeout(300);
  ok(await vis(c, '[data-objectif-cta]') && (await c.getAttribute('[data-cta-lien]', 'href')) === 'appel.html', 'objectif lointain : le calculateur propose l\'appel de 15 min');
  const g = 'form[data-lead="calculateur"]';
  await c.fill(g + ' [name=name]', 'Lifteur'); await c.fill(g + ' [name=email]', 'lifteur@exemple.fr'); await c.check(g + ' [name=consent]');
  await c.click(g + ' button[type=submit]'); await c.waitForTimeout(800);
  const d2 = (c.posts[0] || {}).data || {};
  ok(d2.demande === 'calculateur' && d2.e1rm && d2.objectif && d2.delai, 'capture d\'e-mail avec 1RM, objectif et délai (' + JSON.stringify(d2) + ')');
  ok(/appel\.html/.test(await c.innerHTML(g + ' .retour')), 'merci : lien vers l\'appel');
  ok(await c.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'calculateur : aucun débordement à 390 px');
  ok(!c.errs.length && !q.errs.length, 'aucune erreur JavaScript (calculateur, après fondateur)');
  // 5. Règlement du concours : pas de hasard
  await c.goto(BASE + 'concours.html', { waitUntil: 'load' });
  ok(/Aucun tirage au sort/.test(await c.textContent('main')), 'règlement : aucun tirage au sort');
  await b.close(); console.log(`\n${passed} vérifications réussies, ${fails} échec(s).`); process.exit(fails ? 1 : 0);
})();
