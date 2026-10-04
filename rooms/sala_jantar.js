function roomSalaJantar(ctx) {
  // ---------------------------------------------------------------------------
  // SALA DE ESTAR + JANTAR + HALL DE ENTRADA — Apartamento Vovó (APTO DIVINA · STORIA)
  //  · Painel C (MARCENARIA vista C, parede norte z 4,34, face sul): lateral esquerda de 20 + painel ripado
  //    de Carvalho Natural (tábuas 40/20/29/14/34/19/24/28 com juntas de 1 cm, vão da TV de 1,38 × 0,82 em
  //    x 1,71–3,09 · y 0,98–1,80 — a TV é objeto do cartão), balcão de 60 (rodapé 10) com 8 portas de 54
  //    em moldura com palhinha e botões dourados nas juntas, cristaleira de 215 (4 portas de 54, palhinha,
  //    4 prateleiras de vidro 38/28/28/28/45 com louça, puxadores verticais dourados nas juntas 1|2 e 3|4).
  //    A porta de correr de marcenaria (1,23 × 2,49, x 5,59–6,78) é do cartão.
  //  · Estante D (vista D, x 6,45–6,65 · z 4,26–6,53, 228 × 20 × 250, Carvalho): base de 90 com 5 portas de 46
  //    lisas, nichos 78 (100|122), 43 (33|163|24), 31 (154|68) e objetos. O split nº 9 (cartão) fica no
  //    trecho z 5,40–6,51 · y 2,07–2,43: ali a prateleira de 2,15 e as divisórias foram omitidas.
  //  · Buffet B (vista B, x 1,22–3,41 · z 6,76–7,16, 219 × 40 × 85): Gianduia, pés dourados, 5 portas de 44 com
  //    palhinha; sofá 3 lugares 2,16 × 0,81 (linho) com o encosto no buffet, virado para a TV; tapetes;
  //    mesa de jantar 2,39 × 0,91 (freijó) + 8 cadeiras com braços; 3 pendentes dourados; cortina de linho
  //    + voal na porta de vidro da sala (x ≈ 1,10); orquídea, vasos, livros, quadros.
  //  · Hall de entrada (x 6,76–8,44 · z 6,53–7,59): aparador estreito com espelho em arco, lâmpada,
  //    quadro na parede sul e capacho diante da porta de entrada (cartão).
  // Livres: giro da porta de entrada (x 7,59–8,49 · z 6,62–7,49), o vão do hall (x 5,59–6,46 · z 4,24–4,40),
  // o split da sala e as luminárias. Tudo em coordenadas de mundo (metros). Colisores: ctx.addCollider.
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

  // caixa por extensões em coordenadas de mundo
  const W = (mat, x0, x1, y0, y1, z0, z1, o) => put(box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, o));
  // idem, dentro de um grupo local
  const L = (g, mat, x0, x1, y0, y1, z0, z1, o) => { const m = box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, o); g.add(m); return m; };
  const solid = (x0, z0, x1, z1) => {
    const f = ctx.addCollider || ctx.collider || ctx.collide;
    if (typeof f === 'function') f(x0, z0, x1, z1);
    else if (Array.isArray(ctx.colliders)) ctx.colliders.push([x0, z0, x1, z1]);
  };
  const puff = (mat, cx, cy, cz, sx, sy, sz, rx = 0, ry = 0, rz = 0, o) => {
    const m = sph(1, mat, cx, cy, cz); m.scale.set(sx, sy, sz); m.rotation.set(rx, ry, rz);
    if (o && o.cast === false) m.castShadow = false;
    return put(m);
  };

  // ---- materiais (mesmas opções → mesmo material) -------------------------------------------------
  const pick = (k, o) => M[k] || std(o);
  const carvalho = pick('carvalho', { color: 0xcdb28a, roughness: 0.6 });
  const gianduia = pick('gianduia', { color: 0xb8a792, roughness: 0.38 });
  const palhinha = pick('palhinha', { color: 0xd8bf8c, roughness: 0.9, side: THREE.DoubleSide });
  const freijo  = pick('freijo',  { color: 0xdcc190, roughness: 0.55 });
  const dourado = pick('dourado', { color: 0xc9a66b, roughness: 0.3, metalness: 0.85 });
  const linho   = pick('linho',   { color: 0xe5dfd2, roughness: 0.97 });
  const espelho = pick('espelho', { color: 0xdfe6ea, roughness: 0.05, metalness: 1 });
  const carvInt = std({ color: 0xb9996c, roughness: 0.75 });            // interior de nichos e fundos
  const carvDk  = std({ color: 0x6f5a3e, roughness: 0.85 });            // corpo atrás das portas / rodapé
  const gianDk  = std({ color: 0x8a7b69, roughness: 0.6 });             // fundo e rodapé do buffet
  const glassShelf = std({ color: 0xdbe9e4, roughness: 0.1, transparent: true, opacity: 0.32 });
  const sofaM   = std({ color: 0xe3ddcf, roughness: 0.98 });            // linho do sofá
  const sofaLt  = std({ color: 0xebe6da, roughness: 0.98 });
  const sofaDk  = std({ color: 0xd3cbbb, roughness: 0.98 });
  const pillowSand = std({ color: 0xc9b08f, roughness: 0.96 });
  const pillowTerra = std({ color: 0xbf8f77, roughness: 0.96 });
  const pillowGray = std({ color: 0xa9aaa4, roughness: 0.96 });
  const throwM  = std({ color: 0xcdbfa8, roughness: 0.98 });
  const tableTop = std({ color: 0xe6d0a8, roughness: 0.5 });             // tampo de freijó claro
  const tableLeg = std({ color: 0xd2b88a, roughness: 0.6 });
  const chairWood = std({ color: 0xdcc59c, roughness: 0.55 });
  const chairSeat = std({ color: 0xe9e3d6, roughness: 0.96 });
  const rugField = std({ color: 0xded7c9, roughness: 1 });
  const rugEdge = std({ color: 0xc7bda9, roughness: 1 });
  const rugLine = std({ color: 0xb2a58e, roughness: 1 });
  const rugField2 = std({ color: 0xd5cdbb, roughness: 1 });
  const rugDin  = std({ color: 0xd9cfba, roughness: 1 });
  const rugDinE = std({ color: 0xb8a98c, roughness: 1 });
  const curtainM = std({ color: 0xe4ddcf, roughness: 0.98 });
  const curtainM2 = std({ color: 0xd9d1c0, roughness: 0.98 });
  const sheer   = std({ color: 0xf5f2ea, roughness: 0.9, transparent: true, opacity: 0.34, side: THREE.DoubleSide });
  const railM   = std({ color: 0xf2f0ea, roughness: 0.6 });
  const ceramic = std({ color: 0xf1eee8, roughness: 0.35 });
  const ceramicBg = std({ color: 0xcbbfa9, roughness: 0.5 });
  const ceramicDk = std({ color: 0x4a443d, roughness: 0.5 });
  const ceramicTerra = std({ color: 0xb98a6c, roughness: 0.6 });
  const paperW  = std({ color: 0xf7f4ee, roughness: 0.9 });
  const bookBlk = std({ color: 0x25231f, roughness: 0.7 });
  const bookGray = std({ color: 0x5b5a56, roughness: 0.7 });
  const book1   = std({ color: 0x8c9db0, roughness: 0.8 });
  const book2   = std({ color: 0xc6b08e, roughness: 0.8 });
  const book3   = std({ color: 0xe8e2d4, roughness: 0.8 });
  const book4   = std({ color: 0xa88f73, roughness: 0.8 });
  const frameG  = dourado;
  const frameW  = std({ color: 0xe9e2d3, roughness: 0.55 });
  const potM    = std({ color: 0xd8cfbf, roughness: 0.7 });
  const potDk   = std({ color: 0x3a3733, roughness: 0.6 });
  const soil    = std({ color: 0x3d2b1c, roughness: 1 });
  const leafA   = std({ color: 0x4a6b3c, roughness: 0.8 });
  const leafB   = std({ color: 0x5b7c46, roughness: 0.8 });
  const stemM   = std({ color: 0x6a5a3c, roughness: 0.9 });
  const dryM    = std({ color: 0xcdb98f, roughness: 0.95 });
  const orchidW = std({ color: 0xf6f3ee, roughness: 0.6 });
  const orchidC = std({ color: 0xd9b6c4, roughness: 0.6 });
  const plateM  = std({ color: 0xf3f0ea, roughness: 0.3 });
  const plateGr = std({ color: 0xc9c6bb, roughness: 0.35 });
  const glassM  = std({ color: 0xdfeee8, roughness: 0.05, transparent: true, opacity: 0.45 });
  const matCoir = std({ color: 0x8c7658, roughness: 1 });
  const matCoirE = std({ color: 0x4d4033, roughness: 1 });
  const shadeLamp = std({ color: 0xece5d6, roughness: 0.9, side: THREE.DoubleSide });
  // lâmpadas / cúpulas ligadas às entidades de luz (sem a API, ficam como materiais comuns)
  const bindE = (key, mat, max, o) => (ctx.bindEmissive ? ctx.bindEmissive(key, mat, max, o) : mat);
  const bulbSala = bindE('luz_sala', new THREE.MeshStandardMaterial({ color: 0xfff1d6, roughness: 0.4, emissive: 0xffd9a0, emissiveIntensity: 0 }), 1.4, { min: 0 });
  const domeInSala = bindE('luz_sala', new THREE.MeshStandardMaterial({ color: 0xf1dfb8, roughness: 0.5, emissive: 0xffc980, emissiveIntensity: 0, side: THREE.BackSide }), 0.7, { min: 0 });
  const lampShadeHall = bindE('luz_hall_entrada', new THREE.MeshStandardMaterial({ color: 0xece5d6, roughness: 0.9, emissive: 0xffd9a8, emissiveIntensity: 0, side: THREE.DoubleSide }), 0.8, { min: 0 });

  // ---- geometrias auxiliares ---------------------------------------------------------------------
  const geoCache = new Map();
  const rrPath = (p, x0, y0, x1, y1, r) => {
    p.moveTo(x0 + r, y0); p.lineTo(x1 - r, y0); p.quadraticCurveTo(x1, y0, x1, y0 + r);
    p.lineTo(x1, y1 - r); p.quadraticCurveTo(x1, y1, x1 - r, y1);
    p.lineTo(x0 + r, y1); p.quadraticCurveTo(x0, y1, x0, y1 - r);
    p.lineTo(x0, y0 + r); p.quadraticCurveTo(x0, y0, x0 + r, y0);
  };
  const mesh = (geo, mat, x, y, z, cast) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast !== false; m.receiveShadow = true; return m; };
  // porta com abertura de cantos arredondados + tela de palhinha atrás. Frente em zf (para +z local), espessura t.
  const doorRR = (g, fmat, pmat, x0, x1, y0, y1, zf, t, inset, insetV, r) => {
    const w = x1 - x0, h = y1 - y0, iw = w - 2 * inset, ih = h - 2 * (insetV == null ? inset : insetV);
    const key = ['d', w, h, iw, ih, r, t].map((v) => (typeof v === 'number' ? v.toFixed(4) : v)).join(',');
    let geo = geoCache.get(key);
    if (!geo) {
      const s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.closePath();
      const hp = new THREE.Path(); rrPath(hp, -iw / 2, -ih / 2, iw / 2, ih / 2, r); s.holes.push(hp);
      geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 4 });
      geo.translate(0, 0, -t); geoCache.set(key, geo);
    }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    g.add(mesh(geo, fmat, cx, cy, zf, true));
    const pk = ['p', iw + 0.004, ih + 0.004, r].map((v) => (typeof v === 'number' ? v.toFixed(4) : v)).join(',');
    let pg = geoCache.get(pk);
    if (!pg) {
      const s = new THREE.Shape(); rrPath(s, -(iw + 0.004) / 2, -(ih + 0.004) / 2, (iw + 0.004) / 2, (ih + 0.004) / 2, r);
      pg = new THREE.ShapeGeometry(s, 4); geoCache.set(pk, pg);
    }
    g.add(mesh(pg, pmat, cx, cy, zf - t + 0.005, false));
  };
  // almofada/estofado arredondado (extrusão com chanfro): w × h × d centrada em (x, y, z)
  const cush = (g, mat, w, h, d, x, y, z, rad = 0.03, rx = 0, ry = 0, rz = 0) => {
    const b = Math.min(rad, w / 2.5, h / 2.5, d / 2.5);
    const key = ['c', w, h, d, rad].map((v) => (typeof v === 'number' ? v.toFixed(4) : v)).join(',');
    let geo = geoCache.get(key);
    if (!geo) {
      const s = new THREE.Shape(); rrPath(s, -(w - 2 * b) / 2, -(h - 2 * b) / 2, (w - 2 * b) / 2, (h - 2 * b) / 2, Math.max(0.004, b * 0.6));
      geo = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.002, d - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 4 });
      geo.translate(0, 0, -(d - 2 * b) / 2); geoCache.set(key, geo);
    }
    const m = mesh(geo, mat, x, y, z, true); m.rotation.set(rx, ry, rz); g.add(m); return m;
  };

  // ---- quadros (arte abstrata em greige/azul-acinzentado/terracota suave) ---------------------------
  const artTex = (kind) => ctx.makeTex ? ctx.makeTex(256, (g, s) => {
    g.fillStyle = kind === 0 ? '#e9e1d2' : kind === 1 ? '#ddd6c8' : '#e6dfd0'; g.fillRect(0, 0, s, s);
    if (kind === 0) {
      const cols = ['#c9b79b', '#a9b4bf', '#d9c9ae', '#b7a285'];
      for (let i = 0; i < 4; i++) { g.fillStyle = cols[i]; g.beginPath(); g.arc(s * (0.28 + i * 0.15), s * 0.62, s * (0.32 - i * 0.045), PI, 0); g.lineTo(s * (0.6 + i * 0.15 - 0.05 * i), s * 0.9); g.lineTo(s * (-0.04 + i * 0.15), s * 0.9); g.fill(); }
    } else if (kind === 1) {
      const cols = ['#b9c3cc', '#cdbfa6', '#a99a82', '#dcd3c0'];
      for (let i = 0; i < 4; i++) { g.fillStyle = cols[i]; g.fillRect(0, s * (0.12 + i * 0.2), s, s * (0.14 + 0.02 * i)); }
      g.fillStyle = '#c4a584'; g.beginPath(); g.arc(s * 0.68, s * 0.34, s * 0.12, 0, PI * 2); g.fill();
    } else {
      const cols = ['#bfa58a', '#9fb0bf', '#d4c2a6'];
      for (let i = 0; i < 3; i++) { g.fillStyle = cols[i]; g.beginPath(); g.ellipse(s * (0.3 + 0.2 * i), s * (0.5 + 0.1 * Math.sin(i * 2)), s * 0.22, s * 0.3, i * 0.6, 0, PI * 2); g.fill(); }
    }
  }) : null;
  const art0 = artTex(0), art1 = artTex(1), art2 = artTex(2);
  const artMat = (t) => t ? std({ map: t, roughness: 0.9 }) : std({ color: 0xcfc4ae, roughness: 0.9 });
  const picture = (x, y, z, ry, w, h, tex, frame) => {
    const g = G();
    g.add(box(w, h, 0.03, frame, 0, h / 2, 0.015, nc));
    g.add(box(w - 0.05, h - 0.05, 0.012, paperW, 0, h / 2, 0.034, nc));
    g.add(box(w - 0.13, h - 0.13, 0.008, artMat(tex), 0, h / 2, 0.04, nc));
    place(g, x, z, ry, y); return g;
  };

  // ---- planta de folhas largas -----------------------------------------------------------------
  const plantAt = (g, x, y, z, s = 1, pot = potM) => {
    g.add(cyl(0.12 * s, 0.09 * s, 0.24 * s, pot, x, y + 0.12 * s, z, 14));
    g.add(cyl(0.105 * s, 0.105 * s, 0.01, soil, x, y + 0.245 * s, z, 12));
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1, bx = x + Math.cos(a) * 0.02 * s, bz = z + Math.sin(a) * 0.02 * s;
      const st = cyl(0.008 * s, 0.01 * s, 0.7 * s, stemM, bx, y + 0.58 * s, bz, 6); st.rotation.z = Math.cos(a) * 0.08; st.rotation.x = Math.sin(a) * 0.08; g.add(st);
    }
    for (let i = 0; i < 11; i++) {
      const a = i * 2.4 + rnd() * 0.5, h = (0.5 + (i % 5) * 0.12 + rnd() * 0.06) * s, r = (0.1 + (i % 3) * 0.04) * s;
      const m = sph(1, i % 2 ? leafA : leafB, x + Math.cos(a) * r, y + 0.25 * s + h, z + Math.sin(a) * r);
      m.scale.set(0.1 * s, 0.025 * s, 0.17 * s); m.rotation.set(0.6, -a, Math.cos(a) * 0.5); m.castShadow = false; g.add(m);
    }
  };
  // vasinho com folhagem/ramos secos, dentro de um grupo
  const vaseDry = (g, x, y, z, s = 1, mat = ceramicBg) => {
    g.add(cyl(0.045 * s, 0.062 * s, 0.24 * s, mat, x, y + 0.12 * s, z, 16));
    for (let i = 0; i < 7; i++) {
      const b = cyl(0.004, 0.005, (0.45 + (i % 3) * 0.1) * s, dryM, x + (i - 3) * 0.011, y + 0.45 * s, z + (i % 2 - 0.5) * 0.02, 5);
      b.rotation.z = (i - 3) * 0.1; b.rotation.x = (i % 3 - 1) * 0.08; b.castShadow = false; g.add(b);
      const f = sph(1, dryM, x + (i - 3) * 0.04, y + (0.68 + (i % 3) * 0.05) * s, z); f.scale.set(0.012, 0.04, 0.012); f.rotation.z = (i - 3) * 0.1; f.castShadow = false; g.add(f);
    }
  };
  const books = (g, x, y, z, list, along = 'x') => {      // pilha horizontal; list = [[w, h, d, mat], ...]
    let yy = y;
    list.forEach(([bw, bh, bd, bm], i) => {
      const o = (i % 2 ? 0.012 : -0.01);
      g.add(along === 'x' ? box(bw, bh, bd, bm, x + o, yy + bh / 2, z + (i % 3 - 1) * 0.004, nc) : box(bd, bh, bw, bm, x + (i % 3 - 1) * 0.004, yy + bh / 2, z + o, nc));
      yy += bh;
    });
    return yy;
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
  // PAINEL C — parede norte (z 4,34), face sul. Grupo local: x = mundo, z = 0 no plano das portas (mundo 4,74);
  // o corpo vai de z −0,40 (parede) a −0,018; as tábuas do painel ficam de −0,40 a −0,35.
  // ===========================================================================================
  {
    const g = G(); place(g, 0, 4.74, 0, 0);
    const XL = 1.29, XR = 5.59, XC = 3.43, TOP = 2.50;
    // lateral esquerda (20) em toda a altura + rodapé
    L(g, carvalho, 1.09, XL - 0.01, 0.10, TOP, -0.40, -0.35);
    L(g, carvDk, 1.10, XL - 0.01, 0, 0.10, -0.37, -0.33, nc);
    // painel ripado: tábuas de 40/20/29/14/34/19/24/28 com juntas de 1 cm; vão da TV 1,38 × 0,82 (x 1,71–3,09 · y 0,98–1,80)
    {
      const widths = [0.40, 0.20, 0.29, 0.14, 0.34, 0.19, 0.24, 0.28];
      const H0 = 1.71, H1 = 3.09, TY0 = 0.98, TY1 = 1.80, YB = 0.70;
      let x = XL;
      widths.forEach((bw, i) => {
        const a = x + 0.0, b = Math.min(x + bw, XC - 0.002); x = x + bw + 0.01;
        const mat = i % 2 ? carvalho : carvalho;
        if (b <= H0 || a >= H1) L(g, mat, a, b, YB, TOP, -0.40, -0.35);
        else {
          L(g, mat, a, b, YB, TY0, -0.40, -0.35); L(g, mat, a, b, TY1, TOP, -0.40, -0.35);
          if (a < H0 - 0.003) L(g, mat, a, H0, TY0, TY1, -0.40, -0.35);
          if (b > H1 + 0.003) L(g, mat, H1, b, TY0, TY1, -0.40, -0.35);
        }
      });
      // fundo escuro das juntas (sombra entre as tábuas) — plano fino no fundo da parede
      L(g, carvDk, XL, XC, YB, TOP, -0.40, -0.399, nc);
    }
    // ---- balcão inferior 60 (rodapé 10 + 60) — prof. 40, x 1,29–5,59, 8 portas de 54 ----
    L(g, carvDk, XL + 0.01, XR - 0.01, 0, 0.10, -0.37, -0.03, nc);                       // rodapé recuado 3 cm
    L(g, carvDk, XL, XR, 0.10, 0.68, -0.40, -0.018);                                     // corpo
    L(g, carvalho, XL - 0.003, XR, 0.68, 0.70, -0.40, 0.004);                            // tampo (exposto à esquerda da cristaleira)
    const dw = (XR - XL) / 8;
    for (let i = 0; i < 8; i++) {
      const x0 = XL + i * dw + 0.0015, x1 = XL + (i + 1) * dw - 0.0015;
      doorRR(g, carvalho, palhinha, x0, x1, 0.1025, i < 4 ? 0.678 : 0.698, 0, 0.018, 0.05, 0.055, 0.035);
    }
    // botões dourados (push-touch) nas juntas 1|2, 3|4, 5|6 e 7|8
    for (const j of [1, 3, 5, 7]) for (const s of [-1, 1]) {
      const k = cyl(0.008, 0.008, 0.008, dourado, XL + j * dw + s * 0.04, j < 4 ? 0.664 : 0.684, 0.004, 14); k.rotation.x = PI / 2; g.add(k);
    }
    // ---- cristaleira 215 — x 3,43–5,59, y 0,70–2,50 ----
    {
      const yBase = 0.70, yTop = 2.50;
      L(g, carvalho, XC, XC + 0.02, yBase, yTop, -0.40, -0.018);                         // laterais e divisória central
      L(g, carvalho, XR - 0.02, XR, yBase, yTop, -0.40, -0.018);
      L(g, carvalho, 4.50, 4.52, yBase, yTop, -0.40, -0.018);
      L(g, carvalho, XC, XR, 2.45, yTop, -0.40, 0.004);                                   // tampo (5)
      L(g, carvalho, XC, XR, yBase, yBase + 0.02, -0.40, -0.018);                         // base do vão
      L(g, carvInt, XC + 0.02, XR - 0.02, yBase + 0.02, 2.45, -0.40, -0.385, nc);         // fundo
      for (const ys of [2.07, 1.77, 1.47, 1.17]) L(g, glassShelf, XC + 0.02, XR - 0.02, ys - 0.012, ys, -0.385, -0.03, nc);   // prateleiras de vidro 38/28/28/28/45
      const cw = (XR - XC) / 4;
      for (let i = 0; i < 4; i++) doorRR(g, carvalho, palhinha, XC + i * cw + 0.0015, XC + (i + 1) * cw - 0.0015, 0.7025, 2.4475, 0, 0.018, 0.05, 0.05, 0.04);
      // puxadores verticais dourados (pares nas juntas 1|2 e 3|4)
      for (const j of [1, 3]) for (const s of [-1, 1]) {
        L(g, dourado, XC + j * cw + s * 0.017 - 0.007, XC + j * cw + s * 0.017 + 0.007, 1.13, 1.49, 0.0, 0.024, nc);
      }
      // louça nas prateleiras (vista através da palhinha)
      const stackPlates = (x, y, z, n, r, mat) => { for (let k = 0; k < n; k++) g.add(cyl(r, r * 0.93, 0.012, mat, x, y + 0.006 + k * 0.013, z, 18, false)).castShadow = false; };
      const glassS = (x, y, z) => { g.add(cyl(0.032, 0.026, 0.07, glassM, x, y + 0.085, z, 12, true)); g.add(cyl(0.004, 0.004, 0.05, glassM, x, y + 0.025, z, 6)); g.add(cyl(0.025, 0.025, 0.004, glassM, x, y + 0.002, z, 12)); };
      const cup = (x, y, z, mat) => { g.add(cyl(0.033, 0.026, 0.05, mat, x, y + 0.025, z, 12)); };
      // prateleira 1 (y 2,07): vasos e travessas altas
      stackPlates(3.62, 2.07, -0.2, 6, 0.105, plateM); stackPlates(3.84, 2.07, -0.2, 4, 0.085, plateGr);
      g.add(cyl(0.07, 0.09, 0.2, ceramicBg, 4.15, 2.17, -0.2, 16)); g.add(cyl(0.05, 0.05, 0.14, ceramic, 4.32, 2.14, -0.2, 14));
      stackPlates(4.75, 2.07, -0.2, 5, 0.1, plateM); g.add(cyl(0.08, 0.06, 0.16, ceramicTerra, 5.0, 2.15, -0.2, 16)); stackPlates(5.3, 2.07, -0.2, 6, 0.11, plateGr);
      // prateleira 2 (y 1,77): taças
      for (let k = 0; k < 6; k++) glassS(3.58 + k * 0.1, 1.77, -0.23 + (k % 2) * 0.05);
      for (let k = 0; k < 5; k++) cup(4.58 + k * 0.095, 1.77, -0.2, k % 2 ? plateM : ceramicBg);
      g.add(cyl(0.12, 0.07, 0.07, ceramic, 5.2, 1.805, -0.2, 20));
      // prateleira 3 (y 1,47): xícaras e bowls
      for (let k = 0; k < 6; k++) cup(3.6 + k * 0.09, 1.47, -0.22 + (k % 2) * 0.08, k % 3 ? plateM : ceramicBg);
      g.add(cyl(0.11, 0.065, 0.075, ceramicBg, 4.3, 1.5075, -0.2, 20)); g.add(cyl(0.11, 0.065, 0.075, ceramicBg, 4.3, 1.5825, -0.2, 20));
      stackPlates(4.75, 1.47, -0.2, 7, 0.1, plateGr); stackPlates(5.05, 1.47, -0.2, 7, 0.09, plateM);
      glassS(5.32, 1.47, -0.14); glassS(5.43, 1.47, -0.14); glassS(5.32, 1.47, -0.26); glassS(5.43, 1.47, -0.26);
      // prateleira 4 (y 1,17): terrina, jarra, livros de receita
      g.add(cyl(0.11, 0.1, 0.1, plateM, 3.75, 1.22, -0.2, 20)); g.add(cyl(0.09, 0.09, 0.03, plateM, 3.75, 1.285, -0.2, 20));
      g.add(cyl(0.05, 0.06, 0.22, glassM, 4.0, 1.28, -0.2, 14));
      books(g, 4.78, 1.17, -0.2, [[0.24, 0.035, 0.18, book4], [0.22, 0.03, 0.17, book3], [0.23, 0.028, 0.17, book1]]);
      g.add(cyl(0.07, 0.07, 0.17, ceramicTerra, 5.2, 1.255, -0.2, 14)); cup(5.38, 1.17, -0.2, plateM);
      // base (vão 45 sobre o balcão): cestos e jarras
      stackPlates(3.7, 0.72, -0.2, 8, 0.12, plateM); stackPlates(3.9, 0.72, -0.2, 8, 0.1, plateGr);
      g.add(cyl(0.1, 0.12, 0.28, ceramicBg, 4.2, 0.86, -0.2, 18)); g.add(cyl(0.09, 0.11, 0.22, ceramic, 4.75, 0.83, -0.2, 18));
      g.add(box(0.3, 0.2, 0.26, matCoir, 5.1, 0.82, -0.2, nc)); g.add(cyl(0.1, 0.1, 0.16, ceramicDk, 5.42, 0.8, -0.2, 18));
    }
    // objetos sobre o balcão (y 0,70), à esquerda da cristaleira: orquídea, livros, vasos (fora do vão da TV acima de 0,28)
    {
      const y = 0.70;
      // orquídea num vaso cinza
      g.add(cyl(0.06, 0.05, 0.12, ceramic, 1.50, y + 0.06, -0.20, 16)); g.add(cyl(0.055, 0.055, 0.01, soil, 1.50, y + 0.12, -0.20, 12));
      for (let k = 0; k < 5; k++) { const l = sph(1, leafA, 1.50 + Math.cos(k * 1.25) * 0.07, y + 0.16, -0.20 + Math.sin(k * 1.25) * 0.07); l.scale.set(0.09, 0.012, 0.035); l.rotation.y = -k * 1.25; l.castShadow = false; g.add(l); }
      for (const [dx, dh, nf] of [[0.0, 0.46, 6], [0.07, 0.38, 4]]) {
        const st = cyl(0.004, 0.004, dh, stemM, 1.5 + dx * 0.4, y + 0.12 + dh / 2, -0.2, 5); st.rotation.z = -0.28 - dx; g.add(st);
        for (let f = 0; f < nf; f++) {
          const t = (f + 1) / (nf + 1), fx = 1.5 + dx * 0.4 - Math.sin(0.28 + dx) * dh * t * 0.9, fy = y + 0.12 + dh * t * 0.97;
          const fl = sph(1, f % 3 === 0 ? orchidC : orchidW, fx, fy + 0.02 * ((f % 2) ? 1 : -1), -0.2 + (f % 2 ? 0.035 : -0.03)); fl.scale.set(0.03, 0.026, 0.01); fl.rotation.y = f * 0.7; fl.castShadow = false; g.add(fl);
        }
      }
      // pilha de livros + esfera
      books(g, 1.98, y, -0.20, [[0.28, 0.04, 0.2, book1], [0.25, 0.032, 0.19, bookBlk], [0.23, 0.028, 0.18, book2], [0.2, 0.025, 0.16, book3]]);
      g.add(sph(0.045, dourado, 2.0, y + 0.153, -0.2));
      // trio de vasos de cerâmica
      g.add(cyl(0.05, 0.06, 0.2, ceramicBg, 3.05, y + 0.1, -0.2, 16)); g.add(cyl(0.035, 0.045, 0.14, ceramicTerra, 3.14, y + 0.07, -0.16, 14)); vaseDry(g, 3.0, y + 0.2, -0.2, 0.6, ceramicBg);
      // quadro apoiado na tábua (x 3,15–3,40; fora do vão da TV)
      const pr = G(); pr.add(box(0.26, 0.34, 0.02, frameW, 0, 0.17, 0, nc)); pr.add(box(0.2, 0.28, 0.006, artMat(art1), 0, 0.17, 0.012, nc));
      pr.position.set(3.27, y, -0.33); pr.rotation.x = -0.12; g.add(pr);
    }
    solid(1.09, 4.34, 5.59, 4.74);
  }

  // ===========================================================================================
  // ESTANTE D — x 6,45–6,65 · z 4,26–6,53 (228 × 20 × 250), Carvalho Natural, frente para −x.
  // Grupo local: x local = z mundo − 4,26; z local 0 = plano das portas (mundo x 6,45), corpo para −z local (→ x 6,65).
  // ===========================================================================================
  {
    const g = G(); place(g, 6.45, 4.26, -PI / 2, 0);
    const WE = 2.27, D = 0.20;
    L(g, carvDk, 0.02, WE - 0.02, 0, 0.10, -0.19, -0.03, nc);                            // rodapé recuado 3 cm
    L(g, carvDk, 0, WE, 0.10, 0.90, -D, -0.018);                                         // corpo da base
    const dw = WE / 5;
    for (let i = 0; i < 5; i++) {                                                         // 5 portas lisas de 46
      L(g, carvalho, i * dw + 0.0015, (i + 1) * dw - 0.0015, 0.1025, 0.8975, -0.018, 0);
      const hk = (i % 2) ? 0.02 : dw - 0.02;                                              // sulco/pegador discreto (rebaixo) no alto da porta
      L(g, carvDk, i * dw + dw * 0.25, i * dw + dw * 0.75, 0.884, 0.8905, -0.003, 0.0005, nc);
    }
    // parte alta: tampo da base, prateleiras, divisórias, fundo
    L(g, carvInt, 0.02, WE - 0.02, 0.92, 2.48, -D, -D + 0.012, nc);                      // fundo
    L(g, carvalho, 0, WE, 0.90, 0.92, -D, 0);                                            // tampo da base
    L(g, carvalho, 0, WE, 1.70, 1.72, -D, -0.002);                                       // prateleira (78|43)
    L(g, carvalho, 0, 1.14, 2.15, 2.17, -D, -0.002);                                     // prateleira (43|31) — interrompida onde fica o split
    L(g, carvalho, 0, WE, 2.48, 2.50, -D, 0);                                            // topo
    L(g, carvalho, 0, 0.02, 0.92, 2.48, -D, 0); L(g, carvalho, WE - 0.02, WE, 0.92, 2.48, -D, 0);   // laterais
    L(g, carvalho, 1.02, 1.04, 0.92, 1.70, -D, -0.002);                                  // 100 | 122
    L(g, carvalho, 0.35, 0.37, 1.72, 2.15, -D, -0.002);                                  // 33 | 163
    // objetos nos nichos (altura local = mundo)
    {
      // nicho baixo esquerdo (x 0,02–1,02 · y 0,92–1,70): livros pretos em pé + vaso + pilha
      let bx = 0.07;
      for (let k = 0; k < 7; k++) { const bh = 0.27 + (k % 3) * 0.02, bw = 0.035 + (k % 2) * 0.008; g.add(box(bw, bh, 0.15, k % 3 === 1 ? bookGray : bookBlk, bx + bw / 2, 0.92 + bh / 2, -0.11, nc)); bx += bw + 0.002; }
      g.add(box(0.005, 0.27, 0.15, bookBlk, bx + 0.02, 1.06, -0.11, nc));
      books(g, 0.62, 0.92, -0.10, [[0.25, 0.035, 0.17, book3], [0.23, 0.03, 0.16, book4], [0.21, 0.028, 0.15, bookBlk]]);
      g.add(sph(0.05, dourado, 0.62, 1.07, -0.10));
      g.add(cyl(0.045, 0.06, 0.26, ceramicBg, 0.9, 1.05, -0.11, 16)); vaseDry(g, 0.9, 1.18, -0.11, 0.55, ceramicBg);
      // nicho baixo direito (x 1,04–2,25): pilha de livros, caixa de som, escultura, cesto
      books(g, 1.40, 0.92, -0.10, [[0.30, 0.04, 0.2, bookBlk], [0.27, 0.035, 0.19, book1], [0.24, 0.03, 0.18, book2], [0.22, 0.03, 0.17, bookGray]]);
      g.add(box(0.2, 0.13, 0.14, ceramicDk, 1.72, 0.985, -0.11, nc)); { const sp = cyl(0.035, 0.035, 0.005, bookGray, 1.72, 0.987, -0.04, 14); sp.rotation.x = PI / 2; g.add(sp); }
      g.add(sph(0.055, ceramic, 1.98, 1.1, -0.1)); g.add(cyl(0.025, 0.045, 0.1, ceramicTerra, 1.98, 0.97, -0.1, 14));
      g.add(box(0.2, 0.24, 0.16, matCoir, 2.12, 1.04, -0.11, nc));
      // nicho médio esquerdo (33): planta de folhas
      g.add(cyl(0.065, 0.05, 0.1, potM, 0.185, 1.77, -0.1, 14));
      for (let k = 0; k < 9; k++) { const a = k * 2.4; const l = sph(1, k % 2 ? leafA : leafB, 0.185 + Math.cos(a) * 0.05, 1.93 + (k % 4) * 0.045, -0.1 + Math.sin(a) * 0.05); l.scale.set(0.05, 0.02, 0.085); l.rotation.set(0.5, -a, Math.cos(a) * 0.6); l.castShadow = false; g.add(l); }
      // nicho médio largo (163, aberto até o split): livros deitados e quadrinho encostado
      books(g, 0.62, 1.72, -0.10, [[0.3, 0.045, 0.2, book4], [0.27, 0.04, 0.19, bookBlk], [0.25, 0.03, 0.18, book3]]);
      g.add(cyl(0.04, 0.05, 0.11, ceramicTerra, 0.95, 1.775, -0.1, 14));
      const pr = G(); pr.add(box(0.2, 0.26, 0.015, frameW, 0, 0.13, 0, nc)); pr.add(box(0.15, 0.21, 0.006, artMat(art0), 0, 0.13, 0.009, nc));
      pr.position.set(0.3, 1.72, -0.06); pr.rotation.x = -0.16; g.add(pr);
      // nicho alto esquerdo (154): bandeja, tigelas e vaso
      g.add(box(0.36, 0.012, 0.15, dourado, 0.4, 2.176, -0.11, nc)); g.add(cyl(0.07, 0.04, 0.05, ceramic, 0.3, 2.215, -0.11, 18)); g.add(cyl(0.05, 0.03, 0.04, ceramicBg, 0.5, 2.21, -0.11, 18));
      g.add(cyl(0.05, 0.065, 0.22, ceramicBg, 1.05, 2.28, -0.1, 16)); vaseDry(g, 1.05, 2.39, -0.1, 0.4, ceramicBg);
    }
    solid(6.45, 4.26, 6.66, 6.53);
  }

  // ===========================================================================================
  // BUFFET B — móvel solto 219 × 40 × 85 (x 1,22–3,41 · z 6,76–7,16), Gianduia, frente para +z
  // Grupo local: x local = mundo − 1,22; z local 0 = plano das portas (mundo z 7,16), corpo para −z.
  // ===========================================================================================
  {
    const g = G(); place(g, 1.22, 7.16, 0, 0);
    const BW = 2.19, BD = 0.40;
    for (const [lx, lz] of [[0.09, -0.07], [BW - 0.09, -0.07], [0.09, -BD + 0.07], [BW - 0.09, -BD + 0.07]]) {   // pés dourados de 10 cm, levemente cônicos
      g.add(cyl(0.012, 0.007, 0.10, dourado, lx, 0.05, lz, 8));
    }
    L(g, gianDk, 0.01, BW - 0.01, 0.10, 0.12, -BD + 0.01, -0.01);                         // fundo do móvel
    L(g, gianduia, 0, 0.02, 0.10, 0.83, -BD, -0.018); L(g, gianduia, BW - 0.02, BW, 0.10, 0.83, -BD, -0.018);
    for (let i = 1; i < 5; i++) L(g, gianduia, i * 0.44 - 0.01 - 0.002, i * 0.44 + 0.01, 0.12, 0.83, -BD, -0.018);  // divisórias
    L(g, gianDk, 0.02, BW - 0.02, 0.12, 0.83, -BD, -BD + 0.012, nc);                      // fundo
    L(g, gianduia, 0, BW, 0.10, 0.12, -BD, -0.018);                                       // fundo do móvel (base)
    L(g, gianduia, 0, BW, 0.465, 0.485, -BD, -0.03);                                      // prateleira (37|37)
    L(g, gianduia, -0.004, BW + 0.004, 0.83, 0.85, -BD - 0.004, 0.004);                   // tampo
    for (let i = 0; i < 5; i++) doorRR(g, gianduia, palhinha, i * 0.44 + 0.002, (i + 1) * 0.44 - 0.002, 0.1225, 0.8275, 0, 0.018, 0.05, 0.075, 0.035);
    // objetos sobre o buffet (y 0,85) — um pouco acima do encosto do sofá
    {
      const y = 0.85;
      // abajur de cerâmica com cúpula de linho
      g.add(cyl(0.065, 0.085, 0.24, ceramicBg, 0.30, y + 0.12, -0.2, 18)); g.add(sph(0.075, ceramicBg, 0.30, y + 0.27, -0.2));
      g.add(cyl(0.01, 0.01, 0.12, dourado, 0.30, y + 0.38, -0.2, 8));
      g.add(cyl(0.12, 0.17, 0.22, shadeLamp, 0.30, y + 0.47, -0.2, 22, true)).castShadow = false;
      // pilha de livros com bola dourada + vaso de ramos secos
      books(g, 0.88, y, -0.2, [[0.30, 0.045, 0.21, book3], [0.27, 0.04, 0.2, book1], [0.24, 0.032, 0.19, book4]]); g.add(sph(0.045, dourado, 0.88, y + 0.162, -0.2));
      g.add(cyl(0.07, 0.09, 0.34, ceramicDk, 1.30, y + 0.17, -0.2, 18)); vaseDry(g, 1.30, y + 0.34, -0.2, 0.75, ceramicDk);
      // bandeja dourada com garrafa e copos
      g.add(cyl(0.14, 0.14, 0.012, dourado, 1.80, y + 0.006, -0.2, 28)); g.add(cyl(0.032, 0.038, 0.24, glassM, 1.76, y + 0.132, -0.2, 14));
      g.add(cyl(0.028, 0.022, 0.07, glassM, 1.88, y + 0.047, -0.15, 12)); g.add(cyl(0.028, 0.022, 0.07, glassM, 1.88, y + 0.047, -0.25, 12));
      // escultura pequena
      g.add(sph(0.06, ceramic, 2.07, y + 0.07, -0.2)); g.add(cyl(0.04, 0.05, 0.03, ceramicDk, 2.07, y + 0.015, -0.2, 14));
    }
  }

  // ===========================================================================================
  // SOFÁ 3 LUGARES — 2,16 × 0,81, centro (2,30; 6,34), encosto no buffet (z maior), virado para a TV (−z)
  // ===========================================================================================
  {
    const g = G(); place(g, 2.30, 6.335, PI, 0);              // frente (+z local) → −z mundo
    const SW = 2.16, SD = 0.81, hz = SD / 2;
    for (const [lx, lz] of [[-1.0, -0.33], [1.0, -0.33], [-1.0, 0.33], [1.0, 0.33]]) g.add(cyl(0.022, 0.016, 0.08, dourado, lx, 0.04, lz, 10));
    cush(g, sofaDk, SW, 0.15, SD, 0, 0.155, 0, 0.02);                                     // base (plinto) y 0,08–0,23
    cush(g, sofaM, SW, 0.62, 0.20, 0, 0.55, -hz + 0.10, 0.05);                            // encosto (y 0,24–0,86)
    for (const sx of [-1, 1]) cush(g, sofaM, 0.17, 0.42, SD, sx * (SW / 2 - 0.085), 0.43, 0, 0.05);   // braços (até y 0,64)
    const iw = SW - 0.34, cw = iw / 3;
    for (let i = 0; i < 3; i++) {
      const cx = -iw / 2 + cw * (i + 0.5);
      cush(g, sofaLt, cw - 0.012, 0.17, 0.58, cx, 0.325, hz - 0.31, 0.05);                // assento (topo y 0,42)
      cush(g, sofaLt, cw - 0.012, 0.44, 0.17, cx, 0.65, -hz + 0.30, 0.06, -0.2);          // encosto solto, inclinado
    }
    // almofadas e manta
    cush(g, pillowSand, 0.42, 0.42, 0.13, -0.78, 0.62, -0.02, 0.05, -0.26, 0.28, 0.06);
    cush(g, pillowTerra, 0.36, 0.36, 0.12, -0.55, 0.58, 0.0, 0.05, -0.28, -0.14, -0.04);
    cush(g, sofaDk, 0.5, 0.26, 0.12, 0.78, 0.55, 0.0, 0.05, -0.24, -0.3, 0.05);
    cush(g, pillowGray, 0.38, 0.38, 0.11, 0.6, 0.58, 0.04, 0.05, -0.28, 0.2, 0.0);
    g.add(box(0.20, 0.03, 0.55, throwM, SW / 2 - 0.085, 0.655, 0.1, nc)); g.add(box(0.03, 0.22, 0.55, throwM, SW / 2 - 0.0, 0.55, 0.1, nc)); g.add(box(0.03, 0.2, 0.55, throwM, SW / 2 - 0.175, 0.55, 0.1, nc));
    solid(1.22, 5.93, 3.38, 6.76);
  }
  solid(1.22, 6.76, 3.41, 7.16);

  // ---- tapetes: sala (sob o sofá e à frente) e jantar -----------------------------------------------
  W(rugEdge, 1.40, 3.30, 0.004, 0.012, 4.92, 6.38, nc);
  W(rugField, 1.47, 3.23, 0.0125, 0.0135, 4.99, 6.31, nc);
  W(rugLine, 1.51, 3.19, 0.0136, 0.0142, 5.03, 6.27, nc);
  W(rugField2, 1.54, 3.16, 0.0143, 0.0148, 5.06, 6.24, nc);
  W(rugDinE, 3.34, 5.99, 0.004, 0.010, 5.80, 7.62, nc);
  W(rugDin, 3.39, 5.94, 0.0105, 0.0112, 5.85, 7.57, nc);
  W(rugLine, 3.44, 5.89, 0.0113, 0.0118, 5.90, 7.52, nc);
  W(rugDin, 3.46, 5.87, 0.0119, 0.0124, 5.92, 7.50, nc);

  // ===========================================================================================
  // MESA DE JANTAR 2,39 × 0,91 (x 3,44–5,83 · z 6,25–7,16) + 8 CADEIRAS
  // ===========================================================================================
  {
    const g = G(); place(g, 4.635, 6.705, 0, 0);
    const TW = 2.39, TD = 0.91;
    g.add(box(TW, 0.04, TD, tableTop, 0, 0.73, 0));                                        // tampo (y 0,71–0,75)
    g.add(box(TW - 0.04, 0.012, TD - 0.04, tableLeg, 0, 0.704, 0, nc));
    g.add(box(TW - 0.30, 0.07, TD - 0.22, tableLeg, 0, 0.66, 0, nc));                       // travessa
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = cyl(0.04, 0.028, 0.64, tableLeg, sx * (TW / 2 - 0.16), 0.32, sz * (TD / 2 - 0.12), 4); leg.rotation.y = PI / 4; g.add(leg);
    }
    // centro de mesa: tábua longa com vasos e velas
    g.add(box(0.8, 0.02, 0.2, carvalho, 0, 0.76, 0, nc));
    g.add(cyl(0.05, 0.065, 0.2, ceramicBg, -0.25, 0.87, 0, 16)); vaseDry(g, -0.25, 0.97, 0, 0.55, ceramicBg);
    g.add(sph(0.065, ceramic, 0.05, 0.835, 0.02)); g.add(cyl(0.035, 0.045, 0.1, ceramicTerra, 0.28, 0.82, -0.02, 14));
    g.add(cyl(0.02, 0.02, 0.1, ceramic, 0.38, 0.82, 0.04, 10));
    solid(3.40, 6.02, 5.86, 7.42);
  }
  {
    // cadeira de madeira clara com braços e assento estofado (frente +z local, origem no centro do assento)
    const chair = () => {
      const g = G();
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        if (sz > 0) g.add(cyl(0.017, 0.012, 0.45, chairWood, sx * 0.205, 0.225, sz * 0.205, 8));
        else { const up = box(0.034, 0.82, 0.034, chairWood, sx * 0.205, 0.41, -0.215); up.rotation.x = -0.07; g.add(up); }
      }
      g.add(box(0.44, 0.04, 0.44, chairWood, 0, 0.395, 0, nc));                              // travessa do assento
      g.add(box(0.42, 0.055, 0.42, chairSeat, 0, 0.4425 + 0.0, 0.0));                         // assento estofado (topo y 0,47)
      g.add(box(0.41, 0.04, 0.02, chairWood, 0, 0.14, 0.205, nc)); g.add(box(0.02, 0.04, 0.41, chairWood, 0.205, 0.14, 0, nc)); g.add(box(0.02, 0.04, 0.41, chairWood, -0.205, 0.14, 0, nc));
      // encosto curvo: trilho superior em arco (5 segmentos) + 2 ripas
      for (let i = 0; i < 5; i++) {
        const a = (i - 2) * 0.32, cx = Math.sin(a) * 0.23, cz = -0.215 + (1 - Math.cos(a)) * 0.12;
        const seg = box(0.11, 0.07, 0.03, chairWood, cx, 0.78, cz); seg.rotation.y = -a; g.add(seg);
      }
      g.add(box(0.045, 0.2, 0.022, chairWood, -0.07, 0.61, -0.215, nc)); g.add(box(0.045, 0.2, 0.022, chairWood, 0.07, 0.61, -0.215, nc));
      g.add(box(0.36, 0.1, 0.03, chairSeat, 0, 0.6, -0.2, nc));                               // encosto estofado baixo
      for (const sx of [-1, 1]) {                                                              // braços
        g.add(box(0.03, 0.03, 0.4, chairWood, sx * 0.225, 0.64, -0.01, nc));
        g.add(box(0.026, 0.2, 0.026, chairWood, sx * 0.225, 0.54, 0.15, nc));
      }
      return g;
    };
    const cxs = [3.74, 4.33, 4.92, 5.52];
    for (const cx of cxs) {
      place(chair(), cx, 6.29, 0, 0);       // fileira norte, olhando para +z (a mesa)
      place(chair(), cx, 7.12, PI, 0);      // fileira sul, olhando para −z
    }
  }

  // ---- pendentes dourados sobre a mesa (3 × cúpula + cabo; a luz é do cartão) ------------------------
  {
    const dome = new THREE.LatheGeometry([[0.0, 0.0], [0.05, 0.002], [0.1, 0.022], [0.145, 0.07], [0.17, 0.125], [0.17, 0.135]].map(([r, y]) => new THREE.Vector2(r, y)), 28);
    const domeGold = std({ color: 0xc9a66b, roughness: 0.3, metalness: 0.85, side: THREE.DoubleSide });
    for (const px of [3.90, 4.60, 5.30]) {
      put(cyl(0.004, 0.004, 0.68, ceramicDk, px, 2.16, 6.70, 6));                          // cabo
      put(cyl(0.05, 0.05, 0.02, dourado, px, 2.49, 6.70, 14));                              // canopla no forro
      put(cyl(0.02, 0.02, 0.1, dourado, px, 1.87, 6.70, 10));                               // pescoço
      const sh = mesh(dome, domeGold, px, 1.825, 6.70, true); sh.rotation.x = PI; put(sh);   // boca para baixo (rebordo em y 1,69)
      const inner = mesh(dome, domeInSala, px, 1.825, 6.70, false); inner.rotation.x = PI; inner.scale.setScalar(0.985); put(inner);
      put(sph(0.04, bulbSala, px, 1.78, 6.70)).castShadow = false;
    }
  }

  // ---- cortina da porta de vidro da sala (x ≈ 1,10 · z 4,44–7,93): linho em pregas + voal + trilho ----
  {
    const yB = 0.02, yT = 2.46;
    W(railM, 1.093, 1.20, yT, 2.5, 4.40, 7.95, nc);                                       // trilho no forro
    W(sheer, 1.100, 1.106, yB, yT, 4.46, 7.92, nc);
    pleats(curtainM, 'z', 4.46, 5.28, 1.115, 0.06, yB, yT, 18);                            // folha recolhida junto ao painel
    pleats(curtainM, 'z', 7.00, 7.92, 1.115, 0.06, yB, yT, 20);                            // folha recolhida junto à cozinha
    W(curtainM2, 1.105, 1.185, yT - 0.04, yT + 0.002, 4.46, 5.28, nc); W(curtainM2, 1.105, 1.185, yT - 0.04, yT + 0.002, 7.00, 7.92, nc);   // cabeçote
  }

  // ===========================================================================================
  // HALL DE ENTRADA (x 6,76–8,44 · z 6,53–7,59)
  // ===========================================================================================
  {
    // aparador estreito (prof. 0,23) na parede norte, deixando o giro da porta de entrada livre
    const X0 = 6.96, X1 = 7.56, Z0 = 6.535, Z1 = 6.765;
    W(carvalho, X0, X1, 0.76, 0.80, Z0, Z1);                                               // tampo
    W(carvalho, X0 + 0.01, X1 - 0.01, 0.62, 0.76, Z0 + 0.01, Z1 - 0.03);                    // gaveta
    W(freijo, X0 + 0.014, X1 - 0.014, 0.625, 0.755, Z1 - 0.03, Z1 - 0.012);                 // frente
    W(dourado, (X0 + X1) / 2 - 0.07, (X0 + X1) / 2 + 0.07, 0.69, 0.702, Z1 - 0.008, Z1 - 0.002, nc);
    for (const lx of [X0 + 0.035, X1 - 0.035]) for (const lz of [Z0 + 0.025, Z1 - 0.025]) W(dourado, lx - 0.012, lx + 0.012, 0, 0.62, lz - 0.012, lz + 0.012, nc);   // pés
    W(carvalho, X0 + 0.02, X1 - 0.02, 0.18, 0.2, Z0 + 0.02, Z1 - 0.02, nc);                  // prateleira baixa
    // objetos: abajur, bandeja de chaves, vaso
    put(cyl(0.04, 0.055, 0.17, ceramicBg, 7.12, 0.885, 6.65, 16)); put(cyl(0.008, 0.008, 0.08, dourado, 7.12, 1.01, 6.65, 8));
    put(cyl(0.085, 0.12, 0.16, lampShadeHall, 7.12, 1.12, 6.65, 20, true)).castShadow = false;
    W(dourado, 7.27, 7.44, 0.80, 0.812, 6.58, 6.70, nc); put(sph(0.022, dourado, 7.33, 0.835, 6.64));
    put(cyl(0.035, 0.045, 0.1, ceramicTerra, 7.50, 0.85, 6.60, 14));
    put(sph(0.045, ceramic, 7.015, 0.845, 6.60));
    // prateleira inferior: cesto
    put(box(0.26, 0.14, 0.17, matCoir, 7.2, 0.27, 6.65, nc));
    solid(X0, Z0, X1, Z1);
    // espelho em arco (estádio) sobre o aparador
    {
      const mx = 7.26, mz = 6.53;
      const g = G(); place(g, mx, mz, FZ, 0);
      g.add(box(0.60, 0.80, 0.02, dourado, 0, 1.46, 0.01, nc));
      const ca = cyl(0.30, 0.30, 0.02, dourado, 0, 1.86, 0.01, 28); ca.rotation.x = PI / 2; ca.castShadow = false; g.add(ca);
      g.add(box(0.54, 0.80, 0.008, espelho, 0, 1.46, 0.024, nc));
      const cb = cyl(0.27, 0.27, 0.008, espelho, 0, 1.86, 0.024, 28); cb.rotation.x = PI / 2; cb.castShadow = false; g.add(cb);
    }
    // quadro na parede sul (x ≈ 8,0), de frente para o norte — fora do arco da folha da porta
    picture(8.0, 1.25, 7.59, FNZ, 0.62, 0.62, art2, frameG);
    // capacho de fibra diante da porta de entrada (x 8,49), sobre o piso
    W(matCoirE, 7.84, 8.40, 0.004, 0.012, 6.76, 7.34, nc);
    W(matCoir, 7.865, 8.375, 0.0125, 0.0135, 6.785, 7.315, nc);
    for (let k = 0; k < 6; k++) W(matCoirE, 7.89 + k * 0.08, 7.90 + k * 0.08, 0.0136, 0.0142, 6.80, 7.30, nc);
  }
}
