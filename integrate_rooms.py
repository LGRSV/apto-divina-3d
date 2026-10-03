#!/usr/bin/env python3
"""Integra as funções room*(ctx) (arquivos rooms/*.js) no apto-vovo-card.js.
Uso: python3 integrate_rooms.py [pasta-com-os-arquivos]   (padrão: ./rooms)
Cada arquivo rooms/<chave>.js deve conter só `function room<Nome>(ctx) { … }` (ver rooms/BRIEF.md).
Arquivo ausente (ou que não define a função) → a função entra como stub vazio, e o cartão continua funcionando."""
import re, sys
from pathlib import Path
ROOMS = {  # arquivo -> (nome da função, seed)
    'sala_jantar': ('roomSalaJantar', 21), 'cozinha_servico': ('roomCozinhaServico', 22), 'suite_master': ('roomSuiteMaster', 23),
    'suites_visita': ('roomSuitesVisita', 24), 'banheiros': ('roomBanheiros', 25),
}
src_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / 'rooms'
card = Path(__file__).parent / 'apto-vovo-card.js'
s = card.read_text(encoding='utf-8')
if not re.search(r'// @rooms-begin\n(.*?)// @rooms-end', s, re.S): sys.exit('!! marcadores @rooms-begin/@rooms-end não encontrados no cartão')

funcs, done, stub = [], [], []
for key, (fn, seed) in ROOMS.items():
    f = src_dir / f'{key}.js'
    code = None
    if f.exists():
        txt = f.read_text(encoding='utf-8').strip()
        if f'function {fn}(' not in txt: print(f'!! {f.name}: não define {fn} — usando stub vazio')
        else: code = txt; done.append(key)
    if code is None:
        code = f'function {fn}(ctx) {{}}'; stub.append(key)
    funcs.append(code)
    pat = re.compile(r'(    // @room ' + key + r'\n)(.*?)(    // @endroom\n)', re.S)
    s, n = pat.subn(lambda mm: mm.group(1) + f'    {fn}(ctx({seed}));\n' + mm.group(3), s)
    if not n: print(f'!! marcador @room {key} não encontrado')
block = '// @rooms-begin\n' + '\n\n'.join(funcs) + '\n// @rooms-end'
s = re.sub(r'// @rooms-begin\n.*?// @rooms-end', lambda mm: block, s, flags=re.S)
card.write_text(s, encoding='utf-8')
print('integrados:', ', '.join(done) or 'nenhum', '· stub vazio:', ', '.join(stub) or 'nenhum')
