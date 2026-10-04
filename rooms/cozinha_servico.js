function roomCozinhaServico(ctx) {
  // ---------------------------------------------------------------------------
  // COZINHA LINEAR (parede sul, x 1,09–6,66 · frente z 7,98–8,18 · fundo z 8,83), VARANDA (x 0,17–1,05 · z 0,23–7,94)
  // e ÁREA DE SERVIÇO (x 0,17–0,86 · z 7,94–8,59). Fonte: MARCENARIA vista A (MDF Gianduia), MARMORARIA (granito São
  // Gabriel escovado 4,20 × 0,65 + rodamão 0,70), MOBILIÁRIO (eletros 1–7), LAYOUT (varanda / máquina).
  // Da esquerda (x menor) para a direita: torre 52 · nicho da geladeira 85 · bancada 420 (lava-louça 51, portas 42/43/43/43,
  // gaveteiro 60, lavadora 66, armário 73). Superiores 1,60–2,45 (+5 de tampo): 2 portas sobre a geladeira (y 1,93–2,45),
  // coluna dos nichos (Freijó aberto + micro-ondas) x 2,47–3,04 e 8 portas de 45 até x 6,66; coifa embutida sobre o cooktop.
  // Piso, paredes, vidros e guarda-corpo são do cartão. Colisores do modo Pessoa: ctx.solid(x0,z0,x1,z1,h) quando o cartão
  // oferecer (chamada protegida).
  // ---------------------------------------------------------------------------
  const THREE = ctx.THREE, M = ctx.M;
  const box = (...a) => ctx.box(...a), cyl = (...a) => ctx.cyl(...a), sph = (...a) => ctx.sph(...a);
  const std = (o) => ctx.std(o), rnd = () => ctx.rnd();
  const put = (m) => { ctx.add(m); return m; };
  const nc = { cast: false };
  const solid = (x0, z0, x1, z1, h = 1) => { if (typeof ctx.solid === 'function') ctx.solid(x0, z0, x1, z1, h); };
  // caixa por limites (x0,x1,y0,y1,z0,z1)
  const bx = (x0, x1, y0, y1, z0, z1, mat, o) => put(box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, o));
  // cilindro com eixo em x ('x'), y ('y') ou z ('z')
  const cy = (r0, r1, len, mat, x, y, z, axis = 'y', seg = 16, o = {}) => {
    const m = cyl(r0, r1, len, mat, x, y, z, seg);
    if (axis === 'x') m.rotation.z = Math.PI / 2; else if (axis === 'z') m.rotation.x = Math.PI / 2;
    if (o.cast === false) m.castShadow = false;
    return put(m);
  };

  // ------------------------------------------------------------ materiais
  const gian = M.gianduia || std({ color: 0xb4a58f, roughness: 0.3 });
  const frape = M.frape || std({ color: 0xcfc6b8, roughness: 0.6 });
  const freijo = M.freijo || std({ color: 0xd6b27a, roughness: 0.6 });
  const carv = M.carvalho || std({ color: 0xcaa874, roughness: 0.65 });
  const gran = M.granitoPreto || std({ color: 0x2b2b2e, roughness: 0.55 });
  const pedra = M.pedraClara || std({ color: 0xd8cdb8, roughness: 0.4 });
  const dour = M.dourado || std({ color: 0xc9a86a, roughness: 0.3, metalness: 0.85 });
  const inox = M.inox || std({ color: 0xc4c7ca, roughness: 0.3, metalness: 0.9 });
  const linho = M.linho || std({ color: 0xe6dfd0, roughness: 1 });
  const plinth = std({ color: 0x4a443b, roughness: 0.8 });                          // rodapé escuro recuado
  const inner = std({ color: 0xcdc3b3, roughness: 0.7 });                           // interior dos módulos
  const ceramic = std({ color: 0xf6f5f1, roughness: 0.2 });                         // louça (cuba branca)
  const blackApp = std({ color: 0x151517, roughness: 0.35, metalness: 0.4 });       // eletro preto
  const steelDark = std({ color: 0x41444a, roughness: 0.35, metalness: 0.8 });      // lavadora inox escuro
  const glassDk = std({ color: 0x0b1118, roughness: 0.08, metalness: 0.6 });        // vidro escuro (porta da lavadora)
  const chrome = std({ color: 0xd9dcdf, roughness: 0.15, metalness: 1 });
  const micro = std({ color: 0xa9adb2, roughness: 0.12, metalness: 0.9 });          // micro-ondas cinza espelhado
  const leaf = [std({ color: 0x3b6b36, roughness: 0.9 }), std({ color: 0x4d7f43, roughness: 0.9 }), std({ color: 0x2d5a30, roughness: 0.9 })];
  const potTerra = std({ color: 0xb8764f, roughness: 0.9 });
  const potCream = std({ color: 0xe3dccd, roughness: 0.8 });
  const potDark = std({ color: 0x35332f, roughness: 0.7 });
  const soil = std({ color: 0x2b211a, roughness: 1 });
  const rattan = std({ color: 0xc9a46a, roughness: 0.95 });
  const white = std({ color: 0xf2f0ea, roughness: 0.5 });
  const plastic = [0x4b7fb5, 0xd8a53a, 0x6aa27a, 0xe9e5da].map((c) => std({ color: c, roughness: 0.4 }));
  const board = std({ color: 0xb78d5a, roughness: 0.7 });

  // ------------------------------------------------------------ utilidades
  // Planta em vaso (figueira / folhagem): vaso cônico + tronco + tufos de esferas achatadas
  const plant = (x, z, s = 1, potMat = potTerra, h = 0.9, n = 7) => {
    cy(0.14 * s, 0.1 * s, 0.26 * s, potMat, x, 0.13 * s, z);
    cy(0.125 * s, 0.125 * s, 0.02, soil, x, 0.265 * s, z, 'y', 12, nc);
    cy(0.012, 0.018, h * 0.7, std({ color: 0x5b4632, roughness: 1 }), x, 0.26 * s + h * 0.35, z, 'y', 6);
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, r = (0.05 + rnd() * 0.13) * s, y = 0.26 * s + h * (0.45 + rnd() * 0.55);
      const rr = (0.09 + rnd() * 0.07) * s;
      // folhas não atravessam o peitoril/guarda-corpo (x 0,17) nem o vidro da sala (x 1,02)
      const lx = Math.min(Math.max(x + Math.cos(a) * r, 0.18 + rr), 1.0 - rr);
      const m = sph(rr, leaf[i % 3], lx, y, z + Math.sin(a) * r);
      m.scale.set(1, 0.7 + rnd() * 0.3, 1); put(m);
    }
    solid(x - 0.13 * s, z - 0.13 * s, x + 0.13 * s, z + 0.13 * s, 1);   // só o vaso: a varanda (0,85 m) continua passável
  };
  // Torneira alta (pescoço de ganso) fixa na bancada ou na parede; sai para -z (frente da cozinha)
  const gooseneck = (x, y, z, mat, h = 0.28, reach = 0.16) => {
    cy(0.012, 0.014, h, mat, x, y + h / 2, z, 'y', 10, nc);
    cy(0.009, 0.009, reach, mat, x, y + h, z - reach / 2, 'z', 8, nc);
    cy(0.011, 0.007, 0.05, mat, x, y + h - 0.025, z - reach, 'y', 8, nc);
    bx(x - 0.003, x + 0.003, y + h + 0.01, y + h + 0.05, z + 0.0, z + 0.004, mat, nc);    // alavanca
  };
  // Pia/cuba embutida: aro, quatro paredes e fundo; rim 1 cm acima do tampo
  const basin = (cx, cz, w, d, yTop, mat, depth = 0.2, wall = 0.012) => {
    bx(cx - w / 2 - 0.012, cx + w / 2 + 0.012, yTop, yTop + 0.01, cz - d / 2 - 0.012, cz - d / 2, mat, nc);
    bx(cx - w / 2 - 0.012, cx + w / 2 + 0.012, yTop, yTop + 0.01, cz + d / 2, cz + d / 2 + 0.012, mat, nc);
    bx(cx - w / 2 - 0.012, cx - w / 2, yTop, yTop + 0.01, cz - d / 2, cz + d / 2, mat, nc);
    bx(cx + w / 2, cx + w / 2 + 0.012, yTop, yTop + 0.01, cz - d / 2, cz + d / 2, mat, nc);
    bx(cx - w / 2, cx + w / 2, yTop - depth, yTop - depth + wall, cz - d / 2, cz + d / 2, mat, nc);           // fundo
    bx(cx - w / 2, cx - w / 2 + wall, yTop - depth, yTop, cz - d / 2, cz + d / 2, mat, nc);
    bx(cx + w / 2 - wall, cx + w / 2, yTop - depth, yTop, cz - d / 2, cz + d / 2, mat, nc);
    bx(cx - w / 2, cx + w / 2, yTop - depth, yTop, cz - d / 2, cz - d / 2 + wall, mat, nc);
    bx(cx - w / 2, cx + w / 2, yTop - depth, yTop, cz + d / 2 - wall, cz + d / 2, mat, nc);
    cy(0.02, 0.02, 0.004, chrome, cx, yTop - depth + wall + 0.002, cz, 'y', 12, nc);                         // ralo
  };
  // Tampo de pedra com furos retangulares [cx, cz, w, d]: recorta em faixas
  const slab = (x0, x1, z0, z1, y0, y1, mat, holes = []) => {
    const hs = holes.map(([cx, cz, w, d]) => [cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2]).sort((a, b) => a[0] - b[0]);
    let cur = x0;
    for (const [a, b, c, e] of hs) {
      if (a > cur) bx(cur, a, y0, y1, z0, z1, mat);
      bx(a, b, y0, y1, z0, c, mat); bx(a, b, y0, y1, e, z1, mat);
      cur = b;
    }
    if (x1 > cur) bx(cur, x1, y0, y1, z0, z1, mat);
  };

  // =========================================================================
  // COZINHA
  // =========================================================================
  const ZB = 8.83;                      // face interna da parede sul
  const ZF = 8.22;                      // frente das portas da base (granito avança até 8,18)
  const YB = 0.88;                      // topo do corpo da base (granito de 2 cm sobe a 0,90)
  const DG = 0.003;                     // folga entre portas

  // ---------- Torre 52 × 30 × 250 (x 1,09–1,61 · z 7,98–8,28), porta inteira
  bx(1.09, 1.61, 0.10, 2.50, 7.98, 8.28, gian);
  bx(1.10, 1.60, 0.0, 0.10, 8.01, 8.28, plinth, nc);
  bx(1.095, 1.605, 0.105, 2.495, 7.965, 7.98, gian);                              // folha da porta
  bx(1.09, 1.61, 0.10, 0.1015, 7.96, 7.98, plinth, nc);
  bx(1.565, 1.575, 1.0, 1.55, 7.945, 7.965, dour, nc);                             // puxador vertical embutido (a definir)
  solid(1.09, 7.98, 1.61, 8.28, 2.5);

  // ---------- Nicho da geladeira (x 1,61–2,46): laterais e fundo de Gianduia
  bx(1.61, 1.63, 0.10, 1.93, 8.14, ZB, gian);
  bx(2.44, 2.46, 0.10, 1.93, 8.14, ZB, gian);
  bx(1.63, 2.44, 0.0, 1.93, ZB - 0.02, ZB, inner, nc);
  // Geladeira French Door 69,9 × 189 × 74,5 inox (x 1,71–2,41 · z 8,14–8,82)
  {
    const fx0 = 1.71, fx1 = 2.41, fz0 = 8.14, fz1 = 8.82, H = 1.89, cxm = (fx0 + fx1) / 2;
    bx(fx0, fx1, 0.06, H, fz0 + 0.02, fz1, inox);                                  // corpo
    bx(fx0 + 0.01, fx1 - 0.01, 0.0, 0.06, fz0 + 0.05, fz1 - 0.05, plinth, nc);
    // gaveta do freezer (embaixo) e duas portas de cima
    bx(fx0, fx1, 0.07, 0.62, fz0, fz0 + 0.02, inox);
    bx(fx0, cxm - 0.002, 0.635, H, fz0, fz0 + 0.02, inox);
    bx(cxm + 0.002, fx1, 0.635, H, fz0, fz0 + 0.02, inox);
    bx(fx0 + 0.04, fx1 - 0.04, 0.5, 0.52, fz0 - 0.03, fz0, chrome, nc);            // puxador horizontal do freezer
    bx(cxm - 0.045, cxm - 0.035, 0.7, 1.55, fz0 - 0.025, fz0, chrome, nc);          // puxadores verticais
    bx(cxm + 0.035, cxm + 0.045, 0.7, 1.55, fz0 - 0.025, fz0, chrome, nc);
    bx(fx0 + 0.07, cxm - 0.09, 1.2, 1.5, fz0 - 0.004, fz0 + 0.001, blackApp, nc);  // painel/dispenser escuro
    bx(fx0 + 0.09, cxm - 0.11, 1.38, 1.4, fz0 - 0.006, fz0 - 0.004, std({ color: 0x7fb4d6, emissive: 0x2a5a78, emissiveIntensity: 0.4 }), nc);
    solid(fx0, fz0, fx1, fz1, H);
  }

  // ---------- Base 4,20 m (x 2,45–6,65): corpo, rodapé, portas
  const BX0 = 2.45, BX1 = 6.65;
  bx(BX0, BX1, 0.0, 0.10, ZF + 0.03, ZB - 0.02, plinth, nc);                       // rodapé recuado 3 cm
  bx(BX0, BX1, 0.10, YB, ZB - 0.02, ZB, inner, nc);                                // fundo
  // módulos (x0, x1) da esquerda p/ direita
  const mods = { lava: [2.45, 2.96], port: [2.96, 4.67], gav: [4.67, 5.27], maq: [5.27, 5.93], arm: [5.93, 6.65] };
  const sideP = (x) => bx(x - 0.009, x + 0.009, 0.10, YB, ZF, ZB - 0.02, gian);
  [2.45, 2.96, 4.67, 5.27, 5.93, 6.65].forEach((x) => sideP(Math.min(Math.max(x, BX0 + 0.009), BX1 - 0.009)));
  bx(BX0, BX1, YB - 0.02, YB, ZF, ZB, gian, nc);                                   // travessa sob o tampo
  // porta lisa de Gianduia (corre y0–y1) + puxador-perfil dourado na borda superior
  const doorL = (x0, x1, y0, y1, withHandle = true, top = true) => {
    bx(x0 + DG, x1 - DG, y0, y1, ZF - 0.018, ZF, gian);
    if (withHandle) {
      const w = Math.min(0.36, (x1 - x0) * 0.7), cx = (x0 + x1) / 2;
      bx(cx - w / 2, cx + w / 2, (top ? y1 - 0.03 : y0 + 0.015), (top ? y1 - 0.018 : y0 + 0.027), ZF - 0.026, ZF - 0.018, dour, nc);
    }
  };
  // portas da base: 42 / 43 / 43 / 43 (78 de altura: y 0,10–0,88)
  [[2.96, 3.38], [3.38, 3.81], [3.81, 4.24], [4.24, 4.67]].forEach(([a, b]) => doorL(a, b, 0.10, YB));
  // armário 73 sob o tanque: duas portas empilhadas 39/39
  doorL(5.93, 6.65, 0.10, 0.49); doorL(5.93, 6.65, 0.50, YB);
  // gaveteiro 60: gaveta de 27 embaixo e três de 17
  doorL(4.67, 5.27, 0.10, 0.37);
  doorL(4.67, 5.27, 0.375, 0.545); doorL(4.67, 5.27, 0.55, 0.715); doorL(4.67, 5.27, 0.72, YB);
  // lava-louça nº5: inox 44,8 × 84,5 × 60 (x 2,48–2,93)
  {
    bx(2.48, 2.93, 0.0, 0.10, ZF + 0.03, ZB - 0.02, plinth, nc);
    bx(2.48, 2.93, 0.10, 0.845, ZF - 0.02, ZB - 0.02, inox);
    bx(2.50, 2.91, 0.74, 0.84, ZF - 0.026, ZF - 0.02, blackApp, nc);                // painel de comandos
    bx(2.53, 2.88, 0.715, 0.725, ZF - 0.04, ZF - 0.026, chrome, nc);                // barra de puxar
    for (let i = 0; i < 4; i++) bx(2.55 + i * 0.1, 2.57 + i * 0.1, 0.78, 0.80, ZF - 0.029, ZF - 0.026, std({ color: 0x9ad0ff, emissive: 0x2a5a8a, emissiveIntensity: 0.5 }), nc);
    bx(2.93, 2.96, 0.10, YB, ZF, ZB - 0.02, gian);
  }
  // lavadora nº4: 60 × 85 × 55 (x 5,30–5,90), frente em 8,20
  {
    bx(5.30, 5.90, 0.03, 0.88, 8.20, 8.75, steelDark);
    bx(5.30, 5.90, 0.0, 0.03, 8.24, 8.72, plinth, nc);
    bx(5.30, 5.90, 0.76, 0.865, 8.185, 8.20, blackApp, nc);                          // painel superior
    bx(5.36, 5.50, 0.81, 0.83, 8.18, 8.185, std({ color: 0x9ad0ff, emissive: 0x2a5a8a, emissiveIntensity: 0.6 }), nc);   // display
    cy(0.04, 0.04, 0.012, chrome, 5.78, 0.815, 8.18, 'z', 14, nc);                   // botão
    cy(0.235, 0.235, 0.02, steelDark, 5.60, 0.40, 8.19, 'z', 28);                    // aro da porta
    cy(0.19, 0.19, 0.03, glassDk, 5.60, 0.40, 8.185, 'z', 28);                       // vidro
    cy(0.1, 0.1, 0.012, std({ color: 0x1f3a5a, roughness: 0.1, metalness: 0.7 }), 5.60, 0.40, 8.168, 'z', 20, nc);
  }

  // ---------- Tampo de granito São Gabriel 420 × 65 (y 0,88–0,90), cuba e tanque; rodamão 2 cm × 0,70
  const CUBA = [3.31, 8.50, 0.56, 0.36], TANQ = [6.27, 8.50, 0.50, 0.41];
  slab(BX0, BX1, 8.18, ZB, YB, 0.90, gran, [[CUBA[0], CUBA[1], CUBA[2], CUBA[3]], [TANQ[0], TANQ[1], TANQ[2], TANQ[3]]]);
  bx(BX0, BX1, 0.90, 1.60, ZB - 0.02, ZB, gran);                                      // rodamão (frontão) até 1,60
  basin(CUBA[0], CUBA[1], CUBA[2], CUBA[3], 0.90, ceramic, 0.18);
  basin(TANQ[0], TANQ[1], TANQ[2], TANQ[3], 0.90, inox, 0.16);
  for (let i = 0; i < 6; i++) bx(TANQ[0] - 0.2, TANQ[0] + 0.2, 0.745, 0.749, TANQ[1] - 0.15 + i * 0.05, TANQ[1] - 0.13 + i * 0.05, inox, nc);   // tábua de lavar
  gooseneck(CUBA[0], 0.90, ZB - 0.07, dour, 0.30, 0.17);
  gooseneck(TANQ[0], 0.90, ZB - 0.07, chrome, 0.30, 0.17);
  solid(BX0, 8.18, BX1, ZB, 0.9);

  // ---------- Cooktop nº2 Electrolux 4 bocas (60 × 10 × 52): x 3,94–4,53 · z 8,30–8,82
  {
    const cx = 4.235, cz = 8.56;
    bx(3.94, 4.53, 0.90, 0.925, 8.30, 8.82, inox);
    [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]].forEach(([dx, dz], i) => {
      const big = i === 1;
      cy(big ? 0.052 : 0.04, big ? 0.052 : 0.04, 0.014, blackApp, cx + dx, 0.932, cz + dz, 'y', 18, nc);
      cy(big ? 0.03 : 0.022, big ? 0.03 : 0.022, 0.018, chrome, cx + dx, 0.94, cz + dz, 'y', 12, nc);
    });
    // grelhas pretas em ferro
    for (const dx of [-0.14, 0.14]) bx(cx + dx - 0.12, cx + dx + 0.12, 0.945, 0.955, cz - 0.255, cz - 0.245, blackApp, nc);
    for (const dz of [-0.12, 0.12]) { bx(cx - 0.285, cx + 0.285, 0.945, 0.955, cz + dz - 0.005, cz + dz + 0.005, blackApp, nc); }
    for (let i = 0; i < 4; i++) cy(0.016, 0.016, 0.02, blackApp, 3.99 + i * 0.1 + 0.075, 0.915, 8.295, 'z', 10, nc);   // manoplas
    // panela inox sobre a boca grande
    cy(0.095, 0.085, 0.11, inox, cx + 0.14, 1.0, cz - 0.12, 'y', 20);
    bx(cx + 0.14 + 0.09, cx + 0.14 + 0.2, 1.045, 1.06, cz - 0.125, cz - 0.115, blackApp, nc);
  }

  // ---------- Itens de bancada
  // purificador nº3 Everest Fit (31 × 28 × 37) em x 5,30–5,61 · z 8,55–8,80
  bx(5.30, 5.61, 0.90, 1.27, 8.55, 8.80, blackApp);
  bx(5.32, 5.59, 1.0, 1.10, 8.535, 8.55, steelDark, nc);
  cy(0.008, 0.008, 0.05, chrome, 5.455, 0.99, 8.52, 'y', 8, nc);
  // tábua de corte encostada no rodamão, fruteira/tigelas, garrafas e porta-utensílios
  { const m = box(0.34, 0.02, 0.24, board, 4.88, 1.02, 8.77); m.rotation.x = -1.2; put(m); }   // tábua encostada no rodamão
  cy(0.11, 0.075, 0.07, ceramic, 4.82, 0.935, 8.58, 'y', 18);                          // tigela branca
  for (let i = 0; i < 3; i++) { const f = sph(0.032, std({ color: [0xd8a23a, 0x8aa63a, 0xc6513a][i], roughness: 0.6 }), 4.79 + i * 0.03, 0.99, 8.58 + (i % 2) * 0.02); put(f); }
  cy(0.025, 0.025, 0.22, std({ color: 0x4a6b2f, roughness: 0.2 }), 4.72, 1.01, 8.77, 'y', 10);   // azeite
  cy(0.02, 0.02, 0.2, std({ color: 0xa9552b, roughness: 0.2 }), 4.76, 1.0, 8.77, 'y', 10);
  cy(0.05, 0.05, 0.16, ceramic, 4.66, 0.98, 8.72, 'y', 14);                            // porta-utensílios
  for (let i = 0; i < 3; i++) cy(0.006, 0.006, 0.18, [board, inox, dour][i], 4.65 + i * 0.015, 1.1, 8.72 + (i - 1) * 0.01, 'y', 6, nc);
  // detergente / esponja ao lado da cuba
  cy(0.03, 0.03, 0.2, plastic[1], 3.68, 1.0, 8.76, 'y', 10);
  bx(3.45, 3.53, 0.90, 0.92, 8.62, 8.66, plastic[1], nc);
  // escorredor de pratos dobrável sobre o tanque
  bx(6.1, 6.45, 0.91, 0.93, 8.35, 8.65, chrome, nc);

  // ---------- Armários superiores (prof. 0,35; y 1,60–2,45; tampo de 5 até 2,50)
  const ZU = ZB - 0.35;
  bx(1.61, 6.66, 2.45, 2.50, ZB - 0.60, ZB, gian);                                    // tampo/sanca superior
  bx(3.06, 6.66, 1.60, 2.45, ZB - 0.02, ZB, inner, nc);                                // fundo
  // 8 portas de 45 sobre a bancada (x 3,06–6,66); coifa embutida cobre x 3,86–4,61
  const doorU = (x0, x1, y0, y1, zf, handleBottom = true) => {
    bx(x0 + DG, x1 - DG, y0, y1, zf - 0.018, zf, gian);
    const w = Math.min(0.3, (x1 - x0) * 0.6), cx = (x0 + x1) / 2;
    if (handleBottom) bx(cx - w / 2, cx + w / 2, y0 + 0.012, y0 + 0.024, zf - 0.026, zf - 0.018, dour, nc);
  };
  bx(3.06, 6.66, 1.60, 2.45, ZB - 0.35, ZB - 0.33, inner, nc);                         // placa sob as portas (miolo)
  for (let i = 0; i < 8; i++) {
    const x0 = 3.06 + i * 0.45, x1 = x0 + 0.45;
    bx(x0, x0 + 0.018, 1.60, 2.45, ZU, ZB, gian);                                       // divisórias
    if (x0 >= 3.85 && x1 <= 4.62) {                                                     // coifa: porta fica acima da coifa (y 1,88–2,45)
      doorU(x0, x1, 1.88, 2.45, ZU, false);
    } else doorU(x0, x1, 1.60, 2.45, ZU);
  }
  bx(6.642, 6.66, 1.60, 2.45, ZU, ZB, gian);
  bx(3.06, 6.66, 1.60, 1.615, ZU, ZB, gian);                                           // fundo do módulo
  // Coifa nº1 Tramontina 75 Incasso (75 × 32,5 × 27): x 3,86–4,61 · y 1,55–1,88 · fundo na parede
  bx(3.86, 4.61, 1.55, 1.88, ZB - 0.27, ZB - 0.02, inox);
  bx(3.86, 4.61, 1.55, 1.575, ZB - 0.30, ZB - 0.27, inox);
  bx(3.88, 4.59, 1.575, 1.58, ZB - 0.29, ZB - 0.27, blackApp, nc);
  bx(4.37, 4.55, 1.56, 1.565, ZB - 0.29, ZB - 0.27, std({ color: 0xffe9b0, emissive: 0xffd88a, emissiveIntensity: 0.3 }), nc);

  // ---------- Coluna dos nichos (x 2,47–3,04): Freijó aberto (em cima) + micro-ondas (embaixo), prof. 0,42
  {
    const nx0 = 2.47, nx1 = 3.04, nz0 = ZB - 0.42;
    bx(nx0, nx1, 1.60, 1.62, nz0, ZB, freijo);                                          // base
    bx(nx0, nx1, 1.97, 2.0, nz0, ZB, freijo);                                           // prateleira intermediária
    bx(nx0, nx1, 2.43, 2.45, nz0, ZB, freijo);                                          // teto
    bx(nx0, nx0 + 0.02, 1.60, 2.45, nz0, ZB, freijo);                                   // lados
    bx(nx1 - 0.02, nx1, 1.60, 2.45, nz0, ZB, freijo);
    bx(nx0 + 0.02, nx1 - 0.02, 1.62, 2.43, ZB - 0.02, ZB, freijo, nc);                  // fundo
    // micro-ondas nº6 Brastemp 32 L (53,8 × 30 × 39): x 2,50–3,04 · y 1,62–1,92
    bx(2.495, 3.035, 1.62, 1.92, nz0 + 0.02, nz0 + 0.41, micro);
    bx(2.50, 2.86, 1.64, 1.90, nz0 + 0.0, nz0 + 0.02, glassDk, nc);                     // porta de vidro
    bx(2.87, 3.03, 1.64, 1.90, nz0 + 0.0, nz0 + 0.02, blackApp, nc);                    // painel
    for (let i = 0; i < 3; i++) bx(2.89, 2.99, 1.84 - i * 0.05, 1.86 - i * 0.05, nz0 - 0.004, nz0, std({ color: 0xaad4ff, emissive: 0x3a6a9a, emissiveIntensity: 0.4 }), nc);
    // planta decorando o nicho de cima
    cy(0.06, 0.045, 0.08, potCream, 2.76, 2.04, ZB - 0.2, 'y', 12);
    for (let i = 0; i < 6; i++) { const m = sph(0.06, leaf[i % 3], 2.76 + (rnd() - 0.5) * 0.14, 2.14 + rnd() * 0.08, ZB - 0.2 + (rnd() - 0.5) * 0.1); m.scale.set(1, 0.7, 1); put(m); }
    bx(2.95, 3.0, 2.0, 2.2, nz0 + 0.1, nz0 + 0.2, std({ color: 0x3a2f27, roughness: 0.6 }), nc);   // livro
  }

  // ---------- Superiores sobre a geladeira: 2 portas (x 1,61–2,46), y 1,93–2,45, prof. 0,60
  {
    const zf = ZB - 0.65;
    bx(1.61, 2.46, 1.93, 2.45, zf, ZB, inner);
    bx(1.61, 2.47, 1.93, 1.95, zf, ZB, gian);
    bx(1.61 + DG, 2.035 - DG, 1.95, 2.45, zf - 0.018, zf, gian);
    bx(2.035 + DG, 2.46 - DG, 1.95, 2.45, zf - 0.018, zf, gian);
    bx(1.99, 2.01, 1.97, 2.06, zf - 0.026, zf - 0.018, dour, nc);
    bx(2.06, 2.08, 1.97, 2.06, zf - 0.026, zf - 0.018, dour, nc);
    solid(1.61, zf, 2.46, ZB, 2.5);
  }
  // fita de LED sob os superiores (aciona com luz_cozinha)
  {
    const led = new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffe2a8, emissiveIntensity: 0.8, roughness: 0.5 });
    if (ctx.bindEmissive) ctx.bindEmissive('luz_cozinha', led, 1.2, { min: 0.1 });
    bx(3.06, 6.65, 1.585, 1.598, ZU + 0.05, ZU + 0.06, led, nc);
  }

  // =========================================================================
  // VARANDA (x 0,17–1,05 · z 0,23–7,94) — passagem livre ≥ 0,45 m
  // =========================================================================
  // plantas junto ao peitoril
  plant(0.33, 0.62, 1.1, potCream, 1.1, 8);                                         // folhagem ao lado do shaft
  plant(0.33, 1.45, 0.9, potTerra, 0.8, 6);
  plant(0.33, 7.62, 0.9, potDark, 1.0, 7);                                          // junto à área de serviço (ao lado da porta da sala fechava a passagem)
  plant(0.34, 6.55, 0.8, potTerra, 0.7, 5);
  // (sem jardineira junto ao pilar: com o pilar, fechava a passagem para a ponta norte da varanda)
  // (sem cadeira/mesinha: não aparecem na planta e fechavam a passagem de 0,85 m até a área de serviço)
  // varal retrátil de teto (sugestão do uso como lavanderia): dois suportes finos de inox sobre a varanda
  bx(0.2, 0.22, 2.30, 2.42, 7.5, 7.85, inox, nc); bx(0.8, 0.82, 2.30, 2.42, 7.5, 7.85, inox, nc);
  for (let i = 0; i < 4; i++) cy(0.004, 0.004, 0.62, inox, 0.51, 2.40, 7.52 + i * 0.1, 'x', 5, nc);

  // =========================================================================
  // ÁREA DE SERVIÇO (x 0,17–0,86 · z 7,94–8,59): bancada de pedra 0,68 × 0,65, máquina embaixo, tanque, prateleira
  // =========================================================================
  {
    const x0 = 0.18, x1 = 0.86, z0 = 7.94, z1 = 8.59;
    // bancada de pedra clara h 0,90 com furo do tanque; painéis laterais e fundo em pedra
    slab(x0, x1, z0, z1, 0.88, 0.90, pedra, [[0.52, 8.28, 0.44, 0.34]]);
    bx(x0, x0 + 0.02, 0.0, 0.88, z0, z1, pedra);
    bx(x1 - 0.02, x1, 0.0, 0.88, z0, z1, pedra);
    bx(x0, x1, 0.0, 0.88, z1 - 0.02, z1, pedra);
    bx(x0, x1, 0.90, 1.0, z1 - 0.02, z1, pedra);                                         // rodabancada
    basin(0.52, 8.28, 0.44, 0.34, 0.90, inox, 0.2);
    gooseneck(0.52, 0.90, z1 - 0.07, chrome, 0.26, 0.15);
    // máquina de lavar sob a bancada (x 0,24–0,80 · z 8,00–8,53), carga frontal branca
    bx(0.24, 0.80, 0.02, 0.84, 8.0, 8.53, white);
    bx(0.26, 0.78, 0.0, 0.02, 8.04, 8.5, plinth, nc);
    cy(0.19, 0.19, 0.02, chrome, 0.52, 0.40, 7.99, 'z', 24);
    cy(0.155, 0.155, 0.03, glassDk, 0.52, 0.40, 7.985, 'z', 24);
    bx(0.28, 0.76, 0.74, 0.82, 7.985, 8.0, blackApp, nc);
    solid(x0, z0, x1, z1, 1);
    // prateleiras de parede (z 8,59 → saem 0,22 m) com produtos
    const sh = (y) => bx(0.20, 0.84, y, y + 0.025, z1 - 0.22, z1, frape);
    sh(1.50); sh(1.90);
    for (let i = 0; i < 4; i++) {
      cy(0.04, 0.04, 0.24, plastic[i], 0.26 + i * 0.1, 1.5 + 0.025 + 0.12, z1 - 0.1, 'y', 10);
      cy(0.012, 0.012, 0.06, plastic[(i + 1) % 4], 0.26 + i * 0.1, 1.5 + 0.025 + 0.27, z1 - 0.1, 'y', 6, nc);
    }
    bx(0.52, 0.80, 1.925, 2.15, z1 - 0.2, z1 - 0.03, rattan);                              // cesto
    bx(0.22, 0.46, 1.925, 1.96, z1 - 0.2, z1 - 0.03, linho);                               // toalhas dobradas
    bx(0.22, 0.46, 1.96, 1.99, z1 - 0.19, z1 - 0.04, white);
    // plafon/arandela da área é do cartão (luz_servico) — não recriar
  }
}
