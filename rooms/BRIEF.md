# Brief — Apartamento Vovó 3D (APTO DIVINA · STORIA)

Especificação comum do modelo. Toda a geometria foi medida nas 6 pranchas do projeto de interiores
"APTO DIVINA - STORIA" (Mota e Lopes Arquitetura e Interiores, 2026, escala 1:40): **LAYOUT** (R00, 06/05),
**ERGONÔMICA** (R00, 25/06), **REVESTIMENTOS** (R00, 26/06, 2 pág.), **MARMORARIA** (R00, 25/06, 2 pág.),
**MOBILIÁRIO** (R00, 17/09, 3 pág.) e **MARCENARIA** (R01, 19/09, 7 pág.). As paredes foram extraídas do
vetor do PDF (precisão ~0,01 m); onde não há cota escrita a medida é **aproximada (≈)** e está marcada.
Quando as pranchas divergem, vale a mais recente (MARCENARIA R01 / MOBILIÁRIO) — a planta de REVESTIMENTOS e a de
MARMORARIA ainda mostram uma bancada/escrivaninha na suíte americana que foi **abandonada** (não existe no layout
nem na marcenaria). O cartão (`apto-vovo-card.js`, ex-`igreja3d-card.js`) é o mesmo motor da igreja (Three.js r170, cartão Lovelace) e deve
manter o estilo visual, o painel, o modo Pessoa, as animações de portas/luzes/ar e o modo Fachada.

## Sistema de coordenadas (metros)
- **Origem** no canto superior esquerdo **externo** da planta de layout (quina da varanda com a parede norte).
- **X** cresce para a direita (da varanda, x = 0, até a face externa da parede leste, x = 10,23).
- **Z** cresce para a **frente/baixo da planta** (parede norte com as janelas das suítes em z = 0; parede sul da
  cozinha/lavabo em z = 8,97). A varanda ocupa toda a lateral oeste (x 0–1,05).
- **Y** para cima; piso em y = 0. Tudo em metros.
- **Pé-direito**: não há corte nas pranchas. A marcenaria vai até **2,50** (vistas: "10 + 235 + 5 = 250") e o
  revestimento dos boxes vai até **2,40** → use `H = 2,60` (laje) com **forro de gesso a 2,50** nos ambientes secos e
  **a 2,40 nos banheiros** (incerto; ajuste se o cliente informar).
- **Paredes**: internas `T = 0,10` (a planta desenha 0,09–0,11), centradas nas linhas abaixo; externa norte
  `TN = 0,23`; sul `TS = 0,14`; leste `TL = 0,10` (fina na planta — provável drywall sobre a estrutura).
  No modo normal (casinha de boneca, sem teto) as paredes têm `H`.
- O bloco à direita/abaixo da suíte master (x 8,55–10,23 · z 5,14–8,97) e o que está além de x = 10,23 e z = 8,97 é
  **área comum do prédio** (hall/elevadores) — não modelar; a porta de entrada abre para lá.
- **Referência máxima**: as pranchas + renders das vistas (marcenaria e marmoraria trazem imagens 3D do projeto):
  acabamentos em tons de greige/champanhe (MDF Gianduia, Frapê), madeira clara (Carvalho Natural, Freijó),
  palhinha, granito preto São Gabriel escovado, metais dourados/champanhe, cortinas de linho.

## Ambientes (pisos)
| Ambiente | x | z | Obs. |
|---|---|---|---|
| Varanda (sacada envidraçada) | 0,17 – 1,05 | 0,23 – 7,94 | estreita (≈0,85 m); guarda-corpo/envidraçamento em x 0–0,17; portas de correr de vidro em x ≈ 1,05 para a suíte americana (z 2,95–4,14) e para a sala (z 4,44–7,93); pilar x 0,89–1,31 · z 1,58–2,87 e shaft x 0,71–0,89 · z 0,23–0,81 avançam sobre ela |
| Área de serviço (ponta sul da varanda) | 0,17 – 0,86 | 7,94 – 8,59 | bancada de pedra clara 0,68 × 0,65 (h ≈ 0,90) com máquina/tanque embaixo (ver "Mobiliário solto") |
| Banheiro americano — box + vaso | 1,08 – 2,77 | 0,47 – 1,58 | box 0,85 × 1,11 (x 1,10–1,95) com vidro em x ≈ 1,95; vaso em x 1,95–2,77; mureta/nicho z 0,23–0,47 (x 1,08–1,96) |
| Banheiro americano — lavatório | 2,90 – 4,25 | 0,23 – 1,58 | bancada 1,36 × 0,55 na parede norte; passagem de 0,74 m **sem porta** para a suíte americana (z = 1,64, x 2,90–3,64) e porta para a suíte visita (x = 4,31) |
| Suíte americana 01 (sala de TV / sofá-cama) | 1,31 – 4,27 | 1,69 – 4,24 | lado oeste: pilar até z 2,87 e porta de vidro da varanda (z 2,95–4,14); armário E, sofá-cama 11, ar 10 |
| Suíte visita (cama casal 1,38) | 4,37 – 7,02 | 0,25 – 3,24 | janela norte x 4,71–6,51; cômoda F sob a janela; ar 12 |
| Hall íntimo | 4,37 – 6,70 | 3,34 – 4,24 | 0,90 m de largura (cota 90); liga sala (porta de correr), suíte americana, suíte visita e suíte master |
| Suíte master | 7,12 – 10,14 · 6,72 – 8,55 | 0,25 – 5,02 · 3,34 – 4,26 | em L: quarto x 7,12–10,14 · z 0,25–5,02 **menos** o pilar x 9,76–10,23 · z 1,59–2,87, mais a antecâmara x 6,72–8,55 · z 3,34–4,26 (porta do hall em x 6,72, porta do banho em z 4,31); janela norte x 7,76–9,56; armários G/H; ar cassete 15 |
| Banho master | 6,76 – 8,42 | 4,37 – 6,42 | vaso ao norte (z 4,37–5,17), box 0,87 × 0,99 (x 6,76–7,63 · z 5,17–6,17, vidro em x 7,63 e z 5,17), bancada 0,80 × 0,55 (x 7,62–8,42 · z 5,85–6,40); shaft x 6,75–7,52 · z 6,27–6,42 |
| Hall de entrada | 6,76 – 8,44 | 6,53 – 7,59 | vão de 1,06 m aberto para a sala (x = 6,71); porta de entrada na parede leste (x = 8,49) |
| Lavabo | 6,77 – 8,44 | 7,70 – 8,83 | bancada 0,80 × 0,45 à esquerda (x 6,77–7,57 · z 8,39–8,84), vaso à direita (x ≈ 7,85–8,30) |
| **Sala de estar + jantar** | 1,09 – 6,66 | 4,34 – 8,18 | 5,57 × 3,84 (cota 557 da vista C); painel C na parede norte (z 4,34), estante D na parede leste (x 6,45–6,65), sofá + buffet B a oeste, mesa de jantar 8 lugares no centro-leste |
| **Cozinha linear (cozinha/lavanderia)** | 1,09 – 6,66 | 7,98 – 8,83 | aberta para a sala: torre 0,52 × 0,30 (x 1,09–1,61 · z 7,98–8,28) + geladeira (x 1,71–2,41) + bancada de granito 4,20 × 0,65 (x 2,45–6,65 · z 8,18–8,83); bloco pilar/shaft x 1,10–1,62 · z 8,28–8,97 e pilar x 0,86–1,09 · z 7,93–8,69 |

Áreas (≈): varanda 6,3 m², banheiro americano 4,7 m² (7,5 m² de revestimento com 10 %), suíte americana 7,5 m²,
suíte visita 7,9 m², hall 2,1 m², suíte master 14,4 + 1,7 m², banho master 3,4 m² (4,9 m² revest.), hall de entrada
1,8 m², lavabo 1,9 m², sala + cozinha 25,0 m². Total interno ≈ 77 m².

### Pisos (o cartão cria; não cubra)
A prancha REVESTIMENTOS **só especifica as paredes dos boxes** (tabela: Cozinha vista A 5,60 m²; Banheiro americano
B/C/D 7,50 m²; Banheiro master E/F 4,90 m² — porcelanato grande formato até 2,40 m, "início da instalação" no canto
inferior). Pisos conforme os renders (aproximado):
- **Porcelanato greige claro 0,90 × 0,90 acetinado** (rejunte fino) + **rodapé branco de 7 cm**: sala, jantar, cozinha,
  hall íntimo, hall de entrada e suítes (os renders dos quartos mostram piso claro com tapete).
- **Porcelanato bege/areia 0,60 × 0,60** (mesmo tom das paredes dos boxes): banheiro americano, banho master, lavabo;
  **paredes dos boxes revestidas até 2,40** com o mesmo porcelanato grande formato (vistas A/B/C do americano =
  paredes norte, oeste e sul do box; E/F do master = paredes oeste e sul do box); ralo linear.
- **Porcelanato cinza 0,60 × 0,60 antiderrapante**: varanda e área de serviço.
- Paredes pintadas **off-white/greige claro ~#e4dfd6** (`M.wall`); teto branco. O render da suíte master mostra a
  parede da cabeceira com **textura/efeito cimentício claro**.

## Paredes e aberturas (linha de centro)
Tipos de abertura: `door` (0,80 × 2,10 nas internas; 0,70 × 2,10 nos banheiros/lavabo; 0,90 × 2,10 na entrada),
`window` (peitoril 1,10, topo 2,20 — ≈, não cotado), `glass` (vidro de piso a teto), `slide` (porta de correr),
`open` (vão sem folha). "abre para +x" = a folha gira para o lado de x maior; a dobradiça fica no z/x indicado.

**Perímetro**
- `wallX(0,115, x 0–4,71, TN)` norte: trecho x 0–0,71 é um parapeito/viga oca na planta (modele como parede);
  **shaft** x 0,71–0,89 · z 0,23–0,81 (caixa).
- `wallX(0,125, x 4,71–6,51, TN)` = **janela da suíte visita** (1,80 m, caixilho branco/preto 2 folhas de correr,
  peitoril ≈ 1,10 — fica logo acima da cômoda F de 1,10 m — topo ≈ 2,20). Modelar como parede com `window`.
- `wallX(0,125, x 6,51–7,76, TN)` cheia · `wallX(0,125, x 7,76–9,56, TN)` = **janela da suíte master** (1,80 m, igual)
  · `wallX(0,125, x 9,56–10,23, TN)` cheia.
- `wallZ(10,185, z 0,25–5,14, TL)` leste; no trecho z 0,25–1,59 a parede é mais grossa (x 9,87–10,23) e em
  z 1,59–2,87 há o **pilar** x 9,76–10,23 (0,47 × 1,28).
- `wallX(5,08, x 8,55–10,23, 0,12)` sul da suíte master (divisa com o hall do prédio).
- `wallZ(8,49, z 4,37–8,97, 0,12)` leste do banho master / hall de entrada / lavabo (divisa com o hall do prédio):
  **door z 6,62–7,49 = PORTA DE ENTRADA** (0,90 × 2,10, folha lisa, abre para dentro (−x), dobradiça em z 7,49 — a
  folha aberta encosta na parede do lavabo). `binary_sensor` da porta.
- `wallX(8,90, x 1,62–6,66 e 6,77–8,49, TS)` sul (cozinha e lavabo).
- Canto sudoeste: **bloco pilar/shaft** x 1,10–1,62 · z 8,28–8,97 (sólido, com nicho estreito x 1,34–1,50 fechado) e
  **pilar** x 0,86–1,09 · z 7,93–8,69; parede `wallZ(0,09, z 7,94–8,69)` e `wallX(8,64, x 0,18–0,86)` fecham a área
  de serviço; faixa z 8,69–8,97 (x 0–0,89) é shaft/canaleta — modele cheia.
- **Varanda** (oeste): `glass` **guarda-corpo + envidraçamento** em x = 0,085 (z 0,23–7,94): peitoril de alvenaria
  0,17 m de espessura até y 1,10 e vidro incolor com perfis finos pretos até o teto (cortina de vidro, ≈).
- `wallZ(0,985, z 0,23–2,95, 0,19)` parede varanda ↔ banheiro americano/suíte americana: **window z 0,88–1,46**
  (basculante do banheiro, 0,58 × 0,66, peitoril 1,60, topo 2,26 — vista B dos revestimentos) ; **pilar**
  x 0,89–1,31 · z 1,58–2,87 (0,42 × 1,29, dentro da suíte americana, canto noroeste).
- `glass`/`slide` x = 1,05, z 2,95–4,14: **porta de correr de vidro** da suíte americana para a varanda (2 folhas,
  caixilho preto fino, piso a teto). Jamb/parede `wallZ(0,985, z 4,14–4,44, 0,21)`.
- `glass`/`slide` x = 1,05, z 4,44–7,93: **porta de correr de vidro da sala** (4 folhas, caixilho preto fino). Pilar
  x 0,86–1,09 · z 7,93–8,69 fecha a ponta.

**Banheiro americano (compartilhado pelas duas suítes de visita)**
- `wallX(0,35, x 1,08–1,96, 0,24)` mureta/viga do box (y 0,23–0,47, altura total — ≈; serve de nicho na vista C).
- Box: vidro `glass` em x 1,95 (z 0,47–1,58) — porta de vidro de correr no trecho z 1,20–1,58 (≈).
- `wallZ(2,835, z 0,23–0,84, 0,10)` divisória box+vaso ↔ lavatório; **door z 0,84–1,50** (0,70, abre para o
  compartimento do vaso, −x, dobradiça em z 1,50, folha aberta encosta na parede z 1,58).
- `wallX(1,635, x 1,11–2,90, 0,10)` sul do compartimento; `wallX(1,64, x 3,64–4,37, 0,10)`; **open x 2,90–3,64**
  (vão de 0,74 sem folha, do lavatório para a suíte americana — ≈; nenhuma folha desenhada).
- `wallZ(4,31, z 0,23–0,84 e 1,52–3,41, 0,11)`: **door z 0,84–1,52** (0,70, lavatório ↔ suíte visita, abre para o
  lavatório, −x, dobradiça em z 1,52).

**Suítes de visita e hall íntimo**
- `wallZ(4,32, z 3,41–4,24, 0,10)` — **door z 3,41–4,22** (0,80, hall ↔ suíte americana, abre para a suíte, −x,
  dobradiça em z 4,22, folha aberta ao longo da parede z 4,24).
- `wallX(3,29, x 4,37–7,02, 0,10)` sul da suíte visita — **door x 4,46–5,23** (0,80, abre para a suíte, −z,
  dobradiça em x 4,46, folha aberta ao longo da parede x 4,37).
- `wallZ(7,07, z 0,25–3,34, 0,10)` suíte visita ↔ suíte master.
- **Porta do hall → suíte master**: `door` atravessando o hall em **x 6,72, z 3,42–4,12** (0,80 × 2,10, abre para o
  master, +x, dobradiça em z 4,12; batentes nas paredes z 3,29 e z 4,29 — não há parede, só a folha e o batente).
- `wallX(4,29, x 1,09–5,59, 0,10)` sala ↔ suíte americana/hall (parede do painel C). **open x 5,59–6,46** (0,87) =
  vão do hall, fechado por **porta de correr de marcenaria** 1,23 × 2,49 (MDF Carvalho Natural, trilho embutido no
  forro, folha corre para −x pela face da sala, sobre o painel; cota "123 PORTA DE CORRER").
- `wallZ(6,71, z 4,18–6,53, 0,10)` leste da sala (fundo da estante D). `open z 6,53–7,59` (1,06, sala ↔ hall de
  entrada). `wallZ(6,71, z 7,59–8,97, 0,11)` cozinha ↔ lavabo.

**Banho master, hall de entrada e lavabo**
- `wallX(4,31, x 6,76–7,72 e 8,36–8,55, 0,11)` norte do banho master — **door x 7,72–8,36** (0,70, abre para o
  banho, +z, dobradiça em x 8,36, folha aberta ao longo da parede x 8,42).
- `wallZ(6,71, …)` oeste (acima). Box: `glass` em x 7,63 (z 5,17–6,17) e em z 5,17 (x 6,76–7,63), porta de vidro
  de correr no vidro x 7,63.
- `wallX(6,22, x 6,77–7,63, 0,10)` sul do box + **shaft** x 6,75–7,52 · z 6,27–6,42; `wallX(6,47, x 6,66–8,55, 0,12)`
  sul do banheiro (modele o trecho x 6,66–7,63 cheio de z 6,17 a 6,53).
- `wallX(7,645, x 6,66–6,85 e 7,52–8,49, 0,11)` norte do lavabo — **door x 6,85–7,52** (0,70, abre para o lavabo,
  +z, dobradiça em x 6,85, folha aberta ao longo da parede x 6,77).

**Portas internas** (`door`): folha lisa **amadeirada clara (freijó/carvalho ≈ #c9a070, veio reto)** como nos renders
dos banheiros, batente e guarnição de 7 cm no mesmo tom, **maçaneta de alavanca dourada/champanhe** (y 1,02).
Porta de entrada: idem, 0,90, com fechadura digital. **Vidros**: caixilho **preto fino** (`M.frameDark`), vidro
incolor (`M.glass`); vidros dos boxes incolores (8 mm) com perfil preto.

## Marcenaria (prancha MARCENARIA R01 — cores e medidas em cm nas vistas; alturas 250 = 10 rodapé + 235 + 5 tampo)
Materiais: **MDF Gianduia Guararapes** (greige-champanhe acetinado/brilho) · **MDF Freijó Puro Duratex** (madeira
clara amarelada) · **MDF Carvalho Natural Guararapes** (carvalho claro) · **MDF Frapê Arauco** (greige claro fosco)
· **palhinha natural** (tela de cana) nas portas do buffet e do painel · puxadores em perfil dourado/champanhe
("a definir com a arquiteta").
- **Vista A — Cozinha/Lavanderia** (parede sul z 8,83, x 1,09–6,66 = 557, vista desenhada a partir da sala, portanto
  **espelhada**: na prancha a torre fica à direita; no modelo ela fica em x 1,09–1,61). Da esquerda (x menor):
  **torre** 52 × 30 × 250 (x 1,09–1,61 · z 7,98–8,28, porta inteira, "projeção abertura") · **nicho da geladeira** 85
  (x 1,61–2,46; geladeira 70 × 74,5 × 189 em x 1,71–2,41 · z 8,14–8,88) com armário superior · **bancada** 420 em
  x 2,45–6,65: base h 0,90 (rodapé 10 + 80) prof. 0,60 com módulos, da esquerda: lava-louça 51 (x 2,45–2,96),
  portas 42/43/43/43 (x 2,96–4,67; cooktop sobre x 3,94–4,53), gaveteiro 60 (x 4,67–5,27), **lavadora 66 sob a
  bancada** (x 5,27–5,93, "área molhada"), armário 73 (x 5,93–6,66, sob o tanque). **Superiores**: prof. 0,35, de
  y 1,60 a 2,45 (+5 de tampo até 2,50), portas de 45 ao longo da bancada, **coifa embutida** 75 cm sobre o cooktop
  (caixa preta/inox 0,75 × 0,33 × 0,27 em y 1,55–1,88, x 3,86–4,61), **nicho aberto em Freijó** (56 × 43) e **nicho do
  micro-ondas** (projeção 54 × 35) na região do lava-louça/geladeira (x ≈ 2,45–3,10), armário sobre a geladeira.
  Tudo em Gianduia; render: portas lisas brilhantes, puxadores embutidos.
- **Vista B — Buffet (móvel solto)** 219 × 40 × 85 (x 1,22–3,41 · z 6,76–7,16): 5 portas de 44 com **palhinha** em
  moldura Gianduia, pés metálicos dourados de 10 cm, tampo Gianduia. Fica atrás do sofá (encosto do sofá para z menor).
- **Vista C — Painel da sala de TV** (parede z 4,34, face sul; 557 = 20 + 430 + 108, altura 250): da esquerda,
  **painel ripado/liso em Carvalho Natural** 234 largo (x 1,29–3,63) com **TV 55" Samsung** (1,38 × 0,82 × 0,15 —
  eixo de instalação a 1,28 do início do painel, centro em x ≈ 2,40, y ≈ 1,39) e **balcão inferior** 60 de altura
  × 40 de profundidade (x 1,29–5,59 · z 4,34–4,74) com 8 portas de 54 (palhinha); à direita **cristaleira** 215
  (x 3,63–5,59) com 4 portas altas de 54 em palhinha/vidro (y 0,60–2,45) e prateleiras; o trecho 108 (x 5,59–6,66)
  é a **porta de correr** de marcenaria (folha 123 × 249, Carvalho Natural, corre para −x) + o lado da estante D.
  Base/tampo prof. 0,40; a cristaleira prof. 0,40; o painel ripado da TV prof. 0,05.
- **Vista D — Estante** 228 × 20 × 250 na parede x 6,66 (face oeste, x 6,45–6,65 · z 4,22–6,53), Carvalho Natural:
  parte inferior 90 com 5 portas de 46 (palhinha), parte superior 160 com nichos abertos (31 / 43 / 78 de altura;
  colunas 154 + 68 e 100 + 122). **O ar da sala (nº 9) fica sobre ela** — veja Objetos do cartão.
- **Vista E — Armário da suíte americana** 163 × 60 × 250 (x 3,66–4,26 · z 1,73–3,36, costas na parede x 4,32,
  portas para −x), **Frapê**, 4 portas 41/41/41/40 com puxador vertical dourado central; interior cabideiro + gavetas.
- **Vista F — Cômoda da suíte visita** 266 × 55 × 110 (x 4,36–7,01 · z 0,25–0,80, encostada na parede norte sob a
  janela), **Freijó**, 4 colunas 67/66/67/66 × 3 linhas de gavetas (33/33/34) com puxador botão central superior,
  **nicho aberto** no canto inferior direito (133 × 34), rodapé 10.
- **Vista G — Armário da suíte master** 478 × 60 × 250 ao longo da parede leste (frente em x ≈ 9,53, z 0,24–4,43;
  no trecho z 0,25–1,59 a planta mostra só 0,24–0,40 de profundidade — ≈), **Frapê**: 3 portas 44/44/46 (z 0,24–1,58),
  **painel de espelho** 128 (z 1,59–2,87, cobre o pilar), 3 portas 52/52/52 (z 2,87–4,43); interior com sapateira,
  prateleiras, cabideiros e gavetas; puxadores verticais dourados.
- **Vista H — Retorno em L** 160 × 60 × 250 na parede sul da suíte (x 8,54–10,13 · z 4,43–5,02, portas para −z):
  2 portas de 49 **com espelho** (x 8,54–9,52) + porta de 61 do canto.
- **Vista I — Lavatório do banheiro americano** (parede norte, x 2,89–4,25): gabinete suspenso 136 × 55 (basculante
  30 + gaveta 20, de y 0,33 a 0,83), **bancada de pedra** 1,36 × 0,55 × 0,07 em y 0,83–0,90 com cuba de embutir,
  **espelheira** 136 × 110 (3 portas 45/45/46 com espelho, Frapê, y 1,25–2,35, prof. 0,15). Pedra clara (não
  especificada — use mármore/granito bege claro com pintas, como o desenho).
- **Vista J — Banho master** (parede sul, x 7,62–8,42): gabinete 80 × 55 (basculante 30 + gaveta 20), bancada 0,80 ×
  0,55 em y 0,90, espelheira 80 × 110 (2 portas 40/40 com espelho, y 1,25–2,35); render com parede clara e porta
  amadeirada.
- **Lavabo**: bancada de pedra clara 0,80 × 0,45 (x 6,77–7,57 · z 8,39–8,84, y 0,90) com cuba esculpida (X no desenho)
  e torneira de parede; sem marcenaria detalhada (use saia de pedra ou gabinete Frapê).
- **Cabeceira da suíte master**: dois **painéis/criados em madeira escura (≈ #8c7a63)** 30 × 52/59 ladeando a cabeceira
  (x 7,14–7,44 · z 0,40–0,92 e z 2,65–3,24), h ≈ 0,60 — criados-mudos embutidos; cabeceira estofada da cama entre eles.

## Marmoraria (prancha MARMORARIA)
- **Bancada da cozinha**: **Granito São Gabriel escovado** (preto com pintas cinza, acabamento fosco) 420 × 65 × 2 cm
  (x 2,45–6,65 · z 8,18–8,83, topo em y 0,90) com **rodamão de 70 cm** (frontão da mesma pedra, y 0,90–1,60, 2 cm,
  colado na parede z 8,83 — na prancha é a peça em L do render); **cuba branca** 50 × 40 de embutir (centro x ≈ 3,28,
  segmento "118") e **tanque inox** 50 × 40 (centro x ≈ 6,29, segmento "68"), torneiras altas cromadas/douradas;
  "área molhada" h = 1 cm.
- Bancadas dos banheiros/lavabo e da área de serviço: pedra clara com pintas (desenho bege salpicado) — não detalhada.

## Mobiliário solto e eletrodomésticos (prancha MOBILIÁRIO — símbolos 1–15; L × A × P)
| Nº | Item | Medida | Posição |
|---|---|---|---|
| 1 | Coifa de embutir Tramontina 75 Incasso inox | 75 × 32,5 × 27 | sob o superior, sobre o cooktop (x 3,86–4,61 · y 1,55–1,88) |
| 2 | Cooktop Electrolux 4 bocas inox | 60 × 10 × 52 | x 3,94–4,53 · z 8,30–8,82 sobre a bancada |
| 3 | Purificador Everest Fit (prata ou preto) | 31 × 28 × 37 | sobre a bancada, x ≈ 5,30–5,61 · z 8,55–8,80 |
| 4 | Lavadora Samsung 11 kg inox/preto | 60 × 85 × 55 | sob a bancada, x 5,30–5,90 (frente em z 8,18) |
| 5 | Lava-louça Electrolux 10 serviços inox | 44,8 × 84,5 × 60 | sob a bancada, x 2,48–2,93 |
| 6 | Micro-ondas Brastemp 32 L cinza espelhado | 53,8 × 30 × 39 | no nicho do superior, x ≈ 2,50–3,04 · y ≈ 1,60–1,95 |
| 7 | Geladeira French Door Electrolux 484 L inox | 69,9 × 189 × 74,5 | x 1,71–2,41 · z 8,14–8,88 (portas abrem para −z) |
| 8 | Smart TV Samsung 55" | 138 × 82 × 15 | no painel C, centro x ≈ 2,40 · y 1,39, face para +z |
| 9 | Ar split Electrolux 18 000 BTU branco | 106 × 35 × 24 | sala — ver Objetos do cartão |
| 10 | Ar split Philco 9 000 BTU branco | 72 × 27 × 20 | suíte americana, parede z 4,29 (face norte), x 2,46–3,18, y 2,15–2,42 |
| 11 | Sofá-cama Borneo Anjos, 2 módulos, tecido cinza | 180 × 90 × 95 (2 × 102 cm) | suíte americana, x 1,21–3,01 · z 3,34–4,24, encosto na parede z 4,29, assento virado para −z |
| 12 | Ar split Philco 9 000 BTU branco | 72 × 27 × 20 | suíte visita, parede x 4,37 (face leste), z 1,68–2,40, y 2,15–2,42 |
| 13 | Cama box casal Ortobom 1,38 × 1,88 (h 0,61) | 138 × 60 × 188 | suíte visita, x 5,13–7,01 · z 1,35–2,73, cabeceira na parede x 7,07 (pés para −x); roupa de cama azul-claro |
| 14 | Cama box queen Herval Amore 1,58 × 1,98 (h 0,67) | 67 × 158 × 198 | suíte master, x 7,12–9,10 · z 0,99–2,57, cabeceira na parede x 7,07 (pés para +x); roupa de cama cinza-claro |
| 15 | Ar cassete Elgin 12 000 BTU 1 via (quente/frio) | 108 × 17 × 47 | suíte master, no forro, x 8,27–9,35 · z 3,45–3,92 |

Outros móveis (planta de layout, sem ficha): **sofá da sala** 3 lugares 2,16 × 0,81 (x 1,22–3,38 · z 5,93–6,75,
encosto no buffet, virado para a TV, tecido off-white/linho); **mesa de jantar** 2,39 × 0,91 (x 3,44–5,83 ·
z 6,25–7,16, tampo de madeira clara/freijó h 0,75) com **8 cadeiras** (0,48 × 0,48, 4 de cada lado em x 3,50 / 4,10 /
4,68 / 5,28, z 6,01–6,15 e 7,29–7,43; estrutura madeira clara, assento estofado claro); **tapete** sob a mesa e sob o
sofá (≈); **pendentes dourados** sobre a mesa (render); **máquina/tanque da área de serviço**: a planta de layout
desenha um aparelho com tampa 0,62 × 0,53 (x 0,20–0,82 · z 7,87–8,40) sobre/sob a bancada de pedra — como a
lavadora nº 4 está na cozinha, trate-o como **tanque de louça + armário** (ou lavadora antiga; **incerto**).
Louças: vasos sanitários brancos (banheiro americano em x 1,95–2,77 · z 0,23–0,92, encosto na parede norte; banho
master x 6,90–7,55 · z 4,40–5,00; lavabo x 7,85–8,30 · z 8,10–8,80, encosto na parede sul), duchas de teto nos boxes
(chuveiro quadrado na parede norte do box americano e na parede oeste do box master, a 2,20).

## Alturas ergonômicas (prancha ERGONÔMICA — só tem cotas em planta; alturas tiradas das vistas)
- Circulações cotadas: hall 0,90; passagem entre o sofá-cama e o armário E 0,65; frente da cômoda F → cama 0,60;
  cama casal → parede sul 0,52; pé da cama queen → armário 0,52; lado da cama queen → parede 0,74/0,77; mesa →
  painel 1,50; mesa → bancada 1,02; sofá → painel 1,20; cadeiras 0,62 até a estante; faixa livre de 0,82 entre o buffet
  e a geladeira; passagem sala → hall de entrada 1,06; box americano 0,85 × 1,11; box master 0,87 × 0,99.
- Alturas: bancada da cozinha 0,90 (rodamão até 1,60; superiores 1,60–2,45); bancadas dos banheiros/lavabo 0,90
  (gabinete 0,33–0,83, espelheira 1,25–2,35); mesa 0,75; cadeiras assento 0,45; sofás assento 0,42 / encosto 0,90;
  buffet 0,85; cômoda F 1,10; balcão do painel 0,60; TV eixo 1,39; camas 0,61 / 0,67 (colchão topo); criados 0,60;
  armários 2,50; splits a 2,15–2,42; maçanetas 1,02; chuveiros 2,20; janelas 1,10–2,20 (≈); basculante 1,60–2,26.

## Entidades do Home Assistant (sugestão — chaves do cartão)
| Chave | Entidade | Onde / o que anima |
|---|---|---|
| `luz_sala` | light | spots de gesso + pendentes sobre a mesa (3 pendentes dourados em x 3,9 / 4,6 / 5,3 · z 6,7 · y 1,8) |
| `luz_cozinha` | light | fita de LED sob os superiores (y 1,60, x 2,45–6,65) + spots |
| `luz_varanda` | light | arandela/plafon na varanda (x 0,5 · z 4,0 · y 2,4) |
| `luz_servico` | light | plafon da área de serviço |
| `luz_hall` | light | hall íntimo |
| `luz_hall_entrada` | light | hall de entrada + lavabo (ou `luz_lavabo` separado) |
| `luz_lavabo` | light | lavabo |
| `luz_suite_master` | light | suíte master (spots + fita na sanca; abajures nos criados) |
| `luz_banho_master` | light | banho master |
| `luz_suite_visita` | light | suíte visita |
| `luz_suite_americana` | light | suíte americana 01 |
| `luz_banheiro_americano` | light | banheiro americano (box/vaso + lavatório) |
| `ac_sala` | climate | split 18 000 (nº 9): aleta + fluxo de ar |
| `ac_suite_americana` | climate | split 9 000 (nº 10) |
| `ac_suite_visita` | climate | split 9 000 (nº 12) |
| `ac_master` | climate | cassete 1 via (nº 15) no forro |
| `porta_entrada` | binary_sensor | porta de entrada (x 8,49 · z 6,62–7,49) abre/fecha |
| `tv_sala` | media_player | TV 55" no painel C (tela acende) |
| `porta_varanda` | binary_sensor (opcional) | porta de correr de vidro da sala |

## Objetos do cartão (ligados a entidades — NÃO recrie nem cubra)
- **TV** (`tv_sala`): 1,38 × 0,82, centro (2,40; 1,39); **corpo preto z 4,39–4,43** (fica na frente do painel ripado de
  5 cm) e tela em z 4,433, face para +z. Luz da TV 1 m à frente. (Implementado assim no cartão.)
- **Ar da sala** (`ac_sala`): split 1,06 × 0,35 × 0,24 na face oeste da estante D / parede x 6,66 — a prancha de
  mobiliário põe o símbolo 9 sobre a estante (x ≈ 6,5 · z ≈ 6,0); coloque-o em **(6,52; 2,25; 6,00)** com a face para
  −x, no nicho superior da estante (deixe o nicho correspondente vazio). Fluxo de ar para −x. (No cartão: centro (6,54; 2,25; 6,00).)
- **Ar da suíte americana** (`ac_suite_americana`): split 0,72 × 0,27 × 0,20 na face norte da parede z 4,29 (face em z 4,24):
  centro **(2,82; 2,28; 4,135)**, face para −z. **Ar da suíte visita** (`ac_suite_visita`): (4,47; 2,28; 2,04) na parede
  x 4,37, face para +x.
- **Ar cassete da suíte master** (`ac_master`): 1,08 × 0,17 × 0,47 embutido no forro, centro (8,81; 2,50; 3,68),
  grelha de 1 via soprando para +z (para o pé da cama). Todo split/cassete tem **aleta que abre** e **fluxo de ar**;
  deixe 1,5 m livres à frente e abaixo.
- **Porta de entrada** (`porta_entrada`): folha 0,90 que gira com o sensor (dobradiça em (8,49; 7,49)), abrindo para −x
  (para dentro do hall de entrada); na visão de Pessoa abre sozinha quando a pessoa chega perto.
- **Porta de correr do hall** (marcenaria): o cartão cria a folha (MDF Carvalho Natural, x 5,50–6,68 × 2,48, puxador
  vertical dourado) na **face do hall** (z ≈ 4,20–4,24) e a anima na visão de Pessoa (corre 1,10 m para −x, até x ≈ 4,40).
  Não crie outra folha nem nada no hall rente à parede z 4,24 entre x 4,37 e 6,70.
- **Portas internas** (todas as `door` da lista de paredes): folha lisa de freijó, batente/guarnição e alavanca — o cartão cria
  e anima (abrem sozinhas na visão de Pessoa para o lado livre). **Portas de correr de vidro da varanda**: o cartão cria
  (caixilho preto; na da suíte a 2ª folha e na da sala a 2ª folha estão corridas — são as passagens). Janelas e basculante: cartão.
- Luminárias de cada chave (posições na tabela de ITEMS do cartão): spots de gesso Ø 0,10 no forro; não coloque
  nada num raio de 0,3 m delas.
- **Modo Fachada** (`ctx.ext`): o cartão põe o forro de gesso (2,50; 2,40 nos banheiros) sobre cada zona e as lajes de
  cobertura e de piso em L (o canto x 8,55–10,23 · z 5,14–8,97 é área comum). A visão de Pessoa liga a Fachada sozinha
  (por dentro se vê o forro). Peças que só fazem sentido com o forro (sancas, trilhos de cortina embutidos) vão em `ctx.addExt`.

## API ctx para os cômodos (o que o cartão `apto-vovo-card.js` entrega hoje)
Cada `rooms/<chave>.js` define só `function room<Nome>(ctx) { … }`; o `integrate_rooms.py` injeta no cartão entre
`// @rooms-begin` / `// @rooms-end` e chama `room<Nome>(ctx(seed))` entre `// @room <chave>` / `// @endroom`
(sala_jantar 21 · cozinha_servico 22 · suite_master 23 · suites_visita 24 · banheiros 25). Arquivo ausente → stub vazio.
- **Colisores do modo Pessoa** (móveis): `ctx.addCollider(x0, z0, x1, z1, h = 1)` — caixa na planta (ordem dos cantos livre).
  Sinônimos: `ctx.collider(...)`, `ctx.collide(...)`, `ctx.solid(x0, z0, x1, z1, h)`; ou `ctx.colliders.push({ x0, z0, x1, z1, h })`
  / `ctx.colliders.push([x0, z0, x1, z1])` (o array é lido depois que todos os cômodos rodam). Os colisores entram na mesma lista
  das paredes: bloqueiam a caminhada, a navegação por clique (A*) desvia deles, o clique sobre o móvel leva a pessoa para a frente
  dele e as portas não giram por cima deles. Deixe livres os vãos de porta e as passagens (≥ 0,6 m).
- **Materiais do apartamento em `ctx.M`** (mesmos objetos para todos — não clone): `gianduia` (MDF greige-champanhe, rug. 0,35),
  `frape` (greige claro fosco), `carvalho` e `freijo` (veio em espaço de mundo), `palhinha` (tela de cana com furos, `alphaTest`,
  dupla face), `granitoPreto` (São Gabriel escovado), `pedraClara` (bege com pintas), `porcelanatoGreige` (0,9 × 0,9 com junta),
  `porcelanatoBege` (grande formato, sem junta — as juntas do box são da decoração), `espelho` (metal 1, envMap; nos níveis leve/min
  vira um cinza refletivo), `dourado`, `inox`, `linho`, `forro`, `laje`. Continuam os da igreja: `wall`, `baseboard`, `glass`,
  `glassSmoke`, `frameDark`, `chrome`, `mirror`, `steel`, `white`, `dark`, `door` (agora freijó), `doorFrame`, `porcelanatoCinza`,
  `marmorato`, `woodDark`, `cushion`, `plant`, `pot` etc.
- **Brilho/emissivos**: `ctx.bindEmissive(key, mat, max = 1, { min = 0,08 })` → **devolve o próprio material** (pode usar
  `const m = ctx.bindEmissive('luz_suite_master', std({...emissive}), 0.8, { min: 0 })`); `ctx.glowPlane(w, h, key, opts)`; `ctx.TEX`.
- **Texturas**: `ctx.makeTex(size, (g2d, size) => { … }, [rx, ry])` → CanvasTexture (sRGB, repetição).
- **Constantes**: `ctx.H` = 2,6 (laje/paredes), `ctx.T` = 0,10, `ctx.SPEC` = `{ H_LAJE 2,6, H_FORRO 2,5, H_BANHO 2,4, LAJE 0,12,
  PEITORIL 1,1, TOPO_JANELA 2,2 }`, `ctx.ZONES` (pisos do cartão), `ctx.LOT` (área modelada). `ctx.logo`, `ctx.STAIR`, `ctx.MEZZ`,
  `ctx.PILLARS_*` e `ctx.addMezz` **não existem mais** (eram da igreja).
- Chaves de entidade para `bindEmissive`/`glowPlane`: `luz_sala`, `luz_cozinha`, `luz_varanda`, `luz_servico`, `luz_hall`,
  `luz_hall_entrada`, `luz_lavabo`, `luz_suite_master`, `luz_banho_master`, `luz_suite_visita`, `luz_suite_americana`,
  `luz_banheiro_americano`, `tv_sala`, `ac_sala`, `ac_suite_americana`, `ac_suite_visita`, `ac_master`, `porta_entrada`.
- Luz real dos pendentes da mesa: o cartão tem uma luz "escondida" em (4,6; 1,72; 6,7) ligada a `luz_sala` (a peça visível é da
  decoração). Spots de gesso do cartão: ver `ITEMS` (y 2,49 nos secos, 2,39 nos banheiros).

## API disponível no `ctx` (igual ao casa-chefe/igreja, com extras)
- `ctx.THREE`, `ctx.box(w,h,d,mat,x,y,z,opts)`, `ctx.cyl(rTop,rBot,h,mat,x,y,z,seg,open)`, `ctx.sph(r,mat,x,y,z)`,
  `ctx.place(group,x,z,ry,y)`, `ctx.add(mesh)`, `ctx.std({...})` (materiais com cache), `ctx.rnd()`, `ctx.M` (materiais prontos),
  `ctx.F` (peças prontas: bed, nightstand, wardrobe, desk, officeChair, bookshelf, sofa, diningTable, chair, fridge, stove, hood,
  cabinet, sink, toilet, shower, washbasin, shelves, plant, tree, rug, roundTable…), `ctx.ZONES`, `ctx.H` (2,6), `ctx.T`, `ctx.LOT`.
- **Extras herdados da igreja**: `ctx.ext` (Group do modo Fachada) e `ctx.addExt(mesh)`; `ctx.makeTex(size, drawFn(g2d, size), [rx, ry])`
  → CanvasTexture (use só para a tela da TV, quadros e etiquetas); `ctx.SPEC` (constantes: `H_FORRO` 2,5, `H_BANHO` 2,4).
  **Não use `ctx.logo` nem nada do telão/palco** — eram da igreja e já foram removidos do cartão.
- Tudo o que você cria é fundido por material automaticamente (`mergeStatic`), então muitas peças pequenas custam pouco em draw calls,
  mas **não use InstancedMesh** (o merge não entende instâncias) e reaproveite materiais (`ctx.std` com as mesmas opções → mesmo material).
  No merge, materiais simples quase iguais (cor ±22/255, rugosidade/metal ±0,25; sem mapa, transparência nem emissivo) viram um só,
  e materiais **idênticos** com mapa/emissivo/transparência (mesma textura — o mesmo objeto — e mesmas opções) também — por isso
  reaproveite texturas. Os ligados a `ctx.bindEmissive` nunca são trocados por outro.
  Peças rente ao chão (topo ≤ 0,1 m) com `cast: false` entram no grupo das que projetam sombra do mesmo material (economiza draw call).
  Os pisos das zonas ficam em y = 0,004.

### Brilho ligado às entidades
- `ctx.bindEmissive(key, material, max = 1, { min = 0,08 })` → o `emissiveIntensity` do material passa a seguir a entidade:
  `max × (min + (1 − min) × nível)` (nível 0–1, com o fade e o brilho da luz). Vale depois do merge (o material é o mesmo).
  Use na tela da TV (`'tv_sala'`), LEDs dos eletros, fita de LED da cozinha (`'luz_cozinha'`), abajures (`'luz_suite_master'`).
- `ctx.glowPlane(w, h, key, { color, base = 0,45, day = 0,35, tex: 'glow' | 'frame' })` → plano aditivo (bloom barato) virado
  para +z que acende com a entidade (opacidade `nível × base`, × `day` de dia). `'frame'` = moldura vazada (halo em volta de telas).
  Planos da mesma entidade com as mesmas opções compartilham o material e são fundidos num draw call. Posicione e `ctx.add`.
- `ctx.TEX` = texturas prontas do cartão (`TEX.glow`, `TEX.wood`, `TEX.tileGray`…) — reaproveite em vez de criar outra.

### Acabamentos prontos em `ctx.M` (a adaptar no cartão; use estes nomes)
- `M.gianduia` (MDF greige-champanhe, rugosidade 0,35), `M.frape` (MDF greige claro fosco), `M.carvalho` (carvalho claro
  com veio), `M.freijo` (freijó claro), `M.palhinha` (tela de cana — textura em espaço de mundo, `alphaTest`), `M.granitoPreto`
  (São Gabriel escovado — preto com pintas, padrão em espaço de mundo), `M.pedraClara` (bege com pintas), `M.espelho`
  (metalness 1, roughness 0,05, envMap), `M.dourado` (puxadores/metais champanhe), `M.inox`, `M.linho` (estofados off-white),
  `M.porcelanatoGreige`, `M.porcelanatoBege`, `M.porcelanatoCinza`, `M.glass`, `M.frameDark`, `M.door` (freijó), `M.doorFrame`, `M.wall`.
- **Padrões calculados em espaço de mundo** (`M.granitoPreto`, `M.palhinha`, porcelanatos) repetem em metros em qualquer peça,
  sem UV e sem textura a mais. **Não clone** (o `clone()` perde o padrão): reaproveite o mesmo objeto.
- `ctx.std({ map: tex, … })` pode receber textura: a chave do cache usa o **uuid** da textura.

### Renderização (cuidados)
- Tone mapping **Neutral**, exposição 1,0: as cores saem como você escreve — não "compense" clareando materiais.
- De dia há menos luz ambiente chapada (hemisfério 0,85, ambiente 0,12) e mais reflexo do céu (environment 0,9): metal, espelho e
  vidro refletem mais. `M.glass` é Standard com `envMapIntensity 1,6`.
- **Orçamento de GPU**: os materiais PBR já usam ~250 vetores de uniform e 13 samplers. Nos pisos/decoração, **no máximo 2 mapas por
  material** (ex.: `map` + `bumpMap`); nada de `normalMap`/`roughnessMap` grandes. Emissivos e texturas de canvas ficam fora do merge:
  prefira compartilhar a mesma textura/material.
- Rótulos: tamanho fixo na tela, somem perto da câmera e, de longe, só os ambientes principais aparecem.

## Regras para as funções de decoração
1. Escreva APENAS `function room<Nome>(ctx) { … }` no seu arquivo `rooms/<arquivo>.js` (sem import/export, sem código fora da função,
   sem `console.log`). ES2020 válido. Builders locais dentro da função.
2. Só primitivas; nada de fetch, texturas externas ou luzes (PointLight/SpotLight) — o cartão cuida da iluminação.
3. Mantenha móveis ≥ 0,05 m das paredes (exceto marcenaria encostada, que fica a 0,01), fora do vão das portas
   (largura + 0,9 m de giro) e fora dos objetos do cartão acima. Marcenaria encostada: rodapé de 10 cm recuado 3 cm.
4. Vidro/objetos finos: `{ cast: false }`.
5. Estilo: apartamento contemporâneo quente — greige/champanhe, madeira clara (carvalho/freijó), palhinha, pedra preta na cozinha,
   metais dourados, estofados em linho off-white, cortinas de linho nas janelas e na varanda; nada de cores saturadas.

## Grupos de mobiliamento (agentes paralelos — um arquivo `rooms/<key>.js` por grupo, seeds a partir de 21)
| key | função | seed | escopo |
|---|---|---|---|
| `sala_jantar` | `roomSalaJantar` | 21 | Sala de estar + jantar + hall de entrada: painel C (TV é do cartão), estante D, buffet B, porta de correr (cartão anima; o agente cria a folha fechada se o cartão não criar), sofá 3 lugares, tapete, mesa de jantar + 8 cadeiras, pendentes decorativos (sem luz), cortina de linho da porta de vidro da sala, quadros, plantas; capacho e espelho no hall de entrada |
| `cozinha_servico` | `roomCozinhaServico` | 22 | Cozinha linear (vista A: torre, nicho da geladeira, base, superiores, coifa, nichos) + bancada e rodamão de granito São Gabriel + cuba/tanque/torneiras + eletros 1–7 + varanda inteira (guarda-corpo/vidro é do cartão; piso, plantas, cadeira) + área de serviço (bancada de pedra, tanque/máquina, prateleira) |
| `suite_master` | `roomSuiteMaster` | 23 | Suíte master: cama queen 14 com cabeceira estofada e criados embutidos, armário G (com espelho sobre o pilar) e retorno H, cortina da janela, tapete, abajures, antecâmara (porta do hall é do cartão) |
| `suites_visita` | `roomSuitesVisita` | 24 | Suíte visita (cama casal 13, cômoda F, cortina da janela, tapete) + suíte americana 01 (sofá-cama 11, armário E, cortina da porta de vidro, tapete, mesinha) + hall íntimo (quadro, console estreito se couber) |
| `banheiros` | `roomBanheiros` | 25 | Banheiro americano (box com vidro/porta, chuveiro, vaso, nicho, lavatório I com espelheira e bancada) + banho master (box, vaso, bancada J, espelheira, toalheiro) + lavabo (bancada de pedra com cuba esculpida, torneira de parede, vaso, espelho) + revestimento das paredes dos boxes até 2,40 |

Pontos a conferir com o cliente (incertezas): pé-direito/forro; peitoril das janelas; se a varanda é fechada com cortina de
vidro; o que fica na ponta da varanda (tanque × lavadora); se a passagem lavatório → suíte americana tem porta; profundidade
do armário G no trecho norte; cores exatas dos pisos (não há prancha de pisos); posição final do ar da sala (nº 9).
