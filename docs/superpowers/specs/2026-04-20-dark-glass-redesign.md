# Design Spec — Dark Glass Redesign

**Date:** 2026-04-20
**Scope:** Refonte visuelle de l'app Govzy (dashboard + documents)

---

## Décisions de design

### 1. Fond
- Remplacement du fond blanc `bg-slate-50` par un dégradé sombre : `linear-gradient(135deg, #0a1628, #0f1f3d, #0a1628)`
- Couleur de base : `#060d1a`

### 2. Cards / composants glass
- `background: rgba(255,255,255,0.05)`
- `border: 1px solid rgba(255,255,255,0.09)`
- `backdrop-filter: blur(10px)`
- `border-radius: 14px`
- Au survol : fond légèrement plus clair + bordure orange + `translateY(-3px)` + ombre
- Au clic : `scale(0.98)`

### 3. Sidebar
- Fond : `rgba(255,255,255,0.04)` avec `border-right: 1px solid rgba(255,255,255,0.08)`
- Nav items au survol : `translateX(4px)` + icône `scale(1.15)` + fond blanc/7%
- Nav items au clic : `translateX(2px) scale(0.97)` + teinte orange
- Item actif : fond orange/15% + bordure orange/25%

### 4. Boutons principaux (shimmer)
- `background: linear-gradient(90deg, #f97316, #fbbf24, #f97316)` animé
- `animation: shimmer 4s linear infinite` (vitesse lente)
- `background-size: 200% auto`
- Au survol : `translateY(-2px)` + ombre orange renforcée
- Au clic : `scale(0.97)` + ombre réduite

### 5. Textes
- Titres : `white`
- Textes secondaires : `rgba(255,255,255,0.5)`
- Accents : `#f97316` (orange)
- Labels discrets : `rgba(255,255,255,0.2)`

---

## Fichiers à modifier

| Fichier | Changement |
|---|---|
| `app/dashboard/layout.tsx` | Fond sombre sur le wrapper |
| `app/documents/layout.tsx` | Fond sombre sur le wrapper |
| `components/dashboard/Sidebar.tsx` | Style glass + animations nav |
| `components/documents/DocumentCard.tsx` | Style glass dark |
| `app/dashboard/page.tsx` | Fond + stat cards glass |
| `app/documents/page.tsx` | Fond + titre |
| `app/dashboard/aides/page.tsx` | Style cohérent |
| `app/dashboard/alertes/page.tsx` | Style cohérent |
| `app/globals.css` | Keyframe shimmer + variables CSS |

---

## Ce qui ne change PAS
- Structure des routes et de la navigation
- Logique métier (upload, analyse, suppression)
- Couleurs de marque : orange `#f97316`, bleu `#1B3A6B` (utilisé uniquement pour le logo)
