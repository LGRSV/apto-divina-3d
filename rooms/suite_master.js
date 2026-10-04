function roomSuiteMaster(ctx) {
  // ---------------------------------------------------------------------------
  // SUÍTE MASTER — quarto x 7,12–10,14 · z 0,25–5,02 (em L: pilar x 9,76–10,23 · z 1,59–2,87 e antecâmara da porta do hall).
  //  · Cama box queen nº 14 (Herval Amore 1,58 × 1,98, h 0,67 no topo do colchão): estrado estofado, colchão, edredom cinza-claro,
  //    travesseiros, almofadas, peseira; cabeceira estofada greige na parede x 7,07 (face 7,12) com revestimento cimentício claro.
  //  · Criados embutidos em madeira escura (≈ #8c7a63) 30 × 52 / 59, h 0,60, com gavetas e abajures (acendem com 'luz_suite_master').
  //  · Armário G 478 × 60 × 250 em MDF Frapê Arauco (rodapé 10 + portas 235 + tampo 5), ao longo da parede leste:
  //    3 portas 44/44/46 (z 0,25–1,59, trecho norte raso e recuado — ≈), painel de ESPELHO 128 sobre o pilar (z 1,59–2,87),
  //    3 portas 52/52/52 (z 2,87–4,43); puxadores verticais dourados (par nas juntas 1|2 / 52|52 e simples nas outras).
  //  · Retorno H 160 × 60 × 250 na parede sul (x 8,54–10,13 · z 4,43–5,02): 2 portas de espelho 49 + porta Frapê 61 do canto.
  //  · Cortina de linho em prega da janela norte (x 7,76–9,56), tapete, bandeja/livros/vaso nos criados.
  // Do cartão (não recriar): paredes, piso, janela, porta do hall (x 6,72 · z 3,42–4,12), porta do banho, ar cassete nº 15 (8,81; 2,50; 3,68).
  // Folgas: giro da porta do hall (raio 0,8 em torno de 6,72 / 4,12) e do banho continuam livres; a cama fica a ≥ 0,43 do armário.
  // ---------------------------------------------------------------------------
  const THREE = ctx.THREE, M = ctx.M || {};
  const box = (...a) => ctx.box(...a), cyl = (...a) => ctx.cyl(...a), sph = (...a) => ctx.sph(...a);
  const std = (o) => ctx.std(o);
  const put = (m) => { ctx.add(m); return m; };
  const B = (w, h, d, mat, x, y, z, o) => put(box(w, h, d, mat, x, y, z, o));       // caixa centrada em (x, y, z)
  const nc = { cast: false };
  const PI = Math.PI;

  // ---- materiais ------------------------------------------------------------
  const frape    = M.frape    || std({ color: 0xbfae9d, roughness: 0.6 });                   // MDF Frapê Arauco (greige)
  const frapeIn  = std({ color: 0x8e8071, roughness: 0.8 });                                  // fundo/vão entre portas (escurece a fresta)
  const dourado  = std({ color: 0xc8a45c, roughness: 0.28, metalness: 0.85 });                // puxadores e filetes champanhe
  const espelho  = M.espelho  || std({ color: 0xd6dadc, roughness: 0.05, metalness: 1 });
  const woodDk   = std({ color: 0x8c7a63, roughness: 0.55 });                                 // madeira escura dos criados
  const woodDk2  = std({ color: 0x75664f, roughness: 0.6 });
  const cimento  = std({ color: 0xd8d0c3, roughness: 0.96 });                                 // parede da cabeceira (efeito cimentício claro)
  const headFab  = std({ color: 0xa99d8c, roughness: 0.97 });                                 // cabeceira estofada greige
  const baseFab  = std({ color: 0x9a8f80, roughness: 0.97 });                                 // estrado
  const sheet    = std({ color: 0xf1ede6, roughness: 0.95 });                                 // lençol/travesseiros
  const duvet    = std({ color: 0xc9c8c4, roughness: 0.97 });                                 // roupa de cama cinza-claro
  const throwM   = std({ color: 0x8d8272, roughness: 1 });                                    // peseira
  const cushion  = std({ color: 0xe6dfd2, roughness: 0.97 });
  const cushionD = std({ color: 0x2a2a2c, roughness: 0.9 });                                  // listras da almofada
  const linenC   = std({ color: 0xe0d6c4, roughness: 1, side: THREE.DoubleSide });            // cortina de linho
  const linenC2  = std({ color: 0xd2c7b3, roughness: 1, side: THREE.DoubleSide });
  const railM    = std({ color: 0xcfc9bd, roughness: 0.5, metalness: 0.2 });
  const rugField = std({ color: 0xd9d0c0, roughness: 1 });
  const rugBand  = std({ color: 0xbaad98, roughness: 1 });
  const rugLine  = std({ color: 0xa3957f, roughness: 1 });
  const paper    = std({ color: 0xf1ede4, roughness: 0.9 });
  const bookM    = [0x6b5a46, 0xc9bfae, 0x3d4a52, 0x9b6f4f].map((c) => std({ color: c, roughness: 0.9 }));
  const ceramic  = std({ color: 0xece7dd, roughness: 0.35 });
  const leaf     = std({ color: 0x4f6b45, roughness: 0.9 });
  const trayM    = std({ color: 0x3a3228, roughness: 0.5 });
  const glassD   = std({ color: 0xdfe6e8, roughness: 0.1, transparent: true, opacity: 0.4 });
  // Abajures: cúpula de linho que acende com a luz da suíte (se o cartão oferecer o brilho ligado à entidade)
  const lampShadeBase = new THREE.MeshStandardMaterial({ color: 0xe8e1d2, roughness: 0.9, emissive: 0xffd9a8, emissiveIntensity: 0, side: THREE.DoubleSide });
  const lampShade = typeof ctx.bindEmissive === 'function' ? ctx.bindEmissive('luz_suite_master', lampShadeBase, 0.85, { min: 0 }) : lampShadeBase;

  // ---- colisores do modo Pessoa (se o cartão expuser) -----------------------
  const solid = (x0, z0, x1, z1) => {
    if (typeof ctx.addCollider === 'function') ctx.addCollider(x0, z0, x1, z1);
    else if (typeof ctx.collider === 'function') ctx.collider(x0, z0, x1, z1);
    else if (Array.isArray(ctx.colliders)) ctx.colliders.push([x0, z0, x1, z1]);
  };

  // ======================= PAREDE DA CABECEIRA (cimentício) =======================
  B(0.006, 2.5, 3.04, cimento, 7.123, 1.25, 1.77, nc);                                     // x 7,12 · z 0,25–3,29 · até o forro

  // ======================= CAMA QUEEN Nº 14 =======================
  // x 7,12–9,10 · z 0,99–2,57 (centro z 1,78), cabeceira em x 7,12, pés para +x
  const CZ = 1.78;
  // cabeceira estofada: painel largo (entre os criados, z 0,92–2,65) com almofadado vertical
  B(0.07, 1.2, 1.73, headFab, 7.17, 0.75, CZ);
  for (let i = 0; i < 4; i++) B(0.012, 0.72, 0.012, baseFab, 7.21, 0.82, 0.92 + (i + 1) * 0.346, nc);       // pesponto vertical
  B(0.07, 0.02, 1.73, baseFab, 7.17, 1.36, CZ, nc);
  // estrado estofado (rodapé recuado) + colchão + roupa de cama
  B(1.86, 0.06, 1.46, std({ color: 0x4a443c, roughness: 0.8 }), 8.16, 0.03, CZ, nc);       // base recuada
  B(1.90, 0.26, 1.54, baseFab, 8.16, 0.19, CZ);                                           // estrado y 0,06–0,32
  B(1.88, 0.20, 1.52, sheet, 8.15, 0.42, CZ);                                              // colchão y 0,32–0,52
  B(1.50, 0.18, 1.58, duvet, 8.35, 0.58, CZ);                                              // edredom (topo em 0,67) caindo pelos lados
  B(0.50, 0.025, 1.52, sheet, 7.52, 0.5275 + 0.0, CZ, nc);                                 // lençol exposto junto à cabeceira
  B(0.10, 0.12, 1.58, sheet, 7.63, 0.62, CZ);                                              // dobra do lençol
  B(0.50, 0.04, 1.56, sheet, 7.66, 0.665, CZ, nc);                                         // cobre o edredom na altura da dobra
  // travesseiros (esferas achatadas = volume macio)
  const pillow = (x, y, z, sx, sy, sz, mat, rz = 0, ry = 0) => { const p = sph(1, mat, x, y, z); p.scale.set(sx, sy, sz); p.rotation.z = rz; p.rotation.y = ry; return put(p); };
  pillow(7.46, 0.77, CZ - 0.37, 0.21, 0.085, 0.33, sheet);
  pillow(7.46, 0.77, CZ + 0.37, 0.21, 0.085, 0.33, sheet);
  pillow(7.70, 0.80, CZ - 0.37, 0.18, 0.09, 0.28, cushion, -0.5);                          // almofadas apoiadas nos travesseiros
  pillow(7.70, 0.80, CZ + 0.37, 0.18, 0.09, 0.28, cushion, -0.5);
  // almofada comprida listrada na frente
  B(0.20, 0.15, 0.58, cushion, 7.93, 0.745, CZ);
  for (let i = 0; i < 5; i++) B(0.202, 0.152, 0.018, cushionD, 7.93, 0.745, CZ - 0.2 + i * 0.1, nc);
  // peseira (manta dobrada em 3) e manta leve
  B(0.40, 0.045, 1.60, throwM, 8.62, 0.69, CZ);
  B(0.40, 0.012, 1.60, std({ color: 0x7a705f, roughness: 1 }), 8.62, 0.7155, CZ, nc);
  B(0.18, 0.04, 1.60, throwM, 8.82, 0.665, CZ, nc);
  solid(7.12, 0.99, 9.10, 2.57);

  // ======================= CRIADOS EMBUTIDOS (madeira escura) =======================
  const criado = (z0, z1) => {
    const zc = (z0 + z1) / 2, d = z1 - z0;
    B(0.28, 0.10, d - 0.06, frapeIn, 7.28, 0.05, zc, nc);                                  // rodapé recuado
    B(0.30, 0.46, d, woodDk, 7.29, 0.33, zc);                                               // corpo y 0,10–0,56
    B(0.32, 0.04, d + 0.02, woodDk2, 7.30, 0.58, zc);                                       // tampo y 0,56–0,60
    for (const [yy, hh] of [[0.22, 0.20], [0.43, 0.20]]) {                                  // 2 gavetas
      B(0.018, hh, d - 0.04, woodDk, 7.448, yy, zc, nc);
      B(0.012, 0.02, 0.16, dourado, 7.46, yy + hh / 2 - 0.035, zc, nc);                     // puxador de fenda dourado
    }
    solid(7.12, z0, 7.46, z1);
  };
  criado(0.40, 0.92);
  criado(2.65, 3.24);
  // abajures
  const lamp = (x, z) => {
    put(cyl(0.055, 0.065, 0.02, dourado, x, 0.61, z, 14));
    put(cyl(0.012, 0.012, 0.26, dourado, x, 0.74, z, 8));
    put(cyl(0.085, 0.125, 0.19, lampShade, x, 0.95, z, 18, true));
    put(cyl(0.088, 0.088, 0.008, dourado, x, 1.045, z, 18, true));
  };
  lamp(7.30, 0.62);
  lamp(7.30, 2.98);
  // objetos de apoio: bandeja com livros e vaso (criado norte), livros e copo (criado sul)
  B(0.18, 0.015, 0.24, trayM, 7.34, 0.6075, 0.80, nc);
  B(0.15, 0.03, 0.20, bookM[1], 7.34, 0.63, 0.80, nc);
  B(0.13, 0.025, 0.18, bookM[2], 7.34, 0.658, 0.80, nc);
  put(cyl(0.035, 0.03, 0.09, ceramic, 7.40, 0.66, 0.51, 12));
  for (const [a, h] of [[-0.5, 0.18], [0.1, 0.22], [0.6, 0.16]]) { const s = B(0.006, h, 0.05, leaf, 7.40 + a * 0.03, 0.74 + h / 2 - 0.04, 0.51, nc); s.rotation.z = a * 0.5; }
  B(0.14, 0.03, 0.2, bookM[3], 7.35, 0.615, 3.12, nc);
  B(0.12, 0.025, 0.17, bookM[0], 7.35, 0.6425, 3.12, nc);
  put(cyl(0.03, 0.026, 0.1, glassD, 7.40, 0.66, 2.78, 12, false)).castShadow = false;

  // ======================= ARMÁRIO G (parede leste) E RETORNO H (parede sul) =======================
  // construtor de peças: a = coordenada ao longo da frente, d = profundidade a partir da frente (para dentro da parede)
  const mk = (axis, front) => (a0, a1, d0, d1, y0, y1, mat, o) => axis === 'z'
    ? B(d1 - d0, y1 - y0, a1 - a0, mat, front + (d0 + d1) / 2, (y0 + y1) / 2, (a0 + a1) / 2, o)
    : B(a1 - a0, y1 - y0, d1 - d0, mat, (a0 + a1) / 2, (y0 + y1) / 2, front + (d0 + d1) / 2, o);
  const GAP = 0.004;
  // Faixa de portas: bounds = lista de bordas; kinds = 'f' (frapê) | 'm' (espelho)
  const doors = (P, front, bounds, kinds, y0 = 0.10, y1 = 2.45, depth = 0.018, shift = 0) => {
    for (let i = 0; i < kinds.length; i++) {
      const a0 = bounds[i] + GAP, a1 = bounds[i + 1] - GAP;
      if (kinds[i] === 'f') P(a0, a1, shift, shift + depth, y0, y1, frape);
      else {
        P(a0, a1, shift, shift + 0.012, y0, y1, espelho, nc);
        // moldura dourada fina
        P(a0, a0 + 0.008, shift - 0.004, shift + 0.016, y0, y1, dourado, nc);
        P(a1 - 0.008, a1, shift - 0.004, shift + 0.016, y0, y1, dourado, nc);
        P(a0, a1, shift - 0.004, shift + 0.016, y0, y0 + 0.008, dourado, nc);
        P(a0, a1, shift - 0.004, shift + 0.016, y1 - 0.008, y1, dourado, nc);
      }
    }
  };
  const handle = (P, a, y0, y1, dbl, shift = 0) => {
    const w = 0.014;
    P(a - w / 2 - (dbl ? 0.012 : 0), a + w / 2 - (dbl ? 0.012 : 0), shift - 0.03, shift - 0.002, y0, y1, dourado, nc);
    if (dbl) P(a - w / 2 + 0.012, a + w / 2 + 0.012, shift - 0.03, shift - 0.002, y0, y1, dourado, nc);
  };

  // ---- G, trecho central e sul: frente em x = 9,53, prof. 0,60 (z 1,59–4,43) ----
  const G = mk('z', 9.53);
  G(1.59, 4.43, 0.03, 0.60, 0, 0.10, frapeIn, nc);                                         // rodapé recuado 3 cm
  G(1.59, 4.43, 0.018, 0.60, 0.10, 2.45, frapeIn);                                         // corpo
  G(1.59, 4.43, 0, 0.60, 2.45, 2.50, frape);                                                // tampo 5 cm
  doors(G, 9.53, [1.59, 2.87], ['m'], 0.10, 2.45);
  // pilar: o painel de espelho cobre o pilar (x 9,76–10,23) — o corpo aqui só tem a profundidade até ele
  doors(G, 9.53, [2.87, 3.39, 3.91, 4.43], ['f', 'f', 'f']);
  // ---- G, trecho norte (raso e recuado, ≈): z 0,25–1,59, frente em x = 9,63, prof. 0,26 ----
  const Gn = mk('z', 9.63);
  Gn(0.25, 1.59, 0.03, 0.26, 0, 0.10, frapeIn, nc);
  Gn(0.25, 1.59, 0.018, 0.26, 0.10, 2.45, frapeIn);
  Gn(0.25, 1.59, 0, 0.26, 2.45, 2.50, frape);
  doors(Gn, 9.63, [0.25, 0.69, 1.13, 1.59], ['f', 'f', 'f']);
  // puxadores (y 0,64–1,44): par nas juntas 1|2 e simples em 2|3
  handle(Gn, 0.69, 0.64, 1.44, true);
  handle(Gn, 1.13, 0.64, 1.44, false);
  handle(G, 3.39, 0.64, 1.44, true);
  handle(G, 3.91, 0.64, 1.44, false);
  // faixa dourada vertical nas bordas do espelho (ressalto do painel)
  G(1.59, 1.595, -0.004, 0.03, 0.10, 2.45, dourado, nc);
  G(2.865, 2.87, -0.004, 0.03, 0.10, 2.45, dourado, nc);
  solid(9.53, 1.59, 10.13, 4.43);
  solid(9.63, 0.25, 9.89, 1.59);

  // ---- H: retorno em L na parede sul (frente em z = 4,43, prof. 0,59 até a parede em z 5,02) ----
  const H = mk('x', 4.43);
  H(8.54, 10.13, 0.03, 0.59, 0, 0.10, frapeIn, nc);
  H(8.54, 10.13, 0.018, 0.59, 0.10, 2.45, frapeIn);
  H(8.54, 10.13, 0, 0.59, 2.45, 2.50, frape);
  doors(H, 4.43, [8.54, 9.03, 9.52, 10.13], ['m', 'm', 'f']);
  handle(H, 9.03, 0.64, 1.44, true);
  handle(H, 9.52, 0.64, 1.44, false);
  solid(8.54, 4.43, 10.13, 5.02);

  // ======================= CORTINA DE LINHO DA JANELA NORTE =======================
  // janela x 7,76–9,56 na parede z 0,25: duas folhas em prega, do trilho no forro ao chão
  const folds = (xa, xb, tone) => {
    const n = Math.round((xb - xa) / 0.075);
    for (let i = 0; i < n; i++) {
      const x = xa + (i + 0.5) * (xb - xa) / n;
      const f = B(0.095, 2.44, 0.014, i % 2 ? linenC : linenC2, x, 1.24, 0.30 + (i % 2 ? 0.035 : 0), nc);
      f.rotation.y = (i % 2 ? 1 : -1) * 0.5;
      if (tone) f.position.y += 0;
    }
  };
  folds(7.45, 8.52, 0); folds(8.62, 9.60, 0);
  B(2.22, 0.035, 0.07, railM, 8.525, 2.475, 0.325, nc);                                    // trilho/sanca de cortina
  B(0.08, 0.30, 0.05, linenC2, 7.43, 0.15, 0.31, nc);                                      // sobra do tecido no chão (barra dobrada)

  // ======================= TAPETE =======================
  const rugY = 0.012;
  B(1.94, 0.012, 2.12, rugBand, 8.43, rugY / 2, 1.78, nc);
  B(1.78, 0.014, 1.96, rugField, 8.43, 0.007 + 0.001, 1.78, nc);
  B(1.60, 0.016, 1.78, rugLine, 8.43, 0.008 + 0.001, 1.78, nc);
  B(1.54, 0.018, 1.72, rugField, 8.43, 0.009 + 0.001, 1.78, nc);
}
