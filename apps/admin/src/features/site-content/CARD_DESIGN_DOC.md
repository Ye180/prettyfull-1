# 🎨 Documentation du Design - Card Site Content

## 📐 Vue d'ensemble

Le composant `CardSiteContent` présente les contenus du site dans un design **moderne, élégant et interactif** avec :

- ✨ Effets visuels subtils (gradient, glassmorphism, animations)
- 📱 Design responsive (1-4 colonnes selon la taille d'écran)
- 🎯 Actions rapides (voir, éditer, supprimer)
- 🏷️ Badges de statut et de type
- 🌊 Animations fluides au hover

---

## 🎨 Structure Visuelle

```
┌─────────────────────────────────────────┐
│  🌟 HEADER (Gradient sombre)           │
│  ┌──────┐  SECTION    [⋮ Menu]        │
│  │ 📄  │                               │
│  └──────┘  ● Actif                     │
├─────────────────────────────────────────┤
│  📝 CORPS                               │
│  Page d'accueil - Hero                 │
│  homepage-hero                          │
│                                         │
│  Section principale de la page...      │
│                                         │
│  10 sections  •  #1 ordre              │
│  Mis à jour le 10/11/2025              │
├─────────────────────────────────────────┤
│  🎯 FOOTER                              │
│  [👁️ Voir en détail]                   │
└─────────────────────────────────────────┘
```

---

## 🎨 Palette de Couleurs

### Carte principale

```css
Fond : gradient-to-br from-slate-50 via-white to-slate-50
Bordure : border-slate-200 → hover:border-slate-300
Ombre : hover:shadow-2xl
```

### Header (gradient sombre)

```css
Background : gradient-to-br from-slate-900 via-slate-800 to-slate-900
Effets décoratifs :
  - Blob blanc (opacity-10, blur-3xl)
  - Blob bleu (bg-blue-500, blur-2xl)
```

### Badges de type

```javascript
SECTION  : bg-blue-100 text-blue-700 border-blue-200
CATEGORY : bg-purple-100 text-purple-700 border-purple-200
BANNER   : bg-orange-100 text-orange-700 border-orange-200
```

### Badge de statut

```css
Actif   : bg-green-500/20 text-green-100 border-green-400/30
Inactif : bg-red-500/20 text-red-100 border-red-400/30
```

---

## ✨ Effets et Animations

### 1. Hover sur la carte

```css
/* Transformation et ombre */
hover:-translate-y-1
hover:shadow-2xl
transition-all duration-300

/* Brillance subtile */
.group-hover:opacity-100
bg-gradient-to-tr from-transparent via-white/5 to-transparent
```

### 2. Badge de statut animé

```css
/* Point pulsant */
animate-pulse
w-1.5 h-1.5 rounded-full bg-green-400
```

### 3. Bouton d'action

```css
/* Changement de couleur */
bg-slate-100 → hover:bg-slate-900
text-slate-700 → hover:text-white

/* Icône qui scale */
group-hover/btn:scale-110
```

### 4. Titre interactif

```css
group-hover: text-blue-600 transition-colors;
```

---

## 📱 Responsive Design

```css
/* Grid adaptatif */
grid-cols-1           /* Mobile : 1 colonne */
md:grid-cols-2        /* Tablette : 2 colonnes */
lg:grid-cols-3        /* Desktop : 3 colonnes */
xl:grid-cols-4        /* Large screen : 4 colonnes */

gap-6                 /* Espacement uniforme */
```

---

## 🎯 Composants UI Utilisés

### Dropdown Menu (lucide-react + shadcn/ui)

```jsx
<DropdownMenu>
	<DropdownMenuTrigger>
		<MoreVertical />
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		<DropdownMenuItem>Voir</DropdownMenuItem>
		<DropdownMenuItem>Modifier</DropdownMenuItem>
		<DropdownMenuItem>Supprimer</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
```

### Badge (shadcn/ui)

```jsx
<Badge variant="outline" className={getTypeColor(type)}>
	{type}
</Badge>
```

### Icons (lucide-react)

```jsx
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
```

---

## 🔧 Données Affichées

### Par carte

| Champ           | Description                    | Affichage                |
| --------------- | ------------------------------ | ------------------------ |
| `key`           | Identifiant unique             | Texte mono petit         |
| `title`         | Titre du contenu               | H3 bold, line-clamp-1    |
| `type`          | Type (SECTION/CATEGORY/BANNER) | Badge coloré             |
| `description`   | Description courte             | line-clamp-2             |
| `isActive`      | Statut actif/inactif           | Badge animé              |
| `sortOrder`     | Ordre d'affichage              | Métadonnée (#1)          |
| `sectionsCount` | Nombre de sections             | Métadonnée (10 sections) |
| `updatedAt`     | Date de MAJ                    | Format français          |

---

## 🎨 Variantes de Design

### État Vide

```jsx
{
	siteContents.length === 0 && (
		<div className="empty-state">
			<div className="icon-circle">📄</div>
			<h3>Aucun contenu pour le moment</h3>
			<p>Commencez par créer votre premier contenu</p>
			<Link href="/add-content">Créer un contenu</Link>
		</div>
	);
}
```

### Motif de fond décoratif

```jsx
<div className="absolute inset-0 opacity-10">
	{/* Blobs flous pour effet glassmorphism */}
	<div className="blob-white" />
	<div className="blob-blue" />
</div>
```

---

## 🚀 Améliorations Futures

### Phase 1 (Priorité Haute)

- [ ] Connecter à l'API réelle (remplacer les données mock)
- [ ] Implémenter les actions (éditer, supprimer, voir)
- [ ] Ajouter un système de filtrage (par type, statut)
- [ ] Pagination si > 12 éléments

### Phase 2 (Priorité Moyenne)

- [ ] Mode grille/liste switchable
- [ ] Recherche en temps réel
- [ ] Drag & drop pour réorganiser (sortOrder)
- [ ] Prévisualisation rapide au hover (tooltip)

### Phase 3 (Priorité Basse)

- [ ] Vue compacte optionnelle
- [ ] Export des données (CSV, JSON)
- [ ] Historique des modifications
- [ ] Thème sombre

---

## 🎓 Points Clés du Design

### 1. Hiérarchie Visuelle

- **Header sombre** : Attire l'œil avec le gradient
- **Corps clair** : Lisibilité maximale pour le contenu
- **Footer subtil** : Action secondaire mais accessible

### 2. Glassmorphism Moderne

- Backdrop blur sur les badges
- Opacity subtile sur les éléments de fond
- Effets de brillance au hover

### 3. Micro-interactions

- Point pulsant sur le badge de statut
- Icône qui scale au hover du bouton
- Carte qui se soulève (translate-y)

### 4. Accessibilité

- Contrastes respectés (WCAG AA)
- Focus states visuels
- Textes lisibles (taille >= 14px)

---

## 📦 Dépendances Requises

```json
{
	"lucide-react": "^0.x", // Icônes
	"next": "^14.x", // Framework
	"@radix-ui/react-dropdown-menu": "^2.x", // Dropdown
	"tailwindcss": "^3.x", // Styling
	"class-variance-authority": "^0.x" // Badge variants (optionnel)
}
```

---

## 🔍 Checklist Design

### Avant de pousser en production

- [ ] Tester sur mobile (320px → 768px)
- [ ] Tester sur tablette (768px → 1024px)
- [ ] Tester sur desktop (1024px+)
- [ ] Vérifier les contrastes (outils accessibilité)
- [ ] Tester avec 0 élément (empty state)
- [ ] Tester avec 1 élément
- [ ] Tester avec 20+ éléments (scroll)
- [ ] Vérifier les animations (pas de lag)
- [ ] Tester le dropdown menu (alignement)

---

## 💡 Tips d'Utilisation

### Personnaliser les couleurs

```javascript
// Modifier la fonction getTypeColor()
const getTypeColor = (type) => {
	return {
		SECTION: "bg-pink-100 text-pink-700", // Custom
		// ...
	}[type];
};
```

### Ajouter un nouveau type

```javascript
const getTypeIcon = (type) => {
	return {
		SECTION: "📄",
		CATEGORY: "📁",
		BANNER: "🎨",
		PROMOTION: "🎁", // Nouveau
	}[type];
};
```

### Changer la disposition

```css
/* Passer à 5 colonnes sur très grand écran */
<div className="grid ... xl:grid-cols-4 2xl:grid-cols-5">
```

---

## 🎉 Résultat Final

Un design **professionnel, moderne et engageant** qui :

- ✅ Attire l'œil sans être surchargé
- ✅ Facilite la navigation et les actions
- ✅ S'adapte à tous les écrans
- ✅ Offre un feedback visuel clair
- ✅ Respecte les best practices UI/UX

**Preview disponible à :** `/site-content`
