// Teste do motor do apartamento (Chromium + SwiftShader): carrega a demo, confere o console e tira screenshots de
// cima (maquete e Vista de cima), da Fachada e da visão de Pessoa (porta de entrada e alguns cômodos via "Ir para…").
// Uso: THREE_LOCAL=<three.module.min.js> PLAYWRIGHT=<playwright/index.mjs> node tools/motor_test.mjs <index.html> <pasta-de-saída>
import { open } from './lib.mjs';
import { mkdirSync } from 'fs';
import { join } from 'path';
const [,, html = 'index.html', outDir = 'screenshots'] = process.argv;
mkdirSync(outDir, { recursive: true });
const t = await open(html, { w: 1400, h: 900 }); const { page, S } = t;
const C = (f, a) => page.evaluate(`(${f})(document.querySelector('apto-vovo-card'), ${JSON.stringify(a)})`);
const shot = async (name) => { await S(600); await page.screenshot({ path: join(outDir, `motor-${name}.png`) }); };
const R = {};
await C((c) => { c._setPanel(false); c.setMode('night'); });
await shot('maquete-noite');
await C((c) => c.setMode('day')); await shot('maquete-dia');
await C((c) => c._setTopView(true)); await shot('cima');
await C((c) => c._setTopView(false)); await C((c) => c.setFachada(true)); await shot('fachada');
await C((c) => c.setFachada(false));
await C((c) => c.setMode('night'));
await C((c) => c.setWalk(true)); R.walk0 = await C((c) => c.getWalkPose()); await shot('pessoa-entrada');
// anda até a sala pela navegação por clique e confere que chegou (colisão + A*)
await C((c) => c.walkTo(3.9, 5.6)); await page.waitForTimeout(9000); R.walk1 = await C((c) => c.getWalkPose()); await shot('pessoa-sala');
for (const [id, name] of [['suite_master', 'suite-master'], ['cozinha', 'cozinha'], ['varanda', 'varanda'], ['banheiro_americano', 'banheiro-americano']]) {
  await C((c, id) => c.enterRoom(id), id); await shot('pessoa-' + name); R['room_' + id] = await C((c) => c.getWalkPose());
}
R.rooms = await C((c) => c._roomsAll().map((r) => r.id));
R.walls = await C((c) => ({ walls: c._walls.length, furn: c._walls.filter((w) => w.furn).length, doors: (c._doors || []).length }));
R.quality = await C((c) => c.getQuality());
R.errs = t.errs; R.logs = t.logs;
console.log(JSON.stringify(R, null, 1));
await t.close();
