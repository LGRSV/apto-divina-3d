function roomBanheiros(ctx) {
  // ---------------------------------------------------------------------------
  // BANHEIROS do Apartamento Vovó (APTO DIVINA · STORIA — Mota e Lopes).
  //  1) Banheiro americano: box 0,85 × 1,11 (x 1,10–1,95 · z 0,47–1,58) com vidro e porta de correr,
  //     ducha de chuva, registro, seixos no piso e numa faixa da parede, basculante com persiana (parede oeste);
  //     vaso (x 1,95–2,77) com ducha higiênica; lavatório vista I (gabinete suspenso 136×55 Frapê, bancada de pedra
  //     clara com cuba retangular, espelheira 136×110 de 3 portas).
  //  2) Banho master (x 6,76–8,42 · z 4,37–6,42): vaso ao norte, box 0,87×0,99 com vidro fixo + porta de correr,
  //     bancada/gabinete J 80×55 e espelheira 80×110 (2 portas), toalheiro.
  //  3) Lavabo (x 6,77–8,44 · z 7,70–8,83): bancada de pedra 0,80×0,45 com cuba esculpida, torneira de parede,
  //     gabinete Frapê, espelho, vaso.
  // Paredes dos boxes revestidas até 2,40 (REVESTIMENTOS A/B/C e E/F) em porcelanato grande formato bege (juntas a 0,80/1,60).
  // Pisos, paredes, portas, janelas e luzes são do cartão — aqui só revestimento do box, louças, metais e marcenaria.
  // Colisores do modo Pessoa: ctx.addCollider(x0, z0, x1, z1) quando o cartão oferecer (ignorado se não existir).
  // ---------------------------------------------------------------------------
  const THREE = ctx.THREE, M = ctx.M;
  const box = (...a) => ctx.box(...a), cyl = (...a) => ctx.cyl(...a), sph = (...a) => ctx.sph(...a);
  const place = (...a) => ctx.place(...a), std = (o) => ctx.std(o), rnd = () => ctx.rnd();
  const put = (m) => { ctx.add(m); return m; };
  const G = () => new THREE.Group();
  const nc = { cast: false };
  const solid = (x0, z0, x1, z1) => {
    if (typeof ctx.addCollider === 'function') ctx.addCollider(x0, z0, x1, z1);
    else if (Array.isArray(ctx.colliders)) ctx.colliders.push({ x0, z0, x1, z1 });
  };

  // ---- Materiais (do cartão quando existirem; reservas para testes) ----
  const ceramic = std({ color: 0xf7f6f3, roughness: 0.12 });
  const chrome  = M.chrome || std({ color: 0xdadde0, roughness: 0.18, metalness: 0.9 });
  const gold    = M.dourado || std({ color: 0xc9a86a, roughness: 0.3, metalness: 0.85 });
  const mirror  = M.espelho || M.mirror || std({ color: 0xdfe6ea, roughness: 0.05, metalness: 1 });
  const frape   = M.frape || std({ color: 0xd8cfc2, roughness: 0.6 });
  const stone   = M.pedraClara || std({ color: 0xdccdb0, roughness: 0.4 });
  const porc    = M.porcelanatoBege || std({ color: 0xc9bca6, roughness: 0.45 });
  const glassM  = M.glass || std({ color: 0xcfe6ea, roughness: 0.05, transparent: true, opacity: 0.22 });
  const frameD  = M.frameDark || std({ color: 0x161616, roughness: 0.5, metalness: 0.4 });
  const dark    = std({ color: 0x1a1a1c, roughness: 0.6 });
  const slot    = std({ color: 0x3b3833, roughness: 0.7 });                    // fresta / cava do puxador
  const steelB  = std({ color: 0x9a9da0, roughness: 0.35, metalness: 0.8 });   // ralo linear
  const towelM  = std({ color: 0xf3f0ea, roughness: 1 });
  const towel2  = std({ color: 0xd9cfbf, roughness: 1 });
  const zebraA  = std({ color: 0xe6dfd2, roughness: 1 });
  const zebraB  = std({ color: 0xb9ad9a, roughness: 1 });
  const white   = std({ color: 0xf3f2ee, roughness: 0.4 });
  const green   = std({ color: 0x5f8a4e, roughness: 0.9 });
  const hoseM   = std({ color: 0xcfd2d4, roughness: 0.3, metalness: 0.85 });

  // Faixa de seixos (pedrisco) — textura desenhada no espaço virtual (largura × altura em m) para os seixos saírem redondos
  const pebCache = new Map();
  const pebbleMat = (wm, hm) => {
    const key = wm.toFixed(2) + 'x' + hm.toFixed(2);
    let m = pebCache.get(key); if (m) return m;
    const asp = wm / hm;
    const tex = ctx.makeTex(512, (g, s) => {
      const W = asp >= 1 ? s : s * asp, Hh = asp >= 1 ? s / asp : s;
      g.save(); g.scale(s / W, s / Hh);
      g.fillStyle = '#8d8372'; g.fillRect(0, 0, W, Hh);
      const px = W / wm;                             // pixels por metro
      const tones = ['#c9bfaa', '#b3a78f', '#d8cfbd', '#9b9079', '#a89c84', '#e0d8c8'];
      let seed = 17 + Math.round(wm * 100) * 3 + Math.round(hm * 100);
      const r = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      const n = Math.min(3600, Math.round(wm * hm * 3000));
      for (let i = 0; i < n; i++) {
        const x = r() * W, y = r() * Hh, rr = (0.012 + r() * 0.012) * px;
        g.fillStyle = tones[Math.floor(r() * tones.length)];
        g.beginPath(); g.ellipse(x, y, rr, rr * (0.7 + r() * 0.3), r() * 3.14, 0, 6.283); g.fill();
        g.strokeStyle = 'rgba(60,52,40,0.35)'; g.lineWidth = Math.max(0.5, px * 0.003); g.stroke();
      }
      g.restore();
    });
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    m = std({ map: tex, roughness: 0.8 });
    pebCache.set(key, m); return m;
  };

  // ---- Revestimento de parede de box (12 mm) — placas grandes com juntas a 0,80 e 1,60 ----
  const CL = 0.012;
  const cladRect = (axis, f, dir, a, b, y0, y1, mat) => {
    if (b - a < 0.01 || y1 - y0 < 0.01) return;
    const c = f + dir * CL / 2, mid = (a + b) / 2, y = (y0 + y1) / 2;
    put(axis === 'x' ? box(CL, y1 - y0, b - a, mat, c, y, mid, nc) : box(b - a, y1 - y0, CL, mat, mid, y, c, nc));
  };
  // axis 'x' = parede com x fixo (corre em z); 'z' = parede com z fixo (corre em x). cut = [a, b, y0, y1] (janela)
  const clad = (axis, f, dir, a, b, cut) => {
    const rows = [[0.02, 0.798], [0.802, 1.598], [1.602, 2.40]];
    for (const [r0, r1] of rows) {
      if (!cut || cut[3] <= r0 || cut[2] >= r1) { cladRect(axis, f, dir, a, b, r0, r1, porc); continue; }
      cladRect(axis, f, dir, a, cut[0], r0, r1, porc);
      cladRect(axis, f, dir, cut[1], b, r0, r1, porc);
      cladRect(axis, f, dir, cut[0], cut[1], r0, Math.max(r0, cut[2]), porc);
      cladRect(axis, f, dir, cut[0], cut[1], Math.min(r1, cut[3]), r1, porc);
    }
  };

  // ---- Peças reutilizáveis (origem no centro da base; frente = +z) ----
  // Vaso sanitário de caixa acoplada (comprimento total ≈ 0,65 com s = 1,1; fundo da caixa em z = −0,32)
  const toilet = (s = 1.1) => {
    const g = G();
    g.add(box(0.37, 0.40, 0.17, ceramic, 0, 0.62, -0.205));                       // caixa acoplada
    g.add(box(0.35, 0.025, 0.15, ceramic, 0, 0.83, -0.205));                      // tampa da caixa
    g.add(cyl(0.022, 0.022, 0.012, chrome, -0.06, 0.845, -0.205, 12));            // botão duplo
    g.add(cyl(0.022, 0.022, 0.012, chrome, 0.06, 0.845, -0.205, 12));
    g.add(box(0.24, 0.40, 0.30, ceramic, 0, 0.20, -0.08));                        // pedestal
    const bowl = cyl(0.19, 0.15, 0.20, ceramic, 0, 0.30, 0.045, 20); bowl.scale.set(1, 1, 1.32); g.add(bowl);
    const rim = cyl(0.195, 0.195, 0.03, ceramic, 0, 0.405, 0.045, 20); rim.scale.set(1, 1, 1.32); g.add(rim);
    const seat = cyl(0.185, 0.185, 0.03, white, 0, 0.435, 0.05, 20); seat.scale.set(1, 1, 1.30); g.add(seat);
    const lid = cyl(0.178, 0.178, 0.018, white, 0, 0.462, 0.05, 20); lid.scale.set(1, 1, 1.28); g.add(lid);
    g.add(box(0.30, 0.04, 0.04, ceramic, 0, 0.44, -0.12));                        // dobradiças
    g.scale.set(s, s, s);
    return g;
  };
  const tray = (r, x, y, z) => { put(cyl(r, r * 0.9, 0.012, gold, x, y + 0.006, z, 20)); };
  const tulips = (x, y, z) => {                                                  // vasinho com tulipas brancas (render)
    put(cyl(0.035, 0.03, 0.09, ceramic, x, y + 0.045, z, 12));
    for (let i = 0; i < 5; i++) {
      const a = i * 1.26, dx = Math.cos(a) * 0.02, dz = Math.sin(a) * 0.02, h = 0.11 + (i % 3) * 0.025;
      put(cyl(0.003, 0.003, h, green, x + dx, y + 0.09 + h / 2, z + dz, 5));
      const b = sph(0.016, i % 2 ? towelM : white, x + dx * 1.3, y + 0.09 + h + 0.012, z + dz * 1.3); b.scale.set(1, 1.35, 1); put(b);
    }
  };
  const dispenser = (x, y, z) => {
    put(cyl(0.03, 0.03, 0.14, ceramic, x, y + 0.07, z, 14));
    put(cyl(0.008, 0.008, 0.05, chrome, x, y + 0.165, z, 8));
    put(box(0.05, 0.012, 0.012, chrome, x + 0.02, y + 0.187, z, nc));
  };
  // Torneira monocomando alta (base em (x, y, z), bico para o lado +dz)
  const faucetTall = (x, y, z, dz) => {
    put(cyl(0.022, 0.026, 0.03, chrome, x, y + 0.015, z, 14));
    put(cyl(0.012, 0.012, 0.19, chrome, x, y + 0.125, z, 12));
    put(box(0.022, 0.022, Math.abs(dz) + 0.03, chrome, x, y + 0.225, z + dz / 2, nc));
    put(box(0.014, 0.012, 0.05, chrome, x + 0.03, y + 0.125, z, nc));             // alavanca
  };
  // Ducha de chuva + braço (saindo de parede z fixa: wz = parede, dir = sentido para dentro do box)
  const rainShower = (x, y, wz, dir) => {
    put(cyl(0.02, 0.02, 0.012, chrome, x, y, wz + dir * 0.006, 12)).rotation.x = Math.PI / 2;
    put(box(0.018, 0.018, 0.36, chrome, x, y, wz + dir * 0.18, nc));
    put(cyl(0.012, 0.012, 0.06, chrome, x, y - 0.03, wz + dir * 0.34, 8));
    put(cyl(0.12, 0.12, 0.012, chrome, x, y - 0.065, wz + dir * 0.34, 28));
    put(cyl(0.105, 0.105, 0.004, steelB, x, y - 0.073, wz + dir * 0.34, 28));
  };
  const registro = (x, y, wz, dir) => {
    const p = put(cyl(0.045, 0.045, 0.01, chrome, x, y, wz + dir * 0.005, 20)); p.rotation.x = Math.PI / 2;
    const k = put(cyl(0.01, 0.01, 0.04, chrome, x, y, wz + dir * 0.03, 8)); k.rotation.x = Math.PI / 2;
    put(box(0.07, 0.016, 0.016, chrome, x + 0.03, y, wz + dir * 0.045, nc));
  };
  // Ducha higiênica numa parede x fixa (wx, dir = sentido para dentro do banheiro)
  const bidetSpray = (wx, dir, z, y) => {
    const p = put(cyl(0.03, 0.03, 0.012, chrome, wx + dir * 0.006, y, z, 16)); p.rotation.z = Math.PI / 2;
    put(box(0.05, 0.06, 0.03, chrome, wx + dir * 0.04, y - 0.03, z, nc));
    const tor = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.005, 6, 18, Math.PI * 1.2), hoseM);
    tor.position.set(wx + dir * 0.03, y - 0.16, z); tor.rotation.y = Math.PI / 2; tor.castShadow = false; put(tor);
  };
  const paperHolder = (wx, dir, z, y) => {
    put(box(0.07, 0.03, 0.14, chrome, wx + dir * 0.035, y, z, nc));
    put(cyl(0.055, 0.055, 0.115, white, wx + dir * 0.075, y, z, 16)).rotation.x = Math.PI / 2;
  };

  // ---- Bancada + gabinete suspenso + espelheira (construídos no local: fundo da parede em z = 0, frente em +z; x centrado) ----
  // o: w largura, d profundidade, yb base do gabinete, yt topo da pedra, sink {x,z,w,d,depth}, faucet {x,z,dz,wall},
  //    mir {y0,y1,doors,d} ou mirPlain {y0,y1}
  const vanity = (o) => {
    const g = G(); const w = o.w, d = o.d, yb = o.yb, yt = o.yt, th = 0.07, yc = yt - th;
    const add = (m) => { g.add(m); return m; };
    // pedra com recorte da cuba (4 tiras ao redor)
    const s = o.sink, sx0 = s.x - s.w / 2, sx1 = s.x + s.w / 2, sz0 = s.z - s.d / 2, sz1 = s.z + s.d / 2;
    const ys = (yt + yc) / 2;
    add(box(w, th, sz0, stone, 0, ys, sz0 / 2));                                   // atrás da cuba
    add(box(w, th, d - sz1, stone, 0, ys, (sz1 + d) / 2));                         // frente da cuba
    add(box(sx0 + w / 2, th, s.d, stone, (sx0 - w / 2) / 2, ys, s.z));             // esquerda
    add(box(w / 2 - sx1, th, s.d, stone, (sx1 + w / 2) / 2, ys, s.z));             // direita
    // cuba branca
    const dep = s.depth, yw = yc - dep + th;
    add(box(0.012, dep + 0.004, s.d + 0.004, ceramic, sx0 + 0.006, yt - dep / 2 + 0.002, s.z, nc));
    add(box(0.012, dep + 0.004, s.d + 0.004, ceramic, sx1 - 0.006, yt - dep / 2 + 0.002, s.z, nc));
    add(box(s.w, dep + 0.004, 0.012, ceramic, s.x, yt - dep / 2 + 0.002, sz0 + 0.006, nc));
    add(box(s.w, dep + 0.004, 0.012, ceramic, s.x, yt - dep / 2 + 0.002, sz1 - 0.006, nc));
    add(box(s.w, 0.012, s.d, ceramic, s.x, yt - dep, s.z, nc));
    add(cyl(0.025, 0.025, 0.006, chrome, s.x, yt - dep + 0.008, s.z, 14));          // válvula
    // saia / corpo (carcaça com vão para a cuba)
    const cd = d - 0.012, ct = yc - yb;                                             // carcaça um pouco recuada
    const yUnder = yt - dep - 0.02;                                                 // fundo da cuba
    add(box(w - 0.02, yUnder - yb, cd, frape, 0, (yb + yUnder) / 2, cd / 2 + 0.002));
    add(box(w - 0.02, yc - yUnder, sz0 - 0.002, frape, 0, (yUnder + yc) / 2, sz0 / 2));
    add(box(w - 0.02, yc - yUnder, cd - sz1 + 0.002, frape, 0, (yUnder + yc) / 2, (sz1 + cd) / 2));
    add(box(sx0 + w / 2 - 0.01, yc - yUnder, s.d + 0.004, frape, (sx0 - w / 2 + 0.01) / 2, (yUnder + yc) / 2, s.z));
    add(box(w / 2 - sx1 - 0.01, yc - yUnder, s.d + 0.004, frape, (sx1 + w / 2 - 0.01) / 2, (yUnder + yc) / 2, s.z));
    // frentes: gaveta 20 embaixo, basculante 30 em cima (juntas de 3 mm); fresta de cava no alto de cada uma
    const fy0 = yb, fy1 = yb + 0.20, fy2 = yc;
    const fz = d - 0.002 + 0.009;
    add(box(w - 0.006, fy1 - fy0 - 0.003, 0.018, frape, 0, (fy0 + fy1) / 2, fz - 0.009 + 0.002));
    add(box(w - 0.006, fy2 - fy1 - 0.003, 0.018, frape, 0, (fy1 + fy2) / 2 + 0.0015, fz - 0.009 + 0.002));
    add(box(w - 0.12, 0.012, 0.004, slot, 0, fy1 - 0.02, fz + 0.002, nc));
    add(box(w - 0.12, 0.012, 0.004, slot, 0, fy2 - 0.02, fz + 0.002, nc));
    // torneira
    const f = o.faucet;
    if (f.wall) {                                                                   // de parede
      const p = add(cyl(0.03, 0.03, 0.012, chrome, f.x, f.y, 0.006, 16)); p.rotation.x = Math.PI / 2;
      add(box(0.02, 0.02, f.dz, chrome, f.x, f.y, f.dz / 2, nc));
      add(cyl(0.012, 0.012, 0.04, chrome, f.x, f.y - 0.02, f.dz - 0.01, 10));
      add(box(0.014, 0.014, 0.05, chrome, f.x + 0.03, f.y, 0.045, nc));
    } else {
      add(cyl(0.022, 0.026, 0.03, chrome, f.x, yt + 0.015, f.z, 14));
      add(cyl(0.012, 0.012, 0.19, chrome, f.x, yt + 0.125, f.z, 12));
      add(box(0.022, 0.022, f.dz + 0.03, chrome, f.x, yt + 0.225, f.z + f.dz / 2, nc));
      add(box(0.014, 0.012, 0.05, chrome, f.x + 0.032, yt + 0.125, f.z, nc));
    }
    // espelheira: caixa Frapê com portas espelhadas
    if (o.mir) {
      const m = o.mir, hh = m.y1 - m.y0, md = m.d;
      add(box(w, hh, md, frape, 0, (m.y0 + m.y1) / 2, md / 2));
      add(box(w, 0.05, md, frape, 0, m.y1 + 0.025, md / 2));                         // 5 cm de topo até 2,40
      const dw = w / m.doors;
      for (let i = 0; i < m.doors; i++) {
        add(box(dw - 0.006, hh - 0.01, 0.012, mirror, -w / 2 + dw * (i + 0.5), (m.y0 + m.y1) / 2, md + 0.004, nc));
      }
      for (let i = 1; i < m.doors; i++) add(box(0.004, hh, 0.014, slot, -w / 2 + dw * i, (m.y0 + m.y1) / 2, md + 0.004, nc));
    }
    if (o.mirPlain) {
      const m = o.mirPlain;
      add(box(w, m.y1 - m.y0, 0.012, frape, 0, (m.y0 + m.y1) / 2, 0.006));
      add(box(w - 0.04, m.y1 - m.y0 - 0.04, 0.008, mirror, 0, (m.y0 + m.y1) / 2, 0.016, nc));
    }
    return g;
  };

  // Vidro de box: vidro fino + perfis pretos
  const glassPane = (x0, x1, y0, y1, z0, z1) => {
    put(box(Math.max(x1 - x0, 0.008), y1 - y0, Math.max(z1 - z0, 0.008), glassM, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, nc));
  };
  const profile = (x0, x1, y0, y1, z0, z1) => {
    put(box(x1 - x0, y1 - y0, z1 - z0, frameD, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, nc));
  };

  // ======================================================================
  // 1) BANHEIRO AMERICANO
  // ======================================================================
  {
    // revestimento do box: vista A (norte, mureta z 0,47), B (oeste, basculante), C (sul, z 1,585)
    clad('z', 0.47, +1, 1.09, 1.95);
    clad('x', 1.08, +1, 0.47, 1.585, [0.88, 1.46, 1.60, 2.26]);
    clad('z', 1.585, -1, 1.09, 1.95);
    // faixa de seixos sob a ducha (parede sul) e piso do box
    const sx = 1.52;
    put(box(0.30, 2.36, 0.012, pebbleMat(0.30, 2.36), sx, 1.20, 1.585 - CL - 0.006, nc));
    put(box(0.85, 0.012, 1.10, pebbleMat(0.85, 1.10), 1.52, 0.012, 1.025, nc));
    put(box(0.04, 0.008, 1.02, steelB, 1.91, 0.02, 1.03, nc));                       // ralo linear junto ao vidro
    rainShower(sx, 2.20, 1.585 - CL, -1);
    registro(sx, 1.10, 1.585 - CL, -1);
    // persiana zebra sobre o basculante (parede oeste)
    for (let i = 0; i < 9; i++) put(box(0.02, 0.07, 0.69, i % 2 ? zebraB : zebraA, 1.105, 2.27 - i * 0.075, 1.17, nc));
    put(box(0.04, 0.05, 0.72, dark, 1.11, 2.34, 1.17, nc));
    // vidro do box em x = 1,95: fixo z 0,47–0,92, porta de correr z 0,92–1,58
    glassPane(1.946, 1.954, 0.03, 2.10, 0.47, 0.93);
    profile(1.94, 1.96, 0.02, 0.04, 0.47, 1.58); profile(1.94, 1.96, 2.10, 2.12, 0.47, 1.58);
    profile(1.94, 1.96, 0.02, 2.12, 0.47, 0.485);
    glassPane(1.966, 1.974, 0.05, 2.07, 0.915, 1.575);
    profile(1.962, 1.978, 0.04, 2.09, 0.915, 0.93); profile(1.962, 1.978, 0.04, 2.09, 1.56, 1.575);
    profile(1.962, 1.978, 0.04, 0.06, 0.915, 1.575); profile(1.962, 1.978, 2.07, 2.09, 0.915, 1.575);
    put(box(0.02, 0.50, 0.02, chrome, 1.99, 1.05, 0.985, nc));                     // puxador da porta
    solid(1.93, 0.46, 1.97, 0.93);

    // vaso + ducha higiênica + papeleiro (parede leste do compartimento: face x 2,785)
    const t = toilet(); place(t, 2.27, 0.57, 0, 0);   // centro x ≈ 2,30 como na LAYOUT (a porta do compartimento gira livre)
    solid(2.07, 0.24, 2.47, 0.80);   // vaso (só a louça; a frente da bacia fica livre para passar da porta ao box)
    bidetSpray(2.785, -1, 0.66, 0.60);
    paperHolder(2.785, -1, 0.48, 0.72);   // ao lado da caixa: a ponta da folha da porta (fecha em z 0,84) passa livre

    // lavatório vista I: x 2,90–4,25 (136 cm), fundo na parede norte (face z 0,23)
    const v = vanity({
      w: 1.36, d: 0.55, yb: 0.33, yt: 0.90,
      sink: { x: 0.175, z: 0.30, w: 0.46, d: 0.32, depth: 0.12 },
      faucet: { x: 0.175, z: 0.07, dz: 0.19, wall: false },
      mir: { y0: 1.25, y1: 2.35, doors: 3, d: 0.15 },
    });
    place(v, 3.575, 0.233, 0, 0);
    solid(2.895, 0.23, 4.255, 0.79);
    // objetos na bancada
    tray(0.075, 3.18, 0.90, 0.46); tulips(3.18, 0.912, 0.46);
    dispenser(4.16, 0.90, 0.40);
    put(box(0.20, 0.03, 0.14, towelM, 3.36, 0.915, 0.62, nc)); put(box(0.20, 0.03, 0.14, towel2, 3.36, 0.945, 0.62, nc));
  }

  // ======================================================================
  // 2) BANHO MASTER
  // ======================================================================
  {
    // revestimento do box: vista E (oeste, face x 6,76), F (sul, face z 6,17)
    clad('x', 6.76, +1, 5.17, 6.17);
    clad('z', 6.17, -1, 6.77, 7.63);
    const sx = 7.20;
    put(box(0.30, 2.36, 0.012, pebbleMat(0.30, 2.36), sx, 1.20, 6.17 - CL - 0.006, nc));
    put(box(0.86, 0.012, 0.99, pebbleMat(0.86, 0.99), 7.20, 0.012, 5.675, nc));
    put(box(0.86, 0.008, 0.04, steelB, 7.20, 0.02, 5.23, nc));                     // ralo linear
    rainShower(sx, 2.20, 6.17 - CL, -1);
    registro(sx, 1.10, 6.17 - CL, -1);
    // vidro: fixo em z = 5,17 (x 6,77–7,63) e em x = 7,63 (z 5,82–6,17); porta de correr em x = 7,645 (z 5,17–5,82)
    glassPane(6.77, 7.63, 0.03, 2.10, 5.166, 5.174);
    profile(6.77, 7.63, 0.02, 0.04, 5.16, 5.18); profile(6.77, 7.63, 2.10, 2.12, 5.16, 5.18);
    profile(7.62, 7.64, 0.02, 2.12, 5.16, 5.18);
    glassPane(7.626, 7.634, 0.03, 2.10, 5.80, 6.165);
    profile(7.62, 7.64, 0.02, 0.04, 5.15, 6.17); profile(7.62, 7.64, 2.10, 2.12, 5.15, 6.17);
    glassPane(7.646, 7.654, 0.05, 2.07, 5.175, 5.81);
    profile(7.642, 7.658, 0.04, 2.09, 5.175, 5.19); profile(7.642, 7.658, 0.04, 2.09, 5.795, 5.81);
    profile(7.642, 7.658, 0.04, 0.06, 5.175, 5.81); profile(7.642, 7.658, 2.07, 2.09, 5.175, 5.81);
    put(box(0.02, 0.50, 0.02, chrome, 7.675, 1.05, 5.76, nc));                      // puxador
    solid(7.60, 5.14, 7.68, 5.84);

    // vaso ao norte + ducha higiênica (parede oeste, face x 6,76) + papeleiro
    const t = toilet(); place(t, 7.22, 4.705, 0, 0);
    solid(7.0, 4.37, 7.44, 5.05);
    bidetSpray(6.76, +1, 4.78, 0.60);
    paperHolder(6.76, +1, 4.55, 0.72);

    // bancada J: 80×55, fundo na parede sul (face z 6,41), frente para −z
    const v = vanity({
      w: 0.78, d: 0.55, yb: 0.33, yt: 0.90,
      sink: { x: 0, z: 0.30, w: 0.44, d: 0.30, depth: 0.12 },
      faucet: { x: 0, z: 0.07, dz: 0.18, wall: false },
      mir: { y0: 1.25, y1: 2.35, doors: 2, d: 0.15 },
    });
    place(v, 8.03, 6.405, Math.PI, 0);
    solid(7.64, 5.85, 8.42, 6.41);
    tray(0.075, 8.28, 0.90, 6.17); tulips(8.28, 0.912, 6.17);
    put(box(0.18, 0.03, 0.13, towelM, 7.78, 0.915, 6.20, nc)); put(box(0.18, 0.03, 0.13, towel2, 7.78, 0.945, 6.20, nc));
    // toalheiro de barras na parede leste (face x 8,43) com toalha
    {
      const wx = 8.43, z0 = 5.28, z1 = 5.76;
      put(box(0.012, 0.50, 0.03, gold, wx - 0.006, 1.22, z0 + 0.015, nc)); put(box(0.012, 0.50, 0.03, gold, wx - 0.006, 1.22, z1 - 0.015, nc));
      for (let i = 0; i < 4; i++) {
        const b = put(cyl(0.01, 0.01, z1 - z0, gold, wx - 0.07, 1.03 + i * 0.13, (z0 + z1) / 2, 8)); b.rotation.x = Math.PI / 2;
        put(box(0.07, 0.016, 0.016, gold, wx - 0.035, 1.03 + i * 0.13, z0 + 0.015, nc)); put(box(0.07, 0.016, 0.016, gold, wx - 0.035, 1.03 + i * 0.13, z1 - 0.015, nc));
      }
      put(box(0.02, 0.38, 0.30, towelM, wx - 0.075, 1.22, (z0 + z1) / 2, nc));
    }
  }

  // ======================================================================
  // 3) LAVABO (x 6,77–8,44 · z 7,70–8,83)
  // ======================================================================
  {
    // bancada de pedra 0,80×0,45 com cuba esculpida; fundo na parede sul (face z 8,83), frente para −z
    const v = vanity({
      w: 0.80, d: 0.44, yb: 0.36, yt: 0.90,
      sink: { x: 0, z: 0.23, w: 0.50, d: 0.30, depth: 0.09 },
      faucet: { x: 0, y: 1.10, dz: 0.19, wall: true },
      mirPlain: { y0: 1.10, y1: 2.15 },
    });
    place(v, 7.175, 8.828, Math.PI, 0);
    solid(6.77, 8.38, 7.58, 8.83);
    // saia de pedra frontal (aparece sob a bancada) já está na carcaça; objetos
    tray(0.06, 7.40, 0.90, 8.62); tulips(7.40, 0.912, 8.62);
    dispenser(6.93, 0.90, 8.62);
    // vaso (encosto na parede sul, frente para −z) + ducha higiênica e papeleiro na parede leste (face x 8,43)
    const t = toilet(); place(t, 8.075, 8.49, Math.PI, 0);
    solid(7.85, 8.15, 8.30, 8.83);
    bidetSpray(8.43, -1, 8.40, 0.60);
    paperHolder(8.43, -1, 8.22, 0.72);
    // toalheiro de argola na parede leste
    put(cyl(0.012, 0.012, 0.012, gold, 8.424, 1.15, 7.95, 10)).rotation.z = Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.006, 6, 20), gold);
    ring.position.set(8.40, 1.15, 7.95); ring.rotation.y = Math.PI / 2; ring.castShadow = false; put(ring);
    put(box(0.015, 0.30, 0.20, towelM, 8.395, 1.0, 7.95, nc));
  }
}
