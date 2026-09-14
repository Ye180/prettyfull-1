# Guide du panel d'administration

Back-office PrettyFull - `http://localhost:3001` en développement.

## Se connecter

Utilisez le compte fourni par votre administrateur. Ce qui apparaît dans le menu
dépend de votre rôle : un gestionnaire catalogue ne voit ni « Agrégateurs » ni
« Utilisateurs & rôles », parce qu'il n'y a pas accès.

| Rôle                   | Ce qu'il peut faire                                            |
| ---------------------- | -------------------------------------------------------------- |
| Super administrateur   | Tout, y compris les clés de paiement et les comptes            |
| Gestionnaire catalogue | Produits, catégories, stocks, contenu                          |
| Gestionnaire commandes | Commandes, remboursements, fiches clientes                     |
| Support client         | Consultation seule du catalogue, des commandes et des clientes |

La session se renouvelle toute seule. Si vous êtes déconnecté malgré tout, c'est
que votre mot de passe a été changé - toutes les sessions sont alors révoquées.

---

## 1. Tableau de bord

La période se règle en haut à droite (7, 30 ou 90 jours). Les variations se
comparent à la période précédente de même durée.

**Seules les commandes payées comptent** dans le chiffre d'affaires. Les paniers
en attente de paiement n'y figurent pas : une bonne part n'aboutira jamais, et
les compter gonflerait artificiellement les chiffres.

« Commandes à traiter » regroupe tout ce qui n'est pas encore expédié. Les
alertes de stock renvoient directement vers le module Stocks, filtré.

---

## 2. Catalogue

### Créer un produit

Le choix le plus important est le **type de produit**, et il est définitif :

- **Produit simple** - les tailles sont portées par le produit, ou le produit n'a
  aucune déclinaison (un bijou, par exemple).
- **Produit à variantes** - chaque coloris a ses photos, ses tailles et son
  stock.

Ce choix ne se modifie pas après coup : le stock et son historique y sont
attachés. Pour changer de régime, dupliquez le produit et recréez sa structure.

> Le formulaire empêche de mélanger les deux modèles, et l'API le refuse de
> toute façon. Un produit ne peut pas avoir à la fois des coloris et des tailles
> au niveau produit.

**Prix** - saisissez le montant tel qu'il s'affichera en boutique (`58000` pour
58 000 FCFA). Le prix barré doit être **supérieur** au prix de base, sinon
l'enregistrement est refusé.

**Slug** - il se remplit tout seul depuis le nom tant que vous ne le modifiez
pas. Une fois le produit en ligne, évitez de le changer : il est dans l'URL et
dans les liens partagés.

**Images** - chemins publics du storefront (`/home/arrivals-1.jpg`) ou URL
complètes. La première image sert de vignette partout.

### Modifier un produit

Trois zones indépendantes :

- **Informations** - bouton _Enregistrer_ en haut de page.
- **Galerie** - son propre bouton _Enregistrer la galerie_.
- **Variantes / Tailles** - chaque ajout ou retrait est immédiat.

Retirer une variante ou une taille **déjà vendue** ne la supprime pas : elle est
désactivée, pour que l'historique des commandes reste lisible.

### Archiver, dupliquer

_Archiver_ retire le produit de la boutique sans rien détruire ; les commandes
passées ne bougent pas, et l'opération est réversible.

_Dupliquer_ recopie la structure et les images, en **brouillon** et avec un
**stock à zéro** - recopier des quantités qui n'existent pas physiquement
fausserait l'inventaire dès la création.

### Import / export CSV

L'export produit **une ligne par point de stock** : un produit à 2 coloris et
3 tailles occupe 6 lignes. C'est le format que l'import attend.

Passez toujours par _Simuler_ avant _Importer_ : la simulation n'écrit rien et
liste les erreurs ligne par ligne. À l'import réel, un produit existant voit ses
champs mis à jour, mais **sa structure et son stock ne sont pas écrasés** -
remplacer une déclinaison en masse détruirait son historique.

### Catégories

L'arborescence est libre en profondeur. Une catégorie « mise en avant » apparaît
sur la page d'accueil.

Archiver une catégorie est **refusé** si elle contient encore des produits ou des
sous-catégories : déplacez-les d'abord.

---

## 3. Stocks

Le stock est tenu au niveau le plus fin : coloris + taille, ou taille, ou
produit s'il n'a aucune déclinaison.

Trois colonnes à ne pas confondre :

| Colonne        | Signification                                         |
| -------------- | ----------------------------------------------------- |
| **En stock**   | Ce que vous avez physiquement, réservations comprises |
| **Réservé**    | Immobilisé par des paiements en cours                 |
| **Disponible** | Ce qui est réellement vendable                        |

Une quantité réservée se libère toute seule si le paiement est abandonné (au
bout de 20 minutes par défaut, réglable dans Paramètres).

### Ajuster un stock

Deux gestes, selon la situation :

- **Ajouter / retirer** - un écart connu : `+25` pour une réception, `-3` pour
  une casse.
- **Fixer la quantité** - ce que vous avez compté lors d'un inventaire.

**Le motif est obligatoire.** Il apparaît au journal avec votre nom et la date.
C'est ce qui rend l'historique exploitable six mois plus tard.

Un retrait supérieur au stock, ou qui empiéterait sur des réservations, est
refusé - le message indique le disponible réel.

### Historique des mouvements

Journal en **lecture seule** : rien dans l'interface ne permet de le modifier ni
de le purger. Chaque ligne porte le motif, l'auteur, la quantité et les niveaux
avant/après.

---

## 4. Commandes

La recherche accepte indifféremment un **numéro de commande**, un **e-mail** ou
un **numéro de suivi** - ce qu'on a sous la main au téléphone.

### Faire avancer une commande

Seules les transitions possibles sont proposées. Vous ne verrez jamais un bouton
qui reviendrait en erreur.

**Marquer payée** - pour un encaissement à la livraison. C'est ce geste qui
décrémente fermement le stock. Ne l'utilisez qu'une fois l'argent reçu.

**Annuler** - libère les réservations et remet en stock ce qui avait déjà été
décrémenté. Définitif.

**Rembourser** - deux modes :

- _Par articles_, le cas d'un retour : cochez les quantités, et laissez
  « Remettre en stock » si les articles reviennent.
- _Montant libre_, pour un geste commercial qui ne correspond à aucun article
  rendu.

Le motif est obligatoire et reste dans l'historique.

**Facture** - s'ouvre dans un nouvel onglet, prête à imprimer en PDF depuis le
navigateur (Ctrl/Cmd + P → « Enregistrer au format PDF »).

---

## 5. Clients

Liste et fiche : coordonnées, total dépensé (remboursements déduits) et
historique d'achats. Cliquer sur une commande ouvre son détail.

---

## 6. Agrégateurs

### Activer un moyen de paiement

1. Collez les clés fournies par le prestataire.
2. Choisissez l'environnement - **Test** tant que vous validez.
3. _Tester la connexion_ pour vérifier que les clés sont acceptées.
4. _Activer_.

L'activation est **bloquée** tant qu'une clé obligatoire manque : un agrégateur
incomplet produirait des paiements en échec au moment du clic.

Les clés sont chiffrées et **ne sont jamais réaffichées**. Une pastille verte
indique celles déjà enregistrées ; laissez le champ vide pour les conserver, ou
saisissez une nouvelle valeur pour les remplacer.

**URL de notification** - copiez-la dans le tableau de bord du prestataire.
Sans elle, les paiements ne seront jamais confirmés automatiquement.

Désactiver un agrégateur le retire immédiatement de la boutique. Aucune
intervention technique n'est nécessaire.

### Zones et tarifs de livraison

Une zone regroupe des pays partageant la même grille. Un pays absent de toute
zone **ne peut pas être livré** : la boutique ne proposera aucune option de
livraison à cette adresse, et la commande sera impossible.

Trois modes de tarif : montant fixe, tranche de poids, ou calcul délégué au
transporteur. Le franco de port se règle par tarif.

---

## 7. Contenu

**Bannières** - une bannière n'apparaît que si elle est **publiée** _et_ dans sa
fenêtre de diffusion. C'est ce qui permet de préparer une opération commerciale
à l'avance.

**Pages statiques** - CGV, à propos, livraison, retours. Contenu en Markdown :
`##` pour un titre, `-` pour une puce, `**gras**`.

---

## 8. Utilisateurs & rôles

Créez un compte back-office avec au moins un rôle. Le mot de passe doit faire
10 caractères minimum, avec majuscule, minuscule et chiffre.

Deux garde-fous : vous ne pouvez ni **désactiver votre propre compte**, ni
supprimer **le dernier super administrateur actif** - un back-office sans
administrateur joignable serait irrécupérable sans intervention en base.

Supprimer un compte révoque immédiatement ses sessions.

Les rôles et leurs permissions sont figés : c'est ce qui garantit le
cloisonnement des modules.

---

## 9. Paramètres généraux

**Devises** - la devise par défaut ne peut pas être retirée des devises
proposées. Idem pour la langue.

**Durée de réservation** - combien de temps le stock reste immobilisé pendant
un paiement. Trop court, une cliente lente perd son panier ; trop long, du stock
vendable reste bloqué. 20 minutes est un bon compromis.

**Mode maintenance** - la boutique n'accepte plus de commande.

**Taxes** - taux en pourcentage. Un seul taux peut être « par défaut ».

---

## En cas de problème

| Symptôme                                   | Cause probable                                                   |
| ------------------------------------------ | ---------------------------------------------------------------- |
| « Permission requise : … »                 | Votre rôle n'ouvre pas ce module - voyez un super administrateur |
| Une commande ne peut pas changer de statut | La transition n'est pas permise depuis l'état actuel             |
| Impossible d'activer un agrégateur         | Une clé obligatoire manque ; le message la nomme                 |
| Un ajustement de stock est refusé          | Le retrait dépasse le stock ou empiète sur des réservations      |
| Une catégorie refuse d'être archivée       | Elle contient encore des produits ou des sous-catégories         |
| Aucune option de livraison au checkout     | Le pays de la cliente n'appartient à aucune zone active          |
