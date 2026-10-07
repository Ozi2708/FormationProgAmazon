#!/usr/bin/env python3
"""Génère le script de voix off minuté et ses sous-titres à partir du découpage réel du film (build/cues.json).
  python3 tools/voiceover.py        → SCRIPT-VOIX-OFF.md + voix-off.srt          (anglais, voix enregistrée par toi)
  python3 tools/voiceover.py fr     → SCRIPT-VOIX-OFF-FR.md + voix-off-fr.srt + build/vo-fr.json (pitch français, synthèse vocale)
  python3 tools/voiceover.py en-pitch → SCRIPT-PITCH-EN.md + pitch-en.srt + build/vo-en.json (pitch anglais, synthèse vocale)"""
import json, os, sys
LANG = sys.argv[1] if len(sys.argv) > 1 else 'en'
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

# Pitch français : (scène, décalage, texte affiché, ce qui est à l'écran[, texte prononcé si différent])
LINES_FR = [
    ('1. Le problème', None, None, None),
    ('open', 0.9, 'Imaginez : neuf heures du matin.', '8:59 → 9:00, la pastille de notifications s\'emballe'),
    ('storm', 0.4, 'Pour un consultant programmatique, la journée démarre en apnée : mails, Slack, invitations, exports DSP, tickets. Tout arrive en même temps.', 'tempête de notifications'),
    ('avalanche', 0.8, 'Toutes les réponses sont là, quelque part : dans un mail, un fil, un export.', 'zoom arrière : une carte parmi des milliers'),
    ('avalanche', 7.1, '**Mais personne ne peut tout voir.**', '« No one can see it all. »'),
    ('2. La solution', None, None, None),
    ('reveal', 0.5, 'Et si tout convergeait au même endroit ?', 'les sources se relient au cerveau'),
    ('reveal', 5.4, 'Alors on a créé **J.A.R.V.I.S.**', 'flash, le nom et le smile', 'Alors, on a créé Jarvis.'),
    ('reveal', 8.0, 'Un cerveau IA, propulsé par **Kiro**, qui transforme tout ce flux en un seul espace de travail.', 'l\'application se lève', 'Un cerveau I.A., propulsé par Kiro, qui transforme tout ce flux en un seul espace de travail.'),
    ('3. La journée', None, None, None),
    ('brief', 0.6, 'Chaque matin, un briefing de **trente secondes** me dit par où commencer : mails, réunions, campagnes.', '« Your day, in 30 seconds. »'),
    ('inbox', 0.6, 'Ma boîte arrive **déjà triée** : ce qui me concerne passe en premier.', 'la boîte se trie'),
    ('follow', 0.6, 'Aucun fil ne s\'endort : chaque relance est à un clic.', '« No thread goes cold. »'),
    ('voice', 0.6, 'Et il écrit **comme moi** : il a appris mon style dans mes mails, et chaque brouillon s\'appuie sur les **vraies données** : résultats DSP, tickets, documentation.', 'fiche de style, sources, brouillon sourcé'),
    ('rewrite', 0.6, 'Je garde la main : une note rapide, en vrac, en français, et il la **réécrit** proprement dans le mail.', 'la note brute devient un paragraphe'),
    ('agenda', 0.6, 'Toutes mes réunions sont **sous contrôle**, et les invitations oubliées remontent.', 'l\'agenda'),
    ('meeting', 0.6, 'Mieux : un agent dédié prépare chaque réunion **la veille**. Contexte, chiffres, points à aborder. J\'arrive **prêt**.', 'la veille 17:33 → jeudi 11:00'),
    ('4. Les campagnes', None, None, None),
    ('c2', 0.4, 'Côté campagnes, les **exports DSP** alimentent le cerveau directement.', 'l\'export DSP coule vers le cerveau'),
    ('pacing', 0.6, 'La carte du pacing montre d\'un coup d\'œil ce qui décroche. Je vois la **sous-livraison avant mon client**.', 'la carte du pacing'),
    ('actions', 0.6, 'Et les **chiffres deviennent des actions** : deux pour cent livrés, quarante et un mille euros à risque. C\'est déjà une tâche, avec la prochaine étape.', '2.3 % · €41,708 → tâche'),
    ('trouble', 0.6, 'Quand ça bloque, le troubleshooting est **guidé** : TWIG, Waypoint, la fenêtre de vingt-quatre heures et chaque ticket SIM.', 'le parcours TWIG → SIM', 'Quand ça bloque, le troubleshooting est guidé : Twig, Waypoint, la fenêtre de vingt-quatre heures, et chaque ticket SIM.'),
    ('5. Les clients', None, None, None),
    ('portfolio', 0.6, 'Tout mon portefeuille est **classé par urgence**.', 'les clients se trient'),
    ('sheet', 0.6, 'Un clic, et j\'ai tout le client sous les yeux : risque, prochaine étape, derniers échanges, campagnes. **Sur un seul écran**.', 'la fiche BFM'),
    ('6. La veille', None, None, None),
    ('news', 0.4, '**Sept cents** nouveautés produit ? Kiro les résume, signale ce qui demande une action, et prépare **un récap** chaque jeudi. Slack est connecté : rien ne se perd.', '739, le récap du jeudi, Slack'),
    ('7. La production', None, None, None),
    ('c5', 0.8, 'Et comme il sait tout, il produit : **une phrase**, et mon PowerPoint pour la réunion d\'équipe est prêt.', 'la phrase tapée, 8 slides'),
    ('wbr', 0.6, 'Même mon WBR **s\'écrit tout seul**, à partir de ce qui s\'est vraiment passé dans la semaine.', 'le WBR s\'écrit', 'Même mon reporting hebdo s\'écrit tout seul, à partir de ce qui s\'est vraiment passé dans la semaine.'),
    ('8. Confiance et apprentissage', None, None, None),
    ('control', 0.6, 'Je garde **le contrôle** : les brouillons arrivent dans Outlook, mais rien ne part sans moi.', 'c\'est toi qui cliques « Send »'),
    ('loop', 0.6, 'Et il apprend en continu : de **chaque mail** envoyé, **chaque document** créé, **chaque résultat** de campagne. Ses réponses et ses alertes s\'affinent jour après jour.', 'la boucle d\'apprentissage'),
    ('9. La suite', None, None, None),
    ('sfdc', 0.6, 'Prochaine étape : **Salesforce**, pour les ventes et les objectifs.', 'Salesforce rejoint le cerveau'),
    ('network', 0.6, 'Puis des **cerveaux connectés**, pour que toute l\'équipe avance ensemble.', 'le réseau de cerveaux'),
    ('outro', 0.2, '**Moins de temps à chercher. Plus de temps pour conseiller.**', '« Stop searching. Start consulting. »'),
    ('outro', 3.2, 'J.A.R.V.I.S. : le cerveau du consultant programmatique.', 'le nom, le smile, « by amazon ads »', 'Jarvis : le cerveau du consultant programmatique.'),
]
# Pitch anglais pour la voix de synthèse (miroir du pitch français)
LINES_ENP = [
    ('1. The problem', None, None, None),
    ('open', 0.9, 'Imagine: nine a.m.', '8:59 → 9:00'),
    ('storm', 0.4, 'For a Programmatic Solutions Consultant, the day starts underwater: emails, Slack, invites, DSP exports, tickets. All at once.', 'notification storm'),
    ('avalanche', 0.8, 'Every answer is already in there, somewhere: in an email, a thread, an export.', 'zoom out: one card among thousands'),
    ('avalanche', 7.1, '**But no one can see it all.**', '« No one can see it all. »'),
    ('2. The solution', None, None, None),
    ('reveal', 0.5, 'What if it all flowed into one place?', 'sources connect to the brain'),
    ('reveal', 5.4, 'So we built **J.A.R.V.I.S.**', 'flash, name and smile', 'So, we built Jarvis.'),
    ('reveal', 8.0, 'One AI brain, powered by **Kiro**, that turns all of that noise into a single place to work.', 'the app rises', 'One A.I. brain, powered by Kiro, that turns all of that noise into a single place to work.'),
    ('3. The day', None, None, None),
    ('brief', 0.6, 'Every morning, a **thirty-second** briefing tells me where to start: mail, meetings, campaigns.', 'Your day, in 30 seconds'),
    ('inbox', 0.6, 'My inbox arrives **already sorted**: what matters to me comes first.', 'inbox sorts itself'),
    ('follow', 0.6, 'No thread goes cold: every follow-up is one click away.', 'No thread goes cold'),
    ('voice', 0.6, 'And it writes **like me**: it learned my style from my emails, and every draft is grounded in **real data**: DSP results, tickets, documentation.', 'style, sources, grounded draft'),
    ('rewrite', 0.6, 'I stay in charge: a quick, messy note, even in French, and it **rewrites** it cleanly into the email.', 'rough note becomes a paragraph'),
    ('agenda', 0.6, 'Every meeting is **under control**, and forgotten invites resurface.', 'agenda'),
    ('meeting', 0.6, 'Even better: a dedicated agent prepares every meeting **the day before**. Context, numbers, talking points. I walk in **ready**.', 'prep agent, the day before'),
    ('4. Campaigns', None, None, None),
    ('c2', 0.4, 'On the campaign side, **DSP exports** feed the brain natively.', 'DSP export flows into the brain'),
    ('pacing', 0.6, 'The pacing map shows at a glance what is slipping. I see **under-delivery before my client does**.', 'pacing map'),
    ('actions', 0.6, 'And **numbers become actions**: two percent delivered, forty-one thousand euros at risk. It is already a task, with the next step.', '2.3% · €41,708 → task'),
    ('trouble', 0.6, 'When delivery breaks, troubleshooting is **guided**: TWIG, Waypoint, the twenty-four-hour window, and every SIM ticket.', 'TWIG → SIM', 'When delivery breaks, troubleshooting is guided: Twig, Waypoint, the twenty-four-hour window, and every sim ticket.'),
    ('5. Clients', None, None, None),
    ('portfolio', 0.6, 'My whole portfolio is **ranked by urgency**.', 'clients sort themselves'),
    ('sheet', 0.6, 'One click, and the whole client is in front of me: risk, next step, latest emails, campaigns. **On one screen**.', 'BFM client sheet'),
    ('6. Staying ahead', None, None, None),
    ('news', 0.4, '**Seven hundred** product updates? Kiro summarizes them, flags what needs action, and prepares **a recap** every Thursday. Slack is connected: nothing gets lost.', '739, Thursday recap, Slack'),
    ('7. Producing', None, None, None),
    ('c5', 0.8, 'And because it knows everything, it produces: **one sentence**, and my PowerPoint for the team meeting is ready.', 'typed request, 8 slides'),
    ('wbr', 0.6, 'Even my weekly business review **writes itself**, from what actually happened this week.', 'WBR writes itself'),
    ('8. Trust and learning', None, None, None),
    ('control', 0.6, 'I stay **in control**: drafts land in Outlook, but nothing goes out without me.', 'you click Send'),
    ('loop', 0.6, 'And it keeps learning: from **every email** sent, **every document** created, **every campaign result**. Its answers and alerts get sharper every day.', 'learning loop'),
    ('9. What is next', None, None, None),
    ('sfdc', 0.6, 'Next: **Salesforce**, for sales and targets.', 'Salesforce joins the brain'),
    ('network', 0.6, 'Then **connected brains**, so the whole team moves forward together.', 'brain network'),
    ('outro', 0.2, '**Stop searching. Start consulting.**', 'Stop searching. Start consulting.'),
    ('outro', 3.2, 'J.A.R.V.I.S.: the brain behind every programmatic consultant.', 'name, smile, by amazon ads', 'Jarvis. The brain behind every programmatic consultant.'),
]
OUTS = {'en': ('SCRIPT-VOIX-OFF.md', 'voix-off.srt', None), 'fr': ('SCRIPT-VOIX-OFF-FR.md', 'voix-off-fr.srt', 'vo-fr.json'),
        'en-pitch': ('SCRIPT-PITCH-EN.md', 'pitch-en.srt', 'vo-en.json')}
if LANG == 'en-pitch':
    LINES = LINES_ENP
if LANG == 'fr':
    LINES = LINES_FR

def tc(s, srt=False):
    if srt:
        ms = int(round(s * 1000)); return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"
    return f"{int(s // 60)}:{s % 60:04.1f}"

rows = [(TL[l[0]][0] + l[1], l[2], l[3]) if l[0] in TL else (None, l[0], None) for l in LINES]
say = [(TL[l[0]][0] + l[1], (l[4] if len(l) > 4 else l[2]).replace('**', '')) for l in LINES if l[0] in TL]
timed = [r for r in rows if r[0] is not None]
plain = lambda t: t.replace('**', '')
words = sum(len(plain(t).split()) for _, t, _ in timed)

# --- SRT
srt = []
for i, (a, t, _) in enumerate(timed):
    b = min(timed[i + 1][0] - 0.2 if i + 1 < len(timed) else DUR, a + 0.6 + len(plain(t).split()) * 0.42)
    srt.append(f"{i + 1}\n{tc(a, True)} --> {tc(b, True)}\n{plain(t)}\n")
open(os.path.join(ROOT, OUTS[LANG][1]), 'w').write('\n'.join(srt))
if OUTS[LANG][2]:
    json.dump([{'t': round(a, 3), 'text': t} for a, t in say], open(os.path.join(ROOT, 'build', OUTS[LANG][2]), 'w'), ensure_ascii=False, indent=1)

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
open(os.path.join(ROOT, OUTS[LANG][0]), 'w').write('\n'.join(md))
print(f"{len(timed)} lines · {words} words · {DUR} s")
