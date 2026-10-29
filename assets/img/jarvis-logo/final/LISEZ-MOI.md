# Logo Jarvis — kit pour le site

Couleurs : orange Amazon `#FF9900` · Squid Ink `#232F3E` · fond sombre `#131921`.

## Fichiers

| Fichier | Usage |
|---|---|
| `jarvis-logo-fond-clair.svg` / `.png` (256, 512, 1024) | Logo seul, à poser sur un fond clair (pastille foncée) |
| `jarvis-logo-fond-fonce.svg` / `.png` (256, 512, 1024) | Logo seul, à poser sur un fond foncé (pastille claire) |
| `jarvis-wordmark-fond-clair.svg` / `.png` (100, 200, 400 px de haut) | Logo + « jarvis », en-tête de site sur fond clair |
| `jarvis-wordmark-fond-fonce.svg` / `.png` (100, 200, 400 px de haut) | Logo + « jarvis », en-tête de site sur fond foncé |
| `favicon.svg` | Favicon vectoriel, bascule seul en mode sombre |
| `favicon.ico` (16, 32, 48) · `favicon-16x16.png` · `favicon-32x32.png` · `favicon-48x48.png` | Favicon classique (version simplifiée sans bague, plus lisible en petit) |
| `jarvis-favicon-simplifie-fond-clair.svg` / `-fond-fonce.svg` | Source de la version simplifiée |
| `apple-touch-icon.png` (180) | Icône iPhone / iPad (fond carré) |
| `android-chrome-192x192.png` · `android-chrome-512x512.png` · `site.webmanifest` | Icônes Android / application web |
| `og-image.png` (1200×630) | Image d'aperçu lors d'un partage (LinkedIn, Slack, Teams…) |

Le texte « jarvis » est vectorisé (police Inter Bold) : aucune police à charger.

## À copier à la racine du site

`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `android-chrome-*.png`, `site.webmanifest`.

## Dans le `<head>`

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#232F3E">
<meta property="og:image" content="https://VOTRE-DOMAINE/og-image.png">
```

## Logo d'en-tête qui suit le mode clair / sombre

```html
<a href="/" class="logo">
  <picture>
    <source srcset="/img/jarvis-wordmark-fond-fonce.svg" media="(prefers-color-scheme: dark)">
    <img src="/img/jarvis-wordmark-fond-clair.svg" alt="Jarvis" height="40">
  </picture>
</a>
```
