# J.A.R.V.I.S. — script détaillé du film jury v2

| | |
|---|---|
| Durée | **1:30** (90,0 s) · 93 s si une citation pilote est renseignée |
| Format | 1920 × 1080, 30 i/s, son stéréo à -20 LUFS, sans voix |
| Fichiers | `livrables/JARVIS-jury-v2.mp4` (film), `JARVIS-jury-v2-apercu.mp4` (720p), `JARVIS-jury-v2-planche.png` (une image toutes les 3 s) |
| Source | `pitch-v2.html`, scènes dans `js/pitch-v2/`, **tous les chiffres dans `js/pitch-v2/config.js`** |
| Rôle | passe juste **avant la démo live** : accroche, explique ce que la démo ne montre pas (le problème, l'architecture, l'impact à l'échelle), puis passe le relais |

Tous les textes à l'écran sont en anglais et reproduits ici mot pour mot. Les timecodes sont ceux du film (m:ss.s).
Deux scènes voisines se superposent toujours 0,4 s en fondu. Les chiffres en *italique* viennent de `config.js` :
s'ils changent, le film et ce script changent avec.

---

## Vue d'ensemble

| Temps | Scène | Titre à l'écran | Ce que le jury doit retenir | Compteur |
|---|---|---|---|---|
| 0:00 → 0:08 | 1. Accroche | « 90 emails. 14 meetings. 12 campaigns. Before 10 AM. » | trop d'informations, avant même 10 h | — |
| 0:08 → 0:14 | 2. Révélation | « J.A.R.V.I.S. — Your second brain. » | le produit, en une phrase | — |
| 0:14 → 0:24 | 3. How it works | Sources → Connectors → Memory → Agents → You approve | comment ça marche, et que l'humain valide | — |
| 0:24 → 0:36 | 4. Moment fort 1 | « 90 emails. 3 lines. » | il lit tout pour moi | 0h00 → **2h00** |
| 0:36 → 0:48 | 5. Moment fort 2 | « Under-delivery? Caught first. » | il voit les problèmes avant le client | → **3h30** |
| 0:48 → 1:00 | 6. Moment fort 3 | « Your voice. Your data. » | il écrit comme moi, je garde la main | → **5h30** |
| 1:00 → 1:04 | 7. Montage A | « Walk in ready. » | réunions préparées la veille | → **6h30** |
| 1:04 → 1:08 | 8. Montage B | « One sentence. One deck. » | deck et WBR produits pour moi | → **8h00** |
| 1:08 → 1:18 | 9. Impact | « 8h back, every week. » → 3 FTE → 16 FTE | ce que ça représente à l'échelle | — |
| 1:18 → 1:23 | 10. Apprentissage | « Sharper every day. » | il s'améliore avec l'usage | — |
| 1:23 → 1:30 | 11. Relais | « Stop searching. Start consulting. » → « Let's see it live. » | place à la démo | — |

---

## 1. Accroche — 0:00 → 0:08

**Intention.** Faire sentir la surcharge en quelques secondes, avant même de parler du produit. Pas de logo d'ouverture : on entre directement dans la matinée.
**Décor.** Fond bleu nuit Amazon (#232F3E). Des notifications réalistes (Outlook, Slack, Agenda, Amazon DSP, SIM, News DSP, SharePoint) arrivent en 3D, de plus en plus vite, sur la droite de l'écran.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 0:00.0 | Écran bleu nuit. Une pastille d'horloge apparaît en haut à gauche. | **9:09** AM | nappe grave, battements lents |
| 0:00.2 | Les premières notifications surgissent du fond et avancent vers la caméra. 63 cartes au total jusqu'à 0:04.7. | ex. « Under-delivery · BFM Notoriété octobre », « PSC Brainfood Session », « #psc-fr — Quelqu'un a le deck Nintendo ? »… | un « ping » par carte, panoramique gauche/droite |
| 0:00.5 | L'horloge se met à défiler, de plus en plus vite (9:09 → 9:58 à 0:05.4). Un voile sombre couvre la moitié gauche pour le texte. | 9:09 → 9:58 | tic-tac d'horloge qui s'accélère |
| 0:00.9 | Première ligne, mot par mot, en très grand (118 px), blanc. | « ***90*** **emails.** » | impact sourd |
| 0:01.8 | Deuxième ligne. | « ***14*** **meetings.** » | impact |
| 0:02.7 | Troisième ligne. | « ***12*** **campaigns.** » | impact |
| 0:03.8 | Quatrième ligne, en dégradé orange Amazon. | « **Before 10 AM.** » | impact plus fort |
| 0:05.8 | Les quatre lignes montent et s'effacent. L'horloge disparaît. | — | coupure nette : silence d'une fraction de seconde |
| 0:05.9 | **Implosion** : toutes les notifications sont aspirées vers le centre en rétrécissant et disparaissent. | — | souffle aspiré qui monte jusqu'au flash |
| 0:06.4 → 0:08.0 | Une lueur orange grandit au centre de l'écran : la future sphère J.A.R.V.I.S. | — | arpège qui s'éclaire et accélère (montée vers la révélation) |

**À dire (proposition, anglais)** : *« Nine a.m. Ninety emails, fourteen meetings, twelve campaigns… before ten. »*

---

## 2. Révélation — 0:08 → 0:14

**Intention.** Nommer le produit et dire ce qu'il est en une phrase : un second cerveau.
**Décor.** Même fond bleu nuit ; la sphère (verre bleu nuit, cœur orange Amazon) est au centre.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 0:08.0 | La lueur devient la sphère, qui grossit. | — | — |
| 0:08.5 | **Flash** orange-blanc depuis la sphère. | — | grand impact grave (boom) + scintillement |
| 0:08.55 | Le nom apparaît, lettres très espacées qui se resserrent (jusqu'à 0:09.9). La sphère monte au-dessus du nom. | **J.A.R.V.I.S.** | |
| 0:09.3 | Le **smile Amazon** se dessine sous le nom, de gauche à droite, comme une signature. | — | souffle ascendant + scintillement |
| 0:10.0 | Première ligne, mot par mot (72 px, blanc). | « **Your second brain.** » | |
| 0:10.6 | Deuxième ligne (44 px), les trois verbes en orange. | « It **reads**, **remembers**, and **acts**. » | |
| 0:11.2 | Pastille en bas. | logo **amazon ads** \| ✦ **POWERED BY KIRO** | |
| 0:12.9 | Les textes montent et s'effacent ; la sphère redescend au centre, à sa taille du schéma suivant. | — | transition (souffle léger) |

**À dire** : *« So we built J.A.R.V.I.S. — a second brain for every PSC. It reads, it remembers, and it acts. »*

---

## 3. How it works — 0:14 → 0:24

**Intention.** Montrer l'architecture que la démo ne montre pas, en cinq colonnes lues de gauche à droite. Seuls des composants réellement visibles dans la plateforme sont nommés (synchronisation planifiée toutes les 15 minutes, Kiro CLI, « jamais envoyé »).
**Décor.** Fond bleu nuit ; la sphère est restée au centre (colonne Memory). Des lignes orange relient les colonnes ; des particules lumineuses y circulent de gauche à droite.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 0:14.1 | Petit titre en haut à gauche (orange, capitales). | **HOW IT WORKS** | début du groove : nappes |
| 0:14.2 | En-tête de colonne 1. | 01 · **Sources** | |
| 0:14.35 → 0:14.85 | Six tuiles d'application glissent depuis la gauche, une à une. | **Outlook · Slack · Calendar · Amazon DSP · SIM · Docs** | un « pop » par tuile |
| 0:14.8 | Six lignes se tracent des sources vers un même point. Les particules partent à 0:15.2. | — | crépitement de données (jusqu'à 0:22) |
| 0:15.2 | En-tête de colonne 2 et un cadre en pointillés orange. | 02 · **Connectors** | |
| 0:15.45 | Première carte. | ⟳ **Scheduled sync** — every 15 minutes | pop |
| 0:15.6 | Deuxième carte. | ▣ **Kiro CLI** — in the background | pop |
| 0:15.9 | Une ligne épaisse relie les connecteurs à la sphère. | — | |
| 0:16.0 | En-tête de colonne 3. | 03 · **Memory** | |
| 0:16.3 | La sphère s'illumine (pulsation). | — | impact doux |
| 0:16.4 / 16.55 / 16.7 | Trois pastilles orange sous la sphère. | ✎ **Your style** · 👥 **Your clients** · 🕓 **Your history** | trois « ticks » |
| 0:17.0 | En-tête de colonne 4. | 04 · **Agents** | |
| 0:17.2 → 0:17.8 | Cinq agents sortent de la sphère, chacun s'allume brièvement. | **Briefing · Pacing · Drafting · Meeting prep · Decks** | un « pop » par agent |
| 0:18.2 | En-tête de colonne 5. | 05 · **You approve** | |
| 0:18.4 | Carte verte avec un bouclier ; les cinq agents y sont reliés par des lignes vertes. | 🛡 **Nothing is sent without you.** | verrou (clic double) + carillon |
| 0:18.6 → 0:22.6 | Plan fixe : tout le schéma vit (particules, sphère qui pulse). | — | groove |
| 0:22.6 | Le schéma recule légèrement et se floute. | — | |
| 0:22.8 → 0:24.0 | Un cercle clair s'ouvre depuis la sphère et remplit l'écran : on entre dans l'application. | — | grand souffle d'ouverture |

**À dire** : *« It connects to everything we use, syncs every fifteen minutes, keeps a memory of how we work, and runs agents on top. And nothing leaves without us. »*

---

## Le cadre des scènes 4 à 8 (0:24 → 1:08)

Une seule fenêtre J.A.R.V.I.S. reste à l'écran pendant les cinq moments : on navigue dans **une seule plateforme**.

- **En haut à gauche** : le petit titre orange (« 01 · READS EVERYTHING »…), le titre principal en 84 px, puis une phrase d'explication en 30 px.
  Au moment du gain, cette phrase est remplacée par l'**étiquette de gain** : 🕓 tâche · fréquence · ~~avant~~ → **après**.
- **En haut à droite** : le **compteur** « TIME BACK · EVERY WEEK », avec la valeur en 90 px, une barre orange qui se remplit
  et la mention « estimated, per PSC ».
- **En dessous** : la fenêtre de l'application (titre « J.A.R.V.I.S. › rubrique », « Kiro brain · synced 2 min ago »,
  barre latérale bleu nuit avec Today, Inbox, Campaigns, Clients, Agenda, Docs, News, Fix et Projects). La surbrillance orange glisse vers la rubrique de chaque scène.
- **La caméra** filme l'interface (zoom de 1,1× à 2,4×) pour que le texte qui compte fasse au moins 28 px à l'écran.
- **À chaque gain** : l'étiquette apparaît, l'ancienne durée est barrée en rouge, la nouvelle « saute » en orange.
  Un jeton orange (« +2 h / week »…) vole jusqu'au compteur, qui monte et flashe en orange.

| Palier | Étiquette de gain (moment) | Jeton | Compteur atteint |
|---|---|---|---|
| 1 | Morning catch-up · every day · ~~30 min~~ → **5 min** (0:31.4) | +2 h / week | **2h00** à 0:33.4 |
| 2 | Pacing checks · every day · ~~20 min~~ → **2 min** (0:43.0) | +1 h 30 / week | **3h30** à 0:45.0 |
| 3 | Client email · each one · ~~15 min~~ → **3 min** (0:55.9) | +2 h / week | **5h30** à 0:57.9 |
| 4 | Meeting prep · each meeting · ~~20 min~~ → **0 min** (1:01.2) | +1 h / week | **6h30** à 1:03.2 |
| 5 | Weekly deck + WBR · every week · ~~1h45~~ → **15 min** (1:05.6) | +1 h 30 / week | **8h00** à 1:07.6, puis « ≈ one working day » |

---

## 4. Moment fort 1 — « 90 emails. 3 lines. » — 0:24 → 0:36

**Intention.** Le briefing du matin : tout ce qui est arrivé, réduit à trois lignes utiles.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 0:24.0 | La fenêtre monte légèrement et se pose. Barre latérale sur **Today**. | J.A.R.V.I.S. › **Today** | transition ; la batterie entre |
| 0:24.05 | Titres en haut à gauche. | 01 · READS EVERYTHING — « ***90*** **emails.** **3 lines.** » (« 3 lines. » en orange) | |
| 0:24.55 | Phrase d'explication. Le compteur apparaît à droite à 0h00. | « Mail, Slack, agenda and campaigns, distilled into one briefing every morning. » | |
| 0:24.55 | Dans la fenêtre : une carte **Since yesterday** avec trois compteurs, puis un flot de messages qui défile de plus en plus vite (caméra 1,55×). | Since yesterday — ✉ ***90*** emails · 📅 ***14*** meetings · 📊 ***12*** campaigns ; lignes Outlook, Slack, Calendar, Amazon DSP, SIM, News DSP | crépitement de données |
| 0:26.5 | Le flot rétrécit, se floute et disparaît. | — | petite aspiration |
| 0:26.8 | La carte du briefing monte à sa place. | **Good morning, Valentin** — Wednesday, October 7 · automatic briefing at 08:30 · [⟳ Sync] | |
| 0:27.2 → 0:28.1 | Quatre indicateurs comptent jusqu'à leur valeur. | **3** meetings today · **2** to do today · 1 overdue · **0** to handle right away · **6** possible follow-ups | quatre « pops » |
| 0:27.2 → 0:28.2 | La caméra descend sur le bloc **Today's essentials** (texte en ~35 px). | 🧠 **Today's essentials** · WRITTEN BY KIRO | |
| 0:27.9 | La ligne 1 s'écrit. | 1. Since yesterday: **nothing heavy in the mail**, six messages, mostly acknowledgements. | frappe au clavier |
| 0:29.0 | La ligne 2 s'écrit. | 2. **ENI Plénitude is unblocked**: IAS workaround sent to Amnet, creatives still have to pass the audit. | frappe |
| 0:30.2 | La ligne 3 s'écrit (« BFM » en rouge). | 3. One hot spot left: **BFM**, still no delivery on SVOD and CUTV, two tickets in progress. | frappe |
| 0:31.4 | La phrase d'explication laisse la place à l'étiquette de gain. | 🕓 **Morning catch-up** · every day ~~30 min~~ → **5 min** | « pop » puis « tick » |
| 0:31.9 | La ligne 3 pulse en rouge clair (point chaud). | — | alerte (deux notes de cloche) |
| 0:32.0 → 0:32.75 | Le jeton vole vers le compteur. | **+2 h / week** | souffle ascendant |
| 0:32.7 → 0:33.4 | Le compteur monte et flashe en orange. | 0h00 → **2h00** | tic-tic de comptage, puis carillon |
| 0:35.9 | Titre et interface s'effacent vers le haut. | — | |

**À dire** : *« Every morning, ninety emails become three lines. »*

---

## 5. Moment fort 2 — « Under-delivery? Caught first. » — 0:36 → 0:48

**Intention.** Les exports DSP lus automatiquement : la sous-livraison est repérée, chiffrée et transformée en tâche.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 0:36.0 | Barre latérale sur **Campaigns**. Titres en haut. | J.A.R.V.I.S. › **Campaigns** — 02 · SPOTS PROBLEMS FIRST — « **Under-delivery?** **Caught first.** » (« Caught first. » en orange) | transition ; la basse entre |
| 0:36.55 | Phrase d'explication. | « Every DSP export read, every campaign on one pacing map. » | |
| 0:36.3 → 0:37.1 | Plan large (caméra 1,12×) : la barre tricolore se remplit, avec sa légende. | ● **5** to catch up · ● **15** to watch · ● **20** on pace — **Pacing map** · one dot per campaign · below the line: behind | |
| 0:36.5 | La diagonale « au rythme » se trace en pointillés. | axes 0–100 % · time elapsed | |
| 0:36.6 → 0:38.3 | Une quarantaine de points (une campagne chacun) apparaissent en rebondissant, de gauche à droite : verts sur la diagonale, ambre en dessous, cinq rouges tout en bas. | — | petits « ticks » |
| 0:38.2 | Indication de retard. | behind ↓ | |
| 0:38.4 | Les points rouges émettent des ondes. | — | alerte |
| 0:38.6 | Un anneau orange en pointillés tourne autour du point le plus en retard. | — | |
| 0:38.9 | Étiquette reliée au point. | **FR · BFM · Connected TV SVOD** | |
| 0:39.0 → 0:40.0 | **Zoom caméra ×2,4** sur ce point ; il reste au premier plan avec son étiquette (42 px). | — | souffle (whoosh) |
| 0:40.5 → 0:41.4 | La caméra recule (1,5×) ; une carte monte par-dessus la carte du pacing. | **73** · **FR - BFM · Connected TV SVOD** — Banque Française Mutualiste · Amnet · October awareness — CATCH UP | souffle ascendant |
| 0:41.0 → 0:42.3 | Trois indicateurs comptent (chiffres de 87 px à l'écran). | DELIVERED **2.3%** (for 29% of the flight) · PACE NEEDED **×9.4** (to land on budget) · AT RISK **€41,708** (ends 15/11) | tic-tic de comptage |
| 0:42.1 | La ligne de tâche apparaît ; la case se coche en vert à 0:42.25. | ☑ **Task created: chase Amnet and the publishers on SVOD and CUTV** — ✦ from the DSP export | impact + carillon |
| 0:42.4 | Trois étiquettes sous la tâche. | URGENT · 📅 tomorrow · 🎫 2 SIM tickets followed | |
| 0:42.2 → 0:43.0 | La caméra recadre pour garder toute la carte au-dessus. | — | |
| 0:43.0 | Étiquette de gain. | 🕓 **Pacing checks** · every day ~~20 min~~ → **2 min** | pop, tick |
| 0:43.6 → 0:45.0 | Jeton puis compteur. | **+1 h 30 / week** — 2h00 → **3h30** | souffle, comptage, carillon |
| 0:47.9 | Sortie. | — | |

**À dire** : *« It reads every DSP export: under-delivery is caught first, priced, and turned into a task. »*

---

## 6. Moment fort 3 — « Your voice. Your data. » — 0:48 → 1:00

**Intention.** Les réponses aux clients, écrites dans le style du PSC et sourcées. Une note en français est réécrite proprement.
On termine sur la confiance : rien n'est envoyé automatiquement, c'est le PSC qui clique sur « Send ».

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 0:48.0 | Barre latérale sur **Inbox**. Titres. | J.A.R.V.I.S. › **Inbox** — 03 · WRITES LIKE YOU — « **Your voice.** **Your data.** » | transition |
| 0:48.55 | Phrase d'explication. | « Drafts in your style, grounded in live results. You review, you send. » | |
| 0:48.1 | Un brouillon Outlook (caméra 1,6×, texte en ~30 px). | [➤ **Send**] ✉ **Outlook · Drafts** — DRAFT · NOT SENT — To: Annemarie Kalinka (Amnetgroup) — Subject: RE: BFM · SVOD delivery | |
| 0:48.5 → 0:49.0 | À droite, la colonne des sources glisse en place. | GROUNDED IN — ✎ **Your writing style** (learned from your sent emails) · 📊 **DSP export 06/10** (SVOD 2.3% · €41.7k at risk) · 🎫 **SIM P529341292** (In progress · PSC-T) · ✉ **Thread history** (11 messages with Amnet) · 📄 **Waypoint SOP** (Escalation checklist) | cinq « pops » |
| 0:48.9 → 0:51.9 | Le mail s'écrit. Chaque passage clé est surligné en orange et suivi d'une étiquette de source ; la carte source correspondante s'allume au même instant. La caméra suit le texte. | Hello Annemarie, `STYLE` / Quick update on BFM: SVOD is at **2.3% delivered** `DSP` for 29% of the flight, about **€41.7k at risk** `DSP`. / **Ticket P529341292** `SIM` is open with PSC-T, as discussed in our last **exchange** `THREAD`. Could you check **the max bid against the deal floor** `SOP`? | frappe continue + un « tick » à chaque étiquette |
| 0:52.0 | Formule de fin. | Thanks! / Valentin `STYLE` — ✦ Drafted by Kiro, in your voice | |
| 0:52.6 → 0:53.7 | La caméra descend sur la barre de note, où une phrase s'écrit en français. | ✎ « dis-lui qu'on passe la ligne CUTV à 1 € et qu'on relance Equativ demain » | frappe |
| 0:53.8 | Clic sur la flèche orange. | — | clic |
| 0:53.9 → 0:55.0 | La note monte dans le mail ; un espace s'ouvre entre le 2e paragraphe et la signature ; le texte français se transforme en paragraphe anglais, surligné en orange qui s'estompe. | « We'll also set the Equativ CUTV line to €1 so the algorithm can reallocate its budget, and I'll follow up with Equativ tomorrow morning. » | souffle ascendant + scintillement |
| 0:55.2 / 0:55.35 | Deux étiquettes sous les sources. | ✦ **Rewritten in your style** · **French → English** | |
| 0:55.7 → 0:56.6 | La caméra remonte en haut du brouillon ; les sources s'estompent. | — | |
| 0:55.9 | Étiquette de gain. | 🕓 **Client email** · each one ~~15 min~~ → **3 min** | pop, tick |
| 0:56.7 | Badge noir à droite du brouillon. | 🛡 **Never sent automatically** | verrou |
| 0:56.9 → 0:57.35 | Le curseur se déplace jusqu'au bouton Send. | — | |
| 0:57.6 | **Clic sur Send.** L'étiquette du brouillon passe au vert. | DRAFT · NOT SENT → **SENT BY YOU** | clic |
| 0:57.8 | Bulle de confirmation. | ✓ **Sent by you · 10:42** | carillon |
| 0:56.5 → 0:57.9 | Jeton puis compteur. | **+2 h / week** — 3h30 → **5h30** | souffle, comptage, carillon |
| 0:59.9 | Sortie. | — | |

**À dire** : *« It drafts in my voice, grounded in live data. I add a note in French, it rewrites it. And I'm the one who hits send. »*

---

## 7. Montage A — « Walk in ready. » — 1:00 → 1:04

**Intention.** Rythme soutenu : une seule ligne de titre ; la préparation de réunion faite la veille par un agent dédié.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 1:00.0 | Barre latérale sur **Agenda**. Titres. | J.A.R.V.I.S. › **Agenda** — 04 · PREPARES EVERY MEETING — « **Walk in** **ready.** » | transition |
| 1:00.15 | Frise (caméra 1,55×) : deux étapes reliées. | 🧠 **Wed · 17:33** — Prep agent runs, on its own ⟶ 📅 **Thu · 11:00** — 2026 H2 FR PSC Meeting + PAM | |
| 1:00.35 → 1:01.15 | Une barre orange relie les deux dates ; libellé au-dessus. | PREPARED 17 H AHEAD | note montante |
| 1:00.9 | La fiche de préparation monte. | **Meeting prep · 2026 H2 FR PSC Meeting** — [prep agent] [ready the day before] — Built from your emails, the campaign data and the last meeting notes. | pop |
| 1:01.2 → 1:01.95 | Six rubriques apparaissent. | WHO'S IN THE ROOM: PSC France team · PAM · organizer: PSC lead — SINCE LAST TIME: AST-PSC switch confirmed: one owner per account from 16/10 — NUMBERS TO KNOW: 40 live campaigns · 5 to catch up · 2 SIM tickets open on BFM — TALKING POINTS: Accounts to hand over before 16/10 · C-SAT signals — WATCH OUT (rouge): BFM: ~€51k at risk, no agency thread yet — YOUR ASK: Agree on an owner for the Equativ escalation | six « ticks » |
| 1:01.2 | Étiquette de gain (pas de phrase d'explication dans le montage). | 🕓 **Meeting prep** · each meeting ~~20 min~~ → **0 min** | pop, tick |
| 1:01.8 → 1:03.2 | Jeton puis compteur. | **+1 h / week** — 5h30 → **6h30** | souffle, comptage, carillon |
| 1:02.2 → 1:03.4 | La caméra descend : la frise sort par le haut, les six rubriques sont entières à l'écran. | — | |

---

## 8. Montage B — « One sentence. One deck. » — 1:04 → 1:08

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 1:04.0 | Barre latérale sur **Docs**. Titres. | J.A.R.V.I.S. › **Documents** — 05 · BUILDS YOUR DELIVERABLES — « **One sentence.** **One deck.** » | transition |
| 1:04.15 → 1:05.15 | Une barre de commande bleu nuit ; la demande s'écrit. | ✦ « Make the PowerPoint for Thursday's PSC team meeting. » | frappe |
| 1:05.2 | Clic sur la flèche orange. | — | clic + souffle |
| 1:05.3 | Statut avec un indicateur qui tourne. | agent Kiro is drafting · Amazon Ads design system | |
| 1:05.4 → 1:06.3 | Huit slides s'envolent de la barre et se rangent en grille 4 × 2. | **Weekly PSC FR** (October 8, 2026, couverture bleu nuit) · Agenda · Pacing overview · Hot spots (BFM · SVOD, Disney · Whalefall, GAE · SPF M6) · News DSP (process, available) · Wins of the week (+2) · WBR highlights · Next steps | une carte posée par slide |
| 1:05.6 | Étiquette de gain. | 🕓 **Weekly deck + WBR** · every week ~~1h45~~ → **15 min** | pop, tick |
| 1:06.4 | Le statut passe au vert ; le fichier apparaît. | ✓ **8 slides ready** · Amazon Ads design system — PPTX **Weekly PSC FR · 8 October.pptx** · 8 slides · Amazon Ads design system · saved to Documents · ✓ ready | carillon |
| 1:06.7 | Le WBR apparaît dessous. | WBR **WBR 2026-W41 · BFM under-delivery, €54,564 at risk** · context · impact · so what · next steps, from this week's data · ⧉ ready to paste | pop |
| 1:06.1 → 1:07.0 | La caméra zoome (1,6×) sur les deux fichiers. | — | |
| 1:06.2 → 1:07.6 | Jeton puis compteur ; la mention apparaît à côté. | **+1 h 30 / week** — 6h30 → **8h00** · **≈ one working day** | souffle, comptage, carillon |
| 1:07.8 → 1:08.4 | La fenêtre recule et s'efface ; le fond passe au bleu nuit. | — | souffle descendant |

**À dire (pour les deux montages)** : *« Meetings are prepared the day before. And one sentence gives me the deck and the WBR. »*

---

## 9. Impact — 1:08 → 1:18

**Intention.** Passer de « ça m'aide » à « ça change l'équipe » : le gain par personne, puis à l'échelle de la France et de l'Europe.
Les chiffres sont calculés depuis `config.js` : FTE = *NB_PSC* × *8* / *40* ; heures par an = *NB_PSC_EU* × *8* × *46*.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 1:08.0 → 1:08.6 | Fondu vers le bleu nuit. | — | souffle descendant |
| 1:08.2 | Petit titre et chiffre géant (dégradé orange, 300 px). | TIME BACK · PER PSC — ***8h*** | impact |
| 1:08.5 | À côté du chiffre, mot par mot. | **back,** / **every week.** (en orange) | |
| 1:09.2 | Sous le chiffre. | **One working day.** Every week. | carillon |
| 1:11.0 → 1:11.8 | Ce bloc rétrécit et se range en haut à gauche, comme un rappel. | — | souffle |
| 1:11.3 | Texte à gauche. | ***15*** **PSCs in France** — **→ *3* FTE back** (dégradé orange, 116 px) | |
| 1:11.4 → 1:12.0 | À droite, 15 silhouettes (5 × 3) apparaissent une à une. | — | 15 petits « ticks » |
| 1:12.4 | La première colonne (3 silhouettes) s'allume en orange. | — | impact |
| 1:12.7 | Légende sous la grille. | 1 PSC in 5 · **8 h** of every **40 h** week back | |
| 1:14.3 → 1:14.6 | La France s'efface. | — | souffle |
| 1:14.7 | Nouveau texte à gauche. | ***80*** **PSCs across Europe** — **→ *16* FTE back** | |
| 1:14.8 → 1:15.4 | 80 silhouettes (10 × 8) apparaissent en vague, en diagonale. | — | crépitement |
| 1:16.0 | Les deux premières colonnes (16 silhouettes) s'allument. | — | impact |
| 1:16.2 → 1:17.6 | Le nombre d'heures compte jusqu'à sa valeur. | ***29,440*** hours / year | comptage |
| 1:17.9 → 1:18.4 | Fondu de sortie. | — | |
| *(si `PILOT_QUOTE` est renseignée)* 1:18.2 → 1:21.4 | Le reste s'efface ; la citation s'affiche seule, 3 s de plus (le film passe à 93 s). | « *PILOT_QUOTE* » — *PILOT_QUOTE_AUTHOR* | souffle + carillon |

**À dire** : *« That's eight hours back every week, per PSC. Fifteen PSCs in France: three full-time people. Eighty across Europe: sixteen — almost thirty thousand hours a year. »*

---

## 10. Apprentissage — 1:18 → 1:23

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 1:18.0 | Bleu nuit. Titres à gauche. | — ALWAYS LEARNING — « **Sharper** **every day.** » (« every day. » en orange) | partie plus calme, montée vers la fin |
| 1:18.5 → 1:18.95 | Quatre sources d'apprentissage, une à une. | ✉ **Every email you send** · 📄 **Every document you create** · 📊 **Every campaign result** · ☑ **Every correction you make** | quatre « pops » |
| 1:18.9 | De petites icônes colorées s'envolent de chaque ligne vers la sphère (à droite), qui grossit et brille davantage ; une orbite pointillée tourne autour. | — | crépitement de données |
| 1:18.8 → 1:22.8 | En bas, une frise se remplit. | DAY 1 ——●—— DAY 90 | scintillement à 1:21.0 |

**À dire** : *« And it gets sharper every day. »*

---

## 11. Relais vers la démo — 1:23 → 1:30

**Intention.** Finir sur la promesse, puis passer la main au live. Le fond est l'écran d'accueil de la plateforme, celui que le jury verra juste après.

| Temps | À l'image | Texte à l'écran | Son |
|---|---|---|---|
| 1:23.0 | Fond : l'écran d'accueil (« Good morning, Valentin », Today's essentials, To do today, Meetings), flouté sous un voile bleu nuit, qui avance lentement. | — | |
| 1:23.25 | Grande ligne blanche (150 px). | **Stop searching.** | impact |
| 1:23.95 | Deuxième ligne, en orange. | **Start consulting.** | impact plus fort |
| 1:25.2 → 1:25.65 | Les deux lignes montent et s'effacent. | — | |
| 1:25.6 | Petite sphère, puis le nom. | **J.A.R.V.I.S.** | **accord final** (boom + carillon) |
| 1:26.0 → 1:26.7 | Le smile Amazon se dessine sous le nom. | — | souffle ascendant |
| 1:25.9 | Grande ligne, mot par mot (160 px), « live. » en orange. | « **Let's see it live.** » | |
| 1:26.7 | En dessous. | BY **amazon ads** | |
| 1:27.2 | Crédits. | Built by Valentin & Diane · PSC France | |
| 1:27.6 → 1:30.0 | Le fond se précise et s'éclaircit un peu (moins de flou, voile allégé) : l'écran d'accueil de la plateforme apparaît sous le texte, comme un passage de témoin vers la démo. Le film se termine sur cette image, sans noir. | — | le son s'éteint sur les 2,4 dernières secondes |

**À dire** : *« Stop searching. Start consulting. Let's see it live. »*

---

## Musique et bruitages

Tout est synthétisé (aucun échantillon, aucun droit à payer) par `audio/make_audio.py`. La musique est calée sur des repères nommés dans `js/pitch-v2/v2-end.js`.

| Temps | Musique |
|---|---|
| 0:00 → 0:05.9 | Nappe grave et souffle, battements de grosse caisse de plus en plus rapprochés, grappe d'accords dissonants qui monte. Tic-tac d'horloge et « pings » des notifications. |
| 0:05.9 | Coupure nette : presque le silence, l'implosion commence. |
| 0:06.9 → 0:08.5 | Arpège qui monte et s'accélère vers la révélation. |
| 0:08.5 | Flash : impact grave, puis grand accord large (ré majeur 9) qui s'épanouit. |
| 0:14.2 | Début du groove à 100 BPM (ré maj9 → si min9 → sol maj9 → la 6sus4) : nappes + arpège. |
| 0:24.0 | La batterie entre (moments forts). |
| 0:36.0 | Basse et charleston entrent. |
| 1:00 → 1:08 | Intensité qui monte pour le montage rapide. |
| 1:08 | Point culminant pour l'impact. |
| 1:18 | Partie plus calme et plus claire (apprentissage), une montée commence vers la fin. |
| 1:25.6 | Accord final long sur « J.A.R.V.I.S. », qui s'éteint avec l'image. |

Mixage : -20 LUFS, assez bas pour parler par-dessus sans micro trop fort. La bande-son seule est dans `livrables/bande-son-v2.wav`.

---

## D'où viennent les chiffres

| Chiffre | Origine |
|---|---|
| 90 emails | `EMAILS_COUNT` = « 90 messages » de la boîte J.A.R.V.I.S. (Pour moi · 7 jours) |
| 14 meetings · 12 campaigns | `MEETINGS_COUNT`, `CAMPAIGNS_COUNT` (tes chiffres) |
| Gains 30→5, 20→2, 15→3, 20→0 min, 1h45→15 min | `GAINS` : **estimations**, affichées comme telles (« estimated, per PSC ») |
| 8 h / semaine | somme des cinq gains (= `HOURS_SAVED_PER_WEEK`) |
| 3 FTE · 16 FTE · 29,440 h/an | calculés : 15 × 8 / 40 ; 80 × 8 / 40 ; 80 × 8 × 46 |
| 2.3 % · ×9,4 · €41,708 · tâche BFM | écrans de la plateforme (export DSP du 06/10) |
| Sync toutes les 15 min · Kiro CLI · « jamais envoyé » | écrans de la plateforme (page Cerveau) |

## Variantes (dans `config.js`)

- **`ANONYMIZE: true`** : tous les noms de clients, d'agences et de personnes sont remplacés partout dans le film (« BFM » → « Client A », « Amnet » → « Agency A », « Annemarie » → « Alex »…).
- **`PILOT_QUOTE`** (+ `PILOT_QUOTE_AUTHOR`) : ajoute la citation à la fin de l'impact ; le film passe à 93 s.
- **`TARGET_DURATION: 120`** : les trois moments forts durent 18 s au lieu de 12 (plus de temps pour parler, même animation) et la scène « Next: Salesforce. » revient avant le relais (durée réelle : 1:54, ou 1:57 avec la citation).

## Encore à remplir

- `PILOT_QUOTE` et `PILOT_QUOTE_AUTHOR` (optionnels).
- `CONNECTORS` : comment chaque source est branchée. Tant que c'est `TODO`, le schéma ne montre que la synchronisation planifiée et Kiro CLI.
- Les gains de temps restent des estimations à confirmer avec les utilisateurs pilotes.

---

## Texte à dire d'un seul tenant (proposition, ~150 mots)

> Nine a.m. Ninety emails, fourteen meetings, twelve campaigns… before ten.
> So we built J.A.R.V.I.S. — a second brain for every PSC. It reads, it remembers, and it acts.
> It connects to everything we use, syncs every fifteen minutes, keeps a memory of how we work, and runs agents on top. And nothing leaves without us.
> Every morning, ninety emails become three lines.
> It reads every DSP export: under-delivery is caught first, priced, and turned into a task.
> It drafts in my voice, grounded in live data. I add a note in French, it rewrites it. And I'm the one who hits send.
> Meetings are prepared the day before. And one sentence gives me the deck and the WBR.
> That's eight hours back every week, per PSC. Fifteen PSCs in France: three full-time people. Eighty across Europe: sixteen — almost thirty thousand hours a year.
> And it gets sharper every day.
> Stop searching. Start consulting. Let's see it live.
