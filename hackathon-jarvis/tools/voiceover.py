#!/usr/bin/env python3
"""Génère SCRIPT-VOIX-OFF.md et voix-off.srt à partir du découpage réel du film (build/cues.json).
Usage : node render.cjs --cues build/cues.json && python3 tools/voiceover.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TL = json.load(open(os.path.join(ROOT, 'build', 'cues.json')))['tl']
DUR = json.load(open(os.path.join(ROOT, 'build', 'cues.json')))['duration']

# (scène, décalage en s, texte anglais, ce qui est à l'écran) — la ligne commence à TL[scène][0] + décalage
LINES = [
    ('1. Le problème', None, None, None),
    ('open', 0.9, 'Nine a.m.', '8:59 → 9:00, la pastille de notifications s\'emballe'),
    ('storm', 0.2, 'For a Programmatic Solutions Consultant, the day starts with emails, Slack, invites, DSP exports, tickets and product updates. All at once.', 'tempête de notifications'),
    ('avalanche', 0.8, 'Every answer is already in there: in a mail, a thread, an export.', 'zoom arrière : une carte parmi des milliers'),
    ('avalanche', 7.1, '**But no one can see it all.**', '« No one can see it all. », le halo « what you can read today »'),
    ('2. La révélation', None, None, None),
    ('reveal', 0.5, 'What if all of it flowed into one place?', 'les sources (Outlook, Slack, DSP…) se relient au cerveau'),
    ('reveal', 5.4, 'So we built **J.A.R.V.I.S.**', 'flash, le nom apparaît et le smile se dessine dessous (vise « J.A.R.V.I.S. » sur le flash)'),
    ('reveal', 8.0, 'One AI brain, powered by **Kiro**, that turns all of it into a single place to work.', 'l\'application se lève'),
    ('3. Démarrer la journée', None, None, None),
    ('brief', 0.6, 'Every morning, a **thirty-second** briefing tells me where to start: mail, meetings, campaigns.', '« Your day, in 30 seconds. »'),
    ('inbox', 0.6, 'My inbox arrives **already sorted**. What concerns me comes first.', 'la boîte se trie'),
    ('follow', 0.6, 'Every thread waiting on a reply resurfaces, and a follow-up is one click away.', '« No thread goes cold. »'),
    ('voice', 0.6, 'It writes **like me**: it learned my style from my sent emails, and every draft is grounded in **live data**, tickets and docs.', 'fiche de style, sources, brouillon avec les sources citées'),
    ('rewrite', 0.6, 'I can always add a quick note in my own words, even in French, and it **rewrites** it cleanly into the email.', 'la note brute devient un paragraphe propre'),
    ('agenda', 0.6, 'Every meeting is **on my radar**, unanswered invites flagged.', 'l\'agenda de la semaine'),
    ('meeting', 0.6, 'And a dedicated agent prepares each meeting **the day before**: context, numbers, talking points. I **walk in ready**.', 'la veille 17:33 → jeudi 11:00, la fiche de prépa'),
    ('4. Piloter les campagnes', None, None, None),
    ('c2', 0.4, 'Then, the campaigns. **DSP exports** feed the brain natively.', 'intertitre, puis l\'export DSP qui coule vers le cerveau'),
    ('pacing', 0.6, 'The pacing map shows at a glance what\'s behind, what to watch, and what\'s on pace. I see **under-delivery before my client does**.', 'la carte du pacing'),
    ('actions', 0.6, 'And **numbers become actions**: two percent delivered, forty-one thousand euros at risk, ends November fifteenth. That\'s now a task, with the next step.', '2.3 % · ×9.4 · €41,708 → tâche'),
    ('trouble', 0.6, 'When delivery breaks, troubleshooting is **guided**: TWIG, Waypoint, the twenty-four-hour window, and every SIM ticket tracked.', 'le parcours TWIG → SIM'),
    ('5. Connaître ses clients', None, None, None),
    ('portfolio', 0.6, 'My whole portfolio is **ranked by urgency**.', 'les clients se trient'),
    ('sheet', 0.6, 'One click, and I get the full client picture: risk, next step, latest emails, live campaigns and their curves. **On one screen**.', 'la fiche BFM'),
    ('6. Rester informé', None, None, None),
    ('news', 0.4, '**Seven hundred** product updates? Kiro summarizes them, flags what needs action from me, and prepares **a recap** every Thursday. Slack is connected too, so nothing gets lost.', '739 qui défile, le récap du jeudi, Slack'),
    ('7. Produire', None, None, None),
    ('c5', 0.8, 'And because it knows everything, it produces. **One sentence**, and my PowerPoint for Thursday\'s team meeting is ready.', 'la phrase tapée, 8 slides'),
    ('wbr', 0.6, 'Even my weekly business review **writes itself**, from what actually happened this week.', 'le WBR s\'écrit'),
    ('8. Confiance et apprentissage', None, None, None),
    ('control', 0.6, 'I stay **in control**. Drafts land in Outlook, but nothing is ever sent on its own.', 'brouillon Outlook, c\'est toi qui cliques « Send »'),
    ('loop', 0.6, 'And it keeps learning: from **every email** I send, **every document** I create, **every campaign result**. Its answers and alerts get sharper every day.', 'la boucle d\'apprentissage'),
    ('9. La suite', None, None, None),
    ('sfdc', 0.6, 'Next: **Salesforce**, for sales and targets.', 'la tuile Salesforce rejoint le cerveau'),
    ('network', 0.6, 'Then **connected brains**, sharing what they know, so the whole team moves together.', 'le réseau de cerveaux'),
    ('outro', 0.2, '**Stop searching. Start consulting.**', 'les deux lignes, en rythme'),
    ('outro', 3.0, 'This is J.A.R.V.I.S.', 'le nom, le smile qui se dessine, « by amazon ads »'),
]

def tc(s, srt=False):
    if srt:
        ms = int(round(s * 1000)); return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"
    return f"{int(s // 60)}:{s % 60:04.1f}"

rows = [(TL[k][0] + off, txt, scr) if k in TL else (None, k, None) for k, off, txt, scr in LINES]
timed = [r for r in rows if r[0] is not None]
plain = lambda t: t.replace('**', '')
words = sum(len(plain(t).split()) for _, t, _ in timed)

# --- SRT
srt = []
for i, (a, t, _) in enumerate(timed):
    b = min(timed[i + 1][0] - 0.2 if i + 1 < len(timed) else DUR, a + 0.6 + len(plain(t).split()) * 0.42)
    srt.append(f"{i + 1}\n{tc(a, True)} --> {tc(b, True)}\n{plain(t)}\n")
open(os.path.join(ROOT, 'voix-off.srt'), 'w').write('\n'.join(srt))

# --- Markdown
md = [f"# J.A.R.V.I.S. — script de voix off (anglais)\n",
      f"Durée du film : **{tc(DUR)[:-2]}**. Environ {words} mots, soit un débit posé de ~{round(words / DUR * 60)} mots/minute.",
      "Les timecodes indiquent **le moment où commencer la phrase** pour qu'elle tombe sur l'image.",
      "Les mots en **gras** sont ceux qui apparaissent à l'écran au même instant : appuie-les légèrement.\n",
      "Pour répéter : ouvre `livrables/JARVIS-hackathon.mp4` dans VLC et charge `voix-off.srt` comme sous-titres",
      "(Sous-titres → Ajouter un fichier) : le texte défile en même temps que l'image.\n", "---"]
for a, t, scr in rows:
    if a is None:
        md.append(f"\n## {t}\n\n| Début | Texte (EN) | À l'écran |\n|---|---|---|")
    else:
        md.append(f"| {tc(a)} | *{t}* | {scr} |")
md.append("\n---\n\n### Texte d'un seul tenant (pour t'entraîner)\n")
para = []
for a, t, scr in rows:
    if a is None:
        if para: md.append('> ' + ' '.join(para) + '\n>'); para = []
    else:
        para.append(plain(t))
if para: md.append('> ' + ' '.join(para))
md.append("""
### Conseils d'enregistrement

- Enregistre la voix **en regardant la vidéo** (la bande-son est mixée autour de -20 LUFS pour laisser la place à ta voix).
- Dans ton outil de montage, pose la voix vers -16 LUFS. Si la musique te gêne, baisse la piste vidéo de 3 à 6 dB.
- Les deux moments à ne pas rater : « So we built **J.A.R.V.I.S.** » sur le flash, et « Stop searching. Start consulting. » sur les deux impacts de la fin.
""")
open(os.path.join(ROOT, 'SCRIPT-VOIX-OFF.md'), 'w').write('\n'.join(md))
print(f"{len(timed)} lines · {words} words · {DUR} s")
