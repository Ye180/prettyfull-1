# 🎨 Implémentation Frontend - Formulaire Multi-Step Site Content

## 📋 Vue d'ensemble

Le formulaire de création de site-content utilise une approche **progressive et sécurisée** en 3 étapes avec :

- ✅ Validation stricte à chaque étape
- 🔒 Verrouillage des étapes complétées
- 🚫 Blocage si l'API échoue
- ↩️ Redirection automatique après succès

---

## 🏗️ Architecture

### État Local

```javascript
const [step, setStep] = useState(0); // Étape courante (0, 1, 2)
const [siteContentId, setSiteContentId] = useState(null); // ID du document créé
const [completedSteps, setCompletedSteps] = useState([]); // [0, 1, 2] au fur et à mesure
```

### Mutations API

```javascript
// Step 1: Création
const createMutation = useCreateSiteContent({
	onSuccess: (data) => {
		setSiteContentId(data._id); // 💾 Sauvegarde cruciale de l'ID
		setCompletedSteps([...completedSteps, 0]);
		setStep(1); // Passage automatique
	},
});

// Step 2: Update sections 4-6
const updateStep2Mutation = useUpdateSiteContent2({
	onSuccess: () => {
		setCompletedSteps([...completedSteps, 1]);
		setStep(2); // Passage automatique
	},
});

// Step 3: Update sections 7-10 + Redirection
const updateStep3Mutation = useUpdateSiteContent3({
	onSuccess: () => {
		toast.success("Site Content créé avec succès!");
		setTimeout(() => router.push("/site-content"), 1500);
	},
});
```

---

## 🔄 Flux de Données

### 1. Step 0 → API Step 1

**Données envoyées :**

```javascript
{
  key: string,
  type: "SECTION",
  isActive: boolean,
  sortOrder: number,
  quote: { fr, en },
  first: {...},
  secondSection: {...},
  thirdSection: {...}
}
```

**Réponse attendue :**

```javascript
{
  _id: "507f1f77bcf86cd799439011",  // ⚠️ Crucial pour la suite
  key: "homepage-2025",
  ...
}
```

### 2. Step 1 → API Step 2

**Données envoyées :**

```javascript
{
  id: siteContentId,  // ← Récupéré du step 1
  fourthSection: {...},
  fiveSection: {...},
  sixSection: {...}
}
```

### 3. Step 2 → API Step 3

**Données envoyées :**

```javascript
{
  id: siteContentId,  // ← Même ID
  sevenSection: {...},
  eightSection: {...},
  nineSection: {...},
  tenSection: {...}
}
```

---

## 🔒 Système de Verrouillage

### Logique de Blocage

```javascript
// Les champs des steps complétés sont désactivés
<StepFormOne disabled={completedSteps.includes(0)} />
<StepFormTwo disabled={completedSteps.includes(1)} />
<StepFormThird disabled={completedSteps.includes(2)} />

// Le bouton "Précédent" est désactivé si l'étape précédente est complétée
<Button
  onClick={handlePrevious}
  disabled={step === 0 || completedSteps.includes(step - 1)}
/>

// Le bouton "Suivant" est désactivé pendant le chargement ou si déjà complété
<Button
  onClick={handleNext}
  disabled={isLoading || completedSteps.includes(step)}
/>
```

### Pourquoi ?

1. **Intégrité des données** : Une fois envoyé au backend, on ne peut plus modifier
2. **Cohérence** : Évite les conflits entre frontend et backend
3. **UX claire** : L'utilisateur comprend qu'il avance dans un processus linéaire

---

## ⚠️ Gestion des Erreurs

### Validation Zod (côté client)

```javascript
const isValid = await trigger(fieldsToValidate);
if (!isValid) {
	toast.error("Veuillez corriger les erreurs avant de continuer");
	return; // ❌ Bloque l'appel API
}
```

### Erreur API (côté serveur)

```javascript
onError: (error) => {
	toast.error(error?.response?.data?.message || "Erreur lors de la création");
	// L'utilisateur reste sur l'étape actuelle
	// Il peut corriger et réessayer
};
```

### Cas spéciaux

```javascript
// Si l'ID est perdu (ne devrait jamais arriver)
if (!siteContentId) {
	toast.error("ID du contenu introuvable. Veuillez recommencer.");
	return;
}
```

---

## 🎯 Indicateurs Visuels

### Stepper avec checkmarks

```jsx
<div
	className={`
  ${
		completedSteps.includes(stepNumber - 1)
			? "bg-green-500 text-white"
			: "bg-gray-200"
	}
`}
>
	{completedSteps.includes(stepNumber - 1) ? "✓" : stepNumber}
</div>
```

### Bannière de progression

```jsx
{
	siteContentId && (
		<div className="bg-blue-50 border border-blue-200">
			<p>
				✅ Document créé : <code>{siteContentId}</code>
			</p>
			<p>
				Étape {step + 1} sur 3 • {completedSteps.length} étape(s) complétée(s)
			</p>
		</div>
	);
}
```

### États de chargement

```jsx
{
	isLoading ? (
		<>
			<span>⏳</span> Enregistrement...
		</>
	) : (
		"Suivant"
	);
}
```

---

## 🛠️ Améliorations Implémentées

### 1. **Transitions automatiques**

- Dès qu'une étape réussit, passage automatique à la suivante
- Pas besoin de cliquer "Suivant" après soumission

### 2. **Feedback immédiat**

- Toast de succès/erreur
- Affichage de l'ID créé
- Compteur d'étapes complétées

### 3. **Protection contre les modifications**

- Une fois une étape complétée, impossible de revenir en arrière
- Garantit la cohérence entre frontend et backend

### 4. **Gestion des états de chargement**

- Boutons désactivés pendant les requêtes API
- Indicateur visuel (emoji ⏳)

### 5. **Redirection intelligente**

- Délai de 1,5s pour laisser le temps de voir le toast de succès
- Navigation vers `/site-content` pour voir le résultat

---

## 🧪 Scénarios de Test

### ✅ Happy Path

1. Remplir step 0 → Clic "Suivant"
2. API crée le document → Affiche ID
3. Automatiquement sur step 1 → Remplir
4. Clic "Suivant" → API met à jour
5. Automatiquement sur step 2 → Remplir
6. Clic "Enregistrer" → API finalise
7. Toast + Redirection vers `/site-content`

### ❌ Cas d'erreur

**Validation Zod échoue :**

- Reste sur l'étape actuelle
- Affiche les erreurs de formulaire
- Toast d'erreur

**API échoue (400, 500, etc.) :**

- Reste sur l'étape actuelle
- Toast avec message d'erreur
- Utilisateur peut corriger et réessayer

**Réseau coupé :**

- Loading indéfini (géré par React Query)
- Possibilité d'ajouter un timeout

---

## 📦 Dépendances Requises

```json
{
	"@tanstack/react-query": "^5.x",
	"react-hook-form": "^7.x",
	"zod": "^3.x",
	"@hookform/resolvers": "^3.x",
	"sonner": "^1.x", // Pour les toasts
	"next": "^14.x"
}
```

---

## 🔧 Configuration Requise

### 1. Provider React Query (layout.tsx)

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout({ children }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
```

### 2. Toaster (layout.tsx)

```jsx
import { Toaster } from "sonner";

<body>
	{children}
	<Toaster position="top-right" />
</body>;
```

---

## 📝 Notes pour les Développeurs

### Points d'attention

1. **L'ID est crucial** : Sans lui, impossible de continuer après step 1
2. **Ne pas modifier `completedSteps` manuellement** : Laissez les callbacks API le gérer
3. **Le `type` est hardcodé à "SECTION"** : Ajustez si besoin d'autres types
4. **Les props `disabled`** doivent être gérées dans chaque sous-composant (StepFormOne, etc.)

### Debugging

```javascript
// Ajoutez des console.log pour suivre le flux
console.log("Current step:", step);
console.log("Site content ID:", siteContentId);
console.log("Completed steps:", completedSteps);
console.log("Form values:", form.getValues());
```

### Extension future

- Ajouter un bouton "Sauvegarder comme brouillon"
- Implémenter la reprise d'un brouillon
- Ajouter un stepper horizontal cliquable (avec restrictions)
- Permettre l'édition (mode différent de la création)

---

## 🎉 Résultat Final

Un formulaire multi-step **robuste, sécurisé et user-friendly** qui :

- ✅ Garantit l'intégrité des données
- ✅ Offre un feedback clair à chaque étape
- ✅ Empêche les erreurs de manipulation
- ✅ Redirige automatiquement après succès
- ✅ Respecte les best practices React/Next.js
