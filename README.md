# Apartamento Vovó 3D — cartão Lovelace para Home Assistant

Modelo 3D interativo do apartamento da **Vovó Divina** (projeto de interiores "APTO DIVINA - STORIA",
Mota e Lopes Arquitetura e Interiores, 2026) em Three.js, ligado às entidades do Home Assistant: gira, dá zoom,
anda pelos cômodos na altura dos olhos e cada ambiente acende conforme o interruptor real.

Derivado do [igreja-3d-v1](https://github.com/LGRSV/igreja-3d-v1) (Base Church) — mesmo motor, estilo e recursos:
materiais PBR, iluminação dia/noite pelo sol real, painel (Ambientes · Automações · Atividade), Vista de cima navegável,
visão de **Pessoa** com colisão e navegação por clique, portas que abrem sozinhas (maçaneta, portas de correr), ares com
aleta e fluxo de ar, TV que acende, Fachada (forro e laje) e governador de qualidade.

## Arquivos

| Arquivo | O que é |
|---|---|
| `apto-vovo-card.js` | o cartão (custom element `apto-vovo-card`) — motor + planta + objetos ligados a entidades |
| `rooms/BRIEF.md` | especificação do apartamento medida nas 6 pranchas (paredes, aberturas, marcenaria, mobiliário, entidades, API do `ctx`) |
| `rooms/<grupo>.js` | decoração de cada grupo de cômodos (`function room<Nome>(ctx) { … }`) |
| `integrate_rooms.py` | injeta os `rooms/*.js` no cartão (arquivo ausente → stub vazio) |
| `demo.template.html` → `build.py` → `index.html` | demo standalone com um `hass` simulado |
| `tools/*.mjs` | testes headless (Playwright + SwiftShader) e screenshots |

```
python integrate_rooms.py   # junta a decoração dos cômodos no cartão
python build.py             # gera index.html (abra direto no navegador)
```

## Instalação no Home Assistant

1. Copie `apto-vovo-card.js` para `config/www/` e adicione o recurso `/local/apto-vovo-card.js` (tipo *JavaScript module*).
2. No painel, um cartão manual:

```yaml
type: custom:apto-vovo-card
title: Apartamento Vovó
entities:                       # troque pelos nomes reais das suas entidades
  luz_sala: light.sala
  luz_cozinha: light.cozinha
  luz_varanda: light.varanda
  luz_servico: light.area_servico
  luz_hall: light.hall_intimo
  luz_hall_entrada: light.hall_entrada
  luz_lavabo: light.lavabo
  luz_suite_master: light.suite_master
  luz_banho_master: light.banho_master
  luz_suite_visita: light.suite_visita
  luz_suite_americana: light.suite_americana
  luz_banheiro_americano: light.banheiro_americano
  tv_sala: media_player.tv_sala
  ac_sala: climate.ar_sala
  ac_suite_americana: climate.ar_suite_americana
  ac_suite_visita: climate.ar_suite_visita
  ac_master: climate.ar_suite_master
  porta_entrada: binary_sensor.porta_entrada
# opcionais: labels, mode (auto|day|night), quality (auto|alta|media|leve|min), panel, fachada, fachada_pessoa,
#            latitude, longitude, timezone, orientation, weather, weather_city, height
```

## Testes

```
THREE_LOCAL=<three@0.170 three.module.min.js> PLAYWRIGHT=<playwright/index.mjs> node tools/motor_test.mjs index.html screenshots
node tools/integ_test.mjs index.html      # Pessoa × Vista de cima × Fachada × painel × voo do ar × governador
node tools/shot.mjs index.html saida.png 1400 900 'document.querySelector("apto-vovo-card").setWalk(true)'
```

## Situação

- Etapa atual: **planta fiel** (paredes, aberturas, pisos, rodapés, forro, marcenaria e móveis dos cômodos).
- Automações (rotinas próprias, sensores, painel detalhado) ficam para a próxima etapa; as entidades acima são as do BRIEF.
- Incertezas de projeto (pé-direito/forro, peitoris, fechamento da varanda, pisos sem prancha etc.) estão listadas no fim do `rooms/BRIEF.md`.
