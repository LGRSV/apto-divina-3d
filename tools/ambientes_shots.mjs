// Screenshots finais por ambiente (Chromium + SwiftShader): vistas gerais e um ponto de vista escolhido à mão em cada cômodo,
// no modo Pessoa, de dia e com todas as luzes acesas (as entidades da demo são trocadas no `hass` simulado).
// Uso: THREE_LOCAL=<three r170 three.module.min.js> PLAYWRIGHT=<playwright/index.mjs> node tools/ambientes_shots.mjs <index.html> <pasta-de-saída>
import { open } from './lib.mjs';
import { mkdirSync } from 'fs';
import { join } from 'path';
const [,, html = 'index.html', outDir = 'screenshots'] = process.argv;
mkdirSync(outDir, { recursive: true });
const t = await open(html, { w: 1400, h: 900 }); const { page, S } = t;
const C = (f, a) => page.evaluate(`(${f})(document.querySelector('apto-vovo-card'), ${JSON.stringify(a)})`);
const shot = async (name) => { await S(600); await C((c) => { c._orbit.dirty = true; }); await S(900); await page.screenshot({ path: join(outDir, `${name}.png`) }); };
// todas as luzes acesas
await C((c) => { const h = c.hass; c.hass = { ...h, states: Object.fromEntries(Object.entries(h.states).map(([k, v]) => [k, k.startsWith('light.') ? { ...v, state: 'on', attributes: { ...v.attributes, brightness: 230 } } : v])) }; });
await C((c) => { c._setPanel(false); c.setMode('day'); });
await shot('geral-maquete-dia');
await C((c) => c._setTopView(true)); await shot('geral-vista-de-cima');
await C((c) => c._setTopView(false)); await C((c) => c.setMode('night')); await shot('geral-maquete-noite');
await C((c) => c.setMode('day'));
await C((c) => c.setFachada(true)); await shot('geral-fachada'); await C((c) => c.setFachada(false));
// pontos de vista: [nome, x, z, yaw, pitch] — yaw 0 olha para o norte (−z), π/2 para o oeste (−x), −π/2 para o leste, π para o sul
const V = [
  ['sala-estar', 6.3, 7.55, 1.1, -0.12],
  ['sala-painel-tv', 1.45, 7.6, -0.3, -0.1],
  ['jantar', 1.5, 5.4, -2.05, -0.2],
  ['cozinha', 6.35, 7.6, 1.77, -0.22],
  ['hall-entrada', 7.1, 7.05, -1.57, -0.12],
  ['lavabo', 7.2, 7.25, 3.14, -0.32],
  ['hall-intimo', 6.6, 4.0, 1.4, -0.1],
  ['suite-master', 9.2, 4.0, 0.57, -0.18],
  ['suite-master-armario', 7.6, 3.6, -0.75, -0.08],
  ['banho-master', 8.05, 4.05, 3.14, -0.3],
  ['suite-visita', 4.85, 3.0, -0.77, -0.18],
  ['suite-visita-comoda', 6.4, 2.75, 0.75, -0.15],
  ['suite-americana', 3.3, 2.1, 2.54, -0.18],
  ['suite-americana-armario', 1.7, 3.7, -0.85, -0.1],
  ['banheiro-americano-lavatorio', 4.0, 1.35, 1.0, -0.2],
  ['banheiro-americano-box', 2.6, 1.3, 1.45, -0.15],
  ['varanda', 0.62, 7.45, 0.0, -0.08],
  ['area-de-servico', 0.62, 7.3, 3.14, -0.3],
];
await C((c) => c.setWalk(true));
for (const [name, x, z, yaw, pitch] of V) {
  await C((c, a) => { c._walk.reset(a[0], a[1], a[2], a[3], false); c._orbit.dirty = true; }, [x, z, yaw, pitch]);
  await shot('pessoa-' + name);
}
console.log(JSON.stringify({ errs: t.errs }));
await t.close();
