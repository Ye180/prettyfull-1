export interface FaqItem {
	title: string;
	description: string;
	category: string;
}

// ponytail: static hand-authored content, categories inferred from titles — not backend-driven
export const DataRule: FaqItem[] = [
	{
		title: "PRE-ORDER / GROUP BUY ITEMS",
		category: "Commandes",
		description:
			"All orders are made by-hand, to specification, and are considered pre-order purchases. There are absolutely no refunds, or cancellations once an order has been placed on any of our products. You can read more about our Terms and Conditions here.Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right",
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
		title: "IN-STOCK ITEMS",
		category: "Retours & Échanges",
		description:
			"Returns/exchanges/part replacement (at our discretion after examining the problem) are available within 30 days of purchase for major issues/failure only (no minor defect). Read below what are major defect.",
	},
	{
		title: "EXCHANGES",
		category: "Retours & Échanges",
		description:
			"The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.You are responsible for paying your own shipping costs for returning items to us.We do not guarantee that we will receive your returned item.It is recommended you use a shipping method with tracking and insurance.",
	},
	{
		title: "DAMAGES AND ISSUES",
		category: "Retours & Échanges",
		description:
			"Due to the nature of manufacturing processes and methods used, minor defects may be present in the end product.Minor defects include: Minor machining marksMinor oil marks on PCBs / Minor hook marks Major defects include: Large scratches, or dents on the exterior of the product / Broken components / Dead PCBsIncorrect item received",
	},
	{
		title: "EXCEPTIONS / NON-RETURNABLE ITEMS",
		category: "Retours & Échanges",
		description:
			"Certain types of items cannot be returned, like custom products (such as special orders or personalised items), sale items or gift cards. Please get in touch if you have questions or concerns about your specific item.",
	},
	{
		title: "COMMENT DÉMARRER UN RETOUR ?",
		category: "Retours & Échanges",
		description:
			"Rendez-vous dans « Mes commandes », sélectionnez l'article concerné et suivez les étapes du formulaire de retour. Une étiquette prépayée vous sera envoyée par e-mail sous 24h.",
	},
	{
		title: "COMMENT CHOISIR MA TAILLE ?",
		category: "Produits & Tailles",
		description:
			"Chaque fiche produit propose un guide des tailles détaillé avec les mesures en centimètres. En cas de doute entre deux tailles, nous recommandons généralement de prendre la taille au-dessus.",
	},
	{
		title: "LES COULEURS SONT-ELLES FIDÈLES AUX PHOTOS ?",
		category: "Produits & Tailles",
		description:
			"Nous ajustons nos photos pour rester au plus proche de la réalité, mais un léger écart peut subsister selon le réglage de votre écran. N'hésitez pas à nous écrire pour toute précision sur un coloris.",
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
