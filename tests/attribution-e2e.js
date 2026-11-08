// Test du site (iPhone 390×844) : source des demandes, carte pro, pas de débordement horizontal. Données fictives.
// Lancement : python3 -m http.server 8766, puis « npm i playwright » et « BASE_URL=http://localhost:8766/ node tests/attribution-e2e.js ».
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8766/';
let fails = 0, passed = 0; const ok = (c, m) => { if (c) { passed++; console.log('  ✓', m); } else { fails++; console.log('  ✗', m); } };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [], posts = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.route('https://xtapitojdvicgcaygeqj.supabase.co/**', r => { posts.push(r.request().postDataJSON()); r.fulfill({ status: 201, body: '' }); });
  await p.route(/fonts\.(googleapis|gstatic)|youtube|vimeo/, r => r.fulfill({ body: '' }));
  await p.goto(BASE + 'index.html?src=Reel-1RM&utm_source=Instagram&utm_campaign=semaine 1', { waitUntil: 'load' });
  // Navigation interne vers la page du cycle : l'attribution suit
  await p.goto(BASE + 'coaching.html', { waitUntil: 'load' });
  ok(/09325ED0336/.test(await p.textContent('[data-carte-pro]')) && !!(await p.$('[data-carte-pro] a[href="https://eapspublic.sports.gouv.fr"]')), 'carte pro affichée près du prix, avec le lien de vérification');
  for (const pg of ['index.html', 'coaching.html', 'calculateur.html', 'offres.html']) {
    const p2 = await ctx.newPage(); await p2.route(/fonts\.(googleapis|gstatic)|youtube|vimeo|supabase/, r => r.fulfill({ body: '' }));
    await p2.goto(BASE + pg, { waitUntil: 'load' });
    ok(await p2.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${pg} : aucun débordement horizontal à 390 px`);
    await p2.close();
  }
  const f = 'form[data-lead="candidature"]';
  await p.fill(f + ' [name=name]', 'Prospect Fictif'); await p.fill(f + ' [name=email]', 'prospect@exemple.fr');
  await p.selectOption(f + ' [name=goal]', { index: 2 }); await p.fill(f + ' [name=practice]', '3 séances par semaine, je stagne');
  await p.check(f + ' [name=consent]'); await p.click(f + ' button[type=submit]'); await p.waitForTimeout(800);
  const d = (posts[0] || {}).data || {};
  ok(d.src === 'reel-1rm' && d.utm_source === 'instagram' && d.utm_campaign === 'semaine-1' && d.arrivee === 'index.html', 'candidature envoyée avec sa source (' + JSON.stringify(d) + ')');
  ok(d.demande === 'candidature' && d.origine === 'site', 'champs existants inchangés');
  await p.locator('[data-tarif]').screenshot({ path: (process.env.SHOTS_DIR || require('os').tmpdir()) + '/site-tarif.png' });
  // Visite directe sans paramètre : pas de source inventée
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true }); const q = await c2.newPage(); const posts2 = [];
  await q.route('https://xtapitojdvicgcaygeqj.supabase.co/**', r => { posts2.push(r.request().postDataJSON()); r.fulfill({ status: 201, body: '' }); });
  await q.route(/fonts\.(googleapis|gstatic)|youtube|vimeo/, r => r.fulfill({ body: '' }));
  await q.goto(BASE + 'coaching.html', { waitUntil: 'load' });
  await q.fill(f + ' [name=name]', 'Direct'); await q.fill(f + ' [name=email]', 'direct@exemple.fr'); await q.selectOption(f + ' [name=goal]', { index: 1 });
  await q.fill(f + ' [name=practice]', 'rien'); await q.check(f + ' [name=consent]'); await q.click(f + ' button[type=submit]'); await q.waitForTimeout(800);
  const d2 = (posts2[0] || {}).data || {};
  ok(posts2.length === 1 && !d2.src && !d2.utm_source && !d2.ref, 'visite directe : aucune source ajoutée');
  ok(!errs.length, 'aucune erreur JavaScript' + (errs.length ? ' : ' + errs.join(' | ') : ''));
  await b.close(); console.log(`\n${passed} vérifications réussies, ${fails} échec(s).`); process.exit(fails ? 1 : 0);
})();
