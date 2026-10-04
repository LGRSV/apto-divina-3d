function roomSuitesVisita(ctx) {
  // ---------------------------------------------------------------------------
  // SUÍTES DE VISITA — Apartamento Vovó (APTO DIVINA · STORIA)
  //  · Suíte visita (x 4,37–7,02 · z 0,25–3,24): cômoda F (vista F, Freijó, 4 colunas × 3 linhas de
  //    gavetas com botão central superior e nicho aberto no canto inferior direito), cama box casal nº 13
  //    (1,38 × 1,88, cabeceira na parede x 7,07, roupa azul-claro), cortina de linho + voal + varão dourado
  //    na janela norte (sobre a cômoda), tapete, quadro sobre a cabeceira, abajur/bandeja/vaso sobre a
  //    cômoda e planta no canto. Ar nº 12 é do cartão (x 4,47 · y 2,28 · z 2,04).
  //  · Suíte americana 01 / sala de TV (x 1,31–4,27 · z 1,69–4,24): sofá-cama nº 11 (180 × 90, tecido
  //    cinza, encosto na parede z 4,29), armário E (vista E, Frapê, 163 × 60 × 250, 4 portas 41/41/41/40,
  //    puxadores verticais dourados, costas na parede x 4,32), cortina de linho da porta de vidro da
  //    varanda (z 2,95–4,14), tapete, mesa de centro redonda, quadro e planta. Ar nº 10 é do cartão.
  //  · Hall íntimo (x 4,37–6,70 · z 3,34–4,24): console estreito de carvalho com pés dourados e quadro,
  //    na parede sul da suíte visita (deixa ≥ 0,74 m de passagem).
  // Livres: giro da porta da suíte visita (x 4,46–5,23, para −z), da porta da suíte americana (x 4,32,
  // folha varre x 3,52–4,32 · z 3,42–4,22) e da porta do master (x 6,72), os splits 10 e 12 e as luminárias.
  // Tudo em coordenadas de mundo (metros). Colisores do modo Pessoa: `solid(x0, z0, x1, z1)`.
  // ---------------------------------------------------------------------------
  const THREE = ctx.THREE, M = ctx.M;
  const box = (...a) => ctx.box(...a), cyl = (...a) => ctx.cyl(...a), sph = (...a) => ctx.sph(...a);
  const std = (o) => ctx.std(o), rnd = () => ctx.rnd();
  const place = (g, x, z, ry = 0, y = 0) => ctx.place(g, x, z, ry, y);
  const put = (m) => { ctx.add(m); return m; };
  const G = () => new THREE.Group();
  const nc = { cast: false };
  const PI = Math.PI;
  const FZ = 0, FX = PI / 2, FNX = -PI / 2, FNZ = PI;   // frente (+z local) virada para +z / +x / −x / −z

  // caixa por extensões em coordenadas de mundo: x0..x1, y0..y1, z0..z1
  const W = (mat, x0, x1, y0, y1, z0, z1, o) => put(box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, o));
  // idem, dentro de um grupo local
  const L = (g, mat, x0, x1, y0, y1, z0, z1, o) => { const m = box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, o); g.add(m); return m; };
  const solid = (x0, z0, x1, z1) => {
    if (typeof ctx.addCollider === 'function') ctx.addCollider(x0, z0, x1, z1);
    else if (Array.isArray(ctx.colliders)) ctx.colliders.push([x0, z0, x1, z1]);
  };
  // elipsoide achatado (travesseiros, almofadas, folhas)
  const puff = (mat, cx, cy, cz, sx, sy, sz, rx = 0, ry = 0, rz = 0, o) => {
    const m = sph(1, mat, cx, cy, cz); m.scale.set(sx, sy, sz); m.rotation.set(rx, ry, rz);
    if (o && o.cast === false) m.castShadow = false;
    return put(m);
  };

  // ---- materiais (mesmas opções → mesmo material) -------------------------------------------------
  const pick = (k, o) => M[k] || std(o);
  const frape   = pick('frape',   { color: 0xcdbfae, roughness: 0.75 });
  const freijo  = pick('freijo',  { color: 0xd9bb88, roughness: 0.6 });
  const carvalho = pick('carvalho', { color: 0xcfb48a, roughness: 0.6 });
  const dourado = pick('dourado', { color: 0xc9a66b, roughness: 0.3, metalness: 0.85 });
  const linho   = pick('linho',   { color: 0xe5dfd2, roughness: 0.97 });
  const freijoDk = std({ color: 0x8a6c43, roughness: 0.75 });          // fundo/sombra das gavetas e rodapé
  const freijoLt = std({ color: 0xe6cd9f, roughness: 0.6 });           // interior do nicho
  const knobM   = std({ color: 0x74492a, roughness: 0.5 });            // botão de madeira escura
  const frapeDk = std({ color: 0xa79d8f, roughness: 0.8 });            // rodapé do armário E
  const frapeGap = std({ color: 0x6f675c, roughness: 0.9 });           // fresta entre portas
  const skirtF  = std({ color: 0xbdb5a6, roughness: 0.96 });           // saia do box da cama
  const mattress = std({ color: 0xf1eee7, roughness: 0.95 });
  const duvet   = std({ color: 0xcddcec, roughness: 0.97 });           // roupa de cama azul-claro
  const duvetFold = std({ color: 0xbacfe5, roughness: 0.97 });
  const throwM  = std({ color: 0xcbbca4, roughness: 0.98 });           // manta greige
  const pillow  = std({ color: 0xf4f2ec, roughness: 0.96 });
  const pillowBlue = std({ color: 0xaebfd1, roughness: 0.96 });
  const pillowSand = std({ color: 0xcdb79a, roughness: 0.96 });
  const fabricGray = std({ color: 0x9ea396, roughness: 0.98 });        // sofá-cama
  const fabricGrayLt = std({ color: 0xabb0a2, roughness: 0.98 });
  const fabricSeam = std({ color: 0x80857a, roughness: 1 });
  const legDark = std({ color: 0x3a342e, roughness: 0.6 });
  const rugField = std({ color: 0xded7c9, roughness: 1 });
  const rugEdge = std({ color: 0xc7bda9, roughness: 1 });
  const rugLine = std({ color: 0xb2a58e, roughness: 1 });
  const rugField2 = std({ color: 0xd5cdbb, roughness: 1 });
  const curtainM = std({ color: 0xe4ddcf, roughness: 0.98 });
  const curtainM2 = std({ color: 0xd9d1c0, roughness: 0.98 });
  const sheer   = std({ color: 0xf5f2ea, roughness: 0.9, transparent: true, opacity: 0.38, side: THREE.DoubleSide });
  const railM   = std({ color: 0xf2f0ea, roughness: 0.6 });
  const ceramic = std({ color: 0xf1eee8, roughness: 0.35 });
  const ceramicBg = std({ color: 0xcbbfa9, roughness: 0.5 });
  const paperW  = std({ color: 0xf7f4ee, roughness: 0.9 });
  const book1   = std({ color: 0x8c9db0, roughness: 0.8 });
  const book2   = std({ color: 0xc6b08e, roughness: 0.8 });
  const book3   = std({ color: 0xe8e2d4, roughness: 0.8 });
  const frameG  = dourado;
  const frameW  = std({ color: 0xe9e2d3, roughness: 0.55 });
  const potM    = std({ color: 0xd8cfbf, roughness: 0.7 });
  const potDk   = std({ color: 0x3a3733, roughness: 0.6 });
  const soil    = std({ color: 0x3d2b1c, roughness: 1 });
  const leafA   = std({ color: 0x4a6b3c, roughness: 0.8 });
  const leafB   = std({ color: 0x5b7c46, roughness: 0.8 });
  const stemM   = std({ color: 0x6a5a3c, roughness: 0.9 });
  const dryM    = std({ color: 0xcdb98f, roughness: 0.95 });
  // abajur: cúpula de linho que acende com a luz da suíte visita
  const shadeM = ctx.bindEmissive
    ? ctx.bindEmissive('luz_suite_visita', new THREE.MeshStandardMaterial({ color: 0xece5d6, roughness: 0.9, emissive: 0xffd9a8, emissiveIntensity: 0, side: THREE.DoubleSide }), 0.8, { min: 0 })
    : std({ color: 0xece5d6, roughness: 0.9, side: THREE.DoubleSide });

  // ---- quadros (arte abstrata em tons de greige/azul-acinzentado/terracota suave) ------------------
  const artTex = (kind) => ctx.makeTex ? ctx.makeTex(256, (g, s) => {
    g.fillStyle = kind === 0 ? '#e9e1d2' : kind === 1 ? '#ddd6c8' : '#e6dfd0'; g.fillRect(0, 0, s, s);
    if (kind === 0) {            // arcos sobrepostos
      const cols = ['#c9b79b', '#a9b4bf', '#d9c9ae', '#b7a285'];
      for (let i = 0; i < 4; i++) { g.fillStyle = cols[i]; g.beginPath(); g.arc(s * (0.28 + i * 0.15), s * 0.62, s * (0.32 - i * 0.045), PI, 0); g.lineTo(s * (0.6 + i * 0.15 - 0.05 * i), s * 0.9); g.lineTo(s * (-0.04 + i * 0.15), s * 0.9); g.fill(); }
    } else if (kind === 1) {     // linhas de horizonte
      const cols = ['#b9c3cc', '#cdbfa6', '#a99a82', '#dcd3c0'];
      for (let i = 0; i < 4; i++) { g.fillStyle = cols[i]; g.fillRect(0, s * (0.12 + i * 0.2), s, s * (0.14 + 0.02 * i)); }
      g.fillStyle = '#c4a584'; g.beginPath(); g.arc(s * 0.68, s * 0.34, s * 0.12, 0, PI * 2); g.fill();
    } else {                     // manchas orgânicas
      const cols = ['#bfa58a', '#9fb0bf', '#d4c2a6'];
      for (let i = 0; i < 3; i++) { g.fillStyle = cols[i]; g.beginPath(); g.ellipse(s * (0.3 + 0.2 * i), s * (0.5 + 0.1 * Math.sin(i * 2)), s * 0.22, s * 0.3, i * 0.6, 0, PI * 2); g.fill(); }
    }
  }) : null;
  const art0 = artTex(0), art1 = artTex(1), art2 = artTex(2);
  const artMat = (t) => t ? std({ map: t, roughness: 0.9 }) : std({ color: 0xcfc4ae, roughness: 0.9 });
  // quadro de parede: (x, y, z) = centro-base do quadro no plano da parede, ry = direção da frente
  const picture = (x, y, z, ry, w, h, tex, frame) => {
    const g = G();
    g.add(box(w, h, 0.03, frame, 0, h / 2, 0.015, nc));
    g.add(box(w - 0.05, h - 0.05, 0.012, paperW, 0, h / 2, 0.034, nc));
    g.add(box(w - 0.13, h - 0.13, 0.008, artMat(tex), 0, h / 2, 0.04, nc));
    place(g, x, z, ry, y); return g;
  };

  // ---- planta de folhas largas -----------------------------------------------------------------
  const plant = (x, z, s = 1, pot = potM, bnd = null) => {   // bnd = [x0, z0, x1, z1]: folhas não atravessam as paredes do canto
    put(cyl(0.12 * s, 0.09 * s, 0.24 * s, pot, x, 0.12 * s, z, 14));
    put(cyl(0.105 * s, 0.105 * s, 0.01, soil, x, 0.245 * s, z, 12));
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1, bx = x + Math.cos(a) * 0.02 * s, bz = z + Math.sin(a) * 0.02 * s;
      const st = cyl(0.008 * s, 0.01 * s, 0.7 * s, stemM, bx, 0.58 * s, bz, 6); st.rotation.z = Math.cos(a) * 0.08; st.rotation.x = Math.sin(a) * 0.08; put(st);
    }
    for (let i = 0; i < 11; i++) {
      const a = i * 2.4 + rnd() * 0.5, h = (0.5 + (i % 5) * 0.12 + rnd() * 0.06) * s, r = (0.1 + (i % 3) * 0.04) * s;
      const mg = 0.19 * s, cl = (v, lo, hi) => (bnd ? Math.min(Math.max(v, lo + mg), hi - mg) : v);
      puff(i % 2 ? leafA : leafB, cl(x + Math.cos(a) * r, bnd && bnd[0], bnd && bnd[2]), 0.25 * s + h, cl(z + Math.sin(a) * r, bnd && bnd[1], bnd && bnd[3]), 0.1 * s, 0.025 * s, 0.17 * s, 0.6, -a, Math.cos(a) * 0.5, nc);
    }
  };

  // ---- cortina em pregas: tiras com recuos alternados, ao longo de x ('x') ou z ('z') ------------------
  const pleats = (mat, axis, a0, a1, c, depth, y0, y1, n) => {
    for (let i = 0; i < n; i++) {
      const lo = a0 + (a1 - a0) * i / n, hi = a0 + (a1 - a0) * (i + 1) / n + 0.004;
      const off = depth * (0.5 + 0.5 * Math.sin(i * 1.9 + 0.4)), m = i % 2 ? mat : curtainM2;
      if (axis === 'x') W(m, lo, hi, y0, y1, c + off - 0.016, c + off + 0.016, nc);
      else W(m, c + off - 0.016, c + off + 0.016, y0, y1, lo, hi, nc);
    }
  };

  // ===========================================================================================
  // SUÍTE VISITA
  // ===========================================================================================
  // ---- cômoda F (vista F): 266 × 55 × 110 Freijó, encostada na parede norte sob a janela ------------
  {
    const X0 = 4.375, X1 = 7.01, Z0 = 0.26, Z1 = 0.80, T = 1.10, CW = (X1 - X0) / 4;
    const yRow = [0.10, 0.44, 0.77, 1.10];                  // linhas de baixo para cima: 34 / 33 / 33 (+10 de rodapé)
    const nx0 = X0 + CW * 2;                                // início do nicho (colunas 3–4 da linha de baixo)
    W(freijoDk, X0 + 0.01, X1 - 0.01, 0, 0.10, Z0 + 0.04, Z1 - 0.03, nc);                  // rodapé recuado 3 cm
    W(freijoDk, X0, nx0, yRow[0], T - 0.02, Z0, Z1 - 0.022);                                // corpo (esquerda)
    W(freijoDk, nx0, X1, yRow[1], T - 0.02, Z0, Z1 - 0.022);                                // corpo acima do nicho
    // nicho aberto 133 × 34
    W(freijoLt, nx0, X1, yRow[0] + 0.02, yRow[1], Z0, Z0 + 0.02, nc);                       // fundo
    W(freijoDk, nx0, X1, yRow[0], yRow[0] + 0.02, Z0, Z1 - 0.022, nc);                      // soleira escura
    W(freijoLt, nx0 + 0.005, X1 - 0.02, yRow[0] + 0.02, yRow[1] - 0.02, Z0 + 0.02, Z0 + 0.021, nc);
    W(freijo, X1 - 0.02, X1, yRow[0], yRow[1], Z0, Z1);                                     // lateral direita do nicho
    W(freijo, nx0 - 0.016, nx0, yRow[0], yRow[1], Z0, Z1);                                  // divisória esquerda do nicho
    W(freijo, nx0, X1, yRow[1] - 0.02, yRow[1], Z0 + 0.02, Z1);                             // teto do nicho
    // tampo
    W(freijo, X0 - 0.003, X1 + 0.003, T - 0.02, T, Z0, Z1 + 0.012);
    // frentes das gavetas (0,018 de espessura, folga de 3 mm)
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      if (r === 0 && c >= 2) continue;
      const x0 = X0 + c * CW + 0.003, x1 = X0 + (c + 1) * CW - 0.003, y0 = yRow[r] + 0.003, y1 = (r === 2 ? T - 0.02 : yRow[r + 1]) - 0.003;
      W(freijo, x0, x1, y0, y1, Z1 - 0.022, Z1);
      const kx = (x0 + x1) / 2, ky = y1 - 0.045;                                        // botão central superior
      const k = cyl(0.017, 0.017, 0.022, knobM, kx, ky, Z1 + 0.009, 14); k.rotation.x = PI / 2; put(k);
    }
    solid(X0, Z0, X1, Z1 + 0.02);
    // ---- objetos sobre a cômoda (y = 1,10) ----
    // abajur
    put(cyl(0.05, 0.065, 0.2, ceramic, 4.76, T + 0.1, 0.55, 16));
    put(cyl(0.012, 0.012, 0.1, dourado, 4.76, T + 0.25, 0.55, 8));
    put(cyl(0.1, 0.14, 0.2, shadeM, 4.76, T + 0.36, 0.55, 20, true)).castShadow = false;
    // bandeja com livros e vasinho
    W(dourado, 5.45, 5.90, T, T + 0.012, 0.42, 0.70, nc);
    W(book1, 5.48, 5.76, T + 0.012, T + 0.04, 0.46, 0.62); W(book2, 5.50, 5.74, T + 0.04, T + 0.062, 0.48, 0.60); W(book3, 5.52, 5.72, T + 0.062, T + 0.078, 0.49, 0.59);
    put(cyl(0.032, 0.04, 0.1, ceramicBg, 5.80, T + 0.062, 0.56, 14));
    puff(leafB, 5.80, T + 0.15, 0.56, 0.04, 0.04, 0.05, 0, 0, 0.5, nc);
    // vaso alto com ramos secos
    put(cyl(0.05, 0.07, 0.26, ceramicBg, 6.62, T + 0.13, 0.52, 16));
    for (let i = 0; i < 7; i++) {
      const b = cyl(0.004, 0.005, 0.5 + (i % 3) * 0.1, dryM, 6.62 + (i - 3) * 0.012, T + 0.5, 0.52 + (i % 2 - 0.5) * 0.02, 5); b.rotation.z = (i - 3) * 0.1; b.rotation.x = (i % 3 - 1) * 0.08; b.castShadow = false; put(b);
      puff(dryM, 6.62 + (i - 3) * 0.045, T + 0.78 + (i % 3) * 0.06, 0.52, 0.012, 0.045, 0.012, 0, 0, (i - 3) * 0.1, nc);
    }
  }

  // ---- cortina da janela norte (x 4,71–6,51): varão dourado, voal e duas folhas de linho -----------
  {
    const yT = 2.38, yB = 1.16;
    const rod = cyl(0.011, 0.011, 2.30, dourado, 5.61, yT, 0.33, 10); rod.rotation.z = PI / 2; put(rod);
    for (const sx of [4.46, 6.76]) { puff(dourado, sx, yT, 0.33, 0.026, 0.026, 0.026, 0, 0, 0, nc); }
    for (const bx of [4.62, 6.60]) W(dourado, bx - 0.006, bx + 0.006, yT, yT + 0.05, 0.27, 0.29, nc);   // suportes
    W(sheer, 4.58, 6.64, yB, yT + 0.03, 0.296, 0.302, nc);
    pleats(curtainM, 'x', 4.52, 5.14, 0.335, 0.045, yB, yT + 0.01, 11);
    pleats(curtainM, 'x', 6.08, 6.70, 0.335, 0.045, yB, yT + 0.01, 11);
    // argolas de pano (cabeça das pregas)
    W(curtainM2, 4.52, 5.14, yT - 0.03, yT + 0.015, 0.31, 0.38, nc); W(curtainM2, 6.08, 6.70, yT - 0.03, yT + 0.015, 0.31, 0.38, nc);
  }

  // ---- cama box casal nº 13: 138 × 188 (h 0,61), cabeceira na parede x 7,07 --------------------------
  {
    const X0 = 5.13, X1 = 7.01, Z0 = 1.35, Z1 = 2.73;
    for (const [px, pz] of [[X0 + 0.06, Z0 + 0.06], [X0 + 0.06, Z1 - 0.06], [X1 - 0.06, Z0 + 0.06], [X1 - 0.06, Z1 - 0.06]]) W(legDark, px - 0.025, px + 0.025, 0, 0.07, pz - 0.025, pz + 0.025, nc);
    W(skirtF, X0, X1, 0.07, 0.36, Z0, Z1);                                           // box (saia)
    W(legDark, X0 + 0.002, X1, 0.065, 0.075, Z0 + 0.004, Z1 - 0.004, nc);            // sombra sob a saia
    W(mattress, X0 + 0.01, X1, 0.36, 0.61, Z0 + 0.01, Z1 - 0.01);                    // colchão
    // roupa de cama: lençol sobre o colchão, caídas laterais e do pé
    W(duvet, X0 - 0.005, 6.78, 0.61, 0.645, Z0 + 0.002, Z1 - 0.002);
    W(duvet, X0 - 0.005, 6.78, 0.40, 0.645, Z0 - 0.012, Z0 + 0.002);
    W(duvet, X0 - 0.005, 6.78, 0.40, 0.645, Z1 - 0.002, Z1 + 0.012);
    W(duvet, X0 - 0.014, X0 - 0.005, 0.40, 0.645, Z0 - 0.012, Z1 + 0.012);
    // dobra do edredom (faixa mais escura) e manta greige no pé
    W(duvetFold, 6.18, 6.62, 0.645, 0.68, Z0 + 0.012, Z1 - 0.012);
    W(duvetFold, 6.18, 6.62, 0.43, 0.68, Z0 - 0.02, Z0 + 0.012); W(duvetFold, 6.18, 6.62, 0.43, 0.68, Z1 - 0.012, Z1 + 0.02);
    W(throwM, 5.38, 5.76, 0.645, 0.668, Z0 + 0.01, Z1 - 0.01);
    W(throwM, 5.38, 5.76, 0.42, 0.668, Z0 - 0.026, Z0 + 0.01); W(throwM, 5.38, 5.76, 0.42, 0.668, Z1 - 0.01, Z1 + 0.026);
    // travesseiros
    puff(pillow, 6.76, 0.72, 1.76, 0.18, 0.075, 0.30, 0, 0, -0.06);
    puff(pillow, 6.76, 0.72, 2.32, 0.18, 0.075, 0.30, 0, 0, -0.06);
    // almofadões encostados na parede
    const b1 = box(0.13, 0.52, 0.56, pillow, 6.93, 0.92, 1.76); b1.rotation.z = 0.2; put(b1);
    const b2 = box(0.13, 0.52, 0.56, pillow, 6.93, 0.92, 2.32); b2.rotation.z = 0.2; put(b2);
    puff(pillowBlue, 6.68, 0.83, 2.03, 0.07, 0.17, 0.2, 0, 0, 0.35);                  // almofada decorativa
    puff(pillowSand, 6.66, 0.8, 2.34, 0.06, 0.15, 0.17, 0, 0.25, 0.3);
    solid(X0, Z0, X1, Z1);
    // quadro acima da cabeceira (parede x 7,07, frente para −x)
    picture(7.02, 1.38, 2.04, FNX, 0.95, 0.65, art0, frameG);
  }

  // ---- tapete da suíte visita (sob a cama, sobra no pé e nos lados; folga da porta é só de piso) ------
  W(rugEdge, 4.85, 6.85, 0.004, 0.012, 1.00, 3.00, { cast: false });
  W(rugField, 4.92, 6.78, 0.0125, 0.0135, 1.07, 2.93, { cast: false });
  W(rugLine, 4.96, 6.74, 0.0136, 0.0142, 1.11, 2.89, { cast: false });
  W(rugField2, 4.99, 6.71, 0.0143, 0.0148, 1.14, 2.86, { cast: false });

  // planta no canto sudeste da suíte
  plant(6.74, 3.0, 1.1, potDk, [4.37, 0.24, 7.02, 3.24]);
  solid(6.61, 2.87, 6.87, 3.13);

  // ===========================================================================================
  // HALL ÍNTIMO — console e quadro na parede sul da suíte visita (face z 3,34)
  // ===========================================================================================
  {
    const X0 = 5.35, X1 = 6.25, Z0 = 3.352, Z1 = 3.50;   // 15 cm a oeste: a folha da porta do hall → suíte master (dobradiça em z 4,16) gira livre
    W(carvalho, X0, X1, 0.76, 0.80, Z0, Z1);                                          // tampo
    W(carvalho, X0 + 0.01, X1 - 0.01, 0.69, 0.76, Z0 + 0.01, Z1 - 0.03);              // gaveta única
    W(frape, X0 + 0.014, X1 - 0.014, 0.695, 0.755, Z1 - 0.03, Z1 - 0.012);            // frente da gaveta
    const kp = box(0.14, 0.012, 0.012, dourado, (X0 + X1) / 2, 0.735, Z1 - 0.006, nc); put(kp);
    for (const lx of [X0 + 0.04, X1 - 0.04]) for (const lz of [Z0 + 0.025, Z1 - 0.025]) W(dourado, lx - 0.012, lx + 0.012, 0, 0.69, lz - 0.012, lz + 0.012, nc);   // pés dourados
    // objetos
    put(cyl(0.045, 0.06, 0.2, ceramicBg, 5.51, 0.9, 3.43, 14));
    for (let i = 0; i < 4; i++) { const b = cyl(0.004, 0.005, 0.38, dryM, 5.51 + (i - 1.5) * 0.012, 1.12, 3.43, 5); b.rotation.z = (i - 1.5) * 0.12; b.castShadow = false; put(b); }
    W(book2, 5.85, 6.07, 0.80, 0.83, 3.38, 3.47); W(book3, 5.87, 6.05, 0.83, 0.85, 3.39, 3.46);
    put(sph(0.04, dourado, 5.96, 0.89, 3.425));
    solid(X0, Z0 - 0.01, X1, Z1);
    // quadro (face z 3,34 → para +z)
    picture(5.80, 1.12, 3.34, FZ, 0.80, 0.80, art1, frameG);
  }

  // ===========================================================================================
  // SUÍTE AMERICANA 01 / SALA DE TV
  // ===========================================================================================
  // ---- armário E (vista E): 163 × 60 × 250 Frapê, costas na parede x 4,32 (face 4,255), portas para −x ---
  {
    const XB = 4.25, XF = 3.65, Z0 = 1.73, Z1 = 3.36, XD = XF + 0.018;                  // XD = face interna das portas
    W(frapeDk, XF + 0.03, XB, 0, 0.10, Z0 + 0.02, Z1 - 0.02, nc);                       // rodapé recuado 3 cm
    W(frapeGap, XD, XB, 0.10, 2.45, Z0, Z1);                                           // corpo (aparece nas frestas)
    W(frape, XF, XB, 2.45, 2.50, Z0, Z1);                                              // tampo/arremate de 5 cm
    const wd = [0.41, 0.41, 0.41, 0.40];
    let z = Z0; const edges = [Z0];
    for (const w of wd) {
      W(frape, XF, XD, 0.103, 2.447, z + 0.002, z + w - 0.002);
      z += w; edges.push(z);
    }
    // puxadores verticais dourados (pares nas junções 1|2 e 3|4, como na elevação)
    for (const e of [edges[1], edges[3]]) for (const s of [-1, 1]) {
      const pz = e + s * 0.03;
      W(dourado, XF - 0.022, XF, 0.92, 1.52, pz - 0.007, pz + 0.007, nc);
      W(dourado, XF - 0.022, XF - 0.012, 0.915, 0.925, pz - 0.007, pz + 0.007, nc);
    }
    solid(XF - 0.02, Z0, XB, Z1);
  }

  // ---- sofá-cama nº 11: Borneo Anjos, 2 módulos de 1 assento + 1 braço (102 cm cada), tecido cinza-esverdeado,
  //      180 × 90 × 95, encosto na parede z 4,29 (assento virado para −z) ----
  {
    const X0 = 1.21, X1 = 3.01, Z0 = 3.34, Z1 = 4.23;
    for (const px of [X0 + 0.07, X1 - 0.07]) for (const pz of [Z0 + 0.07, Z1 - 0.07]) W(legDark, px - 0.025, px + 0.025, 0, 0.09, pz - 0.025, pz + 0.025, nc);
    W(fabricGray, X0, X1, 0.09, 0.27, Z0, Z1);                                          // base/estrutura
    W(fabricSeam, X0 + 0.005, X1 - 0.005, 0.085, 0.10, Z0 + 0.02, Z1 - 0.02, nc);       // sombra sob a base
    W(fabricGray, X0, X1, 0.27, 0.93, Z1 - 0.10, Z1);                                   // moldura do encosto
    const AW = 0.14;                                                                    // braços (um em cada ponta)
    W(fabricGray, X0, X0 + AW, 0.27, 0.64, Z0, Z1);
    W(fabricGray, X1 - AW, X1, 0.27, 0.64, Z0, Z1);
    W(fabricGrayLt, X0 + 0.01, X0 + AW - 0.01, 0.64, 0.665, Z0 + 0.01, Z1 - 0.10, nc);  // tampa dos braços
    W(fabricGrayLt, X1 - AW + 0.01, X1 - 0.01, 0.64, 0.665, Z0 + 0.01, Z1 - 0.10, nc);
    const mw = (X1 - X0 - 2 * AW) / 2;                                                  // dois módulos de assento
    for (let i = 0; i < 2; i++) {
      const a = X0 + AW + i * mw + 0.004, b = a + mw - 0.008;
      W(fabricGrayLt, a, b, 0.27, 0.43, Z0 + 0.012, Z1 - 0.30);                         // almofada do assento
      W(fabricSeam, a + 0.004, b - 0.004, 0.425, 0.432, Z0 + 0.03, Z1 - 0.32, nc);     // pesponto
      const bk = box(b - a, 0.50, 0.17, fabricGrayLt, (a + b) / 2, 0.66, Z1 - 0.185); bk.rotation.x = -0.12; put(bk);   // encosto inclinado
    }
    W(fabricSeam, (X0 + X1) / 2 - 0.003, (X0 + X1) / 2 + 0.003, 0.28, 0.43, Z0 + 0.012, Z1 - 0.30, nc);   // junção dos módulos
    puff(pillowBlue, X0 + 0.46, 0.64, Z1 - 0.30, 0.2, 0.2, 0.07, -0.3, 0.15, 0.1);
    puff(pillow, X1 - 0.46, 0.64, Z1 - 0.30, 0.2, 0.2, 0.07, -0.3, -0.12, -0.1);
    W(throwM, X1 - AW - 0.005, X1 - 0.005, 0.665, 0.685, Z0 + 0.08, Z0 + 0.42, nc);      // manta dobrada sobre o braço
    solid(X0, Z0, X1, Z1 + 0.02);
  }

  // ---- mesa de centro redonda + tapete ----------------------------------------------------------
  {
    W(rugEdge, 1.42, 3.28, 0.004, 0.012, 2.20, 3.30, { cast: false });
    W(rugField, 1.49, 3.21, 0.0125, 0.0135, 2.26, 3.24, { cast: false });
    W(rugLine, 1.53, 3.17, 0.0136, 0.0142, 2.30, 3.20, { cast: false });
    put(cyl(0.27, 0.27, 0.03, carvalho, 2.15, 0.375, 2.78, 28));
    put(cyl(0.04, 0.05, 0.36, dourado, 2.15, 0.18, 2.78, 12));
    put(cyl(0.17, 0.17, 0.02, dourado, 2.15, 0.01, 2.78, 20));
    // objetos: livros e vasinho
    W(book1, 2.00, 2.26, 0.39, 0.415, 2.70, 2.88); W(book2, 2.02, 2.24, 0.415, 0.435, 2.72, 2.86);
    put(cyl(0.035, 0.045, 0.1, ceramic, 2.30, 0.44, 2.75, 14));
    puff(leafB, 2.30, 0.52, 2.75, 0.05, 0.05, 0.06, 0, 0, 0.4, nc);
    solid(1.88, 2.51, 2.42, 3.05);
  }

  // ---- cortina da porta de vidro da varanda (z 2,95–4,14): linho em pregas + voal + trilho ----------------
  {
    const yB = 0.02, yT = 2.46;
    W(railM, 1.085, 1.23, yT, 2.5, 2.84, 4.22, nc);                                     // trilho no forro
    W(sheer, 1.092, 1.098, yB, yT, 2.90, 4.18, nc);
    pleats(curtainM, 'z', 2.90, 3.44, 1.125, 0.03, yB, yT, 14);                          // folha recolhida junto ao pilar
    pleats(curtainM, 'z', 3.80, 4.18, 1.125, 0.03, yB, yT, 10);
  }

  // ---- quadro e planta da suíte americana -------------------------------------------------------
  picture(2.0, 1.28, 1.69, FZ, 0.85, 0.65, art2, frameG);                                // parede norte (face z 1,69)
  plant(1.58, 1.96, 1.15, potM, [1.31, 1.69, 4.27, 4.24]);
  solid(1.44, 1.82, 1.72, 2.10);
}
