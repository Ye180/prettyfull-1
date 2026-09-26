export interface FaqItem {
	title: string;
	description: string;
	category: string;
}

// ponytail: static hand-authored content, categories inferred from titles - not backend-driven
export const DataRule: FaqItem[] = [
	{
		title: "ARTICLES EN PRÉCOMMANDE / ACHAT GROUPÉ",
		category: "Commandes",
		description:
			"Certains produits sont en rupture temporaire et proposés en précommande en attendant le réapprovisionnement. Une fois la commande validée, aucune annulation n'est possible sur ces produits. Retrouvez le détail de cette politique dans nos Conditions Générales de Vente. Merci de vérifier votre colis dès sa réception et de nous contacter immédiatement si le produit est défectueux, endommagé ou ne correspond pas à votre commande, afin que nous puissions étudier la situation et trouver une solution rapidement.",
	},
	{
		title: "COMMENT SUIVRE MA COMMANDE ?",
		category: "Commandes",
		description:
			"Dès l'expédition de votre commande, vous recevez un e-mail contenant un lien de suivi. Vous pouvez également retrouver ce lien à tout moment dans la section « Mes commandes » de votre compte.",
	},
	{
		title: "PUIS-JE MODIFIER OU ANNULER MA COMMANDE ?",
		category: "Commandes",
		description:
			"Contactez-nous le plus rapidement possible après validation de votre commande. Tant qu'elle n'est pas encore préparée pour expédition, nous pouvons modifier l'adresse, la taille ou annuler la commande.",
	},
	{
		title: "QUELS SONT LES DÉLAIS DE LIVRAISON ?",
		category: "Livraison",
		description:
			"Les commandes sont expédiées sous 2 à 5 jours ouvrés. Comptez ensuite 2 à 4 jours ouvrés pour une livraison standard en France métropolitaine, et 5 à 10 jours ouvrés pour les livraisons internationales.",
	},
	{
		title: "LIVREZ-VOUS À L'INTERNATIONAL ?",
		category: "Livraison",
		description:
			"Oui, nous livrons dans la majorité des pays d'Europe ainsi qu'en Amérique du Nord. Les frais de douane éventuels restent à la charge du destinataire selon la réglementation locale.",
	},
	{
		title: "ARTICLES EN STOCK",
		category: "Retours & Échanges",
		description:
			"Les retours, échanges ou remplacements partiels (selon notre appréciation après examen du problème) sont possibles dans un délai de 30 jours après l'achat, uniquement pour les défauts majeurs ou non-conformités (les défauts mineurs ne sont pas concernés). Consultez ci-dessous la définition d'un défaut majeur.",
	},
	{
		title: "ÉCHANGES",
		category: "Retours & Échanges",
		description:
			"Le moyen le plus rapide d'obtenir l'article souhaité est de nous retourner celui que vous possédez puis, une fois le retour accepté, de passer une nouvelle commande séparée pour le nouvel article. Les frais d'expédition du retour restent à votre charge. Nous ne pouvons garantir la bonne réception de votre colis retourné : nous vous recommandons donc d'utiliser un mode d'envoi avec suivi et assurance.",
	},
	{
		title: "DOMMAGES ET PROBLÈMES CONSTATÉS",
		category: "Retours & Échanges",
		description:
			"En raison de la nature des produits, de légères variations d'aspect (étiquette, packaging) peuvent subsister sans affecter la qualité du produit. Sont considérés comme défauts majeurs : un emballage descellé ou endommagé à la réception, une date de péremption dépassée, ou la réception d'un produit différent de celui commandé. Dans ce dernier cas, contactez-nous immédiatement pour un échange ou un remboursement.",
	},
	{
		title: "EXCEPTIONS / ARTICLES NON REMBOURSABLES",
		category: "Retours & Échanges",
		description:
			"Certains produits ne peuvent pas faire l'objet d'un retour, notamment les produits dont l'emballage a été ouvert (raisons d'hygiène et de sécurité sanitaire), les articles soldés ou les cartes cadeaux. Pour toute question concernant un produit spécifique, n'hésitez pas à nous contacter.",
	},
	{
		title: "COMMENT DÉMARRER UN RETOUR ?",
		category: "Retours & Échanges",
		description:
			"Rendez-vous dans « Mes commandes », sélectionnez l'article concerné et suivez les étapes du formulaire de retour. Une étiquette prépayée vous sera envoyée par e-mail sous 24h.",
	},
	{
		title: "COMMENT CHOISIR MON FORMAT / DOSAGE ?",
		category: "Produits & Dosages",
		description:
			"Chaque fiche produit indique la posologie recommandée et les informations nutritionnelles détaillées. En cas de doute sur le dosage adapté à votre situation, nous vous recommandons de consulter un professionnel de santé.",
	},
	{
		title: "LE PACKAGING EST-IL FIDÈLE AUX PHOTOS ?",
		category: "Produits & Dosages",
		description:
			"Nous ajustons nos photos pour rester au plus proche de la réalité, mais un léger écart peut subsister selon le réglage de votre écran ou une évolution mineure du packaging fournisseur. N'hésitez pas à nous écrire pour toute précision sur un produit.",
	},
	{
		title: "QUELS MOYENS DE PAIEMENT ACCEPTEZ-VOUS ?",
		category: "Paiements",
		description:
			"Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), PayPal ainsi que le paiement en plusieurs fois selon le montant de votre panier.",
	},
	{
		title: "MES DONNÉES BANCAIRES SONT-ELLES SÉCURISÉES ?",
		category: "Paiements",
		description:
			"Oui, tous les paiements sont traités par un prestataire certifié PCI-DSS. Nous ne stockons jamais vos coordonnées bancaires sur nos serveurs.",
	},
	{
		title: "COMMENT RÉINITIALISER MON MOT DE PASSE ?",
		category: "Compte",
		description:
			"Depuis la page de connexion, cliquez sur « Mot de passe oublié » et suivez les instructions envoyées par e-mail pour en choisir un nouveau.",
	},
	{
		title: "COMMENT SUPPRIMER MON COMPTE ?",
		category: "Compte",
		description:
			"Envoyez-nous une demande depuis la page Contact avec l'adresse e-mail associée à votre compte. La suppression est effective sous 48h conformément au RGPD.",
	},
];
