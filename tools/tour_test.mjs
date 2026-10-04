// Passeio completo (Chromium + SwiftShader): console limpo, vistas gerais, cada ambiente no modo Pessoa,
// rotas de clique da entrada até cada cômodo (A* com móveis), portas animando ao passar e custo de render.
// Uso: THREE_LOCAL=<three r170 three.module.min.js> PLAYWRIGHT=<playwright/index.mjs> node tools/tour_test.mjs <index.html> <pasta-de-saída>
import { open } from './lib.mjs';
import { mkdirSync } from 'fs';
import { join } from 'path';
const [,, html = 'index.html', outDir = 'screenshots'] = process.argv;
mkdirSync(outDir, { recursive: true });
const t = await open(html, { w: 1400, h: 900 }); const { page, S } = t;
const C = (f, a) => page.evaluate(`(${f})(document.querySelector('apto-vovo-card'), ${JSON.stringify(a)})`);
const shot = async (name) => { await S(600); await C((c) => { c._orbit.dirty = true; }); await S(900); await page.screenshot({ path: join(outDir, `${name}.png`) }); };
const R = {};
// vistas gerais
await C((c) => { c._setPanel(false); c.setMode('day'); });
await shot('geral-maquete-dia');
await C((c) => c._setTopView(true)); await shot('geral-vista-de-cima');
await C((c) => c._setTopView(false)); await C((c) => c.setMode('night')); await shot('geral-maquete-noite');
await C((c) => c.setFachada(true)); await C((c) => c.setMode('day')); await shot('geral-fachada');
await C((c) => c.setFachada(false));
// custo de render (média de 10 quadros forçados, maquete)
R.render = await C((c) => {
  const r = c._renderer, t0 = performance.now(); for (let i = 0; i < 10; i++) r.render(c._scene, c._camera);
  return { ms: +((performance.now() - t0) / 10).toFixed(1), calls: r.info.render.calls, tris: r.info.render.triangles, geos: r.info.memory.geometries, tex: r.info.memory.textures };
});
// cada ambiente no modo Pessoa (de dia: luz natural)
await C((c) => c.setWalk(true));
R.rooms = {};
for (const id of await C((c) => c._roomsAll().map((r) => r.id))) {
  await C((c, id) => c.enterRoom(id), id); await shot('pessoa-' + id.replace(/_/g, '-'));
  R.rooms[id] = await C((c) => { const p = c.getWalkPose(); return [+p.x.toFixed(2), +p.z.toFixed(2)]; });
}
// rotas de clique: da entrada até cada cômodo (o destino é o ponto livre do cômodo; termina a < 0,9 m dele?)
R.routes = await C((c) => {
  c._walk.reset(8.0, 7.05, Math.PI / 2, 0, false); const out = {};
  for (const r of c._roomsAll()) {
    const sp = c._roomSpot(r), pts = c._walkRoute({ x: sp.x, z: sp.z, up: false }), e = pts[pts.length - 1];
    out[r.id] = e ? +Math.hypot(e[0] - sp.x, e[1] - sp.z).toFixed(2) : -1;
  }
  return out;
});
// anda de verdade da entrada até a suíte master e confere que alguma porta abriu no caminho
await C((c) => { c._walk.reset(8.0, 7.05, Math.PI / 2, 0, false); window.__open = 0; });
await C((c) => { const r = c._roomsAll().find((q) => q.id === 'suite_master'), sp = c._roomSpot(r); c.walkTo(sp.x, sp.z);
  const tick = () => { if ((c._doors || []).some((d) => Math.abs(d.q || 0) > 0.3 || (d.p || 0) > 0.2)) window.__open++; if (c._walk.path) requestAnimationFrame(tick); }; tick(); });
await page.waitForFunction(() => !document.querySelector('apto-vovo-card')._walk.path, null, { timeout: 180000, polling: 300 }).catch(() => {});
R.walkMaster = await C((c) => { const p = c.getWalkPose(); return { x: +p.x.toFixed(2), z: +p.z.toFixed(2), doorFrames: window.__open }; });
await shot('pessoa-chegada-suite-master');
R.walls = await C((c) => ({ walls: c._walls.length, colliders: c._walls.filter((w) => w.furn).length, doors: (c._doors || []).length }));
R.quality = await C((c) => c.getQuality());
R.errs = t.errs; R.logs = t.logs;
console.log(JSON.stringify(R, null, 1));
await t.close();
